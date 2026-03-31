# Aura MVP 快速启动指南

> **从零到可运行的本地 AI 笔记系统，只需 10 分钟**

---

## 前置要求

- Node.js 18+ 
- Python 3.10+ (用于 Chroma)
- Git
- 8GB+ RAM (推荐 16GB)

---

## 1. 安装 Ollama (本地 AI)

### macOS / Linux
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### Windows
下载安装包: https://ollama.com/download/windows

### 验证安装
```bash
ollama --version
```

### 下载模型
```bash
# 轻量级模型 (3B, 适合大多数笔记本)
ollama pull llama3.2:3b

# 更强的模型 (8B, 需要 8GB+ VRAM 或 16GB+ RAM)
ollama pull llama3.2:8b

# 中文优化模型
ollama pull qwen2.5:7b
```

### 启动 Ollama 服务
```bash
ollama serve
```

测试 API:
```bash
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2:3b",
  "prompt": "Hello, how are you?",
  "stream": false
}'
```

---

## 2. 安装 Chroma (向量数据库)

```bash
# 创建虚拟环境
python3 -m venv ~/aura-venv
source ~/aura-venv/bin/activate  # Linux/macOS
# 或 ~/aura-venv\Scripts\activate  # Windows

# 安装 Chroma
pip install chromadb

# 启动 Chroma 服务
chroma run --path ~/chroma-data
```

服务将在 http://localhost:8000 运行

---

## 3. 创建 Next.js 项目

```bash
# 创建项目
npx create-next-app@latest aura-mvp \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd aura-mvp

# 安装依赖
npm install @milkdown/core @milkdown/preset-commonmark \
  @milkdown/theme-nord @milkdown/plugin-listener \
  chromadb axios

# 安装开发依赖
npm install -D @types/node
```

---

## 4. 项目结构

```
~/aura-mvp/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   │   ├── ai/
│   │   │   └── chat/route.ts
│   │   ├── notes/
│   │   │   └── route.ts
│   │   └── search/
│   │       └── route.ts
│   ├── page.tsx              # 主页面
│   ├── layout.tsx            # 根布局
│   └── globals.css           # 全局样式
├── components/               # React 组件
│   ├── Editor.tsx            # Markdown 编辑器
│   ├── AIChat.tsx            # AI 聊天面板
│   ├── NoteList.tsx          # 笔记列表
│   └── SearchBar.tsx         # 搜索栏
├── lib/                      # 工具函数
│   ├── ai.ts                 # AI 服务
│   ├── db.ts                 # 数据库操作
│   ├── storage.ts            # 文件存储
│   └── utils.ts              # 通用工具
├── services/                 # 业务逻辑
│   ├── noteService.ts        # 笔记服务
│   ├── aiService.ts          # AI 服务
│   └── vectorService.ts      # 向量服务
├── types/                    # TypeScript 类型
│   └── index.ts
├── public/                   # 静态资源
└── package.json
```

---

## 5. 基础配置

### 环境变量

创建 `.env.local`:
```env
# AI 服务
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:3b

# 向量数据库
CHROMA_URL=http://localhost:8000

# 数据存储
NOTES_PATH=~/aura-notes
```

### TypeScript 类型定义

创建 `types/index.ts`:
```typescript
export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  concepts: string[];
  createdAt: Date;
  updatedAt: Date;
  vectorId?: string;
}

export interface AIResponse {
  answer: string;
  sources?: Note[];
}

export interface SearchResult {
  note: Note;
  score: number;
}
```

---

## 6. 核心服务实现

### AI 服务 (`lib/ai.ts`)

