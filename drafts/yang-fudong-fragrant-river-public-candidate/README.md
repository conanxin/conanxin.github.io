# 杨福东：香河 / Yang Fudong: Fragrant River — 线上导览草稿

**状态：** 非官方学习型草稿（draft · noindex）  
**用途：** 基于公开资料与个人现场观展手册整理的线上回顾导览，不替代官方渠道。  
**创建日期：** 2026-05-16  
**作者：** OpenClaw Agent（按用户指令本地生成）

---

## 页面定位

本页面存放于 GitHub Pages 仓库的 `drafts/` 目录下，**未加入生产索引**，**未推送到公开首页**，**带有 noindex meta**。仅供本地浏览与个人学习回顾。如需参观实体展览，请访问 [UCCA 官方页面](https://ucca.org.cn/en/exhibition/yang-fudong/)。

## 数据来源与校对说明

### 主要来源
1. **UCCA 官方展览页** (`https://ucca.org.cn/en/exhibition/yang-fudong/`) — 展览概述、策展人、装置照片、视频。
2. **UCCA 官方电子手册 PDF** (`yang_fudong_fragrant_river.pdf`) — 16页双语手册，含完整平面图、16件编号作品、四个策展章节、公共项目。
3. **UCCA 作品列表页** (`/en/exhibition/yang-fudong/works/`) — 作品缩略图与基本信息。

### 编号校对结果
以官方 PDF 第4–6页平面图为最终依据：

| 编号 | 作品（中文） | 作品（英文） | 楼层 |
|------|-------------|-------------|------|
| 1 | 少年少年 | Young Man, Young Man | 一层 |
| 2 | 乐郊私语 | Private Notes from a Land of Bliss | 一层 |
| 3 | 善意的谎言之一 | White Lie I | 一层 |
| 4 | 善意的谎言之二 | White Lie II | 一层 |
| 5 | 县长县长 | County Magistrate, County Magistrate | 一层 |
| 6 | 在颐和园 | At the Summer Palace | 一层 |
| 7 | 轻风不动 | Unmoved by Gentle Breezes | 一层 |
| 8 | “香河”系列黑白摄影 | “Fragrant River” Series, Black-and-White Photograph | 二层 |
| 9 | 香河 | Fragrant River | 二层 |
| 10 | 一二五六七：杨福东《香河》纪录片 | Sunday Monday Tuesday Friday Saturday: A Documentary… | 二层 |
| 11 | 哺乳期 | Breastfeeding | 二层 |
| 12 | 青春 | Youth | 二层 |
| 13 | 后房—嘿，天亮了 | Backyard - Hey! Sun is Rising | 二层 |
| 14 | 父亲的烟火 | Father’s Fireworks | 二层 |
| 15 | 新年快乐 | Happy New Year | 二层 |
| 16 | 早期作品 | Early Works | 二层 |

用户提供的初始列表顺序与官方 PDF 基本一致，仅 "早期作品" 与 "后房—嘿，天亮了" 等在二层布局中需以 PDF 平面图为准。上表已按官方平面图校正。

### 四个策展章节
同样以官方 PDF 第8–11页为准：
1. 作为隐喻的“香河” / Xianghe as Metaphor
2. 恍若隔世的意境感 / Out of Place, Out of Time
3. 形式作为叙事 / Form as Narrative
4. 想象中的电影 / The Imagined Film

## 技术栈

- 原生 HTML5 / CSS3 / ES6，无构建系统
- 数据从 `data/*.json` 加载；若 `file://` 遇到 CORS，可用 `python3 -m http.server` 预览
- 响应式布局，移动端友好
- 本地存储：localStorage（观展笔记）

## 本地预览

```bash
cd drafts/yang-fudong-fragrant-river
python3 -m http.server 8123
```

然后访问 http://localhost:8123/

## 版权与边界

- 本页面**不**下载、复制或重新发布展览完整影片。
- 页面中的作品静帧、装置照片**未**直接嵌入；如需观看请前往 UCCA 官方来源。
- 页面视觉元素为基于展览黑白美学风格的 CSS 生成占位图。
- 所有文本为对官方材料的准确改写、摘要与结构化整理，并保留来源链接。
- 页面底部显示完整“资料来源”列表。

## 文件结构

```
drafts/yang-fudong-fragrant-river/
├── index.html          主页面（Hero + 平面图 + 章节 + 笔记 + 来源）
├── styles.css          黑白胶片质感样式
├── app.js              交互逻辑（楼层切换、作品卡、迷宫模式、时间线、笔记）
├── data/
│   ├── works.json      16件作品数据
│   ├── sections.json   4个策展章节
│   └── sources.json    来源与版权声明
└── README.md           本文件
```

## 交互功能清单

### Phase 1（基础骨架）
- [x] 交互式楼层平面图（一层 / 二层切换）
- [x] 作品编号点击高亮 + 右侧/弹窗作品卡
- [x] 主题筛选（关键词 chips）
- [x] 迷宫游览模式：按推荐路线依次走过关键作品
- [x] 时间线模式：1997 构想 → 2016 拍摄 → 2025 完成 → 2025/2026 展出
- [x] 静音/环境声按钮（视觉状态占位，未接入真实音频）
- [x] “我的观展笔记”本地 textarea，保存到 localStorage
- [x] 四个策展章节横向切换/滚动叙事
- [x] 响应式布局，基础 SEO + noindex

### Phase 2A（体验审查 + 多媒体增强准备）
- [x] UX 体验审查报告（UX_AUDIT.md）
- [x] 媒体资产目录结构（assets/images/thumbs/audio/video-placeholders/）
- [x] 资产 README 与命名规则
- [x] works.json 增强：media 字段（thumbnail/images/audio/videoPlaceholder/credit/rightsNote）
- [x] works.json 增强：viewing_tip（现场观看提示）、related_works（关联作品链接）、suggested_duration（停留时间）
- [x] 作品卡“媒体区域”：真实图片优先，否则 CSS 占位图 + 提示文字
- [x] 四条观展路线选择器（初次进入 / 只看《香河》/ 影像迷宫 / 家乡与怀旧）
- [x] 展厅氛围模式切换（正常 / 暗房 / 手册 / 投影）
- [x] 《香河》核心模块：9 个空间 × 15 屏幕的解释性结构图
- [x] 空间节点点击：显示关键词、观看感受、与主题关联
- [x] 作品卡新增：建议停留时间标签、关联作品可点击跳转、现场观看提示框

## 媒体资产状态

| 目录 | 当前状态 | 说明 |
|------|---------|------|
| `assets/images/` | 空 | 等待用户放入现场拍摄的全尺寸照片 |
| `assets/thumbs/` | 空 | 等待用户放入缩略图 |
| `assets/audio/` | 空 | 等待合法音频或环境声 |
| `assets/video-placeholders/` | 空 | 等待视频封面图（不放入完整影片） |

**接入方式：** 按 `assets/README.md` 命名规则放入文件后，在 `data/works.json` 对应作品 `media.thumbnail` 字段填入路径，刷新页面即可自动显示。

## 路线选择器

| 路线 | 覆盖作品 | 适合观众 |
|------|---------|---------|
| 初次进入 | 1–16 | 第一次看展，想完整浏览 |
| 只看《香河》 | 8–12, 14–15 | 时间有限，直奔核心 |
| 影像迷宫 | 1, 5, 6, 9, 10, 13 | 对多频影像、电影语言感兴趣 |
| 家乡与怀旧 | 5, 8, 9, 11, 14, 15 | 对家乡记忆、春节、家庭叙事感兴趣 |

## 展厅氛围模式

| 模式 | 视觉特征 | 体验比喻 |
|------|---------|---------|
| 正常 Normal | 默认暗色 + 暖灰 accent | 走进 UCCA 展厅的初始状态 |
| 暗房 Darkroom | 更暗的背景、更低对比度 | 在《香河》黑白影像迷宫中 |
| 手册 Booklet | 米白纸张色、深色文字 | 像翻阅展览纸质手册 |
| 投影 Projector | 蓝紫色调、屏幕光感 | 被多台投影仪包围的沉浸感 |

## 《香河》9空间结构图

**说明：** 以下空间图为基于展览信息整理的解释性导览，非官方平面图精确复刻。每个空间节点包含：空间编号、屏幕数量、关键词、可能的观看感受、与“春节 / 家乡 / 时间 / 记忆 / 亲属 / 村庄”主题的关系。

- Space 1：入口前厅（1屏）— 迎接、母亲、日常
- Space 2：南向小室（2屏）— 劳作、重复、时间
- Space 3：东向通道（1屏）— 穿行、过渡、迷失
- Space 4：中央大室（3屏）— 春节、仪式、聚集
- Space 5：北向暗室（2屏）— 生老病死、深夜、静默
- Space 6：西向回廊（1屏）— 回声、记忆、往返
- Space 7：上层夹层（2屏）— 俯瞰、全局、 children
- Space 8：下沉凹室（2屏）— 梦境、超现实、裂隙
- Space 9：出口过渡（1屏）— 离别、未完成、开放

## 文件结构（Phase 2A + 2C）

```
drafts/yang-fudong-fragrant-river/
├── index.html              主页面（+ 路线选择器 + 香河核心模块 + 氛围模式 + 内部参考图开关）
├── styles.css              样式（+ 路线卡片 + 空间网格 + 氛围模式 + 媒体占位图）
├── app.js                  交互逻辑（+ 媒体区域 + 路线 + 氛围 + 空间模块 + 内部参考图模式）
├── UX_AUDIT.md             体验审查报告（Phase 2A）
├── ONLINE_MEDIA_SOURCE_AUDIT.md  素材来源审查（Phase 2C）
├── .gitignore              排除网上参考图片目录
├── data/
│   ├── works.json          16件作品（+ media/viewing_tip/related_works/suggested_duration）
│   ├── sections.json       4个策展章节
│   ├── sources.json        来源与版权声明
│   └── online-media-candidates.json  网上素材候选库（822条，仅元数据，不下载图片）
├── scripts/
│   ├── collect_online_media_candidates.py  抓取网上图片候选
│   └── fetch_online_reference_images.py    选择性下载参考图片
├── assets/
│   ├── images/             用户自摄全尺寸照片（待填充）
│   ├── thumbs/             用户自摄缩略图（待填充）
│   ├── audio/              合法音频（待填充）
│   ├── video-placeholders/ 视频封面（待填充）
│   ├── online-reference/     网上下载的参考图片（gitignore，不提交）
│   │   ├── images/         下载的全尺寸参考图
│   │   ├── thumbs/         生成的缩略图
│   │   └── download-log.json
│   └── README.md           媒体资产说明与命名规则
└── README.md               本文件
```

## 仍未完成的部分

- [ ] 真实作品图像（等待用户提供现场照片）
- [ ] 真实音频/环境声（等待合法素材）
- [ ] 公共项目时间线（策展人导览、胶片工作坊等）
- [ ] 艺术家履历详细区域
- [ ] 平面图真实比例与建筑空间标记（入口/出口/楼梯）
- [ ] 移动端 SVG 平面图触控优化（pinch zoom）

## 后续如用户提供现场照片，接入步骤

1. 按 `assets/README.md` 命名规则将照片放入 `assets/images/` 和 `assets/thumbs/`
2. 编辑 `data/works.json`，在对应作品 `media.thumbnail` 字段填入路径
3. 可选：在 `media.images[]` 中添加多张照片路径
4. 刷新 http://localhost:8123/，作品卡将自动显示真实图片
5. 在 `media.credit` 中标注摄影者，在 `media.rightsNote` 中记录授权信息

## Phase 2C：网上素材候选库

### 新增文件
- `data/online-media-candidates.json` — 822条候选记录（来源URL、图片URL、分类、风险级别、目标模块）
- `ONLINE_MEDIA_SOURCE_AUDIT.md` — 素材来源审查文档（来源评级A/B/C/D、版权信息、替换建议）
- `scripts/collect_online_media_candidates.py` — 自动抓取8个来源的图片候选
- `scripts/fetch_online_reference_images.py` — 选择性下载（默认dry-run，--download才执行）
- `.gitignore` — 排除 `assets/online-reference/` 中所有下载的图片

### 素材来源范围
| 来源 | 评级 | 说明 |
|------|------|------|
| UCCA 官方中文/英文页 | A（文字）/ B（图片）| 权威来源，图片需授权 |
| UCCA 作品列表页 | B | 作品静帧缩略图 |
| UCCA 电子手册 PDF | A | 文字参考，图片不提取 |
| 艺术新闻/Art Journal | B | 第三方评论+现场图 |
| ArtReview | B | 英文评论+现场图 |
| CAFA 英文报道 | C | 服务器不稳定，获取失败 |

### 网上素材使用方式
1. **默认不下载**：运行 `python3 scripts/fetch_online_reference_images.py` 仅显示 dry-run 预览
2. **选择性下载**：`python3 scripts/fetch_online_reference_images.py --download --limit 3`
3. **开启内部参考图模式**：在页面 Hero 区勾选"内部参考图模式"，或 URL 加 `?internalMedia=1`
4. **模式激活后**：作品卡自动尝试从候选库匹配对应作品的本地缓存图
5. **橙色提示横幅**：页面上始终显示"当前显示的是内部参考图，仅用于本地学习型草稿，不可公开发布"

### 候选库统计
| 维度 | 数量 |
|------|------|
| 总候选 | 822 |
| UCCA 中文页 | 365 |
| UCCA 英文页 | 348 |
| Art Journal | 52 |
| UCCA 作品页 | 36 |
| ArtReview | 19 |
| PDF来源 | 2 |
| 低风险 | 751 |
| 中风险 | 71 |
| 高风险 | 0 |

### 版权重申
- `assets/online-reference/` 中所有下载图片 **不会进入 Git**
- 公开发布前必须：删除网上参考图 → 替换为用户自摄或授权素材 → 关闭 internalMedia 模式
- 详见 `ONLINE_MEDIA_SOURCE_AUDIT.md`



## Phase 2D：素材精选板 + 质量审查 + Shortlist 接入

### 新增文件
- `data/online-media-shortlist.json` — 30条精选素材（去重、评分、按模块配额限制）
- `ONLINE_MEDIA_QUALITY_AUDIT.md` — 素材质量审查报告（重复分析、映射覆盖、缺图作品）
- `ONLINE_MEDIA_QUALITY_AUDIT.json` — 质量审查统计数据
- `media-curation.html` — 本地素材精选预览页（网格卡片、筛选、搜索、lightbox）
- `media-curation.css` — 精选页样式
- `media-curation.js` — 精选页交互逻辑
- `scripts/curate_online_media_shortlist.py` — 从822条候选精选30条高质量素材

### 质量审查结果
| 指标 | 数值 |
|------|------|
| 原始候选 | 822 |
| 独立 URL | 484 |
| URL 重复 | 338 |
| 文件名去重后 | 175 |
| 可映射到作品 | 130 |
| 最终 Shortlist | 30 |
| 覆盖作品 | 6/16 (01, 05, 06, 09, 15, 16) |
| 缺图作品 | 10/16 (02, 03, 04, 07, 08, 10, 11, 12, 13, 14) |

**关键发现：** UCCA works 页面只展示了约6-7件新作的图片，大量绘画、装置、早期作品和纪录片没有独立图片页面。这是 shortlist 覆盖不足的根本原因。

### 精选流程
1. **重新抓取 works 页面** — 建立精确的 URL → 作品编号映射（119个URL映射）
2. **重新分类** — 822条候选重新映射，130条成功关联到作品
3. **URL 去重** — 484条独立URL
4. **文件名去重** — 175条有意义素材（同一基础图片只保留最高评分变体）
5. **评分排序** — 官方来源(20) + 作品映射(15) + 作品图类型(15) + 有caption(10) + 低风险(10) + 高分辨率(5) - 移动端变体(-3) - 未知分类(-10)
6. **模块配额** — hero(4) + opening-event(4) + per-work(3) + reference-only(10)

### 内部参考图模式更新
- **优先读取 shortlist**：app.js 现在优先从 `data/online-media-shortlist.json` 加载，fallback 到 candidates
- **多图缩略图**：作品卡最多显示3张参考图，主图+缩略图条
- **Lightbox 查看**：点击参考图可打开 lightbox，显示 caption、credit、source、rights_note、internal_reference_only 提示
- **素材精选页**：`media-curation.html` 提供独立的素材管理界面，支持筛选/搜索/复制字段

### 下载统计
- 命令：`python3 scripts/fetch_online_reference_images.py --from-shortlist --download --limit 60 --per-work 2 --risk low`
- 结果：25张新图下载成功，3张已存在跳过，0张失败
- 全部图片存放于 `assets/online-reference/images/` 和 `thumbs/`，被 `.gitignore` 排除

### 缺图作品优先级（建议现场拍摄）
1. Work-02 乐郊私语（绘画装置，网上无图）
2. Work-11 哺乳期（家具装置空间感）
3. Work-09 《香河》各空间照片（Space 1-9）
4. Work-08 黑白摄影墙面排列
5. Work-14 父亲的烟火（2025新作）
6. Work-13 后房—嘿，天亮了（早期作品）

## 免责声明

> 本页面为基于公开资料和用户现场观展手册整理的非官方学习型线上导览草稿，仅供个人研究与回顾使用。所有作品版权归杨福东工作室及相关机构所有。展览信息以 UCCA 官方发布为准。


## Phase 2E：缺图补位 + 自摄优先 + 沉浸式打磨

### 新增内容
- **SVG 占位图（13张）**：10件缺图作品 + 通用占位，黑白胶片质感，明确标注 "Media pending"
- **作品卡媒体区三级优先级**：用户自摄图 → 内部参考图 → SVG 占位图 → 通用 CSS 占位
- **媒体状态标签**：自摄/授权素材、内部参考图、占位视觉
- **线上观展路线（3条）**：30分钟快速 / 《香河》深度 / 家乡母亲春节，含进度显示和一键跳转
- **现场感叙事层**："我在现场如何观看这个展览"—600-900字通用导览体验，5段关联页面模块
- **素材精选板增强**：缺图作品醒目区块、推荐补拍优先级、三种使用建议标签、导出按钮
- **补拍清单 PHOTO_SHOT_LIST.md**：12张最优先图、10件缺图作品补拍表、拍摄注意事项、命名建议

### 占位图状态
| 类型 | 数量 | 说明 |
|------|------|------|
| SVG 占位图 | 13 | 黑白胶片质感， homemade，可提交到 Git |
| 作品卡默认显示 | 缺图作品优先用 SVG 占位 | 不显示空白 |
| 内部参考图 | 28张已下载 | 仅 internalMedia=1 时显示 |
| 用户自摄图 | 0 | 等待用户提供 |

### 线上观展路线
| 路线 | 预计时间 | 覆盖作品 | 特点 |
|------|---------|---------|------|
| 30分钟快速 | 30分钟 | 9, 1, 6, 15 | 抓住核心三件 + 整体氛围 |
| 《香河》深度 | 60分钟 | 9, 8, 10 | 9空间模块 + 纪录片 + 策展章节 |
| 家乡母亲春节 | 45分钟 | 9, 11, 14, 15, 5 | 家庭叙事进入个人记忆版图 |

### 现场感叙事层
页面新增"我在现场如何观看这个展览"通用导览体验文字，5段分别关联首屏、迷宫、少年少年、哺乳期、观展笔记。

## Phase 3A：自摄照片接入 + 最小可公开版准备（2026-05-17）

### 新增文件
- `SELF_PHOTO_MAPPING_PLAN.md` — 自摄图映射方案
- `MINIMUM_PUBLIC_VERSION_PLAN.md` — 最小可公开版方案（4种发布路径）
- `PUBLIC_RELEASE_RISK_SCAN.md` — 公开版风险扫描（4 BLOCKER + 4 WARNING）
- `MISSING_SELF_PHOTOS.md` — 缺自摄图说明 + 最小5张清单
- `scripts/prepare_public_release_check.py` — 公开发布前检查脚本

### BLOCKER 修复优先级（P0）
1. 删除 `media-curation.html/css/js`
2. 不部署 `data/online-media-shortlist.json` 和 `data/online-media-candidates.json`
3. 公开版 app.js 移除 `internalMedia` 相关逻辑

### 发布路径
- 当前（无自摄图）→ 方案 A（drafts/noindex）
- 有 5 张自摄图 → 方案 C（部分自摄 + SVG 占位）
- 有 12+ 张自摄图 → 方案 D（接近完整线上展）

### 低风险修复（已完成）
- ✅ 内部参考图模式提示强化（红色警告框 + 加粗）
- ✅ 底部标注"非官方学习型草稿"更醒目
- ✅ 生成日期更新为 2026-05-17

### 自摄图状态
所有自摄图目录为空，manifest.json 不存在，等待用户提供。详见 `MISSING_SELF_PHOTOS.md`。

---

## 免责声明

> 本页面为基于公开资料和用户现场观展手册整理的非官方学习型线上导览草稿，仅供个人研究与回顾使用。所有作品版权归杨福东工作室及相关机构所有。展览信息以 UCCA 官方发布为准。

