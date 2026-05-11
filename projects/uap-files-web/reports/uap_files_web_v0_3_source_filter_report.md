# PURSUE / UAP Files 网页 v0.3 — Source Filter Report

**Project:** The UAP Files — Web Prototype
**Version:** v0.3
**Date:** 2026-05-11
**Task:** Source Status Resolution + Source Filter UI
**Host:** cloud Hermes (VM-0-4-ubuntu)
**Working Directory:** ~/projects/uap-files-web

---

## STATUS

**PASS** — All planned changes implemented and validated.

---

## HOST_SCOPE

cloud Hermes (VM-0-4-ubuntu) — Local file modification and HTTP preview only. No production services modified. No background daemons started. No public deployment.

---

## PROJECT_DIR

`~/projects/uap-files-web`

---

## FILES_BACKED_UP

Created `.backup-v0_3-20260511_135055/` containing:

| File | Size |
|------|------|
| `index.html` | 21,715 bytes |
| `style.css` | 19,668 bytes |
| `app.js` | 9,637 bytes |
| `data.js` | 21,285 bytes |
| `README.md` | 11,186 bytes |
| `reports/uap_files_web_v0_2_1_data_audit_report.md` | (previous report) |

---

## FILES_MODIFIED

| File | Changes |
|------|---------|
| `data.js` | Apollo 12: source_url → WAR.GOV PDF, status → verified; Pan Am 1947: source_url → NARA landing, kept needs_review; Rendlesham 1980: source_url → UK NA overview, status → secondary_only; added verification_hint to 3 cases (Apollo 12, Pan Am, Rendlesham); version comment → v0.3 |
| `app.js` | Added dual filter system (renderFilterBars, applyFilters, getActiveCategory, getActiveStatus); added buildVerificationHint for needs_review cases; renderCard now renders verification_hint; version comment → v0.3 |
| `style.css` | Added .filter-bar--status, .status-filter, .verif-hint, .vh-label, .vh-row, .vh-tag, .vh-terms, .vh-tag-label, .vh-term CSS rules |
| `index.html` | Added second filter bar `<div id="status-filter-bar">` below category filter bar; added aria-label |
| `README.md` | Full v0.3 rewrite with changelog, source status definitions, data schema, case table, UI description, limitations |
| `reports/uap_files_web_v0_3_source_filter_report.md` | New — this report |

---

## SOURCE_STATUS_BEFORE (v0.2.1)

| Status | Count | Cases |
|--------|-------|-------|
| `verified` | 4 | uss-nimitz-tic-tac-2004, gofast-2015, orbs-pacific-2023, pentagon-2017-aatip |
| `secondary_only` | 4 | gemini-vii-1965, apollo-11-lunar-flash-1969, apollo-12-occultation-1969, fbi-louisville-1949 |
| `needs_review` | 2 | pan-am-1947, rendlesham-forest-1980 |
| **TOTAL** | **10** | |

---

## SOURCE_STATUS_AFTER (v0.3)

| Status | Count | Cases | Change |
|--------|-------|-------|--------|
| `verified` | **5** | uss-nimitz-tic-tac-2004, gofast-2015, orbs-pacific-2023, pentagon-2017-aatip, **apollo-12-occultation-1969** | +1 |
| `secondary_only` | **4** | gemini-vii-1965, apollo-11-lunar-flash-1969, **rendlesham-forest-1980**, fbi-louisville-1949 | ±0 (internal reshuffle) |
| `needs_review` | **1** | **pan-am-1947** | -1 |
| **TOTAL** | **10** | | |

**Net change:** needs_review reduced from 2 to 1. No verified source was downgraded. Pan Am 1947 was NOT downgraded to secondary_only just to reduce needs_review count.

---

## APOLLO_12_DECISION

**Case:** `apollo-12-occultation-1969`
**Action:** `source_status` upgraded `secondary_only` → `verified`
**New source_url:** `https://www.war.gov/medialink/ufo/release_1/nasa-uap-d1-apollo-12-transcript-1969.pdf`
**New archive_label:** `WAR.GOV PURSUE Release 01 / NASA UAP Document D1`

