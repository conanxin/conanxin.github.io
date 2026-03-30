# 个人 AI 生态系统 MVP 架构设计

> **项目代号**: Aura MVP  
> **版本**: v0.1  
> **目标**: 构建最小可行产品，验证核心假设  
> **时间**: 6-8 周开发周期

---

## 1. 项目愿景与目标

### 1.1 核心问题

当前数字生活的痛点：
- ❌ 笔记分散在多个平台（Notion/Obsidian/备忘录）
- ❌ AI 助手无法访问个人知识库
- ❌ 内容创作流程割裂（写作→发布→推广）
- ❌ 数据被平台锁定

### 1.2 MVP 目标

构建一个**本地优先、AI 增强、逐步去中心化**的个人知识管理与创作系统：

```
用户场景 MVP:
┌─────────────────────────────────────────────────────────┐
│ 1. 用 Markdown 写笔记                                    │
│ 2. AI 自动关联历史内容、生成标签、提取概念               │
│ 3. 一键发布到个人网站 + IPFS                            │
│ 4. 所有数据本地存储，可选择性同步到 Solid Pod           │
└─────────────────────────────────────────────────────────┘
```

### 1.3 成功标准

| 指标 | 目标值 |
|-----|-------|
| **功能** | 笔记+AI+发布三合一 |
| **性能** | AI 响应 < 3秒（本地） |
| **易用性** | 新用户 5 分钟上手 |
| **数据主权** | 完全本地存储，可选同步 |

---

## 2. 系统架构设计

### 2.1 整体架构

```
┌─────────────────────────────────────────────────────────────────┐
│                        Aura MVP Architecture                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    用户界面层 (Frontend)                    │  │
│  │  ┌────────────┐ ┌────────────┐ ┌──────────────────────┐  │  │
│  │  │  编辑器    │ │  AI 聊天   │ │  发布管理面板        │  │  │
│  │  │ (Markdown)│ │  (对话)    │ │  (Git/IPFS/Solid)   │  │  │
│  │  └────────────┘ └────────────┘ └──────────────────────┘  │  │
│  │                   Next.js + Tailwind                      │  │
│  └───────────────────────────┬───────────────────────────────┘  │
│                              │                                   │
│  ┌───────────────────────────▼───────────────────────────────┐  │
│  │                   应用服务层 (Backend)                      │  │
│  │  ┌────────────┐ ┌────────────┐ ┌──────────────────────┐  │  │
│  │  │ 笔记服务   │ │ AI 编排    │ │ 发布服务           │  │  │
│  │  │ CRUD      │ │ 路由决策   │ │ Git/IPFS/Solid     │  │  │
│  │  └────────────┘ └────────────┘ └──────────────────────┘  │  │
│  │              FastAPI / Node.js (可选)                      │  │
│  └───────────────────────────┬───────────────────────────────┘  │
│                              │                                   │
│  ┌───────────────────────────▼───────────────────────────────┐  │
│  │                   AI 能力层 (AI Layer)                      │  │
│  │  ┌────────────┐ ┌────────────┐ ┌──────────────────────┐  │  │
│  │  │ 本地模型   │ │ 向量检索   │ │ API 路由           │  │  │
│  │  │ Ollama    │ │ Chroma    │ │ 本地/远程切换      │  │  │
│  │  └────────────┘ └────────────┘ └──────────────────────┘  │  │
│  └───────────────────────────┬───────────────────────────────┘  │
│                              │                                   │
│  ┌───────────────────────────▼───────────────────────────────┐  │
│  │                   数据层 (Data Layer)                       │  │
│  │  ┌────────────┐ ┌────────────┐ ┌──────────────────────┐  │  │
│  │  │ 本地存储   │ │ 向量数据库 │ │ 可选外部存储       │  │  │
│  │  │ Markdown  │ │ Chroma    │ │ Solid/Git/IPFS     │  │  │
│  │  └────────────┘ └────────────┘ └──────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 技术栈选型

| 层次 | 技术 | 理由 | 备选 |
|-----|------|------|------|
| **Frontend** | Next.js 14 + Tailwind | React 生态成熟，SSG 支持 | Remix, Astro |
| **Backend** | Next.js API Routes | 减少复杂度，前后端一体 | FastAPI, Express |
| **AI 本地** | Ollama | 部署简单，模型丰富 | llama.cpp, LocalAI |
| **向量 DB** | Chroma | 本地优先，易集成 | Weaviate, Qdrant |
| **存储** | 文件系统 + Git | 简单可靠，版本控制 | SQLite |
| **部署** | 静态导出 + GitHub Pages | 免费，CDN | Vercel, Netlify |

---

## 3. 核心模块设计

### 3.1 模块 1: 笔记系统 (Note System)

#### 功能
- Markdown 编辑器（支持实时预览）
- 文件夹/标签管理
- 全文搜索
- 版本历史（Git 集成）

#### 数据结构

```typescript
// types/note.ts
interface Note {
  id: string;                    // UUID
  title: string;
  content: string;               // Markdown
  tags: string[];
  concepts: string[];            // AI 提取的概念
  createdAt: Date;
  updatedAt: Date;
  vectorId?: string;             // Chroma 向量 ID
  metadata: {
    wordCount: number;
    readingTime: number;
    aiGenerated: boolean;
    source?: string;
  };
}

