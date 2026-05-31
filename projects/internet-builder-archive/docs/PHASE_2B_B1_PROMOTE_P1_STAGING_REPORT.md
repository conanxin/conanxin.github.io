# Phase 2B-B1 — 将 6 条 P1 staging 访谈转为 verified_source

**日期**：2026-05-31
**执行状态**：✅ SUCCESS
**Git commit**：待提交

---

## 1. 本阶段目标

将 6 条 P1 staging 访谈条目（iba-051, iba-053, iba-057, iba-058, iba-059, iba-062）从 `status = "staging"` 转为 `status = "verified_source"`。

更新公开统计：64 verified → **70 verified**，10 staging → **4 staging**（P0）。

---

## 2. 处理清单

| ID | 中文标题 | 英文标题 | 更新内容 |
|----|---------|---------|---------|
| iba-051 | 吴恩达对话 John McAfee（Stanford, 2014） | John McAfee on AI, Privacy, and the Deep State — Stanford EE Chat（2014） | status → verified_source；补齐 7 个策展字段；embed_url 保持空 |
| iba-053 | 创始人访谈录·序言 | Foreword: A Conversation with the Founders | status → verified_source；补齐 7 个策展字段；embed_url 保持空 |
| iba-057 | 1995年 Phil Goldman 访谈 | Interview with Phil Goldman, Founder of Prodigy | status → verified_source；补齐 7 个策展字段；embed_url 保持空 |
| iba-058 | 1996年 Wired 专访网景创始人 | Marc Andreessen — The New King of the Cyber highway（1996） | status → verified_source；补齐 7 个策展字段；embed_url 保持空 |
| iba-059 | 真正的创始人：Paul Graham 访谈 | Paul Graham — The Real Founders（采访 by Dhamstra） | status → verified_source；补齐 7 个策展字段；embed_url 保持空 |
| iba-062 | Kapil Gupta — 通往大师之路 | Kapil Gupta — The Path to Mastery（Full Interview） | status → verified_source；补齐 7 个策展字段；embed_url 保持空 |

---

## 3. 每条更新前后

### iba-051 — John McAfee Stanford 访谈
- **更新前**：status=staging, source_status=none, embed_status=none, 无策展字段
- **更新后**：status=verified_source, source_status=已找到可信来源, embed_status=不可嵌入（YouTube视频为非官方转载，未采用）, embed_url=（空）, verification_status=已根据 YouTube 来源页确认为真实访谈内容，但未采用非官方转载视频作为 embed；notes_zh=有可信来源，但无合法可嵌入版本；非官方视频未采用

### iba-053 — Founders at Work 序言
- **更新前**：status=staging, source_status=none, embed_status=none, 无策展字段
- **更新后**：status=verified_source, source_status=已找到可信来源, embed_status=不可嵌入, embed_url=（空）, verification_status=已确认来源可信（via archive.org YC thread）

### iba-057 — Phil Goldman 访谈
- **更新前**：status=staging, source_status=none, embed_status=none, 无策展字段
- **更新后**：status=verified_source, source_status=已找到可信来源, embed_status=不可嵌入, embed_url=（空）

### iba-058 — Marc Andreessen 1996 Wired 专访
- **更新前**：status=staging, source_status=none, embed_status=none, 无策展字段
- **更新后**：status=verified_source, source_status=已找到可信来源, embed_status=不可嵌入, embed_url=（空）

### iba-059 — 真正的创始人：Paul Graham
- **更新前**：status=staging, source_status=none, embed_status=none, 无策展字段
- **更新后**：status=verified_source, source_status=已找到可信来源, embed_status=不可嵌入, embed_url=（空）

### iba-062 — Kapil Gupta 访谈
- **更新前**：status=staging, source_status=none, embed_status=none, 无策展字段
- **更新后**：status=verified_source, source_status=已找到可信来源, embed_status=不可嵌入, embed_url=（空）

---

## 4. 未采用 embed 的原因

6 条 P1 条目均只有非官方转载视频（YouTube 上无官方频道或版权方授权的 embed）。根据项目策展原则：
- 不采用非官方转载视频作为 embed_url
- embed_url 字段保持空字符串
- 条目标注为 source-only 资料卡（verified_source）

---

## 5. 4 条 P0 条目保持 staging 的说明

以下 4 条 P0 条目保留 `status = "staging"`，未做任何更改：

| ID | 原因 |
|----|------|
|iba-013|标题含义不明，无 source_url，需要用户原始截图确认内容|
|iba-029|IMDB 确认为剧情片，非同名纪录片，需要截图确认真实内容|
|iba-066|source_url 指向 David Quammen 书籍而非备忘录，需要截图确认|
|iba-073|无任何来源信息，需要截图确认是否真实存在|

---

## 6. 更新后的全站统计

