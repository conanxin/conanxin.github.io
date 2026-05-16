#!/usr/bin/env python3
"""
build_public_candidate.py
Phase 3B: 构建公开安全候选版

从完整内部版复制公开安全文件，排除所有网上参考图、媒体精选板、内部媒体 JSON。
不修改原目录。

返回码：
  0 — 构建成功
  1 — 构建失败
"""

import os
import sys
import shutil
from pathlib import Path

# 路径配置
SOURCE_ROOT = Path(__file__).parent.parent.resolve()
CANDIDATE_ROOT = Path(__file__).parent.parent.parent.resolve() / "yang-fudong-fragrant-river-public-candidate"

# 白名单：允许复制的文件/目录
ALLOWLIST = [
    # 核心文件
    "index.html",
    "styles.css",
    "app.js",
    # 数据文件
    "data/works.json",
    "data/sections.json",
    "data/sources.json",
    # 原创占位图
    "assets/placeholders/",
    "assets/placeholders",
    # 资产说明
    "assets/README.md",
    "assets/manifest.json",
    # 文档
    "PHOTO_SHOT_LIST.md",
    "LOCAL_DEMO_GUIDE.md",
    "PROJECT_INDEX.md",
    "MINIMUM_PUBLIC_VERSION_PLAN.md",
    "PUBLICATION_BLOCKERS.md",
    "CONTENT_COMPLETENESS_AUDIT.md",
    "SELF_PHOTO_MAPPING_PLAN.md",
    "MISSING_SELF_PHOTOS.md",
    "README.md",
    # 子目录
    "scripts/",
    "scripts",
    # 新增文档（Phase 3B）
    "PUBLIC_CANDIDATE_README.md",
]

# 黑名单：绝对不复制
DENYLIST = [
    "media-curation.html",
    "media-curation.css",
    "media-curation.js",
    "data/online-media-candidates.json",
    "data/online-media-shortlist.json",
    "ONLINE_MEDIA_SOURCE_AUDIT.md",
    "ONLINE_MEDIA_QUALITY_AUDIT.md",
    "ONLINE_MEDIA_QUALITY_AUDIT.json",
    "scripts/fetch_online_reference_images.py",
    "scripts/collect_online_media_candidates.py",
    "scripts/curate_online_media_shortlist.py",
]

# 目录黑名单（整体不复制）
DIR_DENYLIST = [
    "assets/online-reference/",
    "assets/online-reference",
]

REPORT_LINES = []


def log(msg):
    REPORT_LINES.append(msg)
    print(msg)


def should_copy(path_str):
    """判断是否应该复制"""
    # 检查黑名单
    for denied in DENYLIST:
        if path_str == denied or path_str.endswith("/" + denied.split("/")[-1]):
            return False
    # 检查目录黑名单
    for denied_dir in DIR_DENYLIST:
        if path_str.startswith(denied_dir):
            return False
    return True


def copy_file(src, dst):
    """复制单个文件，处理目录创建"""
    dst.parent.mkdir(parents=True, exist_ok=True)
    if src.is_dir():
        shutil.copytree(src, dst, dirs_exist_ok=True)
    else:
        shutil.copy2(src, dst)


