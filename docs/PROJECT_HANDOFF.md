# Conan Xin 数字花园 — 项目交接入口

> 更新：2026-10-11 · TASK_ID=CONANXIN_SITE_DESIGN_STAGE2B_CONTINUATION
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

- **Stage 2B 工作分支**：`review/stage2b-mars-theme-isolation`，目标为修复 `projects/wbw-spacex-mars-cn/index.html` 的原生深空/火星沙阅读主题被全站 `site-unified` 强制覆盖的问题。
- 修改 `scripts/build_site.py`：只对该精确入口使用 `special` / `project-native`，不注入 `site-unified`，但保留共享品牌导航、跳过链接、面包屑、页脚和身份规范化；表格保持专题原始结构。
- `assets/site/design.css` 仅新增外围共享导航的专题焦点样式和脚注长 URL 断行（手机横向溢出修复），不修改全站 token，也不改任何原始 URL。
- `tests/test_spacex_theme.py` 与 `scripts/verify_site_browser.py` 分别覆盖构建不变式和两种配色/阅读模式的 1440px/390px 浏览器交互。
- 更新 `docs/SPACEX_BROWSER_AUDIT.md`、`docs/SITE_DESIGN.md`、`AGENTS.md`，消除 Stage 2A 前的过时操作说明。
- **不修改** `projects/wbw-spacex-mars-cn/` 目录内正文、代码、样式、图像，或专题 `.cursor/rules/wbw-spacex-mars-cn-taste.mdc`。

## 4. 验收 Gate

1. 开独立 PR 指向 `main`，等待 `pr-checks`：全量 Python unittest + build/personalize + Playwright。
2. 查看 `pr-check-screenshots`（桌面 1440 / 手机 390）中深空主题；确认切换火星沙/深空、沉浸/注释正常，页面无破损或 JS 错误。
3. 仅在 PR 通过并审阅后合并；**本交接文档的分支工作状态不等同于生产上线**。
4. 合并后再验证 `main` 的正式 Pages 工作流与公网页面。

## 5. 下一阶段建议

Stage 2B 兼容通过之后，选一篇新文章和一个新研究项目做四类模板在真实页面上的增量实践；优先用新增页面验证引用/证据/技术记录层级，不批量重写历史研究资产。必要时更新同一交接文件，避免对话长度上限阻断连续开发。
