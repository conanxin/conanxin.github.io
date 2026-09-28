# DESIGN_v0.5 · Research Workspace & Field Notebook Design

## 0. 文档元数据

| 项 | 值 |
|---|---|
| 版本 | v0.5 |
| 上游 | v0.4 (Evidence + Place + Fieldwork 基础架构) |
| 下游 | v0.6 (cross-archive linking + cross-publication export) |
| 时间 | 2026-09-28 |
| 提交 | 待 push |
| 仓库 | conanxin/conanxin.github.io/projects/shuge-exhibition-v0.5 |
| 视觉来源 | 继承 v0.3 + v0.4 (paper-white / card-cream / ink-charcoal / seal-red) |

---

## 1. v0.4 → v0.5 的定位变化

### 1.1 v0.4 已有三层

| 层 | v0.4 实体 | 数量 |
|---|---|---|
| A. Evidence | evidence_card | 12 |
| B. Place | place entity | 10 |
| C. Fieldwork | fieldwork_schema + 2 demo records | (schema only) |

### 1.2 v0.5 新增的研究层

| 层 | v0.5 实体 | 数量 |
|---|---|---|
| **D. Research Question** | research_workspace (6 fields × 3 workspaces = 18 sub-fields) | 3 workspaces · 6 RQ |
| **E. Field Notebook** | field_note (8 fields + 4 demo records) | 4 demo notes |
| **F. Timeline Layer** | timeline_layer (4 layers × 18 events) | 4 layers · 18 events |

### 1.3 升级目标

把 v0.4 的「Evidence + Place」二元结构,升级为「**Research Question + Place + Fieldwork**」三元结构 — 让观众/学者沿着具体的研究问题走,而非只看证据 + 地点。

---

## 2. Research Workspace 页面 (/workspaces/)

### 2.1 单个工作站内部结构

每个 research workspace 是一个完整的微型研究项目,必须显式列出:

| 字段 | 来源 | 边界 |
|---|---|---|
| workspace_id | 生成时分配 | — |
| title_zh | 用户输入 | — |
| question | 必填,一句话回答"研究什么" | — |
| question_subquestions | 3-4 个子问题 | — |
| collection_slugs | 必须来自 P5-C 2 个 collection 之一 | 禁止新增第 3 个 |
| linked_place_ids | 引用 v0.4 places.json | 不可新增 place |
| linked_citation_ids | 引用 P5-D frozen DB citation_id | 不可新增/修改 |
| linked_evidence_card_ids | 引用 v0.3 evidence_cards_v3 | 不可新增 |
| linked_case_study_ids | 引用 v0.3 case_studies | — |
| gaps | 数组:gap_id + description + status | — |
| research_questions | 数组:rq_id + text + status | — |
| review_status | PENDING / APPROVED / REJECTED | — |
| stats | 8 个统计字段 | — |

### 2.2 三个 v0.5 demo workspaces

1. **ws-hydrology-river-distribution** (水经注河水分布研究) — collection: historical-hydrology · 4 places · 2 RQ
2. **ws-architecture-pillar-diameter** (工程做法柱径标准) — collection: architecture-construction · 3 places · 2 RQ
3. **ws-cross-hydrology-architecture** (营造与水利交叉) — collections: both · 6 places · 2 RQ (cross-cutting)

### 2.3 页面分区

- Hero: workspace 列表 (3 个卡片)
- Question Drilldown: 选中 workspace 后展开子问题、集合、地点、citation、evidence、gaps
- Cross-workspace compare: 多个 workspace 的证据并排对比
- Take-away: 「为什么这些问题重要 — 这不是数据可视化,是研究工具」

---

## 3. Field Notebook schema (/field-notes/)

