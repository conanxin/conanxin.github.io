# P12｜Yarvin 目录抽屉模态交互及对照表语义审查

> 日期：2026-10-22。主线：网站 UI 统一。设计依据：`docs/SITE_DESIGN.md v1.9.1` 与 `assets/site/design.css`。

## 根因

P11 已将全文搜索弹层补成真正可键盘操作的模态框，但目录抽屉仍只有外观遮罩和局部 Tab 循环。它声明了 `aria-modal=true`，却没有将背景 `inert`，关闭时也简单清空 `document.body.style.overflow` 而非恢复打开前状态。用户按 Ctrl+K 时可能从目录中打开另一个搜索模态框，造成焦点边界冲突。

辅助资料另外包含两张对照表（新议事主义制度模型、九章西语/中文标题）：原表头未设置 `scope=col`，第一列未声明行标题，辅助技术只能猜测对应关系。

## 本阶段改动

- 目录 `#tocDrawer` 用 `aria-labelledby` / `aria-describedby` 指向真实标题和“9章/12项”说明。
- 打开后保存原 `overflow`、将除抽屉之外的 body 子元素设为 inert；关闭时按原值恢复所有 inert 状态、overflow 和最初打开它的按钮焦点。
- 统一 Tab/Shift+Tab 焦点约束，Esc 返回；点击目录链接则关闭抽屉但将焦点留给 P10 锚点标题处理；抽屉打开时 Ctrl+K 不会叠加搜索模态框。
- 抽屉在 320 CSS px 窄屏内可独立滚动，关闭按钮和最后的阅读路径链接都可访问。
- 两张研究对照表添加可供屏幕阅读器读到的标题 `caption`、列头 `th scope=col`、行头 `th scope=row`；不改任何研究文本或观点。
- 样式与脚本资源版本为 `20261022-p12`，只用全站 `--site-*` token。

## 保护范围与机器验收

本阶段仅修改专题 HTML、JS、局部 CSS、测试和本审计文档。九章原始 `article` 完整不变；P4–P7 JSON、P7 待批草案和全站设计文件不改。未引入新主题。

Python 测试校验对话框语义、焦点边界与两表标题/表头数；Chromium 1440/390 测试聚焦首尾、Esc 返回、目录链接到章节焦点、背景状态恢复及 Ctrl+K 非嵌套行为。320 CSS px + reduced-motion 测试抽屉的滚动和关闭按钮是否在可视范围内，并生成真实截图。

成功后需 PR CI、截图核查、main 合并、Pages 部署及公网 HTML/CSS/JS 回读。浏览器自动测试不等于人工 NVDA/VoiceOver 听读，也不代表全面 WCAG 认证。

## Gate 状态

PR / 测试 / 生产回执在完成后写入 Notion 主档。
