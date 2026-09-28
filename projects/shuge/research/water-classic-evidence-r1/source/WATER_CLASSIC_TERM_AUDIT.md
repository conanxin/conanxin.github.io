# WATER_CLASSIC_TERM_AUDIT

> 从 v0.7 冻结的《水经注》page previews (60 pages) 提取的真实 body OCR 关键词索引。
> Keyword: `text_preview` field after scan-header strip (Kodak / 国立公文書館 / 内閣文庫 / 漢書門 lines removed).
> v1.0 frozen baseline = `3a51ef5` (NOT modified).

---

## 1. 11 Keywords × 60 Pages (raw text_preview counts)

| Keyword | Pages With Hits | Total Hits |
|:---:|---:|---:|
| `河` | 13 | 27 |
| `水` | 45 | 225 |
| `江` | 8 | 27 |
| `渠` | 1 | 1 |
| `津` | 1 | 1 |
| `渡` | 1 | 2 |
| `城` | 25 | 61 |
| `山` | 23 | 66 |
| `谷` | 9 | 15 |
| `源` | 8 | 12 |
| `流` | 18 | 34 |

**Aggregate across 11 keywords:** 471 total hits across 152 page-keyword pairs.

---

## 2. River Region Coverage (10 regions tagged from body content)

| Region | Pages |
|---|---:|
| unclassified | 34 |
| no_body_text | 7 |
| 易水_范陽_容城 | 4 |
| 汝水_霍陽_梁 | 3 |
| 江水_公安_华容 | 3 |
| 渭水_關中 | 2 |
| 河水_野王_修武 | 2 |
| 汾水_代城 | 2 |
| 泗水_魯汶 | 1 |
| 淮水_肥水_芍陂 | 1 |
| 山陽_吴陂_荷泉 | 1 |

---

## 3. Sample Body OCR Excerpts (real page text after header strip)

### `p0003` · 江水_公安_华容

```
江水又右杨歧北山 / 江水又东得故市口 / 江水左會高口 / 又東經公安縣北 / 又東南油水从西南来注之又東右合油口 / 江水又南平郡屏陵縣之樂鄉城北 / 山抗大江山東有城故華容縣尉舊治地 / 水高水通也 / 江浦也對黄州 / 故侧江有大城相承云會城即印閣也 / 澧水及陂湖北是渊
```

### `p0004` · 河水_野王_修武

```
有二源北水上承河内野王縣東北界溝喬長明 / 陂南北二十許里東西三十里西则蔡溝人焉水 / 澤矣魏土地記日修武城西北二十里有吴澤水 / 奥滕公濟自玉門津而宿小修武者也大即吴 / 侯國亦日大修武有小故大小修武在東汉祖 / 大還卒於是也漢高帝八年封都尉魏邀為 / 武王伐勒
```

### `p0004` · 易水_范陽_容城

```
東過范陽縣南又东過容城縣南 / 更属佳觀失其一水東出金毫陂東西六七十步南 / 邃岸高深左右百步一毫参差交時超相望 / 臺陂一水經故安城西侧城南注易水灰塘崇峻 / 之故清南出屈而东轉又分為二一水东注金 / 燕都之前故也或言燕之唑斯不然矣其水 / 之古老之史籍无文以私
```

### `p0004` · 汾水_代城

```
東塘稽石侧枕汾水俗之代城城又南出一 / 雲垂煙接自是水流潭波襄轉泛又南一城 / 西温合水出右近聲流翼注水上樹交 / 時五色也後曜逐為胡王美汾水又南與東 / 非常背有銘日神服御除衆毒曜途服之隨 / 剑一口置前再拜而去以视之剑長二尺光澤 / 有二童子入跪日管王使小臣奉
```

### `p0004` · 汝水_霍陽_梁

```
日河南梁躲有靈山者世其水东北流經霍陽 / 霍陽聚汝水其北东合霍陽山水水出南山杜 / 出北山南流注之又流注于汝水汝水之右有 / 秦减东周徙其君此陂水東南流合乎潤水水 / 口水上承陽人城東睿公陂城古梁之陽人聚也 / 澤水澤水又東南入于汝水汝水又東得睿公水 / 沼錯落其
```

---

## 4. Coverage Caveats

- `渠` / `津` / `渡` 仅出现于 1 page each (single occurrence in current 60-page corpus).
- `34 pages` are tagged `unclassified` because their extracted body text did not match any of the 9 region hint patterns.
- All 60 pages still carry `ocr_status: "QUEUED"` — full-page OCR was NOT run during R1.

---

*End of WATER_CLASSIC_TERM_AUDIT.md*
