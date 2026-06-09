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

---

## CP-3B Artifact Preview Wall + Featured Project Strip

**Phase:** CP-3B — 2026-06-09

从 Cinematic Experience（CP-3A）向"项目放映厅"目标的又一次迭代。

### Featured Project Strip

位于 Hero 之后、Scene 01 之前。3 张大卡片展示核心项目：
- **Conan AI Project Cinema** — 自身项目档案馆入口
- **ClaimLens** — 本地优先主张提取工具（alpha）
- **WWDC26 Keynote** — 交互式发布会总结页

每张卡片包含：visual block / label / title / description / status badge / Open CTA

### Artifact Preview Wall

位于 Scene 06 Artifact Archive 搜索区上方。横向滚动预览墙展示6 个主要项目：
How2AI / Internet Builder / ClaimLens / HERMES Lofi / UAP Files / WWDC26

每张卡片包含：browser chrome / screen motif / type / title / description / status / View CTA

### Preview 数据层

`window.CP_ARTIFACTS.featured` — 3 个 featured 项目
`window.CP_ARTIFACTS.previews` — 6 个 preview wall 项目
不虚构链接。external link 使用 `target="_blank" rel="noopener noreferrer"`。

### 技术说明

- **纯静态** — 无 GitHub API / 无 live data
- **safeRun 保护** — 渲染失败时 revealAllScenesFallback() 保底
- **移动端降级** — Preview Wall 在 600px 以下变为单列
- **CSS only scrolling** — 无 JS 滚动监听

### Current Status

- **Phase:** CP-3B Artifact Preview Wall
- **Featured Strip:** Active
- **Preview Wall:** Active
- **All prior features:** Active

---

*Release notes maintained by 辛 🔮*

---

## CP-3C Cinematic Depth

**Phase:** CP-3C — 2026-06-09

从 Project Theater（CP-3B）向"深夜个人研究室 × AI 操作系统"空间感的又一次迭代。

### CSS-only Depth Layer

全局固定视觉层（`cinema-depth-layer`），包含3个缓慢漂移的 depth orbs + 淡网格背景。纯 CSS，零 JavaScript，pointer-events: none。

### Active Scene Atmosphere

滚动时 `document.documentElement.dataset.activeScene` 实时更新，当前 scene 顶部有一条淡光条（Cinema top highlight）。非 active scenes 微暗（opacity 0.85）。

### Cinematic Parallax

`initCinematicDepth()` 通过 `requestAnimationFrame` 更新根 CSS 变量 `--cinema-scroll-progress`，驱动 `.signal-grid` 和 `.scene-visual` 的微垂直位移。

### No 3D Dependency

无 Three.js / Spline / React Three Fiber，所有效果通过 CSS + CSS 变量实现。

### Featured / Preview 放映感微增强

- Featured card hover: light sweep 特效（CSS `::after` + keyframe）
- Preview card hover: screen glow（`box-shadow: inset`）
- Preview wall wrap: projector-like ambient radial gradient

### Current Status

- **Phase:** CP-3C Cinematic Depth
- **All prior features:** Active
- **Depth layer:** Active (desktop)
- **Parallax:** Active (reduced-motion off)
- **Active scene highlight:** Active

---

*Release notes maintained by 辛 🔮*

---

## CP-3D Narrative Rhythm

**Phase:** CP-3D — 2026-06-09

从 Cinematic Depth（CP-3C）向"滚动叙事感"的又一次迭代。

### Scene Transition Cues

- **Story Bridge** — Hero → Featured Strip → Scene 01 之间的视觉连接线（双线 + 居中标签）
- **Scene Kicker** — 每幕顶部 `Chapter XX · Title` 标签，建立"章节开场"感

### Layered Scene Entry

`scean-number → heading → body → visual` 依次淡入（0.1~0.5s 延迟阶梯），每幕像分镜一样逐层展开。纯 CSS keyframe，无 JS 开销。

### Enhanced Story Navigation

Scene Navigator 增强：
- 短标题：`01 · Ideas` / `02 · Beyond Chat` / `03 · Artifacts` / `04 · Agents` / `05 · Tower` / `06 · Archive`
- hover tooltip 显示中文标题描述
- active 状态更明确（accent 颜色 + 字体加粗）

### Hero-to-Story Bridge

Hero → Featured Strip → Scene 01 之间增加了 Story Bridge 视觉连接，避免三个区块割裂。

### No New Framework

纯 CSS + HTML，无新框架依赖。

### Current Status

- **Phase:** CP-3D Narrative Rhythm
- **All prior features:** Active
- **Story bridge:** Active
- **Scene kickers:** Active
- **Layered scene entry:** Active
- **Enhanced scene navigator:** Active

---

*Release notes maintained by 辛 🔮*

---

## CP-3E Mobile Story Navigation

**Phase:** CP-3E — 2026-06-09

从 Narrative Rhythm（CP-3D）向完整多端叙事体验的最后一步。

### Mobile Scene Strip

固定底部叙事导航条（`max-width: 1099px` 显示）：
- TOP + 01 · Ideas / 02 · Beyond Chat / 03 · Artifacts / 04 · Agents / 05 · Tower / 06 · Archive
- 滚动时 active 状态随当前 scene 变化
- 点击可平滑跳转（reduced motion 时立即跳转）
- `prefers-reduced-motion: reduce` 时自动隐藏

### Desktop/Mobile Narrative Continuity

`initSceneNavigator()` 已重构，统一处理 desktop scene navigator + mobile scene strip 的 active 状态和数据获取。同一份 scroll 逻辑同时驱动两侧高亮。

### Final Experience QA

新增 `EXPERIENCE_QA.md`：
- 桌面端体验检查（1280px+）
- 移动端体验检查（375px / 480px）
- 可访问性检查（aria / focus / reduced-motion /颜色对比）
- 仍未做内容评估
- 封版建议

### No New Framework

纯 CSS + 原生 JS，无新框架依赖。

### Current Status

- **Phase:** CP-3E Mobile Story Navigation
- **All prior features:** Active
- **Mobile scene strip:** Active (1099px and below)
- **Desktop scene navigator:** Active (1100px+)
- **Experience QA:** Complete
- **Recommendation:** CP-3 Series — ready to finalize

---

*Release notes maintained by 辛 🔮*
