# Homepage Taste Rules — conanxin-homepage

> **Project**: personal landing page at the `conanxin/conanxin.github.io` repo root.
> **URL**: https://conanxin.github.io/
> **Source audit**: TASTE-3A (`outputs/taste-3a-conanxin-homepage-audit/TASTE_3A_HOMEPAGE_DESIGN_AUDIT.md` — in the taste-lab-pilot repo)
> **Polish date**: 2026-06-25
> **Reference DNA**: Vercel (primary) + Linear (secondary) + Stripe (local accent only)

---

## Why this page is special

This is a **personal digital-garden home** presented through a terminal/code-editor aesthetic. The design DNA is *not* "marketing page" — it's "programmer's space, deliberately." The 4 extracted taste principles (Monospace as Identity / Flat Depth / Sparse Canvas / One Accent with Discipline) all reflect this.

The page is the **third archetype** in the TASTE case archive (after `hermes-knowledge-base` KB and `wbw-spacex-mars-cn` editorial), and the first to deliberately use a web font. The terminal aesthetic requires `JetBrains Mono`; the system font stack would be wrong here.

## Reference pairing rationale

### Vercel (primary) — engineering clarity, restraint

What we borrow from Vercel:

- **8px spacing base** (via rem) — already in use via `--space-{xs,sm,md,lg,xl,xxl}`
- **Single font family** — already in use via `--font-mono` (JetBrains Mono); analogous to Vercel's Geist Mono
- **Border-style depth** — `1px solid var(--border-color)` instead of box-shadow; matches Vercel's "no shadow" philosophy
- **Accent rationing** — enforced structurally by removing 3 unused accent colors in P0

### Linear (secondary) — dark theme, tool-over-display

What we borrow from Linear:

- **Dark theme for long sessions** — `--bg-primary: #0d1117` is the canonical dark navy
- **Tool-over-display philosophy** — no hero image, no marketing-page hero, no bento grid
- **Calm/restraint** — the page signals "stay and browse," not "convert now"

### Stripe (local accent only) — single-accent-for-action

What we borrow from Stripe:

- **Single-accent discipline** — the homepage uses `--accent-green` for active states (links, "Now" highlight, focus-visible) and `--accent-blue` for secondary interactive. The 1+1 rationing is the Stripe principle applied to a personal home.

What we explicitly reject from Stripe:

