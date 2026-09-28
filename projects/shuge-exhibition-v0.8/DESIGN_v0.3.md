# SHUGE DH Exhibition v0.3 — Design Specification

**Status:** v0.2 COMPLETE → v0.3 Digital Exhibition Refinement
**Goal:** upgrade v0.2 from "technical demonstration" to "public digital humanities exhibition"
**Constraints:** static site · read-only JSON · no DB writes · no full OCR · no Citation ID changes

---

## 1. Background

v0.2 (commit `0a7edc0`) delivered 5 exhibition rooms + 12 evidence cards + citation viewer + page image viewer framework + map placeholder. v0.2's voice was *technical*: each room is a status report, each evidence card is a research_runs dump. v0.3 shifts the voice to *narrative*: case studies read like exhibition panels, evidence cards now carry source provenance, rooms have proper curatorial structure.

The 3 axes of v0.3:

1. **Curatorial framing.** Each room gains 5 sections (Introduction · Objects · Evidence · Take-away · Further Reading) — the structure of a museum wall-text.
2. **Narrative case studies.** 5 complete case studies with Question / Source / Evidence / Citation / Interpretation boundary / Further research — modeled on academic exhibition catalogues.
3. **Provenance completeness.** Evidence cards gain 4 new fields: source_context (work/author/page/OCR), citation_path (step trace), collection (slug), related_workspace (slug).

---

## 2. Visual System (inherited from v0.2)

### 2.1 Palette (no new colors)

| token | hex | use |
|---|---|---|
| `--paper-white` | `#f7f3eb` | main background |
| `--card-cream` | `#efe9da` | card background |
| `--evidence-tint` | `#e8e0cd` | evidence ledger background |
| `--rule-gray` | `#c8bfa9` | borders, table rules |
| `--archival-brown` | `#6b5944` | secondary text, dim labels |
| `--ink-charcoal` | `#1a1a1a` | primary text |
| `--seal-red` | `#8b3a2e` | accents: hero, take-away left rule, evidence card left border |
| status-green `#2c4a3e` · status-warning `#6b4f1f` · status-evidence `#4a2c3e` · status-searching `#6b5944` |

### 2.2 Typography (no new fonts)

- Headings: **Noto Serif CJK SC** (中文) + **Source Serif 4** (English)
- Body: **Source Sans 3**
- Code / citation_id: **IBM Plex Mono**
- Google Fonts CDN (already a dependency of conanxin.github.io)

### 2.3 Forbidden (continues from v0.1, v0.2)

- ❌ 渐变 / gradients
- ❌ 圆角 / border-radius (zero)
- ❌ box-shadow (zero)
- ❌ emoji (zero)
- ❌ neon colors
- ❌ background images / photography

### 2.4 New visual components (v0.3 only)

| Component | Element | Purpose |
|---|---|---|
| `.case-study-hero` | `<header>` | cover with title_zh / title_en / subtitle / collection badge |
| `.case-section` | `<section>` | one of the 6 sections, has `.section-num` ordinal + `.section-label` |
| `.objects-grid` | `<div class="grid">` | 2-col grid of `.object-card` |
| `.object-card` | `<article>` | name + description + kind tag |
| `.takeaway` | `<div class="takeaway">` | red left rule + `Take-away` label + body (inherited from v0.2) |
| `.further-reading` | `<ul class="further-reading">` | numbered list with `·` separator |
| `.evidence-card-v3` | `<div class="evidence-card">` | adds 4 v0.3 fields: `.source-context-block` / `.citation-path-block` / `.collection-line` / `.related-workspace-line` |

---

## 3. Component Anatomy

### 3.1 Case Study page (`cases/caseN/index.html`)

```
<header class="case-study-hero">
  <h1>{title_zh}</h1>
  <p class="case-study-title-en">{title_en}</p>
  <p class="case-study-subtitle">{subtitle}</p>
  <div class="case-study-badges">
    <span class="badge">{related room, if any}</span>
    <span class="badge badge-collection-{hydrology|architecture}">{collection_slug}</span>
  </div>
</header>

<section class="case-section">
  <div class="section-num">1</div>
  <h2 class="section-label">Question</h2>
  <p class="question-text">{question}</p>
</section>

<section class="case-section">
  <div class="section-num">2</div>
  <h2 class="section-label">Source</h2>
  ... 4–6 source fields ...
</section>

<section class="case-section">
  <div class="section-num">3</div>
  <h2 class="section-label">Evidence</h2>
  ... summary + samples ...
</section>

<section class="case-section">
  <div class="section-num">4</div>
  <h2 class="section-label">Citation</h2>
  ... sample citation_ids + format spec ...
</section>

<section class="case-section">
  <div class="section-num">5</div>
  <h2 class="section-label">Interpretation Boundary</h2>
  ... limitations + regression gates ...
</section>

<section class="case-section">
  <div class="section-num">6</div>
  <h2 class="section-label">Further Research</h2>
  <ul>... 4 future research directions ...</ul>
</section>

<section class="case-section">
  <div class="takeaway">
    <div class="takeaway-label">Take-away</div>
    ... 2–3 sentence distillation ...
  </div>
</section>
```

### 3.2 Upgraded Room page (5 sections)

```
<section class="room-introduction">
  <h2>Introduction</h2>
  <p>{2-3 sentence curatorial introduction}</p>
</section>

<section class="room-objects">
  <h2>Objects</h2>
  <div class="objects-grid">
    {5 .object-card items}
  </div>
</section>

<section class="room-evidence">
  <h2>Evidence</h2>
  ... existing evidence (cards/ledger) ...
</section>

<section class="room-takeaway">
  <div class="takeaway">
    <div class="takeaway-label">Take-away</div>
    ...
  </div>
</section>

<section class="room-further-reading">
  <h2>Further Reading</h2>
  <ul>... 3+ references ...</ul>
</section>
```

