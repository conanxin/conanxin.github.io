# 《水经注》UNKNOWN 页面重审 · UNKNOWN Review · R3.2

**Task**: `WATER_CLASSIC_R3_2_CORPUS_VALIDATION_GATE` (R3.2)
**Status**: COMPLETE_R3_2
**Date**: 2026-09-28
**Hard Boundaries**: NEW_OCR=0 · NEW_ACQUISITION=0 · NEW_HISTORICAL_CLAIMS=0 · DB_WRITES=0 · EMBEDDINGS=0
**R3_BASELINE_PRESERVED** (commit `9ce93a2` untouched) · **R3_1_BASELINE_PRESERVED** (commit `8326c62` untouched)

---

## 1. 目标

R3.1 的 956 页分类中,`UNKNOWN = 58` 是 R3.1 自动化分类器无法判定的兜底类别。
R3.2 把这 58 页全部打开,基于 `normalized_text` 重审一遍,只保留那些**确实无法判定**的页:

```
→ BODY_TEXT            完整历史正文
→ TITLE_PAGE           标题/分卷
→ TABLE_OF_CONTENTS    目录
→ SCAN_HEADER_ONLY     仅扫描头(国立公文書館 / 番號 / Kodak)
→ IMAGE_OR_DECORATIVE  装饰
→ MIXED                混合
→ REMAIN_UNKNOWN       仍然无法判定(将作为 RESEARCH_LEAD)
```

---

## 2. 重审规则(与 Section A 的 `classify_unknown()` 同一规则树)

```
STRONG_MARKERS = [水經, 江水, 河水, 淮水, 渭水, 澧水, 沔江, 湘江,
                  沔水, 濟水, 汝水, 泗水, 洛水, 易水, 漳水]
NOISE_MARKERS  = [Kodak, KODAK, 国立公文書館, 國立公文書館, 番號, 番号]
TITLE_MARKERS  = [卷第, 卷之一, 卷之二, 卷之三, 卷之四, 卷之五,
                  水經第, 水經卷, 水經註, 總目, 凡例, 目錄, 目次]
TOC_MARKERS    = [目錄, 目次]
RIVER_NAMES    = [江水, 河水, 淮水, 渭水, 澧水, 沔水, 濟水, 汝水,
                  泗水, 洛水, 易水, 漳水, 湘江, 沔江]
```

判定树(对 R3.1 UNKNOWN 集合):

```
if strong ≥ 1 and len ≥ 80 and (title == 0 or strong ≥ 1) and (noise < 2 or strong ≥ 1):
    → BODY_TEXT
elif title ≥ 1:
    → TITLE_PAGE
elif TOC_marker and len < 1500:
    → TABLE_OF_CONTENTS
elif strong == 0 and noise ≥ 2:
    → SCAN_HEADER_ONLY
elif len < 60 and strong == 0:
    → SCAN_HEADER_ONLY
elif 60 ≤ len < 200 and strong == 0:
    → REMAIN_UNKNOWN
elif strong == 0 and rivers == 0 and len < 400:
    → SCAN_HEADER_ONLY
elif strong ≥ 1 and len < 80:
    → REMAIN_UNKNOWN
else:
    → REMAIN_UNKNOWN
```

---

## 3. 重审结果(58 页全量)

```
BODY_TEXT              = 4   ( 6.9%)  ← R3.1 UNKNOWN 漏判,实际是正文
TITLE_PAGE             = 0   ( 0.0%)
TABLE_OF_CONTENTS      = 0   ( 0.0%)
SCAN_HEADER_ONLY       = 49  (84.5%)  ← 多为"国立公文書館"或极短正文
IMAGE_OR_DECORATIVE    = 0   ( 0.0%)
MIXED                  = 0   ( 0.0%)
REMAIN_UNKNOWN         = 5   ( 8.6%)  ← 真正待人工审
─────────────────────────────────────
UNKNOWN_REVIEWED       = 58  (100%)
UNKNOWN_REMAINING      = 5   ( 8.6%)
```

### 3.1 5 页 REMAIN_UNKNOWN 详情

