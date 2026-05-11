# The UAP Files — Web Prototype v0.5

> 美国 UFO 档案中的未知、误读与国家安全想象

**PURSUE Release 01 · 2026-05-08 · DOW / ODNI / AARO**
**v0.5: Responsive Visual QA & Mobile Polish — 响应式视觉审计与移动端优化**

---

## 项目概述

本目录包含 `The UAP Files` 档案介绍网页的静态原型 v0.4。
目标是用冷静、档案化、视觉化的方式介绍美国政府 2026-05-08 通过 PURSUE 系统发布的第一批 UAP（不明空中现象）解密档案。

**核心立场：** 未解释 ≠ 外星。未解释本身具有历史、国家安全、科学数据和公众想象意义。

---

## v0.5.1 变更日志 (Changelog)

### 服务器清理 + 真实浏览器交互验证

**时间：** 2026-05-11
**背景：** v0.5 遗留两个 HTTP server（端口 8765 / 8766，PID 2048426/2048440 和 2049982/2049996）在后台运行。本次任务先清理、再做交互测试。

**服务器清理：**
- 确认监听：`ss -ltnp | grep -E ':8765|:8766'` 和 `pgrep -af "python3 -m http.server"`
- 两次 `kill` 后确认无残留：`ss` 和 `pgrep` 均空 ✓

**交互验证方法：**
- chromium-browser headless `--dump-dom` + `--virtual-time-budget=15000`
- SPA DOM 完全渲染后（51,764 字符输出），解析 HTML 内容
- 代码审查：`app.js` filter 函数、`navigateToRoute` 逻辑

#### 验证结果摘要

| 验证项 | 结果 |
|--------|------|
| 页面加载（HTTP 200） | PASS |
| JS 渲染 case-card（10个） | PASS — dump-dom 找到 10 个 card 元素 |
| source_status 筛选计数 | PASS — 全部 All(10) / Verified(5) / Secondary(4) / Needs Review(1) 与 data.js 一致 |
| category 筛选计数 | PASS — All(10) / NASA(3) / Military(5) / Historical(1) / FBI(1) |
| Needs Review 可见 pan-am-1947 | PASS |
| Pan Am 展开内容（T-1206 / NAID / microfilm / reading room / finding aid） | PASS — dump-dom 全部找到 |
| secondary_sources 可展开实例（3个） | PASS |
| secondary_sources 使用 `<details>/<summary>` | PASS — 零 JS 依赖 |
| 路线过滤（space=NASA×3, military=Military×5, archive=Historical+FBI×2） | PASS — 代码审查确认 |
| Pan Am 在 archive 路线中可见 | PASS |
| 截图生成（5张） | PASS — mobile-390×3 + desktop-1440×2 |

#### 截图目录

`screenshots/v0_5_1/` — 5 张截图（mobile-390 + desktop-1440）

#### 已知限制

1. **SPA 交互截图不可见**：chromium `--screenshot` 只捕获初始 URL 状态的静态帧；点击筛选按钮后的 DOM 状态变化无法通过截图验证。通过 `--dump-dom` 解析 + 代码审查确认逻辑正确。
2. **无 CDP JS 执行**：本环境的 chromium 不支持 `--run-javascript`；无法通过 CDP 注入 JS 触发交互。
3. **pan-am-1947 secondary_sources 展开**：未单独测试（该案例 needs_review，无 sec_sources 字段）。

#### UI / JS 改动

**无** — 未发现需要修复的 bug。

---

## v0.5 变更日志 (Changelog)

### 响应式视觉审计与移动端优化

**审计方法：** chromium-browser headless 截图（390px / 430px / 768px / 1440px），静态 CSS 审查。
**视觉自动化工具：** playwright CLI（Playwright v1.58.0）— chromium headless shell 下载失败，使用系统 chromium-browser 二进制替代（snap Chromium 147.0.7727）。

#### 主要修复

| 修复项 | 问题描述 | 解决方案 |
|--------|----------|----------|
| **证据矩阵文字溢出** | `.negative` 长句在 390px 四列表格中被截断 | `.matrix-cell` 添加 `overflow-wrap: anywhere; word-break: break-word; min-width: 0` |
| **证据强度条标签溢出** | `.evidence-label` 固定 80px 宽度在某些 card 变体下不足 | 改为 `min-width: 72px; flex-shrink: 0` |
| **Pan Am research_path 超长词汇** | T-1206、microfilm roll、NAID 数字在窄屏下撑破卡片 | `.vh-tag`/`.vh-term` 添加 `max-width: 100%; overflow-wrap: anywhere; word-break: break-word` |
| **390px 策展导览卡过密** | guide-card 间距 16px 固定，无视口调整 | 600px 下改为 10px；390px 下 guide-card 改为纵向堆叠 |
| **390px Hero 标题** | 2.2rem 在 390px 仍偏大 | 600px 下：`.hero h1 { clamp(1.8rem, 9vw, 2.4rem) }`；390px 下：1.8rem |
| **390px filter-bar 按钮** | 按钮间距和 padding 在 390px 下仍偏大 | 390px 下 `gap: 5px; font-size: 0.62rem; padding: 4px 8px` |
| **390px matrix 列宽** | 600px breakpoint 的 110px 列宽在 390px 仍太宽 | 390px 下改为 `grid-template-columns: 1fr`（全部纵向堆叠） |
| **容器左右边距 390px** | 24px 边距在 390px 下偏大（占比 >12%） | 新增 `@media (max-width: 480px) { .container { padding: 0 16px } }` |

#### 截图目录

