# 项目当前状态交接清单 · 中文

> 本文档是 internet-builder-archive 项目的当前状态交接清单，用于维护交接、运维索引和下一步决策参考。
> 最后更新：Phase 2P（e88ac18）

---

## 1. 项目一句话说明

「旧互联网建设者资料库」：整理互联网发展史上重要原始资料的中文策展索引——视频、访谈、纪录片、公司内部备忘录、创业与投资文章，全部配有中文导读和来源标注。

---

## 2. 当前线上入口

| 资源 | URL |
|------|-----|
| 项目首页 | https://conanxin.github.io/projects/internet-builder-archive/ |
| 导览页 | https://conanxin.github.io/projects/internet-builder-archive/guide.html |
| 路径 ① 创始人精神谱系 | https://conanxin.github.io/projects/internet-builder-archive/paths/founder-spirit.html |
| 路径 ② 技术创业史 | https://conanxin.github.io/projects/internet-builder-archive/paths/tech-startup-history.html |
| 路径 ③ 媒介、社会与自我 | https://conanxin.github.io/projects/internet-builder-archive/paths/media-and-society.html |
| 路径 ④ 创作者心智与长期主义 | https://conanxin.github.io/projects/internet-builder-archive/paths/creator-mindset.html |
| 路径 ⑤ 组织备忘录与战略转折 | https://conanxin.github.io/projects/internet-builder-archive/paths/organization-and-strategy.html |
| 路径索引页 | https://conanxin.github.io/projects/internet-builder-archive/paths/index.html |
| sitemap | https://conanxin.github.io/sitemap.xml |
| robots.txt | https://conanxin.github.io/robots.txt |
| 项目 Blueprint | https://conanxin.github.io/projects/internet-builder-archive/docs/blueprint/CURATED_ARCHIVE_BLUEPRINT_ZH.md |
| 录入 Workflow | https://conanxin.github.io/projects/internet-builder-archive/docs/workflow/NEW_ITEM_INGESTION_WORKFLOW_ZH.md |
| 案例复盘 | https://conanxin.github.io/projects/internet-builder-archive/docs/case-study/INTERNET_BUILDER_ARCHIVE_CASE_STUDY_ZH.md |
| GitHub 仓库 | https://github.com/conanxin/conanxin.github.io |

---

## 3. 当前数据统计

| 字段 | 值 | 说明 |
|------|-----|------|
| total | 74 | 全部收录条目 |
| verified_embed | 31 | 配有官方嵌入播放器 |
| verified_source | 36 | 配有稳定存档链接 |
| verified total | 67 | 已完成中文策展 |
| staging | 7 | 待用户补充来源或截图 |
| paths | 5 | 专题路径 |

---

## 4. 当前 7 条 staging 明细

### P0（需用户提供截图才能继续处理）

| ID | title_zh | title_en | 当前状态 | 需要什么 |
|----|----------|----------|----------|----------|
| iba-013 | 玩医生的游戏 | Playing Doc Game | source_status=需要人工复核，标题含义不明 | 原始截图或更多上下文 |
| iba-029 | 扼住咽喉（剧情片，非纪录片） | Choke | IMDB 核实为剧情片而非纪录片，需截图确认 | 原始截图确认是纪录片还是剧情片 |
| iba-066 | 同一条河两次 | The Same River Twice | 无法确认是 David Quammen 书籍还是短文，需截图确认 | 原始截图确认是备忘录还是书籍章节 |
| iba-073 | 我们的工作方式与原因：亨特·哈里森 | How we work and why | 未找到可靠来源，需截图确认 | 原始截图确认亨特·哈里森此备忘录存在 |

### P2（已有初步来源，但均已失效，需人工查找替代）

| ID | title_zh | title_en | 原 source_url | 问题 | 可能的替代方向 |
|----|----------|----------|----------------|------|----------------|
| iba-002 | 真正的英雄已经死去 | The Real Heroes Are Dead | lightningdoor.com/blog/the-real-heroes-are-dead | 域名已失效，无法找到可访问的替代来源 | 需人工在网络上查找这篇文章的任何镜像或转载 |
| iba-020 | 现在就做 | Do It Now | stevepavlina.com/blog/2005/09/do-it-now/ | 路径已 404，需在 stevepavlina.com 站内重新搜索 | 搜索 "Do It Now" + "Steve Pavlina" 找新路径 |
| iba-022 | 为什么我总是迟到 | Why am I always late | stevepavlina.com/blog/2013/04/why-am-i-always-late/ | 路径已 404，需在 stevepavlina.com 站内重新搜索 | 搜索 "Why am I always late" + "Steve Pavlina" 找新路径 |

**注意**：iba-020 和 iba-022 所属的 stevepavlina.com 本身仍在运行，搜索功能正常，但具体博文路径已变更。可以通过站内搜索找到新路径。

---

## 5. 最近关键 Commits

| Phase | Commit | 说明 |
|-------|--------|------|
| Phase 2M-C | cb91a93 | 派生内容同步（creator-mindset 10→9 items） |
| Phase 2N | af42719 | 项目案例复盘长文 + 摘要 + X 帖子串 |
| Phase 2O | 90dec41 | 新增资料录入流程（5 workflow + 2 templates） |
| Phase 2P | e88ac18 | 策展型资料库蓝图 + Skill draft |

完整历史：`git log --oneline` 可查看所有 commits。

