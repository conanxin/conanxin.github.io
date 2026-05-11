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
| **v0.4** | [v0.4/](https://conanxin.github.io/projects/automata-little-archivist/v0_4/) | **叙事状态机** — 5 种状态 + Auto Cycle + 平滑过渡 + 陪伴感 |
| v0.3 | [v0.3/](https://conanxin.github.io/projects/automata-little-archivist/v0_3/) | 呼吸动作模拟 — 5 种 profile + Play/Pause + Phase/Speed/Amplitude |
| v0.2 | [v0.2/](https://conanxin.github.io/projects/automata-little-archivist/v0_2/) | 零件显隐 + 爆炸视图 + 零件信息面板 |
| v0.1 | [v0.1/](https://conanxin.github.io/projects/automata-little-archivist/v0_1/) | 简洁 STL 浏览 — 单模型旋转缩放 |

---

## 当前推荐版本

**v0.4** 是当前主推荐版本。

5 种叙事状态：
- **Idle** — 等待，低能量
- **Reading** — 专注阅读，稳定呼吸
- **Sleeping** — 深沉睡眠，几乎静止
- **Observer** — 警觉，注意到什么
- **Awake** — 从睡眠中恢复

Auto Cycle 自动轮换，完整 cycle 约 10 分钟，模拟"一天"的节奏。

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

- v0.5: 氛围层 — 灯光/材质/环境渲染
- 打印验证：物理组装测试
- 声音层：呼吸声/翻页声

---

*"小档案员不是为了服务你而存在的。它在为自己阅读。"
"这种独立性，是陪伴感的基础。"*
