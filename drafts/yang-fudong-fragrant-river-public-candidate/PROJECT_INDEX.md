# 项目总览索引 · Project Index

**项目名称：** 杨福东：香河 / Yang Fudong: Fragrant River — 线上导览草稿  
**状态：** 本地 noindex 草稿 · Phase 3A (自摄照片接入 + 最小可公开版准备)  
**创建日期：** 2026-05-16  
**最后更新：** 2026-05-17  
**作者：** OpenClaw Agent（按用户指令本地生成）

---

## 项目目标

为 UCCA 展览"杨福东：香河 / Yang Fudong: Fragrant River"设计并实现一个高质量、互动式、图文并茂、多媒体导向的在线展览页面。让用户通过浏览网页获得接近现场看展的体验。

---

## 当前版本状态

| 维度 | 状态 | 说明 |
|------|------|------|
| 页面结构 | ✅ 完成 | Hero + 平面图 + 作品卡 + 策展章节 + 时间线 + 笔记 + 来源 |
| 数据完整性 | ✅ 完成 | 16件作品 × 13个字段全部填充 |
| 交互功能 | ✅ 完成 | 楼层切换、主题筛选、路线选择、迷宫游览、氛围模式 |
| 媒体管线 | ✅ 完成 | 用户自摄 → 内部参考 → SVG占位 三级优先级 |
| 素材候选库 | ✅ 完成 | 822条候选 → 30条精选 → 28张已下载 |
| 缺图补位 | ✅ 完成 | 13张SVG占位图覆盖10件缺图作品 |
| 线上观展路线 | ✅ 完成 | 3条路线（30分钟/深度/家乡）|
| 现场感叙事 | ✅ 完成 | "我在现场如何观看"通用导览层 |
| 素材管理 | ✅ 完成 | media-curation.html 精选板 |
| 公开发布 | ❌ 阻断 | 网上参考图需替换为用户自摄/授权素材 |

---

## 文件结构

```
drafts/yang-fudong-fragrant-river/
├── index.html                          主页面（所有section集成）
├── styles.css                          全站样式（黑白胶片质感）
├── app.js                              全站交互逻辑
├── media-curation.html                 素材精选预览页
├── media-curation.css                  精选页样式
├── media-curation.js                   精选页交互
│
├── data/
│   ├── works.json                      16件作品数据（核心数据源）
│   ├── sections.json                   4个策展章节
│   ├── sources.json                    来源与版权声明
│   ├── online-media-candidates.json    822条网上候选（元数据）
│   └── online-media-shortlist.json     30条精选（元数据）
│
├── scripts/
│   ├── collect_online_media_candidates.py   抓取候选脚本
│   ├── fetch_online_reference_images.py     选择性下载脚本
│   ├── curate_online_media_shortlist.py     精选脚本
│   └── generate_placeholders.py             SVG占位图生成脚本
│
├── assets/
│   ├── images/                         用户自摄全尺寸照片（待填充）
│   ├── thumbs/                         用户自摄缩略图（待填充）
│   ├── audio/                          合法音频（待填充）
│   ├── video-placeholders/             视频封面（待填充）
│   ├── placeholders/                   SVG占位图（13张，可提交）
│   └── online-reference/               网上下载参考图（gitignore，28张）
│       ├── images/
│       ├── thumbs/
│       └── download-log.json
│
├── README.md                           项目主文档（含Phase 1-2E记录）
├── UX_AUDIT.md                         体验审查报告
├── CONTENT_COMPLETENESS_AUDIT.md       内容完整性校对
├── PUBLICATION_BLOCKERS.md             发布阻断清单
├── ONLINE_MEDIA_SOURCE_AUDIT.md        素材来源审查
├── ONLINE_MEDIA_QUALITY_AUDIT.md     素材质量审查
├── PHOTO_SHOT_LIST.md                  现场补拍清单
├── LOCAL_DEMO_GUIDE.md                 本地演示说明
├── PROJECT_INDEX.md                    本文件
├── FINAL_REPORT.txt                    最终报告
└── .gitignore                          排除网上参考图片
```

---

## 数据文件说明

| 文件 | 记录数 | 用途 | 可公开？ |
|------|--------|------|---------|
| works.json | 16 works | 核心展览数据 | ✅ 可（内容基于官方资料） |
| sections.json | 4 sections | 策展章节 | ✅ 可（改写自官方） |
| sources.json | 5 sources | 来源标注 | ✅ 可（链接和说明） |
| candidates.json | 822 items | 网上候选元数据 | ⚠️ 作为记录保留，但不加载 |
| shortlist.json | 30 items | 精选元数据 | ⚠️ 作为记录保留，但不加载 |