- Bento grid (wrong for a single-column personal home)
- Multi-layer navy-tinted shadows (zero shadows is the discipline)
- 32px body lede (terminal aesthetic, not marketing-page scale)
- Marketing-page hero with big headline + subhead + CTA
- Indigo accent (the homepage's mint/green is the right identity)

## 4 design principles (extracted from the page's DNA)

1. **Monospace as Identity** — JetBrains Mono for every text role (headings, body, nav, meta). The monospace aesthetic IS the site's personality. Single family with 2 weights eliminates font-loading layout shift.
2. **Flat Depth Over Simulated Depth** — zero shadows, zero gradients. Cards separated from the dark background only by a slightly-lighter surface (`#161b22` on `#0d1117`) and a 1px border (`#30363d`).
3. **Sparse Canvas Over Data Density** — content capped at `800px` on a `1440px` viewport (~55% width). The whitespace signals "there's no rush here, stay and browse."
4. **One Accent, Used with Discipline** — `#7ee787` (mint/lime green) reserved for active states, interactive links, and the "Now" section highlight. `#79C0FF` (soft blue) handles secondary interactive text. No accent on borders, backgrounds, or decorative elements.

## P0 polish (shipped in TASTE-3B)

### 1 · Accessibility (the highest-leverage P0 win)

Added a global `:focus-visible` outline rule at the end of `styles/main.css`:

```css
:focus-visible {
    outline: 2px solid var(--accent-green);
    outline-offset: 2px;
    border-radius: 4px;
}
```

This restores keyboard focus visibility (WCAG 2.4.7). Uses the page's existing `--accent-green` (the active-state accent) and respects the 4px border-radius of the page's pill chips.

Added a `prefers-reduced-motion` media query (WCAG 2.3.3):

```css
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        transition-duration: 0.01ms !important;
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        scroll-behavior: auto !important;
    }
    .status-dot {
        animation: none !important;
    }
}
```

The `.status-dot` selector specifically stops the `pulse` keyframe animation (otherwise the page would still pulse even with reduced-motion set).

### 2 · Accent discipline (1+1 enforcement)

Removed 3 unused accent tokens from `:root`:
- `--accent-orange: #ffa657` — was used in 2 places (`.featured-date`, `.post-date`); migrated to `var(--text-muted)` (gray; dates are low-emphasis)
- `--accent-purple: #d2a8ff` — defined but never used
- `--accent-red: #ff7b72` — defined but never used

After P0, only `--accent-green` (primary) and `--accent-blue` (secondary) remain. The 1+1 discipline is enforced structurally — a future agent cannot introduce `--accent-orange` because the token doesn't exist.

### 3 · Typography cleanup

- **Removed unused `--font-sans` token** (was `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`; never referenced in any selector)
- **Dropped Inter from the Google Fonts URL** — `<link href="...family=JetBrains+Mono...&family=Inter...">` → `<link href="...family=JetBrains+Mono...">`. Saves ~30KB of unused web font payload.

### 4 · Documentation

- **`CLAUDE.md`** (extended, +70 lines) — appended a "Conanxin Homepage Taste Rules (TASTE-3B)" section with token table, accent rationing rules, accessibility mandates, and 13 anti-patterns. Also updated rule #2 to carve out the homepage's web font exception (the existing TASTE-2B rule said "no web fonts" which is correct for `wbw-spacex-mars-cn` but wrong for the homepage).
- **`.cursor/rules/conanxin-homepage-taste.mdc`** (new, ~180 lines) — Cursor auto-load rule, globs limited to `index.html` + `styles/main.css` + repo root patterns.
- **`docs/homepage-taste-rules.md`** (this file, new) — full design rationale + per-rule implementation notes.

## What was NOT changed (deferred to P1/P2)

- Reading-progress indicator (P1)
- Sticky nav with current-section highlight (P1)
- Skip-to-main-content link (P1)
- Reading-time display (P1)
- `scripts/check-design-tokens.sh` + CI (P2)
- Any change to `.featured-grid` / `.terminal-nav` / `.terminal-container` structure
- Any change to the 243-line `index.html` content / section ordering
- Any change to the JetBrains Mono font stack
- Any change to the 0.2s transition duration
- Any change to other `projects/*` subdirectories
- Any change to `wbw-spacex-mars-cn` (already shipped in TASTE-2B/2C)

## P0 acceptance criteria (all PASS)

| Check | Method | Result |
|---|---|---|
| `:focus-visible` rule present | `grep` | ✓ present (1 occurrence) |
| `prefers-reduced-motion` block present | `grep` | ✓ present (1 occurrence) |
| `:root` accent count | `grep '^\s+--accent-.*:'` | 2 (green + blue) — 1+1 discipline |
| 0 undefined token references | `python3.12` regex | 0 (18 defined, 18 used) |
| 0 unused tokens | `python3.12` regex | 0 (18 defined, 18 used) |
| 0 hardcoded hex outside `:root` | `python3.12` regex | 0 |
| Brace balance | `python3.12` | 80 open / 80 close (BALANCED) |
| Inter dropped from Google Fonts URL | `grep index.html` | ✓ only JetBrains Mono loaded |
| `.featured-date` / `.post-date` migrated from orange to muted | `grep` | ✓ both use `var(--text-muted)` |
| `update_site.py` / `check_pages_sync.py` | n/a | static site, no build script |
| Build / no syntax errors | Python + curl `Server: SimpleHTTP` | ✓ |

## Why the page was already 70% correct

The TASTE-3A audit's strongest finding was that this page was already 70% aligned with the Vercel+Linear DNA. The 30% to fix was:
- a11y (focus-visible, reduced-motion) — P0 fix
- accent discipline (3 unused colors removed) — P0 fix
- web font cleanup (drop unused Inter) — P0 fix
- documentation (no design rationale, no agent rules) — P0 fix

The remaining 30% (if any) is in the typographic and component choices, which the audit deemed "already aligned with the Vercel DNA" and recommended NOT touching without author review (28px hero / 800px container / 48px section gap / 4px chip radius / JetBrains Mono mono identity — all correct as-is).

## What the author should know

- The `wbw-spacex-mars-cn` page (a TASTE-2B project) uses the system font stack. The homepage uses JetBrains Mono. These are **different design choices for different archetypes** — the CLAUDE.md now carves out the homepage's web font exception explicitly.
- The 1+1 accent discipline is now **structurally enforced** (3 unused tokens removed). If you ever need orange/purple/red for a specific section, add it back deliberately with a comment explaining why.
- The `:focus-visible` rule uses `--accent-green` (not the page's `--text-primary`). This is deliberate: the focus ring should be the most-visible thing on the page (using the accent color), not the body text color.
- The `prefers-reduced-motion` block kills the `.status-dot` pulse. The pulse is the only visible animation; if you add more in the future, update the media query.
