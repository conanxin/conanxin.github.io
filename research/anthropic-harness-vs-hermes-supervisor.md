# Anthropic Harness 与 Hermes Supervisor 深度对比分析

## 核心洞察

**Anthropic 解决的是"开发阶段"的问题：如何让 Agent 产出质量更高**
**Hermes 解决的是"运维阶段"的问题：如何让 Agent 运行更稳定，减少人工值守**

两者不是竞争关系，是**先后关系**：先让它干得好，再让它跑得稳。

---

## 一、Anthropic Harness 的演化路径

### 4 篇博客的演进逻辑

```
第一篇: 理论框架
    ↓
第二篇: 实际应用 (Research 功能)
    ↓
第三篇: 解决长任务问题 (Context Anxiety)
    ↓
第四篇: 引入独立 Evaluator (对抗生成)
```

### 详细分析

#### 1. Building Effective Agents (理论框架)

**核心贡献**: 提出 6 种 workflow pattern

**关键模式**: `evaluator-optimizer`
- 一个 agent 生成
- 另一个评估并反馈
- 两个角色循环迭代

**本质**: 质检循环 - 不合格就重做，直到达标

#### 2. Research 功能实现

**直接应用**: evaluator-optimizer 落地

**架构**:
```
Lead Agent (协调者)
    ├── Subagent 1 (搜索方向 A)
    ├── Subagent 2 (搜索方向 B)
    └── Subagent 3 (搜索方向 C)
         ↓
    Lead Agent 评估结果质量
         ↓
    不够? → 派新 Subagent 补充
```

**关键发现**:
- Token 用量解释了 **80%** 的性能差异
- Model choice + tool call 次数 = 剩下的 20%
- **Multi-agent 收益本质：花更多 token 做更充分的探索**

#### 3. 长任务问题 (Context Anxiety)

**问题现象**:
- Agent 试图 one-shot 完成 4 小时编码任务
- Context 用到一半，东西写了半截
- Context 快满时急着收工

**解决方案**: 阶段分离
```
Initializer Agent (第一阶段)
    ├── 搭好项目环境
    ├── 列出所有 feature
    └── 写入 progress file
         ↓
Coding Agent (后续每个 session)
    ├── 只挑一个 feature 做
    ├── 做完更新 progress file
    └── 交给下一个 session
```

#### 4. 独立 Evaluator (对抗生成)

**核心问题**: Agent 评自己的代码过于宽容
- 会发现问题
- 但说服自己"这不是大事"

**解决方案**: GAN-like 架构
```
Planner (需求拆解)
    ↓
Generator (写代码)
    ↓
Evaluator (独立评估) ← 关键：完全独立
    ↓
不合格? → 退回 Generator 重做
```

**关键洞察**:
> "Separating the agent doing the work from the agent judging it proves to be a strong lever."
> 
> 做事的和判断的分开，是一个比自我批评更好使的杠杆。

**验证方式**:
- Evaluator 用 Playwright 像真实用户一样操作应用
- 不合格就退回重做

**Harness 组件的动态性**:
> "Every component in a harness encodes an assumption about what the model can't do on its own, and those assumptions are worth stress testing."
>
> 每个 harness 组件背后都有一个"模型做不到这件事"的假设，这些假设要定期回去验证。

**实例**:
- Opus 4.5: 需要 sprint 分解
- Opus 4.6: 不需要了，模型自己能保持连贯

---

## 二、Hermes Supervisor 方案

### 背景

**作者**: Graeme (@gkisokay)  
**场景**: OpenClaw 已经在生产环境运行

**问题**: 
- OpenClaw 每天自动处理 crons、scoring、drafting
- 产出质量本身没问题
- 但 Graeme 一天到晚还在看 error logs、看输出、看有什么该人工干预的

**解决方式**: 
不是给 OpenClaw 加更好的 harness，而是用 **Hermes 作为独立监督者**，专门盯 OpenClaw 的输出。

### 架构设计

#### 通信协议 (极简设计)

**通道**: Discord 私有频道

