# DESIGN_NOTES.md — Conan AI Project Cinema (Phase CP-1A)

**Phase:** CP-1A
**Date:** 2026-06-09
**Author:** Conan Xin (via OpenClaw Agent)

---

## 1. 设计目标

为 Conan Xin 的个人 AI 项目宇宙创建一个沉浸式入口页，定位为：
**个人 AI 项目档案馆 + AI 控制塔 + 项目放映厅**

核心理念：展示"一个人如何用 AI 构建自己的知识系统"，而非展示单个项目。

---

## 2. 为什么参考 Lawted.tech 但不照抄

**Lawted.tech 的优点（值得参考）：**
- 叙事型滚动结构（scrolling narrative）
- 文字 + 视觉穿插的节奏感
- 个人化语气（不只是技术展示，有温度）
- 项目卡片 + 可点击展开的交互

**Lawted.tech 的风格（不照抄）：**
- 紫色梦境房间 + 漂浮几何体 → 太梦幻，不符合 Conan 的调性
- 过度赛博朋克化 → 与物流工程背景不符
- 整体偏"作品集展示"，缺乏"系统感"

**Conan 版本的差异：**
- 核心定位：系统 vs 作品集
- 视觉基调：深夜个人研究室 + AI OS terminal 美学
- 关键词：控制塔、档案馆、工作台、commit 感、Agent 日志
- 不需要 Lawted 的沉浸式 3D，用六幕叙事 + 平面布局达到同样叙事效果

---

## 3. Conan 版本的风格定义

**视觉关键词（CP-1A）：**
- 深色背景（#0a0b0f）
- 技术浪漫（IBM Plex Mono + Noto Sans SC）
- 项目档案馆（卡片网格 + 项目状态标签）
- 终端窗口（模拟真实终端输出）
- Agent 日志流（commit hash + PASS/REVIEW 状态）
- 控制塔（VPS 健康监测 + 项目星图）
- 轻微电影感（扫描线叠加 + 淡入动画）

**明确排除：**
- ❌ Lawted 的紫色梦境房间风
- ❌ 过度赛博朋克（霓虹文字、故障艺术）
- ❌ 游戏 UI 化（血条、血块、华丽光效）
- ❌ 重型 3D（Spline、React Three Fiber、Three.js）

---

## 4. 六幕叙事结构

| 幕 | 标题 | 中文方向 | 视觉锚点 |
|----|------|---------|---------|
| 01 | Complex Ideas | 论文/书籍/截图/想法 → 讲清楚 | 书页/论文卡片浮动 |
| 02 | AI Beyond Chat | AI 进入文档/网页/终端/项目流 | 对话→终端窗口+GitHub commit |
| 03 | Projects Become Artifacts | 想法→可打开/阅读/运行/复盘的产物 | 项目卡片网格（6类） |
| 04 | Agents Join the Workflow | 设计理由+影响分析+代码/文档/测试 | Agent 节点流+状态标签 |
| 05 | Control Tower | 孤立项目→系统（阅读/翻译/发布/Agent/VPS/广播） | 控制塔面板+项目星图 |
| 06 | Archive Entrance | 不是简历，是持续生长的档案馆 | CTA 四卡片 |

**叙事逻辑：**
从"个人知识生产者"出发 → 演进到"AI 工具使用者" → 沉淀为"项目产物" → 升级到"Agent 工作流" → 系统化为"控制塔" → 邀请进入"档案馆"

---

## 5. 技术选择理由

**为什么只用 HTML + CSS + 少量 JS：**
- the GitHub Pages static hosting environment，无构建工具链
- Phase CP-1A 目标：验证内容结构、视觉方向、叙事节奏
- 重型 3D 在这个阶段引入会掩盖内容问题
- static prototypes enable rapid iteration and direct feedback

**JS 功能设计为轻量：**
- `IntersectionObserver` 做滚动淡入（~15行）
- `prefers-reduced-motion` 媒体查询支持
- 点击展开用原生 JS，无框架依赖
- 鼠标滚轮横向滚动 agent strip

**字体选择：**
- `IBM Plex Mono` — 终端感 + 技术浪漫
- `Noto Sans SC` — 中文友好，阅读舒适

---

## 6. 本阶段为什么不引入重型 3D

**时机原因：**
CP-1A 是内容结构验证阶段，不是视觉炫技阶段。3D 会模糊核心问题：我们讲什么故事？用户看到什么价值？

**架构原因：**
- GitHub Pages 静态托管，引入 Three.js/Spline 需要 CDN 依赖
- the technical stack preference：简单可靠 > 炫技
- 重型 3D 的加载时间影响体验，尤其在移动端

**内容原因：**
六幕叙事 + 终端窗口 + 项目卡片已经足够"电影感"，不需要 3D 来撑氛围

---

