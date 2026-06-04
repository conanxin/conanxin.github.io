# RELEASE_CHECKLIST.md — 发布前检查清单

> 在将 `projects/poincare-recurrence/` 提交到 `conanxin.github.io` 主仓库之前，请逐项检查。

---

## 0. 前置确认

- [ ] `conanxin.github.io` 仓库在本地已是最新（`git pull origin main`）
- [ ] 当前分支是 `main`
- [ ] `projects/poincare-recurrence/` 目录不存在冲突文件

---

## 1. 本地预览

```bash
cd ~/conanxin.github.io
python3 -m http.server 8899
# 浏览器打开 http://localhost:8899/projects/poincare-recurrence/
```

- [ ] 页面加载无白屏
- [ ] Hero Canvas 有动画（粒子轨道）
- [ ] 4 个交互模块全部可用
- [ ] 导航栏各链接跳转正确
- [ ] Accordion 展开/折叠正常
- [ ] 无 JS console error

---

## 2. 子路径访问检查

```bash
curl -I http://localhost:8899/projects/poincare-recurrence/
# 确认返回 HTTP 200
```

- [ ] `HTTP/1.0 200 OK`

---

## 3. 交互功能测试

### 模块 A：有限状态模拟器
- [ ] 选择状态数量，下方网格重建
- [ ] 点击"开始演化"，高亮跳转
- [ ] 回归发生后显示 `💡` 提示语
- [ ] 点击"重置"，统计归零

### 模块 B：相空间
- [ ] 调整速度/epsilon/轨迹滑块
- [ ] 点击"开始"，轨迹绘制
- [ ] 接近回归发生时状态文字变化

### 模块 C：熵扩散
- [ ] 点击"扩散"，粒子混合
- [ ] 混合度数值实时更新
- [ ] "重置"回到左侧初始状态

### 模块 D：时间尺度
- [ ] 拖动 logN 滑块，状态数更新
- [ ] 拖动 logF 滑块，频率更新
- [ ] 估算时间正确显示
- [ ] 对比条与文字说明一致

---

## 4. 移动端检查

- [ ] 移动端浏览器打开页面，布局不破裂
- [ ] 导航栏可折叠
- [ ] 状态网格可横向滚动
- [ ] Canvas 不溢出屏幕

---

## 5. README 检查

- [ ] 项目标题正确
- [ ] tagline 清晰
- [ ] 目标 URL `https://conanxin.github.io/projects/poincare-recurrence/` 已标注
- [ ] Features 列出 4 个交互模块
- [ ] Local preview 命令正确
- [ ] License 为 MIT

---

## 6. License 检查

- [ ] `LICENSE` 文件存在
- [ ] 版权年份为 2026
- [ ] 版权者为 Conan Xin

---

## 7. 外部链接 / CDN 检查

```bash
grep -rE "(https?://|cdn)" ~/conanxin.github.io/projects/poincare-recurrence/index.html \
  ~/conanxin.github.io/projects/poincare-recurrence/styles.css \
  ~/conanxin.github.io/projects/poincare-recurrence/app.js
```

- [ ] 无输出（核心文件中无外部 URL）

> 注意：README 和 docs/ 中可以有外部参考链接。

---

## 8. 资源路径检查

- [ ] `index.html` 中 `<link rel="stylesheet" href="./styles.css" />`
- [ ] `index.html` 中 `<script src="./app.js"></script>`
- [ ] 无 `/styles.css` 或 `/app.js`（绝对路径）

---

## 9. Git 状态检查

```bash
cd ~/conanxin.github.io
git status --short
git diff --stat
```

- [ ] 所有新文件应为 `??` 状态（未跟踪）
- [ ] 无意外修改其他文件

---

## 10. GitHub Pages 验证（push 后）

- [ ] 访问 https://conanxin.github.io/projects/poincare-recurrence/ 返回页面
- [ ] 页面加载完整，无 404
- [ ] JS 动画运行正常
- [ ] 无控制台错误

---

## 11. projects 索引（可选，如需人工接入）

- [ ] 检查 `projects/data.json` 是否需要新增条目（见最终报告）
- [ ] 如需接入，在 `projects/data.json` 中添加：

```json
{
  "title": "庞加莱回归",
  "subtitle": "Poincaré Recurrence 交互式知识页",
  "slug": "poincare-recurrence",
  "category": "creative",
  "type": "INTERACTIVE ESSAY",
  "status": "待发布",
  "status_color": "#ffa657",
  "updated": "2026-06-04",
  "summary": "一个用有限状态、相空间、熵直觉和时间尺度计算器解释 Poincaré Recurrence 的交互式科普页面。",
  "entry_url": "/projects/poincare-recurrence/",
  "source_kind": "interactive-page",
  "featured": true,
  "tags": ["物理", "数学", "交互", "科普", "时间"]
}
```

---

_辛 · 发布检查清单 · 🔮_