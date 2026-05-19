# Phase 8A-R — 专题学习路线发布后小修与核验报告

**STATUS:** PASS ✅
**Date:** 2026-05-19
**Backup:** `backups/how2ai-phase8a-r-before-polish-20260519-082707/` (2.9M)
**Project:** `~/conanxin.github.io/projects/how-to-ai-almost-anything-cn/`

---

## 执行摘要

Phase 8A 专题学习路线功能上线后，执行 5 项小修和全面核验。所有问题已修复，验证全部通过。

---

## 修复详情

### SECTION_NUMBERING_FIX
**问题：** Phase 8A 将专题学习路线插入为 05 后，课程详情沿用了旧的 06 编号，导致编号冲突（两个 06）和后续序列错位（07-15 全部 +1）。

**修复：** 遍历所有 `<span class="section-num">XX</span>`，检测重复编号。课程详情从 `06` 改为 `07`，后续 08-17 全部 -1。修复后序列：

```
01  学习入口
02  选择你的学习模式
03  这门课不是什么？
04  课程节点
05  专题学习路线
06  五步学习法
07  课程详情
08  多模态 AI 概念地图
09  新模态 AI 化流程图
10  论文导航
11  七角色论文阅读法
12  Almost Anything 系列谱系
13  课程研究项目时间线
14  术语表
15  来源链接
16  本中文导览如何对应原课程
```

✅ 01-16 连续，无重复，无跳跃

### VERSION_MARKER_FIX
**问题：** 页脚显示 `Phase 8A Notes Polish`，不准确。

**修复：** 页脚改为 `Public release version: Phase 8A Thematic Routes`。`data-public-version` 属性已为 `phase8a-thematic-routes`（正确）。

### TIMELINE_DATE_FIX
**问题：** 无（线上页面 4/1 和 4/3 日期均正确，报告中无 4/1 Midterm 误导）。

**结论：** 不需要修复。Timeline 显示：
- 4/1: Large foundation models ✅
- 4/3: Midterm Presentation & Report ✅

### ICON_CLEANUP
**检查结果：** 无需修复。

- index.html: 102 个 emoji 字符，全在 SVG concept map 内作为视觉图标（📝 文本, 🖼️ 图像, 🎵 音频, 🤖 理解 等），全部合法使用
- styles.css: 4 个 emoji（⚠️ 常见误区, 💭, 📝 Mini Assignment），在 CSS content 中正常渲染
- app.js: 55 个 emoji，全在 link status 映射字符串中（✅/⚠️/🌐）
- 无孤立 Variation Selector (U+FE0F)，无渲染异常字符

### STATIC_FALLBACK
**问题：**专题学习路线 section 依赖 JS 渲染，无 JS 情况下内容空白。

**修复：** 在 `thematicRoutesContainer` 内添加 `<noscript>` fallback：

```html
<noscript>
  <p>请启用 JavaScript 以查看专题学习路线交互功能。</p>
  <ul>
    <li><strong>多感官 AI 路线</strong> — 探索五大模态的 AI 化路径</li>
    <li><strong>大模型与多模态基础模型路线</strong> — 从 CLIP 到 LLaVA</li>
    <li><strong>交互式 Agent 路线</strong> — RLHF、CoT、DPO</li>
    <li><strong>研究项目路线</strong> — 从选题到最终报告</li>
  </ul>
</noscript>
```

✅ 无 JS 时显示 4 条路线静态说明

---

## THEMATIC_ROUTES_DATA_CHECK

| 检查项 | 结果 |
|--------|------|
| 路线数量 | ✅ 4 条（multisensory-ai, multimodal-foundation-models, interactive-agents, research-project-track） |
| 必填字段（id/title/session_ids/milestones/final_output/project_prompt） | ✅ 全部 4 条路线完整 |
| session_ids 存在于 course.json | ✅ 全部存在 |
| reading_ids 存在于 readings.json | ✅ 全部存在 |
| milestones >= 3 | ✅ 全部满足（4/5/5/6 个） |
| final_output 非空 | ✅ 全部 4 条 |
| project_prompt 非空 | ✅ 全部 4 条 |
| glossary_terms 精确匹配 | ⚠ 10 条警告（术语存在但 glossary key 名称不同，不影响功能） |

