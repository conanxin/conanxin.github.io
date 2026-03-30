# Anthropic Harness vs Hermes Supervisor - 快速对比

## 一句话总结

| | Anthropic Harness | Hermes Supervisor |
|---|-------------------|-------------------|
| **核心问题** | Agent 产出质量不稳定 | Agent 运行需要人工值守 |
| **解决方案** | 加质检员 (Evaluator) | 加分诊台 (Supervisor) |
| **信息流向** | 质检反馈 → 重做 (内部闭环) | 诊断 → ACK 或升级人类 (外部闭环) |
| **适用阶段** | 开发阶段 | 运维阶段 |
| **关系** | 先让它干得好 | 再让它跑得稳 |

---

## 架构对比图

### Anthropic Evaluator (质检员)

```
┌────────────────────────────────────────────────────────────┐
│                      Agent Harness                          │
│                    (开发阶段 - 质量控制)                     │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐   │
│  │  Planner    │ →  │  Generator  │ →  │  Evaluator  │   │
│  │  (拆需求)    │    │  (写代码)    │    │  (质检员)    │   │
│  └─────────────┘    └──────┬──────┘    └──────┬──────┘   │
│                             │                   │          │
│                             │ ◄──── 不合格 ────│          │
│                             │                   │          │
│                             │ ◄──── 重做 ─────┘          │
│                             │                              │
│                             ↓                              │
│                      ┌─────────────┐                      │
│                      │   合格产出   │                      │
│                      └─────────────┘                      │
│                                                             │
│  特点: 内部闭环，直到达标                                    │
│  终止: 质量达标                                              │
└────────────────────────────────────────────────────────────┘
```

### Hermes Supervisor (分诊台)

```
┌────────────────────────────────────────────────────────────┐
│                   Hermes Supervisor                         │
│                   (运维阶段 - 运行监控)                      │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐         ┌─────────────┐                  │
│  │  OpenClaw   │ ──────→ │   Hermes    │                  │
│  │  (生产Agent)│  产出   │ (Supervisor)│                  │
│  └─────────────┘         └──────┬──────┘                  │
│                                 │                          │
│                    ┌────────────┼────────────┐            │
│                    ↓            ↓            ↓            │
│              ┌─────────┐  ┌─────────┐  ┌───────────┐    │
│              │  正常   │  │  可处理  │  │  需人类   │    │
│              │   ACK   │  │  ACK    │  │ ESCALATION│    │
│              │ (关闭)  │  │ (批准)  │  │  (升级)   │    │
│              └─────────┘  └─────────┘  └─────┬─────┘    │
│                                              │            │
│                                              ↓            │
│                                        ┌───────────┐      │
│                                        │   人类    │      │
│                                        │ (最终决策)│      │
│                                        └───────────┘      │
│                                                             │
│  特点: 不回传，要么关闭，要么升级人类                          │
│  终止: ACK 或 ESCALATION                                    │
└────────────────────────────────────────────────────────────┘
```

---

## 通信协议对比

### Anthropic Multi-Agent (研究功能)

```python
# 隐式协议 - 通过 token budget 和工具调用限制
class ResearchSystem:
    def execute(self, query: str):
        lead = LeadAgent()
        subagents = [SubAgent() for _ in range(3)]
        
        # 并行执行
        results = parallel_execute(subagents, query)
        
        # Lead 评估
        while not lead.is_sufficient(results):
            # 不够? 派新的 subagent
            new_subagent = SubAgent()
            results.append(new_subagent.execute(lead.get_gap()))
            
            # 隐式终止: token budget / tool call 上限
            if token_used > MAX_TOKENS:
                break
        
        return results
```

### Hermes Protocol (极简设计)

