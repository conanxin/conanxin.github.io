# Artvee Gallery Demo

A lightweight public demo exported from a local Artvee Library.

## What this is

- 100 curated public-domain artworks from [Artvee](https://artvee.com).
- Four categories evenly represented (25 per category):
  - Japanese prints (浮世绘 / 大正昭和风景)
  - Botanical charts (Redouté 百合图谱等)
  - Book illustrations (Arthur Rackham, Kay Nielsen)
  - Poster design (Alphonse Mucha, Jules Chéret)
- Each piece includes title, artist, source link back to artvee.com.
- Selection strategy: `diverse` — round-robin across the 4 categories so the demo
  shows a balanced first impression instead of "whatever was added most recently".

## What this is NOT

- Not the full archive: the local source holds 740+ pieces across multiple categories.
- Not a redistribution of originals: this demo ships only 256-px and 512-px
  thumbnails (~5.7 MB total), no 1.4 GB originals, no per-piece metadata dumps.
- Not a self-contained dataset: every record keeps its `source_url`, so visitors
  who want the full-resolution piece click through to artvee.com.

## How it works

- Static HTML/CSS/JS only. No framework, no build step.
- `fetch("data/artworks.json")` is the single data dependency.
- Deployable on any static host: GitHub Pages, Cloudflare Pages, COS, nginx.

## File layout

```
projects/artvee-gallery-demo/
├── index.html
├── app.js
├── style.css
├── README.md
├── data/
│   ├── artworks.json          (100 records)
│   └── gallery_stats.json     (demo-level stats + source meta)
└── assets/
    └── thumbs/
        ├── 256/               (100 files)
        └── 512/               (100 files)
```

## Source

Exported on 2026-06-11 from a private local archive of 740+ Artvee pieces
across 4 categories, via `export_artvee_gallery_public_demo.py --strategy diverse`.

If you want the full dataset, please visit [artvee.com](https://artvee.com) directly
and respect their licensing terms.

— Built with care, shipped lean.