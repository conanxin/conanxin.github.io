# 乱离途中，杜甫何以成为"杜甫"？

杜甫流离路线交互式阅读与文旅路线页面。

基于《三联生活周刊》2025年第40期封面故事《乱离途中，杜甫何以成为"杜甫"？》整理。

## Version

Current public version: **v1.0**
Live URL: https://conanxin.github.io/projects/dufu-luanli-route/
Latest release phase: Phase 5B / Handbook Links

## Project Status

**Stable public version.** Future work should prefer data extraction and reusable structure instead of continuing to add large inline HTML/JS blocks.

## Maintenance Rule

- Do not add new large features directly into `index.html` unless necessary.
- Prefer extracting route/location/poem data into JSON in the next major phase.
- Keep source project and GitHub Pages directory synchronized.

## 内容模块

- **Hero 首屏**：标题、副标题、关键词卡片、三个行动按钮
- **文章内容梳理**：四标签页（文章讲了什么 / 文章结构 / 核心观点 / 为何乱离中成杜甫）
- **杜甫流离时间线**：755–759 年纵向时间线，含事件、诗歌、重要性说明
- **SVG 路线地图**：可点击节点，右侧显示地点详情卡片（含地点类型标签）
- **文旅路线规划器**：7天精华线 / 12天完整线 / 4条主题短线 / 双城读诗线，支持复制行程
- **路线选择器**：四张选择卡片（第一次走 / 完整理解 / 时间有限 / 城市轻旅行）
- **旅行实用提醒**：6条实用提醒卡片（交通/季节/体力/阅读/现场/核实）
- **按诗找地点**：点击诗名高亮地图节点
- **来源与边界说明**：4卡片（文章来源/诗句引用/地名说明/旅行说明）

## 预览命令

```bash
cd ~/projects/dufu-luanli-route-page
python3 -m http.server 8080
```

然后在浏览器打开 http://localhost:8080

## 文件列表

```
dufu-luanli-route-page/
├── index.html                  # 主页面
├── style.css                  # 样式表
├── app.js                     # 应用逻辑
├── README.md                  # 本文件
├── CHANGELOG.md               # 完整变更记录
├── RELEASE_NOTES_v1.0.md      # v1.0 发行说明
└── reports/
    ├── dufu_route_page_prototype_report.md
    ├── phase3c_travel_planning_enhancement_report.md
    ├── phase3d_experience_polish_report.md
    └── phase3e_v1_closeout_report.md
```

## 更新记录

### Phase 5B — Handbook Links（2026-05-12）
- **#handbook 入口卡片**：在 Hero 区域下方新增手册入口 section，含标题、说明文字和两个按钮
- **查看 HTML 手册**：`exports/dufu_route_handbook.html`（新窗口打开）
- **下载 PDF 手册**：`exports/dufu_route_handbook.pdf`（download 属性）
- **顶部导航**：在"文章"前新增"手册"快捷链接
- **CSS 新增**：.handbook-card / .handbook-text / .handbook-actions / .handbook-btn / .handbook-btn.secondary（米白/土黄/暗红配色，与页面风格一致）
- **移动端适配**：flex-wrap，两按钮在窄屏下垂直堆叠
- **未修改 data 文件**：poems.json / locations.json / routes.json / timeline.json 未动
- **未修改 app.js**：运行时逻辑不变

