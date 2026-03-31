# AgentScope × Hermes 系统集成分析

## 一、架构对比

| 维度 | Hermes Agent | AgentScope |
|------|-------------|-----------|
| **核心架构** | 同步循环 + 工具编排 | Ray-based Actor 模型 |
| **并发模型** | 单线程（异步工具） | 原生分布式异步 |
| **Agent 粒度** | 单一 Agent + 子代理委派 | 多 Agent 协同网络 |
| **状态管理** | SQLite + memory 工具 | Actor 状态 + 消息传递 |
| **可视化** | CLI 界面 + 平台网关 | Studio 可视化工作流 |
| **扩展机制** | Skills + Tools 注册表 | Agents + Services |
| **记忆系统** | 持久化 memory + trajectory | 可配置的 Memory 组件 |
| **协议支持** | MCP (Model Context Protocol) | A2A (Agent-to-Agent) |

## 二、核心结合点

### 1. 工具生态互通

```
Hermes Tools ←→ AgentScope Services
```

**场景**：将 Hermes 的 20+ 工具暴露给 AgentScope 的 Agent 网络

```python
# agentscope-service-wrapper.py
from agentscope.service import ServiceToolkit
import hermes_agent_sdk

# 包装 Hermes 工具为 AgentScope Service
hermes_tools = ServiceToolkit()

for tool_name, tool_schema in hermes_agent_sdk.list_tools():
    @hermes_tools.register(tool_name, **tool_schema)
    def wrapped_tool(**params):
        # 通过 subprocess/MCP 调用 Hermes 工具
        return hermes_agent_sdk.execute(tool_name, params)

# AgentScope Agent 可以直接使用
agent = DialogAgent(
    name="HermesBridge",
    model_config={...},
    service_toolkit=hermes_tools
)
```

**可用工具映射**：
- `terminal` → BashService
- `web_search` → WebSearchService
- `file_read/write` → FileService
- `browser_*` → BrowserService
- `delegate_task` → 创建子 Agent

### 2. 多智能体工作流编排

**Hermes 当前局限**：单一 Agent + 简单委派
**AgentScope 补充**：复杂多 Agent 协作流程

```python
# 使用 AgentScope 编排 Hermes 工作流
import agentscope
from agentscope.agents import UserAgent, DialogAgent
from agentscope.pipelines import sequentialpipeline

# 初始化多个 Hermes-backed Agent
planner = DialogAgent(
    name="Planner",
    sys_prompt="你是一个任务规划专家...",
    model_config=hermes_model_config  # 使用 Hermes 的模型路由
)

coder = DialogAgent(
    name="Coder",
    sys_prompt="你是一个代码专家...",
    model_config=hermes_model_config
)

reviewer = DialogAgent(
    name="Reviewer",
    sys_prompt="你是一个代码审查专家...",
    model_config=hermes_model_config
)

# 定义工作流
with sequentialpipeline() as pipeline:
    user_input = UserAgent().input()
    plan = planner(user_input)
    code = coder(plan)
    review = reviewer(code)
    UserAgent().display(review)
```

### 3. 记忆系统互补

| 层级 | Hermes | AgentScope | 结合方案 |
|-----|--------|-----------|---------|
| L1 短期记忆 | Context window | DialogueManager | 统一 context 压缩策略 |
| L2 会话记忆 | SQLite SessionDB | MemoryBase | 双向同步 |
| L3 长期记忆 | `memory` 工具 | VectorStore | 共享向量存储 |
| L4 轨迹记录 | `trajectory` | Logger | 统一格式导出 |

```python
# memory-bridge.py
class HermesAgentScopeMemory(MemoryBase):
    """桥接 Hermes 的 memory 工具到 AgentScope"""

    def __init__(self, hermes_session_id: str):
        self.session_id = hermes_session_id

    def add(self, msg: Message) -> None:
        # 写入 Hermes 的 memory 系统
        hermes_api.memory_add(
            target="memory",
            content=msg.content,
            tags=["agentscope", self.session_id]
        )

    def get_memory(self, query: str, top_k: int = 5) -> List[Message]:
        # 从 Hermes memory 检索
        results = hermes_api.memory_search(query, limit=top_k)
        return [Message(r["content"]) for r in results]
```

### 4. RAG 能力增强

**AgentScope 优势**：
- 内置 Knowledge 组件
- 支持多种向量数据库（Chroma, FAISS, Pinecone）
- 自动文档分块和嵌入

