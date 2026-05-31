# Phase 1A 录入报告：原帖配图内容消化

**日期：** 2026-05-31
**批次：** `original-post-images-2026-05-31`
**录入依据：** 用户提供的4张 X 帖子配图（截图识别）

---

## 一、本轮录入概述

本轮 **未联网检索**，未伪造任何 URL，所有 `source_url` 和 `embed_url` 均留空。

---

## 二、录入条目总数：74 条

| 分类 | 中文分类名 | 数量 |
|------|-----------|------|
| Written content / Life | 文章与人生思考 | 23 |
| Documentaries | 纪录片 | 25 |
| Interviews | 访谈 | 16 |
| Memos | 公司内部备忘录与经典文本 | 10 |

---

## 三、待核实标题清单

以下条目标题存在疑点，**待 Phase 1B 逐一核实**，不得作为 verified 状态：

| id | title_en（截图原文） | 疑点说明 |
|----|---------------------|---------|
| iba-005 | A Project of One Own | 疑似应为 "A Project of One's Own"（多了's），待核实 |
| iba-029 | Choke | 片名需确认是纪录片而非虚构片段混淆 |
| iba-045 | Jiro Dream Of Sushi | 常见英文名为 "Jiro Dreams of Sushi"，待核实 |
| iba-065 | The Education of a Libertarian | 作者与确切出处待核实 |
| iba-068 | Bessemer Venture Partners (collection) | 需确认具体篇目列表 |
| iba-073 | How we work and why - Hunter Harrison | 需确认为备忘录还是演讲记录 |

---

## 四、未做事项（硬性边界）

- ❌ 未联网检索 source_url
- ❌ 未伪造 embed_url
- ❌ 未填写 source_url / embed_url
- ❌ 未标记为 verified

---

## 五、字段状态说明

| 字段 | 值 |
|------|-----|
| `source_url` | `""`（空字符串，全部待补） |
| `embed_url` | `""`（空字符串，全部待补） |
| `source_status` | `"待检索"` |
| `verification_status` | `"截图可读，来源待核实"` |
| `translation_status` | `"标题已初译，内容待翻译"` |
| `status` | `"staging"` |
| `screenshot_batch` | `"original-post-images-2026-05-31"` |

---

## 六、备份文件

- `data/items.backup.phase1a.json` — 骨架阶段 placeholder 数据备份

---

## 七、下一步建议

**Phase 1B — Source Lookup（来源查找）**

按优先级逐分类查找：

1. **Memos 优先**（10条）：来源最明确，容易找到官方存档
   - Bill Gates Tidal Wave → Microsoft 官网/Guarding the Family
   - Ray Ozzie Disruption → Microsoft 官方博客/Ozzie 个人博客
   - Jobs On Flash → Apple 官网/Slate 存档
   - Alan C. Greenberg Bear Stearns → Bessemer 官方/Bear Stearns 遗产存档
   - Howard Schultz → Starbucks 官方存档
   - Andrew Bosworth → Meta 官方/Boz 博客

2. **Interviews**（16条）：视频访谈优先找 YouTube/Vimeo 嵌入
   - Steve Jobs Lost Interview → YouTube（已有大量上传）
   - Jeff Bezos 2001 → 各大视频平台
   - Sam Altman → Y Combinator/YouTube

3. **Documentaries**（25条）：优先找流媒体嵌入
   - Netflix/HBO/YouTube 官方发布
   - Startup.com → Internet Archive
   - General Magic → 官网/YouTube

4. **Articles & Life**（23条）：优先找原文/Medium/个人博客存档
   - George Orwell Why I Write → 古腾堡计划/官方存档
   - Kevin Kelly 101 Additional Advice → KK 官网
   - Richard Feynman → Caltech 官网/BBC Archive

---

## 八、录入检查清单（逐项确认）

- [x] 每条 id 唯一
- [x] 每条有 title_zh
- [x] 每条有 title_en
- [x] 每条有 category
- [x] 每条有 source_status = "待检索"
- [x] 每条有 verification_status
- [x] 每条有 translation_status
- [x] 每条有 status = "staging"
- [x] 每条有 screenshot_batch
- [x] 无伪造 source_url
- [x] 无伪造 embed_url
- [x] JSON 格式合法
- [x] 74条条目全部在 staging 状态

---

*报告生成：2026-05-31 | cloud_hermes Phase 1A*