## 7. 后续 Phase CP-1B / CP-2 建议

### CP-1B（下一阶段）
- 引入 CSS 动画增强场景过渡（parallax 效果）
- 丰富 terminal 窗口内容（更真实的 commit log）
- 增加项目星图的交互（悬停显示项目状态）
- 完善 Control Tower 的数据可视化
- 加入项目页面的实际截图占位区

### CP-2（中期）
- 如果需要 3D 效果，引入轻量 Three.js 或 CSS 3D transform
- 接入 projects/data.json 动态渲染项目卡片
- 加入 Agent 执行日志的实时展示（需要后端支持）
- 增加暗色/亮色模式切换
- 移动端适配优化

### 禁止事项（防止风格漂移）
- 不引入 Lawted 风格的紫色渐变
- 不引入游戏化 UI（经验条、血量条等）
- 不引入过度动画（超过 500ms 的入场动画）
- 不引入 React/Vue 等前端框架

---

## 8. 修改影响分析

**本阶段修改范围（CP-1A）：**
- ✅ 新增目录：`drafts/conan-ai-project-cinema/`
- ✅ 新增文件：`index.html`, `styles.css`, `app.js`, `DESIGN_NOTES.md`
- ✅ 无修改：`projects/data.json`（完全不动）
- ✅ 无修改：`projects/` 下任何现有文件
- ✅ 无修改：`drafts/` 下任何现有文件
- ✅ 无修改：根目录任何配置

**SEO 影响：**
- `<meta name="robots" content="noindex, nofollow">` 已加入
- 页面不会进入 Google 索引
- 不影响现有项目的搜索排名

**git 影响：**
- 新增 4 个文件，总计约 35KB
- 不影响历史 commit
- 不触发 CI/CD（静态页面）

**风险评估：**
- 风险等级：LOW（纯新增，无破坏性修改）
- 降级方案：删除整个目录即可回滚

---

## 9. 验收标准（CP-1A）

- [x] `index.html` 包含 `noindex` meta 标签
- [x] `projects/data.json` 未被修改
- [x] 页面包含六幕叙事（01-06）
- [x] 页面包含 Hero、Artifact Grid、Agent Strip、Control Tower、CTA、Credits
- [x] JS 实现：滚动进度条、淡入动画、卡片展开、reduced motion 支持
- [x] 页面明显标记 Draft Review Prototype
- [x] `git status` 无意外变更
- [x] 页面在本地可预览

---

*Design notes by 辛 🔮 — Phase CP-1A*

---

## CP-1B 小节 — Content Truthfulness + Artifact Upgrade

**Phase:** CP-1B
**Date:** 2026-06-09
**Status:** PASS

### 本阶段目标

把 CP-1A 的电影化静态原型升级为更可信、更像真实项目档案馆的 draft 页面。重点不是加 3D，不是换技术栈，而是修正示意数据、接入真实项目线索、增强 artifact 感和页面可信度。

### 为什么先做真实性升级，而不是加 3D

**优先级判断：**
1. **内容可信度 > 视觉炫技** — 如果页面里的数据看起来像假的，3D 再炫也没用
2. **真实项目链接 > 虚构链接** — 读者点击项目卡可以跳到真实页面，才有价值
3. **技术栈稳定 > 功能扩展** — 静态 HTML 的稳定性在这个阶段比 3D 效果重要
4. **The project owner's direct feedback** — Real data enables judgment of whether the direction is correct

**结论：** CP-1B 的投资回报率（ROI）比 CP-1C 的 3D 升级高得多。先把内容做实，再考虑视觉增强。

### 哪些数据被标记为 sample / concept

| 原始数据 | 修正后 | 原因 |
|---------|--------|------|
| `a3f9c21 / b7e1d44 / c2a8f09` | 保留真实 commit hash（db269fc 等），内容标注为 sample | 无法确认是否真实 commit，加 sample 标注 |
| `99.7% uptime` | 删除 | 误导性 live metric |
| `26 projects` | `~26` + "concept count" | 近似真实但不可确认 |
| `3 events today` | 删除，替换为 "6 concept signals" | 无法确认 live 数量 |
| `Health OK` | "Concept Preview — Not Live Data" | 误导性 live metric |
| Event log timestamps | 全部替换为 "sample" | 无法确认真实性 |
| BookTrans / ExplainLens cards | 改为 `status-private` + 虚线边框 | 当前不是公开页面入口 |

### 哪些项目被确认是真实 artifact

