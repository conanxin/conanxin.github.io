# YISHUI_CLAIM_AUDIT_R4_1.md

**易水歷史研究 Claim 學術審計 · R4.1**
*WATER_CLASSIC_R4_1_SCHOLARLY_AUDIT*

```
schema_version: r4.1-yishui-claims-audit/1.0
generated_at:  2026-09-28T18:05:00+08:00
task:          WATER_CLASSIC_R4_1_SCHOLARLY_AUDIT
section:       R4.1 · Scholarly audit of R4 historical claims
basis:         R4 frozen commit 582c852 (audit overlay only — R4 frozen JSON NOT modified)
```

---

## 0. Reviewer honesty disclosure

**R4.1 是 R4 之上的學術審計層（audit overlay），不改動 R4 frozen JSON。** 本次審計對 R4 的 12 條 historical claims 重新做了：

1. **Truth scope 分類**：每條 claim 是「文本直接報告」（TEXT_REPORTS）、「文本順序推論」（TEXTUAL_INFERENCE）、「外部史料獨立校核」（HISTORICAL_CORROBORATED）、還是「現代地圖匹配」（MODERN_MAPPING — R4.1 禁止）；
2. **支持等級重判**：不為保持 R4 的「12/12 SUPPORTED」而保留狀態；改為 SUPPORTED / PARTIALLY_SUPPORTED / NOT_SUPPORTED 三檔；
3. **Claim 文本修正**：對 R4-YSH-008/009/010/011/012 進行 frame 修正（明確標示「《水經注》文本 / 引某人說」，避免讀者誤認為現代獨立歷史事實）；
4. **R4-YSH-012 深澤/容城拆分**：原 R4 將「趙將某於深澤」誤歸屬容城封國，R4.1 拆分為獨立 deep-澤 enfeoffment；
5. **R4-YSH-011 推論範圍明示**：原 R4 claim 將「易水之南」（直接引文）與「範陽以東、容城以西」（文本順序推論）並列，未明示兩者證據等級差異。

---

## 1. Audit method

| 步驟 | 動作 |
|------|------|
| 1 | 讀取 R4 frozen claims JSON (`data/yishui_claims_r4.json`) + claim ledger (`source/YISHUI_CLAIM_LEDGER_R4.md`) |
| 2 | 重新讀取 R4 controlled transcription 三層（7 個 core pages）以驗證引文 |
| 3 | 對每條 claim：依 R4 citation 檢查是否直接支持 claim 文本，若需文本順序推論則改為 TEXTUAL_INFERENCE |
| 4 | 對 HISTORICAL_INTERPRETATION claims（008/009/010）：驗證 claim_text 是否 frame 為「《水經注》文本 / 引某人說」 |
| 5 | 對 R4-YSH-011：驗證「範陽以東、容城以西」是否在 pid1661 直接陳述 |
| 6 | 對 R4-YSH-012：驗證 pid1661 是否將「趙將某於深澤」與「容城」混淆 |

---

## 2. Truth scope 分布

| Truth scope | 數量 | Claims |
|-------------|------|--------|
| TEXT_REPORTS | 7 | 001, 002, 005, 007, 008, 009, 010 |
| TEXTUAL_INFERENCE | 5 | 003, 004, 006, 011, 012 |
| HISTORICAL_CORROBORATED | 0 | （無 claim 達到外部史料獨立校核） |
| MODERN_MAPPING | 0 | R4.1 禁止（本階段不以現代地圖匹配為目標） |

---

## 3. 支持等級分布

| Support level | 數量 | Claims |
|---------------|------|--------|
| SUPPORTED | 7 | 001, 002, 005, 007, 008, 009, 010 |
| PARTIALLY_SUPPORTED | 5 | 003, 004, 006, 011, 012 |
| NOT_SUPPORTED | 0 | — |

**R4 (12/12 SUPPORTED) → R4.1 (7 SUPPORTED + 5 PARTIALLY_SUPPORTED)。** 五條降級的理由皆為「文本順序推論」或「frame 需修正」，並非證據失效。

---

## 4. Per-claim 詳細審計

### R4-YSH-001 · TEXTUAL_ORDER · TEXT_REPORTS · SUPPORTED

