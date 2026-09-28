# SHUGE DH Exhibition v0.4 — Information Architecture

**Date:** 2026-09-28
**Phase:** v0.4 — Evidence Explorer + Place Layer + Fieldwork Bridge
**Status:** COMPLETE

---

## 1. 站点地图 (15 pages)

```
/                                                       Project Overview (v0.3)
/cases/case1/   水经注数字生命史                          v0.3 Case Study
/cases/case2/   古代水利与河防                            v0.3 Case Study
/cases/case3/   建筑营造知识                              v0.3 Case Study
/cases/case4/   乃粒跨文本互证                            v0.3 Case Study
/cases/case5/   AI-assisted Historical Research          v0.3 Case Study
/rooms/room1/   From Catalogue to Research Infrastructure v0.3 Room
/rooms/room2/   The Life of a Book: 水经注 Case Study     v0.3 Room
/rooms/room3/   Historical Hydrology & River Defense     v0.3 Room
/rooms/room4/   Architecture & Construction Knowledge    v0.3 Room
/rooms/room5/   AI-assisted Historical Research           v0.3 Room
/evidence-explorer/                                       ★ NEW v0.4
/places/                                                ★ NEW v0.4
/fieldwork/                                             ★ NEW v0.4
```

---

## 2. v0.4 三个新页面 IA

### 2.1 /evidence-explorer/ — Evidence Explorer

**目标:** 让策展人和研究者从单一 question 出发,沿证据链追溯到 Place、Work、Collection、Fieldwork。

**结构:**
1. Hero — 标题 + 数据范围元表 (12 cards · 54 nodes · 2310 edges · 10 places)
2. Filter Bar — 按 collection (历史水利/建筑营造/无) + by review_status 过滤
3. Evidence Ledger — 12 张 evidence cards (v0.3 完整版,含 source_context + citation_path)
4. Place ↔ Card 双向索引表 — 展示 19 bindings (按 place_id 分组)
5. Citation Path Examples — 4 张卡的 citation_path 完整展开
6. Evidence Graph SVG (静态) — 节点 + 边的简化网络图
7. Take-away — 三层结构 (Evidence / Place / Fieldwork) 总结

**JSON 数据源:**
- `data/evidence_cards_v3.json` — 12 cards
- `data/place_evidence.json` — 19 bindings
- `data/evidence_graph.json` — 54 nodes + 2310 edges
- `data/places.json` — 10 places (静态参考)

**交互:** 仅前端 JS;无后端、无 API、无表单提交。

---

### 2.2 /places/ — 10 Place 列表

**目标:** 静态展示 10 个 Place entity 及其与现有 citation 的绑定。

**结构:**
1. Hero — 标题 + 元表 (10 places · 5 categories · 8 collection-bound)
2. Category Filter Bar — natural_river / historical_city / architectural_type / infrastructure / waterway
3. Place Card Grid — 10 个 place-card (含 name_zh, name_pinyin, category badge, status badge, binding count)
4. Place Detail Anchor — 每个 card 可点击展开为 detail 视图 (JS 控制,无跳转)
   - Description (zh + en)
   - Dynasty range
   - Related collections (badge list)
   - Related works (badge list)
   - Primary citations (mono 列表)
   - Extraction method + status
   - Notes
5. Place ↔ Evidence Card Cross-Reference — 引用 place_evidence.json
6. Take-away — 5 类 category 综述 + P5-E 实地调研候选 (桑干河高优)

**JSON 数据源:**
- `data/places.json` — 10 places
- `data/place_evidence.json` — by_place 索引

---

### 2.3 /fieldwork/ — Fieldwork Bridge

**目标:** 展示 v0.4 田野调查桥接 schema,并提供 2 个 demo records 作为 P5-E 模板。

**结构:**
1. Hero — 标题 + 元表 (2 demo records · 5 phases · 6 status types)
2. Introduction — 为什么需要 Fieldwork Bridge (实地 vs 文本)
3. Schema 表 — fieldwork_record_schema 完整字段定义 (table form)
4. Status Phases — 6 阶段流程 (PLANNED → ARCHIVED)
5. 5 Phases Timeline — Planning → Site visit → Transcription → Curator review → Archive
6. Demo Records — 2 个 mock records (FW-20260928-001 桑干河 + FW-20260928-002 北京)
7. Integration Points — 与 places.json / evidence_cards_v3.json / evidence_graph.json / collections.json 的连接
8. v0.4 Status Note — 当前 schema only,P5-E 才接入真实数据
9. Take-away — Fieldwork 是文本外的第三条证据来源

