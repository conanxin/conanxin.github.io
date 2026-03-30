# As Rocks May Think

**作者**: Eric Jang  
**发布时间**: 2026年2月4日  
**原文链接**: https://evjang.com/2026/02/04/rocks.html  
**引用**: Vannevar Bush, "As We May Think" (1945)

---

## 开篇引言

> *Whenever logical processes of thought are employed — that is, whenever thought for a time runs along an acceptive groove — there is an opportunity for the machine.*
> 
> — Dr. Vannevar Bush, "As We May Think", 1945

Eric Jang 以 Vannevar Bush 1945年的经典文章《As We May Think》为引子，展开了一幅关于 AI 推理能力爆炸式发展的全景图。

**核心隐喻**：
> *"If we consider life to be a sort of open-ended MMO, the game server has just received a major update. All players take note: consider playing differently."*

---

## 世界已经改变：2022年后的 AI 现实

### 技术奇点的临近

Jang 列举了一系列令人震惊的进展：

- **数学证明**: AI 可以构造 Erdős 问题的新证明 ([Terence Tao 的 Mastodon 帖子](https://mathstodon.xyz/@tao/115855840223258103))
- **网络战**: 国家正在使用 AI 自动化网络攻击 ([Anthropic 报告](https://www.anthropic.com/news/disrupting-AI-espionage))
- **人形机器人**: 可以预购通用家庭人形机器人 ([Figure AI](https://www.youtube.com/watch?v=LTYMWadOW7c))
- **中国机器人生态**: 中国正在创造比其他国家更多的开放机器人、数据和研究
- **视频生成**: AI 生成的视频与现实无法区分
- **全球经济重组**: 整个全球经济正在围绕 AI 模型的规模化重新组织 ([纽约时报](https://www.nytimes.com/2025/11/22/business/the-ai-boom-economy.html))

**最重要的变化**: 机器现在可以很好地编码和思考了。

---

## 作者的亲身经历：Claude Code 两个月

### 从手写代码到自动化研究

Eric Jang 描述了他过去两个月使用 [Claude Code](https://github.com/anthropics/claude-code) 的经历：

> *"Like many others, I spent the last 2 months on a Claude Code bender, grappling with the fact that I no longer need to write code by hand anymore."*

**他正在做的事情**:
- 从零实现 AlphaGo（即将开源）
- 设置 Claude 不仅编写基础设施和研究想法
- 还提出假设、得出结论、建议下一步实验

### `/experiment` 命令：自动化科学家

Jang 创建了一个 Claude 命令 `/experiment`，标准化 AlphaGo 研究环境中的"动作"：

```
1. 创建自包含的实验文件夹（带时间戳前缀和描述性 slug）
2. 将实验程序写入单文件 Python 并执行
3. 中间产物和数据保存到 data/ 和 figures/ 子目录
4. 观察结果，得出结论，建议还有哪些未知和已知
```

**实验输出**: `report.md` markdown 文件，总结对世界的最新观察 ([示例 PDF](http://evjang.com/assets/rocks/example_report.pdf))

### 与旧系统的对比

不同于 Google Vizier 等上一代"自动调优"系统（使用高斯过程 bandits 在用户定义的超参数空间上搜索），现代编码代理可以：

- **改变代码本身** —— 搜索空间无约束
- **反思实验结果是否一致**
- **形成理论解释结果**
- **基于理论测试预测**

**结论**: 
> *"Seemingly overnight, coding agents combined with computer tool use have evolved into automated scientists."*

---

## 通用思维机器的时代

### 从软件工程到通用问题解决

软件工程只是开始。现在我们拥有通用的思维机器，可以使用计算机并解决几乎任何短期数字问题：

| 任务 | 可行性 |
|------|--------|
| 运行一系列研究实验来改进模型架构 | ✅ 没问题 |
| 从零实现整个 Web 浏览器 | ✅ 需要一段时间，但可行 ([Cursor Blog](https://cursor.com/blog/scaling-agents)) |
| 证明未解决的数学问题 | ✅ 甚至不要求成为合著者 ([arXiv](https://arxiv.org/abs/2601.07222)) |
| 让 AI 代理加速自己的 CUDA 内核 | ✅ 可怕，但可行 ([VibeTensor](https://github.com/NVlabs/vibetensor/tree/main/vibe_kernels)) |

### 计算复杂度的重新评估

Jang 指出：
> *"We are entering a golden age in which all computer science problems seem to be tractable, insomuch as we can get very useful approximations of any computable function."*

**曾经的"计算不可行"**: Go、蛋白质折叠、音乐和视频生成、自动数学证明 —— 现在都在 PhD 学生的计算资源范围内。

**甚至 P vs NP**: 引用 Scott Aaronson 的论文，多个实验室正在认真寻找千禧年猜想的证明。

---

## 推理的本质：从演绎到归纳

### 两种推理类型

**演绎推理 (Deductive Inference)**:
- 应用严密的逻辑到严密的前提以得出严密的结论
- 例子: "所有哺乳动物都有肾脏" + "所有马都是哺乳动物" → "所有马都有肾脏"
- 问题: 现实世界是混乱的，没有什么是确定的；一个前提错误，整个逻辑链崩溃

**归纳推理 (Inductive Inference)**:
- 做出概率性陈述
- 贝叶斯规则: P(A|B) = P(B|A)P(A)/P(B)
- 例子: P("X 是男人"|"X 是秃头") = 0.84

### 符号推理系统的失败

**Cyc 项目**: 试图构建常识知识数据库，但失败了，因为：
- 现实世界太混乱
- 精确推理在计算上成本太高（NP-hard）
- 贝叶斯网络中，小概率相乘导致对所有事物的弥散低概率信念

### AlphaGo 的突破

AlphaGo 是首个结合**演绎搜索**与**深度学习归纳推理**的系统：

- **演绎步骤**: 什么是有效动作？放置棋子后棋盘是什么样？
- **归纳步骤**: 
  - 使用策略网络 (policy network) 搜索游戏树最有希望的区域
  - 使用价值网络 (value network) 用"直觉一瞥"预测胜率

**策略网络**在扩展时剪枝树的广度，**价值网络**剪枝树的深度。

---

## LLM 推理的发展历程

### 2022年前的困境

LLM  notoriously 不擅长数学问题和推理，因为它们"shoot from the hip"，无法进行长链逻辑演绎或机械计算（如算术）。

### Chain-of-Thought (2022)

[Chain-of-thought prompting](https://arxiv.org/abs/2201.11903) 和 ["let's think step by step"](https://arxiv.org/abs/2205.11916) 是早期迹象，表明 LLM 确实可以生成"中间思维"来提升问题解决任务的表现。

### Prompt Engineering 的死亡 (2023)

2023年有一整代"hack"，人们试图通过提示来哄骗 LLM，或使用其他 LLM 通过 [self-reflection](https://evjang.com/2023/03/26/self-reflection.html) 或 [self-consistency](https://arxiv.org/abs/2203.11171) 来验证生成。

**但严格的评估显示**: 这些技巧并未使模型在所有任务上普遍变得更聪明。

**原因**: 
> *"You can think of prompt engineering as 'prospecting for lucky circuits' that happened to form in pretraining."*

瓶颈是学习更好的推理回路，而不是找到激活它们的方法。

### 过程监督的尝试

[Process supervision](https://openai.com/index/improving-mathematical-reasoning-with-process-sponsorship/) 展示了可以收集"专家评估的推理"，然后训练 LLM 评分器来确保逻辑推理步骤是严密的。

**但**: 这需要人类注释者检查每个训练示例，无法扩展到大数据集。

### Tree of Thoughts (2024)

[Yao et al.](https://arxiv.org/pdf/2305.10601) 结合了树搜索的演绎推理，通过给 LLM 显式的方式来并行化和回溯推理步骤。

**但**: 这从未成为主流，因为逻辑树的演绎原语不是推理系统性能的最大瓶颈。

---

## DeepSeek R-1 时代：推理的简化

### R1-Zero 的核心配方

当前的 LLM 推理范式实际上非常简单：

1. **从一个好的基础模型开始** —— 优于 2023-2024 时代的模型
2. **使用 on-policy RL 算法 (GRPO)** 在基础模型上优化"基于规则的"奖励
   - AIME 数学问题
   - 通过编程测试套件
   - STEM 测试题
   - 逻辑谜题
3. **格式化奖励** —— 确保推理发生在 `<think></think>` 标签内，并遵循与提示相同的语言

### R1 的四阶段训练

R1-Zero (RL) → R1 Dev 1 (SFT) → R1 Dev-2 (RL) → R1 Dev-3 (SFT) → R1 (RL)

- **R1-Zero**: 能解决问题，但难以使用，不擅长传统 LLM 任务
- **后续阶段**: 恢复在非推理任务上的高性能，同时使推理痕迹更易理解

### 为什么以前不行？

**概念上的"信念飞跃"**:
- 必须违背当时的直觉："没有对中间推理步骤的密集监督，模型就不会学会正确推理"
- 逻辑推理步骤会从基于结果的 RL 中涌现出来 —— 类似于训练"物理模型"只监督最终预测，却发现中间生成了发现物理定律的机制

**需要四个条件**:
1. **强大的基础模型** —— 能够从 RL 中采样连贯的推理痕迹
2. **On-policy RL 优于 SFT** —— 基础模型做采样，必须在紧密反馈循环中强化"幸运回路"
3. **基于规则的奖励优于人类反馈训练的奖励模型** —— 狭窄分布的验证奖励可以教会模型推理其他事情的正确回路
4. **推理计算可用性的规模化** —— 能够在许多大模型上运行许多长上下文采样

**关键教训**:
> *"Takeaway: just because an algorithm does not work from a weak initialization does not imply that you would see the same result from a strong initialization."*

---

## 推理将走向何方？

### 当前状态：强大而灵活

今天的基于 LLM 的推理既强大又灵活。即使它们"一步一步"地进行逻辑搜索，每一步也不必像 Go 中那样严格演绎和简单。

- 小 token 序列可以执行非常增量的步骤 ("1 和 1 的按位与是 1")
- 或者更大的逻辑跳跃 ("Sally 在海边，所以她可能不在犯罪现场……除非她有一个我们不知道的双胞胎")

LLM 可以执行各种概率推理来处理混乱的世界，而不会陷入贝叶斯信念网络的困境。

### 未来的方向

**算法突破还是规模化？**

Jang 认为还有空间使配方更简单：
- 预训练 LLM 之前没有很多好的 token 序列来强制推理回路形成
- 但现在生成了如此多的推理数据，情况可能会改变
- 过程奖励模型和教师强制在推理序列上可能会回归

**架构创新**:

- [Karpathy 的 "Forward Pass" (2021)](https://karpathy.github.io/2021/03/27/forward-pass/): 大模型在单次前向传播中"醒来"，获得情境意识，思考人类
- [Anthropic 2024 论文](https://arxiv.org/pdf/2412.14093): 情境意识可以在 RL 阶段被激发
- [大语言扩散模型](https://arxiv.org/abs/2502.09992) 和 [测试时规模化](https://openai.com/index/learning-to-reason-with-llms/): 大模型的单次前向传播与许多小模型的前向传播之间存在可互换性

** backward pass 中的推理**:
- 模型能在"backward pass"中也"醒来"吗？
- [2025 论文](https://arxiv.org/abs/2512.23675): 在 backward pass 中利用顺序计算的早期迹象

**最终愿景**:
> *"We may find new ways to redesign our architectures to blend the distinction between forward pass, backward pass, autoregressive decoding and discrete diffusion. Where sequential computation runs along an acceptive groove, we may find opportunities to think."*

---

## 思考的市场资本化

### 自动研究成为新常态

> *"Automated research will soon become the standard workflow in high-output labs."*

**生产力对比**:
- 旧方式: 手写架构，逐个提交作业到 Slurm
- 新方式: 5 个并行的 Claude Code 终端，各自追求自己的高级研究轨迹

**信息增益**: 与 Google 人运行的大规模超参数搜索实验不同，自动研究设置中的每 FLOP 信息增益非常高。

### 计算需求的爆炸

**作者的个人使用模式**:
- 以前: 睡前让训练作业整夜运行
- 现在: 让"研究作业"与 Claude 会话在后台工作
- 醒来: 阅读实验报告，写下一两条评论，然后要求 5 个新的并行调查

**计算需求预测**:
> *"I don't think people have begun to fathom how much we will need. Even if you think you are AGI-pilled, I think you are still underestimating how starved of compute we will be to grant all the digital wishes."*

### 类比：空调与计算

**李光耀谈空调**:
> *"It changed the nature of civilization by making development possible in the tropics. Without air conditioning you can work only in the cool early-morning hours or at dusk."*

**计算的未来**:
- 空调目前消耗全球电力生产的 10%
- 数据中心计算不到 1%
- 我们将有石头一直在思考，以推进其所有者的利益

**007 是新的 996**:
> *"Every corporation with GPUs to spare will have ambient thinkers constantly re-planning deadlines, reducing tech debt, and trawling for more information that helps the business make its decisions in a dynamic world."*

**军事应用**:
- 军队将争抢每一个 FLOP 来进行战争游戏推演，就像 MCTS 搜索中的 rollouts
- 问题: 当第一场决定性战争不是由枪支和无人机赢得，而是由计算和信息优势赢得时，会发生什么？

> *"Stockpile your thinking tokens, for thinking begets better thinking."*

---

## 计算机科学工具包中的新算法

### 传统工具包 (学校教授)

- 数据结构: 树、哈希映射、双向链表
- 排序算法
- 蒙特卡洛估计器

### 2010年代深度学习解锁的原语

- 语义哈希
- [伪计数](https://arxiv.org/abs/1810.12894)
- [摊销搜索](https://storage.googleapis.com/deepmind-media/alphago/AlphaGoNaturePaper.pdf)

### GPT-2/GPT-3 时代的新原语

- **"自然语言理解"** —— 可以"直接问"想要什么，而不是直接求解

### 推理模型时代的新算法

**探索 vs 利用的重新审视**:

传统的 RL 探索 vs 利用权衡有一套算法：
- 上置信界 (UCB)
- Thompson 采样
- 优势估计中的基线
- 保守 Q 估计
- 最大熵 RL

这些算法都基于 MDP，附着于一个僵化的低级别工作空间。

**新的可能性**:
- 现在我们可以近似状态熵 H(s) 甚至轨迹熵 H(τ)
- 我们可以要求 LLM 更整体地思考特定问题，而无需显式本体数据结构
- 全新的 RL 方式: 直接问 LLM "思考你到目前为止尝试过的所有事情，尝试你还没做过的事情"

**挑战 CTO 的问题**:
> *"If you are a team lead or a CTO at some company, how can you look at files like [this one](https://www.moltbook.com/skill.md) and not become totally convinced that software engineering and computer systems are about to look completely different in 2026?"*

---

## 给技术人员的建议

### 软件组织

> *"if your team's monorepo is not already set up to utilize the datacenter of geniuses that can conjure all kinds of digital goods, you should probably make those changes quickly."*

### 研究人员

> *"automated research is the new meta. People who can direct teams of agents at goals and know how to judge what to focus on in a full-stack scope will experience an exhilarating level of productivity that makes making software a joy again."*

### 机器人学家

> *"there is the age-old question of how much we should rely on sim data vs. real data. Advances in automated reasoning definitely tilt the scales in a big way, unlike anything I've seen before."*

### AI 预测

Jang 现在认为以下预测是合理的，甚至可能是大概率事件：
- [AI 2027](https://ai-2027.com/)
- [Situational Awareness](https://situational-awareness.ai/the-free-world-must-prevail/)

---

## 与数字花园文章的对话

### 与 Turkovic (AI Makes Coding Easier) 的对话

**共鸣点**:
- Jang 描述了他不再需要手写代码的经历
- 这正是 Turkovic 警告的：AI 让编程更容易，但可能带来 burnout

**深化理解**:
- Jang 展示了"自动化研究"的极端版本
- 不是简单的代码生成，而是完整的科学方法自动化

**Turkovic 的警告在此应验**:
> *"我醒来阅读实验报告，写下一两条评论，然后要求 5 个新的并行调查。"*

这是从"创造者"到"管理者"的转变 —— 价值从编码转向判断和策展。

---

### 与 Cedric Chin (Meaning Making) 的对话

**核心连接**:
Jang 的 `/experiment` 命令正是 Cedric Chin 所说的**意义构建**的自动化版本：
- 观察结果
- 得出结论
- 建议还有哪些未知和已知

**但关键区别**:
- Cedric Chin 强调**人的判断**在不确定性中的核心作用
- Jang 展示了 AI 可以自动化大部分意义构建过程

**问题**: 当 AI 可以自动化意义构建时，人的价值在哪里？

---

### 与 Graham (Taste for Makers) 的对话

**品味的角色**:
- Jang 提到他会"写下一两条评论"然后让 Claude 继续
- 这正是**品味**的作用 —— 从 AI 生成的众多选项中挑选有价值的方向

**新的品味形式**:
- 不再是"好代码"的品味
- 而是"好问题"、"好实验设计"、"好研究方向"的品味

---

### 与 Bonneville (The Only Moat Left Is Money) 的对话

**计算即资本**:
> *"Stockpile your thinking tokens, for thinking begets better thinking."*

Jang 同意资本（这里是计算资源）成为新的壁垒：
- 拥有更多 GPU 的人可以运行更多并行研究
- 自动研究放大了计算资源的不平等

**但新的差异化**:
- 知道如何"指导代理团队"的人
- 知道如何判断关注什么的人
- 这是**策展能力**，不只是资本

---

### 与 Manidis (Tool Shaped Objects) 的对话

**警示**:
Jang 描述的自动化研究系统可能是终极的"工具形状的物体"：
- 它产生实验报告（让数字上升）
- 但这些实验是否解决了真正的问题？

**缓解因素**:
- Jang 强调了人的判断（"写下一两条评论"）
- 但风险是，随着系统变得更强大，人可能过度依赖自动化

---

## 关键引用

> *"The world has changed a lot since 2022. ChatGPT happened."*

> *"Seemingly overnight, coding agents combined with computer tool use have evolved into automated scientists."*

> *"We are entering a golden age in which all computer science problems seem to be tractable."*

> *"Just because an algorithm does not work from a weak initialization does not imply that you would see the same result from a strong initialization."*

> *"007 is the new 996."*

> *"Stockpile your thinking tokens, for thinking begets better thinking."*

> *"Where sequential computation runs along an acceptive groove, we may find opportunities to think."*

---

## 反思问题

1. 如果 AI 可以自动化研究，研究人员的角色会变成什么？
2. "007 是新的 996" — 你准备好让 AI 007 工作了吗？
3. 当计算成为新的稀缺资源，没有资本的人如何竞争？
4. 在自动化研究的时代，"品味"和"判断"如何培养？
5. Jang 描述的自动化研究系统，是否会让你失去对研究过程的理解？
6. 如果"石头可以思考"，人类思考的价值在哪里？
7. 你同意 Jang 对 AI 2027 和 Situational Awareness 的预测吗？

---

## 相关文章

- [[ai-makes-coding-easier]] — Turkovic：AI 让编程更容易，但可能带来 burnout
- [[meaning-making-uncertainty]] — Cedric Chin：在不确定性中构建意义的能力
- [[taste-for-makers]] — Graham：创造者的品味
- [[the-moat-is-money]] — Bonneville：资本成为新的壁垒
- [[tool-shaped-objects]] — Manidis：警惕工具形状的物体
- [[designlab-ai-ux-survey-2026]] — Designlab：AI 在 UX 设计中的应用趋势
- [[tool-critique-synthesis]] — 工具批判四部曲综合
- [[ai-era-creator-synthesis]] — AI 时代创作者生存指南综合

---

#reasoning-models #deepseek-r1 #alphaGo #automated-research #claude-code #agi #compute-scaling #future-of-ai #eric-jang
