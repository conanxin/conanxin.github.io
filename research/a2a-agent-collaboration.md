# A2A Agent 协议与多 Agent 协作研究

## 1. A2A 协议概述

**Agent2Agent (A2A) Protocol** 是由 Google 开发并捐赠给 Linux  Foundation 的开放标准，旨在实现 AI Agent 之间的无缝通信和协作。

### 核心定位

```
┌─────────────────────────────────────────────────────────────┐
│                    Agent 技术栈三层架构                       │
├─────────────────────────────────────────────────────────────┤
│  Layer 3: A2A (Agent-to-Agent)                              │
│           → Agent 之间的协作与通信                            │
├─────────────────────────────────────────────────────────────┤
│  Layer 2: MCP (Model Context Protocol)                      │
│           → Agent 与工具/资源的连接                           │
├─────────────────────────────────────────────────────────────┤
│  Layer 1: LLM / Agent Framework                             │
│           → 核心推理能力 (ADK, LangGraph, CrewAI, etc.)      │
└─────────────────────────────────────────────────────────────┘
```

**关键原则**: Build with **ADK** (or any framework), equip with **MCP** (or any tool), communicate with **A2A**.

---

## 2. A2A 核心概念

### 2.1 三个核心角色

| 角色 | 职责 | 类比 |
|------|------|------|
| **User** | 发起请求或定义目标的人类或自动化服务 | 客户 |
| **A2A Client** | 代表用户发起通信的应用/服务/Agent | 前台/经纪人 |
| **A2A Server** | 暴露 HTTP 端点实现 A2A 协议的 Agent | 服务提供者 |

> 重要: Remote Agent 是 **opaque (黑盒)** 系统，其内部工作、内存或工具不对外暴露。

### 2.2 通信元素

```python
# Agent Card - Agent 的"名片"
AgentCard(
    name="Hello World Agent",
    description="Just a hello world agent",
    version="1.0.0",
    capabilities=AgentCapabilities(
        streaming=True,           # 支持流式响应
        extended_agent_card=True  # 支持扩展卡片
    ),
    skills=[
        AgentSkill(
            id="hello_world",
            name="Returns hello world",
            description="just returns hello world",
            tags=["hello world"],
            examples=["hi", "hello world"],
        )
    ]
)
```

| 元素 | 描述 | 用途 |
|------|------|------|
| **Agent Card** | JSON 元数据文档，描述身份、能力、端点、技能 | 客户端发现 Agents |
| **Task** | 表示一个工作单元，有生命周期状态 | 跟踪任务执行 |
| **Message** | 包含 Parts 的通信单元 | 传递信息 |
| **Part** | 内容片段 (text, file, data) | 结构化内容 |
| **Artifact** | 任务输出的结构化数据 | 交付成果 |

### 2.3 任务生命周期

```
SUBMITTED → WORKING → (INPUT_REQUIRED → WORKING) → COMPLETED/FAILED/CANCELED
```

---

## 3. A2A vs MCP: 互补而非竞争

### MCP (Model Context Protocol)
- **定位**: Agent ↔ Tool/Resource 的连接
- **类比**: 函数调用、API 调用
- **场景**: 查询数据库、调用外部 API、文件操作

### A2A (Agent2Agent Protocol)
- **定位**: Agent ↔ Agent 的协作
- **类比**: 服务间通信、微服务调用
- **场景**: 客服 Agent 委派给计费 Agent、旅行 Agent 协调航班/酒店/活动 Agents

### 协作示例: 汽车维修店

```
用户: "我的车需要维修"
    │
    ▼
┌─────────────────┐
│ 接待 Agent       │  ← Host Agent (A2A Client)
│ (Receptionist)   │
└────────┬────────┘
         │ A2A 协议
    ┌────┴────┐
    ▼         ▼
┌───────┐  ┌─────────┐
│诊断 Agent│  │零件查询 Agent│  ← Remote Agents (A2A Server)
│(MCP: OBD│  │(MCP: 库存DB)│
│  工具)  │  └─────────┘
└───┬───┘
    │ A2A
    ▼
┌─────────┐
│维修 Agent │
│(MCP: 维修│
│  手册)   │
└─────────┘
```

---

## 4. Python SDK 实战

### 4.1 安装

```bash
pip install a2a-sdk

# 可选功能
pip install "a2a-sdk[http-server]"  # FastAPI/Starlette 支持
pip install "a2a-sdk[grpc]"         # gRPC 支持
pip install "a2a-sdk[telemetry]"    # OpenTelemetry 追踪
```

