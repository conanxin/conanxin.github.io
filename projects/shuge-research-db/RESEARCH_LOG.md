# Research Log

This document records the main development and research stages of SHUGE-RESEARCH-DB.

## P0 — Catalogue brain

Goal: prove that Shuge resources could be turned into a local searchable catalogue without downloading large files.

Result:

- discovered public WordPress REST endpoint: `/wp-json/wp/v2/portfolio`
- indexed the complete new-site portfolio
- 756 works
- 506 editions
- 545 sources
- 506 assets
- 764 raw metadata JSON files
- first SQLite search CLI operational

Initial coverage:

- author 67.2%
- date/dynasty 55.2%
- edition 64.2%
- institution 66.9%
- source URL 66.5%
- asset URL 63.0%

Key lesson: Shuge’s public structured data was sufficient to build a reliable catalogue layer before touching the multi-terabyte archive.

## P1 — Metadata normalization

Goal: convert webpage metadata into computable entities.

Result:

- works remained 756 with zero loss
- editions increased to 618
- institutions normalized to 82 + 20 aliases
- tags later expanded to 3614
- author coverage → 82.8%
- dynasty/date coverage → 99.3%
- edition coverage → 80.3%
- alternate-title coverage → 23.0%

Important discovery:

Shuge’s taxonomy carried dynasty metadata that was more structured than the page prose.

Top institutions included:

- Japanese Cabinet Library
- Harvard
- National Library of China
- Library of Congress
- National Palace Museum
- Imperial Household Agency
- Kyoto University

## P2 — Upstream resource resolution

Goal: determine where a Shuge resource actually comes from and what machine-readable acquisition route exists.

New concepts:

- `digital_objects`
- `resource_resolutions`
- institution adapters
- preferred acquisition method

Results:

- RESOLVED 227
- PARTIAL 155
- UNRESOLVED 374
- bookget covered 9/11 core institutions in documentation
- IIIF verified on BnF/Gallica and Imperial Household / SIDO

Case studies:

- 《天工开物》 → Gallica → IIIF v2
- 《魏氏家藏方》 → SIDO → IIIF v2
- 《水经注》 → old Cabinet Library route
- 《佩文韵府》 → Harvard / bookget documentation
- 《附释文互注礼部韵略》 → NLC / bookget

## P3-A — Controlled acquisition pilot

Goal: test real acquisition without bulk downloading.

Results:

- 7 works / 5 institutions
- ~259.6 MB downloaded
- 51 files
- 51 unique objects
- IIIF 24/24 successful
- NLC bookget path successfully downloaded high-resolution pages
- Shuge shortlink ultimately led to a JS portal rather than a simple direct file

Key result:

IIIF proved to be the most controllable page-level research route.

## P3-B — Research-profile local collection

Goal: move from “can download” to “can register pages safely”.

Important engineering changes:

- content-addressed storage
- `page_objects`
- acquisition profiles
- per-work byte budgets
- OCR queue preparation
- URL normalizers

P3-B final snapshot:

- 675 page objects
- 994.6 MB local data
- 519-page OCR queue
- NLC integrity PASS
- no duplicate SHA objects

A major failure also appeared:

multiple acquisition processes wrote to SQLite concurrently and caused write-lock failures.

This became a central engineering lesson for later phases.

## P4-A — OCR and page-level search

Goal: make scanned pages searchable while preserving provenance.

Benchmark:

- 96 pages
- RapidOCR / PP-OCRv4-mobile selected
- benchmark success 97.9%
- visual QA: PASS 8 / USABLE 19 / POOR 3 / FAIL 0

Full run:

- 519 pages processed
- 507 SUCCESS
- 12 EMPTY
- 0 FAILED
- ~3.3 s/page on i7-6700 CPU
- FTS5 trigram built
- Evidence-link QA 33/33 PASS
- Search QA: TRUE 14 / VARIANT 2 / FALSE 0

Key conclusion:

A small CPU-only model was already sufficient for retrieval-grade OCR.

## P4-B — Citation-grade text layers

Goal: separate raw OCR, normalized text, reading order, and correction layers.

Reading-order benchmark did **not** pass the global rollout gate.

Result:

- 17 IMPROVED
- 2 SAME
- 0 WORSE
- 17 AMBIGUOUS

The correct decision was to stop automatic full-corpus reordering rather than force a questionable transformation.

Other results:

- 507 stable Citation IDs
- variant-search bridge
- 19 document units confirmed
- correction candidates tracked without overwriting raw OCR
- evidence bundle generation operational

