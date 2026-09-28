# 《水经注》上下文窗口审计 · R3.4

> **任务**：WATER_CLASSIC_R3_4_CONTEXT_SEQUENCE_REPAIR · B 节
> **目的**：审计 R3.3 报告 `data/water_classic_core_evidence_verified_r3_3.json` 中 12 个核心证据页的 prev / next 映射，识别跨序列污染。
> **数据源**：仅 `shuge.db` (ro) 的 `page_objects` 表，不重新 OCR、不下载、不写库。
> **生成日期**：2026-09-28

---

## 1. R3.3 上下文窗口：审计观察

### 1.1 现象

R3.3 中 12 个核心证据页 (page_object_ids `1655, 1656, 1657, 1659, 1660, 1661, 1682, 1892, 1968, 1975, 2321, 2322`) 的 `context_window` 字段记录了 `prev_page_object_id` / `next_page_object_id`：

```
示例：pid 1655
  R3.3 prev_page_object_id = 1501
  R3.3 next_page_object_id = 1503
  R3.3 context_status = CONTINUED
```

### 1.2 不一致

R3.3 的 prev/next 选择**只依赖 page_object_id 邻近查找** (例如 `pid ± small_delta`)，而不是同一扫描序列的相邻页。

| pid | R3.3 page_index | R3.3 prev | R3.3 next | DB 上 R3.3 prev 的 group | DB 上 R3.3 next 的 group |
|-----|----------------|-----------|-----------|-------------------------|-------------------------|
| 1655 | 2  | 1501 | 1503 | WCSEQ-001 | WCSEQ-001 |
| 1656 | 3  | 1502 | 1504 | WCSEQ-001 | WCSEQ-001 |
| 1657 | 4  | 1503 | 1505 | WCSEQ-001 | WCSEQ-001 |
| 1659 | 6  | 1505 | 1507 | WCSEQ-001 | WCSEQ-001 |
| 1660 | 7  | 1506 | 1508 | WCSEQ-001 | WCSEQ-001 |
| 1661 | 8  | 1507 | 1509 | WCSEQ-001 | WCSEQ-001 |
| 1682 | 29 | 1528 | 1530 | WCSEQ-001 | WCSEQ-001 |
| 1892 | 31 | 1530 | 1532 | WCSEQ-001 | WCSEQ-001 |
| 1968 | 35 | 1534 | 1536 | WCSEQ-001 | WCSEQ-001 |
| 1975 | 42 | 1541 | 1543 | WCSEQ-001 | WCSEQ-001 |
| 2321 | 2  | 1501 | 1503 | WCSEQ-001 | WCSEQ-001 |
| 2322 | 3  | 1502 | 1504 | WCSEQ-001 | WCSEQ-001 |

所有 12 页的 R3.3 prev/next 都落在 **WCSEQ-001** (id 1501..1551, page_index 1..51) — 也就是第一份扫描集合。

但是 12 个核心页本身分布于 4 个不同扫描序列：

| pid | 实际 sequence_group | 实际 page_index | 实际 prev (同序列) | 实际 next (同序列) |
|-----|--------------------|-----------------|---------------------|---------------------|
| 1655 | WCSEQ-004 | 2  | 1654 | 1656 |
| 1656 | WCSEQ-004 | 3  | 1655 | 1657 |
| 1657 | WCSEQ-004 | 4  | 1656 | 1658 |
| 1659 | WCSEQ-004 | 6  | 1658 | 1660 |
| 1660 | WCSEQ-004 | 7  | 1659 | 1661 |
| 1661 | WCSEQ-004 | 8  | 1660 | 1662 |
| 1682 | WCSEQ-004 | 29 | 1681 | 1683 |
| 1892 | WCSEQ-008 | 31 | 1891 | 1893 |
| 1968 | WCSEQ-011 | 35 | 1967 | 1969 |
| 1975 | WCSEQ-011 | 42 | 1974 | 1976 |
| 2321 | WCSEQ-018 | 2  | 2320 | 2322 |
| 2322 | WCSEQ-018 | 3  | 2321 | 2323 |

