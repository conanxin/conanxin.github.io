# 《水经注》证据门槛 v3 · R3.4

> **任务**：WATER_CLASSIC_R3_4_CONTEXT_SEQUENCE_REPAIR · F 节
> **目的**：取代 R3.3 Evidence Gate v2，重新定义 `TEXT_SUPPORTED` 与跨页证据门槛，并正式将「代理复核 (PROXY_REVIEWED)」与「STRONG 标记 + 古文连续标记 + 序列组物理相邻」绑定。
> **数据源**：仅 `shuge.db` (ro)。
> **生成日期**：2026-09-28

---

## 1. 命名修正 (R3.3 → R3.4)

| 旧 (R3.3) | 新 (R3.4) | 类型 |
|----------|----------|------|
| `HUMAN_VERIFIED_BODY` | `PROXY_REVIEWED_BODY` | 集合名 |
| `HUMAN_VERIFIED` | `PROXY_REVIEWED` | UI 标签 |
| `STRICT_BODY_PRECISION` | `PROXY_REVIEW_AGREEMENT_RATE` | 度量名 |
| `人工验证` | `文本代理复核` | 中文标签 |
| `human verification` | `proxy review` | 英文标签 |

> 「代理复核」 = AI agent 对 OCR 文本做的启发式 v2 复核，非字面意义上的人类眼-页-图复核。
>
> 数据历史字段可保留 legacy (例如 `human_verified_body_pages_legacy = 108`)，但 UI 与新报告不得继续把代理复核称为人眼复核。

---

## 2. 证据门槛 v3

### 2.1 `TEXT_SUPPORTED` 同页证据门槛

一条 historical claim (历史事实陈述) 若要标为 `TEXT_SUPPORTED`，必须**同时**满足：

```
1. canonical citation
   := claim 引用的 page_object_id 与 SHUGE:p124575:<page_object_id> 完全一致
   := citation_id 在 shuge-research-db 中可查

2. RULE_QUALIFIED_BODY
   := 该 page_object_id 经 R3.2 strict-rule 自动通过
   := 落 RULE_QUALIFIED_BODY 集合 (R3.2 后总数 = 422)

3. PROXY_REVIEWED
   := AI OCR-text-domain 启发式 v2 复核返回 HUMAN_CONFIRMED_BODY (R3.3 复审 100 样本) 或
   := 该 page_object_id 属于 R3.4 12 核心证据页且 proxy_review_verdict ∈ {VERIFIED, PARTIAL}

4. same-page semantic support
   := 河名与历史地名在同页 ±30 字窗口内同框出现
   := 叙事字符密度 (38 字符级) ≥ 5
```

### 2.2 跨页 claim 额外门槛

跨页 claim (e.g., 「江水+公安」需两页联合论证) 还必须满足：

```
5. VALID_SEQUENCE_CONTEXT
   := prev / current / next 三页在同一 sequence_group (WCSEQ-XXX)
   := prev.page_index = current.page_index − 1
   := next.page_index = current.page_index + 1
   := 至少一侧满足 STRONG 标记 (15 水系) 重叠 或 古文连续标记 (≥ 2)
```

### 2.3 状态对照表

| 证据状态 | 满足条件 |
|---------|---------|
| **TEXT_SUPPORTED** | 1–4 全部 ✓ |
| **CROSS_PAGE_SUPPORTED** | 1–5 全部 ✓ |
| **CONTEXT_PARTIAL** | 1–4 ✓ + prev/next 同序列相邻但文本层未可证 |
| **CONTEXT_UNRESOLVED** | 1–4 ✓ 但 prev/next 跨序列污染或非 ±1 |
| **METADATA_ONLY** | 仅满足 1 (canonical citation)，缺 RULE_QUALIFIED 或 PROXY_REVIEWED |
| **NON_EVIDENCE** | 1 不满足 (无 canonical citation) |

---

## 3. R3.4 实施结果

### 3.1 三故事门槛结果

| 故事 | TEXT_SUPPORT | CONTEXT_SUPPORT | MODERN_MAPPING |
|------|--------------|-----------------|----------------|
| Story 1 江水-公安-華容 | **TEXT_SUPPORTED** | **CONTEXT_PARTIAL** | MODERN_UNRESOLVED |
| Story 2 易水-范陽-容城-故安 | **TEXT_SUPPORTED** | **CONTEXT_PARTIAL** | MODERN_UNRESOLVED |
| Story 3 河水-野王-修武 | **TEXT_SUPPORTED** | **CONTEXT_PARTIAL** | MODERN_UNRESOLVED |

### 3.2 核心证据页门槛结果