### 3.1 schema 字段

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| field_note_id | string | yes | FN-YYYYMMDD-NNN |
| place_id | string | yes | 必须引用 v0.4 places.json 的 place_id |
| date | string (YYYY-MM-DD) | yes | 实地日期 |
| location_text | string | yes | 自然语言位置描述 |
| gps_lat | float | no | placeholder,v0.5 不上传真实数据 |
| gps_lng | float | no | placeholder |
| weather | string | no | — |
| photos_count | int | no | 不存实际照片,只记数 |
| recording_count | int | no | — |
| fieldworker_name | string | no | v0.5 匿名化为 A/B/C |
| linked_citation_ids | array[string] | yes | SHUGE:p\<post_id\>:\<page_seq\> |
| linked_evidence_card_ids | array[string] | no | claim_id |
| linked_research_question_ids | array[string] | no | rq_id |
| observation | string | yes | 自然语言描述 |
| verification_status | enum | yes | UNVERIFIED / VERIFIED / CONTRADICTED / NEEDS_REVIEW |
| tags | array[string] | no | — |

### 3.2 4 个 demo notes

1. FN-20260928-001 · 桑干河 · 张家口 · NEEDS_REVIEW — 河床干涸与古籍记载不符
2. FN-20260928-002 · 北京 (故宫) · 太和殿 · VERIFIED — 柱径 d=2c 已核实
3. FN-20260928-003 · 北京 (颐和园) · 长廊亭 · UNVERIFIED — 园林柱径与宫殿不同
4. FN-20260928-004 · 运河 (通州) · UNVERIFIED — 大运河通州段仍可通航

### 3.3 边界

- **不存实际照片** — photos_count 字段存在但 0 张实际图片上传
- **GPS 为示意坐标** — 所有 gps_lat/lng 仅为 placeholder,P5-E 才接入真实测绘
- **fieldworker 匿名** — v0.5 显示为 fieldworker-A/B/C,不公开个人身份

---

## 4. Timeline Layer (/timeline/)

### 4.1 四条 timeline layers

| Layer | 类型 | 颜色 | 事件数 | 说明 |
|---|---|---|---|---|
| layer-textual | TEXT | seal-red | 5 | 古典文献 (北魏 - 明末 - 清雍正) |
| layer-evidence | EVIDENCE | status-green | 3 | v0.3 evidence cards 按主题分组 |
| layer-place | PLACE | archival-brown | 4 | v0.4 places 实地对照 |
| layer-collection | COLLECTION | ink-charcoal | 6 | P5-C 集合 + v0.5 workspaces + cross-archive |

### 4.2 时间跨度

- BCE 1100 (西周初年) — CE 2026 (v0.5 终态)
- 总计 18 个 event markers

### 4.3 视觉

- 4 条平行轨道,每条轨道独立时间轴
- 事件以矩形 marker 显示,点击展开 citation/place/note 详情
- 颜色继承 v0.3 配色变量 (`--seal-red` / `--status-green` / `--archival-brown` / `--ink-charcoal`)

---

## 5. 与 Conan Xin Archive 的连接方案

### 5.1 Conan Xin Archive 是什么

Conan Xin Archive (`/conanxin-archive/` 或外部仓库) 是 Xin Conan 的个人研究档案:
- 个人 notes
- 私人 fieldwork 笔记
- 长期 research log
- 跨课题 connecting materials

### 5.2 v0.5 连接原则

| 原则 | 边界 |
|---|---|
| 严格只读 | v0.5 不写 Conan Xin Archive |
| 不抓取 | v0.5 不抓取 Conan Xin Archive 任何内容 |
| 仅 ID-link | 通过 `linked_research_question_ids` 字段引用 Conan Xin Archive 中已存在的 rq_id |
| 由档案端生成 | 跨链接表由 Conan Xin Archive 端维护,v0.5 仅消费 |
| schema 公开 | v0.5 公开 schema,允许 archive 端 schema 自洽 |

### 5.3 跨链接字段 (跨 archive 共用)

| 字段 | v0.5 侧 | Conan Xin Archive 侧 |
|---|---|---|
| `rq_id` | research_questions.json | research_notes.json |
| `field_note_id` | field_notes.json | private_notes.json |
| `gap_id` | research_workspaces.json gaps[] | research_gaps.json |
| `linked_archive_rq_ids` | (v0.6 引入) | 由 archive 生成 |

### 5.4 v0.5 不做的跨 archive 操作

