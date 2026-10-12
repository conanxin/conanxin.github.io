# Conan Xin 数字花园 — 项目交接入口

> 更新：2026-10-12（UTC+8） · 下一阶段：`TASK_ID=CONANXIN_SITE_DESIGN_STAGE2G_P4_CONTINUATION`  
> 先核对 GitHub `main` 当前 SHA、PR 和 Pages Actions，不能把本交接文件中记录的历史 SHA 当作永远最新的主分支状态。

## 1. 项目目标与边界

在文章、项目、展览和文献资料之间建立统一、可读、可访问的网站，同时保持可追溯研究证据和特殊专题的独立体验。

- 唯一视觉权威：`assets/site/design.css`；构建与发布：`scripts/build_site.py`、`scripts/personalize_site.py`、`.github/workflows/pages.yml`。
- Agent 入口：`AGENTS.md`、`CLAUDE.md`、`docs/SITE_DESIGN.md`、`.cursor/rules/site-design.mdc`。
- 历史研究正文、原始图片、OCR、引文、JSON、交互及保全分支保持不变；任何新开发需独立分支、PR、真实测试和审阅，不直接改写 `main`。

## 2. 已合并阶段

| 阶段 | PR | 合并 SHA | 实际交付 |
|---|---|---|---|
| Stage 1 | [#10](https://github.com/conanxin/conanxin.github.io/pull/10) | 见 PR | 跨 Agent 设计规范 |
| Stage 2A | [#11](https://github.com/conanxin/conanxin.github.io/pull/11) | `00fa798` | 四类完整模板、模板排除发布、`/site-guide/`、PR CI |
| Stage 2B | [#12](https://github.com/conanxin/conanxin.github.io/pull/12) | `3e3c929` | SpaceX 原生主题例外、手机断行、双视口回归、工程规则同步 |
| Stage 2C | [#13](https://github.com/conanxin/conanxin.github.io/pull/13) | `5d76e6f` | 两个真实文章/项目模板、四模板标签修复、发布后检查 |
| Stage 2C 文档 | [#14](https://github.com/conanxin/conanxin.github.io/pull/14) | `d8b0445` | 持久交接与设计规范 v1.2 |
| **Stage 2D** | [#15](https://github.com/conanxin/conanxin.github.io/pull/15) | **`671c31270aecdea3aee0930c260f29078b9c0bf4`** | SHUGE 展览/文献实页、自动内容索引、可验证来源边界 |
| **Stage 2E** | [#17](https://github.com/conanxin/conanxin.github.io/pull/17) | **`17ba656e3c1695624058ce00750b0cb1f7650734`** | 从旧 works.json 找到正确 ID/题名/URL；新独立审计与 reference 导览；收紧自动索引准入 |
| **Stage 2F** | [#19](https://github.com/conanxin/conanxin.github.io/pull/19) | **`da196453ddec219aebb13f5372a6caad00def772`** | 日本/BnF原藏机构目录号、四个候选馆藏记录、六条 Citation ID 完整性审计及新 reference 页面 |

生产验收证据：
- Stage 2B [Run 38142644340](https://github.com/conanxin/conanxin.github.io/actions/runs/38142644340)：19 Python 测试、32 浏览器检查、9 公网路径。
- Stage 2C [Run 38143831596](https://github.com/conanxin/conanxin.github.io/actions/runs/38143831596)：24 Python 测试、36 浏览器检查、12 公网路径。
- **Stage 2D [Run 38146608834](https://github.com/conanxin/conanxin.github.io/actions/runs/38146608834)：31/31 Python 测试、42/42 Playwright、15/15 真实公网路径（HTTP 200），JS 错误 0；自动索引 JSON 核验通过。**
- **Stage 2E [Run 38184465542](https://github.com/conanxin/conanxin.github.io/actions/runs/38184465542)：38/38 Python 测试、44/44 Playwright、16/16 公网路径（含来源对照页）、JS 错误 0；对照 JSON 状态检查通过。**
- **Stage 2F [Run 38188833394](https://github.com/conanxin/conanxin.github.io/actions/runs/38188833394)：45/45 Python 测试、46/46 Playwright、17/17 公网路径、JavaScript 错误 0；新增核验页与六条 Citation ID JSON 状态检查通过。**

## 3. 已发布真实内容与索引

### Stage 2C

- [研究网站的正文、证据与技术日志](/posts/site-design-evidence-layers.html) — article 模板，证据限于真实设计规范、PR、Actions。
- [数字花园设计工程档案](/projects/site-design-lab/) — project 模板，阶段与技术记录可回溯。

### Stage 2D

- [SHUGE 数字生命展览导览](/projects/site-design-lab/shuge-evidence-exhibition/) — exhibition 模板：既有 SHUGE 展厅 2、页目数据及证据审计，不声称三个数字研究对象为已鉴定实体展品。
- [SHUGE 来源与引用核验索引](/projects/site-design-lab/shuge-source-register/) — reference 模板：保留三个 `work_id`、临时 `title_zh` 与未记录的作者/年份；不把候选 Citation ID 当作已经人工验过的原始引文。
- [自动内容索引](/content-index/) 与 [/assets/site/content-index.json](/assets/site/content-index.json)：从已成功构建、具有公开路由的页面生成。首次 Stage 2D 生产索引为 **72 篇文章 + 39 项项目 + 1 项展览 + 1 项文献 = 113 条入口**；随以后发布自动变化，并非固定目标数。只搜索标题/简介，不是全文检索；不按假定发布日期排序。
- 通过 `/site-map/`、旧 `/posts/` 和 `/projects/` 的共享外壳与全站页脚进入自动索引。**没有修改旧手工列表源文件或计数**。

### Stage 2E

- [SHUGE 三条作品 ID 来源核对](/projects/site-design-lab/shuge-source-crosswalk/) — 仍使用完整 **reference** 模板，通过旧 `works.json` 找到 P168491=《园冶》、P211203=《天工开物》、P44159=《工程做法》，另 P124575 才是《水经注》。[机器可读证据](../projects/site-design-lab/shuge-source-crosswalk/crosswalk.json) 保存 VERIFIED（内部映射与公开书格页面）、UNVERIFIED（原藏机构目录与扫描）及限定范围的 NOT_FOUND（额外 numeric permalink 检索）。

### Stage 2F

- [原藏机构目录及 Citation ID 证据台账](/projects/site-design-lab/shuge-source-crosswalk/primary-catalog/)：完整 `reference` 模板；[机器数据](../projects/site-design-lab/shuge-source-crosswalk/primary-catalog-audit.json) 记载《园冶》子076-0004、《天工开物》BnF Chinois 5563／Gallica ARK、《工程做法》史112-0007 与 297-0020 两套候选馆藏记录。**3 部作品各有原馆目录候选，共 4 条馆藏记录；0/3 份书格扫描已与原馆原图逐页比对。**
- 六条旧 Citation ID 仅 1/6 出现在冻结 `citations.json` 运行中，且 P168491:68 的 run #5 是《园冶》，纠正了旧审计“梦粱录运行”的错误；**0/6 完成原图和论断语义审定**。请阅读 [Stage 2F 研究报告](../docs/STAGE2F_PRIMARY_CATALOG_AUDIT.md)。

四种模板位于 `templates/site/{article,project,exhibition,reference}/index.html`，均为完整 HTML、不会进入公开构建；真实页面各有应用。唯一原生主题例外仍是 `projects/wbw-spacex-mars-cn/index.html`（`project-native`），其余完整页面默认 `unified-v1`。

## 4. SHUGE 史料状态与纠错边界

既有 `projects/shuge-exhibition-v1.0/data/bibliography.json` v0.7 中 `work-shuge-168491`、`work-shuge-211203`、`work-shuge-44159` 的 `title_zh` 是 **post_id 临时标签**。部分 Citation ID 在 `CLAIM_SUPPORT_AUDIT.md` 所检查的运行记录中未能解析，个别虽有解析记录却无法语义支持候选历史主张。因此：
- 不用这些临时标签证明《水经注》《天工开物》等原始作品身份、版本、作者或原刊年份；
- 不把 `REVIEW` 文章记为 `PUBLISHED`，不将 SHUGE OCR/索引状态等同于原件核验；
- 继续保留原版数据、引文、图像和项目级脚本，不静默修改研究资产。

## 5. Stage 2G 下一步（尚未执行）

1. 先读取 [Stage 2F 原馆目录与引文审计](../docs/STAGE2F_PRIMARY_CATALOG_AUDIT.md) 及 `primary-catalog-audit.json`；从官方 `子076-0004`、BnF `Chinois 5563`（Gallica ARK）、`史112-0007` 和 `297-0020` 的扫描/IIIF 或馆藏阅览器取得可以**逐张比对**的图像。对同名《工程做法》两个馆号保持独立，不得预先归为同一藏本。
2. 结合书格扫描、藏印、题签、序跋、刊记、书口与版式，通过独立的逐卷/逐页映射确认**原藏机构数字对象 = 书格所用图像**；馆方网页或年份吻合只是候选，不得升级为同一扫描 `VERIFIED`。
3. 从本地研究数据库明确导出 `page_object_id → page_index → source_image_uri/canvas → OCR QA → Citation ID`，先查 `SHUGE:p211203:1338` 多页标签（137/362/380）和 `SHUGE:p168491:68` 错误论断，再逐条人工审核全部六个 ID。**不得直接把 Citation ID 后缀视作 PDF 页码**。
4. 只新增独立的审计/纠错旁路，不改冻结 `bibliography.json`、`citations.json`、OCR、图像和既有研究正文。项目的自动内容索引保持保守边界，不为了展示史料而公开草稿或临时 source 文件。

## 6. 实际经验

- HTML 字符串检测不能替代真实 DOM；`site-guide` 的主题识别已因此修复。
- CI 全绿不一定代表手机无横向溢出；Stage 2B 和 2D 都在浏览器检查中增加了滚动宽度断言，并修复来源 URL、索引网格溢出。
- Stage 2C 曾在部署后内联 Python 中漏引号，现由 PR 单元测试先编译生产专用脚本。
- Stage 2D 的 Codex P2 建议要求共享 `.visually-hidden` 样式与真正换行的 BibTeX 示例，已修复并验收。代码、PR 讨论、Actions 和本文件应共同成为下一轮 Agent 的恢复入口。


## 7. Stage 2E · 已合并并完成生产验证

此阶段基于当时主分支 `43e2f12` 建立独立分支 `review/stage2e-shuge-source-reconciliation`（现在已经合并），不再重新开发 Stage 1—2D。

- 新增 `projects/site-design-lab/shuge-source-crosswalk/crosswalk.json` 与同目录 `index.html`，供读者查看冻结的三个 `work_id`、同仓库 `works.json` 中已保存的 post_id/title/shuge_url 一对一对照、三个可查阅书格作品页面以及仍待核的原藏机构目录号和扫描页。
- **重要纠错**：现存 `projects/shuge-exhibition-v1.0/data/works.json` 的 `featured[]` 已直接保存三条 `post_id → title / shuge_url`：P168491 = **《园冶》**、P211203 = **《天工开物》**、P44159 = **《工程做法》**；另 P124575 才是**《水经注》**。因此内部归档 ID 映射可标为 **VERIFIED**；三个书格候选网页也已核对。但 **0/3** 得到原藏机构稳定馆藏号 + 扫描书影的独立验证，此层仍 **UNVERIFIED**；在线额外 numeric permalink 的 **NOT_FOUND** 仅限本轮查询，不能否认原档已有映射。
- v0.7 中 `work-shuge-168491` 的 `dynasty=Northern Wei` 与 `works.json` 所载《园冶》明代相冲突；P211203 的 `dynasty=Song` 与《天工开物》明代相冲突。这是冻结书目元数据质量问题，须在**新增审计**中说明，不回写原始 v0.7 数据。作品身份的内部归档映射已核，下一步缺的是原藏机构目录和真实扫描页版本比对。
- `docs/STAGE2E_SOURCE_RECONCILIATION.md` 记录查询方法、外部候选链接和下一步所需原始版本/馆藏号证据。保持 `projects/shuge-exhibition-v1.0/data/*` 和所有旧版 SHUGE 研究正文只读。
- 在 `scripts/content_index.py` 增加显式拒绝 `drafts/`、`future/`、`src/`、`source/`、`work/`、`reports/`、历史展览 v0.* 的路径保护，即使误加了分类 meta，也不能被公开精选索引收录。**Stage 2E 没有扩大自动索引的收录范围**。
- 增加 `tests/test_stage2e_source_reconciliation.py`、1440/390 浏览器验证和部署后公网 JSON 校验。

**验收结果**：PR [#17](https://github.com/conanxin/conanxin.github.io/pull/17) 已合并，SHA `17ba656e3c1695624058ce00750b0cb1f7650734`。GitHub Pages [Run 38184465542](https://github.com/conanxin/conanxin.github.io/actions/runs/38184465542) **Success**：38/38 单元测试、44/44 浏览器检查、16/16 公网路径；新 `crosswalk.json` 的内部映射 VERIFIED／原藏机构 UNVERIFIED 状态经过上线校验。网页原生视觉 1440/390 已核查，390px 无横向溢出。**下一阶段仍需馆藏实物与扫描页的独立验证；不要重做 PR #10—#17。**


## 8. Stage 2F · 原藏机构目录与 Citation ID 双轨审计（已合并并正式发布）

- 历史基线：Stage 2E 的 `main=f88101d`，本阶段曾在独立分支 `review/stage2f-primary-catalog-citation-audit` 实施。**PR #19 已合并，正式部署 Run 38188833394 Success**；当前研究者可直接阅读已发布的页面。
- 新数据 `projects/site-design-lab/shuge-source-crosswalk/primary-catalog-audit.json`：查得《园冶》日本内阁文库 `子076-0004`／馆方记录 `1079110`；《天工开物》BnF `Chinois 5563`／Gallica `ark:/12148/btv1b52505781g`；《工程做法》原馆两条不同索书号 `史112-0007`／`297-0020`，仍不能唯一确定哪条来自书格的同一扫描。
- BnF 同时藏 `Chinois 5564` 另一版，不能套用 5563 的 ARK。研究论文所标 Gallica `f274` 是可追踪的图像页线索，但此轮尚未直接目视核验该图。
- 六个冻结 Citation ID 只 **1/6** 出现在 `citations.json` 的 `runs[].claims[]`；`SHUGE:p168491:68` 实际归属 **run #5《园冶》**，原 `CLAIM_SUPPORT_AUDIT.md` 称《梦粱录》运行有误。其他五个在这份运行 JSON 是 NOT_FOUND，虽出现在证据卡和段落，并不意味着支持某历史论断。
- 旧 `SHUGE:p211203:1338` 在不同证据卡中出现局部页码 137/362/380，而 `works.json` 称《天工开物》只有 419 扫描页；**不能把 ID 后缀直接当 PDF 页号**。原数据库 `page_object_id`→`page_index`→原馆扫描还未建立，六条引文的原图语义审核均保持 UNVERIFIED。
- 新公开页面采用完整 `reference` 模板：`projects/site-design-lab/shuge-source-crosswalk/primary-catalog/index.html`；详情见 `docs/STAGE2F_PRIMARY_CATALOG_AUDIT.md`。代码增加 `tests/test_stage2f_primary_catalog.py`、1440/390 浏览器断言及生产后 JSON 检查。
- **保留边界**：原 SHUGE `projects/shuge-exhibition-v1.0/data/*`、旧 `CLAIM_SUPPORT_AUDIT.md`、图像与 OCR 均完全不改。

**验收与下一阶段**：[PR #19](https://github.com/conanxin/conanxin.github.io/pull/19) 已合并 SHA `da196453ddec219aebb13f5372a6caad00def772`，生产 [Run 38188833394](https://github.com/conanxin/conanxin.github.io/actions/runs/38188833394) 45/45 unittest、46/46 Playwright、17/17 HTTP 200。Stage 2G 应以原藏扫描和本地数据库明细建立逐页影像映射，再逐字复校六条 Citation ID；不因本轮找到馆号而升级引文语义状态。


## 9. Stage 2G-P1：图像定位与只读核验工具（已发布；原图学术 Gate 未完成）

- 开发分支：`review/stage2g-image-locators-citation-gates`，基于 Stage 2F `main=4756d56`。**[PR #21](https://github.com/conanxin/conanxin.github.io/pull/21) 已合并**，提交 `369abb5018f052551cbe222307fd7760d535bf4e`；[GitHub Pages Run 38203071850](https://github.com/conanxin/conanxin.github.io/actions/runs/38203071850) **Success：58/58 Python 测试、48/48 Playwright、18/18 公网路径、JS 错误 0**。这些工程 Gate 通过不等于原图下载/逐张比对或引文语义已完成。
- `projects/site-design-lab/shuge-source-crosswalk/scan-locator-audit.json`：分层保存《园冶》子076-0004 三册目录、《天工开物》BnF Gallica ARK/f274、两套《工程做法》馆号及 NAA 第23册/第32册各三条可索引 JP2 下载控件编号。原始图像下载 0，完成同图核验 0。
- `docs/STAGE2G_SCAN_ALIGNMENT_AUDIT.md` 与 `scan-locator/index.html`：说明官方站点自动访问遇到 403、图像字节未取得、馆方“公開”目录与“館内限定閲覧”图像访问的区别。
- 六条 Citation ID 的证据卡局部页号经过原 JSON 重算：特别 `SHUGE:p211203:1338` 被关联到 **137/362/380** 三个不同页号；一些差值约 958，但只是数字观察，禁止推断 PDF 页、馆方 canvas 或历史主张已证实。
- 已从先前项目记录恢复真实 SHUGE SQLite 的 WSL 路径 `/home/conanxin/shuge-research-db/data/shuge.db`；新增 `scripts/stage2g_sqlite_probe.py`，使用 `mode=ro` + `PRAGMA query_only=ON` 按六条 Citation ID 查 `page_objects` 里的主键与作品关系。**尚未在原 SQLite 上成功执行**：授权桌面设备在线，但命令执行接口返回 `Failed to get process ID`。CI 仅在临时 SQLite fixture 上验证无写入和错误映射拒绝，并不作为真实库查询回执。
- 自动索引继续只收录真正已构建的公开页面，仍沿用 Stage 2E 的草稿/源文件过滤规则。
- 参考文献页采用完整 `template-reference` 和全站 `--site-*` 变量，不修改 `projects/shuge-exhibition-v1.0/data/*`、旧审计、原图/OCR/论文。

**Stage 2G-P1 交付状态**：图像定位页、JSON 与只读 SQLite 探针已经通过 PR/生产部署；**未完成 Gate**仍是原图下载 0、实际原 SQLite 查询 0、书格/原馆逐张同图验证 0/3、引文原图语义审核 0/6。下一轮仍属于 Stage 2G-P2，不自行升级为 Stage 2H 或声明研究完成。

## 10. 最初目标、全项目进度与 Stage 2G-P2 的实际 Gate

> **2026-10-12 项目整体评估**：[最初目标、完成情况与证据链阻断报告](./PROJECT_OBJECTIVES_PROGRESS_2026-10-12.md)。

本项目实际上有**两条不可混淆的目标线**：跨 Agent 的 Conan Xin 数字花园网站工程（核心设计/模板/构建/发布主线已交付）；以及 SHUGE 古籍数字人文研究（已具备作品目录、OCR/检索快照、叙事展览、来源核验旁路，但尚未打通原馆扫描、真实 `page_object_id`、OCR 与历史论断的可靠引用链）。网站 CI 全绿只说明工程层达到验收，不意味着研究的学术证据 Gate 完成。

**历史快照（PR #23 写入时，已被第 11 节的新证据更新）**：当时授权 Desktop Commander 设备在线但默认 PowerShell 无法启动（`Failed to get process ID`），尚未读取真实 `shuge.db`、没有访问到当地存档图像字节。后来改用 `cmd.exe → wsl.exe`，已完成第 11 节的 **6/6 真实 SQLite 页对象匹配与本地 JPEG 哈希校验**。原馆整册同一性 0/3、六条 Citation ID 的完整 OCR/历史命题核验 0/6 依然开放。

本节是 PR #23 时点的状态评估，不代表当前最后一道数据库进度；**图像完整性在第 11 节已取得新进展，但整本藏版同一性或历史论文复核仍未完成**。新研究数据依旧写入独立 sidecar，原 SHUGE v0.7/v1.0 数据/OCR/影像/文章保持只读。


## 11. Stage 2G-P2 · 真实 SQLite 页对象和归档图像证据（已正式部署）

- 本轮解决了 Desktop Commander 默认 PowerShell `Failed to get process ID`：改用 **`cmd.exe`** 启动 WSL，真实只读打开 `/home/conanxin/shuge-research-db/data/shuge.db`。该库 45,989,888 字节，SHA-256 `4e28174734737d902ba70b83f901e44e9e8f094ce6d43521b3bb4ec7c65052a8`；`page_objects` 3,791 条，`page_ocr` 3,586 条。
- 真正的 **6/6 Citation ID→页对象 ID→作品→page_index** 已由原库直接核实，页索引依次为 8、137、220、362、380、1。旧证据卡中 `p211203:1338` 的 137/362/380 混用确认不能自动等同为同一页：其真正数据库页索引为 380。
- 原库 `local_object_path` 中六个 JPEG 实际存在且重算 SHA 与采集记录相同（**6/6 VERIFIED archived bytes**），采集日志均为旧批次 `SUCCESS HTTP 200`。6 张均已目视初检；《工程做法》页 1 封面内阁文库编号可见 112、7，《园冶》页 8 是卷一目录，《天工开物》137 为井盐图。
- `page_ocr` 六条均在库中：5 个 `qa_status=NOT_CHECKED`、1 个《工程做法》封面 `qa_status=PASS`。这些 QA 标记不是本次逐字人工校勘，**0/6 条完整文本及历史论断获学术 VERIFIED**。
- **BnF 数字对象差异未决**：库内 Gallica 影像均来自 `btv1b525104776`，而此前 Stage 2F 论文引图使用 `btv1b52505781g`；`digital_objects` 的前者虽标注 Chinois 5563，尚不能直接宣称两个 ARK 是同一扫描。
- 证据页与原数据分开保存：[已发布 real-db-page-links.json](../projects/site-design-lab/shuge-source-crosswalk/real-db-page-links.json)、[Stage 2G-P2 真实 SQLite 审计](./STAGE2G_P2_REAL_SQLITE_EVIDENCE.md)、修订的 `scripts/stage2g_sqlite_probe.py` 及其测试。**PR #24 已合并（`27f0ebc30a7584590537f118ecaaadbe84483001`）且 GitHub Pages Run 38207442742 Success**：64/64 单元测试、48/48 Playwright、18/18 公网路径、0 JS 错误；新 JSON 已从公网直接读取。
- 本轮未修改任何冻结 SHUGE v0.7/v1.0 JSON、原图、OCR、引文、历史论文。下一阶段先裁决 OCR 字符与错误语义匹配，不再误把自动 `SUPPORTED` 当成历史论断已证实。


## 12. Stage 2G-P3 · 选段 OCR 字形与证据语义筛查（已部署，全文校勘尚未完成）

- P2 [PR #24](https://github.com/conanxin/conanxin.github.io/pull/24) 的六个真实 SQLite 主键与本地图像 SHA 证据已保留；[PR #25](https://github.com/conanxin/conanxin.github.io/pull/25) 的文档收尾已合并，最新历史生产回执为 [Run 38207956741](https://github.com/conanxin/conanxin.github.io/actions/runs/38207956741)（64/64 Python、48/48 浏览器、18/18 公网路径）。
- 新的 [Stage 2G-P3 选段审计](./STAGE2G_P3_OCR_SPOTCHECK.md) 与 `projects/site-design-lab/shuge-source-crosswalk/ocr-semantic-spotcheck.json`：从真实 `page_ocr` 的页 68/1338 文本与已 SHA 核的 JPEG 图像对照少量易认字串，发现 4 个局部 OCR 错识。**这是 AI 辅助选段复核，不是两页全文人工校勘，也没有改写 OCR 库。**
- 另外抽查 8 个 `research_run_id × citation_id` 组合：目录标题存在的狭义事实可有局部图像证据，但盐井图不能回答黄河河防、`p211203:1338` 的鱼肉加工不能证实《水经注》区块链应用、《工程做法》封面不能证明“柱径玖寸”等技术细节。历史 `SUPPORTED` 原状态未改。
- **双 Gallica ARK 仍未消歧**：真实 SQLite 保存 `btv1b525104776`，BnF 官方《天工开物》1637 年 Chinois 5563 专文则链接 `btv1b52505781g`。两者不能直接交叉套用 f274 或其他 canvas，当前 `UNVERIFIED`。
- **Stage 2G-P3 已发布**：[PR #26](https://github.com/conanxin/conanxin.github.io/pull/26) 合并 SHA `93044be7e2bf17e5b93bb0bf5ff75153eec079a5`；正式 [Pages Run 38209895849](https://github.com/conanxin/conanxin.github.io/actions/runs/38209895849) **70/70 Python、48/48 浏览器、18/18 公网路径、JS 错误 0**。新 [OCR/语义 sidecar](https://conanxin.github.io/projects/site-design-lab/shuge-source-crosswalk/ocr-semantic-spotcheck.json) 已通过公网实际读取。**完整 OCR/历史论断 0/6 和整册原馆版次未证**，下一阶段 P4 聚焦两个 Gallica ARK 的官方 manifest/canvas、更多逐页 OCR 校勘与正式命题证据。

**范围**：只增加新研究 sidecar、审计文档与测试，并纠正旧交接中的时点措辞；冻结 SHUGE v0.7/v1.0 JSON、影像、原研究论断和 OCR 一律未动。
