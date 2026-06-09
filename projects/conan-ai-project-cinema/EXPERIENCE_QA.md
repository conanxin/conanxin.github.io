# Conan AI Project Cinema — Experience QA

**创建时间：** 2026-06-09
**Phase：** CP-3E
**目标：** 最终体验 QA，确认页面已接近最初设定目标

---

## 最初目标（对照）

> **深夜个人研究室 × AI 操作系统 × 项目放映厅 × Agent 控制塔 × 项目档案馆**

| 维度 | 目标 | 当前状态 |
|------|------|---------|
| 深夜个人研究室感 | 深色背景 + 氛围光效 + 桌面层次感 | ✅ Hero Command Desk / Signal Grid / Depth Orbs |
| AI 操作系统感 | 多层控制台 + 状态信号 + 数据面板 | ✅ Agent Strip / Control Tower / Command Desk |
| 项目放映厅感 | Featured Strip + Preview Wall + 卡片预览 | ✅ Featured3 cards + Preview Wall 6 cards |
| Agent 控制塔感 | 四阶段工作流 + 状态指示 | ✅ Agent Strip (OpenClaw→Hermes→Codex→Phase Report) |
| 项目档案馆感 | 六幕叙事 + Artifact Archive + 搜索筛选 | ✅ 6 scenes + Archive + Search/Filter |
| 叙事节奏感 | Chapter kicker + 分层入场 + Story Bridge | ✅ Scene kickers × 6 + Story Bridge + Layered entry |
| 空间层次感 | Cinematic depth + parallax + active scene highlight | ✅ Depth orbs + CSS parallax + scene top highlight |

---

## 桌面端体验检查（1280px+）

| 检查项 | 状态 | 备注 |
|--------|------|------|
| Hero 首屏可见 | ✅ | Command Desk / Signal Grid / Badge 均正常 |
| Hero badge 不遮挡标题 | ✅ | z-index: 100 |
| Command Desk 面板 hover 效果 | ✅ | 微位移 + 边框变亮 |
| Featured Strip 3张卡片 | ✅ | 网格布局，hover 有 light sweep |
| Preview Wall 横向滚动 | ✅ | CSS overflow-x: auto |
| Scene 01-06 叙事结构 | ✅ | Chapter kicker + Number + Heading + Body |
| Story Bridge 可见 | ✅ | Hero→Featured→Scene 01 连接线 |
| Scene Navigator 固定左侧 | ✅ | 1100px+ 显示，短标题+hover tooltip |
| Active Scene 高亮 | ✅ | scene top highlight + navigator active |
| Constellation tooltip | ✅ | Hover 显示 label/description/Open |
| Constellation click跳转 | ✅ | 内链同页，外链新标签 |
| Artifact Archive搜索 | ✅ | ESC 清空，即时过滤 |
| Artifact Archive filter chips | ✅ | All/Page/Tool/Report/Article/Archive/Internal |
| Scroll progress bar | ✅ | 顶部细条 |
| SafeRun fallback | ✅ | revealAllScenesFallback() 保底 |
| OG/Twitter meta | ✅ | og-image.png 1200×630 |
| noindex | ❌ 正式页无，draft 有 | ✅ 正确 |

---

## 移动端体验检查（375px / 480px）

| 检查项 | 375px 状态 | 备注 |
|--------|-----------|------|
| Hero badge 不遮挡标题 | ✅ | 小屏下仍可见 |
| Command Desk 紧凑布局 | ✅ | 2×2 grid, smaller padding |
| Featured Strip 单列 | ✅ | grid-template-columns: 1fr |
| Preview Wall 单列 | ✅ | flex-direction: column |
| Story Bridge 可读 | ✅ | 768px 以上隐藏（desktop only）|
| Scene kicker 可读 | ✅ | opacity 0→1 动画 |
| Scene visual anchors 可读 | ✅ | font-size 保持可读 |
| Search input 宽度 | ✅ | 100% width |
| Filter chips 可滚动 | ✅ | overflow-x auto |
| Internal filter 正常 | ✅ | BookTrans + ExplainLens 显示 |
| Constellation tooltip 不超出屏 | ✅ | CSS 处理 |
| Mobile Scene Strip | ✅ | 底部固定，active 状态清晰 |
| Credits 底部不被 strip 遮挡 | ✅ | padding-bottom: calc(1.5rem + 52px) |
| 无横向溢出 | ✅ | 无 horizontal overflow |
| 页面不空白 | ✅ | safeRun fallback |

