# SHUGE DH Research Platform v0.9 — IA (Information Architecture)

> **版本**:v0.9 — Scholarly Publication & Research Portfolio IA
> **生成时间**:2026-09-28 10:30 CST
> **状态**:✅ COMPLETE
> **配套文档**:DESIGN_v0.9.md

---

## 0. 总览

v0.9 在 v0.8 「Evidence-backed Research Publication」基础上,引入 3 个新的 schema 层:

1. **Public Article Pages** — 8 段语义结构对外呈现(title / abstract / methods / evidence / claims / citations / limitations / bibliography)
2. **Peer Review Record Schema** — 同行评审记录(review_id / comments / score / status)
3. **Research Portfolio** — 长期研究档案聚合视图(5 sections)

所有层都建立在 v0.4 → v0.8 已冻结的 ID 之上,**无新数据源**,**无新工具**。

---

## 1. 顶层 IA 图

```
v0.9 — Public Research Portfolio
│
├── /portfolio/                          ★ NEW · 聚合视图 (5 sections)
├── /review/                             ★ NEW · 同行评审记录 (3 records)
├── /articles/<id>/                      ★ NEW · 3 public pages (1 per article)
│   ├── /articles/hydrology-river-distribution/index.html
│   ├── /articles/architecture-pillar-diameter/index.html
│   └── /articles/cross-hydrology-architecture/index.html
├── /articles/                           (继承 v0.8) · 文章列表
├── /publications/                       (继承 v0.8) · workflow hub
├── /export/                             (继承 v0.8) · 3 formats
│
├── (v0.7 继承)
│   /research-writing/ · /drafts/ · /bibliography/
│
├── (v0.6 继承)
│   /projects/ · /places-profile/ · /field-note-input/ · /archive-bridge/
│
├── (v0.5 继承)
│   /workspaces/ · /field-notes/ · /timeline/
│
├── (v0.4 继承)
│   /evidence-explorer/ · /places/ · /fieldwork/
│
└── (v0.3 继承)
    5 展览房间 (/rooms/room1/ ... /rooms/room5/)
    5 case studies (/cases/case1/ ... /cases/case5/)
```

合计 **32 个 HTML routes** · 19 个一级栏目 · 5 个 case + 5 个 room + 3 个 v0.9 public pages。

---

## 2. Public Article Pages (/articles/&lt;id&gt;/)

### 2.1 路由

| # | 路径 | 关联 article_id | review_status |
|---|---|---|---|
| 1 | `/articles/hydrology-river-distribution/index.html` | article-hydrology-river-distribution | DRAFT |
| 2 | `/articles/architecture-pillar-diameter/index.html` | article-architecture-pillar-diameter | REVIEW |
| 3 | `/articles/cross-hydrology-architecture/index.html` | article-cross-hydrology-architecture | REVISED |

### 2.2 8 段语义结构

| 段 | 字段 | 边界 |
|---|---|---|
| 1. title | title_zh · title_en · short_title_zh · short_title_en | 不改写 |
| 2. abstract | abstract_zh · abstract_en (≤ 200 字符) | 不自动扩写 |
| 3. methods | methods_zh · methods_en | 不引入新方法 |
| 4. evidence | evidence_summary_* | 不读 full_text |
| 5. claims | claims_summary_* | claim_id 原样 |
| 6. citations | citations_summary_* | SHUGE:p 原样 |
| 7. limitations | limitations_zh · limitations_en | gap_id 原样 |
| 8. bibliography | bibliography_section {works / institutions / citations} | full_text_unavailable=true |

### 2.3 链接关系

```
public page → article → draft → project → workspace
              ↓
              linked_archive_note_ids (FN-*)
              linked_archive_rq_ids (rq-*)
              linked_archive_gap_ids (gap-*)
```

### 2.4 prototype 结构

```
/articles/<id>/index.html
├── topnav (19 items, /articles/<id>/ 不在 topnav,属于子路由)
├── masthead (article title)
├── section 1: title block
├── section 2: abstract block (≤ 200 chars)
├── section 3: methods block
├── section 4: evidence summary (binding_state distribution)
├── section 5: claims summary
├── section 6: citations summary (cite table)
├── section 7: limitations block (gaps)
├── section 8: bibliography section (3 works · 1 inst · 6 cites)
├── cross-links (→ /portfolio/ · /review/ · /articles/ · /drafts/ · /bibliography/ · /projects/ · /workspaces/)
└── footer (v0.9 watermark)
```

---

## 3. Peer Review Record Schema (/review/)

### 3.1 路由

| # | 路径 | 内容 |
|---|---|---|
| 1 | `/review/index.html` | 3 review records (1 per article) · 15 comments · 5 rubric_dimensions |

### 3.2 record 字段

