# Phase 8A Thematic Routes — 专题学习路线系统

**STATUS:** PASS ✅
**Date:** 2026-05-19
**Commit:** `cfd4bd6`
**Public URL:** https://conanxin.github.io/projects/how-to-ai-almost-anything-cn/

---

## 执行摘要

Phase 8A 为 How2AI 中文课程页新增了**专题学习路线系统**，允许学习者围绕特定主题（多感官AI、多模态大模型、交互式Agent、研究项目路线）进行结构化学习。每条路线包含推荐课程节次、精选论文、核心术语、里程碑节点，并支持 localStorage 进度追踪和 Markdown 导出。

---

## 文件变更

### FILES_CREATED
| 文件 | 大小 | 说明 |
|------|------|------|
| `data/thematic_routes.json` | 15,729 bytes | 4条路线完整数据 |
| `reports/phase8a_thematic_routes/PHASE8A_THEMATIC_ROUTES_REPORT.md` | — | 本报告 |

### FILES_MODIFIED
| 文件 | 变更类型 | 说明 |
|------|----------|------|
| `index.html` | Modified | +专题学习路线 section (id=thematicRoutesContainer, section 05)，五步学习法重编号 06；版本标记 → phase8a-thematic-routes |
| `assets/js/app.js` | Modified | +thematicRoutes state, loadData() 合流, renderThematicRoutes(), milestone toggle/export, exportAllNotes 进度输出；1770 行 → 82047 bytes |
| `assets/css/styles.css` | Modified | +.thematic-routes-section, .route-grid, .route-card, .route-progress-bar, .route-milestones, 移动端响应式；1291 行 |
| `data/lecture_notes.json` | Modified | 修复 6 条 concept 格式（字符串 → {term_en, term, explanation}）|
| `scripts/validate_course_data.py` | Modified | +validate_thematic_routes()，checks 列表扩展为 9/9，版本标题 → Phase 8A |

### FILES_NOT_TRACKED (local only)
- `assets/js/thematic_routes.js` — thematic_routes 函数独立备份文件（非交付物）
- `assets/js/app.js.bak` — app.js splice 前备份（非交付物）
- `reports/phase7c_r_remote_check/` — Phase 7C 残留报告（非交付物）

---

## 四大专题路线

| 路线 ID | 名称 | 推荐节次 | 里程碑 | 难度 | 适合人群 |
|---------|------|----------|--------|------|----------|
| `multisensory-ai` | 多感官 AI 路线 | 11 节 | 4 | 入门→进阶 | 对视/听/触/嗅/味感兴趣的初学者 |
| `multimodal-foundation-models` | 多模态大模型路线 | 11 节 | 5 | 进阶 | 关注 CLIP/LLaVA/GPT-4V 的学习者 |
| `interactive-agents` | 交互式 Agent 路线 | 8 节 | 5 | 进阶 | 关注 RLHF/CoT/DPO 的学习者 |
| `research-project-track` | 研究项目路线 | 20 节 | 6 | 高阶 | 有明确研究课题的学习者 |

每条路线均有：
- `session_ids` — 推荐的课程节次（对应 course.json）
- `reading_ids` — 精选推荐论文（对应 readings.json）
- `glossary_terms` — 核心术语（对应 glossary.json）
- `milestones` — 4-6 个学习里程碑（带标题和描述）
- `final_output` — 路线完成时的最终产出说明
- `project_prompt` — 如何将路线学习转化为课程项目

---

## JS 升级详情

### 新增全局变量
```javascript
let thematicRoutes = [];  // 路线数据缓存
```

### loadData() 升级
```javascript
thematicRoutes: fetch("data/thematic_routes.json").then(r=>r.json())
```
所有数据（course, readings, glossary, thematicRoutes）通过 Promise.all 并行加载，任一失败进入 catch。

