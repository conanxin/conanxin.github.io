# SHUGE-RESEARCH-DB STATUS

_Last updated: 2026-09-28 04:46 CST_

## 当前阶段

**P5-C: COMPLETE** (Thematic Research Collections, Issue #8 closed)

## Phase

**Phase:** P5-B2 complete · P5-C complete

## 数据库

- **DATABASE_SIZE**: 45,117,440 bytes
- **OCR_TOTAL_SUCCESS**: 3553
- **OCR_TOTAL_EMPTY**: 33
- **OCR_TOTAL_FAILED**: 0
- **OCR_TOTAL_PENDING**: 0
- **integrity_check**: ok
- **foreign_key_check**: 0 violations

## 三部 JDA works (P5-B2 frozen)

| work_id | name | pages | OCR success | searchable |
|---|---|---|---|---|
| p124575 | 水经注 | 956 | 956 | 933 |
| p44159 | 工程做法 | 1456 | 1456 | 1456 |
| p48341 | 河防一览 | 122 | 122 | 122 |

## P5-C Thematic Collections (Issue #8 closed)

- **2 collections**: `historical-hydrology`, `architecture-construction`
- **Total memberships**: 283 (4 WORK + 279 PAGE, UNIT reserved)
- **WORK seeds**: 水经注 + 河防一览 (hydrology); 工程做法 + 园冶 (architecture)
- **PAGE members**: 天工开物 p211203 (hydrology: 63 / architecture: 216)
- **Schema**: `research_collections`, `collection_memberships`
- **Tools**: `scripts/collections.py list/show/works/page-counts`
- **--collection flag**: `research_search.py` + `research.py` (filter BEFORE evidence synthesis)

## P5-C Acceptance Gate — 11/11 ✅

- ✅ 2 collections created
- ✅ all 283 memberships have inclusion_method + reason + confidence
- ✅ same work/page can belong to multiple collections (天工开物 p211203 in both)
- ✅ collection filter works in `research_search.py` (SQL-level EXISTS subquery)
- ✅ collection filter works in `research.py` (passed to subprocess BEFORE evidence synthesis)
- ✅ ≥10 collection-scoped queries (12 total)
- ✅ OUT_OF_COLLECTION_EVIDENCE_LEAKAGE = 0
- ✅ verified-false regression (collection scope) PASS
- ✅ abstention in bounded collections PASS (1 confirmed INSUFFICIENT_EVIDENCE)
- ✅ UNSUPPORTED_CLAIM_SENTENCES = 0
- ✅ Citation IDs / provenance unchanged

## P5-B2 终态 (frozen, Issue #7 closed)

- 14/14 acceptance gate PASS
- 三部 JDA OCR 100% 完成 (3553 SUCCESS / 33 EMPTY / 0 FAILED)
- FTS5 健康 (ocr_fts=3553=docsize)
- Search QA 15/15 TRUE, Visual QA 60页 0 FAIL
- 9 research questions (corpus-grounded)
- 乃粒回归 + JDA 负例回归 + P4-E 12/12 + abstention 6/6 PASS
- UNSUPPORTED_CLAIM_SENTENCES=0

## Known limitations

- several thousand pages are searchable, but reading-order reconstruction remains partial
- some decorative / blank / image-only pages are intentionally not text-searchable
- stronger secondary OCR remains deferred on the current hardware
- current public GitHub package documents the research system; large local assets and DB files are not mirrored here

## Deferred (P5-D+)

- Embedding / Vector DB / Neo4j / Web UI
- document_unit 维度 membership 注入
- PP-OCRv5 二次 OCR (工程做法 9 POOR 页)
- Harvard 浏览器路径整合
- Shuge JS portal
- 梦粱录卷10-20

## Reports

- `REPORT_P5C.txt` (P5-C 终报, 8691 bytes)
- `REPORT_P5B2.txt` (P5-B2 终报, 6471 bytes)
- `reports/thematic_collections.md`
- `reports/collection_membership_hydrology.csv`
- `reports/collection_membership_architecture.csv`
- `reports/p5c_collection_qa.md`
