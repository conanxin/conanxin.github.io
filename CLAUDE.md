# CLAUDE.md

> Agent operating rules for the **conanxin.github.io** repo (Xin Conan's digital garden).
> **Source**: TASTE-2B polish (June 2026) — applied to `projects/wbw-spacex-mars-cn/`.
> **Reference DNA**: Vercel (primary) + Stripe (secondary).

## When you work on this repo

1. **Per-file `git add`** — never `git add .` or `git add -A`. The repo contains many sub-projects under `projects/*`; selective staging prevents accidentally sweeping in unrelated changes.
2. **No web fonts** — the system font stack (`-apple-system`, `PingFang SC`, `Hiragino Sans GB`, `Microsoft YaHei`, `Noto Sans CJK SC`) is the right call for a Chinese-first content site. Do not propose Google Fonts or self-hosted web fonts.
3. **No light theme by default** — pages with the `data-theme="deep-space"` attribute (e.g. `projects/wbw-spacex-mars-cn/`) are intentionally dark. The `data-theme="mars-sand"` alternative is opt-in via the in-page toggle.
4. **The hero of long-form pages is typographic, not photographic** — see `projects/wbw-spacex-mars-cn/` for the canonical 80px/800-weight typographic hero. Do not add hero images to long-form essay pages.
5. **The reading modes (immersive / annotated / compact) in `projects/wbw-spacex-mars-cn/` are part of the design** — do not refactor them as "inconsistent" without understanding the use case.

## WBW SpaceX Mars taste rules (TASTE-2B)

The `projects/wbw-spacex-mars-cn/` page (a Chinese translation of the Wait But Why essay on SpaceX Mars colonization) has been audited and polished. The full taste rules are in:

- **`docs/taste-rules.md`** — full design rationale + per-rule implementation notes
- **`.cursor/rules/wbw-spacex-mars-cn-taste.mdc`** — Cursor auto-load rule (globs cover `projects/wbw-spacex-mars-cn/**`)

### Quick summary

| Token | Value | Use |
|---|---|---|
| `--accent` | `#4a8cff` | links, active states, focus, glassmorphic card tint, interactive elements |
| `--accent-2` | `#c1440e` | scarcity accent — ≤ 1 element per page (orange) |
| `--accent-3` | `#ffb347` | tertiary, used sparingly |
| `--radius-pill` | `999px` | nav tags, footnote refs |
| `--radius-lg` | `12px` | annotated-mode panels |
| `--radius-card` | `14px` | source cards, footnote groups |
| `--radius-sm` | `4px` | small UI elements |
| `--shadow-card` | `0 0 0 1px rgba(74,140,255,0.18)` | Vercel-style border-shadow (panels in annotated mode) |
| `--status-ok/warn/fail` | `#4ade80` / `#fbbf24` / `#f87171` | comparison table cells only |

### Accent rationing (the most important rule after typography)

`--accent` / `#4a8cff`: links, buttons, `:focus-visible`, interactive card tints, active section nav pills.
`--accent-2` / `#c1440e`: **EXACTLY ONE** element per page (scarcity signal).
`--accent-3` / `#ffb347`: sparingly.

Before any merge: `grep -rE '#c1440e' projects/wbw-spacex-mars-cn/styles.css` must be ≤ 1 (within `:root` definition only).

### Accessibility (mandatory — do NOT remove)

The page must have:

1. **`:focus-visible` outline rule** — already added in the P0 polish. 2px solid `var(--accent)`, 2px offset, 4px border-radius. Don't suppress it.
2. **`prefers-reduced-motion` media query** — already added. Kills all transitions, animations, and the starfield canvas animation when the user has reduced-motion set. Don't remove.

### Anti-patterns (forbidden in this project)

- ❌ Hero photography
- ❌ Light theme (use `data-theme="mars-sand"` only)
- ❌ Multi-color accent inflation
- ❌ `filter: drop-shadow(...)`
- ❌ Border-style shadows outside annotated mode (they disappear on dark)
- ❌ Web fonts
- ❌ Pill-shape buttons (pills are for nav tags only; buttons stay 8px radius)
- ❌ Hover lift above 1px
- ❌ Animations on text content
- ❌ Hardcoded hex values outside `:root` (always use `var(--color-*)`)
- ❌ Direct use of `#4a8cff` in component CSS (use `var(--accent)`)

## Related docs

- `docs/taste-rules.md` — full design rationale
- `.cursor/rules/wbw-spacex-mars-cn-taste.mdc` — Cursor auto-load rule
- `outputs/taste-2b-wbw-spacex-mars-cn/TASTE_2B_P0_DIFF_SUMMARY.md` — the P0 polish diff summary (in the taste-lab-pilot repo, not this repo)

## Provenance

This `CLAUDE.md` was created during TASTE-2B (June 2026). The TASTE-2A audit is the upstream source. Future updates should reference the audit document and keep the spec's hard constraints in mind.
