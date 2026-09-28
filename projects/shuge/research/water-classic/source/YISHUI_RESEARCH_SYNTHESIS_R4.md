# YISHUI_RESEARCH_SYNTHESIS_R4.md

**易水研究綜合報告 · R4**
*WATER_CLASSIC_R4_YISHUI_TEXTUAL_SPATIAL_STUDY*

```
schema_version: r4-yishui-research-synthesis/1.0
generated_at:  2026-09-28T17:33:04+08:00
task:          WATER_CLASSIC_R4_YISHUI_TEXTUAL_SPATIAL_STUDY
status:        SECTION_I_COMPLETE
```

---

## 0. 研究問題 (Research Questions)

依 R4 spec，本研究圍繞三個層次的研究問題：

| 代號 | 研究問題 |
|------|----------|
| **RQ1** | 在《水經注》文本內部，**易水 / 范陽 / 容城 / 故安** 如何通過**空間語言**被組織？ |
| **RQ2** | 易水章節的 **textual spatial topology** 呈現怎樣的結構？ |
| **RQ3** | 在 R3.4 evidence gate 框架下，這些文本空間關係能否構成**有效證據**？ |

---

## 1. RQ1 · 空間語言分析

### 1.1 出現的空間語言

依 Section E 統計，易水章節中識別 **96 個空間關係**，主要類型分布如下：

| 空間語言 | 例子 | 語意功能 |
|----------|------|----------|
| 出 | 易水**出**涿郡故安縣閻鄉西山 | 水系發源 |
| 流 | 易水**東流** | 流向描述 |
| 過 | **東過**范陽縣南 / **又東過**容城縣南 | 路徑經過 |
| 經 | **逕**武陽南 / **逕**故安城南外東流 | 路徑經過（異文） |
| 注 | 易水**注之**（巨馬水） / **注**濡水 | 水系歸屬 |
| 合 | 至勃海平舒縣與易水**合** | 水系匯合 |
| 會 | 三**會**口定水（女思谷水會易水） | 水系匯合（異文） |
| 入 | 至范陽**入**濡水 | 水系歸屬 |
| 城南 | 易水逕故安**城南** | 城邑方位（南） |
| 城北 | 歷故安縣**北** | 城邑方位（北） |
| 城東 | 東逕容城縣故城**東** | 城邑方位（東） |
| 城西 | 易水逕長城**西** | 城邑方位（西） |

### 1.2 三地名的空間語言角色

| 地名 | 主要空間語言 | 文本功能 |
|------|--------------|----------|
| **范陽** | 東過范陽縣南 / 范陽縣故城南 / 范陽城西十里 | 水經正文標題節點 + 範水之陽應劭釋義 |
| **容城** | 又東過容城縣南 / 容城縣故城南 / 容城縣故城北 | 水經正文標題節點 + 封國地名 |
| **故安** | 涿郡故安縣閻鄉西山 / 故安城南外東流 / 故安縣北 | 易水發源地 + 行政地名（與濡水相關） |

### 1.3 RQ1 結論

✓ **SUPPORTED**：易水章節通過「出」+「東過」+「城南/城南」等空間語言，**將易水（自然地理）** 與 **范陽 / 容城 / 故安（人文地理）** 結合為統一的敘事結構。

**重要邊界：** 此空間關係**僅限於文本內部**；**不對應**現代地圖上的精確坐標。

---

## 2. RQ2 · Textual Spatial Topology 結構

### 2.1 三維框架

依 Section F 的三維框架：

| 維度 | 狀態 | 證據基礎 |
|------|------|----------|
| **TEXTUAL_ORDER** | ✓ VERIFIED | 水經正名 + 易水章節順序 |
| **HYDROLOGICAL_RELATION** | ✓ VERIFIED | 水系流轉（出/注/合/會/入） |
| **REAL_WORLD_LOCATION** | ⚠ UNRESOLVED | 現代地理坐標匹配 — **本研究不嘗試** |

### 2.2 拓撲結構 (Topology Structure)

依 Section F 統計：

- **總節點數：** 72 個
- **總邊數：** 29 條
- **節點類型：** historical_place, lake, mountain, river, tributary

### 2.3 易水章節核心序列 (Yi River Chapter Core Sequence)

依 pid 順序排列的文本內部序列：

```
[pid1655] 閻鄉西山 → 易水 → 子莊溪 → 五大夫城南
                          ↓
[pid1656] 關門城西南 ← 易水 ← 女思谷水 (三會口)
                       ← 故安城南
                       ← 漸離城
                       ← 武陽 (燕下都)
                          ↓
[pid1657] 范陽縣故城 ← 易水 ← 又過容城縣故城南  ← 大字標題
                       ← 金臺 + 蘭馬臺 (郭隗禮賓)
                          ↓
[pid1659] 閻鄉 → 易水 → 濡水 (互攝)
        故安縣北 → 大利亭 → 易水 + 巨馬水
                          ↓
[pid1660] 燕丹餞荊軻 (故安縣故城)
        易水逕長城西 → 梁門陂 → 范陽城西十里
                          ↓
[pid1661] 范陽縣故城 = 范水之陽 (應劭)
        樊輿縣故城 → 容城縣故城南 (封國) → 易京城 (公孫瓚害劉虞處)
                          ↓
[pid1682] (巨馬水章) 迺縣故城 ← 巨馬水 ← 易水注之
        范陽縣故城北 ← 巨馬水
        容城縣故城北 ← 巨馬水
        督亢溝 + 酈亭溝 ← 巨馬水
                          ↓
[pid1683] 督亢陌 在 故安縣南 (督亢地圖故事)
```

### 2.4 RQ2 結論

