# AGENTS.md — conanxin/conanxin.github.io

> **仓库**: `conanxin/conanxin.github.io` — Conan Xin · 数字花园
> **默认语言**: 简体中文 (`zh-CN`);英文片段可用于标签、技术词、链接文本。
> **Agent 主入口**: 本文件 (`AGENTS.md`)
> **工程性约束**: [`CLAUDE.md`](CLAUDE.md)
> **设计规范**: [`docs/SITE_DESIGN.md`](docs/SITE_DESIGN.md)
> **视觉权威源**: [`assets/site/design.css`](assets/site/design.css)

---

## 1. 你来这个仓库做什么

为 `conanxin/conanxin.github.io` **新增页面、维护模板、调整共享组件、修复样式偏差**。
不要重新设计站点配色或版式;不要引入与 [`docs/SITE_DESIGN.md`](docs/SITE_DESIGN.md) 冲突的颜色、字体、装饰或导航。所有视觉决策必须复用 `assets/site/design.css` 中已有的 token 与组件类。

---

## 2. 第一次读这三个文件

| 文件 | 作用 |
|---|---|
| [`AGENTS.md`](AGENTS.md) | 主入口;本文件 |
| [`CLAUDE.md`](CLAUDE.md) | 工程性硬约束 (git、字体、构建、自动化) |
| [`docs/SITE_DESIGN.md`](docs/SITE_DESIGN.md) | 设计 token + 组件类 + 模板与命令方式 |

新页面必须以 `assets/site/design.css` 的现有 `:root` token 为唯一视觉依据。

---

## 3. 默认工作流(新增页面)

1. **选模板** — 使用 `templates/site/{article,project,exhibition,reference}/index.html` 的完整 HTML；参考 `docs/SITE_DESIGN.md` §4。
2. **填内容** — 复制模板,只填本页正文;模板的 head/body/全站导航/页脚/面包屑/CSS 链接不要重复手写。
3. **本地校验** — `python3 -m unittest discover -s tests -p 'test_*.py' -v`；构建后检查 Playwright 浏览器回归。
4. **独立分支提交 PR** — 逐文件暂存，PR 上触发 `pr-checks`（测试、构建、桌面/手机浏览器）；仅 PR 合并到 `main` 后才正式部署。

> ⚠ **当前不存在自动包装内容片段的构建流程。** `scripts/build_site.py` 的 `transform()` 严格要求完整 HTML(`<head>` 与 `<body>` 必须存在);不满足时会返回 `fragment-unmodified`,页面不会获得 `body.site-unified`、导航、面包屑、页脚或共享 CSS。换言之:**新增正式网页必须自行包含完整 HTML、`<head>` 与 `<body>`**;不能直接提交内容片段;**但不得重复手写全站导航、页脚、面包屑和公共 CSS 引用** — 这些由 `scripts/build_site.py` 自动注入;源码中重复会出现两套 chrome。本仓库目前没有 wrapper 替片段自动补全外壳。

---

## 4. 全站导航、面包屑、页脚和公共样式如何出现

由 `scripts/build_site.py` 在 build 时**显式注入**,无需(也不应)在源码中重复手写:

- `<link rel="stylesheet" href="/assets/site/design.css">`
- `<a class="site-skip">`、`<header class="site-header">` (含 `.site-brand` + `.site-nav`)
- `<div class="site-breadcrumb">`
- `<footer class="site-footer">`
- 默认在 `body` 上添加 `class="site-unified"` + `data-site-theme="unified-v1"` + `data-site-kind="<kind>"`。已批准的火星专题主页采用 `project-native` 独立主题，不加 `site-unified`，但保留统一导航/身份/无障碍。

如果源码里手写了 `<header>` / `<footer>` / `<link>` / `.site-skip` / `.site-breadcrumb` / `.site-heading` 与占位身份,**会被 build_site 视作遗留 chrome 自动折叠**,而不是必要的页面结构。

---

## 5. 发布与构建(实际流水线)

当前部署链路(单一来源,见 `.github/workflows/pages.yml`):

```
pull_request → pr-checks (不部署):
  1) python3 -m unittest discover -s tests -p 'test_*.py' -v
  2) scripts/build_site.py → scripts/personalize_site.py
  3) scripts/verify_site_browser.py（Playwright 1440px / 390px）
  4) 上传截图 + JSON 工件

merge to main → deploy:
  1) 相同全量单元测试 → build → personalize → Playwright
  2) upload-pages-artifact: .site-build → deploy-pages
  3) 验证线上公开阅读页、设计样板 /site-guide/
```

