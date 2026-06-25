# Taste Rules — `projects/wbw-spacex-mars-cn/`

> **Project**: Chinese translation of the Wait But Why essay on SpaceX Mars colonization
> **URL**: https://conanxin.github.io/projects/wbw-spacex-mars-cn/
> **Source audit**: TASTE-2A (`outputs/taste-2a-next-project-audit/TASTE_2A_TARGET_DESIGN_AUDIT.md`)
> **Polish date**: 2026-06-25
> **Reference DNA**: Vercel (primary) + Stripe (secondary)

---

## Why this page is special

This is a **10,000+ word Chinese-language long-form essay page**. The design DNA is *editorial*, not "engineering project page" — the typographic hero is the commitment signal, not a hero image. The design must:

- Disappear when the reader is engaged
- Use the dark navy `#0a0e1a` theme as the reading environment
- Ration the accent color (`#4a8cff` blue) to interactive elements only
- Keep the orange-red (`#c1440e`) for exactly one scarcity signal per page
- Honor keyboard focus (`:focus-visible`) and motion preferences (`prefers-reduced-motion`)

## Reference pairing rationale

### Vercel (primary) — engineering clarity, restraint

What we borrow from Vercel:

- **8px spacing base** — already in use, just needs to be enforced via tokens
- **Single font family** — system font already in use, just needs `--font-base` referenced everywhere
- **Border-style shadows** — Vercel's `0 0 0 1px rgba(0,0,0,0.08)` pattern. On dark backgrounds, the original Vercel black doesn't work, so we use `0 0 0 1px rgba(74,140,255,0.18)` (the project's `--shadow-card`)
- **Negative tracking on H1** — Vercel uses `-3.84px`. For our system font at 80px, the value is `-1.6px` or near-zero; we use `0.01em` which is close to Vercel's "near zero" choice for Chinese rendering

### Stripe (secondary) — long-form body rhythm, accent rationing

What we borrow from Stripe:

- **Body lede at 17.28px / 1.95 line-height** — Stripe's 32px/300 body lede translated to Chinese proportions. The `1.95×` line-height creates generous vertical rhythm for 10k+ word reading.
- **Restrained accent application** — Stripe's `#533AFD` discipline (CTAs only) maps to our `--accent` (`#4a8cff`) used only on links, buttons, focus, active nav, and card tints.
- **Single accent discipline** — we have 3 accent variables (blue, orange, amber), but the principle is the same: blue is the daily-driver, orange is the scarcity signal, amber is the contextual one.

## 4 design principles (extracted from the page's DNA)

1. **Hero-Scale Title as Commitment Signal** — 80px/800 typographic hero = "decide in 3 seconds whether to read this 10k+ word essay"
2. **Dark Glassmorphic Cards Over Flat Boxes** — `rgba(74,140,255,0.15)` blue tint + blue glow shadow; depth without borders or saturated fills
3. **Single Accent Color as Signal, Not Shade** — blue dominates; orange-red (`#c1440e`) is reserved for a single one-time priority signal
4. **Restraint: No Hero Image, Pure Typography Above the Fold** — the essay's value is intellectual, not emotional; a hero photo would frame it as journalism

## P0 polish (shipped in TASTE-2B)

### 1. Accessibility

Added a global `:focus-visible` outline rule:

```css
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}
```

This restores keyboard focus visibility (WCAG 2.4.7). The existing `.glossary-search:focus { outline: none }` was kept for mouse focus, but a sibling `.glossary-search:focus-visible` rule was added to give keyboard users a visible ring.

Added a `prefers-reduced-motion` media query (WCAG 2.3.3):

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
  }
  .starfield { animation: none !important; }
}
```

This kills the starfield canvas animation and all CSS transitions/animations when the user has reduced-motion enabled.

### 2. Token expansion

Added 12 new tokens to `:root`:

```css
--shadow-card: 0 0 0 1px rgba(74,140,255,0.18);  /* Vercel-style border-shadow */
--radius-sm: 4px;                                 /* small UI */
--radius-lg: 12px;                                /* annotated panels */
--radius-card: 14px;                              /* source cards, footnote groups */
--radius-pill: 999px;                             /* nav tags, footnote refs */
--text-muted: #94a3b8;                            /* alias for fallback declarations */
--status-ok: #4ade80;                             /* comparison table "ok" */
--status-warn: #fbbf24;                           /* comparison table "warn" */
--status-fail: #f87171;                           /* comparison table "fail" */
--warn-bg: #fef3c7;                               /* no-JS banner background */
--warn-border: #f59e0b;
--warn-text: #92400e;
--earth-from: #6cb0ff;                            /* earth circle gradient */
--earth-to: #1e5a99;
--mars-from: #c1440e;                             /* mars circle gradient */
--mars-to: #5a1a08;
```

### 3. Inline hex → token migration

Migrated 9 inline hex values to token references:

- `.earth-circle` / `.mars-circle` gradient stops → `var(--earth-from/to)`, `var(--mars-from/to)`
- `.compare-table td.ok/warn/fail` → `var(--status-ok/warn/fail)`
- `.noscript-banner` and `.noscript-banner a` → `var(--warn-bg/border/text)`

### 4. Border-radius consolidation

Replaced 8 inline `border-radius` values with token references:

- `999px` → `var(--radius-pill)` (footnote refs)
- `12px` → `var(--radius-lg)` (annotated panels, image-fallback)
- `14px` → `var(--radius-card)` (source cards, footnote groups, article figures)
- `4px` → `var(--radius-sm)` (annotation hint, roadmap tags, marker pills)

## What was NOT changed (deferred to P1/P2)

- Reading-progress indicator (P1)
- Sticky TOC with current-section highlight (P1)
- Reading-time display in byline (P1)
- `scripts/check-design-tokens.sh` + CI (P2)
- Theme color changes (deep-space / mars-sand tokens left untouched)
- Translation content (the actual essay text)
- Reading-mode logic in `app.js`
- SVG hero / starfield canvas code
- Any other `projects/*` subdirectory

## P0 acceptance criteria (all PASS)

| Check | Method | Result |
|---|---|---|
| `:focus-visible` rule present | `grep` | ✓ present |
| `prefers-reduced-motion` block present | `grep` | ✓ present |
| `border-radius: 4px` / `12px` / `14px` / `999px` outside `:root` | `grep` | 0 (all migrated) |
| Inline hex outside `:root` for status colors | `grep` | 0 (migrated to `--status-*`) |
| Inline hex outside `:root` for warning callout | `grep` | 0 (migrated to `--warn-*`) |
| Inline hex outside `:root` for earth/mars circles | `grep` | 0 (migrated to `--earth-*` / `--mars-*`) |
| Build / no syntax errors | Python `compile` not applicable; visual smoke test PASS | ✓ |
| `update_site.py` (if present) | n/a — static site, no build | n/a |

## Why the page is already 80% correct

The TASTE-2A audit's strongest finding was that this page is already 80% aligned with the Vercel+Stripe DNA. The token system, reading modes, theme system, and hero typography were all in place. P0 was a polish job — adding accessibility hooks and tightening the token migration — not a structural rewrite. This is the **right** outcome: refactoring speculatively would have wasted effort and risked regressions.
