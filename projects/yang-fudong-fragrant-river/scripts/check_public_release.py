#!/usr/bin/env python3
"""
check_public_release.py
正式发布版安全检查脚本

检查正式发布目录是否满足公开发布安全标准。
返回码：0 = PASS, 1 = FAIL
"""

import os
import sys
import json
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent.resolve()
RELEASE_ROOT = SCRIPT_DIR.parent.resolve()

BLOCKERS = []
WARNINGS = []
OK_ITEMS = []

SENSITIVE_STRINGS = [
    "noindex",
    "internalMedia",
    "online-reference",
    "online-media-candidates",
    "online-media-shortlist",
    "media-curation",
]

CANONICAL_EXPECTED = "https://conanxin.github.io/projects/yang-fudong-fragrant-river/"


def check():
    print("=" * 60)
    print("PUBLIC RELEASE CHECK")
    print("=" * 60)
    print(f"Release: {RELEASE_ROOT}")
    print()

    if not RELEASE_ROOT.exists():
        BLOCKERS.append(f"发布目录不存在: {RELEASE_ROOT}")
        return

    # === 1. index.html 检查 ===
    index_html = RELEASE_ROOT / "index.html"
    if index_html.exists():
        content = index_html.read_text(encoding="utf-8", errors="ignore")

        for s in SENSITIVE_STRINGS:
            if s in content:
                BLOCKERS.append(f"index.html 包含敏感词: {s}")

        if 'canonical' in content and CANONICAL_EXPECTED in content:
            OK_ITEMS.append("index.html 包含正确的 canonical 链接")
        else:
            BLOCKERS.append(f"index.html 缺少 canonical: {CANONICAL_EXPECTED}")

        if 'noindex' in content:
            WARNINGS.append("index.html 仍包含 noindex")
        else:
            OK_ITEMS.append("index.html 无 noindex")

    else:
        BLOCKERS.append("index.html 不存在")

    # === 2. app.js 检查 ===
    app_js = RELEASE_ROOT / "app.js"
    if app_js.exists():
        content = app_js.read_text(encoding="utf-8", errors="ignore")

        for s in SENSITIVE_STRINGS:
            if s in content:
                BLOCKERS.append(f"app.js 包含敏感词: {s}")
    else:
        BLOCKERS.append("app.js 不存在")

    # === 3. 禁止文件检查 ===
    for denied in [
        "media-curation.html",
        "media-curation.css",
        "media-curation.js",
        "data/online-media-candidates.json",
        "data/online-media-shortlist.json",
    ]:
        if (RELEASE_ROOT / denied).exists():
            BLOCKERS.append(f"存在禁止文件: {denied}")

    # === 4. assets/online-reference 目录检查 ===
    if (RELEASE_ROOT / "assets/online-reference").exists():
        BLOCKERS.append("存在 assets/online-reference/ 目录")

    # === 5. JSON 数据文件检查 ===
    for json_file in ["data/works.json", "data/sections.json", "data/sources.json"]:
        p = RELEASE_ROOT / json_file
        if p.exists():
            try:
                json.loads(p.read_text(encoding="utf-8"))
                OK_ITEMS.append(f"{json_file} JSON 有效")
            except Exception as e:
                BLOCKERS.append(f"{json_file} JSON 解析失败: {e}")
        else:
            BLOCKERS.append(f"{json_file} 不存在")

    # === 6. JSON 外部 URL 检查 ===
    works_json = RELEASE_ROOT / "data/works.json"
    if works_json.exists():
        import re
        content = works_json.read_text(encoding="utf-8", errors="ignore")
        urls = re.findall(r'https?://[^\s"\']+', content)
        unsafe = [u for u in urls if not any(d in u for d in [
            'ucca.org.cn', 'github.io', 'fonts.googleapis.com', 'fonts.gstatic.com'
        ])]
        if unsafe:
            WARNINGS.append(f"works.json 包含 {len(unsafe)} 个非安全外部 URL")
        else:
            OK_ITEMS.append("works.json 无不安全的外部 URL")

    # === 7. 检查 scripts/ ===
    scripts_dir = RELEASE_ROOT / "scripts"
    if scripts_dir.exists():
        for f in scripts_dir.glob("*"):
            if f.name in ["fetch_online_reference_images.py", "collect_online_media_candidates.py", "curate_online_media_shortlist.py"]:
                BLOCKERS.append(f"scripts/ 包含禁止脚本: {f.name}")


def main():
    check()

    print("✅ OK 项:")
    for item in OK_ITEMS:
        print(f"  ✓ {item}")
    print()

    if WARNINGS:
        print("⚠️  警告项:")
        for item in WARNINGS:
            print(f"  ⚠ {item}")
        print()

    if BLOCKERS:
        print("❌ BLOCKER 项:")
        for item in BLOCKERS:
            print(f"  ✗ {item}")
        print()
        print(f"发现 {len(BLOCKERS)} 个 BLOCKER，{len(WARNINGS)} 个警告项。")
        print("FAIL — 不适合公开发布。")
        sys.exit(1)
    else:
        print(f"✅ PASS — {len(WARNINGS)} 个警告项。")
        print("可以安全公开发布。")
        sys.exit(0)


if __name__ == "__main__":
    main()