- **`_config.yml`** 与 **`Gemfile`** 是 Jekyll 时代遗留(主题 `jekyll-theme-minimal` + `jekyll-feed` / `jekyll-sitemap` / `jekyll-seo-tag`);根目录有 `.nojekyll`,Jekyll 不运行。**当前发布链路不读取它们**(发布链路由 `.github/workflows/pages.yml` 定义的 `tests → build_site.py → personalize_site.py → verify_site_browser.py → deploy-pages` 构成,与 Jekyll 无关);**不声称它们正在生成 RSS 或 sitemap**。本阶段不修改它们。
- **`scripts/build_site.py` 不只转换 `posts/` 或 `articles/`** — 它会遍历仓库里所有 `.html`,除 `{'.git, '.github, '.cursor, '.site-build, 'node_modules, '__pycache__}` 之外的目录都会被处理(`classify()` 按路径返回 kind,默认 `'content'`)。
- **Stage 2A 已排除模板目录** — `templates/` 已从发布输出排除，四类模板只用于复制生成新页面；对应回归测试为 `tests/test_build_templates.py`。但其他技术目录不自动排除；任何直接放进公开目录的 HTML 片段仍有误发布风险。

---

## 6. 不要做的事

- ❌ 重新设计站点配色或版式(请直接复用 `assets/site/design.css` 的 token 与组件类)。
- ❌ 引入与 `docs/SITE_DESIGN.md` 冲突的颜色变量、字体、装饰或导航。
- ❌ 修改 `styles/main.css` / `styles/post.css` 现有 token(过渡期保留,新页面走 `body.site-unified`)。
- ❌ 修改 `assets/site/design.css` 本身的 token 名(新增工具类可以)。
- ❌ 创建 `/design-system/`、`/styles/site.css`、`/theme/` 等第二套全局样式目录或独立 `:root` 块。
- ❌ 引入独立类前缀(`sd-*` `theme-*` `custom-*`)。
- ❌ 引入 web 字体(走系统字体栈,见 `CLAUDE.md`)。
- ❌ 重设全站 `body` / 标题 / 导航 / 按钮 / 正文宽度(用 `.site-<hash>` 局部作用域)。
- ❌ 把 `<header class="site-header">` / `<footer class="site-footer">` / `<link>` / `.site-skip` / `.site-breadcrumb` / `.site-heading` 手写进新页面 — build_site 会自动注入并清理遗留 chrome。新页面的源码直接使用 `Conan Xin` / `conanxin@gmail.com` / `https://github.com/conanxin`;**不要**主动写入 `Xin Conan` / `hello@xin-conan.me` / `https://github.com/xin-conan` 等旧值作为占位——`scripts/personalize_site.py` 仅承担历史页面兼容,不负责新页面身份规范化。
- ❌ 提交内容片段作为公开页(会被 build_site 标 `fragment-unmodified`,但仍在 `.site-build` 中)。
- ❌ 改动已有研究数据、引文、文章正文、专业交互和图像(由现有 7 项 unittest 提供有限覆盖;研究资产的实际修改需走 PR 审阅与人工核对,单元测试不全面验证所有研究正文与数据)。
- ❌ 不经用户允许直接 push `main` 或 force push(详见 `CLAUDE.md`)。

---

## 7. 专题例外与规则优先级(已确认范围)

- **全站规则**(本文件 + `CLAUDE.md` + `docs/SITE_DESIGN.md` + `assets/site/design.css` + `.cursor/rules/site-design.mdc`)始终生效:**站点品牌身份、基本无障碍、引用与数据保护**。
- **经过确认的特殊专题**(目前仅 `.cursor/rules/wbw-spacex-mars-cn-taste.mdc`,`globs` 限定 `projects/wbw-spacex-mars-cn/**`)允许保留**独立主题、排版和阅读模式**;其他 Agent 加载到此规则时,需先识别其 `globs` 范围再决定是否应用。**专题规则描述"设计允许",并不等同于"实际渲染已验证"**: `body.site-unified` 由 `scripts/build_site.py` 自动注入,可能覆盖 `projects/wbw-spacex-mars-cn/` 期望的深色背景与标题样式。**Stage 2B 已在独立分支实施精确路由主题隔离并增加双视口浏览器测试**，以 PR 的 CI 通过状态作为实际渲染验收依据。
- **冲突处理**:不同 Agent 同时加载全局规则与项目级专题规则时,必须**识别适用范围**;发生冲突,**报告并请求用户裁决**,不擅自覆盖已有设计。
- **不假定** 加载器对规则的优先级保证(不声称 "globs 越具体越优先" 由工具强制)。

---

## 8. 历史背景(只读)

`0f85e705` (origin/main HEAD `Personalize Conan Xin profile and clean site-wide reader navigation`,2026-10-11 11:55:08 +0800, ConanXin) 引入了 `assets/site/design.css` + `scripts/build_site.py` + `scripts/personalize_site.py` + `scripts/verify_site_browser.py` + `tests/test_site_identity.py` + `.github/workflows/pages.yml`,构成统一读者阅读全站骨架。Stage 1 任务是为这些脚本**补全规则入口**(本文件 + `CLAUDE.md` + `docs/SITE_DESIGN.md` + `.cursor/rules/site-design.mdc`),不重写它们。