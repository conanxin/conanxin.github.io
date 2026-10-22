# P11 — Yarvin 搜索与无障碍阅读体验

> 日期：2026-10-22 · 设计主线 P11 · 全站规范 `SITE_DESIGN.md v1.9.1`
>
> 仅限 Yarvin 页的搜索交互、局部 CSS、缓存键和回归测试。九章正文、P4–P7 研究 JSON、全站设计 tokens 不变。

## 原因

P10 已修复普通锚点/深链接的标题焦点，但搜索弹层还存在三个明显的交互契约缺口：

1. `role="dialog" aria-modal="true"` 却缺少真实的 Tab 焦点循环和显式关闭按钮；用户可能移到被遮罩的内容。
2. 搜索结果选择经 `window.location.hash` 导航；再次选择相同 hash 时 `hashchange` 不再触发，关闭搜索框会移除原本获取焦点的按钮。
3. 结果容器整体 `aria-live=polite` 容易逐段朗读全部结果，但输入框缺少显式可见标签；结果条数无简短状态提示。另外全站平滑滚动与回顶部强制 `smooth` 未遵循系统减少动画偏好。

## 本轮设计与实现

- 显式输入标签、关闭按钮、简短 live 结果数；结果列表本身不再是 live region，避免重复播报长文片段。
- 打开时记住当前焦点；将非弹层的 body 子元素临时设为 `inert`，保证辅助设备无法越过模态边界；Tab/Shift+Tab 在弹层内循环，Escape 或关闭按钮恢复此前焦点。
- 搜索支持 `ArrowUp`/`ArrowDown`、`Home`/`End` 和 Enter，保留原有 HTML 转义以防将用户词句当 HTML；相同章节重复跳转仍重新聚焦已选择标题。
- 增加局部小屏搜索区域内滚动与焦点样式；保留全站暖白/深绿/棕色规范。
- 在 `prefers-reduced-motion:reduce` 环境关停平滑滚动及局部搜索过渡，并让“回到顶部”使用自动滚动。
- 缓存键为 `styles.css?v=20261022-p11` 与 `app.js?v=20261022-p11`。

## Gate

- 现有全站 Python / Chromium 1440px 与 390px 回归。
- P11 自动检查真正的 modal inert 背景、Tab/Shift+Tab 封闭循环、Escape 恢复触发器焦点、结果数 live status、无结果状态、同 hash 连续选择重新聚焦。
- 手机另在 **320 CSS px** (用于模拟宽 1280 设备的 400% 浏览器缩放后重排) + `prefers-reduced-motion:reduce` 运行搜索，检查整页无明显水平溢出、弹层/关闭按钮位于视口内、计算样式滚动方式为 auto；保留截图。
- 合并后由 Pages workflow 从正式公网读取新版 HTML/CSS/JS，证明不是单纯构建期通过。

## 内容保护和未覆盖的范围

P11 不宣称屏幕阅读器的人工逐项听读完成——目前用语义、焦点、live status DOM 与真实浏览器操作作为机器可复核 Gate。后续若需完成 WCAG 全面评估，另设单独任务和人工测试。

P7 正文补译与四项编辑决定仍保留 PENDING，未因本轮 UX 测试而获批准。