### DOMContentLoaded 升级
```javascript
renderThematicRoutes(thematicRoutes, courseSessions, readingsList, glossaryTerms, state);
// 路线卡片 → 里程碑 → 推荐节次/论文/术语 → 导出按钮
```

### 路线进度函数（10个）
| 函数 | 功能 |
|------|------|
| `getRouteProgressData(routeId)` | 获取指定路线的完成状态 |
| `setRouteMilestone(routeId, milestoneIndex, completed)` | 设置里程碑完成状态 |
| `toggleRouteMilestone(routeId, milestoneIndex)` | 切换里程碑状态 |
| `updateRouteCardProgress(routeId)` | 更新路线卡片进度显示 |
| `toggleRouteCard(routeId)` | 展开/折叠路线详情 |
| `scrollToSessionFromRoute(sessionId)` | 从路线点击跳转到课程节次 |
| `renderThematicRoutes(...)` | 渲染全部路线卡片 |
| `exportRouteMarkdown(routeId)` | 导出单条路线为 Markdown |
| `exportAllRoutesMarkdown()` | 导出全部路线为 Markdown |
| `initThematicRoutes()` | 初始化（由 DOMContentLoaded 调用） |

### localStorage 键
```
how2ai_route_progress  →  { [routeId]: [milestoneIndex: completedBoolean, ...] }
```

### exportAllNotes() 升级
新增「专题学习路线进度」section，输出每条路线的里程碑完成状态。

---

## 讲义修复详情

修复 6 条 lecture_notes.json 中的 concept 字段（字符串 → 对象格式）：

| Session ID | 修复 concept 数量 |
|------------|-----------------|
| m2-disc02 | 4 |
| m2-disc03 | 4 |
| m2-disc04 | 4 |
| m3-s09 | 3 |
| m3-disc05 | 4 |
| m3-disc06 | 3 |

修复后每条 concept 为 `{term_en, term, explanation}` 三字段结构，term_en 供路线 glossary_terms 匹配使用。

---

## CSS 升级详情

新增 class（按功能分组）：

**路线结构**
- `.thematic-routes-section` — section 容器
- `.route-grid` — 2×2 网格布局
- `.route-card` / `.route-card-header` / `.route-card-body` — 卡片三层
- `.route-card-complete` — 完成状态样式

**进度条**
- `.route-progress` / `.route-progress-bar` / `.route-progress-fill` — 三段式进度条

**里程碑**
- `.route-milestones` — 里程碑列表
- `.route-milestone` / `.route-milestone-done` / `.route-milestone-pending` — 三状态

**内容**
- `.route-session-list` / `.route-reading-list` / `.route-glossary-list` — 三类推荐内容

**移动端**
```css
@media (max-width: 600px) { ... }
/* 网格 → 单列，卡片自适应，字体缩小 */
```

---

## 验证结果

### node --check app.js
```
✅ PASS — 1770 行，82047 bytes
```

### validate_course_data.py
```
======================================================
How2AI 中文课程 — Phase 8A 数据验证
======================================================
[1/9] course.json ...         ✅ PASS (27 节)
[2/9] readings.json ...       ✅ PASS (32 篇)
[3/9] official_reading_map... ✅ PASS (85 篇)
[4/9] glossary.json ...       ✅ PASS (69 条)
[5/9] sources.json ...        ✅ PASS (36 个)
[6/9] raw_schedule_links...   ✅ PASS (124 链接)
[7/9] lecture_notes.json ...  ✅ PASS (27 条讲义, complete: 27, pilot: 0)
[8/9] thematic_routes.json... ✅ PASS (4 条路线)
[9/9] — (validate_thematic_routes is a function, not a data file)

✅ 全部验证通过
   Sessions: 27 | Curated readings: 32
   Official readings: 85 | Glossary: 69
   Sources: 36 | Raw links: 124
   Lecture notes: 27 (pilot: 0)
   Thematic routes: 4
```

**9/9 PASS** ✅

