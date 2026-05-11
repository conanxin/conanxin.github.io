# The Little Archivist / 小档案员 — Web Preview

**在线地址**: https://conanxin.github.io/projects/automata-little-archivist/

---

## 项目来源

源项目: [automata-little-archivist](https://github.com/conanxin/automata-little-archivist)  
这是一个 AI × Automata × Narrative Artifact 的数字原型项目。

---

## 四个版本

| 版本 | 在线入口 | 核心能力 |
|------|----------|----------|
| **v0.5** | [v0.5/](https://conanxin.github.io/projects/automata-little-archivist/v0_5/) | **公开展示优化** — Demo Guide + 诊断面板 + 一键预设 + 移动端适配 |
| v0.4 | [v0.4/](https://conanxin.github.io/projects/automata-little-archivist/v0_4/) | 叙事状态机 — 5 种状态 + Auto Cycle + 平滑过渡 + 陪伴感 |
| v0.3 | [v0.3/](https://conanxin.github.io/projects/automata-little-archivist/v0_3/) | 呼吸动作模拟 — 5 种 profile + Play/Pause + Phase/Speed/Amplitude |
| v0.2 | [v0.2/](https://conanxin.github.io/projects/automata-little-archivist/v0_2/) | 零件显隐 + 爆炸视图 + 零件信息面板 |
| v0.1 | [v0.1/](https://conanxin.github.io/projects/automata-little-archivist/v0_1/) | 简洁 STL 浏览 — 单模型旋转缩放 |

---

## 当前推荐版本

**v0.5** 是当前主推荐版本。

v0.5 新增（基于 v0.4）：
- **首屏 Demo Guide** — 4 步快速上手引导
- **加载诊断** — 资源追踪 + 超时错误提示
- **Diagnostics 面板** — 可折叠技术状态面板
- **一键预设** — Best First Look / Mechanism Explanation / Structure Exploded
- **移动端提示** — 小屏检测 + Performance Mode
- **版本导航** — 顶部 Home / v0.1–v0.5 快速切换

v0.4 基础能力：
- 5 种叙事状态：Idle、Reading、Sleeping、Observer、Awake
- Auto Cycle 自动轮换，完整 cycle 约 10 分钟
- 状态平滑过渡 + 叙事面板 + 状态徽章

---

## 技术栈

- Three.js (via CDN)
- 静态 HTML/CSS/JS
- 无后端
- STL 模型在浏览器中实时渲染

---

## 已知限制

- 运动是解释性的，不是物理仿真
- 状态机基于计时器，不是真实 AI agent
- 无传感器输入
- 浏览器渲染性能取决于设备

---

## 后续计划

- v0.6: 氛围层 — 灯光/材质/环境渲染
- 打印验证：物理组装测试
- 声音层：呼吸声/翻页声

---

*"小档案员不是为了服务你而存在的。它在为自己阅读。"
"这种独立性，是陪伴感的基础。"*