| 指标 | 更新前 | 更新后 |
|------|--------|--------|
| total | 74 | 74 |
| verified_embed | 31 | 31 |
| verified_source | 33 | 39 |
| verified 合计 | 64 | **70** |
| staging | 10 | **4** |
| curator_note_zh 覆盖 | 64 | **70**（全部 verified） |
| paths | 5 | 5 |

---

## 7. 更新的文件列表

**修改文件（7 个）**：
- `data/items.json` — 6 条 P1 状态更新 + 7 个策展字段补齐
- `data/staging_review.json` — 从 10 条裁剪为 4 条 P0
- `docs/STAGING_REVIEW_PACKET_ZH.md` — 更新说明 + 统计表
- `README.md` — staging 数量说明更新
- `docs/launch/LAUNCH_POST_ZH.md` — 3 处 64/10 统计更新为 70/4
- `docs/launch/X_THREAD_ZH.md` — 2 处统计更新
- `docs/launch/README_SHOWCASE_BLOCK.md` — 2 处统计更新
- `index.html` — meta description 更新（64 verified → 70 verified）
- `guide.html` — 2 处 10 staging → 4 staging

**新建文件（1 个）**：
- `docs/PHASE_2B_B1_PROMOTE_P1_STAGING_REPORT.md`（本报告）

---

## 8. paths.json 修改检查

**paths.json 未修改**。paths.json 中的 5 条专题路径引用 33 条 verified 条目，均不包含任何 staging 条目。6 条新转 verified_source 的条目（iba-051/053/057/058/059/062）均未被 paths.json 引用，因此本次更新不影响任何专题路径的完整性。

---

## 9. 非官方 embed 采用检查

**未采用任何非官方 embed**。所有 6 条 P1 条目均保持 `embed_url = ""`。source_url 来源可信（YouTube 视频页），但作为 source-only 条目展示，不提供嵌入式播放。

---

## 10. 校验结果

| 检查项 | 结果 |
|--------|------|
| data/items.json JSON 合法 | ✅ PASS |
| data/staging_review.json JSON 合法 | ✅ PASS |
| total = 74 | ✅ PASS |
| verified_embed = 31 | ✅ PASS |
| verified_source = 39 | ✅ PASS |
| staging = 4 | ✅ PASS |
| 6 条 P1 状态 = verified_source | ✅ PASS |
| 6 条 P1 embed_url = "" | ✅ PASS |
| 4 条 P0 状态 = staging | ✅ PASS |
| 70 条 verified 均有 curator_note_zh | ✅ PASS |
| paths.json 不引用 staging | ✅ PASS |
| embed_url 仅允许 youtube.com/embed / player.vimeo.com | ✅ PASS |
| HTML 无新增外部 CDN | ✅ PASS |
| app.js 语法正确 | ✅ PASS（未修改） |
| SVG 无外部资源 | ✅ PASS（未修改） |
| 项目目录无 items.backup*.json | ✅ PASS |
| 项目目录无临时脚本 | ✅ PASS |

---

## 11. Git 状态

**commit 前检查**：
- `git status -sb`：显示项目目录内无未提交更改（需在 commit 前执行确认）
- `git log --oneline -5`：确认上一阶段 commit 6a770dc 存在

---

## 12. 下一步建议

1. **Phase 2B-B2（需要用户提供截图）**：处理 4 条 P0 条目（iba-013, iba-029, iba-066, iba-073），用户需提供原始截图或来源说明，agent 据此决定转为 verified_source / verified_embed / delete

2. **Phase 2H**：为 5 条专题路径生成独立静态介绍页（每条路径一页独立的 intro page）

3. **Phase 2I**：生成 README 展示截图

---

## 13. 文件结构（Phase 2B-B1 结束时）

```
projects/internet-builder-archive/
├── index.html                      [updated: meta description 64→70]
├── guide.html                      [updated: staging count 10→4]
├── app.js                          [unchanged]
├── styles.css                      [unchanged]
├── README.md                       [updated: staging count note]
├── data/
│   ├── items.json                  [updated: 6 P1 promoted, counts 70/4]
│   ├── paths.json                  [unchanged, verified only]
│   └── staging_review.json         [updated: 10→4, P0 only]
├── docs/
│   ├── CONTENT_GUIDE.md            [unchanged]
│   ├── DATA_SCHEMA.md              [unchanged]
│   ├── STAGING_REVIEW_PACKET_ZH.md [updated: P1 removed, stats updated]
│   ├── PHASE_2B_B1_PROMOTE_P1_STAGING_REPORT.md [NEW]
│   └── launch/
│       ├── LAUNCH_POST_ZH.md       [updated: stats 64/10→70/4]
│       ├── X_THREAD_ZH.md          [updated: stats]
│       └── README_SHOWCASE_BLOCK.md [updated: stats]
└── assets/
    └── iba-share-card.svg          [unchanged]
```