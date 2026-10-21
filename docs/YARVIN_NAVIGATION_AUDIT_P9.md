# P9 — Yarvin longform information architecture

> Date: 2026-10-21
> Base: main commit `628205aea4cf21c9ac9086a61ee7366044b3004c`
> Design authority: `docs/SITE_DESIGN.md` v1.9.1 and `assets/site/design.css`
> Scope: navigation and reading orientation, **not** content or editorial approval.

## Finding

The published page has nine translated chapter headings and twelve subsequent auxiliary modules. The desktop sidebar displayed all nine chapter links but only nine auxiliary links, omitting the three conceptual panels:

- `#cathedral-section` — Cathedral model
- `#neocameralism-section` — Neocameralism comparison
- `#patchwork-section` — Patchwork diagram

The mobile TOC drawer copies `#tocList.innerHTML`, so it inherited the same omission.

After the nine-chapter translation, the editorial bridge exposed eight ungrouped links, missing four existing auxiliary destinations. The long-form TOC scroll spy only marked a desktop link active, without updating the mobile drawer or providing an explicit location label.

## Information architecture

| Group | Number | Meaning |
|---|---:|---|
| 正文阅读 | 9 | Frozen, existing nine translated chapters |
| 背景与概念 | 7 | Context, Cathedral, Neocameralism, Patchwork, glossary, timeline, sources |
| 证据与延伸 | 5 | P4 source ledger, P5 quotation comparison, P6 three-layer collation, P7 pending preface draft, reading paths |

All 21 destinations remain links to pre-existing section IDs. No new research claims are introduced.

The editorial transition is divided into three browse paths: `背景与概念` (7 links), `证据与校勘` (4 links), and `延伸阅读` (1 link). This is a reading aid rather than a second standalone website index.

## Implementation

- `projects/yarvin-moldbug-cn/index.html`: group the TOC into 9 + 7 + 5 anchors, add an explicitly visible desktop location label, and replace the flat transition with three explanatory paths.
- `app.js`: identify the active section using document-order DOM anchors and viewport position; keep `aria-current="location"` synchronized for desktop and mobile; show the group and current item in the sidebar and floating mobile TOC.
- `styles.css`: local editorial spacing and mobile presentation using existing global `--site-*` tokens.
- Cache key `styles.css?v=20261021-p9`.
- `tests/test_yarvin_navigation_p9.py`: validate complete ordered 21-target navigation, three groups, 12 auxiliary links and unmodified nine-chapter/P7 boundaries.
- `scripts/verify_site_browser.py`: inspect real current-location behavior at both 1440px and 390px, including previously missing concept sections and evidence sections, and take bridge/mobile drawer screenshots.

## Protected assets

P9 does not modify:

- the nine-chapter translated `<article id="article">`;
- P4/P5/P6 JSON evidence files and P7 preface/approval JSON;
- previously existing IDs for chapters or sections;
- global `assets/site/design.css`;
- `scripts/build_site.py`, `scripts/personalize_site.py`, and unrelated site routes.

Do not interpret P7 as editorially approved. P9 only makes the separately marked draft discoverable.

## Acceptance

PR CI must pass Python unit tests and Chromium checks across both standard viewports, preserving navigation, keyboard search, reading modes, source filters and all research-data gates. Inspect the new bridge and grouped mobile drawer screenshots before merging.

After merge, GitHub Pages deploy must succeed and the public reader page + versioned stylesheet return HTTP 200. Add real run/SHA evidence to the Notion project after production checks. CI passing is not itself evidence that the public deployment succeeded.

## Status

P9 branch review underway; final merge and public result to be recorded after tests and deployment.
