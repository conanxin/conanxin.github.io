# Open-source scope

SHUGE-RESEARCH-DB is published as an open research package inside the public repository:

- https://github.com/conanxin/conanxin.github.io/tree/main/projects/shuge-research-db

## What is open

This package publishes the research-facing parts of the project:

- project purpose and design principles
- phase-by-phase research log
- architecture
- acquisition and provenance methodology
- OCR and retrieval methodology
- source-recovery rules and negative cases
- evidence / citation design
- failure analysis and recovery lessons
- current status and known limitations
- reproducibility notes for the research workflow

The current public package is intentionally documentation-first. It is meant to make the research method inspectable and reusable even when the full local working corpus is not distributed.

## What is not mirrored here

The following remain local:

- multi-GB / multi-TB scans
- OCR derivatives for the full corpus
- content-addressed storage objects
- local SQLite databases
- institution-downloaded page images
- local working logs and temporary spool files
- the complete local execution environment

This keeps the Git repository small and avoids redistributing source files that are already held by upstream institutions.

## Reproducibility boundary

The public package documents the stable pipeline:

```
Shuge catalogue
→ work / edition / institution normalization
→ upstream digital-object resolution
→ IIIF / bookget / institution adapter
→ controlled acquisition
→ CAS
→ page_objects
→ OCR
→ FTS / variant search
→ Citation ID
→ Evidence Pack
→ evidence-grounded research brief
```

The project deliberately preserves negative and ambiguous states instead of forcing completion.

Examples:

- `靖海全图` remains NOT_FOUND rather than being rebound to the different work `靖海氛記`.
- `今古舆地图` remains AMBIGUOUS while identity evidence is insufficient.
- verified OCR false hits are retained as audit records rather than deleted.

## Licensing

Repository-authored material in this package is released under the MIT License. See [LICENSE](./LICENSE).

Upstream scans and digital objects are not redistributed as part of this package; links and provenance records point back to their holding institutions.

## Citation

A machine-readable citation file is provided at [CITATION.cff](./CITATION.cff).

## Current release status

The public documentation currently covers P0 through P5-B2, including:

- 756 indexed Shuge works
- institution and source normalization
- IIIF / bookget acquisition experiments
- page-addressed OCR
- deterministic FTS retrieval
- Citation IDs and Evidence Packs
- correction and verified-false-hit layers
- evidence-grounded research planning
- automatic intake and crash/resume recovery
- JDA source recovery and long-run OCR

The full JDA OCR run has completed; P5-B2 final Citation / Search / QA regression freeze is the current closing step.
