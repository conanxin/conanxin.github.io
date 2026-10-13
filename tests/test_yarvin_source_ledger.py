"""Research provenance invariants for the static Yarvin chapter/source ledger."""
import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "projects" / "yarvin-moldbug-cn"


class YarvinSourceLedgerTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.html = (ROOT / "index.html").read_text(encoding="utf-8")
        cls.js = (ROOT / "app.js").read_text(encoding="utf-8")
        cls.filter_js = (ROOT / "source-ledger.js").read_text(encoding="utf-8")
        cls.ledger = json.loads((ROOT / "content" / "source-ledger.json").read_text(encoding="utf-8"))

    def test_schema_and_source_count(self):
        self.assertEqual(self.ledger["schema_version"], "1.0")
        self.assertEqual(self.ledger["project"], "yarvin-moldbug-cn")
        self.assertEqual(len(self.ledger["chapters"]), 9)
        self.assertEqual(len(self.ledger["sources"]), 10)
        self.assertEqual(self.ledger["audit"]["chapter_total"], 9)
        self.assertEqual(self.ledger["audit"]["source_total"], 10)
        self.assertEqual(self.ledger["audit"]["located_source_pages"], 9)

    def test_statuses_restrict_claims(self):
        states = [c["alignment_state"] for c in self.ledger["chapters"]]
        self.assertEqual(states.count("PASSAGE_LOCATED"), 3)
        self.assertEqual(states.count("TOPIC_ONLY"), 4)
        self.assertEqual(states.count("ORIGINAL_ONLY"), 2)
        self.assertFalse(self.ledger["audit"]["original_editorial_fulltext_retrieved"])
        self.assertEqual(self.ledger["audit"]["translation_paragraphs_verified"], 0)
        self.assertEqual(self.ledger["audit"]["historical_political_claims_independently_verified"], 0)
        self.assertTrue(all(c["claim_semantics"] == "NOT_EVALUATED" for c in self.ledger["chapters"]))
        editorial = next(s for s in self.ledger["sources"] if s["id"] == "S01")
        self.assertEqual(editorial["access"], "URL_ONLY")
        self.assertNotIn("CLAIM_VERIFIED", str(self.ledger))

    def test_chapter_and_source_references_resolve(self):
        ids = {source["id"]: source for source in self.ledger["sources"]}
        self.assertEqual(len(ids), len(self.ledger["sources"]))
        article_html = self.html.split('<article class="article" id="article">', 1)[1].split("</article>", 1)[0]
        article_chapters = re.findall(r'<h2 id="([^"]+)" class="article-h2">', article_html)
        self.assertEqual(article_chapters, [c["chapter_anchor"] for c in self.ledger["chapters"]])
        for c in self.ledger["chapters"]:
            self.assertIn('href="#' + c["chapter_anchor"] + '"', self.html)
            if c["alignment_state"] == "PASSAGE_LOCATED":
                self.assertTrue(c["english_locator"])
            for rel in c["relations"]:
                self.assertIn(rel["source_id"], ids)
                self.assertEqual(ids[rel["source_id"]]["access"], "SOURCE_LOCATED")
                self.assertIn('data-source-id="' + rel["source_id"] + '"', self.html)

    def test_no_js_readability_and_html_states(self):
        self.assertIn('id="source-ledger-section"', self.html)
        self.assertIn('id="sourceLedgerJson"', self.html)
        self.assertIn('href="content/source-ledger.json"', self.html)
        cards = re.findall(r'<article class="source-ledger__card" id="source-ledger-ch(\d+)" data-chapter="\d+" data-state="([^"]+)">', self.html)
        self.assertEqual(len(cards), 9)
        self.assertEqual([int(x[0]) for x in cards], list(range(1, 10)))
        self.assertEqual([state for _, state in cards], [c["alignment_state"] for c in self.ledger["chapters"]])
        self.assertIn('source-ledger.js?v=20261013-p4', self.html)
        self.assertIn('function applyFilters()', self.filter_js)

    def test_repaired_primary_source_urls(self):
        updates = [
            ("2008/09/patchwork-a-positive-vision/", "2008/11/patchwork-positive-vision-part-1/"),
            ("2009/01/a-gentle-introduction-to-unqualified/", "2009/01/gentle-introduction-to-unqualified/"),
            ("2008/04/open-letter-to-open-minded-prog/", "2008/04/open-letter-to-open-minded-progressives/"),
        ]
        for old, new in updates:
            self.assertNotIn(old, self.html)
            self.assertNotIn(old, self.js)
            self.assertIn(new, self.html)
            self.assertIn(new, self.js)


if __name__ == "__main__":
    unittest.main()
