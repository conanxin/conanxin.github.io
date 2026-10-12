"""Stage 2G: source-grounded image locators without inventing downloads or page joins."""
from pathlib import Path
import json
import re
import sys
import unittest

REPO = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(REPO / "scripts"))
from build_site import Structure, transform
from personalize_site import personalize_html

DIR = "projects/site-design-lab/shuge-source-crosswalk/"
LEDGER = DIR + "scan-locator-audit.json"
READER = DIR + "scan-locator/index.html"
CARDS = "projects/shuge-exhibition-v1.0/data/evidence_cards.json"
WORKS = "projects/shuge-exhibition-v1.0/data/works.json"
TARGETS = [
    "SHUGE:p168491:68", "SHUGE:p211203:1096", "SHUGE:p211203:1178",
    "SHUGE:p211203:1320", "SHUGE:p211203:1338", "SHUGE:p44159:552",
]


def read(path):
    return (REPO / path).read_text(encoding="utf-8")


class Stage2GScanLocatorTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.ledger = json.loads(read(LEDGER))
        cls.cards = json.loads(read(CARDS))["cards"]
        cls.works = {w["post_id"]: w for w in json.loads(read(WORKS))["featured"]}

    def test_source_baseline_and_no_image_binaries_claimed(self):
        summary = self.ledger["summary"]
        self.assertEqual(summary["archived_works"], 3)
        self.assertEqual(summary["holder_record_candidates"], 4)
        self.assertEqual(summary["official_japan_viewer_volume_locators"], 4)
        self.assertEqual(summary["japan_observed_image_locator_ids"], 6)
        self.assertEqual(summary["downloaded_original_image_binaries"], 0)
        self.assertEqual(summary["verified_image_pair_alignments"], 0)
        self.assertEqual(summary["verified_image_to_citation_links"], 0)
        self.assertEqual(summary["verified_citation_claim_semantics"], 0)
        for attempt in self.ledger["acquisition_attempts"]:
            self.assertEqual(attempt["status"], "UNVERIFIED")
            self.assertIs(attempt["bytes_acquired"], False)

    def test_primary_locators_have_real_urls_but_no_verified_image_bytes(self):
        works = {w["post_id"]: w for w in self.ledger["holdings"]}
        self.assertEqual(set(works), {168491, 211203, 44159})
        yuan = works[168491]
        self.assertEqual(yuan["call_number"], "子076-0004")
        self.assertEqual(yuan["index_level_volume_records"]["ordinals"], ["0001", "0002", "0003"])
        bnf = works[211203]
        self.assertEqual(bnf["digital_object"]["ark"], "ark:/12148/btv1b52505781g")
        self.assertEqual(bnf["viewer_frame_reference"]["frame_token"], "f274")
        self.assertEqual(bnf["downloadable_manifest"]["status"], "UNVERIFIED")
        engineering = works[44159]
        self.assertEqual({x["call_number"] for x in engineering["catalog_candidates"]},
                         {"史112-0007", "297-0020"})
        self.assertEqual({x["volume_ordinal"] for x in engineering["catalog_candidates"]},
                         {6, 23, 32, 73})
        for work in works.values():
            self.assertEqual(work["image_binary_verification"]["status"], "UNVERIFIED")
            self.assertEqual(work["image_binary_verification"]["sampled_images"], 0)
            self.assertEqual(work["shuge_matching"]["matched_image_pairs"], 0)

    def test_sampled_najda_download_checkbox_ids_are_not_assumed_jp2_uris(self):
        engineering = next(w for w in self.ledger["holdings"] if w["post_id"] == 44159)
        items = engineering["catalog_candidates"]
        observed = [c for c in items if c["viewer_metadata"]["download_displayed_ids"]]
        self.assertEqual(len(observed), 2)
        self.assertEqual([x["viewer_metadata"]["viewer_image_count"] for x in observed], [22, 37])
        ids = [x for c in observed for x in c["viewer_metadata"]["download_displayed_ids"]]
        self.assertEqual(ids, [
            "C103160581800", "C103160581900", "C103160582000",
            "C103160611900", "C103160612000", "C103160612100",
        ])
        for c in observed:
            self.assertIsNone(c["actual_jp2_uri"]["uri"])
            self.assertEqual(c["image_bytes"]["status"], "UNVERIFIED")
            self.assertIs(c["image_bytes"]["downloaded"], False)

    def test_citation_local_labels_are_reproduced_from_original_cards(self):
        records = {r["citation_id"]: r for r in self.ledger["citation_rows"]}
        self.assertEqual(set(records), set(TARGETS))
        for id in TARGETS:
            row = records[id]
            hits = [c for c in self.cards if id in c.get("citation_ids", [])
                    or any(p.get("citation_id") == id for p in c.get("evidence_preview", []))]
            self.assertEqual(len(row["candidate_page_observations"]["observations"]), len(hits))
            observed = sorted({int(m.group(1))
                               for c in hits
                               if (m := re.search(r"》页(\d+)", c.get("claim_text", "")))})
            self.assertEqual(row["candidate_page_observations"]["distinct_labels"], observed)
            for entry in row["numeric_difference_hypotheses"]:
                self.assertEqual(entry["numeric_id_suffix"] - entry["candidate_card_local_page_label"],
                                 entry["difference"])
                self.assertEqual(entry["status"], "UNVERIFIED")
            self.assertEqual(row["page_object_id"]["status"], "UNVERIFIED")
            self.assertEqual(row["original_scan_canvas_or_image"]["status"], "UNVERIFIED")
            self.assertEqual(row["shuge_scan_page_index"]["status"], "UNVERIFIED")
            self.assertEqual(row["historical_claim_semantic_support"]["status"], "UNVERIFIED")

    def test_conflicting_1338_labels_block_numeric_offset_promotion(self):
        item = next(r for r in self.ledger["citation_rows"]
                    if r["citation_id"] == "SHUGE:p211203:1338")
        self.assertEqual(item["candidate_page_observations"]["distinct_labels"], [137, 362, 380])
        self.assertEqual(item["consistency_flag"], "CONFLICTING_CARD_LABELS")
        self.assertEqual([x["difference"] for x in item["numeric_difference_hypotheses"]],
                         [1201, 976, 958])
        self.assertEqual(self.ledger["locator_hypothesis"]["status"], "UNVERIFIED")
        self.assertTrue(self.ledger["locator_hypothesis"]["projection_is_forbidden"])
        self.assertLess(self.works[211203]["page_count"], 1338)
        self.assertEqual(self.ledger["summary"]["candidate_citation_ids"], 6)

    def test_reader_has_shared_template_and_live_parent_json_link(self):
        source = read(READER)
        self.assertNotIn("TEMPLATE_", source)
        self.assertIn('<main class="site-home">', source)
        self.assertIn('<article class="template-reference">', source)
        self.assertIn("</article>\n</main>", source)
        self.assertIn('name="site-index-kind" content="reference"', source)
        self.assertIn('href="../scan-locator-audit.json"', source)
        self.assertTrue((REPO / DIR / "scan-locator" / "../scan-locator-audit.json").is_file())
        self.assertEqual(source.count("data-scan-work="), 3)
        self.assertEqual(source.count("data-scan-citation="), 6)
        main = next(x for x in Structure(source).nodes if x.tag == "main")
        article = next(x for x in Structure(source).nodes if x.tag == "article")
        self.assertEqual(Structure(source).nodes[article.parent].tag, main.tag)
        style = source.split("<style>", 1)[1].split("</style>", 1)[0]
        self.assertIsNone(re.search(r"#[0-9a-fA-F]{3,8}", style))
        self.assertIn("var(--site-line)", style)
        built, info = transform(source, READER)
        self.assertEqual(info["status"], "themed")
        self.assertIn('data-site-theme="unified-v1"', built)
        self.assertIn('data-site-identity="conan-xin-v1"', personalize_html(built, READER))

    def test_report_records_access_blockers_and_claim_unverified(self):
        report = read("docs/STAGE2G_SCAN_ALIGNMENT_AUDIT.md")
        for marker in ("C103160581800", "C103160611900", "f274",
                       "SHUGE:p211203:1338", "958", "UNVERIFIED",
                       "page_object_id", "HTTP 403"):
            self.assertIn(marker, report)
        self.assertEqual(self.ledger["summary"]["verified_citation_claim_semantics"], 0)


if __name__ == "__main__":
    unittest.main()
