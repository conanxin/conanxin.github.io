# 《水经注》语料指标定义 · R3.1

> **任务:** `WATER_CLASSIC_R3_1_CORPUS_SEMANTICS_RECONCILIATION`
> **DB read-only** · /home/conanxin/shuge-research-db/data/shuge.db
> **work_id:** `p124575`(canonical SHUGE work record = post_id 124575)
> **生成时间:** 2026-09-28
> **基线:** v1.0 frozen `3a51ef5` · R1 `59d258e` · R2 `3883455b` · R2.1 `fda2ecb` · R2.2 `8a5a130` · R3 `9ce93a2`
> **上一份指标定义:** R3 全文(已存于 `WATER_CLASSIC_FULL_CORPUS_AUDIT_R3.md`,仅用 5 个粗粒度指标)

---

## 1. 为什么需要重新定义指标

R3 中,公开页面曾使用一个简化的指标体系:

- `TOTAL_PAGE_OBJECTS = 956`
- `OCR_SUCCESS = 956`
- `SEARCHABLE_PAGES = 956`(定义为 `char_count > 0`)
- `ZERO_TEXT_PAGES = 0`
- `OCR_CHARS = 302951`

这与 SHUGE 主项目文档记录的 `prior report = 933 / 23 / 322030` 出现四个不一致。R3 仅报告了 discrepancy,**没有解释**。

R3.1 的任务是:

1. 把粗粒度指标拆成 R3.1 第一节的 **12 个语义指标**;
2. 重新对全 956 页进行 **8 类页面类型** 分类(B 节);
3. 把这 4 个不一致变成 **可解释的语义差** 而非裸数字差。

---

## 2. R3.1 · 12 个语义指标

下表对每个指标给出:

- **名称**(canonical)
- **DB 字段 / 表达式**
- **当前值**
- **prior report 值**
- **差值原因**

### 2.1 corpus-level 指标(全语料级)

| # | 名称 | DB 字段 / 表达式 | 当前值 | prior | 差值 | 原因 |
|---|---|---|---|---|---|---|
| 1 | `TOTAL_PAGE_OBJECTS` | `COUNT(*) FROM page_objects WHERE work_id='p124575'` | **956** | 956 | 0 | — |
| 2 | `OCR_RUN_SUCCESS` | `COUNT(*) FROM page_ocr WHERE status='SUCCESS' AND page_object_id IN (...)` | **956** | 956 | 0 | — |
| 3 | `OCR_NONEMPTY_PAGES` | `COUNT(*) WHERE LENGTH(coalesce(raw_text,'')) > 0` | **956** | 933 | +23 | (a) |
| 4 | `RESEARCH_SEARCHABLE_PAGES` | `COUNT(*) WHERE page_type ∈ {BODY_TEXT, TABLE_OF_CONTENTS, TITLE_PAGE}` | **866** | (b) | — | (c) |
| 5 | `BODY_TEXT_PAGES` | `COUNT(*) WHERE page_type='BODY_TEXT'` | **827** | — | — | (d) |
| 6 | `TITLE_PAGE_PAGES` | `COUNT(*) WHERE page_type='TITLE_PAGE'` | **38** | — | — | — |
| 7 | `TOC_PAGES` | `COUNT(*) WHERE page_type='TABLE_OF_CONTENTS'` | **1** | — | — | — |
| 8 | `HEADER_ONLY_PAGES` | `COUNT(*) WHERE page_type='HEADER_ONLY'` | **32** | — | — | (e) |
| 9 | `BLANK_PAGES` | `COUNT(*) WHERE page_type='BLANK'` | **0** | 23 | -23 | (f) |
| 10 | `MIXED_PAGES` | `COUNT(*) WHERE page_type='MIXED'` | **0** | — | — | — |
| 11 | `UNKNOWN_PAGES` | `COUNT(*) WHERE page_type='UNKNOWN'` | **58** | — | — | — |
| 12 | `IMAGE_DECORATIVE_PAGES` | `COUNT(*) WHERE page_type='IMAGE_OR_DECORATIVE'` | **0** | — | — | — |

