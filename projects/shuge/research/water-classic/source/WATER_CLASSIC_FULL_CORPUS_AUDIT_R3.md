# WATER_CLASSIC_FULL_CORPUS_AUDIT_R3

**task_id:** `WATER_CLASSIC_R3_FULL_CORPUS_RECONCILIATION`
**section:** A · Full Corpus Audit
**generated_at:** 2026-09-28
**db_source:** `shuge-research-db/data/shuge.db` (read-only via Python `sqlite3` URI mode)
**frozen_baseline_sha_v1_0:** `3a51ef5e698655c215a1f36147d24bfe8c7e6826`
**r1_frozen_sha:** `59d258e80ac55bbc2b580d38919ba47dac01c412`
**r2_frozen_sha:** `3883455b7c8947b5bbe2de3cab857311552837f3`
**r2_1_frozen_sha:** `fda2ecb214254dbd312d80956381bfe8ca0a5887`
**r2_2_frozen_sha:** `8a5a1302d53c3aa4c39b01125b1ce946cf6adc27`

---

## 1. Work identity (DB read-only)

| 字段 | 值 |
|---|---|
| `works.id` | `p124575` |
| `works.post_id` | `124575` |
| `works.title` | 水经注 |
| `works.author` | 桑钦撰 后魏 郦道元 注 |
| `works.dynasty_or_date` | 汉代 |
| `works.resource_type` | 中国史地; 史部; 魏晋南北朝 |
| `works.shuge_url` | https://www.shuge.org/view/shui_jing_zhu/ |
| `editions.edition_text` | 明万历十三年 (乙酉 1585) 新安吴琯刊山水经合刻本 |
| `editions.volume_info` | 十四 |
| `editions.physical_description` | 十四册。半叶框 20.8 x 13.6 厘米，十行行二十字，左右双栏，版心白口单黑鱼尾, 上方记「水經」 |
| `digital_objects` linked | **0** |
| `document_units` for p124575 | **0** |

> canonical SHUGE work record = `post_id 124575` (per R2.2 amendment — 不与馆藏 digital object 混同)

---

## 2. Expected vs Authoritative (per spec K)

| 字段 | EXPECTED_FROM_PRIOR_REPORT | authoritative DB read-only |
|---|---|---|
| `TOTAL_PAGE_OBJECTS` | 956 | **956** ✓ |
| `OCR_SUCCESS` | 956 | **956** (see §3) |
| `SEARCHABLE_PAGES` | 933 | **956** ⚠ discrepancy |
| `ZERO_TEXT_PAGES` | 23 | **0** ⚠ discrepancy |
| `OCR_CHARS` | 322030 | **302951** ⚠ discrepancy |

---

## 3. OCR state · 两套字段不一致说明

`page_objects.ocr_status` 字段当前 **全部 = `QUEUED`** (上游未更新),但 `page_ocr.status` 全部 = `SUCCESS`。本审计采用 `page_ocr.status` 视角,报告 `OCR_SUCCESS = 956`。

```
page_objects.ocr_status = QUEUED     : 956 pages
page_objects.ocr_status = SUCCESS    : 0 pages   (上游 lag)
page_ocr.status        = SUCCESS     : 956 pages (实际 OCR 已成功)
page_ocr.status        = QUEUED      : 0 pages
```

---

## 4. char_count 分布 (全 956 页)

| bucket | pages |
|---|---|
| 0 | 0 |
| 1–50 | 27 |
| 51–200 | 64 |
| 201–500 | 865 |
| 501+ | 0 |
| NULL | 0 |

---

## 5. page_index / page_label 关键发现 ⚠

| 字段 | 值 |
|---|---|
| `MIN(id)` | 1501 |
| `MAX(id)` | 2456 |
| `MIN(page_index)` | 1 |
| `MAX(page_index)` | 91 |
| distinct `page_label` | 91 |
| page_objects per label | **956 / 91 ≈ 10.51** (1:10.5 多对一) |

R2.1 已发现 `page_seq` (page_label) 仅 5 unique 不唯一。R3 进一步发现:
- `page_index` 同样仅有 91 unique,且被多 page_objects 共享
- 这意味着 `SHUGE:p124575:<page_seq>` 作为 page-level Citation ID **完全不可用**
- canonical Citation ID 必须使用 `SHUGE:p124575:<page_object_id>` (page_objects.id · INTEGER PK · 全 956 唯一)

---

## 6. ocr_fts 表 · 状态 ⚠

`ocr_fts` (FTS5 virtual table, tokenize='trigram') 对该 work 完全无数据:
- 0 rows 对江水 / 公安 / 華容 / 易水 / 范陽 / 容城 / 故安 / 河水 / 野王 / 修武
- 但 `page_ocr.normalized_text` 有真实数据(302951 chars)

**结论:** R3 中所有故事 retest 必须使用 `page_ocr.normalized_text LIKE` (替代 FTS),不依赖 ocr_fts。

---

## 7. OCR runs (DB)

| run_id | engine | model | profile | pages_requested | pages_success |
|---|---|---|---|---|---|
| 10 | rapidocr | PP-OCRv4-mobile(onnx) | rapidocr-maxside1600 | None | None |
| 11 | rapidocr | PP-OCRv4-mobile(onnx) | rapidocr-maxside1600 | None | None |
| 12 | rapidocr | PP-OCRv4-mobile(onnx) | rapidocr-maxside1600 | 3 | 3 |
| 14 | rapidocr | PP-OCRv4-mobile(onnx) | rapidocr-maxside1600 | 2532 | 1691 |

> run 14 是 batch OCR,共 request 2532 pages (远超 p124575 的 956),说明该 run 涵盖多 work。

---

## 8. Digital objects · 当前状态

`digital_objects` 表当前对 p124575 **0 关联**。完整 corpus DB 中其他 work 有 20 条 digital_objects 记录(但都不属于 p124575)。

**影响:**
- `public_evidence_ref` → `full_page_object_id` → `digital_object_id` 链路中 `digital_object_id` 全部为 NULL
- canonical_citation_id 仍可建立 (基于 page_objects.id),但 `digital_object_id` 字段填 NULL

---

## 9. Output files

| 文件 | 行数 | 用途 |
|---|---|---|
| `data/water_classic_full_corpus_stats_r3.json` | 70 | machine-readable corpus stats + discrepancies |
| `data/water_classic_canonical_citations_r3.json` | – | Section B 输出 |
| `data/water_classic_r2_to_full_corpus_map.json` | – | Section C 输出 |
| `data/water_classic_volume_structure_r3.json` | – | Section D 输出 |
| `data/water_classic_story_retest_r3.json` | – | Section E 输出 |

---

## 10. Discrepancies 结论 (per spec K)

DB authoritative 数值与 EXPECTED 报告不一致。**不强行修正。**

| 字段 | 差异 | 性质 |
|---|---|---|
| ZERO_TEXT_PAGES | 0 vs 23 | DB 实际 OCR 覆盖率 > 报告 |
| SEARCHABLE_PAGES | 956 vs 933 | DB 实际比报告多 23 页 (即原报告的 23 zero-text 实为 SEARCHABLE) |
| OCR_CHARS | 302951 vs 322030 | DB 当前 corpus 子集 ≈ 报告 corpus 的 94% (19079 chars 差异) |

---

**STATUS:** Section A complete · file `data/water_classic_full_corpus_stats_r3.json` written · no v1.0 / R1 / R2 / R2.1 / R2.2 outputs modified.