interface NoteFolder {
  id: string;
  name: string;
  parentId?: string;
  path: string;                  // 文件系统路径
}
```

#### 存储方案

```
~/aura-notes/
├── content/
│   ├── articles/               # 文章
│   ├── notes/                  # 笔记
│   ├── journal/                # 日记
│   └── projects/               # 项目
├── metadata/
│   ├── notes.json              # 笔记元数据索引
│   ├── tags.json               # 标签系统
│   └── concepts.json           # 知识图谱
├── vectors/
│   └── chroma/                 # 向量数据库
└── config/
    └── settings.json           # 用户配置
```

---

### 3.2 模块 2: AI 助手系统 (AI Assistant)

#### 功能
- 智能问答（基于个人知识库）
- 笔记增强（标签生成、概念提取、摘要）
- 写作辅助（续写、润色、翻译）
- 知识关联（"这篇笔记与 X 相关"）

#### 架构设计

```
用户输入
    │
    ▼
┌─────────────────────────────────────┐
│        AI 路由决策器                │
│  (本地模型 vs API 的智能选择)        │
└─────────────────────────────────────┘
    │
    ├─ 简单查询 ───► 本地模型 (3B)
    │                 • 快速 (<500ms)
    │                 • 离线可用
    │
    ├─ 知识查询 ───► RAG + 本地模型
    │                 • 检索个人笔记
    │                 • 生成回答
    │
    └─ 复杂任务 ───► 远程 API (Claude/GPT)
                      • 高质量输出
                      • 按需付费
```

#### AI 服务接口

```typescript
// services/ai.ts
interface AIService {
  // 基础对话
  chat(message: string, context?: Note[]): Promise<string>;
  
  // 笔记增强
  enhanceNote(note: Note): Promise<{
    tags: string[];
    concepts: string[];
    summary: string;
    relatedNotes: string[];
  }>;
  
  // 知识检索
  queryKnowledge(query: string): Promise<{
    answer: string;
    sources: Note[];
  }>;
  
  // 写作辅助
  writeAssist(prompt: string, style?: string): Promise<string>;
}

// 本地 AI 实现 (Ollama)
class LocalAIService implements AIService {
  private ollamaUrl = 'http://localhost:11434';
  private model = 'llama3.2:3b';
  
  async chat(message: string, context?: Note[]): Promise<string> {
    const response = await fetch(`${this.ollamaUrl}/api/generate`, {
      method: 'POST',
      body: JSON.stringify({
        model: this.model,
        prompt: this.buildPrompt(message, context),
        stream: false
      })
    });
    return (await response.json()).response;
  }
  