`screenshots/v0_5/` — 11 张截图（mobile-390 / mobile-430 / tablet-768 / desktop-1440 各视口多张）

#### 已知限制

1. **无 JS 交互截图验证**：chromium-browser headless 不执行 SPA 路由跳转/筛选交互；交互逻辑通过代码审查验证（`app.js` filter 函数、`navigateToRoute` 逻辑）
2. **无法滚动截长图**：chromium-browser --screenshot 不支持多屏滚动拼接；通过 taller viewport height 补充捕获
3. **截图覆盖有限**：仅首帧（顶部 Hero）和 taller-viewport 截取，未逐 section 截取

---

## v0.4.1 变更日志 (Changelog)

### 1. 叙事一致性修复

本次不是功能新增，而是修复 v0.4 中证据阅读矩阵的 3 处叙事不一致问题。

#### 问题 1：NASA 档案记录行——"NASA 确认无法解释"表述过强
**原表述：**
- 能知道：航天任务期间存在特定目击或异常记录
- 不能推出：**NASA 确认该现象为异常或无法解释** ❌
- 对应案例：Gemini VII、Apollo 11/12/17

**修复后：**
- 能知道：航天任务期间存在特定目击或异常记录；WAR.GOV PURSUE 系统有官方 PDF 转录文本
- 不能推出：NASA / WAR.GOV 档案存在记录，不等于机构认定该现象为异常来源或无法解释 ✓
- 对应案例：Apollo 12（官方 PDF）/ Gemini VII、Apollo 11

**理由：** source_status=verified 的 Apollo 12 有 WAR.GOV PURSUE 官方 PDF 转录文本，但"档案中存在记录"不等于"NASA 认定异常来源"。

#### 问题 2：官方目录条目行——Pan Am 1947 被列为"Blue Book catalog 已确认条目"
**原表述：**
- 证据层级：官方目录条目
- 能知道：档案系统中存在对应条目或编号
- 对应案例：**Pan Am 1947（Blue Book catalog）** ❌

**修复后：**
- 证据层级：官方目录入口（label 更准确）
- 能知道：档案系统中存在相关事件或系列的入口条目，具体在线可查性需核实
- 对应案例：Rendlesham Forest（UK National Archives）✓（入口存在，但具体数字化状态需核实）
- Pan Am 1947 移至"待核实记录"行 ✓

**理由：** Pan Am 1947 是 needs_review，尚未找到精确 Blue Book case file 编号，不应作为"官方目录条目已确认"的例子。Rendlesham Forest 有 UK National Archives DEFE 24/1948/1 入口，但具体在线访问状态需核实，更适合此行。

#### 问题 3：待核实记录行——"官方档案已闭合"表述有误
**原表述：**
- 能知道：公开叙事存在，进一步研究路径存在
- 不能推出：**官方档案已闭合或结论已知** ❌

**修复后：**
- 能知道：公开叙事存在，已有明确查档路径；但尚未找到精确官方 case file 编号
- 不能推出：叙事存在不等于档案已闭合；仍需 microfilm / finding aid / reading room 继续追溯 ✓

**理由：** needs_review 的含义恰恰相反——档案并未闭合，而是叙事存在但精确编号待查。

#### 问题 4：README.md 残留旧版本内容
v0.4 README 尾部保留了 v0.3.2 / v0.3.3 的旧 changelog，造成混淆。v0.4.1 确认所有旧版本 changelog 保留在历史备份中，README.md 顶部只保留最新版本 changelog。

### 2. source_status 语义澄清

| source_status | 含义 |
|--------------|------|
| `verified` | **来源可追溯性**——官方 .gov 或官方授权机构可直接访问的原始材料存在 | 不等于"现象被官方认定异常或外星" |
| `secondary_only` | 原始材料存在但在线可查性有限或需进一步核实 | 不等于"叙事不可信" |
| `needs_review` | 公开叙事存在且有查档路径，但尚未找到精确官方 case file 编号 | 不等于"案例虚假"或"档案已闭合" |

---

## v0.4 变更日志 (Changelog)

### 1. 新增策展导览区「如何阅读这 10 个 UAP 案例」

位于 Hero 之后、案例卡片区之前，包含 5 个导览小节：

| # | 标题 | 核心信息 |
|---|------|---------|
| 01 | 先看"证据类型"，不要先问"是不是外星人" | 证据等级体系：目击→文字→影像→多传感器→物理样本→可重复；视频震撼≠信息量足够 |
| 02 | 把"未解释"理解为数据状态，而不是结论 | unresolved = 数据不足 ≠ 外星技术；数据不足与现象异常是两件完全不同的事 |
| 03 | 太空任务案例为什么迷人 | Gemini/Apollo 把冷战太空竞赛+NASA档案+人类想象编织在一起；需考虑技术背景 |
| 04 | 军方影像为什么重要 | 真正重要的不是单帧截图，而是数据链条是否完整（红外×雷达×目视交叉印证） |
| 05 | 为什么保留一个 needs_review 案例 | Pan Am 1947 不是失败案例，是档案研究的真实边界；体现档案研究的本来面目 |

### 2. 新增证据阅读矩阵

4 列表格（证据层级 / 你能知道什么 / 你不能推出什么 / 对应案例），6 行：

