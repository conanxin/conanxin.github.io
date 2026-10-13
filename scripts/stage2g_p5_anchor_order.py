#!/usr/bin/env python3
"""Recompute three OCR anchor offsets/order from the frozen P2 sidecar.

No network access, local SQLite access, image modification, or OCR rewrite.
Wikisource parallel paragraph order is recorded separately as a human-read
version-specific reference and is not proof of edition or scan identity.
"""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / "projects/site-design-lab/shuge-source-crosswalk"


def load_json(name: str) -> dict:
    return json.loads((BASE / name).read_text(encoding="utf-8"))


def evaluate(p2: dict, p5a: dict) -> dict:
    source = p5a["evidence_sources"]["archived_original"]
    rows = [row for row in p2["rows"] if row["page_object_id"] == source["page_object_id"]]
    if len(rows) != 1:
        raise ValueError("Expected one exact primary page row")
    page = rows[0]
    if (page["citation_id"] != source["citation_id"]
            or page["page_index"] != source["page_index"]
            or page["ocr"]["id"] != source["ocr_row_id"]
            or page["ocr"]["qa_status"] != source["qa_status"]
            or page["sha256_recomputed"] != source["archived_jpeg_sha256"]):
        raise ValueError("Frozen P2 page identity or fingerprint changed")
    raw = page["ocr"]["excerpt"]
    located = []
    for anchor in p5a["anchors"]:
        needle = anchor["phrase"]
        occurrences = raw.count(needle)
        if occurrences != 1:
            raise ValueError(f"Anchor {anchor['id']} expected exactly once, found {occurrences}")
        offset = raw.index(needle)
        if offset != anchor["raw_ocr_codepoint_offset"]:
            raise ValueError(f"Anchor offset drift: {anchor['id']}")
        located.append((offset, anchor["id"]))
    ocr_order = [key for _, key in sorted(located)]
    reference_order = [a["id"] for a in sorted(p5a["anchors"], key=lambda a: a["reference_rank"])]
    report = {
        "citation_id": page["citation_id"],
        "ocr_order": ocr_order,
        "parallel_text_order": reference_order,
        "three_anchors_exactly_reversed": ocr_order == list(reversed(reference_order)),
        "source_qa_status": page["ocr"]["qa_status"],
        "whole_page_reading_order": p5a["measured_anchor_orders"]["whole_page_reading_order"],
    }
    expected = p5a["measured_anchor_orders"]
    if (ocr_order != expected["archived_ocr"]
            or reference_order != expected["parallel_transcription"]
            or report["three_anchors_exactly_reversed"] != expected["three_anchors_exactly_reversed"]):
        raise ValueError("P5A sidecar order and P2 original OCR disagree")
    return report


def main() -> None:
    report = evaluate(load_json("real-db-page-links.json"),
                      load_json("reading-order-p5a-audit.json"))
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
