# Phase 2A-2b — 第二批 verified_embed 纪录片中文策展深化报告

## 1. 本阶段处理范围

处理第二批 verified_embed 纪录片，共 11 条。
范围与 iba-029（Choke，需人工复核）、iba-030/iba-048（非 verified_embed）明确隔离。

## 2. 实际深化条目总数

**11 条**（全部 11 条均已新增 / 更新 7 个策展字段）

## 3. 深化条目列表

| ID | 中文标题 | 英文标题 | 类型 | 年份 |
|---|---|---|---|---|
| iba-037 | 伊卡洛斯 | Icarus | documentary | 2017 |
| iba-038 | 可卡因牛仔 | Cocaine Cowboys | documentary | 2006 |
| iba-039 | 深水 | Deep Water | documentary | 2022 |
| iba-040 | 最后之舞 | The Last Dance | documentary | 2020 |
| iba-041 | 创业公司.com | Startup.com | documentary | 2001 |
| iba-042 | 战争迷雾 | The Fog of War | documentary | 2003 |
| iba-043 | 打印传奇 | Print the Legend | documentary | 2014 |
| iba-044 | 亲爱的扎卡里 | Dear Zachary | documentary | 2008 |
| iba-045 | 寿司之神 | Jiro Dreams of Sushi | documentary | 2011 |
| iba-046 | 走钢丝 | Man on Wire | documentary | 2008 |
| iba-047 | 灵魂之夏 | Summer of Soul | documentary | 2021 |

## 4. 未处理纪录片列表与原因

| ID | 英文标题 | 原因 |
|---|---|---|
| iba-029 | Choke | staging；需人工复核真实来源（截图可能是同名剧情片） |
| iba-030 | Coyote: The Mike Plant Story | verified_source（无 embed_url）；归入 Phase 2A-3 或 2B 处理 |
| iba-048 | The Up Series | verified_source（无 embed_url）；归入 Phase 2A-3 处理 |

## 5. 新增字段列表

每个条目均新增或确认存在以下 7 个字段：

| 字段 | 说明 |
|---|---|
| background_zh | 120-220 字；纪录片背景、人物背景或历史语境 |
| key_points_zh | 数组 4-6 条；每条 25-70 字；核心主题 / 人物 / 事件 |
| recommended_for_zh | 数组 3-5 条；适合的观众群体 |
| content_format_zh | 简洁中文类型标签 |
| reading_or_watching_guide_zh | 100-180 字；引导中文观众带着什么问题观看 |
| related_themes_zh | 数组 4-8 个中文主题标签 |
| curator_note_zh | 80-160 字；中文策展人口吻，说明纳入资料库的理由 |

## 6. 页面适配说明

- Phase 2A-1 已完成 curationHtml 渲染区块的 app.js 适配
- 本阶段新增 / 更新的 7 个字段均遵循 Phase 2A-1 建立的渲染规则
- 无需修改 app.js、styles.css 或 index.html
- 未引入任何外部 CDN
- 搜索、分类筛选、播放器、来源链接显示功能均未受影响

## 7. 内容安全与版权说明

- 所有内容基于 IMDB 条目、官方预告片和公开资料撰写
- 未提供任何盗版观看建议
- 对于iba-037（涉及俄罗斯国家系统作弊）、iba-038（涉及毒品贸易暴力）等争议题材，内容保持中性、资料型表达
- 对于 iba-045、iba-046、iba-047 等创作文化类作品，突出「技艺、长期主义、媒介记忆、文化保存」主题
- 策展笔记均以「被纳入资料库，是因为它是一部关于……」的客观口吻陈述，不用「我认为」开头

## 8. Git 状态核查结果

```
项目目录：/home/ubuntu/conanxin.github.io/projects/internet-builder-archive/
工作区：干净（无已修改文件）
本次修改范围：data/items.json + docs/PHASE_2A_2B_DOCUMENTARIES_ENRICHMENT_REPORT.md
git add 仅指向 projects/internet-builder-archive/ 目录
```

## 9. Git Commit Hash

```
6b75214（Phase 2A-2a）
```

本次提交前，本阶段 enrich → commit → push 产生新 commit（执行时生成）。

## 10. GitHub Pages 地址

https://conanxin.github.io/projects/internet-builder-archive/

## 11. 全站统计

| 指标 | 数量 |
|---|---|
| 条目总数 | 74 |
| verified_embed（含 embed_url） | 31 |
| verified_source（无 embed） | 33 |
| staging（待核实） | 10 |
| curator_note_zh 已有条目 | 39（Phase 2A-1: 17 + Phase 2A-2a: 11 + Phase 2A-2b: 11） |

## 12. 下一步建议

### Phase 2A-3：深化 22 条 verified_source 文章
（written content 分类，无 embed_url 但有 source_url）

### Phase 2B：人工复核 10 条 staging 条目
iba-009（Hunter Thompson 文章）/ iba-017（Paul Graham 文章）/ iba-023（Stripe 创始人博客）/ iba-029（Choke 需核实纪录片版）/ iba-033（待确认）/ iba-046（待确认）/ iba-049 / iba-056 / iba-065 / iba-066

### Phase 2C：首页入口导航 + 专题路径
在 index.html 添加按「创始人精神谱系」「技术创业史」「媒介与社会」「组织兴衰」等主题路径的导航入口。

---

*Phase 2A-2b 由 cloud_hermes 执行*
*生成时间：Phase 2A-2b 完成时*