---

## 交互模块说明

| 模块 | 功能 | 状态 |
|------|------|------|
| Hero | 展览信息、关键词、进入按钮 | ✅ |
| 交互式平面图 | 一层/二层切换、作品编号点击 | ✅ |
| 作品卡 | 媒体区 + 信息字段 + 观看提示 | ✅ |
| 主题筛选 | 关键词chips点击筛选 | ✅ |
| 迷宫游览 | 1→16编号顺序游览 | ✅ |
| 时间线 | 1997-2026 13个节点 | ✅ |
| 策展章节 | 4章节横向滚动 | ✅ |
| 观展笔记 | localStorage自动保存 | ✅ |
| 路线选择器 | 4条路线一键切换 | ✅ |
| 线上观展路线 | 3条路线+进度+跳转 | ✅ |
| 氛围模式 | 正常/暗房/手册/投影 | ✅ |
| 《香河》9空间 | 3×3网格+节点详情 | ✅ |
| 内部参考图 | URL参数/localStorage开关 | ✅ |
| 现场感叙事 | "我在现场如何观看"通用导览 | ✅ |
| 素材精选板 | 独立页面，筛选/搜索/lightbox | ✅ |

---

## 媒体管线说明

**三级优先级（由高到低）：**

1. **用户自摄/授权素材** — `works.json` 中 `media.thumbnail` 指向用户照片
   - 标签："自摄/授权素材"（绿色）
   - 可公开发布 ✅

2. **内部参考图** — `internalMedia=1` 时从 shortlist/candidates 加载
   - 标签："内部参考图 · 不可公开发布"（橙色）
   - 仅限本地预览 ⚠️

3. **SVG 占位图** — 缺图作品的 homemade 占位视觉
   - 标签："占位视觉 · 待补充现场照片"（灰色）
   - 可保留作为降级 fallback ✅

---

## 内部参考图说明

- **来源：** UCCA 官网 + 艺术新闻/ArtReview（共 8 个来源）
- **数量：** 822条候选 → 30条精选 → 28张已下载
- **存储：** `assets/online-reference/`（被 `.gitignore` 排除）
- **标记：** 全部 `internal_use_only=true`, `public_use_allowed=false`
- **激活方式：** URL `?internalMedia=1` 或页面 checkbox
- **使用限制：** 仅供本地学习草稿，正式发布前必须删除

---

## 缺图补位说明

**缺图作品（10件）：**

work-02 乐郊私语、work-03 善意的谎言之一、work-04 善意的谎言之二、
work-07 轻风不动、work-08 "香河"系列黑白摄影、work-10 一二五六七纪录片、
work-11 哺乳期、work-12 青春、work-13 后房—嘿，天亮了、work-14 父亲的烟火

**补位方案：**
- 已创建 13 张 SVG 占位图（10件缺图 + 3张通用）
- 黑白胶片质感，含作品编号+主题词+"Media pending"
- 保证缺图作品媒体区永不空白
- 详细补拍指南见 `PHOTO_SHOT_LIST.md`

---

## 下一步照片导入说明

1. 按 `PHOTO_SHOT_LIST.md` 拍摄现场照片
2. 放入 `assets/images/`（全尺寸）和 `assets/thumbs/`（缩略图）
3. 编辑 `data/works.json`，在对应作品 `media.thumbnail` 填入路径
4. 设置 `media.credit`（如 "Photo by Xin Conan"）
5. 设置 `media.rightsNote`（如 "用户自摄，仅供个人导览"）
6. 刷新页面，作品卡自动显示自摄照片（绿色标签）

---

## 发布路径建议

### 当前状态
- 本地草稿 ✅
- noindex ✅
- 未 stage / 未 commit / 未 push ✅
- drafts/ 路径 ✅

### 发布条件
- 删除 `assets/online-reference/` 所有图片 ✅ 必须
- 填充用户自摄/授权照片 ✅ 必须
- 关闭 internalMedia 模式 ⚠️ 建议
- 核对作品信息准确性 ⚠️ 建议
- 移除 noindex ❓ 可选
- 移出 drafts/ 目录 ❓ 可选

### 最小可发布版本
- 至少 3-5 张核心作品自摄照片
- 删除所有网上参考图
- 关闭内部模式
- 保留 noindex 直到确认无误

---

**项目索引更新日期：** 2026-05-16  
**当前阶段：** Phase 2F (QA + 校对 + 发布阻断审查)  
**下一个阶段建议：** 用户现场拍摄照片 → 填充 media.thumbnail → 运行发布检查 → 决定是否公开上线
