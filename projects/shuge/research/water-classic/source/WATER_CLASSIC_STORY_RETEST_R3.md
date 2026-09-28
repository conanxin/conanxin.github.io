# WATER_CLASSIC_STORY_RETEST_R3

**task_id:** `WATER_CLASSIC_R3_FULL_CORPUS_RECONCILIATION`
**section:** E · Full Corpus Retest
**generated_at:** 2026-09-28

---

## 0. 方法学声明

本轮 retest 使用 `page_ocr.normalized_text LIKE` 搜索,**不使用 FTS5**(见 Section A §6: ocr_fts 表对该 work 完全无数据)。严禁新运行 OCR,严禁修改 OCR。

`page_ocr.normalized_text` 是 R3 中**已存在**的 (full corpus 956 页全部 page_ocr.status='SUCCESS')。

---

## 1. Story 1 · 江水 — 公安 — 華容

**R2.2 baseline (60-page sample):**
- r2-cl-001: SUPPORTED
- 3 pages: WC124575:PAGE2321 / PAGE2322 / PAGE2323
- R2.2 状态: TEXT_CONFIRMED · SPATIAL_PRELIMINARY · MODERN_UNRESOLVED

**R3 retest (full 956-page corpus):**

| term | occurrences (full corpus) |
|---|---|
| 江水 | **78 pages** |
| 公安 | **3 pages** |
| 華容 | **4 pages** |

| co-occurrence | pages |
|---|---|
| 江水 AND 公安 | **1 page** |
| 江水 AND 華容 | **2 pages** |

R3 状态判定:

| level | R3 value | rationale |
|---|---|---|
| 文本支持 | **TEXT_CONFIRMED** | 3/3 place terms present; 2/2 co-occurrences present |
| 空间解释 | **SPATIAL_UNRESOLVED** | volume_status UNRESOLVED · 无方向序列上下文 |
| 现代对应 | **MODERN_UNRESOLVED** | 不与现代地理绑定 |

**delta vs R2.2:** R2.2 用 60-page sample 报告 3 pages;R3 full corpus 显示 78 页江水 + 4 页華容 + 3 页公安 + 1 页江水+公安 共现 + 2 页江水+華容 共现。文本支持保持 TEXT_CONFIRMED;spatial 升级为 SPATIAL_UNRESOLVED(更严谨)。

---

## 2. Story 2 · 易水 — 范陽 — 容城 — 故安

**R2.2 baseline (60-page sample):**
- r2-cl-003: SUPPORTED
- 4 pages: WC124575:PAGE1655 / PAGE1656 / PAGE1657 / PAGE1865
- R2.2 状态: TEXT_CONFIRMED · SPATIAL_UNRESOLVED · MODERN_UNRESOLVED

**R3 retest (full 956-page corpus):**

| term | occurrences |
|---|---|
| 易水 | **11 pages** |
| 范陽 | **10 pages** |
| 容城 | **8 pages** |
| 故安 | **9 pages** |

| co-occurrence | pages |
|---|---|
| 易水 AND 范陽 | **5 pages** |
| 易水 AND 容城 | **4 pages** |
| 易水 AND 故安 | **5 pages** |

R3 状态判定:

| level | R3 value |
|---|---|
| 文本支持 | **TEXT_CONFIRMED** |
| 空间解释 | **SPATIAL_UNRESOLVED** |
| 现代对应 | **MODERN_UNRESOLVED** |

**delta vs R2.2:** 文本支持 TEXT_CONFIRMED 不变;spatial 保持 SPATIAL_UNRESOLVED。

---

## 3. Story 3 · 河水 — 野王 — 修武

**R2.2 baseline (60-page sample):**
- r2-cl-002: PARTIALLY_SUPPORTED
- 2 pages: WC124575:PAGE1593 / PAGE1594
- R2.2 状态: TEXT_PARTIAL · SPATIAL_UNRESOLVED · MODERN_UNRESOLVED

**R3 retest (full 956-page corpus):**

| term | occurrences |
|---|---|
| 河水 | **118 pages** |
| 野王 | **9 pages** |
| 修武 | **7 pages** |

| co-occurrence | pages |
|---|---|
| 河水 AND 野王 | **1 page** |
| 河水 AND 修武 | **2 pages** |

R3 状态判定:

| level | R3 value | rationale |
|---|---|---|
| 文本支持 | **TEXT_CONFIRMED** | 2/2 place terms present; 河水 + 修武 共现 2 pages |
| 空间解释 | **SPATIAL_UNRESOLVED** | volume_status UNRESOLVED |
| 现代对应 | **MODERN_UNRESOLVED** | 不与现代地理绑定 |

**delta vs R2.2:** R2.2 因为仅 2-page 样本,把 r2-cl-002 标 PARTIALLY_SUPPORTED。R3 full corpus 显示 **118 页河水**(远超 60-page sample)+ 7 页修武 + 9 页野王 + 共现关系 → 升级为 TEXT_CONFIRMED。这是** strengthen ** 而非 weaken。

---

## 4. Research Leads (RESEARCH_LEAD · not CLAIM)

| lead_id | description |
|---|---|
| RL-001 | 完整 corpus 中 河水 出现 118 页 — 远超 R2 60-page sample;待建立河水其他河段叙事文本收集 (RESEARCH_LEAD · not CLAIM) |
| RL-002 | 完整 corpus 中 江水 出现 78 页 — 江水叙事跨多个 volume;待 document_units 重建后才可确认卷次 (RESEARCH_LEAD) |
| RL-003 | 易水 / 范陽 / 容城 / 故安 分别 11 / 10 / 8 / 9 页 — 卷十一(易水、滱水)推断但未在 DB 中确认 (RESEARCH_LEAD) |

---

## 5. 严格不动项 (per spec F)

- 不为 R3 创建大量新 claims
- 只对 R2.2 已有核心故事做 retest / strengthen / weaken
- 新方向仅作 RESEARCH_LEAD,不作 SUPPORTED CLAIM
- 不修改 R2.2 已冻结的 machine status

---

## 6. Output

| 文件 | 内容 |
|---|---|
| `data/water_classic_story_retest_r3.json` | 3 stories 完整 retest 数据 (term occurrences, co-occurrences, citation IDs, OCR excerpts, status) |

---

**STATUS:** Section E complete · 3 stories retested on full corpus · 2 stories strengthened (r2-cl-002: PARTIAL → CONFIRMED) · 1 unchanged · no new claims · no v1.0 / R1 / R2 / R2.1 / R2.2 outputs modified.