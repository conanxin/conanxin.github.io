# Release Notes — v1.0

**Project**: Du Fu Route Interactive Page (杜甫诗路交互页面)
**Title**: 乱离途中，杜甫何以成为"杜甫"？
**URL**: https://conanxin.github.io/projects/dufu-luanli-route/
**Version**: v1.0
**Release Phase**: Phase 3D / v1.0 Closeout
**Last Updated**: 2026-05-12

---

## Summary

This is an interactive reading and cultural travel planning page built around the cover story of *Sanlian Life Week* (三联生活周刊), Issue 40, 2025 — *"During the Chaos, How Did Du Fu Become 'Du Fu'?"*

The page combines article interpretation, Du Fu's complete travel route, modern-day location mappings, poetry annotations, and practical travel itineraries. It traces how Du Fu — during and after the An Lushan Rebellion — traveled from Chang'an, Fengxian, Qiang Village, Fengxiang, Huazhou, Qinzhou, Tonggu, and eventually to Chengdu's Cottage (草堂), becoming the poet-historian he is remembered as.

The page is a pure static HTML/CSS/JS site. No external CDN, no map API, no server-side rendering.

---

## Core Features

| Feature | Description |
|---------|-------------|
| Article Interpretation | 4-tab summary: overview, structure, thesis, why Du Fu became Du Fu |
| Vertical Timeline | 755–759 CE: 20+ nodes with year, historical place, modern place, event, poems, significance |
| SVG Route Map | 20 clickable nodes; right-panel detail cards with site type labels |
| Location Database | 20 locations with: id, name, modern, theme, event, poems, key quote, article meaning, travel tip, site type |
| Route Selector | 4 choice cards to help users pick the right route for their time and interest |
| 7-Day Highlight Route | Qinzhou → Tonggu → Guangyuan → Jianmen → Chengdu |
| 12-Day Complete Route | Chang'an → Fengxian → Qiang Village → Fengxiang → Huazhou → Qinzhou → Tonggu → Chengdu |
| 4 Thematic Short Routes | Chang'an-Fengxian / An Lushan Escape / Three Officers Three Farewells / Qinzhou into Shu |
| Xi'an + Chengdu Dual-City Route | Dual-column reading route for urban travelers |
| Poem-to-Location Mapping | Click poem title → highlights corresponding map node |
| Route Copy Function | Copy full itinerary to clipboard with plain-text fallback |
| Route Metadata | Season, transport, difficulty, audience, travel note for all routes |
| Daily Card Enhancements | Theme, places, stay recommendation, transport tip, poem, field question per day |
| Site Type System | 4 types: 成熟景区 / 文学寻访点 / 历史对应点 / 考证提示点 |
| Practical Travel Tips | 6 cards: transport, season, physical, reading, site visit, verification |
| Sticky Navigation | 7-anchor sticky top nav, desktop horizontal / mobile horizontal-scroll |
| Copy Success Toast | Bottom-center notification "已复制路线", 2.5s auto-dismiss |
| Print Stylesheet | `@media print` — hides interactive elements, preserves content, white background |
| Mobile Layout | Responsive grid, SVG overflow-x, overflow-wrap, sticky nav |
| Source & Boundary Notes | 4 cards: content source, poem citations, geographic precision, travel disclaimer |
| SVG Map Legend | Location type color dots with labels |

---

## Technical Specs

- **Files**: `index.html` (~459 lines) + `style.css` (~977 lines) + `app.js` (~1037 lines)
- **Total**: ~2,473 lines of hand-written HTML/CSS/JS
- **Dependencies**: None (pure static, no CDN, no build step)
- **Preview**: `python3 -m http.server 8080` → `http://localhost:8080`
- **Published**: `https://conanxin.github.io/projects/dufu-luanli-route/`
- **Data**: 20 locations, 8 routes, 9 poem-to-location mappings, ~50 poems cited

---

## Known Limitations

1. **SVG route map is schematic, not geographically exact.** Node positions represent reading order and conceptual proximity, not GPS coordinates. Do not use for navigation.

2. **Some Tang dynasty place names have multiple modern interpretations.** Locations like 彭衙 (Pengya) and 鄜州羌村 (Fuzhou Qiang Village) are based on the article's reconstruction and current scholarly consensus, but alternative interpretations exist.

3. **Travel planning is cultural guidance only.** This page provides literary and historical context. It does not offer real-time transport schedules, ticket availability, weather conditions, or opening hours.

4. **No external map API is used.** The SVG map cannot replace a proper navigation app for actual travel planning.

5. **No live data.** Traffic, weather, pandemic restrictions, seasonal road closures, or other real-time conditions are not reflected.

6. **All content is static.** No search, no user accounts, no backend, no analytics.

---

## Recommended Future Work

| Priority | Item | Rationale |
|----------|------|-----------|
| High | Extract locations, routes, poems into JSON files | Improves maintainability, enables reuse across projects |
| High | Generate printable PDF travel handbook | Physical companion for on-the-ground travelers |
| Medium | Bilingual (Chinese/English) version | Expand audience to international readers |
| Medium | WeChat Mini Program or article export | Better social sharing and mobile experience |
| Low | Interactive map API version | Only after JSON data structure is stable |
| Low | Audio guide integration | TTS for poems at each location |

---

## Maintenance Rule

- Do not add large new features directly into `index.html`.
- Next major phase should refactor data into JSON and use a minimal static site generator or at minimum separate data files.
- Keep source project (`~/projects/dufu-luanli-route-page/`) and GitHub Pages directory synchronized.
- All future changes must pass `node --check app.js` and `grep` regression check before push.

---

## Changelog

See [`CHANGELOG.md`](CHANGELOG.md) for full version history.