**协议只有 4 个 marker**:

| Marker | 含义 | 用途 |
|--------|------|------|
| `STATUS_REQUEST` | "怎么样了" | 主动查询状态 |
| `REVIEW_REQUEST` | "帮我看看这个" | 提交产出待审查 |
| `ESCALATION_NOTICE` | "这个得你来定" | 需要人类决策 |
| `ACK` | "收到，结束" | 终止信号 |

**规则 (硬性约束)**:
1. 每条消息必须带一个 marker 和一个 @mention
2. **ACK 是终止信号** - 收到不回复
3. 没有 marker 的消息 = informational，不回复
4. 每轮一条消息，**最多 3 轮结束**

**设计哲学**:
> 这大概是最小可行的 multi-agent 通信协议了。它直接干掉了 multi-agent 最经典的死法：两个 bot 互相回复停不下来。

### 交互示例

#### 正常流程

```
Hermes: STATUS_REQUEST @OpenClaw

OpenClaw: 
  - 6 个 crons 都跑完了
  - 提议：把 scoring threshold 从 60 调到 65
  - 原因：上周误报率偏高

Hermes: 
  - 评估提案合理性
  - 证据支持变更
  - ACK (关闭对话)
```

**关键点**: Hermes 不只是说"没问题"，它**评估了提案的合理性**。

#### 异常流程

```
OpenClaw: REVIEW_REQUEST @Hermes
  - 早间报告引用了 2 条超过 24 小时的旧信号

Hermes:
  - 诊断出具体是哪两条过期了
  - 给出两个处置建议：
    1. 重新用新数据跑一遍
    2. 原样发布 + 加时效说明
  - ESCALATION_NOTICE @人类
    (带着诊断和建议，让人类做最终决定)
```

**关键点**: 
- Hermes 做了**分诊**工作
- 带着**诊断和建议**升级
- 不是简单地把问题扔给人类

---

## 三、本质区别对比

### 信息流向 (核心差异)

