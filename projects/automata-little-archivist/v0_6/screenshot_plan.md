# Screenshot Plan / 截图计划

**版本**: v0.4
**日期**: 2026-05-11
**用途**: 系统化截图记录 v0.4 的关键视觉状态
**前提**: 已启动 v0.4 预览器

---

## 截图工具

| 方法 | 操作 |
|------|------|
| **浏览器自带** | F12 → 右键 canvas → "Capture screenshot"（部分浏览器支持） |
| **系统截图** | Windows: Win+Shift+S / macOS: Cmd+Shift+4 |
| **命令行** | `scrot` 或 `gnome-screenshot`（如已安装） |

---

## 必截角度（基础视图）

| # | 角度 | 操作 | 输出文件名 |
|---|------|------|-----------|
| 1 | **Front** | Reset View → 手动微调至正面 | `v0_4_angle_front.png` |
| 2 | **Side** | 点击 Side 按钮 | `v0_4_angle_side.png` |
| 3 | **Top** | 点击 Top 按钮 | `v0_4_angle_top.png` |
| 4 | **3/4** | 点击 3/4 按钮 | `v0_4_angle_threequarter.png` |
| 5 | **Mechanism** | 点击 Mech 按钮 | `v0_4_angle_mechanism.png` |

---

## 必截状态（叙事状态）

| # | 状态 | 模式 | 角度 | 背景 | 输出文件名 |
|---|------|------|------|------|-----------|
| 6 | **Idle** | Motion | Side | Dark | `v0_4_state_idle_side_dark.png` |
| 7 | **Reading** | Motion | Side | Dark | `v0_4_state_reading_side_dark.png` |
| 8 | **Sleeping** | Motion | Side | Dark | `v0_4_state_sleeping_side_dark.png` |
| 9 | **Observer** | Motion | 3/4 | Dark | `v0_4_state_observer_threequarter_dark.png` |
| 10 | **Awake** | Motion | Side | Dark | `v0_4_state_awake_side_dark.png` |

---

## 必截组合（高级视图）

| # | 组合 | 操作步骤 | 输出文件名 |
|---|------|----------|-----------|
| 11 | **Reading + Side + Dark** | Motion 模式 → Reading 状态 → Side 视角 → 关闭 Auto Rotate | `v0_4_comb_reading_side_dark.png` |
| 12 | **Sleeping + Front + Dark** | Motion 模式 → Sleeping 状态 → Front 视角 → 关闭 Auto Rotate | `v0_4_comb_sleeping_front_dark.png` |
| 13 | **Observer + 3/4 + Dark** | Motion 模式 → Observer 状态 → 3/4 视角 → 关闭 Auto Rotate | `v0_4_comb_observer_threequarter_dark.png` |
| 14 | **Mechanism Only + Motion Path** | Motion 模式 → Reading 状态 → Mech 视角 → 勾选 Motion Path → 勾选 Mechanism Only | `v0_4_comb_mechanism_path.png` |
| 15 | **Exploded + Labels** | Exploded 模式 → 拖动 slider 至 50% → 勾选 Labels | `v0_4_comb_exploded_labels.png` |
| 16 | **Parts + All Body** | Parts 模式 → 只勾选 body 零件（base/torso/head/neck）→ Side 视角 | `v0_4_comb_parts_body_only.png` |
| 17 | **Assembly + Wireframe** | Assembly 模式 → 勾选 Wireframe | `v0_4_comb_assembly_wireframe.png` |
| 18 | **Light Mode + Reading** | Motion 模式 → Reading → 取消 Dark BG | `v0_4_comb_reading_light.png` |

---

## 截图命名规范

```
格式: v0_4_{type}_{subject}_{angle}_{background}.png

字段:
- v0_4: 版本号
- type: angle / state / comb（组合）
- subject: 具体内容
- angle: front / side / top / threequarter / mechanism
- background: dark / light

示例:
v0_4_angle_front.png
v0_4_state_idle_side_dark.png
v0_4_comb_reading_side_dark.png
v0_4_comb_mechanism_path.png
```

---

## 截图检查清单

| # | 文件名 | 已截图 | 质量合格 |
|---|--------|--------|----------|
| 1 | v0_4_angle_front.png | □ | □ |
| 2 | v0_4_angle_side.png | □ | □ |
| 3 | v0_4_angle_top.png | □ | □ |
| 4 | v0_4_angle_threequarter.png | □ | □ |
| 5 | v0_4_angle_mechanism.png | □ | □ |
| 6 | v0_4_state_idle_side_dark.png | □ | □ |
| 7 | v0_4_state_reading_side_dark.png | □ | □ |
| 8 | v0_4_state_sleeping_side_dark.png | □ | □ |
| 9 | v0_4_state_observer_threequarter_dark.png | □ | □ |
| 10 | v0_4_state_awake_side_dark.png | □ | □ |
| 11 | v0_4_comb_reading_side_dark.png | □ | □ |
| 12 | v0_4_comb_sleeping_front_dark.png | □ | □ |
| 13 | v0_4_comb_observer_threequarter_dark.png | □ | □ |
| 14 | v0_4_comb_mechanism_path.png | □ | □ |
| 15 | v0_4_comb_exploded_labels.png | □ | □ |
| 16 | v0_4_comb_parts_body_only.png | □ | □ |
| 17 | v0_4_comb_assembly_wireframe.png | □ | □ |
| 18 | v0_4_comb_reading_light.png | □ | □ |

**截图完成率**: ___ / 18

---

## 截图存储建议

```
存储路径: exports/web_preview/v0_4/screenshots/

screenshots/
├── angles/          ← 基础角度视图
├── states/          ← 叙事状态视图
├── combinations/   ← 高级组合视图
└── raw/            ← 未经筛选的原始截图
```

---

*"截图不是为了好看。截图是为了冻结一个瞬间，让你在冷静时重新审视它。"
"一个好截图会在 3 天后告诉你：这是对的，还是错的。"*
