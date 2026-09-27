# Methods and Findings

## 1. Do not start with the 5 TB archive

The project initially evaluated complete Shuge preservation at roughly multi-terabyte scale.

The practical research lesson was different:

**the catalogue, provenance model, and acquisition rules should come first.**

A small local research corpus can already answer real historical questions.

## 2. IIIF is a high-leverage interface

IIIF provided the cleanest research acquisition pattern:

- page-addressable
- bandwidth-controllable
- source-preserving
- OCR-friendly
- easy to cite back to a canvas

This proved especially useful with Gallica and Imperial Household / SIDO material.

## 3. Old digital-library links are historical objects too

Link rot became a research problem.

The strongest example is 《水经注》:

```
old JDA URL 404
→ Wayback metadata
→ shelfmark / volume / responsibility matching
→ new JDA file record
→ IIIF manifest
→ image-service continuity
```

The recovery method is reusable because it stores the evidence for the rebinding rather than only the final URL.

## 4. Negative matches matter

Source recovery must preserve rejected candidates.

Example:

```
靖海全图
≠
靖海氛記
```

A superficially similar title should not be accepted when bibliographic identity does not match.

This negative example is now useful as a regression test for future automated recovery.

## 5. Retrieval-grade OCR can be cheap

RapidOCR / PP-OCRv4-mobile on an older i7 CPU delivered usable retrieval quality for many traditional Chinese pages.

The project’s first large OCR benchmark reached:

- 97.9% success
- 90% PASS+USABLE visual gate
- roughly 3–6 seconds/page after optimization

This was sufficient to unlock full-text retrieval without requiring a GPU.

## 6. Better OCR is not always better engineering

PP-OCRv5 was tested on the same machine and repeatedly failed to initialize / complete first inference within practical limits.

The correct response was to defer it rather than repeatedly tune the same constrained hardware.

## 7. Reading order is a separate problem from character recognition

Traditional vertical books can be searchable even when a perfect reading sequence has not been reconstructed.

A global reading-order transformation was intentionally stopped after the benchmark produced too many AMBIGUOUS cases.

This kept retrieval useful without silently damaging the text.

## 8. Visual QA is fallible

Several “OCR errors” later turned out to be visual-review errors on dense small text.

Therefore the project increasingly uses:

- geometry
- OCR confidence
- semantic continuity
- scan inspection
- source structure

as multiple independent signals.

## 9. False hits should be auditable

A false OCR hit should not be silently deleted.

The project stores verified false-hit annotations and suppresses them only for the matching query+page combination.

This avoids accidental hiding of valid evidence from the same page for other queries.

## 10. Corrections should be patch-like

Corrected text is derived from:

```
OCR text
+ approved local patches
```

rather than “rewrite the whole page with an LLM”.

This makes every correction traceable.

## 11. Research systems should abstain

One of the strongest results from P4-E was not a retrieval success but a refusal behavior.

Questions outside the corpus produced:

- INSUFFICIENT_EVIDENCE
- PARTIAL_CORPUS_ONLY

instead of model-memory historical narration.

This turned corpus boundaries into explicit outputs.

## 12. Mechanical synthesis can reduce hallucination structurally

The research brief layer only allows evidence-backed records to populate “supported findings”.

In the P4-E benchmark:

- 119 claim sentences
- 119 with citations
- 0 unsupported

The point is not that the model became infallible. The point is that the output schema prevented unsupported prose from entering the findings section.

## 13. Corpus growth can discover real cross-work relations

After 《书集传》 and 《天工开物》 entered the same searchable corpus, the system found a real lexical/historical bridge around “乃粒”.

This was not hard-coded as a scholarly conclusion; it emerged from shared corpus evidence and was then inspectable by Citation ID.

## 14. Long-running agent jobs need lifecycle separation

A 2532-page OCR job exposed an infrastructure problem:

`nohup` alone did not isolate the child process from an OpenClaw exec-session cleanup.

The reliable pattern became:

- launch from exec
- `start_new_session=True`
- redirect stdout/stderr to a log
- treat the worker as an independent job

## 15. SQLite remains sufficient

Even after several thousand OCR pages, SQLite with WAL and FTS5 remained fast enough for the personal-research workload.

The project deliberately avoided premature migration to:

- Elasticsearch
- vector DB
- PostgreSQL
- Neo4j

## 16. The next useful abstraction is thematic collection

Once thousands of pages are searchable, organizing only by source institution becomes less useful.

The next layer should support bounded research collections such as:

- historical hydrology / river defense
- architecture / construction
- urban space
- technical knowledge
- medicine

The same work can belong to more than one thematic collection.
