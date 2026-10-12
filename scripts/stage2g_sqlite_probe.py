#!/usr/bin/env python3
"""Read-only SHUGE page-object probe: never equate citation IDs with PDF page numbers.

Usage:
  python3 scripts/stage2g_sqlite_probe.py /home/conanxin/shuge-research-db/data/shuge.db

The original database is opened mode=ro + query_only. Output is research evidence
for review, not a write-back to bibliography.json, citations.json or page_ocr.
"""
import json
from pathlib import Path
import re
import sqlite3
import sys
from urllib.parse import quote

IDS = ("SHUGE:p168491:68", "SHUGE:p211203:1096",
       "SHUGE:p211203:1178", "SHUGE:p211203:1320",
       "SHUGE:p211203:1338", "SHUGE:p44159:552")


def quote_identifier(identifier):
    return '"' + identifier.replace('"', '""') + '"'


def first_matching(columns, variants):
    return next((x for x in variants if x in columns), None)


def work_numeric(value):
    """Accept p211203, work-shuge-211203, or 211203; other formats stay unverified."""
    if value is None:
        return None
    matched = re.fullmatch(r"(?:work-shuge-|p)?([0-9]+)", str(value))
    return int(matched.group(1)) if matched else None


def probe(connection, ids=IDS):
    connection.execute("PRAGMA query_only=ON")
    found = {r[0] for r in connection.execute(
        "SELECT name FROM sqlite_master WHERE type='table'")}
    if "page_objects" not in found:
        return {"status": "UNVERIFIED", "blocker": "page_objects table not found",
                "tables_observed": sorted(found), "rows": []}
    cols = [r[1] for r in connection.execute("PRAGMA table_info(page_objects)")]
    key = first_matching(cols, ("page_object_id", "id"))
    owner = first_matching(cols, ("work_id", "post_id", "work_key"))
    index = first_matching(cols, ("page_index", "page_seq", "page_number", "seq"))
    source = first_matching(cols, ("source_image_uri", "image_uri", "source_url"))
    if not key or not owner:
        return {"status": "UNVERIFIED", "blocker": "missing page-object ID or work key",
                "observed_columns": cols, "rows": []}
    fields = [key, owner] + [x for x in (index, source) if x and x not in {key, owner}]
    query = "SELECT " + ", ".join(quote_identifier(x) for x in fields)
    query += " FROM page_objects WHERE " + quote_identifier(key) + "=?"
    rows = []
    for citation in ids:
        parts = re.fullmatch(r"SHUGE:p([0-9]+):([0-9]+)", citation)
        if not parts:
            raise ValueError("Invalid citation ID: " + citation)
        post, page_id = int(parts.group(1)), int(parts.group(2))
        hits = [dict(zip(fields, r)) for r in connection.execute(query, (page_id,))]
        matches = [r for r in hits if work_numeric(r[owner]) == post]
        if len(hits) != 1 or len(matches) != 1:
            rows.append({"citation_id": citation, "page_object_lookup": "UNVERIFIED",
                         "page_object_id_candidate": page_id, "row_count": len(hits),
                         "matching_post_id_count": len(matches),
                         "explanation": "Exact key/work match not established; no inferred page URL"})
            continue
        row = matches[0]
        rows.append({
            "citation_id": citation,
            "page_object_lookup": "VERIFIED",
            "verification_scope": "Actual page_objects primary-key and work association in read-only SQLite, not original scan image",
            "page_object_id": page_id,
            "post_id": post,
            "raw_work_key": row[owner],
            "page_index": {"status": "VERIFIED" if index and row[index] is not None else "UNVERIFIED",
                           "db_column": index, "value": row[index] if index else None},
            "source_image_uri": {"status": "VERIFIED" if source and row[source] else "UNVERIFIED",
                                 "db_column": source, "value": row[source] if source else None,
                                 "scope": "URI exactly as stored in DB; image bytes not downloaded or visually verified"},
            "original_image_bytes": "UNVERIFIED",
            "holder_scan_identity": "UNVERIFIED",
            "ocr_text_validation": "UNVERIFIED",
            "historical_claim_support": "UNVERIFIED",
        })
    return {"schema": "stage2g-sqlite-page-object-probe-v1",
            "connection": "SQLite mode=ro; PRAGMA query_only=ON",
            "status": "VERIFIED" if all(r["page_object_lookup"]=="VERIFIED" for r in rows) else "UNVERIFIED",
            "status_scope": "Only database key/work association; no official image identity or historical claim verification",
            "table": "page_objects",
            "field_mapping": {"id": key, "work": owner, "index": index, "image": source},
            "rows": rows}


def main():
    if len(sys.argv) != 2:
        raise SystemExit("Usage: python3 scripts/stage2g_sqlite_probe.py <read-only-shuge.db>")
    source = Path(sys.argv[1]).expanduser().resolve()
    if not source.is_file():
        raise SystemExit(f"SQLite database not found: {source}")
    url = "file:" + quote(str(source), safe="/:") + "?mode=ro"
    with sqlite3.connect(url, uri=True) as conn:
        result = probe(conn)
    print(json.dumps(result, ensure_ascii=False, indent=2, default=str))


if __name__ == "__main__":
    main()
