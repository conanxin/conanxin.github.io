import json
import unittest
from pathlib import Path

BASE=Path(__file__).resolve().parents[1]/"projects/site-design-lab/shuge-source-crosswalk"

class P5DCloseout(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.d=json.loads((BASE/"p5d-phase-closeout.json").read_text(encoding="utf-8"))
        cls.p2=json.loads((BASE/"real-db-page-links.json").read_text(encoding="utf-8"))

    def test_source_identity_and_hash(self):
        p=self.d["primary_source"]
        assert p["page_object_id"]==1338 and p["page_index"]==380
        row=next(x for x in self.p2["rows"] if x["page_object_id"]==1338)
        assert row["sha256_recomputed"]==p["original_image_sha256"]
        assert self.p2["db"]["sha256"]==p["db_sha256"]

    def test_unresolved_readings_not_promoted(self):
        u=self.d["uncertainty_review"]
        assert [x["id"] for x in u]==["U1","U2","U3","U4"]
        assert all(x["human_approved"] is False for x in u)
        assert sum(x["result"].startswith("REMAINS_UNRESOLVED") for x in u)==2
        assert sum(x["result"]=="AI_VISUAL_SUPPORT_FOR_DRAFT" for x in u)==2

    def test_other_pages_are_not_full_transcriptions(self):
        rows=self.d["other_page_review"]
        assert [r["page_object_id"] for r in rows]==[1178,1320]
        for r in rows:
            p=next(x for x in self.p2["rows"] if x["page_object_id"]==r["page_object_id"])
            assert r["image_sha256"]==p["sha256_recomputed"]
            assert r["full_page_human_approved"] is False

    def test_scholarly_boundaries_and_stop(self):
        g=self.d["gates"]
        assert g["six_historical_claims_scholarly_verified"]==0
        assert g["additional_pages_full_transcribed"]==0
        assert g["bnf_two_arks_same_scan"]=="UNVERIFIED"
        assert g["publication"]=="NOT_MERGED_NOT_DEPLOYED"
        assert g["phase_workflow"]=="STOP_AFTER_ARCHIVING"
        for key in ("archived_source_modified","ocr_source_modified","source_image_modified","frozen_research_modified"):
            assert g[key] is False

    def test_report_exists(self):
        path=Path(__file__).resolve().parents[1]/"docs/STAGE2G_P5D_CLOSEOUT.md"
        s=path.read_text(encoding="utf-8")
        for x in ("U1","U2","U3","U4","第220","第362","UNVERIFIED","阶段性"):
            assert x in s

if __name__=="__main__":
    unittest.main()
