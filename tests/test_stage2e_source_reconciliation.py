"""Stage 2E: preserve frozen SHUGE records while reconciling archived post-ID links."""
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
WORKS = "projects/shuge-exhibition-v1.0/data/works.json"


def read(path):
    return (REPO / path).read_text(encoding="utf-8")


class SourceReconciliationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.frozen = json.loads(read(FROZEN))
        cls.works = json.loads(read(WORKS))
        cls.crosswalk = json.loads(read(CROSSWALK + "/crosswalk.json"))
        cls.featured = {int(w["post_id"]): w for w in cls.works["featured"]}

    def test_archived_work_id_url_matches_all_three_snapshot_ids(self):
        frozen = {w["work_id"]: w for w in self.frozen["works"]}
        rows = self.crosswalk["rows"]
        self.assertEqual(self.frozen["total_works"], 3)
        self.assertEqual(len(rows), 3)
        self.assertEqual({r["work_id"] for r in rows}, set(frozen))
        for row in rows:
            with self.subTest(work_id=row["work_id"]):
                w = frozen[row["work_id"]]
                p = int(row["shuge_numeric_id"])
                original = self.featured[p]
                self.assertEqual(row["frozen_snapshot"]["title_zh"], w["title_zh"])
                self.assertEqual(row["frozen_snapshot"]["dynasty_label"], w["dynasty"])
                self.assertEqual(row["archived_post_record"]["status"], "VERIFIED")
                self.assertEqual(row["archived_post_record"]["post_id"], p)
                self.assertEqual(row["archived_post_record"]["title"], original["title"])
                self.assertEqual(row["archived_post_record"]["era"], original["dynasty_or_date"])
                self.assertEqual(row["archived_post_record"]["shuge_url"], original["shuge_url"])
                self.assertEqual(row["external_page_observation"]["status"], "VERIFIED")
                self.assertEqual(row["external_page_observation"]["url"], original["shuge_url"])
                self.assertEqual(row["institution_catalog_item"]["status"], "UNVERIFIED")
                self.assertEqual(row["direct_online_numeric_endpoint"]["status"], "NOT_FOUND")
                self.assertTrue(row["next_required_evidence"])

    def test_corrected_identity_and_conflicting_era_fields(self):
        rows = {r["work_id"]: r for r in self.crosswalk["rows"]}
        self.assertEqual(rows["work-shuge-168491"]["archived_post_record"]["title"], "园冶")
        self.assertEqual(rows["work-shuge-211203"]["archived_post_record"]["title"], "天工开物")
        self.assertEqual(rows["work-shuge-44159"]["archived_post_record"]["title"], "工程做法")
        self.assertEqual(self.featured[124575]["title"], "水经注")
        self.assertEqual(self.crosswalk["corrected_prior_inference"]["related_post_id"], 124575)
        self.assertTrue(rows["work-shuge-168491"]["snapshot_consistency"]["has_conflicting_era"])
        self.assertTrue(rows["work-shuge-211203"]["snapshot_consistency"]["has_conflicting_era"])
        self.assertFalse(rows["work-shuge-44159"]["snapshot_consistency"]["has_conflicting_era"])
        self.assertIn("0/3", self.crosswalk["conclusions"])

    def test_status_is_scoped_not_propagated_to_original_scan(self):
        self.assertIn("不等于", self.crosswalk["status_definitions"]["NOT_FOUND"])
        for row in self.crosswalk["rows"]:
            self.assertNotEqual(row["institution_catalog_item"]["status"], "VERIFIED")
            self.assertNotEqual(row["snapshot_consistency"]["status"], "VERIFIED")
            self.assertEqual(row["archived_post_record"]["work_id_text"], "p"+row["shuge_numeric_id"])

    def test_published_reader_matches_corrected_crosswalk(self):
        html = read(CROSSWALK + "/index.html")
        self.assertIn('name="site-index-kind" content="reference"', html)
        self.assertNotIn("TEMPLATE_", html)
        for row in self.crosswalk["rows"]:
            self.assertIn(row["work_id"], html)
            self.assertIn(row["archived_post_record"]["title"], html)
            self.assertIn(row["external_page_observation"]["url"], html)
        self.assertIn("P168491 = 《园冶》", html)
        self.assertIn("P124575 = 《水经注》", html)
        self.assertIn("NOT_FOUND", html)
        built, result = transform(html, CROSSWALK + "/index.html")
        self.assertEqual(result["status"], "themed")
        self.assertIn('data-site-theme="unified-v1"', built)
        self.assertIn('data-site-identity="conan-xin-v1"',
                      personalize_html(built, CROSSWALK + "/index.html"))

    def test_docs_preserve_legacy_limitations(self):
        d = read("docs/STAGE2E_SOURCE_RECONCILIATION.md")
        self.assertIn("P168491 并不是《水经注》", d)
        self.assertIn("works.json", d)
        self.assertIn("CLAIM_SUPPORT_AUDIT.md", d)
        self.assertIn("UNVERIFIED", d)
        self.assertIn("NOT_FOUND", d)


class CatalogPathBoundaryTests(unittest.TestCase):
    def test_explicit_type_never_promotes_drafts_or_internal_sources(self):
        forbidden = (
            "drafts/fieldwork/index.html", "future/article/index.html",
            "src/posts/copied.html", "connections/demo/index.html",
            "research-terminal/index.html", "projects/demo/source/index.html",
            "projects/demo/sources/index.html", "projects/demo/works/index.html",
            "projects/demo/reports/index.html", "projects/demo/drafts/index.html",
            "projects/demo/src/index.html",
            "projects/shuge-exhibition-v0.9/index.html")
        for path in forbidden:
            with self.subTest(path=path):
                self.assertFalse(is_catalog_safe_path(path))
        self.assertTrue(is_catalog_safe_path(CROSSWALK + "/index.html"))

    def test_typed_stage2e_reference_allowed_but_labeled_drafts_skipped(self):
        with tempfile.TemporaryDirectory() as d:
            root = Path(d)
            paths = (
                CROSSWALK + "/index.html",
                "drafts/temporary/index.html",
                "projects/shuge-exhibition-v0.8/index.html",
                "projects/demo/source/index.html")
            manifest = {"pages": []}
            for path in paths:
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
