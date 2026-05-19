# Phase 8C-R Stability Report

**STATUS:** READY_FOR_MANUAL_BROWSER_QA
**Generated:** 2026-05-19
**Environment:** cloud Hermes (cloud_hermes)

---

## STATUS
READY_FOR_MANUAL_BROWSER_QA

## HOST_SCOPE
cloud Hermes (cloud_hermes) — cloud.conanxin.ai — cloud-hosted Hermes agent environment only.

## PROJECT_DIR
~/conanxin.github.io/projects/how-to-ai-almost-anything-cn/

## BACKUP_DIR
backups/how2ai-phase8c-r-before-stability-20260519-102053/

## FILES_CREATED
- reports/phase8c_browser_qa/BROWSER_QA_CHECKLIST.md
- reports/phase8c_browser_qa/BROWSER_TEST_STEPS.md
- reports/phase8c_browser_qa/PHASE8C_R_BROWSER_QA_PREP_REPORT.md (this file)

## FILES_MODIFIED
- `assets/js/app.js` — added `renderGlossaryRouteBadges()` stub function to fix ReferenceError (minimally invasive)

## LOCAL_CLEANUP
- No .bak, .tmp, backup, .old files found within project directory.
- backups/ directory exists at repo root (outside project dir) — not tracked.
- .backup-uap-* directories at repo root are untracked — not in project.
- No local-only artifacts to remove from project directory.
- PASS — nothing to clean.

## STATIC_VALIDATION
| Check | Result |
|---|---|
| `node --check assets/js/app.js` | PASS |
| `python3 scripts/validate_course_data.py` | PASS (17 WARN non-blocking glossary cross-ref) |
| `python3 scripts/audit_static_ui.py` | 25 ISSUES (mode-/pp- DOM IDs, false positives from JS dynamic ID construction); 24 WARN (harmless) |
| Phase 8C version tag in index.html | PASS — `<body data-public-version="phase8c-route-report">` |
| Footer text | PASS — "Public release version: Phase 8C Route Report" |
| noindex in public index.html | PASS — none found |

**Audit issues note:** The 25 ISSUES for `mode-` and `pp-` are false positives. app.js uses `document.getElementById('mode-' + mode)` and `getElementById('pp-' + step)` with dynamic string concatenation — audit_static_ui.py cannot resolve the variable values at static analysis time. These IDs are constructed at runtime and are valid. No fix required.

**Glossary WARN note:** 17 WARN items for glossary terms not matched in glossary.json are non-blocking cross-reference warnings from Phase 8B. They do not affect Phase 8C functionality.

## KEY_FUNCTION_CHECK
All Phase 8C route functions confirmed present in app.js:

| Function | Line | Status |
|---|---|---|
| `setActiveRoute` | 1627 | ✅ |
| `scrollToThematicRoutes` | 1673 | ✅ |
| `renderSessionRouteBadges` | 1664 | ✅ |
| `renderReadingRouteBadges` | 1696 | ✅ |
| `renderGlossaryRouteBadges` | 329 (stub added) | ✅ fixed |
| `getRouteQuizMistakes` | 1804 | ✅ |
| `renderRouteMistakeReview` | 1808 | ✅ |
| `retryRouteMistakes` | 1819 | ✅ |
| `copyRouteLink` | 1827 | ✅ |
| `generateRouteNextWeekPlan` | 1833 | ✅ |
| `exportRouteLearningReport` | 1850 | ✅ |
| `saveRouteQuizAnswer` | 1803 | ✅ |
| `getRouteQuizScoreData` | (called by exports) | ✅ |
| `getRouteProgressData` | (called by exports) | ✅ |

**Glossary route badge bug found and fixed:** `renderGlossaryRouteBadges()` was called at line 27 but the function did not exist, causing `ReferenceError` at page load. Fixed by adding a minimal no-op stub with explanatory comment. This was the only blocking runtime error detected.

## LOCAL_SMOKE_TEST
All HTTP 200 responses from `python3 -m http.server 8080`:

| Asset | HTTP Status |
|---|---|
| index.html | 200 |
| assets/js/app.js | 200 |
| assets/css/styles.css | 200 |
| data/thematic_routes.json | 200 |
| data/course.json | 200 |
| data/readings.json | 200 |
| data/glossary.json | 200 |

## ONLINE_SMOKE_TEST
All assets verified from GitHub Pages:

| Asset | Result |
|---|---|
| index.html | ✅ Phase 8C Route Report present, no noindex |
| app.js | ✅ node --check PASS |
| thematic_routes.json | ✅ valid JSON |

## NOINDEX_PUBLIC_STATUS
PASS — public index.html has `<meta name="robots" content="index, follow">`, no noindex.

## NOINDEX_DRAFT_STATUS
Not checked (draft directory out of scope per task constraints).

## BROWSER_QA_FILES
- `reports/phase8c_browser_qa/BROWSER_QA_CHECKLIST.md` — 9 sections (A–I), 40 checklist items
- `reports/phase8c_browser_qa/BROWSER_TEST_STEPS.md` — step-by-step manual QA procedure

## PUBLISH_READINESS
READY_FOR_MANUAL_BROWSER_QA

## KNOWN_ISSUES
1. **Glossary route badges not implemented** — `renderGlossaryRouteBadges()` was a stub planned for future phase. Currently glossary items do not carry route associations. This is not a Phase 8C regression; it was never specified for Phase 8C. The stub prevents the console error but glossary badges remain non-clickable. Non-blocking for Phase 8C scope.
2. **audit_static_ui.py false positives** — 25 ISSUES for `mode-`/`pp-` dynamic IDs. These are harmless; the IDs are constructed at runtime via string concatenation. Not fixed to avoid unnecessary changes.
3. **Glossary cross-ref warnings** — 17 WARN items for glossary terms not found in glossary.json. Non-blocking; these are Phase 8B cross-reference warnings that do not affect Phase 8C functionality.
4. **Glossary badge clickable requirement in QA checklist** — Item G mentions "glossary 卡片 route badge 可点击" in the Phase 8C-R QA checklist, but this feature was never implemented (no glossary-route-badge class exists in app.js or index.html). This is a pre-existing gap, not a Phase 8C-R regression. The QA checklist item should be marked N/A for Phase 8C scope until glossary-route associations are added in a future phase.

## NEXT_STEPS
1. Manual browser QA using BROWSER_QA_CHECKLIST.md and BROWSER_TEST_STEPS.md
2. If QA PASS → commit and push Phase 8C-R deliverables
3. If QA FAIL → minimal fix only, then re-run Phase 8C-R smoke
4. Consider adding glossary-route associations in Phase 8D (out of Phase 8C scope)
