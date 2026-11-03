# Stage 2G-P5A · 《天工开物》页 380 OCR 栏序疑点与独立文本对照

> TASK_ID=`CONANXIN_SITE_DESIGN_STAGE2G_P5A_CONTINUATION` · 2026-10-13 · 本次仅交付 P5 的可复核子阶段（P5A）。**不宣称 P5 全部学术 Gate 已完成。**

## 1. 本次新增的可复核发现

已部署的 [P2 真正 SQLite / 归档图像证据](../projects/site-design-lab/shuge-source-crosswalk/real-db-page-links.json) 显示，`SHUGE:p211203:1338` 是《天工开物》真实库中的 `page_object_id=1338`、`page_index=380`，RapidOCR 行 `1018`、数据库 QA=`NOT_CHECKED`。归档 JPEG 的 SHA-256 是 `db7422280e2a051ea2beea3cff0f5fb46d74163ee8a107b4c0dc60941cbcf838`（P2 既有校验，本次未重新获取图像）。

将 P2 保存的该页 OCR **原始摘录字符串**（不是改写后的正文），与 [维基文库《天工開物/丹曲》固定版本 oldid=460300](https://zh.wikisource.org/w/index.php?title=天工開物/丹曲&oldid=460300) 的前三段次序做最小独立文本对照：

| 锚点（两种文本都包含的精确字串） | P2 OCR 摘录字符偏移（0-based） | P2 OCR 出现次序 | 维基文库段落次序 |
|---|---:|---:|---:|
| `世間魚肉` | 135 | 3 | 1 |
| `初一蒸半生即止` | 75 | 2 | 2 |
| `汁三升` | 10 | 1 | 3 |

**三个锚点在两个文本中的顺序完全相反。** 这不只是个别 OCR 同形错字，提示竖排版面按列提取的顺序可能颠倒（假说：OCR 从左向右依次读列，而古籍正文从右向左读列）。当前仅有三个片段及外部校订文本，故标记 `REVERSED_ANCHOR_ORDER_OBSERVED`，**整页栏序错误及原因都保持 UNVERIFIED**。

本阶段没有将维基文库文字写入 SQLite，也没有以网络转录替代古籍原版。逐字符、逐栏、图像坐标校勘仍须直接复读图像。

## 2. 双 Gallica ARK 的独立证据边界未变化

- SHUGE 已存档使用 `btv1b525104776`；BnF [《天工开物》官方专题](https://heritage.bnf.fr/france-chine/zh-hans/tiangongkaiwu) 指向 `btv1b52505781g`，并描述中文 5563 与 5564 为不同版本、存在插图与装帧差异。
- [P4 已记录的六次官方 Gallica API 请求](./STAGE2G_P4_DUAL_ARK_OCR_AUDIT.md) 都是 HTTP 403，未取得两份 manifest 及 canvas。**本轮没有独立的官方 ARK 交叉馆藏记录，不能判断两个 ARK 同本或同一扫描，也不能互借 f274。**
- 当前授权的远程桌面显示离线，因此未重新运行本地 SQLite、未重新审阅归档 JPEG。P2/P4 已存记录保留原时点，不虚构本轮新增下载与人工目视核验。

## 3. 复现实验与审阅级别

新增机器旁路 `reading-order-p5a-audit.json`，记录这三个锚点、P2 原串的实际偏移、维基文库固定版本、文献身份边界、未完成 Gate。运行下述无第三方依赖工具可按现有 P2 OCR 摘录重新推导排序：

```sh
python3 scripts/stage2g_p5_anchor_order.py
python3 -m unittest discover -s tests -p 'test_stage2g_p5*.py' -v
```

该程序只读 Git 仓库内的既有公开 JSON，不访问或修改本地研究数据库。维基文库固定版本的段落顺序是**单独记录的人读对照**，不是通过程序网络爬取的“原馆版次校验”。

## 4. P5 后续必须继续完成的门槛

1. 找到 BnF 两个 ARK 的独立官方书目主键、manifest/canvas 与可比较的序页/刊记，核对相同书目号、实际重扫或不同实体版本；不能用相同题名替代馆藏身份。
2. 当授权桌面恢复在线时，用 P2 已保存的 page 380 JPEG 给每个文字列附图像坐标，确认实际阅读方向与断栏位置；再扩展到目录 page 8 及其余 Citation ID。
3. 逐条重评旧自动 `SUPPORTED` 的论断语义，例如区块链、《水经注》、黄河河防与柱径计算等，不能用错误主题书页充当原始证据。
4. 保持原始 `projects/shuge-exhibition-v1.0/data/*`、SHUGE SQLite、OCR/图像与历史原文/claim 冻结，后续仅新增并审核旁路。

**P5A 的边界**：已按既存 OCR 原串确认 3/3 锚点的次序反转，没完成整页原图布局、全文逐字校勘、两 ARK 一一关系或 6/6 学术命题认证。正式研究结论仍为 `UNVERIFIED`。
