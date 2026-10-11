# Stage 2E — SHUGE 冻结书目与作品 ID 对照（纠错版）

> 2026-10-12 · `CONANXIN_SITE_DESIGN_STAGE2E_CONTINUATION`  
> 新增的审计层。**不覆写** v0.7 `bibliography.json`、原展厅、OCR、引文或原始图片。

## 1. 核验顺序与真正的突破

第一轮只依据三张可打开的书格公开作品页面，尚无法绑定冻结 `work_id`；随后进一步检查**同一仓库现存的** `projects/shuge-exhibition-v1.0/data/works.json`，发现该文件 `featured[]` 已经同时保留了 **post_id、title、author、dynasty_or_date、shuge_url、editions[]**。这是一组可直接追溯的**内部归档 ID→URL 映射**，证据强于题名相近或年代猜测。

| post_id | works.json 的真实标题 | works.json 的时代 | frozen bibliography.json 的年代 | 书格公开页面 |
|---|---|---|---|---|
| `168491` | **《园冶》**，计成著 | 明代 | **Northern Wei（冲突）** | [园冶](https://www.shuge.org/view/yuan_ye/) |
| `211203` | **《天工开物》**，宋应星著 | 明代 | **Song（冲突）** | [天工开物](https://www.shuge.org/view/tian_gong_kai_wu/) |
| `44159` | **《工程做法》**，清工部允礼等纂修 | 清代 | Qing（时代大体相符，仍非原件鉴定） | [工程做法](https://www.shuge.org/view/gong_cheng_zuo_fa/) |
| `124575` | **《水经注》**，汉桑钦撰、北魏郦道元注 | works.json 标记「汉代」 | **不在上述三条冻结书目内** | [水经注](https://www.shuge.org/view/shui_jing_zhu/) |

**关键纠错：P168491 并不是《水经注》，而是《园冶》。** 不得把冻结书目中的 Northern Wei 朝代字段作为该 numeric ID 的书名或版次识别依据。P211203 也是如此：作者姓「宋」不代表宋代作品，《天工开物》公开页与 works.json 均标明代。

## 2. VERIFIED / UNVERIFIED / NOT_FOUND 的三层含义

| 证据层 | 当前状态 | 严格含义 |
|---|---|---|
| v0.7 冻结三条书目字段 | **VERIFIED as snapshot** | 确实存在这些 work_id、临时 title_zh、朝代标签；**不保证标签正确**。 |
| works.json 的 post_id → title / shuge_url | **VERIFIED as archived mapping** | 内部现存数据包含直接的一对一字段对应；不等于已登录原藏机构系统、核对实物扫描。 |
| 书格当前公开作品页面 | **VERIFIED as public page** | 页面可读，作品、时代及刊印信息为网站上当前可见的陈述。 |
| 原馆目录 stable ID + 扫描书影 | **UNVERIFIED** | 尚没有完成对日本内阁文库/法国国家图书馆独立馆藏条目号、扫描页序、原刊记与本地 OCR 的一一对照。 |
| 本轮 WordPress numeric permalink 的额外直接在线查询 | **NOT_FOUND (scoped)** | 限本轮精确查询未额外获得可独立打开的 numeric permalink；不能否定 works.json 的历史 ID→URL 映射，更不能说作品不存在。 |
| v0.7 的错误时代标签作为版本凭证 | **UNVERIFIED** | 至少 P168491、P211203 与内部作品记录时代冲突，须在独立审计层标记而非静默改写。 |

**结论**：**3/3** 冻结 numeric ID 已能从仓库 `works.json` 找到作品题名及 URL；**3/3** 作品页可查；但**0/3** 完成独立的原藏机构目录 ID + 同一扫描页/版本比对。这是两个不同的研究门槛。

## 3. 版本与馆藏线索（仅记录书格网页陈述）

- P168491 → 《园冶》，计成，明崇祯七年（1634）刊本。书格页面称日本内阁文库藏；尚未取得对应该 numeric ID 的独立馆藏条目和图像校验。
- P211203 → 《天工开物》，宋应星，明崇祯十年（1637）涂绍煃刊本。书格页面称法国国家图书馆藏；还未单独核实 Gallica 稳定资源号与仓库记录对应。
- P44159 → 《工程做法》，清工部允礼等纂修，清雍正十二年（1734）武英殿刊本。书格页面称日本内阁文库藏；尚未单独取得日本国立公文书馆自己的作品条目号。
- P124575 → 《水经注》为独立另一个数字 ID，不应混用到 P168491 的冻结书目内。

上述信息以书格公开页面和已保存的 `works.json` 为依据。作品网页所陈述的「馆藏」是**线索**，并非这轮直接从原藏机构读到的馆藏证明。

## 4. 旧审计与本轮对照的职责划分

`CLAIM_SUPPORT_AUDIT.md` 检查的是**具体引用能否真正支持候选论文论断**，而非简单的作品网页是否存在。即使某 `SHUGE:p...:page` 能在一项检索运行中解析，仍须确认它指向该件正确的扫描、OCR 和语义论证。存在一份真实书格网页也不能把审核状态从 `REVIEW` 升级为 `PUBLISHED`。

另见 `projects/shuge-exhibition-v1.0/data/institution_roles_v1.0.json`：书格为数字资源展示平台，**不是**古籍的原始出版社。原研究档案中平台/出版社角色及作品时代的错配在新增审计文件说明，冻结原件不更改。

机器可读交叉对照：`projects/site-design-lab/shuge-source-crosswalk/crosswalk.json`。公开导览：`/projects/site-design-lab/shuge-source-crosswalk/`。

## 5. 下一步要取得的缺失证据

1. 以 `works.json` 的 `post_id` / `shuge_url` 为检索锚点，取得原藏机构自己的可长期访问的目录号（而非仅馆藏机构首页）、馆藏卷册索引与 IIIF / 数字图像标识。
2. 将扫描书影中的题名、序、刊记、牌记和版心页与 `editions[]` 相互比对，确定是否**同一版本与同一数字对象**。
3. 再连接 `SHUGE:p<post_id>:<page_seq>` 的实际 OCR/页序，逐条人工核对史学 claim 及其引用是否成立。
4. 新证据仍进入独立审计，不自动覆盖冻结 `bibliography.json`、`citations.json`，不改变旧 SHUGE 展厅的任何正文、图像及交互。

## 6. 内容索引范围

Stage 2E 新加的是一页 `reference` 类研究导览，不是对所有历史页面的自动收录。已有的根级文章、一级项目入口及显式批准的研究导览继续可被发现；`drafts/`、`future/`、`src/`、`source/`、`work/`、`reports/` 和历史 `shuge-exhibition-v0.*` 等即使误加 `site-index-kind` 也不能进入精选索引。本文所述的 VERIFIED 不能用于文献真伪评分。
