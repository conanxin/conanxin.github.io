# WATER_CLASSIC_R2_FULL_CORPUS_RECONCILIATION

**task_id:** `WATER_CLASSIC_R3_FULL_CORPUS_RECONCILIATION`
**section:** C · Reconcile R2 sample
**generated_at:** 2026-09-28

---

## 1. 目标

将 R2.1 的 60 个 `WC124575:PAGE<page_id>` evidence_ref 映射到 SHUGE-RESEARCH-DB 中 956 个完整 corpus page_object_id。

---

## 2. 映射方法

每个 R2.1 entry 的 `page_id` 字段(`evidence_id` 在 R2.1 文档体系内)直接 query `page_objects.id` (INTEGER PK):

```sql
SELECT id, page_index, page_label, ocr_status, sequence_status,
       digital_object_id, edition_id
FROM page_objects
WHERE work_id='p124575' AND id = ?
```

每个 R2.1 entry 仅可能匹配:
- **EXACT**: 单 page_object 命中
- **AMBIGUOUS**: 多个 page_object 命中(不应发生,因为 id 是 PK)
- **NOT_FOUND**: 0 命中

---

## 3. 映射结果

| mapping_status | count |
|---|---|
| EXACT | **60** |
| AMBIGUOUS | 0 |
| NOT_FOUND | 0 |
| TOTAL | 60 |

> 所有 60 个 R2.1 evidence_ref 都 EXACT 映射到 956 页 corpus 中的 page_object_id。这是预期结果,因为 R2.1 的 `page_id` (R2.1 evidence_identity JSON) 与 DB 中 `page_objects.id` (INTEGER PK) 是同一命名空间。

---

## 4. canonical_citation_id 生成

| 字段 | format | example |
|---|---|---|
| `public_evidence_ref` | `WC124575:PAGE<page_id>` | `WC124575:PAGE1594` |
| `public_page_id` | INTEGER | 1594 |
| `full_page_object_id` | INTEGER PK | `1594` |
| `canonical_citation_id` | `SHUGE:p124575:<page_object_id>` | `SHUGE:p124575:1594` |
| `legacy_citation_id` (R2.1) | `SHUGE:p124575:<page_seq>` | `SHUGE:p124575:4` |
| `public_page_label` (R2.1) | `p0001..p0091` | `p0004` |

---

## 5. digital_object_id 字段 · NULL 现象

由于 p124575 当前未关联任何 `digital_objects` (见 Section A §8),所有 60 个 mapping 中 `digital_object_id` = `null`。canonical_citation_id 仍然可建立 (基于 page_objects.id),不依赖 digital_object_id。

---

## 6. volume_or_unit 字段 · 全部 NULL

由于 `document_units` 对 p124575 为空(见 Section D),所有 60 个 mapping 中 `volume_or_unit` = `null`。这是预期的——Section D volume_status = UNRESOLVED。

---

## 7. ocr_status 字段 · 注意

R2.1 中 page_objects.ocr_status 全部 = `QUEUED` (上游未更新)。Section A 已说明实际 OCR 已完成。R3 mapping 字段直接传递 `QUEUED`,canonical_citation_id 仍然有效。

---

## 8. 映射分布 (60 entries)

### 按 R2.2 region 分组

| region | count |
|---|---|
| unclassified | 41 |
| 河水_野王_修武 | 2 |
| 山陽_吴陂_荷泉 | 1 |
| 易水_范陽_容城 | 4 |
| 渭水_關中 | 2 |
| 汾水_代城 | 2 |
| 汝水_霍陽_梁 | 3 |
| 泗水_魯汶 | 1 |
| 淮水_肥水_芍陂 | 1 |
| 江水_公安_华容 | 3 |

### 按 reliability 分组

| reliability | count |
|---|---|
| BODY_TEXT | 36 |
| BLANK_OR_HEADER_ONLY | 19 |
| MIXED_PARTIAL_BODY | 3 |
| UNCLASSIFIED | 2 |

---

## 9. Output

| 文件 | 内容 |
|---|---|
| `data/water_classic_r2_to_full_corpus_map.json` | 60 entries + 每 entry 8 字段 mapping |

---

## 10. 注意 · 严禁猜测

- 所有 AMBIGUOUS / NOT_FOUND 状态均显式保留 (本次均为 0)
- 不根据 page_label 强行重映射 (因为 page_label 不唯一)
- 不创建额外的 canonical_citation_id (仅使用 DB 已有的 page_objects.id)

---

**STATUS:** Section C complete · `R2_SAMPLE_EXACT_MAPPINGS = 60` · `R2_SAMPLE_AMBIGUOUS = 0` · `R2_SAMPLE_NOT_FOUND = 0` ✓ · no v1.0 / R1 / R2 / R2.1 / R2.2 outputs modified.