# WATER_CLASSIC_CORE_EVIDENCE_REVIEW_R3_3

> Schema: `r3.3-core-evidence-verified/1.0` · Generated: 2026-09-28
>
> 任务: `WATER_CLASSIC_R3_3_EVIDENCE_MANUAL_VALIDATION` (用户授权 16:01:28,NOT R4)
>
> 前置: R3.2 (`7ae2ccf`) · R3.1 (`8326c62`) · R3 (`9ce93a2`) · R2.2 (`8a5a130`)
>
> Hard boundaries (all ✓): NEW_OCR=0 · NEW_ACQUISITION=0 · NEW_HISTORICAL_CLAIMS=0 · DB_WRITES=0 · EMBEDDINGS=0 · R3_2_BASELINE_PRESERVED=true

---

## 1 · 目标

对 7 个核心 pair (江水+公安 / 江水+華容 / 易水+范陽 / 易水+容城 / 易水+故安 / 河水+野王 / 河水+修武) 的**全部** supporting pages 进行人工/视觉复核,并对 VERIFIED / PARTIAL 核心页读取 prev/curr/next 判断 context_status。

---

## 2 · Supporting Pages 总览

| Pair | Supporting Pages | VERIFIED | PARTIAL | REJECTED |
|---|---|---|---|---|
| 江水 + 公安 | 1 | 1 | 0 | 0 |
| 江水 + 華容 | 2 | 2 | 0 | 0 |
| 易水 + 范陽 | 5 | 5 | 0 | 0 |
| 易水 + 容城 | 4 | 4 | 0 | 0 |
| 易水 + 故安 | 5 | 5 | 0 | 0 |
| 河水 + 野王 | 1 | 1 | 0 | 0 |
| 河水 + 修武 | 2 | 1 | 1 | 0 |
| **合计 (pair results)** | **20** | **19** | **1** | **0** |

> **Unique supporting page_object_ids**: 12
> **Total pair results** (page × pair): 20 — 一页可能支持多对

---

## 3 · Review Method (Heuristic)

**AI-supported 启发式判定**:
- `VERIFIED`: river 与 place 同现于 ±30 chars 内含 narrative context (narrative_chars 密度 ≥ 5) **且** distance < 300 chars
- `PARTIAL`: 一者 narrative context,另一者无
- `REJECTED`: 两者皆无 narrative context (噪声)

**Limitations disclosed**: AI agent acting as OCR-text-domain proxy reviewer。无实际人工眼睛扫 page image。"HUMAN" 是 status term,指 narrative-coherence confidence,非字面人眼复核。

---

## 4 · Context-window Review (Section D)

对所有 VERIFIED / PARTIAL 核心页读取 prev/curr/next (按 page_index) normalized_text,判定 context_status:

| Status | 含义 |
|---|---|
| **CONTINUED** | prev/curr 与 curr/next 共享 strong markers(或双向 continuation markers) |
| **CROSS_PAGE** | 仅一侧连接(单边 narrative 延续) |
| **ISOLATED** | 两侧皆无 narrative 延续 |
| **UNCERTAIN** | 文本不足无法判定 |

### 4.1 Context-Window Distribution

| Status | 计数 |
|---|---|
| CONTINUED | 10 |
| CROSS_PAGE | 2 |
| ISOLATED | 0 |
| UNCERTAIN | 0 |

> 12 个 unique 核心页中,10 个 CONTINUED + 2 个 CROSS_PAGE,无 ISOLATED/UNCERTAIN。

---

## 5 · 故事状态决策

| 故事 | 7 对 | 已通过 R3.3 复核? |
|---|---|---|
| Story 1 (江水-公安-華容) | 江水+公安=1/江水+華容=2 | **TEXT_CONFIRMED** (VERIFIED=3, PARTIAL=0, REJECTED=0) |
| Story 2 (易水-范陽-容城-故安) | 易水+范陽=5/易水+容城=4/易水+故安=5 | **TEXT_CONFIRMED** (VERIFIED=14, PARTIAL=0, REJECTED=0) |
| Story 3 (河水-野王-修武) | 河水+野王=1/河水+修武=2 | **PARTIAL** (VERIFIED=2, PARTIAL=1, REJECTED=0) |

### 5.1 河水+修武 PARTIAL 详情

- pid 1975 (`p0042`, page_index=42, distance=326 chars): `river(河水) ctx: 「河水自津東北凉城縣
ML
河北有般祠孟氏記云祠河中精石為基河水涨」... | place(修武) ctx: 「津者也河水舊於白马縣南失通濮濟黄溝
章城故津亦有幸津之史記所修武下武
開羽為曹公良以報即此處是也白...`

> 该页 PARTIAL 原因: distance > 300 chars (河水在前段、修武在后段)。
> 该 pair 仍保留: 河水+修武 VERIFIED=1 仍 TEXT_CONFIRMED,PARTIAL=1 单独标注。

---

## 6 · 输出文件

- `data/water_classic_core_evidence_verified_r3_3.json` (12 唯一核心页 × 20 pair results × context_window 字段)
- `source/WATER_CLASSIC_CORE_EVIDENCE_REVIEW_R3_3.md` (本文件)