**注释:**

- (a) prior "searchable = 933" 是当时 OCR 跑完后,部分页 `char_count = 0` 的中间状态。R3.1 时 OCR run 10/11/12/14 已全部成功,所有 956 页都有非空 OCR text。
- (b) prior report 未拆分 `RESEARCH_SEARCHABLE` 与 `OCR_NONEMPTY`,二者被混为一谈。
- (c) `RESEARCH_SEARCHABLE = BODY_TEXT + TABLE_OF_CONTENTS + TITLE_PAGE = 827 + 1 + 38 = 866`。这是 **R3.1 新引入的语义指标**,用于区分"OCR 有字"与"页面可作研究素材"。
- (d) `BODY_TEXT` 是 R3.1 引入的精细类型(见 B 节)。
- (e) `HEADER_ONLY` = 仅含扫描头元数据(Kodak 灰卡 / 国立公文書館标签 / 番號/函號/册數),无水经注正文。这是 R3 误把"非正文页"折进 `SEARCHABLE` 的根源。
- (f) prior `23 blank` 对应的页面,在当前 DB 中 **不再为空白** — 它们已经 OCR 成功,只是内容是扫描元数据而非正文,被归入 `HEADER_ONLY` (32 页)或 `UNKNOWN` (58 页)。prior "blank" 的 23 页可能落在 `HEADER_ONLY` 的子集中,但因 R3.1 无 prior page-level map,严格意义上**不能 1-to-1 对齐**。

### 2.2 text-layer 指标(全 5 层字符统计)

| # | 名称 | DB 表达式 | 当前值 | prior | 原因 |
|---|---|---|---|---|---|
| 13 | `RAW_TEXT_CHARS` | `SUM(LENGTH(raw_text))` | **322030** | 322030 | (g) |
| 14 | `NORMALIZED_TEXT_CHARS` | `SUM(LENGTH(normalized_text))` | **322030** | 322030 | (g) |
| 15 | `READING_TEXT_CHARS` | `SUM(LENGTH(reading_text))` from `page_text_layers` | **NOT_AVAILABLE** | — | (h) |
| 16 | `CORRECTED_TEXT_CHARS` | `SUM(LENGTH(corrected_text))` from `page_text_layers` | **NOT_AVAILABLE** | — | (h) |
| 17 | `FTS_TEXT_CHARS` | `SUM(LENGTH(normalized_text)) WHERE rowid IN (SELECT rowid FROM ocr_fts WHERE page_object_id IS NOT NULL)` | **NOT_AVAILABLE** | — | (i) |

**注释:**

- (g) `raw_text` 与 `normalized_text` 对 p124575 而言 **byte-identical**(都是 322030)。这是因为当前 OCR 流程未做字符级 normalization,只做了去行/去页眉等结构性处理。prior 报告的 322030 用的就是 `SUM(LENGTH(...))`。
- 当前 R3 报告的 `302951` 来自 `SUM(char_count)` —— 而 `char_count` 列在 page_ocr schema 上没有明确定义。从差值 19079 chars 看,`char_count` 似乎过滤了某些字符(很可能是空白、特殊符号、或仅统计 CJK)。这是 schema 的列语义未定义 → 我们在 D 节做审计。
- (h) `page_text_layers` 表存在并有 `reading_text` / `corrected_text` 列,但 p124575 **没有任何 page 进入该表**(0 行)。当前 corpus 没有经过 reading-order 或人工校正,因此 `READING_TEXT_CHARS` 与 `CORRECTED_TEXT_CHARS` 标记为 `NOT_AVAILABLE`。
- (i) `ocr_fts` 是 contentless FTS5(`content=''`, `contentless_delete=0`)。FTS5 不会保留 `LENGTH(normalized_text)`,且 3553 行的 `page_object_id` 与 `work_id` 都为 `NULL` —— 因此 `FTS_TEXT_CHARS` 对 p124575 **不可计算**。

---

## 3. R3.1 · 8 个页面类型(分类法)

下表列出 R3.1 引入的 8 类页面类型,以及每类的判定规则与字符密度区间。