**结合方案**：
```python
# hermes-rag-agent.py
from agentscope.rag import KnowledgeBank
from hermes_agent import AIAgent

# AgentScope 负责 RAG
knowledge = KnowledgeBank(
    configs=[{
        "knowledge_id": "hermes_docs",
        "emb_model_config": "qwen_emb_config",
        "chunk_size": 500,
    }]
)
knowledge.add_folder("path/to/docs")

# Hermes 负责工具执行和决策
hermes = AIAgent(model="claude-sonnet-4")

class RAGAgent(AgentBase):
    def reply(self, x: dict) -> dict:
        # 1. AgentScope 检索相关知识
        retrieved = knowledge.retrieve(x["content"], top_k=3)

        # 2. Hermes 生成回答（使用检索内容）
        context = "\n".join([r.text for r in retrieved])
        response = hermes.chat(
            f"基于以下文档回答问题：\n{context}\n\n问题：{x['content']}"
        )

        return {"content": response}
```

### 5. 可视化 Studio 集成

**AgentScope Studio** 可以可视化监控 Hermes Agent 的执行：

```python
# studio-integration.py
from agentscope.studio import init_studio

# 启动 Studio 服务器
init_studio(port=8080)

# 包装 Hermes Agent 使其可被监控
@agentscope.monitor()
def hermes_workflow(task: str):
    agent = AIAgent(save_trajectories=True)

    # 每个步骤都会被记录到 Studio
    result = agent.run_conversation(task)

    return result
```

**可视化内容**：
- 工具调用链
- Token 消耗实时图表
- 思考过程（reasoning content）
- 消息流转图

### 6. MCP × A2A 协议桥接

**协议对比**：
- **MCP** (Hermes): 工具/资源发现 + 调用
- **A2A** (AgentScope): Agent 间协作协议

**桥接实现**：
```python
# protocol-bridge.py
class MCP2A2ABridge:
    """将 Hermes MCP 工具暴露为 A2A Agent"""

    def __init__(self, hermes_tools: list):
        self.tools = hermes_tools

    def to_a2a_agent(self) -> AgentCard:
        """生成 A2A AgentCard"""
        return AgentCard(
            name="HermesToolAgent",
            skills=[
                Skill(
                    name=tool.name,
                    description=tool.description
                )
                for tool in self.tools
            ]
        )

    async def handle_a2a_task(self, task: Task) -> Task:
        """处理 A2A 任务，转换为 MCP 调用"""
        # 解析 A2A 任务为 MCP 格式
        tool_name = task.metadata["tool"]
        params = task.message.parts[0].data

        # 调用 Hermes MCP 工具
        result = await self.call_mcp_tool(tool_name, params)

        # 包装为 A2A 响应
        return Task(
            id=task.id,
            status=TaskStatus.COMPLETED,
            artifacts=[Artifact(data=result)]
        )
```

## 三、具体集成方案

### 方案 A：轻量级工具桥接（推荐起步）

**复杂度**：低
**改动范围**：新增适配层
**核心价值**：Hermes 获得 AgentScope 的多 Agent 能力

```
用户输入
   ↓
AgentScope Orchestrator (规划 Agent)
   ↓
Hermes Agent (执行 Agent) ← 复用现有工具
   ↓
工具执行结果
   ↓
AgentScope 汇总输出
```

**实现步骤**：
1. 创建 `agentscope_hermes_bridge` Python 包
2. 实现 HermesAgent 类（继承 AgentScope 的 AgentBase）
3. 包装 Hermes 工具集为 AgentScope Services
4. 在 AgentScope Studio 中监控

### 方案 B：双向网关集成

**复杂度**：中
**改动范围**：修改 Hermes Gateway + 新增 AgentScope 适配器
**核心价值**：用户可以在任何平台（Telegram/Discord/Slack）触发多 Agent 工作流

```
[Telegram用户]
      ↓
Hermes Gateway
      ↓
AgentScope RPC API
      ↓
Agent Network (多 Agent 协作)
      ↓
Hermes Gateway
      ↓
[返回用户]
```

**关键组件**：
1. **Gateway Plugin**: `gateway/plugins/agentscope_plugin.py`
2. **RPC Client**: 调用 AgentScope 的分布式 Agent
3. **状态同步**: 会话状态在两者之间同步

### 方案 C：统一运行时（长期愿景）

**复杂度**：高
**改动范围**：架构级重构
**核心价值**：单一代码库，兼具两者优势

```python
# 统一 Agent 基类
class UnifiedAgent:
    def __init__(self):
        # Hermes 特性
        self.tools = ToolRegistry()
        self.memory = MemorySystem()
        self.platform = PlatformAdapter()

        # AgentScope 特性
        self.ray_actor = None
        self.pipeline = None
        self.studio_monitor = None

    async def run(self, task: Task) -> Result:
        # 使用 AgentScope 的分布式能力
        if self.pipeline:
            return await self.pipeline.run(task)

        # 回退到 Hermes 的单 Agent 模式
        return self._hermes_run(task)
```

