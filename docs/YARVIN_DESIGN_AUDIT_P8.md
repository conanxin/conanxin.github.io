# Yarvin Reader Design Contract Audit — P8

> Date: 2026-10-21  
> Scope: mainline design consistency; not the P7 translation-approval branch.  
> Baseline: current `main` at `3dcae1a125cdf2f10232d9acd7703abf2c234cfb`.  
> Global visual authority: `docs/SITE_DESIGN.md` v1.9.1 and `assets/site/design.css`.

## Purpose

P1–P7 delivered the unified page frame, reading rhythm, provenance interfaces and P7 editorial-review surface. P8 returns to the original design-system task: verify that the page-specific reader controls still work after the global `body.site-unified` overrides are applied by the published build.

The reader intentionally retains three content themes — Cathedral, Patchwork and Ink — plus three reading modes — Annotated, Immersive and Compact. These are page-level content controls, not exceptions to the site-wide palette, navigation, active controls or typography system.

## Finding

The source already declared the three themes and modes, but the unified override layer hard-coded some page-content properties to a single global value:

- `body.site-unified .hero__eyebrow` used `--site-green` rather than the reader's `--accent`.
- `body.site-unified .article-meta` fixed its editorial marker to `--site-green`.
- Both unified quote rules fixed the quotation surface to `--site-paper` and the border to `--site-accent`, bypassing the existing `--quote-bg` and `--quote-border` theme tokens.

As a result, a theme click could update `html[data-theme]` and the toolbar active state while some content surfaces remained visually identical across themes. This was a design-contract gap, not a missing theme button.

## P8 changes

1. Reuse the existing theme tokens in the local page stylesheet:
   - eyebrow and metadata marker: `var(--accent)`;
   - quotation background: `var(--quote-bg)`;
   - quotation border: `var(--quote-border)`.
2. Keep site chrome stable: the global header/navigation, primary CTA, active toolbar controls, site background, font stack and global `--site-*` tokens remain unchanged.
3. Bump the local stylesheet cache key to `styles.css?v=20261021-p8`; do not change `app.js` or its storage behavior.
4. Add `tests/test_yarvin_design_contract_p8.py` for the theme/mode inventory, use of the canonical palette, scoped token usage, and protection of the frozen nine-chapter article and P7 draft.
5. Extend `scripts/verify_site_browser.py` to exercise all three themes and all three reading modes in real Chromium at the existing 1440px and 390px viewports. Tests assert computed colors, paper surfaces, font size, line height, and exactly one active control per group — not just the presence of `data-theme` attributes.

## Expected visual contract

| Control | Expected page-content effect | What remains fixed |
|---|---|---|
| Cathedral | Green content accent; warm-white quote surface; brown quote border | Shared nav, primary CTA, global background and tokens |
| Patchwork | Brown content accent; white quote surface; brown quote border | Shared nav, primary CTA, global background and tokens |
| Ink | Ink-colored content accent and quote border; warm-white quote surface | Shared nav, primary CTA, global background and tokens |
| Annotated | 17px serif body, 1.95 line-height | Shared site font stack and chrome |
| Immersive | 19px serif body, 2.05 line-height | Shared site font stack and chrome |
| Compact | 16px serif body, 1.65 line-height | Shared site font stack and chrome |

## Preservation boundary

P8 is a design-only correction. It must not modify:

- the original nine-chapter `<article id="article">` text;
- P4 source ledger, P5 passage alignment data or P6 three-layer source records;
- P7's four draft paragraphs, duplicate pullquote note or four pending editorial decisions;
- `app.js`, `assets/site/design.css` global tokens, other projects or global site navigation.

P7 editorial approval remains a separate track. P8 does not approve or publish any translation draft.

## Acceptance gates

- Python unit tests, including the new P8 contract tests.
- Chromium interaction checks for all three themes and modes at 1440px and 390px.
- No JavaScript errors or page-level horizontal overflow.
- Screenshot review of the reader after theme/mode interactions.
- After merge, successful GitHub Pages deploy and public HTTP 200 for the reader page and versioned P8 stylesheet.
- Notion project record updated with the merge SHA and production run only after the public gate passes.

## Status

This document is a stage report. Final test counts, PR, merge SHA and public deployment results are appended after the P8 CI and production gates complete.
