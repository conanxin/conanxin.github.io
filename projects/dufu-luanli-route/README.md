# 乱离途中，杜甫何以成为"杜甫"？

杜甫流离路线交互式阅读与文旅路线页面。

基于《三联生活周刊》2025年第40期封面故事《乱离途中，杜甫何以成为"杜甫"？》整理。

## Version

Current public version: **v1.0**
Live URL: https://conanxin.github.io/projects/dufu-luanli-route/
Latest release phase: Phase 4B / Data-Driven Rendering

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

## 禁止事项（执行边界）

- 不修改根站首页（`index.html` 根目录）
- 不修改 `projects/data.json`
- 不安装 apt 包
- 不重启任何系统服务
- 不输出任何 secrets / tokens / credentials
- 不添加外部 CDN 依赖
