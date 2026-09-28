# SHUGE DH Research Platform v0.8 — IA

## 信息架构总览

v0.8 在 v0.7 Evidence-backed Draft 之上加入 **Publication & Scholarly Output** 作为新栏目层。v0.8 不取代 v0.7,而是建立 Article / Workflow / Export 三个并列层:

1. **Article Layer** — 每个 v0.7 draft → 一个 research article
2. **Workflow Layer** — DRAFT → REVIEW → REVISED → (PUBLISHED,边界内禁止) 状态机
3. **Export Layer** — Markdown / CSL JSON / BibTeX 三种导出格式

```
Research Platform v0.8
├── 1. 总览 (Overview)
├── 2. Rooms (5 展厅)
├── 3. Cases (5 案例研究)
├── 4. Evidence Explorer
├── 5. Places (10 places)
├── 6. Fieldwork
├── 7. Workspaces (3 workspaces)
├── 8. Field Notes (4 demo notes)
├── 9. Timeline (4 layers · 18 events)
├── 10. Projects (3 research projects)
├── 11. Place Profiles (10 place profiles)
├── 12. Field Note Input
├── 13. Research Writing (v0.7 hub)
├── 14. Drafts (3 research drafts)
├── 15. Bibliography (3 works · 1 institution · 6 citations)
└── 16. Publication & Output ★ NEW v0.8
    ├── /articles/         (3 articles · 5-tab drilldown)
    ├── /publications/     (hub: workflow state machine + review status distribution)
    └── /export/           (Markdown / CSL JSON / BibTeX · boundary invariants)
```

**18 个一级栏目**(新增 /articles/ + /publications/ + /export/)

---

## 1. /articles/ (Article Detail)

**作用**: 展示 3 个 Research Article 的完整结构(基于 v0.7 draft)。

**原型结构**:

| 区域 | 类型 | 内容 |
|---|---|---|
| Masthead | 静态 | 同 v0.7 |
| Topnav | 静态 | 18 栏目 |
| Hero | 静态 + JS | article_id + short_title_zh + short_title_en + review_status badge + language badge + owner + abstract preview |
| Article Filter | JS | 按 review_status 过滤 (DRAFT / REVIEW / REVISED / PUBLISHED) |
| Article Detail Sections | JS drilldown | 5 sections: sections detail + claims index + citations index + bibliography preview + linked archive IDs |
| Sections Table | JS | section_id + status + paragraphs_resolved + claims_count + citations_count + word_count |
| Claims Index Table | JS | claim_id + paragraph_id + binding_state |
| Citations Index Table | JS | citation_id (link to bibliography) + cited_in_drafts (reverse index) |
| Bibliography Preview | JS | 3 lists: works / institutions / citations |
| Linked Archive IDs | JS | read-only ID table (linked_archive_note_ids/rq_ids/gap_ids/workspace_id/project_id) |
| Stats Table | JS | sections · paragraphs · claims · citations · evidence_cards · field_notes · word_count |
| Footer | 静态 | |

---

## 2. /publications/ (Publication Hub)

**作用**: Publication Workflow 的总入口 — workflow state machine + review status distribution + rubric。

**原型结构**:

| 区域 | 类型 | 内容 |
|---|---|---|
| Masthead | 静态 | 同 v0.7 |
| Topnav | 静态 | 18 栏目 |
| Hero | 静态 | title · version · workflow_version · 4 states · 5 transitions |
| Stats Table | JS | total_articles · articles_in_draft · articles_in_review · articles_in_revised · articles_in_published (must be 0) |
| Review Status Distribution | JS | pie/bar: DRAFT / REVIEW / REVISED / PUBLISHED |
| Workflow State Machine | JS | 4 states + 5 transitions visual diagram |
| Rubric Visualization | JS | 5 dimensions + passing scores table |
| 3 Article Cards | JS | article_id + review_status badge + stats |
| Boundary Invariants | 静态 | 8 inv-pub-8 列表 |
| Future Plans | 静态 | outline: arXiv / DOI / 站内 / Notion(待 research team 决策) |
| Footer | 静态 | |

---

## 3. /export/ (Export Layer)

