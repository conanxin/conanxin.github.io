# Changelog

All notable changes to the Du Fu Route Interactive Page are documented here.

## v1.1 — Public Route Package Closeout（2026-05-12）

### Phase 7B — Project Closeout
- Fixed stale text: "19 个候选点位" → "21 个候选点位" in index.html.
- Added RELEASE_NOTES_v1.1.md.
- Updated CHANGELOG.md with full v1.1 changelog.
- Updated README.md current status section.
- No data model changes.

### Phase 7A — Final Public QA（2026-05-12）
- Verified all 9 URL endpoints return HTTP/2 200.
- Confirmed projects index entry, main page, real map, HTML handbook and PDF handbook are all accessible.
- All 3 validation scripts pass (validate_dufu_data.py, audit_dufu_crossrefs.py, validate_map_data.py).
- Regression check: 0 matches for known issue terms.
- Found 1 minor cosmetic issue (19 vs 21 point count text, fixed in Phase 7B).

### Phase 6F — Real Map v1 Closeout（2026-05-12）
- Real Map v1 frozen and archived.
- map.html provides standalone Leaflet map prototype.
- Leaflet assets vendored locally under vendor/leaflet/.
- Real map reads data/map_points.json and data/route_segments.geojson.
- Current map data: 21 map points, 21 schematic route segments.
- Main page links to real map, HTML handbook and PDF handbook.
- Marker rendering uses CSS-based L.divIcon.
- Right-side map detail panel supports loaded/stage-filter/marker-detail states.
- Coordinates are modern reference points; route segments are schematic reading lines.
- locations.json and poems.json were not split during map-only point split.
- Future full data-model split deferred as high-risk.

### Phase 6E-2 — Map-Only Point Split（2026-05-12）
- New map-mingyuexia (明月峡, scenic, ~32.5286, ~105.9197).
- New map-nanguo-temple (南郭寺, approximate, ~34.4600, ~105.7400).
- Updated map-guangyuan-mingyue → 广元市区 (accuracy: district).
- Updated map-nanguosi-dongke → 东柯谷 (accuracy: approximate, lat updated).
- map_points: 19 → 21.
- route_segments: 19 → 21 (5 updated + 2 new).
- Fixed seg-jianmenguan-chengdu old Chengdu coordinate bug ([104.0500, 30.6700] → [104.0433, 30.6694]).
- No changes to locations.json, poems.json or page runtime.

### Phase 6E-1 — Minimal Coordinate Cleanup（2026-05-12）
- Chengdu Cottage: district → scenic, calibrated to Du Fu Thatched Cottage Museum (lat 30.6694, lng 104.0433).
- Baishui/Pengya: district → approximate.
- Shihao: approximate unchanged; strengthened note about scholarly debate.
- Tonggu/Chengxian: district unchanged; strengthened note about county seat needing verification.
- No route_segments.geojson changes.

### Phase 6D — Map UX Polish（2026-05-12）
- Fixed right-side map detail panel loading state.
- Added map introduction banner with 4-color accuracy legend.
- Stage filter chips now show per-stage point counts.
- Stage summary display for filtered-but-no-marker-selected state.
- All 21 map points validated and confirmed.

### Phase 6C-R — Leaflet Marker Icon Fix（2026-05-12）
- Replaced L.Icon.Default with CSS-based L.divIcon.
- Marker no longer depends on default marker image files.
- Fixed broken tile images in production.

### Phase 6B — Leaflet Map Prototype（2026-05-12）
- Added standalone map.html page with Leaflet 1.9.4.
- Leaflet assets vendored locally under vendor/leaflet/.
- Main page not modified.
- Data-driven: reads map_points.json and route_segments.geojson.
- 21 WGS84 points, 21 schematic route segments.
- Stage filter tabs, clickable markers with location detail popup.

### Phase 6A — Map Data Preparation（2026-05-12）
- Added data/map_points.json (21 points).
- Added data/route_segments.geojson (21 schematic segments).
- Added scripts/validate_map_data.py.

