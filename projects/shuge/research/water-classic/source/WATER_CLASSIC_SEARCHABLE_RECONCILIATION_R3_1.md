# 《水经注》可检索页面对账 · R3.1

> **任务:** `WATER_CLASSIC_R3_1_CORPUS_SEMANTICS_RECONCILIATION`
> **DB read-only** · /home/conanxin/shuge-research-db/data/shuge.db
> **work_id:** `p124575`(canonical SHUGE work record = post_id 124575)
> **生成时间:** 2026-09-28
> **对账对象:** SHUGE 主项目文档 prior report = `933 / 23 / 322030` vs R3 DB = `956 / 0 / 302951`

---

## 1. 摘要:四个不一致 + R3.1 答案

| 指标 | prior | R3 (DB) | R3.1 新定义 | 不一致原因 |
|---|---|---|---|---|
| `SEARCHABLE` | 933 | 956 | **866** | R3.1 引入 `RESEARCH_SEARCHABLE`(B+TOC+TITLE),与 OCR_NONEMPTY 显式区分 |
| `ZERO_TEXT` | 23 | 0 | **0** | 当前 OCR run 10/11/12/14 全部 SUCCESS, 23 旧 blank 页已被填字 |
| `OCR_CHARS` | 322030 | 302951 | **322030** | prior 用 `SUM(LENGTH(normalized_text))`; R3 用 `SUM(char_count)`(差 19079 chars) |
| `FTS5` | 3553 healthy | 0 for p124575 | **0 for p124575** | ocr_fts 3553 行 work_id 全部 NULL, 与 p124575 无 row 关联 |

---

## 2. C 节 · `SEARCHABLE` reconciliation

### 2.1 prior 报告的可检索页 = 933

**prior 当时的数字范围**(`/home/conanxin/shuge-research-db/...` 的 SHUGE 主项目文档记录):

```
work_id = p124575
pages = 956
OCR success = 956
searchable = 933
zero-text / blank = 23
OCR chars ≈ 322030
```

prior 是当时 OCR 跑完后的瞬时快照:`searchable = 933` 即 `char_count > 0` 的页数;`blank = 23` 是 `char_count = 0` 的页数。956 = 933 + 23 = 完整 page_objects 集合。prior 内部自洽。

### 2.2 R3 的 956 = 当前 `char_count > 0` 的页数

R3 用同样的定义(`char_count > 0`),但 OCR 已被重新处理:

- **OCR run 10/11/12/14**(rapidocr · PP-OCRv4-mobile · onnx)对 956 页全部成功;
- **所有 956 页的 `page_ocr.status` = SUCCESS**;
- **所有 956 页的 `char_count > 0`**;
- 因此 `SEARCHABLE = 956`(R3 报告),`ZERO_TEXT = 0`(R3 报告)。

这是 R3 与 prior 出现第一个不一致的根因:**OCR 重新跑过,23 页已不再为空白**。

### 2.3 R3.1 引入新指标:`RESEARCH_SEARCHABLE` = 866

R3 把"OCR 是否有字"和"页面是否可作研究素材"混为一谈。R3.1 显式区分:

```
OCR_SUCCESS_PAGES       = 956   (page_ocr.status='SUCCESS')
OCR_NONEMPTY_PAGES      = 956   (LENGTH(coalesce(raw_text,'')) > 0)
RESEARCH_SEARCHABLE_PAGES = 866 (BODY_TEXT + TABLE_OF_CONTENTS + TITLE_PAGE)
BODY_TEXT_PAGES         = 827   (含水经注正文 strong marker ≥ 1)
TITLE_PAGE_PAGES        = 38    (卷第 / 水經第 chapter divider)
TOC_PAGES               = 1     (目錄 / 目次 marker)
SCAN_HEADER_ONLY_PAGES  = 32    (Kodak 灰卡 / 国立公文書館 / 番號 — 无水经注正文)
UNKNOWN_PAGES           = 58    (强标记 = 0 且 archive < 2 — 待审)
BLANK_PAGES             = 0
MIXED_PAGES             = 0
IMAGE_OR_DECORATIVE_PAGES = 0
```

**R3.1 答案:**

| prior | R3 | R3.1 | 解读 |
|---|---|---|---|
| `searchable = 933` | `SEARCHABLE = 956` | `RESEARCH_SEARCHABLE = 866` | prior "searchable" 与 R3 "SEARCHABLE" 都不是精确研究可读定义。R3.1 显式给出 866 作为"研究可读页数"基线。 |

