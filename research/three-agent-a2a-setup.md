# 三 Agent A2A 协作架构设计

## 场景

- **Agent A**: Hermes (Host/协调者) - 本地机器
- **Agent B**: OpenClaw #1 - 本地机器 (与 Hermes 同机)
- **Agent C**: OpenClaw #2 - 腾讯云部署

```
┌─────────────────────────────────────────────────────────────────────┐
│                         本地机器 (Local)                             │
│  ┌─────────────────────┐      ┌─────────────────────┐              │
│  │   Hermes Agent      │◄────►│  OpenClaw #1        │              │
│  │   (Host Agent)      │ A2A  │  (Remote Agent)     │              │
│  │   Port: 8080        │      │  Port: 9999         │              │
│  └──────────┬──────────┘      └─────────────────────┘              │
│             │                                                       │
│             │ HTTP / A2A Protocol                                   │
│             │ (通过互联网或内网穿透)                                   │
│             ▼                                                       │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      腾讯云 (Cloud)                                  │
│              ┌─────────────────────┐                                │
│              │   OpenClaw #2       │                                │
│              │   (Remote Agent)    │                                │
│              │   Port: 8080        │                                │
│              │   URL: http://1.2.3.4:8080                          │
│              └─────────────────────┘                                │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 架构选择

### 方案 1: Hermes 作为中心协调者 (推荐)

Hermes 作为 **A2A Client**，两个 OpenClaw 作为 **A2A Server**。

**优势**:
- 统一入口，用户只与 Hermes 交互
- Hermes 负责任务路由和结果整合
- 两个 OpenClaw 可以独立开发/部署

**劣势**:
- 单点故障 (Hermes 宕机则整个系统不可用)
- 所有流量经过 Hermes

### 方案 2: P2P 网状架构

三个 Agent 互为 Client/Server，直接通信。

**优势**:
- 去中心化，更灵活
- 延迟更低 (Agent 间直连)

**劣势**:
- 复杂度更高
- 需要处理权限和认证

---

## 方案 1 详细实现

### Step 1: 腾讯云 OpenClaw 部署 (OpenClaw #2)

```python
# cloud_agent.py - 在腾讯云运行
import uvicorn
from a2a.server.apps import A2AStarletteApplication
from a2a.server.request_handlers import DefaultRequestHandler
from a2a.server.tasks import InMemoryTaskStore
from a2a.types import AgentCapabilities, AgentCard, AgentInterface, AgentSkill
from a2a.server.agent_execution import AgentExecutor, RequestContext
from a2a.server.events import EventQueue
from a2a.types.a2a_pb2 import (
    TaskArtifactUpdateEvent, TaskState, TaskStatus, TaskStatusUpdateEvent,
)
from a2a.utils.artifact import new_text_artifact
from a2a.utils.message import new_agent_text_message

# 导入你的 OpenClaw Agent
from openclaw import OpenClawAgent

class OpenClawA2AExecutor(AgentExecutor):
    """将 OpenClaw 包装为 A2A Server"""
    
    def __init__(self):
        # 初始化你的 OpenClaw Agent
        self.openclaw = OpenClawAgent(
            skills_dir="./skills",
            config_path="./config.yaml"
        )
    
    async def execute(self, context: RequestContext, event_queue: EventQueue) -> None:
        """处理 A2A 任务"""
        from a2a.utils.task import new_task
        
        task = context.current_task or new_task(context.message)
        await event_queue.enqueue_event(task)
        
        # 更新状态
        await event_queue.enqueue_event(
            TaskStatusUpdateEvent(
                task_id=context.task_id,
                status=TaskStatus(
                    state=TaskState.TASK_STATE_WORKING,
                    message=new_agent_text_message('OpenClaw Cloud 处理中...'),
                ),
            )
        )
        
        # 提取用户输入
        user_input = self._extract_text(context.message)
        
        # 调用 OpenClaw
        try:
            result = await self.openclaw.run(user_input)
            
            # 发送结果
            await event_queue.enqueue_event(
                TaskArtifactUpdateEvent(
                    task_id=context.task_id,
                    artifact=new_text_artifact(name='result', text=result),
                )
            )
            
            await event_queue.enqueue_event(
                TaskStatusUpdateEvent(
                    task_id=context.task_id,
                    status=TaskStatus(state=TaskState.TASK_STATE_COMPLETED),
                )
            )
        except Exception as e:
            await event_queue.enqueue_event(
                TaskStatusUpdateEvent(
                    task_id=context.task_id,
                    status=TaskStatus(
                        state=TaskState.TASK_STATE_FAILED,
                        message=new_agent_text_message(f'错误: {str(e)}'),
                    ),
                )
            )
    
    def _extract_text(self, message) -> str:
        """从 A2A 消息中提取文本"""
        parts = message.get('parts', [])
        texts = [p.get('text', '') for p in parts if p.get('type') == 'text']
        return '\n'.join(texts)

