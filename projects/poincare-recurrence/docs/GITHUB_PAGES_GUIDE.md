# GITHUB_PAGES_GUIDE.md — 部署指南

> 本文档说明如何将 `projects/poincare-recurrence/` 作为 conanxin.github.io 的子项目发布到 GitHub Pages。

---

## 目标访问路径

```
https://conanxin.github.io/projects/poincare-recurrence/
```

## 前提条件

- 你已有 `conanxin.github.io` GitHub 仓库，且对本仓库有 push 权限
- 仓库 Settings → Pages → Source 设置为 `main` 分支（已有配置）

---

## 部署步骤

### 1. 确认文件位置

本项目的目标目录为：

```
conanxin.github.io/
  └── projects/
        └── poincare-recurrence/
              ├── index.html      ✅
              ├── styles.css      ✅
              ├── app.js          ✅
              ├── README.md       ✅
              ├── LICENSE        ✅
              ├── .gitignore      ✅
              └── docs/
                    ├── CONTENT_NOTES.md
                    ├── DESIGN_NOTES.md
                    ├── VALIDATION_REPORT.md
                    ├── GITHUB_PAGES_GUIDE.md
                    └── RELEASE_CHECKLIST.md
```

### 2. 在 conanxin.github.io 仓库内提交

```bash
cd ~/conanxin.github.io

# 确认在 main 分支
git status

# 添加项目文件
git add projects/poincare-recurrence/

# 提交
git commit -m "Add: Poincaré Recurrence interactive explainer page

- 4 interactive modules (finite state / phase space / entropy / time scale)
- Hero + concept map + accordion extensions
- Pure HTML/CSS/JS, no external CDN
- MIT License"
```

### 3. Push 到 GitHub

```bash
git push origin main
```

### 4. 验证 GitHub Pages

1. 打开 https://github.com/conanxin/conanxin.github.io/settings/pages
2. 确认 Source 为 `main` 分支，路径 `/ (root)`
3. 等待 1-2 分钟，访问：
   https://conanxin.github.io/projects/poincare-recurrence/

> 如果显示 404，等待 5 分钟再试（GitHub Pages 首次部署需要时间）。

### 5. 如需更新

修改后重复步骤 2-4，GitHub Pages 会自动重新部署。

---

## 路径说明

- 项目页面部署在 `/projects/poincare-recurrence/` 子路径下
- 所有内部资源使用相对路径（`./styles.css`、`./app.js`）
- 不依赖站点根目录的任何资源
- 页面独立可用，不受站点其他页面影响

---

## 不需要做的

- ❌ **不要**创建独立仓库
- ❌ **不要**部署到 `gh-pages` 分支
- ❌ **不要**设置自定义域名的 CNAME（由主站管理）
- ❌ **不要**修改 `404.md` 或其他根目录文件

---

## 故障排查

| 症状 | 检查 |
|------|------|
| 404 页面 | 确认 main 分支已 push，等待 5 分钟 |
| 资源加载失败 | 检查相对路径是否为 `./styles.css` 而非 `/styles.css` |
| JS 不工作 | 确认 `app.js` 在同目录，无 CDN 引用 |
| 样式异常 | 检查 `styles.css` 存在且被 index.html 引用 |

---

_辛 · GitHub Pages 部署指南 · 🔮_