**核心结论**：R3.3 对 12 个核心页全部都存在**跨序列污染**——prev/next 来自错误的扫描集合，与核心页所在的序列无关。

### 1.3 根源

R3.3 选择 prev/next 的启发式为「在 core pid 上做 ±小幅度 id 偏移」。但 p124575 同一 `work_id` 下共 956 个 `page_object` (id 1501..2456)，平均每 14 个 id 共享同一 `page_index`。多个不同的扫描/裁剪被分别入库，导致同一 page_index 对应多个 page_object_id。R3.3 假设了 id 相邻 ⇒ 物理相邻，违反了多扫描同 work 的现实。

### 1.4 影响范围

- 12 / 12 核心页：prev/next 全部跨序列污染
- 0 / 12 R3.3 prev/next 落在正确 sequence_group
- R3.3 `context_window_status = CONTINUED × 10 / CROSS_PAGE × 2` 的判定基于**错误邻居**的 OCR 文本与叙事字符密度，与真实前后页无对应关系

---

## 2. R3.4 序列组检测

### 2.1 启发式

```
对 p124575 956 个 page_objects 按 id 升序遍历：
  - 遇 page_index = 1                → 新 sequence_group 开始
  - 连续 page_index + 1              → 同一 sequence_group 继续
  - 其他情况 (page_index 跳变 / 不连续) → 当前 sequence_group 结束，新组开始
```

### 2.2 结果

| 指标 | 值 |
|------|----|
| sequence_group_count | **20** |
| 总 pages | 956 (= p124575 全数) |
| group id 范围 | WCSEQ-001 .. WCSEQ-020 |
| group size 分布 | 11–74 页 |

详见 `data/water_classic_sequence_groups_r3_4.json`。

---

## 3. 关键术语澄清

| 旧 (R3.3) | 新 (R3.4) | 含义 |
|----------|----------|------|
| HUMAN_VERIFIED_BODY | **PROXY_REVIEWED_BODY** | 经 AI OCR-text-domain 启发式 v2 复核的页 |
| HUMAN_VERIFIED | **PROXY_REVIEWED** | 同上 (UI 标签) |
| STRICT_BODY_PRECISION | **PROXY_REVIEW_AGREEMENT_RATE** | 启发式 v2 与人工眼复核的一致率 (本任务实绩 = 0.97) |
| MANUAL VALIDATION | **文本代理复核** | 中文标签 |
| HUMAN REVIEW | **文本代理复核** | 中文标签 |

> 数据历史字段可保留 legacy (e.g. `human_verified_body_pages_legacy = 108`)，但 UI 不得继续把代理复核称为人眼复核。

---

## 4. R3.4 修复清单

- [x] 序列组检测：20 个 sequence_group，WCSEQ-001..WCSEQ-020
- [x] 12 个核心页 prev/next 重映射至同序列相邻
- [x] `data/water_classic_sequence_groups_r3_4.json` (346 KB, 956 records)
- [x] `data/water_classic_core_context_r3_4.json` (24 KB, 12 corrected)
- [x] `source/WATER_CLASSIC_CORE_CONTEXT_REVIEW_R3_4.md`
- [x] `source/WATER_CLASSIC_HISTORICAL_EVIDENCE_GATE_R3_4.md` (Gate v3)
- [x] `projects/shuge/research/water-classic/evidence/` 中文核心证据页
- [x] 4 个现有页面：人工验证/HUMAN_VERIFIED → 文本代理复核/PROXY_REVIEWED

---

## 5. Reviewer honesty disclosure (preserved)

> 序列组检测与上下文窗口重构均由 AI agent 执行，依赖 `page_objects.id` 排序 + `page_index` 单调性。未对每对相邻页做 OCR 字符级 narrative 衔接验证——R3.4 仅保证 prev/next 来自同一扫描集合，不保证叙事连续。
>
> 序列组 ≠ 卷次 (volume)。R3.4 不假设 WCSEQ-XXX 对应原书第 X 卷。

---

*本审计文档作为 R3.4 修复前 (R3.3 cross-group pollution) 与修复后 (R3.4 same-group siblings) 的差分依据。*