**Decision rationale:**
- The WAR.GOV PURSUE Release 01 medialink package contains `nasa-uap-d1-apollo-12-transcript-1969.pdf`
- This PDF is a direct official record of the Apollo 12 mission transcript, which includes anomalous observation entries
- This satisfies the verified threshold: official .gov source, direct record of the case
- `caution_note` explicitly states: "官方 PDF 可验证该任务记录存在，但现象解释仍未定；不得据此推断外星来源"

**verification_hint added** pointing to the WAR.GOV PURSUE Release 1 catalogue entry.

---

## RENDLESHAM_DECISION

**Case:** `rendlesham-forest-1980`
**Action:** `source_status` upgraded `needs_review` → `secondary_only`
**New source_url:** `https://www.nationalarchives.gov.uk/explore-the-collection/explore-by-time-period/postwar/ufo-reports/`
**New archive_label:** `UK National Archives, DEFE 24/1948/1 (Rendlesham Forest correspondence)`

**Decision rationale:**
- UK National Archives UFO reports collection page explicitly mentions "Correspondence on the Rendlesham Forest incident" as catalogue reference DEFE 24/1948/1
- This is sufficient to confirm the official archive existence of the case
- However: the specific DEFE 24/1948/1 catalogue item's online digitization status (whether it can be directly viewed in-browser) cannot be confirmed remotely without manual navigation
- Therefore: upgraded to `secondary_only` (not `verified`), which accurately reflects "official archive confirmed but online access not directly verified"
- This is the correct honest classification per the source_status definition

**verification_hint added** pointing to UK National Archives + DEFE 24/1948/1 catalogue reference + suggested query terms.

---

## PAN_AM_DECISION

**Case:** `pan-am-1947`
**Action:** `source_status` retained `needs_review`; `source_url` updated from dead af.mil PDF link to NARA Project Blue Book landing page
**New source_url:** `https://www.archives.gov/research/military/air-force/ufos`
**New archive_label:** `Project Blue Book / NARA — exact case file pending`

**Decision rationale:**
- Could not confirm the specific Blue Book case file number for the Pan Am 1947 bright orange object over Alaska
- Did NOT downgrade to secondary_only just to reduce the needs_review count
- The task explicitly stated: "不要为了降低 needs_review 数量而强行升级"
- NARA landing page URL is more appropriate than the previously linked af.mil PDF (which may be stale)
- `caution_note` explicitly states: "该案例来自公开报道/转述；目前仍需 NARA 或 Blue Book 具体档案编号核实。不得将媒体报道/转述视为'官方认定事实'。"

**verification_hint added** pointing to NARA + suggested query terms (Pan Am, Alaska, 1947, blue book, orange object) and target field (Project Blue Book case file number).

---

## UI_CHANGES

### 1. Source Status Filter Bar (v0.3 — New)

**Location:** Below the existing category filter bar in `#top-cases` section
**HTML:** `<div class="filter-bar filter-bar--status" id="status-filter-bar" role="tablist" aria-label="来源状态筛选">`
**Buttons (4):**
- `全部来源` (default active) — no status filter
- `官方来源 Verified` — shows only verified cases (green border)
- `二手来源 Secondary` — shows only secondary_only cases (orange border)
- `待核实 Needs Review` — shows only needs_review cases (purple border)

**Filter logic:** AND combination with category filter. Both active filters must match for a card to be visible.

### 2. Dual Filter System (v0.3 — Enhanced)

- Category filter buttons: `data-cat` attribute (existing, now explicit)
- Status filter buttons: `data-status` attribute (new)
- `applyFilters()` reads both and requires both `catMatch && statusMatch`
- `filterCards(categoryId)` function retained for backward compatibility (updates `data-cat` active state + calls `applyFilters()`)

### 3. Verification Hint Block (v0.3 — New)

**Trigger:** Only rendered for cases where `source_status === 'needs_review'` AND `verification_hint` object exists

**Rendered HTML:**
```html
<div class="verif-hint">
  <div class="vh-label">🔍 协助核实</div>
  <div class="vh-row"><span class="vh-tag">档案库: [archive name]</span></div>
  <div class="vh-row"><span class="vh-tag">目标: [target catalogue reference]</span></div>
  <div class="vh-row vh-terms">
    <span class="vh-tag-label">查询关键词:</span>
    <span class="vh-term">[keyword1]</span>
    <span class="vh-term">[keyword2]</span>
    ...
  </div>
</div>
```