| 项目名 | 类型 | URL | 状态 |
|--------|------|-----|------|
| how-to-ai-almost-anything-cn | Page/Tool | `/projects/how-to-ai-almost-anything-cn/` | shipped |
| wwdc26-keynote | Report | `/projects/wwdc26-keynote/` | shipped |
| hermes-lofi-skill | Tool | `/projects/hermes-lofi-skill/` | active |
| uap-files | Archive | `/projects/uap-files/` | active |
| internet-builder-archive | Page | `/projects/internet-builder-archive/` | shipped |
| conanxin.github.io (数字花园) | Archive | `/` | shipped |
| articles/ (ai-makes-coding-easier 等) | Article | `/articles/ai-makes-coding-easier.md` 等 | published |
| research/ (agent-reach-setup-summary 等) | Report | `/research/agent-reach-setup-summary.md` 等 | published |

### BookTrans / ExplainLens 状态修正

> CP-1C-Hotfix: 已将 BookTrans / ExplainLens 从 concept 修正为 private / internal / not public yet。
> 与 `artifacts.js` 中 `visibility: 'internal'` 保持一致，不虚构公开链接。

### CTA 链接检查

| CTA | URL | 验证结果 |
|-----|-----|---------|
| Explore Projects | `https://conanxin.github.io/projects/` | ✅ 真实入口 |
| Visit GitHub | `https://github.com/conanxin/conanxin.github.io` | ✅ 真实仓库 |
| Read Notes | `https://conanxin.github.io/articles/` | ✅ 真实目录 |
| Follow on X | `https://x.com/conanxin` | ✅ 真实账号 |

### Agent Workflow Strip 升级说明

**升级内容：**
- 移除 `an-hash`（fake commit hash）
- 增加 `an-desc` — 每个 Agent 的具体职责描述
- 状态从 `PASS/REVIEW` 改为 `active/review`（更准确）

**职责定义：**
- **OpenClaw** — 本地/云端 Agent 执行 · 项目推进 · 文件修改 · 阶段验收
- **Hermes** — 项目编排 · 报告沉淀 · 工作区管理 · GitHub Pages 发布辅助
- **Codex** — 代码级修改 · 测试 · 构建 · 局部实现 · 技术方案落地
- **Phase Report** — 用人能理解的语言复述系统当前状态 · 设计理由 · 修改影响 · 验证结果

### Control Tower 区域处理

**处理方式：**
- 标题改为 "Personal AI Control Tower"（去掉 "VPS" 避免误导）
- 所有 live metric 改为 concept preview 语义
- 状态标签改为 "Concept Preview — Not Live Data"
- 所有数值加 `~` 前缀或注明 "concept count"
- Event log 全部标注为 "sample" 信号
- Constellation 节点从虚构名称改为真实项目名（how2ai, hermes-lofi, internet-builder, uap-files, github-pages, digital-garden）

### Artifact Grid 新增内容

**新增 Scene 06 — Artifact Archive 区域：**
- 8 个真实 artifact 卡片（带真实 href 链接）
- 类型标签：Report / Page / Tool / Article / Archive
- 每个卡片包含：类型 / 标题 / 来源项目 / 说明 / 状态
- 筛选栏（视觉元素，CP-1B 为 static）

### 移动端处理

**CP-1B 新增：**
- 375px 宽度下：artifact grid → 1 列；CTA → 2×2 网格
- `*:focus-visible` 键盘可访问性样式
- 移动端触摸目标最小 44px 保障
- 保留了 reduced motion 逻辑

### 修改影响分析

| 修改范围 | 结果 |
|----------|------|
| `projects/data.json` | ❌ 未触碰 |
| 现有 `projects/*` | ❌ 未触碰 |
| 现有 `drafts/*` | ❌ 未触碰 |
| 根目录配置 | ❌ 未触碰 |
| `index.html` | ✅ 升级（保持 noindex） |
| `styles.css` | ✅ 增强（新增类，无破坏） |
| `app.js` | ❌ 未改动 |
| 风险等级 | **LOW** |

### 后续 CP-1C 建议

**优先级排序：**

1. **CP-1C-1：项目卡片接入 `projects/data.json`** — 从 JSON 动态渲染真实项目列表，而不是硬编码
2. **CP-1C-2：Terminal 窗口内容真实化** — 接入真实 GitHub commit log 或 agent 执行日志
3. **CP-1C-3：Constellation 交互增强** — 悬停显示项目状态，点击跳转真实页面
4. **CP-1C-4：移动端完整适配** — 全宽 hero、触摸交互、竖屏布局
5. **CP-1C-5：暗色/亮色模式切换** — CSS 变量驱动，一键切换

**禁止事项（保持不变）：**
- 不引入 Spline / Three.js / React Three Fiber
- 不引入 Next.js / Vite / Tailwind 构建链
- 不引入 Lawted 紫色梦境风
- 不破坏六幕叙事结构

---

*Design notes by 辛 🔮 — Phase CP-1B*

---

## CP-1C 小节 — Data Layer + Release Candidate Polish

**Phase:** CP-1C
**Date:** 2026-06-09
**Status:** PASS

### 本阶段目标