# 创建 Agent Card
agent_card = AgentCard(
    name='OpenClaw Cloud Agent',
    description='部署在腾讯云的 OpenClaw Agent，擅长云端任务处理',
    version='1.0.0',
    default_input_modes=['text'],
    default_output_modes=['text'],
    capabilities=AgentCapabilities(
        streaming=True,
        extended_agent_card=True,
    ),
    supported_interfaces=[
        AgentInterface(
            protocol_binding='JSONRPC',
            url='http://YOUR_CLOUD_IP:8080',  # 腾讯云公网IP
        )
    ],
    skills=[
        AgentSkill(
            id='cloud_computing',
            name='云端计算',
            description='执行需要云端资源的任务',
            tags=['cloud', 'compute', 'heavy'],
            examples=['分析大数据', '运行复杂模型'],
        ),
        AgentSkill(
            id='api_integration',
            name='API 集成',
            description='调用云端 API 服务',
            tags=['api', 'integration'],
            examples=['查询数据库', '调用第三方 API'],
        ),
    ],
)

# 创建 Server
request_handler = DefaultRequestHandler(
    agent_executor=OpenClawA2AExecutor(),
    task_store=InMemoryTaskStore(),
)

server = A2AStarletteApplication(
    agent_card=agent_card,
    http_handler=request_handler,
)

if __name__ == '__main__':
    # 绑定到 0.0.0.0 允许外部访问
    uvicorn.run(server.build(), host='0.0.0.0', port=8080)
```

**腾讯云部署配置**:

```bash
# 1. 安全组配置 - 开放 8080 端口
# 腾讯云控制台 -> 安全组 -> 入站规则 -> 添加 8080 端口

# 2. 使用 systemd 守护进程
# /etc/systemd/system/openclaw-a2a.service
```

```ini
[Unit]
Description=OpenClaw A2A Agent
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/openclaw
Environment=PYTHONPATH=/home/ubuntu/openclaw
Environment=OPENCLAW_CONFIG=/home/ubuntu/openclaw/config.yaml
ExecStart=/home/ubuntu/.local/bin/uvicorn cloud_agent:app --host 0.0.0.0 --port 8080
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
# 启动服务
sudo systemctl daemon-reload
sudo systemctl enable openclaw-a2a
sudo systemctl start openclaw-a2a

# 查看日志
sudo journalctl -u openclaw-a2a -f
```

---

### Step 2: 本地 OpenClaw 部署 (OpenClaw #1)

```python
# local_agent.py - 在本地机器运行
import uvicorn
from a2a.server.apps import A2AStarletteApplication
from a2a.server.request_handlers import DefaultRequestHandler
from a2a.server.tasks import InMemoryTaskStore
from a2a.types import AgentCapabilities, AgentCard, AgentInterface, AgentSkill

# 复用上面的 OpenClawA2AExecutor
from openclaw_executor import OpenClawA2AExecutor

agent_card = AgentCard(
    name='OpenClaw Local Agent',
    description='本地 OpenClaw Agent，擅长本地文件和系统操作',
    version='1.0.0',
    default_input_modes=['text'],
    default_output_modes=['text'],
    capabilities=AgentCapabilities(streaming=True),
    supported_interfaces=[
        AgentInterface(
            protocol_binding='JSONRPC',
            url='http://localhost:9999',  # 本地地址
        )
    ],
    skills=[
        AgentSkill(
            id='local_files',
            name='本地文件操作',
            description='读取、写入、分析本地文件',
            tags=['file', 'local', 'filesystem'],
            examples=['分析本地日志文件', '批量重命名文件'],
        ),
        AgentSkill(
            id='system_ops',
            name='系统操作',
            description='执行本地系统命令和脚本',
            tags=['system', 'shell', 'local'],
            examples=['运行 Python 脚本', '执行系统命令'],
        ),
    ],
)

request_handler = DefaultRequestHandler(
    agent_executor=OpenClawA2AExecutor(),
    task_store=InMemoryTaskStore(),
)

server = A2AStarletteApplication(
    agent_card=agent_card,
    http_handler=request_handler,
)

if __name__ == '__main__':
    uvicorn.run(server.build(), host='127.0.0.1', port=9999)
```

---

### Step 3: Hermes 作为 Host Agent (协调者)

```python
# hermes_orchestrator.py - 集成到 Hermes
import asyncio
import httpx
from typing import Dict, List, Optional
from a2a.client import A2AClient, A2ACardResolver
from a2a.types import AgentCard, SendMessageRequest, Task

