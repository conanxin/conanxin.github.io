"""Stage 2E: independent SHUGE candidate records must not become assumed ID matches."""
from pathlib import Path
import json
import sys
import tempfile
import unittest

REPO = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(REPO / "scripts"))

from build_site import transform
from content_index import collect_items, is_catalog_safe_path
from personalize_site import personalize_html

CROSSWALK = "projects/site-design-lab/shuge-source-crosswalk"
FROZEN = "projects/shuge-exhibition-v1.0/data/bibliography.json"


def read(path):
    return (REPO / path).read_text(encoding="utf-8")


class SourceReconciliationTests(unittest.TestCase):
    def setUp(self):
        self.frozen = json.loads(read(FROZEN))
        self.crosswalk = json.loads(read(CROSSWALK + "/crosswalk.json"))

    def test_matches_exact_three_frozen_keys_without_editing_originals(self):
        frozen = {w["work_id"]: w for w in self.frozen["works"]}
        records = self.crosswalk["rows"]
        self.assertEqual(self.frozen["total_works"], 3)
        self.assertEqual(len(records), 3)
        self.assertEqual({r["work_id"] for r in records}, set(frozen))
        for row in records:
            with self.subTest(work_id=row["work_id"]):
                src = frozen[row["work_id"]]
                self.assertEqual(row["frozen_snapshot"]["title_zh"], src["title_zh"])
                self.assertEqual(row["frozen_snapshot"]["dynasty_label"], src["dynasty"])
                self.assertEqual(row["frozen_snapshot"]["page_count_estimate"], src["page_count_estimate"])
                self.assertEqual(row["numeric_id_to_candidate"]["status"], "UNVERIFIED")
                self.assertEqual(row["external_candidate"]["status"], "VERIFIED")
                self.assertEqual(row["direct_id_lookup"]["status"], "NOT_FOUND")
                self.assertEqual(row["institution_catalog_item"]["status"], "UNVERIFIED")
                self.assertTrue(row["external_candidate"]["url"].startswith("https://www.shuge.org/view/"))
                self.assertTrue(row["next_required_evidence"])

    def test_conflict_and_scoped_negative_findings_remain_explicit(self):
        records = {r["work_id"]: r for r in self.crosswalk["rows"]}
        self.assertEqual(records["work-shuge-211203"]["frozen_snapshot"]["dynasty_label"], "Song")
        self.assertIn("明代", records["work-shuge-211203"]["external_candidate"]["description_era"] if "description_era" in records["work-shuge-211203"]["external_candidate"] else records["work-shuge-211203"]["external_candidate"]["era_as_stated"])
        self.assertIn("不", records["work-shuge-211203"]["numeric_id_to_candidate"]["caution"])
        self.assertIn("不能", self.crosswalk["status_definitions"]["NOT_FOUND"])
        self.assertIn("0/3", self.crosswalk["conclusions"])

    def test_public_reader_preserves_unverified_binding(self):
        html = read(CROSSWALK + "/index.html")
        self.assertIn('name="site-index-kind" content="reference"', html)
        self.assertNotIn("TEMPLATE_", html)
        for row in self.crosswalk["rows"]:
            self.assertIn(row["work_id"], html)
            self.assertIn(row["frozen_snapshot"]["title_zh"], html)
            self.assertIn(row["external_candidate"]["url"], html)
        self.assertIn("UNVERIFIED", html)
        self.assertIn("NOT_FOUND", html)
        built, result = transform(html, CROSSWALK + "/index.html")
        self.assertEqual(result["status"], "themed")
        self.assertIn('data-site-theme="unified-v1"', built)
        self.assertIn('data-site-identity="conan-xin-v1"',
                      personalize_html(built, CROSSWALK + "/index.html"))
        self.assertIn("crosswalk.json", html)

    def test_no_claims_of_verified_original_catalog(self):
        self.assertEqual(len(self.crosswalk["rows"]), 3)
        for row in self.crosswalk["rows"]:
            self.assertNotEqual(row["numeric_id_to_candidate"]["status"], "VERIFIED")
            self.assertNotEqual(row["institution_catalog_item"]["status"], "VERIFIED")
        doc = read("docs/STAGE2E_SOURCE_RECONCILIATION.md")
        self.assertIn("NOT_FOUND", doc)
        self.assertIn("CLAIM_SUPPORT_AUDIT.md", doc)


class CatalogPathBoundaryTests(unittest.TestCase):
    def test_never_promote_private_or_old_routes_even_if_explicitly_marked(self):
        forbidden = ("drafts/fieldwork/index.html", "future/article/index.html",
                     "src/posts/copied.html", "connections/demo/index.html",
                     "research-terminal/index.html", "projects/demo/source/index.html",
                     "projects/demo/sources/index.html", "projects/demo/works/index.html",
                     "projects/demo/reports/index.html",
                     "projects/demo/drafts/index.html",
                     "projects/demo/src/index.html",
                     "projects/shuge-exhibition-v0.9/index.html")
        for path in forbidden:
            with self.subTest(path=path):
                self.assertFalse(is_catalog_safe_path(path))
        self.assertTrue(is_catalog_safe_path(CROSSWALK + "/index.html"))

    def test_discovery_retains_typed_stage2e_reader_but_excludes_labeled_draft(self):
        with tempfile.TemporaryDirectory() as d:
            root = Path(d)
            files = (CROSSWALK + "/index.html",
                     "drafts/temporary/index.html",
                     "projects/shuge-exhibition-v0.8/index.html",
                     "projects/demo/source/index.html")
            manifest = {"pages": []}
            for path in files:
                file = root / path
                file.parent.mkdir(parents=True, exist_ok=True)
                file.write_text('<html><head><meta name="site-index-kind" content="reference">'
                                '<meta name="description" content="test"></head>'
                                '<body><main>test</main></body></html>', encoding="utf-8")
                manifest["pages"].append({"path": path, "status": "themed", "title": "test"})
            actual = collect_items(root, manifest)
            self.assertEqual([r["source_path"] for r in actual],
                             [CROSSWALK + "/index.html"])
            self.assertEqual(actual[0]["kind"], "reference")


if __name__ == "__main__":
    unittest.main()
