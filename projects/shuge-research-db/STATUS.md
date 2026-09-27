# Status

## Current project state

**Phase:** P5-B2 finalization pending

**Operational state:** `READY_FOR_P5B2_FINALIZATION`

The long-running JDA OCR job has finished cleanly.

## Post-OCR check

Database:

- size: 45,010,944 bytes
- SQLite integrity: OK
- foreign-key violations: 0
- active OCR workers: 0
- active importers: 0

OCR:

- SUCCESS: 3553
- EMPTY: 33
- FAILED: 0
- PENDING: 0

FTS:

- virtual row count: 3553
- docsize row count: 3553
- shadow state: healthy

## JDA corpus

### 《水经注》

- pages: 956
- OCR SUCCESS: 956
- FTS searchable non-empty: 933
- zero-text / genuine blank: 23

### 《工程做法》

- pages: 1456
- OCR SUCCESS: 1456
- FTS searchable: 1456

### 《河防一览》

- pages: 122
- OCR SUCCESS: 122
- FTS searchable: 122

## Remaining P5-B2 finalization

- Citation ID full-coverage audit
- at least 45-page visual QA
- at least 5 search-QA terms per JDA work
- at least 3 corpus-grounded research questions per JDA work
- cross-work term tests
- “乃粒” regression
- negative recovery regression:
  - 靖海全图 must remain NOT_FOUND
  - 今古舆地图 must remain AMBIGUOUS
- P4-E benchmark regression
- abstention regression
- verified-false regression
- final static corpus snapshot

## Known limitations

- several thousand pages are searchable, but reading-order reconstruction remains partial
- some decorative / blank / image-only pages are intentionally not text-searchable
- stronger secondary OCR remains deferred on the current hardware
- current public GitHub package documents the research system; large local assets and DB files are not mirrored here

## Candidate P5-C direction

Shift from source-centric organization to thematic research collections.

Candidate collections:

1. Historical Hydrology & River Defense
2. Architecture & Construction
3. Urban Space
4. Classical Knowledge & Technology
5. Medicine & Recipes

A future query should be able to constrain research to one or more thematic collections without changing the provenance and citation model.