---

## 6. 当前不要做的事

| 禁止项 | 原因 |
|--------|------|
| 猜测 staging 来源 | 可能引入不可靠链接，降低资料库可信度 |
| 采用非官方 embed | 涉及版权风险 |
| 跨 agent 安装 Skill | cloud_hermes 的 skill 不能混用到本地 OpenClaw 等其他 agent |
| 修改主站其他项目 | 只允许修改 iba 项目目录 |
| 猜测 staging 条目内容 | 应等待用户提供截图 |
| 伪造 source_url | 可靠性优先于完成率 |
| 修改 items.json 条目状态 | staging 状态需等用户提供截图后处理 |

---

## 7. 推荐下一步

### 优先级 A：处理剩余 staging（Phase 2B-B2）

用户提供以下截图后，可将 7 条 staging 转为 verified 或删除：
- P0 × 4：需截图确认内容是什么（iba-013/029/066/073）
- P2 × 3：需截图或网络查找替代来源（iba-002/020/022）

### 优先级 B：新资料库（Phase 3A）

使用 docs/blueprint/ 下已建立的方法论，创建另一个资料库，例如：
- AI 论文/视频策展资料库
- 纪录片索引
- 人物访谈资料库

### 优先级 C：Skill 安装前准备

如需将 `curated-archive-builder` Skill 安装到指定 agent：
1. 用户先指定目标 agent 名称和配置
2. 核查该 agent 的 skill 目录路径
3. 将 docs/blueprint/SKILL_DRAFT_CURATED_ARCHIVE_BUILDER_ZH.md 转换为正式 SKILL.md
4. 在目标 agent 中执行安装验证

---

## 8. 已完成的 Phase 清单

| Phase | 说明 |
|-------|------|
| Phase 0 | 项目骨架（index.html + styles.css + app.js + items.json） |
| Phase 1A | 74 条 staging 条目录入 |
| Phase 1B–1C | 来源检索与 embed 判断 |
| Phase 1E | MVP 发布 |
| Phase 2A | verified 条目中文策展深化 |
| Phase 2B | staging 复核清单（10→4→7） |
| Phase 2C | 5 条专题路径 |
| Phase 2D | guide.html 导览页 |
| Phase 2E | 主站 projects 入口 |
| Phase 2F | 发布材料、分享卡片 |
| Phase 2G | Open Graph / Twitter Card |
| Phase 2H | 5 条路径独立静态页 |
| Phase 2I | README 截图 |
| Phase 2J | sitemap.xml / robots.txt |
| Phase 2K | 5 条路径专属分享卡片（SVG） |
| Phase 2L | 5 条路径短发布帖 |
| Phase 2M | 最终内容审计 |
| Phase 2M-B | source_url 失效降级 |
| Phase 2M-C | 派生内容统计同步 |
| Phase 2N | 项目案例复盘文章 |
| Phase 2O | 新增资料录入流程 |
| Phase 2P | 策展型资料库蓝图 + Skill draft |
| Phase 2Q | 项目交接清单与运维索引（本文档） |

---

## 9. 项目结构一览

```
projects/internet-builder-archive/
├── index.html                    ← 资料库首页（含搜索+筛选）
├── guide.html                   ← 中文导览页
├── styles.css
├── app.js
├── README.md
├── data/
│   ├── items.json               ← 74 条条目（三态状态管理）
│   ├── paths.json               ← 5 条专题路径
│   └── staging_review.json      ← 7 条 staging 复核清单
├── paths/
│   ├── index.html               ← 路径索引页
│   ├── founder-spirit.html
│   ├── tech-startup-history.html
│   ├── media-and-society.html
│   ├── creator-mindset.html
│   └── organization-and-strategy.html
├── assets/
│   ├── screenshots/             ← 6 张页面截图
│   ├── path-cards/             ← 5 张 SVG 分享卡片（1200×630）
│   └── iba-share-card.svg       ← 项目总分享卡片
├── docs/
│   ├── DATA_SCHEMA.md
│   ├── CONTENT_GUIDE.md
│   ├── SCREENSHOTS.md
│   ├── PHASE_2M_FINAL_AUDIT_REPORT.md
│   ├── PHASE_2M_B_SOURCE_URL_REPAIR_REPORT.md
│   ├── PHASE_2M_C_DERIVED_CONTENT_SYNC_REPORT.md
│   ├── PHASE_2N_CASE_STUDY_REPORT.md
│   ├── PHASE_2O_INGESTION_WORKFLOW_REPORT.md
│   ├── PHASE_2P_BLUEPRINT_SKILL_DRAFT_REPORT.md
│   ├── case-study/              ← 复盘长文 + 摘要 + X 帖子串
│   ├── workflow/                ← 5 workflow 文档 + 2 templates
│   ├── blueprint/              ← 6 blueprint 文档 + 5 templates + Skill draft
│   ├── templates/              ← Agent 操作提示词模板
│   └── ops/                    ← 运维交接文档（本阶段新增）
└── launch/
    ├── LAUNCH_POST_ZH.md
    ├── X_THREAD_ZH.md
    ├── PATH_SHORT_POSTS_ZH.md
    └── README_SHOWCASE_BLOCK.md
```

---

*本文档由 cloud_hermes agent 在 Phase 2Q 生成，请勿手动修改统计数字（请通过 Phase 流程更新）。*