#!/usr/bin/env python3
"""Check projects/data.json entry_url values against the Pages source tree.

This is a lightweight source-tree liveness checker for this static GitHub
Pages repo. It does not perform network requests. Instead, it verifies that
catalog URLs point to files or directories that exist in the checked-out tree.

Rules:
- /projects/foo/ -> projects/foo/index.html must exist
- /podcast/foo/ -> podcast/foo/index.html must exist
- /some/file.html -> some/file.html must exist
- ./foo/ inside /projects/ resolves to projects/foo/index.html
- GitHub tree/blob URLs are treated as external repo docs and skipped by default

Usage:
  python3 scripts/check-project-entry-url-liveness.py
  python3 scripts/check-project-entry-url-liveness.py --json
  python3 scripts/check-project-entry-url-liveness.py --allow-broken
"""
from __future__ import annotations

import argparse
import json
import sys
from dataclasses import asdict, dataclass
from pathlib import Path
from urllib.parse import urlparse

SITE_ORIGIN = "https://conanxin.github.io"
CATALOG_PATH = Path("projects/data.json")


@dataclass
class Result:
    slug: str
    title: str
    entry_url: str
    status: str
    expected_path: str
    note: str


def load_catalog(path: Path) -> list[dict]:
    if not path.exists():
        raise SystemExit(f"Missing catalog: {path}")
    return json.loads(path.read_text(encoding="utf-8"))


def normalize_entry_url(entry_url: str) -> tuple[str, str]:
    """Return (kind, path_or_note)."""
    if not entry_url:
        return "missing", "empty entry_url"

    if entry_url.startswith("https://github.com/"):
        return "external-github", "external GitHub URL skipped"

    if entry_url.startswith(SITE_ORIGIN):
        parsed = urlparse(entry_url)
        return "site", parsed.path or "/"

    if entry_url.startswith("http://") or entry_url.startswith("https://"):
        return "external", "external URL skipped"

    if entry_url.startswith("./"):
        # In projects/index.html this resolves relative to /projects/.
        return "site", "/projects/" + entry_url[2:]

    if entry_url.startswith("/"):
        return "site", entry_url

    return "relative", entry_url


def expected_file_for_path(url_path: str) -> Path:
    clean = url_path.split("?", 1)[0].split("#", 1)[0]
    clean = clean.lstrip("/")
    if not clean:
        return Path("index.html")
    if clean.endswith("/"):
        return Path(clean) / "index.html"
    return Path(clean)


def check_entry(entry: dict) -> Result:
    slug = str(entry.get("slug") or "")
    title = str(entry.get("title") or slug or "untitled")
    entry_url = str(entry.get("entry_url") or "")
    kind, value = normalize_entry_url(entry_url)

    if kind in {"external", "external-github"}:
        return Result(slug, title, entry_url, "SKIP", "", value)
    if kind == "missing":
        return Result(slug, title, entry_url, "BROKEN", "", value)

    expected = expected_file_for_path(value)
    if expected.exists():
        return Result(slug, title, entry_url, "OK", str(expected), "exists")
    return Result(slug, title, entry_url, "BROKEN", str(expected), "missing")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--json", action="store_true", help="emit machine-readable JSON")
    parser.add_argument("--allow-broken", action="store_true", help="exit 0 even if broken entries exist")
    args = parser.parse_args()

    catalog = load_catalog(CATALOG_PATH)
    results = [check_entry(entry) for entry in catalog]
    counts = {
        "total": len(results),
        "ok": sum(r.status == "OK" for r in results),
        "broken": sum(r.status == "BROKEN" for r in results),
        "skipped": sum(r.status == "SKIP" for r in results),
    }

    if args.json:
        print(json.dumps({"counts": counts, "results": [asdict(r) for r in results]}, ensure_ascii=False, indent=2))
    else:
        print("== Projects entry URL liveness ==")
        print(f"total={counts['total']} ok={counts['ok']} broken={counts['broken']} skipped={counts['skipped']}")
        print()
        for r in results:
            if r.status != "OK":
                print(f"{r.status:6} {r.slug or r.title}")
                print(f"       entry:    {r.entry_url}")
                if r.expected_path:
                    print(f"       expected: {r.expected_path}")
                print(f"       note:     {r.note}")

    if counts["broken"] and not args.allow_broken:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
