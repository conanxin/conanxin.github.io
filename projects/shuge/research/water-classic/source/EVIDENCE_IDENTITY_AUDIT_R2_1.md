# Evidence Identity Audit · R2.1

**Task**: WATER_CLASSIC_R2_1_FOCUSED_RESEARCH_INTERFACE  
**Generated**: 2026-09-28  
**Parent task**: WATER_CLASSIC_EVIDENCE_RECONSTRUCTION_R2 (STATUS=COMPLETE_R2)  
**Companion data file**: `data/water_classic_evidence_identity_r2_1.json`

---

## 1. 审计问题

R2 阶段使用的 legacy citation ID 格式为：

```
SHUGE:p{post_id}:{seq}
```

例如 `SHUGE:p124575:4`。

但 R2 的 `water_classic_page_structure_r2.json` 显示：

- **60 个 page_id**（1501–2391 之间的数字）
- **5 个 unique page_label**（p0001–p0005）
- **每个 page_seq 值出现在 12–14 个不同 page_id 中**

因此 `SHUGE:p124575:<seq>` **无法唯一标识** 实际 page_id。

### 1.1 例子：seq=4 同时指向 14 个 page_id

| legacy citation_id | page_id |
|---|---|
| `SHUGE:p124575:4` | 1504 |
| `SHUGE:p124575:4` | 1594 |
| `SHUGE:p124575:4` | 1657 |
| `SHUGE:p124575:4` | 1714 |
| `SHUGE:p124575:4` | 1795 |
| `SHUGE:p124575:4` | 1865 |
| `SHUGE:p124575:4` | 1937 |
| `SHUGE:p124575:4` | 2005 |
| `SHUGE:p124575:4` | 2079 |
| `SHUGE:p124575:4` | 2135 |
| `SHUGE:p124575:4` | 2207 |
| `SHUGE:p124575:4` | 2267 |
| `SHUGE:p124575:4` | 2323 |
| `SHUGE:p124575:4` | 2391 |

同一个 legacy citation_id 指向 6 条 R2 evidence-first claims 中的多个：

- `r2-cl-002` (河水 + 野王 / 修武) — page_id=1594
- `r2-cl-003` (易水 + 范陽 / 容城 / 故安城) — page_id=1657、1865
- `r2-cl-006` (渭水 + 關中) — page_id=1795
- `r2-cl-004` (汾水 + 代城) — page_id=2005
- `r2-cl-005` (汝水 + 霍陽山 / 梁) — page_id=2079
- `r2-cl-001` (江水 + 公安 / 華容) — page_id=2323

**结论**：把 `SHUGE:p124575:4` 当作唯一 page-level pointer 是不安全的。  
**禁止** 继续把 `SHUGE:p124575:4` 当作唯一 page-level pointer。

---

## 2. 解决方案

新增**研究展示层唯一 evidence_ref** 格式：

```
WC124575:PAGE<page_id>
```

例如 `WC124575:PAGE1594`。

### 2.1 格式规范

| 字段 | 格式 | 说明 |
|---|---|---|
| prefix | `WC124575` | Water Classic + canonical post_id |
| separator | `:` | 层级分隔 |
| suffix | `PAGE<page_id>` | 真正的 page_id (1501–2391) |

### 2.2 与 legacy citation_id 的关系

- **保留 legacy citation_id 不变**：`SHUGE:p124575:<seq>` 是 R1 contract，仍是次级 pointer。
- **新增 evidence_ref 作为主级 pointer**：`WC124575:PAGE<page_id>` 是 R2.1 引入的研究展示层。
- 每条 evidence 必须同时显示：
  - `evidence_ref`（新，主级）
  - `page_id`（数字）
  - `legacy_citation_id`（旧，次级）
  - `page_label`（p000N）
  - `OCR excerpt`

### 2.3 不修改的范围

