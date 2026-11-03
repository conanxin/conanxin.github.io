# Stage 2G-P5B · 原图坐标校勘、完整 OCR 快照与 BnF 版次指纹

> TASK_ID=`CONANXIN_SITE_DESIGN_STAGE2G_P5B_CONTINUATION` · 2026-11-03  
> 基线：当前 `main=796506c78101e810d510b6d8138f74bcf10b5143`。本阶段在独立分支实施；不合并、不部署。

## 1. 这次真正重新读取了什么

通过本地 WSL CXRE 连接，直接以 SQLite `mode=ro` 和 `PRAGMA query_only=ON` 读取原库 `shuge.db`：

- 数据库 SHA-256：`4e28174734737d902ba70b83f901e44e9e8f094ce6d43521b3bb4ec7c65052a8`，与 P2 记录一致。
- 重新核验六个 Citation ID 的原图文件，6/6 实际文件 SHA-256 与 SQLite `page_objects.sha256` 一致。
- 重新读取六条 `page_ocr.normalized_text` 全文，6/6 保留 OCR 行 ID、QA 状态、全文 SHA-256、字符数、UTF-8 字节数、行数和原图来源。
- 本次没有修改数据库、原图、OCR 或原始 SHUGE 项目文件。

### P2 公共 sidecar 的截断问题

旧 `real-db-page-links.json` 对较长 OCR 只保存 150 字符摘录，实际发现：

| 页对象 | SQLite 全文字符数 | P2 摘录长度 | 是否截断 |
|---:|---:|---:|---|
| 68 | 90 | 90 | 否 |
| 1096 | 64 | 64 | 否 |
| 1178 | 206 | 150 | 是 |
| 1320 | 162 | 150 | 是 |
| 1338 | 202 | 150 | 是 |
| 552 | 106 | 106 | 否 |

新 [完整 OCR 指纹 sidecar](../projects/site-design-lab/shuge-source-crosswalk/full-ocr-p5b-audit.json) 保存六条 `normalized_text` 原样副本；旧 P2 JSON 保留历史状态，不回写覆盖。

## 2. 《天工开物》页 380：原图直接证实三个锚点的 OCR 栏序倒置

对象：`SHUGE:p211203:1338`；`page_object_id=1338`；`page_index=380`；OCR 行 1018；QA=`NOT_CHECKED`。原图 1600 × 2570，SHA-256：

`db7422280e2a051ea2beea3cff0f5fb46d74163ee8a107b4c0dc60941cbcf838`

在原始扫描图中直接查看三个竖排栏的坐标（坐标均为原图像素）：

| 原图位置 x | 图上文字 | 原 OCR 字串偏移 | OCR 行 | 
|---:|---|---:|---:|
| 约 1380–1560 | 世間魚肉 | 135 | 9 |
| 约 600–790 | 初一蒸半生即止 | 75 | 5 |
| 约 200–390 | 自然汁三升 | 7 | 2 |

原图从右向左阅读，顺序为 **世間魚肉 → 初一蒸半生即止 → 自然汁三升**；数据库 OCR 字串的顺序却为 **自然汁三升 → 初一蒸半生即止 → 世間魚肉**。因此“这三个锚点在 OCR 中被反向输出”已从 P5A 的外部文本对照假说升级为**原图坐标直接确认**。

这仍只确认三个锚点，不代表整页全部文字、所有栏的阅读顺序已完成校勘。

另在同页图像上抽查：
- `明礬水` / OCR `明磨水`
- `薄施塗抹` / OCR `薄施塗林`
- `凡造法` / OCR `无造法`
- `不拘` / OCR `不狗`
- `旬日` / OCR `句日`
- `不敢近` / OCR `不敢远`

这些都是有图像坐标的**选段差异**，仍不是全文修订。

## 3. 另外两页原图选段复核

### `SHUGE:p211203:1178` · page_index 220

原图 SHA-256：`54c6556fb97c7ba838639ad87dce95c3aa7f2a896ecc49ebe5f4486f2be19d57`；OCR 行 858，QA=`NOT_CHECKED`。

在航运正文栏直接核对：
- 图上 `候風`，OCR `侯風`；
- 图上 `靜涉過`，OCR `静淡词`；
- 图上 `鎮江`，OCR `镇汇`；
- 图上 `至錢塘`，OCR `至塘`（漏字候选）。

图文主题是《天工开物》的水路航运文字，不能用作《水经注》原文。

### `SHUGE:p211203:1320` · page_index 362

原图 SHA-256：`88a64d76300f8277dd6eb2371600617806d4d3d36d37c5aef49499f8bec1a048`；OCR 行 1000，QA=`NOT_CHECKED`。

