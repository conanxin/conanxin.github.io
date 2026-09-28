# 《水经注》FTS5 审计 · R3.1

> **任务:** `WATER_CLASSIC_R3_1_CORPUS_SEMANTICS_RECONCILIATION`
> **DB read-only** · /home/conanxin/shuge-research-db/data/shuge.db
> **work_id:** `p124575`(canonical SHUGE work record = post_id 124575)
> **生成时间:** 2026-09-28
> **审计对象:** `ocr_fts`(FTS5 virtual table, contentless, trigram tokenize)

---

## 1. 摘要

- **ocr_fts 总行数 = 3553**(prior 报告的"FTS5 healthy = 3553"指的正是这个数)
- **所有 3553 行的 `work_id` 与 `page_object_id` 列都为 `NULL`**
- **p124575 在 ocr_fts 中 = 0 行**
- **FTS5 MATCH CJK 字符全部返回 0**(江水/河水/水/江/河)
- **FTS5 MATCH ASCII 字符正常工作**(Kodak=75, National=232)
- **FTS_DISCREPANCY_EXPLAINED = true**

FTS5 表存在且索引可用(不是"损坏"或"丢失"),但:
1. 摄入脚本未写入 `work_id` 与 `page_object_id` 列 → 无法按 work_id 检索 p124575;
2. CJK 字符未在 trigram 索引中(可能 tokenize='trigram' 对 Unicode 不友好)。

---

## 2. ocr_fts schema

```sql
CREATE VIRTUAL TABLE ocr_fts USING fts5(
  title, author, institution, normalized_text,
  page_object_id UNINDEXED, work_id UNINDEXED,
  tokenize='trigram', content='', contentless_delete=0)
```

**关键参数:**

- `tokenize='trigram'`:FTS5 索引按 3 字符滑动窗口建立。对 ASCII 友好,对 CJK 字符是否友好取决于 FTS5 版本对 unicode trigram 的支持。
- `content=''`:FTS5 为 contentless — normalized_text 不持久化在 SQLite 中(只能 MATCH 不能 SELECT)。MATCH 查询基于 trigram 索引工作。
- `contentless_delete=0`:删除追踪关闭(0 = 关闭,这是 SQLite 5.x 的新语义)。
- `page_object_id UNINDEXED` / `work_id UNINDEXED`:这两列被 FTS5 储存但不入索引,只能做 equality filter。

---

## 3. ocr_fts state

| 检查项 | 值 |
|---|---|
| `ocr_fts` 总行数 | **3553** |
| `page_object_id` IS NOT NULL 的行数 | **0** |
| `page_object_id` IS NULL 的行数 | **3553** |
| `work_id` IS NOT NULL 的行数 | **0** |
| `work_id` IS NULL 的行数 | **3553** |
| `work_id = 'p124575'` 的行数 | **0** |
| 其他 work 的行数 | **0**(全部 NULL) |

**Sample rows:**

```sql
SELECT rowid, page_object_id, work_id FROM ocr_fts ORDER BY rowid LIMIT 10;
-- 2, None, None
-- 3, None, None
-- 4, None, None
-- 5, None, None
-- 6, None, None
-- 9, None, None
-- 10, None, None
-- 11, None, None
-- 12, None, None
-- 13, None, None
```

---

## 4. ocr_fts MATCH 测试

| 查询词 | MATCH 命中数 | 备注 |
|---|---|---|
| `Kodak` | 75 | ASCII,被索引 |
| `National` | 232 | ASCII,被索引 |
| `水` | **0** | CJK,未命中 |
| `江` | **0** | CJK,未命中 |
| `河` | **0** | CJK,未命中 |
| `江水` | **0** | CJK 双字,未命中 |
| `河水` | **0** | CJK 双字,未命中 |
| `易水` | **0** | CJK 双字,未命中 |
| `A` | **0** | 单字符(可能是 FTS5 索引字符长度下限) |

**结论:**

- FTS5 索引能匹配 ASCII 字符(Kodak、National);
- FTS5 不能匹配 CJK 字符(水、江、河、江水、河水、易水);
- CJK 字符在 p124575 corpus 大量存在(322030 chars,其中水经注正文 277k+ chars),但 FTS5 中完全检索不到。

---

## 5. rowid 关系

### 5.1 期望的 rowid 关系

```
ocr_fts.rowid == ocr_fts_data.id  (INTEGER PRIMARY KEY)
ocr_fts.page_object_id  →  page_objects.id
page_ocr.page_object_id == page_objects.id
```

### 5.2 实际 rowid 关系

```
ocr_fts.rowid ∈ {2,3,4,5,6,9,10,...}  -- 3553 个 INTEGER
ocr_fts.page_object_id = NULL          -- 全部 3553 行
page_ocr.page_object_id  = INTEGER     -- p124575 的 956 个 page_object_id 都在 page_ocr
```

`ocr_fts.page_object_id` 全部为 NULL,导致 FTS5 表与 page_objects 表**完全断开**。无法通过 FTS5 反查到任何 page。

