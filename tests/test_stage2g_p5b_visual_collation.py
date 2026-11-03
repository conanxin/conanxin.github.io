"""Stage 2G-P5B regression tests: full OCR, scan collation, and edition scope."""
import copy
import sys
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from stage2g_p5b_validate import read, validate


class P5BVisualCollationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.full = read("full-ocr-p5b-audit.json")
        cls.visual = read("visual-collation-p5b-audit.json")
        cls.p2 = read("real-db-page-links.json")

    def test_six_full_ocr_rows_and_three_p2_excerpt_truncations(self):
        report = validate(self.full, self.visual, self.p2)
        self.assertEqual(report["full_ocr_rows"], 6)
        self.assertEqual(report["p2_excerpt_truncated_pages"], [1178, 1320, 1338])
        self.assertEqual(report["image_hashes_reconfirmed"], 6)

    def test_page_1338_original_image_order_is_reverse_of_ocr_string(self):
        report = validate(self.full, self.visual, self.p2)
        self.assertEqual(report["page_1338_anchor_order"], ["juice", "steaming", "fish"])

    def test_selected_visual_collations_are_all_linked_to_full_ocr(self):
        report = validate(self.full, self.visual, self.p2)
        self.assertEqual(report["selected_visual_collations"], 14)
        self.assertEqual(report["full_page_reviews"], 0)

    def test_bnf_edition_fingerprint_does_not_claim_same_copy_or_scan(self):
        report = validate(self.full, self.visual, self.p2)
        self.assertEqual(report["edition_alignment"], "PROVISIONALLY_CONSISTENT_WITH_CHINOIS_5563")
        self.assertEqual(report["physical_copy_identity"], "UNVERIFIED")
        self.assertEqual(report["scholarly_claims_verified"], 0)

    def test_corrupted_full_ocr_fingerprint_is_rejected(self):
        full = copy.deepcopy(self.full)
        full["rows"][0]["normalized_text"] += "篡"
        with self.assertRaises(AssertionError):
            validate(full, self.visual, self.p2)

    def test_missing_visual_ocr_phrase_is_rejected(self):
        visual = copy.deepcopy(self.visual)
        visual["page_1320"]["selected_glyph_collation"][0]["ocr_reading"] = "not-in-source"
        with self.assertRaises(AssertionError):
            validate(self.full, visual, self.p2)

    def test_handoff_and_report_keep_scope_explicit(self):
        doc = (ROOT / "docs/STAGE2G_P5B_VISUAL_COLLATION.md").read_text(encoding="utf-8")
        for term in ("1600 × 2570", "14", "NOT_CHECKED", "Chinois 5563",
                     "Chinois 5564", "UNVERIFIED", "full-ocr-p5b-audit.json",
                     "visual-collation-p5b-audit.json", "PR #37"):
            self.assertIn(term, doc)


if __name__ == "__main__":
    unittest.main()
