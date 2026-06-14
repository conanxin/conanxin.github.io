#!/usr/bin/env python3
"""
prepare_public_release_check.py
Phase 3A: 公开发布前检查脚本

检查当前项目是否存在阻塞公开发布的 BLOCKER 项。
不自动删除或修改任何文件，只生成终端报告。

返回码：
  0 — 没有 blocker，可以考虑公开
  1 — 存在 blocker，不适合公开
"""

import os
import sys
import json
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent.resolve()

BLOCKERS = []
WARNINGS = []
OK_ITEMS = []

def check(name, condition, recommendation=""):
    """记录检查结果"""
    if condition:
        OK_ITEMS.append(name)
        return True
    else:
        if recommendation:
            BLOCKERS.append(f"{name}: {recommendation}")
        else:
            BLOCKERS.append(name)
        return False

def warn(name, recommendation=""):
    """记录警告项"""
    if recommendation:
        WARNINGS.append(f"{name}: {recommendation}")
    else:
        WARNINGS.append(name)

def scan():
    print("=" * 60)
    print("PUBLIC RELEASE CHECK")
    print("=" * 60)
    print(f"Project: {PROJECT_ROOT}")
    print()

    # === 1. 检查 online-reference 目录是否被 .gitignore 排除 ===
    gitignore_path = PROJECT_ROOT / ".gitignore"
    if gitignore_path.exists():
        gitignore_content = gitignore_path.read_text()
        online_ref_gitignored = (
            "assets/online-reference/" in gitignore_content
            or "assets/online-reference/images/" in gitignore_content
        )
        check(
            ".gitignore excludes assets/online-reference/",
            online_ref_gitignored,
            "online-reference 目录未被 .gitignore 排除，可能被提交到 git"
        )
    else:
        BLOCKERS.append(".gitignore not found")

    # === 2. 检查 app.js 中的 internalMedia 逻辑 ===
    app_js_path = PROJECT_ROOT / "app.js"
    if app_js_path.exists():
        app_js_content = app_js_path.read_text()
        has_internal_media = "internalMedia" in app_js_content
        check(
            "app.js 无 internalMedia 逻辑",
            not has_internal_media,
            "app.js 仍包含 internalMedia 支持，会暴露内部参考图模式"
        )
    else:
        BLOCKERS.append("app.js not found")

    # === 3. 检查 index.html 中的 noindex ===
    index_html_path = PROJECT_ROOT / "index.html"
    if index_html_path.exists():
        index_content = index_html_path.read_text()
        has_noindex = 'noindex' in index_content
        # noindex 存在是 OK 的，但应该提醒
        if has_noindex:
            warn("index.html 仍包含 noindex", "需要移除才能被搜索引擎收录")
        else:
            OK_ITEMS.append("index.html 无 noindex（可被搜索引擎收录）")
    else:
        BLOCKERS.append("index.html not found")

    # === 4. 检查 online-media-shortlist.json 是否存在 ===
    shortlist_path = PROJECT_ROOT / "data" / "online-media-shortlist.json"
    if shortlist_path.exists():
        warn(
            "data/online-media-shortlist.json 存在",
            "应从公开版中移除，该文件包含网上图片 URL"
        )
    else:
        OK_ITEMS.append("data/online-media-shortlist.json 不存在（安全）")

    # === 5. 检查 online-media-candidates.json ===
    candidates_path = PROJECT_ROOT / "data" / "online-media-candidates.json"
    if candidates_path.exists():
        warn(
            "data/online-media-candidates.json 存在",
            "应从公开版中移除，包含网上素材元数据"
        )
    else:
        OK_ITEMS.append("data/online-media-candidates.json 不存在（安全）")

    # === 6. 检查 media-curation.html 是否存在 ===
    curation_path = PROJECT_ROOT / "media-curation.html"
    if curation_path.exists():
        BLOCKERS.append(
            "media-curation.html 存在: 会暴露内部参考图，应从公开版删除"
        )
    else:
        OK_ITEMS.append("media-curation.html 不存在（安全）")

    # === 7. 检查 media-curation.css ===
    curation_css_path = PROJECT_ROOT / "media-curation.css"
    if curation_css_path.exists():
        BLOCKERS.append(
            "media-curation.css 存在: 应从公开版删除"
        )

    # === 8. 检查 media-curation.js ===
    curation_js_path = PROJECT_ROOT / "media-curation.js"
    if curation_js_path.exists():
        BLOCKERS.append(
            "media-curation.js 存在: 应从公开版删除"
        )

    # === 9. 检查 works.json 中是否有远程图片 URL ===
    works_json_path = PROJECT_ROOT / "data" / "works.json"
    if works_json_path.exists():
        try:
            works = json.loads(works_json_path.read_text())
            # 检查是否有外部 URL
            works_json_str = works_json_path.read_text()
            import re
            remote_urls = re.findall(r'https?://[^\s"\']+', works_json_str)
            # 过滤掉已知的官方域名
            safe_domains = ['ucca.org.cn', 'github.io', 'fonts.googleapis.com']
            unsafe_urls = [
                url for url in remote_urls
                if not any(domain in url for domain in safe_domains)
            ]
            if unsafe_urls:
                warn(
                    f"works.json 包含 {len(unsafe_urls)} 个非官方外部 URL",
                    f"示例: {unsafe_urls[0][:80]}..."
                )
            else:
                OK_ITEMS.append("works.json 无不安全的外部图片 URL")
        except Exception as e:
            warn(f"works.json 解析失败: {e}")
    else:
        BLOCKERS.append("data/works.json not found")

    # === 10. 检查 manifest.json 是否有 online-reference 路径 ===
    manifest_path = PROJECT_ROOT / "assets" / "manifest.json"
    if manifest_path.exists():
        try:
            manifest = json.loads(manifest_path.read_text())
            manifest_str = manifest_path.read_text()
            if "online-reference" in manifest_str:
                BLOCKERS.append(
                    "assets/manifest.json 引用了 online-reference 路径"
                )
            else:
                OK_ITEMS.append("assets/manifest.json 无 online-reference 引用")
        except Exception as e:
            warn(f"assets/manifest.json 解析失败: {e}")
    else:
        OK_ITEMS.append("assets/manifest.json 不存在（无自摄图映射，无风险）")

    # === 11. 检查 .gitignore 是否存在 ===
    if gitignore_path.exists():
        OK_ITEMS.append(".gitignore 存在")
    else:
        BLOCKERS.append(".gitignore 不存在")

    # === 12. 统计在线参考图文件 ===
    online_ref_dir = PROJECT_ROOT / "assets" / "online-reference"
    if online_ref_dir.exists():
        images_count = len(list((online_ref_dir / "images").glob("*"))) if (online_ref_dir / "images").exists() else 0
        thumbs_count = len(list((online_ref_dir / "thumbs").glob("*"))) if (online_ref_dir / "thumbs").exists() else 0
        total = images_count + thumbs_count
        if total > 0:
            warn(
                f"assets/online-reference/ 有 {total} 个文件（{images_count} 图片 + {thumbs_count} 缩略图）",
                "已被 .gitignore 排除，但部署时需确认不会被复制"
            )
    else:
        OK_ITEMS.append("assets/online-reference/ 目录不存在")


def main():
    scan()

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
        print("❌ BLOCKER 项（阻塞公开发布）:")
        for item in BLOCKERS:
            print(f"  ✗ {item}")
        print()
        print(f"发现 {len(BLOCKERS)} 个 BLOCKER，{len(WARNINGS)} 个警告项。")
        print("建议修复后再考虑公开发布。")
        print()
        sys.exit(1)
    else:
        print(f"✅ 无 BLOCKER，{len(WARNINGS)} 个警告项。")
        print("可以继续准备公开发布。")
        print()
        sys.exit(0)


if __name__ == "__main__":
    main()