```
┌─────────────────────────────────────────────────────────────┐
│              Anthropic Evaluator (质检员模式)                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Generator → 产出 → Evaluator 检查 → 不合格? → 退回重做      │
│        ↑                                      │             │
│        └──────────────────────────────────────┘             │
│                                                             │
│   判断回流给 Agent，驱动新一轮迭代                            │
│   目标：直到达标                                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              Hermes Supervisor (分诊台模式)                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   OpenClaw → 产出 → Hermes 评估                              │
│                         ↓                                   │
│                    ┌────┴────┐                              │
│               正常? │        │ 异常?                         │
│                    ↓        ↓                               │
│                  ACK    ESCALATION → 人类                    │
│                (关闭)   (带诊断建议)                          │
│                                                             │
│   判断不回传给 Agent                                       │
│   要么关闭，要么升级给人类                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 详细对比

| 维度 | Anthropic Evaluator | Hermes Supervisor |
|------|---------------------|-------------------|
| **核心角色** | 质检员 | 急诊分诊台 |
| **判断流向** | 回流给 Generator，驱动重做 | 不回传，ACK 或升级 |
| **处理闭环** | 内部闭环 (Agent 内部循环) | 外部闭环 (涉及人类决策) |
| **解决阶段** | 开发阶段 (产出质量) | 运维阶段 (运行稳定性) |
| **干预对象** | Agent 的产出 | Agent 的运行状态 |
| **终止条件** | 质量达标 | ACK 或升级人类 |
| **反馈深度** | 具体修改意见 | 诊断 + 处置建议 |

### 关键区别详解

**质检员 vs 分诊台**:

| 场景 | 质检员 (Anthropic) | 分诊台 (Hermes) |
|------|-------------------|-----------------|
| 代码写得不够好 | 指出问题，退回重写 | 不适用 |
| 测试不通过 | 给出失败原因，要求修复 | 不适用 |
| Cron 任务失败 | 不适用 | 诊断原因，建议重跑或忽略 |
| 配置需要调整 | 不适用 | 评估提案，ACK 批准或升级 |
| 产出质量存疑 | 不适用 | 诊断问题，带建议升级人类 |

**核心洞察**:
- Anthropic: **如何让 Agent 做对**
- Hermes: **如何让 Agent 运行稳定，减少对人类的打扰**

---

## 四、共享的设计原则

尽管适用阶段不同，但三个底层原则完全一致：

### 1. 角色分离比自我评估可靠

**Anthropic 验证**:
- 实验数据：独立 evaluator 比 generator 自我评估更严格
- 更容易发现真正的问题

**Hermes 验证**:
- 生产环境实际运行验证
- Graeme 从"自己盯着"到"Hermes 盯着"

**共同结论**:
> 不管是 agent 评自己的代码，还是你自己盯着 agent 的输出，分开给另一个角色做都更靠谱。

### 2. 通信协议需要硬终止条件

**Anthropic 方案**:
- Token budget 上限
- Tool call 次数上限

**Hermes 方案**:
- ACK terminal (明确终止信号)
- 3 轮上限

**共同结论**:
> 没有显式终止条件的 multi-agent 系统，最终一定会死于无限循环。

### 3. Harness 组件是对模型能力缺口的假设，要定期压力测试

**Anthropic 案例**:
- Opus 4.5 → 4.6: sprint 分解不再需要
- 模型变强，harness 组件可以简化

**Hermes 推论**:
- 随着模型变强，supervisor 需要做的判断会越来越少
- 未来日常的 ACK 可能完全自动化
- Supervisor 只在真正的异常情况介入

**共同结论**:
> 每个 harness/supervisor 组件背后都有一个"模型做不到这件事"的假设，这些假设要定期回去验证。

---

## 五、实践指南：判断你的瓶颈在哪个阶段

### 决策树

```
你的 Agent 目前状态如何?
    │
    ├── 产出质量还不稳定?
    │       ↓
    │   瓶颈在【开发阶段】
    │       ↓
    │   参考 Anthropic 的 4 篇博客
    │   从 evaluator-optimizer 开始
    │
    └── 产出质量 OK，但你在当值班人?
            ↓
        瓶颈在【运维阶段】
            ↓
        参考 Hermes 思路
        加一个分诊台，没事不打扰你，有事带着诊断来找你
```

### 阶段特征对比

| 特征 | 开发阶段 (Anthropic) | 运维阶段 (Hermes) |
|------|---------------------|-------------------|
| **主要问题** | 产出质量不稳定 | 需要人工值守 |
| **典型场景** | 编码、写作、研究 | Cron 任务、监控、报告 |
| **干预频率** | 每次产出都检查 | 只在异常时介入 |
| **目标** | 质量达标 | 运行稳定 |
| **解决方案** | Evaluator + 反馈循环 | Supervisor + 分诊升级 |

### 两阶段的关系

```
┌─────────────────────────────────────────────────────────────┐
│                      Agent 生命周期                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  阶段 1: 开发                                                │
│  ├── 目标: 产出质量达标                                       │
│  ├── 工具: Anthropic Harness                                 │
│  │   ├── Evaluator-optimizer                                 │
│  │   ├── Multi-agent research                                │
│  │   ├── Context anxiety 处理                                │
│  │   └── 独立 Evaluator                                      │
│  └── 产出: 质量稳定的 Agent                                   │
│         ↓                                                   │
│  阶段 2: 部署                                                │
│  ├── 目标: 减少人工值守                                       │
│  ├── 工具: Hermes Supervisor                                 │
│  │   ├── STATUS_REQUEST 监控                                 │
│  │   ├── REVIEW_REQUEST 审查                                 │
│  │   └── ESCALATION_NOTICE 升级                              │
│  └── 产出: 自主运行的 Agent                                   │
│                                                             │
│  注意: 两个阶段不是二选一，是先后                             │
│        先让它干得好，再让它跑得稳                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 六、对 Hermes Agent 系统的启示

### 1. 明确阶段定位

