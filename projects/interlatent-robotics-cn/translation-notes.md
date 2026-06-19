# 翻译说明（Translation Notes）

## 范围
本项目翻译 Interlatent 官方博客中的两篇文章：

1. **A Beginner's Guide to Robotics Hardware**（Entry 4 · Primer 18.VI.MMXXVI · 12 min read）
   → 译为《机器人硬件入门指南》
2. **An Overview of Modern AI Robotics from First Principles**（Entry 3 · Primer 10.VI.MMXXVI · 9 min read）
   → 译为《从第一性原理看现代 AI 机器人》

两篇均为 Interlatent Primer 系列正典文章，发布时间不同、内容主线不同（前者讲硬件，后者讲算法-数据-训练范式）。

## 翻译原则
- **完整**：逐段翻译，不摘要、不删段、不改写为"解读"。
- **结构保留**：保留原文 H1/H2/H3 层级、段落、列表、图注位置、原文链接。
- **术语统一**：见下方统一译名表，首次出现时采用"英文 + 中文译名 + 缩写"形式。
- **图示**：原文是 JS 交互式组件（HTML shell 之外），本中文页以静态 SVG/CSS 重建关键图示，并在图下注明"根据原文可视化结构重建，用于中文阅读页展示"。
- **正文与背景资料严格分区**：所有译者补充都进 `background` 区块，不混入译文正文。

## 统一译名表（首次出现形式 → 后文简称）

| 英文 / 原文 | 中文译名（首次） | 后文简称 |
|---|---|---|
| Physical AI | 物理 AI | 物理 AI |
| Embodied AI | 具身 AI | 具身 AI |
| Vision-Language-Action model | 视觉-语言-动作模型（VLA） | VLA |
| Vision-Language Model | 视觉-语言模型（VLM） | VLM |
| action chunking | 动作分块（action chunking） | 动作分块 |
| rollout | rollout / 执行轨迹（视上下文选择） | rollout |
| policy | 策略模型 | 策略 / 策略模型 |
| inference time | 推理时间 | 推理时间 |
| post-training loop | 后训练闭环 | 后训练闭环 |
| robot learning | 机器人学习 | 机器人学习 |
| imitation learning | 模仿学习 | 模仿学习 |
| reinforcement learning | 强化学习 | 强化学习 |
| end effector | 末端执行器 | 末端执行器 |
| gripper | 夹爪 | 夹爪 |
| joint angles | 关节角度 | 关节角度 |
| torques | 力矩 | 力矩 |
| embodiment | 具身体 | 具身体 |
| world model | 世界模型 | 世界模型 |
| flow matching | 流匹配（flow matching） | 流匹配 |
| diffusion | 扩散（diffusion） | 扩散 |
| teleoperation | 遥操作（teleoperation） | 遥操作 |
| egocentric | 第一人称视角 / 自我中心 | 第一人称 |
| DOF (degrees of freedom) | 自由度（DOF） | 自由度 |
| PID controller | PID 控制器 | PID |
| feedback controller | 反馈控制器 | 反馈控制器 |
| encoder | 编码器 | 编码器 |
| IMU | 惯性测量单元（IMU） | IMU |
| LiDAR | 激光雷达（LiDAR） | LiDAR |

## 原文引用与作者归属
- 原文均来自 Interlatent 官方博客：[interlatent.com/blog](https://interlatent.com/blog)
- 原文版权归 Interlatent 所有。本中文页面仅作非商用学习性整理。
- 原文链接（最终 URL / canonical URL 与请求 URL 一致）：
  - https://interlatent.com/blog/interlatent-robotics-hardware-guide
  - https://interlatent.com/blog/interlatent-modern-ai-robotics-first-principles

## 译者未添加内容
- 未添加译者评论到译文正文。
- 未将背景资料混入译文。
- 所有"为什么 VLA 重要""为什么 action chunking 重要"等解释，都放在页面底部的"背景资料"区块，标明来源链接。