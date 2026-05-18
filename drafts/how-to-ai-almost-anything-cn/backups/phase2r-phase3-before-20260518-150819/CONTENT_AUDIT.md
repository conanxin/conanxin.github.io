# CONTENT_AUDIT.md — 内容设计审计

> 本文档记录 Phase 2 迭代中做出的内容设计决策与理由。

---

## 模块体系设计

**最终结构：Module 0（导论）+ 四大模块**

| ID | 英文名 | 中文名 | 周次 |
|----|--------|--------|------|
| mod0-intro | Introduction & AI Research Methods | 导论与 AI 研究方法 | Week 1 |
| mod1-foundations | AI Foundations | AI 基础 | Week 2–4 |
| mod2-multimodal | Multimodal AI | 多模态 AI | Week 5–8 |
| mod3-llm | Large Models and Modern AI | 大模型与现代 AI | Week 9–13 |
| mod4-interactive | Interactive AI | 交互式 AI | Week 14–15 |

**设计决策：**
- 不将"导论"与"基础"合并——导论课（Introduction + AI Research）是元内容，与具体的"数据/工具/架构"基础课有本质区别
- Discussion sessions 不作为独立模块，而是分散在各模块内部，作为该模块的深度讨论
- Project 节点（proposal/midterm/final）归属于其所在周次的模块，不单独列为模块

---

## 数据文件职责分离

| 文件 | 职责 |
|------|------|
| `course.json` | 27 节 session，含中文摘要、关键概念、学习目标、练习题、项目关联 |
| `readings.json` | 32 篇精选中文导读论文，含作者、年份、分类、中文导读 |
| `official_reading_map.json` | 85 篇官方阅读完整清单，含 session 来源、角色分类、需手动验证标记 |
| `raw_schedule_links.json` | 从官方 schedule 页面原始解析的 124 个链接，含类型、编码 |
| `original_schedule_map.json` | 官方 schedule 的 session 结构映射 |
| `glossary.json` | 47 个中英双语术语，含定义、相关 session |
| `sources.json` | 36 个来源条目，含 URL、类型、发布者、许可说明 |

---

## 链接状态管理策略

| 类型 | 策略 |
|------|------|
| Slides PDF | 从 schedule 原始解析，使用 URL 编码；404 为课程服务器真实状态，记录但不伪造 |
| YouTube 视频 | 保留 URL（mit-mi.github.io 指向的播放列表已知有效）；服务器端 curl 可能无法访问，标记为 SKIPPED_MANUAL_REVIEW |
| arXiv 论文 | 保留 URL；curl 超时判为 TIMEOUT_PROBABLY_OK，不判为 broken |
| ACM/ScienceDirect | 学术平台 403 通常为付费墙，标记为 SKIPPED_MANUAL_REVIEW |
| Colab | 保留 URL；curl 无法访问，标记为 SKIPPED_MANUAL_REVIEW |

---

## Session 内容深度标准

每节 lecture 包含：
1. 原课程位置（Week X）
2. 原始英文标题
3. 中文标题
4. 本节核心问题（zh_summary）
5. 3–5 个关键概念（key_concepts）
6. 中文学习说明（zh_summary 展开）
7. 与前后课程的关系（包含在 zh_summary 中）
8. 推荐阅读顺序（包含在 readings 字段中）
9. Mini exercise（practice_prompt）
10. Project connection
11. Source refs（slides/video 原始链接）

Discussion sessions：内容聚焦在论文讨论的主题列表和讨论问题上。
Special sessions（放假）：灰色展示，不含展开内容。

---

## 精选 vs. 官方阅读双层结构

**精选中文导读（readings.json）**：
- 32 篇课程核心论文
- 每篇含 zh_title、why_it_matters、chinese_reading_guide
- 按 category 分类筛选（Foundation / Multimodal / LLM / Generative / Agent / HAI）
- 含七角色适用性标签

**官方完整阅读清单（official_reading_map.json）**：
- 85 篇官方 schedule 中列出的全部 readings
- 含 original_title、url、type、reading_role（core/discussion/project/supplementary）
- 按 reading_role 分类筛选
- 标注 needs_manual_review（学术平台需手动浏览器验证）

---

## 版权边界说明

- 不复制 slides 的任何图像或文字内容
- 不提供 PDF 下载直链（仅在 course.json 中保留原始 URL 供用户自行访问）
- 中文摘要为基于公开课程资料的重构，不是逐字翻译
- 论文链接仅提供标题、中文导读和学习建议，不提供 PDF 全文
- 版权声明已在页面底部和 index.html meta 中明确标注
