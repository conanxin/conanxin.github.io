# Stage 2G · 原藏图像定位与 Citation ID 页对象映射审计（第一轮）

> TASK_ID=`CONANXIN_SITE_DESIGN_STAGE2G_CONTINUATION` · 2026-10-12
>
> **本轮不宣称已取得原始图像文件：原图二进制下载 0、逐张同图比对 0、已证 Citation→scan 连接 0。** 本报告记录实际可以指向的馆方图像阅览器与编号，以及必须保留的未核状态。

## 1. 基线与证据等级

- 只读原始材料：`projects/shuge-exhibition-v1.0/data/works.json`、`bibliography.json`、`citations.json`、`evidence_cards.json`、`evidence_paragraphs.json`、`CLAIM_SUPPORT_AUDIT.md`。
- 原藏目录核验及版本分歧见 [Stage 2F](./STAGE2F_PRIMARY_CATALOG_AUDIT.md)。本轮旁置机器记录 `projects/site-design-lab/shuge-source-crosswalk/scan-locator-audit.json`。
- `VERIFIED`：仅对应**指定层级**的馆方可索引目录文本、图像阅览器中的标识，或冻结数据的明确字段；不代表图像内容亲自核对过。
- `UNVERIFIED`：缺少对应原图二进制、IIIF manifest/canvas、书格扫描比对、数据库 page_object_id 或逐字论证的直接证据。
- `NOT_FOUND`：仅指本轮指定来源或冻结 JSON 中找不到**直接映射**，不能推定书画、页码、藏书不存在。

## 2. 原馆数字图像：到底取得了什么？

