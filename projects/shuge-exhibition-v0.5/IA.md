# SHUGE Digital Humanities Exhibition v0.2 — Information Architecture

> 5 Exhibition Rooms + 1 Overview  
> 继承自 v0.1 的 4 个并列栏目  
> 2026-09-28

---

## 总览

v0.2 把 v0.1 的「4 个并列栏目」重组为「**5 个展厅 + 1 个总览**」的叙事结构。每个展厅有明确的**入口**、**主体**、**收束**三段式，观众沿着这条动线走完一次，可以获得：

1. 项目是什么
2. 一部古籍如何被处理
3. 两个研究集合是什么
4. AI 在研究中的真实角色

---

## 站点地图

```
/                                      总览 + 导览
├── rooms/room1/  → From Catalogue to Research Infrastructure
│      └─ timeline (P1 → Exh v0.2) · 9 个里程碑
├── rooms/room2/  → The Life of a Book: 水经注 Case Study
│      └─ 60 页样本 · 4 个统计 · page image viewer framework
├── rooms/room3/  → Historical Hydrology & River Defense
│      └─ 集合详情 · 30 页样本 · 治理说明
├── rooms/room4/  → Architecture & Construction Knowledge
│      └─ 集合详情 · 30 页样本 · 治理说明
├── rooms/room5/  → AI-assisted Historical Research
│      └─ 12 evidence cards · 3 workspaces · 治理指标
└── (公共) data/*.json · css/style.css · js/main.js
```

---

## URL 与文件对应表

| URL | 文件 | 数据依赖 | 主要组件 |
|---|---|---|---|
| `/` | `index.html` | manifest, works, collections | stat-row, works-grid |
| `/rooms/room1/` | `rooms/room1/index.html` | timeline | timeline, narrative |
| `/rooms/room2/` | `rooms/room2/index.html` | water_classic_pages, works | page-list, page-viewer framework |
| `/rooms/room3/` | `rooms/room3/index.html` | collections, hydrology_pages | collection-detail, page-list |
| `/rooms/room4/` | `rooms/room4/index.html` | collections, architecture_pages | collection-detail, page-list |
| `/rooms/room5/` | `rooms/room5/index.html` | evidence_cards, workspaces, citations | evidence-cards, workspace-cards, governance table |

---

## 展厅 1 — From Catalogue to Research Infrastructure

### 入口
- H1: From Catalogue to Research Infrastructure
- 一句话: 一份在 Shuge.org 上浏览的书目列表，如何变成可检索、可引证、可治理的研究基础设施？

### 主体
- H2: 9 个里程碑
  - P1 Acquisition pilot
  - P2 Core corpus v1
  - P3 Citation search
  - P4 Case studies + verified-false
  - P5-A Core corpus v2 (JDA)
  - P5-B Citations + packs
  - P5-C Thematic collections
  - P5-D Governance + workspaces
  - Exh v0.1 Prototype site
  - Exh v0.2 5 exhibition rooms (本展)

### 收束
- Take-away: 「研究基础设施」 ≠ 数据库的代名词。它包含**采集**、**消化**、**检索**、**治理**、**策展**、**展示**六个层次，每一个层次都需要单独的纪律。

---

## 展厅 2 — The Life of a Book: 水经注 Case Study

### 入口
- H1: The Life of a Book
- 一句话: 以《水经注》为个案，展示一部古籍在本研究系统中的完整轨迹 — 从 PDF 到 Citation ID。

### 主体
- H2: 一份书的基本数据
  - 4 个统计: pages / OCR pages / chars / mean confidence
- H2: 60 页样本
  - table: page_index, page_label, ocr_status, char_count, mean_confidence, qa_status
- H2: Page Image Viewer Framework
  - 展示 5 个空白框架 + caption "v0.2 framework only — IIIF images disabled in v0.2"
- H2: 这个书如何被检索
  - 描述查询流程（不暴露 SQL）

### 收束
- Take-away: 一部书的「生命」从静态的 PDF 图像出发，经 OCR 文本化，FTS5 索引化，evidence-ledger 化，最终成为可引证的研究资源。

