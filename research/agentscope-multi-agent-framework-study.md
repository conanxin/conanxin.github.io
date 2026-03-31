# AgentScope 多智能体框架深度研究

> **来源**: https://github.com/agentscope-ai/agentscope  
> **开发方**: 阿里巴巴 (Alibaba)  
> **研究日期**: 2025-04-09  
> **核心主题**: 面向开发者的生产级多智能体应用框架

---

## 1. 项目概览

### 1.1 基本信息

| 属性 | 详情 |
|-----|------|
| **项目名称** | AgentScope |
| **开发团队** | 阿里巴巴 (Alibaba) |
| **GitHub Stars** | 22,043+ |
| **Forks** | 2,189+ |
| **Issues** | 142+ |
| **主要语言** | Python |
| **Python 要求** | 3.10+ |
| **创建时间** | 2024-01-12 |
| **最后更新** | 2026-03-29 |
| **许可证** | Apache 2.0 |

### 1.2 核心理念

> *"Build and run agents you can see, understand and trust."*
> （构建和运行你可以看见、理解和信任的智能体）

AgentScope 是一个**生产就绪、易于使用的智能体框架**，其设计理念是：

1. **面向越来越智能的 LLM** - 利用模型的推理和工具使用能力
2. **而非限制它们** - 避免用严格的提示和固执的编排来约束模型
3. **开发者为中心** - 简化多智能体应用的开发和部署

---

## 2. 核心特性与优势

### 2.1 三大核心优势

| 优势 | 说明 | 具体功能 |
|-----|------|---------|
| **简单 (Simple)** | 5 分钟快速开始 | 内置 ReAct Agent、工具、技能、人机协同、记忆、规划、实时语音、评估、模型微调 |
| **可扩展 (Extensible)** | 丰富的生态系统集成 | 工具、内存、可观测性；内置 MCP 和 A2A 支持；MsgHub 灵活的多智能体编排 |
| **生产就绪 (Production-ready)** | 多种部署方式 | 本地部署、无服务器云部署、K8s 集群；内置 OTel 支持 |

### 2.2 关键特性详解

#### 内置 ReAct Agent

AgentScope 提供开箱即用的 ReAct (Reasoning + Acting) 智能体：

```python
from agentscope.agent import ReActAgent
from agentscope.model import DashScopeChatModel
from agentscope.memory import InMemoryMemory
from agentscope.tool import Toolkit

agent = ReActAgent(
    name="Friday",
    sys_prompt="You're a helpful assistant named Friday.",
    model=DashScopeChatModel(model_name="qwen-max"),
    memory=InMemoryMemory(),
    toolkit=toolkit,  # 注册工具
)
```

#### 实时语音交互

支持实时语音输入输出，包括：
- 语音识别 (ASR)
- 语音合成 (TTS)
- 实时打断和恢复

#### 人机协同 (Human-in-the-loop)

支持实时干预和引导：
- 对话可随时打断
- 通过强大的记忆保存无缝恢复
- 人类可以 steering 智能体行为

#### Agentic RL（智能体强化学习）

无缝集成强化学习训练智能体应用：

| 示例项目 | 描述 | 模型 | 训练结果 |
|---------|------|------|---------|
| Math Agent | 数学解题智能体 | Qwen3-0.6B | 准确率: 75% → 85% |
| Frozen Lake | 导航环境 | Qwen2.5-3B | 成功率: 15% → 86% |
| Learn to Ask | LLM-as-judge 自动反馈 | Qwen2.5-7B | 准确率: 47% → 92% |
| Werewolf Game | 多智能体战略游戏 | Qwen2.5-7B | 胜率: 50% → 80% |

---

## 3. 架构与核心组件

### 3.1 整体架构