| SHUGE | 原藏机构与馆号 | 可追溯的数字定位 | **本轮实际取得** | 仍未证实 |
|---|---|---|---|---|
| P168491 《园冶》 | 国立公文书馆 子076-0004 | [园冶馆方目录 1079110](https://www.digital.archives.go.jp/file/1079110)：三册，序号 0001/0002/0003 | **册次与馆号的目录文字** | 三册每张图片的稳定 URL、图像字节和书格 PDF 同一性 |
| P211203 《天工开物》 | BnF Chinois 5563 | [Gallica ARK](https://gallica.bnf.fr/ark:/12148/btv1b52505781g)；[f274 原图页入口](https://gallica.bnf.fr/ark:/12148/btv1b52505781g/f274.item) | **稳定 ARK**；[研究论文脚注](https://books.whpress.co.uk/10.3197/63800040695086.book.pdf)把 f274 指为中卷第68页油榨图 | 该 manifest 的真实 canvas 列表、f274 原始像素、与书格重排 PDF 的页序等同 |
| P44159 《工程做法》 | 国立公文书馆 史112-0007 | [第23册阅览器](https://www.digital.archives.go.jp/img/4754316) 显示 22 个下载标识，如 `C103160581800`、`C103160581900`、`C103160582000`；[第32册](https://www.digital.archives.go.jp/img/4754325) 显示 37 个标识，如 `C103160611900`、`C103160612000`、`C103160612100`；[第73册](https://www.digital.archives.go.jp/img/4754366) | **索引页上的下载复选框编号、册次和阅览器 URL**，非实际 JP2 文件 | 图像字节/文件 SHA、全76册实际同一图像、是否书格同一扫描 |
| P44159 《工程做法》 | 国立公文书馆 297-0020 | [第6册馆方件目](https://www.digital.archives.go.jp/item/4912863) | **不同索书号的一条目录记录** | 与史112-0007 的藏本关系及它是否为书格原扫描 |

馆方图像阅览器虽列出下载编号，但在索引页面同时出现“館内限定閲覧”之类的访问提示；**“文件名/复选框 ID 可见”与“图像字节已经下载”是两回事。** 未将这些编号冒充已下载的 JP2 或可直接构造的 API。

## 3. 本轮扫描访问尝试及障碍

- Gallica `https://gallica.bnf.fr/iiif/ark:/12148/btv1b52505781g/manifest.json`：网络工具无法取得，已连接的授权桌面 URL 读取返回 **HTTP 403**；未取得 manifest 字节。直取 `f274/info.json` 同样未成功。
- 日本数字档案官方目录可在检索索引中取得书目信息与阅览器 URL，但从 web 工具直接请求馆方站点时遇到 **403/不可访问**；这轮未读取原图像文件，下载数量为 0。
- 原始 SHUGE JSON **没有**提供这六个引文 ID 与原馆 image/canvas 的完整 join。缺失时不可用计算差值代填 ID。

不生成未经实际打开的原图哈希，不提供伪造 IIIF manifest，不把科研论文的图像署名当成本站独立完成的目视验收。下一次有本地浏览器有效会话或从机构获取扫描时，应按 `downloaded_file_path/source_url/sha256/canvas_index/verified_by/date` 建立新证据。

## 4. Citation ID 六条真实绑定状态

对冻结 23 个 `citations.json` 研究 runs 与 `evidence_cards.json` 直接读取的标签如下：

| Citation ID | 在 `citations.json` 的 run 命中 | 证据卡局部页标签 | 说明 |
|---|---|---|---|
| `SHUGE:p168491:68` | 1 命中，《园冶》 run #5 | 8（2 次） | ID 后缀 68 与页标签 8 差 60，**无 page_object_id 连接** |
| `SHUGE:p211203:1096` | 本文件 NOT_FOUND | 137（1 次） | 后缀 1096 − 标签 137 = 959 |
| `SHUGE:p211203:1178` | 本文件 NOT_FOUND | 220（1 次） | 差值 958 |
| `SHUGE:p211203:1320` | 本文件 NOT_FOUND | 362（2 次） | 差值 958 |
| `SHUGE:p211203:1338` | 本文件 NOT_FOUND | **137（1 次）、362（2 次）、380（3 次）** | 同一 Citation ID 与三种局部页标签相关；差值 1201、976、958，**不能用统一偏移** |
| `SHUGE:p44159:552` | 本文件 NOT_FOUND | 1（3 次） | 差值 551，仍无原图映射 |

### 为何约 958 的差值值得调查，却不能用于转换

对于《天工开物》四个 ID，若**选择** `1338→380`，四对中有三对差值 958，另 `1096→137` 差值 959（可能是不同起始索引，但本轮没有证明）。`1338` 同时出现在**另外两个**不同页标签的证据卡中，这些卡的 `review_status=no`，可疑的关系不能靠平均值或“多数投票”抹去。**这个约 958 的模式只标记为 UNVERIFIED 的数学假设**，不生成原馆图像页号、真实 OCR 页号或自动引用。

说明：`p211203:1338` 的后缀 1338 大于 `works.json` 记载的《天工开物》419 张扫描页；`p44159:552` 也不能因 `552` 小于全书 1456 页就直接等同物理页序。因此目前仍是：**0/6 条引文已完成原图、OCR、页对象和历史论断的完整核验。**

## 5. 下一步可执行的取证方法（Stage 2H）

1. **图像获取**：用馆方可用图像阅览器/正式复制接口，分别取得《园冶》卷 1／2／3 一张关键封面/刊记图、《工程做法》史112-0007 和 297-0020 的题签与钤印图、《天工开物》Chinois 5563 Gallica f274 及 manifest；记录原下载 URL、实际文件 SHA-256、图像尺寸、文件序号，并核对是馆方原始来源。
2. **图像同一性**：将下载原图与书格扫描页做肉眼关键点对照（版心、藏印、缺页、破损、墨迹、行款），只有足够直接的单页或同卷比对才改变本层 `status`；部分页验证不得自动升级整册或全书。
3. **原数据库导出**：要求最小只读查询输出 `work/post_id,page_object_id,page_index,source_image_uri,ocr_qa_status`。分别处理“全局 page id”与书内 page index 两套序号；用实际 page_object_id 主键验证上述偏移假设。
4. **审查六条引文**：由 `Citation ID` 追到 `page_object_id`、原图 canvas、OCR 片段与具体 claim；先处理混用最多的 `SHUGE:p211203:1338`，再排查以《园冶》书影支持《水经注》研究背景的 `SHUGE:p168491:68`。
5. **维持不可变基线**：`projects/shuge-exhibition-v1.0/data/*`、旧 `CLAIM_SUPPORT_AUDIT.md`、原论文和扫描图片仍只读；研究结论仅写入新旁路 JSON 和报告。

**阶段评价：** Stage 2G 完成图像检索入口和编号异常调查，但没有通过“原图下载/书格图像逐张等同/引用原图语义”三个最终学术 Gate，不能称之为扫描核验已经完成。


## 6. 本地 SQLite 的最短只读核查路径

此前项目记录表明原研究库位于 `/home/conanxin/shuge-research-db/data/shuge.db`。**本轮尚未成功连接到这份真实数据库**：授权桌面设备在线，但命令执行接口返回 `Failed to get process ID`，因此没有读取任何 SQLite 行，也没有产生可以标为 VERIFIED 的原库页对象映射。

已提交可复用的 `scripts/stage2g_sqlite_probe.py`，仅执行 `SQLite mode=ro` 和 `PRAGMA query_only=ON` 的 `SELECT` 查询；从实际 `page_objects` 表辨认原字段及 `page_object_id / work_id / page_index / source_image_uri`，对六条 Citation ID 同时确认页对象主键和 `post_id` 所属关系（不因数字后缀接近局部页号就匹配）。**该探针不会编辑数据库、扫描图像、OCR 或论文。**

在可访问研究库的 WSL 环境执行一条命令：

```bash
python3 scripts/stage2g_sqlite_probe.py /home/conanxin/shuge-research-db/data/shuge.db
```

输出结构包括 `page_object_lookup`、`page_index`、`source_image_uri` 与一组仍是 `UNVERIFIED` 的原馆同图/历史论断字段。如果真实表结构缺少 ID 或 work key，就明确输出 `UNVERIFIED` 及观察到的列，不伪造映射。其结构和禁止写入的行为由 `tests/test_stage2g_sqlite_probe.py` 使用临时 SQLite 测试库覆盖；**这些测试通过也不等于已经读取原研究库**。

拿到真实只读查询结果后，在新旁路文件中审阅 `p211203:1338` 与其他五条的主键、页索引、图像 URI 是否一致，并逐张比较馆方/书格扫描。只要没有原图像字节或直接视觉对照，原扫描同一性仍为 UNVERIFIED。
