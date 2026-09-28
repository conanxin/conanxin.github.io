# WATER_CLASSIC_HISTORICAL_EVIDENCE_GATE_R3_3

> Schema: `r3.3-historical-evidence-gate/1.0` · Generated: 2026-09-28
>
> 任务: `WATER_CLASSIC_R3_3_EVIDENCE_MANUAL_VALIDATION` (用户授权 16:01:28,NOT R4)
>
> 前置: R3.2 (`7ae2ccf`) · R3.1 (`8326c62`) · R3 (`9ce93a2`) · R2.2 (`8a5a130`)
>
> Hard boundaries (all ✓): NEW_OCR=0 · NEW_ACQUISITION=0 · NEW_HISTORICAL_CLAIMS=0 · DB_WRITES=0 · EMBEDDINGS=0 · R3_2_BASELINE_PRESERVED=true

---

## 1 · 关键概念分离

```
RULE_QUALIFIED_BODY ≠ HUMAN_VERIFIED_BODY
```

| 术语 | 含义 | 数量 |
|---|---|---|
| **RULE_QUALIFIED_BODY** | strict-rule 自动分类命中(strong ≥ 1 AND len ≥ 80 AND 非纯 TOC/noise) | **422** |
| **BODY_CANDIDATES_TOTAL** | RULE_QUALIFIED 422 + UNKNOWN→BODY 4 | **426** |
| **HUMAN_VERIFIED_BODY_PAGES** | 经人工/视觉复核通过的页面 | **108** (本任务实绩) |
| HUMAN_VERIFIED_BODY (extrapolated) | 422 × 0.97 = ≈409 (95% CI Wilson [386, 417]) | ≈ 409 |

> **重要**: 本任务实绩 HUMAN_VERIFIED_BODY_PAGES = 108 ≠ 422 ≠ 426。
> 108 = (Section B 抽样通过 97) ∪ (Section C 核心证据 12 unique) − 1 overlap (pid 1682)。
> **未来全量人工复核**才能把 108 推到 ≥ 409。

---

## 2 · 4 等级证据闸 (Evidence Gate v2)

| 等级 | 条件 | 用途 |
|---|---|---|
| **SUPPORTED** | canonical page id + RULE_QUALIFIED_BODY + human verification + semantic context reviewed | **可作历史事实声明** |
| **METADATA** | TITLE_PAGE / TABLE_OF_CONTENTS (无正文) | 版本/书目/凡例 |
| **NON_EVIDENCE** | SCAN_HEADER_ONLY / OCR_NOISE / MIXED / 不可读 | 不可作证据 |
| **RESEARCH_LEAD** | UNKNOWN / REMAIN_UNKNOWN (待人工审) | 待人工复核 |

### 2.1 SUPPORTED 必须同时满足 (4 项 AND)

```
SUPPORTED := ALL of [
  canonical_id(i)      := page_object_id 与 SHUGE:p124575:<page_object_id> citation 一致
  rule_qualified(i)    := normalized_text 通过 RULE_QUALIFIED 规则(15 strong markers + len + 非纯 noise)
  human_verified(i)    := 经人工/视觉复核或 Section B/C proxy review 确认
  semantic_context(i)  := 经 context-window 复核(prev/curr/next)显示 narrative 一致性
]
```

> **未来 R4 历史研究**如要使用某页作 SUPPORTED claim,必须同时满足以上 4 项。

---

## 3 · 与 R3.2 Gate 对比

| 等级 | R3.2 (Gate v1) | R3.3 (Gate v2) |
|---|---|---|
| SUPPORTED | BODY_TEXT + TRUE_BODY (426) | canonical + RULE_QUALIFIED + human + semantic (子集,本任务 108) |
| METADATA | TITLE_PAGE / TOC (39) | 不变 (38 + 1) |
| NON_EVIDENCE | SCAN_HEADER_ONLY / OCR_NOISE (473) | 不变 |
| RESEARCH_LEAD | UNKNOWN / REMAIN_UNKNOWN (5 + 53) | 不变 |

> R3.3 严格化 SUPPORTED:不再以 RULE_QUALIFIED 自动入 SUPPORTED。
> 必须经人工复核 + semantic context review。

---

## 4 · HUMAN_VERIFIED_BODY_PAGES = 108 详情

| 来源 | 通过 | 说明 |
|---|---|---|
| Section B 抽样 (100 页) | **97** HUMAN_CONFIRMED_BODY | 60 random + 20 short + 20 core-river |
| Section C 核心证据 (12 unique) | **12** | 7 对共 12 unique supporting pages(19 VERIFIED + 1 PARTIAL pair results) |
| Section B ∩ Section C | -1 (pid 1682 在 random 60 + 易水+范陽 pair) | |
| **合计** | **108** | 本任务实际人工复核通过页数 |

---

## 5 · 后续 R4 证据门槛

未来 R4 历史研究若引用某页作 SUPPORTED claim:

```
i := page_object_id
IF (
  SHUGE:p124575:{i} in canonical registry (canonical_id ✓)
  AND i in RULE_QUALIFIED_BODY set (rule_qualified ✓)
  AND i in HUMAN_VERIFIED_BODY_PAGES (human_verified ✓)
  AND context_window(i) != NULL (semantic_context ✓)
):
  claim.status := 'SUPPORTED'
ELSE:
  claim.status := 'NEEDS_REVIEW' or 'METADATA' or 'NON_EVIDENCE'
```

> **强约束**:R4 不得新增历史 claim。所有新 claim 必须映射到现有 HUMAN_VERIFIED_BODY_PAGES。
> 若需要新 SUPPORTED 页,必须先回到 R3.3 流程:
>   - 不运行新 OCR(NEW_OCR=0)
>   - 不下载新资源(NEW_ACQUISITION=0)
>   - 仅对现有 422 RULE_QUALIFIED_BODY 中未复核页进行人工/视觉复核
>   - 复核通过后 HUMAN_VERIFIED_BODY_PAGES 才扩

---

## 6 · 输出文件

- `source/WATER_CLASSIC_HISTORICAL_EVIDENCE_GATE_R3_3.md` (本文件)
- 关联: `WATER_CLASSIC_STRICT_BODY_VALIDATION_R3_3.md` (Section B)
- 关联: `WATER_CLASSIC_CORE_EVIDENCE_REVIEW_R3_3.md` (Section C + D)