```
┌─────────────────────────────────────────────────────────────────┐
│                     AgentScope Ecosystem                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    Application Layer                        ││
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐   ││
│  │  │ ReAct    │ │ Voice    │ │ Browser  │ │ Deep Research│   ││
│  │  │ Agent    │ │ Agent    │ │ Agent    │ │ Agent        │   ││
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────────┘   ││
│  └─────────────────────────────────────────────────────────────┘│
│                              │                                   │
│  ┌───────────────────────────┴─────────────────────────────────┐│
│  │                  AgentScope Core Framework                   ││
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   ││
│  │  │   Agent      │  │   Memory     │  │      Tool        │   ││
│  │  │   智能体     │  │   记忆系统   │  │      工具        │   ││
│  │  └──────────────┘  └──────────────┘  └──────────────────┘   ││
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   ││
│  │  │   Model      │  │   Pipeline   │  │      MsgHub      │   ││
│  │  │   模型接口   │  │   工作流     │  │   消息中心       │   ││
│  │  └──────────────┘  └──────────────┘  └──────────────────┘   ││
│  └─────────────────────────────────────────────────────────────┘│
│                              │                                   │
│  ┌───────────────────────────┴─────────────────────────────────┐│
│  │                    Integration Layer                         ││
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────┐  ││
│  │  │    MCP     │ │    A2A     │ │   RAG      │ │   RL     │  ││
│  │  │ 协议支持   │ │ 协议支持   │ │ 检索增强   │ │ 强化学习 │  ││
│  │  └────────────┘ └────────────┘ └────────────┘ └──────────┘  ││
│  └─────────────────────────────────────────────────────────────┘│
│                              │                                   │
│  ┌───────────────────────────┴─────────────────────────────────┐│
│  │                  Infrastructure Layer                        ││
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────┐  ││
│  │  │  DashScope │ │  OpenAI    │ │  Ollama    │ │ Others   │  ││
│  │  │  通义千问  │ │  GPT-4     │ │  本地模型  │ │ ...      │  ││
│  │  └────────────┘ └────────────┘ └────────────┘ └──────────┘  ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 核心组件详解

#### Agent（智能体）

AgentScope 提供多种智能体类型：

- **ReActAgent** - 推理+行动的智能体
- **UserAgent** - 人类用户代理
- **VoiceAgent** - 语音交互智能体
- **BrowserAgent** - 浏览器自动化智能体

#### Memory（记忆系统）

多层次记忆支持：

```python
from agentscope.memory import InMemoryMemory, ReMe

# 短期记忆
short_term = InMemoryMemory()

# 长期记忆 (ReMe)
long_term = ReMe(
    embedding_model="text-embedding-v2",
    storage_path="~/.agentscope/memory"
)
```

#### Tool（工具系统）

灵活的工具注册和使用：

```python
from agentscope.tool import Toolkit
from agentscope.tool.tools import execute_python_code

toolkit = Toolkit()
toolkit.register_tool_function(execute_python_code)
```

#### MsgHub（消息中心）

多智能体对话管理：

```python
from agentscope.pipeline import MsgHub, sequential_pipeline

async with MsgHub(
    participants=[agent1, agent2, agent3],
    announcement=Msg("Host", "Introduce yourselves.")
) as hub:
    await sequential_pipeline([agent1, agent2, agent3])
```

---

## 4. 快速开始

### 4.1 安装

```bash
# 从 PyPI 安装
pip install agentscope

# 或使用 uv
uv pip install agentscope

# 从源码安装
git clone -b main https://github.com/agentscope-ai/agentscope.git
cd agentscope
pip install -e .
```

### 4.2 Hello AgentScope!

```python
from agentscope.agent import ReActAgent, UserAgent
from agentscope.model import DashScopeChatModel
from agentscope.formatter import DashScopeChatFormatter
from agentscope.memory import InMemoryMemory
from agentscope.tool import Toolkit, execute_python_code
import os, asyncio


