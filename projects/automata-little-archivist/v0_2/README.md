# The Little Archivist — v0.2 Interactive Preview

**版本**: v0.2
**日期**: 2026-05-11
**与 v0.1 的区别**: v0.2 增加了零件显隐、爆炸视图、零件标签、信息面板和快捷视角，帮助用户交互式理解结构设计。

---

## 与 v0.1 的区别

| 功能 | v0.1 | v0.2 |
|------|------|------|
| 模型切换 | 单模型下拉框 | 三种模式（Assembly / Parts / Exploded） |
| 零件显隐 | 无 | ✅ 9 个独立零件可单独开关 |
| 爆炸视图 | 无 | ✅ Slider 控制展开程度 |
| 零件标签 | 无 | ✅ 3D 空间中显示零件名称 |
| 信息面板 | 无 | ✅ 点击零件显示功能/材料/风险/气质作用 |
| 快捷视角 | Reset + Fit | ✅ Front / Side / Top / 3/4 / Mechanism |
| 交互方式 | 旋转/缩放/平移 | + 点击零件选择 |

---

## 启动方式

```bash
cd /home/conanxin/projects/automata-little-archivist
bash exports/web_preview/v0_2/start_local_preview.sh
```

浏览器访问：`http://127.0.0.1:8789/`

（v0.1 在 8788，v0.2 在 8789，可同时运行）

---

## 如何使用零件显隐

1. 切换到 **Parts** 或 **Exploded** 模式
2. 左侧面板 "Parts" 区域有 9 个零件
3. 每个零件前有 checkbox
4. 勾选 = 显示，取消 = 隐藏
5. 默认显示：body + mechanism 件，隐藏内部 access 件

---

## 如何使用爆炸视图

1. 点击 **Exploded** 模式按钮
2. 拖动 "Explode" Slider（0% → 100%）
3. 零件会从装配位置向外展开
4. 0% = 装配状态
5. 50% = 半展开
6. 100% = 完全展开

**注意**：爆炸视图是**解释性布局**，用于理解结构关系，不等于精确的工程装配动画。坐标为手工近似值。

---

## 如何使用标签

1. 勾选 "Labels" 开关（默认开启）
2. 在 Parts / Exploded 模式下，每个零件上方显示名称标签
3. 标签跟随零件移动
4. Assembly 模式下不显示标签（避免遮挡）

---

## 如何做视觉评审

1. 切换到 **Parts** 模式
2. 只显示 body 件（base_shell + torso_shell + head_shell + neck_sleeve）
3. 用鼠标旋转观察 silhouette
4. 切换到 **Exploded** 模式，拖动 slider 观察内部结构
5. 点击每个零件，阅读 "Artifact Role" 理解设计意图
6. 用 **Mechanism View** 快捷视角观察凸轮机构

---

## 已知限制

| 限制 | 说明 |
|------|------|
| 爆炸视图是近似值 | 坐标为手工估算，不等于 SCAD 精确装配位置 |
| 无材质渲染 | 零件为纯色，不显示 PLA/PETG/金属质感 |
| 无动画 | 凸轮运动无法实时演示 |
| 标签遮挡 | 大量标签同时显示时可能重叠 |
| Assembly 模式无零件拆分 | Assembly Preview STL 是整体，不能单独隐藏零件 |
| CDN 依赖 | Three.js 从 esm.sh 加载，首次需联网 |

---

## 技术栈

- Three.js r160（CDN）
- STLLoader / OrbitControls
- 原生 ES Modules
- Python http.server

---

## 文件结构

```
exports/web_preview/v0_2/
├── index.html              ← 主页面
├── style.css               ← 样式（深色/浅色双主题）
├── app.js                  ← Three.js 交互逻辑
├── start_local_preview.sh  ← 启动脚本
├── README.md               ← 本文件
├── models/
│   ├── models.json         ← Assembly 模型元数据
│   ├── parts_config.json   ← 9 个零件的详细配置
│   ├── assembly_preview.stl
│   ├── base_shell.stl
│   ├── torso_shell.stl
│   ├── head_shell.stl
│   ├── neck_sleeve.stl
│   ├── partition.stl
│   ├── access_panel.stl
│   ├── breathing_cam.stl
│   ├── follower.stl
│   └── crank.stl
```

---

*"v0.1 让你看见模型。v0.2 让你理解模型。"*
*"爆炸视图不是拆开它，是让你看见它原本隐藏的灵魂。"*