把 CP-1B 的手写 HTML 项目卡片和 Artifact Archive 升级为数据驱动结构，降低后续维护成本，并增强 Artifact Archive 的筛选交互和发布候选质量。

### 为什么先做数据层，而不是 3D / GitHub API

**优先级判断：**
1. **数据层是所有后续功能的基础** — 没有数据驱动，CP-1D 的动态 constellation、filter、real-time log 都无法实现
2. **维护成本 > 炫技** — 每加一个项目都要手动改 HTML，维护成本线性增长；数据层一次性投入
3. **GitHub API 实时 log 有 token 限制** — 当前项目没有持久 API token，不适合在这个阶段引入
4. **3D 效果在这个阶段仍为时过早** — 内容结构和数据结构未稳定前，3D 会成为维护负担

**结论：** 数据层是 CP-1B 之后 ROI 最高的投入。数据结构稳定后，CP-1D 引入任何新功能都更快。

### artifacts.js 数据结构说明

**顶层结构：**
```javascript
window.CP_ARTIFACTS = {
  projects:    [...],  // Scene 03 project cards
  artifacts:   [...],  // Scene 06 artifact archive cards
  constellation: [...], // Scene 05 constellation nodes
  constellationLines: [...] // SVG line coordinates
}
```

**projects[] 每项字段：**
- `id` — 唯一标识符（用于 data-id）
- `name` — 显示名称
- `tag` — 标签文字（如仓库名）
- `status` — 状态：`shipped` | `active` | `alpha` | `private`
- `visibility` — `public` | `internal`
- `href` — 链接（internal 项目为空字符串）
- `description` — 一句话说明

**artifacts[] 每项字段：**
- `id` — 唯一标识符
- `type` — 类型：`Page` | `Tool` | `Report` | `Article` | `Archive`
- `title` — 标题
- `source` — 来源项目
- `status` — 状态文本
- `visibility` — `public` | `internal`
- `href` — 链接
- `description` — 一句话说明

**constellation[] 每项字段：**
- `id` — 节点标识
- `label` — 显示标签
- `cx` / `cy` — CSS 百分比位置

### 哪些内容从 HTML 迁移到了数据层

| 区域 | CP-1B | CP-1C |
|------|-------|-------|
| Scene 03 project cards | 9 个手写 HTML `<a>` / `<div>` | `artifacts.js → projects[]` 渲染 |
| Scene 06 artifact cards | 9 个手写 HTML `<a>` | `artifacts.js → artifacts[]` 渲染 |
| Scene 05 constellation | 6 个手写 HTML `<div>` | `artifacts.js → constellation[]` 渲染 |
| Scene 05 SVG lines | 内联 SVG | `artifacts.js → constellationLines[]` 渲染 |
| Filter bar | 静态 span（无交互）| 动态 `button` + JS filter 逻辑 |

### Filter 交互设计

**7 个筛选类别：**
- `All` — 显示所有 public artifacts（默认）
- `Page` — 类型为 Page
- `Tool` — 类型为 Tool
- `Report` — 类型为 Report
- `Article` — 类型为 Article
- `Archive` — 类型为 Archive
- `Internal` — visibility=internal 的项目（BookTrans / ExplainLens）

**交互行为：**
1. 点击 filter chip → 更新 active 状态
2. 过滤 artifacts 数组 → 重新渲染 grid
3. 结果为 0 时显示空状态提示
4. `All` 恢复全部可见 public artifacts
5. 移动端 filter bar 横向滚动

### 真实性边界

| 规则 | 说明 |
|------|------|
| External links | 自动加 `target="_blank" rel="noopener noreferrer"` |
| Private/Internal 项目 | `href=""` 不生成 `<a>`，显示为 `<div>` |
| Terminal commit hash | 改为 CP-1C 真实 commit：`68a4133 / c224ff0 / db269fc` |
| Control Tower 数据 | 仍然是 concept preview，不做真实 live monitoring |
| BookTrans / ExplainLens | `visibility: 'internal'` — 只在 Internal filter 下显示 |

### 对 CP-1B 的影响

### CP-1C-Hotfix 小节

**Phase:** CP-1C-Hotfix
**Date:** 2026-06-09
**Status:** PASS

**修复内容：**
1. `DESIGN_NOTES.md` 中所有私人称呼 → `project owner` / `当前项目`
2. CP-1B 小节 BookTrans/ExplainLens 从 concept 改为 private / internal / not public yet
3. Internal filter 新增 `type: 'Internal'` artifacts，确保 BookTrans/ExplainLens 可通过 filter 查看
4. Terminal commit hash `68a4133` → `234daa0`
5. 无 href 的 artifact card 改为 `<div>` 而非 `<a>`，避免空链接

---