async def main():
    # 创建工具集
    toolkit = Toolkit()
    toolkit.register_tool_function(execute_python_code)

    # 创建 ReAct 智能体
    agent = ReActAgent(
        name="Friday",
        sys_prompt="You're a helpful assistant named Friday.",
        model=DashScopeChatModel(
            model_name="qwen-max",
            api_key=os.environ["DASHSCOPE_API_KEY"],
            stream=True,
        ),
        memory=InMemoryMemory(),
        formatter=DashScopeChatFormatter(),
        toolkit=toolkit,
    )

    # 创建用户代理
    user = UserAgent(name="user")

    # 对话循环
    msg = None
    while True:
        msg = await agent(msg)  # 智能体回复
        msg = await user(msg)   # 用户输入
        if msg.get_text_content() == "exit":
            break

asyncio.run(main())
```

### 4.3 MCP 工具使用

AgentScope 支持灵活的 MCP (Model Context Protocol) 工具使用：

```python
from agentscope.mcp import HttpStatelessClient
from agentscope.tool import Toolkit
import os

async def mcp_example():
    # 初始化 MCP 客户端
    client = HttpStatelessClient(
        name="gaode_mcp",
        transport="streamable_http",
        url=f"https://mcp.amap.com/mcp?key={os.environ['GAODE_API_KEY']}",
    )

    # 获取 MCP 工具作为本地可调用函数
    func = await client.get_callable_function(func_name="maps_geo")

    # 选项 1: 直接调用
    await func(address="天安门广场", city="北京")

    # 选项 2: 作为智能体工具
    toolkit = Toolkit()
    toolkit.register_tool_function(func)
