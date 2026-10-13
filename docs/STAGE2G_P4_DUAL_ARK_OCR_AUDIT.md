# Stage 2G-P4 · 两份 Gallica ARK 的来源核查与《天工开物》选段 OCR 对照

> TASK_ID=`CONANXIN_SITE_DESIGN_STAGE2G_P4_CONTINUATION` · 2026-10-13
>
> **研究状态：馆方两个数字 ARK 的同本/同扫描关系仍未证实；仅新增两页中六组 AI 辅助 OCR 错识观察，不是全文校勘。**

## 一、为什么不能合并两个 Gallica ARK

Stage 2G-P2 已从真实 WSL SQLite 直接核验六个 Citation ID 的主键、书内 `page_index`、原存档 JPEG 的 SHA-256。Stage 2G-P3 又选择两页进行部分 OCR 核验。本轮继续追查另一个重要问题：本地 SHUGE 研究库使用的 ARK 与 BnF 专题链接不同。

| 来源 | Gallica ARK | 可实际确认的范围 |
|---|---|---|
| SHUGE 原 SQLite `digital_objects.id=17`、`sources.id=304` | **`btv1b525104776`** | 数据库的归档 manifest URL、来源归一化、419 条 acquisition 记录；本地 `page_count` 记为 422 |
| BnF [《天工开物》官方专题](https://heritage.bnf.fr/france-chine/zh-hans/tiangongkaiwu) | **`btv1b52505781g`** | BnF 将中文 5563 描述为有 1637 年序文的版本，专题文献入口指向此 ARK |

对真实数据库的四张表执行只读 `LIKE` 查询，结果如下：

| 检查表 | 本地 ARK `104776` | BnF 专题 ARK `05781g` |
|---|---:|---:|
| `digital_objects` | 1 | 0 |
| `sources` | 1 | 0 |
| `source_normalizations` | 1 | 0 |
| `acquisitions` | **419** | 0 |

这能证明：**现有 SHUGE 本地图像采集批次采用 `104776`，没有将 `05781g` 存入上述四类字段。** 不能证明 BnF 另一个数字对象不存在，更不能凭两个记录都写“Chinois 5563”就认定二者是同一套扫描。

我按照 [BnF 官方 Gallica Document API](https://api.bnf.fr/fr/api-document-de-gallica) 和 [IIIF API](https://api.bnf.fr/fr/api-iiif-de-recuperation-des-images-de-gallica) 分别请求两个 ARK 的 `manifest.json`、`OAIRecord`、`Pagination`，合计 **6 次，均为 HTTP 403**，没有取到 manifest、OAI XML 或画布顺序。因此：

- ARK→具体馆藏版本一一关系：**UNVERIFIED**；
- 两个 ARK 对应同一次数字化或同一实体藏本：**UNVERIFIED**；
- 把 `btv1b52505781g/f274` 映射到 `btv1b525104776/f274`：**禁止自动推断**。

## 二、真实 SQLite OCR 文本与局部原图对照

本轮在用户授权 WSL 上使用 `mode=ro`、`PRAGMA query_only=ON`，直接读取 `page_ocr` 中 page object 1178 / 1320 的 `normalized_text`，并保存完整文本 SHA-256。只读取现存的、P2 已校验归档哈希的两张 JPEG；没有重新下载、没有修改原库。

| 页对象 / 书内页索引 | 原图可辨文字 | 原库 OCR 字串 | 观察 |
|---|---|---|---|
| `1178` / 220 | 鎮江 | 镇汇 | “江”错作“汇”，繁简差异另计 |
| 同页 | 候風靜涉過 | 侯風静淡词 | 多个相近字误识 |
| 同页 | 至錢塘 | 至塘 | 漏识“錢” |
| `1320` / 362 | 丹青第十六卷 | 册青第十六卷 | 卷章题“丹”误作“册” |
| 同页 | 離火紅而至黑 | 静火紅而至黑 | “離”误作“静” |
| 同页 | 宗子曰斯文千古之不墜也 | 宗子同斯文千古之不也 | 错字、漏字 |

还记录两处短语相符的对照：`而不經也`、`朱砂水銀銀朱原同一物`。**共八组选段，六组发现差异**，仅限图像局部的 AI 辅助字形观察，疑难字、标点、全部页行与其学术解释仍未正式校勘。

来源指纹：
- `p211203:1178`：OCR id=858，文本 SHA-256 `840746110c90ab4f4f51312420d7290f5404323a54f94f4762194519d4bad8ca`。
- `p211203:1320`：OCR id=1000，文本 SHA-256 `6cea5673ad307bfe96d031420026a75bc7a9718a9d954916f13cee41950a8ee0`。
- 源图 SHA 来自 [Stage 2G-P2 真实 SQLite 与六张图像记录](../projects/site-design-lab/shuge-source-crosswalk/real-db-page-links.json)。

精确文字、图片 SHA、页索引、访问尝试与不同 ARK 查询范围均见 [ark-ocr-p4-audit.json](../projects/site-design-lab/shuge-source-crosswalk/ark-ocr-p4-audit.json)。这个旁路由 CI 对 OCR 文本哈希与旧 P2 页对象关系进行回归核验；**未将选段修改回原 OCR**。

## 三、已推进与未完成的 Gate

| 证据层级 | 当前 |
|---|---|
| 两份 Gallica ARK 来源的明确分离 | VERIFIED as records |
| 本地数字对象及 419 条采集记录来自哪个 ARK | VERIFIED as local DB |
| 两个 ARK 同版、同册、同一扫描 | **UNVERIFIED** |
| page 1178/1320 的原库 OCR 文本及 SHA | VERIFIED as local DB |
| 两张页的选段图文对照 | AI 辅助观察，8 组 / 6 组差异 |
| 两页全文人工校勘 | **0/2** |
| 六条 Citation ID 相关历史论断学术审核 | **0/6** |

Stage 2G-P5 应从 BnF 可以授权查阅的不同官方记录渠道取得两个 ARK 的书目主键、原馆卷册/页序、数字图像首页或序页，优先确认 `104776` 与 `05781g` 的真实关系。若官方源暂仍无法访问，应继续对已存档的六张页图进行有坐标的 OCR 修订建议，并针对特定论断做狭义原文审核，而不是继续把自动 `SUPPORTED` 作为历史结论。

**保护边界**：本阶段只新增旁路研究 JSON、审计文档及测试，保留既有 SHUGE `data/`、原始数据库、图像、OCR、引用与研究正文全部原样。


## 四、正式部署回执与 Stage 2G-P5 起点

- [PR #35](https://github.com/conanxin/conanxin.github.io/pull/35) 已合并，SHA `b517c613cbde9a6a829659d7a0d319ab43008dfe`。
- [GitHub Pages Run 38396870349](https://github.com/conanxin/conanxin.github.io/actions/runs/38396870349) **Success**：99/99 Python 单元测试、50/50 Playwright 浏览器检查、19/19 公网路径、JavaScript 错误 0。
- 正式公开的 [机器审计 JSON](https://conanxin.github.io/projects/site-design-lab/shuge-source-crosswalk/ark-ocr-p4-audit.json) 已通过授权设备读取并核对：两个 ARK 未核同本、6/6 BnF 接口 HTTP 403、本地来源记录 `1/1/1/419` 对比 `0/0/0/0`、两页 8 组选段其中 6 组疑似错字、全文 OCR 与论文语义均保持 UNVERIFIED。
- **下一步 Stage 2G-P5**：争取 BnF 两份 ARK 的独立官方书目 ID/manifest/canvas 与图像样本；如仍有访问限制，集中处理已存档影像的逐列带位置文本校勘，确保每条学术论断能够回溯到经过验证的原文，而不是自动 `SUPPORTED` 标签。不得覆盖冻结 SHUGE 原库和历史侧写。