```typescript
export class AIService {
  private ollamaUrl: string;
  private model: string;

  constructor() {
    this.ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
    this.model = process.env.OLLAMA_MODEL || 'llama3.2:3b';
  }

  async chat(message: string, context?: string[]): Promise<string> {
    const prompt = this.buildPrompt(message, context);
    
    const response = await fetch(`${this.ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        prompt,
        stream: false,
      }),
    });

    const data = await response.json();
    return data.response;
  }

  private buildPrompt(message: string, context?: string[]): string {
    let prompt = '';
    
    if (context && context.length > 0) {
      prompt += 'Context from my notes:\n';
      context.forEach((ctx, i) => {
        prompt += `[${i + 1}] ${ctx}\n`;
      });
      prompt += '\n';
    }
    
    prompt += `Question: ${message}\n\nAnswer:`;
    return prompt;
  }
}
```

### 向量服务 (`lib/vector.ts`)

```typescript
import { ChromaClient } from 'chromadb';

export class VectorService {
  private client: ChromaClient;
  private collection: any;

  constructor() {
    this.client = new ChromaClient({
      path: process.env.CHROMA_URL || 'http://localhost:8000',
    });
  }

  async init() {
    this.collection = await this.client.getOrCreateCollection({
      name: 'notes',
    });
  }

  async addNote(id: string, content: string, metadata: any) {
    // 简化版：实际应使用嵌入模型
    await this.collection.add({
      ids: [id],
      documents: [content],
      metadatas: [metadata],
    });
  }

  async search(query: string, topK: number = 5) {
    const results = await this.collection.query({
      queryTexts: [query],
      nResults: topK,
    });

    return results;
  }
}
```

### 笔记服务 (`lib/storage.ts`)

```typescript
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Note } from '@/types';

const NOTES_DIR = process.env.NOTES_PATH || '~/aura-notes/content';

export class StorageService {
  async createNote(title: string, content: string): Promise<Note> {
    const id = uuidv4();
    const now = new Date();
    
    const note: Note = {
      id,
      title,
      content,
      tags: [],
      concepts: [],
      createdAt: now,
      updatedAt: now,
    };

    // 保存 Markdown 文件
    const filePath = path.join(NOTES_DIR, `${id}.md`);
    const markdown = this.toMarkdown(note);
    
    await fs.mkdir(NOTES_DIR, { recursive: true });
    await fs.writeFile(filePath, markdown, 'utf-8');

    return note;
  }

  async getNote(id: string): Promise<Note | null> {
    try {
      const filePath = path.join(NOTES_DIR, `${id}.md`);
      const content = await fs.readFile(filePath, 'utf-8');
      return this.parseMarkdown(id, content);
    } catch {
      return null;
    }
  }

  async listNotes(): Promise<Note[]> {
    const files = await fs.readdir(NOTES_DIR);
    const notes: Note[] = [];

    for (const file of files) {
      if (file.endsWith('.md')) {
        const id = file.replace('.md', '');
        const note = await this.getNote(id);
        if (note) notes.push(note);
      }
    }

    return notes.sort((a, b) => 
      b.updatedAt.getTime() - a.updatedAt.getTime()
    );
  }

  private toMarkdown(note: Note): string {
    return `---
id: ${note.id}
title: ${note.title}
tags: ${note.tags.join(', ')}
createdAt: ${note.createdAt.toISOString()}
updatedAt: ${note.updatedAt.toISOString()}
---

${note.content}
`;
  }