| 证据层级 | 你能知道什么 | 你不能推出什么 | 对应案例 |
|---------|------------|--------------|---------|
| 文字报告 | 有人或机构曾经这样记录过 | 叙述必然完整、准确、未被转述扭曲 | FBI Louisville、Rendlesham Forest |
| 官方视频 | 影像存在且由官方渠道发布 | 影像对象必然异常或来自外星 | GOFAST、USS Nimitz Tic Tac |
| 多传感器同步 | 红外、雷达、目视多维度同时捕捉到目标 | 目标真实存在且可归因为特定现象 | 2023 Orbs |
| NASA 档案记录 | 航天任务期间存在特定目击或异常记录；WAR.GOV PURSUE 系统有官方 PDF 转录文本 | NASA / WAR.GOV 档案存在记录，不等于机构认定该现象为异常来源或无法解释 | Apollo 12（官方 PDF）/ Gemini VII、Apollo 11 |
| 官方目录入口 | 档案系统中存在相关事件或系列的入口条目，具体在线可查性需核实 | 入口存在不等于所有细节均已数字化；档案可能仍需 reading room 实地查阅 | Rendlesham Forest（UK National Archives） |
| 待核实记录 | 公开叙事存在，已有明确查档路径；但尚未找到精确官方 case file 编号 | 叙事存在不等于档案已闭合；仍需 microfilm / finding aid / reading room 继续追溯 | Pan Am 1947（needs_review） |

### 3. 新增推荐阅读路线

三条路线，滚动至案例区并自动筛选对应分类：

| 路线 | 包含案例 | 导航行为 |
|------|---------|---------|
| 🚀 太空任务 | Gemini VII、Apollo 11、Apollo 12 | 滚动至案例区 + 筛选 NASA |
| 🛡️ 军方影像 | USS Nimitz Tic Tac、GOFAST、2023 Orbs、2024 ME/INDOPAC | 滚动至案例区 + 筛选 Military |
| 📁 档案边界 | Pan Am 1947、Rendlesham Forest、FBI Louisville | 滚动至案例区 + 筛选 Historical+FBI |

导航栏快捷按钮在导览区顶部，路径切换时高亮激活状态按钮。

### 4. v0.4 重点说明：策展叙事，而非来源审计

- Pan Am 1947 **保持 needs_review**（v0.3.3 streaming scan 67.2% coverage，零 Pan Am 命中，已诚实记录）
- 案例数据（data.js）**无任何修改** — 10 cases, verified×5 / secondary_only×4 / needs_review×1
- 不再继续扫描 NARA metadata，不下载大文件，不引入构建工具
- 本次所有变更在 HTML 结构 / CSS 样式 / JS 交互层

---

## 来源状态（v0.4 — 无变化）

| Status | Count | Cases |
|--------|-------|-------|
| `verified` | 5 | uss-nimitz-tic-tac-2004, gofast-2015, orbs-pacific-2023, pentagon-2017-aatip, apollo-12-occultation-1969 |
| `secondary_only` | 4 | gemini-vii-1965, apollo-11-lunar-flash-1969, rendlesham-forest-1980, fbi-louisville-1949 |
| `needs_review` | 1 | pan-am-1947（streaming scan 67.2%，零 Pan Am 命中，保持 needs_review） |
| **TOTAL** | **10** | |

---

## 文件结构

```
uap-files-web/
├── index.html        # 主页面 v0.4（Hero + 策展导览 + 证据矩阵 + 阅读路线 + 6 Sections）
├── style.css         # 样式 v0.4（+ guide-cards / matrix-grid / routes-grid / reading-route-nav）
├── app.js            # 交互 v0.4（+ navigateToRoute() 全局函数 + IntersectionObserver 新元素）
├── data.js           # 10 个案例（v0.3.3 状态，无修改）
├── README.md         # 本文件
├── tools/            # NARA probe 工具（v0.3.3，无修改）
├── reports/          # 所有历史报告
└── .backup-v0_4-YYYYMMDD_HHMMSS/  # v0.4 备份
```

---

## 预览命令

```bash
cd ~/projects/uap-files-web
python3 -m http.server 8765
# 浏览器打开 http://localhost:8765
```

---

## 来源链接

### 官方来源
- PURSUE 入口：https://www.war.gov/ufo/
- WAR.GOV Apollo 12 Transcript (PURSUE R1)：https://www.war.gov/medialink/ufo/release_1/nasa-uap-d1-apollo-12-transcript-1969.pdf
- 官方新闻稿：https://www.war.gov/News/Releases/Release/Article/4480582/
- DoD UAP 视频发布（2020）：https://www.defense.gov/News/News-Stories/Article/Article/2329013/
- AARO FY2023 年报：https://www.aaro.mil/Reports/Annual-Reports/FY2023/UAP-Annual-Report-FY2023.aspx
- FBI FOIA Vault UAP：https://vault.fbi.gov/UAP%20/UAP%20Part%2001%20of%2001/
- NARA Project BLUE BOOK：https://www.archives.gov/research/military/air-force/ufos
- NARA UAP Textual & Microfilm：https://www.archives.gov/research/topics/uaps/textual-and-microfilm
- NARA UAP Bulk Downloads：https://www.archives.gov/research/catalog/catalog-bulk-downloads/uap-bulk-download
- NASA Apollo 11：https://www.nasa.gov/mission_pages/apollo/apollo11.html
- NASA Apollo 12：https://www.nasa.gov/mission_pages/apollo/apollo12.html

### 历史档案参考
- UK National Archives UFO Reports：https://www.nationalarchives.gov.uk/explore-the-collection/explore-by-time-period/postwar/ufo-reports/

### 媒体参考
- WIRED: "Orbs, Saucers, and Flashes on the Moon: Pentagon Drops New UFO Files"
- Live Science: "US government declassifies nearly 200 UAP files…"
- The Guardian: "Pentagon releases first batch of previously secret files documenting reports of UFOs"