直接核对：
- 图上 `丹青第十六卷`，OCR `册青第十六卷`；
- 图上 `離火紅而至黑`，OCR `静火紅而至黑`；
- 图上 `宗子曰斯文千古之不墜也`，OCR `宗子同斯文千古之不也`；
- `朱砂水銀銀朱原同一物` 为本轮抽查的匹配片段。

本页为朱、丹砂、水银及色料相关文字，不能直接支持砖瓦工艺论断。

14 项选段记录（含匹配项）统一保存在 [P5B visual collation JSON](../projects/site-design-lab/shuge-source-crosswalk/visual-collation-p5b-audit.json)。

## 4. BnF 双 ARK：版次证据有了新进展，但尚未证明同一册

BnF 官方 [Le Tiangong kaiwu](https://heritage.bnf.fr/france-chine/tiangong-kaiwu) 明确说明：

1. BnF 保存两种不同版本：`Chinois 5563` 与 `Chinois 5564`。
2. `Chinois 5563` 目前被视为较早版本，序文末有 1637 年日期；官方页面的文献入口指向 ARK `btv1b52505781g`。
3. `Chinois 5564` 的序文无日期，文字经过标点处理，插图重新绘制并缩小；BnF 举例说明其锚具制作图旁边的花枝消失。

EFEO 2022 年研究人员年度报告也将《天工开物》制盐图明确标为 BnF 原藏、`Chinois 5563`、ARK `btv1b52505781g`，并描述图上原书页码 140/141：[EFEO 2022 报告 PDF](https://www.efeo.fr/uploads/docs/pdf_presentation/Rapport%20annuel%202022%20des%20chercheurs.pdf)。

### 本地 ARK 104776 的新指纹

本地 SQLite `digital_objects.id=17`、`sources.id=304` 的标签为 `Chinois 5563`。本轮继续检查本地 ARK `btv1b525104776` 的锚具制作图：

- 本地图像对象：`page_object_id=1200`、`page_index=242`，SHA-256 `884595213476f1b33ea60040b3e82e70af7a2ac66efc69a087c434e337702c11`。
- 图像外侧右边缘可见花枝；相邻 `page_index=240` 的 OCR 内容属于锚具制作段落。
- 这与 BnF 对 `Chinois 5563` 的花枝特征一致，与其对 `Chinois 5564` 的“花枝消失”描述不一致。

因此，原来“两个 ARK 关系完全没有线索”的状态可以收窄为：

<badge color="success">版次特征暂时吻合</badge>

本地 ARK 104776 **暂定与 Chinois 5563 的版次特征一致**；但尚不能断言它与 BnF 官方 ARK 05781g 是同一实体册、同一次数字化或逐页同一图像。BnF 的 `f240.item` 图像端点本轮仍 HTTP 403，未能做像素级直接比对。local `f242` 与 BnF 链接 `f240` 的页序差异仅是候选定位线索，不能自动换算。

## 5. 当前 Gate

| Gate | 结果 |
|---|---|
| 六条真实 OCR 全文重新读取 | 6/6 |
| 六张本地归档图像 SHA 重核 | 6/6 |
| P2 公共 JSON 长文本截断查明 | 3/6 行 |
| page 380 三个锚点原图坐标顺序 | 已确认倒置 |
| 选段图文核对 | 14 项（含匹配项） |
| 任一整页全文人工校勘 | 0 |
| 六条历史命题学术核验 | 0/6 |
| 本地 ARK 与 Chinois 5563 的版次特征 | 暂时吻合 |
| 两个 ARK 同一实体册 / 同一扫描 | UNVERIFIED |
| 原始 SQLite / OCR / 图像是否修改 | 否 |

## 6. 下一阶段 P5C

1. 将 page 380 的每一竖列完整转录，保留列号、原图坐标、原 OCR 行、校订建议和置信度；不直接改原库。
2. 对 page 220 和 362 做同样的逐列校勘，先解决列序和 OCR 误字，再判断段落语义。
3. 继续用 BnF 书目记录、序文、藏印、装帧和锚具图等多种指纹追查 ARK 104776 与 05781g 的关系；只在取得同页原图或可核实的馆方对象映射后，才能升级同本/同扫状态。
4. 对六条旧 Citation ID 逐条重新检查原文是否真的支持对应历史命题；自动 `SUPPORTED` 不能替代史料语义审核。

**范围**：只新增完整 OCR 旁路、图像校勘审计、验证程序和文档；不覆盖原 SQLite、OCR、图像、引用、论文或冻结 SHUGE v0.7/v1.0 数据。
