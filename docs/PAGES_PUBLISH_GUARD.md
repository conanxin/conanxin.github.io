# Pages Publish Guard

## Purpose

`conanxin.github.io` is a **shared GitHub Pages repo**. One repo, many
`projects/<name>/` subtrees. When a publish job for one project writes
to the repo, it must not touch the subtrees of any other project.

This guard enforces that rule *before* `git add` / `git commit` /
`git push`, by comparing the candidate diff against a caller-supplied
allowlist of project paths.

## Problem (the 2026-06-15 incident that motivated this guard)

Between 2026-06-12 and 2026-06-15, 9 commits in the WBW SpaceX Mars
publish flow (`013fbdb..3748acb`) replaced the `projects/` subtree as
a whole. In the process, two unrelated project subtrees were deleted:

- `projects/artvee-gallery-demo/` (215 files / 5.7 MB)
- `projects/artvee-gallery-digest/` (5 files / 284 KB)
- `projects/yang-fudong-fragrant-river/` (35 files / 332 KB)

The artvee `Daily Health` cron at 03:00 caught the failure (gallery
returned 404), and the local Artvee system was unharmed — the local
candidate was still correct, only the public site was missing the
artifacts. Recovery required re-running
`publish_demo_refresh_candidate.sh` to push the existing candidate
back to `main`. The Yang Fudong case was a similar recovery from
source commit `3bcdf8b`.

The shared-namespace hazard is structural: every project publish can
destroy every other project. This guard makes the hazard visible at
publish time, *before* the damage is pushed.

## Rule

> **A publish job declares an allowlist of `projects/<X>/` paths it is
> permitted to touch. Any change to a `projects/<Y>/` path outside the
> allowlist, or any deletion of any `projects/<Y>/` path outside the
> allowlist, is a `BLOCKED` change. The guard exits 1 and the
> publish job must abort.**

The guard runs against:

- committed-but-not-pushed changes (`git diff --name-status <base>...HEAD`)
- working-tree changes (`git diff --name-status`)
- index changes (`git diff --name-status --cached`)

The default base is `origin/main`. Override with `--base`.

`projects/data.json` is the project catalog and is implicitly
allowed (every publish updates its `updated` / `summary` field). Pass
`--no-allow-catalog` to forbid catalog updates.

Changes outside `projects/` (e.g. `README.md`, `scripts/`) are
blocked by default. Pass `--allow-outside` to allow them.

## Examples

### Artvee publish

```bash
cd <pages-repo>
python3 scripts/check-project-publish-guard.py \
    --base origin/main \
    --allow projects/artvee-gallery-demo \
    --allow projects/artvee-gallery-digest
```

Allow: any path under `projects/artvee-gallery-demo/`,
`projects/artvee-gallery-digest/`, and `projects/data.json`.

### WBW SpaceX Mars publish

```bash
cd <pages-repo>
python3 scripts/check-project-publish-guard.py \
    --base origin/main \
    --allow projects/wbw-spacex-mars-cn
```

Allow: any path under `projects/wbw-spacex-mars-cn/` and
`projects/data.json`. **Cross-project** changes (e.g. to
`projects/artvee-gallery-demo/`) are blocked.

### Yang Fudong publish

```bash
cd <pages-repo>
python3 scripts/check-project-publish-guard.py \
    --base origin/main \
    --allow projects/yang-fudong-fragrant-river
```

## Output

```
== Pages Publish Guard ==
  base:           origin/main
  allow:          ['projects/artvee-gallery-demo', 'projects/artvee-gallery-digest']
  allow_catalog:  True
  allow_outside:  False

== Totals ==
  changed        13
  allowed        13
  blocked_top    0
  blocked_outer  0

== Verdict: PASS ==
```

With `--json` the same report is emitted as a JSON object for CI
consumption.

Exit codes:

- `0` — PASS (no blocked paths; either no changes, or all changes in allowlist)
- `1` — FAIL (one or more blocked paths; publish must abort)

## Failure examples

```
== Pages Publish Guard ==
  base:           origin/main
  allow:          ['projects/artvee-gallery-demo', 'projects/artvee-gallery-digest']
  allow_catalog:  True
  allow_outside:  False

== Totals ==
  changed        12
  allowed        4
  blocked_top    6
  blocked_outer  2

== Blocked (under projects/* but not in allowlist) ==
  D  projects/wbw-spacex-mars-cn/index.html
  D  projects/wbw-spacex-mars-cn/README.md
  D  projects/wbw-spacex-mars-cn/app.js
  D  projects/yang-fudong-fragrant-river/index.html
  D  projects/yang-fudong-fragrant-river/data/works.json
  D  projects/yang-fudong-fragrant-river/styles.css

== Blocked (outside projects/*) ==
  M  README.md
  A  scripts/check-project-publish-guard.py

== Verdict: FAIL ==
```

The publish job must abort. The `blocked_top` list is the
ground-truth list of paths that the current allowlist does not
permit. Either:

- the allowlist is incomplete (add the project to `--allow`), or
- the diff is incorrect (the publish job should not be touching
  these paths — investigate and fix the job).

## Test fixtures

Two fixtures live in `tests/fixtures/`:

- `pages_guard_allowed.diff` — 13 lines, all under
  `projects/artvee-gallery-{demo,digest}/` plus `projects/data.json`.
  Pass with artvee allowlist.
- `pages_guard_blocked.diff` — 12 lines including 3 deletions
  under `projects/wbw-spacex-mars-cn/`, 3 deletions under
  `projects/yang-fudong-fragrant-river/`, and 2 outside
  `projects/`. Fail with artvee allowlist.

Run both with:

```bash
# allowed → exit 0
python3 scripts/check-project-publish-guard.py \
    --mock-diff-file tests/fixtures/pages_guard_allowed.diff \
    --allow projects/artvee-gallery-demo \
    --allow projects/artvee-gallery-digest

# blocked → exit 1
python3 scripts/check-project-publish-guard.py \
    --mock-diff-file tests/fixtures/pages_guard_blocked.diff \
    --allow projects/artvee-gallery-demo \
    --allow projects/artvee-gallery-digest
```

## Recovery playbook

If the guard catches a cross-project deletion **before** it is
pushed:

1. Inspect the blocked list.
2. If the allowlist is incomplete → re-run with the correct `--allow`.
3. If the diff is incorrect (e.g. the publish job accidentally did
   `git add .`) → `git restore --staged <blocked-path>` to unstage
   the affected paths, or fix the job to use explicit paths.
4. Re-run the guard. It should now PASS.
5. Then proceed with `git commit` and `git push`.

If the guard was *not* in place and a cross-project deletion was
**already pushed** to `origin/main` (the 2026-06-15 incident):

1. Identify the last commit on each deleted subtree:
   ```bash
   for c in $(git rev-list HEAD -- projects/<X> | head -50); do
     n=$(git ls-tree -r --name-only "$c" -- projects/<X> | wc -l)
     [ "$n" -gt 0 ] && { echo "$c $n"; break; }
   done
   ```
2. Restore the subtree from that commit:
   ```bash
   git restore --source <source-commit> -- projects/<X>
   ```
3. Commit the restore (one commit per subtree) and push.
4. Verify online with `curl -I`.

The Pages commit history in 2026-06-15 contains the two reference
restores: `a5ad80c Restore Artvee public demos` (P7E+2) and
`31b2ac7 Restore Yang Fudong project page` (YF-RESTORE-1).
