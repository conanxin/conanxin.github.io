# 《水经注》历史证据门槛 · Historical Evidence Gate · R3.2

**Task**: `WATER_CLASSIC_R3_2_CORPUS_VALIDATION_GATE` (R3.2)
**Status**: COMPLETE_R3_2
**Date**: 2026-09-28
**Hard Boundaries**: NEW_OCR=0 · NEW_ACQUISITION=0 · NEW_HISTORICAL_CLAIMS=0 · DB_WRITES=0 · EMBEDDINGS=0
**R3_BASELINE_PRESERVED** (commit `9ce93a2` untouched) · **R3_1_BASELINE_PRESERVED** (commit `8326c62` untouched)

---

## 1. 目标

R3.2 不创建新的历史声明。
R3.2 的目的是:**建立明确的证据门槛**,把 R3 / R3.1 的 956 页分类结果映射到"可作为历史证据 vs 仅可作为元数据 vs 不可用"三个等级。

这是给未来 R4 / R5 做历史研究时使用的 **evidence gate**,确保任何声称"《水经注》记载了 X"的声明都必须经过这扇门。

---

## 2. 证据等级

| 等级 | 含义 | 用法 |
|---|---|---|
| **SUPPORTED** | `page_type = BODY_TEXT` AND `validation_status = TRUE_BODY` | 可用于 SUPPORTED 历史事实声明 |
| **METADATA** | `page_type ∈ {TITLE_PAGE, TABLE_OF_CONTENTS}` | 仅用于版本/书目元数据;不可用于历史事实声明 |
| **NON_EVIDENCE** | `page_type ∈ {SCAN_HEADER_ONLY, IMAGE_OR_DECORATIVE, MIXED, BLANK}` OR `validation_status ∈ {OCR_NOISE, HEADER_ONLY}` | 不可作为任何历史/编辑声明的证据 |
| **RESEARCH_LEAD** | `page_type = UNKNOWN` AND `R3_2 status = REMAIN_UNKNOWN` | 仅作为研究线索(需要人工或外部证据二次确认) |

---

## 3. 判定矩阵

```
┌──────────────────────┬──────────────┬───────────────┬─────────────────┬───────────────┐
│ page_type            │ validation   │ R3.2 status   │ 证据等级        │ 用途          │
├──────────────────────┼──────────────┼───────────────┼─────────────────┼───────────────┤
│ BODY_TEXT            │ TRUE_BODY    │ SUPPORTED     │ 历史证据        │ 历史事实声明  │
│ BODY_TEXT            │ TITLE_OR_TOC │ NON_EVIDENCE  │ 误判            │ 元数据修正确认│
│ BODY_TEXT            │ HEADER_ONLY  │ NON_EVIDENCE  │ 误判            │ 同上          │
│ BODY_TEXT            │ OCR_NOISE    │ NON_EVIDENCE  │ OCR 噪声        │ 不可用        │
│ BODY_TEXT            │ UNCERTAIN    │ RESEARCH_LEAD │ 待人工审        │ 研究线索      │
│ TITLE_PAGE           │ (any)        │ METADATA      │ 元数据          │ 版本/书目     │
│ TABLE_OF_CONTENTS    │ (any)        │ METADATA      │ 元数据          │ 章节结构      │
│ SCAN_HEADER_ONLY     │ (any)        │ NON_EVIDENCE  │ 扫描头          │ 不可用        │
│ BLANK                │ (any)        │ NON_EVIDENCE  │ 空白页          │ 不可用        │
│ IMAGE_OR_DECORATIVE  │ (any)        │ NON_EVIDENCE  │ 装饰            │ 不可用        │
│ MIXED                │ (any)        │ NON_EVIDENCE  │ 混合            │ 不可用        │
│ UNKNOWN              │ BODY_TEXT    │ SUPPORTED     │ 历史证据        │ 历史事实声明  │
│ UNKNOWN              │ TITLE_PAGE   │ METADATA      │ 元数据          │ 版本/书目     │
│ UNKNOWN              │ TABLE_OF_CONT │ METADATA      │ 元数据          │ 章节结构      │
│ UNKNOWN              │ SCAN_HEADER  │ NON_EVIDENCE  │ 扫描头          │ 不可用        │
│ UNKNOWN              │ REMAIN_UNK   │ RESEARCH_LEAD │ 待人工审        │ 研究线索      │
└──────────────────────┴──────────────┴───────────────┴─────────────────┴───────────────┘
```

---

## 4. 规则定义

### 4.1 SUPPORTED (可用于 SUPPORTED 历史事实声明)

```
page_type = BODY_TEXT
AND validation_status = TRUE_BODY
```

R3.2 全集 = **422 页**(来自 R3.1 BODY_TEXT=827 的子集)。
加 UNKNOWN → BODY_TEXT 重分类 = **4 页**。
合计 **HISTORICAL_BODY_PAGES = 426**。

