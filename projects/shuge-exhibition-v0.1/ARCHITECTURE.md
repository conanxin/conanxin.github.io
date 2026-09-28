# SHUGE Digital Humanities Exhibition — v0.1 架构

**Project**: SHUGE-RESEARCH-DB → 公开展示
**Version**: v0.1
**Generated**: 2026-09-28

---

## 1. 总览 (Overview)

v0.1 是一个**完全静态**、**read-only**、**self-contained** 的网页展览:

```
┌─────────────────────────────────────────────────────────────┐
│                   数据源 (read-only)                         │
│  /home/conanxin/shuge-research-db/data/shuge.db (45.1 MB)  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│          数据导出层 (scripts/build_exhibition_data.py)        │
│  sqlite3 read-only → JSON snapshots                          │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  项目目录 (静态站点)                          │
│  /home/conanxin/conanxin.github.io/projects/                 │
│              shuge-exhibition-v0.1/                         │
│  ├── index.html              ← /  Project Overview          │
│  ├── collections/index.html  ← /collections/                 │
│  ├── evidence/index.html     ← /evidence/                    │
│  ├── research/index.html     ← /research/                    │
│  ├── css/style.css           (~10 KB)                       │
│  ├── js/main.js              (~3 KB)                        │
│  └── data/                                                   │
│      ├── manifest.json       (1.2 KB) 全站指标              │
│      ├── works.json          (691 KB) 9 featured works      │
│      ├── collections.json    (10.6 KB) 2 collections        │
│      ├── citations.json      (81.9 KB) 23 runs             │
│      ├── institutions.json   (8.2 KB) 30 institutions       │
│      └── workspaces.json     (8.7 KB) 3 workspaces          │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              静态托管 (GitHub Pages)                          │
│  https://conanxin.github.io/projects/                        │
│              shuge-exhibition-v0.1/                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. 数据导出层 (Data Export Layer)

### 2.1 脚本

`scripts/build_exhibition_data.py` — 仅读 SQLite,生成 JSON:

```python
# Read-only connection
db = sqlite3.connect('file:data/shuge.db?mode=ro', uri=True)

# 6 个 JSON 输出
data/manifest.json       ← 总览徽章
data/works.json          ← 9 featured works (post_id INT 220633)
data/collections.json    ← 2 collections + defs + snapshots + 12 sample memberships
data/citations.json      ← 15 BRIEF_READY runs + 8 INSUFFICIENT runs
data/institutions.json   ← top 30 institutions (按 works_count 排序)
data/workspaces.json     ← 3 workspaces + P5-D QA 样本 + negative controls
```

### 2.2 Read-Only 约束

- 通过 SQLite URI `?mode=ro` 强制 read-only
- 任何 UPDATE/INSERT/DELETE 会被 SQLite 自身拒绝
- 验证: `PRAGMA quick_check` 在导出前 + 导出后
- DB 实际大小 45.99 MB (P5-D 终态)

### 2.3 导出时机

- v0.1 一次性生成（每次 P5 阶段完成时）
- 未来可加入 `scripts/refresh_exhibition.py` 定时任务
- 当前无 CI hook,数据由人工触发更新

### 2.4 数据量

| 文件 | 字节 | 行/项数 | 来源 |
|---|---|---|---|
| manifest.json | 1,178 | 1 | SQL aggregations |
| works.json | 690,791 | 9 featured + 1 total | SQL JOIN works + page_objects + page_ocr + editions + collection_memberships |
| collections.json | 10,595 | 2 collections | SQL JOIN collections + definitions + snapshots + audit |
| citations.json | 81,867 | 23 runs | SQL JOIN research_runs + research_claims + research_evidence |
| institutions.json | 8,189 | 30 institutions | SQL JOIN institutions + institution_aliases + sources |
| workspaces.json | 8,745 | 3 workspaces + 8 QA + 12 negatives | DB read + P5-D files |

---

## 3. 前端架构 (Frontend Architecture)

### 3.1 技术栈

| 层 | 选型 | 理由 |
|---|---|---|
| HTML | 静态 HTML5 | 无 SEO 顾虑,GitHub Pages 直出 |
| CSS | 手写 CSS (no framework) | 数据量小,无需 Tailwind/Bootstrap |
| JS | Vanilla JS (~3 KB) | 仅 accordion + filter state |
| 字体 | Google Fonts CDN | Noto Serif CJK SC + Source Serif + IBM Plex Mono |
| 图标 | 文字符号 / 圈点 / SVG inline | 无 emoji,无图标库 |
| 构建 | 无 | 静态文件即可 |

### 3.2 页面骨架

每个 HTML 共享:
- `<head>` — meta + title + Google Fonts + `css/style.css`
- `<body class="page-{slug}">` — body class 用于 active nav 标记
- `<header class="masthead">` — 项目名 + 副标题
- `<nav class="topnav">` — 4 个一级链接
- `<main class="body">` — 页面主体
- `<footer>` — 出处 + GitHub + 生成时间戳

### 3.3 数据嵌入方式

```html
<!-- 静态 HTML 中 -->
<script src="js/main.js"></script>
<script>
  // 异步 fetch 加载 JSON (数据与代码分离)
  fetch('data/manifest.json').then(r => r.json()).then(d => {
    document.getElementById('stat-works').textContent = d.totals.works;
  });
