# SHUGE-RESEARCH-DB Research Log

## P5-C — Thematic Research Collections (Issue #8) — 2026-09-28 04:46 CST

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

### QA (12 collection-scoped queries)
- 检索: 水经注河水/江水/水利, 河防一览黄河, 工程做法柱径/正心/大木, 园冶相地, 天工开物砖瓦 — 全部 BRIEF_READY
- abstention: 纳米材料在工程做法中的应用 → INSUFFICIENT_EVIDENCE (PASS)

### Acceptance gates (Issue #8) — 11/11 ✅
- 2 collections / traceable reason / multi-collection work+page / filter in research_search.py / filter in research.py (BEFORE synthesis) / ≥10 queries / 0 leak / verified-false regression / abstention in bounded / UNSUPPORTED_CLAIM_SENTENCES=0 / Citation IDs unchanged

### Scope boundary
- 0 new acquisition / 0 OCR / 0 raw OCR changes / 0 Citation ID changes / 0 CORE expansion / 0 third collection / 0 embeddings/vector DB/graph DB/Web UI

### P5-C direction (realized)

Shift from source-centric organization to thematic research collections.

Realized collections:

1. Historical Hydrology & River Defense (historical-hydrology) — 水经注 + 河防一览 + 天工开物 hydrology pages
2. Architecture & Construction (architecture-construction) — 工程做法 + 园冶 + 天工开物 construction pages

A query can now constrain research to one or more thematic collections without changing the provenance and citation model.

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

## Current interpretation

The project has moved through four conceptual stages:

1. **catalogue** — what exists?
2. **acquisition** — where is the best digital object?
3. **computable corpus** — what does each page say?
4. **research system** — what evidence supports a question?

The next phase should increasingly organize by research theme rather than by source website.

P5-C delivered the first step of that shift: thematic research collections over the existing corpus, without changing provenance or citation model.

## Earlier phases (P1–P5-A)

- P1–P5-A: 见 `reports/research_runs_summary.md`, `reports/resource_profile.json`, `reports/storage_projection.json`
- 三部 JDA 来源:JDA File URLs (digital.archives.go.jp)
- CAS 3800 文件 + 2.75 GB 本地存储
- 6 works OCR 100% 完成 (含 p124575/p44159/p48341 JDA + p211203 天工开物 + p168491 园冶 + p205024 梦粱录)
