# SITE_DESIGN.md — Conan Xin · 数字花园

> **版本**: 1.0 (2026-10-11)
> **状态**: 全站设计规范 — 跨 Agent / 跨模型的唯一权威
> **视觉权威源**: [`assets/site/design.css`](../assets/site/design.css)(本文件是其规范说明)
> **作用**: 任何在本仓库新增页面、调整共享组件、修复样式偏差时,**必须**先读本文件 + 引用 `assets/site/design.css` 的现有 token。

---

## 1. 站点标识

| 项 | 值 |
|---|---|
| 站名 | **Conan Xin · 数字花园** |
| 主语言 | 简体中文 (`zh-CN`);英文片段可用于标签 / 技术词 / 链接文本 |
| 站点 URL | `https://conanxin.github.io` |
| 视觉气质 | 编辑性、阅读性、研究性;暖白底 + 中文衬线 + 深绿交互 |
| 部署 | GitHub Actions 构建 `.site-build/` → GitHub Pages ([`.github/workflows/pages.yml`](../.github/workflows/pages.yml)) |

---

## 2. 颜色与字体 Token(`:root`)

**全部 token 在 [`assets/site/design.css`](../assets/site/design.css) 的 `:root` 中定义;本节只是说明。**

```
--site-bg:     #f8f7f4   暖白底(全站背景)
--site-paper:  #ffffff   卡片 / 文章正文背景
--site-ink:    #29322e   深墨绿(主文本色)
--site-muted:  #65716a   次要文本色(导航 / 元数据 / 引文弱化)
--site-line:   #deded5   边框 / 分割线 / 弱化背景
--site-green:  #294b40   深绿(链接 / 交互 / 标题下划线 / 主导航 active)
--site-accent: #995b3f   棕色(强调 / 印章红 / 焦点轮廓 / 鼠标 hover)
--site-sans:   "Noto Sans CJK SC", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif
--site-serif:  "Noto Serif CJK SC", "Noto Serif SC", "Songti SC", "STSong", serif
```

`body.site-unified` 还会展开一组内部别名(`--bg-primary`、`--accent-green`、`--ink-charcoal`、`--paper-white` 等)供旧规则引用,但**所有新规则必须直接使用 `--site-*`**。

**Rationing**(全站每页):

| 变量 | 单页使用处上限 | 用途 |
|---|---|---|
| `--site-green` | ≤ 4 | 链接 / 焦点(active state) / 主题装饰 |
| `--site-accent` | = 1 | 印章红 / 焦点轮廓 / 强调 |

---

## 3. 共享组件类(`.site-*` + `body.site-unified`)

`body.site-unified` 由 `scripts/build_site.py` 在 `transform()` 中自动加到 `<body>` 上;同时 `data-site-theme="unified-v1"` + `data-site-kind="<kind>"` 由 `classify()` 决定(`home` `listing` `article` `content` `utility`)。

| 类 | 作用 |
|---|---|
| `.site-skip` | 跳转主内容的无障碍链接(隐藏在 `left: -9999px`,聚焦时显示) |
| `.site-header` / `.site-header__inner` / `.site-brand` / `.site-nav` | 全站顶栏 |
| `.site-breadcrumb` / `.site-local` / `.site-local__links` | 面包屑 + 目录折叠 |
| `.site-heading` | 页面标题区(`.site-heading h1` `.site-heading p`) |
| `.site-button` / `.site-link` | 按钮 / 链接样式 |
| `.site-table-scroll` | 表格横向滚动容器 |
| `.site-section-label` | 段落小标题 |
| `.home-hero` / `.home-feature` / `.home-rows` / `.home-portals` | 首页专用区 |
| `.archive` | 归档页布局 |
| `.site-footer` | 全站页脚 |

`body.site-unified` 全局规则覆盖了:

- 全局字体栈 / 行高 / 颜色 / 抗锯齿
- `<h1>` `<h2>` `<h3>` `<h4>` 中文衬线 + 响应式大小(`h1: clamp(27px, 3.6vw, 42px)`)
- `<a>` `:hover` / `:focus-visible` 颜色 + outline(`2px solid var(--site-accent)`)
- `<input>` `<select>` `<textarea>` `<button>` 字号 / 边框 / 焦点轮廓
- `<pre>` `<code>` 等宽字体;`<pre>` 强制深底色(`#222f29`)白字
- 居中容器宽度(`min(100% - 48px, 1120px)`)
- `.post-article` `.post-content` `.post-header` 长文排版(17px 衬线 + 行高 1.95)

---

## 4. 模板与命令方式(关键)

> ⚠ **当前不存在自动包装内容片段的构建流程。** `scripts/build_site.py` 的 `transform()` 要求每个 HTML 包含完整 `<head>` 与 `<body>`;缺失时返回 `status: 'fragment-unmodified'`,页面不会获得 `body.site-unified`、nav、面包屑、页脚或共享 CSS(见 `build_site.py:141-142`)。

