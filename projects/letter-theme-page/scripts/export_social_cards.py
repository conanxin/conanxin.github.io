#!/usr/bin/env python3
"""
Export social SVG cards to PNG.
Requires one of: rsvg-convert, inkscape, chromium, google-chrome, playwright
"""

import shutil
import subprocess
import sys
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
SVG_DIR = BASE / "assets" / "social"
PNG_DIR = SVG_DIR / "png"

SVG_FILES = [
    "card-01-letter-as-presence.svg",
    "card-02-qiaopi-not-love-letter.svg",
    "card-03-eight-motifs.svg",
    "card-04-letter-journey.svg",
    "card-05-from-dear-you-to-world.svg",
]


def find_converter():
    for cmd in ("rsvg-convert", "inkscape", "chromium", "google-chrome"):
        if shutil.which(cmd):
            return cmd
    return None


def export_with_rsvg(svg_path: Path, png_path: Path):
    subprocess.run(
        ["rsvg-convert", "-w", "1200", "-h", "1600", "-o", str(png_path), str(svg_path)],
        check=True,
    )


def export_with_inkscape(svg_path: Path, png_path: Path):
    subprocess.run(
        [
            "inkscape",
            str(svg_path),
            "--export-type=png",
            f"--export-filename={png_path}",
            "--export-width=1200",
            "--export-height=1600",
        ],
        check=True,
    )


def export_with_chromium(svg_path: Path, png_path: Path):
    # Minimal headless screenshot via Chromium
    html = f"""<!DOCTYPE html>
<html><head><style>body{{margin:0}}</style></head>
<body><img src="file://{svg_path}" width="1200" height="1600"></body></html>"""
    tmp_html = PNG_DIR / "_tmp_export.html"
    tmp_html.write_text(html, encoding="utf-8")
    cmd = "chromium" if shutil.which("chromium") else "google-chrome"
    subprocess.run(
        [
            cmd,
            "--headless",
            "--disable-gpu",
            "--no-sandbox",
            "--screenshot=" + str(png_path),
            "--window-size=1200,1600",
            str(tmp_html),
        ],
        check=True,
        capture_output=True,
    )
    tmp_html.unlink(missing_ok=True)


def main():
    converter = find_converter()
    if not converter:
        print("=" * 60)
        print("No SVG-to-PNG converter found.")
        print("=" * 60)
        print()
        print("Supported tools (install one to enable PNG export):")
        print("  - librsvg  →  apt install librsvg2-bin   (rsvg-convert)")
        print("  - Inkscape →  apt install inkscape")
        print("  - Chromium →  apt install chromium")
        print()
        print("Alternatively, open the SVG files in a browser and screenshot them:")
        for name in SVG_FILES:
            print(f"  file://{SVG_DIR / name}")
        print()
        print("Or use an online converter such as:")
        print("  - https://cloudconvert.com/svg-to-png")
        print("  - https://convertio.co/svg-png/")
        sys.exit(0)

    PNG_DIR.mkdir(parents=True, exist_ok=True)

    exporters = {
        "rsvg-convert": export_with_rsvg,
        "inkscape": export_with_inkscape,
        "chromium": export_with_chromium,
        "google-chrome": export_with_chromium,
    }
    exporter = exporters[converter]

    print(f"Using converter: {converter}\n")
    for name in SVG_FILES:
        svg_path = SVG_DIR / name
        png_path = PNG_DIR / name.replace(".svg", ".png")
        if not svg_path.exists():
            print(f"SKIP (not found): {name}")
            continue
        print(f"Exporting {name} ...")
        try:
            exporter(svg_path, png_path)
            print(f"  -> {png_path}")
        except Exception as e:
            print(f"  FAILED: {e}")

    print("\nDone.")


if __name__ == "__main__":
    main()
