# SHUGE-RESEARCH-DB Research Log

## P5-C — Thematic Research Collections (Issue #8) — 2026-09-28 04:44:25 

**STATUS=COMPLETE_P5C** (Issue #8 closed)

### Deliverables
- `REPORT_P5C.txt` (8691 bytes)
- `reports/thematic_collections.md` (3101 bytes)
- `reports/collection_membership_hydrology.csv` (20606 bytes)
- `reports/collection_membership_architecture.csv` (79608 bytes)
- `reports/p5c_collection_qa.md` (3747 bytes)
- `data/p5c/leak_check.json` (0 leak)
- `data/p5c/verified_false_p5c.json` (gate PASS)
- `data/p5c/claim_audit_p5c.json` (unsupported=0)
- GitHub Issue #8 closed (https://github.com/conanxin/conanxin.github.io/issues/8)

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

---

## P5-B2 — Finalization (Issue #7) — 2026-09-28 04:11 CST

**STATUS=COMPLETE_P5B2** (Issue #7 closed)

### Three JDA works (frozen)
- p124575 水经注 (956 pages, 933 searchable, 322,030 chars)
- p44159 工程做法 (1456 pages, 1456 searchable, 277,723 chars)
- p48341 河防一览 (122 pages, 122 searchable, 29,278 chars)

### Acceptance gates (Issue #7) — 14/14 ✅
- OCR pending=0 / citation_missing=0 / FTS health=PASS / search_qa 15/15 / visual_qa 60 页 0 FAIL / research 9 questions / cross_work 5+ terms / 乃粒 PASS / JDA negative PASS / P4-E 12/12 / abstention 6/6 / verified-false PASS / unsupported_claim_sentences=0 / worker_importer_zero

### Deliverables
- `REPORT_P5B2.txt` (6471 bytes, 216 lines)
- `reports/corpus_snapshot_p5b2.json`
- `data/p5b2/*.json` (citation_qa, search_qa, visual_qa, cross_work_tests, jda_negative, naili, p4e, abstention, verified_false, low_reliability, claim_audit, perf)
- GitHub Issue #7 closed (https://github.com/conanxin/conanxin.github.io/issues/7)

### Regressions passed
- 乃粒回归: work_id+page_object_id+sha256 citation 体系稳定
- JDA 负例: 靖海全图 (p1115) NOT_FOUND / 今古舆地图 (p12203) AMBIGUOUS (water-mark false terms 隔离)
- P4-E 12 benchmark: 全部 INSUFFICIENT_EVIDENCE (no systematic regression)
- abstention 6/6: zero-hit queries 正确返回 INSUFFICIENT_EVIDENCE
- verified-false: 三部 JDA 内 false_terms 总命中 = 0 (梦粱录 vol07-0001/vol09-0006 的 `朝天門` 命中与 JDA 核心 corpus 隔离)

---

## Earlier phases (P1–P5-A)

- P1–P5-A: 见 `reports/research_runs_summary.md`, `reports/resource_profile.json`, `reports/storage_projection.json`
- 三部 JDA 来源:JDA File URLs (digital.archives.go.jp)
- CAS 3800 文件 + 2.75 GB 本地存储
- 6 works OCR 100% 完成 (含 p124575/p44159/p48341 JDA + p211203 天工开物 + p168491 园冶 + p205024 梦粱录)

