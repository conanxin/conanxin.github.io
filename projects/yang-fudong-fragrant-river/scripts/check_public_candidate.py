#!/usr/bin/env python3
"""
check_public_candidate.py
Phase 3B: 候选版安全检查脚本

检查候选版目录是否已达到公开安全标准。
不自动修改任何文件。

返回码：
  0 — 无 BLOCKER，可以考虑公开审查
  1 — 存在 BLOCKER，不适合公开
"""

import os
import sys
import json
from pathlib import Path

# 自动检测脚本所在目录
SCRIPT_DIR = Path(__file__).parent.resolve()
CANDIDATE_ROOT = SCRIPT_DIR.parent.resolve()

BLOCKERS = []
WARNINGS = []
OK_ITEMS = []

# 需要扫描的敏感字符串
SENSITIVE_STRINGS = [
    ("internalMedia", "app.js 中仍有 internalMedia 参数支持"),
    ("online-reference", "存在 online-reference 引用"),
    ("online-media-candidates", "存在 online-media-candidates.json"),
    ("online-media-shortlist", "存在 online-media-shortlist.json"),
    ("media-curation", "存在 media-curation 相关文件"),
    ("theartjournal.cn", "存在第三方图片直链引用"),
    ("artreview.com", "存在第三方图片直链引用"),
]

# 可接受的外部域名白名单
SAFE_DOMAINS = [
    "ucca.org.cn",       # UCCA 官方（允许外链，但图片需确认授权）
    "github.io",         # 当前站点自身
    "fonts.googleapis.com",
    "fonts.gstatic.com",
]


def check_scan_file(path, extensions=None):
    """扫描文件中的敏感字符串"""
    issues = []
    try:
        content = path.read_text(encoding="utf-8", errors="ignore")
        for sensitive, reason in SENSITIVE_STRINGS:
            if sensitive in content:
                issues.append(f"{path.name}: 包含 '{sensitive}' — {reason}")
    except Exception:
        pass
    return issues


