# Conan Xin 数字花园 × SHUGE — 最初目标、阶段进展与下一步

> 复核日期：2026-10-12 · TASK_ID=`CONANXIN_SITE_DESIGN_STAGE2G_P2_CONTINUATION`  
> 初稿验证的 `main` 基线：`a2776363e3b6f408ac6e2aa28032e8c0d20d01a0`（PR #22 合并）；后续更新至 **`1833b3d31f31fec78dbc768372717b760ff8c241`**（PR #25 合并，详见第 8 节）。  
> 本报告是**项目状态审查**，不修改任何冻结古籍元数据、OCR、图像、论文或引用记录。

## 1. 两条最初目标与合并后的长期愿景

项目现由两条既有工作线组成，**不可把它们的完成标准混为一谈**：

**A. 书格数字人文研究／展示主线（较早启动）**

最早的 SHUGE 展览信息架构 `projects/shuge-exhibition-v1.0/IA.md` 说明：把书格的一组古籍从静态书目与 PDF 推进到**采集 → OCR → 可检索索引 → 可追溯证据／Citation → 研究治理 → 叙事策展与公开展示**的研究基础设施。站内设五个展厅：从书目到基础设施、一部书的数字生命、历史水利、建筑营造、AI 辅助历史研究。其理想结果是让读者对某项历史论断能够沿 `claim → Citation ID → page_object_id → OCR → scan/canvas → original catalog/edition` 回溯到具体书页，而不只看到 AI 总结。

**B. Conan Xin 数字花园网页设计主线（以 PR #10 起步）**

最初 PR #10 `site-design(stage1): 跨 Agent / 跨模型统一网页设计规范入口` 的目标是避免不同 Agent 维护文章、研究专题、项目与展览时生成互相冲突的界面。统一品牌、中文字体、暖白+深绿视觉、无障碍、导航、文章与项目模板；沿用现有构建器与 `assets/site/design.css` 唯一 token 源，保留已批准的 SpaceX 特殊专题和原研究资产。随后扩展为四类真实页面模板和自动内容发现。

**共同长期愿景：** 一个可以继续研究、可以阅读与探索、可以查明“这段话依据哪一份哪一页古籍”、并能由多个 Agent 反复扩展而不损害既有成果的数字研究网站。

## 2. 网站工程主线：已经交付

| 阶段 | PR | 交付 | 当前状态 |
|---|---|---|---|
| Stage 1 / 2A | #10、#11 | 跨 Agent 规范、四类完整 HTML 模板、主题与自动发布测试 | 已完成 |
| Stage 2B | #12 | SpaceX 原生深空／火星沙阅读兼容与手机断行 | 已完成 |
| Stage 2C | #13、#14 | 文章与项目真实模板页、引用／证据／技术日志分层、持续交接 | 已完成 |
| Stage 2D | #15、#16 | SHUGE 展览／文献真实页、自动内容索引（标题简介搜索与分类） | 已完成 |
| Stage 2E | #17、#18 | 作品 ID／URL 身份纠错、分类索引安全边界 | 已完成 |
| Stage 2F | #19、#20 | 原馆目录元数据旁路、新原馆核验页、六条引文审计 | 已发布研究记录 |
| Stage 2G-P1 | #21、#22 | 原馆阅览器图像定位编号、页号冲突记录、只读 SQLite 探针 | 已发布工具与研究记录 |
| Stage 2G-P2 | #23—#25 | 项目目标梳理、真实 SQLite 六页对象与 6 个本地 JPEG 哈希核验 | 已交付；OCR 字符级/历史论断仍待核 |

**此段属于最初 PR #23 时点的历史基线**：当时 `main=a2776363`，Pages Run 38203523959 为最后成功构建。**当前已验部署状态**：`main=1833b3d`，PR #25 的 [Pages Run 38207956741](https://github.com/conanxin/conanxin.github.io/actions/runs/38207956741) 通过 **64/64 Python 单元测试、48/48 Playwright 浏览器检查、18/18 公网路径检查**，JavaScript 错误 0。**这 18 条是验收抽样的公网路径，不是整个网站的页面总数。**

四类模板 article/project/exhibition/reference 均有真实发布示例；自动精选内容索引在 Stage 2D 首次有 113 条条目（72 文章、39 项目、1 展览、1 文献），之后会随新增的 `reference` 导览自动增长，**不要把历史的 113 当作此刻实时数字**。自动索引是标题与简介发现功能，不是历史资料全文检索，也不自动证明引文可信。

**工程结论：** 网站主线已有稳定的设计/构建/部署/验收能力，继续调整全站配色与重复写模板的边际价值较低。后续应把时间转移到可追溯史料，而不是再次重做 Stage 1–2D。

## 3. SHUGE 数字人文基础设施：快照能力与限度

`projects/shuge-exhibition-v1.0/data/manifest.json` 是 **2026-09-28 生成的历史快照**，记录：

| 项 | 当时数据 |
|---|---:|
| 作品记录 works | 756 |
| 机构记录 institutions | 82 |
| OCR 页记录 pages_ocr | 3,553 |
| 研究运行 research_runs_total | 234 |
| 研究论断 research_claims_total | 378 |
| 证据条目 research_evidence_total | 440 |
| 研究专题集合 collections | 2 |
| 研究工作区 research_workspaces | 3 |
| 版本记录 editions | 618 |

