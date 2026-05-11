# UAP Files Web — v0.1 Project Report

**STATUS:** COMPLETE (local prototype, no production changes)
**DATE:** 2026-05-11
**PROJECT_DIR:** ~/projects/uap-files-web

---

## STATUS

**PASS** — All 6 deliverables created in local project directory. No production systems modified. No background processes started. No deployment attempted.

---

## HOST_SCOPE

- **Environment:** cloud Hermes (VM-0-4-ubuntu)
- **Scope:** Local file creation + local http.server preview only
- **Production services touched:** None
- **Background processes:** None started
- **Network access used:** None (webpage is purely local/static)

---

## PROJECT_DIR

```
~/projects/uap-files-web/
├── index.html
├── style.css
├── app.js
├── data.js
├── README.md
└── reports/
    └── uap_files_web_v0_1_report.md   ← 本报告
```

---

## FILES_CREATED

| File | Lines | Purpose |
|------|-------|---------|
| `index.html` | ~380 | 主页面：Hero + 6 Sections (A-F) |
| `style.css` | ~500 | 冷战档案视觉系统：暗色/红外/雷达网格/扫描线 |
| `app.js` | ~160 | 交互：Category 筛选 + 卡片渲染 + 证据强度条 |
| `data.js` | ~240 | 10 个案例卡片数据 |
| `README.md` | ~170 | 项目文档 + 来源链接 + 预览说明 |
| `reports/uap_files_web_v0_1_report.md` | ~120 | 本报告 |

**Total bytes written:** ~46 KB across 6 files

---

## SOURCES_USED

### 官方来源
- PURSUE 入口: `https://www.war.gov/ufo/`
- 官方新闻稿: `https://www.war.gov/News/Releases/Release/Article/4480582/department-of-war-releases-unidentified-anomalous-phenomena-files-in-historic-t/`

### 媒体参考
- WIRED: "Orbs, Saucers, and Flashes on the Moon: Pentagon Drops New UFO Files"
- Live Science: "US government declassifies nearly 200 UAP files…"
- The Guardian: "Pentagon releases first batch of previously secret files documenting reports of UFOs"

### 历史档案参考
- Project Blue Book (USAF, 1947-1969)
- Condon Report (1968)
- AATIP (2007-2012, disclosed 2017)
- UAPTF (2019)
- AARO (est. 2022)

**Note:** 具体 PURSUE 档案编号和原文引用未逐一核实——数据.js 中的案例描述基于公开媒体梳理，是研究性近似，而非 PURSUE 原文引用。

---

## DESIGN_DECISIONS

