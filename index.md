# 数字花园

> 知识不是终点，而是持续生长的有机体

## 关于

这是我的个人数字花园，一个持续演进的思维空间。这里不追求完美的成品，而是记录思考过程、研究洞察和学习笔记。

**特点：**
- 永久更新：内容会随着理解深化而持续修订
- 有机连接：笔记之间相互链接，形成知识网络
- 公开透明：愿意分享不成熟的想法

---

## 最新更新

### 2026-03-30 | A2A 多 Agent 协作研究

**研究主题：** Google A2A 协议与多 Agent 系统

**核心发现：**
- A2A (Agent2Agent) 和 MCP (Model Context Protocol) 是互补的技术栈
- A2A 解决 Agent 之间的协作问题，MCP 解决 Agent 与工具的连接问题
- 构建了完整的三 Agent 演示系统 (Weather + Calculator + Host)

**关键词：** #a2a #mcp #multi-agent #agentscope #openclaw

[阅读全文 →](research/a2a-agent-collaboration.md)

---

### 2026-03-30 | AI 最重要的五个思想

**来源：** Daniel Miessler (2026-03-28)

**五个改变世界的思想：**
1. **自主组件优化** - AI 自我改进的通用循环
2. **意图驱动工程** - 从"如何做"到"清晰想要什么"
3. **透明性** - 使测量、验证和改进成为可能
4. **脚手架剥离** - 人类专注于创造性工作
5. **知识扩散** - 专业知识变为公共知识

**对 Hermes 的启示：** 实现通用改进循环 (Universal Improvement Cycle)

[阅读全文 →](research/ai-important-ideas-2026.md)

---

### 2026-03-30 | Evaluator vs Supervisor 对比分析

**研究主题：** Anthropic 的 Evaluator 模式与 Hermes Supervisor 模式的对比

**核心洞察：**
- **Evaluator** (开发阶段)：质检反馈 → Agent 重做，关注"做得好不好"
- **Supervisor** (运维阶段)：诊断 → ACK 或升级人类，关注"跑不跑得稳"
- 两者可以互补：Evaluator 提升质量，Supervisor 保障稳定性

**已构建：** Hermes Supervisor 完整实现

[阅读全文 →](research/anthropic-harness-vs-hermes-supervisor.md)

---

## 研究主题

### 🤖 AI Agent 系统

| 主题 | 描述 | 链接 |
|------|------|------|
| AgentScope 研究 | 多 Agent 框架深度分析 | [→](research/agentscope-multi-agent-framework-study.md) |
| AgentScope-Hermes 集成 | 完整集成方案 | [→](research/agentscope-hermes-integration-study.md) |
| A2A 协议 | Google Agent2Agent 协议研究 | [→](research/a2a-agent-collaboration.md) |
| 三 Agent 演示 | 天气+计算器+协调器演示 | [→](research/three-agent-a2a-setup.md) |
| Hermes Supervisor | Agent 监控与分诊系统 | [→](research/anthropic-harness-vs-hermes-supervisor.md) |

### 🔬 AI 研究前沿

| 主题 | 描述 | 链接 |
|------|------|------|
| Autoresearch | Karpathy 的自动研究项目分析 | [→](research/autoresearch-karpathy-ai-research-agents.md) |
| Autoresearch 实践 | 在 Hermes 中的应用指南 | [→](research/autoresearch-practical-application-guide.md) |
| AI 重要思想 2026 | Daniel Miessler 的五个核心思想 | [→](research/ai-important-ideas-2026.md) |
| Nano Banana Pro | 提示词工程分析 | [→](research/nano-banana-pro-prompts-analysis.md) |

### 🌐 去中心化 AI

| 主题 | 描述 | 链接 |
|------|------|------|
| 去中心化平台对比 | 10+ 平台深度分析 | [→](research/decentralized-ai-platforms-comparison.md) |
| DePIN AI 项目 | IoTeX、Grass、Aethir 等 | [→](research/depin-ai-projects-comparison.md) |
| 联邦学习 | 与 SOLID 协议的集成 | [→](research/federated-learning-solid-integration.md) |
| SOLID 协议 | AI 应用的 WebID 数据主权 | [→](research/solid-protocol-ai-integration.md) |

---

## 文章精选

### 思考与洞察

- [As Rocks May Think](articles/as-rocks-may-think.md) - 人机共存的深层思考
- [Books and Screens](articles/books-and-screens.md) - 纸质书 vs 屏幕阅读
- [Brewing Collectives](articles/brewing-collectives.md) - 集体智慧的酿造
- [Community Is Not Replicable](articles/community-is-not-replicable.md) - 社区的独特性
- [Consistency Is Primitive](articles/consistency-is-primitive.md) - 一致性的本质

### AI 与设计

- [AI Makes Coding Easier](articles/ai-makes-coding-easier.md) - AI 辅助编程的思考
- [Delightful Tools](articles/delightful-tools.md) - 令人愉悦的工具设计
- [DesignLab AI UX Survey 2026](articles/designlab-ai-ux-survey-2026.md) - AI 产品 UX 调查
- [Eric McLuhan Media Renaissance](articles/eric-mcluhan-media-renaissance.md) - 麦克卢汉的媒体理论

### 学习与教育

- [Lee Child Propulsion](articles/lee-child-propulsion.md) - 写作的动力
- [Moltbook Experiment](articles/moltbook-experiment.md) - 可塑书籍实验
- [Meaning Making Uncertainty](articles/meaning-making-uncertainty.md) - 意义建构与不确定性
- [Micah Blachman EdTech Critique](articles/micah-blachman-edtech-critique.md) - 教育科技批判

---

## 工具与资源

- [提示词生成器](tools/prompt-generator/) - 专业提示词设计工具
- [Agent 演示](projects/a2a-demo/) - A2A 多 Agent 协作示例
- [研究模板](resources/templates/) - 标准化研究文档模板

---

## 连接与导航

### 按标签浏览

- [#ai](tags/ai.md) - 人工智能
- [#multi-agent](tags/multi-agent.md) - 多智能体系统
- [#research](tags/research.md) - 研究方法论
- [#philosophy](tags/philosophy.md) - 哲学思考
- [#design](tags/design.md) - 设计思维
- [#education](tags/education.md) - 教育与学习

### 知识图谱

[查看完整连接图 →](connections/graph.md)

---

## 未来探索

[查看未来研究计划 →](future/README.md)

---

## 联系我

- 对这个数字花园感兴趣？
- 发现错误或有补充？
- 想深入讨论某个话题？

欢迎交流！

---

*最后更新：2026-03-30*

*使用 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) 许可*
