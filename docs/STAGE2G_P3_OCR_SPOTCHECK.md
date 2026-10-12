# Stage 2G-P3 · 选段 OCR 对照、研究论断语义筛查与 Gallica ARK 区分

> TASK_ID=`CONANXIN_SITE_DESIGN_STAGE2G_P3_CONTINUATION` · 2026-10-12  
> 本文只是**选段 AI 辅助视觉核对与问题级证据筛查**，不是完整 OCR 逐字校勘、外部同行评审或官方馆藏同本鉴定。原 SHUGE 数据与历史 `SUPPORTED` 标记均未改写。

## 一、P2 已经解决的基础问题

Stage 2G-P2 [PR #24](https://github.com/conanxin/conanxin.github.io/pull/24) 和 [Run 38207442742](https://github.com/conanxin/conanxin.github.io/actions/runs/38207442742) 确认了**真实** `shuge.db` 中六个 Citation ID 的页对象主键、作品归属与页索引；原研究库保存的六张 JPEG 的 SHA-256 均重算一致。本次 [PR #25](https://github.com/conanxin/conanxin.github.io/pull/25) 的文档收尾也已经发布。原图库内采集记录显示 2026-09-26 HTTP 200；不是本轮重新从馆方下载。

新证据主键表见 [real-db-page-links.json](../projects/site-design-lab/shuge-source-crosswalk/real-db-page-links.json)。P3 的本轮选段结果见 [ocr-semantic-spotcheck.json](../projects/site-design-lab/shuge-source-crosswalk/ocr-semantic-spotcheck.json)。

## 二、两张图像的选段直观复核

通过用户授权的 Desktop Commander，读取之前已 SHA 校验的本地图像，同时由真实 SQLite 的 `page_ocr.normalized_text` 读取原 OCR。以下示例只校核**容易辨认的数个字串**；不宜自动批量改写数据库 OCR。

| 书、页对象 | 图像上可辨认的印刷内容 | 数据库 OCR 片段 | 观察 |
|---|---|---|---|
| 《园冶》`68`／书内 8 | **園冶目錄卷之一** | `國治目錄卷之` | 书名误识、卷序遗漏 |
| 同页 | **興造論** | `典造` | 标题误识／缺字 |
| 同页 | **相地、山林地** | `相地、山林地` | 这一**局部目录条目**匹配 |
| 《天工开物》`1338`／书内 380 | **世間魚肉** | `世間魚肉` | 短片段匹配，主题与食物保存有关 |
| 同页 | **塗抹** | `塗林` | 单字误识 |
| 同页 | **暑之中經歷旬日** | `著之中經歷句日` | 存在多个相似字形误识 |

《园冶》页 8 是卷一目录，目视可确认其包含“相地”及相邻目录项。**这只能证明章目存在**，不能直接证明“《园冶》中相地理论是什么”等章节具体主张。

《天工开物》页 380 是卷下与鱼肉保存、蒸米、发酵相关的正文，**无法支持区块链在《水经注》中的应用、太平洋、黄河河防或砖瓦工艺等不相干问题**。

注意：上述“观察”由 AI 对图像执行选段辨认；全文校勘、断句、木刻字体疑难字及版本互勘仍为 `UNVERIFIED`。两页数据库 `qa_status=NOT_CHECKED` 与这一限制一致。

## 三、为什么模型输出 SUPPORTED 不等于历史命题成立

在真实 `research_claims` 与 `research_evidence` 的原始行中，有的自动命题只声称“某页 OCR 文本记载了某些字串”；自动 `SUPPORTED` 可能是在认证**检索可返回该 OCR 片段**，而不是回答用户原研究问题。必须把“字串出现”与“足以解释历史事件、技术原理”拆开。

| 引文与运行 | 原研究问题 | 此页真实内容 | P3 选段筛查 |
|---|---|---|---|
| `p168491:68`, run #5 | 《园冶》相地与构造术语 | 卷一章目有“相地” | **仅狭义章目存在有图像证据** |
| `p211203:1096`, run #233 | 河防一览黄河 | 《天工开物》蜀省盐井图 | 主题不匹配 |
| `p211203:1178`, run #222 | 《水经注》江水 | 《天工开物》航运文字 | 来源书目不匹配 |
| `p211203:1320`, run #229 | 《天工开物》砖瓦 | 朱、丹砂、水银与色料 | 主题不匹配 |
| `p211203:1338`, run #234 | 区块链技术在《水经注》中的应用 | 食物保存／蒸饭相关 | 主题不匹配 |
| `p211203:1338`, run #229 | 《天工开物》砖瓦 | 食物保存／蒸饭相关 | 主题不匹配 |
| `p44159:552`, run #94 | 《工程做法》柱径玖寸 | 第一册封面／目录／馆藏标签 | 封面不能证明尺寸技术 |
| `p44159:552`, run #232 | 《工程做法》纳米材料 | 同上 | 封面不能证明此主题 |

**这里的主题筛查并不等于给出正式学术真假裁决。** 系统可在新的研究审计中标记 `PAGE_TOPIC_MISMATCH`、`WORK_IDENTITY_MISMATCH`、`COVER_NOT_TECHNICAL_TEXT` 等，但旧运行和引用原件保持冻结。发布成文或扩展为论文证据前仍需人工核审。

## 四、Gallica 两个 ARK：继续独立保留

官方 [BnF《天工开物》专题](https://heritage.bnf.fr/france-chine/zh-hans/tiangongkaiwu)明确说：**Chinois 5563** 为有 1637 年年款的早期刊本，**Chinois 5564** 为另一版；专题直接引向 `btv1b52505781g`。<https://gallica.bnf.fr/ark:/12148/btv1b52505781g/f1.planchecontact>

真实 SHUGE `digital_objects.id=17` 和四张 `p211203` 归档图片的 URI 则保存 `btv1b525104776`，且 `quality_note` 中同样描述 Chinois 5563。这是**两个不同的数字 ARK 标识**。

本轮尝试打开相应 Gallica manifest、OAIRecord 与页面，但网页访问被拒绝或不可用，因此**无法独立比较两个数字对象的 canvas、物理册号或版本差异**。即使本地元数据文本同称 5563，也不能自动推断两个 ARK 是同一扫描、重复采集或两版同书。下一步应对两个官方 Gallica 对象分别获取 manifest/馆藏目录和首页、序页、图版，交叉核对。BnF 的 [IIIF 文档](https://api.bnf.fr/fr/api-iiif-de-recuperation-des-images-de-gallica)说明规范路径，但不能因为 API 规则存在，就把未实际取得的 manifest 视为已获得。

## 五、该阶段的证据 Gate

- 本地历史影像与真实 SQLite 六条主键仍按 Stage 2G-P2 已验证基线；**不新增图像下载成功的声明**。
- 两页的少量易辨字串已做 AI 辅助视觉对照，发现 **4 个局部 OCR 字串错识例子**；这不是“全文人工复核 2/6”。
- **8 项选定 research run × citation 的主题相关性**完成初筛，至少若干项是不切题的来源证据，旧 `SUPPORTED` 状态不改变。
- **6 条完整 OCR 与六项历史论断的总体学术核验仍为 0/6**；三部书的整本版本同一性仍未验证。馆方文献编号、图像页对象和论断的不同验证层级继续独立管理。
- 冻结 `projects/shuge-exhibition-v1.0/data/*`、研究正文、OCR、原图和 Citation ID 全部只读，仅新增审计文件并修正交接文档的时间状态。

下阶段应取得 BnF 两个 ARK 的独立官方记录，并优先继续《园冶》页 8／《天工开物》页 380 的逐列细校，而不是再增加一套重复网页模板。
