# UAP Files Web — v0.4 Curated Exhibition Report

**STATUS:** PASS
**HOST_SCOPE:** local (cloud Hermes VM)
**PROJECT_DIR:** ~/projects/uap-files-web

---

## 执行摘要

v0.4 在 v0.3.3（Pan Am streaming scan 67.2%, needs_review 保持）完成后，将项目从"案例资料库"升级为"中文线上小展览"。本次重点是策展叙事层：帮助读者理解"如何阅读这 10 个 UAP 档案"。所有变更在 HTML 结构 / CSS 样式 / JS 交互层，**不修改 data.js，不下载任何文件，不继续 NARA 探针。**

---

## FILES_BACKED_UP

备份目录：`.backup-v0_4-20260511_182033/`

| File | Size |
|------|------|
| index.html | 22,109 |
| style.css | 22,592 |
| app.js | 15,590 |
| data.js | 22,813 |
| README.md | 23,712 |
| uap_files_web_v0_3_3_pan_am_full_metadata_scan_report.md | 13,486 |

---

## FILES_MODIFIED

| File | Change |
|------|--------|
| `index.html` | +3 sections after Hero: curation-guide + evidence-matrix + reading-routes; footer version bumped to v0.4 |
| `style.css` | +270 lines: guide-cards, matrix-grid, routes-grid, reading-route-nav, mobile breakpoints |
| `app.js` | +58 lines: navigateToRoute() global function; IntersectionObserver new elements |
| `README.md` | Complete rewrite: v0.4 changelog, source status, file structure, preview command |

---

## NEW_SECTIONS

### Section 1: `curation-guide` — 「如何阅读这 10 个 UAP 案例」
**位置：** Hero 之后、案例卡片之前

**子结构：**
- `reading-route-nav`：导览区顶部快捷导航按钮（太空任务 / 军方影像 / 档案边界）
- `guide-cards`：5 个导览卡片（01–05），每卡含标题+正文

**5 个导览小节：**

| # | 标题 | 核心信息 |
|---|------|---------|
| 01 | 先看"证据类型"，不要先问"是不是外星人" | 仅目击→文字→影像→多传感器→物理样本→可重复，是不同证据等级；视频震撼≠信息量足够 |
| 02 | 把"未解释"理解为数据状态，而不是结论 | unresolved = 数据不足 ≠ 外星技术；数据不足与现象异常是两件完全不同的事 |
| 03 | 太空任务案例为什么迷人 | Gemini/Apollo 把冷战太空竞赛+NASA档案+人类想象编织在一起；需考虑技术背景 |
| 04 | 军方影像为什么重要 | 真正重要的不是单帧截图，而是数据链条是否完整（红外×雷达×目视交叉印证） |
| 05 | 为什么保留一个 needs_review 案例 | Pan Am 1947 不是失败案例，是档案研究的真实边界；体现档案研究的本来面目 |

**设计风格：** 编号大字体压底色（`rgba(255,255,255,0.06)`），hover 时变红色；正文 0.82rem，行距 1.7；导览区视觉类似档案导览牌。

---

### Section 2: `evidence-matrix` — 证据阅读矩阵
**位置：** curation-guide 之后

**结构：** 4 列 × 7 行（1 表头 + 6 数据行）CSS Grid 表格

| 列 | 内容 |
|----|------|
| 证据层级 | 文字报告 / 官方视频 / 多传感器同步 / NASA档案记录 / 官方目录条目 / 待核实记录 |
| 你能知道什么 | 每种证据层级能确立的事实 |
| 你不能推出什么 | 反向思维，明确"证据不等于结论"（红色斜体） |
| 对应案例 | 实际案例名称 |

**移动端：** 390px 下，列 3 和列 4 折叠到新行，保持可读性。

---

### Section 3: `reading-routes` — 推荐阅读路线
**位置：** evidence-matrix 之后

**3 条路线卡片：**

| 路线 | 图标 | 案例标签 | CTA 行为 |
|------|------|---------|---------|
| 🚀 太空任务 | Gemini VII / Apollo 11 / Apollo 12 | "查看太空任务案例 →" | navigateToRoute('space') → 滚动 + 筛选 NASA |
| 🛡️ 军方影像 | USS Nimitz Tic Tac / GOFAST / 2023 Orbs / 2024 ME | "查看军方影像案例 →" | navigateToRoute('military') → 滚动 + 筛选 Military |
| 📁 档案边界 | Pan Am 1947 / Rendlesham Forest / FBI Louisville | "查看档案边界案例 →" | navigateToRoute('archive') → 滚动 + 筛选 Historical+FBI |

**设计风格：** 三列 Grid；卡片 hover 上浮 2px + 边框色变化；route-cta 按钮随路线色调变化（蓝/红/橙）。

---

## NARRATIVE_DECISIONS

1. **策展导览不是"使用说明"**：5 个小节不是操作指南，而是帮助读者建立正确的认知框架——先理解"未解释≠外星"，再进入具体案例。

2. **证据阅读矩阵采用双向思维**：每个证据层级同时列出"能知道什么"和"不能推出什么"，培养证据评估习惯而非被动接受叙事。

3. **Pan Am 1947 保留 needs_review 的价值**：第 05 小节明确说明"这不是失败案例"，为读者解释为何页面不强行关闭这个研究路径，同时保持诚实。