**新增正式网页的标准做法**:

1. **新建完整 HTML 文件**:`<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8"><title>...</title></head><body>...</body></html>`
2. **不要写**(由 `build_site.py` 自动注入 + 清理):
   - `<!DOCTYPE html>` / `<html lang>` / `<head>` / `</head>` / `<body class=...>` / `</body>` 之外的全站框架
   - `<link rel="stylesheet" href="/assets/site/design.css">`(自动注入到 `</head>` 前)
   - `<a class="site-skip">`(自动插入到 `<body>` 后)
   - `<header class="site-header">` / `<footer class="site-footer">`(自动注入 + 折叠遗留 chrome)
   - `<nav class="site-breadcrumb">`(自动注入到 `<body>` 第一个 `<main>` / `<article>` 之后)
   - `class="site-unified"` `data-site-theme="unified-v1"` `data-site-kind="<kind>"`(自动加到 `<body>`)
4. **不要预填占位身份**:`Xin Conan` `hello@xin-conan.me` `https://github.com/xin-conan` 等由 `personalize_site.py` 替换为 `Conan Xin` `conanxin@gmail.com` `https://github.com/conanxin`;源码写旧值即可,不要写"假值"。

**模板来源说明**:

- 本仓库**当前不存在** `templates/site/<kind>/index.html` 等内容片段模板;**当前不存在自动包装内容片段的构建流程**。
- 若未来需要模板,推荐位置:`templates/site/<kind>/<file>.html`(必须是完整 HTML,不是内容片段),globs 在 `.cursor/rules/site-design.mdc` 里覆盖,不要放在 `/design-system/` `/styles/site.css` `/theme/` 等第二套全局样式目录。

---

## 5. 全站样式如何生效(自动注入)

`scripts/build_site.py transform()` 在每个完整 HTML 上做以下动作(摘要,详见 `build_site.py:115-227`):

1. 解析 `<head>` 与 `<body>`;若缺失,标 `fragment-unmodified`,跳过所有后续步骤。
2. `classify(path)` 决定 `data-site-kind`(`home` `listing` `article` `content` `utility`)。
3. 折叠遗留 chrome — 任何 `<header>` / `<nav>` / `<footer>` / `<div>` 含 `CHROME_CLASSES`(`site-header` `site-nav` `site-footer` 等)且不在 `<main>` / `<article>` 之后,标记 `data-site-chrome="legacy"`,在 CSS 里 `display:none`。
4. 在 `</head>` 前注入 `<link rel="stylesheet" href="/assets/site/design.css">` + `<meta name="viewport">`(若缺失)。
5. 在 `<body>` 后注入 `<a class="site-skip">` + `<header class="site-header">` + `<nav class="site-nav">`。
6. 在第一个 `<main>` / `<article>` 之后注入 `<nav class="site-breadcrumb">`。
7. 在 `</body>` 前注入 `<footer class="site-footer">`。
8. 给 `<body>` 加 `class="site-unified"` + `data-site-theme="unified-v1"` + `data-site-kind="<kind>"`。

`scripts/personalize_site.py personalize_html(source + path)` 额外做(详见 `personalize_site.py:41-90`):

1. 用 `IdentityEditor`(`HTMLParser` 子类)扫描可见文本 + `href` / `src` 属性,**仅改写** `Xin Conan → Conan Xin` `hello@xin-conan.me → conanxin@gmail.com` `XIN_CONAN → CONAN_XIN` `@xin-conan → @conanxin` `https://github.com/xin-conan → https://github.com/conanxin`。
2. **PROTECTED tag**(`script` `style` `pre` `code` `textarea` `kbd` `samp`)内文本**完全不动**。
3. 在 `path ∈ {'index.html', 'about.html', 'src/index.html', 'src/about.html'}` 时,额外注入 `<script type="application/ld+json" id="site-person">{Person schema}</script>` 到 `</head>` 前。
4. 给 `<body>` 加 `data-site-identity="conan-xin-v1"`。
5. 在 `<a class="site-brand">` 里写入 `Conan Xin`。
6. `test_idempotence` 保证二次运行结果稳定。

`public_route(path)` 决定哪些页面被构建器当作"读者页面"(`articles/` `posts/` `projects/` `drafts/` `connections/` 等),哪些排除(`src/` `projects/wbw-spacex-mars-cn/source/` `drafts/x/backups/` `projects/yarvin-moldbug-cn/work/` 等)。

---

## 6. 过渡期样式(只读保留)

