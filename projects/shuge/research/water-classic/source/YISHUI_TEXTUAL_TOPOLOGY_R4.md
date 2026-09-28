# YISHUI_TEXTUAL_TOPOLOGY_R4.md

**易水文本拓扑 · R4**
*WATER_CLASSIC_R4_YISHUI_TEXTUAL_SPATIAL_STUDY*

```
schema_version: r4-yishui-textual-topology/1.0
generated_at:  2026-09-28T17:25:28+08:00
task:          WATER_CLASSIC_R4_YISHUI_TEXTUAL_SPATIAL_STUDY
status:        SECTION_F_DATA_COMPLETE
```

---

## 0. 三個維度的區分 (Three Dimensions)

依用戶 R4 spec F 節要求，本研究區分三個維度：

| 維度 | 狀態 | 說明 |
|------|------|------|
| **TEXTUAL_ORDER** | ✓ VERIFIED | 水經文本內部順序（東過范陽縣南又東過容城縣南）|
| **HYDROLOGICAL_RELATION** | ✓ VERIFIED | 水系流轉關係（出/注/合/會/入）|
| **REAL_WORLD_LOCATION** | ⚠ UNRESOLVED | 現代地理坐標匹配 — 本研究**不嘗試**；預留獨立外部考據 |

**重要：本階段不以現代地圖匹配為目標。**

---

## 1. 節點統計 (Node Statistics)

- 總節點數：72
- 節點類型分布：

| 類型 | 數量 |
|------|------|
| river | 9 |
| tributary | 10 |
| historical_place | 47 |
| mountain | 5 |
| lake | 1 |

**核心三地名節點：**
- 范陽 (范陽縣 / 范陽縣故城 / 范陽) — historical_place
- 容城 (容城縣 / 容城縣故城) — historical_place
- 故安 (故安縣 / 故安縣故城 / 閻鄉) — historical_place

**核心水系節點：**
- 易水 (primary river)
- 濡水 (tributary, also called 巨馬水 / 渠水)
- 巨馬水 / 巨馬河 (same as 濡水)
- 淶水 (tributary)
- 滱水 (卷十一第二水)
- 子莊溪 / 女思谷水 / 雹河 / 范水 / 渥水 / 濾水 / 督亢溝 / 酈亭溝 / 白溝水 (minor tributaries)

---

## 2. 邊統計 (Edge Statistics)

- 總邊數：29
- 邊關係類型：confluences_with, enters_into, flow_east, flows_into, historical_relation, location_in, origin_from, passes_east_of, passes_north_of, passes_south_of, south_of_city_east_flow

**核心三地名相關邊：**

| subject | relation | object | pid | source |
|---------|----------|--------|-----|--------|
| 閻鄉西山 | origin_from | 易水 | pid1655 | canonical |
| 易水 | flow_east | 五大夫城南 | pid1655 | visual |
| 子莊溪 | flows_into | 易水 | pid1655 | visual |
| 易水 | passes_east_of | 關門城西南 | pid1656 | visual |
| 女思谷水 | confluences_with | 易水 | pid1656 | visual |
| 易水 | passes_south_of | 漸離城 | pid1656 | visual |
| 易水 | passes_south_of | 武陽 | pid1656 | visual |
| 濡水枝津 | flows_into | 易水 | pid1656 | visual |
| 故安縣故城 | south_of_city_east_flow | 易水 | pid1656 | visual |
| 易水 | passes_south_of | 范陽縣故城 | pid1657 | canonical_header |
| 易水 | passes_south_of | 容城縣故城 | pid1657 | canonical_header |
| 范陽 | origin_from | 范水 | pid1661 | visual |
| 故安縣 | passes_north_of | 濡水 | pid1659 | visual |
| 閻鄉 | origin_from | 易水 | pid1659 | visual |
| 范陽 | enters_into | 濡水 | pid1659 | visual |
| 易水 | confluences_with | 濡水 | pid1659 | visual |
| 易水 | passes_north_of | 容城縣故城 | pid1659 | visual |
| 容城 | confluences_with | 易水 | pid1659 | visual |
| 武陽城 | historical_relation | 燕下都 | pid1656 | visual |
| 故安縣故城 | historical_relation | 燕丹餞荊軻 | pid1660 | visual |
| 易水 | passes_south_of | 易京城 | pid1661 | visual |
| 巨馬水 | passes_north_of | 范陽縣故城 | pid1682 | visual |
| 易水 | flows_into | 巨馬水 | pid1682 | visual |
| 巨馬水 | passes_north_of | 容城縣故城 | pid1682 | visual |
| 督亢陌 | location_in | 故安縣南 | pid1683 | visual |


