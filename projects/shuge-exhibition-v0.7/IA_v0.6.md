# IA_v0.6 · Information Architecture — Research Graph & Project Pages

## 0. 文档元数据

| 项 | 值 |
|---|---|
| 版本 | v0.6 |
| 上游 IA | v0.5 (Research Workspace + Field Notebook + Timeline Layer) |
| 设计文档 | DESIGN_v0.6.md |
| 时间 | 2026-09-28 |

---

## 1. v0.6 一级栏目总览 (12 个)

```
shuge-exhibition-v0.6/
│
├── /                           → Project Overview (继承)
│
├── 5 Exhibition Rooms                          (v0.3 继承)
├── 5 Case Studies                              (v0.3 继承)
├── Evidence Explorer                           (v0.4 继承)
├── Places (10 cards)                           (v0.4 继承)
├── Fieldwork Bridge                            (v0.4 继承)
├── Research Workspaces (3 cards)               (v0.5 继承)
├── Field Notebook (4 demo)                     (v0.5 继承)
├── Timeline Layer (4 layers · 18 events)       (v0.5 继承)
│
├── ★ Research Projects        (v0.6 NEW)
│   /projects/
│
├── ★ Place Profiles            (v0.6 NEW)
│   /places-profile/
│
├── ★ Field Note Input Spec     (v0.6 NEW)
│   /field-note-input/
│
└── ★ Conan Xin Archive Bridge  (v0.6 NEW)
    /archive-bridge/
```

**12 个一级栏目** (4 个 v0.6 新增)

---

## 2. /projects/ — Research Project Page

### 2.1 页面分区

| # | Section | 字段源 | 说明 |
|---|---|---|---|
| 1 | Hero | project_id · title · research_question | 3 projects overview |
| 2 | Stats Summary | stats[] | 9 个统计字段 |
| 3 | Project Cards | projects[].title_zh, project_id | 3 个 project cards |
| 4 | Question Drilldown | research_question + sub_questions[] | 主问题 + 子问题 |
| 5 | Research Questions | projects[].research_questions[] | rq_id + text + status |
| 6 | Collections | projects[].linked_collections[] | collection titles |
| 7 | Places | projects[].linked_place_ids[] | place cards mini-grid |
| 8 | Citations | projects[].linked_citation_ids[] | citation ID list |
| 9 | Evidence Cards | projects[].linked_evidence_card_ids[] | claim_id + 摘要 |
| 10 | Field Notes (NEW) | projects[].linked_field_note_ids[] | FN-* note 数量 + 跳转 |
| 11 | Timeline Events (NEW) | projects[].linked_timeline_event_ids[] | event_id + 跳转 |
| 12 | Gaps | projects[].gaps[] | gap_id + description + status |
| 13 | Cross-Project Compare | 跨 3 projects | side-by-side table |
| 14 | Take-away | hardcoded | "3 projects · 6 RQ · 18 citations · 4 notes · 7 gaps" |

### 2.2 数据 schema

```
data/research_projects.json
{
  "version": "v0.6",
  "total_projects": 3,
  "stats": { ... },
  "projects": [
    {
      "project_id": "rp-<topic>",
      "title_zh": "...",
      "title_en": "...",
      "research_question": "...",
      "sub_questions": [ "..." × 3-4 ],
      "collection_slugs": [ "<slug>" ],
      "linked_collections": [ "<title>" ],
      "linked_place_ids": [ "<place_id>" ],
      "linked_citation_ids": [ "SHUGE:p<post>:<page>" ],
      "linked_evidence_card_ids": [ "<claim_id>" ],
      "linked_field_note_ids": [ "<FN-id>" ],
      "linked_timeline_event_ids": [ "<evt-id>" ],
      "research_questions": [ { rq_id, text, status } ],
      "gaps": [ { gap_id, description, status } ],
      "stats": { 9 个统计字段 }
    }
  ]
}
```

### 2.3 3 个 demo projects