### 视觉风格
- **主色板：** 黑色 (#080808) + 红外红 (#c0392b) + 琥珀 (#d4ac0d)
- **扫描线叠加：** CSS `repeating-linear-gradient` 模拟老式 CRT 屏幕
- **雷达网格：** CSS radial + linear gradients 模拟雷达屏
- **字体：** Courier New (monospace) 用于标题/标签，系统 sans-serif 用于正文
- **无外部图片：** 所有视觉效果通过纯 CSS 实现，不依赖 CDN

### 交互设计
- **筛选系统：** 6 个 Category Tab（全部/NASA/Military/Historical/FBI/Visual）
- **证据强度条：** 6-pip bar，红色（1-4）/橙色（5-6）
- **状态标签：** 5 种颜色编码（绿/红/橙/紫/蓝）
- **滚动动画：** IntersectionObserver 淡入，零外部依赖

### 移动端适配
- CSS Grid `minmax(320px, 1fr)` 自适应列宽
- `@media (max-width: 390px)` 强制单列溢出检查
- 无固定 px 宽度，所有宽度相对化

### 克制性设计原则
- 无 WebGL / Canvas 动画（性能 + 依赖）
- 无 Three.js / D3.js 等可视化库（过重）
- 无外部字体 CDN（防止加载失败）
- 无图片盗链（仅 CSS 视觉占位）

---

## CASES_INCLUDED

| # | ID | Year | Agency | Category | Evidence Level |
|---|-----|------|--------|----------|----------------|
| 1 | gemini-vii-1965 | 1965 | NASA | NASA | 2/6 |
| 2 | apollo-11-lunar-flash-1969 | 1969 | NASA | NASA | 3/6 |
| 3 | apollo-12-occultation-1969 | 1969 | NASA | NASA | 1/6 |
| 4 | pan-am-1947 | 1947 | USAF / Pan Am | Historical | 2/6 |
| 5 | rendlesham-forest-1980 | 1980 | U.S. Air Force / RAF | Military | 3/6 |
| 6 | uss-nimitz-tic-tac-2004 | 2004 | U.S. Navy / AATIP | Military | 5/6 |
| 7 | gofast-2015 | 2015 | U.S. Navy / AATIP | Military | 4/6 |
| 8 | orbs-pacific-2023 | 2023 | DOW / AARO | Military | 3/6 |
| 9 | fbi-louisville-1949 | 1949 | FBI / Project Blue Book | FBI | 2/6 |
| 10 | pentagon-2017-aatip | 2017 | DIA / AATIP / UAPTF | Military | 4/6 |

---

## VALIDATION

### 1. File Existence
```
✓ index.html    — 18318 bytes
✓ style.css     — 16281 bytes
✓ app.js        —  6498 bytes
✓ data.js       — 10454 bytes
✓ README.md     —  5276 bytes
✓ reports/      —  dir exists
```

### 2. Local Path Check
- `index.html` 中无任何 `file://` 或 `/home/` 等绝对本地路径
- 所有外链为 `https://` 外部 URL
- CSS/JS 引用使用相对路径 `./`

### 3. Mobile Width Check (390px)
- CSS 使用 `clamp()`、`vw` 单位、`minmax()` 避免固定宽度
- `.cases-grid` 在 390px 下为单列
- `.info-grid` 在 600px 下为 2 列，在 390px 下为 1 列
- 无 `overflow-x` 问题预期

### 4. No Dead Local Links
- `style.css` 引用：无外部字体 CDN
- `app.js`：纯 IIFE，无外部 XHR/fetch
- `data.js`：纯静态 JS 对象
- 所有图片为 CSS 占位，无 `<img>` 标签需要验证

### 5. HTTP Server Preview (planned)
```bash
cd ~/projects/uap-files-web
python3 -m http.server 8080
# → http://localhost:8080
```

---

## NEXT_RECOMMENDED_ACTION

### 短期（v0.2 改进）
1. **核实 PURSUE 原文**：将 data.js 中的案例描述与 PURSUE Release 01 原文逐一对照，替换为档案原文引用（含档案编号）
2. **添加档案 PDF 链接**：为每个案例卡片添加指向 PURSUE 原文的 `source_url` 字段
3. **改善无障碍**：为证据强度条添加 `aria-label`，为筛选按钮添加键盘导航
4. **中文术语审定**：邀请熟悉 NASA/军方术语的读者核实关键翻译

### 中期（可部署版本）
1. **图片策略**：获取/托管 PURSUE 官方图片，或明确标注"无官方图片授权，仅 CSS 占位"
2. **多语言**：提供 EN/ZH 双语切换
3. **静态生成**：考虑用 11ty/Hugo 替代手写 HTML，便于维护

### 长期（研究级）
1. **结构化数据**：将案例数据迁移至 JSON schema，添加 `archive_id`、`date_range`、`sensor_types` 等字段
2. **来源追溯**：建立 PURSUE 档案编号 → 案例卡片的映射表
3. **可视化增强**：添加时间线可视化（纯 CSS/SVG，不引入 D3）

---

## PREVIEW_COMMAND

```bash
cd ~/projects/uap-files-web
python3 -m http.server 8080
# → http://localhost:8080
```

---

*Report generated: 2026-05-11 | Hermes Agent (cloud Hermes, VM-0-4-ubuntu) | Production scope: NONE*
