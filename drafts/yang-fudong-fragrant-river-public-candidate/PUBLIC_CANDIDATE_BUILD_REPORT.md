# PUBLIC CANDIDATE BUILD REPORT

**构建时间:** 2026-05-17  
**来源目录:** /home/conanxin/conanxin.github.io/drafts/yang-fudong-fragrant-river  
**目标目录:** /home/conanxin/conanxin.github.io/drafts/yang-fudong-fragrant-river-public-candidate

---

## 复制文件 (24)

```
index.html
styles.css
app.js
data/works.json
data/sections.json
data/sources.json
assets/placeholders// (dir)
assets/placeholders/ (dir)
assets/README.md
PHOTO_SHOT_LIST.md
LOCAL_DEMO_GUIDE.md
PROJECT_INDEX.md
MINIMUM_PUBLIC_VERSION_PLAN.md
PUBLICATION_BLOCKERS.md
CONTENT_COMPLETENESS_AUDIT.md
SELF_PHOTO_MAPPING_PLAN.md
MISSING_SELF_PHOTOS.md
README.md
scripts// (dir)
scripts/ (dir)
scripts/generate_placeholders.py
scripts/prepare_public_release_check.py
scripts/build_public_candidate.py
scripts/check_public_candidate.py
```

---

## 跳过文件 (3)

以下文件因版权/安全原因未复制：

```
scripts/fetch_online_reference_images.py
scripts/collect_online_media_candidates.py
scripts/curate_online_media_shortlist.py
```

---

## 错误 (0)

```

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
| 目录创建 | ✅ 成功 |
| 文件复制 | ✅ 完成 |
| 黑名单排除 | ✅ 已执行 |

