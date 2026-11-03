#!/usr/bin/env python3
"""Validate Stage 2G-P5B full OCR sidecars and selected visual collation.

Reads only committed audit JSON. No network, source database writes, OCR writes,
image rewrites, or scholarly-status promotion.
"""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / "projects/site-design-lab/shuge-source-crosswalk"


def read(name: str) -> dict:
    return json.loads((BASE / name).read_text(encoding="utf-8"))


def validate(full: dict, visual: dict, p2: dict) -> dict:
    assert full["database"]["sha256"] == p2["db"]["sha256"]
    assert full["database"]["access"] == "mode=ro; PRAGMA query_only=ON"
    rows = full["rows"]
    assert len(rows) == 6
    p2_by_id = {r["page_object_id"]: r for r in p2["rows"]}
    full_by_id = {r["page_object_id"]: r for r in rows}
    assert set(full_by_id) == set(p2_by_id)

    truncated = []
    for pid, row in full_by_id.items():
        old = p2_by_id[pid]
        text = row["normalized_text"]
        assert hashlib.sha256(text.encode("utf-8")).hexdigest() == row["ocr_sha256"]
        assert len(text) == row["codepoint_count"]
        assert len(text.encode("utf-8")) == row["utf8_byte_count"]
        assert len(text.splitlines()) == row["line_count"]
        assert text.startswith(old["ocr"]["excerpt"])
        assert row["image_sha256_recomputed"] == old["sha256_recomputed"]
        assert row["image_hash_match"] is True
        assert row["ocr_row_id"] == old["ocr"]["id"]
        assert row["qa_status"] == old["ocr"]["qa_status"]
        if row["codepoint_count"] > row["p2_excerpt_codepoints"]:
            truncated.append(pid)
        assert row["p2_excerpt_truncated"] == (
            row["codepoint_count"] > row["p2_excerpt_codepoints"]
        )
    assert truncated == [1178, 1320, 1338]
    assert full["prior_p2_public_excerpt_audit"]["truncated_page_object_ids"] == truncated

    order = visual["page_1338_reading_order"]
    source = full_by_id[1338]
    raw = source["normalized_text"]
    located = []
    for anchor in order["anchors"]:
        phrase = anchor["ocr_phrase"]
        assert raw.count(phrase) == 1
        offset = raw.index(phrase)
        assert offset == anchor["ocr_codepoint_offset"]
        assert raw[:offset].count("\\n") + 1 == anchor["ocr_line"]
        located.append((offset, anchor["id"]))
    ocr_order = [key for _, key in sorted(located)]
    assert ocr_order == order["measured_order"]["ocr_string_order"]
    assert order["measured_order"]["original_image_reading_order"] == [
        "fish", "steaming", "juice"
    ]
    assert ocr_order == ["juice", "steaming", "fish"]
    assert order["measured_order"]["result"] == "CONFIRMED_REVERSED_FOR_THREE_SELECTED_ANCHORS"

    pair_count = 0
    for page_key in ("page_1338_reading_order", "page_1178", "page_1320"):
        section = visual[page_key]
        row = full_by_id[section["page_object_id"]]
        for pair in section.get("selected_glyph_collation", []):
            assert pair["ocr_reading"] in row["normalized_text"]
            pair_count += 1
    assert pair_count == visual["gates"]["selected_visual_glyph_reviews"] == 14

    edition = visual["edition_fingerprint"]
    assert edition["local_record"]["ark"] == "btv1b525104776"
    assert edition["bnf_official_reference"]["linked_ark"] == "btv1b52505781g"
    assert edition["edition_assessment"] == "PROVISIONALLY_CONSISTENT_WITH_CHINOIS_5563"
    assert edition["same_physical_copy_as_bnf_05781g"] == "UNVERIFIED"
    assert edition["same_digitization_as_bnf_05781g"] == "UNVERIFIED"
    assert edition["direct_pixel_comparison_to_bnf_05781g"] == "NOT_AVAILABLE_HTTP_403"
    assert visual["gates"]["full_page_ocr_reviews"] == 0
    assert visual["gates"]["scholarly_claims_verified"] == 0
    assert visual["gates"]["original_database_or_ocr_mutated"] is False

    return {
        "full_ocr_rows": len(rows),
        "p2_excerpt_truncated_pages": truncated,
        "image_hashes_reconfirmed": sum(r["image_hash_match"] for r in rows),
        "page_1338_anchor_order": ocr_order,
        "selected_visual_collations": pair_count,
        "edition_alignment": edition["edition_assessment"],
        "physical_copy_identity": edition["same_physical_copy_as_bnf_05781g"],
        "full_page_reviews": visual["gates"]["full_page_ocr_reviews"],
        "scholarly_claims_verified": visual["gates"]["scholarly_claims_verified"],
    }


def main() -> None:
    result = validate(
        read("full-ocr-p5b-audit.json"),
        read("visual-collation-p5b-audit.json"),
        read("real-db-page-links.json"),
    )
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
