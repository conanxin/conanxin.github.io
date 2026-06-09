# Conan AI Project Cinema — Release Notes

## Summary

一个公开的个人 AI 项目宇宙入口，用六幕滚动叙事将阅读、研究、代码、网页、Agent、GitHub Pages、OpenClaw、Hermes、VPS Control Tower、论文解读、书籍翻译和自动化项目串联成一个有机整体。

不是简历页，不是作品集，是一个持续生长的个人 AI 创造系统档案馆。

---

## What It Includes

**Six-Scene Cinematic Narrative**
从"Complex Ideas"到"Archive Entrance"，用叙事节奏代替功能罗列。

**Data-Driven Artifact Archive**
所有项目卡片和 Artifact 来自 `artifacts.js` 数据层，新增项目只需修改数据文件。

**Search & Filter**
支持按类型（Page / Tool / Report / Article / Archive / Internal）筛选，以及全文搜索。

**Agent Workflow Strip**
展示 OpenClaw → Hermes → Codex → Phase Report 的工作流设计理由。

**Personal AI Control Tower**
概念预览：用六幕叙事 + 项目星图 + Artifact Archive 构建个人 AI 系统感。

**Project Constellation**
交互式星图：悬停显示状态，点击跳转（内链同页，外链新标签）。

**Open Graph / Twitter Card Support**
分享到社交平台时显示专业预览图（1200×630）。

---

## Design Principles

1. **先故事，后项目** — 叙事节奏比功能列表先回答"这里有什么"
2. **先 artifact，后炫技** — 先确保每个想法留下可打开/阅读/运行/复盘的产物
3. **明确区分 public / private / concept / internal** — BookTrans / ExplainLens 保持 private，不虚构公开链接
4. **不虚构实时数据** — Control Tower 明确标注"Concept Preview — Not Live Data"
5. **每个阶段留下设计理由** — 设计决策记录在 DESIGN_NOTES.md，可供复盘

---

## Public URLs

**正式发布页：** https://conanxin.github.io/projects/conan-ai-project-cinema/

**Draft 评审页：** https://conanxin.github.io/drafts/conan-ai-project-cinema/（noindex 保护，不进入搜索引擎）

---

## Current Status

- **Public release:** CP-2A completed
- **Search & filter:** Active
- **Constellation:** Interactive
- **OG/Twitter meta:** Configured
- **Sitemap:** Updated

---

## Phase History

| Phase | Commit | Description |
|-------|--------|-------------|
| CP-1A | `db269fc` | Static cinematic draft prototype |
| CP-1B | `c224ff0` | Realism upgrade + Artifact upgrade |
| CP-1C | `234daa0` | Data layer + filter interaction |
| CP-1D | `21c1d1a` | Search + constellation + mobile polish |
| CP-1E | `2a27bcb` | Publish decision + project promotion |
| CP-2A | `0e2b013` | Sharing metadata + OG image + sitemap |

---

## Technical Notes

- **Stack:** Pure HTML + CSS + vanilla JS (no framework)
- **Data:** `artifacts.js` — `window.CP_ARTIFACTS` object
- **Fonts:** IBM Plex Mono + Noto Sans SC
- **No 3D** — Spline / Three.js / React Three Fiber not introduced
- **No build tool** — Direct GitHub Pages static hosting
- **Accessibility:** `prefers-reduced-motion` supported, keyboard navigable, `:focus-visible` styled

---

*Release notes maintained by 辛 🔮*

---

## CP-3A Cinematic Experience Upgrade

**Phase:** CP-3A — 2026-06-09

从 Public Release Base（CP-2B）升级为 Cinematic Experience 版本的首次迭代。

### 新增功能

**Command Desk Hero**
四个浮动状态面板（SYSTEM / AGENTS / ARTIFACTS / SIGNAL）叠加在 Hero 区域，营造 AI 工作台控制台感。

**Signal Grid Ambient Layer**
CSS-only 网格背景 + 光晕层，增加深夜研究室氛围深度。

**Scene Visual Anchors**
每一幕有专属视觉锚点：
- Scene 01: Idea Fragments — 论文/笔记/截图/书籍片段展示
- Scene 02: Pipeline Flow — Chat → Terminal → Web → Project 流水线
- Scene 03: Artifact Conveyor — Idea → Code → Doc → Artifact 传送带
- Scene 04: Agent Workflow Strip（已存在，增强布局）
- Scene 05: Control Tower（已存在，增强星图）
- Scene 06: Archive Console Header — 放映控制台标题栏

**Scene Navigator**
固定左侧边栏章节导航，滚动时高亮当前章节，可点击跳转。

### 技术说明

- **纯 CSS 增强** — 无新框架、无 Canvas、无图片依赖
- **safeRun 保护** — 所有新交互均有 JS fallback
- **reduced motion** — 导航滚动可随用户偏好关闭动画
- **移动端降级** — Scene Navigator 1100px 以下隐藏，Command Desk 紧凑化

### Current Status

- **Phase:** CP-3A Cinematic Experience
- **All prior features:** Active
- **Scene navigator:** Active (desktop)
- **Command desk:** Active
- **Visual anchors:** 6 scenes enhanced

---

*Release notes maintained by 辛 🔮*
