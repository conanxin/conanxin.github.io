"""Stage 2G-P2: assert independently retrieved real SQLite evidence without CI needing local database."""
import hashlib
import json
from pathlib import Path
import sqlite3
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from stage2g_sqlite_probe import probe

FOLDER = "projects/site-design-lab/shuge-source-crosswalk/"
PAGE_IDS = {
    "SHUGE:p168491:68": (168491, 8),
    "SHUGE:p211203:1096": (211203, 137),
    "SHUGE:p211203:1178": (211203, 220),
    "SHUGE:p211203:1320": (211203, 362),
    "SHUGE:p211203:1338": (211203, 380),
    "SHUGE:p44159:552": (44159, 1),
}


class RealEvidenceSidecarTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.record = json.loads((ROOT / FOLDER / "real-db-page-links.json").read_text(encoding="utf-8"))
        cls.baseline = json.loads((ROOT / FOLDER / "scan-locator-audit.json").read_text(encoding="utf-8"))
        cls.works = {str(x["post_id"]): x for x in
                     json.loads((ROOT / "projects/shuge-exhibition-v1.0/data/works.json")
                                .read_text(encoding="utf-8"))["featured"]}

    def test_real_db_fingerprint_and_six_exact_page_matches(self):
        info = self.record
        self.assertEqual(info["db"]["size"], 45989888)
        self.assertEqual(len(info["db"]["sha256"]), 64)
        self.assertEqual(info["db"]["page_objects_count"], 3791)
        self.assertEqual(info["db"]["page_ocr_count"], 3586)
        self.assertEqual(info["db"]["connection"], "mode=ro; PRAGMA query_only=ON")
        self.assertEqual(info["summary"]["exact_page_owner_matches"], 6)
        self.assertEqual(info["summary"]["local_sha256_verified_images"], 6)
        self.assertEqual({x["citation_id"] for x in info["rows"]}, set(PAGE_IDS))
        for row in info["rows"]:
            post, page_index = PAGE_IDS[row["citation_id"]]
            self.assertEqual(row["post_id"], post)
            self.assertEqual(row["work_id"], "p"+str(post))
            self.assertEqual(row["page_object_id"], int(row["citation_id"].split(":")[-1]))
            self.assertEqual(row["page_index"], page_index)
            self.assertEqual(self.works[str(post)]["title"], {
                168491: "园冶", 211203: "天工开物", 44159: "工程做法"}[post])

    def test_sha_and_acquisition_records_independently_consistent(self):
        records = self.record["rows"]
        self.assertEqual(len(records), 6)
        for item in records:
            self.assertTrue(item["hash_verified"])
            self.assertEqual(item["sha256_recorded"], item["sha256_recomputed"])
            self.assertEqual(len(item["sha256_recomputed"]), 64)
            self.assertEqual(item["size_recorded"], item["size_actual"])
            self.assertEqual(item["mime_type"], "image/jpeg")
            self.assertEqual(item["acquisition"]["http_status_at_acquisition"], 200)
            self.assertEqual(item["acquisition"]["status"], "SUCCESS")
            self.assertEqual(item["visual_observation"]["status"], "OBSERVED")
            self.assertEqual(item["holder_entire_book_identity"], "UNVERIFIED")
            self.assertEqual(item["claim_semantic_support"], "UNVERIFIED")
        self.assertEqual(self.record["summary"]["ocr_records"], 6)
        self.assertEqual(self.record["summary"]["qa_pass"], 1)
        self.assertEqual(self.record["summary"]["qa_unreviewed"], 5)

    def test_new_evidence_never_rewrites_old_negative_baseline(self):
        self.assertEqual(self.baseline["summary"]["downloaded_original_image_binaries"], 0)
        self.assertEqual(self.baseline["summary"]["verified_image_pair_alignments"], 0)
        self.assertEqual(self.record["review_gates"]["sqlite_page_id_to_work"], "VERIFIED_6_OF_6")
        self.assertEqual(self.record["review_gates"]["page_to_stored_jpeg_integrity"],
                         "VERIFIED_6_OF_6")
        self.assertEqual(self.record["summary"]["full_ocr_reviews"], 0)
        self.assertEqual(self.record["summary"]["verified_historical_claim_semantics"], 0)
        self.assertIn("btv1b52505781g", self.record["conflict"]["stage2f_ark"])
        self.assertIn("btv1b525104776", self.record["conflict"]["local_db_ark"])
        self.assertEqual(self.record["conflict"]["status"], "UNVERIFIED")

    def test_local_page_552_has_najda_original_source(self):
        row = next(x for x in self.record["rows"] if x["page_object_id"] == 552)
        self.assertIn("digital.archives.go.jp", row["source_image_url"])
        self.assertIn("1070041", row["acquisition"]["source_url"])
        self.assertEqual(row["page_index"], 1)
        self.assertEqual(row["ocr"]["qa_status"], "PASS")
        self.assertIn("函号", row["visual_observation"]["subject"])


class RealSchemaProbeRegression(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.folder = Path(self.temp.name)
        self.db = self.folder / "tiny.db"
        self.image = self.folder / "123.jpg"
        self.image.write_bytes(b"\xff\xd8\xff\xe0" + b"local-JPEG-fixture")
        self.hash = hashlib.sha256(self.image.read_bytes()).hexdigest()
        with sqlite3.connect(self.db) as con:
            con.execute("CREATE TABLE page_objects (id INTEGER PRIMARY KEY, work_id TEXT, page_index INTEGER, source_image_url TEXT, local_object_path TEXT, sha256 TEXT, file_size INTEGER)")
            con.execute("INSERT INTO page_objects VALUES (?,?,?,?,?,?,?)",
                        (1338, "p211203", 380, "https://gallica.bnf.fr/f380",
                         str(self.image), self.hash, self.image.stat().st_size))
            con.execute("CREATE TABLE page_ocr (id INTEGER, page_object_id INTEGER,engine TEXT,status TEXT,qa_status TEXT,char_count INTEGER)")
            con.execute("INSERT INTO page_ocr VALUES (1,1338,'rapidocr','SUCCESS','NOT_CHECKED',188)")

    def test_real_schema_source_image_and_recomputed_bytes(self):
        with sqlite3.connect("file:"+str(self.db)+"?mode=ro",uri=True) as db:
            result = probe(db, ("SHUGE:p211203:1338",))
            self.assertEqual(result["status"], "VERIFIED")
            self.assertEqual(result["field_mapping"]["image"], "source_image_url")
            page = result["rows"][0]
            self.assertEqual(page["page_index"]["value"], 380)
            self.assertEqual(page["source_image_uri"]["value"], "https://gallica.bnf.fr/f380")
            self.assertEqual(page["original_image_bytes"], "VERIFIED_ARCHIVED_BYTES")
            self.assertEqual(page["archived_local_image"]["actual_sha256"], self.hash)
            self.assertEqual(page["ocr_metadata"]["qa_status"], "NOT_CHECKED")
            self.assertEqual(page["holder_scan_identity"], "UNVERIFIED")
            self.assertEqual(page["historical_claim_support"], "UNVERIFIED")

    def test_tampered_file_does_not_pass_hash_integrity(self):
        self.image.write_bytes(b"\xff\xd8\xffchanged")
        with sqlite3.connect("file:"+str(self.db)+"?mode=ro",uri=True) as db:
            page = probe(db, ("SHUGE:p211203:1338",))["rows"][0]
        self.assertEqual(page["archived_local_image"]["status"], "UNVERIFIED")
        self.assertEqual(page["original_image_bytes"], "UNVERIFIED")


if __name__ == "__main__":
    unittest.main()
