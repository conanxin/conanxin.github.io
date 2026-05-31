# 内容录入规范 / CONTENT_GUIDE

> 用户提供原帖截图后，按本规范整理每条资料为标准条目。

---

## 1. 处理流程

1. **识别资料类型** — 视频、音频、访谈、PDF、备忘录、文章
2. **确认分类** — 按七类分类
3. **填写必填字段** — id、title_zh、category、type、year、summary_zh、why_it_matters_zh、status
4. **翻译标题** — 英文内容译为中文，格式：「原题」或「（译名）」
5. **补全可选字段** — duration、people、organization、source_url、embed_url、tags
6. **设置 status** — placeholder（占位）→ verified（已核实）

---

## 2. 如何翻译标题

- 英文 → 中文，直译为主，保留专有名词
- 常见词参考：
  - "memo" → "内部备忘录"
  - "manifesto" → "宣言"
  - "oral history" → "口述史"
  - "lecture" → "演讲"
  - "talk" → "访谈"
  - "internal" → "内部"
- 格式示例：`"Theuck Mail: How We Built It" → "Zork Mail：我们是如何构建它的"`
- 中文内容保留原题，`title_en` 写 null

---

## 3. 如何写中文简介（summary_zh）

原则：3-5句话，说明**是什么**、**谁做的**、**核心内容**。

模板：
> [时间/背景]，[人物/公司]发布了[资料类型]。[主要内容概述]。[特别亮点]。

示例（视频）：
> 1994年，Sun Microsystems 联合创始人 Bill Joy 在斯坦福大学发表演讲，系统阐述了 Java 语言的設計理念与早期开发历程。这是 Java 诞生初期最完整的内部视角之一，揭示了为何 Java 选择"一次编写，到处运行"作为核心目标。

示例（备忘录）：
> 1998年，Google 联合创始人 Larry Page 与 Sergey Brin 向投资者提交了一份早期商业计划书（内部代号"BackRub"）。文档描述了PageRank算法的核心原理、搜索广告的商业模型，以及对微软的竞争策略。这是理解Google早期战略的第一手材料。

---

## 4. 如何写"为什么值得看"（why_it_matters_zh）

原则：2-3句话，说明**稀缺性**、**独特价值**、**对谁有用**。

模板：
> 这份资料之所以值得看，是因为[稀缺性/独家性]。[对谁有价值]。[对互联网史研究/创业/产品有哪些启发]。

示例：
> 这份资料之所以值得看，是因为它是最早一批由内部人士讲述互联网底层协议创建过程的记录。对于研究互联网早期历史、理解TCP/IP标准形成背景的产品经理和工程师来说，这是难得的第一手材料。

---

## 5. 按资料类型处理

### 5.1 视频（含演讲、会议、课程）

- 必填：`embed_url` 或 `source_url`，中文简介必须
- 有嵌入链接优先嵌入（YouTube、Vimeo）
- 无嵌入链接 → `source_url` 按钮跳转
- 填写时长 `duration`

### 5.2 播客/音频

- 有 embed_url（SoundCloud、Spotify）→ 嵌入 audio 播放器
- 无嵌入 → `source_url` 按钮，注明"音频，不可嵌入"
- 填写时长 `duration`

### 5.3 PDF / 扫描文档

- 有 URL → `source_url` 按钮（外链打开）
- 无 URL → `source_url: null`，status: pending_link，卡片显示"[PDF，待补链接]"

### 5.4 公司内部备忘录

- 常见来源：Sequoia、a16z、Y Combinator 官方博客
- 标注：`organization`（公司）+ `people`（作者）
- 注意：很多是 PDF，部分有官方存档页面

### 5.5 投资资料（Pitch Deck、商业计划书）

- 截图/照片 → 标注 `[图片，待 OCR]` 或 `[待录入]`
- 有 PDF 链接 → `source_url`
- 标注：`organization`（融资方）+ `people`（创始人）+ `year`（融资年份）

### 5.6 访谈 / 口述史

- 有视频嵌入 → 嵌入
- 纯文字访谈 → 写 `source_url`
- 标注：`people`（受访者）+ `organization`（当时任职）

---

## 6. 状态流转

| 阶段 | status | 说明 |
|------|--------|------|
| 初建 | placeholder | 占位条目，字段未确认 |
| 核实 | verified | 链接有效，内容确认 |
| 待补 | pending_link | 来源待补，不伪造 |
| 未核实 | unverified | 有内容但未经详细核实 |

---

## 7. 禁止行为

- ❌ 不得伪造 source_url 或 embed_url
- ❌ 不得将 placeholder 标记为 verified
- ❌ 不得臆造作者、年份、内容描述
- ❌ 不得在无证据情况下声称"完整版"

---

## 8. 录入检查清单

- [ ] `id` 是否唯一？
- [ ] `title_zh` 是否填写？
- [ ] `category` 是否属于七大类？
- [ ] `summary_zh` 是否写完（视频/音频必填）？
- [ ] `why_it_matters_zh` 是否写完？
- [ ] `status` 是否正确？
- [ ] `source_url` 有链接还是待补？
- [ ] `embed_url` 有嵌入还是 null？
- [ ] JSON 是否合法？

---

*最后更新：2026-05-31*
