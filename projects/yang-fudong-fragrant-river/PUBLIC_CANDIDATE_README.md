# 杨福东：香河 — 公开安全候选版

**Public-Safe Candidate Version**

**状态：** 非官方学习型草稿 · 公开安全候选版 · noindex  
**用途：** 经过清理的公开发布候选版本，不含任何网上参考图或版权不清晰素材  
**构建时间：** 2026-05-17  
**来源：** `~/conanxin.github.io/drafts/yang-fudong-fragrant-river/` (内部完整版)

---

## 这个目录是什么

这是"杨福东：香河"线上导览草稿的**公开安全候选版本**（Public-Safe Candidate）。

它从内部完整版通过白名单过滤构建，移除了所有版权不清晰的网上参考图、内部媒体 JSON、媒体精选板等，用于评估是否可以接入用户自摄照片后公开发布。

---

## 与内部完整版的区别

| 维度 | 内部完整版 | 公开候选版 |
|------|-----------|-----------|
| 网上参考图 | 28张（已下载到 `assets/online-reference/`） | ❌ 无 |
| 在线媒体 JSON | `online-media-candidates.json` (822条) + `shortlist.json` (30条) | ❌ 无 |
| 媒体精选板 | `media-curation.html` | ❌ 无 |
| 内部参考图模式 | ✅ 支持 `?internalMedia=1` | ❌ 不支持 |
| 远程图片 fallback | app.js 支持 | ❌ 不支持 |
| 作品卡图片优先级 | 自摄 → 内部参考 → SVG 占位 | 自摄 → SVG 占位 |
| 版权风险 | 存在 BLOCKER | 无 BLOCKER（需通过 check 脚本验证）|

---

## 已移除的内容

1. **`assets/online-reference/`** — 56个网上下载图片（已 gitignore，未进入 git）
2. **`data/online-media-candidates.json`** — 822条网上图片元数据
3. **`data/online-media-shortlist.json`** — 30条精选网上图片 URL
4. **`media-curation.html/css/js`** — 媒体精选板入口页面
5. **app.js 中的 `internalMedia` 参数支持** — 无法通过 URL 或 UI 开启内部模式
6. **app.js 中的 `loadMediaData()` / `findCandidateImages()`** — 不再加载任何网上 JSON
7. **index.html 中的"内部参考图模式"开关 UI** — 已移除
8. **Lightbox 的网上图片查看功能** — 仅保留自摄/授权图的 lightbox

---

## 当前仍未公开发布的原因

| 原因 | 说明 |
|------|------|
| 缺少自摄/授权图 | 所有作品卡使用 SVG 占位，缺少真实现场照片 |
| noindex 仍存在 | 页面仍有 `<meta name="robots" content="noindex">`，不会被搜索引擎收录 |
| 文本需人工复核 | 部分 `viewing_tip`、`related_works` 字段为推断内容 |
| 拍摄授权需确认 | 需确认 UCCA 允许参观者拍摄并发布自摄照片 |

---

## 如何预览

```bash
cd ~/conanxin.github.io/drafts/yang-fudong-fragrant-river-public-candidate
python3 -m http.server 8124
```

然后浏览器访问 http://localhost:8124/

---

## 如何接入自摄图

1. **放入照片**到 `assets/inbox/`（文件名需标注内容，例如 `work-02-young-man-01.webp`）
2. **更新 `assets/manifest.json`**，记录照片路径和用途
3. **更新 `data/works.json`**，在对应作品的 `media.thumbnail` 字段填入路径
4. **刷新页面**，作品卡应自动显示真实图片

详见 `SELF_PHOTO_MAPPING_PLAN.md`。

---

## 何时可以考虑公开

满足以下条件后，可考虑从 `drafts/` 迁移到 `projects/` 路径并移除 noindex：

1. ✅ 至少 5 张核心自摄/授权图片已接入
2. ✅ `scripts/check_public_candidate.py` 返回 EXIT CODE 0（无 BLOCKER）
3. ✅ 删除 noindex 或移入 `projects/` 子路径
4. ✅ 所有来源和图片授权已由用户确认
5. ✅ `node --check app.js` 和所有 JSON 验证通过

---

## 构建脚本说明

| 脚本 | 用途 | 运行位置 |
|------|------|---------|
| `scripts/build_public_candidate.py` | 从内部完整版构建候选版 | 原目录 `scripts/` |
| `scripts/check_public_candidate.py` | 检查候选版是否达到公开安全标准 | 候选版 `scripts/` |
| `scripts/prepare_public_release_check.py` | 原版（内部完整版）的公开发布前检查 | 原目录 `scripts/` |

---

## 文件结构

```
yang-fudong-fragrant-river-public-candidate/
├── index.html              主页面（已移除 internalMedia UI，已添加公开候选标注）
├── styles.css              黑白胶片质感样式
├── app.js                  交互逻辑（已移除 internalMedia 相关代码）
├── data/
│   ├── works.json          16件作品数据（无远程图片 URL）
│   ├── sections.json       4个策展章节
│   └── sources.json        来源与版权声明
├── assets/
│   ├── placeholders/       13个原创 SVG 占位图（可公开使用）
│   └── README.md            资产说明
├── scripts/
│   ├── check_public_candidate.py   候选版安全检查
│   ├── build_public_candidate.py   （从原目录复制）
│   ├── prepare_public_release_check.py
│   └── generate_placeholders.py
├── PUBLIC_CANDIDATE_README.md       本文件
├── PUBLIC_CANDIDATE_BUILD_REPORT.md 构建报告
├── SELF_PHOTO_MAPPING_PLAN.md       自摄图映射方案
├── MISSING_SELF_PHOTOS.md          缺自摄图说明
├── MINIMUM_PUBLIC_VERSION_PLAN.md  发布路径方案
├── PUBLICATION_BLOCKERS.md         发布阻断清单
├── PHOTO_SHOT_LIST.md              补拍清单
├── LOCAL_DEMO_GUIDE.md            本地演示说明
├── PROJECT_INDEX.md               项目总览
├── CONTENT_COMPLETENESS_AUDIT.md  内容完整性审计
└── README.md                       总说明文档
```

---

## 版权与边界

- 本页面为**非官方学习型草稿**，不替代 UCCA 官方渠道
- 所有 SVG 占位图为原创，可公开使用
- 页面中的作品信息来自 UCCA 官方公开资料
- 如需观看实体展览，请访问 [UCCA 官方页面](https://ucca.org.cn/en/exhibition/yang-fudong/)
- 页面**不**下载、复制或重新发布展览完整影片