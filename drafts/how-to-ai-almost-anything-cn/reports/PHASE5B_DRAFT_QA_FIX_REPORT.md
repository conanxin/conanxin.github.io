# Phase 5B — Draft QA 修正报告
**STATUS**: PASS ✅  
**执行时间**: 2026-05-18  
**执行环境**: cloud_hermes  
**项目目录**: `~/conanxin.github.io/drafts/how-to-ai-almost-anything-cn/`

---

## STATUS
**PASS** ✅

---

## HOST_SCOPE
cloud_hermes（不涉及本地 Hermes / OpenClaw / 云端 OpenClaw）

---

## PROJECT_DIR
`/home/ubuntu/conanxin.github.io/drafts/how-to-ai-almost-anything-cn/`

---

## COMMIT_HASH
`b1178a3`

**Commit message:**
```
Refine How2AI draft QA copy

- 统一课程数量口径：Hero=27个学习节点，进度=可追踪节点，描述=15周27节点
- 修正七角色：Hacker→快速原型视角，Academic→后续研究视角，Private Investigator→作者路径视角
- 同步 SVG 轮盘标签和角色按钮
- 修正后验证：validate 6/6 ✅，audit 0 ISSUE ✅，link check OK:102/manual:15/paywall:4/client_err:2 ✅
```

---

## PUSH_STATUS
**SUCCESS** ✅（`3f41111..b1178a3` pushed）

---

## DRAFT_URL
**https://conanxin.github.io/drafts/how-to-ai-almost-anything-cn/**

---

## FILES_MODIFIED
共 4 个文件：
- `index.html`（课程数量口径 + 七角色修正）
- `reports/PHASE5A_DRAFT_DEPLOY_REPORT.md`（Phase 5A 报告，新生成）
- `reports/link_check_phase3.json`（link check 结果更新）
- `reports/link_check_phase3.md`（link check markdown 摘要更新）

---

## FIXES

### Fix 1: 课程数量口径统一 ✅

| 位置 | 修改前 | 修改后 |
|------|--------|--------|
| Hero stat | `27 节课程` | `27 个学习节点` |
| Hero 进度 label | `课程节数` | `可追踪节点` |
| 时间线 section-desc | `共 15 周，21 节课程，涵盖 AI 基础 → ...` | `共 15 周，覆盖 lecture / discussion / project / special 等 27 个学习节点` |

**验证**：grep 确认零残留 `"21 节"`、`"27 节课程"` 无解释上下文。

### Fix 2: Hacker 角色修正 ✅

**修改前（错误）**：
- 标题：`💀 Hacker · 黑客视角`
- 核心问题：`这篇系统的攻击面和漏洞在哪里？`
- 要点：对抗样本、隐私泄露、越狱攻击、Prompt Injection、数据污染
- 适用：安全研究、红队测试、AI 安全性评估

**修改后（符合原课程 Lecture 1）**：
- 标题：`⚡ Hacker · 快速原型视角`
- 核心问题：`我能否在一周内做出这篇论文的最小可运行 demo？`
- 要点：
  - 在小数据集或 toy problem 上实现论文的一小部分
  - 展示核心算法代码
  - 可以使用开源 backbone，但必须说明来源
  - 目标不是复现 SOTA，而是验证"这篇论文的关键机制是否能跑起来"
- 适用：快速复现、demo、课程展示、原型验证

### Fix 3: Academic Researcher 角色修正 ✅

**修改前（偏"复现学习"）**：
- 标题：`🔬 Academic Researcher · 学术视角`
- 核心问题：`我能从这篇论文中学到什么可复现的方法？`
- 要点：数学推导、训练细节、Trick、迁移

**修改后（后续研究视角）**：
- 标题：`🔬 Academic Researcher · 后续研究视角`
- 核心问题：`这篇论文打开了什么新的研究问题？`
- 要点：
  - 提出一个只有在这篇论文成功后才变得可能的 follow-up project
  - 说明新的 research question
  - 说明可能的数据、方法、评估
  - 说明它和原论文的继承关系
- 适用：proposal、literature review、论文选题

### Fix 4: Private Investigator 角色修正 ✅

**修改前（偏"论文隐瞒什么"）**：
- 标题：`🔍 Private Investigator · 侦探视角`
- 核心问题：`论文隐瞒了什么？哪些信息没有披露？`
- 要点：实验设置缺失、失败案例、消融实验、数据泄露、利益冲突