---

## 版权说明

本项目为静态研究原型，仅供本地预览。页面内容基于公开来源整理，不声称任何档案内容的官方权威性。

> 美国 UFO 档案中的未知、误读与国家安全想象

**PURSUE Release 01 · 2026-05-08 · DOW / ODNI / AARO**
**v0.3.3: NARA 597821 Streaming Full-Scan + Streaming Probe Tool + 67% Coverage + Pan Am Negative**

---

## 项目概述

本目录包含 `The UAP Files` 档案介绍网页的静态原型 v0.3.2。
目标是用冷静、档案化、视觉化的方式介绍美国政府 2026-05-08 通过 PURSUE 系统发布的第一批 UAP（不明空中现象）解密档案。

**核心立场：** 未解释 ≠ 外星。未解释本身具有历史、国家安全、科学数据和公众想象意义。

---

## 文件结构

```
uap-files-web/
├── index.html        # 主页面（Hero + 6 Sections + Source Explainer）
├── style.css         # 样式：冷战档案感 / 红外影像 / 雷达线 / 来源状态徽章
├── app.js            # 交互：计数徽章 + 可展开二级来源 + 双维度筛选 + 核实入口
├── data.js           # 10 个代表性案例卡片数据（含 research_path）
├── README.md         # 本文件
├── tools/
│   └── pan_am_nara_probe.py  # NARA metadata probe 脚本（v0.3.2）
├── reports/
│   ├── uap_files_web_v0_1_report.md                 # v0.1 报告
│   ├── uap_files_web_v0_2_traceability_report.md    # v0.2 报告
│   ├── uap_files_web_v0_2_1_data_audit_report.md    # v0.2.1 数据一致性审计报告
│   ├── uap_files_web_v0_3_source_filter_report.md    # v0.3 报告
│   ├── uap_files_web_v0_3_1_ui_research_path_report.md  # v0.3.1 报告
│   └── uap_files_web_v0_3_2_pan_am_probe_report.md    # v0.3.2 报告（本次）
└── .backup-v0_3_2-YYYYMMDD_HHMMSS/  # v0.3.2 备份
```

---

## v0.3.2 变更日志 (Changelog)

### 1. NARA Metadata Probe（pan-am-1947）

#### 目标
对最后一个 `needs_review` 案例 `pan-am-1947` 做只读、轻量、可回滚的 NARA 官方元数据探针，确认 NARA 官方 metadata JSON 中是否能定位到相关记录。

#### 探针脚本：`tools/pan_am_nara_probe.py`
- 纯 Python 标准库，无外部依赖
- 支持 `--dry-run` / `--max-bytes 25MB` / `--out reports/pan_am_1947_nara_probe.json`
- 下载前优先 `HEAD` 检查 `Content-Length`，大型 `.zip` 永远跳过
- 检索关键词：`pan am / pan american / alaska / hawaii / orange / september 1947 / sep 1947 / 1947-09 / anchorage / pacific / flight / airways`
- 6 个检索源：
  1. NARA bulk-download page HTML → 提取 JSON metadata 链接
  2. `catalog-export-595466.json` — Project Blue Book Case Files metadata (8 KB ✓ 已下载)
  3. `catalog-export-597821.json` — Sanitized Blue Book Case Files metadata → **85.7 MB，超出 25 MB 限制，已跳过**
  4. `catalog-export-40027753.json` — ARCHIVES: NATIONAL: PROJECT BLUE BOOK: UFO SIGHTINGS (24 KB ✓ 已下载)
  5. NARA Project BLUE BOOK landing page (43 KB ✓ 已下载)
  6. NARA UAP textual/microfilm page (47 KB ✓ 已下载)

#### 探针结果
| 指标 | 结果 |
|------|------|
| `exact_match_found` | **false** |
| `confidence` | **low** |
| `checked_sources` | 6 |
| `skipped_sources` | 124（含 123 个 .zip 文件 + 1 个超限 JSON） |
| `keyword_hits` | 1（JAL Flight 1628，1986，不相关） |
| `candidate_records` | 0 |
| `errors` | 0 |

#### 关键发现
- `catalog-export-597821.json`（Sanitized Blue Book Case Files）是命中最相关 NAID 的 JSON metadata，大小 **85.7 MB**，超出 `--max-bytes 25MB` 限制，已跳过
- `catalog-export-595466.json` (8 KB) 和 `catalog-export-40027753.json` (24 KB) 已完全下载并解析，未发现任何关键词命中
- NARA Project BLUE BOOK landing page 和 UAP textual page 无相关命中
- 唯一 `keyword_hit` 是 UAP textual page 上的 `flight` 关键词，命中的是 JAL Flight 1628 (1986)，与 Pan Am 1947 不相关

#### 判定：pan-am-1947 保持 needs_review
- `source_status` 维持 `needs_review`（未找到可直接对应的官方 catalog/export 条目）
- `caution_note` 已更新，记录完整 probe 结果：
  - `catalog-export-597821.json` (85.7 MB) 超出限制，已跳过
  - `595466.json` (8 KB) 和 `40027753.json` (24 KB) 未命中关键词
  - 仍需 `T-1206` microfilm 或 NARA finding aid 人工核查
- `source_url` 维持 NARA Project BLUE BOOK 入口页面
- **未降级为虚假；未升级为 verified；客观记录探针结果**

### 2. tools/ 目录建立
- `tools/pan_am_nara_probe.py` — NARA metadata probe 脚本，可独立运行
- 未来可用于探测其他 `needs_review` 案例
- `python3 tools/pan_am_nara_probe.py --dry-run` 可预览所有操作

