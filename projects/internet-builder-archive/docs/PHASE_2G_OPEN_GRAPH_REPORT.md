# Phase 2G 报告：Open Graph 与社交分享 meta 标签

**执行时间**：2026-05-31
**Phase**：2G
**Git commit 前置**：9eadc84（Phase 2F）

---

## 本阶段目标

为项目首页 index.html 和导览页 guide.html 增加 Open Graph、Twitter Card 和基础 SEO meta 标签，使项目链接在社交平台和聊天工具中展示更清晰、包含分享卡片预览。

---

## 修改文件列表

| 文件路径 | 修改内容 |
|----------|----------|
| `index.html` | 新增基础 SEO + OG + Twitter Card meta 标签，共 15 行 |
| `guide.html` | 新增基础 SEO + OG + Twitter Card meta 标签，共 15 行 |

---

## index.html 新增 meta 摘要

**基础 SEO**：
- `<title>`：`旧互联网建设者资料库｜Internet Builder Archive`
- `meta description`：一组关于旧互联网、创业公司、公司备忘录、访谈、纪录片、创作者心智与媒介社会的中文化策展资料库。收录 74 条资料，其中 64 条 verified 条目已完成中文策展，包含 31 条可嵌入视频与 5 条专题路径。
- `meta robots`：`index, follow`
- `meta theme-color`：`#0f172a`
- `link canonical`：`https://conanxin.github.io/projects/internet-builder-archive/`

**Open Graph**：
- `og:type`：`website`
- `og:title`：`旧互联网建设者资料库｜Internet Builder Archive`
- `og:description`：一组关于旧互联网、创业公司、公司备忘录、访谈、纪录片、创作者心智与媒介社会的中文化策展资料库。
- `og:url`：`https://conanxin.github.io/projects/internet-builder-archive/`
- `og:image`：`https://conanxin.github.io/projects/internet-builder-archive/assets/iba-share-card.svg`
- `og:image:width`：`1200`
- `og:image:height`：`630`
- `og:site_name`：`Conan Xin Projects`
- `og:locale`：`zh_CN`

**Twitter Card**：
- `twitter:card`：`summary_large_image`
- `twitter:title`：`旧互联网建设者资料库｜Internet Builder Archive`
- `twitter:description`：视频、访谈、纪录片、公司备忘录与创作者心智的中文化策展资料库。
- `twitter:image`：`https://conanxin.github.io/projects/internet-builder-archive/assets/iba-share-card.svg`

---

## guide.html 新增 meta 摘要

**基础 SEO**：
- `<title>`：`旧互联网建设者资料库导览｜如何阅读 Internet Builder Archive`
- `meta description`：这份导览说明如何阅读旧互联网建设者资料库：从专题路径、内容类型、关键词搜索进入，理解创业、技术、媒介、创作者心智与组织战略的资料脉络。
- `meta robots`：`index, follow`
- `meta theme-color`：`#0f172a`
- `link canonical`：`https://conanxin.github.io/projects/internet-builder-archive/guide.html`

**Open Graph**：
- `og:type`：`website`
- `og:title`：`旧互联网建设者资料库导览｜如何阅读 Internet Builder Archive`
- `og:description`：这份导览说明如何阅读旧互联网建设者资料库：从专题路径、内容类型、关键词搜索进入，理解创业、技术、媒介、创作者心智与组织战略的资料脉络。
- `og:url`：`https://conanxin.github.io/projects/internet-builder-archive/guide.html`
- `og:image`：`https://conanxin.github.io/projects/internet-builder-archive/assets/iba-share-card.svg`
- `og:image:width`：`1200`
- `og:image:height`：`630`
- `og:site_name`：`Conan Xin Projects`
- `og:locale`：`zh_CN`

**Twitter Card**：
- `twitter:card`：`summary_large_image`
- `twitter:title`：`旧互联网建设者资料库导览｜如何阅读 Internet Builder Archive`
- `twitter:description`：从专题路径、内容类型、关键词搜索进入，理解创业、技术、媒介、创作者心智与组织战略的资料脉络。
- `twitter:image`：`https://conanxin.github.io/projects/internet-builder-archive/assets/iba-share-card.svg`

---

## 分享卡片 SVG 检查结果

| 检查项 | 结果 |
|--------|------|
| 文件存在 | ✅ `assets/iba-share-card.svg` |
| 尺寸 | ✅ 1200×630 |
| 外部图片引用 | ✅ 无 |
| 外部字体引用 | ✅ 无（仅 `font-family="sans-serif"`） |
| 外部 CSS 引用 | ✅ 无 |
| 外部 JavaScript | ✅ 无 |
| xmlns URI（`http://www.w3.org/2000/svg`）| ✅ SVG 规范必需，无实际外部资源 |

---

## 校验结果

| 检查项 | 结果 |
|--------|------|
| data/items.json 合法 JSON | ✅ |
| data/paths.json 合法 JSON | ✅ |
| 74 条 ID 唯一 | ✅ |
| 64 条 verified 均有 curator_note_zh | ✅ |
| paths.json 不引用 staging | ✅ |
| index.html 存在 og:title | ✅ |
| index.html 存在 og:description | ✅ |
| index.html 存在 og:url | ✅ |
| index.html 存在 og:image | ✅ |
| guide.html 存在 og:title | ✅ |
| guide.html 存在 og:description | ✅ |
| guide.html 存在 og:url | ✅ |
| guide.html 存在 og:image | ✅ |
| index.html 存在 twitter:card | ✅ |
| index.html 存在 twitter:title | ✅ |
| index.html 存在 twitter:description | ✅ |
| index.html 存在 twitter:image | ✅ |
| guide.html 存在 twitter:card | ✅ |
| guide.html 存在 twitter:title | ✅ |
| guide.html 存在 twitter:description | ✅ |
| guide.html 存在 twitter:image | ✅ |
| canonical URL 存在且正确 | ✅ |
| HTML 无新增外部 CDN | ✅ |
| app.js 语法正确 | ✅ |
| 项目目录无 backup/phase*_update.py 文件 | ✅ |

---

## Git 提交信息

**本次 git add 范围**：
```
projects/internet-builder-archive/index.html
projects/internet-builder-archive/guide.html
projects/internet-builder-archive/docs/PHASE_2G_OPEN_GRAPH_REPORT.md
```

**commit message**：`Add Open Graph metadata for internet builder archive`

---

## GitHub Pages 地址

| 资源 | URL |
|------|-----|
| 📂 资料库首页（含 OG/Twitter Card） | https://conanxin.github.io/projects/internet-builder-archive/ |
| 🗺 导览页（含 OG/Twitter Card） | https://conanxin.github.io/projects/internet-builder-archive/guide.html |
| 🎨 分享卡片 SVG | https://conanxin.github.io/projects/internet-builder-archive/assets/iba-share-card.svg |

---

## 下一步建议

| Phase | 内容 | 优先级 |
|-------|------|--------|
| **Phase 2B** | 人工复核 10 条 staging 条目（需用户提供原始截图确认来源和内容） | 高（需用户参与） |
| **Phase 2H** | 为 5 条专题路径各生成独立静态介绍页，提供更详细的路径说明和跳转链接 | 中 |
| **Phase 2I** | 生成 README 展示截图或页面截图，作为发布材料补充 | 中 |

---

## 完成状态

✅ Phase 2G 全部任务完成，所有校验通过，等待用户确认后发布。