  private parseMarkdown(id: string, content: string): Note {
    // 简化解析：实际应使用 frontmatter 库
    const lines = content.split('\n');
    const title = lines.find(l => l.startsWith('title:'))?.replace('title: ', '') || 'Untitled';
    
    return {
      id,
      title,
      content: content.split('---\n').pop() || '',
      tags: [],
      concepts: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
```

---

## 7. API 路由

### AI 聊天 API (`app/api/ai/chat/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { AIService } from '@/lib/ai';
import { VectorService } from '@/lib/vector';

export async function POST(req: NextRequest) {
  try {
    const { message, useKnowledgeBase = true } = await req.json();
    
    let context: string[] = [];
    
    if (useKnowledgeBase) {
      const vector = new VectorService();
      await vector.init();
      const results = await vector.search(message, 3);
      context = results.documents[0] || [];
    }
    
    const ai = new AIService();
    const answer = await ai.chat(message, context);
    
    return NextResponse.json({ answer, context });
    
  } catch (error) {
    console.error('AI Error:', error);
    return NextResponse.json(
      { error: 'AI service unavailable' },
      { status: 500 }
    );
  }
}
```

---

## 8. 前端组件

### 简化版主页面 (`app/page.tsx`)

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Note } from '@/types';

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatResponse, setChatResponse] = useState('');

  // 加载笔记列表
  useEffect(() => {
    fetch('/api/notes')
      .then(r => r.json())
      .then(setNotes);
  }, []);

  // AI 聊天
  const handleChat = async () => {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message: chatMessage }),
    });
    const data = await res.json();
    setChatResponse(data.answer);
  };

  return (
    <div className="flex h-screen">
      {/* 侧边栏 */}
      <aside className="w-64 bg-gray-100 p-4">
        <h1 className="text-xl font-bold mb-4">Aura MVP</h1>
        <button className="w-full bg-blue-500 text-white p-2 rounded mb-4">
          + 新建笔记
        </button>
        <div className="space-y-2">
          {notes.map(note => (
            <div
              key={note.id}
              className="p-2 hover:bg-gray-200 cursor-pointer rounded"
              onClick={() => setSelectedNote(note)}
            >
              {note.title}
            </div>
          ))}
        </div>
      </aside>

      {/* 主内容 */}
      <main className="flex-1 p-4">
        {selectedNote ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">{selectedNote.title}</h2>
            <pre className="whitespace-pre-wrap">{selectedNote.content}</pre>
          </div>
        ) : (
          <div className="text-gray-500">选择一个笔记或创建新笔记</div>
        )}
      </main>

      {/* AI 侧边栏 */}
      <aside className="w-80 bg-gray-50 p-4 border-l">
        <h2 className="font-bold mb-4">🤖 AI 助手</h2>
        <textarea
          className="w-full p-2 border rounded mb-2"
          rows={3}
          value={chatMessage}
          onChange={e => setChatMessage(e.target.value)}
          placeholder="问任何问题..."
        />
        <button
          onClick={handleChat}
          className="w-full bg-green-500 text-white p-2 rounded"
        >
          发送
        </button>
        {chatResponse && (
          <div className="mt-4 p-3 bg-white rounded shadow">
            {chatResponse}
          </div>
        )}
      </aside>
    </div>
  );
}
```

---

## 9. 运行项目

### 启动所有服务

```bash
# 终端 1: Ollama
ollama serve

# 终端 2: Chroma
chroma run --path ~/chroma-data

# 终端 3: Next.js
cd ~/aura-mvp
npm run dev
```

### 访问应用

打开浏览器: http://localhost:3000

---

## 10. 下一步

现在你有了一个基础框架：

1. **完善编辑器**: 集成 Milkdown 或 TipTap
2. **增强 AI**: 实现 RAG 完整流程
3. **添加发布**: 实现 GitHub Pages 部署
4. **美化界面**: 使用 shadcn/ui 组件

查看完整架构设计: **[[personal-ai-ecosystem-mvp-architecture]]**

---

## 故障排除

### Ollama 无法连接
```bash
# 检查服务状态
curl http://localhost:11434/api/tags

# 如果失败，手动启动
OLLAMA_HOST=0.0.0.0:11434 ollama serve
```

### Chroma 连接失败
```bash
# 检查端口占用
lsof -i :8000

# 使用不同端口
chroma run --path ~/chroma-data --port 8001
```

### 内存不足
```bash
# 使用更小的模型
ollama pull llama3.2:1b  # 1B 参数模型
```

---

**恭喜！你已经启动了 Aura MVP 的基础架构。**