**Styling:** Purple dashed border, purple label, monospace font, compact tags — visually distinct from source section but not alarming.

### 4. Card data-status Attribute (v0.3 — New)

Added `data-status` attribute to each `<article class="case-card">` element for status filtering. Example:
```html
<article class="case-card" data-category="NASA" data-id="apollo-12-occultation-1969" data-status="verified">
```

---

## DATA_SCHEMA_CHANGES

### New Field: `verification_hint` (v0.3 — Optional, recommended for needs_review)

```javascript
{
  verification_hint: {
    archive: "NARA / National Archives",           // Required string
    query_terms: ["Pan Am", "Alaska", "1947", ...], // Required string[]
    target: "Project Blue Book case file number"     // Required string
  }
}
```

**Placement:** Inside the case object, alongside `source_verification_note`
**Count:** 3 cases have this field (apollo-12, pan-am, rendlesham)
**Rendering:** `buildVerificationHint(c)` in app.js; only fires when `c.source_status === 'needs_review'`

---

## VALIDATION

| Check | Result |
|-------|--------|
| `CASE_COUNT = 10` | ✅ PASS |
| `UNIQUE_ID_COUNT = 10` | ✅ PASS |
| `source_status` total = 10 | ✅ PASS |
| `source_status` breakdown: verified×5, secondary_only×4, needs_review×1 | ✅ PASS |
| Each case has `source_url` | ✅ PASS |
| All `source_status` values valid | ✅ PASS |
| Apollo 12 `source_url` = WAR.GOV PDF | ✅ PASS |
| Apollo 12 `source_status` = verified | ✅ PASS |
| Rendlesham `source_url` = UK NA overview | ✅ PASS |
| Rendlesham `archive_label` contains DEFE 24/1948/1 | ✅ PASS |
| Pan Am `source_status` = needs_review (not downgraded) | ✅ PASS |
| Pan Am `source_url` updated to NARA | ✅ PASS |
| `verification_hint` fields present (apollo12, panam, rendlesham) | ✅ PASS (3/3) |
| `python3 -m http.server 8765` starts | ✅ PASS |
| `curl http://localhost:8765/` → 200 | ✅ PASS |
| `curl http://localhost:8765/style.css` → 200 | ✅ PASS |
| `curl http://localhost:8765/app.js` → 200 | ✅ PASS |
| `curl http://localhost:8765/data.js` → 200 | ✅ PASS |
| No `/home/` paths in index.html | ✅ PASS (CLEAN) |
| No `/home/` paths in app.js | ✅ PASS (CLEAN) |
| No `file://` URLs in index.html | ✅ PASS (CLEAN) |
| No `file://` URLs in app.js | ✅ PASS (CLEAN) |

---

## REPORT_PATH

`~/projects/uap-files-web/reports/uap_files_web_v0_3_source_filter_report.md`

---

## PREVIEW_COMMAND

```bash
cd ~/projects/uap-files-web
python3 -m http.server 8765
# → http://localhost:8765
```

Server is currently running on port 8765 (session `proc_8bcdf7433b3b`).

---

## NEXT_RECOMMENDED_ACTION

1. **Close remaining needs_review (Pan Am 1947)**: Submit NARA catalog search with query terms `Pan Am + Alaska + 1947 + blue book + orange object`. If Blue Book case number is found, upgrade Pan Am to `secondary_only` and update `verification_hint.target`.

2. **Verify UK National Archives DEFE 24/1948/1**: Manually visit the catalogue item page to determine if it is digitized (then upgrade to `verified`) or requires in-person archive access (remain `secondary_only`).

3. **Status filter UX enhancement**: Consider adding a count badge to each status filter button showing the number of matching cases (e.g., "待核实 Needs Review (1)").

4. **Secondary sources expandable UI**: Expand `secondary_sources` from count-only display to a collapsible detail block showing each secondary source title and external link.

5. **Apollo 12 GOFAST upgrade path**: With Apollo 12 now verified, consider whether the Apollo 12 case is the highest-priority case to add a photo/video evidence type in a future iteration.