### Phase 5C — Projects Index Fix（2026-05-12）
- Fixed projects index category.
- Added static and noscript fallback cards.

### Phase 5B — Handbook Links（2026-05-12）
- Added HTML/PDF handbook links to main page.
- Added handbook entry in top navigation.

### Phase 5A — Travel Handbook Export（2026-05-12）
- Generated Markdown, HTML and PDF handbooks from data/*.json.
- Added scripts/build_handbook.py.
- PDF generated with WeasyPrint 68.1.

### Phase 3D — Experience Polish（2026-05-12）
- Added sticky navigation bar with 7 anchor links.
- Added copy success toast notification.
- Added @media print stylesheet for PDF export.
- Hardened mobile layout: SVG overflow-x, map-sidebar position fix, overflow-wrap.
- Added box-sizing: border-box global reset.

### Phase 3C — Travel Planning Enhancement（2026-05-12）
- Added route selector with 4 choice cards.
- Added route metadata: season, transport, difficulty, audience, travel note.
- Enhanced daily itinerary cards with theme, places, stay, transport, poem, and question fields.
- Added site type system for all 20 locations (成熟景区 / 文学寻访点 / 历史对应点 / 考证提示点).
- Added dual-city reading route (西安 + 成都).
- Added practical travel tips section (6 cards).
- Added SVG map legend for location types.
- All enhanced fields reflected in route copy text.

### Phase 3B-R2 — Final Copy Fixes（2026-05-12）
- Upgraded "历史厚度" → "历史厚度与伦理重量".
- Upgraded "幼子饿死、颠沛流离" → "幼子饥卒、家人饥寒与亲人离散".
- Updated footer: "交互原型 · 持续修订中".
- No app.js or CSS changes.

### Phase 3B-R — Live Regression Fixes（2026-05-12）
- Fixed root cause: Phase 3B missed two instances of "人民性".
- Fixed incomplete source-notes section structure.
- Corrected Pengya section: added "入门闻号啕，幼子饥已卒".
- Corrected "人民性" → "平民视角".
- Removed "幼女送人" (not factually accurate).
- Restructured source and boundary notes into 4 clear cards.
- Updated footer to "交互原型 · 持续修订中".

### Phase 3B — Accuracy and Source Notes（2026-05-12）
- Corrected Pengya factual wording: removed inaccurate "幼女饿死" claim.
- Softened pre-An Lushan Rebellion evaluation of Du Fu.
- Added source and boundary notes (4 cards): content source, poem citations, geographic precision, travel notes.
- Added map schematic disclaimer.
- Added travel route caveats.
- Added CSS: .section-tip, .notes-grid, .note-card.

### Phase 2 — GitHub Pages Publish（2026-05-12）
- Published to /projects/dufu-luanli-route/ on GitHub Pages.
- Added project entry to projects/data.json.

### Phase 1B — QA（2026-05-12）
- Verified all 10 page sections exist.
- Confirmed node --check app.js passes.
- Verified local HTTP preview works.
- Fixed route copy fallback (textarea).

### Phase 1A — Prototype（2026-05-11）
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

## v1.0 — Initial Release（2026-05-11）

Prototype-only internal release. No further details tracked in this log.

## Current Status

**Stable public version: v1.1**
Main page: https://conanxin.github.io/projects/dufu-luanli-route/
Real map: https://conanxin.github.io/projects/dufu-luanli-route/map.html
HTML handbook: https://conanxin.github.io/projects/dufu-luanli-route/exports/dufu_route_handbook.html
PDF handbook: https://conanxin.github.io/projects/dufu-luanli-route/exports/dufu_route_handbook.pdf

Current map data: 21 map points, 21 schematic route segments.
All coordinates are modern reference points.
All map points remain needsReview: true.

The project is now a public route package rather than only an interactive essay.
Future work should prefer data updates, validation and handbook regeneration over adding large features.