4. **导航按钮与案例筛选深度绑定**：`navigateToRoute()` 不仅滚动，还 reset status filter 并手动控制 category 卡片显隐，保证多分类路由（archive: Historical+FBI）正常工作。

---

## READING_ROUTES

**navigateToRoute(routeId) 行为规范：**

```
输入: 'space'    → 类别: ['NASA']
输入: 'military'  → 类别: ['Military']
输入: 'archive'   → 类别: ['Historical', 'FBI']
```

**执行步骤：**
1. 高亮 route-btn（active 状态）
2. 平滑滚动到 `#top-cases`
3. Reset status filter → 'all'
4. 如果单类别 → 点击对应 category tab
5. 如果多类别 → reset to 'all' + 手动隐藏不匹配卡片

**测试场景：**
- 点击"太空任务"→ 应只显示 Gemini VII / Apollo 11 / Apollo 12
- 点击"档案边界"→ 应显示 Pan Am 1947 / Rendlesham Forest / FBI Louisville
- 点击"全部来源" status filter → 三条路线筛选结果不变（category 独立于 status）

---

## EVIDENCE_MATRIX

| 证据层级 | 你能知道 | 你不能推出 | 对应案例 |
|---------|---------|----------|---------|
| 文字报告 | 有人或机构曾经这样记录过 | 叙述必然完整、准确、未被转述扭曲 | FBI Louisville、Rendlesham Forest |
| 官方视频 | 影像存在且由官方渠道发布 | 影像对象必然异常或来自外星 | GOFAST、USS Nimitz Tic Tac |
| 多传感器同步 | 红外、雷达、目视多维度同时捕捉到目标 | 目标真实存在且可归因为特定现象 | 2023 Orbs |
| NASA 档案记录 | 航天任务期间存在特定目击或异常记录 | NASA 确认该现象为异常或无法解释 | Gemini VII、Apollo 11/12/17 |
| 官方目录条目 | 档案系统中存在对应条目或编号 | 目录内容已被解释为确凿事实 | Pan Am 1947（Blue Book catalog） |
| 待核实记录 | 公开叙事存在，进一步研究路径存在 | 官方档案已闭合或结论已知 | Pan Am 1947（needs_review） |

---

## PAN_AM_BOUNDARY_TREATMENT

- **v0.4 结论：** Pan Am 1947 **保持 needs_review**（无修改）
- **v0.3.3 结果已固化到第 05 导览小节：**
  - "已进行 NARA 小型 metadata probe 和 597821 部分流式扫描"
  - "均未找到精确匹配"
  - "诚实保留 needs_review"
  - "体现了档案研究的本来面目：有些材料必须进入缩微胶片室、官方 Finding Aid 或实体档案柜"
- **不做：** 不继续扫描 597821，不下载大文件，不降级为 secondary_only
- **理由：** 这是档案研究的真实状态，不是"未解决"的失败——第 05 小节的说明本身就是展览叙事的一部分

---

## VALIDATION

### 数据完整性（execute_code 审计）
```
CASE_COUNT=10, UNIQUE=10, SUM=10 ✓
verified=5, secondary_only=4, needs_review=1 ✓
pan-am-1947: status=needs_review ✓
```

### 语法检查
```
data.js node --check: PASS ✓
app.js node --check: PASS ✓
```

### HTTP 服务验证（python3 -m http.server 8765）
```
/ (index.html)        → 200 ✓
/style.css            → 200 ✓
/app.js               → 200 ✓
/data.js              → 200 ✓
/README.md            → 200 ✓
```

### 死链检查
```
grep /home/ in index.html  → 0 matches ✓
grep /home/ in app.js       → 0 matches ✓
grep /home/ in data.js      → 0 matches ✓
```

### 内容锚点验证
```
grep "如何阅读这 10 个 UAP 案例" index.html → 1 match ✓
grep "推荐阅读路线" index.html               → 1 match ✓
grep "证据阅读矩阵" index.html               → 1 match ✓
grep "未解释，不等于外星" index.html         → 1 match ✓
grep "needs_review" index.html               → 1 match ✓
```

---

## REPORT_PATH

```
~/projects/uap-files-web/reports/uap_files_web_v0_4_curated_exhibition_report.md
```

---

## PREVIEW_COMMAND

```bash
cd ~/projects/uap-files-web
python3 -m http.server 8765
# 浏览器打开 http://localhost:8765
```

---

## NEXT_RECOMMENDED_ACTION

**内容策展阶段已完成。** 推荐以下任一方向：

1. **中文本地化深化** — 将现有 5 个导览小节扩充为更完整的展览叙事；考虑增加更多历史上下文（如 1947 Kenneth Arnold 事件、Blue Book 起源、Condon Report 等）

2. **响应式视觉审计** — 在真实浏览器（而非 HTTP server）测试 390px 移动端下证据矩阵和路线卡片的实际渲染

3. **路线交互完善** — `navigateToRoute()` 点击"档案边界"后，如果用户切换 category filter，路线按钮的 active 状态不会 reset；可考虑同步路线按钮状态与 filter 变化

4. **Pan Am 线下查档** — 如有机会进入 NARA reading room，可查阅 T-1206 微缩胶片 July–September 1947 相关卷轴，这是当前唯一 remaining research_path