**CP-1B → CP-1C 升级内容：**
- 9 个 project cards 从静态 HTML → 数据驱动渲染
- 9 个 artifact cards 从静态 HTML → 数据驱动渲染
- 6 个 constellation nodes 从静态 HTML → 数据驱动渲染
- 筛选栏从静态 → 交互式（7 个 filter）

**CP-1B 保留内容：**
- 六幕叙事文案（完全不变）
- Agent Workflow Strip（完全不变）
- Control Tower 面板结构（完全不变）
- 所有视觉样式（完全不变）
- 滚动动画 / reduced motion / 展开 tooltip

### 修改影响分析

| 修改范围 | 结果 |
|----------|------|
| `projects/data.json` | ❌ 未触碰 |
| `projects/*` | ❌ 未触碰 |
| `drafts/*`（除本目录外）| ❌ 未触碰 |
| `index.html` | ✅ 重写（JS 渲染容器，保留所有文案）|
| `styles.css` | ✅ 增强（filter chips + empty state + external link）|
| `app.js` | ✅ 完全重写（数据渲染 + filter 交互）|
| `artifacts.js` | ✅ 新增（数据常量）|
| `DESIGN_NOTES.md` | ✅ 追加 CP-1C 小节 |
| 风险等级 | **LOW** |

### 后续 CP-1D 建议

**推荐顺序：**
1. **动态 constellation** — 接入 `projects/data.json` 动态节点，悬停显示状态，点击跳转
2. **Terminal 真实化** — 接入 GitHub API 真实 commit log（或保留 static）
3. **移动端完整适配** — 全宽 hero、触摸交互优化
4. **暗色/亮色模式切换** — CSS 变量驱动
5. **搜索/过滤项目名** — 轻量 JS 搜索框

**不变红线（继续保持）：**
- 不引入 Spline / Three.js / React Three Fiber
- 不引入 Next.js / Vite / Tailwind / React / Vue
- 不引入 GitHub API 实时 token（除非后续配置了持久 API key）
- 不虚构 live monitoring 数据

---

*Design notes by 辛 🔮 — Phase CP-1C*

---

## CP-1D 小节 — Release Candidate Polish

**Phase:** CP-1D
**Date:** 2026-06-09
**Status:** PASS

### 本阶段目标

把 CP-1C 的数据驱动 draft 页面打磨成接近可公开发布的 Release Candidate Draft。重点：搜索体验、移动端、星图交互、发布前检查质量。

### 为什么做搜索而不是 3D / GitHub API

**优先级判断：**
1. **探索体验是档案馆的核心** — 用户来到页面，第一个问题是"这里有什么"，搜索比 3D 星图先回答这个问题
2. **移动端可用性决定第一印象** — 主要流量可能来自手机端，3D 动效在移动端反而是负担
3. **GitHub API 需要 token** — 当前环境没有持久 API key，接入会引入 auth 复杂性
4. **数据稳定后才做展示层** — 数据结构在 CP-1C 已稳定，CP-1D 做展示层优化最合时宜

### artifacts.js 变更（CP-1D）

**Constellation 节点增强：**
- 每个节点新增 `href` / `description` / `status` 字段
- 不再是纯装饰节点，而是可点击导航
- Internal 节点（无 href）显示为不可点击状态

### 新增功能

**1. Artifact Search（搜索框）：**
- 搜索范围：`title` + `type` + `source` + `status` + `description`
- 与 filter chip 联动：先选 Tool，再搜索 claim → 只显示 ClaimLens
- ESC 清空 / Clear 按钮
- 无结果时显示 empty state

**2. Constellation 交互增强：**
- Hover/Focus 显示 tooltip：label + status + description + Open 链接
- 内部链接同页打开；外部链接新标签页
- Internal 节点 tooltip 显示 "internal · no public link"
- 键盘可聚焦（`tabindex` + Enter/Space）
- 点击外部关闭 tooltip

**3. 移动端 Polish：**
- Hero 标题 clamp 优化（375px 不溢出）
- Search row 全宽 + 横向滚动 filter
- CTA 2×2 网格（400px）
- Constellation tooltip viewport 边界 clamp

### Release Candidate Checklist

| 检查项 | 状态 |
|--------|------|
| noindex retained | ✅ |
| draft path retained | ✅ |
| projects/data.json untouched | ✅ |
| no new framework | ✅ |
| no 3D dependency | ✅ |
| data-driven artifacts | ✅ |
| search enabled | ✅ |
| constellation interactive | ✅ |
| mobile checked | ✅ |
| ready for CP-1E publish decision | Pending |

### 修改影响分析

