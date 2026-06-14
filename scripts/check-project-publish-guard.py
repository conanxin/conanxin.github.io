#!/usr/bin/env python3
"""check-project-publish-guard.py — Pages Publish Guard.

Shared GitHub Pages repos (one repo, many `projects/<name>/` subtrees) are
fragile: a publish job that does `git add .` or replaces the whole
`projects/` subtree can delete every sibling project in the same push.

This guard enforces an allowlist on the set of paths a publish job is
allowed to touch. It is run BEFORE the publish job's `git add` / commit /
push, against a chosen base (default `origin/main`).

Rules
-----
- The diff is computed as `git diff --name-status <base>...HEAD` plus
  the *working-tree* uncommitted changes (so the guard works in three
  modes: pre-publish / post-`git add` / pre-push).
- Each changed path is classified:
    * `allowed`       — under an `--allow` entry, or `projects/data.json`
                         (catalog entry; see "Catalog" below)
    * `blocked_top`   — under `projects/<X>/...` but `<X>` not in allowlist
    * `blocked_outer` — outside `projects/` entirely (also blocked by
                         default; pass `--allow-outside` to opt out)
- The guard exits 0 only if all changed paths are `allowed`. It exits 1
  on any `blocked` path; the report prints the first 30 blocked samples.

Catalog
-------
`projects/data.json` is the project catalog. The guard treats it as
always-allowed because every project publish needs to update its
`updated` / `summary` field. To forbid catalog updates, pass
`--no-allow-catalog`.

Examples
--------
Artvee publish (current P7E+2 baseline):
    python3 scripts/check-project-publish-guard.py \\
        --base origin/main \\
        --allow projects/artvee-gallery-demo \\
        --allow projects/artvee-gallery-digest

WBW SpaceX Mars publish:
    python3 scripts/check-project-publish-guard.py \\
        --base origin/main \\
        --allow projects/wbw-spacex-mars-cn

Yang Fudong publish:
    python3 scripts/check-project-publish-guard.py \\
        --base origin/main \\
        --allow projects/yang-fudong-fragrant-river

Mock diff (for unit testing without a real commit):
    python3 scripts/check-project-publish-guard.py \\
        --mock-diff-file tests/fixtures/pages_guard_allowed.diff \\
        --allow projects/artvee-gallery-demo \\
        --allow projects/artvee-gallery-digest
"""
from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
from typing import List, Set, Tuple


CATALOG_PATH = "projects/data.json"


def run_git(*args: str, cwd: str) -> str:
    """Run a git command and return stdout. Raises on non-zero exit."""
    res = subprocess.run(
        ["git", *args],
        cwd=cwd,
        capture_output=True,
        text=True,
        check=False,
    )
    if res.returncode != 0:
        raise RuntimeError(
            f"git {' '.join(args)} failed (exit {res.returncode}): {res.stderr.strip()}"
        )
    return res.stdout


def parse_name_status(text: str) -> List[Tuple[str, str]]:
    """Parse `git diff --name-status` output. Lines: 'M\\tpath' or 'A\\tpath' etc.

    Renames produce 'R100\\told\\tnew' — we keep only the new path (column 2).
    Copies produce 'C100\\told\\tnew' — we keep only the new path (column 2).
    """
    out: List[Tuple[str, str]] = []
    for raw in text.splitlines():
        if not raw:
            continue
        parts = raw.split("\t")
        if len(parts) < 2:
            continue
        status = parts[0]
        if status.startswith(("R", "C")) and len(parts) >= 3:
            out.append((status[0], parts[-1]))
        else:
            out.append((status[0], parts[1]))
    return out


def collect_changed_paths(cwd: str, base: str | None) -> List[Tuple[str, str]]:
    """Collect all (status, path) pairs relevant to the guard.

    Sources:
      1. `git diff --name-status <base>...HEAD`  (committed-but-not-pushed)
      2. `git diff --name-status`                (working-tree vs index)
      3. `git diff --name-status --cached`       (index vs HEAD, if no base)

    When `base` is None, sources are (2) and (3). When `base` is set,
    source (1) is also included. Duplicates (same path appearing in
    multiple sources) are deduped while preserving the most severe
    status (D > M > A).
    """
    severity = {"D": 3, "M": 2, "A": 1, "T": 2}
    collected: dict[str, str] = {}

    def add(text: str) -> None:
        for st, path in parse_name_status(text):
            prev = collected.get(path)
            if prev is None or severity.get(st, 0) > severity.get(prev, 0):
                collected[path] = st

    if base:
        add(run_git("diff", "--name-status", f"{base}...HEAD", cwd=cwd))
    add(run_git("diff", "--name-status", cwd=cwd))
    add(run_git("diff", "--name-status", "--cached", cwd=cwd))

    return [(collected[p], p) for p in sorted(collected)]


def load_mock_diff(path: str) -> List[Tuple[str, str]]:
    """Read a fixture file as a `git diff --name-status` body."""
    with open(path, "r", encoding="utf-8") as f:
        return parse_name_status(f.read())


def is_allowed(path: str, allow: Set[str]) -> bool:
    """True if `path` is under any of the allowlist prefixes (exact or dir)."""
    for a in allow:
        if path == a:
            return True
        # allowlist entry is a directory prefix (e.g. "projects/artvee-gallery-demo")
        if path.startswith(a.rstrip("/") + "/"):
            return True
    return False


