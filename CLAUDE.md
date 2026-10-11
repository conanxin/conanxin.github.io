# CLAUDE.md — conanxin/conanxin.github.io

> **仓库**: `conanxin/conanxin.github.io` (Conan Xin · 数字花园)
> **Agent 主入口**: [`AGENTS.md`](AGENTS.md)
> **设计规范**: [`docs/SITE_DESIGN.md`](docs/SITE_DESIGN.md)
> **视觉权威源**: [`assets/site/design.css`](assets/site/design.css)
> **本文件只列工程性约束**,不维护设计规则。

---

## 1. 当你在本仓库工作时

1. **Per-file `git add`** — 永远不要 `git add .` 或 `git add -A`。本仓库 `projects/` `drafts/` `research-terminal/` 等目录下有大量子项目,选择性暂存避免误带无关改动。
2. **不引入 web 字体** — 系统字体栈 (`Noto Sans CJK SC`, `Noto Serif CJK SC`, `PingFang SC`, `Microsoft YaHei`) 是中文优先内容站点的正确选择;不提议 Google Fonts 或自托管 web 字体。
3. **不重设全站 `body` / 标题 / 导航 / 按钮 / 正文宽度** — 走 [`assets/site/design.css`](assets/site/design.css) 的 `.site-*` 共享类与 `body.site-unified` 全局规则。需要特殊布局时用**局部作用域**(页内 `<style>` 或局部 class 前缀),不污染其他页面。
4. **新增正式网页 = 完整 HTML 文档**(必须包含 `<head>` 与 `<body>`) — `scripts/build_site.py` 的 `transform()` 在缺失 `<head>` / `<body>` 时返回 `status: 'fragment-unmodified'`,页面不会获得 `body.site-unified`、nav、面包屑、页脚或共享 CSS。**当前不存在自动包装内容片段的构建流程**;不能提交内容片段作为公开页。
5. **不要手写全站结构** — `<header class="site-header">` / `<footer class="site-footer">` / `<link rel="stylesheet" href="/assets/site/design.css">` / `.site-skip` / `.site-breadcrumb` / `.site-heading` 由 `scripts/build_site.py` 自动注入,源码中重复会出现两套 chrome。**不要**主动写入 `Xin Conan` / `hello@xin-conan.me` / `https://github.com/xin-conan` 等旧值作为占位身份——新页面的源码直接使用 `Conan Xin` / `conanxin@gmail.com` / `https://github.com/conanxin`;`scripts/personalize_site.py` 仅承担历史页面兼容。
6. **不要创建第二套全站样式系统** — 不新建 `/design-system/`、`/styles/site.css`、独立的 `:root` 块、不引入 `sd-*` `theme-*` `custom-*` 类前缀。
7. **不要修改 `styles/main.css` / `styles/post.css` 现有 token**(过渡期旧主题保留,新页面走 `body.site-unified`)。
8. **不要改动已有研究数据 / 引文 / 文章正文 / 专业交互 / 图像** — `tests/test_site_identity.py` 的 `test_research_titles_dates_and_links_unchanged` 等会强制保护。
9. **不要直接 push `main` 或 force push**(除非用户明确同意);see 5.

---

## 2. 构建与发布机制

实际流水线(`.github/workflows/pages.yml`):

```
1) python3 -m unittest discover -s tests -p test_site_identity.py -v
2) python3 scripts/build_site.py --output .site-build
3) python3 scripts/personalize_site.py .site-build
4) (commit msg 含 'site-wide' OR workflow_dispatch)
   python3 scripts/verify_site_browser.py .site-build
5) upload-pages-artifact (.site-build)
6) deploy-pages
```