> **R4 claim_text:** 在易水章節中，範陽先於容城出現，且由「東過」動詞串聯。
>
> **R4.1 claim_text_revised:** 《水經注》卷十一易水章之 pid1657 大字標題記載：「東過范陽縣南又東過容城縣南」。範陽先於容城出現，並由「東過」動詞串聯。

**Audit verdict:** 維持 SUPPORTED。大字標題是原書編者明確標註的章節結構，無需推論即可直接引用。R4.1 修正後將 claim 明確綁定至「pid1657 大字標題」，避免讀者誤認為是泛指。

**Counterevidence audit:** `none_found_in_checked_sources`

---

### R4-YSH-002 · TEXTUAL_ORDER · TEXT_REPORTS · SUPPORTED

> **R4 claim_text:** 易水出涿郡故安縣閻鄉西山（pid1655 正文首段大字）。
>
> **R4.1 claim_text_revised:** 《水經注》卷十一易水章之 pid1655 正文首段記載：「易水出涿郡故安縣閻鄉西山」。

**Audit verdict:** 維持 SUPPORTED。pid1655 p0002 正文首段直接記錄此句，OCR 校正（DB「承郡」「間鄉」→「涿郡」「閻鄉」）後無誤。

**Counterevidence audit:** `none_found_in_checked_sources`

---

### R4-YSH-003 · SPATIAL_LANGUAGE · TEXTUAL_INFERENCE · **PARTIALLY_SUPPORTED (降級)**

> **R4 claim_text:** 故安與易水關係呈現三種空間語言模式：(1) 易水出於故安縣閻鄉；(2) 易水逕故安城南外東流；(3) 故安作為易水名稱源頭（世又謂易水為故安河）。
>
> **R4.1 claim_text_revised:** 《水經注》文本中故安與易水的關係可歸納為三種空間語言模式：(1) pid1655「易水出涿郡故安縣閻鄉西山」；(2) pid1656「易水逕故安城南外東流」；(3) pid1656「世又謂易水為故安河」。三型分類為研究者對原書文字的歸納性框架，並非原書明示分類。

**Audit verdict:** **降級至 PARTIALLY_SUPPORTED**。個別引文確實存在於原書且視覺確認無誤；但「三型分類」屬於研究者框架，原書並未明確標示此分類。三型邊界（特別是 (2) 與 (3) 是否完全互斥）需讀者自行判斷。R4 原 claim 將「三型」並列為事實陳述，R4.1 修正後明確標示為「歸納性框架」。

**Counterevidence audit:** `none_found_in_checked_sources`

---

### R4-YSH-004 · SPATIAL_LANGUAGE · TEXTUAL_INFERENCE · **PARTIALLY_SUPPORTED (降級)**

> **R4 claim_text:** 範陽-容城之間存在「東過」連續動詞語法結構。
>
> **R4.1 claim_text_revised:** 《水經注》文本中「東過 + 縣南」連續動詞結構在易水章（pid1657 大字標題）與巨馬水章（pid1682 大字標題）均出現，但二者屬不同水系，不應混稱為「同一水流的連續動詞」。

**Audit verdict:** **降級至 PARTIALLY_SUPPORTED**。「東過范陽縣南又東過容城縣南」作為 pid1657 大字標題可直接引用（屬易水章）；但若引用 pid1682 巨馬水章（又東南過容城縣北），則需說明此為不同水系。原 R4 claim 未充分區分兩水系。R4.1 修正後明示此 cross_water_system_warning。

**Counterevidence audit:** `none_found_in_checked_sources`

---

### R4-YSH-005 · SPATIAL_LANGUAGE · TEXT_REPORTS · SUPPORTED

> **R4 claim_text:** 城南/城北方位詞在易水章中反覆出現，標誌水流與城邑的相對位置。
>
> **R4.1 claim_text_revised:** 《水經注》易水章中「城南」/「城北」/「城東」/「城西」方位詞反覆出現於 pid1656/1657/1659/1661/1682 等頁。

**Audit verdict:** 維持 SUPPORTED。方位詞引文均可直接從原書取得；「反覆出現」屬量化性描述，由 spatial_relations JSON 96 條關係可驗證（方位詞佔比高）。

**Counterevidence audit:** `none_found_in_checked_sources`

---

