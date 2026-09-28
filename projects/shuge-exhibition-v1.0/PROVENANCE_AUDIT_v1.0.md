# PROVENANCE_AUDIT_v1.0

> Provenance audit of the SHUGE DH v1.0 Candidate build (`projects/shuge-exhibition-v1.0/`).
> Generated as part of `SHUGE_DH_V1_0_METADATA_CLEANUP_R1`.

---

## 1. Summary

| Layer | Files | Bytes | Status |
|---|---|---|---|
| A. Frozen research/data snapshots (v0.7 inherited) | 32 | 1,450,929 | sha256 byte-identical to v0.7 baseline |
| B. v1.0 presentation-layer changed (HTML / CSS) | 5 | (see below) | modified from v0.9 base |
| C. v1.0 presentation-layer newly-created | 7 | (see below) | not in v0.9 |
| D. v1.0 data-layer newly-created | 3 | (see below) | not in v0.9 |
| **TOTAL v1.0 tree** | **100** | **~2.4 MB** | commit pending |

**FROZEN_PROVENANCE_FILES = 32 / 32** ✓
**FROZEN_DATA_CHANGED = 0** ✓ (all 32 byte-identical to v0.7)

---

## 2. Layer A — Frozen Research / Data Snapshots (32 / 32)

All 32 data files in `v1.0/data/` are inherited from the v0.7 Research Writing
Environment (`projects/shuge-exhibition-v0.7/data/`). Each is byte-identical to
the v0.7 baseline — verified by full-file SHA-256 comparison. The same 32 files
are also byte-identical to v0.9, confirming no transitive drift across v0.7→v0.8→v0.9→v1.0.

These files constitute the **only** historical-evidence basis for the v1.0 article.
No file in this set was downloaded, modified, OCR-run, or otherwise re-acquired
during v1.0 development.

| # | Path | Size (B) | SHA-256 |
|---:|---|---:|---|
|  1 | `data/architecture_pages.json` |   10,126 | `e9d4960fb48a0a5bd9c6158cf8615b1540a78bf28e27646e1d28cfda72ccccf4` |
|  2 | `data/archive_bridge.json` |    4,031 | `f4b9081241f6da8b8d28771a21136a801fc1bc827c762cb4ea7a7657b9c9687b` |
|  3 | `data/bibliography.json` |    4,746 | `1829b1eee02ecd25ad93584f8ef37920b11eadf6c1c568231840ba8858c2b34c` |
|  4 | `data/case_studies.json` |   17,725 | `255cd092e945977b53d3e3621b09b4e001b22b87dc75b64d90c05a7b4f678332` |
|  5 | `data/citations.json` |   81,867 | `2d7bb01d2e0fcd87b4167def672dd12e0a15afec70e2411f49ca13d03f938456` |
|  6 | `data/collections.json` |   10,595 | `f973805d7083ecbeaf057f3908885817d33dd657db1678e1cf65a1bfc15ab119` |
|  7 | `data/evidence_cards.json` |   21,866 | `f6d3a6f804e52492d170019a41dfc7925585478a4eb88f64089c01588708d159` |
|  8 | `data/evidence_cards_v3.json` |   35,472 | `289ed1d50f1a58cad64afe37bec5bb56ca4d726421bb4008e06905ff9c84257c` |
|  9 | `data/evidence_graph.json` |  366,041 | `35662e2c4adcab771d79b4360498ff90ba1d331055154dc395bed931a2ee630a` |
| 10 | `data/evidence_paragraphs.json` |   28,898 | `f825ba0cb5720f4b21ab2bb1e10a9645c58f73173224736769f3c958cc357f37` |
| 11 | `data/field_note_input_spec.json` |    5,609 | `a2bd3405fd185aec9f40068cd3d5c3abbf2cb522b46095c1394afd8979d8c39f` |
| 12 | `data/field_notes.json` |    4,700 | `c7033b7833d19097180eec35a0976dbc80909623438f0007d95df046492a5c7e` |
| 13 | `data/fieldwork_schema.json` |    4,982 | `b0c3e18ee1a10bfdd7bd7f336f9ca393dc9f63e3f0c4b24a5b65617e5f638b12` |
| 14 | `data/hydrology_pages.json` |   10,123 | `06ddcdb5bcdc55f7f7872b52cdaaf4096c8c3ed90598251a4bed4727d1474414` |
| 15 | `data/institutions.json` |    8,189 | `ac8de28839392de20f5c498c95b90e1ea37fca27058878418db6727474419fd3` |
| 16 | `data/manifest.json` |    1,368 | `4131353f404df02c755be390a116a6a6927cee8e01dfc63c1eface16ff22bf3f` |
| 17 | `data/map_placeholder.json` |    1,283 | `57b5fc767e523e24248e51865de5012c9c657cb756ed565634d22aa8ebcedc7f` |
| 18 | `data/na_li_cross_textual.json` |      306 | `f24b9ee0456aa232c0bbe2b6f8b0493df9870430bad86319124a814df368f6f7` |
| 19 | `data/place_evidence.json` |    5,830 | `ec2508cd3c5fa08574f4094b493f18c9c0e0a33322a61b4b47d21f087b5ad436` |
| 20 | `data/place_profiles.json` |   13,784 | `717ccac64ab12f0f571f0e559f4046ed362b5fd6f43fbeeecb9fcd86a4dfbaa2` |
| 21 | `data/places.json` |   12,662 | `0af35024518ecc57ac78edde7d56416b300e56d2cf07c127000b8a1816402693` |
| 22 | `data/research_drafts.json` |   28,515 | `f9d4c56de3c066d5daa96bbf679006d7e66a69a4752e264b220310e65e7d612a` |
| 23 | `data/research_projects.json` |    8,444 | `7c131079bd3ea72bd636a13ccc50f37f3f03ad1835a449822a8889e7fd98e169` |
| 24 | `data/research_questions.json` |    3,442 | `d128f7d83a7ea675debf42b6b0367c12954449a3d8bec1a6858af66e8937ec28` |
| 25 | `data/research_workspaces.json` |    7,942 | `1cf85cdb4b84a924fd25831fea3aa4c59831ae0795068b4abf8d272e668f81f0` |
| 26 | `data/room_intros.json` |    7,826 | `5f06e8e152c2cfbb46c64e1c5260bd47e0dae6f2807e17a3303f5c2d88b89335` |
| 27 | `data/timeline.json` |    1,477 | `fe031954c32eb6499647348068d4f843b1b2d0f9fb2cc7cc648564ba58394ed8` |
| 28 | `data/timeline_layers.json` |    6,206 | `a84b55f3b5bb594919d921f4146d57c73f3142c95c3473ed8bf57a1d4f3db1c9` |
| 29 | `data/water_classic_pages.json` |   32,099 | `a370721e50f293392f6381a9330294e4634e1e8af8839e1745e6f10b21703146` |
| 30 | `data/works.json` |  690,791 | `dabf2fdfaadc9cc312a5072322c8074555b138b949cccd96077bcf8667174144` |
| 31 | `data/workspaces.json` |    8,745 | `a20f201eb1b0f187b16d6e971fe4c4d472b1ec1a81a5b2d9c462227e4eb30ca1` |
| 32 | `data/writing_invariants.json` |    5,239 | `df3f06710fce8d88cb784100935b0af2ec42a77db6930504f3e86489506bb6fe` |

