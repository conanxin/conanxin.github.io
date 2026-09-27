# Architecture

## Layer model

```
L0  Source catalogue
L1  Work / edition / institution normalization
L2  Digital-object resolution
L3  Acquisition + CAS
L4  Page objects
L5  OCR / text layers
L6  FTS / deterministic retrieval
L7  Citation / evidence
L8  Research planning / evidence-led synthesis
```

## Core entities

### Work

Conceptual work-level record.

Typical fields:

- id
- title
- alternate title
- author
- dynasty/date
- resource type
- description
- Shuge URL

### Edition

Version / edition-level identity.

This prevents different scans or editions from being collapsed into “the same book”.

### Institution

Normalized holding institution.

### Source

A catalogue or landing-page relationship between the local work/edition and an institution.

### Digital object

Machine-usable upstream object:

- landing page
- IIIF manifest
- API object
- direct PDF
- image service
- viewer

### Page object

The central research unit.

A page can contain:

- work_id
- edition_id
- digital_object_id
- page index
- page label
- IIIF canvas
- image service
- local CAS path
- SHA-256
- dimensions
- OCR status

### OCR layers

The text model intentionally separates:

```
raw OCR
→ normalized OCR
→ optional reading text
→ corrected text
```

Raw OCR is immutable.

### Citation ID

Stable page-level identifier:

```
SHUGE:<work_id>:<page_object_id>
```

It is designed to be independent of local file names.

## Acquisition architecture

### Early failure

P3-B initially allowed multiple acquisition workers to write to SQLite.

This produced:

- database locks
- downloaded-but-unregistered files
- partial DB state

### Current model

```
download worker
  ↓
spool files
  ↓
single importer
  ↓
SQLite WAL
```

Workers do not write DB rows directly.

The importer owns DB mutation.

### Long-running process rule

OpenClaw exec sessions are treated as launchers, not as job supervisors.

Long tasks use a separate process session:

```python
subprocess.Popen(
    command,
    stdin=DEVNULL,
    stdout=log,
    stderr=STDOUT,
    start_new_session=True,
)
```

This was introduced after a resumed 2532-page OCR run was killed when its parent exec session ended.

## Content-addressed storage

Downloaded objects are stored by SHA-256 rather than descriptive filename.

Benefits:

- exact deduplication
- immutable local identity
- stable provenance
- safe crash recovery

A filesystem object is not automatically considered “registered research data”; DB provenance must also exist.

## Acquisition profiles

### metadata_only

Store manifests / metadata only.

### research

Default for OCR and ordinary study.

Typical IIIF target width: roughly 1600–2500 px.

### archive_original

Highest available source resolution.

Not used by default because it can increase storage by an order of magnitude.

## Source adapters

Institution-specific normalizers resolve old or human-facing URLs into machine-usable objects.

Examples:

### JDA / Cabinet Library

```
legacy URL
→ evidence recovery
→ /file/{id}
→ /api/iiif/{item}/manifest.json
```

### Gallica

ARK-based IIIF manifest construction.

### Kyoto

Viewer metadata can map to stable page-image URLs.

### NLC

Different entry points can yield different local forms:

- per-page JPEG acquisition
- volume PDF acquisition

## JDA recovery discipline

A new object is not automatically attached based on title.

Recovery evidence can include:

- shelfmark
- old identifier
- edition
- responsibility statement
- volume count
- collection metadata
- explicit migration linkage
- image/file identifier continuity

Status model:

- RECOVERED_HIGH
- RECOVERED_MEDIUM
- AMBIGUOUS
- NOT_FOUND
- LINK_DEAD_ONLY

Only high-confidence recovery should automatically enter acquisition.

## OCR architecture

Selected baseline engine:

- RapidOCR 1.4.4
- PP-OCRv4-mobile
- CPU-only

Workers create derived files; one importer writes DB state.

Per successful page:

```
raw.txt
normalized.txt
result.json
```

Result JSON retains bounding boxes / confidence when available.

## Search architecture

SQLite remains sufficient at the current scale.

### FTS

- FTS5
- trigram tokenizer
- short-query fallback through LIKE / instr

### Query modes

- exact
- ANY
- ALL
- NEAR
- variant-expanded

### Variant search

Traditional/simplified and curated character variants are expanded at query time.

Stored OCR is not rewritten.

## Evidence architecture

Every search result should be able to resolve:

```
query hit
→ page OCR
→ page object
→ work
→ institution
→ local scan
→ source URL
```

Verified false hits are preserved as audit data and suppressed by query+page combination rather than deleting the page globally.

## Research assistant

The assistant operates over the deterministic retrieval layer.

It can:

- decompose a question
- propose query steps
- run existing search modes
- aggregate evidence
- identify gaps
- build a brief

It cannot introduce unsupported historical facts into “supported findings”.

The strongest implementation pattern so far has been:

```
LLM / planner
→ structured search plan
→ deterministic retrieval
→ evidence ledger
→ mechanical citation-bound synthesis
```

## Reliability metadata

Text reliability is distinct from historical truth.

States can include:

- HIGH
- MEDIUM
- LOW
- UNKNOWN
- REVIEW_REQUIRED

These express transcription / extraction reliability only.

## Storage model

The project does not assume that every available image should be permanently downloaded.

For stable IIIF institutions, useful local holdings can be:

- manifest
- selected research-resolution pages
- OCR
- citations
- corrections
- evidence packs

This makes the research corpus much smaller than a complete archive mirror.