## P4-C — Cross-work research retrieval

Goal: search across works with deterministic query modes and generate evidence packs.

Capabilities:

- ANY
- ALL
- NEAR
- work/institution/resource-type filters
- page-level deduplication
- variant expansion
- evidence packs
- citation ranges
- concordance mode

Benchmark:

- 30 queries
- 59 QA hits
- TRUE 51
- PROXIMITY 2
- OCR_ERROR 4
- FALSE 2

Important finding:

The system could expose false hits rather than silently deleting them.

## P4-D — Evidence reliability

Goal: make uncertainty and corrections first-class data.

Results:

- 20 correction records
- 19 approved
- 1 rejected
- 14 corrected pages
- 4 verified false-hit annotations
- 507 pages assigned text-reliability states
- Citation QA 86 hits
- corrected-text QA 19/19 PASS

Important methodological discoveries:

- visual QA itself can be wrong on dense historical text
- false-hit suppression should be query+page specific, not page-global
- raw OCR must remain immutable

## P4-E — Evidence-grounded research assistant

Goal: accept a natural-language research question and produce citation-bound evidence and briefs.

Pipeline:

```
question
→ search plan
→ deterministic retrieval
→ evidence ledger
→ citations
→ brief
→ gaps / abstention
```

Results:

- 16 research runs
- 5 full case studies
- 2 clean insufficient-evidence runs
- 119 claim sentences
- 119/119 with citations
- 0 unsupported claims
- 5/5 abstention tests passed
- median research run ~1.2 s

Important finding:

Mechanical synthesis templates can structurally prevent unsupported historical claims by only allowing evidence-backed content into findings.

## P5-A — Automatic intake and corpus scaling

Goal: prove that new resources could enter the research system automatically.

Critical engineering fix:

```
download worker
→ filesystem / spool
→ single importer
→ SQLite
```

Crash/resume tests reproduced and fixed three real bugs, including the exact P3-B orphan state:

“CAS file moved, DB row not registered”.

Corpus expansion:

- searchable pages 507 → 1018
- OCR chars 84,331 → 204,425
- 《天工开物》 expanded from an 8-page pilot to a 422-canvas complete local work
- 《书集传》 added 123 searchable pages
- research regression remained clean

## P5-B — JDA source recovery

Goal: recover dead or migrated Japanese Cabinet Library links.

Five target decisions:

### RECOVERED_HIGH

- 《水经注》 — 14 volumes / 956 pages
- 《工程做法》 — 54 volumes / 1456 pages
- 《河防一览》 — 122 pages

### NOT_FOUND

- 《靖海全图》

A Gallica candidate was actually 《靖海氛記》. The one-character title difference was treated as a blocking identity mismatch, not a near-enough match.

### AMBIGUOUS

- 《今古舆地图》

The legacy menu page lacked enough volume/object structure for a safe rebinding.

Key principle:

**title-only recovery is prohibited.**

## P5-B2 — JDA OCR finalization

The recovered JDA corpus was processed in a long OCR run.

A failure occurred because the OCR process had been launched under an OpenClaw exec-session lifecycle.

Root causes:

1. queue path was accidentally doubled:
   `data/data/ocr_queue_p5b.jsonl`
2. long shell wrappers were killed when the parent exec session timed out

Fix:

```python
subprocess.Popen(
    [...],
    stdin=DEVNULL,
    stdout=log,
    stderr=STDOUT,
    start_new_session=True,
)
```

This detached the long-running worker from the launching exec session.

Post-OCR static check:

- OCR total SUCCESS: 3553
- OCR total EMPTY: 33
- OCR total FAILED: 0
- pending: 0
- 《水经注》: 956/956 OCR success
- 《工程做法》: 1456/1456
- 《河防一览》: 122/122
- SQLite integrity: OK
- foreign-key violations: 0
- FTS shadow state: healthy
- active OCR workers: none
- active importers: none

《水经注》 contains 23 genuine zero-text / blank pages, leaving 933 searchable non-empty pages.

Current status:

`READY_FOR_P5B2_FINALIZATION`

Remaining finalization work:

- citation coverage audit
- >=45-page visual QA
- per-work search QA
- >=9 corpus-grounded research queries
- cross-work tests
- negative regression tests
- P4-E regression freeze

## Current interpretation

The project has moved through four conceptual stages:

1. **catalogue** — what exists?
2. **acquisition** — where is the best digital object?
3. **computable corpus** — what does each page say?
4. **research system** — what evidence supports a question?

The next phase should increasingly organize by research theme rather than by source website.