### 3.3 Upgraded Evidence Card (4 new fields)

```
<div class="evidence-card" data-run-id="{run_id}">
  <div class="evidence-card-header">
    <span class="evidence-card-question">{question}</span>
    <span class="evidence-card-meta">
      <span class="run-id">#{run_id}</span>
      <span class="badge badge-collection-{slug}">{collection_slug}</span>
    </span>
  </div>

  <!-- NEW in v0.3: source context -->
  <div class="source-context-block">
    <div class="source-context-label">Source</div>
    <div class="source-context-fields">
      <span class="mono">{work_title}</span>
      <span>{author} · {dynasty}</span>
      <span class="mono">page_label={page_label}</span>
      <span class="mono">OCR={engine}/{model}</span>
    </div>
  </div>

  <!-- existing claim block -->
  <div class="evidence-claim-block">
    <div class="evidence-claim-meta">{claim_type} · {claim_id} · support={n}</div>
    <div class="evidence-claim-text">{claim_text}</div>
    <div class="claim-cite">{citation_ids preview}</div>
  </div>

  <!-- NEW in v0.3: citation path -->
  <details class="citation-path-block">
    <summary>▸ Citation path ({n} steps)</summary>
    <ol class="citation-path-list">
      <li>step {n}. {action} — {input}</li>
      ...
    </ol>
  </details>

  <!-- existing ledger -->
  <div class="evidence-ledger-toggle">▸ show evidence ledger</div>
  <div class="evidence-ledger">...</div>

  <!-- NEW in v0.3: collection + workspace meta line -->
  <div class="evidence-card-footer-meta">
    collection: <span class="mono">{collection_slug}</span>
    workspace: <span class="mono">{workspace_slug or '—'}</span>
  </div>

  <!-- existing citation viewer -->
  <div class="citation-viewer">...</div>
</div>
```

---

## 4. Page Inventory (v0.3)

| Path | Source | Type | Size target |
|---|---|---|---|
| `index.html` | top-level | overview + 5 rooms + 5 cases | 14 KB |
| `DESIGN_v0.3.md` | this file | design spec | — |
| `IA_v0.3.md` | companion | information architecture | — |
| `cases/case1/index.html` | 水经注数字生命史 | narrative case study | 8 KB |
| `cases/case2/index.html` | 古代水利与河防 | narrative case study | 8 KB |
| `cases/case3/index.html` | 建筑营造知识 | narrative case study | 8 KB |
| `cases/case4/index.html` | 乃粒跨文本互证 | narrative case study | 9 KB |
| `cases/case5/index.html` | AI-assisted historical research | narrative case study | 9 KB |
| `rooms/room1/index.html` | upgraded | 5-section | 8 KB |
| `rooms/room2/index.html` | upgraded | 5-section | 8 KB |
| `rooms/room3/index.html` | upgraded | 5-section | 9 KB |
| `rooms/room4/index.html` | upgraded | 5-section | 9 KB |
| `rooms/room5/index.html` | upgraded | 5-section | 10 KB |
| `css/style.css` | inherited + new components | stylesheet | 16 KB |
| `js/main.js` | inherited + new interactions | scripts | 5 KB |
| `data/manifest.json` | inherited | manifest | — |
| `data/works.json` | inherited | works | — |
| `data/collections.json` | inherited | collections | — |
| `data/citations.json` | inherited | citations | — |
| `data/institutions.json` | inherited | institutions | — |
| `data/workspaces.json` | inherited | workspaces | — |
| `data/water_classic_pages.json` | inherited | water classic | — |
| `data/hydrology_pages.json` | inherited | hydrology sample | — |
| `data/architecture_pages.json` | inherited | architecture sample | — |
| `data/evidence_cards.json` | inherited | v0.2 evidence cards | — |
| `data/timeline.json` | inherited | timeline | — |
| `data/map_placeholder.json` | inherited | map | — |
| `data/evidence_cards_v3.json` | NEW | upgraded cards (4 new fields) | 35 KB |
| `data/case_studies.json` | NEW | 5 case studies (6 sections) | 18 KB |
| `data/na_li_cross_textual.json` | NEW | cross-textual terms | <1 KB |
| `data/room_intros.json` | NEW | per-room intro/objects/further reading | 8 KB |

---

## 5. Hard Invariants (inherited from P5-D, v0.1, v0.2)

- **0 new resources downloaded** — Google Fonts only, no other CDNs
- **0 DB writes** — all data via read-only SELECT
- **0 embeddings / vector DB / Neo4j / Web UI** — pure static site
- **0 full OCR exposure** — every excerpt capped at ~120 chars
- **0 Citation ID changes** — citation IDs immutable since P5-B2
- **0 IIIF image URLs exposed** — Page Image Viewer Framework only
- **0 database schema exposure** — no SQL/table names visible to viewer
- **0 new collections** — historical-hydrology + architecture-construction only

---

## 6. Done Criteria

A v0.3 page is complete when:
1. It loads as 200 OK from local http server
2. Title in `<title>` matches the case/room title
3. All 6 sections present for case studies (or 5 for rooms)
4. No console errors when navigating
5. JSON files all valid (jq-able)
6. Cross-page navigation links correct (relative paths)
7. Committed and pushed to `main` branch on conanxin.github.io

---

**Stop after completion. Do not enter next phase.**