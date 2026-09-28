# CANONICAL_CITATION_AUDIT_R3

**task_id:** `WATER_CLASSIC_R3_FULL_CORPUS_RECONCILIATION`
**section:** B · Canonical Citation Audit
**generated_at:** 2026-09-28
**db_source:** read-only SQLite

---

## 1. SHUGE Architecture Contract

```
SHUGE:<work_id>:<page_object_id>
```

- `<work_id>`: `p124575` (TEXT, PK in `works.id`)
- `<page_object_id>`: INTEGER PK in `page_objects.id` (唯一标识 actual scanned page)

**严禁继续使用:** `SHUGE:p124575:<page_seq>` 作为 page-level canonical Citation ID。

理由:
- `page_objects.page_label` (e.g. `p0001`) 仅 91 unique 映射到 956 个 page_objects (1:10.5)
- `SHUGE:p124575:4` 在 R2 实际对应 6 个不同的 page_objects (1594/1657/1795/2005/2079/2323)
- page_label 不唯一 → 不可作 page-level pointer

---

## 2. 验证结果

| 字段 | 值 |
|---|---|
| `canonical_citation_count` | **956** |
| `citation_collisions` | **0** |
| `CITATION_COLLISIONS` (spec K) | **0** ✓ |

page_objects.id 是 INTEGER PRIMARY KEY,在 work_id=p124575 范围内天然唯一。

---

## 3. Sample canonical citations (前 10)

| canonical_citation_id | page_object_id | page_label | sequence_status |
|---|---|---|---|
| `SHUGE:p124575:1501` | 1501 | p0001 | OK |
| `SHUGE:p124575:1502` | 1502 | p0002 | OK |
| `SHUGE:p124575:1503` | 1503 | p0003 | OK |
| `SHUGE:p124575:1504` | 1504 | p0004 | OK |
| `SHUGE:p124575:1505` | 1505 | p0005 | OK |
| `SHUGE:p124575:1591` | 1591 | p0001 | OK |
| `SHUGE:p124575:1592` | 1592 | p0002 | OK |
| `SHUGE:p124575:1593` | 1593 | p0003 | OK |
| `SHUGE:p124575:1594` | 1594 | p0004 | OK |
| `SHUGE:p124575:1595` | 1595 | p0005 | OK |

---

## 4. Legacy Citation ID 关系(保留不变)

R2.1 legacy Citation ID 格式保留(`legacy_citation_id_format_unchanged`):
```
SHUGE:p124575:<page_seq>      e.g. SHUGE:p124575:1
```

但 R3 audit 明确指出该 legacy format **不再用作 canonical page-level pointer**,仅作为 legacy 字段保留。

新的 canonical = `SHUGE:p124575:<page_object_id>` (R3 起生效)。

---

## 5. Disambiguation example

同一个 legacy_citation_id `SHUGE:p124575:4` 在 R2 实际对应 6 个不同的 page_objects:

| page_object_id | page_label | region (R2.2) |
|---|---|---|
| 1594 | p0004 | 河水_野王_修武 |
| 1657 | p0004 | 易水_范陽_容城 |
| 1795 | p0004 | 渭水_關中 |
| 2005 | p0004 | 汾水_代城 |
| 2079 | p0004 | 汝水_霍陽_梁 |
| 2323 | p0004 | 江水_公安_華容 |

→ `SHUGE:p124575:4` 完全无法区分上述 6 个 page_objects。canonical 必须使用 `SHUGE:p124575:1594` 等具体 page_object_id。

---

## 6. Output

| 文件 | 内容 |
|---|---|
| `data/water_classic_canonical_citations_r3.json` | 956 canonical citations + collision verification |

---

**STATUS:** Section B complete · `CANONICAL_CITATION_COUNT = 956` · `CITATION_COLLISIONS = 0` ✓ · no v1.0 / R1 / R2 / R2.1 / R2.2 outputs modified.