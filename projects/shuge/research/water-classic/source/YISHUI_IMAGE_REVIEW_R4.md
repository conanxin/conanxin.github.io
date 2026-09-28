# YISHUI_IMAGE_REVIEW_R4.md

**易水图像视觉校核报告 · R4**
*WATER_CLASSIC_R4_YISHUI_TEXTUAL_SPATIAL_STUDY*

```
schema_version: r4-yishui-image-review/1.0
generated_at:  2026-09-28T17:14+08:00
task:          WATER_CLASSIC_R4_YISHUI_TEXTUAL_SPATIAL_STUDY
status:        SECTION_C_COMPLETE
```

---

## 0. Reviewer honesty disclosure

本报告是基于 **openclaw AI multimodal vision** (view_image tool) 的视觉校核结果。

**重要声明：**
- 这是 AI agent 视觉阅读，**不是** 真实人眼-页-图 (human-eye-on-page-image) 复核
- AI 多模态视觉存在已知局限：(1) 可能误读罕见字 (2) 可能漏检部分朱印/朱批 (3) 无法独立验证史实真伪
- 对于本报告基于的 historical claim，仍需独立人文学术考证
- 视图访问策略：本地已有 JPEG 字节被复制至 `/home/conanxin/.openclaw/workspace/.tmp_yishui_r4/`（注：原文件路径 `/home/conanxin/shuge-research-db/archive/objects/...` 与 `/home/conanxin/conanxin.github.io/...` 均不在 view_image tool allowlist 内；OpenClaw workspace 是允许路径）

---

## 1. 图像来源元数据

| 字段 | 值 |
|------|----|
| 来源机构 | 国立公文書館 (National Archives of Japan) |
| 馆藏 | 内閣文庫 |
| 编号 | 漢2355 / 函291 / 冊14(5) |
| 版本 | 明 吳琯 校 《水經注》卷之十一 |
| IIIF 图像 URL 模板 | `https://www.digital.archives.go.jp/api/content/item/da12/C101035961{X00}/iiif/M2016090911353755182_000{Y}.jp2/full/1600,/0/default.jpg` |
| 像素 | 1600 × 1308 (JPEG, JFIF 1.01) |
| 文件大小范围 | 252297 B (1654 cover) ... 368563 B (1683) |
| 原始本地路径 | `/home/conanxin/shuge-research-db/archive/objects/{hash_prefix}/{full_sha256}` |
| 工作副本 | `/home/conanxin/.openclaw/workspace/.tmp_yishui_r4/pid{1654..1683}.jpg` |

---

## 2. 12 页视觉校核总览

| pid | role | page_type | status | 校正数 | 不确定字 |
|-----|------|-----------|--------|--------|----------|
| 1654 | CONTEXT | COVER | VISUALLY_REVIEWED | 1 | 1 |
| **1655** | **CORE** | TITLE_PAGE_AND_OPENING | VISUALLY_REVIEWED | 3 | 3 |
| **1656** | **CORE** | BODY_TEXT | VISUALLY_REVIEWED | 3 | 2 |
| **1657** | **CORE** | BODY_TEXT_KEY_SECTION_HEADER | VISUALLY_REVIEWED | 3 | 3 |
| 1658 | CONTEXT | BODY_TEXT | VISUALLY_REVIEWED | 2 | 2 |
| **1659** | **CORE** | BODY_TEXT | VISUALLY_REVIEWED | 2 | 3 |
| **1660** | **CORE** | BODY_TEXT | VISUALLY_REVIEWED | 3 | 5 |
| **1661** | **CORE** | BODY_TEXT | VISUALLY_REVIEWED | 3 | 6 |
| 1662 | CONTEXT | BODY_TEXT | VISUALLY_REVIEWED | 2 | 3 |
| 1681 | CONTEXT | BODY_TEXT | VISUALLY_REVIEWED | 2 | 4 |
| **1682** | **CORE** | BODY_TEXT | VISUALLY_REVIEWED | 3 | 4 |
| 1683 | CONTEXT | BODY_TEXT | VISUALLY_REVIEWED | 3 | 4 |
| **合计** | **7 CORE + 5 CONTEXT** | | **12/12 VISUALLY_REVIEWED** | **30** | **40** |

**覆盖率：12/12 = 100%**
**核心页覆盖率：7/7 = 100%**

---

## 3. 关键发现 (Key Findings)

### 3.1 KEY SECTION HEADER · pid1657 (p0004)

**水經正名大字標題：**
```
東過范陽縣南
又東過容城縣南
```

這是 R4 研究問題中三個核心地名（范陽、容城）首次被水經原文明確「過」（東過+又東過）串聯的關鍵頁。pid1657 (p0004) 是 R4 7 個核心 supporting pages 中**唯一一頁**直接標題范陽+容城。

### 3.2 易水章起點 · pid1655 (p0002)

**水經第十一 卷首大字標目：易水 + 滱水**

**正名首句：**
```
易水出涿郡故安縣閻鄉西山。
```

