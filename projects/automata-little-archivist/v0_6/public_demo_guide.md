# The Little Archivist — Public Demo Guide

**版本**: v0.5 Public Demo Polish
**在线地址**: https://conanxin.github.io/projects/automata-little-archivist/v0_5/

---

## 这个项目是什么

The Little Archivist（小档案员）是一个 **AI × Automata × Narrative Artifact** 的数字原型。

它是一个前倾阅读的无面人形机械装置，由呼吸凸轮机构驱动，在 5 种叙事状态间切换：
- **Idle** — 等待，低能量
- **Reading** — 专注阅读，稳定呼吸
- **Sleeping** — 深沉睡眠，几乎静止
- **Observer** — 警觉，注意到什么
- **Awake** — 从睡眠中恢复

**关键理解**：这不是一个物理仿真。它是一个"解释性数字原型"——用浏览器中的 3D 渲染来传达一个尚未建造的机械装置的气质和状态。

---

## 如何用 3 分钟体验

### 第 1 分钟：第一眼

1. 打开页面，等待加载（约 2–5 秒）
2. 点击 **Best First Look** 预设按钮
3. 你会看到：
   - 3/4 视角
   - Motion 模式
   - Reading 状态
   - Slow Breathing profile
   - 极慢速度、微妙幅度
4. 静静地看 30 秒

### 第 2 分钟：让生命流动

1. 点击 **Auto Cycle: OFF** 按钮，让它变成 **ON**
2. 状态会自动轮换：Idle → Reading → Observer → Idle → Sleeping → Awake → Reading → Idle
3. 每个状态持续不同时间（Observer 仅 8 秒，Sleeping 长达 3 分钟）
4. 阅读 **Narrative** 面板的故事文字
5. 注意状态徽章的颜色变化和呼吸节奏的变化

### 第 3 分钟：切换视角

1. 点击 **Side** 视角
2. 关闭 **Auto Rotate**（取消勾选）
3. 再次静静地观察
4. 然后尝试 **Mech** 视角，观察内部机构

---

## 推荐观察顺序

| 顺序 | 动作 | 目的 |
|------|------|------|
| 1 | Best First Look 预设 | 获得最佳第一印象 |
| 2 | Auto Cycle ON | 感受"一天"的节奏 |
| 3 | 手动切换各状态 | 理解每种状态的差异 |
| 4 | Mechanism Explanation 预设 | 理解内部凸轮机构 |
| 5 | Structure Exploded 预设 | 理解零件组装关系 |
| 6 | Side / 3/4 视角 + 关闭 Auto Rotate | 获得最安静的陪伴感 |

---

## 如何理解 Motion / State

### Motion（运动层）

- **Profile**: 5 种呼吸曲线（Mechanical Sine / Slow Breathing / Tired / Sleeping / Alert）
- **Speed**: 呼吸频率（Very Slow → Very Fast）
- **Amplitude**: 呼吸深度（Minimal → Exaggerated）
- **Phase**: 当前在呼吸周期的哪个位置（0°–360°）

Motion 是**机制层面的参数**——描述身体如何动。

### State（状态层）

- **Idle**: 低能量，浅呼吸，等待
- **Reading**: 中等能量，稳定呼吸，专注
- **Sleeping**: 极低能量，几乎不动
- **Observer**: 警觉，呼吸暂停或极浅
- **Awake**: 从深到浅的过渡呼吸

State 是**叙事层面的概念**——描述这个存在在"做什么"。

**关系**: State 决定默认的 Motion 参数。切换 State 时，Speed/Amplitude/Profile 会平滑过渡到新状态。

---

## 如何截图

**最佳截图时机**:
- Reading 状态 + Slow Breathing + Side 视角
- Sleeping 状态 + 极浅呼吸（几乎静止）
- Observer 状态（短暂，需要抓准时机）

**截图要点**:
- 关闭 Labels 获得干净画面
- 关闭 Auto Rotate 锁定视角
- 使用 Dark BG（默认）或 Light BG 根据喜好

**浏览器截图**:
- Windows: `Win + Shift + S`
- macOS: `Cmd + Shift + 4`
- 也可直接浏览器右键 "保存图片"（但 Canvas 内容需要截图工具）

---

## 如何反馈问题

如果在体验中遇到问题：

1. 打开 **Diagnostics** 面板（底部可折叠区域）
2. 检查以下项目：
   - Three.js: yes
   - states_config: yes
   - parts_config: yes
   - STL Loaded: 9/9
   - WebGL: yes
3. 如果任何一项为 no，请记录具体值
4. 反馈格式：
   - 浏览器和版本（如 Chrome 124）
   - 操作系统（如 Windows 11 / macOS 14）
   - Diagnostics 面板截图
   - 浏览器控制台错误截图（F12 → Console）

**常见反馈渠道**:
- GitHub Issues: [automata-little-archivist](https://github.com/conanxin/automata-little-archivist)
- 或直接联系项目作者

---

## 公开分享时的建议

当向他人分享这个 demo 时：

1. **先说这是什么**: "这是一个浏览器中的叙事机械装置原型，不是游戏，不是工具，是一个'数字存在'。"
2. **推荐体验时间**: "给它 3–5 分钟，不要急着点击所有按钮。"
3. **强调陪伴感**: "最好的体验是打开 Auto Cycle，然后做你自己的事，让它在旁边'生活'。"
4. **提及限制**: "它的状态切换是预设的，不是真正感知环境。但这不影响'陪伴感'。"

---

*v0.5 的目标：让任何人，在任何设备上，用一分钟，就能开始理解小档案员。*