| pid | RULE_QUALIFIED_BODY | PROXY_REVIEWED | same-page support | sequence_group | VALID_SEQUENCE_CONTEXT | 状态 |
|-----|---------------------|----------------|-------------------|----------------|------------------------|------|
| 1655 | ✓ | ✓ (故安) | ✓ | WCSEQ-004 | partial (SINGLE_PAGE_SUFFICIENT) | TEXT_SUPPORTED |
| 1656 | ✓ | ✓ (故安) | ✓ | WCSEQ-004 | partial (SINGLE_PAGE_SUFFICIENT) | TEXT_SUPPORTED |
| 1657 | ✓ | ✓ (范陽/容城/故安) | ✓ | WCSEQ-004 | partial (SINGLE_PAGE_SUFFICIENT) | TEXT_SUPPORTED |
| 1659 | ✓ | ✓ (范陽/容城/故安) | ✓ | WCSEQ-004 | partial (CROSS_PAGE_VALID) | CROSS_PAGE_SUPPORTED |
| 1660 | ✓ | ✓ (范陽/故安) | ✓ | WCSEQ-004 | partial (SINGLE_PAGE_SUFFICIENT) | TEXT_SUPPORTED |
| 1661 | ✓ | ✓ (范陽/容城) | ✓ | WCSEQ-004 | partial (CROSS_PAGE_VALID) | CROSS_PAGE_SUPPORTED |
| 1682 | ✓ | ✓ (范陽/容城) | ✓ | WCSEQ-004 | partial (CROSS_PAGE_VALID) | CROSS_PAGE_SUPPORTED |
| 1892 | ✓ | ✓ (野王) | ✓ | WCSEQ-008 | partial (SINGLE_PAGE_SUFFICIENT) | TEXT_SUPPORTED |
| 1968 | ✓ | ✓ (修武) | ✓ | WCSEQ-011 | partial (SINGLE_PAGE_SUFFICIENT) | TEXT_SUPPORTED |
| 1975 | ✓ | PARTIAL (修武) | ✓ | WCSEQ-011 | partial (SINGLE_PAGE_SUFFICIENT) | TEXT_SUPPORTED (PARTIAL) |
| 2321 | ✓ | ✓ (華容) | ✓ | WCSEQ-018 | partial (SINGLE_PAGE_SUFFICIENT) | TEXT_SUPPORTED |
| 2322 | ✓ | ✓ (公安/華容) | ✓ | WCSEQ-018 | partial (SINGLE_PAGE_SUFFICIENT) | TEXT_SUPPORTED |

### 3.3 计数

```
TEXT_SUPPORTED pages             = 12 (其中 1 单页 PARTIAL: 1975)
CROSS_PAGE_SUPPORTED pages       = 3  (1659, 1661, 1682; CONTEXT_PARTIAL 但有跨页 STRONG/古典续接)
CONTEXT_PARTIAL pages            = 12 (12 / 12 因未发现双向 STRONG 标记)
CONTEXT_UNRESOLVED pages         = 0  (R3.4 已修复 R3.3 的全部跨组污染)
METADATA_ONLY pages              = 0
NON_EVIDENCE pages               = 0
MODERN_UNRESOLVED stories        = 3
```

---

## 4. 与 R3.3 Gate v2 的差分

| 维度 | Gate v2 (R3.3) | Gate v3 (R3.4) |
|------|----------------|----------------|
| 命名 | HUMAN_VERIFIED | PROXY_REVIEWED |
| 物理相邻性 | 未校验 | 必须校验 (`sequence_group` 一致 + `page_index` ± 1) |
| 跨页 STRONG 标记 | prev/curr 双向 | 至少一侧 + 古典续接标记 fallback |
| 跨页跨组污染 | 未检测 | 已检测并修复 (12/12 core pages) |
| 状态词汇 | TEXT_CONFIRMED / CONTEXT_CONFIRMED 等 | TEXT_SUPPORTED / CROSS_PAGE_SUPPORTED / CONTEXT_PARTIAL / CONTEXT_UNRESOLVED / MODERN_UNRESOLVED |

---

## 5. Reviewer honesty disclosure (preserved)

> 证据门槛 v3 由 AI agent 设计：
> - 物理相邻性 = `page_objects.id` 顺序 + `page_index` 单调 (DB query，无 OCR 重跑)
> - 跨页连接 = STRONG 标记 (15 水系) 单/双向 / 古典续接标记 (6 字) fallback
> - 同页叙事 = R3.3 启发式 v2 narrative_chars density ≥ 5
>
> 真实人眼复核可能产生额外边界案例；CONTEXT_UNRESOLVED = 0 反映物理相邻性已修复 (非跨页叙事已 100% 人工确认)。
>
> 任何 historical claim 的最终确认仍需独立学术考据。

---

## 6. 出处与可下载资源

| 文件 | 内容 |
|------|------|
| `data/water_classic_sequence_groups_r3_4.json` | 956 页 × 20 sequence_group 全表 |
| `data/water_classic_core_context_r3_4.json` | 12 核心证据页 R3.4 修正上下文 |
| `data/water_classic_stories_r3_4.json` | 三故事重评估 |
| `source/WATER_CLASSIC_CONTEXT_WINDOW_AUDIT_R3_4.md` | R3.3 跨组污染审计 |
| `source/WATER_CLASSIC_CORE_CONTEXT_REVIEW_R3_4.md` | R3.4 上下文复核 |
| `source/WATER_CLASSIC_HISTORICAL_EVIDENCE_GATE_R3_4.md` | 本文件 (Gate v3) |
| `projects/shuge/research/water-classic/evidence/index.html` | 中文核心证据页 |

---

*Gate v3 是 R3.4 的最终证据门槛。后续 R5+ 历史研究须引用此门槛作为 SUPPORTED 准入。*
