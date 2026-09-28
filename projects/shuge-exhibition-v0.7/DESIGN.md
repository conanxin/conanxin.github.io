# SHUGE Digital Humanities Exhibition — DESIGN.md (v0.2)

> 数字博物馆 × 学术实验室风格  
> Version: 0.2 — 2026-09-28  
> 继承: [v0.1 DESIGN.md](https://github.com/conanxin/conanxin.github.io/tree/main/projects/shuge-exhibition-v0.1/DESIGN.md)

---

## 0. 一句话定位

「书格数字人文研究站 v0.2」是一个**公开展示**项目研究过程的网页展览。观众沿着五个"展厅"走过去，会理解本项目如何把 Shuge.org 上零散的古籍数字化资料组织成可检索、可引证、可治理的研究基础设施。

不是 CMS，不是 dashboard，不是 search portal，也不是 AI 聊天机器人 — 是**策展人写给公众的展览说明**。

---

## 1. 与 v0.1 的关系

| 维度 | v0.1 | v0.2 |
|---|---|---|
| 定位 | 静态原型 | 数字人文**展览** |
| 信息架构 | 4 个并列栏目 | 5 个**展厅**（叙事优先）+ 1 个总览 |
| 关键组件 | 卡片、徽章、accordion | + evidence cards、citation viewer、page image viewer framework、map placeholder |
| 数据导出 | 6 JSON（works / collections / citations / institutions / workspaces / manifest） | + 6 JSON（water_classic_pages、hydrology_pages、architecture_pages、evidence_cards、timeline、map_placeholder）|
| 视觉延续 | 数字博物馆 × 学术实验室 | **完全延续**，v0.2 不引入新颜色或字体 |

v0.2 是 v0.1 的**升级**，不是替换。v0.1 留在原目录，读者可对照阅读。

---

## 2. 信息架构（5 展厅）

| # | 展厅名 | 一句话 | 目标观众 | 主组件 |
|---|---|---|---|---|
| 入口 | / 总览 | 项目说明 + 展厅导览 + 6 项数字徽章 | 所有观众 | stat-row + 展厅卡片 |
| 1 | From Catalogue to Research Infrastructure | 一份书目如何变成研究基础设施？ | 想了解项目方法论的观众 | timeline + 文字叙事 |
| 2 | The Life of a Book: 水经注 Case Study | 一部书如何被消化、引证、再利用？ | 关心单一作品的观众 | 水经注 60 页列表 + 统计表 |
| 3 | Historical Hydrology & River Defense | "历史水利与河防"集合的来龙去脉 | 历史水利研究者 | hydrology 30 页样本 + 集合治理 |
| 4 | Architecture & Construction Knowledge | "建筑营造与工程做法"集合 | 建筑史研究者 | architecture 30 页样本 + 集合治理 |
| 5 | AI-assisted Historical Research | AI 在本项目中的真实角色（不做聊天机器人） | 关心 AI 与历史学的观众 | evidence_cards + 工作区 |

---

## 3. 新增组件规范

### 3.1 Evidence Card（证据卡）

每个证据卡展示**一个研究问答的产出**：问题 + 一条 claim + 一份 evidence ledger。

```
┌────────────────────────────────────────────┐
│ [historical-hydrology]        #234        │
│ 水经注河水出现在哪些页？                    │
│ ────────────────────────────────────────── │
│ claim_type=DIRECT_OBSERVATION · claim_001 │
│ "水经注河水一词共出现于河水篇 32 处…"      │
│ ────────────────────────────────────────── │
│ citation_ids:                              │
│   SHUGE:p124575:1,2,3,4,5,6,7,8,9,10     │
│ ────────────────────────────────────────── │
│ evidence ledger (前 5):                     │
│   p124575:1   · TERM  · 河   · 0.87  ✓    │
│   p124575:1   · PHRASE · 河水 · 0.92 ✓    │
└────────────────────────────────────────────┘
```

**视觉**：
- 卡片背景 `var(--paper-white)`，左侧 3px `var(--seal-red)` 边框
- 集合徽章 + run ID 在右上
- claim 类型用 `<span class="mono">` 等宽
- evidence ledger 用 `<table class="ledger">`，3 列
- 支持展开/收起（默认收起）

### 3.2 Citation Viewer（引文查看器）

从 evidence_cards 引申 — 点击 claim_id 弹出**只读**的引文上下文。

**严格不做的事**：
- ❌ 不打开外部 IIIF 链接（v0.2 没有图片资源）
- ❌ 不暴露 raw OCR 全文（仅展示 120 字预览）
- ❌ 不显示检索路径（retrieval_paths 字段在 v0.2 不导出）

**做的事**：
- 展示 Citation ID
- 展示所属 work + page_seq
- 展示 matched_terms
- 展示 match_type
- 展示 retrieval_score
- 展示 text_reliability
- 展示 review_status

### 3.3 Page Image Viewer Framework（页面图像查看器框架）

v0.2 **不下载、不暴露任何图像**。但提供**框架**，让 v0.3 可以无侵入地接入 IIIF：

- HTML 结构：`<figure class="page-viewer" data-canvas-url="..."><div class="page-viewer-frame"></div><figcaption>...</figcaption></figure>`
- CSS 已为 `.page-viewer`、`.page-viewer-frame` 定义好尺寸 (300×420) + 边框
- JS 提供 `attachPageViewer(selector, url)` — 但 v0.2 调用时不传 url，框架留空 + caption 注明 "v0.2 framework only"

### 3.4 Map Placeholder（地图占位）

东亚汉字文化圈示意范围 + 8 个坐标点（5 部作品 origin + 3 个 archive center）。

**不做的事**：
- ❌ 不调用任何地图瓦片 API
- ❌ 不使用真实经纬度（用 v0.2 内的示意坐标）
- ❌ 不使用 Mapbox / Leaflet / OpenStreetMap JS

**做的事**：
- 用 `<svg viewBox="100 25 45 20">` 绘制一个简化的东亚轮廓 + 8 个点
- 每个点旁标 label + kind (origin / archive)
- 鼠标 hover 显示 tooltip

---

## 4. 视觉规范（继承 v0.1，无新色）

| 元素 | 实施 |
|---|---|
| 主背景 | `#f7f3eb` 宣纸暖白 |
| 主文字 | `#1a1a1a` 墨黑 + `#6b5944` 档案棕（次级）|
| 强调色 | `#8b3a2e` 印章红（仅 hero / 左侧装饰边框）|
| 卡片背景 | `#efe9da` 卡片米色 |
| 分隔线 | 1px solid `#c8bfa9` |
| 字体 | Noto Serif CJK SC + Source Serif 4 + IBM Plex Mono + Source Sans 3 |
| 标点 | 《》书名号 · 「」引号 · 全角句号 |

**禁用**（与 v0.1 一致）：
- ❌ 渐变 / glassmorphism / box-shadow
- ❌ 圆角（border-radius 全部 0）
- ❌ emoji 图标（仅在不得已时使用 § ¶ 之类的印刷符号）
- ❌ 霓虹色 / 鲜艳饱和度

---

## 5. 排版与间距

```
页面宽度：     max-width: 820px
行高：        1.65（正文）/ 1.3（heading）
段间距：      1.5rem
段落首行缩进：  2em（中文段落）
H1 margin:   2.5rem 0 1.5rem
H2 margin:   2.0rem 0 1.0rem
H3 margin:   1.5rem 0 0.5rem
```

---

## 6. 数据层（read-only）

所有数据从 `data/*.json` 异步加载（`fetch()`），**不内嵌**到 HTML：

| 文件 | 用途 |
|---|---|
| `manifest.json` | 总览页 6 个统计徽章 |
| `works.json` | 总览页 9 个精选作品卡 |
| `collections.json` | 入口 1 / 集合展厅详情 |
| `citations.json` | 入口 / 研究展厅 |
| `workspaces.json` | 研究展厅 3 个工作区 |
| `institutions.json` | 总览页（可选）|
| `timeline.json` | 展厅 1 时间线 |
| `evidence_cards.json` | 展厅 5 + 研究展厅 |
| `water_classic_pages.json` | 展厅 2 60 页样本 |
| `hydrology_pages.json` | 展厅 3 30 页样本 |
| `architecture_pages.json` | 展厅 4 30 页样本 |
| `map_placeholder.json` | 入口/展厅 1/3/4 的地图 |

**绝不导出**：
- 数据库路径
- 任何 SQLite 内部信息
- raw OCR 全文（仅 120 字预览）
- IIIF image URL（v0.2 框架不暴露）

---

## 7. 与 v0.1 的差异

v0.2 的关键差异是**叙事化**：
- v0.1 = 4 个并列的「栏目」 → 「这里是数据，请自取」
- v0.2 = 5 个「展厅」 → 「观众请沿着这条动线走，我会告诉你每一步看到了什么」

展厅设计遵循**三段式**：开场 → 主体 → 收束。每个展厅最后都有一句"**Take-away**"。

---

## 8. 验收 checklist

- [ ] 5 个展厅页面 + 1 个总览页面 = 6 个静态 HTML
- [ ] 数字博物馆 × 学术实验室风格保持
- [ ] 0 个新下载
- [ ] 0 个数据库写操作
- [ ] evidence cards 在展厅 5 正常渲染
- [ ] citation viewer 在 evidence cards 内可展开
- [ ] page image viewer framework 在展厅 2 展示空白（v0.2 无图像）
- [ ] map placeholder 在入口 + 展厅 1 正常渲染
- [ ] 所有页面通过本地 `python3 -m http.server` 验证 200 OK
- [ ] 提交到 conanxin/conanxin.github.io

---

