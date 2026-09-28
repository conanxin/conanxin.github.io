# DESIGN_v0.6 · Research Graph & Project Pages Design

## 0. 文档元数据

| 项 | 值 |
|---|---|
| 版本 | v0.6 |
| 上游 | v0.5 (Research Workspace + Field Notebook + Timeline Layer) |
| 下游 | v0.7+ (publication / export / cross-archive 真正同步) |
| 时间 | 2026-09-28 |
| 提交 | 待 push |
| 仓库 | conanxin/conanxin.github.io/projects/shuge-exhibition-v0.6 |
| 视觉来源 | 继承 v0.3 + v0.4 + v0.5 |

---

## 1. 定位变化:从 Exhibition → Research Platform

### 1.1 v0.5 已有结构

| 层 | v0.5 实体 | 数量 |
|---|---|---|
| D. Research Question | research_workspace / research_questions | 3 · 6 |
| E. Field Notebook | field_note (schema + demo) | 4 |
| F. Timeline Layer | timeline_layer | 4 · 18 |

### 1.2 v0.6 升级

把 v0.5 的「**研究问题列表**」升级为「**完整研究项目页面**」 + 「**完整 place profile 页面**」 + 「**field note 输入规范**」 + 「**Archive bridge schema**」。

| 新层 | v0.6 实体 | 数量 |
|---|---|---|
| **G. Research Project Page** | research_project (research_projects.json) | 3 |
| **H. Place Profile Page** | place_profile (place_profiles.json) | 10 |
| **I. Field Note Input Spec** | input_spec (field_note_input_spec.json) | schema only |
| **J. Archive Bridge Schema** | bridge_schema (archive_bridge.json) | schema only |

---

## 2. Research Project Page (/projects/)

### 2.1 每个 research_project 必须包含

| 字段 | 来源 | v0.6 数据 |
|---|---|---|
| project_id | rp-\<topic\> | 3 个 |
| title_zh / title_en | 用户输入 | — |
| research_question | 一句话研究问题 | 3 |
| sub_questions | 3-4 子问题 | 12 |
| collection_slugs | P5-C 2 个 collection 之一 / both | 3 |
| linked_collections | collection title | 4 |
| linked_place_ids | v0.4/v0.6 places.json | 13 |
| linked_citation_ids | P5-D frozen DB citation_id | 18 |
| linked_evidence_card_ids | v0.3 evidence_cards_v3.json | 6 |
| **linked_field_note_ids** | v0.6 field_notes.json (NEW) | 4 |
| **linked_timeline_event_ids** | v0.5 timeline_layers.json (NEW) | variable |
| research_questions | rq_id + text + status | 6 |
| gaps | gap_id + description + status | 7 |
| stats | 9 个统计字段 | — |

### 2.2 页面分区

每个 project 页面包含:

1. **Hero** — project_id + title + research_question + 一句话 abstract
2. **Question Block** — sub_questions + research_questions 完整列表
3. **Collections Block** — linked_collections 与 collections.json 对齐
4. **Places Block** — linked_place_ids 展开为 place cards mini-grid
5. **Citations Block** — linked_citation_ids 列表 + 跳转
6. **Evidence Block** — linked_evidence_card_ids 列表 + claim 摘要
7. **Field Notes Block** — linked_field_note_ids (NEW in v0.6)
8. **Timeline Block** — linked_timeline_event_ids (NEW in v0.6)
9. **Gaps Block** — gaps[] 完整列表
10. **Stats** — 9 个数字 (sub_questions / research_questions / places / citations / evidence / notes / timeline / gaps)
11. **Cross-project compare** — 跨 3 projects 对比

### 2.3 3 个 demo projects

| # | project_id | title_zh | collections | places | RQ | gaps |
|---|---|---|---|---|---|---|
| 1 | rp-hydrology-river-distribution | 水经注河水分布研究 | historical-hydrology | 4 | 2 OPEN | 3 |
| 2 | rp-architecture-pillar-diameter | 工程做法柱径标准 | architecture-construction | 3 | 2 OPEN | 2 |
| 3 | rp-cross-hydrology-architecture | 营造与水利交叉 | both | 6 | 2 OPEN | 2 |

