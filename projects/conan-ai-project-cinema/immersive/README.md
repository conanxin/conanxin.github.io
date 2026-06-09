# Conan AI Project Cinema — Immersive Mode (CP-4A)

**Phase:** CP-4A
**Path:** `/projects/conan-ai-project-cinema/immersive/`
**URL:** https://conanxin.github.io/projects/conan-ai-project-cinema/immersive/

---

## CP-4A Goal

探索从"电影化网页"升级为"可进入的个人 AI 项目空间"的可能性。
在不影响主页面的前提下，用独立 route 测试3D + Sound 沉浸体验的最低成本实现路径。

---

## Why Start from a Separate Immersive Route

1. **不影响主页面稳定性** — 3D/Sound 探索如果失败，主页面不受影响
2. **快速验证** — 可以独立迭代 immersive route，不涉及主站部署
3. **降低决策压力** — 不需要决定"是否永久替换主页面"，可以先探索再判断

---

## Technical Choice: Vanilla Three.js + Web Audio API

**为什么用 Vanilla Three.js（而不是 Spline / React Three Fiber）：**
- 可完全代码控制，无外部编辑器依赖
- 可直接绑定六幕 scene / camera / audio state
- 适合 GitHub Pages 静态托管（CDN 或本地 vendor）
- 更容易做 WebGL fallback 和性能控制
- 零 build step

**CDN 版本（当前使用）：**
- Three.js `0.169.0` via unpkg ES module
- 固定版本，不使用 latest

**未来可选项：**
- Vendor 本地化（放入 `vendor/three.module.js`）
- 离线可用性增强

---

## 3D Scene Structure

**最低实现（CP-4A）：**
- 暗色地面 / 桌面平面
- Command Desk（发光边缘的暗色桌面 + 3个屏幕面板）
- 6个 Scene Node spheres（带 ring glow）
- Particle system（300个随机漂浮光点）
- Agent workflow line（发光管道 + 节点）
- 18个 floating artifact cards

**不追求：**
- 外部3D 模型文件
- PBR 复杂材质
- 大规模场景

---

## Sound Design Principles

**全部为代码生成的合成声音，不依赖外部音频文件：**

| Scene | Sound Character |
|-------|----------------|
| Ideas | Soft filtered noise + 三角波 |
| Chat | Subtle digital pulse |
| Artifacts | Warm low pad |
| Agents | Rhythmic tick |
| Tower | Deep system hum |
| Archive | Open airy pad |

**安全原则：**
- 不自动播放（必须用户点击 Enter按钮）
- 音量默认很低（master gain 0.12）
- 页面隐藏时自动 suspend audio context
- 用户离开页面时清理 audio nodes
- 不使用版权音频

---

## Fallback Strategy

| Failure | Behavior |
|---------|----------|
| WebGL unavailable | 显示 fallback 区域，提供返回主页面链接 |
| Three.js CDN加载失败 | 显示 fallback，console记录错误 |
| AudioContext初始化失败 | 无声模式运行，所有 scene切换功能正常 |
| 任何 init 错误 | 不崩溃，不空白，显示 fallback |

---

## Not Affecting Main Page

- 主页面路径：`/projects/conan-ai-project-cinema/`（不变）
- Immersive route：`/projects/conan-ai-project-cinema/immersive/`（独立）
- 两套独立 HTML / CSS / JS，无共享状态
- Immersive 页面有自己的 `robots: noindex, nofollow`
- Immersive 页面失败不影响主页面

---

## CP-4B / CP-4C Suggestions

**CP-4B：**滚动驱动 camera（scrollIntoView + smooth camera transition）
**CP-4C：** 主页面集成入口（在主页面 Hero 添加 "Enter Immersive Mode" 按钮）
**CP-4D：**评估是否将 immersive route 作为可选模式而非独立 route

---

*Readme by 辛 🔮 — Phase CP-4A*