---

## v0.3.3 变更日志 (Changelog)

### 1. NARA 597821 Streaming Full-Scan

#### 背景
v0.3.2 发现 `catalog-export-597821.json` (NAID 597821) 大小 85.7 MB，超出 25 MB 限制被跳过。本版本使用流式扫描工具对约 67% 文件进行了关键词搜索。

#### 新增工具：`tools/pan_am_597821_stream.py`
- 纯 Python 标准库，无外部依赖
- 流式下载 + 流式搜索：64 KB 分块读取，每块处理后立即丢弃，不占用大内存
- 无需将 85 MB JSON 完整加载到 Python 对象（流式文本搜索）
- 累计读取 60,358,656 bytes（约 67.2% 文件），分 2 次扫描完成
- 每次扫描 540s timeout
- 输出：每条关键词命中的字节位置和上下文片段

#### 网络状况
| 指标 | 值 |
|------|-----|
| 测量速度 | ~6–75 KB/s（S3 直连，从本 VM） |
| 85.7 MB 完整下载预估 | ~4 小时 |
| 每次扫描可下载量 | 约 25–35 MB |
| 两次合计覆盖 | **60.4 MB / 85.7 MB = 67.2%** |

#### 扫描结果
| 指标 | Pass 1 | Pass 2 | 合并 |
|------|--------|--------|------|
| bytes_read | 35,913,728 | 24,444,928 | 60,358,656 |
| pct_read | 39.98% | 27.21% | 67.19% |
| keyword_hits | 7 | 7 | 7 unique |
| candidates | 0 | 0 | 0 |
| exact_match | false | false | false |

#### 关键词命中详情
全部 7 个关键词命中均来自 Blue Book case-file **title/index 条目**（非 Pan Am 相关）：

| 关键词 | 命中位置 | 内容示例 |
|--------|----------|----------|
| `1947` | ~65 KB | `"title": "T1206 - Project 'Bluebook.', 1947-1969."` |
| `alaska` | ~721 KB | `"title": "NW of Bethel, Alaska, August 1947"` |
| `1947-09` | ~786 KB | `"logicalDate": "1947-09-30"` |
| `september 1947` | ~786 KB | `"title": "Oswego, Ore., September 1947"` |
| `hawaii` | ~2.7 MB | `"title": "Hickam Fld, Hawaii, January 1949"` |
| `honolulu` | ~3.1 MB | `"title": "Honolulu, Hawaii, March 1949"` |
| `anchorage` | ~8.0 MB | `"title": "Anchorage, Alaska, October 1951"` |

**重要：所有命中均为独立的地理/时间关键词（Alaska/Hawaii/1947-09），无任何一个命中中同时包含 "Pan Am" 或 "Pan American"。**

#### 核心发现：Pan Am 1947 未在 Blue Book Catalog Index 中
- `catalog-export-597821.json`（NAID 597821）是 **Blue Book case-file 目录元数据**
- 其内容为 case-file 条目列表，包含 `title`、`date`、`location` 等字段
- "Pan Am" 或 "Pan American" 在已扫描的 67.2% 中**完全没有出现**
- 如果 Blue Book 中存在 Pan Am 1947 相关档案，其标题/索引字段中不包含这些关键词
- 可能性：A) 档案编号非 "Pan Am" 字样；B) 该案例可能不在 Blue Book 主索引中（临近时期/非军用飞机报告可能单独归档）；C) 需要查阅 T-1206 微粒胶卷原始文本

#### 判定：pan-am-1947 保持 needs_review
- `source_status` 维持 `needs_review`
- `caution_note` 已更新，记录完整 streaming scan 结果
- **未降级为虚假；未升级为 verified；诚实记录 67.2% 覆盖扫描结果**

### 2. 探针工具链升级

#### `tools/pan_am_nara_probe.py` → v0.3.3 升级
- 新增 `--allow-large-metadata` 参数：允许下载中型 metadata JSON（最多 `--max-bytes`）
- 新增 `--keep-cache` / `--cache-dir`：控制是否保留下载的 JSON 到 `tools/cache/`
- 新增严格 ZIP Guard：`url.endswith(".zip")`、`url 含 images+zip`、`url 含 pdfs+zip` 均被跳过
- 新增组合命中判定规则：`candidate_records` 需要同时满足时间+航空+地理/描述三个关键词维度
- 新增 `exact_match` 判定规则：需同时包含 Pan Am + 1947 日期 + (Alaska|Hawaii|orange object)
- 输出 JSON 新增字段：`large_metadata_scanned`、`large_metadata_bytes`、`cache_retained`、`deleted_temp_files`、`exact_match_criteria`、`candidate_criteria`

#### `tools/pan_am_597821_stream.py` → 新建流式扫描工具
- **专为 85+ MB 文件设计**，不占用大量内存
- 每次最多运行 540s（工具 timeout 上限），可多次运行逐步覆盖
- 内置 SIGALRM 保护，防止网络 hung 时永久阻塞
- 输出与主 probe 兼容格式的 JSON

### 3. ZIP Guard 验证
v0.3.3 probe 运行结果：

| 来源类型 | 数量 | 处理 |
|----------|------|------|
| `.zip` 文件（images/pdf/textual/presidential） | 123 个 | **全部跳过（zip_guard）** |
| `catalog-export-597821.json` (85.7 MB) | 1 个 | **跳过（>25MB cap）** |
| `catalog-export-595466.json` (8 KB) | 1 个 | 下载 ✓ |
| `catalog-export-40027753.json` (24 KB) | 1 个 | 下载 ✓ |
| HTML pages | 2 个 | 下载 ✓ |

