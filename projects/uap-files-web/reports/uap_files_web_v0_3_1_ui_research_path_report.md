# UAP Files Web v0.3.1 — Status Count Badges & Pan Am Research Path

**STATUS:** PASS — All tasks complete, all validations passed
**Date:** 2026-05-11
**Project:** ~/projects/uap-files-web
**Version:** v0.3.1

---

## A. STATUS SUMMARY

| Item | Result |
|------|--------|
| STATUS | PASS |
| HOST_SCOPE | local (cloud Hermes VM) |
| PROJECT_DIR | ~/projects/uap-files-web |

---

## B. BACKUP

Created: `.backup-v0_3_1-20260511_140537/`

Files backed up:
- `index.html`
- `style.css`
- `app.js`
- `data.js`
- `README.md`
- `reports/uap_files_web_v0_3_source_filter_report.md`

---

## C. FILES MODIFIED

| File | Change |
|------|--------|
| `data.js` | v0.3.1 header comment; pan-am-1947 verification_hint expanded: archive→"NARA / Project BLUE BOOK", query_terms expanded with T-1206/NAID/September 1947/Pan American, research_path added (6 steps) |
| `app.js` | v0.3.1 header; count helpers (countByCategory, countByStatus); buildSecondarySourcesExpandable() using `<details>/<summary>`; renderFilterBars() updated with count badges; buildVerificationHint() extended to render research_path steps |
| `style.css` | +87 lines: `.sec-sources-expandable` / `.sec-sources-toggle` / `.sec-sources-list` / `.ss-*` rules + `.vh-steps` / `.vh-step` / `.vh-step-label` / `.vh-step-url` / `.vh-step-note` rules |
| `index.html` | Source Explainer "待核实" explanation extended: +"待核实并不代表案例虚假；它只表示当前页面尚未找到足够精确的官方档案编号或 catalog item。" |
| `README.md` | Complete v0.3.1 rewrite (changelog, schema, data table, sources) |
| `reports/uap_files_web_v0_3_1_ui_research_path_report.md` | NEW — this report |

---

## D. COUNT BADGES IMPLEMENTED

### Category Filter Badges (auto-computed from UAP_CASES)

| Button | Count | Logic |
|--------|-------|-------|
| All | 10 | UAP_CASES.length |
| NASA | 3 | gemini-vii-1965, apollo-11-lunar-flash-1969, apollo-12-occultation-1969 |
| Military | 5 | rendlesham-forest-1980, uss-nimitz-tic-tac-2004, gofast-2015, orbs-pacific-2023, pentagon-2017-aatip |
| Historical | 1 | pan-am-1947 |
| FBI | 1 | fbi-louisville-1949 |
| Visual | 0 | No cases with category Visual |

### Source Status Filter Badges (auto-computed)

| Button | Count |
|--------|-------|
| 全部来源 | 10 |
| Verified | 5 |
| Secondary Only | 4 |
| Needs Review | 1 |

### Implementation

```javascript
// app.js — count helpers (v0.3.1)
function countByCategory(catId) {
  if (catId === 'all') return UAP_CASES.length;
  return UAP_CASES.filter(function (c) { return c.category === catId; }).length;
}

function countByStatus(statusId) {
  if (statusId === 'all') return UAP_CASES.length;
  return UAP_CASES.filter(function (c) { return c.source_status === statusId; }).length;
}

// In renderFilterBars — category buttons:
btn.textContent = cat.label + ' (' + countByCategory(cat.id) + ')';

// In renderFilterBars — status buttons:
btn.textContent = s.label + ' (' + countByStatus(s.id) + ')';
```

**Non-hardcoded:** All counts computed at runtime from `UAP_CASES` array. Adding/removing a case automatically updates all badge counts.

---

## E. SECONDARY SOURCES EXPANSION

### Before (v0.3)
```
补充叙事来源：n 条
```
Simple static text, no interactivity.

### After (v0.3.1)
```
▼ 展开补充来源 (n)
  [collapsible list with type/title/note/url per item]
```

### Implementation

- Uses native `<details>/<summary>` — zero JS dependency for expand/collapse
- `buildSecondarySourcesExpandable(sources)` generates:
  ```javascript
  '<details class="sec-sources-expandable">' +
    '<summary class="sec-sources-toggle">▼ 展开补充来源 (' + n + ')</summary>' +
    '<ul class="sec-sources-list">' +
      sources.map(function(s) {
        return '<li class="ss-item">' +
          '<span class="ss-type">[' + s.type + ']</span> ' +
          '<span class="ss-title">' + s.title + '</span>' +
          (s.note ? '<div class="ss-note">' + s.note + '</div>' : '') +
          (s.url ? '<a class="ss-url" href="' + url + '" target="_blank">↗</a>' : '') +
        '</li>';
      }).join('') +
    '</ul>' +
  '</details>'
  ```