- **`scripts/build_site.py` 不只转换 `posts/` 或 `articles/`** — 它遍历仓库所有 `.html`,除 `{.git, .github, .cursor, .site-build, node_modules, __pycache__}` 之外都会被 `transform()` 处理(默认 `kind: 'content'`)。**内容片段 / `templates/` / `design-system/` 等目录不会被构建器自动排除**;一旦推上 main,就会被复制到 `.site-build/` 并以某种状态公开(可能是 `themed` 也可能是 `fragment-unmodified`)。
- **`scripts/personalize_site.py` 的 Person JSON-LD 只在指定路径注入** — 当前规则:`{'index.html', 'about.html', 'src/index.html', 'src/about.html'}`;其他路径不会注入 `<script type="application/ld+json" id="site-person">`(见 `personalize_site.py:85`)。
- **`_config.yml` 与 `Gemfile`** 是 Jekyll 时代遗留(主题 `jekyll-theme-minimal` + 三个插件 + `github-pages` gem);根目录有 `.nojekyll`(0 字节,Mar 31 2026),Jekyll 不运行。它们只影响 RSS / sitemap 等元数据,**不参与**当前发布。本阶段不修改它们。

---

## 3. 文档维护规则

- `assets/site/design.css` 的 `:root` token 名与 `.site-*` 共享组件类一旦写入,**禁止改名 / 删除**;只允许追加新工具类。命名空间保留作未来扩展。
- 修改 `scripts/build_site.py` / `scripts/personalize_site.py` / `scripts/verify_site_browser.py` 前,必须先在 `tests/test_site_identity.py`(或其他 `tests/test_*.py`)新增或更新对应 unittest,确保 CI 拦截回归。
- 任何 Agent 引入新的"全站级"颜色 / 字体 / 间距 / 装饰之前,**先读** [`docs/SITE_DESIGN.md`](docs/SITE_DESIGN.md) + [`assets/site/design.css`](assets/site/design.css) 是否已支持;若没有,**先**在 `assets/site/design.css` 里加工具类,不要在页面里 inline。

---

## 4. 专题例外与规则优先级

- **全站规则**(本文件 + `AGENTS.md` + `docs/SITE_DESIGN.md` + `.cursor/rules/site-design.mdc`)始终生效:**站点品牌身份、基本无障碍、引用与数据保护**(`scripts/personalize_site.py` + `tests/test_site_identity.py` 强制)。
- **经过确认的特殊专题**(目前仅 `.cursor/rules/wbw-spacex-mars-cn-taste.mdc`,`globs` 限定 `projects/wbw-spacex-mars-cn/**`)允许保留**独立主题、排版和阅读模式**。该规则的适用范围由其自身 `globs` 字段声明,不与全站规则冲突。**专题规则描述"设计允许",并不等同于"实际渲染已验证"**: `body.site-unified` 由 `scripts/build_site.py` 自动注入,可能覆盖 `projects/wbw-spacex-mars-cn/` 期望的深色背景与标题样式。**这是 Stage 2 需要验证的视觉兼容问题**,本 Stage 1 不修改 CSS、不调整注入策略。
- **不同 Agent 同时加载全局规则与项目级专题规则时**,必须**识别适用范围**;`projects/wbw-spacex-mars-cn/` 内**允许**深色 + 玻璃效果 + 字体大标题(实际渲染是否如预期,在 Stage 2 验证),但**不能**修改全站 `assets/site/design.css` 的 `:root` token,不能绕过 `personalize_site.py` 的身份规范化,不能破坏研究正文 + 引用 + 数据。
- **冲突处理**:发生冲突,**报告并请求用户裁决**,不擅自覆盖已有设计。
- **不假定** 加载器对规则的优先级保证(不声称 "globs 越具体越优先" 由 Cursor / 其他工具强制)。

---

## 5. Git 行为

- `git add` 永远 per-file;不 `git add .` / `git add -A` / `git add --all`。
- `git commit` 时,消息明确说明:
  - 涉及的目录与文件
  - 是否影响全站视觉 / 构建 / 测试 / 旧资产