class MultiAgentOrchestrator:
    """Hermes 多 Agent 协调器"""
    
    def __init__(self):
        self.remote_agents: Dict[str, A2AClient] = {}
        self.agent_cards: Dict[str, AgentCard] = {}
        self.http_client = httpx.AsyncClient(timeout=60)
    
    async def register_agent(self, name: str, url: str) -> bool:
        """注册远程 Agent"""
        try:
            # 发现 Agent Card
            resolver = A2ACardResolver(self.http_client, url)
            card = await resolver.get_agent_card()
            
            # 创建客户端
            client = A2AClient(self.http_client, card, url=url)
            
            self.remote_agents[name] = client
            self.agent_cards[name] = card
            
            print(f"✓ 已注册 Agent: {name} @ {url}")
            print(f"  技能: {[s.name for s in card.skills]}")
            return True
        except Exception as e:
            print(f"✗ 注册失败 {name}: {e}")
            return False
    
    async def route_task(self, user_input: str) -> str:
        """智能路由任务到合适的 Agent"""
        
        # 简单路由逻辑 (可替换为 LLM 决策)
        agent_name = self._select_agent(user_input)
        
        if not agent_name:
            return "没有合适的 Agent 可以处理这个任务"
        
        # 调用选中的 Agent
        return await self.call_agent(agent_name, user_input)
    
    def _select_agent(self, user_input: str) -> Optional[str]:
        """根据输入选择最合适的 Agent"""
        user_lower = user_input.lower()
        
        # 关键词匹配 (简单版)
        cloud_keywords = ['云', 'cloud', '大数据', 'api', '数据库', '远程']
        local_keywords = ['本地', '文件', 'local', '目录', '系统', '脚本']
        
        cloud_score = sum(1 for kw in cloud_keywords if kw in user_lower)
        local_score = sum(1 for kw in local_keywords if kw in user_lower)
        
        if cloud_score > local_score and 'openclaw_cloud' in self.remote_agents:
            return 'openclaw_cloud'
        elif local_score > 0 and 'openclaw_local' in self.remote_agents:
            return 'openclaw_local'
        
        # 默认选择本地
        return 'openclaw_local' if 'openclaw_local' in self.remote_agents else None
    
    async def call_agent(self, agent_name: str, task: str) -> str:
        """调用特定 Agent"""
        if agent_name not in self.remote_agents:
            return f"Agent {agent_name} 未注册"
        
        client = self.remote_agents[agent_name]
        
        try:
            response = await client.send_message(
                SendMessageRequest(
                    message={
                        "role": "user",
                        "parts": [{"type": "text", "text": task}]
                    }
                )
            )
            
            # 提取结果
            if hasattr(response, 'result') and response.result:
                artifacts = response.result.artifacts
                if artifacts:
                    return artifacts[0].parts[0].text
            
            return "Agent 返回空结果"
            
        except Exception as e:
            return f"调用失败: {str(e)}"
    
    async def broadcast(self, task: str) -> Dict[str, str]:
        """广播任务到所有 Agent"""
        results = {}
        
        for name, client in self.remote_agents.items():
            try:
                response = await client.send_message(
                    SendMessageRequest(
                        message={
                            "role": "user",
                            "parts": [{"type": "text", "text": task}]
                        }
                    )
                )
                results[name] = "成功"
            except Exception as e:
                results[name] = f"失败: {str(e)}"
        
        return results
    
    async def close(self):
        await self.http_client.aclose()


# 集成到 Hermes 使用示例
async def main():
    orchestrator = MultiAgentOrchestrator()
    
    # 注册 Agents
    await orchestrator.register_agent(
        'openclaw_local', 
        'http://localhost:9999'
    )
    await orchestrator.register_agent(
        'openclaw_cloud', 
        'http://YOUR_CLOUD_IP:8080'  # 腾讯云地址
    )
    
    # 使用
    result = await orchestrator.route_task("分析本地日志文件")
    print(result)
    
    result = await orchestrator.route_task("查询云端数据库")
    print(result)
    
    await orchestrator.close()

if __name__ == '__main__':
    asyncio.run(main())
```

---

## 网络配置方案

### 方案 A: 公网直连 (最简单)

腾讯云服务器需要有公网 IP，Hermes 直接访问。

```python
# Hermes 配置
CLOUD_AGENT_URL = "http://1.2.3.4:8080"  # 腾讯云公网IP
```

**安全建议**:
```python
# 添加 API Key 验证
from fastapi import FastAPI, Header, HTTPException

app = FastAPI()

API_KEY = "your-secret-key"

@app.middleware("http")
async def verify_api_key(request, call_next):
    api_key = request.headers.get("X-API-Key")
    if api_key != API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API Key")
    return await call_next(request)