**Frozen provenance size total: 1,450,929 bytes (~1.45 MB) across 32 files.**

---

## 3. Layer B — v1.0 Presentation-Layer Changed Files (5 / 5)

HTML / CSS / MD files in v1.0 whose SHA-256 differs from the v0.9 base. These were
modified to incorporate the v1.0 Candidate article, evidence appendix, methods
note, semantic claim audit, and v1.0 CSS classes. **No underlying data was modified.**

| # | Path | Modification purpose |
|---:|---|---|
| 1 | `index.html` | Added v1.0 Candidate Article entry, hero callout, navigation to `/publications/water-classic-digital-life/` |
| 2 | `css/style.css` | Appended v1.0 stylesheet classes (`.v1-status-banner`, `.article-grid`, `.article-meta`, `.evidence-callout`, `.provenance-box`, `.simulated-workflow-box`, `.page-viewer`, `.tier-badge`, `.methods-grid`, `.methods-citation-box`) |
| 3 | `portfolio/index.html` | Added v1.0 Candidate Article feature card, evidence tally updated to 10 claims |
| 4 | `publications/index.html` | Added Water Classic candidate article row, status badges, methods note link |
| 5 | `review/index.html` | Peer Review demo page; SIMULATED WORKFLOW watermark; 0 PUBLISHED in this stage |

---

## 4. Layer C — v1.0 Presentation-Layer Newly-Created Files (7 / 7)

HTML / MD files that exist only in v1.0 (no equivalent in v0.9).

| # | Path | Purpose |
|---:|---|---|
| 1 | `PUBLICATION_PLAN.md` | v1.0 publication plan · scope · hard invariants · workflow |
| 2 | `EVIDENCE_DOSSIER.md` | Claim → citation → page → source → reliability table; claim-support audit trail |
| 3 | `ARTICLE_OUTLINE.md` | 8-section outline; per-section claims, citations, limitations, research questions |
| 4 | `CLAIM_SUPPORT_AUDIT.md` | Per-claim semantic audit with narrowing actions and post-narrowing breakdown |
| 5 | `publications/water-classic-digital-life/index.html` | Main v1.0 candidate article (REVIEW) |
| 6 | `publications/water-classic-digital-life/evidence/index.html` | Evidence Appendix: claim → citation → page → source → reliability |
| 7 | `methods/citation-bound-historical-research/index.html` | Methods Note: Citation-bound Historical Research methodology |

---

## 5. Layer D — v1.0 Data-Layer Newly-Created Files (3 / 3)

JSON metadata files that exist only in v1.0. These are *bookkeeping* artifacts
for the v1.0 Candidate stage — **no historical facts, no OCR output, no new
research data** is contained in them. The historical-evidence basis remains the
32 frozen files (Layer A).