def classify(changes: List[Tuple[str, str]], allow: Set[str], allow_catalog: bool) -> dict:
    """Classify each change as `allowed` / `blocked_top` / `blocked_outer`."""
    allowed: List[Tuple[str, str]] = []
    blocked_top: List[Tuple[str, str]] = []
    blocked_outer: List[Tuple[str, str]] = []

    effective_allow = set(allow)
    if allow_catalog:
        effective_allow.add(CATALOG_PATH)

    for st, path in changes:
        if is_allowed(path, effective_allow):
            allowed.append((st, path))
        elif path.startswith("projects/") and "/" in path[len("projects/"):]:
            # path is under projects/<X>/... but <X> not in allowlist
            blocked_top.append((st, path))
        else:
            # path is outside projects/ entirely
            blocked_outer.append((st, path))

    return {
        "allowed": allowed,
        "blocked_top": blocked_top,
        "blocked_outer": blocked_outer,
    }


def fmt_sample(samples: List[Tuple[str, str]], n: int = 30) -> str:
    if not samples:
        return "  (none)"
    out: List[str] = []
    for st, p in samples[:n]:
        out.append(f"  {st}  {p}")
    if len(samples) > n:
        out.append(f"  ... and {len(samples) - n} more")
    return "\n".join(out)


def main(argv: List[str] | None = None) -> int:
    p = argparse.ArgumentParser(
        prog="check-project-publish-guard.py",
        description="Guard against cross-project deletions in a shared GitHub Pages repo.",
    )
    p.add_argument(
        "--base",
        default=None,
        help="Git ref to diff against (e.g. origin/main). If omitted, only the "
        "working tree and index are scanned.",
    )
    p.add_argument(
        "--allow",
        action="append",
        default=[],
        help="Allowlist path (may be repeated). A path is allowed if it equals "
        "or is under any allowlist entry. Example: --allow projects/foo",
    )
    p.add_argument(
        "--no-allow-catalog",
        action="store_true",
        help="Disable the implicit allow on projects/data.json (the project catalog).",
    )
    p.add_argument(
        "--allow-outside",
        action="store_true",
        help="Allow changes outside projects/ (e.g. README.md, scripts/). "
        "By default such changes are also blocked.",
    )
    p.add_argument(
        "--mock-diff-file",
        default=None,
        help="Skip git diff and load a fixture file instead (for tests).",
    )
    p.add_argument(
        "--cwd",
        default=None,
        help="Override working directory (default: script's parent).",
    )
    p.add_argument(
        "--json",
        action="store_true",
        help="Emit the full report as JSON instead of human-readable text.",
    )
    args = p.parse_args(argv)

    cwd = args.cwd or os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    if args.mock_diff_file:
        changes = load_mock_diff(args.mock_diff_file)
        base_used = f"<mock-diff-file={args.mock_diff_file}>"
    else:
        changes = collect_changed_paths(cwd, args.base)
        base_used = args.base or "<working-tree-only>"

    allow = set(args.allow)
    classified = classify(changes, allow, allow_catalog=not args.no_allow_catalog)

    if args.allow_outside:
        # Fold blocked_outer back into allowed (without removing the key,
        # so downstream report code can still read the empty list).
        classified["allowed"].extend(classified["blocked_outer"])
        classified["blocked_outer"] = []

    report = {
        "base": base_used,
        "allow": sorted(allow),
        "allow_catalog": not args.no_allow_catalog,
        "allow_outside": args.allow_outside,
        "totals": {
            "changed": len(changes),
            "allowed": len(classified["allowed"]),
            "blocked_top": len(classified["blocked_top"]),
            "blocked_outer": len(classified["blocked_outer"]),
        },
        "blocked_top_samples": classified["blocked_top"][:30],
        "blocked_outer_samples": classified["blocked_outer"][:30],
    }

    if args.json:
        print(json.dumps(report, indent=2, ensure_ascii=False))
    else:
        print("== Pages Publish Guard ==")
        print(f"  base:           {base_used}")
        print(f"  allow:          {sorted(allow) or '(none)'}")
        print(f"  allow_catalog:  {not args.no_allow_catalog}")
        print(f"  allow_outside:  {args.allow_outside}")
        print()
        print("== Totals ==")
        for k, v in report["totals"].items():
            print(f"  {k:14s} {v}")
        print()
        if classified["blocked_top"]:
            print("== Blocked (under projects/* but not in allowlist) ==")
            print(fmt_sample(classified["blocked_top"]))
            print()
        if classified["blocked_outer"]:
            print("== Blocked (outside projects/*) ==")
            print(fmt_sample(classified["blocked_outer"]))
            print()

    blocked_total = report["totals"]["blocked_top"] + report["totals"]["blocked_outer"]
    if blocked_total == 0 and report["totals"]["changed"] > 0:
        verdict = "PASS"
        exit_code = 0
    elif report["totals"]["changed"] == 0:
        # No changes at all — guard has nothing to guard.
        verdict = "PASS (no changes)"
        exit_code = 0
    else:
        verdict = "FAIL"
        exit_code = 1

    if not args.json:
        print(f"== Verdict: {verdict} ==")

    return exit_code


if __name__ == "__main__":
    sys.exit(main())