| # | project_id | title_zh | coll | places | RQ | notes | timeline | gaps |
|---|---|---|---|---|---|---|---|---|
| 1 | rp-hydrology-river-distribution | 水经注河水分布研究 | hist-hyd | 4 | 2 OPEN | 1 | (由 v0.5 计算) | 3 |
| 2 | rp-architecture-pillar-diameter | 工程做法柱径标准 | arch | 3 | 2 OPEN | 2 | (由 v0.5 计算) | 2 |
| 3 | rp-cross-hydrology-architecture | 营造与水利交叉 | both | 6 | 2 OPEN | 1 | (由 v0.5 计算) | 2 |

---

## 3. /places-profile/ — Place Profile Page

### 3.1 页面分区

| # | Section | 字段源 | 说明 |
|---|---|---|---|
| 1 | Hero | place_id · name_zh · category · status | 10 places overview |
| 2 | Filter Bar | place_profiles[].category | 按 category 过滤 |
| 3 | Place Profile Cards | name_zh, status, stats | 10 个 place profile cards |
| 4 | Place Detail Drilldown | place_profile.* | 选中后展开 9+ 字段 |
| 5 | Aliases | place_profile.aliases[] | 别称列表 |
| 6 | Primary Citations | place_profile.primary_citations[] | SHUGE:p<post>:<page> 列表 |
| 7 | Works | place_profile.linked_works[] | work cards |
| 8 | Collections | place_profile.linked_collections[] | collection titles |
| 9 | Research Projects (NEW) | place_profile.linked_research_projects[] | project_id + title |
| 10 | Field Notes (NEW) | place_profile.linked_field_note_ids[] | FN-* notes |
| 11 | Evidence Cards (NEW) | place_profile.bound_evidence_card_ids[] | claim_id 列表 |
| 12 | Extraction Method | extraction_method + fieldwork_priority | 来源 + 优先级 |
| 13 | Stats | 6 个统计字段 | — |
| 14 | Cross-Place Compare | 跨 10 places | side-by-side table |

### 3.2 数据 schema

```
data/place_profiles.json
{
  "version": "v0.6",
  "total_place_profiles": 10,
  "stats": { ... },
  "place_profiles": [
    {
      "place_id": "<canonical>",
      "slug": "...",
      "name_zh": "...",
      "name_en": "...",
      "aliases": [ "..." ],
      "category": "natural_river|historical_city|...",
      "status": "DRAFT|PLACEHOLDER|...",
      "dynasty_range": "...",
      "primary_citations": [ "SHUGE:p<post>:<page>" ],
      "linked_works": [ { post_id, work_id, title } ],
      "linked_collections": [ "<slug>" ],
      "linked_research_projects": [ { project_id, title_zh } ],
      "linked_field_note_ids": [ "<FN-id>" ],
      "bound_evidence_card_ids": [ "<claim_id>" ],
      "extraction_method": "...",
      "fieldwork_priority": "HIGH|MEDIUM|LOW",
      "notes": "...",
      "stats": { 6 个统计字段 }
    }
  ]
}
```

### 3.3 10 个 place profiles

| # | place_id | name_zh | category | status | projects | notes |
|---|---|---|---|---|---|---|
| 1 | sangganhe | 桑干河 | natural_river | DRAFT | 2 | 1 |
| 2 | huanghe | 黄河 | natural_river | DRAFT | 2 | 0 |
| 3 | jiangshui | 江水 | natural_river | DRAFT | 1 | 0 |
| 4 | linan | 临安 | historical_city | DRAFT | 1 | 0 |
| 5 | beijing | 北京 | historical_city | DRAFT | 1 | 2 |
| 6 | garden | 园林 | architectural_type | DRAFT | 2 | 0 |
| 7 | palace | 宫殿 | architectural_type | DRAFT | 1 | 0 |
| 8 | temple | 寺庙 | architectural_type | DRAFT | 2 | 0 |
| 9 | ancient_road | 古道 | infrastructure | PLACEHOLDER | 0 | 0 |
| 10 | grand_canal | 运河 | waterway | DRAFT | 2 | 1 |

