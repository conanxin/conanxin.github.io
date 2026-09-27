# SHUGE-RESEARCH-DB STATUS

_Last updated: 2026-09-28 07:20 CST_

## 当前阶段

**P5-D: COMPLETE** (Collection Governance + Retrieval Precision + Research Workspaces, Issue #9 closed)

## Phase

**Phase:** P5-B2 complete · P5-C complete · P5-D complete

## 数据库

- **DATABASE_SIZE**: 45,142,016 bytes
- **OCR_TOTAL_SUCCESS**: 3553
- **OCR_TOTAL_EMPTY**: 33
- **OCR_TOTAL_FAILED**: 0
- **OCR_TOTAL_PENDING**: 0
- **integrity_check**: ok
- **foreign_key_check**: 0 violations

## 三部 JDA works (P5-B2 frozen, unchanged in P5-D)

| work_id | name | pages | OCR success | searchable |
|---|---|---|---|---|
| p124575 | 水经注 | 956 | 956 | 933 |
| p44159 | 工程做法 | 1456 | 1456 | 1456 |
| p48341 | 河防一览 | 122 | 122 | 122 |

## P5-C Thematic Collections (Issue #8 closed, unchanged core in P5-D)

- **2 collections**: `historical-hydrology`, `architecture-construction`
- **Original memberships**: 283 (4 WORK + 279 PAGE) — preserved as snapshot `snap-N-v1-...-eb0f0cf4` / `d5d9bf0e`
- **Post-P5-D rebuild memberships**: 2224 (4 MANUAL WORK + 2220 REVIEWED PAGE)
- **Schema**: `research_collections`, `collection_memberships`, `collection_definitions`, `collection_snapshots`, `collection_membership_audit`
- **Tools**: `scripts/collections.py list/show/works/page-counts/definition/snapshot/rebuild/diff`
- **--collection flag**: `research_search.py` + `research.py` (filter BEFORE evidence synthesis)

## P5-D Track-by-Track (Issue #9 closed)

- **Track A — Collection Governance**: 2 defs v1 + 6 snapshots; rebuild idempotence proven (both collections); MANUAL/REVIEWED preservation; CLI extended
- **Track B — Retrieval Precision**: `scripts/query_planner.py` v2 (semantic abstention); **12/12 negative controls PASS** (太平洋/区块链/纳米材料/人工智能/量子计算/基因编辑/互联网/大数据/5G/云计算/物联网/机器学习)
- **Track C — Research Workspaces**: `research_workspaces` + `workspace_runs` tables; `scripts/workspaces.py create/list/show/run/export/resume`; 3 workspaces created and tested
- **Track D — Cross-Collection Compare**: `--compare-collections <slug1>,<slug2>` flag on `scripts/research.py`; evidence separated per collection

## P5-D Acceptance Gate — 17/17 ✅

- ✅ canonical P5-C QA metric reconciled (12 canonical from qa_runs.jsonl; 14 in REPORT_P5C.txt preserved)
- ✅ both collection definitions versioned (v1 ACTIVE)
- ✅ current memberships reproducible
- ✅ rebuild idempotent (both collections)
- ✅ snapshot diff works
- ✅ reviewed/manual memberships survive rebuild (MANUAL=4 rows preserved)
- ✅ accidental single-character decomposition blocked
- ✅ explicit legitimate single-character queries still work (allow-list: 水/河/江/湖/海/山/木/石/...)
- ✅ ≥6 negative-control questions abstain correctly (12/12)
- ✅ workspaces create/list/show/run/export work
- ✅ workspace resume does not duplicate completed steps
- ✅ cross-collection comparison keeps evidence separated
- ✅ out-of-collection leakage = 0
- ✅ Citation IDs and provenance unchanged
- ✅ verified-false regression PASS (verified_false_total=2, all OUT-of-collection)
- ✅ unsupported claim sentences = 0 (378/378 claims have citation_ids)
- ✅ no acquisition / OCR / new collection was introduced

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
- Notion sync deferred (no NOTION_TOKEN in env or clawhub config)

## Deferred (P5-E+)

- document_unit 维度的 membership 注入 (现有 21 个 units 可标注)
- Evidence Pack HTML 报告生成 pipeline
- Web UI: collections 列表 + corpus card 可视化
- Embedding / Vector DB / Neo4j / Web UI
- Citation 体系扩展: collection-scoped citation_id 前缀
- Harvard 浏览器路径整合
- Shuge JS portal
- PP-OCRv5 二次 OCR
- 梦粱录卷10-20 / 天工开物 / 书集传
- Notion sync (需 NOTION_TOKEN + page_id)

## Reports

- `REPORT_P5D.txt` (P5-D 终报, 13437 bytes)
- `REPORT_P5C.txt` (P5-C 终报, 8691 bytes)
- `REPORT_P5B2.txt` (P5-B2 终报, 6471 bytes)
- `reports/p5d_metric_reconciliation.md`
- `reports/collection_governance.md`
- `reports/query_precision_benchmark.md`
- `reports/workspace_qa.md`
- `reports/cross_collection_compare.md`
- `reports/thematic_collections.md`
- `reports/collection_membership_hydrology.csv`
- `reports/collection_membership_architecture.csv`
- `reports/p5c_collection_qa.md`