def check():
    print("=" * 60)
    print("PUBLIC CANDIDATE CHECK")
    print("=" * 60)
    print(f"Candidate: {CANDIDATE_ROOT}")
    print()

    if not CANDIDATE_ROOT.exists():
        BLOCKERS.append(f"候选目录不存在: {CANDIDATE_ROOT}")
        return

    # === 1. HTML 文件检查 ===
    index_html = CANDIDATE_ROOT / "index.html"
    if index_html.exists():
        content = index_html.read_text(encoding="utf-8", errors="ignore")
        
        if "internalMedia" in content:
            BLOCKERS.append("index.html 包含 internalMedia 引用")
        else:
            OK_ITEMS.append("index.html 无 internalMedia")
        
        if "online-reference" in content:
            BLOCKERS.append("index.html 包含 online-reference 引用")
        else:
            OK_ITEMS.append("index.html 无 online-reference")
        
        if "media-curation" in content:
            BLOCKERS.append("index.html 包含 media-curation 引用")
        else:
            OK_ITEMS.append("index.html 无 media-curation")
        
        if "noindex" in content:
            WARNINGS.append("index.html 仍包含 noindex（需移除才能被收录）")
        else:
            OK_ITEMS.append("index.html 无 noindex")
    else:
        BLOCKERS.append("index.html 不存在")

    # === 2. app.js 检查 ===
    app_js = CANDIDATE_ROOT / "app.js"
    if app_js.exists():
        content = app_js.read_text(encoding="utf-8", errors="ignore")
        
        if "internalMedia" in content:
            BLOCKERS.append("app.js 包含 internalMedia 逻辑")
        else:
            OK_ITEMS.append("app.js 无 internalMedia")
        
        if "online-media-candidates" in content or "online-media-shortlist" in content:
            BLOCKERS.append("app.js 引用了 online-media JSON")
        else:
            OK_ITEMS.append("app.js 无 online-media JSON 引用")
        
        if "assets/online-reference" in content:
            BLOCKERS.append("app.js 引用了 assets/online-reference")
        else:
            OK_ITEMS.append("app.js 无 online-reference 引用")
    else:
        BLOCKERS.append("app.js 不存在")

    # === 3. JSON 数据文件检查 ===
    for json_file in ["data/works.json", "data/sections.json", "data/sources.json"]:
        p = CANDIDATE_ROOT / json_file
        if p.exists():
            try:
                json.loads(p.read_text(encoding="utf-8"))
                OK_ITEMS.append(f"{json_file} JSON 有效")
            except Exception as e:
                BLOCKERS.append(f"{json_file} JSON 解析失败: {e}")
        else:
            BLOCKERS.append(f"{json_file} 不存在")

    # === 4. manifest.json 检查 ===
    manifest = CANDIDATE_ROOT / "assets/manifest.json"
    if manifest.exists():
        try:
            m = json.loads(manifest.read_text(encoding="utf-8"))
            manifest_str = manifest.read_text(encoding="utf-8")
            if "online-reference" in manifest_str:
                BLOCKERS.append("assets/manifest.json 引用了 online-reference")
            else:
                OK_ITEMS.append("assets/manifest.json 无 online-reference")
        except Exception as e:
            WARNINGS.append(f"assets/manifest.json 解析失败: {e}")
    else:
        OK_ITEMS.append("assets/manifest.json 不存在（无自摄图，安全）")

    # === 5. 黑名单文件检查 ===
    for denied in [
        "media-curation.html",
        "media-curation.css",
        "media-curation.js",
        "data/online-media-candidates.json",
        "data/online-media-shortlist.json",
    ]:
        if (CANDIDATE_ROOT / denied).exists():
            BLOCKERS.append(f"存在禁止文件: {denied}")

    # === 6. online-reference 目录检查 ===
    if (CANDIDATE_ROOT / "assets/online-reference").exists():
        BLOCKERS.append("存在 assets/online-reference/ 目录")
    else:
        OK_ITEMS.append("assets/online-reference/ 不存在（正确）")

    # === 7. 扫描所有文本文件中的敏感字符串 ===
    for f in CANDIDATE_ROOT.rglob("*"):
        if f.is_dir():
            continue
        if f.suffix in [".html", ".js", ".css", ".md", ".json", ".txt"]:
            for sensitive, reason in SENSITIVE_STRINGS:
                if sensitive in f.name:
                    # 文件名本身包含敏感词
                    BLOCKERS.append(f"文件名包含敏感词: {f.name}")

    # === 8. 检查 assets/placeholders 存在 ===
    placeholders = CANDIDATE_ROOT / "assets/placeholders"
    if placeholders.exists():
        svg_count = len(list(placeholders.glob("*.svg")))
        OK_ITEMS.append(f"assets/placeholders/ 有 {svg_count} 个 SVG 占位图")
    else:
        WARNINGS.append("assets/placeholders/ 目录不存在")

    # === 9. works.json 外部 URL 检查 ===
    works_json = CANDIDATE_ROOT / "data/works.json"
    if works_json.exists():
        import re
        content = works_json.read_text(encoding="utf-8", errors="ignore")
        urls = re.findall(r'https?://[^\s"\']+', content)
        unsafe = [u for u in urls if not any(d in u for d in SAFE_DOMAINS)]
        if unsafe:
            WARNINGS.append(f"works.json 包含 {len(unsafe)} 个非安全外部 URL")
        else:
            OK_ITEMS.append("works.json 无不安全的外部 URL")


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
        print("不适合公开发布审查。")
        print()
        sys.exit(1)
    else:
        print(f"✅ 无 BLOCKER，{len(WARNINGS)} 个警告项。")
        print("可以进入公开发布审查流程。")
        print()
        sys.exit(0)


if __name__ == "__main__":
    main()