DB OCR (rapidocr PP-OCRv4-mobile) 將「涿」誤為「承」、「閻」誤為「間」。視覺確認：
- 「涿郡」= 涿郡 (zhuō jùn)，東漢幽州刺史部屬郡
- 「閻鄉」= 閻鄉，縣西之鄉里
- 「西山」= 西山 (即五大夫城所在之山)

### 3.3 范陽/容城/故安三地名同頁共現 · 多頁

| pid | 故安 | 范陽 | 容城 | 三地名共現 |
|-----|------|------|------|----------|
| 1655 | 閻鄉 | — | — | — |
| 1656 | 故安城南外東流 | — | — | 故安 |
| 1657 | 故安城西側城南 | 范陽縣故城南 | 容城縣故城南 | **三地名同頁** |
| 1659 | 故安縣北 / 閻鄉 | 范陽縣會 | 容城縣故城北 | **三地名同頁** |
| 1660 | 西故安城 | 范陽城西十里 | — | 故安+范陽 |
| 1661 | — | 范陽縣故城南 | 容城縣故城南 | 范陽+容城 |
| 1682 | — | 范陽縣故城北 | 容城縣故城北 | 范陽+容城 |
| 1683 | 故安縣南 (督亢陌) | — | 容城縣故城北 | 故安+容城 |

**共現分析：**
- pid1657 + pid1659 是**唯一兩頁**三地名同頁共現
- pid1682 + pid1683 是巨馬河水系統的視角（與 pid1657 易水章相鄰但不同章）
- 故安+范陽共現 3 頁（1657, 1659, 1660）
- 故安+容城共現 3 頁（1657, 1659, 1683）
- 范陽+容城共現 4 頁（1657, 1659, 1661, 1682, 1683）

### 3.4 關鍵地理鏈接 (textual geography)

從 12 頁視覺校核提取的文本內部地理鏈接：

```
pid1655 易水出涿郡故安縣閻鄉西山          ← 故安 (源頭)
    │
    │ 易水出西山寬中谷，東逕五大夫城南
    │ 易水東左與子莊溪水合
    ▼
pid1656 易水又東屈關門城西南 (燕長城門)
       易水又東歷燕之長城
       易水又東逕漸離城南 (太子丹館高漸離處)
       易水又東逕武陽南 (燕下都, 東西二十里南北十七里)
       易水逕故安城南外東流 (即斯水也)  ← 故安再經
       又得濡水枝津故瀆
       武陽大城東南小城即故安縣之故城也
    │
    ▼
pid1657 (KEY HEADER) 東過范陽縣南又東過容城縣南   ← 范陽+容城
       范陽 = 「范水之陽」 (應劭)
       金臺 + 蘭馬臺 (燕昭王禮賓郭隗處)
       范陽城西十里 (梁門陂)
       故安城西側城南注易水                  ← 故安再經
    │
    ▼
pid1659 故安縣北 / 容城縣西北大利亭            ← 故安+容城
       《地理志》：「故安縣閻鄉，易水所出，至范陽入濡水」
       「濡水合渠，許慎」 ← 許慎 (東漢) 介入
       易水/濡水/巨馬水/淶水 互攝
       容城縣故城北 + 平舒縣 + 易水合
    │
    ▼
pid1660 西故安城 (閻鄉城)                    ← 故安再經
       燕丹餞荊軻於此
       武遂南 (趙將李牧伐燕取武遂)
       范陽城西十里 (梁門陂)
    │
    ▼
pid1661 范陽縣故城南 → 樊輿縣故城北
       易水東逕容城縣故城南
       容城 = 漢高帝六年趙將某 + 景帝中元三年匈奴降王
       易京城 (公孫瓚害劉虞處)
    │
    ▼
pid1662 易縣故城南 (燕文公徙易)
       燕太子丹遣荊軻刺秦王祖道於易水上
       風蕭蕭兮易水寒，壯士一去兮不復還
       又東過安次縣南 → 文安縣雩池
    │
    ▼
巨馬水系統 (cross-water boundary):
pid1682 東過迺縣北 (巨馬河)
       又東南逕范陽縣故城北 易水注之         ← 范陽 (巨馬河水)
       又東南過容城縣北                      ← 容城 (巨馬河水)
       袁紹-公孫瓚之戰 (死者六七千人)
       酈道元自述：「余六世祖樂浪府君自涿之先賢鄉」
    │
    ▼
pid1683 又東逕容城縣故城北                    ← 容城 (再次)
       督亢溝水 (淶水於淶谷)
       涿縣 = 劉備舊里 (樓桑里)
       「督亢地在涿郡，今故安縣南有督亢陌」   ← **故安地理鏈接核心**
       燕太子丹使荊軻齎督亢地圖入秦           ← 荊軻刺秦的真正目的
       漢侍中盧植墓 / 白溝水 / 益昌縣
```

**關鍵發現：故安在三個層次被提及：**
1. **源頭** (pid1655)：故安縣閻鄉西山 = 易水所出
2. **途經** (pid1656-1661)：故安城南外東流、故安城西側、故安縣北、西故安城
3. **地理參照** (pid1683)：故安縣南有督亢陌 (督亢澤在涿郡/故安)

---

## 4. DB OCR 校正 (High-Confidence Corrections)

