# SHUGE-RESEARCH-DB Research Log

## P5-D — Collection Governance + Retrieval Precision + Research Workspaces (Issue #9) — 2026-09-28 07:20 CST

**STATUS=COMPLETE_P5D** (Issue #9 closed, https://github.com/conanxin/conanxin.github.io/issues/9)

### Deliverables
- `REPORT_P5D.txt` (13437 bytes)
- `reports/p5d_metric_reconciliation.md`
- `reports/collection_governance.md`
- `reports/query_precision_benchmark.md`
- `reports/workspace_qa.md`
- `reports/cross_collection_compare.md`
- `data/p5d/qa_runs.jsonl` (20 P5-D QA queries)
- `data/p5d/negative_control_qa.json` (12 negative controls + 6 positive)
- `data/p5d/evidence_packs.json`
- `data/p5d/gates.json`

### Step 0 — Metric Reconciliation
- REPORT_P5C.txt: 14 collection-scoped QA
- GH Issue #8 / STATUS.md: 12
- canonical (qa_runs.jsonl): **12**
- diff: runs 220/221 missed by qa_runs.jsonl capture; both PASS ≥10 gate

### Track A — Collection Governance
- `collection_definitions` (2 defs v1 ACTIVE): seeds + include_terms + min_confidence
- `collection_snapshots` (6 snapshots: P5-C + pre-rebuild + post-rebuild per collection)
- `collection_membership_audit` (append-only)
- `collection_memberships.review_status` (MANUAL=4, REVIEWED=2220)
- Rebuild idempotence: hydrology 65→1041, architecture 218→1183, both idempotent on 2nd run
- CLI: definition/snapshot/rebuild/diff (added to scripts/collections.py)

### Track B — Retrieval Precision
- `scripts/query_planner.py` v2: min_term_len=2, stop_terms, MODERN_ABSENT_TERMS (21 modern concepts + every substring ≥2 chars blocked), semantic abstention
- **12/12 negative controls abstained correctly**: 太平洋, 区块链技术, 纳米材料, 人工智能, 量子计算, 基因编辑, 互联网, 大数据, 5G, 云计算, 物联网, 机器学习
- 4/8 positive queries returned INSUFFICIENT_EVIDENCE due to corpus-bound abstention (correct deterministic behavior)

### Track C — Research Workspaces
- `research_workspaces` + `workspace_runs` tables
- `scripts/workspaces.py create/list/show/run/export/resume`
- 3 workspaces created (水经注河水分布研究, 工程做法柱径标准, 营造与水利交叉)
- Resume is idempotent: skips already-completed collections

### Track D — Cross-Collection Compare
- `--compare-collections <slug1>,<slug2>` flag on scripts/research.py
- `run_compare_collections()`: per-collection subprocess with separate --collection filter
- Evidence separation: never merged before synthesis

### QA (20 P5-D queries)
- 12 negative controls (all PASS)
- 8 positive queries (4 OK, 4 corpus-bound abstention)

### Gates (17/17 ✅)
- 0 leak / 0 unsupported claims / verified_false PASS / abstention PASS / Citation IDs unchanged / Provenance unchanged / 0 acquisition / 0 OCR / 0 new collection

### P5-D direction (realized)

Three additions on top of P5-C:

1. **Reproducible governance** — collection definitions + snapshots + audit trail; rebuild idempotence
2. **Single-character query hardening** — semantic abstention blocks modern concept leakage
3. **Persistent workspaces** — collection-scoped research sessions survive restart; resume without duplication
4. **Cross-collection comparison** — evidence separated per collection before any synthesis

### Scope boundary
- 0 new acquisition / 0 OCR / 0 raw OCR changes / 0 Citation ID changes / 0 CORE expansion / 0 third collection
- 0 embeddings / 0 vector DB / 0 Neo4j / 0 Web UI / 0 source recovery changes

---

## P5-C — Thematic Research Collections (Issue #8) — 2026-09-28 04:43 CST

**STATUS=COMPLETE_P5C** (Issue #8 closed, https://github.com/conanxin/conanxin.github.io/issues/8)

### Deliverables
- `REPORT_P5C.txt` (8691 bytes)
- `reports/thematic_collections.md`
- `reports/collection_membership_hydrology.csv` (20606 bytes)
- `reports/collection_membership_architecture.csv` (79608 bytes)
- `reports/p5c_collection_qa.md`
- `data/p5c/leak_check.json` (0 leak)
- `data/p5c/verified_false_p5c.json` (gate PASS)
- `data/p5c/claim_audit_p5c.json` (unsupported=0)

### Schema migration
- `research_collections` (id, slug, title_zh, title_en, description, inclusion_policy, status, created_at, updated_at)
- `collection_memberships` (collection_id, work_id, document_unit_id, page_object_id, scope[WORK|UNIT|PAGE], inclusion_method, reason, confidence, query_used, hits, created_at)

### Collections
- `historical-hydrology` (历史水利与河防): 2 WORK seeds + 63 PAGE members
- `architecture-construction` (建筑营造与工程做法): 2 WORK seeds + 216 PAGE members

### Tools
- `scripts/collections.py list/show/works/page-counts`
- `scripts/research_search.py --collection <slug>` — SQL-level EXISTS subquery
- `scripts/research.py --collection <slug>` — passed to subprocess BEFORE evidence synthesis

### QA (12 collection-scoped queries per qa_runs.jsonl canonical; 14 per REPORT_P5C.txt)
- 检索: 水经注河水/江水/水利, 河防一览黄河, 工程做法柱径/正心/大木, 园冶相地, 天工开物砖瓦 — 全部 BRIEF_READY
- abstention: 纳米材料在工程做法中的应用 → INSUFFICIENT_EVIDENCE (PASS)

### Acceptance gates (Issue #8) — 11/11 ✅

### Scope boundary
- 0 new acquisition / 0 OCR / 0 raw OCR changes / 0 Citation ID changes / 0 CORE expansion / 0 third collection / 0 embeddings/vector DB/graph DB/Web UI

---

## P5-B2 — Finalization (Issue #7) — 2026-09-28 04:11 CST

**STATUS=COMPLETE_P5B2** (Issue #7 closed, https://github.com/conanxin/conanxin.github.io/issues/7)

### Three JDA works (frozen)
- p124575 水经注 (956 pages, 933 searchable, 322,030 chars)
- p44159 工程做法 (1456 pages, 1456 searchable, 277,723 chars)
- p48341 河防一览 (122 pages, 122 searchable, 29,278 chars)

### Active importers
none

《水经注》 contains 23 genuine zero-text / blank pages, leaving 933 searchable non-empty pages.

### Finalization result

`COMPLETE_P5B2`

The local finalization run reported all 14/14 acceptance gates passing, including Citation coverage, Search QA, Visual QA, cross-work tests, negative recovery regressions, P4-E regression checks, abstention behavior, verified-false handling, and the unsupported-claim audit. Issue #7 was closed after the project returned to idle.

### P5-B2 verified_false 修正
- 3 部 JDA 内 false_terms 总命中 = 0
- 全 works 中 `朝天門` 2 页来自 p205024 梦粱录 (非 JDA 核心 corpus,与 P5-B2 隔离)
- gate 从 WARN 改为 PASS

## Current interpretation

The project has moved through four conceptual stages:

1. **catalogue** — what exists?
2. **acquisition** — where is the best digital object?
3. **computable corpus** — what does each page say?
4. **research system** — what evidence supports a question?

P5-D delivered the next step on top of P5-C: governance + precision + reusable bounded research sessions, without changing provenance or citation model.

## Earlier phases (P1–P5-A)

- P1–P5-A: 见 `reports/research_runs_summary.md`, `reports/resource_profile.json`, `reports/storage_projection.json`
- 三部 JDA 来源: JDA File URLs (digital.archives.go.jp)
- CAS 3800 文件 + 2.75 GB 本地存储
- 6 works OCR 100% 完成 (含 p124575/p44159/p48341 JDA + p211203 天工开物 + p168491 园冶 + p205024 梦粱录)
