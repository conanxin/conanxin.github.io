"""P7 draft invariants: recovered Spanish preface translated as proposals, not publication."""
import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "projects" / "yarvin-moldbug-cn"


class YarvinP7EditorialDraftTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.site = (ROOT / "index.html").read_text(encoding="utf-8")
        cls.draft = json.loads((ROOT / "content" / "preface-draft-p7.json").read_text(encoding="utf-8"))
        cls.p6 = json.loads((ROOT / "content" / "three-layer-review.json").read_text(encoding="utf-8"))
        cls.article = cls.site.split('<article class="article" id="article">', 1)[1].split("</article>", 1)[0]

    def test_real_original_and_four_narrative_paragraphs(self):
        self.assertEqual(self.draft["stage"], "P7_PREFACE_AND_EDITORIAL_PROPOSALS")
        self.assertEqual(self.draft["source"]["language"], "es-AR")
        self.assertIn("/es/curtis-yarvin-", self.draft["source"]["url"])
        audit = self.draft["audit"]
        self.assertEqual(audit["source_intro_narrative_paragraphs"], 4)
        self.assertEqual(audit["source_repeated_pullquotes"], 1)
        self.assertEqual(audit["chinese_preface_draft_paragraphs"], 4)
        paragraphs = self.draft["preface_paragraphs"]
        self.assertEqual([p["position"] for p in paragraphs], [1, 2, 3, 4])
        self.assertEqual([p["paragraph_id"] for p in paragraphs],
                         ["YP7-INTRO-01", "YP7-INTRO-02", "YP7-INTRO-03", "YP7-INTRO-04"])
        self.assertTrue(all(p["source_spanish_opening"] and p["source_spanish_closing"] for p in paragraphs))
        self.assertTrue(all(len(p["translation_zh"]) >= 48 for p in paragraphs))
        self.assertIn("五年", paragraphs[0]["translation_zh"])
        self.assertIn("4chan", paragraphs[1]["translation_zh"])
        self.assertIn("2019", paragraphs[1]["translation_zh"])
        self.assertIn("2023", paragraphs[1]["translation_zh"])
        self.assertIn("博物馆", paragraphs[3]["translation_zh"])

    def test_pullquote_is_repeat_not_fifth_paragraph(self):
        q = self.draft["source_pullquote"]
        self.assertEqual(q["repeats_from_paragraph_id"], "YP7-INTRO-02")
        self.assertFalse(q["independent_narrative_paragraph"])
        self.assertEqual(q["status"], "PENDING_EDITORIAL_APPROVAL")
        self.assertTrue(self.draft["preface_paragraphs"][1]["translation_zh"].startswith(q["translation_zh_draft"]))

    def test_approval_and_publication_fences(self):
        a = self.draft["audit"]
        self.assertEqual(a["draft_paragraphs_human_approved"], 0)
        self.assertEqual(a["editorial_decisions_total"], 4)
        self.assertEqual(a["editorial_decisions_approved"], 0)
        self.assertEqual(a["frozen_article_edits_applied"], 0)
        self.assertFalse(a["whole_article_translation_reviewed"])
        self.assertEqual(a["political_historical_claims_verified"], 0)
        self.assertTrue(all(p["editorial_approval"] == "PENDING" and
                            not p["published_into_frozen_article"]
                            for p in self.draft["preface_paragraphs"]))
        self.assertTrue(all(d["status"] == "PENDING_EDITORIAL_APPROVAL" and
                            not d["applied_to_article"] and d["approved_at"] is None
                            for d in self.draft["editorial_decisions"]))
        self.assertTrue(self.p6["audit"]["spanish_preface_present"])
        self.assertFalse(self.p6["audit"]["chinese_preface_present_in_article"])
        self.assertEqual(self.p6["audit"]["p7_preface_draft_paragraphs"], 4)
        self.assertEqual(self.p6["audit"]["p7_editorial_decisions_approved"], 0)

    def test_editorial_proposals_are_exactly_four_independent_choices(self):
        decisions = self.draft["editorial_decisions"]
        self.assertEqual([p["id"] for p in decisions],
                         ["YP7-DECISION-01", "YP7-DECISION-02", "YP7-DECISION-03", "YP7-DECISION-04"])
        self.assertEqual([p["type"] for p in decisions],
                         ["INSERT_PREFACE", "REPLACE_HEADING", "REFINE_QUOTE", "ADD_EDITOR_NOTE"])
        self.assertIn('孟德斯鸠', decisions[1]["current"])
        self.assertIn('论坛里的接头暗号', decisions[1]["proposed"])
        self.assertIn('股份公司', decisions[2]["proposed"])
        self.assertIn('“Other grain.”', decisions[3]["proposed"])

    def test_original_translated_article_is_not_modified(self):
        self.assertEqual(len(re.findall(r'<h2 id="([^"]+)" class="article-h2">', self.article)), 9)
        self.assertIn('id="mencius-moldbug"', self.article)
        self.assertIn('孟德斯鸠的"虫"', self.article)
        self.assertIn('每一个小国都由自己的那家公司治理', self.article)
        self.assertIn('那是另一回事了。', self.article)
        self.assertNotIn(self.draft["preface_paragraphs"][0]["translation_zh"], self.article)
        self.assertNotIn('data-p7-paragraph-id', self.article)
        self.assertNotIn('YP7-DECISION-02', self.article)

    def test_no_js_review_workspace_and_readable_sidecar(self):
        self.assertIn('id="preface-draft-section"', self.site)
        self.assertIn('href="content/preface-draft-p7.json"', self.site)
        self.assertIn('href="styles.css?v=20261022-p12"', self.site)
        self.assertEqual(self.site.count('class="preface-editorial__paragraph"'), 4)
        self.assertEqual(self.site.count('class="preface-editorial__decision"'), 4)
        self.assertIn('重复摘录第二段', self.site)
        for p in self.draft["preface_paragraphs"]:
            self.assertIn('data-p7-paragraph-id="' + p["paragraph_id"] + '"', self.site)
            self.assertIn('data-approval="PENDING"', self.site)


if __name__ == "__main__":
    unittest.main()