  // ... 其他方法
}
```

#### RAG 流程

```python
# services/rag.py
class RAGService:
    def __init__(self):
        self.chroma = chromadb.PersistentClient(path="./vectors")
        self.collection = self.chroma.get_or_create_collection("notes")
    
    async def query(self, query: str, top_k: int = 5):
        # 1. 向量化查询
        query_embedding = await self.embed(query)
        
        # 2. 检索相关笔记
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k
        )
        
        # 3. 构建上下文
        context = self.build_context(results)
        
        # 4. 生成回答
        answer = await self.llm.generate(
            prompt=query,
            context=context
        )
        
        return {
            "answer": answer,
            "sources": results['documents']
        }
```

---

### 3.3 模块 3: 发布系统 (Publishing)

#### 功能
- Markdown → HTML 转换
- 静态站点生成
- Git 提交与推送
- 可选：IPFS 上传、Solid Pod 同步

#### 发布流程

```
用户点击"发布"
    │
    ▼
┌─────────────────────────────────────┐
│ 1. Markdown 预处理                   │
│    • 解析 frontmatter               │
│    • 提取元数据                     │
│    • 处理内部链接                   │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ 2. HTML 生成                         │
│    • 应用模板                       │
│    • 代码高亮                       │
│    • 生成目录                       │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ 3. 多平台发布                        │
│    • Git 提交 → 触发部署            │
│    • 可选：IPFS 上传                │
│    • 可选：Solid Pod 同步           │
└─────────────────────────────────────┘
    │
    ▼
发布完成，返回链接
```

#### 模板系统

```typescript
// templates/post.ts
interface PostTemplate {
  layout: 'article' | 'note' | 'project';
  components: {
    header: boolean;
    toc: boolean;
    related: boolean;
    comments: boolean;
  };
  styles: {
    theme: 'light' | 'dark' | 'auto';
    typography: 'serif' | 'sans';
  };
}

// 默认文章模板
const defaultArticleTemplate: PostTemplate = {
  layout: 'article',
  components: {
    header: true,
    toc: true,
    related: true,
    comments: false
  },
  styles: {
    theme: 'auto',
    typography: 'sans'
  }
};
```

---

### 3.4 模块 4: 同步与备份 (Sync)

#### 功能
- Git 版本控制
- 可选 Solid Pod 同步
- 导出/导入

#### 同步策略

```
本地 (主)
    │
    ├─ 自动 ───► Git 仓库 (备份)
    │             • 每次保存提交
    │             • 每日推送远程
    │
    ├─ 手动 ───► Solid Pod (选择性同步)
    │             • 用户选择笔记
    │             • ACL 权限控制
    │
    └─ 手动 ───► 导出文件
                  • Markdown ZIP
                  • JSON 完整备份
```

---

## 4. 数据流设计

### 4.1 笔记创建流程

```
用户创建笔记
    │
    ▼
┌─────────────────────────────────────┐
│ 1. 保存到文件系统                    │
│    • Markdown 文件                  │
│    • 路径：~/aura-notes/content/    │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ 2. 更新元数据索引                    │
│    • 添加 notes.json                │
│    • 提取 tags                      │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ 3. AI 增强 (异步)                    │
│    • 生成向量嵌入                   │
│    • 存入 Chroma                    │
│    • 提取概念、标签                 │
│    • 更新元数据                     │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ 4. Git 自动提交                      │
│    • commit: "Add: [note-title]"    │
└─────────────────────────────────────┘
```

### 4.2 AI 查询流程

```
用户提问
    │
    ▼
┌─────────────────────────────────────┐
│ 1. 查询分类                          │
│    • 本地知识查询？                 │
│    • 一般知识？                     │
│    • 创作任务？                     │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ 2. 如果是知识查询：                  │
│    • 向量检索相关笔记               │
│    • 构建上下文                     │
│    • 本地 LLM 生成回答              │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ 3. 返回答案                          │
│    • 显示回答                       │
│    • 标注来源笔记                   │
└─────────────────────────────────────┘
```

---

## 5. API 设计

### 5.1 RESTful API

```typescript
// API 路由定义

