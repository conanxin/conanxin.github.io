# UAP Files Web v0.3.2 — Pan Am NARA Metadata Probe

**STATUS:** PASS — All tasks complete, all validations passed
**Date:** 2026-05-11
**Project:** ~/projects/uap-files-web
**Version:** v0.3.2

---

## STATUS
PASS

## HOST_SCOPE
local (cloud Hermes VM)

## PROJECT_DIR
~/projects/uap-files-web

---

## A. BACKUP

Created: `.backup-v0_3_2-20260511_145044/`

Files backed up:
- `data.js`
- `README.md`
- `reports/uap_files_web_v0_3_1_ui_research_path_report.md`

---

## B. FILES_CREATED

| File | Size | Description |
|------|------|-------------|
| `tools/pan_am_nara_probe.py` | 22,309 bytes | NARA metadata probe script — pure stdlib Python |
| `reports/pan_am_1947_nara_probe.json` | ~12 KB | Probe output JSON with full findings |

---

## C. FILES_MODIFIED

| File | Change |
|------|--------|
| `data.js` | `pan-am-1947.caution_note` updated with v0.3.2 NARA probe results; `source_status` retained `needs_review` |
| `README.md` | Complete v0.3.2 rewrite — probe results, tools/, source links |

---

## D. PROBE_SCRIPT

**`tools/pan_am_nara_probe.py`** — NARA Metadata Probe (v0.3.2)

Architecture:
- Pure Python standard library (urllib, json, html.parser, re)
- Zero external dependencies
- `--dry-run` / `--max-bytes 25MB` / `--out reports/pan_am_1947_nara_probe.json`
- HEAD check before every GET; .zip files unconditionally skipped
- HTML link extraction from NARA bulk-download page to find JSON metadata URLs
- Recursive JSON parsing for structured keyword search

Key functions:
- `fetch_url()` — max-bytes capped GET
- `head_request()` — HEAD for Content-Length pre-check
- `LinkExtractor` — HTML `<a href>` extraction
- `search_in_text()` — raw text keyword search
- `search_json_text()` — recursive parsed-JSON keyword search
- `check_json_metadata()` — download + parse + search a single metadata JSON
- `check_nara_bulk_page()` — parse bulk-download HTML, extract JSON URLs
- `check_bluebook_page()` — NARA Project BLUE BOOK landing page
- `check_uap_textual_page()` — NARA UAP textual/microfilm page
- `ProbeResult` — result accumulator with `to_dict()` / `save()`

---

## E. SOURCES_CHECKED

| Source | URL | Size | Status |
|--------|-----|------|--------|
| NARA bulk-download page | archives.gov/.../uap-bulk-download | 94,769 bytes | ✓ checked |
| catalog-export-595466.json | s3.amazonaws.com/.../catalog-export-595466.json | 8,447 bytes | ✓ downloaded, no hits |
| catalog-export-597821.json | s3.amazonaws.com/.../catalog-export-597821.json | **85.7 MB** | SKIPPED (exceeds 25 MB cap) |
| catalog-export-40027753.json | s3.amazonaws.com/.../catalog-export-40027753.json | 24,652 bytes | ✓ downloaded, no hits |
| NARA Project BLUE BOOK page | archives.gov/.../military/air-force/ufos | 43,399 bytes | ✓ checked, no hits |
| NARA UAP textual/microfilm page | archives.gov/.../topics/uaps/textual-and-microfilm | 47,737 bytes | ✓ checked, 1 irrelevant hit |

---

## F. SOURCES_SKIPPED

| Source | Reason |
|--------|--------|
| 123 × .zip files (images, pdfs, moving-images, textual, presidential-libraries) | `.zip` extension — unconditionally skipped per probe rules |
| `catalog-export-597821.json` | Content-Length 89,836,815 bytes (85.7 MB) > max_bytes 26,214,400 (25 MB) |

**No large files downloaded.** All size caps respected.

---

## G. KEYWORD_HITS_SUMMARY

```
total keyword hits: 1

Source: NARA_UAP_textual_page
  keyword: "flight"
  snippet: "...to Unidentified Flying Object, 1986 (FAA—Japan Airlines Flight 1628)..."
  Assessment: JAL Flight 1628 (1986, Japan) — NOT Pan Am (1947, Alaska) — irrelevant
```

No hits for: pan am / pan american / alaska / hawaii / orange / september 1947 / sep 1947 / 1947-09 / anchorage / pacific

---

## H. CANDIDATE_RECORDS

```
count: 0
```

No candidate records met the scoring threshold (score ≥ 2 requiring: pan am AND 1947 AND location AND case number indicator).

---

## I. PAN_AM_DECISION

**Decision: pan-am-1947 → RETAIN `needs_review`**

