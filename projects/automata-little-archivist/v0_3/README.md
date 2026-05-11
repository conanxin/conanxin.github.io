# The Little Archivist — v0.3 Motion Preview

**版本**: v0.3
**日期**: 2026-05-11
**与 v0.2 的区别**: v0.3 增加了 Motion Preview 模式，可以交互式模拟呼吸凸轮的运动、从动件的位移、以及躯干的轻微起伏，帮助用户在没有打印机的情况下感受"小档案员"的运动气质。

---

## 与 v0.2 的区别

| 功能 | v0.2 | v0.3 |
|------|------|------|
| 模型浏览 | Assembly / Parts / Exploded | + **Motion Preview** |
| 零件显隐 | ✅ | ✅ |
| 爆炸视图 | ✅ | ✅ |
| 标签 | ✅ | ✅ |
| 信息面板 | ✅ | ✅ + Motion 说明 |
| **呼吸模拟** | 无 | ✅ Play/Pause + Phase + Speed + Amplitude + Profile |
| **运动状态面板** | 无 | ✅ 实时显示 phase / follower displacement / body offset |
| **运动轨迹** | 无 | ✅ 可选显示 motion path 线 |
| **Mechanism Only** | 无 | ✅ 只显示凸轮机构 |
| 快捷视角 | ✅ | ✅ |

---

## 启动方式

```bash
cd /home/conanxin/projects/automata-little-archivist
bash exports/web_preview/v0_3/start_local_preview.sh
```

浏览器访问：`http://127.0.0.1:8792/`

（v0.1: 8788, v0.2: 8789, v0.3: 8792 — 三个版本可同时运行）

---

## 如何进入 Motion Preview

1. 页面加载后点击 **Motion** 模式按钮
2. 自动开始播放呼吸动画
3. 默认使用 **Slow Breathing** profile，subtle 幅度

---

## 如何使用 Play / Pause

| 按钮 | 功能 |
|------|------|
| **▶ Play** | 开始呼吸动画 |
| **⏸ Pause** | 暂停在当前相位 |
| **Step +10°** | 手动推进相位 10°（用于精细观察某个位置） |

---

## 如何拖动 Phase

1. 暂停动画
2. 拖动 **Phase** 滑块（0°–360°）
3. 观察零件在任意相位的位置
4. 特别推荐观察 0°（最低点）、180°（最高点）、90°（上升中）

---

## 如何调 Speed / Amplitude / Profile

| 控制 | 选项 | 默认 | 建议 |
|------|------|------|------|
| **Speed** | Very Slow / Slow / Normal / Fast / Very Fast | Very Slow | 呼吸感需要慢 |
| **Amplitude** | Minimal / Subtle / Normal / Clear / Exaggerated | Subtle | 克制才有生命感 |
| **Profile** | A–E 五种 | B — Slow Breathing | 根据情绪选择 |

### 五种 Motion Profile

| Profile | 特点 | 适用场景 |
|---------|------|----------|
| **A — Mechanical Sine** | 标准正弦，对称、机械感 | Baseline 对比 |
| **B — Slow Breathing** | 平滑、缓慢、两端减速 | 默认日常状态 |
| **C — Tired / Resting** | 上升慢、顶部停顿、下降更慢 | 疲惫、长时间阅读后 |
| **D — Sleeping** | 极低幅度、长停顿 | 夜间、休息 |
| **E — Alert Lift** | 快速抬起、短暂停顿、缓慢回落 | 警觉、注意 |

---

## 如何评审 Breathing Motion

1. **进入 Motion Preview**
2. **关闭 Auto Rotate**（避免视角干扰）
3. **选择 Side 视角**（侧面观察起伏最明显）
4. **调整 Speed = Very Slow**
5. **调整 Amplitude = Subtle**
6. **切换不同 Profile**，观察情绪变化
7. **问自己**：
   - 这像呼吸吗？还是像机械泵？
   - 身体的起伏是否克制、不夸张？
   - 哪种 profile 最像"安静的学者"？

---

## 已知限制

| 限制 | 说明 |
|------|------|
| **不是物理仿真** | 运动基于简化数学模型，没有碰撞检测、重力、摩擦 |
| **位移是近似值** | follower 位移公式为 displacement = amplitude × profile(phase)，非精确凸轮啮合 |
| **无材质渲染** | 纯色显示，不显示 PLA/PETG/金属质感 |
| **无碰撞检测** | 零件运动时可能互相穿透（视觉上） |
| **旋转轴简化** | crank 旋转轴为简化，非精确方轴传动 |
| **CDN 依赖** | Three.js 从 esm.sh 加载 |
| **大模型加载慢** | assembly_preview.stl 2.2M |

---

## 文件结构

```
exports/web_preview/v0_3/
├── index.html              ← 主页面
├── style.css               ← 样式
├── app.js                  ← Three.js + 运动模拟核心
├── start_local_preview.sh  ← 启动脚本
├── README.md               ← 本文件
├── models/
│   ├── models.json
│   ├── parts_config.json   ← 9 零件配置（含 motion 字段）
│   └── *.stl               ← 10 个 STL
```

---

*"v0.1 让你看见模型。v0.2 让你理解结构。v0.3 让你感受生命。"*
*"一个没有运动的 automata 是雕塑。一个有运动的 automata 是存在。"*
