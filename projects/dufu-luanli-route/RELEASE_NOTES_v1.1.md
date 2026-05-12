# Release Notes v1.1

**Version:** 1.1
**Date:** 2026-05-12
**Status:** Stable — Public Release

---

## Title

乱离途中，杜甫何以成为"杜甫"？——杜甫诗路与文旅路线项目

## Live URLs

| Resource | URL |
|----------|-----|
| **Main page** | https://conanxin.github.io/projects/dufu-luanli-route/ |
| **Real map** | https://conanxin.github.io/projects/dufu-luanli-route/map.html |
| **HTML handbook** | https://conanxin.github.io/projects/dufu-luanli-route/exports/dufu_route_handbook.html |
| **PDF handbook** | https://conanxin.github.io/projects/dufu-luanli-route/exports/dufu_route_handbook.pdf |
| **Projects index** | https://conanxin.github.io/projects/ |

---

## v1.1 Summary

v1.1 turns the project from a single interactive essay into a complete public-facing cultural route package:

- Interactive essay page with full article interpretation
- Data-driven route and poem system (21 map points, 32 poems)
- SVG literary route diagram
- Standalone real Leaflet map with 21 modern reference points and 21 schematic route segments
- HTML/PDF travel handbook
- Projects index entry
- Validation and maintenance workflow

---

## Final Feature Set

### Core Page
- Article interpretation with tabbed sections
- Du Fu route vertical timeline (9 timeline nodes)
- SVG literary route diagram
- Stage-based poem display
- 7-day curated route
- 12-day complete route
- 4 thematic short routes
- Xi'an + Chengdu dual-city route
- Source and boundary notes

### Real Leaflet Map
- 21 WGS84 map points with modern reference coordinates
- 21 schematic route segments
- Stage filter chips with per-stage counts
- CSS-based L.divIcon markers (color-coded by accuracy)
- Location detail panel with poems, siteType and notes
- Map introduction banner with 4-color accuracy legend
- Stage summary display for filtered-but-unselected states

### Handbook
- HTML handbook: 11 chapters, generated from data/*.json
- PDF handbook: WeasyPrint-generated, ~320KB
- Chapters: overview, 7-day route, 12-day route, thematic routes, poem-by-location, poem-by-stage, travel tips, source & boundary notes

### Data & Validation
- data/map_points.json — 21 map points (city/district/scenic/approximate)
- data/route_segments.geojson — 21 schematic route segments
- data/locations.json — 21 locations
- data/poems.json — 32 poems
- data/routes.json — 4 routes + 1 dual-city
- data/timeline.json — 9 timeline nodes
- scripts/validate_dufu_data.py — PASS
- scripts/audit_dufu_crossrefs.py — PASS
- scripts/validate_map_data.py — PASS
- scripts/build_handbook.py — generates HTML and PDF handbooks

---

## Known Limitations

- **Map coordinates** are modern reference points, not precise historical route coordinates.
- **Route segments** are schematic reading lines, not Tang dynasty road traces. They are illustrative and should not be interpreted as actual roads or paths Du Fu walked.
- **All 21 map points** remain `needsReview: true` — none have been independently verified against primary sources.
- **Newly split map points** (明月峡, 南郭寺) temporarily reuse existing locationId, creating minor semantic looseness pending a future data-model refinement.
- **Leaflet map** requires network access (CartoDB tiles) and cannot be opened directly via `file://`.
- **Travel advice** is cultural and literary guidance; it does not include live transportation schedules, ticket prices, lodging availability or real-time road conditions.

---

## Maintenance Notes

- **Prefer editing data/*.json** rather than app.js or page HTML when possible.
- **Run validation scripts before publishing any data change:**
  ```
  python3 scripts/validate_dufu_data.py
  python3 scripts/audit_dufu_crossrefs.py
  python3 scripts/validate_map_data.py
  ```
- **Rebuild handbook after data changes:**
  ```
  python3 scripts/build_handbook.py
  ```
- **Do not represent schematic route segments as exact historical roads** — this is a deliberate design choice documented in the source.
- **The real map** reads data/map_points.json and data/route_segments.geojson; changes to those files are reflected immediately on the next page load.
- **Phase 6E-3** (full data-model split) is documented as high-risk and deferred indefinitely.

---

## Recommended Future Work

These are optional enhancements that have been considered but are not scheduled:

1. **Content expansion** — Additional locations, poems or historical context after literature review.
2. **Map coordinate field review** — Deeper investigation of individual point coordinates against primary Tang dynasty geographical sources.
3. **Bilingual version** — Chinese/English parallel version for international readers.
4. **PWA / offline support** — Service worker to cache handbook and map tiles for offline use in areas with poor connectivity.
5. **PDF style polish** — Improved typography, margin notes and map reproductions in the PDF edition.
6. **Full data-model split** — Separate locationId for 南郭寺 and 明月峡; this requires Poems.json and Routes.json updates and is considered high-risk.

---

## Version History

| Version | Date | Phase | Summary |
|---------|------|-------|---------|
| v1.0 | 2026-05-11 | Phase 5A | Initial release: interactive essay + handbook |
| v1.1 | 2026-05-12 | Phase 7B | Added real Leaflet map (21 points), HTML/PDF handbook, project closeout |