**JSON 数据源:**
- `data/fieldwork_schema.json` — schema + 2 demo records + 5 phases

---

## 3. Navigation (v0.4 完整 nav bar)

每个页面顶部 nav:

```
书格数字人文研究站 · v0.4
─────────────────────────────────────────────────
Overview · Rooms · Cases · Evidence Explorer · Places · Fieldwork
```

**当前页 active:** 用 underline 标记 (CSS).

**Overview 跳转:** `/` (总览)
**Rooms:** `/rooms/room1/` (跳转到 room1,因为 nav 文字不带 anchor)
**Cases:** `/cases/case1/`
**Evidence Explorer:** `/evidence-explorer/`
**Places:** `/places/`
**Fieldwork:** `/fieldwork/`

---

## 4. JSON 数据流 (v0.4)

```
                  P5-C collections (historical-hydrology, architecture-construction)
                              ↓
                P5-D evidence_cards_v3 (12 cards, frozen)
                              ↓
                       ┌──────┴──────┐
                       ↓             ↓
              v0.4 places.json   v0.4 place_evidence.json
              (10 places)       (19 bindings)
                       ↓             ↓
                       └──────┬──────┘
                              ↓
                       evidence_graph.json
                       (54 nodes · 2310 edges · 5 node types · 7 edge types)
                              ↓
                       ┌──────┴──────┐
                       ↓             ↓
                  /evidence-       /places/
                  explorer/
                              ↓
                       fieldwork_schema.json
                              ↓
                          /fieldwork/
```

**核心约束:**
- 4 个 v0.4 JSON 文件全部只读
- 所有 citation_id 引用 P5-D 终态,无新增
- 所有 graph 节点 ID 均为已有 real IDs (work_id_text, citation_id, collection slug, claim_id)
- 无 graph DB / vector DB / embeddings

---

## 5. 组件复用矩阵

| 组件 | /evidence-explorer/ | /places/ | /fieldwork/ |
|---|---|---|---|
| Filter bar | ✓ | ✓ | — |
| Card grid | ✓ | ✓ | — |
| Detail panel (JS) | ✓ | ✓ | — |
| Mono badge list | ✓ | ✓ | ✓ |
| Schema table | — | — | ✓ |
| Phase timeline | — | — | ✓ |
| SVG graph | ✓ | — | — |
| Citation viewer | ✓ | — | — |
| Source context block | ✓ | — | ✓ |
| Evidence ledger | ✓ | — | — |
| Take-away block | ✓ | ✓ | ✓ |
| Further reading | ✓ | ✓ | ✓ |

---

## 6. 后续路线 (v0.5+) — 用户未要求,仅 reference

- ❌ 不做: GIS 实际接入 / 真实 GPS / 真实田野记录 / cross-page search / vector search
- ✅ P5-E 可考虑: 实地照片上传 (限制 <8GB),与现有 citation 双向链接
- ✅ P5-E 可考虑: Place ↔ Coordinates 实际回填 (经纬度)
- ✅ P5-E 可考虑: Fieldwork Record 与 evidence_cards_v3.json 的双向 cite

---

## 7. v0.4 引用计数

| 项目 | 计数 |
|---|---|
| HTML pages | 15 (12 v0.3 + 3 v0.4) |
| JSON data files | 20 (16 v0.3 + 4 v0.4) |
| Place entities | 10 |
| Place ↔ Card bindings | 19 |
| Place ↔ Citation primary edges | 16 |
| Evidence Graph nodes | 54 (10 places + 9 works + 2 collections + 21 citations + 12 cards) |
| Evidence Graph edges | 2310 |
| Fieldwork schema fields | 18 |
| Fieldwork demo records | 2 |
| Fieldwork phases | 5 |
| Place categories | 5 |
| Place statuses | 4 |
| Evidence card statuses | 4 |