这些数值说明已有相当规模的采集、结构化、OCR 和研究工作流，**不是对所有古籍的真实性／版本或所有 OCR 页的人工核验数量**。SHUGE v1.0 的论文仍是 `REVIEW`；原 `PROVENANCE_AUDIT_v1.0.md` 明确 `PUBLISHED_COUNT=0`、`EXTERNAL_PEER_REVIEW=false`。证据与出版质量不能由网站 CI “PASS”直接升级。

## 4. 原始来源和引文链：目前走到哪一层？

| 层级 | 已确认的进展 | 尚缺、不得宣称完成的工作 |
|---|---|---|
| 作品身份／书格 URL | **3/3** 内部 `post_id→title→shuge_url` 可从旧 `works.json` 直接核对 | 这不等于对某一物理版本和图像扫描认定 |
| 原藏机构目录 | **3/3** 目标作品各有官方目录候选，合计 **4** 条候选馆藏记录 | 《工程做法》`史112-0007` 与 `297-0020` 不能混为同一套藏本 |
| 馆方阅览器图像定位 | 已有日本馆方若干件次/下载 checkbox ID，BnF Chinois 5563 的 Gallica ARK 及 f274 线索 | **原图二进制下载 0**；IIIF manifest 尚未成功取回；图像没有直接视觉核验 |
| 书格 ↔ 原藏扫描相同 | 仍有书格作品版本描述、馆方原始目录及相关图像定位可供对比 | **0/3 部书**完成书格 PDF 与原馆实际扫描的逐张同一性证明 |
| Citation ID ↔ 真实数据库页对象 | 研发了 `scripts/stage2g_sqlite_probe.py` 只读探针，临时 SQLite 测试通过 | **真实数据库读取 0**；无法生成可信 `page_object_id→page_index→image` 映射 |
| 引用 ↔ 原图 OCR ↔ 历史论断 | 六条候选 Citation ID 已逐个建账，只有 **1/6** 在特定冻结 `citations.json` runs 中命中 | **0/6** 完成原图逐字与语义支持复核，仍为 UNVERIFIED |

### 已明确纠正的历史错配

- `P168491 = 《园冶》`，`P124575 = 《水经注》`。旧冻结书目的 Northern Wei 标签不能用来认定前者为《水经注》。
- `P211203 = 《天工开物》`（明代），冻结 `dynasty=Song` 与旧作品档案时代不一致。
- `SHUGE:p168491:68` 在冻结 runs 的**《园冶》 run #5** 出现，旧 Claim Support Audit 把它解释为《梦粱录》检索，不能沿用错误解释，也不能用于《水经注》论证。
- `SHUGE:p211203:1338` 在六张证据卡中关联局部页标签 **137／362／380**；一些引文后缀减局部页标签接近 958，只是**UNVERIFIED 的数值假设**，不能据此推断真实 PDF 或馆方画布页码。

**研究结论：找到了书和馆藏线索，尚未完全打通书格图像、馆方图像、真实数据库和六条学术引用的可验证链条。**

## 5. 当前真正的阻断点与原因

1. **原始图像访问**：Gallica IIIF manifest 和日本国立公文书馆阅览器在本轮自动访问中返回 403 或未取得可下载原图；能够检索到馆方图像编号不等于下载了 JP2。不能生成虚假的图像 SHA、IIIF canvas 列表和原图比较结果。
2. **原始 SQLite 执行**：文档所记路径 `/home/conanxin/shuge-research-db/data/shuge.db` 尚未成功访问。2026-10-12 再次确认授权 Windows 设备 `DESKTOP-3A8N7VN` **在线且 ping 成功**，但远程终端启动仍返回 `Failed to get process ID`，通过 Windows WSL UNC 路径进行文件元数据探测也失败（`UNKNOWN/ECONNRESET`）。因此不是“查询结果为零”，而是**根本没有成功读取真实数据库**。
3. **冻结研究元数据存在真实错误**：它们已经在新的只读审计 sidecar 中标注，不允许悄悄修正原 `bibliography.json` 或把 `REVIEW` 论文改为 `PUBLISHED`。
4. **研究目标与工程测量不同**：全部浏览器测试通过，只能证明页面与证据状态呈现正确，不能证明某条古籍史学解释成立。

## 6. 下一阶段：Stage 2G-P2 最短路径

**优先顺序不是重做网站 UI，而是先恢复一条真正的 ID→书页证据链。**

**P2-A · 真实 SQLite 页对象定位。** 在原数据库所在 WSL 环境，从已克隆站点仓库的根目录执行：

```bash
python3 scripts/stage2g_sqlite_probe.py /home/conanxin/shuge-research-db/data/shuge.db
```

这是只读查询（`mode=ro` + `PRAGMA query_only=ON`），不会修改源库。将**真实 stdout JSON** 保存到新的阶段证据旁路，而不是凭旧证据卡计算页索引。先处理冲突最大的 `SHUGE:p211203:1338`，再处理其他五条。若找不到表/列，输出保留 `UNVERIFIED` 并依实际 schema 调整探针。

