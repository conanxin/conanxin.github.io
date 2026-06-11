# Artvee Daily Digest

A lightweight public page that surfaces the **latest** Artvee Daily
Digest — a 5-pick per day, fully-deterministic, no-network selection
from a local Artvee Gallery archive.

## What this is

- The latest daily digest (Markdown + HTML + a small landing page).
- 5 curated public-domain artworks, 512-px thumbnails only.
- Source data: [artvee.com](https://artvee.com) (public-domain art).
- Auto-updated by the local Artvee nightly batch chain.

## What this is NOT

- Not the full archive: the local source holds 760+ pieces across
  multiple categories. The digest picks 5 per day.
- Not a redistribution of originals: this page ships only the 5
  referenced 512-px thumbnails (~324 KB total), no full assets,
  no per-piece metadata dumps.
- Not a self-contained dataset: every record keeps its `source_url`,
  so visitors who want the full-resolution piece click through to
  artvee.com.

## File layout

```
projects/artvee-gallery-digest/
├── index.html       (lightweight landing page)
├── digest.html      (latest digest, styled)
├── digest.md        (latest digest, markdown)
├── README.md        (this file)
├── style.css
├── data/
│   └── digests.json (single-entry index, only the latest date)
└── assets/
    └── thumbs/
        └── 512/     (5 files, only the digest's referenced thumbs)
```

## How it works

- The local Artvee pipeline runs at 02:00 Asia/Shanghai via cron
  and calls `scripts/build_artvee_daily_digest.py` after the
  nightly batch completes. The digest writes
  `digests/artvee-digest-YYYY-MM-DD.md` and `.html`.
- After the digest is rebuilt, the maintainer (or a follow-up
  automation) re-runs
  `scripts/export_artvee_digest_public_page.py` to copy the
  latest digest into this static bundle.
- This bundle is then rsynced here.

## See also

- Gallery demo: <https://conanxin.github.io/projects/artvee-gallery-demo/>
- Open-source repository: <https://github.com/conanxin/artvee-gallery>
- Daily digest builder: `scripts/build_artvee_daily_digest.py`
- Public-page exporter: `scripts/export_artvee_digest_public_page.py`

— Built with care, shipped lean.