| # | Path | Purpose |
|---:|---|---|
| 1 | `data/article_water_classic_dossier.json` | Per-section outline, claim-citation map, audit fields (total_claims=10), stats block |
| 2 | `data/claim_support_audit_v1.0.json` | Semantic audit JSON: per-claim support_status (initial + post-narrowing); breakdown (4/0/0/6) |
| 3 | `data/institution_roles_v1.0.json` | Bookkeeping only — explicitly pins `inst-shuge.role_in_research = source_platform` (NOT publisher); 10 publication invariants |

---

## 6. Verification Checks (all passed)

```
FROZEN_PROVENANCE_FILES = 32 / 32   ✓ (all 32 byte-identical to v0.7 baseline)
FROZEN_DATA_CHANGED     = 0      ✓
PRESENTATION_LAYER_CARRY_OVER = 45  ✓ (45 files unchanged from v0.9 base)
PRESENTATION_LAYER_CHANGED    = 5   ✓ (5 files modified for v1.0 Candidate)
PRESENTATION_LAYER_NEW        = 7   ✓ (7 files new in v1.0)
DATA_LAYER_NEW               = 3   ✓ (3 files new in v1.0 — bookkeeping only)
TOTAL_V1_0_FILES             = 100  ✓
PUBLISHED_COUNT             = 0    ✓ (ARTICLE_STATUS=REVIEW)
EXTERNAL_PEER_REVIEW         = false ✓ (SIMULATED WORKFLOW watermark)
```

---

## 7. Hard Invariants (re-confirmed)

- ✓ **inv-audit-1** — no factual claim without explicit limitation marker (10/10)
- ✓ **inv-audit-2** — NOT_SUPPORTED factual claims remaining in article = 0
- ✓ **inv-audit-3** — citation resolution evaluated against actual corpus, not assumed
- ✓ **inv-audit-4** — `inst-shuge.role_in_research = source_platform` (NOT publisher)
- ✓ **inv-pub-v1.0-1 → inv-pub-v1.0-10** — all 10 v0.x→v1.0 invariants satisfied
- ✓ **Citation ID unchanged** — all 6 verbatim from v0.7
- ✓ **Provenance unchanged** — 32/32 byte-identical (Layer A)
- ✓ **No new feature, no new resource, no OCR, no new article**
- ✓ **No auto-PUBLISHED · No auto-PEER_REVIEWED · No auto-ACCEPTED**

---

## 8. Reconciliation Note (Cleanup R1)

As part of `SHUGE_DH_V1_0_METADATA_CLEANUP_R1` (message_id=39889, 2026-09-28 11:31:21 CST),
all v1.0 sites that previously read `total_claims=9` have been reconciled to `total_claims=10`
in accordance with the `CLAIM_SUPPORT_AUDIT` final breakdown:

```
FINAL_CLAIM_BREAKDOWN:
  SUPPORTED              = 4  (cl-1.1, cl-3.1, cl-4.1 obs, cl-4.2 obs)
  PARTIALLY_SUPPORTED    = 0
  NOT_SUPPORTED          = 0
  METADATA_ONLY          = 6  (cl-2.1, cl-3.2, cl-5.1, cl-6.1, cl-7.1, cl-8.1)
  TOTAL                  = 10
```

**Files updated during Cleanup R1:**

- `data/article_water_classic_dossier.json` — `audit.total_claims` 9→10; `stats.total_claims_with_citation_or_limitation` 9→10; `stats.total_limitations_marked` 9→10
- `ARTICLE_OUTLINE.md` — "6 unique citations / 9 claims = 0.67" → "6 unique citations / 10 claims = 0.60"
- `portfolio/index.html` — "所有 9 个 claim" → "所有 10 个 claim"; "9 evidence callouts" → "10 evidence callouts"
- `EVIDENCE_DOSSIER.md` — "All 9 claims pass v1.0 §4" → "All 10 claims pass v1.0 §4"

**No article content (main article HTML, Evidence Appendix HTML, Methods Note HTML, claim-support audit JSON `summary_counts.support_breakdown_post_narrowing`) was modified during Cleanup R1** — those already had `total_claims=10` and the breakdown `{SUPPORTED:4, PARTIALLY_SUPPORTED:0, NOT_SUPPORTED:0, METADATA_ONLY:6}`.

---

## 9. Provenance Boundary Statement

**The v1.0 Candidate article is built entirely on the 32 frozen research/data
snapshots (Layer A) plus the 7 newly-created presentation files (Layer C) and
3 bookkeeping metadata files (Layer D). No historical fact, no new citation,
no new page, no new OCR output was introduced during v1.0 development.**

v1.0 is the first stage where the platform produces **a publicly readable
research article** (REVIEW status) — but the historical-evidence basis remains
100% inherited from v0.7-v0.9. The v1.0 stage adds only: (i) presentation-layer
wiring (5 modified + 7 new files), (ii) bookkeeping metadata (3 new JSONs),
(iii) claim-narrowing textual edits on existing draft paragraphs (no new facts).

---

*End of PROVENANCE_AUDIT_v1.0.md*
