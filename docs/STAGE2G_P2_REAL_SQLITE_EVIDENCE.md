# Stage 2G-P2 · 原始 SHUGE SQLite 与六张归档扫描的直接核验

> 2026-10-12 · TASK_ID=`CONANXIN_SITE_DESIGN_STAGE2G_P2_CONTINUATION`  
> 本轮原始数据库**已直接只读查询**，不是测试夹具、旧 JSON 推断或计算页码偏移。SHA、原始采集记录、OCR QA 与可辨图像内容分层保存。  
> 本文仅新增审计与工具修复，不修改任何冻结 SHUGE v0.7/v1.0 数据、OCR、图像、引文或论文。

## 1. 这次解开的真正卡点

此前 Remote Desktop Commander 的默认 `powershell.exe` 启动失败（`Failed to get process ID`），容易误认定 WSL 完全不可用。将远程 shell 改为 `cmd.exe`，成功执行 `wsl.exe` 并进入 `Ubuntu-24.04`。授权电脑 `DESKTOP-3A8N7VN` 中真实数据库如下：

- 原研究 SQLite：`/home/conanxin/shuge-research-db/data/shuge.db`
- 实际文件大小：**45,989,888 字节**，与历史展览 `manifest.json` 大小一致。
- 本轮重新计算 DB SHA-256：**`4e28174734737d902ba70b83f901e44e9e8f094ce6d43521b3bb4ec7c65052a8`**。
- 只读方式：`file:.../shuge.db?mode=ro` + `PRAGMA query_only=ON`。
- 实际 SQLite 表：`page_objects` **3,791** 行、`page_ocr` **3,586** 行。
- 结果导出：`projects/site-design-lab/shuge-source-crosswalk/real-db-page-links.json`。
- 用户机器上的研究审阅副本：`D:\CodexData\shuge-stage2g-p2-review\`（6 个只读来源的 JPEG 工作副本以及原库采样 JSON／脚本；**原库图片未被修改**）。

**重要更新：之前 Stage 2G-P1 正确记录了“那一轮未取得图像字节、未读取真实 SQLite”的状态，但 Stage 2G-P2 已实际验证本地历史归档 JPEG。历史结论不应被静默改写，新增真实取证另存旁路。**

## 2. 六条 Citation ID → 实际数据库页对象

直接对 `page_objects.id` 查询、逐条校验 `page_objects.work_id`，全部得到一一对应：

| Citation ID | `page_objects.id` | `work_id` | `page_index` | `page_label` | RapidOCR QA |
|---|---:|---|---:|---|---|
| `SHUGE:p168491:68` | 68 | `p168491`《园冶》 | **8** | `園冶１:p8` | NOT_CHECKED |
| `SHUGE:p211203:1096` | 1096 | `p211203`《天工开物》 | **137** | `p0137` | NOT_CHECKED |
| `SHUGE:p211203:1178` | 1178 | `p211203`《天工开物》 | **220** | `p0220` | NOT_CHECKED |
| `SHUGE:p211203:1320` | 1320 | `p211203`《天工开物》 | **362** | `p0362` | NOT_CHECKED |
| `SHUGE:p211203:1338` | 1338 | `p211203`《天工开物》 | **380** | `p0380` | NOT_CHECKED |
| `SHUGE:p44159:552` | 552 | `p44159`《工程做法》 | **1** | `工程做法１:p1` | PASS（数据库内 QA 标记） |

此前约 958 的偏移只是一种数学观察。真实主键查询现在证明六条后缀是**这些行的页对象 ID**，不是 PDF 页码；特别 `p211203:1338` 的本库页序为 380，旧 evidence_cards 将同一 ID 绑到 137、362、380 的混用不能通过投票或统一偏移消除。

**已核 VERIFIED 6/6：页对象主键、对应作品以及本库书内页索引。** 但单行页索引还不是原馆 IIIF canvas 位置与最终印本页码一一相等的证明。

## 3. 六个原始图像文件的真实检验

`page_objects.local_object_path` 中六个 JPEG 均存在。逐一重新计算 SHA-256，与 `page_objects.sha256`、`acquisitions.sha256` 三方一致；文件大小也一致，JPEG 文件头为 `FF D8 FF`。

| 项目 | 本轮验证 |
|---|---:|
| 原库存在且主键/作品匹配 | 6/6 |
| 本地存档 JPEG 可读取 | 6/6 |
| 每张 JPEG SHA-256 与历史记录吻合 | 6/6 |
| 采集记录 `SUCCESS` / 当时 HTTP 200 | 6/6 |
| 本次重新访问原馆在线资源并确认仍可下载 | 尚未证实 |
| 6 页 OCR 全文字人工逐字校勘 | **0/6** |
| 3 本书整本/整套与原馆影像逐张对应 | **0/3** |

这些 JPEG 的历史采集时间是 **2026-09-26**，包含原馆请求 URL、来源、采集批次与存储哈希。现存文件的字节完整性可以独立重复检验；**并非这轮重新从网站下载的 6 张新图，也不是经本轮重新认定的整套实体馆藏。**

### 逐张目视观察（仅限图像主题）

- **P168491:68**：可见《園冶》卷一目录，“相地”“山林地”“城市地”“村庄地”等，右页有藏印及日本国立公文书馆页角图像标识。狭义支持“《园冶》卷一目录含相地章节”。
- **P211203:1096**：卷上两页井盐生产插图，能辨“蜀省井盐”“鑿井圖”和牛力汲井示意，**不构成黄河河防的直接史料证据**。
- **P211203:1178**：卷上航运、镇江、江河风候相关正文；是《天工开物》书页，不能当作《水经注》原书。
- **P211203:1320**：卷下有关朱、朱砂、水银与色料的正文，不是旧查询所问的砖瓦或乃粒核心页。
- **P211203:1338**：卷下纸面页五十，内容与米饭、鱼肉保存、发酵等有关；旧运行中“水经注区块链”“太平洋”等主题不能由这一页支持。
- **P44159:552**：《工程做法》第一册《工程做法目录》的封面与比例色卡。内阁文库标签上能辨“函号 112、7”及册数 76 的信息，和日本国立公文书馆 `史112-0007` 的记录相符。这为**这一单页**属于该系列提供可观察线索，不能把整个七十六册的扫描和另一索书号 `297-0020` 一概视为已经完全鉴定。

上述目视结果属于 AI 辅助图像观察，不是已由人工研究者逐字校勘的古籍正文。OCR 单字准确性和每个自动 `SUPPORTED` 论断仍分别 **UNVERIFIED**。

## 4. 原馆数字对象关联的新冲突

真实 SQLite 的 `digital_objects.id=17`，`work_id=p211203`，归档 `manifest_url` 为：

`https://gallica.bnf.fr/iiif/ark:/12148/btv1b525104776/manifest.json`