## 四、代码示例：最小可行集成

```python
# examples/hello_agentscope_hermes.py
"""
最小集成示例：使用 AgentScope 编排多个 Hermes Agent
"""

import agentscope
from agentscope.agents import AgentBase
from agentscope.pipelines import sequentialpipeline

# 假设已安装 hermes-agent 包
from hermes_agent import AIAgent
from hermes_cli.config import load_config

class HermesAgentWrapper(AgentBase):
    """包装 Hermes AIAgent 为 AgentScope Agent"""

    def __init__(
        self,
        name: str,
        system_prompt: str,
        model: str = "claude-sonnet-4",
        **kwargs
    ):
        super().__init__(name=name, sys_prompt=system_prompt)

        # 初始化 Hermes Agent
        config = load_config()
        self.hermes = AIAgent(
            model=model,
            platform="agentscope",
            enabled_toolsets=["core", "web", "file"],
            save_trajectories=True
        )

    def reply(self, x: dict = None) -> dict:
        """AgentScope 调用的接口"""
        user_input = x.get("content", "") if x else ""

        # 使用 Hermes 处理
        response = self.hermes.chat(user_input)

        return {"content": response}


# ============ 使用示例 ============

if __name__ == "__main__":
    # 初始化 AgentScope（自动启动 Studio）
    agentscope.init(
        model_configs=[...],  # 可选：使用 AgentScope 的模型
        use_monitor=True,
        studio_port=8080
    )

    # 创建多个 Hermes-backed Agent
    planner = HermesAgentWrapper(
        name="规划师",
        system_prompt="你是一个任务规划专家...",
        model="claude-opus-4.6"
    )

    researcher = HermesAgentWrapper(
        name="研究员",
        system_prompt="你是一个研究专家，擅长搜索和分析...",
        model="claude-sonnet-4"
    )

    writer = HermesAgentWrapper(
        name="写手",
        system_prompt="你是一个专业写作者...",
        model="claude-sonnet-4"
    )

    # 定义顺序工作流
    with sequentialpipeline() as workflow:
        task = input("请输入写作任务：")

        # Step 1: 规划
        plan = planner({"content": f"请为以下任务制定执行计划：{task}"})
        print(f"📋 计划：{plan['content']}")

        # Step 2: 研究
        research = researcher({
            "content": f"根据计划收集资料：{plan['content']}"
        })
        print(f"🔍 研究结果：{research['content']}")

        # Step 3: 写作
        article = writer({
            "content": f"基于研究资料写作：{research['content']}"
        })
        print(f"✍️ 文章：{article['content']}")

    print("\n✅ 工作流完成！访问 http://localhost:8080 查看可视化")
```

## 五、迁移路径建议

### Phase 1: 工具桥接（2-3 天）
- [ ] 创建 `hermes-agentscope` Python 包
- [ ] 实现 `HermesToolService` 包装器
- [ ] 验证单个工具调用

### Phase 2: Agent 包装（1 周）
- [ ] 实现 `HermesAgentWrapper` 类
- [ ] 测试简单顺序工作流
- [ ] 集成 Studio 监控

### Phase 3: 网关集成（1-2 周）
- [ ] Gateway Plugin 开发
- [ ] 会话状态同步
- [ ] 错误处理和重试

### Phase 4: 生产优化（持续）
- [ ] 性能基准测试
- [ ] 缓存策略优化
- [ ] 安全加固

## 六、潜在挑战与对策

| 挑战 | 对策 |
|-----|------|
| **状态一致性** | 使用共享 SQLite 或 Redis 作为状态存储 |
| **消息格式差异** | 创建统一的 Message 转换层 |
| **错误传播** | 定义统一的错误码和重试策略 |
| **模型路由冲突** | Hermes 作为主路由，AgentScope 内部路由透明化 |
| **性能开销** | 本地 Ray 集群，避免网络延迟 |

## 七、结论

AgentScope 与 Hermes 的结合不是替代关系，而是**能力互补**：

- **AgentScope** 提供：分布式架构、Studio 可视化、多 Agent 编排
- **Hermes** 提供：丰富的工具生态、多平台 Gateway、成熟的技能系统

**推荐起步方案**：工具桥接 + Agent 包装，以最小成本获得最大收益。

**长期愿景**：统一运行时，成为开源 Agent 生态的"Linux 发行版"。
