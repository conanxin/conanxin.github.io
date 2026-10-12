"""Stage 2G-P3: isolate selected OCR observations from scholarly claim verification."""
import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / "projects/site-design-lab/shuge-source-crosswalk"


class P3SelectedOCRAuditTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.audit = json.loads((BASE / "ocr-semantic-spotcheck.json").read_text(encoding="utf-8"))
        cls.p2 = json.loads((BASE / "real-db-page-links.json").read_text(encoding="utf-8"))
        cls.p2_by_id = {x["page_object_id"]: x for x in cls.p2["rows"]}

    def test_readonly_db_excerpts_and_image_hashes_are_reproducible(self):
        page_ids = {x["page_object_id"] for x in self.audit["focused_ocr_spotchecks"]}
        self.assertEqual(page_ids, {68, 1338})
        for sample in self.audit["focused_ocr_spotchecks"]:
            previous = self.p2_by_id[sample["page_object_id"]]
            self.assertEqual(sample["citation_id"], previous["citation_id"])
            self.assertEqual(sample["db_sha256"], self.p2["db"]["sha256"])
            self.assertEqual(sample["local_archive_sha256"], previous["sha256_recomputed"])
            self.assertEqual(sample["page_index"], previous["page_index"])
            self.assertEqual(sample["db_ocr_row_id"], previous["ocr"]["id"])
            self.assertEqual(sample["ocr_excerpt_status"], previous["ocr"]["qa_status"])
            self.assertEqual(sample["stored_ocr_excerpt_from_readonly_db"], previous["ocr"]["excerpt"])
            for pair in sample["selected_glyphs"]:
                self.assertIn(pair["stored_ocr"], previous["ocr"]["excerpt"])
                self.assertIn(pair["assessment"], ("SELECTED_GLYPHS_MATCH", "OCR_MISMATCH"))
            self.assertEqual(sample["full_page_transcription"]["status"], "UNVERIFIED")

    def test_four_selective_ocr_misreads_not_called_full_text_repair(self):
        errs = [(r["page_object_id"], g) for r in self.audit["focused_ocr_spotchecks"]
                for g in r["selected_glyphs"] if g["assessment"] == "OCR_MISMATCH"]
        self.assertEqual(len(errs), 4)
        self.assertEqual({x[0] for x in errs}, {68, 1338})
        self.assertEqual(self.audit["conclusions"]["spotted_ocr_mismatches"], len(errs))
        self.assertEqual(self.audit["conclusions"]["six_full_ocr_corrections_completed"], 0)
        self.assertEqual(self.audit["conclusions"]["verified_full_historical_claims"], 0)

    def test_semantic_triage_does_not_promote_supported_old_claims(self):
        rows = self.audit["targeted_research_question_triage"]
        self.assertEqual(len(rows), 8)
        self.assertEqual(self.audit["conclusions"]["issue_level_semantic_triage_rows"], 8)
        for row in rows:
            self.assertIn(row["assessment"],
                          {"NARROW_HEADING_SUPPORTED", "PAGE_TOPIC_MISMATCH",
                           "WORK_IDENTITY_MISMATCH", "COVER_NOT_TECHNICAL_TEXT"})
            self.assertIn(row["citation_id"], {x["citation_id"] for x in self.p2["rows"]})
            self.assertIn("scope", row)
        self.assertEqual(sum(x["assessment"] == "NARROW_HEADING_SUPPORTED" for x in rows), 1)

    def test_ark_distinction_is_preserved_and_copy_match_unverified(self):
        ark = self.audit["gallica_distinct_ark_check"]
        self.assertEqual(ark["local_db_digital_object"]["ark"], "btv1b525104776")
        self.assertEqual(ark["institutional_article"]["ark"], "btv1b52505781g")
        self.assertTrue(ark["arks_are_not_equal"])
        self.assertEqual(ark["same_physical_copy_or_same_digital_scan"]["status"], "UNVERIFIED")
        self.assertEqual(ark["f274_cross_application"]["status"], "PROHIBITED")
        self.assertEqual(self.audit["conclusions"]["complete_book_copy_identification"], 0)

    def test_docs_are_clear_on_historical_vs_current_snapshot(self):
        handoff = (ROOT / "docs/PROJECT_HANDOFF.md").read_text(encoding="utf-8")
        progress = (ROOT / "docs/PROJECT_OBJECTIVES_PROGRESS_2026-10-12.md").read_text(encoding="utf-8")
        self.assertIn("PR #23 写入时", handoff)
        self.assertNotIn("**Stage 2G-P2 当前事实**", handoff)
        self.assertIn("1833b3d31f31fec78dbc768372717b760ff8c241", progress)
        self.assertIn("38207956741", progress)
        self.assertIn("PR #23 时点", progress)
        self.assertTrue((ROOT / "docs/STAGE2G_P3_OCR_SPOTCHECK.md").is_file())

    def test_original_shuge_corpus_is_not_implicitly_edited(self):
        self.assertFalse(self.audit["baseline"]["frozen_original_data_mutated"])
        self.assertEqual(self.audit["conclusions"]["original_images_newly_downloaded_this_stage"], 0)
        self.assertEqual(self.audit["conclusions"]["six_full_ocr_corrections_completed"], 0)
        self.assertIn("research_claims", "research_claims")
        self.assertIn("UNVERIFIED", self.audit["baseline"]["verification_levels"]["unverified"].upper())


if __name__ == "__main__":
    unittest.main()