**P2-B · 原馆关键扫描样本。** 先争取最小可核样本，不要求一次性下载全卷：《园冶》子076-0004 一张可识别卷册页、《天工开物》Gallica f274 一张、以及《工程做法》史112-0007 和 297-0020 各一张用于区分藏本的题签或钤印图。必须保留来源 URL、下载文件、实际 SHA-256、图像编号、版式比对结论。若馆方仅允许人工阅览或馆内使用，记录限制，不编造图像。

**P2-C · 逐页语义审核。** 针对数据库 join 已确证、原图可目视的页面，检查 OCR 与原图、再检查原句与历史 claim。逐条赋予 VERIFIED/UNVERIFIED/NOT_FOUND，**一页验过不等于整本书已验过**。

**P2-D · 学术发表 Gate。** 完成上述证据链后才能重新评估 SHUGE v1.0 `REVIEW` 论文的事实陈述和 Citation ID；不自动将研究运行里的 `SUPPORTED` 升级为已核史实，更不自动发表。

### Stage 2G-P2 的最小交付定义

- 实际原数据库的只读查询回执；若受阻，提供真实错误与 schema，不得用临时测试数据库冒充。
- 至少一条有原馆图像字节及书格对照的单页映射，或逐项写明外部无法获取的访问障碍。
- 六条 Citation ID 每条独立记录其主键/页对象/图像/OCR/语义的各层状态；真正验证多少写多少。
- 只新增 `docs/` 与研究 sidecar，不改原始 SHUGE v0.7/v1.0 研究数据、图像、OCR 与论文正文。

## 7. 项目评价

**已经完成的目标**：跨 Agent 网页系统、统一模板、自动内容发现、持续部署、SHUGE 可浏览展览和可回溯的馆藏目录与引文**审计入口**。

**尚未完成的最初高阶目标**：一项具体历史论断可以稳定、准确地回溯到一个真实原馆扫描页，并由人工检查该页文字和论断是否吻合。

下阶段推进是否有效，不取决于又新增了几个 PR 或几页界面，而取决于是否取得**真实数据库主键、真实图像字节、可重复的一页映射和逐字核验结论**。

参考资料：`docs/PROJECT_HANDOFF.md`、`docs/SITE_DESIGN.md`、`projects/shuge-exhibition-v1.0/IA.md`、`projects/shuge-exhibition-v1.0/data/manifest.json`、`PROVENANCE_AUDIT_v1.0.md`、`docs/STAGE2F_PRIMARY_CATALOG_AUDIT.md`、`docs/STAGE2G_SCAN_ALIGNMENT_AUDIT.md`、`scan-locator-audit.json` 与 PR #10—#22。


---

## 8. Stage 2G-P2 后续关键进展（2026-10-12 当日补充）

本报告第 4—6 节保留的是 **PR #23 写入时刻** 的历史状态（包括过时的“未访问真实 SQLite”与“图像字节 0”）；当前进展以第 8 节及 PR #24 的机器证据为准。其后使用授权 Desktop Commander 的 `cmd.exe` 命令通道执行 WSL，情况发生实质变化。

- **真实数据库已访问**：只读 `/home/conanxin/shuge-research-db/data/shuge.db`，SHA-256 `4e28174734737d902ba70b83f901e44e9e8f094ce6d43521b3bb4ec7c65052a8`。
- **六个 CID 全部完成真实 SQLite 主键及作品归属核验**，`page_index` 分别为 8、137、220、362、380、1。
- **六张历史归档 JPEG 已从源库实际读取，6/6 文件大小与重算 SHA-256 完全一致**；`acquisitions` 的旧日志存在 HTTP 200 记录。不能把“已保存并校验的本地归档”误描述为“2026-10-12 重新从原馆下载成功”。
- 六张书页得到初步目视确认：《园冶》目录页、《工程做法》目录封面及其 112/7 号、《天工开物》井盐／航运／朱色／鱼肉保存等内容。旧研究系统的若干 `SUPPORTED` 检索问题明显与实际书页主题不符。
- **新的未决难题**：图像来源 Gallica `btv1b525104776` 与 Stage 2F 引文的 `btv1b52505781g` 两个 ARK 是否对应同一物理册/扫描；五条 OCR `NOT_CHECKED`（另一页 QA PASS 也不是本轮完整逐字复校）；研究 claim 语义未全面核验。

新证据请以 [Stage 2G-P2 实库与图像报告](./STAGE2G_P2_REAL_SQLITE_EVIDENCE.md) 和 [机器记录](../projects/site-design-lab/shuge-source-crosswalk/real-db-page-links.json) 为准。**网站工程目标仍然完成，学术证据链已推进至真实页对象、历史采集信息及本地 JPEG 字节，未到完整 OCR 与历史命题验收。** 本阶段 [PR #24](https://github.com/conanxin/conanxin.github.io/pull/24) 已合并、[生产 Run 38207442742](https://github.com/conanxin/conanxin.github.io/actions/runs/38207442742) Success。