---

## 4. /field-note-input/ — Field Note Input Spec

### 4.1 页面分区

| # | Section | 字段源 | 说明 |
|---|---|---|---|
| 1 | Hero | schema stats | 16+5 fields · 7 rules |
| 2 | Input Method Status | input_pipeline_status | DESIGN_ONLY (v0.6) |
| 3 | Supported Methods | input_methods_supported_by_design[] | 3 methods (manual / json / csv) |
| 4 | Manual Method 5-Step | manual_method_filed_p_step[] | 5 steps |
| 5 | Required Fields | schema.required_fields[] | 7 fields |
| 6 | Optional Fields | schema.optional_fields[] | 9 fields |
| 7 | v0.6 New Fields | schema.v0_6_new_fields[] | 5 new fields |
| 8 | Validation Rules | validation_rules[] | 7 rules |
| 9 | YAML Example | yaml_frontmatter_example | 完整示例 |
| 10 | Boundary | boundary text | "不实装 pipeline" |
| 11 | Take-away | hardcoded | "schema only · P5-E 才实装" |

### 4.2 数据 schema

```
data/field_note_input_spec.json
{
  "version": "v0.6",
  "schema_version": "2.0",
  "schema_note": "...",
  "boundary": "v0.6 only DOCUMENTS this schema...",
  "input_pipeline_status": "DESIGN_ONLY",
  "input_methods_supported_by_design": [ ... ],
  "manual_method_filed_p_step": [ ... ],
  "schema": {
    "required_fields": [ { name, type, format, note } ],
    "optional_fields": [ ... ],
    "v0_6_new_fields": [ ... ]
  },
  "validation_rules": [ ... ],
  "yaml_frontmatter_example": "..."
}
```

### 4.3 16+5 字段总览

| 字段 | 类型 | 必填 | v0.6 |
|---|---|---|---|
| field_note_id | string | yes | inherited |
| place_id | string | yes | inherited |
| date | string | yes | inherited |
| location_text | string | yes | inherited |
| linked_citation_ids | array | yes | inherited |
| observation | string | yes | inherited |
| verification_status | enum | yes | inherited |
| gps_lat / gps_lng | float | no | inherited |
| weather | string | no | inherited |
| photos_count | int | no | inherited |
| recording_count | int | no | inherited |
| fieldworker_name | string | no | inherited |
| linked_evidence_card_ids | array | no | inherited |
| linked_research_question_ids | array | no | inherited |
| tags | array | no | inherited |
| input_id | string | no | **NEW v0.6** |
| input_method | enum | no | **NEW v0.6** |
| input_metadata | object | no | **NEW v0.6** |
| consent | object | no | **NEW v0.6** |
| audit_trail | object | no | **NEW v0.6** |

---

## 5. /archive-bridge/ — Conan Xin Archive Bridge

### 5.1 页面分区

| # | Section | 字段源 | 说明 |
|---|---|---|---|
| 1 | Hero | stats | 3 IDs · 3 contracts · 6 invariants |
| 2 | Boundary Statement | boundary text | "STRICTLY READ-ONLY SCHEMA" |
| 3 | Archive Reference | archive_reference{} | 不可访问的 Archive |
| 4 | ID Naming Convention | id_naming_convention{} | 4 类 ID |
| 5 | Contract Fields | contract_fields{} | 3 类 contract |
| 6 | Cross-Archive Invariants | cross_archive_invariants[] | 6 条不可破规则 |
| 7 | v0.6 Schema Additions | v0_6_schema_additions[] | 2 个 reserved 字段 |
| 8 | v0.6 Bridge Demo | v0_6_bridge_demo[] | 2 个 RQ placeholder |
| 9 | Take-away | hardcoded | "v0.6 has zero Archive data" |