- `git push` 默认**只推独立审阅分支**(如 `review/<topic>`);**禁止** `git push origin main` **或** `git push --force` 或 `git push --force-with-lease`,除非用户明确同意。
- `git reset --hard` 在本仓库默认禁止;修复错误用 amend / revert / 修正再提交。
- `restore` / `rm` / 移动已存在的研究资产(`articles/` `projects/` `posts/` `research/` `drafts/` `future/` `research-terminal/` 等)默认禁止;如有需要,先备份到 `archive/` 子目录。

---

## 6. 测试与 CI

- `tests/test_site_identity.py` (53 L) 是 `scripts/personalize_site.py` 的单元测试入口,**覆盖范围有限**——主要验证 `personalize_html()` 的身份规范化(PROTECTED tag 保护、可见文本改写、Person JSON-LD 路径条件、幂等性、`public_route()` 排除列表)。**它不全面验证所有研究正文与数据**:研究标题 / 日期 / 链接的具体取值仍由人工编辑保证,只有 `test_research_titles_dates_and_links_unchanged` 的几条样本断言。研究资产的实际修改需走 PR 审阅与人工核对。
- 现有 7 项 unittest:
  - `test_brand_and_contact` — `Xin Conan → Conan Xin`、`hello@xin-conan.me → conanxin@gmail.com`、注入 `data-site-identity="conan-xin-v1"`
  - `test_code_and_scripts_are_not_rewritten` — PROTECTED tag(`script` `style` `pre` `code` `textarea` `kbd` `samp`)内文本不被改写
  - `test_research_titles_dates_and_links_unchanged` — 研究标题 / 日期 / 链接 / `<input>` 值原样保留(样本断言)
  - `test_old_logo_text_and_placeholder_account` — `XIN_CONAN → CONAN_XIN`、`@xin-conan → @conanxin`、`https://github.com/xin-conan → https://github.com/conanxin`
  - `test_metadata_person_only_on_profile_pages` — Person JSON-LD 只在 `index.html` `about.html` `src/index.html` `src/about.html` 上注入
  - `test_idempotence` — 二次运行结果稳定
  - `test_navigation_excludes_technical_copies` — `public_route()` 排除 `projects/wbw-spacex-mars-cn/source/` `drafts/x/backups/` `projects/yarvin-moldbug-cn/work/` `src/` 等
- 本地运行:`python3 -m unittest discover -s tests -p test_site_identity.py -v`
- CI 在 `.github/workflows/pages.yml` 中第 2 步强制运行。

**`public_route()` 与 `build_site.py` 的职责边界**:`public_route(path)` **主要控制阅读目录收录**(站点导航 / 面包屑 / 收录列表)——决定哪些路径出现在目录中、哪些被排除;它**不负责**全部 HTML 的构建与发布。文件筛选、HTML 转换、统一外壳注入(导航 / 页脚 / 共享 CSS / `body.site-unified`)全部由 `scripts/build_site.py` 的 `transform()` 完成;被 `public_route()` 排除的路径仍可能被 `transform()` 处理(以 `fragment-unmodified` 或 `themed` 状态出现在 `.site-build/`),只是不会出现在阅读目录里。

---

## 7. 不要改的资产(只读)

- `articles/` `posts/` `projects/` `research/` `drafts/` `future/` `research-terminal/` 下的研究 / 文章 / 项目内容
- `assets/audio/` `assets/images/` 下的原始音频与图像
- `_config.yml`(Jekyll 元数据,本阶段不改)
- `Gemfile`(Jekyll 依赖,本阶段不改)
- `docs/taste-rules.md`(项目级专题,过时但保留作历史专题说明,**不**作全站默认)
- `.cursor/rules/wbw-spacex-mars-cn-taste.mdc`(项目级专题规则,globs 限定 `projects/wbw-spacex-mars-cn/**`,**不**作全站默认)
- `styles/main.css` `styles/post.css`(过渡期旧主题)
- `assets/site/design.css` 的 `:root` token 名(只允许追加工具类)
- `scripts/build_site.py` `scripts/personalize_site.py` `scripts/verify_site_browser.py` `tests/test_site_identity.py` `.github/workflows/pages.yml`(本阶段不改)