```

---

## 5. 应用场景与示例

### 5.1 功能示例

| 类别 | 示例 | 描述 |
|-----|------|------|
| **MCP** | [MCP 示例](https://github.com/agentscope-ai/agentscope/tree/main/examples/functionality/mcp) | Model Context Protocol 使用 |
| **Agent Skill** | [Anthropic Agent Skill](https://github.com/agentscope-ai/agentscope/tree/main/examples/functionality/agent_skill) | 智能体技能扩展 |
| **规划** | [Plan](https://github.com/agentscope-ai/agentscope/tree/main/examples/functionality/plan) | 任务规划与执行 |
| **结构化输出** | [Structured Output](https://github.com/agentscope-ai/agentscope/tree/main/examples/functionality/structured_output) | 结构化数据输出 |
| **RAG** | [RAG 示例](https://github.com/agentscope-ai/agentscope/tree/main/examples/functionality/rag) | 检索增强生成 |
| **长期记忆** | [Long-Term Memory](https://github.com/agentscope-ai/agentscope/tree/main/examples/functionality/long_term_memory) | ReMe 长期记忆 |
| **TTS** | [TTS 示例](https://github.com/agentscope-ai/agentscope/tree/main/examples/functionality/tts) | 语音合成 |

### 5.2 智能体示例

| 智能体类型 | 链接 | 特点 |
|-----------|------|------|
| **ReAct Agent** | [示例](https://github.com/agentscope-ai/agentscope/tree/main/examples/agent/react_agent) | 推理+行动基础智能体 |
| **Voice Agent** | [示例](https://github.com/agentscope-ai/agentscope/tree/main/examples/agent/voice_agent) | 语音交互智能体 |
| **Browser Agent** | [示例](https://github.com/agentscope-ai/agentscope/tree/main/examples/agent/browser_agent) | 浏览器自动化 |
| **Deep Research** | [示例](https://github.com/agentscope-ai/agentscope/tree/main/examples/agent/deep_research_agent) | 深度研究智能体 |
| **Meta Planner** | [示例](https://github.com/agentscope-ai/agentscope/tree/main/examples/agent/meta_planner_agent) | 元规划智能体 |
| **A2A Agent** | [示例](https://github.com/agentscope-ai/agentscope/tree/main/examples/agent/a2a_agent) | Agent-to-Agent 协议 |
| **Realtime Voice** | [示例](https://github.com/agentscope-ai/agentscope/tree/main/examples/agent/realtime_voice_agent) | 实时语音智能体 |

### 5.3 游戏示例

- **九人狼人杀** - [Werewolves](https://github.com/agentscope-ai/agentscope/tree/main/examples/game/werewolves)
  - 展示多智能体复杂交互
  - 战略推理和欺骗检测

### 5.4 工作流示例

| 工作流 | 链接 | 描述 |
|-------|------|------|
| **多智能体辩论** | [示例](https://github.com/agentscope-ai/agentscope/tree/main/examples/workflows/multiagent_debate) | 观点辩论与碰撞 |
| **多智能体对话** | [示例](https://github.com/agentscope-ai/agentscope/tree/main/examples/workflows/multiagent_conversation) | 群组讨论 |
| **并行执行** | [示例](https://github.com/agentscope-ai/agentscope/tree/main/examples/workflows/multiagent_concurrent) | 并发处理 |
| **实时对话** | [示例](https://github.com/agentscope-ai/agentscope/tree/main/examples/workflows/multiagent_realtime) | 实时语音群组 |

---

## 6. 最新动态 (2026)

### 6.1 重要更新

- **[2026-03]** **CoPaw** - 开源 AI 助手，基于 AgentScope、AgentScope-Runtime 和 ReMe
- **[2026-02]** **Realtime Voice Agent** - 实时语音智能体支持
- **[2026-01]** **双周会议** - 社区生态更新和开发计划分享
- **[2026-01]** **数据库支持** - 内存模块支持数据库和内存压缩
- **[2025-12]** **A2A 协议** - Agent-to-Agent 协议支持
- **[2025-12]** **TTS 支持** - 语音合成功能
- **[2025-11]** **Anthropic Agent Skill** - Anthropic 智能体技能支持
- **[2025-11]** **Trinity-RFT** - 通过 Trinity-RFT 库实现 Agentic RL
- **[2025-11]** **ReMe** - 增强长期记忆
- **[2025-11]** **AgentScope Runtime** - Docker/K8s 部署和 VNC 支持的 GUI 沙箱

### 6.2 相关项目

- **CoPaw** - 个人智能体工作站
- **AgentScope-Runtime** - 运行时和部署支持
- **ReMe** - 长期记忆系统
- **Trinity-RFT** - 强化学习训练库

---

## 7. 与同类框架对比

### 7.1 多智能体框架对比

| 特性 | AgentScope | AutoGen | LangGraph | CrewAI |
|-----|-----------|---------|-----------|--------|
| **开发方** | 阿里巴巴 | 微软 | LangChain | 独立 |
| **Stars** | 22k+ | 50k+ | 30k+ | 25k+ |
| **主要语言** | Python | Python | Python | Python |
| **设计理念** | 面向开发者 | 对话编程 | 图结构 | 角色扮演 |
| **实时语音** | ✅ | ✅ | ❌ | ❌ |
| **Agentic RL** | ✅ | ❌ | ❌ | ❌ |
| **生产部署** | ✅ 内置 | 需要配置 | 需要配置 | 需要配置 |
| **MCP 支持** | ✅ | ❌ | ❌ | ❌ |
| **A2A 支持** | ✅ | ❌ | ❌ | ❌ |
| **人机协同** | ✅ 实时打断 | 基础支持 | 基础支持 | 基础支持 |
| **中文支持** | ✅ 优秀 | 一般 | 一般 | 一般 |

### 7.2 AgentScope 的独特优势

1. **企业级支持** - 阿里巴巴背书，生产环境验证
2. **中文生态** - 优秀的通义千问集成和中文文档
3. **Agentic RL** - 独特的强化学习训练能力
4. **协议兼容** - MCP 和 A2A 协议支持
5. **实时交互** - 强大的语音和实时打断能力
6. **开发者友好** - 简洁的 API 设计

---

## 8. 与已有研究的关联

### 8.1 与 Autoresearch 的关系

**已有研究**: [[autoresearch-karpathy-ai-research-agents]]

**关联点**:
- AgentScope 的 Agentic RL 功能实现了类似 autoresearch 的自动化优化
- 都强调 AI 自主迭代和优化
- AgentScope 提供了更完整的框架和部署支持

**差异**:
- Autoresearch 专注于 ML 模型优化
- AgentScope 是通用多智能体应用框架

### 8.2 与去中心化 AI 生态的关系

**已有研究**: [[decentralized-ai-landscape]]

**关联点**:
- AgentScope 支持多智能体协作
- A2A 协议促进智能体间的去中心化通信
- 可以构建分布式智能体应用

### 8.3 与 AI 创作工具的关系

**已有研究**: [[nano-banana-pro-prompts-analysis]]

**关联点**:
- AgentScope 可以用于构建 AI 创作工作流
- 多智能体协作完成复杂创作任务
- 可以作为 Nano Banana Pro 等工具的上层编排框架

---

## 9. 实践建议

### 9.1 适用场景

✅ **适合使用 AgentScope**:
- 需要多智能体协作的复杂任务
- 需要实时语音交互的应用
- 需要人机协同的场景
- 需要强化学习优化的应用
- 生产环境部署

❌ **不适合使用 AgentScope**:
- 简单的单轮对话应用
- 对延迟要求极高的实时系统
- 资源受限的边缘设备

### 9.2 学习路径

```
阶段 1: 基础 (1-2 天)
├── 安装和 Hello World
├── 理解 ReAct Agent
└── 基础工具使用