### 4.2 创建 A2A Server (Remote Agent)

```python
# agent_executor.py
from a2a.server.agent_execution import AgentExecutor, RequestContext
from a2a.server.events import EventQueue
from a2a.types.a2a_pb2 import (
    TaskArtifactUpdateEvent, TaskState, TaskStatus, TaskStatusUpdateEvent,
)
from a2a.utils.artifact import new_text_artifact
from a2a.utils.message import new_agent_text_message
from a2a.utils.task import new_task

class HelloWorldAgent:
    async def invoke(self) -> str:
        return 'Hello, World!'

class HelloWorldAgentExecutor(AgentExecutor):
    def __init__(self):
        self.agent = HelloWorldAgent()

    async def execute(self, context: RequestContext, event_queue: EventQueue) -> None:
        task = context.current_task or new_task(context.message)
        
        # 发送任务创建事件
        await event_queue.enqueue_event(task)
        
        # 更新状态为 WORKING
        await event_queue.enqueue_event(
            TaskStatusUpdateEvent(
                task_id=context.task_id,
                status=TaskStatus(
                    state=TaskState.TASK_STATE_WORKING,
                    message=new_agent_text_message('Processing request...'),
                ),
            )
        )
        
        # 执行 Agent 逻辑
        result = await self.agent.invoke()
        
        # 发送结果 Artifact
        await event_queue.enqueue_event(
            TaskArtifactUpdateEvent(
                task_id=context.task_id,
                artifact=new_text_artifact(name='result', text=result),
            )
        )
        
        # 标记完成
        await event_queue.enqueue_event(
            TaskStatusUpdateEvent(
                task_id=context.task_id,
                status=TaskStatus(state=TaskState.TASK_STATE_COMPLETED),
            )
        )
```

```python
# server.py
import uvicorn
from a2a.server.apps import A2AStarletteApplication
from a2a.server.request_handlers import DefaultRequestHandler
from a2a.server.tasks import InMemoryTaskStore
from a2a.types import AgentCapabilities, AgentCard, AgentInterface, AgentSkill

from agent_executor import HelloWorldAgentExecutor

# 定义技能
skill = AgentSkill(
    id='hello_world',
    name='Returns hello world',
    description='just returns hello world',
    tags=['hello world'],
    examples=['hi', 'hello world'],
)

# 创建 Agent Card
agent_card = AgentCard(
    name='Hello World Agent',
    description='Just a hello world agent',
    version='1.0.0',
    default_input_modes=['text'],
    default_output_modes=['text'],
    capabilities=AgentCapabilities(streaming=True),
    supported_interfaces=[
        AgentInterface(protocol_binding='JSONRPC', url='http://localhost:9999')
    ],
    skills=[skill],
)

# 创建 Server
request_handler = DefaultRequestHandler(
    agent_executor=HelloWorldAgentExecutor(),
    task_store=InMemoryTaskStore(),
)

server = A2AStarletteApplication(
    agent_card=agent_card,
    http_handler=request_handler,
)

if __name__ == '__main__':
    uvicorn.run(server.build(), host='127.0.0.1', port=9999)
```

### 4.3 创建 A2A Client

```python
import asyncio
import httpx
from a2a.client import A2AClient, A2ACardResolver

async def main():
    async with httpx.AsyncClient() as client:
        # 1. 获取 Agent Card (发现)
        card_resolver = A2ACardResolver(client, "http://localhost:9999")
        agent_card = await card_resolver.get_agent_card()
        print(f"Found agent: {agent_card.name}")
        
        # 2. 创建 A2A Client
        a2a_client = A2AClient(client, agent_card)
        
        # 3. 发送消息
        response = await a2a_client.send_message(
            message={
                "role": "user",
                "parts": [{"type": "text", "text": "Hello!"}]
            }
        )
        
        print(f"Response: {response}")

if __name__ == '__main__':
    asyncio.run(main())
```

---

## 5. 多 Agent 协作模式

### 5.1 架构模式

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Request                             │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Host Agent (Routing)                         │
│                    ┌──────────────────┐                         │
│                    │ 1. Parse Intent    │                         │
│                    │ 2. Select Agents   │                         │
│                    │ 3. Delegate Tasks  │                         │
│                    │ 4. Synthesize      │                         │
│                    └──────────────────┘                         │
└──────┬────────────────────┬────────────────────┬────────────────┘
       │ A2A Protocol       │ A2A Protocol       │ A2A Protocol
       ▼                    ▼                    ▼
