"""P6 tri-layer text research: Spanish Ruocco original → English Yarvin text → frozen Chinese reader."""
import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "projects" / "yarvin-moldbug-cn"
SPANISH = "https://www.421.news/es/curtis-yarvin-democracia-monarquia-neorreaccion-neocameralismo/"


class YarvinSpanishOriginalTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.html = (ROOT / "index.html").read_text(encoding="utf-8")
        cls.p6 = json.loads((ROOT / "content" / "three-layer-review.json").read_text(encoding="utf-8"))
        cls.p5 = json.loads((ROOT / "content" / "passage-alignments.json").read_text(encoding="utf-8"))
        cls.p4 = json.loads((ROOT / "content" / "source-ledger.json").read_text(encoding="utf-8"))
        cls.article = cls.html.split('<article class="article" id="article">', 1)[1].split("</article>", 1)[0]

    def test_real_publisher_language_and_status(self):
        original = self.p6["sources"]["ruocco_spanish"]
        self.assertEqual(original["url"], SPANISH)
        self.assertEqual(original["language"], "es-AR")
        self.assertEqual(original["published"], "2026-06-24")
        self.assertTrue(self.p6["audit"]["spanish_original_article_retrieved"])
        self.assertFalse(self.p6["audit"]["english_421_version_retrieved"])
        self.assertIn("/en/", self.p6["sources"]["old_english_421_reference"]["url"])
        source = next(x for x in self.p4["sources"] if x["id"] == "S01")
        self.assertEqual(source["url"], SPANISH)
        self.assertEqual(source["access"], "SOURCE_LOCATED")
        self.assertTrue(self.p5["audit"]["editorial_421_article_retrieved"])
        self.assertFalse(self.p5["editorial_reference"]["full_english_421_article_available"])

    def test_nine_headings_map_frozen_html(self):
        actual = re.findall(r'<h2 id="([^"]+)" class="article-h2">([^<]+)</h2>', self.article)
        mapping = self.p6["heading_map"]
        self.assertEqual(len(actual), 9)
        self.assertEqual([x["zh_anchor"] for x in mapping], [x[0] for x in actual])
        self.assertEqual([x["zh_current_heading"] for x in mapping], [x[1] for x in actual])
        self.assertEqual(mapping[0]["spanish_heading"], "Moldbug como contraseña del foro")
        self.assertEqual(mapping[0]["semantic_state"], "DIVERGENT_TRANSLATION")
        self.assertEqual(mapping[0]["proposed_heading"], "Moldbug：论坛里的接头暗号")

    def test_missing_editorial_preface_is_audited_not_fabricated(self):
        gap = self.p6["opening_gap"]
        self.assertEqual(gap["state"], "PREFACE_MISSING_IN_CHINESE_ARTICLE")
        self.assertEqual(gap["human_approval"], "PENDING")
        self.assertTrue(self.p6["audit"]["spanish_preface_present"])
        self.assertFalse(self.p6["audit"]["chinese_preface_present_in_article"])
        self.assertTrue(self.article.lstrip().startswith('<div class="article-meta">'))
        self.assertNotIn("Llevo unos cinco años postergando este artículo", self.article)

    def test_three_existing_p5_quotes_match_exactly(self):
        old = {p["id"]: p for p in self.p5["pairs"]}
        checks = self.p6["triplets"]
        self.assertEqual([p["id"] for p in checks], ["YP6-001", "YP6-002", "YP6-003"])
        self.assertEqual([p["chapter_no"] for p in checks], [5, 7, 9])
        for review in checks:
            prior = old[review["p5_id"]]
            self.assertEqual(review["english_yarvin_excerpt"], prior["english_excerpt"])
            self.assertEqual(review["zh_existing_focus"], prior["zh_focus"])
            self.assertEqual(review["english_yarvin_source_url"], prior["source_url"])
            self.assertEqual(review["human_approval"], "PENDING")
            self.assertFalse(review["full_translation_verified"])
            self.assertFalse(review["political_historical_claim_verified"])

    def test_contested_provenance_explicit(self):
        x = self.p6["triplets"]
        self.assertEqual(x[0]["issue_status"], "EXPLAINED_BY_SPANISH_INTERMEDIARY")
        self.assertEqual(x[1]["issue_status"], "OPEN_CHINESE_SPECIFICITY_LOSS")
        self.assertEqual(x[2]["issue_status"], "ALLUSION_PATH_CLARIFIED_NOTE_RECOMMENDED")
        self.assertEqual(x[2]["spanish_anchor"], "Harina de otro costal")
        self.assertIn("Other grain", x[2]["assessment"])
        audit = self.p6["audit"]
        self.assertEqual(audit["three_layer_clause_cases"], 3)
        self.assertEqual(audit["human_approved_cases"], 0)
        self.assertEqual(audit["full_zh_translation_paragraphs_verified"], 0)
        self.assertEqual(audit["independent_historical_political_facts_verified"], 0)

    def test_no_js_static_ux_and_provenance_links(self):
        self.assertIn('id="tri-layer-section"', self.html)
        self.assertIn('href="content/three-layer-review.json"', self.html)
        self.assertIn('href="styles.css?v=20261013-p6"', self.html)
        self.assertEqual(self.html.count('class="tri-layer__case"'), 3)
        self.assertIn('id="triLayerHeadings"', self.html)
        self.assertEqual(self.html.count('data-human-approval="PENDING"'), 3)
        self.assertIn(SPANISH, self.html)
        for i in (5, 7, 9):
            self.assertIn('id="p6-case-' + str(i) + '"', self.html)
        self.assertNotIn("YP6-001", self.article)
        self.assertNotIn("YP6-GAP-INTRO", self.article)


if __name__ == "__main__":
    unittest.main()