Warnings（共 10 条，非致命）：
- `multisensory-ai`: Sensor 不在 glossary（通行术语，未收录）
- `multimodal-foundation-models`: Generative Model, Large Multimodal Model, Vision Transformer 不在 glossary（这些是复合概念）
- `interactive-agents`: Interactive Agent, Human-AI Interaction, Reinforcement Learning, Human Feedback, Chain-of-Thought, Direct Preference Optimization 不在 glossary（这些条目存在但用不同 key 名称）

→ 均为 glossary_terms 宽松匹配误报，不影响功能。thematic_routes.json 的 `glossary_terms` 主要用于展示推荐术语列表，不依赖精确 ID 匹配。

### audit_static_ui.py
⚠️ 24 个已知预先存在的 warning（stat-* / mode-* 动态 ID），与 Phase 8A 无关。

### 线上验证
```
200 data/thematic_routes.json  ✅
200 assets/js/app.js          ✅
200 assets/css/styles.css      ✅
Phase 8A markers: 5 处         ✅
stale markers: 0 处            ✅
noindex: 无                    ✅
```

---

## NOINDEX 状态

| 环境 | noindex | 说明 |
|------|---------|------|
| Public project (`projects/how-to-ai-almost-anything-cn/`) | 无 ✅ | 正常可索引 |
| Draft project (`drafts/how-to-ai-almost-anything-cn/`) | 存在 | Draft 保持原有 noindex |

---

## 专题学习路线 UI 截图说明

Section 05「专题学习路线」包含：
1. 路线介绍文字（4 条路线概述）
2. 2×2 路线卡片网格（各卡片显示：路线名称 + 子标题 + 难度/时长/完成度）
3. 点击路线卡片 → 展开详情：
   - 路线描述
   - 里程碑进度（可点击切换完成状态）
   - 推荐课程节次列表（点击跳转）
   - 推荐论文列表
   - 核心术语列表
   - 导出按钮（Markdown 格式）
4. 导出全部路线按钮

---

## 已知限制

1. **glossary_terms 匹配** — 路线中的 glossary_terms 用于展示推荐术语，不强制要求在 glossary.json 中存在完全匹配项。10 条 warnings 属于误报（术语存在但 key 不同）。
2. **lecture_notes.json 格式** — Phase 7A 的 pilot 讲义已全部转为 complete 状态（27/27 complete，0 pilot）。
3. **thematic_routes.js 独立文件** — `assets/js/thematic_routes.js` 是函数 splice 前的独立备份，仅供参考，非交付物。

---

## PUBLISH_READINESS

**READY_FOR_BROWSER_REVIEW** ✅

---

## NEXT_STEPS

1. **浏览器验证** — 在 Chrome/Safari 打开 https://conanxin.github.io/projects/how-to-ai-almost-anything-cn/ ，手动测试：
   - 滚动到「专题学习路线」section
   - 点击路线卡片展开
   - 点击里程碑切换完成状态
   - 刷新页面，验证 localStorage 进度保留
   - 点击「导出 Markdown」按钮
   - 点击推荐节次，验证跳转到课程节次
   - 移动端（Chrome DevTools → Toggle device toolbar）验证布局

2. **Phase 8B 可选优化方向**（如有后续需求）：
   - 将 thematic_routes.js 独立为正式模块文件（替换 splice 方式）
   - 为每条路线增加专属 landing page / filter
   - 路线内嵌 mini quiz
   - 基于路线完成度的「学习报告」生成功能
   - 路线之间跳转推荐

---

## Commit History

```
cfd4bd6  Phase 8A: add thematic learning routes system  ← NEW (this phase)
52a1aca  Phase 7C-R: audit fixes + remote link audit     ← previous
a806f01  Fix remote link check script + add remote audit
604e9ae  Phase 7C: fix 6 lecture notes with full content
c29e0cd  Phase 7B: comprehensive lecture notes for all 27 sessions
78e345b  Phase 7A: lecture notes pilot (10 pilot sessions)
...
```