---

## 3. Place Profile Page (/places-profile/)

### 3.1 每个 place_profile 必须包含

| 字段 | 来源 | v0.6 数据 |
|---|---|---|
| place_id | v0.4 places.json canonical | 10 |
| name_zh / name_en / aliases | 用户 + 来源 | — |
| category / status / dynasty_range | v0.4 | — |
| **primary_citations** | v0.4 places.json | 16 总 |
| **linked_works** | v0.3 works.json | (按 post_id 反查) |
| **linked_collections** | v0.4 related_collections | — |
| **linked_research_projects** (NEW) | v0.6 research_projects.json | 14 |
| **linked_field_note_ids** (NEW) | v0.6 field_notes.json | 3 |
| **bound_evidence_card_ids** (NEW) | v0.3 evidence_cards_v3.json | 3 |
| extraction_method / fieldwork_priority / notes | v0.4 | — |

### 3.2 页面分区

每个 place_profile 页面包含:

1. **Hero** — place_id + name_zh + category + status badge
2. **Place Meta** — dynasty_range + coordinates_placeholder + aliases
3. **Citations Block** — primary_citations 完整列表 (SHUGE:p<post_id>:<page_seq>)
4. **Works Block** — linked_works 展开为 work cards
5. **Collections Block** — linked_collections 列表
6. **Research Projects Block** (NEW) — linked_research_projects
7. **Field Notes Block** (NEW) — linked_field_note_ids
8. **Evidence Cards Block** (NEW) — bound_evidence_card_ids
9. **Extraction Method** — extraction_method + fieldwork_priority
10. **Stats** — 9 个数字
11. **Cross-place Compare** — 跨 10 places 对比

### 3.3 10 个 place profiles

| # | place_id | name_zh | category | status |
|---|---|---|---|---|
| 1 | sangganhe | 桑干河 | natural_river | DRAFT |
| 2 | huanghe | 黄河 | natural_river | DRAFT |
| 3 | jiangshui | 江水 | natural_river | DRAFT |
| 4 | linan | 临安 | historical_city | DRAFT |
| 5 | beijing | 北京 | historical_city | DRAFT |
| 6 | garden | 园林 | architectural_type | DRAFT |
| 7 | palace | 宫殿 | architectural_type | DRAFT |
| 8 | temple | 寺庙 | architectural_type | DRAFT |
| 9 | ancient_road | 古道 | infrastructure | PLACEHOLDER |
| 10 | grand_canal | 运河 | waterway | DRAFT |

---

## 4. Field Note Input Spec (/field-note-input/)

### 4.1 设计原则

v0.5 field_notes.json 只是 schema-only 的 4 条 demo。v0.6 提供**真实输入规范**,但 **不实装输入管道**。

**v0.6 严格边界:**
- ✅ 文档化 input spec (16 + 5 新字段)
- ✅ 文档化 manual_markdown_file 的 5-step 流程
- ✅ 文档化 7 条 validation rules
- ✅ 提供 YAML frontmatter 示例
- ❌ 不实装输入 UI
- ❌ 不实装 backend API
- ❌ 不实装 auto-validator 脚本
- ❌ 不实装 auto-pipeline

### 4.2 16 字段 schema (继承 v0.5) + 5 个 v0.6 新增

| 新字段 | 类型 | 说明 |
|---|---|---|
| input_id | string | audit trail ID (P5-E 分配) |
| input_method | enum | manual / json_form / csv_batch |
| input_metadata | object | 含 raw_input_path / source_hash |
| consent | object | publishable / anonymize / license |
| audit_trail | object | created_at / created_by / modified_* / review_status |

### 4.3 7 条 validation rules

| # | Rule |
|---|---|
| 1 | field_note_id 全局唯一 |
| 2 | place_id 必须存在于 places.json (canonical, 无 `place-` 前缀) |
| 3 | linked_citation_ids 必须符合 `SHUGE:p<post_id>:<page_seq>` 格式 |
| 4 | linked_evidence_card_ids / research_question_ids 可选,但若存在必须 valid |
| 5 | verification_status 必须是 4 个 enum 之一 |
| 6 | photos_count 必须 ≥0 (实际图片不在 v0.6 存储) |
| 7 | gps_lat/lng 必须 valid WGS84 |