```python
# 显式协议 - 只有 4 个 marker，3 轮上限
class HermesProtocol:
    MARKERS = {
        'STATUS_REQUEST': '查询状态',
        'REVIEW_REQUEST': '审查产出', 
        'ESCALATION_NOTICE': '升级人类',
        'ACK': '确认关闭',
    }
    
    MAX_ROUNDS = 3
    
    def handle_message(self, msg: Message):
        # 规则 1: 必须带 marker
        if not msg.marker:
            return  # informational，不回复
        
        # 规则 2: ACK 是终止信号
        if msg.marker == 'ACK':
            return  # 不回复
        
        # 规则 3: 最多 3 轮
        if msg.round > self.MAX_ROUNDS:
            return  # 强制终止
        
        # 处理逻辑
        if msg.marker == 'STATUS_REQUEST':
            return self.check_status()
        elif msg.marker == 'REVIEW_REQUEST':
            return self.evaluate(msg.content)
        elif msg.marker == 'ESCALATION_NOTICE':
            return self.notify_human(msg)
```

---

## 决策流程对比

### 场景: Agent 产出一个有问题的报告

#### Anthropic 处理方式

```
Generator 写出报告
    ↓
Evaluator 检查
    ↓
发现问题: "第 3 节数据过期"
    ↓
反馈给 Generator: "请更新第 3 节数据"
    ↓
Generator 重写
    ↓
Evaluator 再检查
    ↓
合格 → 输出最终报告
```

**特点**: 内部闭环，问题在 Agent 系统内部解决

#### Hermes 处理方式

```
OpenClaw 生成报告
    ↓
Hermes 审查 (REVIEW_REQUEST)
    ↓
发现问题: "第 3 节数据过期"
    ↓
Hermes 诊断:
    - 具体是哪两条数据过期
    - 建议 1: 重新跑数据
    - 建议 2: 加时效说明
    ↓
判断: 需要人类决策 (ESCALATION_NOTICE)
    ↓
带着诊断和建议升级给人类
    ↓
人类决策
```

**特点**: 外部闭环，问题升级到人类决策

---

## 适用场景速查表

| 你的情况 | 推荐方案 | 原因 |
|----------|----------|------|
| Agent 代码写得不够好 | Anthropic Harness | 需要质检反馈循环 |
| Agent 测试不通过 | Anthropic Harness | 需要具体修改意见 |
| Agent 怕复杂任务就写 stub | Anthropic Harness | 需要严格 evaluator |
| Agent 验证时写弱测试 | Anthropic Harness | 需要独立评估 |
| Agent 已经在生产环境跑 | Hermes Supervisor | 需要监控运行状态 |
| 每天看 error logs | Hermes Supervisor | 需要自动分诊 |
| 担心 Agent 出问题没发现 | Hermes Supervisor | 需要主动监控 |
| 配置调整需要人工批准 | Hermes Supervisor | 需要评估提案 |

---

## 关键洞察

### 1. 问题域不同

```
开发阶段                    运维阶段
    │                          │
    ▼                          ▼
┌────────────┐            ┌────────────┐
│ 产出质量    │            │ 运行稳定性  │
│  - 代码质量 │            │  - 任务监控 │
│  - 测试通过 │            │  - 异常处理 │
│  - 符合需求 │            │  - 配置管理 │
└────────────┘            └────────────┘
    │                          │
    ▼                          ▼
Anthropic Harness      Hermes Supervisor
(质检员)                (分诊台)
```

### 2. 信息流向是关键区别

```
Evaluator (内部闭环)          Supervisor (外部闭环)
    │                               │
    ▼                               ▼
判断回流给 Agent               判断不回传
    │                               │
    ▼                               ▼
Agent 重做                      ACK (关闭)
直到达标                        或 ESCALATION (升级人类)
```

### 3. 两阶段是先后关系

```
Agent 生命周期
    │
    ├── 阶段 1: 让它干得好
    │       └── Anthropic Harness
    │       └── 解决产出质量问题
    │       └── 内部闭环优化
    │
    └── 阶段 2: 让它跑得稳
            └── Hermes Supervisor
            └── 解决运维值守问题
            └── 外部闭环监控
```

