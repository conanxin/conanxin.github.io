# 庞加莱回归 — 交互式知识页

> 如果时间足够长，世界会绕回来吗？

**目标访问路径：** https://conanxin.github.io/projects/poincare-recurrence/

一个纯前端静态交互式知识页面，通过动画、模拟器、滑块和分层解释，让普通读者直观理解庞加莱回归（Poincaré Recurrence）的概念、理论边界和哲学延伸。

---

## Features

### 4 个交互模块

| 模块 | 功能 |
|------|------|
| **A · 有限状态回归模拟器** | 有限状态网格 + 定时动画，直观展示"状态有限→重复不可避免" |
| **B · 相空间接近回归** | Canvas 轨迹动画，演示"任意接近"而非完全相同 |
| **C · 墨水扩散与熵** | 粒子模拟直觉演示宏观不可逆性与庞加莱回归的表观冲突 |
| **D · 时间尺度计算器** | 数量级估算，展示回归时间与宇宙年龄的对比 |

### 内容结构

- Hero 区（粒子轨道 Canvas 动画 + 阅读路径提示）
- 核心解释卡片（它说什么 / 不说什么 / 为什么震撼）
- 理论条件 checklist（适用条件 vs 不适用 / 常见误读）
- 延伸阅读 accordion（5 个主题：热力学第二定律、洛施密特悖论、永恒轮回、混沌、宇宙学）
- 概念地图（10 个关联概念网络）
- 底部总结语

---

## 本地预览

```bash
cd ~/conanxin.github.io
python3 -m http.server 8899
# 浏览器打开 http://localhost:8899/projects/poincare-recurrence/
```

> 无需 npm install、无需构建工具、纯浏览器运行。

---

## 作为 conanxin.github.io 子项目发布

本项目作为 `conanxin.github.io` 仓库的子项目，部署在 `/projects/poincare-recurrence/` 路径下：

```
conanxin.github.io/
  └── projects/
        └── poincare-recurrence/
              ├── index.html
              ├── styles.css
              ├── app.js
              ├── README.md
              ├── LICENSE
              ├── .gitignore
              └── docs/
```

详见 `docs/GITHUB_PAGES_GUIDE.md`。

---

## 教学边界说明

> ⚠️ 本页面所有模拟和估算均为**教学类比**，非精确物理计算。

- **模块 A**：有限离散系统类比，非真实相空间行为
- **模块 B**：简化二维环面模型，非真实动力学（真实相空间维度 >> 2）
- **模块 C**：简化随机扩散，用于直觉演示，真实热力学系统状态数约 10^(10^20)
- **模块 D**：toy-model 数量级估算 T ≈ N/f，真实时间可能有其他结构依赖

详见 `docs/CONTENT_NOTES.md`。

---

## 开源与许可

- 代码：MIT License（见 `LICENSE`）
- 内容：CC BY 4.0（署名引用）
- 纯前端，无外部依赖，可离线运行

---

## 后续可扩展方向

- [ ] 增加英文版（i18n）
- [ ] 增加遍历性（Ergodicity）解释模块
- [ ] 增加玻尔兹曼大脑模拟
- [ ] 增加庞加莱 1890 年历史背景介绍
- [ ] 增加深色/浅色主题切换
- [ ] 增加移动端滑动手势支持

---

_辛 · 纯前端 · 无外部依赖 · 可离线运行 · 🔮_