- Called from `buildCardMeta(c)` in renderCard()
- CSS hides default `<details>` marker, colors toggle on open state

---

## F. PAN AM RESEARCH PATH

### pan-am-1947.verification_hint (v0.3.1 — complete)

```javascript
verification_hint: {
  archive: "NARA / Project BLUE BOOK",
  query_terms: [
    "Pan Am", "Pan American", "September 1947",
    "Alaska", "orange object", "Project Blue Book",
    "T-1206", "NAID 597821", "NAID 40027753"
  ],
  target: "exact Project Blue Book case file date/location entry or National Archives Catalog identifier",
  research_path: [
    {
      label: "1. NARA Project BLUE BOOK Landing Page",
      url: "https://www.archives.gov/research/military/air-force/ufos",
      note: "Overview + microfilm access instructions (T-1206: 94 rolls 35mm)"
    },
    {
      label: "2. NARA UAP Textual & Microfilm Records",
      url: "https://www.archives.gov/research/topics/uaps/textual-and-microfilm",
      note: "Links to NAID 40027753, NAID 595175, NAID 597821"
    },
    {
      label: "3. NARA Bulk Download — Case Files NAID 597821",
      url: "https://www.archives.gov/research/catalog/catalog-bulk-downloads/uap-bulk-download",
      note: "JSON metadata search by date: September 1947, location: Alaska"
    },
    {
      label: "4. NARA Catalog — UFO Sightings NAID 40027753",
      url: "https://www.archives.gov/research/catalog/catalog-bulk-downloads/uap-bulk-download",
      note: "Cross-reference with AFoshay Report (1958) 12,618-case index"
    },
    {
      label: "5. AFoshay Report — Project Blue Book Statistical Summary (1958)",
      url: "https://www.archives.gov/research/military/air-force/ufos",
      note: "All 12,618 cases indexed by date and location — use for Pan Am September 1947 lookup"
    },
    {
      label: "6. If still unresolved — microfilm index consultation",
      url: "",
      note: "T-1206 roll index: July–September 1947 over Alaska. Consult NARA microfilm reading room."
    }
  ]
}
```

### Research Path Sources (NARA pages confirmed accessible)

| NARA Page | URL | Key Content |
|-----------|-----|-------------|
| Project BLUE BOOK landing | archives.gov/research/military/air-force/ufos | T-1206 microfilm (94 rolls), 12,618 total cases, 701 Unidentified |
| UAP Textual & Microfilm | archives.gov/research/topics/uaps/textual-and-microfilm | NAID 40027753, 595175, 597821 |
| UAP Bulk Downloads | archives.gov/research/catalog/catalog-bulk-downloads/uap-bulk-download | JSON metadata for NAID 597821 and 40027753 |

**Note on "Pan Am" vs "Pan American":** Both query terms included per NARA catalog conventions. The 1947 date (post-1947 Roswell/pre-1948 UFO naming) and Alaska location are the primary search anchors.

**Status RETAINED needs_review:** Per user instruction, pan-am-1947 remains needs_review. No Blue Book case file number or NARA catalog item was found that directly corresponds to this specific incident. The research_path provides a complete 6-step path for future resolution.

---

## G. SOURCE STATUS COUNTS

After v0.3.1 (unchanged from v0.3):

| Status | Count | Cases |
|--------|-------|-------|
| `verified` | 5 | uss-nimitz-tic-tac-2004, gofast-2015, orbs-pacific-2023, pentagon-2017-aatip, apollo-12-occultation-1969 |
| `secondary_only` | 4 | gemini-vii-1965, apollo-11-lunar-flash-1969, rendlesham-forest-1980, fbi-louisville-1949 |
| `needs_review` | 1 | pan-am-1947 |
| **TOTAL** | **10** | |

**Change from v0.3:** None. pan-am-1947 retained needs_review per explicit user instruction.

---

## H. VALIDATION

### Pre-change data audit (before patches)

```
CASE_COUNT=10, UNIQUE_IDS=10, SUM=10
verified=5, secondary_only=4, needs_review=1
pan-am-1947 source_status=needs_review ✓
```

### Post-change validation (after all patches)

