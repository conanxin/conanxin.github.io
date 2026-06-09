# ORIGINAL_GOAL_GAP.md

## 最初目标 vs 当前状态

**创建时间：** 2026-06-09
**文档目的：** 明确最初愿景与当前实现的差距，为 CP-3A 提供行动路线图

---

## 最初目标（Lawted-inspired Cinematic Experience）

参考 Lawted.tech 的"电影化滚动叙事型个人作品集"方法，但不做视觉风格抄袭。目标是做成：

> **深夜个人研究室 × AI 操作系统 × 项目放映厅 × Agent 控制塔 × 项目档案馆**

核心理念：
- 沉浸式滚动叙事（六幕结构）
- 像在深夜研究室里探索自己的 AI 工作台
- AI 不是聊天机器人，而是进入文档/网页/终端/项目流程的操作系统层
- 每个项目像可以被打开、阅读、运行的 artifact
- Agent 工作流像真实的执行流水线
- Control Tower 像真实的 VPS/AI 系统监控面板

---

## 当前已完成（Public Release Base）

| 功能 | 状态 |
|-------|------|
| 六幕滚动叙事文案 | ✅ |
| 六幕 scene structure | ✅ |
| 搜索框 + filter chips | ✅ |
| Artifact Archive 数据驱动 | ✅ |
| Constellation 交互（tooltip + click）| ✅ |
| Agent Workflow Strip | ✅ |
| Control Tower 概念面板 | ✅ |
| OG / Twitter Card | ✅ |
| og-image.png | ✅ |
| sitemap | ✅ |
| RELEASE_NOTES.md | ✅ |
| Private/internal 边界 | ✅ |
| Concept Preview 边界 | ✅ |
| Mobile responsive | ✅ |
| reduced motion 支持 | ✅ |
| safeRun JS fallback | ✅ |

---

## 当前为什么还不像 Lawted 式沉浸体验

| 差距维度 | 描述 |
|---------|------|
| **Hero 单薄** | 首屏像普通 landing page，不够"控制台感" |
| **Scene 视觉锚点弱** | 六幕有文案+卡片，但缺乏"分镜感" — 每一幕看完不知道这一章在讲什么 |
| **缺乏空间层次** | 页面整体偏平，没有"深夜研究室"的多层次氛围 |
| **Scene 导航缺失** | 用户不知道自己在哪个 chapter，没有章节导航 |
| **Archive 放映感弱** | Artifact Archive 像普通卡片列表，不像"放映控制台" |
| **缺乏氛围层** | 没有环境光/扫描线/暗角/层次感 |

---

## CP-3A 本阶段要补什么

| 优先级 | 改进项 | 目标 |
|--------|--------|------|
| P0 | Hero cinematic upgrade | 首屏更像 AI 工作台 |
| P0 | Scene visual anchors | 每一幕有明确的"分镜视觉锚点" |
| P0 | Scene navigator | 侧边章节导航 + 当前 scene 高亮 |
| P1 | Artifact Archive console header | Archive 区域更像放映控制台 |
| P1 | Floating ambient elements | CSS-only 氛围层（信号网格/扫描线）|

---

## CP-3B / CP-4 后续建议

**CP-3B（可选）：**
- 更丰富的 parallax 效果（CSS only）
- 更多 scene visual anchors 细节
- Terminal 真实化（接入 GitHub API 或保持 static）
- 氛围光效增强

**CP-4（发布后评估）：**
- 用户测试：真实用户能否描述这个页面是什么
- Lawted 对比评审：是否真正达到了 Lawted 的叙事体验目标
- 是否需要重新定位项目定位

---

## 明确声明

**当前版本：** Public Release Base（CP-2B 收口版本）
**目标版本：** Cinematic Experience（CP-3A+ 目标）
**不做：** 重型 3D / 框架引入 / live monitoring
**手段：** CSS 氛围 + JS 轻交互 + 视觉结构升级

---

*文档用途：供爸爸评审当前进度和方向对齐*
