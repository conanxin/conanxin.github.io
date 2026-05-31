# Phase 2D — 独立中文导览页报告

**日期：** 2026-05-31
**状态：** ✅ 完成

## 本阶段目标

创建独立中文导览页 `guide.html`，帮助访问者理解资料库的性质、进入方式和内容结构，作为首页专题路径的静态中文说明补充。

## 新增 / 修改的文件

| 文件 | 操作 |
|---|---|
| `guide.html` | 新增 |
| `index.html` | 修改：在 header 增加「阅读导览」导航链接 |
| `styles.css` | 新增：guide 页专用样式 + header 导航链接样式 |
| `docs/PHASE_2D_GUIDE_PAGE_REPORT.md` | 新增 |

## guide.html 内容结构

| 区块 | 内容 |
|---|---|
| **1. 这是什么地方** | 说明这是中文化策展资料库，区别于普通链接清单 |
| **2. 为什么值得收藏** | 4 个角度：旧互联网原始材料、思考方式、纪录片现场感、中文结构化入口 |
| **3. 第一次来从哪里开始** | 3 种进入方式：专题路径、分类浏览、关键词搜索 |
| **4. 五条专题路径** | 每条含：路径标题、适合谁、目标、建议先看 2–3 条、路径入口链接 |
| **5. 推荐阅读顺序** | 30 分钟快速浏览 / 半天深读 / 一周系统阅读，各给出具体条目建议 |
| **6. 内容状态说明** | verified_embed / verified_source / staging 三种状态解释 |
| **7. 版权与来源说明** | 优先官方来源、不提供盗版片源、争议性文本中性表达 |
| **8. 后续计划** | staging 复核、扩展更多路径、中文导读、主站入口 |

## 首页入口修改

在 `index.html` header 区域新增「📖 阅读导览」导航链接（蓝色圆角药丸样式），指向 `guide.html`。不影响现有搜索、筛选、路径卡片和播放器功能。

## 样式修改

新增 CSS 类（全部在 `styles.css` 末尾）：

- `.guide-nav` — 导览页顶部导航
- `.guide-section` — 导览区块容器
- `.guide-reason-grid` — 理由卡片 2 列网格
- `.guide-entry-grid` — 入口卡片 3 列网格
- `.guide-path-grid` — 路径卡片 2 列网格
- `.guide-route-grid` — 推荐路线 3 列网格
- `.guide-status-grid` — 状态说明 3 列网格
- `.guide-callout` / `.guide-callout-warning` — 提示框
- `.guide-legal-points` / `.guide-legal-item` — 法律说明
- `.guide-roadmap` / `.guide-roadmap-item` — 路线图
- `.header-nav` / `.header-nav-link` — header 导航链接
- 响应式：在 600px 以下全部降为单列

## 是否读取 data/paths.json

否。本阶段纯静态实现，`guide.html` 直接硬编码 5 条路径的中文说明，不动态加载 `paths.json`。路径链接使用静态 hash URL，与 `index.html#path-{id}` 完全兼容。

## 是否修改 items.json

否。本阶段未触碰 `items.json`。

## 校验结果

| 检查项 | 结果 |
|---|---|
| `data/items.json` 合法 JSON | ✅ 74 条 |
| `data/paths.json` 合法 JSON | ✅ 5 条路径 |
| `guide.html` 存在 | ✅ |
| `index.html` 有 guide.html 入口 | ✅ |
| `guide.html` 无外部 CDN | ✅ |
| `index.html` 无外部 CDN | ✅ |
| `app.js` 语法 | ✅ |
| 所有 href 内链存在或合理 | ✅（index.html#path-{id} 为主） |
| 74 条 id 唯一 | ✅ |
| 64 条 verified 均有 curator_note_zh | ✅ |
| paths.json 不引用 staging | ✅ |
| 项目目录无临时文件 | ✅ |

## Git 信息

- **commit hash：** 待 commit 后确认
- **GitHub Pages URL（guide.html）：** https://conanxin.github.io/projects/internet-builder-archive/guide.html

## 下一步建议

1. **Phase 2B（人工）：** 复核 10 条 staging 条目
2. **Phase 2E：** 主站 projects 列表增加本项目入口（需用户确认）
3. **Phase 2F：** 生成中文发布帖 / X 帖子串 / README 展示图