**路线详情：**
- multisensory-ai: 11 sessions, 4 milestones
- multimodal-foundation-models: 11 sessions, 5 milestones
- interactive-agents: 8 sessions, 5 milestones
- research-project-track: 20 sessions, 6 milestones

---

## THEMATIC_ROUTES_JS_CHECK

| 函数 | 状态 |
|------|------|
| `thematicRoutes` 全局变量 | ✅ 存在 |
| `thematic_routes.json` 加载 | ✅ 通过 Promise.all 合流 |
| `renderThematicRoutes()` | ✅ 存在并被调用（DOMContentLoaded） |
| `toggleRouteMilestone()` | ✅ 存在 |
| `setRouteMilestone()` | ✅ 存在 |
| `getRouteProgressData()` | ✅ 存在 |
| `updateRouteCardProgress()` | ✅ 存在 |
| `toggleRouteCard()` | ✅ 存在 |
| `scrollToSessionFromRoute()` | ✅ 存在 |
| `exportRouteMarkdown()` | ✅ 存在 |
| `exportAllRoutesMarkdown()` | ✅ 存在 |
| `how2ai_route_progress` localStorage key | ✅ 存在 |
| `initThematicRoutes()` | ⚠ 命名为 `renderThematicRoutes()` 直接调用（功能等效） |

---

## VALIDATION

```
node --check app.js                  ✅ PASS (1770 lines, 82047 bytes)
validate_course_data.py               ✅ 8/8 PASS (thematic_routes: 4 routes, 0 errors)
audit_static_ui.py:
  ✅ Section 编号连续: [1-16]
  ✅ Section 编号无重复
  ⚠  25 个预先存在 ISSUE（mode-/pp- 动态 ID，与本次无关）
  ⚠  24 个预先存在 WARN（stat-* 读取类无害）
```

---

## LOCAL_SMOKE_TEST

```
200 /projects/how-to-ai-almost-anything-cn/                    ✅
200 /projects/how-to-ai-almost-anything-cn/data/thematic_routes.json  ✅
200 /projects/how-to-ai-almost-anything-cn/assets/js/app.js          ✅
noindex in public: False                                          ✅
Phase 8A Thematic Routes: True                                   ✅
Phase 8A Notes Polish: False                                     ✅
Section numbers: 01-16 consecutive, no duplicates               ✅
4/1 Midterm error: False                                          ✅
Lone FE0F: False (误报，🖼️ 为合法组合字符)                        ✅
noscript fallback: True                                          ✅
Route section (专题学习路线): True                                ✅
```

---

## ONLINE_SMOKE_TEST
等待 GitHub Pages 重新部署后（~2-5 分钟），验证：
```
curl -L "https://conanxin.github.io/projects/how-to-ai-almost-anything-cn/"
```

预期全部项目同 local smoke test。

---

## NOINDEX 状态

| 环境 | noindex |
|------|---------|
| Public project (`projects/how-to-ai-almost-anything-cn/`) | 无 ✅ |
| Draft project (`drafts/how-to-ai-almost-anything-cn/`) | 保留原有 noindex ✅ |

---

## PUBLISH_READINESS

**READY_FOR_PHASE8B** ✅

---

## KNOWN_ISSUES

1. **validate_course_data.py 编号标注不一致**（本次修复）：前 6 项标 `[1/8]`，后 2 项标 `[7/8]`、`[8/8]`。实际共 8 项验证，功能正确，仅标签数字不一致，不影响功能。
2. **glossary_terms 警告**（Phase 8A 已知）：10 条术语（Sensor, Generative Model 等）在 glossary.json 中存在但 key 名称不同（如使用 "Multimodal Model" 而非 "Large Multimodal Model"）。不影响功能，仅为推荐术语展示。
3. **audit_static_ui.py mode-/pp- 动态 ID**：这些是 JS 动态生成的 ID（如 `mode-{id}`, `pp-{step}`），audit 工具无法在静态 HTML 中找到。预先存在的已知问题。

---

## NEXT_STEPS

1. **线上最终核验** — GitHub Pages 更新后，浏览器打开 https://conanxin.github.io/projects/how-to-ai-almost-anything-cn/ 确认专题路线 section 正常渲染
2. **可选 Phase 8B** — 路线专属 landing filter / 路线 mini quiz / 学习报告生成
3. **清理 local backup 文件** — `app.js.bak`, `thematic_routes.js`, `reports/phase7c_r_remote_check/`（非交付物，已 untracked）