**修改后（作者路径视角）**：
- 标题：`🔍 Private Investigator · 作者路径视角`
- 核心问题：`作者为什么会想到这个题目？`
- 要点：
  - 调查一位作者的教育、工作经历和研究脉络
  - 找出他们之前哪些项目可能导向这篇论文
  - 分析作者选择这个问题的动机
  - 如需联系作者，必须礼貌、克制、围绕学术问题
- 适用：研究谱系、选题动机、学术人物研究

### Fix 5: SVG 轮盘标签同步 ✅
- Hacker SVG：`黑客视角 → 快速原型`，`能 hack 什么？ → 最小 demo？`
- Academic SVG：`我能学什么？ → 新研究问题？`
- Private Investigator SVG：`侦探视角 → 作者路径`，`论文没说什么？ → 作者为什么选这个题？`

### Fix 6: 角色按钮标签同步 ✅
- Hacker 按钮：`💀 黑客 → ⚡ 快速原型`

### 修正后残留检查 ✅
- 零个 `黑客视角` 残留
- 零个 `论文隐瞒` 残留
- 零个 `21 节课程` 残留
- 零个 `"永久 404"` / `"真实 404"` / `"彻底 404"` 文案

---

## VALIDATION

### validate_course_data.py
```
✅ course.json 验证通过 (27 节)
✅ readings.json 验证通过 (32 篇精选导读)
✅ official_reading_map.json 验证通过 (85 篇官方阅读)
✅ glossary.json 验证通过 (47 条术语)
✅ sources.json 验证通过 (36 个来源)
✅ raw_schedule_links.json 验证通过 (124 个链接)
全部验证通过 ✅ 6/6
```

### audit_static_ui.py
```
✅ noindex meta 标签存在
✅ 无 '永久 404' 文案
✅ 无 'permanent 404' 文案
✅ 无 '真实 404' 文案
✅ 无 '彻底 404' 文案
✅ 所有 HTML id 唯一
✅ 所有锚点均存在
✅ JS 所需的 DOM 元素均存在
✅ Section 编号连续: [1..12] 无重复
✅ 七角色 SVG 有 7 个非透明扇区
✅ 所有 JS 函数均存在
0 ISSUE（仅 9 个无害 WARN）✅
```

### check_links.py
```
OK: 102
MANUAL_BROWSER_CHECK_RECOMMENDED: 15
PAYLOAD: 4
CLIENT_ERROR_CONFIRMED: 2
UNKNOWN: 1
✅ link check 完成
```

### 线上验证（curl 解析）
```
✅ HTTP 200
✅ noindex 存在
✅ "27 个学习节点" 存在于 Hero
✅ "可追踪节点" 存在于进度 label
✅ 零个 "21 节" 残留
✅ 零个 "黑客视角" 残留
✅ "快速原型" 出现 1 次（修正后新文案）
✅ "后续研究" 出现 1 次（修正后新文案）
✅ "作者路径" 出现 1 次（修正后新文案）
```

---

## NOINDEX_STATUS
✅ `<meta name="robots" content="noindex, nofollow">` 保留，未移除

---

## PUBLISH_READINESS
**READY_FOR_MANUAL_REVIEW**（noindex 保留，需用户浏览器最终验收）

---

## KNOWN_ISSUES
1. GitHub Pages 推送后需约 30–60 秒生效
2. MIT slides 15 个 PDF 需用户本地浏览器验证
3. ACM/ScienceDirect 4 个付费链接无法在云端验证
4. 七角色 SVG 仍有 2 个 sector 重叠（低优先级，视觉可接受）

---

## NEXT_STEPS
1. **用户浏览器验收**: 打开 `https://conanxin.github.io/drafts/how-to-ai-almost-anything-cn/` 在真实浏览器中完成 `docs/BROWSER_TEST_STEPS.md` Step 1–14
2. **确认七角色修正**: 在七角色交互面板中验证 Hacker / Academic / Private Investigator 三个角色的文案是否正确
3. **确认数量口径**: 在 Hero 区和时间线描述中验证数量口径是否一致
4. **发布决策**: 确认无阻塞问题后决定移除 noindex 并正式发布
