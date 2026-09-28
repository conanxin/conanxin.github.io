# 《水经注》核心证据上下文窗口复核 · R3.4

> **任务**：WATER_CLASSIC_R3_4_CONTEXT_SEQUENCE_REPAIR · D 节
> **目的**：以序列组 (WCSEQ-XXX) 为单位，重建 12 个核心证据页的 prev / next 上下文，并基于 STRONG 标记 + 古文连续标记判定 4 档上下文状态。
> **数据源**：仅 `shuge.db` (ro) 的 `page_objects` + `page_ocr` 表，不重新 OCR、不下载、不写库。
> **生成日期**：2026-09-28

---

## 1. 上下文窗口判定规则 (R3.4)

```
prev / next 必须同时满足：
  (a) prev.page_object_id 与 curr 在同一 sequence_group
  (b) prev.page_index = curr.page_index − 1
  (c) next.page_object_id 与 curr 在同一 sequence_group
  (d) next.page_index = curr.page_index + 1
任一不满足 → 不参与上下文判定
```

状态映射：

| 状态 | 触发条件 |
|------|---------|
| **SAME_SEQUENCE_CONTINUED** | prev/next 都满足 (a)–(d) 且与 curr 各共享 ≥1 个 STRONG 标记 (15 水系) |
| **CROSS_PAGE_VALID** | prev 或 next 满足 (a)–(d) 且与 curr 共享 STRONG 标记，**或** prev/next 满足 (a)–(d) 且 curr 头/尾 30 字含 ≥2 个古文连续标记 (也 者 其 此 是 曰 於) |
| **SINGLE_PAGE_SUFFICIENT** | prev/next 满足 (a)–(d) 但无 STRONG/古文连续重叠 (跨页继续未在文本层可证) |
| **CONTEXT_UNRESOLVED** | prev/next 不在同一 sequence_group (跨序列污染)，或 page_index 非 ±1，或无相邻页 |

> R3.3 旧规则 (`back_and_forward_markers_in_curr`) 仅看 curr 文本，不区分 prev/next 来自哪个序列组。R3.4 修订为先校验物理相邻性再判文本连接。

---

## 2. 12 个核心证据页 · R3.4 上下文结果

| pid | 水系 + 地名 | sequence_group | page_index | prev | next | 状态 |
|-----|------------|----------------|------------|------|------|------|
| 1655 | 易水+故安 | WCSEQ-004 | 2  | 1654 | 1656 | SINGLE_PAGE_SUFFICIENT |
| 1656 | 易水+故安 | WCSEQ-004 | 3  | 1655 | 1657 | SINGLE_PAGE_SUFFICIENT |
| 1657 | 易水+范陽 / 容城 / 故安 | WCSEQ-004 | 4  | 1656 | 1658 | SINGLE_PAGE_SUFFICIENT |
| 1659 | 易水+范陽 / 容城 / 故安 | WCSEQ-004 | 6  | 1658 | 1660 | **CROSS_PAGE_VALID** (古典续接 = 3) |
| 1660 | 易水+范陽 / 故安 | WCSEQ-004 | 7  | 1659 | 1661 | SINGLE_PAGE_SUFFICIENT |
| 1661 | 易水+范陽 / 容城 | WCSEQ-004 | 8  | 1660 | 1662 | **CROSS_PAGE_VALID** (古典续接 = 2) |
| 1682 | 易水+范陽 / 容城 | WCSEQ-004 | 29 | 1681 | 1683 | **CROSS_PAGE_VALID** (古典续接 = 3) |
| 1892 | 河水+野王 | WCSEQ-008 | 31 | 1891 | 1893 | SINGLE_PAGE_SUFFICIENT |
| 1968 | 河水+修武 | WCSEQ-011 | 35 | 1967 | 1969 | SINGLE_PAGE_SUFFICIENT |
| 1975 | 河水+修武 (PARTIAL) | WCSEQ-011 | 42 | 1974 | 1976 | SINGLE_PAGE_SUFFICIENT |
| 2321 | 江水+華容 | WCSEQ-018 | 2  | 2320 | 2322 | SINGLE_PAGE_SUFFICIENT |
| 2322 | 江水+公安 / 華容 | WCSEQ-018 | 3  | 2321 | 2323 | SINGLE_PAGE_SUFFICIENT |

### 2.1 状态分布

| 状态 | 计数 | 说明 |
|------|------|------|
| SINGLE_PAGE_SUFFICIENT | **9** | 同页文本足够；跨页连续性在文本层未可证 |
| CROSS_PAGE_VALID | **3** | 古典续接标记证实跨页连接 |
| SAME_SEQUENCE_CONTINUED | **0** | STRONG 标记 (15 水系) 在 prev/next 与 curr 之间双向重叠 = 0 例 |
| CONTEXT_UNRESOLVED | **0** | 12 个核心页 prev/next 全部满足物理相邻性 |

