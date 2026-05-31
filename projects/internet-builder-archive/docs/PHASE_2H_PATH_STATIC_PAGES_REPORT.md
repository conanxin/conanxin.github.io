# Phase 2H — 为 5 条专题路径生成独立静态介绍页

**日期**：2026-05-31
**执行状态**：✅ SUCCESS
**Git commit**：待提交

---

## 1. 本阶段目标

为 `data/paths.json` 中的 5 条专题路径各生成一个独立静态 HTML 介绍页，提供可单独分享的专题入口，不依赖首页 hash 路由。

---

## 2. 创建的 5 个路径页面

| 文件路径 | 专题 ID | 中文标题 | 条目数 |
|---------|---------|---------|-------|
| `paths/founder-spirit.html` | founder-spirit | 创始人精神谱系 | 8 |
| `paths/tech-startup-history.html` | tech-startup-history | 技术创业史 | 8 |
| `paths/media-and-society.html` | media-and-society | 媒介、社会与自我 | 8 |
| `paths/creator-mindset.html` | creator-mindset | 创作者心智与长期主义 | 10 |
| `paths/organization-and-strategy.html` | organization-and-strategy | 组织备忘录与战略转折 | 7 |

**同时创建**：
- `paths/index.html` — 专题路径目录索引页

---

## 3. 每个路径页内容结构

每个页面包含：
1. **顶部导航**：返回首页、阅读导览、专题路径
2. **面包屑**：首页 / 专题路径 / 当前路径
3. **英雄区**：标题、副标题、主题标签、受众、预计时间
4. **路径说明**：description_zh + why_this_path_zh
5. **如何使用**：suggested_order_note_zh 整合说明
6. **推荐顺序列表**：逐条展示，包含：
   - 序号（圆形数字标签）
   - 中文标题 + 英文标题
   - 分类、类型、年份、内容形态标签
   - 简短 summary_zh
   - 策展导读 curator_note_zh（侧边栏样式）
   - badge：embed（"▶ 可在资料库嵌入播放"）或 source（"📄 资料来源"）
   - 来源链接 source_url
7. **页脚导航**：返回首页、导览、路径索引
8. **版权说明**：优先官方/可信来源，不提供盗版片源

---

## 4. 每条路径的条目数量

| 路径 ID | 条目数 | verified_embed | verified_source |
|---------|--------|----------------|-----------------|
| founder-spirit | 8 | 4 | 4 |
| tech-startup-history | 8 | 4 | 4 |
| media-and-society | 8 | 3 | 5 |
| creator-mindset | 10 | 5 | 5 |
| organization-and-strategy | 7 | 0 | 7 |
| **合计** | **41** | **16** | **25** |

> 注意：路径之间有重叠条目（如 iba-012 在两个路径中），总路径条目数 41，但 unique 条目 33。

---

## 5. 是否引用 staging

**paths.json 不引用任何 staging 条目**。5 条路径共引用 33 个 unique 条目，全部为 verified 状态（verified_embed 或 verified_source）。staging 条目（iba-013/029/066/073）均未被任何路径引用。

---

## 6. paths.json 修改说明

为每条 path 新增 `page_url` 字段，指向对应的静态页面：
- founder-spirit → `paths/founder-spirit.html`
- tech-startup-history → `paths/tech-startup-history.html`
- media-and-society → `paths/media-and-society.html`
- creator-mindset → `paths/creator-mindset.html`
- organization-and-strategy → `paths/organization-and-strategy.html`

未删除任何已有字段，未修改 item_ids。

---

## 7. 首页和 guide.html 入口修改

### index.html / app.js
- 在 `renderPathCards()` 函数中，每个路径卡片的按钮区域增加"独立页面"链接
- 保留原有的 hash 路由交互（"查看路径"按钮功能不变）
- 新增 `.path-card-actions` 容器，包裹"独立页面"链接 + "查看路径"按钮
- 新增 `.path-card-standalone-btn` 样式（白底蓝框，与主按钮形成层次）

### guide.html
- 在 5 条专题路径卡片的"从这里进入 →"按钮下方，各增加一个"独立页面"按钮
- 样式：次级按钮风格，与主按钮有明显层次区分

---

## 8. meta / OG 标签说明