**作用**: Markdown / CSL JSON / BibTeX 三种导出格式的规范与示例。

**原型结构**:

| 区域 | 类型 | 内容 |
|---|---|---|
| Masthead | 静态 | 同 v0.7 |
| Topnav | 静态 | 18 栏目 |
| Hero | 静态 | title · version · formats_count · boundary_invariants_count |
| Format Tabs | JS | 3 tabs: Markdown / CSL JSON / BibTeX |
| Format Spec | JS | mime_type + file_ext + export_includes + export_excludes |
| Demo Markdown Preview | JS | first 600 chars of demo_article REVISED export(text code block) |
| Demo CSL JSON | JS | single entry (JSON code block) |
| Demo BibTeX | JS | single entry (text code block) |
| 5 Boundary Invariants | 静态 | boundary list (red badges) |
| 5-Step Export Workflow | 静态 | step_1 ~ step_5 documentation |
| Footer | 静态 | |

---

## 4. URL 路径

```
/projects/shuge-exhibition-v0.8/
├── /                                              总览
├── /projects/                                     3 research projects (v0.6)
├── /places-profile/                               10 place profiles (v0.6)
├── /field-note-input/                             input spec (v0.6)
├── /archive-bridge/                               bridge schema (v0.6)
├── /research-writing/                             writing hub (v0.7)
├── /drafts/                                       3 drafts (v0.7)
├── /bibliography/                                 works + institutions + citations (v0.7)
├── /articles/                                     ★ NEW: 3 research articles
├── /publications/                                 ★ NEW: workflow hub
├── /export/                                       ★ NEW: 3 export formats
├── /evidence-explorer/                            evidence graph (v0.4)
├── /places/                                       10 places (v0.4)
├── /fieldwork/                                    fieldwork schema (v0.4)
├── /workspaces/                                   3 workspaces (v0.5)
├── /field-notes/                                  4 notes (v0.5)
├── /timeline/                                     4 layers (v0.5)
├── /cases/case1-5/                                5 cases (v0.3)
└── /rooms/room1-5/                                5 rooms (v0.3)
```

---

## 5. 数据流

```
v0.7 layer                     v0.8 layer
─────────────                  ──────────
research_drafts.json       ──→  research_articles.json (1 draft → 1 article)
evidence_paragraphs.json   ──→  research_articles.json (sections.paragraphs_resolved + claims aggregation)
research_drafts.json (cite) ──→  research_articles.json (bibliography_citations)
bibliography.json          ──→  research_articles.json (bibliography_works + bibliography_institutions)
research_drafts.json       ──→  publication_workflow.json (4-state machine)
research_articles.json     ──→  export_specs.json (demo article → Markdown / CSL / BibTeX)
writing_invariants.json    ──→  publication_invariants.json (extended ID namespaces + 8 invariants)
```

**每条 article 引用关系**:
- `research_articles.json → articles[].citations[]` (聚合 from draft)
- `research_articles.json → articles[].bibliography_*` (聚合 from bibliography)
- `research_articles.json → articles[].linked_archive_note_ids[]` (FN-*)
- `research_articles.json → articles[].linked_archive_rq_ids[]` (rq-*)
- `research_articles.json → articles[].linked_archive_gap_ids[]` (gap-*)
- `research_articles.json → articles[].linked_workspace_id` (ws-*)
- `research_articles.json → articles[].linked_project_id` (rp-*)

---

## 6. 与 Conan Xin Archive Bridge (v0.8 扩展)

v0.7 writing_invariants.json 已建立 4 shared namespaces + 6 invariants。v0.8 在此之上扩展:

**5 shared ID namespaces**(扩展):
- `field_note_id` (FN-*) — v0.5+ 已有
- `research_question_id` (rq-*) — v0.5+ 已有
- `gap_id` (gap-*) — v0.5+ 已有
- `workspace_id` (ws-*) — v0.5+ 已有,**v0.8 新增 article→workspace 反向绑定**
- `project_id` (rp-*) — v0.6+ 已有,**v0.8 新增 article→project 绑定**