其 `quality_note` 记录 “BnF Département des Manuscrits · Chinois 5563”，所有四张《天工开物》样本 URL 使用 **`btv1b525104776`**。

但 Stage 2F 所找到的书目研究和独立学术图示引用的是 **`btv1b52505781g`**，后者被文献说明为 BnF Chinois 5563、1637 年本，并提供 `f274`。这是**两个不同 ARK 字符串**，目前无法仅凭相同“Chinois 5563”文字判定是否属于同一数字化对象、重扫对象或错误元数据。

**结论：ARK 双对象关联 UNVERIFIED。** 不将 `btv1b525104776/f380` 自动映射为 `btv1b52505781g/f380`，也不把馆藏版本 Chinois 5564 与任何一项混合。后续需直接打开各自馆方 manifest 与书影比对。

## 5. 为什么已有自动 SUPPORTED 仍需要审核？

真实数据库 `research_evidence` 与 `research_claims` 中，六个 CID 曾为不同研究问题生成引文与支持状态。例如：
- 《工程做法》**封面** P44159:552 被检索出来供“纳米材料”“柱径玖寸”“大木”“正心”等问题使用。封面可以识别书名与藏号，**不能证明这些技术参数**。
- 《天工开物》井盐图 P211203:1096 被用于“河防一览黄河”。检索回来了一个真实书页，并不表示主题与研究问题一致。
- 《天工开物》页 380 P211203:1338 被用于“区块链技术在水经注中的应用”等异常查询；同一 ID 在证据卡中还混有 137、362 页标签。

