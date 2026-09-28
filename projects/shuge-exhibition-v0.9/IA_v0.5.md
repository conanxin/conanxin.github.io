# IA_v0.5 · Information Architecture — Research Workspace & Field Notebook

## 0. 文档元数据

| 项 | 值 |
|---|---|
| 版本 | v0.5 |
| 上游 IA | v0.4 (Evidence + Place + Fieldwork) |
| 设计文档 | DESIGN_v0.5.md |
| 时间 | 2026-09-28 |

---

## 1. v0.5 三层导航结构

```
shuge-exhibition-v0.5/
│
├── /                       → Project Overview (继承 v0.4)
│
├── 5 Exhibition Rooms      (v0.3 继承)
│   /rooms/room1/ .. /rooms/room5/
│
├── 5 Case Studies          (v0.3 继承)
│   /cases/case1/ .. /cases/case5/
│
├── Evidence Explorer       (v0.4 继承)
│   /evidence-explorer/
│
├── Places                  (v0.4 继承)
│   /places/
│
├── Fieldwork Bridge        (v0.4 继承)
│   /fieldwork/
│
├── ★ Research Workspaces   (v0.5 NEW)
│   /workspaces/
│
├── ★ Field Notebook        (v0.5 NEW)
│   /field-notes/
│
└── ★ Timeline Layer        (v0.5 NEW)
    /timeline/
```

**11 个一级栏目** (3 个 v0.5 新增)

---

## 2. /workspaces/ — Research Workspace

### 2.1 页面分区

| # | Section | 字段源 | 说明 |
|---|---|---|---|
| 1 | Hero | total_workspaces · total_RQ · stats | 3 workspaces overview |
| 2 | Workspace Card Grid | workspaces[].title_zh, collection_slugs, stats | 3 个 workspace 卡片 |
| 3 | Question Drilldown | workspaces[].question + question_subquestions[] | 选中后展开 question + 3-4 sub-questions |
| 4 | Linked Collections | workspaces[].collection_slugs + linked_collection_ids | 1-2 个 collection |
| 5 | Linked Places | workspaces[].linked_place_ids[] | place cards mini-grid |
| 6 | Linked Citations | workspaces[].linked_citation_ids[] | citation ID list |
| 7 | Linked Evidence Cards | workspaces[].linked_evidence_card_ids[] | evidence card count + topic |
| 8 | Research Questions (RQs) | workspaces[].research_questions[] | rq_id + text + status |
| 9 | Gaps | workspaces[].gaps[] | gap_id + description + status |
| 10 | Cross-workspace Compare | 跨 3 workspaces 的 place/citation 共享 | side-by-side table |
| 11 | Take-away | hardcoded | "不是问"在哪一页,而是问什么" |

### 2.2 数据 schema (新建)

```
data/research_workspaces.json
{
  "version": "v0.5",
  "total_workspaces": 3,
  "stats": { ... },
  "workspaces": [
    {
      "workspace_id": "ws-<topic>",
      "title_zh": "...",
      "title_en": "...",
      "question": "...",
      "question_subquestions": [ "..." × 3-4 ],
      "collection_slugs": [ "<collection-slug>" ],
      "linked_collection_ids": [ <int> ],
      "linked_place_ids": [ "<place-id>" ],
      "linked_citation_ids": [ "SHUGE:p<post>:<page>" ],
      "linked_evidence_card_ids": [ "<claim_id>" ],
      "linked_case_study_ids": [ "case1" ... ],
      "gaps": [ { gap_id, description, status } ],
      "research_questions": [ { rq_id, text, status } ],
      "review_status": "PENDING",
      "owner": "research-team",
      "stats": { total_questions, open_questions, ... }
    }
  ]
}
```

### 2.3 3 个 demo workspaces

| # | workspace_id | title_zh | collections | places | RQ | gaps |
|---|---|---|---|---|---|---|
| 1 | ws-hydrology-river-distribution | 水经注河水分布研究 | historical-hydrology | 4 | 2 | 3 |
| 2 | ws-architecture-pillar-diameter | 工程做法柱径标准 | architecture-construction | 3 | 2 | 2 |
| 3 | ws-cross-hydrology-architecture | 营造与水利交叉 | both | 6 | 2 | 2 |

---

## 3. /field-notes/ — Field Notebook

### 3.1 页面分区

| # | Section | 字段源 | 说明 |
|---|---|---|---|
| 1 | Hero | stats.total_demo_notes, by_status, by_place | 4 demo notes overview |
| 2 | Schema Doc | schema.required_fields, optional_fields, format | schema documentation |
| 3 | Verification Status Legend | 4 status types | UNVERIFIED / VERIFIED / CONTRADICTED / NEEDS_REVIEW |
| 4 | Notes Card Grid | demo_notes[].field_note_id + observation | 4 cards |
| 5 | Note Detail Drilldown | demo_notes[].* | 单条 note 完整字段展开 |
| 6 | Cross-Note Stats | stats.by_place / by_status | distribution analysis |
| 7 | Linking Map | demo_notes[].linked_research_question_ids[] | note → RQ → workspace |
| 8 | Take-away | hardcoded | "4 条 notes · 1 verified + 2 unverified + 1 needs review" |

