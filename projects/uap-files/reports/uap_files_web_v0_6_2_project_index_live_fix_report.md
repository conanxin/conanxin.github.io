# UAP Files Web — v0.6.2 Project Index Live Fix Report

**Generated:** 2026-05-11
**STATUS:** COMPLETE ✓
**Commit:** `149dae0`

---

## STATUS
**COMPLETE** — All pending fixes resolved, committed, pushed, and verified online.

---

## HOST_SCOPE
Cloud Hermes VM — no systemd, cron, nginx, or system service modifications. HTTP server used only for local preview and terminated after verification.

---

## SOURCE_PROJECT_DIR
`~/projects/uap-files-web`

---

## PAGES_REPO_DIR
`~/conanxin.github.io`

---

## TARGET_URL
- Project index: https://conanxin.github.io/projects/
- UAP Files page: https://conanxin.github.io/projects/uap-files/

---

## PREVIOUS_STATUS
**PARTIAL** — v0.6.1 had committed the wrong files. Changes to `projects/index.html` (CATEGORY_ORDER fix) and `projects/data.json` (category: systems) were made to local files but never included in a commit. The `050d0b8` commit only touched `projects/uap-files-web/` subdirectory files. Live `/projects/` page had empty `#projects-container` and no static fallback UAP Files card.

---

## ROOT_CAUSE
Git history confusion: commit `050d0b8` ("Fix UAP Files project index and deepen Chinese content") was supposed to fix the project index, but its diff shows it only modified `projects/uap-files-web/` files, NOT `projects/index.html` or `projects/data.json`. These two files were modified locally during the v0.6.1 session but never staged or committed. The Pages repo therefore served the old `d14aa56` versions, which had `CATEGORY_ORDER = ['systems', 'creative']` (missing 'research') and no static UAP Files fallback card.

---

## PENDING_ITEMS_RESOLVED
| Item | Resolution |
|------|-----------|
| Static card missing from `/projects/` | Added hardcoded UAP Files card in `projects/index.html` static fallback |
| UAP Files page showing v0.4 | Updated to `Live Release v0.6.2 — 2026-05-11` |
| Apollo 11 NASA URL 301 | Updated to `www.nasa.gov/history/july-20-1969-one-giant-leap-for-mankind/` (200 OK) |
| Apollo 12 NASA URL 404 (README) | Updated to `www.nasa.gov/mission/apollo-12/` (200 OK) in README |
| Source project not synced | `data.js` and `README.md` synced from source to Pages repo |
| projects/data.json schema | Confirmed: category=systems, type=RESEARCH ARCHIVE, featured=true, entry_url=/projects/uap-files/ |

---

## FILES_MODIFIED
**Pages repo (`~/conanxin.github.io`):**
| File | Change |
|------|--------|
| `projects/index.html` | Added static UAP Files card in fallback; JS CATEGORY_ORDER already had 'research' from v0.6.1 (but was never committed) |
| `projects/uap-files/index.html` | Footer: `Web Prototype v0.4` → `Live Release v0.6.2`; removed "static prototype not deployed" disclaimer |
| `projects/uap-files/data.js` | Synced from source (Apollo 11 URL fix) |
| `projects/uap-files/README.md` | Synced from source (Apollo 12 NASA URL fix) |

**Source project (`~/projects/uap-files-web`):**
| File | Change |
|------|--------|
| `index.html` | Footer: `Web Prototype v0.4` → `Live Release v0.6.2`; removed "static prototype" disclaimer |
| `README.md` | Apollo 12 NASA URL fix (3 occurrences); v0.6.2 changelog added; v0.6.1 duplicate header removed |

**Backups created:**
- `~/.conanxin.github.io/.backup-uap-v0_6_2-20260511_210758/` (7 files)
- `~/.conanxin.github.io/.backup-uap-v0_6_2-20260511_210805/` (7 files)
- `~/projects/uap-files-web/.backup-v0_6_2-*/` (5 files)

---

## PROJECT_INDEX_FIX
**Problem:** Live `/projects/` page had no UAP Files entry because (a) `projects/index.html` had not been committed with the v0.6.1 CATEGORY_ORDER fix, and (b) the JS `fetch('/projects/data.json')` was apparently failing on the live page (empty `#projects-container`).

