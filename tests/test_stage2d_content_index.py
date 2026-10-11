"""Stage 2D: real SHUGE exhibit/reference plus deterministic public catalog."""
from pathlib import Path
import json
import sys
import tempfile
import unittest

REPO = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(REPO / "scripts"))
from build_site import Structure, transform
from content_index import collect_items, publish_index
from personalize_site import personalize_html

EXHIBIT = "projects/site-design-lab/shuge-evidence-exhibition/index.html"
REFERENCE = "projects/site-design-lab/shuge-source-register/index.html"
SHUGE = REPO / "projects/shuge-exhibition-v1.0"


def source(path):
    return (REPO / path).read_text(encoding="utf-8")


def element_id_tags(html):
    return {n.attrs["id"]: n.tag for n in Structure(html).nodes if n.attrs.get("id")}


class Stage2DResearchTests(unittest.TestCase):
    def test_real_exhibition_and_reference_use_templates(self):
        cases = (
            (EXHIBIT, "exhibition", ("intro", "objects", "evidence", "boundary",
                                     "further-research", "citation")),
            (REFERENCE, "reference", ("intro", "source", "format", "citation", "note")),
        )
        for path, kind, sections in cases:
            with self.subTest(path=path):
                html = source(path)
                self.assertNotIn("TEMPLATE_", html)
                self.assertIn('<meta name="site-index-kind" content="'+kind+'">', html)
                self.assertIn('class="template-'+kind+'"', html)
                ids = element_id_tags(html)
                for name in sections:
                    self.assertIn(name, ids)
                built, row = transform(html, path)
                self.assertEqual(row["status"], "themed")
                self.assertEqual(row["kind"], "content")
                self.assertIn('data-site-theme="unified-v1"', built)
                self.assertIn('class="site-header"', built)
                personalized = personalize_html(built, path)
                self.assertIn('data-site-identity="conan-xin-v1"', personalized)

    def test_reference_preserves_bibliography_placeholders_and_ids(self):
        original = json.loads((SHUGE / "data/bibliography.json").read_text(encoding="utf-8"))
        self.assertEqual(original["total_works"], 3)
        page = source(REFERENCE)
        for row in original["works"]:
            self.assertIn(row["work_id"], page)
            self.assertIn(row["title_zh"], page)
        self.assertIn("未记录", page)
        self.assertIn("SHUGE:p168491:68", page)
        self.assertIn("SHUGE:p44159:552", page)
        self.assertIn("不", page)
        audit = source("projects/shuge-exhibition-v1.0/CLAIM_SUPPORT_AUDIT.md")
        self.assertIn("只有 1 个", audit)
        self.assertIn("placeholder", audit)

    def test_exhibit_links_original_sources_without_mutating_them(self):
        page = source(EXHIBIT)
        for rel in ("CLAIM_SUPPORT_AUDIT.md", "PROVENANCE_AUDIT_v1.0.md",
                    "data/room_intros.json", "data/water_classic_pages.json"):
            self.assertTrue((SHUGE / rel).is_file(), rel)
            self.assertIn(rel, page)
        self.assertIn("/projects/shuge-exhibition-v1.0/rooms/room2/", page)
        self.assertIn("/projects/site-design-lab/shuge-source-register/", page)


class Stage2DCatalogTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.output = Path(self.temp.name)
        samples = (
            ("posts/new.html", "article", None),
            ("projects/demo/index.html", "project", None),
            (EXHIBIT, "exhibition", "exhibition"),
            (REFERENCE, "reference", "reference"),
            ("projects/shuge-exhibition-v0.4/index.html", "old", None),
            ("projects/shuge-exhibition-v1.0/source/index.html", "source", None),
            ("src/posts/hidden.html", "src", None),
        )
        self.manifest = {"pages": []}
        for path, name, marker in samples:
            file = self.output / path
            file.parent.mkdir(parents=True, exist_ok=True)
            meta = '<meta name="site-index-kind" content="'+marker+'">' if marker else ""
            file.write_text('<!DOCTYPE html><html lang="zh-CN"><head><title>'+name+
                            '</title><meta name="description" content="研究来源简介">'+meta+
                            '</head><body><main><h1>'+name+
                            '</h1></main></body></html>', encoding="utf-8")
            self.manifest["pages"].append({"path": path, "title": name, "status": "themed"})
        (self.output / "assets/site").mkdir(parents=True, exist_ok=True)

    def test_discovery_includes_real_public_types_only(self):
        rows = collect_items(self.output, self.manifest)
        self.assertEqual(len(rows), 4)
        self.assertEqual({x["kind"] for x in rows},
                         {"article", "project", "exhibition", "reference"})
        self.assertTrue(all("/source/" not in x["url"] for x in rows))
        self.assertTrue(all("v0.4" not in x["url"] for x in rows))

    def test_generated_html_and_json_have_matching_counts(self):
        info = publish_index(self.output, self.manifest)
        self.assertEqual(info["total"], 4)
        self.assertEqual(info["counts"], dict.fromkeys(
            ("article", "project", "exhibition", "reference"), 1))
        built = (self.output / "content-index/index.html").read_text(encoding="utf-8")
        data = json.loads((self.output / "assets/site/content-index.json").read_text(encoding="utf-8"))
        self.assertEqual(data["total"], 4)
        self.assertIn('data-site-theme="unified-v1"', built)
        self.assertIn('data-site-identity="conan-xin-v1"', built)
        self.assertIn('id="index-search"', built)
        self.assertIn('id="index-kind"', built)
        self.assertNotIn("TEMPLATE_", built)
        for entry in data["items"]:
            self.assertIn('href="'+entry["url"]+'"', built)

    def test_deterministic_republish(self):
        publish_index(self.output, self.manifest)
        first = (self.output / "assets/site/content-index.json").read_bytes()
        publish_index(self.output, self.manifest)
        second = (self.output / "assets/site/content-index.json").read_bytes()
        self.assertEqual(first, second)


if __name__ == "__main__":
    unittest.main()