┌──────────┐         ┌──────────┐         ┌──────────┐
│Weather   │         │Airbnb    │         │Flight    │
│Agent     │         │Agent     │         │Agent     │
│(MCP:     │         │(MCP:     │         │(MCP:     │
│Weather   │         │Airbnb    │         │Booking   │
│API)      │         │API)      │         │API)      │
└──────────┘         └──────────┘         └──────────┘
```

### 5.2 Host Agent 实现 (使用 ADK)

```python
# routing_agent.py
from a2a.client import A2ACardResolver
from a2a.types import AgentCard, SendMessageRequest
from google.adk import Agent

class RoutingAgent:
    def __init__(self, remote_agent_addresses: list[str]):
        self.remote_agent_connections: dict[str, RemoteAgentConnections] = {}
        self.cards: dict[str, AgentCard] = {}
        
        # 初始化远程 Agent 连接
        for address in remote_agent_addresses:
            card_resolver = A2ACardResolver(client, address)
            card = await card_resolver.get_agent_card()
            self.remote_agent_connections[card.name] = RemoteAgentConnections(
                agent_card=card, agent_url=address
            )
            self.cards[card.name] = card

    def create_agent(self) -> Agent:
        """创建 ADK Agent"""
        return Agent(
            model='gemini-2.5-flash-lite',
            name='Routing_agent',
            instruction=self.root_instruction,
            tools=[self.send_message],
        )

    def root_instruction(self) -> str:
        return f"""
你是路由协调 Agent。你的职责是：
1. 解析用户意图
2. 选择合适的远程 Agent: {list(self.cards.keys())}
3. 使用 send_message 工具委派任务
4. 整合结果返回给用户

可用 Agents:
{self._format_agent_descriptions()}
        """

    async def send_message(self, agent_name: str, task: str):
        """向远程 Agent 发送任务"""
        if agent_name not in self.remote_agent_connections:
            raise ValueError(f'Agent {agent_name} not found')
        
        client = self.remote_agent_connections[agent_name]
        
        request = SendMessageRequest(
            message={
                "role": "user",
                "parts": [{"type": "text", "text": task}]
            }
        )
        
        response = await client.send_message(request)
        return response
```

### 5.3 Remote Agent 连接管理

```python
# remote_agent_connection.py
import httpx
from a2a.client import A2AClient
from a2a.types import AgentCard, SendMessageRequest, SendMessageResponse

class RemoteAgentConnections:
    """管理到远程 Agent 的连接"""
    
    def __init__(self, agent_card: AgentCard, agent_url: str):
        self._httpx_client = httpx.AsyncClient(timeout=30)
        self.agent_client = A2AClient(
            self._httpx_client, agent_card, url=agent_url
        )
        self.card = agent_card

    async def send_message(
        self, message_request: SendMessageRequest
    ) -> SendMessageResponse:
        return await self.agent_client.send_message(message_request)
```

---

## 6. 与 OpenClaw 协作方案

### 6.1 OpenClaw 作为 A2A Server

OpenClaw 可以实现 A2A 协议，暴露其 Skills 为 A2A Agent:

```python
# openclaw_a2a_server.py
from a2a.server.apps import A2AStarletteApplication
from a2a.types import AgentSkill, AgentCard
from openclaw import OpenClawAgent

class OpenClawA2AExecutor(AgentExecutor):
    """将 OpenClaw Agent 包装为 A2A Server"""
    
    def __init__(self, openclaw_agent: OpenClawAgent):
        self.openclaw = openclaw_agent
    
    async def execute(self, context: RequestContext, event_queue: EventQueue):
        # 将 A2A 消息转换为 OpenClaw 格式
        user_message = self._extract_text(context.message)
        
        # 调用 OpenClaw
        result = await self.openclaw.run(user_message)
        
        # 将结果包装为 A2A Artifact
        await event_queue.enqueue_event(
            TaskArtifactUpdateEvent(
                task_id=context.task_id,
                artifact=new_text_artifact(name='result', text=result)
            )
        )

