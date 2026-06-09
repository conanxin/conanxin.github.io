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
- 爸爸的 GitHub Pages 静态托管，无构建工具链
- Phase CP-1A 目标：验证内容结构、视觉方向、叙事节奏
- 重型 3D 在这个阶段引入会掩盖内容问题
- 静态原型可以快速迭代，爸爸可以直接给反馈

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
- 爸爸的技术栈偏好：简单可靠 > 炫技
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