---

## 3. 易水章核心拓撲序列 (Yi River Chapter Core Topology Sequence)

依 pid1655 → pid1656 → pid1657 → pid1659 → pid1660 → pid1661 → pid1682 順序：

```
(pid1655)
閻鄉西山 ─origin_from─→ 易水
                          │
                          ├─flow_east→ 五大夫城南
                          └─會→ 子莊溪水

(pid1656)
易水 ──passes_east_of──→ 關門城西南 (燕長城門)
   ├─confluences_with──→ 女思谷水 (三會口)
   ├─passes_south_of──→ 漸離城 (太子丹館高漸離處)
   ├─passes_south_of──→ 武陽 (燕下都)
   ├─passes_south_of──→ 故安縣故城 (外東流)
   └─flows_into←──濡水枝津故瀆

(pid1657) [KEY HEADER]
易水 ──passes_south_of──→ 范陽縣故城 ──→ 又passes_south_of──→ 容城縣故城
   │
   ├─passes_west_of──→ 故安城西側城南
   └─relation──→ 金臺 + 蘭馬臺 (燕昭王禮賓郭隗)

(pid1659)
閻鄉 ──origin_from──→ 易水 ──enters_into──→ 濡水 (至范陽入濡水)
   │
   ├─passes_north_of──→ 故安縣 → 濡水
   ├─passes_south_of──→ 容城縣西北大利亭
   └─historical──→ 范陽 (會北濡)

(pid1660)
故安縣故城 ──historical──→ 燕丹餞荊軻 (於此)
   │
   ├─passes_west_of──→ 易水 (逕長城西)
   └─passes_north_of──→ 范陽城西十里 (梁門陂)

(pid1661)
易水 ──passes_south_of──→ 范陽縣故城 (應劭：范水之陽)
   ├─passes_north_of──→ 樊輿縣故城
   ├─passes_south_of──→ 容城縣故城南 (漢高帝六年封國)
   └─passes_south_of──→ 易京城 (公孫瓚害劉虞處)

(巨馬水 / cross-water boundary)
(pid1682)
巨馬水 ──passes_north_of──→ 迺縣故城
   ├─passes_north_of──→ 范陽縣故城 (易水注之)
   ├─passes_north_of──→ 容城縣故城
   └─flows_into←──督亢溝 / 酈亭溝

(pid1683)
督亢陌 ──location_in──→ 故安縣南 (督亢地在涿郡，今故安縣南有督亢陌)
   │
   ├─passes_south_of──→ 容城縣故城北 (再次)
   └─relation──→ 燕太子丹使荊軻齎督亢地圖入秦
```

---

## 4. 邊關係類型分布

| 邊關係類型 | 數量 | 例子 |
|------------|------|------|
| passes_south_of | 7 | 易水逕范陽縣故城南 |
| passes_north_of | 5 | 巨馬水逕容城縣故城北 |
| origin_from | 3 | 易水出閻鄉西山 |
| flows_into | 4 | 易水注巨馬水 |
| confluences_with | 3 | 女思谷水會易水 |
| flow_east | 1 | 易水出西山東逕 |
| enters_into | 1 | 至范陽入濡水 |
| historical_relation | 2 | 武陽城 = 燕下都 |
| location_in | 1 | 督亢陌在故安縣南 |

---

## 5. 文件輸出

- JSON: `data/yishui_textual_topology_r4.json` (19257 B, 72 nodes, 29 edges)
- Markdown: `source/YISHUI_TEXTUAL_TOPOLOGY_R4.md` (本文)
- 來源: `data/yishui_image_review_r4.json` (Section C) + `data/yishui_controlled_transcription_r4.json` (Section D) + `data/yishui_spatial_relations_r4.json` (Section E)

---

## 6. 邊界條件

| Constraint | Status |
|------------|--------|
| NEW_OCR | 0 ✓ |
| NEW_ACQUISITION | 0 ✓ |
| DB_WRITES | 0 ✓ |
| EMBEDDINGS | 0 ✓ |
| NO_MODERN_MAP_MATCHING | ✓ (REAL_WORLD_LOCATION = UNRESOLVED) |

---

*Section F data + MD complete. Continuing R4 Sections G → M.*