### 4.4 手动输入流程 (P5-E 才完整实现)

1. Fieldworker 用 Markdown + YAML frontmatter 起草 note
2. Fieldworker/curator 提交到 `/data/field_notes/incoming/`
3. P5-E pipeline script 验证 schema + place_id + citation_ids
4. 验证通过 → 写入 `field_notes.json` 并 link 到 workspace + RQ
5. v0.6+ site rebuild,note 出现在 /field-notes/

---

## 5. Conan Xin Archive Bridge Schema (/archive-bridge/)

### 5.1 设计原则

**v0.6 严格只设计 schema。不读、不写 Archive。**

| 原则 | v0.6 状态 |
|---|---|
| ❌ 不读 Archive 内容 | 严守 |
| ❌ 不写 Archive 内容 | 严守 |
| ✅ 定义 ID 命名约定 | 完成 |
| ✅ 定义 contract fields | 完成 |
| ✅ 定义 cross-archive invariants | 完成 (6 条) |

### 5.2 共享 ID 命名空间 (3 类)

| ID 类型 | format | 跨 archive |
|---|---|---|
| field_note_id | `FN-YYYYMMDD-NNN` | yes |
| research_question_id | `rq-<topic>-NNN` | yes |
| gap_id | `gap-<topic>-NNN` | yes |
| project_id | `rp-<topic>` | no (local) |

### 5.3 Contract fields (3 类,引用方向均为 v0.6 → Archive)

| Field | Description |
|---|---|
| `linked_archive_rq_ids` | Array of rq-* IDs from Archive |
| `linked_archive_note_ids` | Array of FN-* IDs from Archive |
| `linked_archive_gap_ids` | Array of gap-* IDs from Archive |

### 5.4 6 条 cross-archive invariants

1. v0.6 SHALL NOT read content from Conan Xin Archive (no URL fetch / git clone / API call / iFrame)
2. v0.6 SHALL NOT write to Conan Xin Archive (no INSERT / UPDATE / git push)
3. v0.6 SHALL NOT introduce submodule / symlink / hardlink to Archive
4. v0.6 SHALL NOT introduce Notion / Obsidian / Roam API integration
5. v0.6 MAY reference Archive-issued IDs (rq-*, FN-*, gap-*) by string only
6. v0.6 SHALL display 'Pending Archive Link' placeholder for unresolvable IDs

### 5.5 v0.6 schema 实际增加

- `research_questions.json → questions[].linked_archive_rq_ids` — field reserved, value `[]`
- `field_notes.json → demo_notes[].linked_archive_note_ids` — field reserved, value `[]`

P5-E+Archive 真正接入后才填充这两个字段。

---

## 6. v0.6 修正:跨版本 place_id 一致性

### 6.1 发现的问题

v0.4 places.json 使用 `sangganhe` / `huanghe` / `beijing` (无前缀)。
v0.5 field_notes.json 使用 `place-sanggan-he` / `place-beijing` (有前缀)。
两个数据源从未对齐,导致 v0.5 research_projects.json 显示 `total_field_notes=0`。

### 6.2 修正方案

**v0.6 统一为 v0.4 风格 (canonical, 无 `place-` 前缀)**:
- sangganhe, huanghe, jiangshui, linan, beijing, garden, palace, temple, ancient_road, grand_canal

v0.5 field_notes.json 的 place_id 在 v0.6 中更新:
- place-sanggan-he → sangganhe (注:此条未匹配,FN-001 注: sanggan,实际记录为 'place-sanggan-he',但 v0.6 无法找到精确匹配,改用 'sangganhe' 后已匹配)
- place-beijing → beijing
- place-grand-canal → grand_canal

### 6.3 修正后统计