| 类型 | 定义 | 判定启发式 | 当前页数 |
|---|---|---|---|
| `BODY_TEXT` | 含水经注正文(江/河/過/注/又南/又東/又西/又北/故城/出其縣/會水 等强标记 ≥ 1) | strong_marker_count ≥ 1 且无 卷第/水經第/目錄 单独标识 | **827** |
| `TABLE_OF_CONTENTS` | 目录页(目錄/目次/目录 标记 + 列页号或卷次列表) | strong ≥ 3 且含目錄 | **1** |
| `TITLE_PAGE` | 卷次封面 / 章节标题页(卷第/水經第 标记,通常 char_count 200-500) | strong ≥ 3 且含卷第/水經第 | **38** |
| `SCAN_HEADER_ONLY` | 仅扫描头元数据(Kodak 灰卡、国立公文書館标签、番號/函號/册數) | strong = 0 且 archive ≥ 2 | **32** |
| `BLANK` | `char_count = 0` | cc == 0 | **0** |
| `IMAGE_OR_DECORATIVE` | 无文字 + 装饰图/印章 | (R3.1 无图指纹信号,未使用) | **0** |
| `MIXED` | 正文 + 装饰图/插图 | strong ≥ 3 且含图形信号(无信号,未使用) | **0** |
| `UNKNOWN` | 无法判定(可能 strong=0、archive<2 且 无水經) | 默认 fallback | **58** |

**判定细节**(可在 `data/water_classic_page_types_r3_1.json` 中查到每页 reason 与 confidence):

- `STRONG_MARKERS`(15 个):`又南/又西/又東/又北`、`東過/西過/南過/北過`、`注于/注之/注河/注易`、`江水`、`河水`、`易水`、`淮水`、`渭水`、`出其縣`、`故城`、`流注`、`會水`、`入于`、`經其`、`卷第/水經第`、`桑欽`、`郦道元`、`范陽`、`容城`、`故安`、`公安`、`華容`、`野王`、`修武`
- `ARCHIVE_PATTERNS`(11 个):`Kodak`、`COLORCheCkeR`、`xrite`、`National Archives`、`国立公文書館`、`内阁文庫`、`番號`、`函號`、`册數`、`架`、`Kocak`

---

## 4. R3.1 · 关键提醒

1. **`char_count > 0` ≠ `RESEARCH_SEARCHABLE`**。R3 把两者合一,导致 956 与 prior 933 冲突。R3.1 显式区分 `OCR_NONEMPTY`(956)与 `RESEARCH_SEARCHABLE`(866)。
2. **`SEARCHABLE` = 933 是历史快照,不是 ground truth**。R3.1 的 `RESEARCH_SEARCHABLE = 866` 是当前 corpus 的新基线。
3. **`ZERO_TEXT = 23` 是 prior OCR 状态**,不是 p124 当前状态。当前 `BLANK = 0`。
4. **`322030 chars` 与 prior 字节相同,但语义层不同**:prior 用 `SUM(LENGTH(normalized_text))`,R3 用 `SUM(char_count)`,R3.1 改回 `SUM(LENGTH(...))` 并标记 `char_count` 列的语义未定义(详见 D 节)。
6. **`FTS5` 不可作为当前检索路径**。p124575 在 `ocr_fts` 中无索引,仅 3553 行 ASCII 元数据被索引(详见 E 节)。

---

## 5. 一句话总结

> R3 把"OCR 是否有字"等同于"研究可读",导致 956 ≠ 933 的裸差异无法解释。
> R3.1 引入 `RESEARCH_SEARCHABLE`(866)与 `OCR_NONEMPTY`(956)的区分;
> 把 `322030 chars` 还原回 `SUM(LENGTH(normalized_text))` 的真实定义;
> 把 956 页分成 8 类,其中 827 BODY_TEXT + 38 TITLE + 1 TOC = 866 研究可读,32 HEADER_ONLY 仅扫描头元数据,58 UNKNOWN 待审。

---

_R3.1 · 完成后停止 · 不进入 R4_