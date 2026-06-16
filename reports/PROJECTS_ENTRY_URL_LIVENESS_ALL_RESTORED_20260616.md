# Projects Entry URL Liveness Report — All Missing Entries Restored

Date: 2026-06-16
Repository: `conanxin/conanxin.github.io`
Scope: `projects/data.json` `entry_url` values

## Summary

All 18 remaining missing local entry pages have been restored as lightweight recovery pages.

Current source-tree liveness baseline:

- Total catalog entries: 31
- Local Pages entries with source-tree entry files: 29
- External GitHub tree URLs skipped: 2
- Broken local entries: 0

## Batch restore log

### Batch 1 / 4

- `projects/how-to-ai-almost-anything-cn/index.html`
- `projects/oppo-mothers-day-report/index.html`
- `projects/letter-theme-page/index.html`
- `projects/personal-ai-leverage/index.html`
- `projects/hermes-lofi-skill/index.html`

### Batch 2 / 4

- `projects/automata-little-archivist/index.html`
- `projects/podcast-novelizer/index.html`
- `projects/pdf-to-markdown/index.html`
- `projects/qiao-de-nabian-shishenme/index.html`
- `projects/pompidou-color-summit/index.html`

### Batch 3 / 4

- `projects/uap-files/index.html`
- `projects/dufu-luanli-route/index.html`
- `projects/aftergift-prototype/index.html`
- `projects/jobs-playboy-1985-cn-audio/index.html`
- `Engineering_Design_Methodology_docs/index.html`

### Batch 4 / 4

- `projects/time-will-tell-archive/index.html`
- `projects/arrow-learning-by-doing-1962/index.html`
- `projects/poincare-recurrence/index.html`

## Verified local entry baseline

| slug | entry_url | expected source-tree entry |
|---|---|---|
| `academic-paper-writing-guide` | `/projects/academic-paper-writing-guide/` | `projects/academic-paper-writing-guide/index.html` |
| `wwdc26-keynote` | `/projects/wwdc26-keynote/` | `projects/wwdc26-keynote/index.html` |
| `internet-builder-archive` | `/projects/internet-builder-archive/` | `projects/internet-builder-archive/index.html` |
| `how-to-ai-almost-anything-cn` | `/projects/how-to-ai-almost-anything-cn/` | `projects/how-to-ai-almost-anything-cn/index.html` |
| `yang-fudong-fragrant-river` | `/projects/yang-fudong-fragrant-river/` | `projects/yang-fudong-fragrant-river/index.html` |
| `oppo-mothers-day-report` | `/projects/oppo-mothers-day-report/` | `projects/oppo-mothers-day-report/index.html` |
| `letter-theme-page` | `/projects/letter-theme-page/` | `projects/letter-theme-page/index.html` |
| `personal-ai-leverage` | `/projects/personal-ai-leverage/` | `projects/personal-ai-leverage/index.html` |
| `hermes-lofi-skill` | `/projects/hermes-lofi-skill/` | `projects/hermes-lofi-skill/index.html` |
| `automata-little-archivist` | `./automata-little-archivist/` | `projects/automata-little-archivist/index.html` |
| `podcast-novelizer` | `/projects/podcast-novelizer/` | `projects/podcast-novelizer/index.html` |
| `lagan-girlfriend-chaos` | `/podcast/lagan-girlfriend-chaos/` | `podcast/lagan-girlfriend-chaos/index.html` |
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
| `programming-as-theory-building` | `/projects/programming-as-theory-building/` | `projects/programming-as-theory-building/index.html` |
| `vonnegut-pbs-now-2005-interview` | `/projects/vonnegut-pbs-now-2005-interview/` | `projects/vonnegut-pbs-now-2005-interview/index.html` |
| `conan-ai-project-cinema` | `/projects/conan-ai-project-cinema/` | `projects/conan-ai-project-cinema/index.html` |
| `artvee-gallery-demo` | `/projects/artvee-gallery-demo/` | `projects/artvee-gallery-demo/index.html` |
| `artvee-gallery-digest` | `/projects/artvee-gallery-digest/` | `projects/artvee-gallery-digest/index.html` |
| `wbw-spacex-mars-cn` | `/projects/wbw-spacex-mars-cn/` | `projects/wbw-spacex-mars-cn/index.html` |

## Skipped external catalog entries

These are repository navigation links, not local GitHub Pages URLs:

- `aura` -> `https://github.com/conanxin/conanxin.github.io/tree/main/projects`
- `nano-banana` -> `https://github.com/conanxin/conanxin.github.io/tree/main/tools/prompt-generator`

## Sitemap update

`sitemap.xml` was refreshed after this restore so all verified local entries are included, while external GitHub tree links remain excluded from sitemap.

## Remaining work

The catalog no longer points to missing local entry pages. Remaining quality work is content-depth restoration:

1. Replace lightweight recovery pages with full historical subtree restores where available.
2. Add `status_kind` or `recovery_state` fields to `projects/data.json` so the catalog can label recovery pages differently from complete pages.
3. Generate `projects/health.json` from `scripts/check-project-entry-url-liveness.py --json` for front-end display.
4. Keep `scripts/check-project-entry-url-liveness.py` in CI so future catalog drift fails early.