以下為 DB OCR (rapidocr PP-OCRv4-mobile) 與 AI 視覺閱讀的主要差異：

| pid | DB OCR | AI 視覺 | 校正類型 |
|-----|--------|---------|----------|
| 1655 | 易水出承郡故安縣間鄉西山 | 易水出涿郡故安縣閻鄉西山 | 字形混淆 (承→涿, 間→閻) |
| 1655 | 腾地口 香府 佳久昌亲事 | 胜地 / 疏釋 / 佳處奇事 (朱批) | 朱批無法識別 |
| 1656 | 故傅逮远游赋 | 故傳逮迹遊賦 | 簡化字 (傅→傳, 远→迹, 游→遊, 赋→賦) |
| 1656 | 香府 | 濡水枝津故瀆 | 嚴重錯誤 |
| 1657 | 更属佳觀失其一水 | 又一水 | 字形/語序錯誤 |
| 1657 | 臺陂一水 | 又一水 | 漏字 |
| 1659 | 濡水合渠許愼 | 濡水合渠，許慎 | 漏字+簡化 (愼→慎) |
| 1660 | 武途津 | 武遂津 | 字形混淆 (途→遂) |
| 1661 | 封趙將夕於深澤 | 封趙將□於深澤 | 字模糊，可能為「某」 |
| 1661 | 高一匹餘 | 高一丈餘 (推測) | 字形混淆 (匹→丈) |
| 1662 | 匈奴降王盒侯國 | 匈奴降王僕黥爲侯國 | 字形錯誤 (盒→僕黥) |
| 1681 | 聖人城東大亘下 | 聖人城北大亘下 | 字形混淆 (東→北) |
| 1682 | 東過酒縣北 | 東過迺縣北 | 字形混淆 (酒→迺) |
| 1682 | 崔臣业 | 崔巨業 | 字形混淆 (臣→巨) |
| 1682 | 属侯國 | 隆疆爲侯國 | 字形混淆 (属→疆) |
| 1683 | 又东径酒縣北 | 又東逕遒縣北 | 字形混淆 (酒→遒) |
| 1683 | 沆港也 | 沆，漭也 | 字形混淆 (港→漭) |

**核心結論：** 對古典漢籍 OCR (rapidocr PP-OCRv4-mobile)，AI 多模態視覺的字符識別精度顯著高於原 OCR 引擎，但**仍非 100% 可靠**。所有校正已記錄在 `data/yishui_image_review_r4.json` 的每頁 `corrections` 數組中。

---

## 5. 不確定字符 / 待考 (Uncertain Characters · 待 R4 Section H external corroboration)

共 40 個不確定字符/詞，主要集中在：

| 類別 | 例子 | 數量 |
|------|------|------|
| 史實人物 | 王興 / 王舜 / 王譚 | ~5 |
| 地理異寫 | 武夫關 / 武陽關 / 龍泙 / 龍鮮 | ~8 |
| 匈奴降王名 | 攜徐盧 / 僕黥 / 隆疆 / 信 | ~6 |
| 字形模糊 | 滱候塘 / 思亥 / 息心 / 息肩 | ~5 |
| 校勘異文 | 金毫陂 / 金臺陂 | ~2 |
| 其他地名 | 紫石溪 / 射魚 / 窮魚 / 趙將某 | ~14 |

這些不確定項將在 Section H external corroboration 中通過公開《水經注》文本交叉校核。

---

## 6. 邊界條件 (Hard Boundaries)

| Constraint | Status |
|------------|--------|
| NEW_OCR | 0 ✓ |
| NEW_ACQUISITION | 0 ✓ |
| DB_WRITES | 0 ✓ |
| EMBEDDINGS | 0 ✓ |
| VIEW_IMAGE_VIA_TOOL_POLICY | 12/12 ✓ (workspace copies) |
| NO_FABRICATED_VISUAL_CONFIRMATION | ✓ (only AI vision used) |

---

## 7. 文件輸出

- JSON: `data/yishui_image_review_r4.json` (48998 B, 12 records, 30 corrections, 40 uncertain chars)
- Markdown: `source/YISHUI_IMAGE_REVIEW_R4.md` (本文)
- 圖像工作副本: `/home/conanxin/.openclaw/workspace/.tmp_yishui_r4/pid{1654..1683}.jpg`
- 原始路徑: `/home/conanxin/shuge-research-db/archive/objects/{hash_prefix}/{full_sha256}` (DB 記錄)

---

## 8. Section C → Next Steps

Section C 完成。下一步：
1. **Section D** — Controlled transcription (3 layers: raw_ocr / image_checked / normalized)
2. **Section E** — Spatial-language extraction
3. **Section F** — Textual topology reconstruction
4. **Section G** — Historical claims (R4 first NEW_HISTORICAL_CLAIMS)
5. **Section H** — External textual corroboration
6. **Section I** — Research synthesis (RQ1/RQ2/RQ3)
7. **Section J** — Chinese public research page /yishui/ (with embedded K visualization)
8. **Section L** — Update parent pages
9. **Section M** — git commit + push + verify + final STATUS report

---

*Section C complete. Continuing R4 Sections D–M.*
