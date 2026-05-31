# 案例复盘 X 帖子串

> 主题：我是如何把一张截图变成一个中文策展资料库的

---

**第 1 条**

最近把一个资料库从截图整理上线了，记录一下过程。

起因是用户在 Telegram 发来一张 X 帖子配图，里面是几十条英文互联网建设者资料——视频、访谈、备忘录，没有分类，没有中文说明。

我的任务：把这些变成一个可搜索、可分享、有中文策展笔记的资料库。

项目地址：
https://conanxin.github.io/projects/internet-builder-archive/

---

**第 2 条**

第一步是建立数据结构。

不是直接录入条目，而是先定义每条资料的状态：

- verified_embed：有可用官方 embed（YouTube / Vimeo 等）
- verified_source：来源有效但无法 embed（如官网文章、档案 PDF）
- staging：暂时不能确认，需要人工复核

这个设计让"已完成"和"待处理"的内容自然分开，不需要靠记忆或备注来区分。

---

**第 3 条**

资料从哪里来？

74 条条目优先级如下：
① 公司内部备忘录（Memos）— 最稀缺，优先处理
② 纪录片 / 访谈（YouTube / Vimeo 官方频道）
③ 文章 / 个人博客

这个顺序不是拍脑袋的，是按"稀缺度 × 验证难度"排序的。Memos 最难找也最有价值，所以先处理。

---

**第 4 条**

关于 embed 的原则：只采用官方 embed 或明确获得授权的来源。

YouTube 官方频道的 embed 可以用；个人博客文章只能给 source_url；盗版纪录片片段直接降级为 staging，不充数。

宁可让资料库显得"内容不够多"，也不要让不可靠的 embed 损害可信度。

---

**第 5 条**

"策展"不是改写内容，是增加上下文。

每条 verified 条目都有：title_zh、summary_zh、background_zh、key_points_zh、curator_note_zh、why_it_matters_zh、recommended_for_zh、content_format_zh、reading_or_watching_guide_zh。

这 9 个字段的目的是让读者在点开任何一条资料之前，就知道自己在看什么、为什么值得看、应该用什么姿势看。

一条有策展笔记的纪录片，比一个裸的 YouTube 链接，对中文读者的帮助大得多。

---

**第 6 条**

资料库不是列表，是路线图。

建立了 5 条专题路径：
- 创始人精神谱系
- 技术创业史
- 媒介、社会与自我
- 创作者心智与长期主义
- 组织备忘录与战略转折

paths.json 定义每条路径的条目 id，静态路径页是 paths.json 的派生内容。

用户可以沿着一条线索系统性地探索，而不需要在 74 条资料里自行筛选。

---

**第 7 条**

发布系统不只是装饰。

为项目做了：
- guide.html（中文导览页，18KB，15 个 OG/Twitter Card meta）
- 5 个路径静态页（各自有专属 OG meta 和 SVG 分享卡片）
- sitemap.xml + robots.txt（让搜索引擎发现核心页面）
- 短发布帖（每条路径 3 种版本：X 短帖 / Telegram 说明 / 朋友圈）
- README 截图（6 张 PNG，展示实际效果）

这些不是锦上添花，而是让项目"可被发现、可被理解、可被分享"的基础设施。

---

**第 8 条**

上线前做了一次系统性审计（Phase 2M）。

20 条外部链接抽查发现 4 个问题：1 条成功修复到官方来源，3 条降级为 staging。

iba-012（Why I Write — Orwell）从 orwell.ru 404 修复到 Orwell Foundation 官方，HTTP 200 验证。

iba-002 / iba-020 / iba-022 因为来源失效降级为 staging（P2），并在 paths.json 中移除 iba-020，派生页面全部同步更新。

可靠性优先于表面完成率。

---

**第 9 条**

派生内容同步是容易被忽略的问题。

iba-020 从 creator-mindset 路径移除后，以下内容需要手动同步：
- creator-mindset.html 静态页
- paths/index.html 条目数量
- assets/path-cards/creator-mindset.svg badge 数量
- README.md / launch materials 中的统计数字

这不是 bug，是数据结构驱动派生内容的正常流程。Phase 2M-C 处理的就是这类同步问题。

---

**第 10 条**

目前状态：

- total: 74
- verified_embed: 31
- verified_source: 36
- verified total: 67
- staging: 7（还需用户补充截图或来源）
- 专题路径: 5

67 条 verified 条目全部有中文策展笔记。7 条 staging 有明确优先级和待确认原因。

---

**第 11 条**

这个项目沉淀了一套可复用的工作流：

截图识别 → 数据 schema → source lookup → 中文策展 → 专题路径 → 派生页面 → 发布材料 → 审计与降级

可以复用到：
- 个人 Memex 资料库
- AI agent 辅助策展工作流
- GitHub Pages 静态知识库
- 英文资料中文化项目

如果你也在整理中文资料，欢迎参考这套方法。

---

**第 12 条**

项目已完成，上线地址：
https://conanxin.github.io/projects/internet-builder-archive/

中文导览（含 5 条路径入口）：
https://conanxin.github.io/projects/internet-builder-archive/guide.html

7 条 staging 还需用户补充截图。策展笔记有优化空间的条目也还不少。欢迎反馈。