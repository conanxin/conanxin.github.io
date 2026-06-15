# RESEARCH-SKILL-STACK-PAGE-20260615 — 计划

## 1. 目标
- 把 @itsreallyvivek (2026-06-10) 的英文帖完整翻译成中文，做成"研究能力栈"主题的中文静态页面
- 8 个能力层：自选问题 / 输入升级 / 研究品味 / 写作校准 / 实验循环 / 输出观察 / 跨领域游荡 / 研究共同体
- 7 大交互组件：Hero / Skill Stack Map / 完整译文 / 背景资料卡 / Research Log 模板 / Taste Training / Error Bucket Demo / 7-Day Plan / Personal Takeaways
- 推到 GitHub Pages: https://conanxin.github.io/projects/research-skill-stack/

## 2. 范围
- IN: 新增 projects/research-skill-stack/{index.html, styles.css, app.js, content/*, reports/*, README.md}
- IN: 在 projects/data.json 追加 1 条目
- OUT: 仓库其他文件不动（包括污染的 wbw-spacex-mars-cn/ 已 stash）
- OUT: 不创建新 GitHub 仓库

## 3. 产物
- index.html (含 8 个译文小标题锚点 + 11 张资料卡 + 7 个交互组件)
- styles.css (research notebook + dark lab accent)
- app.js (TOC 跟随 / 折叠 / 复制按钮 / 进度条 / taste 4 步循环 / error bucket 互动 / 7-day plan 勾选)
- content/translation.zh.md (中文译文源)
- content/background.json (11 张资料卡 JSON)
- content/components.json (研究日志 / taste / error bucket / 7-day / personal takeaways)
- reports/REPORT_20260615.md
- README.md

## 4. 验证
- Gate A: 8 个中文小标题全部存在
- Gate B: 11 张资料卡存在 (hamming/schulman/sutton/shannon/graham/feynman/darwin/olah-karpathy/karpathy/ng/radford)
- Gate C: 无外部 CDN (无 https:// 在 href/src/link 标签)
- Gate D: 7 个交互模块 id 存在
- Gate E: git diff 只影响本项目目录 + projects/data.json
- Gate F: git commit + push 成功
- 资料来源: 标 secondary 的必须标 secondary，未核实的标 "需进一步核实"

## 5. 风险
- 资料引用: Schulman 指南、Karpathy Recipe、Andrew Ng 引用已是 ML 圈广为流传的资料，但具体年份/标题需谨慎
- Hamming/Sutton/Shannon/Graham/Feynman/Olah-Carter 引用是公开演讲/论文，标题/年份需逐项标
- 翻译质量: 保留英文专有名词 + 中文流畅
- 推送: 沙箱可能 block git push；fallback 用 gh API
