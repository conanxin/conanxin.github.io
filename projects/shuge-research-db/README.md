# SHUGE-RESEARCH-DB

A provenance-aware personal research infrastructure for transforming Shuge (书格) and upstream digital-library resources into a searchable, page-addressable, citation-grounded historical research corpus.

## Purpose

The project began with a simple question: how can several terabytes of digitized Chinese rare books, maps, photographs, and related materials be turned from a file archive into a research system?

The working answer is a layered pipeline:

```
Shuge catalogue
→ upstream institution
→ digital object / IIIF / bookget
→ controlled local acquisition
→ page objects + provenance
→ OCR
→ full-text retrieval
→ stable citation IDs
→ evidence packs
→ natural-language research planning
→ citation-bound research briefs
```

The goal is not to mirror everything first. The goal is to preserve provenance, acquire selectively, make pages computable, and ensure that every research claim can be traced back to a scan.

## Current state

As of 2026-09-28:

- 756 Shuge works indexed from the public WordPress portfolio API
- 82 normalized institutions
- 3614 tags / 7646 work-tag relations
- 1259+ page objects before the latest JDA expansion, with the JDA OCR corpus now fully processed
- 3553 OCR SUCCESS pages
- 33 OCR EMPTY pages
- 0 OCR FAILED pages
- SQLite integrity OK / foreign-key violations 0
- FTS5 trigram index healthy
- Three major JDA / Japanese Cabinet Library works fully OCR-processed:
  - 《水经注》: 956 pages, 933 searchable non-empty pages
  - 《工程做法》: 1456 pages
  - 《河防一览》: 122 pages
- Research assistant pipeline already validated with citation-bound outputs and abstention behavior

Current phase status:

`READY_FOR_P5B2_FINALIZATION`

The heavy OCR work is complete. Final citation coverage, visual QA, cross-work tests, and regression freeze are the remaining P5-B2 tasks.

## Core principles

### 1. Provenance before convenience

Every local page should retain a traceable chain:

```
work
→ edition
→ institution
→ digital object
→ page / canvas
→ local CAS object
→ OCR
→ citation
```

### 2. Raw evidence is immutable

Raw scans and raw OCR are never overwritten by corrected text. Corrections live in separate layers and must be reviewable.

### 3. Source recovery must be evidence-based

Title similarity alone is not enough to bind an old dead link to a new digital object.

A useful negative example:

- 《靖海全图》 was **not** rebound to Gallica’s 《靖海氛記》 despite title similarity.

### 4. Research claims are citation-bound

The research assistant can plan queries and organize evidence, but historical claims in generated briefs must point to Citation IDs.

### 5. Uncertainty is data

The system records states such as:

- AMBIGUOUS
- PARTIAL
- OCR_ERROR
- VERIFIED_FALSE_HIT
- REVIEW_REQUIRED
- LOW reliability
- INSUFFICIENT_EVIDENCE

rather than hiding them.

## Storage strategy

The project deliberately separates:

- **archive mirroring** — potentially multi-terabyte
- **research corpus** — selective, page-addressable, often only a few GB

Research-profile IIIF images are typically much smaller than institution-original scans while remaining suitable for OCR and visual inspection.

## Main technical components

- Python
- SQLite + WAL
- SQLite FTS5 trigram
- RapidOCR / PP-OCRv4-mobile
- IIIF Presentation / Image APIs
- bookget
- SHA-256 content-addressed storage
- single-writer import architecture
- deterministic / assisted query planning
- citation / evidence-pack export

See:

- [RESEARCH_LOG.md](./RESEARCH_LOG.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [METHODS_AND_FINDINGS.md](./METHODS_AND_FINDINGS.md)
- [STATUS.md](./STATUS.md)

## Repository scope

This public package currently publishes the research process, architecture, failure analysis, methodological findings, and stable project state.

The full local working implementation lives at:

```
/home/conanxin/shuge-research-db
```

Large scans, OCR derivatives, CAS objects, and local databases are intentionally not mirrored into this Git repository.

## Project origin

Primary source platform:

- Shuge / 书格 — https://www.shuge.org

Major upstream institutions encountered in the corpus include:

- National Archives of Japan / Cabinet Library
- Harvard
- National Library of China
- Library of Congress
- National Palace Museum
- Imperial Household Agency / SIDO
- Kyoto University
- BnF / Gallica
- CUHK
- Keio

## Direction

The next strategic step is not “download everything”.

It is to organize the corpus into research collections such as:

- historical hydrology and river defense
- architecture and construction
- urban space
- classical knowledge and technology
- medicine and recipes

and let the research assistant operate against bounded thematic corpora.