### 4.2 METADATA (元数据级)

```
page_type ∈ {TITLE_PAGE, TABLE_OF_CONTENTS}
```

R3.1 + R3.2 重分类合计:
- TITLE_PAGES = 38
- TABLE_OF_CONTENTS = 1

合计 **METADATA_PAGES = 39**。

### 4.3 NON_EVIDENCE (不可作为证据)

```
SCAN_HEADER_ONLY = 32 (R3.1) + 49 (R3.2 UNKNOWN→SCAN_HEADER_ONLY) = 81
IMAGE_OR_DECORATIVE = 0
MIXED = 0
BLANK = 0
BODY_TEXT→TITLE_OR_TOC = 7 (R3.2 误判)
BODY_TEXT→HEADER_ONLY = 0
BODY_TEXT→OCR_NOISE = 392 (R3.2 OCR 噪声)
```

合计 **NON_EVIDENCE_PAGES = 480**。

### 4.4 RESEARCH_LEAD (研究线索)

```
page_type = UNKNOWN AND R3_2 status = REMAIN_UNKNOWN
```

合计 **REMAIN_UNKNOWN = 5 页**。

---

## 5. RESEARCH_INDEXABLE_PAGES 定义

R3.2 显式定义 `RESEARCH_INDEXABLE_PAGES`:

```
RESEARCH_INDEXABLE = HISTORICAL_BODY_PAGES + TITLE_PAGES + TOC_PAGES
                   = 426 + 38 + 1
                   = 465
```

> 与 R3.1 的 `RESEARCH_SEARCHABLE = 866` 不同,R3.2 的 `RESEARCH_INDEXABLE = 465`:
> - **不再**包含 OCR_NOISE / HEADER_ONLY / SCAN_HEADER_ONLY / UNKNOWN 等不可证据化的页
> - **只**包含可作为 SUPPORTED 历史证据或 METADATA 的页

| 指标 | R3.1 | R3.2 | 差异说明 |
|---|---|---|---|
| RESEARCH_SEARCHABLE / INDEXABLE | 866 | 465 | R3.1 含 BODY_TEXT(827) + TITLE(38) + TOC(1);R3.2 含 TRUE_BODY(422) + UNKNOWN→BODY(4) + TITLE(38) + TOC(1)。R3.2 把 R3.1 中 392 OCR_NOISE + 7 TITLE_OR_TOC 排除在 indexable 之外。 |

---

## 6. 三故事 · 历史证据门槛下的最终评估

| 故事对 | ALL_OCR | R3.1 BODY_TEXT | **R3.2 VALIDATED_BODY** | R3.2 评估 |
|---|---|---|---|---|
| 江水 + 公安 | 1 | 1 | **1** | TEXT_CONFIRMED |
| 江水 + 華容 | 2 | 1 | **1** | TEXT_CONFIRMED |
| 易水 + 范陽 | 5 | 5 | **5** | TEXT_CONFIRMED |
| 易水 + 容城 | 4 | 4 | **4** | TEXT_CONFIRMED |
| 易水 + 故安 | 5 | 4 | **4** | TEXT_CONFIRMED |
| 河水 + 野王 | 1 | 1 | **1** | TEXT_CONFIRMED |
| 河水 + 修武 | 2 | 2 | **2** | TEXT_CONFIRMED |

7 个故事对,经 R3.2 VALIDATED_BODY(426 页)门槛过滤后,仍然 **全部 ≥ 1**。
R3.2 **不创建新 claim**,但确认 R3 / R3.1 的三个故事依旧满足 SUPPORTED 历史证据门槛。

---

## 7. 对未来 R4 / R5 的指导

1. **任何历史事实声明必须**:先通过 `page_object_id ∈ HISTORICAL_BODY_PAGES(426)` 的过滤,
   再做文本/共现分析
2. **TITLE_PAGE / TABLE_OF_CONTENTS 仅可用于元数据声明**(版本/书目/卷次结构)
3. **UNKNOWN → REMAIN_UNKNOWN(5 页)** 应作为后续人工审查的研究线索
4. **OCR_NOISE(392 页)** 在 R3.2 内被显式排除,未来如要重启 OCR,需重新评估

---

## 8. 输出文件

- `data/water_classic_body_text_validation_r3_2.json`(422 TRUE_BODY 全量)
- `data/water_classic_unknown_reclassification_r3_2.json`(58 UNKNOWN 全量)
- `data/water_classic_corpus_metrics_r3_2.json`(HISTORICAL_BODY=426 / INDEXABLE=465)
- `data/water_classic_story_counts_validated_r3_2.json`(7 个故事对 VALIDATED 计数)

---

**R3.2 — Section D 完成。Historical Evidence Gate 已建立:426 页 SUPPORTED + 39 页 METADATA + 480 页 NON_EVIDENCE + 5 页 RESEARCH_LEAD。任何未来历史研究必须通过此 gate。**
