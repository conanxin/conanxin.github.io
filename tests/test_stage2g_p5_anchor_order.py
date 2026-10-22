"""Stage 2G-P5A: raw OCR order is measurable; external-edition identity stays open."""
import copy
import json
import sys
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from stage2g_p5_anchor_order import evaluate

BASE = ROOT / "projects/site-design-lab/shuge-source-crosswalk"


def read(name):
    return json.loads((BASE / name).read_text(encoding="utf-8"))


class P5AAnchorOrderTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.p2 = read("real-db-page-links.json")
        cls.p5 = read("reading-order-p5a-audit.json")

    def test_three_real_ocr_anchors_reverse_parallel_text_order(self):
        report = evaluate(self.p2, self.p5)
        self.assertEqual(report["citation_id"], "SHUGE:p211203:1338")
        self.assertEqual(report["ocr_order"], ["juice", "steaming", "fish"])
        self.assertEqual(report["parallel_text_order"], ["fish", "steaming", "juice"])
        self.assertTrue(report["three_anchors_exactly_reversed"])
        self.assertEqual(report["source_qa_status"], "NOT_CHECKED")

    def test_missing_or_repeated_anchor_cannot_pass(self):
        altered = copy.deepcopy(self.p2)
        row = next(r for r in altered["rows"] if r["page_object_id"] == 1338)
        row["ocr"]["excerpt"] = row["ocr"]["excerpt"].replace("汁三升", "")
        with self.assertRaises(ValueError):
            evaluate(altered, self.p5)
        altered = copy.deepcopy(self.p2)
        row = next(r for r in altered["rows"] if r["page_object_id"] == 1338)
        row["ocr"]["excerpt"] += "汁三升"
        with self.assertRaises(ValueError):
            evaluate(altered, self.p5)

    def test_primary_fingerprint_and_edition_are_not_promoted(self):
        original = self.p5["evidence_sources"]["archived_original"]
        row = next(r for r in self.p2["rows"] if r["page_object_id"] == 1338)
        self.assertEqual(original["archived_jpeg_sha256"], row["sha256_recomputed"])
        self.assertEqual(original["ocr_row_id"], row["ocr"]["id"])
        parallel = self.p5["evidence_sources"]["parallel_transcription"]
        self.assertTrue(parallel["url"].endswith("oldid=460300"))
        self.assertEqual(parallel["same_edition_as_archived_page"], "UNVERIFIED")
        self.assertEqual(parallel["same_printed_copy"], "UNVERIFIED")
        gates = self.p5["gates"]
        self.assertEqual(gates["ark_btv1b525104776_vs_btv1b52505781g"], "UNVERIFIED")
        self.assertEqual(gates["ocr_full_page"], "UNVERIFIED")
        self.assertEqual(gates["claims_full_semantics"], "UNVERIFIED")
        self.assertEqual(gates["scholarly_claims_verified"], 0)
        self.assertFalse(gates["archived_primary_mutated"])
        self.assertEqual(self.p5["measured_anchor_orders"]["root_cause"],
                         "HYPOTHESIS_LEFT_TO_RIGHT_VERTICAL_COLUMN_EXTRACTION")

    def test_reproducible_readme_scope(self):
        doc = (ROOT / "docs/STAGE2G_P5A_OCR_READING_ORDER.md").read_text(encoding="utf-8")
        for term in ("世間魚肉", "初一蒸半生即止", "汁三升", "UNVERIFIED",
                     "btv1b525104776", "btv1b52505781g", "oldid=460300"):
            self.assertIn(term, doc)
        self.assertIn("scripts/stage2g_p5_anchor_order.py", doc)
        self.assertEqual(len(self.p5["anchors"]), 3)


if __name__ == "__main__":
    unittest.main()