✓ **SUPPORTED**：易水章節的 textual spatial topology 是一個**雙核結構**：

1. **易水章核心（pid1655–pid1661）**：以易水為主軸，范陽 / 容城 / 故安為節點
2. **巨馬水章尾部（pid1682–pid1683）**：以巨馬水為主軸，范陽 / 容城 / 故安再次出現（用於說明易水入巨馬水）

兩個核心通過「易水注巨馬水」與「二易俱出一鄉同入濡水」hydrological 關係連接。

---

## 3. RQ3 · Evidence Gate 評估

### 3.1 Evidence Gate 五項條件

依 R3.4 Evidence Gate v3：

| 條件 | 必須 |
|------|------|
| canonical Citation | ✓ MUST (SHUGE:p124575:page_object_id) |
| RULE_QUALIFIED | ✓ MUST (R3.2 strict-rule) |
| PROXY_REVIEWED | ✓ MUST (R3.3/R3.4 OCR-text-domain) |
| same-page semantic support | ✓ MUST |
| VALID_SEQUENCE_CONTEXT | ✓ MUST if 跨頁 |
| MODERN_MAPPING claim | ✗ FORBIDDEN |

### 3.2 R4 Claims 評估

依 Section G 統計：

- **總 Claims：** 12
- **按類型：**
  - TEXTUAL_ORDER: 2
  - SPATIAL_LANGUAGE: 3
  - HYDROLOGICAL_RELATION: 2
  - HISTORICAL_INTERPRETATION: 5

### 3.3 主要 Claims 摘錄

#### TEXTUAL_ORDER
- **R4-YSH-001**：范陽先於容城，由「東過」串聯（pid1657 大字標題）
- **R4-YSH-002**：易水章以「易水出涿郡故安縣閻鄉西山」開篇（pid1655）

#### SPATIAL_LANGUAGE
- **R4-YSH-003**：故安與易水關係通過「出/逕城南/南注」表達（pid1655,1656,1659）
- **R4-YSH-004**：范陽-容城關係通過「東過」連續動詞串聯（pid1657,1659,1661,1682）
- **R4-YSH-005**：範陽/容城/故安皆通過城南/城北方位詞與易水建立空間關係（pid1656,1657,1659,1661,1682）

#### HYDROLOGICAL_RELATION
- **R4-YSH-006**：易水/濡水/巨馬水/淶水呈現「互攝」關係（pid1659,1682）
- **R4-YSH-007**：故安 → 容城通過「大利亭」地理節點串聯（pid1659）

#### HISTORICAL_INTERPRETATION
- **R4-YSH-008**：范陽 = 范水之陽（應劭，pid1661）
- **R4-YSH-009**：武陽 = 燕下都（燕昭王所築 20×17 里，pid1656）
- **R4-YSH-010**：金臺/蘭馬臺 = 燕昭王禮賓郭隗處（pid1657）
- **R4-YSH-011**：易京城 = 公孫瓚害劉虞處（pid1661）
- **R4-YSH-012**：範陽/容城在漢代為匈奴降王封國（pid1657,1661）

### 3.4 RQ3 結論

✓ **SUPPORTED**：所有 12 個 R4 claims 通過 evidence gate v3 五項條件。**核心三地名（范陽 / 容城 / 故安）在《水經注》文本內部構成有效的歷史研究 evidence**。

**重要邊界：** claims **僅限於《水經注》文本內部**的解讀；**不構成**對現代地理的精確定位。

---

## 4. 三地名「文本角色」綜合

| 地名 | 出處 (pid) | 文本角色 | 證據強度 |
|------|------------|----------|----------|
| **范陽** | 1655, 1657, 1659, 1660, 1661, 1682 | 易水章標題節點 + 範水之陽 + 漢封國 + 漢景帝匈奴降王封國 + 燕下都屬城 | 6 個核心頁 × 2-3 角色 |
| **容城** | 1657, 1659, 1661, 1682, 1683 | 易水章標題節點 + 大利亭地理節點 + 漢高帝封國 + 漢景帝匈奴降王封國 + 易京城鄰城 | 5 個核心頁 × 3 角色 |
| **故安** | 1655, 1656, 1659, 1660, 1663, 1683 | 易水發源地 + 涿郡屬縣 + 濡水屬縣 + 燕丹餞荊軻處 + 督亢陌所在 | 6 個核心頁 × 4 角色 |

---

## 5. 邊界條件

| Constraint | Status |
|------------|--------|
| NEW_OCR | 0 ✓ |
| NEW_ACQUISITION | 0 ✓ |
| DB_WRITES | 0 ✓ |
| EMBEDDINGS | 0 ✓ |
| NEW_HISTORICAL_CLAIMS > 0 | ✓ (Section G · 12 claims) |
| MODERN_MAPPING_CLAIMS | 0 ✓ (FORBIDDEN) |
| REAL_WORLD_LOCATION | UNRESOLVED ✓ |
| 全部 12 claims 通過 evidence gate v3 | ✓ |

---

## 6. 文件輸出

- Markdown: `source/YISHUI_RESEARCH_SYNTHESIS_R4.md` (本文)
- 引用: 
  - `data/yishui_primary_corpus_r4.json` (Section B)
  - `data/yishui_image_review_r4.json` (Section C)
  - `data/yishui_controlled_transcription_r4.json` (Section D)
  - `data/yishui_spatial_relations_r4.json` (Section E)
  - `data/yishui_textual_topology_r4.json` (Section F)
  - `data/yishui_claims_r4.json` (Section G)
  - `data/yishui_external_sources_r4.json` (Section H)

---

*Section I complete. Continuing R4 Sections J + K + L + M.*
