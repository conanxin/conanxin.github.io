# SHUGE Digital Humanities Exhibition — v0.1 设计规范

**Project**: SHUGE-RESEARCH-DB → 公开展示
**Version**: v0.1
**Generated**: 2026-09-28
**Author**: Xin Conan
**Status**: DESIGN FREEZE for v0.1 prototype

---

## 1. 定位 (Positioning)

**不是**：后台管理系统、数据库浏览器、AI 聊天框、研究写作 IDE。
**是**：数字人文展览 (Digital Humanities Exhibition)。
- 受众：人文学者、古籍爱好者、博物馆/图书馆从业者、数字人文研究者
- 场所：**线上数字展厅** — 类似博物馆官网 + 大学学术展厅，而不是 SaaS 控制台
- 角色：把已经完成的研究产出（OCR 语料、专题集合、引文证据、研究工作区）按博物馆展柜逻辑展示出来
- 设计语言：**数字博物馆 × 学术实验室**

---

## 2. 设计原则 (Design Principles)

| 原则 | 含义 | 实施方式 |
|---|---|---|
| **正典 (canonical)** | 展示已成型的研究产出 | 数据来自 P5-D 终态快照 (collection_definitions / snapshots / research_runs) |
| **可追溯 (traceable)** | 每个展示都可指向来源 | 每条引文带 citation_id、每个数字带 snapshot_id |
| **节制 (restrained)** | 不炫技、不喧宾夺主 | 无渐变、无霓虹、无 emoji 装饰 |
| **可读 (legible)** | 文字优先、图表辅助 | 主体是中文衬线 + 英文学术衬线 |
| **稳定 (stable)** | 内容来自 DB 终态快照,不会突变 | JSON 数据由 `scripts/build_exhibition_data.py` 重新生成 |

---

## 3. 信息架构 (Information Architecture)

```
┌─ /             Project Overview       ─ 展厅入口 + 项目总览
├─ /collections/ 专题展览 (Collections)  ─ 两个专题集合的展柜
├─ /evidence/    Citation Explorer      ─ 引文证据的检索与展开
└─ /research/    Research Workspace     ─ 跨集合的研究工作区
```

### 3.1 顶层导航

```
书格数字人文研究站           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
─────────────────────────────────────────────────────────────────────
   首页  │  专题  │  引文  │  研究          v0.1 · P5-D frozen
```

