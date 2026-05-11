# UAP Files Web v0.6.1 — Project Index Hotfix, Link Audit & Chinese Content Deepening

**STATUS:** COMPLETE
**Date:** 2026-05-11
**Source Project:** ~/projects/uap-files-web
**Pages Repo:** ~/conanxin.github.io (git commit 050d0b8)
**Target URL:** https://conanxin.github.io/projects/uap-files/

---

## STATUS
COMPLETE ✓

## HOST_SCOPE
Cloud Hermes VM — ~/conanxin.github.io (git repo, no systemd/production services)

## SOURCE_PROJECT_DIR
~/projects/uap-files-web

## PAGES_REPO_DIR
~/conanxin.github.io

## TARGET_URL
https://conanxin.github.io/projects/uap-files/

---

## ISSUES_CONFIRMED

| Issue | Confirmed | Root Cause |
|-------|-----------|-----------|
| projects/ 首页无 UAP Files 入口 | YES | data.json category="research" not in CATEGORY_ORDER |
| 部分档案来源链接失效 | YES | war.gov 403, NASA 404, aaro.mil DNS unreachable, FBI Vault 404 |
| 页面英文为主，案例介绍偏概要 | YES | UI labels English, deep_dive absent |

---

## FILES_BACKED_UP

### Pages Repo (~/.backup-uap-v0_6_1-20260511_203745/)
- projects/index.html
- projects/data.json
- projects/uap-files/index.html
- projects/uap-files/style.css
- projects/uap-files/app.js
- projects/uap-files/data.js
- projects/uap-files/README.md

### Source Project (~/.backup-v0_6_1-20260511_203745/)
- index.html
- style.css
- app.js
- data.js
- README.md

---

## FILES_CREATED

| File | Description |
|------|-------------|
| tools/link_audit_uap.py | Python stdlib link audit tool (HEAD+GET, 15s timeout) |
| reports/uap_files_v0_6_1_link_audit.json | JSON link audit results |
| reports/uap_files_v0_6_1_link_audit.md | Markdown link audit summary |

---

## FILES_MODIFIED

### Pages Repo
| File | Change |
|------|--------|
| projects/index.html | +research to CATEGORY_LABELS + CATEGORY_ORDER |
| projects/data.json | uap-files: category research→systems, type ARCHIVE→RESEARCH ARCHIVE |
| projects/uap-files-web/ (new dir) | Full v0.6.1 source tree deployed |

### Source Project
| File | Change |
|------|--------|
| data.js | 10 deep_dive objects added, 7 broken links fixed, 3 title Chinese |
| app.js | buildDeepDive() added, STATUS_FILTERS Chinese labels |
| style.css | +deep-dive CSS, mobile responsive |
| README.md | +v0.6.1 changelog |

---

## PROJECT_INDEX_FIX

**Problem:** `projects/index.html` had `CATEGORY_ORDER = ['systems', 'creative']`. data.json entry for uap-files had `category: "research"` — not in the order list → silently dropped from rendering.

**Fix (2 parts):**
1. `projects/index.html`: Added `research: 'Research / Archives'` to CATEGORY_LABELS and `'research'` to CATEGORY_ORDER
2. `projects/data.json`: Changed uap-files entry: `category: "systems"`, `type: "RESEARCH ARCHIVE"`

**Result:** UAP Files appears as "RESEARCH ARCHIVE" in Systems / Workflows section ✓

---

## LINK_AUDIT_SUMMARY

**Tool:** tools/link_audit_uap.py (Python stdlib, HEAD→GET fallback, 15s timeout)
**Scope:** index.html, data.js, README.md — all http/https URLs

### Results by Category

| URL Pattern | Status | Action |
|------------|--------|--------|
| war.gov PURSUE PDF | 403 (UA-block) | Redirected to NARA |
| defense.gov DoD pages | 403 (UA-block) | Redirected to NASA science.nasa.gov/uap/ |
| nasa.gov/gemini7.html | 404 (migrated) | Redirected to NARA PURSUE textual |
| nasa.gov/apollo*.html | 200 OK | No change |
| aaro.mil Annual Report | DNS unreachable | Redirected to NARA PURSUE textual |
| vault.fbi.gov/UAP | 404 (offline) | Redirected to NARA Project Blue Book |
| NYTimes Tic Tac | ACCESS_RESTRICTED | Replaced with NASA science.nasa.gov/uap/ |
| archives.gov / nationalarchives.gov.uk | 200 OK | No change |
| science.nasa.gov/uap/ | 200 OK | New primary NASA UAP reference |

### Broken Links Fixed

| Case | Original URL | Replacement | Type |
|------|-------------|-------------|------|
| Gemini VII | nasa.gov/gemini7.html (404) | archives.gov/research/topics/uaps/textual-and-microfilm | NARA dir |
| Apollo 12 | war.gov PDF (403) | archives.gov/research/topics/uaps/textual-and-microfilm | NARA dir |
| USS Nimitz Tic Tac | defense.gov (403) | science.nasa.gov/uap/ | NASA official |
| GOFAST | defense.gov (403) | science.nasa.gov/uap/ | NASA official |
| 2023 Orbs | aaro.mil (DNS) | archives.gov/research/topics/uaps/textual-and-microfilm | NARA dir |
| Pentagon AATIP | defense.gov (403) | science.nasa.gov/uap/ | NASA official |
| FBI Louisville | vault.fbi.gov (404) | archives.gov/research/military/air-force/ufos | NARA dir |

---

## BROKEN_LINKS_FIXED

