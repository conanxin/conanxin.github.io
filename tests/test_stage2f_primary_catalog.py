"""Stage 2F: primary catalog identifiers and six frozen citation IDs, without altering research assets."""
from pathlib import Path
import json
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from build_site import Structure, transform
from personalize_site import personalize_html

SHUGE = "projects/shuge-exhibition-v1.0/data/"
PREFIX = "projects/site-design-lab/shuge-source-crosswalk/"
IDS = (
    "SHUGE:p168491:68", "SHUGE:p211203:1096",
    "SHUGE:p211203:1178", "SHUGE:p211203:1320",
    "SHUGE:p211203:1338", "SHUGE:p44159:552",
)


def text(path):
    return (ROOT / path).read_text(encoding="utf-8")


class Stage2FPrimaryEvidenceTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.audit = json.loads(text(PREFIX + "primary-catalog-audit.json"))
        cls.works = {w["post_id"]: w for w in json.loads(text(SHUGE + "works.json"))["featured"]}
        cls.biblio = json.loads(text(SHUGE + "bibliography.json"))
        cls.runs = json.loads(text(SHUGE + "citations.json"))["runs"]
        cls.cards = json.loads(text(SHUGE + "evidence_cards.json"))["cards"]
        cls.paragraphs = json.loads(text(SHUGE + "evidence_paragraphs.json"))["paragraphs"]

    def test_three_archived_ids_and_holder_candidate_catalog_records(self):
        rows = self.audit["works"]
        self.assertEqual({w["post_id"] for w in rows}, {168491, 211203, 44159})
        self.assertEqual(sum(len(w["primary_repository_catalog"]["candidates"]) for w in rows), 4)
        by_id = {w["post_id"]: w for w in rows}
        for n, title in ((168491, "园冶"), (211203, "天工开物"), (44159, "工程做法")):
            with self.subTest(id=n):
                row = by_id[n]
                self.assertEqual(row["title"], title)
                self.assertEqual(row["archived_url"], self.works[n]["shuge_url"])
                self.assertEqual(row["archived_page_count"], self.works[n]["page_count"])
                self.assertEqual(row["archived_identity"]["status"], "VERIFIED")
                self.assertEqual(row["primary_repository_catalog"]["status"], "VERIFIED")
                self.assertEqual(row["same_scanned_physical_object"]["status"], "UNVERIFIED")
                self.assertEqual(row["page_by_page_image_alignment"]["status"], "UNVERIFIED")
                for cat in row["primary_repository_catalog"]["candidates"]:
                    self.assertEqual(cat["status"], "VERIFIED")
                    self.assertIn("https://", cat["catalog_url"])

    def test_primary_identifiers_and_competing_versions_not_collapsed(self):
        rows = {w["post_id"]: w for w in self.audit["works"]}
        yuan = rows[168491]["primary_repository_catalog"]["candidates"][0]
        self.assertEqual(yuan["shelfmark"], "子076-0004")
        self.assertEqual(yuan["stable_record_id"], "1079110")
        self.assertEqual(yuan["listed_volume_ordinals"], ["0001", "0002", "0003"])
        bnf = rows[211203]["primary_repository_catalog"]["candidates"][0]
        self.assertEqual(bnf["stable_record_id"], "Chinois 5563")
        self.assertEqual(bnf["ark"], "ark:/12148/btv1b52505781g")
        self.assertIn("Chinois 5564", rows[211203]["details"]["competing_edition"]["identity"])
        self.assertEqual(rows[211203]["details"]["cited_specific_image"]["visual_inspection"]["status"], "UNVERIFIED")
        copies = rows[44159]["primary_repository_catalog"]["candidates"]
        self.assertEqual({c["shelfmark"] for c in copies}, {"史112-0007", "297-0020"})
        self.assertEqual(rows[44159]["details"]["competing_catalog_relation"]["status"], "UNVERIFIED")

    def test_citation_run_status_checked_from_real_nested_claims(self):
        found = {}
        wanted = set(IDS)
        for run in self.runs:
            for claim in run.get("claims", []):
                raw = claim.get("citation_ids", [])
                if isinstance(raw, str):
                    try:
                        raw = json.loads(raw)
                    except json.JSONDecodeError:
                        raw = [raw]
                for citation in raw:
                    if citation in wanted:
                        found.setdefault(citation, []).append((run["id"], run["question"]))
        rows = self.audit["citation_audit"]
        self.assertEqual({r["citation_id"] for r in rows}, wanted)
        self.assertEqual(set(found), {"SHUGE:p168491:68"})
        self.assertEqual(found["SHUGE:p168491:68"][0][0], 5)
        self.assertIn("园冶", found["SHUGE:p168491:68"][0][1])
        self.assertNotIn("梦粱录", found["SHUGE:p168491:68"][0][1])
        for record in rows:
            self.assertEqual(record["in_frozen_citations_runs"]["count"],
                             len(found.get(record["citation_id"], [])))
            self.assertEqual(record["in_frozen_citations_runs"]["status"],
                             "VERIFIED" if record["citation_id"] in found else "NOT_FOUND")
            self.assertEqual(record["claim_semantics"]["status"], "UNVERIFIED")

    def test_evidence_cards_and_page_suffix_are_not_automatically_verified(self):
        rows = {r["citation_id"]: r for r in self.audit["citation_audit"]}
        for citation in IDS:
            card_hits = [c for c in self.cards if citation in c.get("citation_ids", [])
                         or any(x.get("citation_id") == citation for x in c.get("evidence_preview", []))]
            par_hits = [p for p in self.paragraphs if citation in p.get("citation_ids", [])]
            item = rows[citation]
            self.assertEqual(item["evidence_card_presence"]["card_count"], len(card_hits))
            self.assertEqual(item["paragraph_reference_presence"]["paragraph_count"], len(par_hits))
            self.assertEqual(item["page_sequence_mapping"]["status"], "UNVERIFIED")
            self.assertIs(item["page_sequence_mapping"]["numeric_suffix_is_actual_scanned_page"], False)
        self.assertEqual(rows["SHUGE:p211203:1338"]["evidence_card_presence"]["shown_local_page_labels"],
                         [137, 362, 380])
        self.assertGreater(rows["SHUGE:p211203:1338"]["stored_suffix"], self.works[211203]["page_count"])
        self.assertEqual(self.works[211203]["page_count"], 419)

    def test_no_primary_scan_visual_verification_claimed(self):
        summary = self.audit["summary"]
        self.assertEqual(summary["books_with_primary_catalog_record_found"], 3)
        self.assertEqual(summary["primary_repository_catalog_candidate_count"], 4)
        self.assertEqual(summary["matching_shuge_to_exact_holder_scans_verified"], 0)
        self.assertEqual(summary["independently_visual_compared_image_sequences"], 0)
        self.assertEqual(summary["target_citation_ids"], 6)
        self.assertEqual(summary["citation_ids_occurring_in_citations_json_runs"], 1)
        self.assertEqual(summary["citation_ids_proven_to_support_historical_claims"], 0)
        self.assertIn("园冶", summary["critical_correction"])
        self.assertTrue(self.audit["not_performed"])

    def test_new_reader_uses_full_reference_template(self):
        path = PREFIX + "primary-catalog/index.html"
        raw = text(path)
        self.assertIn('<meta name="site-index-kind" content="reference">', raw)
        self.assertIn('<main class="site-home">', raw)
        self.assertIn('<article class="template-reference">', raw)
        self.assertIn("</article>\n</main>", raw)
        self.assertNotIn("TEMPLATE_", raw)
        parser = Structure(raw)
        main = next(n for n in parser.nodes if n.tag == "main")
        article = next(n for n in parser.nodes if n.tag == "article")
        self.assertEqual(parser.nodes[article.parent], main)
        for selector in ("source", "citation", "intro", "note", "overview", "citation-audit"):
            self.assertIn('id="' + selector + '"', raw)
        self.assertEqual(raw.count("data-audit-work="), 3)
        self.assertEqual(raw.count("data-citation-id="), 6)
        self.assertIn('href="../primary-catalog-audit.json"', raw)
        self.assertNotIn('href="./primary-catalog-audit.json"', raw)
        self.assertTrue((ROOT / "projects/site-design-lab/shuge-source-crosswalk/primary-catalog" / "../primary-catalog-audit.json").is_file())
        self.assertIn("子076-0004", raw)
        self.assertIn("Chinois 5563", raw)
        self.assertIn("史112-0007", raw)
        built, record = transform(raw, path)
        self.assertEqual(record["status"], "themed")
        self.assertIn('data-site-theme="unified-v1"', built)
        self.assertIn('data-site-identity="conan-xin-v1"', personalize_html(built, path))

    def test_public_document_explains_evidence_scopes(self):
        doc = text("docs/STAGE2F_PRIMARY_CATALOG_AUDIT.md")
        for token in ("1079110", "Chinois 5563", "Chinois 5564", "史112-0007",
                      "297-0020", "btv1b52505781g", "SHUGE:p211203:1338",
                      "NOT_FOUND", "UNVERIFIED", "CLAIM_SUPPORT_AUDIT.md"):
            self.assertIn(token, doc)


if __name__ == "__main__":
    unittest.main()