### 3.2 数据 schema (新建)

```
data/field_notes.json
{
  "version": "v0.5",
  "schema_version": "1.0",
  "schema": {
    "required_fields": [ "field_note_id", "place_id", "date", ... ],
    "optional_fields": [ ... ],
    "verification_status_values": [ "UNVERIFIED", "VERIFIED", "CONTRADICTED", "NEEDS_REVIEW" ],
    "field_note_id_format": "FN-YYYYMMDD-<3-digit-seq>"
  },
  "stats": { total_demo_notes, by_status, by_place },
  "demo_notes": [
    { field_note_id, place_id, date, location_text, observation, ... }
  ]
}
```

### 3.3 4 个 demo notes

| # | field_note_id | place_id | status | linked_RQ |
|---|---|---|---|---|
| 1 | FN-20260928-001 | place-sanggan-he | NEEDS_REVIEW | rq-ws1-001 |
| 2 | FN-20260928-002 | place-beijing | VERIFIED | rq-ws2-001 |
| 3 | FN-20260928-003 | place-beijing | UNVERIFIED | rq-ws2-002 |
| 4 | FN-20260928-004 | place-grand-canal | UNVERIFIED | rq-ws1-002 |

---

## 4. /timeline/ — Timeline Layer

### 4.1 页面分区

| # | Section | 字段源 | 说明 |
|---|---|---|---|
| 1 | Hero | stats.total_layers, total_events, time_span | 4 layers · 18 events · BCE 1100 - CE 2026 |
| 2 | Layer Filter Bar | layers[].layer_id | 4 按钮 · active state |
| 3 | Multi-Track Timeline | layers[].events[] | 4 条平行轨道 |
| 4 | Event Marker Detail | events[].event_id, title, citation_id | 点击 marker 展开 |
| 5 | Cross-Layer Compare | 跨 4 layers 在同一 date | side-by-side panel |
| 6 | Take-away | hardcoded | "4 layers · 18 events · 时间跨度 3000+ years" |

### 4.2 数据 schema (新建)

```
data/timeline_layers.json
{
  "version": "v0.5",
  "stats": { total_layers, total_events, time_span },
  "layers": [
    {
      "layer_id": "layer-<type>",
      "layer_name_zh": "...",
      "layer_name_en": "...",
      "layer_type": "TEXT | EVIDENCE | PLACE | COLLECTION",
      "color_hint": "var(--seal-red)",
      "events": [
        { event_id, date_label, date_year, title, description, citation_id?, work_id? }
      ]
    }
  ]
}
```

### 4.3 4 个 timeline layers

| # | layer_id | name_zh | type | events | 时间跨度 |
|---|---|---|---|---|---|
| 1 | layer-textual | 文本层 · 古典文献 | TEXT | 5 | 北魏(515) - 清雍正(1734) |
| 2 | layer-evidence | 证据层 · 数字证据卡 | EVIDENCE | 3 | 2026(v0.3) |
| 3 | layer-place | 空间层 · 实地锚点 | PLACE | 4 | 2026(v0.5 demo) |
| 4 | layer-collection | 集合层 · 主题策展 | COLLECTION | 6 | 2026(P5-C + v0.5) |

---

## 5. 数据流图

```
            ┌──────────────────────────┐
            │  P5-D Frozen DB          │
            │  (45.9 MB · 0 修改)       │
            └────────────┬─────────────┘
                         │ read-only SELECT
            ┌────────────┴─────────────┐
            │  v0.5 JSON snapshots      │
            │  ├ works.json            │
            │  ├ citations.json        │
            │  ├ collections.json      │
            │  ├ evidence_cards_v3.json│
            │  └ case_studies.json     │
            └────────────┬─────────────┘
                         │
        ┌────────────────┼────────────────────┐
        │                │                    │
        ▼                ▼                    ▼
  v0.4 继承          v0.5 新增            Conan Xin Archive
  places.json       research_workspaces   (只引用 ID)
  place_evidence    research_questions   ↗ linked_rq_ids
  evidence_graph    field_notes            (cross-archive
  fieldwork_schema  timeline_layers        contract)
─────────────────────────────────────────────────────────────
                  ↓
            Static HTML pages
            ├ /workspaces/
            ├ /field-notes/
            └ /timeline/
            (11 个一级栏目)
```

---

## 6. /workspaces/ 内部导航

```
/workspaces/                         (列表 · 3 卡片)
│
├── ws-hydrology-river-distribution  (展开后)
│   ├ question + sub-questions
│   ├ linked collections (1)
│   ├ linked places (4)
│   │   ├ place-sanggan-he
│   │   ├ place-huang-he
│   │   ├ place-jiang-shui
│   │   └ place-grand-canal
│   ├ linked citations (≥3)
│   ├ linked evidence cards
│   ├ linked case studies (4)
│   ├ research questions (2)
│   └ gaps (3)
│
├── ws-architecture-pillar-diameter
│   ├ question + sub-questions
│   ├ linked collections (1)
│   ├ linked places (3)
│   │   ├ place-palace
│   │   ├ place-garden
│   │   └ place-temple
│   ├ linked citations
│   ├ linked evidence cards
│   ├ research questions (2)
│   └ gaps (2)
│
└── ws-cross-hydrology-architecture
    ├ question + sub-questions
    ├ linked collections (2)
    ├ linked places (6)
    ├ research questions (2)
    └ gaps (2)
```