| page_object_id | page_label | len | normalized_text preview(首 80 字) |
|---|---|---|---|
| 1502 | p0002 | 125 | "则是所罕到耳目之所隔天地之君骰夫子者流騰日州有九涉其八心而耳日其晰格寨廓孙而曾不越于只尺骤,以通國大都未免落厅有事乎然而绳福之子其鞋步夫男子生而桑孤蓬" |
| 2389 | p0002 | 128 | "昌吃日香府米资水出零陵都梁縣路山小經第三十八咱梁之所置也縣左右二是對峙重齐秀間可也之大水東北陵郡武罡縣南縣分都春水出武陵郡无陽縣界唐礼山盖路山之别名" |
| 1505 | p0005 | 187 | "万乙西端陽月琊王世懋撰弼皆一時于文人也之珍寰宇义一快乎吴君名君名靈里骨香千載而下文人氧吐,非方奥表章羽翼传之通邑大都足使千載而上其實之士以為遗恨而君子" |
| 1535 | p0035 | 401 | "肉五所玉楼十二其北户出承渊山又有塘城金薹宫其處有精金為天墉城向方千里城上安金臺其一角正西名日玄圃臺其一角正東名日昆益山有三角其一角正北干辰星之輝名日風" |
| 2314 | p0051 | 401 | "縣东南二十里富城洲上有道十范体精鹰自言北岸有迤洲長十餘里義熙初武烈王斯桓處中夫妻干衡山終焉不返矣縣東北十里土薹非力不食妻梁州刺史郭全女亦能安宋元嘉高尚不" |

> **共同特征**:len 125-401 字符,有部分强标记但被 OCR 噪声(繁体/简体/异体/错字)打断,导致分类器无法稳定识别为 BODY_TEXT。
> 这 5 页 R3.2 显式归类为 **RESEARCH_LEAD**,需要人工或外部证据二次确认。

### 3.2 49 页 SCAN_HEADER_ONLY 详情

代表性 sample(前 3 页):

| page_object_id | page_label | len | preview |
|---|---|---|---|
| 1592 | p0002 | 6 | "国立公文書館" |
| 1712 | p0002 | 6 | "国立公文書館" |
| 2003 | p0002 | 6 | "国立公文書館" |

> 这 49 页大部分是纯扫描头:长度 < 60 且无 strong marker,
> 实际只有"国立公文書館"或"番號:K0001"等元数据字符串。
> 全部归入 NON_EVIDENCE(不可作为历史证据)。

### 3.3 4 页 BODY_TEXT 详情

| page_object_id | page_label | len | preview |
|---|---|---|---|
| 1506 | p0006 | 108 | "搜剔於是梓正彈技观者心书成陵君惠延延江都君至白下假以月其能耿適新安太學吴君愛書志存嘉云爾第校未精交豕時混人非邢邵肆丽爾大都侈其功用典西家之宜傳盏水經一" |
| 1509 | p0009 | 223 | "此無以亨而育年壤非此無以灌溉而典毂兆非此無以胚阜萬里非此无以平醴非融絡是以寓目者其潭逝臨者其靈長且之配密雲漢會之紀戒圖书之典瑞祗寄之由之感澤象曜資之光朗" |
| 1634 | p0044 | 385 | "入白亚投松河豹聲折日三老不來奈何復欲使投巫河中有日何人也又令三第子及三老女第子豹呼婦视之以為非妙令巫人報河伯會之三老巫冢與民咸集赴觀巫姬年七十从十写河伯" |
| 2454 | p0068 | 348 | "郡枝江縣三地之南在印縣之北縣西南其一在郸縣西南皆還入江荆州海水在南明都澤在梁郡雎陽縣東北益州海水在蜀郡汶江山陽钜野縣東北大邵地在河南城縣北山陽湖睦縣南蒙" |

> 这 4 页 R3.1 漏判为 UNKNOWN,R3.2 重审后发现 strong_marker + len ≥ 80,实际是 BODY_TEXT。
> 加入 HISTORICAL_BODY_PAGES = 422 + 4 = 426。

---

## 4. 对 R3.1 UNKNOWN=58 的解读

R3.1 UNKNOWN=58 的分布:
- **84.5% 是 SCAN_HEADER_ONLY**(49 页) — 这些页的 normalized_text 几乎只有"国立公文書館"等元数据
- **8.6% 是 REMAIN_UNKNOWN**(5 页) — 真正需要人工审
- **6.9% 是 BODY_TEXT**(4 页) — R3.1 漏判

> R3.2 的 `UNKNOWN_REMAINING = 5` 严格小于 R3.1 的 `UNKNOWN = 58`,
> 因为 R3.2 把更多 SCAN_HEADER_ONLY 与少部分 BODY_TEXT 从 UNKNOWN 中分出来。

---

## 5. 与未来 R4 / R5 的衔接

- **5 页 REMAIN_UNKNOWN** 进入 R4 的 **人工审查清单**
- **49 页 SCAN_HEADER_ONLY** 在 R3.2 内显式归入 NON_EVIDENCE,未来 OCR 重跑后可能仍保持此分类
- **4 页 BODY_TEXT** 加入 HISTORICAL_BODY_PAGES(426),可作为 SUPPORTED 历史证据

---

## 6. 输出文件

- `data/water_classic_unknown_reclassification_r3_2.json`(43131 B · 58 页全量重审)

---

**R3.2 — Section B 完成。58 页 UNKNOWN 全部重审:BODY_TEXT=4 / SCAN_HEADER_ONLY=49 / REMAIN_UNKNOWN=5。无新增历史 claim。**
