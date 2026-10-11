# Conan Xin 数字花园 — 项目交接入口

> 更新：2026-10-11 · TASK_ID=CONANXIN_SITE_DESIGN_STAGE2C_REAL_PAGES
> 此文件供新的 ChatGPT 对话、Agent 或贡献者快速恢复实际仓库状态；GitHub 的 PR、提交与 Actions 日志是最终验收依据。

## 1. 项目目标

使用同一套全站设计 token 与共享导航，让文章、项目、展览和文献研究页面可读、统一；同时保留已批准的独立专题体验，不修改已有研究正文、证据、图像或专业交互。

权威文件：`AGENTS.md`、`docs/SITE_DESIGN.md`、`assets/site/design.css`、`scripts/build_site.py`、`.github/workflows/pages.yml`。

## 2. 已完成的主线

- **Stage 1**：PR #10 合并；跨 Agent 设计规范入口建立。
- **Stage 2A**：PR #11 合并至 `main`，merge SHA `00fa798b68e87e5acfff30684a3897bb245f91d0`。
- Stage 2A 提供 `templates/site/{article,project,exhibition,reference}/index.html`、模板发布排除、`/site-guide/` 与 PR 双视口浏览器 CI。
- 主分支正式部署 GitHub Actions Run `38134567769` 的测试、构建、浏览器检查、Pages 发布与公开页面验证均通过（注意该轮**尚未验证火星专题**）。

## 3. 当前执行分支与变更范围

- **Stage 2B 已合并**：PR #12（合并 SHA `3e3c9295a34b93ee62a2c361234a57f866740ce0`）修复 `projects/wbw-spacex-mars-cn/index.html` 的原生深空/火星沙阅读主题兼容问题，并同步 `CLAUDE.md` 和 Cursor 设计约束。部署 Run `38142644340` 成功：19 个 unittest、32 项 Playwright；9 个发布后公网阅读路径验证通过（该轮公网探针尚未单独覆盖火星专题）。
- 修改 `scripts/build_site.py`：只对该精确入口使用 `special` / `project-native`，不注入 `site-unified`，但保留共享品牌导航、跳过链接、面包屑、页脚和身份规范化；表格保持专题原始结构。
- `assets/site/design.css` 仅新增外围共享导航焦点样式及专题内容长 URL 断行：包括 `.footnote-body`、`.main a[href^="http://"]`、`.main a[href^="https://"]`。修复手机横向溢出，不改全站 token、原文或任何原始 URL。
- `tests/test_spacex_theme.py` 与 `scripts/verify_site_browser.py` 分别覆盖构建不变式和两种配色/阅读模式的 1440px/390px 浏览器交互。
- 更新 `docs/SPACEX_BROWSER_AUDIT.md`、`docs/SITE_DESIGN.md`、`AGENTS.md`，消除 Stage 2A 前的过时操作说明。
- **不修改** `projects/wbw-spacex-mars-cn/` 目录内正文、代码、样式、图像，或专题 `.cursor/rules/wbw-spacex-mars-cn-taste.mdc`。

## 4. 验收 Gate

1. **PR #12 已合并并发布**：`https://github.com/conanxin/conanxin.github.io/pull/12`，部署 `https://github.com/conanxin/conanxin.github.io/actions/runs/38142644340` 已通过。
2. **专题原生模式已通过浏览器回归**：火星专题的 1440px / 390px 深空首屏、深空↔火星沙、沉浸↔注释与页面无 JS 错误均通过；手机 scrollWidth 从 724px 降到 395px（390px 视口的 5px 容差内）。
3. **Stage 2C 为独立未合并分支** `review/stage2c-real-page-pilot`；务必等待新 PR 的全量测试、构建、浏览器和审阅结果，不能把分支内容视为已经公开发布。
4. Stage 2C 合并后查看 GitHub Pages 的正式部署回执，再验证新增的两条真实页面与火星专题原生主题在生产环境的公开响应。

## 5. 下一阶段建议

Stage 2B 兼容通过之后，选一篇新文章和一个新研究项目做四类模板在真实页面上的增量实践；优先用新增页面验证引用/证据/技术记录层级，不批量重写历史研究资产。必要时更新同一交接文件，避免对话长度上限阻断连续开发。


## 6. Stage 2C · 真实内容模板试点（开发中）

- 工作分支：`review/stage2c-real-page-pilot`，基于 Stage 2B 正式合并后的 `main`。
- 修正四类 HTML 模板的 `</article></main>` 闭合顺序并为 `<main>` 复用 `site-home` 阅读容器；不发布任何未填充模板。
- **新增真实文章**：`posts/site-design-evidence-layers.html`（`article` 模板），梳理研究网站的正文 / 证据 / 技术记录分层，以 PR #10—#12 和实际规范链接为证据。
- **新增真实项目页**：`projects/site-design-lab/index.html`（`project` 模板），记录网站规范、阶段开发、测试与公开发布回执；两页彼此链接。
- **CI**：`tests/test_stage2c_pages.py` 核验完整 HTML、语义闭合、模板占位字符串和构建身份；Playwright 加入两页双视口与交互；Pages 部署后新增公开火星原生主题及两条真实页面检测。
- **刻意不做**：不伪造展览展品或参考文献填满另外两类模板，不修改原有 SHUGE / SpaceX / 其他研究正文，也不改 `posts/index.html` 的历史人工计数和分类。展览 / 文献模板真实应用另列后续阶段。
- **接续 Gate**：建立 Stage 2C PR → 核对测试结果与截图 → 审阅 → 合并与公网回执；未通过时只在本独立分支纠正问题。