| 字段 | 类型 | 来源 |
|---|---|---|
| review_id | rev-* (local-only) | v0.9 NEW |
| article_id | article-* | v0.8 ID 引用 |
| draft_id | draft-* | v0.7 ID 引用 |
| reviewer_id | revr-* (placeholder) | v0.9 NEW |
| round | int | 演示为 1 |
| rubric_dimensions_reviewed | array | 引用 publication_workflow.rubric_dimensions |
| comments[] | array of {comment_id, rubric_dimension, score, weight, comment_zh, evidence_links_checked, linked_paragraph_ids, blocker} | 演示静态数据 |
| overall_score | float [1.0, 5.0] | 静态 demo |
| score_band | BLOCKED / NEEDS_REVISION / ACCEPTABLE / STRONG / EXEMPLARY | 派生 |
| review_status | PENDING / APPROVED / NEEDS_REVISION / REJECTED | 演示 |
| decision | APPROVE_TRANSITION / BLOCK_TRANSITION | 派生 |
| next_state_recommendation | DRAFT / REVIEW / REVISED (**PUBLISHED 禁止**) | v0.9 边界 |

### 3.3 3 个 record 概览

| review_id | article | overall_score | score_band | decision | next_state |
|---|---|---|---|---|---|
| rev-hydrology-river-distribution-001 | article-hydrology-river-distribution | 3.75 | ACCEPTABLE | BLOCK_TRANSITION | REVISED |
| rev-architecture-pillar-diameter-001 | article-architecture-pillar-diameter | 4.40 | STRONG | APPROVE_TRANSITION | REVISED |
| rev-cross-hydrology-architecture-001 | article-cross-hydrology-architecture | 4.20 | STRONG | APPROVE_TRANSITION | REVISED |

### 3.4 prototype 结构

```
/review/index.html
├── topnav (19 items, /review/ active)
├── masthead
├── meta-table: total_review_records=3 · reviews_in_APPROVED=2 · reviews_in_NEEDS_REVISION=1 · auto-publish forbidden
├── 3 review cards (one per article)
│   ├── card head: review_id + article_id + round
│   ├── tabs:
│   │   ├── Summary: overall_score + score_band + decision + next_state
│   │   ├── Comments: 5 rubric comments (one per dimension)
│   │   ├── Decisions: BLOCK_TRANSITION vs APPROVE_TRANSITION explanation
│   │   └── Archive Links: FN-* + rq-* + gap-*
│   └── footer: review demo disclaimer
└── cross-links (→ /articles/ · /portfolio/ · /publications/)
```

---

## 4. Research Portfolio (/portfolio/)

### 4.1 路由

| # | 路径 | 内容 |
|---|---|---|
| 1 | `/portfolio/index.html` | 5 sections · 25 items |

### 4.2 5 sections

| # | section_id | label | items | 来源 |
|---|---|---|---|---|
| 1 | sec-portfolio-projects | 研究项目 | 3 (rp-*) | v0.6 |
| 2 | sec-portfolio-articles | 研究文章 | 3 (article-*) + 3 (papa-*) | v0.8 + v0.9 |
| 3 | sec-portfolio-exhibitions | 数字展览 | 7 (room/case/explorer) | v0.3 + v0.4 |
| 4 | sec-portfolio-methods | 研究方法 | 6 | v0.4-v0.9 |
| 5 | sec-portfolio-infrastructure | 基础设施 | 6 | v0.1-v0.9 |

### 4.3 prototype 结构

```
/portfolio/index.html
├── topnav (19 items, /portfolio/ active)
├── masthead
├── meta-table: total_sections=5 · total_items=25 · all items ID-referenced
├── section 1: projects (3 cards with linked_ws/article/places/citations/notes/gaps)
├── section 2: articles (3 cards with review_status + public_page link)
├── section 3: exhibitions (7 items: 5 rooms + 5 cases, summary view)
├── section 4: methods (6 method cards with description + used_in)
├── section 5: infrastructure (6 cards: pages, JSON, design docs, namespaces, boundaries)
└── footer (v0.9 watermark: "Public Portfolio · READ-ONLY ID LINK · 不自动 PUBLISHED")
```

---

## 5. 顶部导航栏 (19 项)

```
总览 · Projects · Place Profiles · Field Note Input · Archive Bridge
                   · Research Writing · Drafts · Bibliography
                   · Articles · Publications · Export · Portfolio · Review ★ NEW
                   · Evidence Explorer · Places · Fieldwork
                   · Workspaces · Field Notes · Timeline
```

**v0.9 新增**:`/portfolio/` · `/review/` 两个一级栏目
**v0.8 已有**:`/articles/` · `/publications/` · `/export/`
**v0.7 已有**:`/research-writing/` · `/drafts/` · `/bibliography/`
**v0.6 已有**:`/projects/` · `/places-profile/` · `/field-note-input/` · `/archive-bridge/`
**v0.5 已有**:`/workspaces/` · `/field-notes/` · `/timeline/`
**v0.4 已有**:`/evidence-explorer/` · `/places/` · `/field-work/`
**v0.3 已有**:`/cases/` · `/rooms/`(子路由,不在 topnav 主项)

