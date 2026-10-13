"""P5 original-passage / published-Chinese-quote alignment audit invariants.

The original nine-chapter translation and historical/political claims are NOT
automatically upgraded by this sidecar or by its browser checks.
"""
import html
import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "projects" / "yarvin-moldbug-cn"


class YarvinPassageAlignmentsTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.site = (ROOT / "index.html").read_text(encoding="utf-8")
        cls.p5 = json.loads((ROOT / "content" / "passage-alignments.json").read_text(encoding="utf-8"))
        cls.p4 = json.loads((ROOT / "content" / "source-ledger.json").read_text(encoding="utf-8"))
        cls.article = cls.site.split('<article class="article" id="article">', 1)[1].split("</article>", 1)[0]

    def test_three_ai_preliminary_pairs_only(self):
        pairs = self.p5["pairs"]
        self.assertEqual(len(pairs), 3)
        self.assertEqual([p["id"] for p in pairs], ["YP5-001", "YP5-002", "YP5-003"])
        self.assertEqual([p["chapter"] for p in pairs], [5, 7, 9])
        self.assertEqual([p["source_id"] for p in pairs], ["S03", "S08", "S06"])
        audit = self.p5["audit"]
        self.assertEqual(audit["ai_preliminary_clause_comparisons"], 3)
        self.assertEqual(audit["source_pages_opened"], 3)
        self.assertEqual(audit["human_approved_pairs"], 0)
        self.assertEqual(audit["full_translation_paragraphs_verified"], 0)
        self.assertEqual(audit["political_historical_claims_verified"], 0)
        self.assertTrue(audit["editorial_421_article_retrieved"])
        self.assertFalse(audit["english_421_translation_retrieved"])
        self.assertTrue(self.p5["editorial_reference"]["full_spanish_421_article_available"])

    def test_provenance_matches_p4_sources(self):
        sources = {s["id"]: s for s in self.p4["sources"]}
        for pair in self.p5["pairs"]:
            self.assertEqual(pair["source_url"], sources[pair["source_id"]]["url"])
            self.assertEqual(sources[pair["source_id"]]["kind"], "primary_text")
            self.assertEqual(pair["primary_year"], sources[pair["source_id"]]["year"])
            self.assertLessEqual(len(pair["english_excerpt"].split()), 25)
            self.assertEqual(pair["source_access"], "SOURCE_TEXT_OPENED")
            self.assertTrue(pair["english_paragraph_locator"])
        self.assertEqual(self.p4["p5_passage_review_sidecar"], "passage-alignments.json")

    def test_chinese_quote_is_exactly_from_frozen_article(self):
        chapter_headers = list(re.finditer(r'<h2 id="([^"]+)" class="article-h2">', self.article))
        for pair in self.p5["pairs"]:
            idx = next(i for i, match in enumerate(chapter_headers)
                       if match.group(1) == pair["chapter_anchor"])
            next_start = chapter_headers[idx + 1].start() if idx + 1 < len(chapter_headers) else len(self.article)
            section = self.article[chapter_headers[idx].start():next_start]
            quotes = [html.unescape(re.sub(r"<[^>]+>", "", raw))
                      for raw in re.findall(r'<blockquote class="article-quote">([\s\S]*?)</blockquote>', section)]
            self.assertGreater(len(quotes), pair["zh_quote_index"])
            self.assertEqual(quotes[pair["zh_quote_index"]], pair["zh_quote_full"])
            self.assertIn(pair["zh_focus"], pair["zh_quote_full"])

    def test_no_false_claim_of_finished_translation(self):
        self.assertEqual(self.p4["audit"]["translation_paragraphs_verified"], 0)
        self.assertEqual(self.p4["audit"]["historical_political_claims_independently_verified"], 0)
        self.assertEqual(self.p4["audit"]["p5_human_approved_pairs"], 0)
        self.assertEqual(self.p4["audit"]["p5_ai_preliminary_clause_pairs"], 3)
        for pair in self.p5["pairs"]:
            self.assertEqual(pair["comparison_status"], "AI_PRELIMINARY_REVIEW")
            self.assertEqual(pair["human_approval"], "PENDING")
            self.assertEqual(pair["comparison_scope"], "SELECTED_SOURCE_CLAUSE_ONLY")
            self.assertFalse(pair["verified_translation"])
            self.assertFalse(pair["historical_claim_verified"])
        self.assertEqual(self.p5["editorial_reference"]["full_english_421_article_available"], False)
        self.assertEqual({p["issue"] for p in self.p5["pairs"]},
                         {"COMPROMISES_TRANSLATION", "JOINT_STOCK_CORPORATION", "OTHER_GRAIN"})

    def test_no_js_html_has_review_cards_and_readable_links(self):
        self.assertIn('id="passage-review-section"', self.site)
        self.assertIn('href="content/passage-alignments.json"', self.site)
        ids = re.findall(r'class="passage-review__card" id="passage-review-ch(\d+)"', self.site)
        self.assertEqual(ids, ["5", "7", "9"])
        for pair in self.p5["pairs"]:
            self.assertIn('data-pair-id="' + pair["id"] + '"', self.site)
            self.assertIn('href="#' + pair["chapter_anchor"] + '"', self.site)
            self.assertIn('href="#passage-review-ch' + str(pair["chapter"]) + '"', self.site)
            self.assertIn(pair["source_url"], self.site)
            self.assertIn(html.escape(pair["english_excerpt"], quote=True).replace("&#x27;", "&#39;"), self.site)
        self.assertIn('href="styles.css?v=20261013-p7"', self.site)

    def test_zh_quote_remains_within_original_article_only(self):
        self.assertEqual(len(re.findall(r'<h2 id="([^"]+)" class="article-h2">', self.article)), 9)
        self.assertNotIn("YP5-001", self.article)
        self.assertNotIn("YP5-003", self.article)
        self.assertEqual(len(self.p4["chapters"]), 9)


if __name__ == "__main__":
    unittest.main()