这些系统 `SUPPORTED` 的细粒度语义是“自动回答复制了一段已索引 OCR”，**不能泛化为原始历史问题已获学术支持**。本轮没有覆盖或更改原数据库的 `research_claims.status`；在新增证据旁路中只记录“该页与问题的初步主题一致性”。

## 6. 后续 Stage 2G-P3 的最小闭合任务

1. **更正真正的馆藏链接层**：核对 Gallica 的两个 ARK 是否对应同一次数字化或同一实体版本；优先在《工程做法》`史112-0007` 第1册图像与馆方 item 4754295 中核实“112、7”标签。
2. **从 OCR 片段推进到逐字校勘**：至少选 `p168491:68` 和 `p211203:1338`，在实际 JPEG 上逐列检查文字，标记准确、错字、缺字与 OCR 误入的图像说明。即使 QA=PASS，也须单独检查。
3. **每条 CID 的历史命题 Gate**：只对可证明的狭义原文主张赋予 VERIFIED；无关检索须标注 SOURCE_MISMATCH / NOT_SUPPORTED_FOR_QUERY，而不能因为 F1 的“本页 OCR 文本记载……”被机器标记 SUPPORTED，就发布关于黄河、区块链、柱径等不相关的史学结论。
4. **保全与可重复性**：新成果继续使用 `real-db-page-links.json` 等旁路及 SHA，不写入或重修冻结 SHUGE `data/`、`CLAIM_SUPPORT_AUDIT.md`、论文正文或原图。

## 7. 附件与复核入口

- **机器证据**：[real-db-page-links.json](../projects/site-design-lab/shuge-source-crosswalk/real-db-page-links.json)；包含六个真实数据库 join、原采集 URL、六个 SHA-256、OCR QA、每张图的观察范围及 DB 文件 SHA。
- **历史基线**：[Stage 2G-P1](./STAGE2G_SCAN_ALIGNMENT_AUDIT.md) 当时未取得原图/未连接数据库的事实依然保留，不能将 P2 结果伪装为 P1 当时已经完成。
- **本地审阅副本**：`D:\CodexData\shuge-stage2g-p2-review\` 内 6 个 JPEG；他们与源库 archive bytes 哈希一致。只用于核验，源库自身未被修改。
- **再运行工具**：`scripts/stage2g_sqlite_probe.py` 的 `source_image_url` 字段已补齐，能够对真实表结构做只读验证和本地文件 SHA 检查。测试夹具继续检查不存在正确 work ID 时不能自动报 VERIFIED。

**阶段结论：原始数据库页对象和六张本地归档图像完整性已闭合；六条 OCR 字符级准确性、历史研究主张与整套馆藏扫描完全对应仍没有达到正式学术 Gate。**

## 8. Stage 2G-P2 正式发布回执与下一阶段

- [PR #24](https://github.com/conanxin/conanxin.github.io/pull/24) 已合并，SHA **`27f0ebc30a7584590537f118ecaaadbe84483001`**。
- [Pages Run 38207442742](https://github.com/conanxin/conanxin.github.io/actions/runs/38207442742) **Success**：64/64 单元测试、48/48 浏览器检查、18/18 公开阅读路径、JS 错误 0。`real-db-page-links.json` 已通过公网实际读取确认存在，并保留六张图像的记录哈希、真实页对象 ID、采集来源及每层未核状态。
- **下一步仍属研究审核工作**：Stage 2G-P3 优先比对两个 Gallica ARK 的原始馆藏关系、逐字复校《园冶》目录及《天工开物》页 380，再针对历史 claim 把自动检索 `SUPPORTED` 与真正史料支持严格区分。不得将 6/6 文件字节完整性当作 6/6 学术引文验证。