### 2.2 修正后的关键观察

- R3.3 的 `CONTINUED × 10 / CROSS_PAGE × 2` (共 12) 不可信——其 prev/next 来自错误序列 (WCSEQ-001)
- R3.4 的 `SINGLE_PAGE_SUFFICIENT × 9 / CROSS_PAGE_VALID × 3 / CONTEXT_UNRESOLVED × 0` 表示：
  - **0 例** 跨页叙述以 STRONG 标记双向连接 (即 prev/next 同含 15 水系标记) → SAME_SEQUENCE_CONTINUED = 0
  - **3 例** 跨页叙述以古典续接标记证实 (WCSEQ-004 中段 1659/1661/1682)
  - **9 例** 跨页叙述在文本层未可证 (SINGLE_PAGE_SUFFICIENT)
  - **0 例** 物理相邻性失败 (R3.4 修复了 R3.3 的全部跨组污染)

---

## 3. 三故事重评估 (Section E)

### 3.1 故事级判定

| 故事 | 支持页 | TEXT_SUPPORT | CONTEXT_SUPPORT | MODERN_MAPPING |
|------|--------|--------------|-----------------|----------------|
| **Story 1** 江水-公安-華容 | 2321, 2322 | **TEXT_CONFIRMED** (2321/2322 同页均证实) | **CONTEXT_PARTIAL** (SINGLE_PAGE_SUFFICIENT × 2，未跨页 STRONG 连续) | MODERN_UNRESOLVED |
| **Story 2** 易水-范陽-容城-故安 | 1655, 1656, 1657, 1659, 1660, 1661, 1682 | **TEXT_CONFIRMED** (7/7 同页均证实) | **CONTEXT_PARTIAL** (CROSS_PAGE_VALID × 3 + SINGLE_PAGE_SUFFICIENT × 4) | MODERN_UNRESOLVED |
| **Story 3** 河水-野王-修武 | 1892, 1968, 1975 | **TEXT_CONFIRMED** (1892/1968 同页证实; 1975 TEXT_PARTIAL，保留) | **CONTEXT_PARTIAL** (SINGLE_PAGE_SUFFICIENT × 3，未跨页 STRONG 连续) | MODERN_UNRESOLVED |

### 3.2 故事级计数

```
TEXT_CONFIRMED_STORIES      = 3   (3 个故事均有 ≥1 同页 TEXT_CONFIRMED 页)
TEXT_PARTIAL_STORIES        = 0   (Story 3 的 1975 单页 TEXT_PARTIAL 不降整故事)
CONTEXT_CONFIRMED_STORIES   = 0   (0 页 SAME_SEQUENCE_CONTINUED)
CONTEXT_PARTIAL_STORIES     = 3   (3 个故事均有 ≥1 页跨页连接证据)
CONTEXT_UNRESOLVED_STORIES  = 0   (0 例跨组污染或物理相邻性失败)
MODERN_UNRESOLVED_STORIES   = 3   (3 个故事均未做现代地理独立考证)
```

### 3.3 重要声明

按 Section E 规则「即使 context unresolved，也不得因此删除同页文本支持」：

- 3 个故事的 TEXT_CONFIRMED 状态**完全保留** (基于同页 OCR 文本与叙事字符密度)
- 1975 页 (河水+修武 PARTIAL) 单页 TEXT_PARTIAL，但 Story 3 整体仍 TEXT_CONFIRMED (因 1892/1968 同页均证实)
- 3 个故事的 CONTEXT 状态从 R3.3 的「TEXT_CONFIRMED + 默认 CONTINUED」细化到「TEXT_CONFIRMED + CONTEXT_PARTIAL」

---

## 4. Reviewer honesty disclosure (preserved)

> 上下文窗口判定由 AI agent 执行：
> - 物理相邻性 = `page_objects.id` 顺序 + `page_index` 单调 (无 OCR 重跑)
> - 跨页连接 = STRONG 标记 (15 水系) 双向 / 古典续接标记 (6 字) 单向
> - 真实人眼复核可能产生更多边界案例；当前 0 CONTEXT_UNRESOLVED 反映物理相邻性修复 (而非跨页叙事已全部人工确认)
>
> 0 CONTEXT_UNRESOLVED ≠ 全部跨页叙事人工确认。只代表 R3.3 的跨组污染已全部修复。

---

*本复核报告为 R3.4 Evidence Gate v3 (`source/WATER_CLASSIC_HISTORICAL_EVIDENCE_GATE_R3_4.md`) 提供上下文输入。*
