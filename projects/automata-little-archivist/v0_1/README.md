# The Little Archivist — v0.1 STL Web Preview

**版本**: v0.1
**日期**: 2026-05-10
**用途**: 本地浏览器预览 v0.1 unified body 的 STL 模型

---

## 作用

这个本地网页预览器让你可以在浏览器中查看、旋转、缩放 The Little Archivist v0.1 的 10 个 STL 零件，无需安装任何 3D 建模软件。

**它不是最终渲染图。**  
**它是工程几何预览。**  
材质、灯光、阴影均为简化表示，目的是验证模型结构、比例和轮廓。

---

## 文件结构

```
exports/web_preview/v0_1/
├── index.html              ← 主页面
├── style.css               ← 深色/浅色主题样式
├── app.js                  ← Three.js 预览逻辑
├── start_local_preview.sh  ← 本地启动脚本
├── README.md               ← 本文件
└── models/
    ├── models.json         ← 模型元数据
    ├── assembly_preview.stl
    ├── base_shell.stl
    ├── torso_shell.stl
    ├── head_shell.stl
    ├── neck_sleeve.stl
    ├── partition.stl
    ├── access_panel.stl
    ├── breathing_cam.stl
    ├── follower.stl
    └── crank.stl
```

---

## 如何启动

### 方法 1：使用启动脚本

```bash
cd /home/conanxin/projects/automata-little-archivist
bash exports/web_preview/v0_1/start_local_preview.sh
```

终端会显示访问地址，例如：
```
Address:    http://127.0.0.1:8788/
```

### 方法 2：手动启动

```bash
cd /home/conanxin/projects/automata-little-archivist/exports/web_preview/v0_1
python3 -m http.server 8788 --bind 127.0.0.1
```

---

## 如何打开

启动后，在浏览器中访问：

```
http://127.0.0.1:8788/
```

支持浏览器：Chrome / Firefox / Edge / Safari（需支持 WebGL 2）

---

## 交互方式

| 操作 | 方式 |
|------|------|
| **旋转** | 鼠标左键拖动 |
| **缩放** | 鼠标滚轮 |
| **平移** | 鼠标右键拖动 或 中键拖动 |
| **切换模型** | 左侧面板下拉框 |
| **自动旋转** | 勾选/取消 Auto Rotate |
| **线框模式** | 勾选 Wireframe |
| **深色/浅色背景** | 勾选/取消 Dark BG |
| **重置视角** | 点击 Reset View |
| **适配视图** | 点击 Fit to View |

---

## 默认视图

页面加载后默认显示 **Assembly Preview** — 完整 v0.1 unified body（前倾 10° 的姿态）。

默认启用 **自动旋转**，方便你从各个角度观察 silhouette。

---

## 已知限制

| 限制 | 说明 |
|------|------|
| **材质简化** | 所有零件显示为统一浅暖灰色，不区分 PLA/PETG/金属 |
| **无纹理** | FDM 层纹、打磨痕迹、茶染效果无法预览 |
| **灯光简化** | 3 盏方向光 + 环境光，非 2700K 侧光设计 |
| **无阴影** | 为了性能关闭了复杂阴影计算 |
| **比例固定** | 按 STL 原始尺寸 1:1 显示，无环境参照物 |
| **无动画** | 凸轮运动、呼吸起伏无法实时演示 |
| **网络依赖** | Three.js 通过 CDN 加载，首次打开需联网（约 200KB） |
| **STL 体积** | assembly_preview.stl 为 2.2MB，加载需 3–5 秒 |

---

## 后续可扩展方向

| 功能 | 难度 | 价值 |
|------|------|------|
| **Explode View** | 中 | 展示零件装配关系 |
| **Annotations** | 低 | 标注关键尺寸 |
| **Animation** | 高 | 模拟凸轮驱动呼吸 |
| **Material Override** | 低 | 给不同零件上不同颜色 |
| **Cross-section** | 中 | 剖面展示内部腔体 |
| **VR/AR Preview** | 高 | 在真实桌面预览 |
| **Measurement Tool** | 中 | 点击测量两点距离 |
| **Screenshot Export** | 低 | 一键保存当前视角 PNG |

---

## 技术栈

- **Three.js** r160（via CDN / esm.sh）
- **STLLoader** — 加载 STL 二进制文件
- **OrbitControls** — 鼠标交互控制
- **原生 ES Modules** — 无构建系统
- **Python http.server** — 本地静态服务

---

*"预览器不是为了让模型看起来好看。"
"预览器是为了让模型在任何屏幕上都可以被看见、被旋转、被理解。"
"一个能被看见的模型，比一万页文档更接近真实。"*