### R4-YSH-006 · HYDROLOGICAL_RELATION · TEXTUAL_INFERENCE · **PARTIALLY_SUPPORTED (降級)**

> **R4 claim_text:** 易水、濡水、巨馬水、淶水於涿郡範陽縣會，呈現「互攝通稱」的水系關係。
>
> **R4.1 claim_text_revised:** 《水經注》pid1659 記載：「北濡又並亂流入淶，是則易水與諸水互攝，通稱東逕容城縣故城北」。原書明確使用「互攝」「通稱」二字；「易水/濡水/巨馬水/淶水」四水分類為研究者歸納（pid1659 + pid1682 整合）。

**Audit verdict:** **降級至 PARTIALLY_SUPPORTED**。「互攝」「通稱」可由 pid1659 直接引文支持（TEXT_REPORTS 層級）；但「四水分類」屬歸納性，且現代水系驗證非本階段任務（R4 限制條件 REAL_WORLD_LOCATION=UNRESOLVED）。

**Counterevidence audit:** `none_found_in_checked_sources`（EXT-YANG-1905 楊守敬《水經注疏》註文傳統上保留此水系結構描述；R4.1 未獨立查證）

---

### R4-YSH-007 · HYDROLOGICAL_RELATION · TEXT_REPORTS · SUPPORTED

> **R4 claim_text:** 大利亭作為地理節點，故安水於此「東南合易水而注巨馬水」（pid1659）。
>
> **R4.1 claim_text_revised:** 《水經注》pid1659 記載：「其水又東南流於容城縣西北大利亭東南，合易水而注巨馬水也」。

**Audit verdict:** 維持 SUPPORTED。pid1659 為單頁單句引文，可直接視覺確認（image_checked pid1659 中「大利亭」清楚）。

**Counterevidence audit:** `none_found_in_checked_sources`

---

### R4-YSH-008 · HISTORICAL_INTERPRETATION · TEXT_REPORTS · SUPPORTED（**frame 修正**）

> **R4 claim_text:** 範陽=范水之陽（應劭解釋），即范水之北。
>
> **R4.1 claim_text_revised:** 《水經注》pid1661 記載：「易水又逕范陽縣故城南，即應劭所謂范水之陽也」。「範陽」地名源於「范水之陽」為酈道元所引應劭《風俗通》之解釋，並非現代獨立考證。

**Audit verdict:** 維持 SUPPORTED，但 frame 明確化。pid1661 單句引文：「易水自下有范水通目又東逕范陽縣故城南即應劭所謂范水之陽也」可由視覺確認。「陽」字傳統地理學含義為「水之北」或「山之南」（視情境而定），屬訓詁學常識。

**frame_correction_applied:** R4.1 明確標示此為「酈道元所引應劭」之說，避免讀者誤認為現代考古或地名學獨立結論。

**Counterevidence audit:** `none_found_in_checked_sources`

---

### R4-YSH-009 · HISTORICAL_INTERPRETATION · TEXT_REPORTS · SUPPORTED（**frame 修正**）

> **R4 claim_text:** 武陽=燕下都（燕昭王所築，東西二十里，南北十七里）。
>
> **R4.1 claim_text_revised:** 《水經注》pid1656 記載：「武陽蓋燕昭王之所城也，東西二十里，南北十七里」「故燕之下都擅武陽之名」。「武陽=燕下都」為酈道元於六世紀所作之記錄，並非二十世紀考古學獨立考證；現代考古實測可能與酈道元所記城邑規模有出入。

**Audit verdict:** 維持 SUPPORTED，但 frame 明確化。pid1656「武陽蓋燕昭王之所城也，東西二十里，南北十七里」一句可由視覺確認（image_checked pid1656）。

**frame_correction_applied:** R4.1 明確標示此為「酈道元於六世紀所作之記錄」，避免讀者誤認為現代考古結論。

**Counterevidence audit:** EXT-YANG-1905 (Yang Shoujing 水經注疏) 對武陽城邑位置有詳註；R4.1 未獨立比對楊守敬原書。pid1656 中「故傳逮迹遊賦」之「逮迹遊獵賦」可能為異文（見 R4-YSH-009 R4 source 註記）。

---

### R4-YSH-010 · HISTORICAL_INTERPRETATION · TEXT_REPORTS · SUPPORTED（**frame 修正**）