---

## 7. /field-notes/ 内部导航

```
/field-notes/                          (4 个 demo notes)
│
├── schema 文档 (字段列表)
├── verification status legend
├── FN-20260928-001                    → /places/ 桑干河
│                                          → /workspaces/ ws-hydrology-river-distribution
│
├── FN-20260928-002                    → /places/ 北京 (故宫)
│                                          → /workspaces/ ws-architecture-pillar-diameter
│
├── FN-20260928-003                    → /places/ 北京 (颐和园)
│                                          → /workspaces/ ws-architecture-pillar-diameter
│
└── FN-20260928-004                    → /places/ 运河 (通州)
                                           → /workspaces/ ws-hydrology-river-distribution
```

---

## 8. /timeline/ 内部导航

```
/timeline/                              (4 layers · 18 events)
│
├── layer-textual      (TEXT · seal-red · 5 events · 北魏-清)
│   ├ evt-text-001: 《水经注》(515)
│   ├ evt-text-002: 《河防一览》(1275)
│   ├ evt-text-003: 《工程做法》(1734)
│   ├ evt-text-004: 《园冶》(1635)
│   └ evt-text-005: 《梦粱录》(1274)
│
├── layer-evidence     (EVIDENCE · status-green · 3 events)
│   ├ case1 → /cases/ case1
│   ├ case2 → /cases/ case2
│   └ case3 → /cases/ case3
│
├── layer-place        (PLACE · archival-brown · 4 events)
│   ├ evt-place-001: 桑干河 → FN-20260928-001
│   ├ evt-place-002: 北京(故宫) → FN-20260928-002
│   ├ evt-place-003: 北京(颐和园) → FN-20260928-003
│   └ evt-place-004: 运河(通州) → FN-20260928-004
│
└── layer-collection   (COLLECTION · ink-charcoal · 6 events)
    ├ evt-coll-001: P5-C historical-hydrology
    ├ evt-coll-002: P5-C architecture-construction
    ├ evt-coll-003: v0.5 ws1
    ├ evt-coll-004: v0.5 ws2
    ├ evt-coll-005: v0.5 ws3
    └ evt-coll-006: Conan Xin Archive 入口 (跨 archive 留接口)
```

---

## 9. 顶部导航 (全站统一 · 继承 v0.4 + v0.5 追加)

```
Overview · Rooms · Cases · Evidence Explorer · Places · Fieldwork · Workspaces · Field Notes · Timeline
                                                                                    ★NEW      ★NEW      ★NEW
```

所有 11 个一级栏目均列入顶部 nav。

---

## 10. URL 路由表 (v0.5 新增)

| URL | 内容 | 大小目标 |
|---|---|---|
| /workspaces/ | 3 workspaces · 6 RQ · drilldown | ~13 KB |
| /field-notes/ | schema + 4 demo notes | ~13 KB |
| /timeline/ | 4 layers · 18 events | ~13 KB |

---

## 11. 与 v0.4 的差异

| 维度 | v0.4 | v0.5 |
|---|---|---|
| 一级栏目 | 8 | 11 (+3) |
| 数据层 | Evidence / Place / Fieldwork | + Research Workspace / Field Notebook / Timeline |
| 主导逻辑 | "看证据 + 看地点" | "问问题 → 跟问题走 → 看证据" |
| 研究工具性 | 仅展示 | 可链接到 workspaces + RQ |
| 跨 archive 准备 | 无 | 预留 `linked_archive_rq_ids` |

---

## 12. 输出清单

```
shuge-exhibition-v0.5/
├── DESIGN_v0.5.md              (10.2 KB)        ★ NEW
├── IA_v0.5.md                  (this file)       ★ NEW
│
├── index.html                  (9.2 KB)          继承 v0.4
├── cases/, places/, rooms/, evidence-explorer/, fieldwork/    (继承)
│
├── workspaces/index.html       (~13 KB)          ★ NEW
├── field-notes/index.html      (~13 KB)          ★ NEW
├── timeline/index.html         (~13 KB)          ★ NEW
│
├── css/style.css               (v0.5 追加 ~120 行)
├── js/main.js                  (v0.5 追加 helper)
│
└── data/  (24 个 JSON)
    ├── 继承 20 个 (v0.4 全量)
    └── v0.5 新增 4 个
        ├── research_workspaces.json   (7.9 KB)
        ├── research_questions.json    (3.4 KB)
        ├── field_notes.json           (4.7 KB)
        └── timeline_layers.json       (6.2 KB)
```

---

**v0.5 IA 终态: 11 个一级栏目 + 3 个新页面 + 4 个新 JSON 数据文件 + 完整的 Research Workspace / Field Notebook / Timeline Layer 三层研究基础设施。**