当前 Hermes 更适合作为 **Supervisor (分诊台)** 角色:
- ✅ 独立运行
- ✅ 监控其他 Agent
- ✅ 带诊断升级

### 2. 可能的架构增强

#### 方向 A: 强化 Supervisor 能力

```python
# Hermes 作为 OpenClaw 的 Supervisor
class HermesSupervisor:
    def monitor(self, target_agent: str):
        # STATUS_REQUEST 轮询
        # REVIEW_REQUEST 审查
        # ESCALATION_NOTICE 升级
        pass
    
    def evaluate_proposal(self, proposal: dict) -> Decision:
        # 评估变更提案
        # ACK 或 ESCALATION
        pass
```

#### 方向 B: 内部 Evaluator (开发阶段)

```python
# Hermes 内部的 Skill 质量评估
class SkillEvaluator:
    def evaluate_skill_output(self, skill_name: str, output: str) -> Evaluation:
        # 类似 Anthropic 的 evaluator
        # 生成改进建议
        pass
    
    def auto_improve(self, skill_name: str):
        # 自动优化 Skill
        pass
```

### 3. 通信协议设计

借鉴 Hermes-OpenClaw 的极简协议：

```python
class AgentCommunicationProtocol:
    """
    最小可行 multi-agent 通信协议
    """
    
    MARKERS = {
        'STATUS_REQUEST': '查询状态',
        'REVIEW_REQUEST': '审查产出',
        'ESCALATION_NOTICE': '升级人类',
        'ACK': '确认关闭',
    }
    
    MAX_ROUNDS = 3
    
    def send(self, marker: str, content: str, recipient: str):
        assert marker in self.MARKERS
        # 发送消息
        pass
    
    def should_respond(self, message: dict) -> bool:
        # 检查 marker
        # ACK = 不回复
        # 无 marker = informational，不回复
        pass
```

### 4. 与 Improvement Loop 结合

```
Hermes Improvement Loop (自主改进)
    ↓
收集执行数据 → 检测问题 → 生成改进建议
    ↓
如果是 Skill 质量问题 → 内部 Evaluator 优化 (Anthropic 模式)
如果是运行稳定性问题 → Supervisor 介入 (Hermes 模式)
    ↓
闭环改进
```

---

## 七、总结

### 核心观点

1. **问题阶段决定解决方案**
   - 开发阶段质量问题 → Anthropic Harness
   - 运维阶段值守问题 → Hermes Supervisor

2. **本质区别在于信息流向**
   - Evaluator: 判断回流，驱动重做 (内部闭环)
   - Supervisor: 判断不回传，ACK 或升级 (外部闭环)

3. **共享三个底层原则**
   - 角色分离 > 自我评估
   - 硬终止条件必需
   - 组件假设需定期验证

4. **先后关系而非二选一**
   - 先让它干得好 (Harness)
   - 再让它跑得稳 (Supervisor)

### 对读者的建议

**如果你正在构建 Agent 系统**:

1. **诊断当前阶段**
   - 产出质量不稳定? → 先看 Anthropic
   - 已经在值守? → 先看 Hermes

2. **不要跳阶段**
   - 先解决质量，再解决运维
   - 质量不稳的 Agent，加 Supervisor 也没用

3. **设计通信协议**
   - 借鉴 Hermes 的极简设计
   - 硬终止条件必须
   - 明确 marker 和轮次限制

4. **定期验证假设**
   - 随着模型变强，简化 harness/supervisor
   - 每个组件都要问：模型现在还需要这个吗?

---

## 参考资源

### Anthropic 博客
1. Building Effective Agents (6 种 workflow pattern)
2. Research 功能实现 (evaluator-optimizer 实践)
3. 长任务处理 (Context Anxiety)
4. 独立 Evaluator (对抗生成)

### Hermes 资源
- Graeme 文章: OpenClaw + Hermes Supervisor 配置
- Hermes 官方: https://github.com/NousResearch/hermes

### 相关概念
- GAN (Generative Adversarial Networks)
- Evaluator-Optimizer Pattern
- Multi-agent Communication Protocol
