# Conan Xin 数字花园 — 项目交接入口

> 更新：2026-10-11（UTC+8）· 接续入口：TASK_ID=CONANXIN_SITE_DESIGN_STAGE2D_CONTINUATION
> 本文件记录已完成的真实状态。以 GitHub 仓库、合并提交、Actions 日志与公网响应作为验收权威，不把待办写成已发布。

## 1. 项目目的与不可突破的边界

让文章、项目、展览、文献研究页共享品牌、导航、设计 token 和无障碍基础，同时允许已批准的特殊专题保留原生交互与阅读主题。

- 视觉权威：`assets/site/design.css`；工程权威：`scripts/build_site.py`、`scripts/personalize_site.py`、`.github/workflows/pages.yml`。
- Agent 规则入口：`AGENTS.md`、`CLAUDE.md`、`docs/SITE_DESIGN.md`、`.cursor/rules/site-design.mdc`。
- 原有研究正文、数据、引文、图像、专业交互与保全分支原则上只读；新改动使用独立 PR，不能直接覆盖历史资产。

## 2. 已完成并通过生产验收的阶段

| 阶段 | PR | 合并提交 | 完成事项 |
|---|---|---|---|
| Stage 1 | [#10](https://github.com/conanxin/conanxin.github.io/pull/10) | — | 统一设计规则、跨 Agent 入口 |
| Stage 2A | [#11](https://github.com/conanxin/conanxin.github.io/pull/11) | `00fa798` | 四类完整模板、排除 `templates/` 发布、`/site-guide/`、PR CI |
| Stage 2B | [#12](https://github.com/conanxin/conanxin.github.io/pull/12) | `3e3c929` | SpaceX 原生主题例外、长网址移动端换行、双视口测试、CLAUDE/Cursor 规则更新 |
| Stage 2C | [#13](https://github.com/conanxin/conanxin.github.io/pull/13) | `5d76e6f` | 两个真实内容试点、四模板 HTML 嵌套修复、补全公网验收和生产脚本语法测试 |

Stage 2B 正式部署：[Run 38142644340](https://github.com/conanxin/conanxin.github.io/actions/runs/38142644340)，19/19 unittest、32/32 Playwright、9/9 公网阅读路径。

Stage 2C 正式部署：[Run 38143831596](https://github.com/conanxin/conanxin.github.io/actions/runs/38143831596)，**24/24 unittest、36/36 Playwright、12/12 公网阅读路径**，包含火星原生主题和两条新增页面，JavaScript 报错为 0。当前 `main` 生产发布合并 SHA 为 `5d76e6fe15f20944eebcef7fb571a5199e0e0c96`（若后续新 PR 合并，须重新核对）。

## 3. 现有真实页面与模板

- 文章：<https://conanxin.github.io/posts/site-design-evidence-layers.html> — 模板来自 `templates/site/article/index.html`，研究正文 / 证据 / 技术日志的分层方法，以 PR #10—#12 和设计规范作为可核实来源。
- 项目：<https://conanxin.github.io/projects/site-design-lab/> — 模板来自 `templates/site/project/index.html`，展示设计工程的实施、工作日志、证据、技术栈、引用和资源。两个页面彼此链接。
- `templates/site/{article,project,exhibition,reference}/index.html` 均为 **完整 HTML**，Stage 2C 修复了 `</article></main>` 闭合顺序，并复用 `.site-home` 阅读容器；**模板原件全部排除发布**，不能当作公网页面。
- <https://conanxin.github.io/site-guide/> 提供共享风格样板；火星专题 `projects/wbw-spacex-mars-cn/index.html` 是唯一 `project-native` 精确例外。其它完整页面默认 `unified-v1`。

## 4. 下次恢复时先做什么（Stage 2D）

1. 阅读本文件与 `docs/SITE_DESIGN.md`，确认 `main` 最新 SHA 和 Actions 部署状态；**不要重做 #10—#13**。
2. 根据已有、可核查的真实档案选择一项展览和一份文献索引，把剩余 `exhibition`、`reference` 模板增量用于真正内容；没有出处就先研究，不以假展品、假文献充数。
3. 独立分支小范围开发；保持来源/证据/解读边界/技术记录清晰，新增双视口浏览器检查与公开路径核验；原研究内容继续只读。
4. 当前两条新增页面会进入自动生成的 `/site-map/`，**尚未添加到旧版 `posts/index.html` 与 `projects/index.html` 的手工条目/计数中**。下一阶段可单独评估如何建立自动内容索引，避免直接修改既有目录数据。
5. PR 审查与 CI 全绿后再合并。历史研究真实性仍需要来源比对，不由 CI 代替学术审校。

## 5. 已确认的教训

- 构建脚本输出与真实 DOM 不总一致：`/site-guide/` 曾被代码示例误触发主题判断，现已改为解析真实 body 属性。
- Stage 2B 首轮测试虽通过，却遗漏火星手机端 724px 横向溢出；现为该专题加入溢出阻断条件及原生主题交互。
- Stage 2C 曾因部署后的内联 Python 断言少一个引号而被 Codex P1 审查拦截。现已修正，并以 `tests/test_stage2c_pages.py` 在 PR 阶段编译主分支专用公网验证脚本。
- 对话可以结束，**但代码决策、未完成事项与证据应持久化**在 PR、测试和这份交接文件中。