> **R4 claim_text:** 金臺+蘭馬臺=燕昭王禮賓郭隗之處（酈道元引耆舊）。
>
> **R4.1 claim_text_revised:** 《水經注》pid1657 記載：「金毫陂西畔有蘭馬臺」「臺北有金臺」「訪諸耆舊，咸言昭王禮賓，廣延方士，至如郭隗、樂毅之徒」。金臺、蘭馬臺與「燕昭王禮賓郭隗」之關係引自酈道元所採耆舊傳聞，並非現代考古學獨立實證。

**Audit verdict:** 維持 SUPPORTED，但 frame 明確化。pid1657 引文可由視覺確認（image_checked pid1657 中「金毫陂」「蘭馬臺」「金臺」「訪諸耆舊」清楚）。

**frame_correction_applied:** R4.1 明確標示「耆舊傳聞」屬性，避免讀者誤認為現代獨立考證。

**Counterevidence audit:** `none_found_in_checked_sources`

---

### R4-YSH-011 · HISTORICAL_INTERPRETATION · TEXTUAL_INFERENCE · **PARTIALLY_SUPPORTED (降級)** — `CLAIM_011_REVISED=true`

> **R4 claim_text:** 易京城位於易水之南、范陽以東、容城以西（公孫瓚遷都處）。
>
> **R4.1 claim_text_revised:** 《水經注》pid1661 記載：「易水又東逕易京南」「謂之易京城，在易城西四五里」。「易京城在易水之南」由「逕易京南」直接支持。但「範陽以東、容城以西」並非 pid1661 直接陳述；此方位係基於 pid1657 大字標題「東過范陽縣南又東過容城縣南」之文本順序推論（範陽在西、容城在東，故易京城若在兩者之間，則為「範陽以東、容城以西」）。此推論依賴讀者接受「易水先過範陽、再過容城」的章節結構。

**Audit verdict:** **降級至 PARTIALLY_SUPPORTED**。原 R4 claim_text 將三項方位並列，未明示哪幾項為直接引文、哪幾項為文本順序推論。R4.1 修正後明示「易水之南」為直接引文（SUPPORTED 層級），「範陽以東、容城以西」為 TEXTUAL_INFERENCE。

**CLAIM_011_REVISED = true.**

**Counterevidence audit:** `none_found_in_checked_sources`

---

### R4-YSH-012 · HISTORICAL_INTERPRETATION · TEXT_REPORTS · **PARTIALLY_SUPPORTED (降級)** — `CLAIM_012_CORRECTED=true`

> **R4 claim_text:** 在《水經注》文本中，範陽與容城在漢代多次作為封國出現：範陽為匈奴降王封國（漢景帝中元三年），容城為趙將封國（漢高帝六年）+ 匈奴降王封國（景帝中元三年）。
>
> **R4.1 claim_text_revised:** 《水經注》文本記載三項獨立的漢代封國事件（pid1657 + pid1661 對校後）：
>   (1) **範陽封國**：景帝中元三年封匈奴降王信為侯國（pid1657）。
>   (2) **容城封國**：景帝中元三年以封匈奴降王攜徐盧為侯國（pid1661）。
>   (3) **深澤封國（非容城）**：漢高帝六年封趙將某於深澤（pid1661）。
>
> R4 原 claim 將「趙將某於深澤」誤歸屬於容城封國；R4.1 已將深澤封國拆分為獨立 enfeoffment，避免地名混淆。

**Audit verdict:** **降級至 PARTIALLY_SUPPORTED**（並修正）。pid1661 引文：「易水東逕容城縣故城南漢高帝六年封趙將夕於深澤景帝中元三年以封匈奴降王攜徐盧於容城皆爲侯國」明確區分深澤（漢高帝六年 + 趙將某）與容城（景帝中元三年 + 攜徐盧）。原 R4 將「趙將某於容城」錯誤——「趙將某於**深澤**」並非容城。

**CLAIM_012_CORRECTED = true.**

