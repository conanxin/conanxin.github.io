# SHUGE DH Exhibition v0.4 — Evidence Explorer & Place Layer Design

**Date:** 2026-09-28
**Phase:** v0.4 (从 Evidence 展示 → Evidence + Place + Fieldwork 基础架构)
**Author:** Xin Conan + OpenClaw
**Site:** `conanxin/conanxin.github.io/projects/shuge-exhibition-v0.4/`

---

## 0. 升级范围 (相对 v0.3)

| 维度 | v0.3 | v0.4 |
|---|---|---|
| **证据单元** | Evidence Card (12 张, 4 字段) | Evidence Card + **Place Entity** + **Fieldwork Record** |
| **空间维度** | 无 | 10 个 Place (桑干河/黄河/江水/临安/北京/园林/宫殿/寺庙/古道/运河) |
| **网络视图** | 无 | 静态 evidence_graph (5 类节点 + 7 类边) |
| **实地桥接** | 无 | fieldwork_schema + 2 demo records |
| **页面数** | 12 (5 rooms + 5 cases + index + js/css) | **15 (+ evidence-explorer + places + fieldwork)** |
| **JSON 数据** | 16 个 (1.0 MB) | **20 个 (1.4 MB)** |

---

## 1. 设计原则

### 1.1 三层结构

```
Layer A: Evidence (旧)         ← 不变,保留 v0.3 全部
Layer B: Place     (新 v0.4)   ← 地理实体,链接 Evidence
Layer C: Fieldwork (新 v0.4)   ← 实地调查,补充 Evidence
```

**约束:** 三层通过唯一 citation_id 连接;不引入 vector DB / graph DB / embeddings。

### 1.2 静态 JSON 图谱

`evidence_graph.json` 是 v0.4 核心:

- **5 类节点:** place / work / citation / collection / evidence_card
- **7 类边:** place_bound_to_citation / place_related_to_work / place_related_to_collection / citation_belongs_to_work / work_in_collection / evidence_card_about_citation / evidence_card_about_place
- **规模:** 54 nodes + 2310 edges (主要 work_in_collection 边,因每张 PAGE 算独立 membership)
- **不使用:** Neo4j / PostgreSQL graph extension / embeddings / vector DB

### 1.3 Place Entity Schema

```json
{
  "place_id": "sangganhe",                    // snake_case, 唯一
  "slug": "sanggan-he",                       // URL-safe
  "name_zh": "桑干河",                         // 中文名
  "name_pinyin": "Sanggan He",
  "name_en": "Sanggan River",
  "category": "natural_river",                // 5 类: natural_river / historical_city / architectural_type / infrastructure / waterway
  "kind_zh": "北方河流",
  "description_zh": "...",
  "dynasty_range": ["北魏", "明", "清"],
  "coordinates_placeholder": {                // 仅示意,P5-E 接入 GIS 后回填
    "type": "approximate_region"
  },
  "related_collections": ["historical-hydrology"],
  "related_works": ["p124575"],
  "primary_citations": ["SHUGE:p124575:1"],   // 必须绑定已有 citation
  "extraction_method": "place_name_match",
  "status": "DRAFT",                          // DRAFT / PLACEHOLDER / REVIEWED / ARCHIVED
  "fieldwork_priority": "high",
  "notes": "..."
}
```

### 1.4 Fieldwork Bridge Schema

```json
{
  "fieldwork_id": "FW-YYYYMMDD-NNN",          // 唯一田野记录 ID
  "place_id": "...",                           // 必须匹配 places.json
  "fieldworker_name": "...",                   // v0.4 匿名化
  "visit_date": "YYYY-MM-DD",
  "visit_type": "site_survey | archive_visit | interview | oral_history",
  "gps_lat": 0.0,                              // v0.4 仅 placeholder
  "gps_lng": 0.0,
  "weather_conditions": "...",
  "equipment_used": ["..."],
  "raw_notes_path": "fieldwork/notes/...",     // 路径占位,不存数据
  "photo_count": 0,
  "audio_recording_count": 0,
  "linked_citation_ids": ["SHUGE:p...:..."],
  "linked_evidence_card_ids": ["F1"],
  "new_citation_proposed": [],
  "verification_status": "VERIFIED | UNVERIFIED | CONTRADICTED",
  "notes_for_curator": "...",
  "next_action": "..."
}
```

**v0.4 状态:** schema + 2 demo records (桑干河 archive visit + 北京 site survey),实际数据接入待 P5-E。

---

## 2. 视觉规范 (继承 v0.3 + 新增)