</script>
```

- 数据在浏览器加载时由 fetch 异步加载
- 避免 `<script type="application/json">` 内嵌 (避免 HTML 文件过大)

### 3.4 路由 (Routing)

- 文件系统路由：每个 HTML 对应一个路径
- 4 个独立页面，**不使用 SPA**
- `<a href>` 跳转，浏览器完整加载

---

## 4. 部署 (Deployment)

### 4.1 路径

```
本地: /home/conanxin/conanxin.github.io/projects/shuge-exhibition-v0.1/
远程: https://conanxin.github.io/projects/shuge-exhibition-v0.1/
```

### 4.2 Git 工作流

```bash
cd /home/conanxin/conanxin.github.io
git add projects/shuge-exhibition-v0.1/
git -c user.email='...' -c user.name='Xin Conan' commit -m 'feat(shuge-exhibition): v0.1 prototype'
git push origin main
```

GitHub Pages 自动部署 (`main` 分支 → GitHub Pages 静态站)。

### 4.3 验证

- 本地: `python3 -m http.server 8000 --directory /home/conanxin/conanxin.github.io/projects/shuge-exhibition-v0.1`
- 远程: 浏览器访问 `https://conanxin.github.io/projects/shuge-exhibition-v0.1/`

---

## 5. 安全与隐私 (Security & Privacy)

- **不收集任何用户数据**：无 cookie、无 localStorage、无 analytics
- **不发起外部网络请求**：除字体 CDN 外无第三方
- **不写入 DB**：所有改动是导出 JSON (read-only DB)
- **public-only 数据**：所有内容已存在于 conanxin.github.io (POST 数据本身公开)

---

## 6. 可扩展性 (Extensibility)

### 6.1 添加新页面

1. 新建 `pages/foo/index.html` (或根目录 `foo.html`)
2. 在所有页面的 `<nav>` 中加入新链接
3. 在 `scripts/build_exhibition_data.py` 中加入新数据导出
4. 提交 git

### 6.2 添加新数据维度

当前 6 个 JSON 文件可拆分为更多 (按需):
- `data/editions.json` (618 editions)
- `data/tags.json` (3614 tags)
- `data/page_samples.json` (各 work 前 3 页 OCR 文本)

### 6.3 添加搜索

v0.1 不带搜索; 未来可加入:
- 客户端 lunr.js 全文索引 works.json / citations.json
- 服务端 FTS5 实时查询 (需后端)

---

## 7. 已知限制 (Known Limits)

| 限制 | 影响 | v0.1 应对 |
|---|---|---|
| works.json 691 KB | 网络传输 1-2 sec | 接受 (GitHub Pages CDN 友好) |
| 无搜索 | 用户无法全文查找 | 文档中提示: 完整查询走 research.py CLI |
| 无 SPA | 每次跳转完整加载 | 数据小,无感知 |
| 桌面优先 | 移动端布局未优化 | v0.2 加入响应式 |
| 仅中文 zh-Hans | 英文用户需要阅读能力 | v0.2 加入 en 切换 |

---

## 8. 未来版本 (Future)

- **v0.2**: 移动响应式 + 全文客户端搜索 (lunr.js)
- **v0.3**: 后端 FTS5 + REST API
- **v1.0**: 多语切换 + 暗色模式 + 引文 PDF 导出

---

**END OF ARCHITECTURE.md**