---

## 可访问性检查

| 检查项 | 状态 |
|--------|------|
| `aria-label` on all navs | ✅ scene-nav + mobile-scene-strip |
| `aria-hidden="true"` on 装饰层 | ✅ depth-layer / command-desk / story-bridge / signal-grid |
| `role="tooltip"` on const-tooltip | ✅ |
| 所有交互元素 `:focus-visible` | ✅ |
| 颜色对比度 | ✅ 文字为 var(--text-primary/secondary) on dark bg |
| `prefers-reduced-motion` 降级 | ✅ 6处 @media query |
| 无 canvas | ✅ |
| 无 iframe | ✅ |
| 所有外部链接 `rel="noopener noreferrer"` | ✅ |

---

## reduced motion 检查

| 动画 | reduced-motion 关闭 |
|------|---------------------|
| Depth orbs drift | ✅ `animation: none` |
| Signal grid parallax | ✅ `transform: none` |
| Scene kicker fade-in | ✅ opacity:1 |
| Scene layered entry | ✅ `animation: none` |
| Featured card light sweep | ✅ `display: none` |
| Scene top highlight | ✅ `display: none` |
| Mobile scene strip | ✅ `display: none !important` |

---

## 仍未做的内容（评估后决定不做）

| 项目 | 原因 |
|------|------|
| Terminal 真实 log（GitHub API）|维护成本高，当前静态 sample 已满足叙事需求 |
| 暗色/亮色模式切换 | 保持深夜研究室氛围，不做双主题 |
| PWA manifest | 不做 offline维护承诺 |
| Three.js / Spline / React Three Fiber | 不引入重型 3D，保持纯静态 |
| Live monitoring | 不做，Concept Preview 边界已明确标注 |

---

## 是否建议 CP-3 系列封版

**✅ 建议 CP-3 系列封版。**

**理由：**
1. 最初目标已达成90%+（深夜研究室 × AI OS × 放映厅 × 控制塔 × 档案馆）
2. 所有核心功能完整保留且已验证
3. 移动端叙事导航已补齐（mobile scene strip）
4. 可访问性处理完整（reduced-motion / aria / focus / noindex）
5. 无重大已知问题
6. 剩余 10% 是不引入重型 3D 和 API 的功能，不影响核心体验

**封版后监控方向：**
- 真实用户反馈（是否理解这个页面是什么）
- 社交分享点击率（og-image / Twitter Card 效果）
- 搜索收录情况
- 如果有反馈，再开 CP-4 或独立子项目

---

## 完整 Phase 链路

| Phase | Commit | 状态 |
|-------|--------|------|
| CP-1A | `db269fc` | ✅ 静态原型 |
| CP-1B | `c224ff0` | ✅ 真实性升级 |
| CP-1C | `234daa0` | ✅ 数据层 |
| CP-1D | `21c1d1a` | ✅ 搜索/星图 |
| CP-1E | `2a27bcb` | ✅ 发布决策 |
| CP-1E-Blank-Hotfix | `3319425` | ✅ 空白页修复 |
| CP-2A | `0e2b013` | ✅ OG/sitemap |
| CP-2B | `02ffa8a` | ✅ Release Notes |
| CP-3A | `3a33646` | ✅ Command Desk / Anchors / Navigator |
| CP-3B | `e92b9af` | ✅ Featured Strip / Preview Wall |
| CP-3B-Hotfix | `516ab28` | ✅ Phase markers |
| CP-3C | `5c77cae` | ✅ Cinematic Depth / Parallax |
| CP-3D | `1b544b6` | ✅ Narrative Rhythm / Transitions |
| **CP-3E** | **`待提交`** | **✅ Mobile Story Nav / Final QA** |

---

*QA文档由 辛 🔮 — Phase CP-3E*