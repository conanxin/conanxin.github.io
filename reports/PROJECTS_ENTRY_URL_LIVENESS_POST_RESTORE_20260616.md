# Projects Entry URL Liveness Report — Post Restore

Date: 2026-06-16
Repository: `conanxin/conanxin.github.io`
Scope: `projects/data.json` `entry_url` values

## What changed in this pass

This pass restored the high-priority missing project entry pages and refreshed the sitemap.

### Restored top-priority project entries

- `projects/conan-ai-project-cinema/index.html`
- `projects/wwdc26-keynote/index.html`
- `projects/internet-builder-archive/index.html`
- `projects/programming-as-theory-building/index.html`
- `projects/vonnegut-pbs-now-2005-interview/index.html`

### Restored sitemap deep paths under Internet Builder Archive

- `projects/internet-builder-archive/guide.html`
- `projects/internet-builder-archive/paths/index.html`
- `projects/internet-builder-archive/paths/founder-spirit.html`
- `projects/internet-builder-archive/paths/tech-startup-history.html`
- `projects/internet-builder-archive/paths/media-and-society.html`
- `projects/internet-builder-archive/paths/creator-mindset.html`
- `projects/internet-builder-archive/paths/organization-and-strategy.html`

### New prevention tool

- Added `scripts/check-project-entry-url-liveness.py`.
- The script checks `projects/data.json` against the local Pages source tree.
- It is stdlib-only and can output either text or JSON.

## Current source-tree liveness summary

Using the script's model:

- Total catalog entries: 31
- Source-tree OK: 11
- External GitHub URLs skipped: 2
- Broken / missing local entry: 18

The earlier report had 23 broken entries. This pass reduces the broken set by 5.

## Source-tree OK entries

| slug | entry_url | evidence |
|---|---|---|
| `academic-paper-writing-guide` | `/projects/academic-paper-writing-guide/` | `projects/academic-paper-writing-guide/index.html` |
| `wwdc26-keynote` | `/projects/wwdc26-keynote/` | restored `projects/wwdc26-keynote/index.html` |
| `internet-builder-archive` | `/projects/internet-builder-archive/` | restored `projects/internet-builder-archive/index.html` |
| `yang-fudong-fragrant-river` | `/projects/yang-fudong-fragrant-river/` | `projects/yang-fudong-fragrant-river/index.html` |
| `lagan-girlfriend-chaos` | `/podcast/lagan-girlfriend-chaos/` | `podcast/lagan-girlfriend-chaos/index.html` |
| `programming-as-theory-building` | `/projects/programming-as-theory-building/` | restored `projects/programming-as-theory-building/index.html` |
| `vonnegut-pbs-now-2005-interview` | `/projects/vonnegut-pbs-now-2005-interview/` | restored `projects/vonnegut-pbs-now-2005-interview/index.html` |
| `conan-ai-project-cinema` | `/projects/conan-ai-project-cinema/` | restored `projects/conan-ai-project-cinema/index.html` |
| `artvee-gallery-demo` | `/projects/artvee-gallery-demo/` | `projects/artvee-gallery-demo/index.html` |
| `artvee-gallery-digest` | `/projects/artvee-gallery-digest/` | `projects/artvee-gallery-digest/index.html` |
| `wbw-spacex-mars-cn` | `/projects/wbw-spacex-mars-cn/` | `projects/wbw-spacex-mars-cn/index.html` |

## External GitHub URLs skipped by source-tree checker

These are not GitHub Pages pages; they are repository navigation links.

| slug | entry_url |
|---|---|
| `aura` | `https://github.com/conanxin/conanxin.github.io/tree/main/projects` |
| `nano-banana` | `https://github.com/conanxin/conanxin.github.io/tree/main/tools/prompt-generator` |

## Remaining broken catalog entries

These still point to Pages paths that do not have a corresponding `index.html` in the current source tree.

| slug | entry_url | missing path |
|---|---|---|
| `how-to-ai-almost-anything-cn` | `/projects/how-to-ai-almost-anything-cn/` | `projects/how-to-ai-almost-anything-cn/index.html` |
| `oppo-mothers-day-report` | `/projects/oppo-mothers-day-report/` | `projects/oppo-mothers-day-report/index.html` |
| `letter-theme-page` | `/projects/letter-theme-page/` | `projects/letter-theme-page/index.html` |
| `personal-ai-leverage` | `/projects/personal-ai-leverage/` | `projects/personal-ai-leverage/index.html` |
| `hermes-lofi-skill` | `/projects/hermes-lofi-skill/` | `projects/hermes-lofi-skill/index.html` |
| `automata-little-archivist` | `./automata-little-archivist/` | `projects/automata-little-archivist/index.html` |
| `podcast-novelizer` | `/projects/podcast-novelizer/` | `projects/podcast-novelizer/index.html` |
| `pdf-to-markdown` | `/projects/pdf-to-markdown/` | `projects/pdf-to-markdown/index.html` |
| `qiao-de-nabian-shishenme` | `/projects/qiao-de-nabian-shishenme/` | `projects/qiao-de-nabian-shishenme/index.html` |
| `pompidou-color-summit` | `/projects/pompidou-color-summit/` | `projects/pompidou-color-summit/index.html` |
| `uap-files` | `/projects/uap-files/` | `projects/uap-files/index.html` |
| `dufu-luanli-route` | `/projects/dufu-luanli-route/` | `projects/dufu-luanli-route/index.html` |
| `aftergift-prototype` | `/projects/aftergift-prototype/` | `projects/aftergift-prototype/index.html` |
| `jobs-playboy-1985-cn-audio` | `/projects/jobs-playboy-1985-cn-audio/` | `projects/jobs-playboy-1985-cn-audio/index.html` |
| `engineering-design-methodology` | `https://conanxin.github.io/Engineering_Design_Methodology_docs/` | `Engineering_Design_Methodology_docs/index.html` |
| `time-will-tell-archive` | `/projects/time-will-tell-archive/` | `projects/time-will-tell-archive/index.html` |
| `arrow-learning-by-doing-1962` | `/projects/arrow-learning-by-doing-1962/` | `projects/arrow-learning-by-doing-1962/index.html` |
| `poincare-recurrence` | `/projects/poincare-recurrence/` | `projects/poincare-recurrence/index.html` |

## Sitemap state

`sitemap.xml` was refreshed to include only currently restored or verified local project URLs:

- `/projects/`
- restored top-priority project entries
- existing verified project entries
- restored Internet Builder Archive deep paths

It intentionally does not include the 18 remaining broken catalog entries.

## Recommended next optimization order

1. Restore the 18 remaining missing entries in batches of 5.
2. Once broken count is 0, wire `scripts/check-project-entry-url-liveness.py` into GitHub Actions without `--allow-broken`.
3. Add `active` / `archived` metadata to `projects/data.json` so the catalog UI can separate live pages from historical ideas.
4. Add a small `projects/health.json` generated by the checker for the front-end catalog page.
5. Later, replace recovery placeholders with full subtree restores from the best historical commits.