每个路径页面包含：
- `<title>`：`{路径标题}｜专题路径｜旧互联网建设者资料库`
- `<meta name="description">`：description_zh 前 160 字符
- `<link rel="canonical">`：指向对应 paths/*.html
- `og:title` / `og:description` / `og:url` / `og:image`
- `twitter:card` = `summary_large_image`
- `twitter:title` / `twitter:description` / `twitter:image`
- `og:image` 和 `twitter:image` 统一使用项目分享卡片 SVG

---

## 9. styles.css 修改

新增约 300 行 CSS，定义路径页面专用样式：
- `.path-page` / `.path-hero` / `.path-hero-inner`
- `.path-breadcrumb` / `.path-breadcrumb a`
- `.path-hero-title` / `.path-hero-subtitle`
- `.path-hero-themes` / `.path-theme-tag`
- `.path-hero-meta` / `.path-meta-item`
- `.path-intro` / `.path-intro-inner`
- `.path-description` / `.path-why` / `.path-how-to`
- `.path-sequence` / `.path-sequence-inner`
- `.path-sequence-title` / `.path-sequence-item`
- `.path-step-number`
- `.path-item-content` / `.path-item-header`
- `.path-item-title` / `.path-item-badge`
- `.path-item-badge-embed` / `.path-item-badge-source`
- `.path-item-en` / `.path-item-meta` / `.path-item-tag`
- `.path-item-summary` / `.path-item-curator`
- `.path-item-actions` / `.path-item-src-link`
- `.path-footer-cta` / `.path-footer-links`
- 移动端响应式规则

---

## 10. 校验结果

| 检查项 | 结果 |
|--------|------|
| data/items.json JSON 合法 | ✅ PASS |
| data/paths.json JSON 合法 | ✅ PASS |
| 74 条 id 唯一 | ✅ PASS |
| verified_embed = 31 | ✅ PASS |
| verified_source = 39 | ✅ PASS |
| staging = 4 | ✅ PASS |
| 70 条 verified 均有 curator_note_zh | ✅ PASS |
| paths.json 不引用 staging | ✅ PASS |
| 5 个 paths/*.html 存在 | ✅ PASS |
| 每个路径页不引用 staging 条目 | ✅ PASS |
| 每个路径页有完整 meta（title/description/canonical/og:image/twitter:image） | ✅ PASS |
| index.html 有 5 个独立路径页入口（app.js） | ✅ PASS |
| guide.html 有 5 个独立路径页入口 | ✅ PASS |
| HTML 无外部 CDN 新增 | ✅ PASS |
| app.js 语法正确 | ✅ PASS |
| SVG 无外部资源 | ✅ PASS |
| 项目目录无 items.backup*.json | ✅ PASS |
| 项目目录无 phase*_update.py 临时脚本 | ✅ PASS |

---

## 11. 校验详细数据

```
total=74, verified_embed=31, verified_source=39, staging=4, verified_total=70
unique_ids=True, no_curator=[]
  founder-spirit: 8 items, page_url=paths/founder-spirit.html, staging_refs=[]
  tech-startup-history: 8 items, page_url=paths/tech-startup-history.html, staging_refs=[]
  media-and-society: 8 items, page_url=paths/media-and-society.html, staging_refs=[]
  creator-mindset: 10 items, page_url=paths/creator-mindset.html, staging_refs=[]
  organization-and-strategy: 7 items, page_url=paths/organization-and-strategy.html, staging_refs=[]
  paths/founder-spirit.html: exists=True, size=19587
  paths/tech-startup-history.html: exists=True, size=20017
  paths/media-and-society.html: exists=True, size=20011
  paths/creator-mindset.html: exists=True, size=23766
  paths/organization-and-strategy.html: exists=True, size=18109
  paths/index.html: exists=True
```

---

## 12. Git 状态

修改文件：
- `projects/internet-builder-archive/app.js` — 增加独立页面链接
- `projects/internet-builder-archive/data/paths.json` — 增加 page_url 字段
- `projects/internet-builder-archive/guide.html` — 增加 5 个独立页面入口按钮
- `projects/internet-builder-archive/styles.css` — 新增路径页样式 + 按钮样式

新增文件：
- `projects/internet-builder-archive/paths/founder-spirit.html`
- `projects/internet-builder-archive/paths/tech-startup-history.html`
- `projects/internet-builder-archive/paths/media-and-society.html`
- `projects/internet-builder-archive/paths/creator-mindset.html`
- `projects/internet-builder-archive/paths/organization-and-strategy.html`
- `projects/internet-builder-archive/paths/index.html`
- `projects/internet-builder-archive/docs/PHASE_2H_PATH_STATIC_PAGES_REPORT.md`

---

## 13. 下一步建议

1. **Phase 2B-B2**：用户补充 4 条 P0 截图后处理 remaining staging（iba-013, iba-029, iba-066, iba-073）

2. **Phase 2I**：生成 README 展示截图或页面截图

3. **Phase 2J**（可选）：生成 `sitemap.xml` / `robots.txt`，若主站需要

---

## 14. GitHub Pages 访问地址

| 页面 | URL |
|------|-----|
| 项目首页 | https://conanxin.github.io/projects/internet-builder-archive/ |
| 导览页 | https://conanxin.github.io/projects/internet-builder-archive/guide.html |
| 专题路径 1 | https://conanxin.github.io/projects/internet-builder-archive/paths/founder-spirit.html |
| 专题路径 2 | https://conanxin.github.io/projects/internet-builder-archive/paths/tech-startup-history.html |
| 专题路径 3 | https://conanxin.github.io/projects/internet-builder-archive/paths/media-and-society.html |
| 专题路径 4 | https://conanxin.github.io/projects/internet-builder-archive/paths/creator-mindset.html |
| 专题路径 5 | https://conanxin.github.io/projects/internet-builder-archive/paths/organization-and-strategy.html |
| 路径索引 | https://conanxin.github.io/projects/internet-builder-archive/paths/ |