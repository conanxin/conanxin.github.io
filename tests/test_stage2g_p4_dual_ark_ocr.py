"""Stage 2G-P4: verify two real OCR texts and keep two Gallica ARKs unmerged."""
import hashlib
import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / "projects/site-design-lab/shuge-source-crosswalk"


def read(name):
    return json.loads((BASE / name).read_text(encoding="utf-8"))


class P4ARKAndOCRAuditTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.audit = read("ark-ocr-p4-audit.json")
        cls.p2 = read("real-db-page-links.json")
        cls.byid = {p["page_object_id"]: p for p in cls.p2["rows"]}
        cls.p3 = read("ocr-semantic-spotcheck.json")

    def test_distinct_arks_and_no_unverified_cross_copy_promotion(self):
        d = self.audit["ark_reconciliation"]
        self.assertEqual(d["bn_f_heritage_page"]["ark"], "btv1b52505781g")
        self.assertEqual(d["shuge_local_database"]["ark"], "btv1b525104776")
        self.assertEqual(d["shuge_local_database"]["record_id"], 17)
        self.assertEqual(d["shuge_local_database"]["manifest_page_count_as_recorded"], 422)
        self.assertEqual(d["evidence_gate"]["same_physical_copy"], "UNVERIFIED")
        self.assertEqual(d["evidence_gate"]["same_digitization"], "UNVERIFIED")
        self.assertEqual(d["evidence_gate"]["canvas_index_equivalence"], "UNVERIFIED")
        self.assertTrue(d["evidence_gate"]["cannot_transfer_f274_across_arks"])

    def test_scoped_local_db_counts_are_nontransferable(self):
        scope = self.audit["ark_reconciliation"]["local_sqlite_ark_counts"]
        self.assertEqual(scope["status"], "VERIFIED_FROM_READ_ONLY_SQLITE")
        self.assertEqual(set(scope["tables"]), {
            "digital_objects", "sources", "source_normalizations", "acquisitions"})
        first, second = scope["rows"]
        self.assertEqual(first["counts"], {
            "digital_objects": 1, "sources": 1, "source_normalizations": 1,
            "acquisitions": 419})
        self.assertEqual(second["counts"], dict.fromkeys(scope["tables"], 0))
        self.assertIn("not proof", self.audit["status_definitions"]["NOT_FOUND"])

    def test_six_scoped_403_responses_are_not_manifests(self):
        request = self.audit["ark_reconciliation"]["public_api_attempts"]
        self.assertEqual(request["status"], "HTTP_403_ACCESS_BLOCKED")
        self.assertEqual(request["attempt_count"], 6)
        self.assertEqual(request["http_403_count"], 6)
        self.assertEqual(request["manifest_json_bytes_obtained"], 0)
        self.assertEqual(len(request["urls_tested"]), 3)
        self.assertEqual(len(request["ark_ids"]), 2)

    def test_full_raw_ocr_fingerprint_matches_actual_p2_prefix(self):
        self.assertEqual({p["page_object_id"] for p in self.audit["ocr_selected_pages"]},
                         {1178, 1320})
        for p in self.audit["ocr_selected_pages"]:
            with self.subTest(page=p["page_object_id"]):
                raw = p["original_normalized_text"]
                previous = self.byid[p["page_object_id"]]
                digest = hashlib.sha256(raw["value"].encode("utf-8")).hexdigest()
                self.assertEqual(digest, raw["sha256_recomputed"])
                self.assertTrue(raw["value"].startswith(previous["ocr"]["excerpt"]))
                self.assertEqual(previous["ocr"]["id"], p["live_sqlite_ocr_row_id"])
                self.assertEqual(previous["ocr"]["qa_status"], p["qa_status_at_query"])
                self.assertEqual(previous["sha256_recomputed"],
                                 p["local_archived_jpeg_sha256"])
                self.assertEqual(p["selected_visual_glyphs"]["status"],
                                 "AI_ASSISTED_SELECTED_IMAGE_OBSERVATION")
                self.assertEqual(p["selected_visual_glyphs"]["character_level_full_review"],
                                 "UNVERIFIED")

    def test_six_mismatched_selected_phrases_from_two_original_ocr_rows(self):
        pairs = [v for p in self.audit["ocr_selected_pages"]
                 for v in p["selected_visual_glyphs"]["pairs"]]
        self.assertEqual(len(pairs), 8)
        self.assertEqual(sum(p["assessment"]=="SELECTED_GLYPH_MISMATCH" for p in pairs), 6)
        for p in self.audit["ocr_selected_pages"]:
            text = p["original_normalized_text"]["value"]
            for pair in p["selected_visual_glyphs"]["pairs"]:
                self.assertIn(pair["stored_ocr"], text)
                self.assertIn(pair["assessment"], (
                    "SELECTED_GLYPH_MISMATCH", "SELECTED_GLYPHS_MATCH"))
                self.assertTrue(pair["location_hint"])
        stats = self.audit["summary"]
        self.assertEqual(stats["selected_pages_new"], 2)
        self.assertEqual(stats["selected_ocr_phrase_pairs"], 8)
        self.assertEqual(stats["selected_ocr_phrase_mismatches"], 6)
        self.assertEqual(stats["fully_collated_ocr_pages"], 0)
        self.assertEqual(stats["scholarly_claims_verified"], 0)
        self.assertEqual(self.p3["conclusions"]["six_full_ocr_corrections_completed"], 0)

    def test_document_records_real_evidence_and_open_gates(self):
        doc = (ROOT / "docs/STAGE2G_P4_DUAL_ARK_OCR_AUDIT.md").read_text(encoding="utf-8")
        for term in ("btv1b52505781g", "btv1b525104776", "419", "HTTP 403",
                     "鎮江", "丹青第十六卷", "UNVERIFIED", "六组", "OCR"):
            self.assertIn(term, doc)
        self.assertIn("projects/shuge-exhibition-v1.0/data/", self.audit["immutable_baselines"][1])


if __name__ == "__main__":
    unittest.main()