| 修改范围 | 结果 |
|----------|------|
| `projects/data.json` | ❌ 未触碰 |
| `projects/*` | ❌ 未触碰 |
| 六幕叙事文案 | ❌ 未触碰 |
| 六幕视觉结构 | ❌ 未触碰 |
| `artifacts.js` | ✅ 增强 constellation 节点字段 |
| `app.js` | ✅ 新增 search + constellation 逻辑（约 350 行）|
| `styles.css` | ✅ 新增 search/tooltip/mobile 样式 |
| `index.html` | ✅ 新增 search UI + tooltip 容器 + badge 升级 |
| 风险等级 | **LOW** |

### 后续 CP-1E 建议

**CP-1E（Publish Decision）：**
- 从 `drafts/conan-ai-project-cinema/` 迁移到 `/projects/conan-ai-project-cinema/`
- 加入 `projects/data.json`
- 移除 `noindex, nofollow`
- 确认 GitHub Pages 发布路径
- 确认是否可以公开访问

**CP-1D 之后可选优化（如需）：**
1. 暗色/亮色模式切换（CSS 变量驱动）
2. Terminal 真实化（GitHub API commit log）
3. 移动端 PWA 支持（manifest.json）
4. 项目页面截图预览（懒加载）

---

*Design notes by 辛 🔮 — Phase CP-1D*

---

## CP-1E 小节 — Publish Decision + Project Promotion

**Phase:** CP-1E
**Date:** 2026-06-09
**Status:** PASS

### 本阶段目标

将 Conan AI Project Cinema 从 draft 页面发布为正式项目页。采用 copy publish：保留 draft 页面不动，新增正式页面到 `/projects/conan-ai-project-cinema/`。

### 为什么采用 copy publish，而不是移动 draft

**copy publish 的理由：**
1. **保留审计线索** — draft 页面记录了完整的 phase 历史，不删除
2. **降低回滚风险** — 如果正式页面出现问题，draft 仍在，秒级回滚
3. **保持 noindex 保护** — draft 继续被 noindex 保护，不会意外被搜索引擎索引
4. **并行展示** — 用户可以同时看到 draft（需 noindex）和正式版

**移动 publish 的缺点：**
- 丢失 phase 历史（旧的 commit 不会跟随新路径）
- 回滚需要重新复制文件
- noindex 的状态需要手动维护

### draft 与 public page 的区别

| 项目 | draft (`/drafts/...`) | public (`/projects/...`) |
|------|----------------------|-------------------------|
| robots meta | `noindex, nofollow` | `index, follow` |
| badge | `Phase CP-1D` | `Published · Conan AI Project Cinema` |
| watermark | `Draft Review Prototype` | `Interactive Project Archive` |
| credits | `Draft Phase CP-1D` | `Public Release · Phase CP-1E` |
| 功能 | 完全相同 | 完全相同 |
| 数据层 | 完全相同 | 完全相同 |

### noindex 处理说明

- **draft 页面：** 保留 `noindex, nofollow`，不进入搜索引擎索引
- **正式页面：** 改为 `index, follow`，可被搜索引擎发现
- 两个版本代码完全相同，只差 robots meta

### projects/data.json 新增条目说明

**新增条目字段：**
- `title`: "Conan AI Project Cinema"
- `slug`: "conan-ai-project-cinema"
- `type`: "INTERACTIVE PROJECT ARCHIVE"
- `status`: "已上线"
- `entry_url`: "/projects/conan-ai-project-cinema/"
- `summary`: 完整描述项目功能
- `tags`: AI / Agent / OpenClaw / Hermes / GitHub Pages / Project Archive 等

### 保留 internal/private 边界说明

**BookTrans / ExplainLens 保持不变：**
- `visibility: 'internal'`
- 无公开 href
- `status: 'private'`
- 只在 Internal filter 下可见
- 不因正式发布而改变边界

**ClaimLens：**
- `visibility: 'public'`
- `status: 'alpha · human-reviewable'`
- 有公开 GitHub 链接

### 修改影响分析

| 修改范围 | 结果 |
|----------|------|
| `drafts/conan-ai-project-cinema/` | ❌ 未触碰 |
| `projects/data.json` | ✅ 新增 1 条目 |
| `projects/conan-ai-project-cinema/` | ✅ 新增 5 个文件（基于 CP-1D 复制）|
| 现有 `projects/*` | ❌ 未触碰 |
| 风险等级 | **LOW** |

### 后续 CP-2 建议

**CP-2（Publish Aftermath）：**
1. 监控正式页面访问量和搜索收录情况
2. 评估是否需要社交分享预览（OG meta）
3. 考虑是否需要 Sitemap 更新
4. 评估是否需要 README 更新

**长期规划（如需）：**
- Terminal 真实化（GitHub API commit log）
- 暗色/亮色模式切换
- 移动端 PWA 支持

---

*Design notes by 辛 🔮 — Phase CP-1E*

---

## CP-2A 小节 — Sharing & Discovery Polish

**Phase:** CP-2A
**Date:** 2026-06-09
**Status:** PASS

### 本阶段目标