| 文件 | 状态 |
|---|---|
| `styles/main.css` (449 L) | terminal-dark 遗留;**过渡期保留**,不重设 token,新页面由 `body.site-unified` 通过 `!important` 覆盖显示效果 |
| `styles/post.css` (361 L) | terminal-dark 遗留;同上 |
| `assets/site/design.css` (97 L) | **当前唯一视觉权威**,`:root` token 与 `.site-*` 组件类的真实来源 |
| `docs/taste-rules.md` (7438 B) | 项目级历史专题规范(`projects/wbw-spacex-mars-cn/`);**不**作全站默认 |
| `.cursor/rules/wbw-spacex-mars-cn-taste.mdc` (5001 B) | 项目级历史专题 Cursor 规则,`globs: projects/wbw-spacex-mars-cn/**`;**不**作全站默认 |
| `_config.yml` (1051 B) | Jekyll 时代元数据 + 主题 `jekyll-theme-minimal` + 三插件;根目录有 `.nojekyll`,Jekyll 不运行;本阶段不修改 |
| `Gemfile` (155 B) | Jekyll 依赖(`github-pages` gem);不参与当前发布;本阶段不修改 |

---

## 7. 无障碍(强制)

1. **`:focus-visible` outline** — `body.site-unified` 已设置 `2px solid var(--site-accent)`,`outline-offset: 4px`。**不要** `outline: none` / `outline: 0`,除非提供同等替代视觉。
2. **`<a class="site-skip">`** — 由 `build_site.py` 注入,聚焦时跳到主内容。**不要**删除。
3. **`prefers-reduced-motion`** — 项目级专题(`wbw-spacex-mars-cn`)已有此媒体查询;新页面若加入过渡 / 动画,必须**同时**加 `prefers-reduced-motion: reduce { ... }` 分支。
4. **图片 `alt`** — 已有研究 / 文章 / 项目的 `alt` 不改;新加图片必须 `alt` 非空,装饰图用 `alt=""`。
5. **表格语义** — 长表格放在 `.site-table-scroll` 里以横向滚动;`<th scope="col">` + `<caption>` 保留。

---

## 8. Anti-patterns(禁止)

- ❌ 重新设计站点配色 / 版式
- ❌ 引入与本规范冲突的颜色变量 / 字体 / 装饰 / 导航
- ❌ 创建 `/design-system/`、`/styles/site.css`、独立 `:root` 块、`sd-*` / `theme-*` / `custom-*` 类前缀
- ❌ 引入 web 字体(Google Fonts / 自托管)
- ❌ 修改 `styles/main.css` / `styles/post.css` 现有 token
- ❌ 修改 `assets/site/design.css` 的 `:root` token 名(只允许追加工具类)
- ❌ 重设全站 `body` / 标题 / 导航 / 按钮 / 正文宽度
- ❌ 手写 `<header class="site-header">` / `<footer class="site-footer">` / `<link>` / `.site-skip` / `.site-breadcrumb` / `.site-heading` / 占位身份 — `build_site.py` 会自动注入并清理遗留 chrome
- ❌ 提交内容片段作为公开页(`fragment-unmodified` 也会被复制到 `.site-build/`)
- ❌ 改动已有研究数据 / 引文 / 文章正文 / 专业交互 / 图像
- ❌ 不经用户允许直接 push `main` 或 force push
- ❌ `git add .` / `git add -A`

---

## 9. 专题例外与规则优先级

- **全站规则**(本文件 + `AGENTS.md` + `CLAUDE.md` + `.cursor/rules/site-design.mdc`)始终生效:**站点品牌身份、基本无障碍、引用与数据保护**。
- **经过确认的特殊专题**(目前仅 `.cursor/rules/wbw-spacex-mars-cn-taste.mdc`,`globs` 限定 `projects/wbw-spacex-mars-cn/**`)允许保留**独立主题、排版和阅读模式**;其他 Agent 加载到此规则时,需先识别其 `globs` 范围再决定是否应用。
- **冲突处理**:不同 Agent 同时加载全局规则与项目级专题规则时,必须**识别适用范围**;发生冲突,**报告并请求用户裁决**,不擅自覆盖已有设计。
- **不假定** 加载器对规则的优先级保证(不声称 "globs 越具体越优先" 由 Cursor / 其他工具强制)。

---

## 10. 调用其他 Agent 时传递的规范包

最低传递项:

- 本文件 (`docs/SITE_DESIGN.md`)
- [`assets/site/design.css`](../assets/site/design.css)
- [`scripts/build_site.py`](../scripts/build_site.py)(只读参考)
- [`tests/test_site_identity.py`](../tests/test_site_identity.py)(只读参考)

避免:

- 把 `docs/taste-rules.md` 或 `wbw-spacex-mars-cn-taste.mdc` 当作全站默认传递(它们是项目级专题)
- 把 `_config.yml` `Gemfile` 当作当前发布机制传递(Jekyll OFF)
- 把 `styles/main.css` `styles/post.css` 当作视觉依据(过渡期旧主题)