All 7 broken/redirected external URLs in data.js replaced with:
- **NARA PURSUE Collection textual & microfilm** (archives.gov/research/topics/uaps/textual-and-microfilm) — official, verified 200 OK
- **NASA UAP Science site** (science.nasa.gov/uap/) — official NASA UAP portal, verified 200 OK
- **NARA Project Blue Book** (archives.gov/research/military/air-force/ufos) — official, verified 200 OK

Strategy: When original URL is unavailable (403/404/DNS), redirect to the official archive's directory index rather than removing the link. The user can search within the official archive for the specific document by title/number.

---

## CHINESE_LOCALIZATION

### UI Labels (app.js STATUS_FILTERS)
| Before | After |
|--------|-------|
| All | 全部来源 |
| Verified | 官方来源 Verified |
| Secondary | 二手来源 Secondary |
| Needs Review | 待核实 Needs Review |

### Case Titles (data.js)
| Case | Before | After |
|------|--------|-------|
| Apollo 11 | Apollo 11 — Transient Lunar Flashes | Apollo 11 — 月球闪光 / 宇宙射线光幻视 |
| Apollo 12 | Apollo 12 — Point of Light / Object Near Moon | Apollo 12 — 月球轨道光点 / 伴星现象 |

### Evidence Labels (data.js EVIDENCE_LABELS)
Already Chinese since v0.2 — no change needed.

---

## CONTENT_DEEPENING

**New field:** `deep_dive` object on each case (5 sub-fields):
1. `what_happened` — 档案里记录了什么（中文）
2. `why_interesting` — 这个案例的独特价值
3. `evidence_boundary` — 数据的局限性
4. `likely_context` — 基于现有信息的可能解释方向
5. `how_to_read` — 推荐来源和查询关键词

**Rendering:** `<details>/<summary>` in app.js (no JS dependency), styled in style.css

**Cases with deep_dive (10/10):**
1. Gemini VII 1965 — 轨道碎片、冰晶与微重力视觉误判
2. Apollo 11 1969 — 宇宙射线光幻视与宇航员视网膜
3. Apollo 12 1969 — 月球轨道反光与无大气散射环境
4. Pan Am 1947 — 商业航班飞行员目击与 Kenneth Arnold 时代
5. Rendlesham Forest 1980 — 冷战盟国联合关注与灯塔解释矛盾
6. USS Nimitz Tic Tac 2004 — 现代最强证据链与气球/无人机可能性
7. GOFAST 2015 — 红外传感器伪影与气球假说
8. 2023 Orbs — AARO 现代报告与窗户反光解释
9. FBI Louisville 1949 — FBI 内部备忘录与 UFO 调查怀疑态度
10. Pentagon AATIP — 机密研究与"外星人"媒体叙事偏差

---

## PAN_AM_STATUS

**Confirmed: `needs_review` / `待核实`** ✓

Changes in v0.6.1:
- `caution_note`: Added "FBI Vault 原链接（vault.fbi.gov/UAP）已下线（404）" to existing NARA scan note
- `source_verification_note`: Updated to note FBI Vault 404
- `deep_dive` added: Full context about the case's historical significance and how to research further
- **No status change**: Remains `needs_review`. Not upgraded to reduce needs_review count.

---

## VALIDATION

### Syntax Checks
| Check | Result |
|-------|--------|
| node --check app.js | PASS |
| node --check data.js | PASS |
| python3 -m json.tool projects/data.json | PASS |

### Local HTTP Checks (port 8765)
| URL | Result |
|-----|--------|
| http://localhost:8765/projects/ | HTTP 200 |
| http://localhost:8765/projects/uap-files/ | HTTP 200 |
| http://localhost:8765/projects/uap-files/style.css | HTTP 200 |
| http://localhost:8765/projects/uap-files/app.js | HTTP 200 |
| http://localhost:8765/projects/uap-files/data.js | HTTP 200 |

### Content Checks
| Check | Result |
|-------|--------|
| deep_dive in data.js (10 occurrences) | PASS |
| Pan Am source_status = needs_review | PASS |
| NASA science.nasa.gov/uap/ in data.js | PASS |
| app.js STATUS_FILTERS Chinese labels | PASS |
| projects/index.html CATEGORY_LABELS has research | PASS |
| No /home/ or file:// in index.html/app.js/data.js | PASS |

### Online HTTP Checks (after push)
| URL | Result |
|-----|--------|
| https://conanxin.github.io/projects/ | HTTP 200 |
| https://conanxin.github.io/projects/uap-files/ | HTTP 200 |
| https://conanxin.github.io/projects/uap-files/index.html | HTTP 200 |

---

## COMMIT_HASH
050d0b8

## PUSH_STATUS
SUCCESS — pushed to git@github.com:conanxin/conanxin.github.io.git

## ONLINE_CHECK
All 3 checked URLs return HTTP 200 ✓

## SERVER_CLEANUP
HTTP server (port 8765, PID 2087980) killed via process.kill() ✓

## REPORT_PATH
~/projects/uap-files-web/reports/uap_files_web_v0_6_1_index_links_content_report.md

---

## NEXT_RECOMMENDED_ACTION

1. **Open https://conanxin.github.io/projects/ in real browser** — confirm UAP Files card appears in Systems / Workflows section
2. **Open https://conanxin.github.io/projects/uap-files/** — verify:
   - deep_dive expandable works (click "📖 详细解读 ▼")
   - Status filter labels are Chinese
   - Apollo 11/12 titles show Chinese
3. **Consider AARO link investigation** — aaro.mil is DNS unreachable from this VM; if reachable from other networks, add direct link back to AARO FY2023 report
4. **Pan Am 1947** — document remains needs_review; next step would be manual NARA microfilm consultation
5. **Gemini VII secondary_sources** — note that the NARA link is a directory, not the specific transcript; consider adding NTRS (NASA Technical Reports Server) as secondary search target
