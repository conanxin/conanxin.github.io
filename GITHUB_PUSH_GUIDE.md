# GitHub 推送指南

## 快速开始

### 1. 在 GitHub 创建仓库

访问 https://github.com/new 创建新仓库：

- **Repository name**: `digital-garden`
- **Description**: 我的数字花园 - AI 研究和技术探索
- **Visibility**: Public (推荐，GitHub Pages 免费)
- **Initialize**: 不要勾选任何选项（已有本地仓库）

### 2. 连接远程仓库

在终端运行：

```bash
cd ~/digital-garden

# 添加远程仓库（替换为你的用户名）
git remote add origin https://github.com/conanxin/digital-garden.git

# 推送代码
git push -u origin main
```

### 3. 启用 GitHub Pages

1. 访问 `https://github.com/conanxin/digital-garden/settings/pages`
2. **Source** 选择 **Deploy from a branch**
3. **Branch** 选择 **main** / **root**
4. 点击 **Save**

或者使用 GitHub Actions（已配置）：

1. 访问 `https://github.com/conanxin/digital-garden/settings/pages`
2. **Source** 选择 **GitHub Actions**
3. 工作流会自动运行

### 4. 访问网站

等待几分钟，访问：

```
https://conanxin.github.io/digital-garden
```

---

## 验证部署状态

### 查看 Actions 运行状态

访问：`https://github.com/conanxin/digital-garden/actions`

### 本地预览（可选）

```bash
cd ~/digital-garden

# 安装依赖
bundle install

# 本地预览
bundle exec jekyll serve --livereload

# 访问 http://localhost:4000/digital-garden
```

---

## 内容统计

当前数字花园包含：

- **研究文章**: 15+ 篇深度研究
- **思考文章**: 20+ 篇随笔
- **项目文档**: 5+ 个项目
- **工具文档**: 1 个工具
- **总字数**: 约 26,000+ 行

### 核心研究

1. **A2A 协议研究** - 多 Agent 协作系统
2. **Hermes Supervisor** - Agent 监控与分诊
3. **Autoresearch** - AI 自我改进循环
4. **去中心化 AI** - DePIN 生态分析

---

## 后续更新

添加新内容后推送：

```bash
cd ~/digital-garden

git add .
git commit -m "添加新研究：XXX"
git push
```

GitHub Actions 会自动重新部署。

---

## 故障排除

### 推送失败

```bash
# 检查远程仓库
git remote -v

# 如果错误，重新添加
git remote remove origin
git remote add origin https://github.com/conanxin/digital-garden.git
```

### 页面未更新

1. 检查 Actions 是否成功运行
2. 清除浏览器缓存
3. 等待 5-10 分钟（CDN 刷新）

### 样式丢失

检查 `_config.yml` 中的 `baseurl` 设置：

```yaml
baseurl: "/digital-garden"
```

---

## 完成！

推送后，你的数字花园将在互联网上可访问 🎉

记得在社交媒体或朋友间分享你的数字花园链接！
