"""Stage 2G: require real SQLite primary key joins, not arithmetic page offsets."""
import json
from pathlib import Path
import sqlite3
import sys
import tempfile
import unittest

REPO = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(REPO / "scripts"))
from stage2g_sqlite_probe import probe, IDS


class ReadOnlySQLiteProbeTests(unittest.TestCase):
    def setUp(self):
        self.dir = tempfile.TemporaryDirectory()
        self.addCleanup(self.dir.cleanup)
        self.path = Path(self.dir.name) / "shuge-fixture.db"
        with sqlite3.connect(self.path) as db:
            db.execute("CREATE TABLE page_objects (id INTEGER PRIMARY KEY, work_id TEXT, page_index INTEGER, source_image_uri TEXT)")
            db.executemany("INSERT INTO page_objects VALUES (?,?,?,?)", [
                (68, "p168491", 8, "https://example.org/scan/68"),
                (1096, "p211203", 137, None),
                (1178, "p211203", 220, "https://example.org/scan/1178"),
                (1320, "p211203", 362, "https://example.org/scan/1320"),
                (1338, "p211203", 380, None),
                (552, "p999999", 1, None),  # Wrong owner; must never be accepted as P44159.
            ])

    def open_ro(self):
        return sqlite3.connect("file:" + str(self.path) + "?mode=ro", uri=True)

    def test_exact_key_and_work_association_can_be_verified(self):
        with self.open_ro() as db:
            result = probe(db)
            self.assertEqual(result["connection"], "SQLite mode=ro; PRAGMA query_only=ON")
            rows = {r["citation_id"]: r for r in result["rows"]}
            self.assertEqual(len(rows), len(IDS))
            for citation in IDS[:-1]:
                row = rows[citation]
                self.assertEqual(row["page_object_lookup"], "VERIFIED")
                self.assertEqual(row["original_image_bytes"], "UNVERIFIED")
                self.assertEqual(row["holder_scan_identity"], "UNVERIFIED")
                self.assertEqual(row["historical_claim_support"], "UNVERIFIED")
            self.assertEqual(rows["SHUGE:p211203:1338"]["page_index"]["value"], 380)
            self.assertEqual(rows["SHUGE:p44159:552"]["page_object_lookup"], "UNVERIFIED")
            self.assertEqual(result["status"], "UNVERIFIED")

    def test_never_promote_wrong_work_even_when_numeric_id_exists(self):
        with self.open_ro() as db:
            result = probe(db, ("SHUGE:p44159:552",))
            row = result["rows"][0]
            self.assertEqual(row["row_count"], 1)
            self.assertEqual(row["matching_post_id_count"], 0)
            self.assertEqual(row["page_object_lookup"], "UNVERIFIED")

    def test_missing_page_objects_exposes_blocker_not_fabricated_data(self):
        other = sqlite3.connect(":memory:")
        other.execute("CREATE TABLE unrelated (id INTEGER PRIMARY KEY)")
        result = probe(other)
        other.close()
        self.assertEqual(result["status"], "UNVERIFIED")
        self.assertEqual(result["rows"], [])
        self.assertIn("page_objects", result["blocker"])

    def test_missing_work_key_is_never_called_verified(self):
        other = sqlite3.connect(":memory:")
        other.execute("CREATE TABLE page_objects (id INTEGER, page_index INTEGER)")
        result = probe(other)
        other.close()
        self.assertEqual(result["status"], "UNVERIFIED")
        self.assertIn("missing", result["blocker"])
        self.assertIn("page_index", result["observed_columns"])

    def test_query_only_mode_rejects_changes(self):
        with self.open_ro() as db:
            probe(db, ("SHUGE:p211203:1338",))
            with self.assertRaises(sqlite3.OperationalError):
                db.execute("UPDATE page_objects SET page_index=1 WHERE id=1338")

    def test_real_stage2g_sidecar_keeps_six_claims_unverified(self):
        file = REPO / "projects/site-design-lab/shuge-source-crosswalk/scan-locator-audit.json"
        ledger = json.loads(file.read_text(encoding="utf-8"))
        self.assertEqual(len(ledger["citation_rows"]), 6)
        self.assertTrue(ledger["locator_hypothesis"]["projection_is_forbidden"])
        self.assertEqual(ledger["summary"]["downloaded_original_image_binaries"], 0)


if __name__ == "__main__":
    unittest.main()
