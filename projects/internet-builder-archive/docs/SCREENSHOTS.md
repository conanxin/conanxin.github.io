# 页面截图 / Screenshots

本文档说明 Phase 2I 阶段生成的页面截图文件列表、用途和生成方式。

---

## 截图文件列表

| 文件路径 | 对应页面 | 视口尺寸 | 说明 |
|---------|---------|---------|------|
| `assets/screenshots/home-desktop.png` | index.html | 1440×1100 | 首页截图，包含标题、统计、专题路径卡片 |
| `assets/screenshots/home-mobile.png` | index.html | 390×1200 | 移动端首页，验证响应式布局 |
| `assets/screenshots/guide-desktop.png` | guide.html | 1440×1100 | 导览页截图，展示整体结构 |
| `assets/screenshots/path-founder-spirit-desktop.png` | paths/founder-spirit.html | 1440×1100 | 专题路径页截图（创始人精神谱系） |
| `assets/screenshots/path-creator-mindset-desktop.png` | paths/creator-mindset.html | 1440×1100 | 专题路径页截图（创作者心智与长期主义） |
| `assets/screenshots/path-index-desktop.png` | paths/index.html | 1440×1100 | 5 条专题路径索引页截图 |

---

## 生成方式

使用 Chromium headless 截图：

```bash
# 启动本地静态文件服务（任意端口）
cd /home/ubuntu/conanxin.github.io
python3 -m http.server 8765

# 截图（示例）
chromium --headless --no-sandbox --disable-gpu \
  --screenshot=output.png --window-size=1440,1100 \
  "http://localhost:8765/projects/internet-builder-archive/"
```

**关键参数：**
- `--headless`：无头模式，不显示窗口
- `--no-sandbox`：在云端环境绕过沙箱限制
- `--disable-gpu`：禁用 GPU，避免渲染问题
- `--disable-dev-shm-usage`：避免 /dev/shm 共享内存问题
- `--screenshot=PATH`：输出 PNG 文件路径
- `--window-size=W,H`：视口尺寸（像素）

**输出格式：** PNG，RGB，1440×1100 或 390×1200

---

## 视口尺寸说明

- **1440×1100**：桌面端截图，宽屏显示区域，不含浏览器窗口元素
- **390×1200**：移动端截图（iPhone 风格），高度较长以展示首屏以下内容

---

## 每张截图的页面状态说明

### home-desktop.png
- 静态 HTML 已加载，CSS 样式生效
- `app.js` 动态渲染 path-cards（专题路径卡片）
- 若截图时网络字体/CDN 未加载，页面使用系统字体回退
- YouTube iframe 可能因浏览器策略显示占位符，不影响主体

### guide-desktop.png
- 导览页为纯静态 HTML，无需 JS
- 5 条专题路径卡片完整渲染
- 路径"独立页面"按钮已显示（Phase 2H 增加）

### path-founder-spirit-desktop.png
- 专题路径页为纯静态 HTML
- 8 条推荐条目已按顺序编号展示
- 每条包含标题、标签、策展导读、来源链接

### path-index-desktop.png
- 路径索引页为纯静态 HTML
- 5 条路径以列表形式展示

---

## 页面大改后如何重新生成

1. 启动本地 HTTP 服务
2. 对每个目标页面执行截图命令
3. 替换 `assets/screenshots/` 下的 PNG 文件
4. 更新 README.md 和 docs/launch/README_SHOWCASE_BLOCK.md 中的截图引用

**注意**：若页面改动涉及布局大改，建议重新截图所有文件以保持一致性。

---

## 未来改进方向

- 自动化截图测试（使用 GitHub Actions 在每次 push 后截图并比对）
- 增加更多视口尺寸（平板 1024×768 等）
- 截图 diff 以检测视觉回归