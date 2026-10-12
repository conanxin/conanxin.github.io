# Stage 2F · SHUGE 原藏机构目录号、数字扫描与 Citation ID 核验

> 2026-10-12 · TASK_ID=`CONANXIN_SITE_DESIGN_STAGE2F_CONTINUATION`  
> **这是独立新增的核验证据层，不修改** `projects/shuge-exhibition-v1.0/data/`、旧研究正文、原 OCR、原扫描、Citation ID 或已发布论文状态。

## 一、结果与状态词

在 Stage 2E 已确认的三条 `post_id → title → shuge_url` 映射上，新增核实原藏机构目录、稳定馆号与数字对象。

| Gate | 当前状态 | 精确含义 |
|---|---|---|
| 作品 ID → 书格网页（Stage 2E） | VERIFIED 3/3 | 来自本仓库现存 `works.json` 对照。 |
| **原藏机构目录 / 稳定馆号候选** | **VERIFIED 3/3 书有馆方候选；共 4 个目录记录** | 可确认**目录存在**，不保证书格同一扫描已比对。 |
| 书格 PDF 与原藏扫描图像一致 | **UNVERIFIED 0/3** | 未取得逐册、逐图、版心、序跋与刊记核对完成证据。 |
| 六个冻结 Citation ID 在 `citations.json` 的运行记录 | VERIFIED 1/6 存在，NOT_FOUND 5/6（此局部数据集） | 只核对该 JSON `runs[].claims[].citation_ids`，不等于 5 个 ID 在全项目所有文件都不存在。 |
| 六个 Citation ID 的扫描页和历史论断语义 | **UNVERIFIED 0/6** | 需要原数据库 page object 与书格 OCR/原馆图像逐条绑定。 |

**原则**：`VERIFIED` 只认证本行指定的馆方目录或已保存的 ID 映射；`UNVERIFIED` 表示同一实物/扫描/论断尚未证实；`NOT_FOUND` 必须写明检查范围。

机器台账：`projects/site-design-lab/shuge-source-crosswalk/primary-catalog-audit.json`。公开阅读页：`/projects/site-design-lab/shuge-source-crosswalk/primary-catalog/`。

## 二、原藏目录与数字对象

### 1. P168491 · 《园冶》

日本**国立公文书馆数字档案／内阁文库**官方目录：