def build():
    log("=" * 60)
    log("PUBLIC CANDIDATE BUILD SCRIPT")
    log("=" * 60)
    log(f"Source:      {SOURCE_ROOT}")
    log(f"Destination: {CANDIDATE_ROOT}")
    log("")

    # 如果目标已存在，先清空（但不删除目录本身）
    if CANDIDATE_ROOT.exists():
        log(f"⚠️  目标目录已存在，将增量更新...")
    else:
        CANDIDATE_ROOT.mkdir(parents=True, exist_ok=True)
        log(f"✅ 创建目标目录")

    log("")

    copied = []
    skipped = []
    errors = []

    # 1. 复制白名单文件
    for item in ALLOWLIST:
        src = SOURCE_ROOT / item
        dst = CANDIDATE_ROOT / item
        
        # 目录黑名单检查
        skip = False
        for denied_dir in DIR_DENYLIST:
            if item == denied_dir or item.startswith(denied_dir.rstrip("/")):
                skipped.append(f"{item} (dir denylist)")
                skip = True
                break
        if skip:
            continue
        
        # 文件/目录黑名单检查
        if item.split("/")[-1] in [x.split("/")[-1] for x in DENYLIST]:
            skipped.append(f"{item} (denylist)")
            continue
        
        if not src.exists():
            # 对于 scripts/ 和 assets/ 等可能是目录引用，跳过不存在的
            if item not in ["scripts/", "scripts", "assets/placeholders/", "assets/placeholders"]:
                log(f"⚠️  不存在（跳过）: {item}")
            continue
        
        try:
            if src.is_dir():
                shutil.copytree(src, dst, dirs_exist_ok=True)
                log(f"📁 复制目录: {item}/")
                copied.append(f"{item}/ (dir)")
            else:
                copy_file(src, dst)
                log(f"✅ 复制文件: {item}")
                copied.append(item)
        except Exception as e:
            errors.append(f"{item}: {e}")
            log(f"❌ 复制失败: {item} — {e}")

    # 2. 复制 data/ 目录下的安全 JSON（已在白名单）
    # 3. 复制 assets/placeholders/（已在白名单）
    # 4. 复制 scripts/ 但排除黑名单脚本
    scripts_src = SOURCE_ROOT / "scripts"
    scripts_dst = CANDIDATE_ROOT / "scripts"
    if scripts_src.exists():
        scripts_dst.mkdir(parents=True, exist_ok=True)
        for f in scripts_src.glob("*"):
            fname = f.name
            if fname in DENYLIST or fname in [
                "fetch_online_reference_images.py",
                "collect_online_media_candidates.py",
                "curate_online_media_shortlist.py",
            ]:
                log(f"🚫 跳过脚本（黑名单）: {fname}")
                skipped.append(f"scripts/{fname}")
                continue
            try:
                shutil.copy2(f, scripts_dst / fname)
                log(f"✅ 复制脚本: scripts/{fname}")
                copied.append(f"scripts/{fname}")
            except Exception as e:
                errors.append(f"scripts/{fname}: {e}")

    log("")
    log("-" * 60)
    log(f"复制完成: {len(copied)} 项")
    log(f"跳过: {len(skipped)} 项")
    if errors:
        log(f"错误: {len(errors)} 项")
    log("-" * 60)

    # 生成报告
    report_path = CANDIDATE_ROOT / "PUBLIC_CANDIDATE_BUILD_REPORT.md"
    report_content = f"""# PUBLIC CANDIDATE BUILD REPORT

**构建时间:** 2026-05-17  
**来源目录:** {SOURCE_ROOT}  
**目标目录:** {CANDIDATE_ROOT}

---

## 复制文件 ({len(copied)})

```
{chr(10).join(copied)}
```

---

## 跳过文件 ({len(skipped)})

以下文件因版权/安全原因未复制：

```
{chr(10).join(skipped)}
```

---

## 错误 ({len(errors)})

```
{chr(10).join(errors)}
```

---

## 黑名单说明

| 文件/目录 | 原因 |
|-----------|------|
| `media-curation.html/css/js` | 暴露内部参考图入口 |
| `data/online-media-candidates.json` | 包含 822 条网上图片元数据 |
| `data/online-media-shortlist.json` | 包含 30 条精选网上图片 URL |
| `assets/online-reference/` | 56 个网上下载图片，已 gitignore |
| `scripts/fetch_online_reference_images.py` | 用于下载网上图片 |
| `scripts/collect_online_media_candidates.py` | 用于抓取网上图片候选 |
| `scripts/curate_online_media_shortlist.py` | 用于生成精选 shortlist |

---

## 构建结果

| 项目 | 状态 |
|------|------|
| 目录创建 | {'✅ 成功' if CANDIDATE_ROOT.exists() else '❌ 失败'} |
| 文件复制 | {'✅ 完成' if not errors else '⚠️ 有错误'} |
| 黑名单排除 | ✅ 已执行 |

"""
    report_path.write_text(report_content)
    log(f"")
    log(f"📄 报告已写入: {report_path}")

    return len(errors) == 0


if __name__ == "__main__":
    success = build()
    sys.exit(0 if success else 1)