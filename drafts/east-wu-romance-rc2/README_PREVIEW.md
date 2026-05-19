# 《赤壁以东：东吴演义》noindex 预览站说明

**版本：** RC1（Release Candidate 1）
**日期：** 2026-05-19
**状态：** 草稿校对版，**未正式发布**

---

## 一、当前状态

**重要：** 本站点为 noindex 校对预览站，所有页面均包含以下 meta 标签：

```html
<meta name="robots" content="noindex,nofollow,noarchive">
<meta name="googlebot" content="noindex,nofollow,noarchive">
```

同时 `robots.txt` 设置了全站禁止索引：

```
User-agent: *
Disallow: /
```

**请勿将此站点部署到公开互联网。**

---

## 二、如何本地查看

### 方式一：Python 内置服务器（推荐）

```bash
cd /home/ubuntu/projects/east-wu-romance/release_candidates/east-wu-romance-rc1/site
python3 -m http.server 8000
```

然后在浏览器中打开：

```
http://localhost:8000
```

### 方式二：直接用浏览器打开 HTML 文件

在文件管理器中找到：

```
release_candidates/east-wu-romance-rc1/site/index.html
```

双击打开（部分浏览器需要启用本地文件访问 JavaScript）。

### 方式三：使用 VS Code Live Server 扩展

在 VS Code 中打开 `site/` 目录，右键点击 `index.html`，选择 "Open with Live Server"。

---

## 三、目录结构

```
site/
├── index.html              # 目录页
├── robots.txt             # 禁止索引
├── chapters/              # 68个章节HTML
│   ├── 000_opening.html
│   ├── 001_dajiang_zhinan.html
│   └── ...
├── assets/
│   ├── css/
│   │   └── reader.css     # 阅读样式（本地）
│   └── js/
│       └── reader.js      # 交互脚本（本地）
└── data/
    ├── chapters.json      # 章节结构数据
    ├── book_metadata.json # 元数据
    └── search_index.json  # 搜索索引（轻量）
```

---

## 四、校对建议

### 4.1 推荐阅读顺序

**第一步：读目录**
打开 `index.html`，浏览七部结构，确认章节编号和标题无误。

**第二步：读关键章节**
| 章节 | 文件 | 原因 |
|------|------|------|
| 000 序章 | 000_opening.html | 全书视角设定 |
| 001 第一章 | 001_dajiang_zhinan.html | 正文起点 |
| 030 军书至巴蜀 | 030_junshu_zhi_bashu.html | Phase 11C补写 |
| 040 称帝 | 040_chengdi.html | 中腰章节 |
| 052 华亭之泪 | 052_huating_zhilei.html | 陆逊形象 |
| 067 终章 | 067_dajiang_yijiu.html | 尾声闭环 |

**第三步：按部阅读**
每天读 5-8 章，重点关注：
- 人物口吻是否一致
- 时间跳跃是否顺畅
- 重复意象是否过多
- "知道了"出现频率

### 4.2 检查重点

| 项目 | 说明 |
|------|------|
| 章节完整性 | 是否完整（无截断） |
| 人名/地名 | 是否正确 |
| 时间线 | 是否有矛盾 |
| 重复词句 | 是否过多 |
| 段落衔接 | 是否顺畅 |

---

## 五、关于部署

**当前状态：禁止索引（noindex）**

如需部署到内部测试服务器：
1. 确保服务器配置了 `X-Robots-Tag: noindex` 或在 HTML head 中包含 noindex meta
2. 或确保 `robots.txt` 中有 `Disallow: /`
3. 不要部署到公开互联网

**如后续发布正式版：**
1. 必须先确认是否移除 noindex
2. 必须经甲方确认后才能公开发布
3. 当前版本不得用于任何形式的公开传播

---

## 六、技术说明

| 项目 | 说明 |
|------|------|
| 样式 | 纯 CSS，支持浅色/深色模式（prefers-color-scheme） |
| 交互 | 纯 JS，无外部依赖 |
| 字体 | 系统字体，无外部字体加载 |
| CDN | 无外部 CDN 链接 |
| 网络请求 | 无（纯静态） |

---

## 七、后续行动

| 优先级 | 任务 | 说明 |
|--------|------|------|
| P0 | 人工校对 | 使用本预览站逐章检查 |
| P1 | 修复问题 | 根据校对结果修复 |
| P2 | 生成 RC2 | 修复后生成新版本 |
| P3 | 确认发布 | RC2确认后决定是否发布 |

---

## 八、联系方式

**项目目录：** /home/ubuntu/projects/east-wu-romance/
**预览站目录：** release_candidates/east-wu-romance-rc1/site/

---

*README_PREVIEW.md v1.0 | Phase 12C*
*noindex 校对预览站，请勿部署到公开互联网。*