- ❌ 不抓取 archive 任何资源 (URL fetch、git clone、SSH、API call)
- ❌ 不写 archive (no INSERT/UPDATE)
- ❌ 不引入 archive 数据库 (no Notion、Obsidian、Roam API)
- ❌ 不引入 Git submodule
- ❌ 不引入 iFrame / embed

### 5.5 v0.5 实际做的跨 archive 准备

- ✅ 在 DESIGN_v0.5.md 公开 `linked_archive_rq_ids` 字段的预留
- ✅ 在 timeline_layers.json layer-collection 增加 evt-coll-006「Conan Xin Archive 入口」
- ✅ 在 research_workspaces.json gaps[] 增加 gap-ws3-001「跨 archive 链接规则尚需文档化」
- ✅ 提供 ID 命名空间映射 (FN-\<YYYYMMDD\>-\<NNN\> 可跨 archive 复用)

---

## 6. 视觉规范 (继承 v0.3 + v0.4)

### 6.1 配色变量 (复用 v0.3)

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

### 6.2 v0.5 新增组件

| 组件 | CSS class | 用途 |
|---|---|---|
| Workspace card | `.workspace-card` | 列表卡片 |
| Workspace detail | `.workspace-detail` | 选中后展开面板 |
| Research question chip | `.rq-chip` | RQ 标签 |
| Field notebook entry | `.field-note-card` | 田野笔记卡片 |
| Timeline layer | `.timeline-layer` | 时间线层 |
| Timeline event | `.timeline-event` | 时间线事件 marker |
| Gap indicator | `.gap-indicator` | gap 状态显示 |

### 6.3 字体 (继承 v0.3)

- Source Sans 3 / Source Serif 4 (英文)
- Noto Serif CJK SC (中文)
- IBM Plex Mono (引用 ID / 代码)

### 6.4 风格边界

- 严格保持「数字博物馆 + 学术实验室」风格
- 严格避免 AI/cyberpunk 风格
- 严格避免渐变、阴影、动画(但允许 minimal hover state)

---

## 7. 严格遵守的边界 (硬规则)

| # | 边界 | v0.5 状态 |
|---|---|---|
| 1 | 不下载新资源 | ✅ |
| 2 | 不修改研究数据库 | ✅ |
| 3 | 不运行 OCR | ✅ |
| 4 | 不改变 Citation ID | ✅ |
| 5 | 不引入 GIS server | ✅ (GPS 仅 placeholder) |
| 6 | 不引入 Neo4j | ✅ |
| 7 | 不引入 embeddings | ✅ |
| 8 | 不抓取 shuge.org | ✅ |
| 9 | 不抓取 Conan Xin Archive | ✅ (只引 ID,不读内容) |
| 10 | 不存实际照片 | ✅ (photos_count 字段存在但 0 张) |
| 11 | 不引入 WebSocket / API server | ✅ (纯静态) |
| 12 | 不引入 iFrame / embed | ✅ |

---

## 8. 输出清单

```
shuge-exhibition-v0.5/
├── DESIGN_v0.5.md              (this file)
├── IA_v0.5.md
│
├── index.html                  / 总览 (继承 v0.4)
│
├── workspaces/index.html       ★ NEW /workspaces/ (3 workspaces · 6 RQ · drilldown)
├── field-notes/index.html      ★ NEW /field-notes/ (schema + 4 demo notes)
├── timeline/index.html         ★ NEW /timeline/ (4 layers · 18 events)
│
├── cases/, rooms/, evidence-explorer/, places/, fieldwork/   (继承 v0.3/v0.4)
│
├── css/style.css              (v0.5 追加 ~120 行)
├── js/main.js                  (v0.5 追加 helper)
│
└── data/                       (新增 4 个)
    ├── research_workspaces.json       (7.9 KB · 3 workspaces)
    ├── research_questions.json        (3.4 KB · 6 RQ)
    ├── field_notes.json               (4.7 KB · 4 demo notes)
    └── timeline_layers.json           (6.2 KB · 4 layers · 18 events)
```

---

**v0.5 终态: 6 个 JSON 数据文件 + 3 个新页面 + 2 个设计文档 + Research Question 层首次上展。**