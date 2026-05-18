# Phase 5A — Draft 部署报告
# How2AI 中文课程页

**STATUS**: PASS ✅
**部署时间**: 2026-05-18
**执行环境**: cloud_hermes
**项目目录**: `~/conanxin.github.io/drafts/how-to-ai-almost-anything-cn/`

---

## STATUS
**PASS** ✅

---

## HOST_SCOPE
cloud_hermes（不涉及本地 Hermes / OpenClaw / 云端 OpenClaw）

---

## PROJECT_DIR
`/home/ubuntu/conanxin.github.io/drafts/how-to-ai-almost-anything-cn/`

---

## BRANCH
`main`

---

## COMMIT_HASH
`3f41111`（前一个本地 `b0bd994` rebase 后推送）

**Commit message:**
```
Add How2AI Chinese course draft — Phase 4 complete
- MIT MAS.S60 中文学习导览 (draft, noindex)
- 27 sessions across 5 modules + Module 0 intro
- 32 curated readings + 85 official readings
- Interactive features: session checklist, notes, reading status, 7 roles
- Static UI audit: 0 issues, all validations passed
- Manual QA docs + browser test steps included
- 3 phase backups preserved for rollback
```

---

## PUSH_STATUS
**SUCCESS** ✅

- 远程有新提交（`694d6f5..515168f`），执行 `git pull --rebase origin main` 成功
- Push: `515168f..3f41111  main -> main`

---

## DRAFT_URL
**https://conanxin.github.io/drafts/how-to-ai-almost-anything-cn/**

> ⚠️ 注意：GitHub Pages 构建需约 30–60 秒，更改推送后需等待方可访问。
> 本报告在推送后 30 秒确认 URL 可访问。

---

## NOINDEX_STATUS
```
✅ <meta name="robots" content="noindex, nofollow"> 存在于线上页面 <head>
✅ 不会被 Google 等搜索引擎索引
✅ 仅可通过直接 URL 访问
```

---

## FILES_COMMITTED
**72 个文件**，包含：

**当前版本**（6 个核心文件）:
- `index.html`
- `assets/css/styles.css`
- `assets/js/app.js`
- `data/course.json`（27 节）
- `data/readings.json`（32 篇）
- `data/official_reading_map.json`（85 篇）
- `data/glossary.json`（47 条）
- `data/sources.json`（36 个）
- `data/original_schedule_map.json`
- `data/raw_schedule_links.json`
- `scripts/validate_course_data.py`
- `scripts/check_links.py`
- `scripts/audit_static_ui.py`
- `docs/MANUAL_QA_CHECKLIST.md`
- `docs/BROWSER_TEST_STEPS.md`
- `docs/CONTENT_AUDIT.md`
- `docs/COURSE_DESIGN_NOTES.md`
- `docs/SOURCE_MAP.md`
- `reports/PHASE2R_PHASE3_REPORT.md`
- `reports/PHASE4_MANUAL_REVIEW_PREP_REPORT.md`
- `reports/link_check_phase2.json/md`
- `reports/link_check_phase3.json/md`

**Phase 备份**（3 个时间戳备份，均含完整快照）:
- `backups/phase2-before-qa-20260518-144218/`（Phase 1 原始）
- `backups/phase2r-phase3-before-20260518-150819/`（Phase 2R+3 备份）
- `backups/phase4-before-manual-qa-20260518-153531/`（Phase 4 备份）

---

## VALIDATION

### 预推送验证
```
✅ validate_course_data.py: 6/6 通过
✅ check_links.py: OK 103 / 需浏览器复核 15 / 需权限 4
✅ audit_static_ui.py: 0 ISSUE（仅 9 个无害 WARN）
✅ noindex: 存在于 index.html
✅ bad phrase: 无"永久 404"/"permanent 404"/"真实 404"
✅ projects/data.json: 未修改（保持原状）
```

---

## ONLINE_SMOKE_TEST

### HTTP 状态码
```
200  /  (首页)
200  /index.html
200  /assets/css/styles.css
200  /assets/js/app.js
200  /data/course.json
200  /data/readings.json
200  /data/official_reading_map.json
200  /data/glossary.json
200  /data/sources.json
9/9 ✅
```

### 页面内容验证（curl 解析）
```
✅ noindex, nofollow — 确认存在于 <head>
✅ hero-title — "How to AI" 可见
✅ tab-btn — 6 个模块按钮存在（all / mod0–4）
```

---

## PUBLISH_BOUNDARY_CHECK

| 边界条件 | 状态 |
|---------|------|
| noindex 保留 | ✅ 未移除 |
| drafts/ 路径保留 | ✅ 未迁移 |
| projects/data.json 未修改 | ✅ |
| projects/ 列表未修改 | ✅ |
| 版权/来源说明保留 | ✅ footer 完整 |
| CNAME 未修改 | ✅ |
| backups/ 保留 | ✅ 3 个备份完整 |
| "永久 404" 文案 | ✅ 无 |

---

## KNOWN_ISSUES

1. **GitHub Pages 构建延迟**: 推送后需 30–60 秒才可在 `conanxin.github.io` 访问
2. **MIT slides 云端 HTTP 000**: 13 个 PDF 在云端 Hermes 不可达，线上状态需用户本地浏览器验证
3. **draft 页面不自动出现在任何公开索引**: 仅可通过直接 URL 访问，适合发布前验收
4. **ACM/ScienceDirect 付费墙**: 4 个学术链接需要机构权限

---

## NEXT_STEPS

### 立即（用户操作）
1. **浏览器打开**: https://conanxin.github.io/drafts/how-to-ai-almost-anything-cn/
2. **执行人工验收**: 按 `docs/BROWSER_TEST_STEPS.md` 完成 Step 1–14
3. **确认 MIT slides**: 在桌面浏览器打开官方 schedule 页面验证 lec2–lec11 PDF 可访问性

### 确认后（发布决策）
4. **决定是否移除 noindex**: 确认无阻塞性问题后，可准备正式发布
5. **可选：迁移到根目录**: 如决定正式上线，可将 `drafts/how-to-ai-almost-anything-cn/` 内容迁移到根目录或 `projects/` 并更新 `projects/data.json`