- 原馆稳定记录：**https://www.digital.archives.go.jp/file/1079110**
- 藏书号 **子076-0004**（原网站显示 `子０７６－０００４`），旧藏者为**红叶山文库**，著者计成（明）。
- 馆方书誌为 `刊本（序刊）::明崇禎:070000:`，**三卷三册**；目录列有第 0001、0002、0003 册。此机构元数据与书格所称 1634 年版、三册在大类上吻合。
- **仍 UNVERIFIED**：书格 PDF 页面是否逐张来自这一目录的三册，是否具有同样的刊记、藏印与扫描排序。
- **异本风险**：另见 [Wikimedia NAJDA 308-0023 《園冶》中](https://commons.wikimedia.org/wiki/File:NAJDA-308-0023_%E5%9C%92%E5%86%B6_%E4%B8%AD.pdf)，记录为寛政七年**写本**，不能误当成崇祯七年刊本。

### 2. P211203 · 《天工开物》

法国国家图书馆 BnF 的**自有研究专题**：[《天工开物》](https://heritage.bnf.fr/france-chine/zh-hans/tiangongkaiwu)：

- 稳定馆号 **Département des manuscrits — Chinois 5563**；BnF 认为该本的序文标明 **1637 年**。
- 稳定数字标识 **[Gallica ark:/12148/btv1b52505781g](https://gallica.bnf.fr/ark:/12148/btv1b52505781g)**，BnF 专题页直接链接该数字对象。
- 可追溯具体图像页的公开二手证据：[研究者图示 f274](https://gallica.bnf.fr/ark:/12148/btv1b52505781g/f274.item)，Brian Lander 与 Thomas David DuBois 在 [A History of Soy in China](https://books.whpress.co.uk/10.3197/63800040695086.book.pdf) 的图注中明确称此为中卷第68页油榨图；原 Gallica 图像自动访问受阻，**本轮没有亲自核对影像细节**。
- BnF 还明确说明存在**另一版本 Chinois 5564**：不能将 5563 的 ARK 随意贴到 5564 之上。
- **仍 UNVERIFIED**：书格 2026 年更新、补五张缺图并拼为对开图的 PDF 与 Gallica Chinois 5563 是否逐页完全一致；原始扫描与本地 OCR 的 `page_index` 对应关系也未恢复。

### 3. P44159 · 《工程做法》

日本原馆数字目录和馆方不同年度影像复制清单发现**两个不同索书号**：

| 索书号 | 官方记录与层级 | 独立证据 | 同书格扫描的关系 |
|---|---|---|---|
| **史112-0007** | [《工程做法73》馆方 item 4754366](https://www.digital.archives.go.jp/item/4754366)；页面显示**全76件** | [国立公文書館 2021 年数字化清单](https://www.archives.go.jp/news/pdf/20210719.pdf)列《工程做法》史112-0007 | UNVERIFIED；与书格 76 册吻合但不足以认定唯一藏本 |
| **297-0020** | [《工程做法6》馆方 item 4912863](https://www.digital.archives.go.jp/item/4912863)；册次 0006 | [国立公文書館 2022 年影像清单](https://www.archives.go.jp/news/pdf/20220713.pdf)列《工程做法》297-0020 | UNVERIFIED；不同索书号之间的藏本关系亦未证 |

**不能把以上两条合并成一套藏本，也不能直接宣布其中一条就是书格扫描的原件。** 史112-0007 的 76 件结构值得下一轮优先核对书格首卷封面、藏印、序与完整卷册数；297-0020 则需查明版式、册数及馆藏历史是否不同。

## 三、六个 Citation ID 的实际状态

冻结 `bibliography.json` 有六条候选引文；逐条对照冻结 `citations.json`（23 个 `runs` 的 `claims`）、`evidence_cards.json`、`evidence_paragraphs.json` 与 `works.json`：

| Citation ID | `citations.json` run 命中 | `evidence_cards.json` | 原扫描/语义 |
|---|---|---|---|
| `SHUGE:p168491:68` | **有**：run #5，检索题目属《园冶》，不是《梦粱录》 | 2 卡，显示局部页 8 | UNVERIFIED |
| `SHUGE:p211203:1096` | **NOT_FOUND**（仅该 JSON） | 1 卡，局部页 137 | UNVERIFIED |
| `SHUGE:p211203:1178` | **NOT_FOUND** | 1 卡，局部页 220 | UNVERIFIED |
| `SHUGE:p211203:1320` | **NOT_FOUND** | 2 卡，局部页 362 | UNVERIFIED |
| `SHUGE:p211203:1338` | **NOT_FOUND** | **6 卡**，局部页 137、362、380 | UNVERIFIED，存在混用风险 |
| `SHUGE:p44159:552` | **NOT_FOUND** | 3 卡，局部页 1 | UNVERIFIED |

其中 `works.json` 声明的扫描页数：P168491 《园冶》 **200** 页、P211203 《天工开物》 **419** 页、P44159 《工程做法》 **1456** 页。引用后缀数 `1096/1178/1320/1338` 大于《天工开物》记录的 419 页；`P168491:68` 却在卡片中标为“页8”，`P44159:552` 又标“页1”。这不是“这些书一定没有相应图像”，而是足以证明**不能把 Citation ID 的数字后缀当成 PDF 页码**；必须恢复 `page_object_id → page_index → 原扫描/IIIF` 的明确映射。

### 必须纠正的早期审计描述

原 `CLAIM_SUPPORT_AUDIT.md` 把唯一有运行命中的 `SHUGE:p168491:68` 误写成“《梦粱录》检索运行”，实际 `citations.json` 的 run #5 题目是《园冶》中相地与构造术语。本轮以**具体运行记录**修正这一描述；原文件保持冻结不变。即便 run #5 的自动 claim 标记为 `SUPPORTED`，也**不能将《园冶》文句用于支持《水经注》身份、河流范围等历史论断**。

此外，各证据卡所列 `review_status=no`，`reliability=HIGH` 或 retrieval_score 不能替代图片 OCR 的人工校勘。六条 Citation ID 的学术语义均保持 UNVERIFIED，而不是因为数据库里出现了字符串就升级 SUPPORTED。

## 四、需要继续取证（Stage 2G）

1. 确定《园冶》`子076-0004` 三册的原馆图像/IIIF 或可下载卷册页，选封面、刊记、卷一开头、卷三结尾，与书格扫描逐页比对。
2. 为 BnF Chinois 5563 获取 Gallica manifest 的实际 canvas 顺序，尤其核实 f274 所在中卷；将书格补图及拼双页后的 PDF 索引建立单独对照，不混入 Chinois 5564。
3. 《工程做法》分别取史112-0007、297-0020 的第1册题签/序/钤印样本，分辨两馆号之间关系；未确认前不能将书格版本唯一绑定其一。
4. 从本地研究数据库明确导出 `page_object_id`、`work_id`、`page_index`、`source_image_uri`、`ocr_qa_status`，并对应当前六条 Citation ID；对引文从“可解析”进入“原图逐字可核”后才评估历史论断。
5. 对冻结书目/审计旧文件实施只读保全；纠错只在新的 audit sidecar 与显式审查记录中追加。

## 五、执行界限

本阶段没有从原馆图像进行逐页目视核验，因为自动访问日本数字档案和 Gallica 曾返回 403。**直接找到官方目录条目不意味着读取了该馆网页中的每一张影像。** 机器源 `primary-catalog-audit.json` 分开存储馆方目录 VERIFIED、书格 PDF 扫描同一性 UNVERIFIED、局部检索 NOT_FOUND，不改写任何历史 JSON、原 SHUGE 网站或既有作品解释。
