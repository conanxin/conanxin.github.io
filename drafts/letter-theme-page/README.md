# 信抵达之前

从《给阿嬷的情书》到文艺作品中的书信母题 —— 一个互动式书信母题档案馆。

## 项目简介

本项目以纪录片《给阿嬷的情书》中的侨批为引子，探索「信」在电影、小说、动画、戏剧和真实档案中的多重面貌。页面围绕八个书信母题展开：代写之信、迟到之信、亡者之信、移民之信、战争之信、未寄之信、送信者、信件档案。

核心洞察：侨批同时承载通信、汇款、家庭责任、善意谎言与历史档案五重功能。这一结构在世界各地的文艺作品中反复出现，构成一张关于「书写、距离与情感」的隐形网络。

## 本地打开方式

本项目为纯静态 HTML 页面，无需构建工具。

```bash
# 方式一：直接用浏览器打开
cd ~/projects/letter-theme-page
open index.html        # macOS
xdg-open index.html    # Linux

# 方式二：用 Python 临时 HTTP 服务器（推荐，避免 fetch 的 file:// 协议限制）
cd ~/projects/letter-theme-page
python3 -m http.server 8080
# 然后浏览器访问 http://localhost:8080
```

## 文件结构

```
.
├── index.html                    # 主页面
├── style.css                     # 样式（响应式、时间线、图谱、Modal）
├── app.js                        # 交互逻辑（筛选、时间线、SVG 图谱、路线联动、来源系统）
├── README.md                     # 本文件
├── docs/
│   ├── SOURCE_POLICY.md          # 来源策略与核实规范
│   ├── CONTENT_SPEC.md           # Phase 0 内容设计文档
│   ├── UX_SPEC.md                # Phase 0 交互设计文档
│   ├── DATA_SCHEMA.md            # Phase 0 数据结构设计
│   └── VISUAL_STYLE.md           # Phase 0 视觉风格设计
├── data/
│   ├── motifs.json               # 8 个母题定义
│   ├── works.json                # 40 个作品条目
│   ├── journey.json              # 7 阶段信件旅程
│   ├── routes.json               # 3 条阅读路线
│   ├── sources.json              # 27 条来源记录
│   └── source_audit.json         # 来源审计统计
├── assets/
│   ├── icons/                    # 8 个原创 SVG 母题图标
│   │   ├── ghostwriting.svg
│   │   ├── delayed.svg
│   │   ├── afterlife.svg
│   │   ├── migration.svg
│   │   ├── wartime.svg
│   │   ├── unsent.svg
│   │   ├── messenger.svg
│   │   └── archive.svg
│   └── diagrams/
│       └── letter-route.svg      # 抽象信件路线装饰图
└── reports/
    ├── phase0_design_report.md   # Phase 0 设计文档报告
    ├── phase1_static_prototype_report.md  # Phase 1 静态原型报告
    ├── phase2_interaction_visual_report.md # Phase 2 交互增强报告
    └── phase3_sources_content_report.md   # Phase 3 来源与内容报告
```

## 数据文件说明

| 文件 | 条目数 | 说明 |
|------|--------|------|
| motifs.json | 8 | 母题定义：id、title、tagline、description、keywords、colorHint |
| works.json | 40 | 作品条目：含来源引用(source_ids)、核实状态(verification_status)、扩写说明(expanded_note)、推荐入口(recommended_entry_point)等 |
| journey.json | 7 | 信件旅程阶段：id、title、subtitle、description、relatedMotifs、relatedWorks、visualCue |
| routes.json | 3 | 阅读路线：id、title、tagline、motifs、works、description |
| sources.json | 27 | 来源记录：含来源类型(source_type)、状态(status)、URL、核实说明 |
| source_audit.json | 1 | 来源审计统计：来源数量、核实分布、作品覆盖、高优先级缺口 |

## 当前阶段功能（Phase 4A）

- **Hero 与引言**：核心论点展示 + 抽象信件路线装饰图
- **信件旅程时间线**：7 阶段横向滚动，点击阶段筛选相关作品
- **作品—母题关系图谱**：原生 SVG 实现，中心辐射结构，点击节点可筛选或打开详情
- **母题筛选**：8 个标签 + 全部，实时过滤作品网格
- **核实状态筛选**：全部 / 已核实 / 部分核实 / 待核实
- **作品卡片网格**：响应式布局，悬停效果，核心作品高亮，状态标签
- **作品详情 Modal**：含关系说明、典型场景、画面关键词、扩写说明、推荐入口、内容提示、来源列表
- **阅读路线联动**：3 条主题路线，点击后作品网格联动筛选
- **资料来源与注释区块**：来源统计、待核实缺口、来源列表
- **基础无障碍**：aria-label、role、focus-visible、键盘导航、焦点恢复

## 来源策略

本项目的来源策略详见 `docs/SOURCE_POLICY.md`。核心原则：

- 优先使用官方网站、出版社、博物馆、档案馆等权威来源
- 综合数据库（IMDb、豆瓣）仅作为辅助线索
- 不编造年份、导演、剧情等事实性信息
- 来源状态分级：verified / partial / placeholder / needs_review / not_found
- 所有新增事实性描述必须能追溯到 sources.json 或明确标记为待核实

## 技术栈

- HTML5 + CSS3（CSS 变量、Grid、Flexbox、自定义属性）
- Vanilla JavaScript（ES6+，无框架、无构建工具）
- 原生 SVG（关系图谱、图标、装饰图）
- JSON 数据驱动

## 图像策略与版权说明

- **所有 SVG 图标均为原创手绘**，不使用外部图标库
- **letter-route.svg 为原创抽象装饰图**，不绘制真实地理边界
- **未使用任何电影海报、剧照或商业图库图片**
- 作品信息基于公开资料整理，来源状态已分级标注
- 如需后续引入历史档案图像（如侨批原件扫描），将优先使用公共领域或明确开放许可的馆藏资源，并标注来源机构

## 字体策略

本项目**不依赖 Google Fonts 或任何外部字体 CDN**。使用系统字体栈：

- 中文正文/标题：Georgia, Times New Roman, Noto Serif SC, Songti SC, SimSun, serif
- 等宽文字：Courier New, Courier, monospace
- UI 元素：system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif

## 后续计划

- Phase 4A 已完成：移动端优化、打印样式、深色模式、作品锚点、内容提示完善、本地验证
- Phase 4B（可选）：正式部署到 /projects/、SEO 优化

---

*Phase 4A 审阅版 · 本地 drafts 预发布 · 未 push*