### 5.2 数据 schema

```
data/archive_bridge.json
{
  "version": "v0.6",
  "boundary": "STRICTLY READ-ONLY SCHEMA...",
  "archive_reference": { name, location, format, estimated_size, access_pattern },
  "id_naming_convention": {
    "field_note_id": { format, cross_archive_namespace, note, example_shared_id },
    "research_question_id": { ... },
    "gap_id": { ... },
    "project_id": { ... }
  },
  "contract_fields": {
    "linked_archive_rq_ids": { type, description, read_direction, write_direction, example },
    "linked_archive_note_ids": { ... },
    "linked_archive_gap_ids": { ... }
  },
  "cross_archive_invariants": [ ... ],
  "v0_6_schema_additions": [ ... ],
  "v0_6_bridge_demo": [ ... ]
}
```

---

## 6. /projects/ 内部导航

```
/projects/                                       (3 projects)
│
├── rp-hydrology-river-distribution              (展开)
│   ├ question + sub-questions
│   ├ research_questions[] (2 OPEN)
│   ├ linked_collections (1)
│   ├ linked_place_ids[] (4)
│   ├ linked_citation_ids[] (?)
│   ├ linked_evidence_card_ids[]
│   ├ linked_field_note_ids[] (NEW · 1)
│   ├ linked_timeline_event_ids[] (NEW)
│   ├ gaps[] (3)
│   └ stats (9 fields)
│
├── rp-architecture-pillar-diameter
│   ├ question + sub-questions
│   ├ research_questions[] (2 OPEN)
│   ├ linked_collections (1)
│   ├ linked_place_ids[] (3)
│   ├ linked_field_note_ids[] (NEW · 2)
│   ├ gaps[] (2)
│   └ stats
│
└── rp-cross-hydrology-architecture
    ├ question + sub-questions
    ├ research_questions[] (2 OPEN)
    ├ linked_collections (2)
    ├ linked_place_ids[] (6)
    ├ linked_field_note_ids[] (NEW · 1)
    ├ gaps[] (2)
    └ stats
```

---

## 7. /places-profile/ 内部导航

```
/places-profile/                                 (10 profiles)
│
├── natural_river: 3 places
│   ├ sangganhe (DRAFT) — 1 project · 1 note · 0 cards
│   ├ huanghe (DRAFT) — 1 project · 0 notes · 7 cards (v0.4)
│   └ jiangshui (DRAFT) — 1 project
│
├── historical_city: 2 places
│   ├ linan (DRAFT) — 1 project
│   └ beijing (DRAFT) — 1 project · 2 notes
│
├── architectural_type: 3 places
│   ├ garden (DRAFT) — 2 projects
│   ├ palace (DRAFT) — 1 project
│   └ temple (DRAFT) — 2 projects
│
├── infrastructure: 1 PLACEHOLDER
│   └ ancient_road (PLACEHOLDER) — 0 projects
│
└── waterway: 1
    └ grand_canal (DRAFT) — 2 projects · 1 note
```

---

## 8. v0.6 数据流图

```
            ┌──────────────────────────┐
            │  P5-D Frozen DB          │
            │  (45.9 MB · 0 修改)       │
            └────────────┬─────────────┘
                         │ read-only SELECT
            ┌────────────┴─────────────┐
            │  v0.6 JSON snapshots      │
            │  ├ works.json            │
            │  ├ citations.json        │
            │  ├ collections.json      │
            │  ├ evidence_cards_v3.json│
            │  ├ case_studies.json     │
            │  ├ research_workspaces.json (v0.5)│
            │  ├ research_questions.json (v0.5)│
            │  ├ field_notes.json (v0.5,canonicalized)│
            │  ├ places.json (v0.4)│
            │  └ timeline_layers.json (v0.5)│
            └────────────┬─────────────┘
                         │
        ┌────────────────┼─────────────────────┐
        │                │                     │
        ▼                ▼                     ▼
  v0.6 新增           v0.6 新增             Conan Xin Archive
  research_projects  place_profiles         (只引 ID 不读内容)
  field_note_input_spec  archive_bridge
─────────────────────────────────────────────────────────────
                  ↓
            Static HTML pages (12 个一级栏目)
            ├ /projects/           ★ NEW
            ├ /places-profile/     ★ NEW
            ├ /field-note-input/   ★ NEW
            └ /archive-bridge/     ★ NEW
```