### 2.1 复用 v0.3 全部

- 主色: paper-white #f7f3eb / card-cream #efe9da / ink-charcoal #1a1a1a / seal-red #8b3a2e
- 字体: 'Source Sans 3' / 'Noto Serif CJK SC' / 'IBM Plex Mono'
- 卡片样式: 1px solid rule-gray,无圆角,无 box-shadow
- 布局: max-width 820px

### 2.2 v0.4 新增组件

| 组件 | 类名 | 用途 |
|---|---|---|
| Place Card | `.place-card` | 单个 place 卡片,左侧 category badge + 中部 name + 右侧 citation count |
| Place Filter Bar | `.place-filter-bar` | 按 category 过滤 |
| Evidence Graph SVG | `.evidence-graph-svg` | 5 类节点 + 7 类边的网络图 |
| Fieldwork Timeline | `.fieldwork-timeline` | 按 visit_date 排序的记录列表 |
| Status Badge | `.place-status-DRAFT` / `.place-status-PLACEHOLDER` | place 状态标签 |
| Category Badge | `.place-cat-natural_river` / `.place-cat-historical_city` 等 5 个 | 类别标签 |
| Fieldwork Phase | `.fieldwork-phase-A` ~ `.fieldwork-phase-E` | 5 阶段进度条 |

### 2.3 不可用元素 (继承)

- 渐变 / 圆角 / box-shadow / neon glow / emoji icon / AI-cyberpunk

---

## 3. 页面结构 (15 个 HTML)

| 路径 | 用途 | 状态 |
|---|---|---|
| `/` | 总览 | v0.3 |
| `/cases/case1-5/` | 5 个案例研究 | v0.3 |
| `/rooms/room1-5/` | 5 个展厅 (5-section) | v0.3 |
| `/evidence-explorer/` | **新 v0.4** 交互式证据浏览器 |
| `/places/` | **新 v0.4** 10 个 Place 列表 + 详情 |
| `/fieldwork/` | **新 v0.4** 田野调查桥接 schema + demo |

每个 v0.4 页面顶部加一行 v0.4 nav bar:
- `Overview` · `Rooms` · `Cases` · **Evidence Explorer** · **Places** · **Fieldwork**

---

## 4. 与已有数据的连接

| v0.4 实体 | 已有来源 | 引用方式 |
|---|---|---|
| Place.primary_citations | P5-D citations table | 字符串 `SHUGE:p<post_id>:<page_seq>` |
| Place.related_works | P5-D works (featured) | 字符串 `p<post_id>` |
| Place.related_collections | P5-C collections | slug `historical-hydrology` 等 |
| Place evidence 绑定 | P5-D evidence_cards_v3.json | 关键词 + work_id 双向匹配 |
| Evidence Graph | 全部 P5-C/D 终态 | 静态 JSON 引用,无 join |
| Fieldwork → Citation | 已有 SHUGE:p...:... | 同 v0.3 |

**禁止:**
- 新增 citation_id (即不创造新的 `SHUGE:p...:...` ID)
- 改 P5-C/D schema
- 引入 GIS / 实际坐标
- 引入实地照片存储 (P5-E 范围)

---

## 5. 边界与下一阶段

### v0.4 完成边界 (本轮)

- ✅ 4 个新 JSON 文件生成
- ✅ 10 个 Place 全部绑定 (或 PLACEHOLDER 标注) 已有 citation_id
- ✅ Evidence Graph 静态生成
- ✅ Fieldwork Bridge schema 完整
- ✅ 3 个新页面渲染

### v0.5 之后 (用户未要求,故不动)

- ❌ 不实际抓取 shuge.org 任何资源
- ❌ 不引入 GIS / 实际 GPS 数据
- ❌ 不存真实 fieldwork 照片/录音
- ❌ 不动 P5-D 数据
- ❌ 不做 cross-page indexing / search engine
- ❌ 不引入 embeddings / vector DB / Neo4j / graph DB
- ❌ 不改 Citation ID

---

## 6. 引用计数 (v0.4 终态)

| 数据维度 | 计数 |
|---|---|
| Place entities | 10 |
| Place ↔ Citation bindings | 19 (per-card bindings) + 16 (place→citation primary edges) |
| Place ↔ Work edges | 10 |
| Place ↔ Collection edges | 8 |
| Evidence Graph nodes | 54 |
| Evidence Graph edges | 2310 |
| Fieldwork demo records | 2 |
| Fieldwork schema phases | 5 |
| HTML pages | 15 (12 + 3) |
| JSON data files | 20 (16 + 4) |