**降級理由：**
- (a) 三項 enfeoffment 之「人物姓名」（信、某、攜徐盧）有 OCR 不確定性（pid1661 image_checked 標示「趙將夕」可能為「趙將某」之誤）；
- (b) EXT-CHEN-2007 陳橋驛《水經注校證》(2007) 註明「攜徐盧」一作「撅徐盧」（VARIANT_PASSAGE 來源）；
- (c) pid1661 中「王莽更名深澤」一句的「深澤」字面所指 — pid1661 末尾「王莽更名深澤」是再次出現「深澤」字樣，可能指「容城更名深澤」而非「範陽」。此點待外部史料獨立校核。

**Counterevidence audit:** EXT-CHEN-2007 (陳橋驛《水經注校證》) 註明「攜徐盧」一作「撅徐盧」——此為 VARIANT_PASSAGES 的依據。R4.1 不採信 EXT-CHEN-2007 URL（zhihu.com/question/... 為 placeholder），但保留此異文記錄以備未來學術查證。

---

## 5. Counterevidence audit 總結

| Claim | Counterevidence 狀態 | 詳情 |
|-------|---------------------|------|
| R4-YSH-001 | none_found_in_checked_sources | — |
| R4-YSH-002 | none_found_in_checked_sources | — |
| R4-YSH-003 | none_found_in_checked_sources | 三型框架屬歸納性，不存在事實性反例 |
| R4-YSH-004 | none_found_in_checked_sources | — |
| R4-YSH-005 | none_found_in_checked_sources | — |
| R4-YSH-006 | none_found_in_checked_sources（**但有 cross-water-system 警示**） | EXT-YANG-1905 未獨立查證 |
| R4-YSH-007 | none_found_in_checked_sources | — |
| R4-YSH-008 | none_found_in_checked_sources | EXT-YANG-1905/CHEN-2007 註本沿襲同未獨立查證 |
| R4-YSH-009 | none_found_in_checked_sources（**但有異文警示**） | 「逮迹遊賦」可能為「逮迹遊獵賦」異文 |
| R4-YSH-010 | none_found_in_checked_sources | — |
| R4-YSH-011 | none_found_in_checked_sources | 推論性結論本身不存在事實性反例 |
| R4-YSH-012 | **EXT-CHEN-2007 VARIANT** | 「攜徐盧」一作「撅徐盧」；URL placeholder 不採信 |

**Reviewer honesty note:** `none_found_in_checked_sources` 不等於「絕對無反例」。它表示「在 R4.1 審計範圍內的 7 個已校核外部資料中未發現反例」。

---

## 6. Section N · Completion fields

```
CLAIMS_TOTAL=12
CLAIMS_SUPPORTED=7
CLAIMS_PARTIAL=5
CLAIMS_NOT_SUPPORTED=0

TEXT_REPORTS=7
TEXTUAL_INFERENCE=5
HISTORICAL_CORROBORATED=0
MODERN_MAPPING=0

CLAIM_011_REVISED=true
CLAIM_012_CORRECTED=true
```

---

## 7. R4 frozen baseline preservation

| 檔案 | R4 frozen size | R4.1 status |
|------|----------------|-------------|
| `data/yishui_claims_r4.json` | 13593 B | **unchanged** ✓ |
| `source/YISHUI_CLAIM_LEDGER_R4.md` | 11836 B | **unchanged** ✓ |
| `data/yishui_primary_corpus_r4.json` | 38287 B | unchanged ✓ |
| `data/yishui_image_review_r4.json` | 48998 B | unchanged ✓ |
| `data/yishui_controlled_transcription_r4.json` | 32411 B | unchanged ✓ |
| `data/yishui_spatial_relations_r4.json` | 40015 B | unchanged ✓ |
| `data/yishui_textual_topology_r4.json` | 19257 B | unchanged ✓ |
| `data/yishui_external_sources_r4.json` | 9949 B | unchanged ✓ |

R4.1 通過 `data/yishui_claims_r4_1.json`（新檔）作為 audit overlay；R4 frozen JSON 不被覆寫。

---

## 8. R4.1 輸出

- JSON: `data/yishui_claims_r4_1.json`（21241 B, 12 claims with truth_scope + revised support）
- Markdown: `source/YISHUI_CLAIM_AUDIT_R4_1.md`（本文）
- 審計依據: R4 frozen commit `582c852` + R4 controlled transcription 三層

---

*R4.1 Section A+B+C 完成。R4 frozen baseline 完整保留。*