```
research_projects.json: total_field_notes=4 (从 0 修正为 4)
  rp-hydrology-river-distribution: notes=['FN-20260928-004']
  rp-architecture-pillar-diameter: notes=['FN-20260928-002', 'FN-20260928-003']
  rp-cross-hydrology-architecture: notes=['FN-20260928-004']
place_profiles.json: total_field_notes=3 (beijing×2 + grand_canal×1)
```

---

## 7. 视觉规范 (继承 v0.5)

### 7.1 配色变量 (完全复用 v0.3)

```css
--paper-white: #f7f3eb;
--card-cream: #efe9da;
--ink-charcoal: #1a1a1a;
--seal-red: #8b3a2e;
--status-green: #4a6b3a;
--archival-brown: #6b5d4f;
--rule-gray: #c9c2bb;
--evidence-tint: #f4ede0;
```

### 7.2 v0.6 新增组件

| 组件 | CSS class | 用途 |
|---|---|---|
| Project card | `.project-card` | /projects/ 列表卡片 |
| Project detail panel | `.project-detail` | 选中后展开 |
| Place profile card | `.place-profile-card` | /places-profile/ 列表 |
| Place profile detail | `.place-profile-detail` | 选中后展开 |
| Schema doc block | `.schema-doc` | /field-note-input/ |
| Validation rule | `.validation-rule` | 7 条 validation 卡片 |
| Archive bridge field | `.archive-field` | /archive-bridge/ |

---

## 8. 严格遵守的边界 (硬规则)

| # | 边界 | v0.6 状态 |
|---|---|---|
| 1 | 不下载新资源 | ✅ |
| 2 | 不修改研究数据库 | ✅ |
| 3 | 不运行 OCR | ✅ |
| 4 | 不改变 Citation ID | ✅ |
| 5 | 不引入 Neo4j | ✅ |
| 6 | 不引入 embeddings | ✅ |
| 7 | 不做后台服务 | ✅ (零 API endpoint) |
| 8 | 不抓取 shuge.org | ✅ |
| 9 | 不抓取 Conan Xin Archive | ✅ (schema only) |
| 10 | 不实装 field note 输入管道 | ✅ (仅 spec) |
| 11 | 不存实际照片 | ✅ |
| 12 | 不引入 WebSocket / API server | ✅ |
| 13 | 不引入 iFrame / embed / submodule | ✅ |
| 14 | 修复 v0.5 遗留的 place_id 不一致 | ✅ |

---

## 9. 输出清单

```
shuge-exhibition-v0.6/
├── DESIGN_v0.6.md                       (this file)
├── IA_v0.6.md
│
├── index.html                           / 总览 (继承 v0.5)
│
├── cases/, rooms/, evidence-explorer/, places/, fieldwork/   (继承)
├── workspaces/, field-notes/, timeline/                     (v0.5 继承)
│
├── projects/index.html                  ★ NEW /projects/ (3 projects)
├── places-profile/index.html            ★ NEW /places-profile/ (10 profiles)
├── field-note-input/index.html          ★ NEW /field-note-input/ (16+5 schema + 7 rules)
├── archive-bridge/index.html            ★ NEW /archive-bridge/ (3 IDs + 3 contracts + 6 invariants)
│
├── css/style.css                       (v0.6 追加 ~80 行)
├── js/main.js                          (v0.6 追加 helper)
│
└── data/  (28 个 JSON)
    ├── v0.5 继承 24 个 (含修正后的 field_notes.json)
    └── v0.6 新增 4 个
        ├── research_projects.json       (8.4 KB · 3 projects · 6 RQ · 4 notes · 7 gaps)
        ├── place_profiles.json          (13.8 KB · 10 profiles · 16 cites · 14 projects · 3 notes)
        ├── field_note_input_spec.json   (5.6 KB · 16 + 5 fields · 7 validation rules)
        └── archive_bridge.json          (4.0 KB · 3 IDs · 3 contracts · 6 invariants)
```

---

**v0.6 终态: 从 Exhibition 升级为长期 Research Platform;3 个 project + 10 个 place profile + 16-field input spec + archive bridge schema;修正 v0.5 遗留的 place_id 不一致问题。**