---

## 9. 顶部导航 (全站统一 · 12 个栏目)

```
Overview · Rooms · Cases · Evidence Explorer · Places · Fieldwork · Workspaces · Field Notes · Timeline · Projects · Place Profiles · Field Note Input · Archive Bridge
                                                                                    ★NEW    ★NEW    ★NEW    ★NEW
```

(13 个项目 · 1 overview + 5 rooms + 5 cases 不全在 nav,但 8 个研究/展览类栏目都在 nav)

实际 top nav 12 个一级栏目:
Overview · Rooms · Cases · Evidence Explorer · Places · Fieldwork · Workspaces · Field Notes · Timeline · Projects · Place Profiles · Field Note Input · Archive Bridge

---

## 10. URL 路由表 (v0.6 新增)

| URL | 内容 | 大小目标 |
|---|---|---|
| /projects/ | 3 projects · 6 RQ · 18 citations · 4 notes | ~13 KB |
| /places-profile/ | 10 profiles · 16 cites · 14 projects · 3 notes | ~14 KB |
| /field-note-input/ | 16+5 schema + 7 rules + 5-step | ~11 KB |
| /archive-bridge/ | 3 IDs · 3 contracts · 6 invariants | ~10 KB |

---

## 11. v0.5 → v0.6 差异

| 维度 | v0.5 | v0.6 |
|---|---|---|
| 一级栏目 | 8 | 12 (+4) |
| 数据层 | 6 (workspaces/questions/notes/timeline + 继承) | +4 (projects/profiles/input_spec/archive_bridge) |
| project view | 列表 | 完整 project page (9 sections) |
| place view | list + filter | 完整 profile page (10 sections) |
| input spec | schema only | schema + 7 validation rules + manual 5-step |
| archive bridge | (none) | 3 ID namespaces + 3 contracts + 6 invariants |
| place_id consistency | broken (v0.4 vs v0.5 mismatch) | fixed in v0.6 (canonical) |
| project field_note bindings | 0 (broken) | 4 (fixed) |

---

## 12. 输出清单

```
shuge-exhibition-v0.6/
├── DESIGN_v0.6.md                              ★ NEW
├── IA_v0.6.md                                  ★ NEW
│
├── index.html                                  / 总览 (继承)
│
├── cases/, rooms/, evidence-explorer/, places/, fieldwork/      (继承)
├── workspaces/, field-notes/, timeline/                            (v0.5 继承)
│
├── projects/index.html                         ★ NEW /projects/
├── places-profile/index.html                   ★ NEW /places-profile/
├── field-note-input/index.html                 ★ NEW /field-note-input/
├── archive-bridge/index.html                   ★ NEW /archive-bridge/
│
├── css/style.css                              (v0.6 追加 ~80 行)
├── js/main.js                                 (v0.6 追加 helper)
│
└── data/  (28 个 JSON)
    ├── v0.5 继承 24 个 (含 v0.6 修正后的 field_notes.json)
    └── v0.6 新增 4 个
        ├── research_projects.json        (8.4 KB)
        ├── place_profiles.json           (13.8 KB)
        ├── field_note_input_spec.json    (5.6 KB)
        └── archive_bridge.json           (4.0 KB)
```

---

**v0.6 IA 终态: 12 个一级栏目 + 4 个新页面 + 4 个新 JSON 数据文件 + 完整研究项目页 + 完整 place profile + field note 输入规范 + Archive bridge schema + 修正 v0.5 遗留的 place_id 不一致问题。**