# Changelog

All notable changes to the Du Fu Route Interactive Page are documented here.

## v1.0 — Stable Public Release

### Phase 3D — Experience Polish (2026-05-12)
- Added sticky navigation bar with 7 anchor links.
- Added copy success toast notification.
- Added `@media print` stylesheet for PDF export.
- Hardened mobile layout: SVG overflow-x, map-sidebar position fix, overflow-wrap.
- Added `box-sizing: border-box` global reset.

### Phase 3C — Travel Planning Enhancement (2026-05-12)
- Added route selector with 4 choice cards.
- Added route metadata: season, transport, difficulty, audience, travel note.
- Enhanced daily itinerary cards with theme, places, stay, transport, poem, and question fields.
- Added site type system for all 20 locations (成熟景区 / 文学寻访点 / 历史对应点 / 考证提示点).
- Added dual-city reading route (西安 + 成都).
- Added practical travel tips section (6 cards).
- Added SVG map legend for location types.
- All enhanced fields reflected in route copy text.

### Phase 3B-R2 — Final Copy Fixes (2026-05-12)
- Upgraded "历史厚度" → "历史厚度与伦理重量".
- Upgraded "幼子饿死、颠沛流离" → "幼子饥卒、家人饥寒与亲人离散".
- Updated footer: "交互原型 · 持续修订中".
- No app.js or CSS changes.

### Phase 3B-R — Live Regression Fixes (2026-05-12)
- Fixed root cause: Phase 3B missed two instances of "人民性".
- Fixed incomplete source-notes section structure.
- Corrected Pengya section: added "入门闻号啕，幼子饥已卒".
- Corrected "人民性" → "平民视角".
- Removed "幼女送人" (not factually accurate).
- Restructured source and boundary notes into 4 clear cards.
- Updated footer to "交互原型 · 持续修订中".

### Phase 3B — Accuracy and Source Notes (2026-05-12)
- Corrected Pengya factual wording: removed inaccurate "幼女饿死" claim.
- Softened pre-An Lushan Rebellion evaluation of Du Fu.
- Added source and boundary notes (4 cards): content source, poem citations, geographic precision, travel notes.
- Added map schematic disclaimer.
- Added travel route caveats.
- Added CSS: `.section-tip`, `.notes-grid`, `.note-card`.

### Phase 2 — GitHub Pages Publish (2026-05-12)
- Published to `/projects/dufu-luanli-route/` on GitHub Pages.
- Added project entry to `projects/data.json`.

### Phase 1B — QA (2026-05-12)
- Verified all 10 page sections exist.
- Confirmed `node --check app.js` passes.
- Verified local HTTP preview works.
- Fixed route copy fallback (textarea).

### Phase 1A — Prototype (2026-05-11)
- Created static HTML/CSS/JS interactive page from scratch.
- Article summary with 4 tabs (overview / structure / thesis / why Du Fu).
- Vertical timeline: 755–759 with events, poems, significance.
- SVG route map: 20 clickable nodes with detail cards.
- Location database: 20 locations with full fields.
- Route planner: 7-day, 12-day, 4 thematic short routes.
- Poem-to-location mapping.
- Route copy function.
- Source and boundary notes section.
- Mobile-first layout, no external CDN.
- Color palette: cream, ink, earth, vermilion.

## Current Status

**v1.0 — Stable public version.** No further large inline features planned. Next phase should extract data into JSON.