// 笔记管理
GET    /api/notes              // 获取笔记列表
POST   /api/notes              // 创建笔记
GET    /api/notes/:id          // 获取单篇笔记
PUT    /api/notes/:id          // 更新笔记
DELETE /api/notes/:id          // 删除笔记

// AI 功能
POST   /api/ai/chat            // AI 对话
POST   /api/ai/enhance         // 增强笔记
POST   /api/ai/query           // 知识查询

// 搜索
GET    /api/search?q=keyword   // 全文搜索
GET    /api/related/:id        // 相关笔记

// 发布
POST   /api/publish/:id        // 发布笔记
GET    /api/publish/status     // 发布状态

// 配置
GET    /api/config             // 获取配置
PUT    /api/config             // 更新配置
```

### 5.2 关键 API 实现示例

```typescript
// app/api/ai/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { LocalAIService } from '@/services/ai';
import { RAGService } from '@/services/rag';

export async function POST(req: NextRequest) {
  try {
    const { message, useKnowledgeBase = true } = await req.json();
    
    let context;
    if (useKnowledgeBase) {
      // RAG 检索相关笔记
      const rag = new RAGService();
      const results = await rag.query(message);
      context = results.sources;
    }
    
    // 调用 AI 生成回答
    const ai = new LocalAIService();
    const response = await ai.chat(message, context);
    
    return NextResponse.json({
      answer: response,
      sources: context?.map(n => ({ id: n.id, title: n.title }))
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'AI service unavailable' },
      { status: 500 }
    );
  }
}
```

---

## 6. 用户界面设计

### 6.1 界面布局

```
┌─────────────────────────────────────────────────────────┐
│  Logo    搜索...              设置  发布  +新建          │  ← Header
├────────┬────────────────────────────────────────────────┤
│        │                                                │
│ 📁     │  # 笔记标题                                    │
│ 文件夹  │                                                │
│        │  标签: #ai #solid                              │
│ 📄     │                                                │
│ 全部   │  ┌──────────────────┐  ┌──────────────────┐   │
│        │  │                  │  │                  │   │
│ 📄     │  │   Markdown       │  │   预览           │   │  ← Editor
│ 文章   │  │   编辑器         │  │   Preview        │   │
│        │  │                  │  │                  │   │
│ 📄     │  └──────────────────┘  └──────────────────┘   │
│ 项目   │                                                │
│        │  🤖 AI 助手                                    │
│ 📄     │  ┌──────────────────────────────────────────┐ │
│ 标签   │  │ 用户: 这篇笔记与什么相关？               │ │  ← AI Chat
│        │  │ AI: 与 3 篇笔记相关...                   │ │
│        │  └──────────────────────────────────────────┘ │
└────────┴────────────────────────────────────────────────┘
```

### 6.2 关键交互

| 操作 | 快捷键 | 功能 |
|-----|-------|------|
| 新建笔记 | Cmd/Ctrl + N | 创建空白笔记 |
| 搜索 | Cmd/Ctrl + K | 打开全局搜索 |
| AI 对话 | Cmd/Ctrl + / | 打开 AI 侧边栏 |
| 保存 | Cmd/Ctrl + S | 保存当前笔记 |
| 发布 | Cmd/Ctrl + P | 发布当前笔记 |

---

## 7. 部署架构

### 7.1 本地开发

```bash
# 1. 克隆仓库
git clone https://github.com/yourname/aura-mvp.git
cd aura-mvp

# 2. 安装依赖
npm install

# 3. 启动 Ollama（本地 AI）
ollama pull llama3.2:3b
ollama serve

# 4. 启动开发服务器
npm run dev

# 5. 访问
open http://localhost:3000
```

### 7.2 生产部署

```
构建流程:

1. 静态构建
   next build
   └── out/ (静态文件)

2. GitHub Pages 部署
   git push origin main
   └── 自动部署到 https://yourname.github.io/aura

3. 数据存储
   ~/aura-notes/ (本地文件系统)
   └── 用户负责备份
