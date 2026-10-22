# P13｜Yarvin 折叠证据与键盘阅读连续性

日期：2026-10-22。继 P12 的目录模态框/表头语义修复后，继续本专题的可访问性设计。权威样式仍是 `docs/SITE_DESIGN.md v1.9.1` 和 `assets/site/design.css`。

## 真实代码缺口

P5 的三组中文引文都使用相同的 `<summary>查看本站中文引文全文及后续校勘任务</summary>`。这些折叠入口在辅助技术的控件列表中缺乏辨识度，无法知道目前指的是第 5、7 还是第 9 章。

P10 的 `initAnchorFocus` 会聚焦普通标题与深链接目标，但遇到 `<details>` 时不会打开关闭状态中的资料，因此直接访问 `#p7-preface-3` 或具体引文详情不能立即读到内容，也不会聚焦原生 summary。

P12 两张对照表具备正确 caption、表头和可滚动区域，不过缺少可见的横向滚动操作提示。

## P13 最小改动

- P5 三条 `details` 获得稳定 ID `passage-details-ch5/ch7/ch9`，summary 分别列出章号和主题并标记待审性质；不更改内部原始引文、研究意见或审批状态。
- 当用户访问这些 ID、P6 `#triLayerHeadings` 或 P7 `#p7-preface-3` 之类的深链接，打开所在原生 `details`，用 `focus({preventScroll:true})` 将键盘焦点交给原生 summary；当原来关闭时，自动把 summary 滚动到可见范围。保留默认浏览器折叠语义和用户手动操作。
- 新议事主义制度模型表、西语/中文九章标题表的原滚动容器增加 `aria-describedby`，对应一条明确的左右方向键操作提示。表格 caption/列头/行头继续由 P12 保留。
- 本地资源 cache key 提升为 `styles.css?v=20261022-p13`、`app.js?v=20261022-p13`，页面增量样式只使用已有 `--site-*`。
- 新增单元测试和真实浏览器两视口检查：详情标签唯一、三处直接深链接展开+标题聚焦，390px 表格左右方向键滚动，以及展开内容截图。

## 研究资产和内容保护

不得改动九章 `<article>` 译文、P4–P7 来源/校勘 JSON 和待批状态、全站 `assets/site/design.css`、站点构建程序、其它项目页。P7 未批准的四段补译仍处于独立的审稿区，P13 不做任何内容批准。

## 验收定义

PR 的 Python + Chromium 1440/390 检查全部通过后阅读截图；再合并并以 GitHub Pages 真实公网 HTML/CSS/JS HTTP 回读作为发布证据。此任务属于自动化语义和键盘可访问性检查，不宣称完成了 NVDA/VoiceOver 的人工听读或 WCAG 全面认证。

状态：PR 与生产验收结果会在 Notion 主档补充。