让正式页面更适合被分享、预览、索引和介绍。重点是传播质量，不是新功能。

### 新增内容

**1. Open Graph meta（正式页）：**
- `og:title` — "Conan AI Project Cinema"
- `og:description` — 中英双语描述
- `og:type` — "website"
- `og:url` — 正式页面 URL
- `og:image` — 1200×630 分享图
- `og:site_name` — "Conan Xin"

**2. Twitter Card meta：**
- `twitter:card` — "summary_large_image"
- `twitter:site` — "@conanxin"
- `twitter:title` / `twitter:description` / `twitter:image` — 同 OG

**3. 分享图：**
- 文件：`/projects/conan-ai-project-cinema/og-image.png`
- 尺寸：1200×630px
- 风格：深夜研究室 × AI OS × 项目档案馆

**4. Sitemap 更新：**
- 已将 `/projects/conan-ai-project-cinema/` 加入 `sitemap.xml`

### 修改影响分析

| 修改范围 | 结果 |
|----------|------|
| `drafts/conan-ai-project-cinema/` | ❌ 未触碰 |
| `projects/data.json` | ❌ 未触碰 |
| `app.js` / `artifacts.js` | ❌ 未触碰 |
| `index.html`（public）| ✅ 新增 OG + Twitter meta |
| `og-image.png` | ✅ 新增分享图 |
| `sitemap.xml` | ✅ 新增条目 |
| 风险等级 | **LOW** |

---

*Design notes by 辛 🔮 — Phase CP-2A*

---

## CP-3A 小节 — Cinematic Experience Upgrade

**Phase:** CP-3A
**Date:** 2026-06-09
**Status:** PASS

### 为什么继续开发

CP-2B 完成了 Public Release Base，但页面还停留在"可用的项目档案页"阶段，未达到最初设定的 Lawted-inspired 沉浸体验目标。CP-3A 要让页面从"可用"升级为"可体验"。

### 为什么 CP-2B 不是最初目标终点

**Public Release Base（CP-2B）：** 确认了技术架构、数据层、分享元数据、文档建设。功能完整，视觉仍像普通项目页面。

**Cinematic Experience（CP-3A+）：** 目标是用六幕叙事结构 + 视觉分镜 + 空间层次感，让访客感受到"深夜个人研究室 + AI 控制台"的氛围。

### CP-3A 新增视觉模块

| 模块 | 说明 |
|------|------|
| Command Desk（Hero）| 四个浮动状态面板（SYSTEM / AGENTS / ARTIFACTS / SIGNAL），营造 AI 工作台感 |
| Signal Grid | CSS-only 网格背景氛围层 |
| Scene Visual Anchors | 每一幕有独立的视觉锚点区（pipeline / conveyor / fragments）|
| Scene Navigator | 固定左侧边栏，滚动时高亮当前章节，可点击跳转 |
| Archive Console Header | Archive 区域顶部控制台标题栏 |

### 交互影响

- Scene Navigator 依赖 scroll 事件，IntersectionObserver 同理
- `safeRun` 保护：任意交互失败时 `revealAllScenesFallback()` 保底
- reduced motion：`prefers-reduced-motion` 时 Scene Navigator 滚动行为改为 `auto`
- 无性能影响（所有动画 CSS-only，JS 仅负责交互状态）

### 性能与移动端边界

- Scene Navigator 仅在 `min-width: 1100px` 显示，窄屏自动隐藏
- Command Desk 在移动端自动降级为 2×2 紧凑布局
- Scene Visual Anchors 在移动端保持可读，不强制缩小字号
- 所有动画使用 CSS `transform`/`opacity`，不触发重排

### 修改影响分析

| 修改范围 | 结果 |
|----------|------|
| `drafts/conan-ai-project-cinema/` | ❌ 未触碰 |
| `projects/data.json` | ❌ 未触碰 |
| `app.js` | ✅ 新增 scene navigator + BOOT 更新 |
| `index.html` | ✅ 新增 scene nav + hero panels + scene visuals + archive header |
| `styles.css` | ✅ 新增 cinematic styles |
| 风险等级 | **LOW** |

---

*Design notes by 辛 🔮 — Phase CP-3A*

---

## CP-3B 小节 — Artifact Preview Wall + Featured Project Strip

**Phase:** CP-3B
**Date:** 2026-06-09
**Status:** PASS

### 为什么做 Featured Strip / Preview Wall

CP-3A 完成了 Hero 空间感和 Scene Visual Anchors，但访客仍然没有一个"一眼看到最重要项目"的入口。Featured Strip + Preview Wall 补足这个缺口，把页面从"可探索"升级为"可浏览"。

### 如何继续补"项目放映厅"缺口