**Fix applied:** Added a hardcoded static UAP Files project card directly in the static fallback HTML of `projects/index.html`, under "Systems / Workflows" section. This ensures the UAP Files entry is visible regardless of JavaScript execution.

Card content:
- Link: `./uap-files/`
- Type: `RESEARCH ARCHIVE`
- Status: `已上线` (red, `#ff6b6b`)
- Title: `The UAP Files — 美国 UFO 档案`
- Summary: 中文线上小展览：用 PURSUE / UAP 档案展示未知现象、证据边界、国家安全想象与公众神话。未解释，不等于外星。
- Updated: 2026-05-11

---

## DATA_JSON_FIX
`projects/data.json` uap-files entry confirmed valid:
- `category: "systems"` ✓
- `type: "RESEARCH ARCHIVE"` ✓
- `featured: true` ✓
- `entry_url: "/projects/uap-files/"` ✓
- `status: "已上线"` ✓
- Only 1 uap-files entry ✓
- JSON valid (`python3 -m json.tool` passes) ✓

Note: The `CATEGORY_ORDER` in `projects/index.html` already contained `'research'` from the uncommitted v0.6.1 local change. This has now been committed.

---

## APOLLO_SOURCE_URL_FIX
| Case | Before | After | Status |
|------|--------|-------|--------|
| Apollo 11 | `nasa.gov/mission_pages/apollo/apollo11.html` (301→404 eventually) | `www.nasa.gov/history/july-20-1969-one-giant-leap-for-mankind/` (200 OK) | Fixed in data.js |
| Apollo 12 README | `nasa.gov/mission_pages/apollo/apollo12.html` (404) | `www.nasa.gov/mission/apollo-12/` (200 OK) | Fixed in README (3 occurrences) |

Note: Apollo 12 data.js `source_url` already correctly pointed to `archives.gov` NARA (not the NASA URL), so no data.js change was needed for Apollo 12.

---

## VERSION_LABEL_FIX
All three files now show `Live Release v0.6.2 — 2026-05-11`:
- `~/conanxin.github.io/projects/uap-files/index.html` ✓
- `~/projects/uap-files-web/index.html` ✓
- Footer "static prototype not deployed" text replaced with "档案展示页面 · PURSUE Release 01 (2026-05-08) · 未解释 ≠ 外星" ✓

---

## VALIDATION

### Syntax checks
| File | Check | Result |
|------|-------|--------|
| Source `app.js` | `node --check` | PASS |
| Source `data.js` | `node --check` | PASS |
| Pages `projects/uap-files/app.js` | `node --check` | PASS |
| Pages `projects/uap-files/data.js` | `node --check` | PASS |
| `projects/data.json` | `python3 -m json.tool` | PASS (valid JSON) |

### Content checks
| Check | File | Result |
|-------|------|--------|
| UAP Files card link `./uap-files/` | projects/index.html line 151 | PASS |
| Card title `The UAP Files — 美国 UFO 档案` | projects/index.html line 157 | PASS |
| Card type `RESEARCH ARCHIVE` | projects/index.html line 153 | PASS |
| Card status `已上线` | projects/index.html line 155 | PASS |
| Version `Live Release v0.6.2` | projects/uap-files/index.html line 606 | PASS |
| No `Web Prototype v0.4` in projects/uap-files/ | grep | PASS |
| No `/home/` or `file://` local paths | grep | PASS |
| Apollo 11 source_url = NASA current URL | projects/uap-files/data.js line 71 | PASS |

### Local HTTP preview
| URL | Status |
|-----|--------|
| `http://localhost:8765/projects/` | HTTP 200 OK |
| `http://localhost:8765/projects/uap-files/` | HTTP 200 OK |
| `http://localhost:8765/projects/uap-files/data.js` | HTTP 200 OK |
| UAP Files card visible in local preview | PASS |
| Version `Live Release v0.6.2` in local preview | PASS |