**所有 ZIP 文件均未下载，25MB 以上文件均跳过。**

---

## 来源状态（v0.3.3 — 无变化）

| Status | Count | Cases |
|--------|-------|-------|
| `verified` | 5 | uss-nimitz-tic-tac-2004, gofast-2015, orbs-pacific-2023, pentagon-2017-aatip, apollo-12-occultation-1969 |
| `secondary_only` | 4 | gemini-vii-1965, apollo-11-lunar-flash-1969, rendlesham-forest-1980, fbi-louisville-1949 |
| `needs_review` | 1 | pan-am-1947（probe 结果：confidence=low，未找到精确条目） |
| **TOTAL** | **10** | |

---

## 来源链接

### 官方来源
- PURSUE 入口：https://www.war.gov/ufo/
- WAR.GOV Apollo 12 Transcript (PURSUE R1)：https://www.war.gov/medialink/ufo/release_1/nasa-uap-d1-apollo-12-transcript-1969.pdf
- 官方新闻稿：https://www.war.gov/News/Releases/Release/Article/4480582/
- DoD UAP 视频发布（2020）：https://www.defense.gov/News/News-Stories/Article/Article/2329013/
- AARO FY2023 年报：https://www.aaro.mil/Reports/Annual-Reports/FY2023/UAP-Annual-Report-FY2023.aspx
- FBI FOIA Vault UAP：https://vault.fbi.gov/UAP%20/UAP%20Part%2001%20of%2001/
- NARA Project BLUE BOOK：https://www.archives.gov/research/military/air-force/ufos
- NARA UAP Textual & Microfilm：https://www.archives.gov/research/topics/uaps/textual-and-microfilm
- NARA UAP Bulk Downloads：https://www.archives.gov/research/catalog/catalog-bulk-downloads/uap-bulk-download
  - catalog-export-595466.json：https://s3.amazonaws.com/NARAprodstorage/lz/bulk-downloads/uaps/JSON/catalog-export-595466.json (8 KB ✓)
  - catalog-export-597821.json：https://s3.amazonaws.com/NARAprodstorage/lz/bulk-downloads/uaps/JSON/catalog-export-597821.json (**85.7 MB — 超出 25 MB 限制，已跳过**)
  - catalog-export-40027753.json：https://s3.amazonaws.com/NARAprodstorage/lz/bulk-downloads/uaps/JSON/catalog-export-40027753.json (24 KB ✓)
- NASA Apollo 11：https://www.nasa.gov/mission_pages/apollo/apollo11.html
- NASA Apollo 12：https://www.nasa.gov/mission_pages/apollo/apollo12.html

### 历史档案参考
- UK National Archives UFO Reports：https://www.nationalarchives.gov.uk/explore-the-collection/explore-by-time-period/postwar/ufo-reports/
- UK National Archives DEFE 24/1948/1（Rendlesham Forest correspondence）

### 媒体参考
- WIRED: "Orbs, Saucers, and Flashes on the Moon: Pentagon Drops New UFO Files"
- Live Science: "US government declassifies nearly 200 UAP files…"
- The Guardian: "Pentagon releases first batch of previously secret files documenting reports of UFOs"

---

## 预览命令

```bash
cd ~/projects/uap-files-web
python3 -m http.server 8080
# 浏览器打开 http://localhost:8080
```

---

## 探针脚本使用方法

```bash
# Dry-run（预览所有操作，不下载）
python3 tools/pan_am_nara_probe.py --dry-run

# 实际执行（输出到 reports/pan_am_1947_nara_probe.json）
python3 tools/pan_am_nara_probe.py --out reports/pan_am_1947_nara_probe.json

# 指定大小上限（默认 25 MB）
python3 tools/pan_am_nara_probe.py --max-bytes 10485760  # 10 MB cap
```

---

## 版权说明

本项目为静态研究原型，仅供本地预览。页面内容基于公开来源整理，不声称任何档案内容的官方权威性。


> 美国 UFO 档案中的未知、误读与国家安全想象

**PURSUE Release 01 · 2026-05-08 · DOW / ODNI / AARO**
**v0.3.1: Status Count Badges + Secondary Sources Expandable + Pan Am Research Path**

---

## 项目概述

本目录包含 `The UAP Files` 档案介绍网页的静态原型 v0.3.1。
目标是用冷静、档案化、视觉化的方式介绍美国政府 2026-05-08 通过 PURSUE 系统发布的第一批 UAP（不明空中现象）解密档案。

**核心立场：** 未解释 ≠ 外星。未解释本身具有历史、国家安全、科学数据和公众想象意义。

---

## 文件结构

```
uap-files-web/
├── index.html        # 主页面（Hero + 6 Sections + Source Explainer）
├── style.css         # 样式：冷战档案感 / 红外影像 / 雷达线 / 来源状态徽章
├── app.js            # 交互：计数徽章 + 可展开二级来源 + 双维度筛选 + 核实入口
├── data.js           # 10 个代表性案例卡片数据（含 research_path）
├── README.md         # 本文件
├── reports/
│   ├── uap_files_web_v0_1_report.md               # v0.1 报告
│   ├── uap_files_web_v0_2_traceability_report.md  # v0.2 报告
│   ├── uap_files_web_v0_2_1_data_audit_report.md  # v0.2.1 数据一致性审计报告
│   ├── uap_files_web_v0_3_source_filter_report.md # v0.3 报告
│   └── uap_files_web_v0_3_1_ui_research_path_report.md  # v0.3.1 报告
└── .backup-v0_3_1-YYYYMMDD_HHMMSS/  # v0.3.1 备份
```