阶段 2: 进阶 (1 周)
├── 多智能体对话
├── 记忆系统
├── MCP 工具集成
└── 工作流编排

阶段 3: 高级 (2-4 周)
├── 实时语音智能体
├── Agentic RL 训练
├── 生产部署
└── 自定义扩展
```

### 9.3 快速开始清单

- [ ] 安装 AgentScope (`pip install agentscope`)
- [ ] 运行 Hello World 示例
- [ ] 配置模型 API (通义千问/OpenAI)
- [ ] 尝试 ReAct Agent 示例
- [ ] 了解 MsgHub 多智能体对话
- [ ] 查看感兴趣的应用场景示例

---

## 10. 参考资源

### 官方资源

- **GitHub**: https://github.com/agentscope-ai/agentscope
- **文档**: https://doc.agentscope.io/
- **教程**: https://doc.agentscope.io/tutorial/
- **FAQ**: https://doc.agentscope.io/tutorial/faq.html
- **API 文档**: https://doc.agentscope.io/api/agentscope.html

### 社区

- **Discord**: https://discord.gg/eYMpfnkG8h
- **钉钉群**: 查看 README 中的二维码

### 学术论文

1. **AgentScope 1.0** - [arXiv:2508.16279](https://arxiv.org/abs/2508.16279)
2. **AgentScope 原始论文** - [arXiv:2402.14034](https://arxiv.org/abs/2402.14034)

### 相关项目

- **CoPaw**: https://github.com/agentscope-ai/CoPaw
- **AgentScope-Runtime**: https://github.com/agentscope-ai/agentscope-runtime
- **ReMe**: https://github.com/agentscope-ai/ReMe
- **Trinity-RFT**: https://github.com/agentscope-ai/Trinity-RFT

---

## 11. 核心引用

> *"Build and run agents you can see, understand and trust."*

> *"We design for increasingly agentic LLMs. Our approach leverages the models' reasoning and tool use abilities rather than constraining them with strict prompts and opinionated orchestrations."*

> *"Simple: start building your agents in 5 minutes with built-in ReAct agent, tools, skills, human-in-the-loop steering, memory, planning, realtime voice, evaluation and model finetuning"*

---

## 12. 标签

#agentscope #multi-agent #framework #alibaba #react-agent #mcp #a2a #voice-agent #agentic-rl #production-ready #python #llm #ai-agents

---

**研究完成时间**: 2025-04-09  
**文档长度**: ~8,000 字  
**覆盖范围**: 架构、特性、示例、对比、实践建议