**Rationale:**
1. `catalog-export-597821.json` (Sanitized Blue Book Case Files, NAID 597821) is the most relevant metadata source for this case. It is 85.7 MB, exceeding the 25 MB `--max-bytes` cap, and was correctly skipped.
2. `catalog-export-595466.json` (8 KB) and `catalog-export-40027753.json` (24 KB) were fully downloaded and parsed. No keyword matches found.
3. NARA Project BLUE BOOK landing page and UAP textual/microfilm page had no relevant hits.
4. The only keyword hit was for `flight` → JAL Flight 1628 (1986), which is unrelated to Pan Am 1947.
5. No `candidate_records` met the scoring threshold.

**Disposition:**
- `source_status`: `"needs_review"` — **RETAINED** (not downgraded to虚假, not upgraded)
- `caution_note`: Updated to record full probe findings
- `verification_hint.research_path`: Step 6 remains valid: "If still unresolved — microfilm index consultation (T-1206 roll index, July–September 1947 over Alaska)"
- `source_url`: NARA Project BLUE BOOK landing page (maintained)

**The most promising unresolved path:** obtaining or streaming `catalog-export-597821.json` with a higher `--max-bytes` limit, or consulting the T-1206 microfilm roll index at a NARA reading room.

---

## J. SOURCE_STATUS_COUNTS

### BEFORE v0.3.2 (unchanged)
| Status | Count |
|--------|-------|
| `verified` | 5 |
| `secondary_only` | 4 |
| `needs_review` | 1 |
| **TOTAL** | **10** |

### AFTER v0.3.2 (unchanged — no status change)
| Status | Count |
|--------|-------|
| `verified` | 5 |
| `secondary_only` | 4 |
| `needs_review` | 1 |
| **TOTAL** | **10** |

**No source_status changes in v0.3.2.**

---

## K. VALIDATION

### Pre-change data audit
```
CASE_COUNT=10 ✓
UNIQUE_IDS=10 ✓
SUM=10 ✓
verified=5, secondary_only=4, needs_review=1 ✓
pan-am-1947 source_status=needs_review ✓
```

### Post-change data audit
```
CASE_COUNT=10 ✓
UNIQUE_IDS=10 ✓
SUM=10 ✓
verified=5, secondary_only=4, needs_review=1 ✓
pan-am-1947 source_status=needs_review ✓
pan-am-1947 has v0.3.2 probe note in caution_note ✓
```

### Probe output validation
```
exact_match_found: false ✓
confidence: low ✓
checked_sources: 6 ✓
skipped_sources: 124 ✓
keyword_hits: 1 ✓
candidate_records: 0 ✓
errors: 0 ✓
```

### Safety checks
- No .zip files downloaded ✓
- No files exceeding --max-bytes 25 MB downloaded ✓
  - catalog-export-597821.json (85.7 MB): correctly skipped ✓
  - catalog-export-595466.json (8 KB): downloaded < 25 MB ✓
  - catalog-export-40027753.json (24 KB): downloaded < 25 MB ✓
- data.js syntax valid (node --check) ✓
- HTTP endpoints (tested separately):
  - index.html → 200 ✓
  - style.css → 200 ✓
  - app.js → 200 ✓
  - data.js → 200 ✓
  - README.md → 200 ✓
- No `/home/` paths in index.html / app.js / data.js ✓
- No `file://` URLs in index.html / app.js / data.js ✓

---

## L. REPORT_PATH

```
~/projects/uap-files-web/reports/uap_files_web_v0_3_2_pan_am_probe_report.md
~/projects/uap-files-web/reports/pan_am_1947_nara_probe.json
```

---

## M. PREVIEW_COMMAND

```bash
cd ~/projects/uap-files-web
python3 -m http.server 8765
# → http://localhost:8765
```

---

## N. NEXT_RECOMMENDED_ACTION

**Option A — Close pan-am-1947 via targeted microfilm/finding-aid research:**
1. Increase `--max-bytes` to 200 MB and re-run the probe to download and search `catalog-export-597821.json` (85.7 MB). This is the most promising source for a specific case file reference.
2. Alternatively, visit a NARA reading room to consult the T-1206 microfilm roll index (rolls covering July–September 1947 over Alaska).
3. If a Blue Book case file number or NARA catalog item is found, upgrade `source_status` to `secondary_only` (or `verified` if a direct digitized record exists).

**Option B — Accept current state and document the research boundary:**
- pan-am-1947 remains `needs_review` with a complete 6-step research_path and a detailed caution_note.
- The page honestly represents the current state of public knowledge: the case is historically referenced but not yet precisely located in official archives.
- This is a valid research outcome, not a failure.

**Option C — Potential v0.4 directions:**
1. Implement the `--max-bytes 200` probe variant to download catalog-export-597821.json
2. Upgrade Rendlesham Forest to `verified` if UK NA DEFE 24/1948/1 online access is confirmed
3. Add "last reviewed" timestamp to all needs_review cases
4. Add "probe_coverage" field to record which sources were checked vs. skipped