---

## 6. 子路由 /articles/&lt;id&gt;/ 不在 topnav

3 个 public pages 位于 `/articles/<id>/`,不在一级 topnav。它们通过:

1. `/articles/` 列表页的 drilldown 卡片链接进入
2. `/portfolio/` section 2 的 article cards 链接进入
3. `/review/` review cards 链接进入
4. `/drafts/` draft cards 链接进入
5. `/projects/` project cards 链接进入

**不使用 iframe / embed / modal**。

---

## 7. JSON 数据文件 (v0.9 新增 4 个)

| 文件 | 大小 | 内容 |
|---|---|---|
| `data/public_article_pages.json` | 12.8 KB | 3 public pages + schema_template + stats |
| `data/peer_review_records.json` | 15.2 KB | 3 review records + schema_template + stats |
| `data/research_portfolio.json` | 11.3 KB | 5 sections + items + stats |
| `data/publication_invariants_v0.9.json` | 9.6 KB | 12 invariants + 9 namespaces + 6 schema additions |

**所有 v0.9 JSON 文件**:

- `version` 字段为 `"v0.9"`
- `generated_at` 为 ISO datetime
- `source` 字段说明派生来源(`derived from data/...`)
- `boundary` 字段说明硬约束
- 顶部包含 `purpose` 字段说明本文件用途
- 所有 ID 字段保持原样(不变 Citation ID / FN-* / rq-* / gap-* / ws-* / rp-* / article-*)

---

## 8. CSS additions (v0.9 增量)

继承 v0.8 全部 CSS + v0.9 新增:

- `.public-page-section` — public article page 8 段语义结构样式
- `.public-page-block` — 每段语义块
- `.public-page-block-head` — 段标题
- `.public-page-block-body` — 段内容(限宽 720px)
- `.review-card` — peer review record 卡片
- `.review-tabs` — review 5 tab switch
- `.rubric-comment` — 单条 rubric comment 行
- `.review-score-band` — score_band 视觉标签
- `.portfolio-section` — portfolio 5 section 大块
- `.portfolio-item-card` — portfolio 单个 item
- `.portfolio-method-card` — methods 单卡片
- `.portfolio-infrastructure-card` — infrastructure 单卡片
- `.badge.disabled-badge` — disabled 状态标记
- `.review-footer-disclaimer` — review demo disclaimer 区块

预计追加 ~100 行 CSS 到 `css/style.css`。

---

## 9. 边界 — 12 条 invariants 摘要

| rule_id | constraint | 简述 |
|---|---|---|
| inv-pub-v0.9-1 | SHALL NOT | public_article_pages 不写 Archive |
| inv-pub-v0.9-2 | SHALL NOT | public_article_pages 不自动生成 abstract/methods/limitations 正文 |
| inv-pub-v0.9-3 | SHALL NOT | peer_review_records 不自动调动真实评审员 |
| inv-pub-v0.9-4 | SHALL NOT | portfolio 不自动汇总 = 聚合视图,非新内容 |
| inv-pub-v0.9-5 | SHALL NOT | articles 不自动 PUBLISHED |
| inv-pub-v0.9-6 | SHALL NOT | public_article_pages 不改 Citation ID |
| inv-pub-v0.9-7 | SHALL NOT | peer_review_records 不暴露 full_text |
| inv-pub-v0.9-8 | SHALL NOT | portfolio 不引入新资源/数据库/工具 |
| inv-pub-v0.9-9 | SHALL MAY | public_article_pages 允许引用 FN-*/rq-*/gap-* (ID 引用) |
| inv-pub-v0.9-10 | SHALL MAY | portfolio 允许引用 v0.4-v0.8 全部 shared namespaces |
| inv-pub-v0.9-11 | SHALL | portfolio footer 标注 v0.9 watermark |
| inv-pub-v0.9-12 | SHALL | peer review footer 标注 demo-only |

---

## 10. 验证清单 (本地)

- [x] 32 个 HTML routes HTTP 200 OK
- [x] 4 个 v0.9 JSON 数据文件加载正常
- [x] 跨数据完整性(public page ↔ article ↔ draft ↔ project ↔ workspace)
- [x] review record decision 与 article review_status 一致
- [x] portfolio items 全部 ID 引用 v0.4-v0.8 已建立 ID
- [x] peer review record overall_score ∈ [1.0, 5.0]
- [x] peer review record next_state_recommendation ∈ {DRAFT, REVIEW, REVISED} (无 PUBLISHED)
- [x] 所有 SHUGE citations 原样保留
- [x] 不暴露 bibliography full_text
- [x] 顶部导航栏 19 项
- [x] /articles/<id>/ 三页之间互链 + 与 /portfolio/ /review/ /articles/ /drafts/ /bibliography/ /projects/ /workspaces/ 跨链

---

**v0.9 STATUS=COMPLETE · 完成后停止,不进入下一阶段。**