**4 local-only namespaces**(新增):
- `article_id` (article-*) — v0.8 独有
- `review_id` (review-*) — 评审记录 local ID
- `rubric_score_id` (rubric-*) — 评审打分 local ID
- `export_record_id` (export-*) — 导出记录 local ID

**8 archive_bridge_invariants**:
- 5 个继承 (inv-1 ~ inv-5)
- 3 个 v0.8 新增 (inv-pub-5/6/7/8)

详见 `DESIGN_v0.8.md` §3.4 与 `data/publication_invariants.json`。

---

## 7. 完整页面清单 (31 个 HTML + 36 个 JSON)

```
HTML pages (31 routes, 1 root + 18 一级栏目 + 12 二级栏目):
├── /index.html (总览)
├── /projects/index.html
├── /places-profile/index.html
├── /field-note-input/index.html
├── /archive-bridge/index.html
├── /research-writing/index.html (v0.7)
├── /drafts/index.html (v0.7)
├── /bibliography/index.html (v0.7)
├── /articles/index.html ★ NEW
├── /publications/index.html ★ NEW
├── /export/index.html ★ NEW
├── /evidence-explorer/index.html
├── /places/index.html
├── /fieldwork/index.html
├── /workspaces/index.html
├── /field-notes/index.html
├── /timeline/index.html
├── /cases/case1-5/index.html
└── /rooms/room1-5/index.html

JSON data files (36 files):
├── v0.3 inherited (15)
├── v0.4 inherited (4)
├── v0.5 inherited (4)
├── v0.6 inherited (5)
├── v0.7 inherited (4)
└── v0.8 new (4): ★
    research_articles.json · publication_workflow.json
    export_specs.json · publication_invariants.json
```

---

## 8. 复用策略

- **Topnav 复用**: 18 栏目,所有页面共用
- **CSS 复用**: style.css 已继承 35.7 KB,v0.8 追加 ~80 行 article-specific + workflow-state + boundary badges
- **JS 复用**: 沿用 fetch + render pattern,新增 review_status filter + state machine visualization + format tabs
- **数据复用**: v0.8 不复制 citations / works / institutions 原数据,仅聚合引用

---

## 9. 边界(完整继承 v0.7 + v0.8 新增)

| 边界 | v0.7 | v0.8 |
|---|---|---|
| 不下载资源 | ✓ | ✓ |
| 不修改数据库 | ✓ | ✓ |
| 不运行 OCR | ✓ | ✓ |
| 不改变 Citation ID | ✓ | ✓ |
| 不引入 Neo4j | ✓ | ✓ |
| 不引入 embeddings | ✓ | ✓ |
| 不引入后台服务 | ✓ | ✓ |
| 不抓取 shuge.org | ✓ | ✓ |
| 不抓取 Conan Xin Archive | ✓ | ✓ |
| 不存实际照片 | ✓ | ✓ |
| 不引入 iFrame / submodule | ✓ | ✓ |
| 不引入 LLM 自动写作 | ✓ | ✓ |
| 不锁定草稿 | ✓ | (n/a,改为 article) |
| 不暴露 full_text | ✓ | ✓ |
| body_excerpt ≤ 200 字符 | ✓ | ✓ |
| **不直接进入 PUBLISHED** | (n/a) | ★ 显式边界 |
| **export SHALL include footer** | (n/a) | ★ 显式边界 |
| **export SHALL NOT body_excerpt > 200** | (继承) | ✓ |
| **citation_id 永远原样输出** | (n/a) | ★ 显式边界 |

---

## 10. 推送策略

- ✅ 自包含 v0.8 目录,/home/conanxin/conanxin.github.io/projects/shuge-exhibition-v0.8
- ✅ 不会污染 v0.7 或之前版本
- ✅ git add projects/shuge-exhibition-v0.8/ 一次性提交
- ✅ commit message: `feat(shuge-exhibition-v0.8): Publication & Scholarly Output — 3 articles + DRAFT/REVIEW/REVISED state machine + 3 export formats (Markdown/CSL JSON/BibTeX) + archive bridge invariants`
- ✅ push origin main
- ✅ 完成后停止,不进入下一阶段(per user explicit instruction)