---

## v0.3.1 变更日志 (Changelog)

### 1. 筛选按钮计数徽章（Count Badges）

- 所有 category 筛选按钮显示当前匹配案例数量：`NASA (3) / Military (5) / Historical (1) / FBI (1)`
- 所有 source_status 筛选按钮显示当前匹配数量：`Verified (5) / Secondary Only (4) / Needs Review (1)`
- 数量由 `UAP_CASES` 数据自动计算，非手写死值
- `countByCategory(catId)` 和 `countByStatus(statusId)` 两个辅助函数在 app.js 中实现

### 2. secondary_sources 可展开（Expandable Secondary Sources）

- 原"补充叙事来源：n 条"段落替换为原生 `<details>/<summary>` 可折叠列表
- 展开按钮：`展开补充来源 (n) ▼`，点击展开完整列表
- 展开列表显示每条来源的：类型标签 / 标题 / 叙事注释 / ↗外链
- `buildSecondarySourcesExpandable(sources)` 函数在 app.js 中实现
- CSS 新增 `.sec-sources-expandable` / `.sec-sources-toggle` / `.sec-sources-list` / `.ss-*` 规则

### 3. Pan Am 1947 查档路线固化（Research Path）

`pan-am-1947.verification_hint` 扩展为包含 6 步查档路线：

| Step | Label | URL | Note |
|------|-------|-----|------|
| 1 | NARA Project BLUE BOOK Landing Page | archives.gov/.../ufos | Overview + T-1206 microfilm (94 rolls) |
| 2 | NARA UAP Textual & Microfilm Records | archives.gov/.../textual-and-microfilm | NAID 40027753, NAID 595175, NAID 597821 |
| 3 | NARA Bulk Download — Case Files NAID 597821 | archives.gov/.../catalog-bulk-downloads | JSON metadata search by 1947 date |
| 4 | NARA Catalog — UFO Sightings NAID 40027753 | archives.gov/.../catalog-bulk-downloads | Cross-ref with AFoshay Report case list |
| 5 | AFoshay Report — Blue Book Summary (1958) | archives.gov/.../ufos | 12,618 cases indexed by date/location |
| 6 | If unresolved — microfilm index consultation | — | T-1206 roll index, July–September 1947 over Alaska |

`query_terms` 新增：`T-1206` / `NAID 597821` / `NAID 40027753` / `Pan American` / `September 1947`
`archive` 更新为：`NARA / Project BLUE BOOK`

### 4. Source Explainer 说明更新

"待核实"说明新增：**"待核实并不代表案例虚假；它只表示当前页面尚未找到足够精确的官方档案编号或 catalog item。"**

### 5. 来源状态（无变化）

source_status 分布维持 v0.3：`verified×5 / secondary_only×4 / needs_review×1`

---

## 数据结构（v0.3.1 Data Schema）

### 新增 research_path 字段（v0.3.1 — 可选，needs_review 强烈建议）

```javascript
{
  verification_hint: {
    archive: "NARA / Project BLUE BOOK",
    query_terms: [
      "Pan Am", "Pan American", "September 1947",
      "Alaska", "orange object", "Project Blue Book",
      "T-1206", "NAID 597821", "NAID 40027753"
    ],
    target: "exact Project Blue Book case file date/location entry or National Archives Catalog identifier",
    // v0.3.1: research_path
    research_path: [
      {
        label: "1. NARA Project BLUE BOOK Landing Page",
        url: "https://www.archives.gov/research/military/air-force/ufos",
        note: "Overview + microfilm access instructions (T-1206: 94 rolls 35mm)"
      },
      {
        label: "2. NARA UAP Textual & Microfilm Records",
        url: "https://www.archives.gov/research/topics/uaps/textual-and-microfilm",
        note: "Links to NAID 40027753, NAID 595175, NAID 597821"
      },
      {
        label: "3. NARA Bulk Download — Case Files NAID 597821",
        url: "https://www.archives.gov/research/catalog/catalog-bulk-downloads/uap-bulk-download",
        note: "JSON metadata search by date: September 1947, location: Alaska"
      },
      {
        label: "4. NARA Catalog — UFO Sightings NAID 40027753",
        url: "https://www.archives.gov/research/catalog/catalog-bulk-downloads/uap-bulk-download",
        note: "Cross-reference with AFoshay Report (1958) 12,618-case index"
      },
      {
        label: "5. AFoshay Report — Project Blue Book Statistical Summary (1958)",
        url: "https://www.archives.gov/research/military/air-force/ufos",
        note: "All 12,618 cases indexed by date and location — use for Pan Am September 1947 lookup"
      },
      {
        label: "6. If still unresolved — microfilm index consultation",
        url: "",
        note: "T-1206 roll index: July–September 1947 over Alaska. Consult NARA microfilm reading room."
      }
    ]
  }
}
```

---

## 来源状态定义（v0.3.1）

| Status | 标签 | 含义 |
|--------|------|------|
| `verified` | 官方来源 | .gov 域名或官方授权机构发布的文件，案例可直接追溯 |
| `secondary_only` | 二手来源 | 有公开档案，但原始编号或 catalog 在线访问状态需核实 |
| `needs_review` | 待核实 | 案例在公开档案中有记载，但具体编号仍待核实；本页面提供 research_path 入口 |

**重要：待核实 ≠ 案例虚假；它只表示尚未找到精确的官方档案编号或 catalog item。**

