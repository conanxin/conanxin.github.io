# SOURCE_MAP.md — 来源映射

> 完整记录本课程页面所有外部来源的引用关系。

---

## 核心来源

| ID | 来源 | URL | 类型 | 用途 |
|----|------|-----|------|------|
| src001 | MIT How2AI Course | https://mit-mi.github.io/how2ai-course/spring2025/ | course_homepage | slides_url 基础路径 |
| src002 | MIT How2AI Schedule | https://mit-mi.github.io/how2ai-course/spring2025/schedule/ | course_schedule | 原始数据来源 |
| src003 | MIT OCW MAS.S60 | https://ocw.mit.edu/courses/mas-s60-how-to-ai-almost-anything-spring-2025/ | ocw | 官方 OCW 存档 |
| src004 | Paul Liang Homepage | https://pliang279.github.io/ | personal_page | 导师介绍 |
| src005 | MIT Multisensory Intelligence Group | https://mit-mi.github.io/ | lab_homepage | 研究组介绍 |
| src006 | How2AI YouTube Playlist | https://www.youtube.com/playlist?list=PLc0Yh0D0XR4Z3wityRaEuu4rfzTHRIIAO | video_playlist | 视频链接 |

---

## 官方 Schedule 链接统计

- **总计**：124 个链接
- **Slides PDF**：13 个（11 个 lecture slides + Debugging Tips）
- **YouTube 视频**：12 个
- **论文/Blog/资源**：99 个

**Slides PDF 状态**：
- lec1 – lec11 全部 PDF 在 MIT 服务器上返回 HTTP 404（课程服务器状态）
- 这是原课程的已知问题，不影响本导览页
- 所有 slides_url 在 course.json 中仍然以原始 URL 记录

---

## 精选论文导读（readings.json）— 32 篇

| # | 论文 | URL | 类别 |
|---|------|-----|------|
| r001 | Foundations and Trends in Multimodal ML | https://arxiv.org/abs/2209.03430 | Foundation |
| r002 | Multimodal Machine Learning: A Survey | https://arxiv.org/abs/1705.09406 | Foundation |
| r003 | Representation Learning: A Review | https://arxiv.org/abs/1206.5538 | Foundation |
| ... | ... | ... | ... |

（详见 data/readings.json）

---

## 官方阅读清单（official_reading_map.json）— 85 篇

全部来自官方 schedule 页面的 readings 列表。

**角色分类**：
- Core Reading（核心阅读）：直接支撑 lecture 主题的论文
- Discussion Reading（讨论阅读）：用于对应周的 discussion session
- Project Reference（项目参考）：对课程项目有直接帮助的工具/方法论文
- Supplementary（补充材料）：扩展阅读

---

## 术语表来源（glossary.json）— 47 条

基于课程内容自主整理，参考：
- 原课程 lecture topics
- 各论文摘要
- MIT Multisensory Intelligence Group 研究方向

---

## 第三方 CSS 字体

- Google Fonts: Noto Sans SC（中文正文）、JetBrains Mono（代码/数字）
- 字体 CDN：https://fonts.googleapis.com

---

## 版权说明

本课程页面：
1. 不复制任何 slides 的图片或大段原文
2. 不提供论文 PDF 的直接下载
3. 中文内容为基于公开资料的中文重构，非逐字翻译
4. 所有外部链接保持原始指向
5. 非商业用途，仅供学习参考