# 将 OpenClaw Skills 映射为 A2A Skills
skills = [
    AgentSkill(
        id=skill.name,
        name=skill.description,
        description=skill.prompt,
        tags=skill.tags,
    )
    for skill in openclaw_agent.skills
]
```

### 6.2 OpenClaw 作为 A2A Client

OpenClaw 可以调用其他 A2A Agents 作为其工具:

```python
# openclaw_a2a_client.py
from a2a.client import A2AClient

class A2ATool:
    """将 A2A Agent 包装为 OpenClaw Tool"""
    
    def __init__(self, agent_url: str):
        self.agent_url = agent_url
        self.card = None
        self.client = None
    
    async def initialize(self):
        """发现 Agent 能力"""
        async with httpx.AsyncClient() as http_client:
            resolver = A2ACardResolver(http_client, self.agent_url)
            self.card = await resolver.get_agent_card()
            self.client = A2AClient(http_client, self.card)
    
    async def run(self, query: str) -> str:
        """调用远程 Agent"""
        response = await self.client.send_message(
            message={
                "role": "user",
                "parts": [{"type": "text", "text": query}]
            }
        )
        return self._extract_result(response)

# 在 OpenClaw 中注册
openclaw.register_tool(
    name="weather_agent",
    tool=A2ATool("http://weather-agent:8080"),
    description="获取天气信息"
)
```

### 6.3 混合架构: OpenClaw + A2A + MCP

```
                         User Query
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                    OpenClaw Host Agent                        │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Skills:                                               │  │
│  │  - code_generation (本地 Skill)                        │  │
│  │  - web_search (MCP Tool)                               │  │
│  │  - file_operations (MCP Tool)                          │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────┬────────────────────────────┬──────────────────────┘
           │ A2A                        │ A2A
           ▼                            ▼
┌─────────────────────┐      ┌─────────────────────┐
│ Data Analysis Agent │      │ Content Creation    │
│ (Python + Pandas)   │      │ Agent (LLM)         │
│  ┌───────────────┐  │      │  ┌───────────────┐  │
│  │ MCP: Jupyter  │  │      │  │ MCP: ImageGen │  │
│  └───────────────┘  │      │  └───────────────┘  │
└─────────────────────┘      └─────────────────────┘
```

---

## 7. 最佳实践

### 7.1 Agent 设计原则

1. **单一职责**: 每个 Agent 专注于一个领域
2. **黑盒原则**: 不暴露内部实现细节
3. **技能声明**: 通过 Agent Card 清晰描述能力
4. **优雅降级**: 处理远程 Agent 不可用的情况

### 7.2 安全考虑

```python
# 重要: 将外部 Agent 视为不可信实体
async def secure_call(agent_url: str, query: str):
    # 1. 验证 Agent Card 签名 (如支持)
    card = await resolve_agent_card(agent_url)
    
    # 2. 输入消毒
    sanitized_query = sanitize_input(query)
    
    # 3. 限制响应大小
    response = await call_with_timeout_and_size_limit(
        agent_url, sanitized_query, 
        timeout=30, max_size=10*1024*1024
    )
    
    # 4. 输出验证
    return validate_output(response)
```

### 7.3 错误处理

```python
async def resilient_multi_agent_call(query: str):
    results = []
    errors = []
    
    for agent in available_agents:
        try:
            result = await asyncio.wait_for(
                call_agent(agent, query),
                timeout=30
            )
            results.append(result)
        except Exception as e:
            errors.append((agent.name, str(e)))
            logger.warning(f"Agent {agent.name} failed: {e}")
    
    if not results:
        raise AllAgentsFailed(errors)
    
    return synthesize_results(results)
```

---

## 8. 参考资源

- **A2A 官网**: https://a2a-protocol.org
- **Python SDK**: https://github.com/a2aproject/a2a-python
- **示例代码**: https://github.com/a2aproject/a2a-samples
- **MCP 协议**: https://modelcontextprotocol.io
- **DeepLearning.AI 课程**: https://goo.gle/dlai-a2a

---

## 9. 总结

A2A 协议为 Agent 互操作性提供了标准化方案，与 MCP 形成互补的技术栈。在多 Agent 协作场景中：

1. **MCP** 解决 Agent 与工具的连接问题
2. **A2A** 解决 Agent 与 Agent 的协作问题
3. **OpenClaw** 可以作为 A2A Server 暴露能力，也可以作为 A2A Client 调用其他 Agents

这种分层架构使得复杂的 Agent 系统可以像搭建积木一样组合，每个 Agent 专注于自己的领域，通过标准协议进行协作。