**Featured Strip（Hero 之后）：** 3 张大卡片展示最核心项目（Project Cinema自身 / ClaimLens / WWDC26）
**Preview Wall（Archive 上方）：** 横向滚动预览墙，6 张卡片展示全部主要项目

### 数据结构变化

`artifacts.js` 新增两个顶级数组：
- `window.CP_ARTIFACTS.featured` — 3 个 featured 项目
- `window.CP_ARTIFACTS.previews` — 6 个 preview wall 项目

不虚构链接：external 项目用 `target="_blank"`，internal 项目不生成假 href。

### 交互影响

- `renderFeaturedProjects()` / `renderPreviewWall()` 均为 safeRun 保护
- 数据缺失时不报错、不留空白（if (!data) return）
- Preview Wall 横向滚动（`overflow-x: auto`），移动端降级为一列
- Featured Strip 在 768px 以下变为单列

### 性能与移动端边界

- 无额外网络请求，纯 JS 渲染
- Preview Wall 使用 CSS `overflow-x: auto`，无 JS 滚动监听
- 移动端触摸目标 ≥ 44px
- 无水平溢出

### 修改影响分析

| 修改范围 | 结果 |
|----------|------|
| `drafts/conan-ai-project-cinema/` | ❌ 未触碰 |
| `projects/data.json` | ❌ 未触碰 |
| `artifacts.js` | ✅ 新增 featured + previews 数据 |
| `index.html` | ✅ 新增 featured strip + preview wall HTML |
| `app.js` | ✅ 新增两个渲染函数 + BOOT 更新 |
| `styles.css` | ✅ 新增 CP-3B 全部样式 |
| 风险等级 | **LOW** |

---

*Design notes by 辛 🔮 — Phase CP-3B*

---

## CP-3C 小节 — Cinematic Depth + CSS-only Parallax

**Phase:** CP-3C
**Date:** 2026-06-09
**Status:** PASS

### 为什么做 CSS-only parallax，而不是 Three.js / Spline

Three.js 和 Spline 会引入重型依赖和额外的学习/维护成本。CSS-only parallax可以在纯静态环境下实现 90% 的视觉深度效果，剩余 10% 用 JavaScript 微调覆盖，且完全不破坏现有功能。

### Cinematic Depth Layer 说明

全局固定层（`position: fixed`），`aria-hidden="true"`，`pointer-events: none`，不影响可访问性。

包含：
- **3 个 depth orbs** — 大型模糊光球，CSS `animation: orbDrift`缓慢漂移，营造空间感
- **1 个 depth grid** — 极淡网格叠加，增加"控制台底纹"感

### active scene / data-active-scene 说明

`initSceneNavigator()` 的 `setActive()` 函数在每次滚动时同时：
1. 更新 scene navigator 高亮
2. 设置 `document.documentElement.dataset.activeScene = currentId`

CSS 选择器 `[data-active-scene="scene-XX"]` 据此为当前 scene 的 `.scene::before` 添加顶部光条。

### Cinematic Parallax

`initCinematicDepth()` 在滚动时通过 `requestAnimationFrame` 更新根元素 CSS变量 `--cinema-scroll-progress`（0~1 浮点数），驱动：
- `.signal-grid` 的 `translateY()` 微位移
- `.scene-visual` 的微垂直位移

无性能损耗（CSS 变量由 JS 写入一次，GPU 处理后续动画）。

### Reduced Motion 边界

`prefers-reduced-motion: reduce` 时：
- depth layer 完全隐藏
- orbDrift 动画停止
- parallax 变换取消
- 所有 transition 取消
- scene top highlight 取消
- light sweep 取消

### 性能影响

| 项目 | 影响 |
|------|------|
| Depth layer | CSS only，paint only，paint 触发时 GPU 加速 |
| Parallax JS | `requestAnimationFrame` 节流，每帧最多一次 DOM写入 |
| CSS variable | 极低开销 |
| 结论 | **LOW RISK** |

### 修改影响分析

| 修改范围 | 结果 |
|----------|------|
| `drafts/conan-ai-project-cinema/` | ❌ 未触碰 |
| `projects/data.json` | ❌ 未触碰 |
| `artifacts.js` | ❌ 未触碰 |
| `index.html` | ✅ 新增 depth layer + phase 更新 |
| `app.js` | ✅ 新增 initCinematicDepth() + dataset增强 |
| `styles.css` | ✅ 新增 depth / parallax / reduced-motion |
| 风险等级 | **LOW** |

### CP-3D 建议

1. **Terminal 真实 log**（static sample 保持，不接 API）
2. **暗色/亮色模式切换**（CSS 变量驱动）
3. **Scene-level CSS animation** — 每幕入场时有一个微小 keyframe 动画
4. **PWA manifest** — offline 可用性
5. **或：CP-3D 之后正式封版，监控真实用户行为**

---

*Design notes by 辛 🔮 — Phase CP-3C*