```

### 7.3 可选：Solid Pod 集成

```typescript
// 当用户启用 Solid 同步时

import { solidClient } from '@inrupt/solid-client';

async function syncToSolid(note: Note, podUrl: string) {
  const dataset = await solidClient.getSolidDataset(podUrl);
  
  // 创建笔记 Thing
  const noteThing = solidClient.buildThing()
    .addStringNoLocale('http://schema.org/text', note.content)
    .addStringNoLocale('http://schema.org/name', note.title)
    .addDatetime('http://schema.org/dateModified', note.updatedAt)
    .build();
  
  // 保存到 Pod
  const updatedDataset = solidClient.setThing(dataset, noteThing);
  await solidClient.saveSolidDatasetAt(podUrl, updatedDataset);
}
```

---

## 8. 开发路线图

### Phase 1: 基础笔记系统 (Week 1-2)

- [ ] 项目脚手架搭建
- [ ] Markdown 编辑器（基于 TipTap / Milkdown）
- [ ] 文件系统存储
- [ ] 基础 CRUD 操作
- [ ] 文件夹管理

**里程碑**: 可以创建、编辑、删除笔记

### Phase 2: AI 集成 (Week 3-4)

- [ ] Ollama 集成
- [ ] 本地模型对话
- [ ] Chroma 向量数据库
- [ ] 笔记向量化和检索
- [ ] AI 笔记增强（标签、摘要）

**里程碑**: AI 可以基于笔记回答问题

### Phase 3: 发布系统 (Week 5-6)

- [ ] Markdown → HTML 转换
- [ ] 静态站点生成
- [ ] Git 集成
- [ ] GitHub Pages 部署
- [ ] 主题系统

**里程碑**: 一键发布到个人网站

### Phase 4: 高级功能 (Week 7-8)

- [ ] 全文搜索
- [ ] 知识图谱可视化
- [ ] Solid Pod 同步（可选）
- [ ] 多设备同步
- [ ] 插件系统基础

**里程碑**: 完整的个人知识管理系统

---

## 9. 风险与缓解

| 风险 | 可能性 | 影响 | 缓解策略 |
|-----|-------|------|---------|
| 本地 AI 性能不足 | 中 | 高 | 智能路由到云端 API |
| 数据丢失 | 低 | 高 | Git 自动备份 + 导出功能 |
| 学习曲线陡峭 | 中 | 中 | 详细文档 + 引导教程 |
| 依赖技术不成熟 | 低 | 中 | 使用稳定版本，预留迁移接口 |

---

## 10. 与已有研究的整合

这个 MVP 架构整合了之前所有的研究：

| 已有研究 | 在 MVP 中的应用 |
|---------|--------------|
| **Solid Protocol** | 可选的 Pod 同步模块 |
| **Fetch.ai** | 未来扩展为 AI 代理架构 |
| **Ollama/本地 AI** | AI 能力层核心 |
| **Chroma** | 向量数据库选型 |
| **去中心化 AI 全景图** | 架构设计参考 |
| **2030 愿景** | 产品方向指引 |

---

## 11. 下一步行动

### 立即可开始

1. **搭建项目脚手架**
   ```bash
   npx create-next-app@latest aura-mvp --typescript --tailwind
   cd aura-mvp
   npm install @milkdown/core @milkdown/preset-commonmark
   ```

2. **安装 Ollama**
   ```bash
   curl -fsSL https://ollama.com/install.sh | sh
   ollama pull llama3.2:3b
   ```

3. **初始化 Chroma**
   ```bash
   pip install chromadb
   ```

### 我可以帮你

1. **创建项目代码框架** (Next.js + Ollama + Chroma)
2. **实现 Markdown 编辑器组件**
3. **实现 AI 聊天接口**
4. **实现笔记存储系统**
5. **创建部署脚本**

---

## 标签

#mvp #architecture #personal-ai #nextjs #ollama #chroma #solid-protocol #local-first #knowledge-management #system-design
