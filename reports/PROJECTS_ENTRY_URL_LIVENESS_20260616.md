# Projects Entry URL Liveness Report

Date: 2026-06-16
Repository: `conanxin/conanxin.github.io`
Scope: `projects/data.json` `entry_url` values

## Summary

- Sitemap fix: PASS
  - Added `https://conanxin.github.io/projects/` to `sitemap.xml`.
  - Commit: `92df4e6bb4bc0791e8585645094ea0c0aaa182fe`
- Catalog entry liveness: ATTENTION REQUIRED
  - Total `entry_url` entries checked: 31
  - OK: 8
  - Broken / missing deployed entry: 23

## Check method

For GitHub Pages directory URLs, the liveness check uses the Pages source tree rule:

- `/projects/foo/` should have `projects/foo/index.html` in `main`.
- `/podcast/foo/` should have `podcast/foo/index.html` in `main`.
- GitHub tree URLs are considered OK when the target directory exists.
- The standalone `Engineering_Design_Methodology_docs` Pages URL was checked against `Engineering_Design_Methodology_docs/index.html` in this Pages repository and was missing here.

This is a source-tree liveness audit, not a search-index audit.

## Results

| # | title / slug | entry_url | status | evidence / note |
|---:|---|---|---|---|
| 1 | academic-paper-writing-guide | `/projects/academic-paper-writing-guide/` | OK | `projects/academic-paper-writing-guide/index.html` exists |
| 2 | wwdc26-keynote | `/projects/wwdc26-keynote/` | BROKEN | `projects/wwdc26-keynote/index.html` missing |
| 3 | internet-builder-archive | `/projects/internet-builder-archive/` | BROKEN | `projects/internet-builder-archive/index.html` missing |
| 4 | how-to-ai-almost-anything-cn | `/projects/how-to-ai-almost-anything-cn/` | BROKEN | `projects/how-to-ai-almost-anything-cn/index.html` missing |
| 5 | yang-fudong-fragrant-river | `/projects/yang-fudong-fragrant-river/` | OK | `projects/yang-fudong-fragrant-river/index.html` exists |
| 6 | oppo-mothers-day-report | `/projects/oppo-mothers-day-report/` | BROKEN | `projects/oppo-mothers-day-report/index.html` missing |
| 7 | letter-theme-page | `/projects/letter-theme-page/` | BROKEN | `projects/letter-theme-page/index.html` missing |
| 8 | personal-ai-leverage | `/projects/personal-ai-leverage/` | BROKEN | `projects/personal-ai-leverage/index.html` missing |
| 9 | hermes-lofi-skill | `/projects/hermes-lofi-skill/` | BROKEN | `projects/hermes-lofi-skill/index.html` missing |
| 10 | aura | `https://github.com/conanxin/conanxin.github.io/tree/main/projects` | OK | GitHub tree target directory exists |
| 11 | nano-banana | `https://github.com/conanxin/conanxin.github.io/tree/main/tools/prompt-generator` | OK | GitHub tree target directory exists |
| 12 | automata-little-archivist | `./automata-little-archivist/` | BROKEN | resolves from `/projects/` to `/projects/automata-little-archivist/`; index missing |
| 13 | podcast-novelizer | `/projects/podcast-novelizer/` | BROKEN | `projects/podcast-novelizer/index.html` missing |
| 14 | lagan-girlfriend-chaos | `/podcast/lagan-girlfriend-chaos/` | OK | `podcast/lagan-girlfriend-chaos/index.html` exists |
| 15 | pdf-to-markdown | `/projects/pdf-to-markdown/` | BROKEN | `projects/pdf-to-markdown/index.html` missing |
| 16 | qiao-de-nabian-shishenme | `/projects/qiao-de-nabian-shishenme/` | BROKEN | `projects/qiao-de-nabian-shishenme/index.html` missing |
| 17 | pompidou-color-summit | `/projects/pompidou-color-summit/` | BROKEN | `projects/pompidou-color-summit/index.html` missing |
| 18 | uap-files | `/projects/uap-files/` | BROKEN | `projects/uap-files/index.html` missing |
| 19 | dufu-luanli-route | `/projects/dufu-luanli-route/` | BROKEN | `projects/dufu-luanli-route/index.html` missing |
| 20 | aftergift-prototype | `/projects/aftergift-prototype/` | BROKEN | `projects/aftergift-prototype/index.html` missing |
| 21 | jobs-playboy-1985-cn-audio | `/projects/jobs-playboy-1985-cn-audio/` | BROKEN | `projects/jobs-playboy-1985-cn-audio/index.html` missing |
| 22 | engineering-design-methodology | `https://conanxin.github.io/Engineering_Design_Methodology_docs/` | BROKEN | `Engineering_Design_Methodology_docs/index.html` missing in this repo |
| 23 | time-will-tell-archive | `/projects/time-will-tell-archive/` | BROKEN | `projects/time-will-tell-archive/index.html` missing |
| 24 | arrow-learning-by-doing-1962 | `/projects/arrow-learning-by-doing-1962/` | BROKEN | `projects/arrow-learning-by-doing-1962/index.html` missing |
| 25 | poincare-recurrence | `/projects/poincare-recurrence/` | BROKEN | `projects/poincare-recurrence/index.html` missing |
| 26 | programming-as-theory-building | `/projects/programming-as-theory-building/` | BROKEN | `projects/programming-as-theory-building/index.html` missing |
| 27 | vonnegut-pbs-now-2005-interview | `/projects/vonnegut-pbs-now-2005-interview/` | BROKEN | `projects/vonnegut-pbs-now-2005-interview/index.html` missing |
| 28 | conan-ai-project-cinema | `/projects/conan-ai-project-cinema/` | BROKEN | `projects/conan-ai-project-cinema/index.html` missing; directory also missing in current `main` |
| 29 | artvee-gallery-demo | `/projects/artvee-gallery-demo/` | OK | `projects/artvee-gallery-demo/index.html` exists |
| 30 | artvee-gallery-digest | `/projects/artvee-gallery-digest/` | OK | `projects/artvee-gallery-digest/index.html` exists |
| 31 | wbw-spacex-mars-cn | `/projects/wbw-spacex-mars-cn/` | OK | `projects/wbw-spacex-mars-cn/index.html` exists |