---

## 展厅 3 — Historical Hydrology & River Defense

### 入口
- H1: Historical Hydrology & River Defense
- 一句话: 「历史水利与河防」专题集合，是本项目第一个策展性研究集合。

### 主体
- H2: 集合的定义
  - 集合 metadata (从 collections.json 加载)
  - Include terms: 19 个
  - Min confidence: 0.5
- H2: 30 个高置信度页面样本
  - table: title, page_index, char_count, confidence, inclusion_method, review_status
- H2: 集合治理
  - definition v1 + snapshot chain
  - rebuild idempotent

### 收束
- Take-away: 一个集合不仅是「一堆页面」，而是「一个研究问题 + 一组术语规则 + 一份可治理的成员清单 + 一条审计链」。

---

## 展厅 4 — Architecture & Construction Knowledge

### 入口
- H1: Architecture & Construction Knowledge
- 一句话: 「建筑营造与工程做法」专题集合 — 以《工程做法》为骨干，辅以《园冶》《天工开物》。

### 主体
- H2: 集合的定义
  - 集合 metadata
  - Include terms: 28 个
  - WORK seeds: 工程做法 + 园冶
- H2: 30 个高置信度页面样本
- H2: 集合治理

### 收束
- Take-away: 两个集合的并列使得「历史水利」与「营造」成为可比较的研究对象 — 这正是 P5-D 的 cross-collection compare 的展览化。

---

## 展厅 5 — AI-assisted Historical Research

### 入口
- H1: AI-assisted Historical Research
- 一句话: AI 在本项目中的角色 — 是研究助产士，不是替代者。

### 主体
- H2: AI 做了什么
  - OCR (PP-OCRv4)
  - 查询分解 (中文分词)
  - 证据合成 (research_search.py)
  - claim 验证 + verified-false 标注
- H2: 12 个 evidence cards（直接看产出）
- H2: 3 个工作区（workspace）
  - 水经注河水分布
  - 工程做法柱径标准
  - 营造与水利交叉
- H2: 治理指标
  - OUT_OF_COLLECTION_LEAKAGE=0
  - VERIFIED_FALSE_REGRESSION=PASS
  - UNSUPPORTED_CLAIM_SENTENCES=0
  - CITATION_IDS_UNCHANGED=yes
  - PROVENANCE_UNCHANGED=yes

### 收束
- Take-away: AI 让研究「可规模化的部分」变得更便宜（OCR、分词、证据合成），但**判断**与**策展**仍由人类完成 — 0 个 unsupported claim 是这条边界的具体形态。

---

## 总览页 (`/`) 的功能

- 6 项数字徽章（works / pages / collections / runs / claims / workspaces）
- 9 个精选作品卡片（从 works.json）
- 5 个展厅卡片（指向 `/rooms/room{1-5}/`）
- footer + 仓库链接

---

## 不做的事（v0.2 不引入）

- ❌ 图像库（无 IIIF tile / 图片）
- ❌ 实时搜索（无 client-side index）
- ❌ 任何第三方地图（仅 SVG 示意）
- ❌ 任何聊天机器人 / AI 输出
- ❌ 任何写入 / 编辑 / 评论 / 用户系统
- ❌ 任何 CSS 框架（无 Tailwind / Bootstrap）
- ❌ 任何 JS 框架（无 React / Vue）

---

## 与 v0.1 的差异

| v0.1 | v0.2 |
|---|---|
| 4 个并列栏目 | 5 个展厅 + 1 个总览 |
| 6 个 JSON | 12 个 JSON |
| 组件: card / badge / accordion | + evidence-card / citation-viewer / page-viewer-framework / map-placeholder |
| 叙事: 数据陈列 | 叙事化: 每个展厅带「Take-away」 |

---

## 后续版本路线（不在 v0.2 范围）

- v0.3: 接入 IIIF tile viewer（不下载，由 reader 端实时 fetch）
- v0.4: 加入 institution map 真实坐标
- v0.5: 加入 cross-collection compare 交互式
- v1.0: 加入 server-side query（受限 API）

