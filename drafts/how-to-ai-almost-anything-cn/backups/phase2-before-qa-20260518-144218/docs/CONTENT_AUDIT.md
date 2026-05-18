# How2AI 中文课程 — 内容设计笔记

## 项目概述

将 MIT MAS.S60 How to AI (Almost) Anything (Spring 2025) 重建为一个完整的中文交互学习页面。

**目标用户**：中文学习者（本科高年级/研究生），对多模态 AI 研究有兴趣但英文阅读有障碍。

**设计理念**：「消化式中文课程」——不是逐字翻译，而是经过理解、重构、补充的中文学习导览。

## 设计原则

1. **严格对应原课程结构**：每个 Week/Session 的中文内容可以追溯到原课程的哪个环节
2. **中文优先但保留英文关键术语**：术语首次出现时给出中英双语，后续使用最通行的形式
3. **可交互性**：展开/折叠、筛选、搜索、进度追踪全部在前端实现
4. **自包含 SVG 图解**：不盗用原课程 slides，所有配图原创 SVG/CSS
5. **本地持久化**：学习进度通过 localStorage 保存

## 页面结构设计

### index.html 布局

```
[Hero] 课程名称 + 一句话描述 + 立即开始按钮
[导航 Tabs] 全部 / Module 1-4 / 时间线
[Filter Bar] Readings 分类筛选
[Timeline] 15 周课程时间线（SVG/CSS）
[Session Cards] 每节课可展开卡片
[Multimodal Concept Map] SVG 概念地图
[Modality Pipeline] 数据→表征→架构→训练→评估→部署
[Seven Roles Panel] 七角色论文讨论交互面板
[Glossary Search] 术语表搜索
[Mini Quiz / Reflection] 每节课后的思考题
[Footer] 版权声明 + 来源链接
```

## 四大模块映射

| 模块 | 原课程名称 | 周次 | 核心主题 |
|------|-----------|------|---------|
| M0 | Introduction | Week 1 | 课程导论 + AI 研究方法 |
| M1 | Foundations | Week 2, 4 | 数据基础 + 模型架构 + 工具 |
| M2 | Multimodal | Week 5, 6, 7 | 对齐 + 融合 + 迁移 |
| M3 | Large Models | Week 9, 11, 12 | Foundation LLM + LMM + Generative |
| M4 | Interactive | Week 14, 15 | Agent + Human-AI Interaction |

## 七种论文讨论角色设计

| 角色 | 核心问题 | 阅读策略 |
|------|---------|---------|
| Peer Reviewer | 这篇论文能不能中顶会？ | 找创新点、局限性、实验是否充分 |
| Archaeologist | 这篇论文的历史脉络是什么？ | 追溯引用关系、前身工作 |
| Academic Researcher | 我能从中学到什么方法？ | 提取可复现的技术方案 |
| Industry Practitioner | 这个能用到我的产品里吗？ | 评估工程可行性、落地门槛 |
| Hacker | 我能hack什么？ | 找安全漏洞、攻击面 |
| Private Investigator | 论文没说什么？ | 找隐瞒的实验设置、负面结果 |
| Social Impact Assessor | 这对社会有什么影响？ | 评估伦理风险、社会效益 |

## SVG 图解设计

### 1. Almost Anything 系列谱系图
```
HTMAA (1998) ←→ HTGAA (2018) ←→ How2AI (2025)
  ↓                  ↓                ↓
 Neil              MIT              MIT-MI
 Gershenfeld       Media Lab        Paul Liang
```

### 2. 多模态 AI 五层结构图
```
         ┌─────────────────┐
         │   Application   │  ← 任务层
         ├─────────────────┤
         │     Fusion      │  ← 融合层
         ├─────────────────┤
         │   Alignment     │  ← 对齐层
         ├─────────────────┤
         │  Representation │  ← 表示层
         ├─────────────────┤
         │     Modality    │  ← 模态层
         └─────────────────┘
```

### 3. 多模态 AI 化流程图
```
数据收集 → 表征学习 → 架构设计 → 训练策略 → 评估基准 → 部署应用
  ↓           ↓           ↓          ↓          ↓         ↓
 收集策略   模态编码器   融合方式    预训练     基准测试   场景适配
```

### 4. 七角色轮盘
SVG 圆盘，7 个扇区代表 7 种角色，鼠标悬停显示角色描述和适用论文类型。

## 数据字段设计

### course.json 字段
- `id`: 唯一标识（w01-intro 格式）
- `date`: ISO 日期（来自原课程）
- `week`: 周次
- `module`: 模块（intro/foundation/multimodal/llm/interaction/project/discussion）
- `original_title`: 原始英文标题
- `zh_title`: 中文标题
- `original_topics`: 原始主题列表
- `zh_summary`: 中文摘要（100-200字）
- `key_concepts`: 关键概念（中英双语数组）
- `readings`: 相关阅读标题列表
- `slides_url`: 原始 slides 链接
- `video_url`: YouTube 视频 ID
- `learning_objectives`: 学习目标列表
- `practice_prompt`: 练习/思考题
- `project_connection`: 与课程研究项目的关系
- `source_ref`: 原始课程来源引用

### readings.json 字段
- `id`: rXXX 格式
- `title`: 英文标题
- `zh_title`: 中文标题
- `authors`: 作者
- `year`: 年份
- `url`: arXiv/论文链接
- `category`: 分类（Foundation/Multimodal/LLM/Generative/Agent/HAI）
- `why_it_matters`: 为什么重要（中文）
- `chinese_reading_guide`: 中文导读
- `discussion_roles_applicable`: 适用的讨论角色

## 技术实现

### 前端交互
- 纯 HTML/CSS/JS，无框架依赖
- localStorage 存储：已浏览课程、已完成阅读、笔记
- CSS Grid + Flexbox 响应式布局
- SVG 内联绘图（不依赖外部图片）

### CSS 设计
- CSS Variables 主题变量
- 深色/浅色模式支持（可选）
- 移动端优先响应式断点：320px / 768px / 1024px / 1440px
- 卡片展开动画使用 CSS transition

### JavaScript 模块化
- `renderTimeline()`: 渲染课程时间线
- `renderSessions()`: 渲染课程卡片
- `filterByModule()`: 模块筛选
- `filterReadings()`: Readings 筛选
- `searchGlossary()`: 术语搜索
- `saveProgress()` / `loadProgress()`: localStorage 读写
- `renderSevenRoles()`: 七角色交互面板
- `renderModalityPipeline()`: 多模态流程图

## 质量标准

1. 所有中文内容由英文原文理解后重写，非逐字翻译
2. 对无法确认的信息标注「需进一步核实」
3. 版权边界：slides 内容不逐页翻译，保留原始链接
4. 页面必须加 noindex（draft 状态）
5. 所有来源集中写入 sources.json

## 待补充内容（需进一步核实）

1. Week 12 生成模型视频 URL（课程页标注为空）
2. Discussion 课是否有 slides 及具体链接
3. 项目 Ablation Study 的具体截止日期
4. 每节课是否有官方中文翻译版本
5. Paul Liang 在 HTGAA 的具体参与情况

---

*设计笔记最后更新：2025-05-18*