### Phase 5A — Travel Handbook Export（2026-05-12）
- **scripts/build_handbook.py**：新增 Python 构建脚本，从 `data/*.json` 读取数据生成旅行手册
- **exports/dufu_route_handbook.md**：生成 Markdown 版手册（约 37,128 chars）
- **exports/dufu_route_handbook.html**：生成独立 HTML 版手册（约 64,279 chars）
- **exports/dufu_route_handbook.pdf**：生成 PDF 版手册（327,912 bytes）
- **手册章节**：11 个（手册介绍 / 文章摘要 / 路线总览 / 7天精华线 / 12天完整线 / 主题短线 / 双城读诗线 / 按地点读诗 / 按阶段读诗 / 旅行实用提醒 / 来源与边界说明）
- **数据来源**：data/poems.json / locations.json / routes.json / timeline.json
- **页面运行时无变化**：index.html / app.js / style.css / data/*.json 均未修改
- **PDF 生成依赖**：WeasyPrint 68.1（Phase 5A-R 中安装至 Hermes venv：`/home/ubuntu/.hermes/hermes-agent/venv/bin/python3`）

### Phase 4F — Stage Summary Banner（2026-05-12）
- **POEM_STAGE_SUMMARIES**：在 app.js 新增 9 个阶段的简介文本映射
- **renderPoemStageSummary(stage)**：在诗歌网格上方渲染当前阶段 banner，显示阶段名、诗歌数量和阶段说明
- **banner 插入**：在 initPoemGrid() 中插入 `<div id="poem-stage-summary">`，位于 tabs 上方
- **自动更新**：filterPoems() 中调用 renderPoemStageSummary()，切换 tab 时自动刷新 banner
- **初始渲染**：initPoemGrid() 末尾调用 renderPoemStageSummary('all')，初始化默认 banner
- **"全部"显示 32 总数**：其他阶段显示 count + "首诗"
- **CSS 新增**：.poem-stage-summary / .poem-stage-summary-title / .poem-stage-summary-count / .poem-stage-summary-text
- **不影响既有逻辑**：poem card click、setActiveLocation、highlightDayCards、scroll 行为不变
- **未修改 data 文件**：poems.json / locations.json / routes.json / timeline.json 未动

### Phase 4E-2 — Poem Grid UI Enhancement（2026-05-12）
- **poem-filter-tabs**：在诗歌网格前动态插入 9 个阶段筛选按钮（全部/长安奉先/安史逃亡/沦陷长安/凤翔羌村/三吏三别/秦州同谷/陇蜀入蜀/成都草堂）
- **poem-stage-badge**：每张诗歌卡片增加右上角阶段标签（暗红色边框标签），视觉轻量
- **renderPoemGrid()**：抽取渲染逻辑为独立函数，支持过滤器切换后重新渲染
- **filterPoems(stage)**：点击 tab 切换 currentPoemStage，重新调用 renderPoemGrid()
- **原有点击逻辑保留**：poem card 点击 → setActiveLocation() → highlightDayCards() 行为不变
- **移动端**：tabs 横向滚动，flex-wrap: nowrap，隐藏滚动条
- **CSS 新增**：.poem-filter-tabs / .poem-filter-tab / .poem-filter-tab.is-active / .poem-stage-badge
- **未修改 data 文件**：poems.json / locations.json / routes.json / timeline.json 未动

### Phase 4E-1 — Standard Poetry Expansion（2026-05-12）
- **poems.json 扩展**：12首诗 → 32首诗（+20首）
- **新增诗歌来源**：全部来自 timeline.nodes[].poems 展示字段中尚未收录的诗
- **新增分类**：沦陷长安3首（哀江头/悲陈陶/悲青坂）、凤翔2首（喜达行在所/述怀）、羌村1首（北征）、三吏三别5首（新安吏/潼关吏/新婚别/垂老别/无家别）、秦州2首（梦李白二首/发华州）、西枝村1首（西枝村寻置草堂地）、同谷2首（万丈潭/凤凰台）、陇蜀道4首（木皮岭/白沙渡/水会渡/五盘）
- **timeline WARN 清零**：validate/audit 交叉引用 17 WARN → 0 WARN（28/28 poems 全部匹配）
- **locationId 不变**：所有新增诗均绑定现有 locationId，无需新增地点记录
- **UI 不变**：未修改 app.js / index.html / style.css

### Phase 4B — Data-Driven Rendering（2026-05-12）
- **数据来源重构**：页面运行时数据从 `app.js` 内联数据切换为 `data/*.json`（fetch）
- **Fallback 策略**：内联数据包裹为 `FALLBACK_DATA`，fetch 失败时页面仍可正常渲染（`dataSource: 'fallback'`）
- **加载流程**：DOMContentLoaded 改为 `async`，先 `await loadDufuData()` 再执行各模块 init
- **渲染函数改造**：所有渲染函数（`initTimeline`/`initRoutes`/`renderRouteDays`/`renderThematicGrid`/`initPoemGrid` 等）改为读取 `DUFU_DATA.*`
- **字段映射适配**：
  - `poem.poem` → `poem.title`（JSON 字段名）
  - `poem.loc` → `poem.locationId`（JSON 字段名）
  - `timeline.locations` → `timeline.historicalPlace`（JSON 字段名）
  - `timeline.why` → `timeline.whyImportant`（JSON 字段名）
- **控制台标记**：`[DuFuRoute] Runtime data source: json|fallback` 便于调试
- **未改 UI 逻辑**：无新增功能、无视觉变更；内容数据与渲染逻辑已解耦
- **未来维护**：内容更新只需编辑 `data/*.json`，无需修改 `app.js` 渲染代码

### Phase 4A — 数据提取 Dry Run（2026-05-12）
- **新增 data/ 目录**：将 app.js 中的地点、路线、诗歌、时间线数据提取为独立 JSON 文件
- **新增 JSON 文件**：
  - `data/locations.json` — 21条地点记录，含 id/name/modern/theme/event/poems/quote/articleMeaning/travelTip/routeGroup/siteType
  - `data/routes.json` — 路线数据+ROUTE_META，含7天线（7天）、12天线（12天）、4条主题短线、双城读诗线
  - `data/poems.json` — 12首诗歌到地点的映射，含 title/locationId/locationName/period/theme/quote/note
  - `data/timeline.json` — 9个时间线节点，含 year/title/historicalPlace/modernPlace/event/poems/whyImportant
- **新增 scripts/validate_dufu_data.py**：Python 标准库验证脚本，检查 JSON 语法、数量约束、字段完整性、poem.locationId 交叉引用
- **未修改 index.html**：页面仍使用 app.js 内联数据；JSON 文件不参与当前渲染
- **未新增外部依赖**：验证脚本仅使用 Python 标准库

### Phase 3D — 最终体验验收与轻量打磨（2026-05-12）
- **新增 sticky 导航**：页面顶部固定导航栏，含7个锚点（文章/时间线/路线图/选路线/行程/诗歌/来源）；桌面端横向排列，移动端横向滚动
- **复制成功 toast**：底部居中弹出提示"已复制路线"，2.5秒后自动消失，纯 CSS+JS 实现，无外部依赖
- **打印友好样式**：`@media print` 隐藏交互元素（导航/按钮/标签页），保留文章内容/时间线/路线/行程/来源，背景转白，卡片边框简化，适合保存为 PDF
- **移动端布局加固**：SVG 地图容器增加 `overflow-x: auto`；`.map-sidebar` 在移动端 `position: static`；`body` 和主要卡片增加 `overflow-wrap: break-word`；添加 `box-sizing: border-box` 全局 reset
- **未修改其他项目**；**未新增外部依赖**；**未修改 app.js 之外的源文件**（README 除外）

### Phase 3C — 文旅实用化增强（2026-05-12）
- **新增模块**：
  - 路线选择器：四张选择卡片，帮助用户根据时间/兴趣选择路线
  - 旅行实用提醒：6条实用提醒卡片（交通/季节/体力/阅读/现场/核实）
  - 地图地点类型图例（成熟景区/文学寻访点/历史对应点/考证提示点）
- **路线元信息**：为7天线、12天线和四条短线增加：推荐天数、适合人群、推荐季节、主要交通方式、路线难度、路线性质、出行提醒
- **每日行程卡片增强**：每日增加今日主题、今日地点、推荐停留、交通提示、今日读诗、现场问题字段
- **地点类型**：为所有地点数据增加 siteType 字段；地点卡片中显示地点类型标签
- **双城读诗线**：新增西安+成都双城线，可在路线规划器中查看并复制
- **复制功能**：dual-city 路线支持复制；所有增强字段均反映在复制文本中
- **CSS**：新增约290行新样式；响应式支持移动端
- **未修改其他项目**；**未新增外部依赖**；**未修改 app.js 之外的源文件**

### Phase 3B-R2 — 最终文案清理（2026-05-12）
- 升级"历史厚度"→"历史厚度与伦理重量"（更完整表述）
- 升级"幼子饿死、颠沛流离"→"幼子饥卒、家人饥寒与亲人离散"（更准确）
- 页脚升级："交互原型 · 持续修订中"→"交互式阅读与文旅路线页面 · 持续完善中"
- 仅修改 index.html，不涉及 app.js / style.css
- 同步修改源项目 + Pages 目录

### Phase 3B-R — 线上内容回归修复（2026-05-12）
- 发现 root cause：Phase 3B 修改了部分文案但漏掉"人民性"等两处，且来源说明 section 结构不完整
- 修正奉先段：补充"入门闻号啕，幼子饥已卒"，替换原有模糊表述
- 修正"人民性"为"平民视角"：三吏三别段落措辞改为更中性学术表述
- 修正第三点"个人与历史重叠"：移除"幼女送人"（非本文事实）
- 重构来源与边界说明区块：4张清晰卡片，结构完整
- 更新页脚：从"原型页面 · 仅供演示"改为"交互原型 · 持续修订中"
- 未新增外部依赖
- 同步修改源项目 + Pages 目录

### Phase 3B — 史实修正与可信度增强（2026-05-12）
- 修正彭衙相关史实表述：移除“幼女饿死”不准确说法，改为描述逃亡中父亲的身体经验
- 软化安史之乱前杜甫评价：从“并未超出同时代诗人水平”改为更平衡的表述
- 增加来源与边界说明区块（4卡片）：内容来源、地理精度、文旅路线、地点类型
- 路线图区域增加示意图提示
- 文旅路线规划器增加出行核实提示
- 新增 CSS 样式：`.section-tip`（小字号斜体灰）、`.notes-grid`、`.note-card`
- 未新增外部依赖

## 技术说明

- 纯静态 HTML/CSS/JS，无外部 CDN 依赖
- SVG 路线地图为示意性地图，非精确地理坐标
- 路线复制功能支持 clipboard API，失败时使用 textarea fallback
- 移动端优先设计，桌面端可左右分栏

## Data Maintenance

- Runtime data now lives in `data/*.json`.
- See `docs/DATA_MAINTENANCE.md` before editing locations, routes, poems or timeline.
- Always run `scripts/validate_dufu_data.py` after data changes.
- Do not add large content blocks directly to `app.js`.
- Cross-reference checks are included in `scripts/validate_dufu_data.py`.
- Warnings should be reviewed before publishing, even when validation passes.

## 禁止事项（执行边界）

- 不修改根站首页（`index.html` 根目录）
- 不修改 `projects/data.json`
- 不安装 apt 包
- 不重启任何系统服务
- 不输出任何 secrets / tokens / credentials
- 不添加外部 CDN 依赖