**不要跳阶段！**
- 质量不稳的 Agent，加 Supervisor 也没用
- 先解决"做对"，再解决"跑稳"

---

## 对 Hermes Agent 的启示

### 当前定位

Hermes 目前更适合作为 **Supervisor** 角色:
- ✅ 独立运行
- ✅ 监控其他 Agent
- ✅ 带诊断升级

### 可能的增强方向

#### 方向 1: 强化 Supervisor 能力

```python
class HermesSupervisor:
    """
    Hermes 作为其他 Agent 的 Supervisor
    """
    
    def monitor_cron_jobs(self, agent_name: str):
        # STATUS_REQUEST 轮询
        status = self.send(agent_name, 'STATUS_REQUEST')
        
        if status.has_issues:
            return self.diagnose_and_escalate(status)
        
        return 'ACK'
    
    def evaluate_config_change(self, proposal: ConfigProposal):
        # 评估配置变更提案
        if self.is_safe(proposal):
            return 'ACK'
        else:
            return self.escalate_with_recommendations(proposal)
```

#### 方向 2: 内部 Evaluator (Skill 质量)

```python
class SkillEvaluator:
    """
    Hermes 内部 Skill 的 Evaluator
    """
    
    def evaluate_skill_execution(self, skill_name: str, execution: Execution):
        # 类似 Anthropic 的 evaluator
        issues = self.detect_issues(execution)
        
        if issues:
            # 生成改进建议
            improvements = self.suggest_improvements(skill_name, issues)
            
            # 自动优化或升级人类
            if self.can_auto_fix(improvements):
                return self.auto_improve(skill_name, improvements)
            else:
                return self.escalate_to_human(skill_name, issues, improvements)
        
        return 'OK'
```

#### 方向 3: 与 Improvement Loop 结合

```python
class HermesWithBoth:
    """
    结合 Anthropic 和 Hermes 思想的系统
    """
    
    def __init__(self):
        self.internal_evaluator = SkillEvaluator()  # Anthropic 模式
        self.external_supervisor = Supervisor()      # Hermes 模式
    
    def process(self, task: Task):
        # 阶段 1: 内部 Evaluator 确保质量 (Anthropic)
        result = self.agent.execute(task)
        
        while not self.internal_evaluator.check(result):
            feedback = self.internal_evaluator.get_feedback(result)
            result = self.agent.re_execute(task, feedback)
        
        # 阶段 2: Supervisor 监控运行 (Hermes)
        supervision = self.external_supervisor.monitor(result)
        
        if supervision.needs_escalation:
            return self.escalate_to_human(supervision)
        
        return result
```

---

## 总结

### 核心区别

| | Anthropic | Hermes |
|---|-------------|--------|
| **像什么** | 质检员 | 急诊分诊台 |
| **做什么** | 检查产出，不合格退回重做 | 评估情况，正常关闭/异常升级 |
| **反馈给谁** | Agent (内部闭环) | 人类 (外部闭环) |
| **解决什么** | 开发阶段质量问题 | 运维阶段值守问题 |

### 关键洞察

1. **问题阶段决定方案**
   - 质量不稳 → Anthropic
   - 需要值守 → Hermes

2. **信息流向是本质区别**
   - Evaluator: 回流重做
   - Supervisor: 不回传，ACK 或升级

3. **两阶段是先后关系**
   - 先让它干得好 (Harness)
   - 再让它跑得稳 (Supervisor)

### 最终建议

**如果你正在构建 Agent 系统**:

1. **诊断当前阶段**
   - 产出质量不稳? → 先看 Anthropic
   - 已经在值守? → 先看 Hermes

2. **不要跳阶段**
   - 质量不稳 + Supervisor = 没用
   - 先解决"做对"，再解决"跑稳"

3. **设计通信协议**
   - 借鉴 Hermes 极简设计
   - 硬终止条件必须

4. **定期验证假设**
   - 模型变强 → 简化 harness/supervisor
   - 每个组件问：模型还需要这个吗?
