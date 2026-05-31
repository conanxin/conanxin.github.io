# Phase 2I — 生成 README 展示截图与页面截图

**日期**：2026-05-31
**执行状态**：✅ SUCCESS
**Git commit**：待提交

---

## 1. 本阶段目标

使用 Chromium headless 为 internet-builder-archive 项目生成真实页面截图，用于 README、发布材料和社交分享。

---

## 2. 截图能力检测结果

**检测工具**：`/snap/bin/chromium`（Chromium 148.0.7778.167 snap）+ 本地 HTTP 服务

**可用工具确认**：
- ✅ Chromium (snap) — `/snap/bin/chromium`
- ✅ `playwright` CLI — 存在但 Playwright MS Chromium 未安装（playwright Node/Python SDK 未安装）
- ❌ Playwright Python SDK — 未安装
- ❌ Playwright Node SDK — 未安装
- ❌ Puppeteer — 未安装

**截图方案**：直接使用 `/snap/bin/chromium --headless --screenshot=...` + 本地 Python HTTP 服务器

**截图能力状态**：✅ 可用（无需安装新依赖）

---

## 3. 实际生成的截图列表

| 文件 | 对应页面 | 视口 | 文件大小 | 状态 |
|------|---------|------|---------|------|
| `assets/screenshots/home-desktop.png` | index.html | 1440×1100 | 165,490 bytes | ✅ |
| `assets/screenshots/home-mobile.png` | index.html | 390×1200 | 129,316 bytes | ✅ |
| `assets/screenshots/guide-desktop.png` | guide.html | 1440×1100 | 226,720 bytes | ✅ |
| `assets/screenshots/path-founder-spirit-desktop.png` | paths/founder-spirit.html | 1440×1100 | 147,454 bytes | ✅ |
| `assets/screenshots/path-creator-mindset-desktop.png` | paths/creator-mindset.html | 1440×1100 | 154,702 bytes | ✅ |
| `assets/screenshots/path-index-desktop.png` | paths/index.html | 1440×1100 | 71,789 bytes | ✅ |

**说明**：
- 所有截图均为 PNG 格式，RGB，8-bit
- 文件大小差异反映页面内容复杂度（guide.html 含大量结构化内容，path-index.html 为简单列表）
- 截图使用本地 HTTP 服务器（端口 8765）避免 GitHub Pages 缓存影响
- YouTube iframe 在 headless 模式下可能不加载，不影响主体内容可见性

---

## 4. 未生成截图及原因

无。所有计划截图均已成功生成。

---

## 5. README 更新说明

在 `README.md` 末尾追加 **"页面截图 / Screenshots"** 小节：
- 添加 home-desktop.png 截图引用
- 添加 guide-desktop.png 截图引用
- 添加 path-founder-spirit-desktop.png 截图引用
- 添加 path-index-desktop.png 截图引用
- 同时修正了 staging 条目数量（10→4）的旧说明

---

## 6. 发布材料更新说明

更新 `docs/launch/README_SHOWCASE_BLOCK.md`：
- 在"版权与来源说明"前插入 **"页面预览"** 小节
- 引用 home-desktop.png 和 guide-desktop.png 截图

---

## 7. 校验结果

| 检查项 | 结果 |
|--------|------|
| data/items.json JSON 合法 | ✅ PASS |
| data/paths.json JSON 合法 | ✅ PASS |
| 74 条 id 唯一 | ✅ PASS |
| verified_embed=31 | ✅ PASS |
| verified_source=39 | ✅ PASS |
| staging=4 | ✅ PASS |
| 70 条 verified 均有 curator_note_zh | ✅ PASS |
| paths.json 不引用 staging | ✅ PASS |
| assets/screenshots/*.png 存在且非空 | ✅ PASS（6 个 PNG） |
| README.md 中截图路径存在 | ✅ PASS |
| docs/launch/README_SHOWCASE_BLOCK.md 中截图路径存在 | ✅ PASS |
| HTML 无外部 CDN 新增 | ✅ PASS |
| app.js 语法正确 | ✅ PASS |
| SVG 无外部资源 | ✅ PASS |
| 项目目录无 items.backup*.json | ✅ PASS |
| 项目目录无 phase*_update.py 临时脚本 | ✅ PASS |
| 本地静态服务已停止 | ✅ PASS |

---

## 8. 项目统计

| 指标 | 数值 |
|------|------|
| total | 74 |
| verified_embed | 31 |
| verified_source | 39 |
| verified 合计 | 70 |
| staging | 4 |
| paths | 5 |
| 专题路径页 | 5 |

---

## 9. Git 状态

修改文件：
- `README.md` — 追加 Screenshots 小节 + 修正 staging 数量
- `docs/launch/README_SHOWCASE_BLOCK.md` — 插入页面预览小节

新增文件：
- `assets/screenshots/home-desktop.png` (165,490 bytes)
- `assets/screenshots/home-mobile.png` (129,316 bytes)
- `assets/screenshots/guide-desktop.png` (226,720 bytes)
- `assets/screenshots/path-founder-spirit-desktop.png` (147,454 bytes)
- `assets/screenshots/path-creator-mindset-desktop.png` (154,702 bytes)
- `assets/screenshots/path-index-desktop.png` (71,789 bytes)
- `docs/SCREENSHOTS.md` — 截图说明文档
- `docs/PHASE_2I_SCREENSHOTS_REPORT.md`（本报告）

---

## 10. 下一步建议

1. **Phase 2B-B2**：用户补充 4 条 P0 截图后处理 remaining staging（iba-013, iba-029, iba-066, iba-073）

2. **Phase 2J**：生成 `sitemap.xml` / `robots.txt`，若主站需要

3. **Phase 2K**：为 5 条专题路径各生成单独分享卡片 SVG（与iba-share-card.svg 风格一致）

---

## 11. GitHub Pages 访问地址

| 页面/资源 | URL |
|---------|-----|
| 项目首页 | https://conanxin.github.io/projects/internet-builder-archive/ |
| 导览页 | https://conanxin.github.io/projects/internet-builder-archive/guide.html |
| 专题路径 1 | https://conanxin.github.io/projects/internet-builder-archive/paths/founder-spirit.html |
| 专题路径 2 | https://conanxin.github.io/projects/internet-builder-archive/paths/tech-startup-history.html |
| 专题路径 3 | https://conanxin.github.io/projects/internet-builder-archive/paths/media-and-society.html |
| 专题路径 4 | https://conanxin.github.io/projects/internet-builder-archive/paths/creator-mindset.html |
| 专题路径 5 | https://conanxin.github.io/projects/internet-builder-archive/paths/organization-and-strategy.html |
| 首页截图 | https://conanxin.github.io/projects/internet-builder-archive/assets/screenshots/home-desktop.png |
| 导览页截图 | https://conanxin.github.io/projects/internet-builder-archive/assets/screenshots/guide-desktop.png |
| 专题路径截图 | https://conanxin.github.io/projects/internet-builder-archive/assets/screenshots/path-founder-spirit-desktop.png |
| 路径索引截图 | https://conanxin.github.io/projects/internet-builder-archive/assets/screenshots/path-index-desktop.png |