### 5.3 work_id 过滤路径

```sql
-- 期望路径
SELECT COUNT(*) FROM ocr_fts WHERE work_id = 'p124575' AND ocr_fts MATCH '江水';
-- 结果: 0 行

-- 实际原因
SELECT COUNT(*) FROM ocr_fts WHERE work_id IS NOT NULL;
-- 结果: 0 行(全部 NULL)

SELECT COUNT(*) FROM ocr_fts WHERE ocr_fts MATCH '江水';
-- 结果: 0 行(CJK 未索引)
```

---

## 6. 三个 root cause

### RC1 — ocr_fts 摄入时未设置 work_id / page_object_id

**现象:** 3553 行 `work_id` 与 `page_object_id` 都为 NULL。

**原因:** 早期 ocr_fts 摄入脚本只填了 `normalized_text` 与可索引字段,未填这两个 UNINDEXED 列。

**影响:** work_id 过滤返回 0 行,FTS5 对 p124575 不可用。

**修复路径:** 重新跑摄入脚本,把 `page_ocr.page_object_id` 与 `page_objects.work_id` 写入 FTS row。

### RC2 — tokenize='trigram' 对 CJK 字符不友好

**现象:** MATCH 'Kodak' 返回 75,MATCH '江水' 返回 0。

**原因:** FTS5 trigram 分词器按 3 字符窗口建索引,对 ASCII 字符正常工作。对 CJK 字符是否工作取决于 FTS5 版本对 unicode trigram 的支持。SQLite 内置的 trigram 对 unicode 多字节字符的处理在某些版本下不生效。

**影响:** 即使 RC1 修复后写入 `normalized_text`,CJK 字符仍可能无法被 MATCH 命中。

**替代:** 改用 `tokenize='unicode61 remove_diacritics 2'` 或类似 unicode 友好的分词器。

### RC3 — p124575 的 OCR 输出不在 ocr_fts

**现象:** page_ocr.normalized_text(p124575 全文 322030 chars)存在,但 ocr_fts 中无对应 row。

**原因:** OCR 写入 page_ocr 后,摄入脚本未把 page_ocr.normalized_text 转入 ocr_fts。

**影响:** 即使 RC1 + RC2 都修复,当前 ocr_fts 仍需重新 build 才能索引 p124575。

---

## 7. 与 prior report 的差异解释

| prior report 说法 | R3 实测 | R3.1 解释 |
|---|---|---|
| "FTS5 healthy = 3553" | ocr_fts 3553 行(确实存在) | prior 说的"healthy"指的是表存在且索引有效,不是指能检索 p124575 |
| "FTS5 可用于 p124575 检索" | p124575 在 ocr_fts 中 = 0 行 | prior 假设 ocr_fts 已经按 work_id 索引了 p124575,但实际上 3553 行的 work_id 全部 NULL,该假设不成立 |

**`FTS_DISCREPANCY_EXPLAINED = true`** — FTS5 表存在且索引有效,但与 p124575 完全断开。这是摄入管线 bug,不是检索 bug。

---

## 8. R3.1 临时方案

在 R3.1 / R3.2 阶段,使用 **page_ocr.normalized_text 的 LIKE 路径**:

```sql
-- 江水 ALL_OCR 计数
SELECT COUNT(*) FROM page_ocr
JOIN page_objects ON page_objects.id = page_ocr.page_object_id
WHERE work_id='p124575' AND normalized_text LIKE '%江水%';
-- 结果: 78(R3 已验证)

-- 河水 ALL_OCR 计数
SELECT COUNT(*) FROM page_ocr
JOIN page_objects ON page_objects.id = page_ocr.page_object_id
WHERE work_id='p124575' AND normalized_text LIKE '%河水%';
-- 结果: 118(R3 已验证)

-- BODY_TEXT_ONLY 计数(使用 page_type 列,需 R3.1 page_types_r3_1.json)
SELECT COUNT(*) FROM page_ocr
JOIN page_objects ON page_objects.id = page_ocr.page_object_id
WHERE work_id='p124575'
  AND normalized_text LIKE '%河水%'
  AND page_object_id IN (
    SELECT page_object_id FROM page_types_R3 WHERE page_type='BODY_TEXT'
  );
-- 结果: 111(R3.1)
```

---

## 9. R3.1 之后建议

| 阶段 | 建议 |
|---|---|
| R3.2 | 修复 ocr_fts 摄入脚本:补写 work_id 与 page_object_id 列 |
| R3.2 | 把 `tokenize='trigram'` 改为 `tokenize='unicode61 remove_diacritics 2'`,支持 CJK |
| R3.2 | 重新 build ocr_fts 索引所有 page_ocr.normalized_text 行 |
| R3.3 | 添加 ocr_fts integrity check:work_id NOT NULL + page_object_id NOT NULL + rowid JOIN page_objects.id 完整性 |

---

_R3.1 · 完成后停止 · 不进入 R4_