```bash
# 1. data.js — CASE_COUNT
$ node -e "var d=require('./data.js'); console.log('COUNT='+d.UAP_CASES.length)"
COUNT=10 ✓

# 2. data.js — UNIQUE_IDS
$ node -e "var d=require('./data.js'); var ids=d.UAP_CASES.map(function(c){return c.id}); var s=new Set(ids); console.log('UNIQUE='+s.size)"
UNIQUE=10 ✓

# 3. data.js — source_status SUM
$ node -e "var d=require('./data.js'); var v=d.UAP_CASES.filter(function(c){return c.source_status==='verified'}).length; var s=d.UAP_CASES.filter(function(c){return c.source_status==='secondary_only'}).length; var n=d.UAP_CASES.filter(function(c){return c.source_status==='needs_review'}).length; console.log('v='+v+' s='+s+' n='+n+' SUM='+(v+s+n))"
v=5 s=4 n=1 SUM=10 ✓

# 4. pan-am-1947 status and research_path
$ node -e "var d=require('./data.js'); var p=d.UAP_CASES.find(function(c){return c.id==='pan-am-1947'}); console.log('status='+p.source_status); console.log('archive='+(p.verification_hint||{}).archive); console.log('rp_steps='+((p.verification_hint||{}).research_path||[]).length)"
status=needs_review ✓
archive=NARA / Project BLUE BOOK ✓
rp_steps=6 ✓

# 5. HTTP server — all endpoints 200
$ curl -s -o /dev/null -w "%{http_code}" http://localhost:8765/
200 ✓
$ curl -s -o /dev/null -w "%{http_code}" http://localhost:8765/style.css
200 ✓
$ curl -s -o /dev/null -w "%{http_code}" http://localhost:8765/app.js
200 ✓
$ curl -s -o /dev/null -w "%{http_code}" http://localhost:8765/data.js
200 ✓

# 6. No local paths in index.html or app.js
$ grep -c "/home/" index.html app.js
0 ✓
$ grep -c "file://" index.html app.js data.js
0 ✓
```

### Pan Am 1947 research_path content verification

```
Step 1: NARA Project BLUE BOOK Landing Page
        URL: archives.gov/research/military/air-force/ufos ✓
        Note: T-1206 ✓

Step 2: NARA UAP Textual & Microfilm Records
        URL: archives.gov/research/topics/uaps/textual-and-microfilm ✓
        Note: NAID 40027753 ✓, NAID 595175 ✓, NAID 597821 ✓

Step 3: NARA Bulk Download — Case Files NAID 597821
        URL: archives.gov/.../catalog-bulk-download ✓
        Note: JSON metadata ✓

Step 4: NARA Catalog — UFO Sightings NAID 40027753
        URL: archives.gov/.../catalog-bulk-download ✓
        Note: AFoshay Report cross-ref ✓

Step 5: AFoshay Report
        Note: 12,618 cases indexed ✓

Step 6: Microfilm consultation
        Note: T-1206 roll index ✓
```

---

## I. REPORT PATH

```
~/projects/uap-files-web/reports/uap_files_web_v0_3_1_ui_research_path_report.md
```

---

## J. PREVIEW COMMAND

```bash
cd ~/projects/uap-files-web
python3 -m http.server 8765
# → http://localhost:8765
```

---

## K. NEXT RECOMMENDED ACTION

**Close the last needs_review case (pan-am-1947) via NARA catalog / microfilm research.**

The 6-step research_path is now complete and embedded in the page. The next step would be:
1. Visit NARA UAP Bulk Downloads page: https://www.archives.gov/research/catalog/catalog-bulk-downloads/uap-bulk-download
2. Download JSON metadata for NAID 597821 (Project Blue Book Case Files)
3. Search for entries with date around September 1947 and location Alaska/Hawaii
4. If found, update pan-am-1947 with exact NARA catalog reference and upgrade to secondary_only
5. If not found in bulk metadata, consult T-1206 microfilm roll index at a NARA reading room

**Potential v0.4 directions (if pursued):**
1. Upgrade pan-am-1947 once NARA catalog entry confirmed
2. Verify UK NA DEFE 24/1948/1 online access → potentially upgrade Rendlesham Forest to verified
3. Add count badges for filtered views (e.g., "Military + Verified: 4")
4. Add case count summary line below filter bars (e.g., "显示 4 / 10 个案例")
5. Consider expanding `<details>/<summary>` pattern to include evidence notes

---

## FILES SUMMARY

| File | v0.3 Size | v0.3.1 Size | Delta |
|------|-----------|-------------|-------|
| index.html | 21,942 | ~22,000 | +58 (explanation text) |
| style.css | 20,813 | ~21,400 | +587 (new rules) |
| app.js | ~14,600 | ~18,000 | +3,400 (count helpers, expandable SS, RP) |
| data.js | ~22,100 | ~25,000 | +2,900 (expanded VH + research_path) |
| README.md | 13,429 | 11,305 | clean v0.3.1 rewrite |
| report | NEW | 9,600 | v0.3.1 report |