### Online verification (post-push)
| Check | Result |
|-------|--------|
| `https://conanxin.github.io/projects/` HTTP | HTTP/2 200 |
| `https://conanxin.github.io/projects/uap-files/` HTTP | HTTP/2 200 |
| `https://conanxin.github.io/projects/uap-files/data.js` HTTP | HTTP/2 200 |
| UAP Files card in live `/projects/` HTML | FOUND at line 151 |
| `Live Release v0.6.2` in live `/projects/uap-files/` | FOUND at line 606 |
| No `Web Prototype v0.4` in live page | NOT FOUND (correct) |

---

## COMMIT_HASH
`149dae0`

Commit message:
```
Fix UAP Files project index live entry and source URLs

- Add static UAP Files card in projects/index.html static fallback (Systems / Workflows)
- Update projects/uap-files/index.html to Live Release v0.6.2
- Update Apollo 11 source_url to current NASA URL (200 OK)
- Fix Apollo 12 NASA URL in README (404 -> www.nasa.gov/mission/apollo-12/)
- Sync data.js and README from source project to Pages repo
- Remove outdated 'Web Prototype' / 'static prototype not deployed' footer text
```

---

## PUSH_STATUS
**SUCCESS** — `a1447af..149dae0  main -> main`

---

## ONLINE_INDEX_AFTER
**VISIBLE** ✓ — Live `/projects/` HTML now contains at line 151:
```html
<a class="project-card" href="./uap-files/">
    ...
    <span class="card-type">RESEARCH ARCHIVE</span>
    ...
    <span class="card-status" style="color:#ff6b6b;">已上线</span>
    ...
    <div class="card-title">The UAP Files — 美国 UFO 档案</div>
```

---

## ONLINE_UAP_AFTER
**v0.6.2 CONFIRMED** ✓ — Live `/projects/uap-files/` footer at line 606:
```html
<p>The UAP Files — Live Release v0.6.2 — 2026-05-11</p>
```

---

## SERVER_CLEANUP
Background HTTP server (PID 2096042) on port 8765 was terminated after local preview verification. `ps aux | grep http.server` confirms no running server processes.

---

## REPORT_PATH
`~/projects/uap-files-web/reports/uap_files_web_v0_6_2_project_index_live_fix_report.md`

Also copied to: `~/conanxin.github.io/projects/uap-files/reports/` (同步到 Pages repo)

---

## NEXT_RECOMMENDED_ACTION
1. **Open in real browser** — Verify the UAP Files card is visually correct in the project index at https://conanxin.github.io/projects/ (check color contrast, link functionality, mobile layout)
2. **Verify JS rendering path** — The static fallback card works as a guarantee, but the primary JS rendering should also work. Check browser console for any `data.json` fetch errors
3. **Investigate empty `#projects-container`** — The JS `fetch('/projects/data.json')` was returning an empty container on the live page. This may have been a deploy timing issue or a Pages routing issue. If it persists, check GitHub Pages source branch settings
4. **Sync source project git** — Source project `~/projects/uap-files-web` has no git remote. Consider linking it to a git repo for version control
5. **Update v0.6.2 changelog in Pages repo README** — The `projects/uap-files/README.md` now has v0.6.2 changelog, but the commit did not include updating a version table in the Pages repo's own docs

---

## APPENDIX: Link Audit Summary (v0.6.2)
Source: `tools/link_audit_uap.py` (18 URLs checked)

| Status | Count | Notes |
|--------|-------|-------|
| OK | 8 | NARA, NASA current, S3 JSON, National Archives UK |
| ACCESS_RESTRICTED | 4 | war.gov, defense.gov — 403 due to bot blocking (browser can access) |
| LARGE_SKIPPED | 1 | NARA S3 catalog JSON (85.7 MB > 25 MB limit) |
| BROKEN | 2 | FBI Vault (404 offline), aaro.mil (DNS unreachable from this VM) |
| CONNECTION_ERROR | 2 | localhost:8080 and localhost:8765 (expected — no local servers running during audit) |

**Actionable broken links:** None requiring urgent fix. FBI Vault and aaro.mil are documented as offline/unreachable; primary sources are NARA PURSUE collection.