## Diagnosis

The `/projects/` index is now restored and can render the catalog, but the catalog still contains many historical project entries whose deployed directories are missing from the current Pages repository.

This is catalog-to-publish-tree drift:

- `projects/data.json` says a project exists.
- The actual Pages source tree no longer contains the corresponding entry file.
- The new `/projects/` page will render these entries unless they are restored, redirected, or marked inactive.

The likely root cause is the same shared Pages namespace hazard already documented in `docs/PAGES_PUBLISH_GUARD.md`: project-specific publishing jobs can accidentally replace or delete sibling project directories when they copy a full `projects/` subtree or run broad `git add` operations.

## Recommended next actions

### Option A — Restore high-value missing projects

Restore selected broken subtrees from their last known good commits:

```bash
# Example pattern
for c in $(git rev-list HEAD -- projects/<slug> | head -50); do
  n=$(git ls-tree -r --name-only "$c" -- projects/<slug> | wc -l)
  [ "$n" -gt 0 ] && { echo "$c $n"; break; }
done

git restore --source <source-commit> -- projects/<slug>
git commit -m "Restore <slug> project page"
git push
```

Priority candidates:

1. `projects/conan-ai-project-cinema/`
2. `projects/wwdc26-keynote/`
3. `projects/internet-builder-archive/`
4. `projects/programming-as-theory-building/`
5. `projects/vonnegut-pbs-now-2005-interview/`

### Option B — Mark broken catalog entries inactive

Add a field such as:

```json
"active": false,
"broken_reason": "missing deployed index.html as of 2026-06-16"
```

Then update `projects/index.html` to hide inactive entries by default or show them as archived.

### Option C — Add redirect/placeholder pages

For entries where the source project is intentionally archived or moved, add a lightweight `index.html` explaining the new location.

## Guard requirement

Every future project publisher that writes into this shared Pages repo should run:

```bash
python3 scripts/check-project-publish-guard.py \
  --base origin/main \
  --allow projects/<current-project-slug>
```

The guard should run before commit/push. Do not use broad subtree replacement or broad `git add .` in project publishers.