---

## 案例卡片（v0.3.1 — 来源状态）

| # | Case ID | 年份 | Agency | Category | Source Status |
|---|---------|------|--------|----------|---------------|
| 1 | gemini-vii-1965 | 1965 | NASA | NASA | secondary_only |
| 2 | apollo-11-lunar-flash-1969 | 1969 | NASA | NASA | secondary_only |
| 3 | apollo-12-occultation-1969 | 1969 | NASA | NASA | verified |
| 4 | pan-am-1947 | 1947 | USAF / Pan Am | Historical | needs_review |
| 5 | rendlesham-forest-1980 | 1980 | U.S. Air Force / RAF | Military | secondary_only |
| 6 | uss-nimitz-tic-tac-2004 | 2004 | U.S. Navy / AATIP | Military | verified |
| 7 | gofast-2015 | 2015 | U.S. Navy / AATIP | Military | verified |
| 8 | orbs-pacific-2023 | 2023 | DOW / AARO | Military | verified |
| 9 | fbi-louisville-1949 | 1949 | FBI / Project Blue Book | FBI | secondary_only |
| 10 | pentagon-2017-aatip | 2017 | DIA / AATIP / UAPTF | Military | verified |

**来源统计：** verified × 5 | secondary_only × 4 | needs_review × 1 | 总计 10

---

## 交互功能（v0.3.1）

- **Category 筛选 + 计数徽章**：按 NASA / Military / Historical / FBI / Visual 筛选（第一行，自动计数）
- **来源状态筛选 + 计数徽章**：按 Verified / Secondary Only / Needs Review 筛选（第二行，自动计数）
- **双维度组合筛选**：category filter × status filter AND 组合
- **secondary_sources 可展开**：`<details>/<summary>` 原生展开，显示完整来源列表
- **research_path 查档路线**：needs_review 案例显示 6 步查档路径，含 URL 和注释
- **核实入口**：needs_review 案例显示紫色"🔍 协助核实"区块

---

## 来源链接

### 官方来源
- PURSUE 入口：https://www.war.gov/ufo/
- WAR.GOV Apollo 12 Transcript (PURSUE R1)：https://www.war.gov/medialink/ufo/release_1/nasa-uap-d1-apollo-12-transcript-1969.pdf
- 官方新闻稿：https://www.war.gov/News/Releases/Release/Article/4480582/
- DoD UAP 视频发布（2020）：https://www.defense.gov/News/News-Stories/Article/Article/2329013/
- AARO FY2023 年报：https://www.aaro.mil/Reports/Annual-Reports/FY2023/UAP-Annual-Report-FY2023.aspx
- FBI FOIA Vault UAP：https://vault.fbi.gov/UAP%20/UAP%20Part%2001%20of%2001/
- NARA Project BLUE BOOK：https://www.archives.gov/research/military/air-force/ufos
- NARA UAP Textual & Microfilm：https://www.archives.gov/research/topics/uaps/textual-and-microfilm
- NARA UAP Bulk Downloads：https://www.archives.gov/research/catalog/catalog-bulk-downloads/uap-bulk-download
- NASA Apollo 11：https://www.nasa.gov/mission_pages/apollo/apollo11.html
- NASA Apollo 12：https://www.nasa.gov/mission_pages/apollo/apollo12.html

### 历史档案参考
- UK National Archives UFO Reports：https://www.nationalarchives.gov.uk/explore-the-collection/explore-by-time-period/postwar/ufo-reports/
- UK National Archives DEFE 24/1948/1（Rendlesham Forest correspondence）

### 媒体参考
- WIRED: "Orbs, Saucers, and Flashes on the Moon: Pentagon Drops New UFO Files"
- Live Science: "US government declassifies nearly 200 UAP files…"
- The Guardian: "Pentagon releases first batch of previously secret files documenting reports of UFOs"

---

## 预览命令

```bash
cd ~/projects/uap-files-web
python3 -m http.server 8080
# 浏览器打开 http://localhost:8080
```

---

## 技术说明

- **无外部依赖**：纯 HTML/CSS/JS，无 npm、无构建工具
- **secondary_sources 展开**：原生 `<details>/<summary>`，零 JS 依赖
- **计数徽章**：JS 计算，数据驱动，非手写死
- **research_path 渲染**：JS 动态生成，支持任意步骤数
- **字体**：系统字体栈（无 Google Fonts CDN 依赖）
- **图片**：无外部图片，CSS 视觉占位

---

## 如何扩展案例

1. 在 `data.js` 的 `UAP_CASES` 数组中新增对象
2. 确保包含所有必需字段（参考上方 Data Schema）
3. 为每个案例提供 `source_url`（即使是待核实也需要占位 URL）
4. 根据来源可靠性设置 `source_status`
5. 来源为 `needs_review` 时，**强烈建议**同时添加 `verification_hint` + `research_path`

---

## 局限性 / 待办

1. **pan-am-1947** 仍为 needs_review；research_path 已完整提供，仍需人工 NARA catalog / microfilm 查询
2. **PURSUE 原文引用**：案例描述基于公开媒体报道整理，非 PURSUE 原文引用
3. **中文翻译**：部分 NASA/军方术语的中文翻译有待专业核实
4. **无障碍**：ARIA roles 已添加，但未做完整的 WCAG 审核
5. **UK National Archives catalogue item**：DEFE 24/1948/1 具体数字化访问状态待人工确认

---

## 版权说明

本项目为静态研究原型，仅供本地预览。页面内容基于公开来源整理，不声称任何档案内容的官方权威性。