- 4 个一级页面，无下拉菜单，无 mega-menu
- 字体：思源宋体 (Noto Serif CJK SC) + Source Serif 4
- 没有 JS 驱动的多级菜单
- 当前页用底部细黑线 (1px solid #1a1a1a) 标记

### 3.2 页面层级

每页统一结构：
1. **页眉 (masthead)** — 项目名 + 副标题 + 时间戳
2. **顶导 (top nav)** — 4 个一级页 + 版本
3. **Hero / 摘要** — 1-2 段导语 + 关键数字
4. **主体 (body)** — 卡片 / 表格 / 引文区
5. **页脚 (footer)** — 项目出处 / GitHub / Notion / DB 终态

---

## 4. 视觉方案 (Visual Scheme)

### 4.1 调色板 (Color Palette)

| 名称 | HEX | 用途 |
|---|---|---|
| `ink-black`        | `#1a1a1a` | 主体文字、标题 |
| `ink-charcoal`     | `#2d2a26` | 副标题、强调 |
| `paper-white`      | `#f7f3eb` | 主背景 (宣纸暖白) |
| `paper-cream`      | `#efe9da` | 卡片背景 |
| `archival-brown`   | `#6b5944` | 元数据、辅助文字 |
| `seal-red`         | `#8b3a2e` | 重点强调（节制使用） |
| `rule-gray`        | `#c8bfa9` | 分隔线 |
| `muted-gray`       | `#8a8478` | 标签、状态文字 |
| `verified-blue`    | `#2a4a6a` | verified 引文状态 |
| `warning-amber`    | `#a87f3a` | abstention / insufficient 提示 |

**禁用色**：纯黑 `#000000`、荧光色 (`#00ff00`, `#ff00ff`)、霓虹蓝紫。

### 4.2 字体 (Typography)

```css
/* 中文衬线 (用于古籍相关正文) */
font-family: 'Noto Serif CJK SC', 'Source Han Serif SC', '宋体', serif;

/* 拉丁衬线 (用于英文 / 数字) */
font-family: 'Source Serif 4', 'Source Serif Pro', Georgia, serif;

/* 等宽 (用于 citation_id / snapshot_id) */
font-family: 'IBM Plex Mono', 'JetBrains Mono', Consolas, monospace;

/* 标签 / 元数据 (无衬线,使用节制) */
font-family: 'Source Sans 3', system-ui, -apple-system, sans-serif;
```

**字号层级**：
| 用途 | 字号 | 颜色 |
|---|---|---|
| H1 (页名)          | 2.4rem / 38px | ink-black |
| H2 (节标题)        | 1.6rem / 26px | ink-charcoal |
| H3 (小节)          | 1.2rem / 19px | ink-charcoal |
| 正文               | 1.05rem / 17px | ink-black |
| 引文区             | 0.95rem / 15px | ink-black |
| 元数据 / 标签      | 0.78rem / 12px | muted-gray |
| Citation ID / snapshot_id | 0.82rem / 13px (等宽) | archival-brown |

### 4.3 布局 (Layout)

- **主容器宽度**：max-width 760px (页面正文) + 240px (侧栏可选)
- **栏间距**：2rem
- **段落间距**：1.2rem line-height 1.7
- **卡片间距**：1.5rem
- **页边距**：桌面 4rem，移动 1.5rem
- **栅格**：单栏为主 (collections 与 evidence 页可考虑 2 栏卡片网格)

### 4.4 边框 / 分隔 (Borders)

- 主分隔线：`1px solid #c8bfa9`
- 卡片边框：`1px solid #d8d2c4`，无圆角（或 2px 极小圆角）
- 引文区背景：`#efe9da` + `1px solid #c8bfa9` 左边框 4px
- 无 box-shadow 浮起效果；卡片用边框分隔，不用阴影
- 无渐变背景

### 4.5 装饰元素 (Ornamentation)

- 古籍 **句读点 `·`**（中点）用于章节装饰，可放在 H1 之后
- 古籍 **书名号 `《》`** 紧贴书名（无空格）
- 引文用 **「」** 中文引号
- 段首可用 **圈点 `、`** 作为隐含列表符号
- **不使用 emoji** 作为功能按钮的图标

---

## 5. 页面结构 (Page Structure)

### 5.1 `/` — Project Overview

```
┌─ masthead ─────────────────────────────────────────────┐
│ 书格数字人文研究站                                       │
│ A Digital Humanities Exhibition of the SHUGE Research   │
│ Database                                              │
├─ top nav ──────────────────────────────────────────────┤
│ 首页 · 专题 · 引文 · 研究              v0.1 · P5-D     │
├─ hero ─────────────────────────────────────────────────┤
│ 展厅导语                                                │
│  本展厅基于 SHUGE-RESEARCH-DB 的 P5-D 终态,              │
│  呈现已完成的古籍 OCR 语料、专题研究集合、                │
│  引文证据与研究工作区。                                  │
│                                                         │
│  4 个数字徽章: works=756 · pages=3553 ·                 │
│                collections=2 · research_runs=234        │
├─ section: 展厅章节 ─────────────────────────────────────┤
│ 1. Corpus      — 三部 JDA 核心语料                      │
│ 2. Collections — 两大专题研究集合                        │
│ 3. Evidence    — 234 个研究问答 + 378 条引文            │
│ 4. Workspace   — 3 个跨集合研究工作区                   │
├─ section: 精选作品 (9 个 featured works 卡片) ──────────┤
│  水经注 · 工程做法 · 河防一览 · 天工开物 ·              │
│  园冶 · 梦粱录 · 自警编 · 祭侄文稿 · 长短经             │
├─ footer ────────────────────────────────────────────────┤
└─────────────────────────────────────────────────────────┘
```

### 5.2 `/collections/` — 专题展览

```
section: 展厅导语
  - 展厅名为"专题集合展柜"
  - 2 个集合卡片:
    Card 1: historical-hydrology (历史水利与河防)
      - description
      - seeds: 水经注 + 河防一览
      - include_terms: 19 terms
      - 快照链 (snap-1-v1-…-eb0f0cf4 等 6 条)
      - membership_count + scope 分布图
      - 跳转: → /evidence/?collection=historical-hydrology
    Card 2: architecture-construction (建筑营造与工程做法)
      - description
      - seeds: 工程做法 + 园冶
      - include_terms: 28 terms
      - 快照链
      - membership_count
      - 跳转: → /evidence/?collection=architecture-construction

section: 治理证据
  - collection_definitions 表 (rules_json)
  - 重建证据 (snapshot diff)
  - 审计链 (collection_membership_audit)
```

### 5.3 `/evidence/` — Citation Explorer

```
section: 引文检索
  - 顶栏过滤器:
    [All Collections v]   [All Status v]   [search box]
  - 列表区 (BRIEF_READY + INSUFFICIENT_EVIDENCE):
    Each row:
      题目 + 状态徽章 + 集合徽章 + 创作时间
      ↓ click to expand ↓
      证据卡:
        - 文本摘要
        - 引文 IDs (等宽字体,逗号分隔)
        - 文档单位
        - 类型 (DIRECT_OBSERVATION / CROSS_SOURCE_PATTERN / UNCERTAINTY)

section: 引文统计
  - 378 条 claims
  - DIRECT_OBSERVATION: X
  - CROSS_SOURCE_PATTERN: X
  - UNCERTAINTY: X
```

### 5.4 `/research/` — Research Workspace

```
section: 工作区导语
  - 3 个 workspace 卡片:
    1. 水经注河水分布研究
       - question
       - collections: historical-hydrology
       - status: OPEN
       - workspace_runs: N
       - 跳转: → /evidence/?workspace=1
    2. 工程做法柱径标准
       - question
       - collections: architecture-construction
       - status: OPEN
    3. 营造与水利交叉
       - question
       - collections: historical-hydrology + architecture-construction
       - status: OPEN

section: QA 样本 (20 个 P5-D queries)
  - 12 negative controls (all abstained correctly)
  - 4 OK positive queries
  - 4 corpus-bound abstention

section: 治理指标
  - verified_false_total: 2 (朝天門 — 梦粱录,不在任何 collection 内)
  - out_of_collection_leakage: 0
  - unsupported_claims: 0
```

---

## 6. 互动方式 (Interaction)

### 6.1 主动元素 (Minimal)

- 4 页之间用 `<a href>` 跳转
- Evidence 页：accordion 展开 claim 详情（纯 CSS `:target` 或极小 JS）
- Research 页：workspace 卡 click 跳转 evidence
- 过滤：CSS-only radio button filter (small JS for state persistence)

### 6.2 静态原则 (Static-first)

- 所有数据 baked-in 到 JSON 文件，由 DB 重新生成
- 页面初次加载即可完全显示
- 无后端 API，无客户端 fetch，无 WebSocket
- 无 cookie / localStorage / tracking

### 6.3 无障碍 (Accessibility)

- 颜色对比 ≥ 4.5:1
- 键盘可达 (Tab 顺序自然)
- `lang="zh-Hans"`
- aria-label on icon-only buttons (若有)

---

## 7. 资源 (Assets)

| 资源 | 来源 | 用途 |
|---|---|---|
| `data/manifest.json`     | DB 导出 | 全站数字徽章 |
| `data/works.json`        | DB 导出 | 9 个 featured works |
| `data/collections.json`  | DB 导出 | 2 个集合 + defs + snapshots |
| `data/citations.json`    | DB 导出 | 23 个 research_runs + claims |
| `data/institutions.json` | DB 导出 | 30 个保藏机构 |
| `data/workspaces.json`   | DB 导出 | 3 个 workspace + QA 样本 |

字体：Google Fonts (Noto Serif CJK SC + Source Serif 4 + IBM Plex Mono)
- 或 fallback 到系统字体

CSS / JS：无外部框架，纯手写 (~10 KB total)

---

## 8. 范围与限制 (Scope & Constraints)

**v0.1 prototype 范围**：
- ✅ 4 个静态 HTML 页面
- ✅ Read-only JSON 数据 baked-in
- ✅ 桌面优先 (1280px / 768px 响应式)
- ✅ 中文 (zh-Hans) + 英文混合

**v0.1 不做**：
- ❌ 用户登录 / 收藏 / 评论
- ❌ 实时搜索 (后端)
- ❌ PDF / DOCX 导出
- ❌ 多语言切换
- ❌ 暗色模式
- ❌ 移动端原生 APP
- ❌ 后台管理

**后续版本可能加入**：
- WebSocket 实时研究通知
- 全文搜索 (FTS5)
- 主题切换 (light/dark)
- 中英文双语切换
- 引文 PDF 导出

---

## 9. 验收 (Acceptance)

| 项 | 标准 |
|---|---|
| 4 个页面可达 | 任意页面 → 其他 3 页 ≤ 2 click |
| 字体加载 | 思源宋体 + Source Serif + IBM Plex Mono 全部 fallback OK |
| 数据完整 | 9 featured works + 2 collections + 23 runs + 30 institutions 全部显示 |
| 无 AI/cyberpunk 元素 | 无 neon、无 gradient、无 glassmorphism |
| 中文 typography | 书名号 / 引号 / 全角标点正确 |
| 不引入新资源 | fonts 走 Google Fonts CDN (gstatic 已加载),其他全部本地 |