- ❌ 不修改 legacy citation_id 格式
- ❌ 不修改 v1.0 frozen baseline (3a51ef5)
- ❌ 不修改 R1 frozen outputs (59d258e)
- ❌ 不修改 R2 frozen outputs (3883455b) 的 data 文件结构
- ✅ 仅在 `/projects/shuge/research/water-classic/` 下新增 R2.1 layer 文件

---

## 3. 审计结果

### 3.1 总数验证

| 指标 | 数值 | 期望 |
|---|---|---|
| total_page_ids | 60 | 60 ✓ |
| unique_evidence_refs | 60 | 60 ✓ |
| unique_page_ids | 60 | 60 ✓ |
| collision_count | **0** | 0 ✓ |
| unique_legacy_citation_ids | 5 | 5 ✓ |
| max_pages_per_legacy_citation | 14 | ≥1 (冲突证明) |

### 3.2 reliability 分布

| reliability | 数量 |
|---|---|
| BODY_TEXT | 36 |
| MIXED_PARTIAL_BODY | 3 |
| BLANK_OR_HEADER_ONLY | 19 |
| UNCLASSIFIED | 2 (page_id=1862, 2320 — duplicate_pages 中列出，未明确分类) |

### 3.3 与 R2 substantial_pages 对比

| 项 | R2 substantial_pages | R2.1 evidence_identity |
|---|---|---|
| 计数标准 | body_chars ≥ 50 | 全部 60 page_id 都参与 |
| substantial 计数 | 39 | 39 (36 BODY_TEXT + 3 MIXED_PARTIAL_BODY) |
| blank 计数 | 19 | 19 |
| unclassified 计数 | 0 (claimed) | 2 (真实存在: 1862, 2320) |

### 3.4 region 分布（聚合至 page_id 粒度）

| region | page_id 数量 |
|---|---|
| 江水_公安_华容 | 3 |
| 河水_野王_修武 | 2 |
| 易水_范陽_容城 | 4 |
| 渭水_關中 | 2 |
| 汾水_代城 | 2 |
| 汝水_霍陽_梁 | 3 |
| 泗水_魯汶 | 1 |
| 淮水_肥水_芍陂 | 1 |
| 山陽_吴陂_荷泉 | 1 |
| unclassified | 41 |

---

## 4. 后续约束

### 4.1 任何 R2.1 后续工作必须使用 evidence_ref

- 主页面（研究成果页）
- 附录页（技术档案）
- 任何 claim 描述

任何引用具体 page 的地方都必须显示：

```
WC124575:PAGE<page_id>     ← 主级 evidence_ref
SHUGE:p124575:<seq>        ← legacy citation (次级)
p124575:p<seq>             ← page_object_id (legacy)
p000N                       ← page_label
```

### 4.2 严禁

- 继续把 `SHUGE:p124575:<seq>` 当作唯一 page-level pointer
- 在 R2.1 后续页面上省略 `evidence_ref`
- 把 evidence_ref 与 `page_object_id` 混淆

### 4.3 允许

- legacy citation_id 仍作为 machine-readable 次级 metadata 显示
- 后续 R3 / R2_2 等如需重做 evidence identity 命名空间，可另起新格式，但不得覆盖此格式

---

## 5. 文件清单

| 文件 | 大小 | 位置 |
|---|---|---|
| `data/water_classic_evidence_identity_r2_1.json` | 31559 B | R2.1 主文件 |
| `source/EVIDENCE_IDENTITY_AUDIT_R2_1.md` | (本文件) | R2.1 审计文档 |

不复制到 R1 frozen 位置 (`water-classic-evidence-r1/r2/`)，保持 R1 冻结不变。

---

**STATUS**: Evidence Identity Audit COMPLETE_R2_1 · collision_count = 0  
**下一步**: 修正 claims summary 计数 → 重建主页面 → 建立附录页 → 更新 Results Hub  
**禁止**: 不进入 R3 · 不下载新资源 · 不新增 OCR · 不新增历史 claim · 不修改 v1.0 baseline · 不修改 R1 frozen outputs