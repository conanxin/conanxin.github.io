# Xin Conan Digital Garden

> 在 WSL2 里种 AI，在终端里写文章

我的个人数字花园，记录本地 AI 实验、终端工具探索和对互联网的思考。

## 🚀 快速开始

```bash
# 克隆仓库
git clone https://github.com/conanxin/conanxin.github.io.git
cd conanxin.github.io

# 启动本地预览
./scripts/dev-server.sh

# 访问 http://localhost:8080
```

## 🛠 技术栈

- **纯 HTML/CSS** — 无构建工具，直接手写
- **终端风格设计** — JetBrains Mono 字体，暗色主题
- **GitHub Pages** — 免费托管，自动部署
- **WSL2** — 开发环境

## 📝 写作流程

```bash
# 1. 在 src/posts/ 创建新文章
cp src/posts/local-llm-guide.html src/posts/new-post.html

# 2. 编辑内容
nano src/posts/new-post.html

# 3. 更新索引和 RSS
# - 添加到 src/posts/index.html
# - 添加到 src/feed.xml
# - 更新 src/index.html 的文章列表

# 4. 本地预览
./scripts/dev-server.sh

# 5. 提交并推送
git add .
git commit -m "Add: 新文章标题"
git push origin main
```

## 🏗 项目结构

```
.
├── src/                    # 网站源码
│   ├── index.html         # 首页
│   ├── about.html         # 关于页面
│   ├── feed.xml           # RSS 订阅
│   ├── styles/            # CSS 样式
│   │   ├── main.css       # 主样式
│   │   └── post.css       # 文章页面样式
│   └── posts/             # 文章目录
│       ├── index.html     # 文章列表
│       ├── *.html         # 文章页面
│       └── images/        # 文章图片
├── scripts/               # 工具脚本
│   ├── dev-server.sh      # 本地预览
│   └── deploy.sh          # 手动部署
├── .github/workflows/     # GitHub Actions
│   └── deploy.yml         # 自动部署配置
└── README.md             # 本文件
```

## 🌐 线上地址

<https://conanxin.github.io>

## 📮 联系

- Email: hello@xin-conan.me
- RSS: <https://conanxin.github.io/feed.xml>

## 📜 许可

内容采用 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) 许可。
代码采用 MIT 许可。

---

Built with ◆ in WSL2