```

### 方案 B: 内网穿透 (frp/ngrok)

如果腾讯云在内网或不想暴露端口，使用 frp 穿透。

```ini
# frpc.ini (腾讯云客户端)
[common]
server_addr = your_frp_server.com
server_port = 7000
token = your_token

[openclaw]
type = tcp
local_ip = 127.0.0.1
local_port = 8080
remote_port = 8080
```

### 方案 C: VPN/专线

所有 Agent 在同一个虚拟内网中，使用内网 IP 通信。

---

## Hermes 集成 (实际使用)

```python
# 在 Hermes 中添加 A2A 协调工具
# hermes_a2a_tool.py

class A2AOrchestratorTool:
    """Hermes 多 Agent 协调工具"""
    
    def __init__(self):
        self.orchestrator = None
        self._initialized = False
    
    async def initialize(self):
        """初始化协调器"""
        if self._initialized:
            return
        
        self.orchestrator = MultiAgentOrchestrator()
        
        # 从配置加载 Agents
        await self.orchestrator.register_agent(
            'local_openclaw',
            'http://localhost:9999'
        )
        await self.orchestrator.register_agent(
            'cloud_openclaw', 
            'http://your-cloud-ip:8080'
        )
        
        self._initialized = True
    
    async def run(self, task: str, agent: str = "auto") -> str:
        """
        协调 Agent 执行任务
        
        Args:
            task: 任务描述
            agent: 指定 Agent (local/cloud/auto)
        """
        await self.initialize()
        
        if agent == "auto":
            return await self.orchestrator.route_task(task)
        else:
            return await self.orchestrator.call_agent(agent, task)
    
    def get_available_agents(self) -> list:
        """获取可用 Agent 列表"""
        if not self.orchestrator:
            return []
        return list(self.orchestrator.agent_cards.keys())

# 在 Hermes 工具系统中注册
a2a_tool = A2AOrchestratorTool()

# 工具定义
A2A_ORCHESTRATOR_SCHEMA = {
    "name": "a2a_orchestrate",
    "description": """协调多个 OpenClaw Agent 执行任务。
    
自动根据任务类型选择本地或云端 Agent:
- 本地 Agent: 适合文件操作、系统命令、本地脚本
- 云端 Agent: 适合 API 调用、大数据处理、云端资源

使用示例:
- "用本地 Agent 分析这个 CSV 文件"
- "用云端 Agent 查询数据库" 
- "auto: 分析数据并生成报告" (自动选择)
    """,
    "parameters": {
        "type": "object",
        "properties": {
            "task": {
                "type": "string",
                "description": "要执行的任务描述"
            },
            "agent": {
                "type": "string",
                "enum": ["auto", "local_openclaw", "cloud_openclaw"],
                "description": "选择哪个 Agent 执行 (auto=自动选择)"
            }
        },
        "required": ["task"]
    }
}

async def a2a_orchestrate_handler(args: dict) -> str:
    task = args.get("task", "")
    agent = args.get("agent", "auto")
    return await a2a_tool.run(task, agent)
```

---

## 启动流程

```bash
# 1. 启动本地 OpenClaw Agent (端口 9999)
python local_agent.py

# 2. 启动腾讯云 OpenClaw Agent (端口 8080)
# (在腾讯云服务器上)
python cloud_agent.py

# 3. Hermes 自动发现并协调
# (在 Hermes 中)
/hermes> 分析本地文件并用云端数据库对比
```

---

## 进阶: 任务分解与并行执行

```python
async def complex_workflow(user_request: str):
    """复杂任务并行执行"""
    
    # 分解任务
    tasks = [
        ("local_openclaw", "提取本地日志关键信息"),
        ("cloud_openclaw", "查询云端数据库对比数据"),
    ]
    
    # 并行执行
    results = await asyncio.gather(*[
        orchestrator.call_agent(agent, task)
        for agent, task in tasks
    ])
    
    # 整合结果 (可以用 LLM)
    summary = await synthesize_results(results)
    return summary
```

---

## 总结

**架构**: Hermes (Host) ↔ A2A Protocol ↔ OpenClaw Local + OpenClaw Cloud

**关键配置**:
1. 腾讯云开放端口 + 安全组
2. 每个 OpenClaw 暴露 A2A Server
3. Hermes 作为 A2A Client 协调

**扩展可能**:
- 添加更多 Agents (第三台服务器、Docker 容器等)
- 使用消息队列 (Redis/RabbitMQ) 替代直连
- 添加任务状态持久化

需要我详细展开哪个部分？比如：
1. 腾讯云具体部署步骤
2. 添加身份验证
3. 故障转移机制