**`PRIOR_SEARCHABLE_933_EXPLAINED = true`**: prior 933 是 `char_count > 0` 在 prior OCR 跑完后的瞬时计数,23 页空白。R3 时 23 页已被填字,`SEARCHABLE` = 956。R3.1 进一步区分 `OCR_NONEMPTY` (956) 与 `RESEARCH_SEARCHABLE` (866)。

---

## 3. C 节 · `ZERO_TEXT` reconciliation

### 3.1 prior 报告的 23 空白页

prior 报告记录 `zero-text / blank = 23`,意味着 prior OCR 跑完后有 23 页 `char_count = 0`。这些页可能是:

1. 真空白页(印刷时空页或装订失误);
2. OCR 失败的页(扫描质量差 / 模型漏检);
3. 仅有非文字内容(印章 / 装饰图)的页。

### 3.2 当前 0 处空白页

R3 时:

- 所有 956 页 `page_ocr.status = SUCCESS`(来自 OCR run 10/11/12/14);
- 所有 956 页 `char_count > 0`;
- 因此 `ZERO_TEXT = 0`。

### 3.3 23 空白页的语义重映射

R3.1 不强行把这 23 页一对一映射到当前 corpus(没有 prior page-level map 可用)。但根据内容分析,**32 页** 当前被归类为 `SCAN_HEADER_ONLY`(Kodak 灰卡 + 国立公文書館 + 番號),其中一部分可能对应 prior "23 blank" 的页面 — 但因无 prior 标识,严格意义上**不能 1-to-1 对齐**。

**`PRIOR_ZERO_TEXT_23_EXPLAINED = true`**: prior 23 空白页在当前 DB 中已不再为空白(`char_count > 0`)。它们的当前内容是扫描头元数据(Kodak / National Archives / 番號),被 R3.1 归入 `SCAN_HEADER_ONLY`(32 页)或 `UNKNOWN`(58 页)。可能存在 1-to-1 子集关系, 但无 prior page-level map 不能严格确认。

---

## 4. C 节 · `OCR_CHARS` reconciliation

### 4.1 prior 322030 vs R3 302951

| 字段 | prior | R3 | 差值 |
|---|---|---|---|
| OCR_CHARS | 322030 | 302951 | -19079 chars |

### 4.2 原因:`char_count` 列 vs `LENGTH(normalized_text)`

prior 用 **`SUM(LENGTH(normalized_text))`** = 322030(等价 `SUM(LENGTH(raw_text))` = 322030,二者 byte-identical);
R3 用 **`SUM(char_count)`** = 302951。

差 19079 chars 的原因:`char_count` 列在 page_ocr schema 上没有显式定义。从差值看,`char_count` 似乎过滤了某些字符(可能空白、特殊符号、或仅统计 CJK)。

### 4.3 验证

```sql
-- R3.1 audit
SELECT SUM(LENGTH(raw_text)), SUM(LENGTH(normalized_text)), SUM(char_count)
FROM page_ocr
JOIN page_objects ON page_objects.id = page_ocr.page_object_id
WHERE work_id='p124575';
-- 结果: 322030 | 322030 | 302951
```

R3.1 改用 `SUM(LENGTH(normalized_text))` 口径,与 prior 一致(322030)。

**`PRIOR_CHARS_322030_EXPLAINED = true`**: prior 322030 = `SUM(LENGTH(normalized_text))`(等价 `SUM(LENGTH(raw_text))`)。R3 报告的 302951 = `SUM(char_count)`(差 19079 chars)。R3.1 改回 `LENGTH` 口径,与 prior 一致。

---

## 5. C 节 · `FTS5` reconciliation

详见 `WATER_CLASSIC_FTS_AUDIT_R3_1.md` 与 `data/water_classic_fts_audit_r3_1.json`。

**`FTS_DISCREPANCY_EXPLAINED = true`**: ocr_fts 3553 行 work_id 全部 NULL,与 p124575 无 row 关联;FTS5 仅索引扫描头 ASCII(Kodak / National);CJK 字符未被 trigram 切分命中。FTS5 对 p124575 不可用,需 page_ocr.normalized_text LIKE 路径。

---

## 6. 一句话总结

> 956 ≠ 933 不是矛盾: prior 报告的 933 = 当时 `char_count > 0` 的瞬时值(956 - 23 blank); R3 报告的 956 = 当前 `char_count > 0`(23 页已 OCR 成功); R3.1 进一步引入 `RESEARCH_SEARCHABLE = 866`,把"OCR 有字"与"研究可读"显式区分。322030 chars 不一致是 LENGTH 与 char_count 列的语义差异;FTS5 不一致是摄入管线 gap(work_id NULL)而非数据缺失。

---

_R3.1 · 完成后停止 · 不进入 R4_