# 项目 | Projects

> *将想法转化为现实的工程实践*

---

## 活跃项目

### 🔮 Aura - 个人 AI 生态系统 MVP

**状态**: 架构设计阶段  
**目标**: 构建本地优先、AI 增强、逐步去中心化的个人知识管理与创作系统  
**时间**: 6-8 周开发周期

---

### 🛠️ Nano Banana Pro 提示词生成器

**状态**: 已完成  
**类型**: Python CLI 工具  
**功能**: 基于模板智能生成 Nano Banana Pro 图像生成提示词

#### 功能特性
- ✅ 5 个专业模板（头像、产品、信息图、社媒、游戏角色）
- ✅ 交互式引导生成
- ✅ 批量变体生成
- ✅ 历史记录管理
- ✅ 文件导出

#### 快速开始
```bash
cd tools/prompt-generator
python3 prompt_generator.py              # 交互模式
python3 prompt_generator.py --list       # 查看模板
python3 prompt_generator.py -c avatar -b 3  # 批量生成 3 个头像提示词
```

#### 相关文档
- **完整文档**: [[prompt-generator-readme]]
- **使用示例**: [[prompt-generator-examples]]
- **相关研究**: [[nano-banana-pro-prompts-analysis]]

#### 项目概述

Aura 是一个**最小可行产品**，旨在验证以下核心假设：

1. 本地 AI (Ollama) 可以满足日常知识管理需求
2. 个人知识库 + RAG 能显著提升创作效率
3. 本地优先 + 可选去中心化的架构是可行的
4. 用户愿意为数据主权接受一定的学习成本

#### 核心功能

| 模块 | 功能 | 技术 |
|-----|------|------|
| **笔记系统** | Markdown 编辑、标签管理、全文搜索 | Next.js + File System |
| **AI 助手** | 智能问答、笔记增强、写作辅助 | Ollama + Chroma |
| **发布系统** | 一键发布到 GitHub Pages | Static Site Generator |
| **同步系统** | Git 版本控制 + 可选 Solid Pod | Git + @inrupt/solid-client |

#### 文档

- **[[personal-ai-ecosystem-mvp-architecture]]** — 完整架构设计文档
- **[[aura-mvp-excalidraw]]** — 系统架构图 (Excalidraw)

#### 相关研究

- [[decentralized-ai-landscape]] — 技术选型参考
- [[solid-protocol-ai-integration]] — Solid Pod 集成方案
- [[personal-ai-ecosystem-2030-vision]] — 产品愿景

#### 开发路线图

```
Week 1-2: 基础笔记系统
  ✓ 项目脚手架
  ✓ Markdown 编辑器
  ✓ 文件系统存储
  ☐ 基础 CRUD

Week 3-4: AI 集成
  ☐ Ollama 集成
  ☐ Chroma 向量数据库
  ☐ RAG 检索
  ☐ AI 笔记增强

Week 5-6: 发布系统
  ☐ Markdown → HTML
  ☐ 静态站点生成
  ☐ GitHub Pages 部署

Week 7-8: 高级功能
  ☐ 全文搜索
  ☐ Solid Pod 同步
  ☐ 知识图谱
```

---

## 已完成项目

*(暂无)*

---

## 项目想法池

### 1. AI 驱动的数字花园自动化
- **描述**: 自动整理、关联、增强笔记内容
- **状态**: 概念阶段
- **依赖**: Aura MVP 完成

### 2. 去中心化内容创作者工具套件
- **描述**: 集成 Solid + IPFS + AI 的创作工具
- **状态**: 概念阶段
- **依赖**: Aura MVP 完成

### 3. 个人数据主权仪表盘
- **描述**: 可视化展示个人数据流向和权限
- **状态**: 概念阶段
- **依赖**: Solid 生态成熟

---

## 技术栈偏好

### 前端
- **框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS
- **组件**: shadcn/ui
- **编辑器**: TipTap / Milkdown

### 后端
- **运行时**: Node.js
- **框架**: Next.js API Routes (简单场景) / FastAPI (复杂场景)
- **数据库**: Chroma (向量) + 文件系统 (结构化)

### AI
- **本地**: Ollama (llama3.2, qwen2.5, phi4)
- **向量**: Chroma DB
- **远程**: Claude API (备用)

### 去中心化
- **数据**: Solid Protocol
- **存储**: IPFS (可选)
- **身份**: WebID / DID

---

## 贡献指南

如果你想参与这些项目：

1. 阅读相关研究文章，理解背景
2. 查看架构设计文档，了解技术选型
3. 从 "Good First Issue" 标签的任务开始
4. 提交 PR 前阅读代码规范

---

## 标签

#projects #mvp #aura #personal-ai #architecture #development #engineering

---

*最后更新: 2026-03-30*
