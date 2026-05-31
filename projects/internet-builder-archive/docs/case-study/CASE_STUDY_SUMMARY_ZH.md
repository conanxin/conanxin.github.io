# 旧互联网建设者资料库 · 复盘摘要

## 项目是什么

一个中文策展资料库，整理互联网建设者（技术创业者、媒介创作者、产品经理、内容人）值得关注的历史资料。包括纪录片、访谈、演讲、文章、公司内部备忘录，分成 5 条主题路径，可搜索、可筛选、可分享。

## 做了什么

**数据层**：74 条条目从截图录入，建立三种状态（verified_embed / verified_source / staging），67 条已 verified 并配有完整中文策展笔记（背景、核心观点、策展理由、观看建议）。

**策展层**：为英文资料补全 title_zh、summary_zh、curator_note_zh、why_it_matters_zh、recommended_for_zh 等字段，让中文读者在点开之前就知道资料的价值和用法。

**导航层**：5 条专题路径（创始人精神谱系、技术创业史、媒介社会与自我、创作者心智与长期主义、组织备忘录与战略转折），让资料库从扁平列表变成有方向的知识路线。

**发布层**：导览页、路径静态页、SVG 分享卡片、中文发布帖、OG meta、sitemap/robots，让项目可被发现、可被分享、可被索引。

**审计层**：Phase 2M 系统性链接抽查发现 4 个问题，iba-012 修复到官方来源，iba-002/020/022 降级为 staging，派生页面同步更新。强调可靠性优先于表面完成率。

## 当前数据状态

- total: 74
- verified_embed: 31（可直接嵌入播放）
- verified_source: 36（来源有效，无 embed）
- verified total: 67
- staging: 7（待用户补充截图或来源）
- 专题路径: 5

## 最大收获

把资料变成策展内容，比收集链接本身更有价值。一条有 curator_note_zh 和 why_it_matters_zh 的纪录片，比一个裸的 YouTube 链接，对中文读者的帮助大得多。

用 staging 机制处理不确定性，是保持资料库可信度的关键。不是所有资料都能立即确认真实来源；把不确定的条目明确标记为 staging，比把它们伪装成 verified，对读者更有帮助。

## 项目链接

- **项目首页**：https://conanxin.github.io/projects/internet-builder-archive/
- **中文导览**：https://conanxin.github.io/projects/internet-builder-archive/guide.html