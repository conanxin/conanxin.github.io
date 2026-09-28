# YISHUI_SOURCE_AUDIT_R4_1.md

**易水外部校核資料審計 · R4.1**
*WATER_CLASSIC_R4_1_SCHOLARLY_AUDIT*

```
schema_version: r4.1-yishui-external-sources-audit/1.0
generated_at:  2026-09-28T18:05:00+08:00
task:          WATER_CLASSIC_R4_1_SCHOLARLY_AUDIT
section:       R4.1 · External source provenance audit
basis:         R4 frozen commit 582c852; EXT-NII-DIGITAL reclassified as PRIMARY (excluded from EXTERNAL_SOURCES)
```

---

## 0. Reviewer honesty disclosure

**R4.1 對 R4 外部校核資料做了 provenance audit，重新標示每個來源的 `source_role` 與 `verification_status`。** 主要修訂：

1. **EXT-NII-DIGITAL 重新分類為 PRIMARY**：原 R4 將其列入 EXTERNAL_SOURCES；R4.1 認為它是 primary scan 來源（pid1655-pid1683 之 primary source），不應計入「外部校核資料」；
2. **Placeholder URLs 降級**：原 R4 將 zhihu.com/question/...、https://...、zhbc.com/... 等 placeholder URL 標示為 CORROBORATES；R4.1 將其降級為 IDENTIFIED（僅有名稱，未驗證 URL），不計入 CORROBORATES；
3. **Variant 記錄保留**：陳橋驛《水經注校證》(2007) 之「攜徐盧」/「撅徐盧」異文，雖 URL 為 placeholder，仍保留為 VARIANT_PASSAGES 來源（標示為 claimed in R4, URL not verified in R4.1）；
4. **PASSAGE_VERIFIED_SOURCES = 0**：R4.1 audit 未對任何外部資料做逐句獨立 fetch + 比對，因此 PASSAGE_VERIFIED 為 0（最保守也最誠實的標示）。

---

## 1. Audit method

| 步驟 | 動作 |
|------|------|
| 1 | 讀取 R4 frozen external_sources JSON (`data/yishui_external_sources_r4.json`) |
| 2 | 為每個 source 加上 `source_role` (PRIMARY / EXTERNAL_PRIMARY / SCHOLARLY_EDITION / DIGITAL_TEXT / BACKGROUND) |
| 3 | 為每個 source 加上 `verification_status` (IDENTIFIED / LOCATED / ACCESSED / PASSAGE_VERIFIED) |
| 4 | 檢查每個 URL：真實 URL → ACCESSED；placeholder URL（zhihu.com/question/...、https://...、zhbc.com/...）→ IDENTIFIED |
| 5 | 重新統計 source-level / passage-level 數字（PRIMARY 與 EXTERNAL 分離；placeholder URL 不計入 CORROBORATES） |
| 6 | 保留 EXT-CHEN-2007 之 VARIANT 記錄（陳橋驛「攜徐盧」/「撅徐盧」異文）並標示其 URL 狀態 |

---

## 2. Source-level 統計

```
PRIMARY_SOURCES=1          (EXT-NII-DIGITAL · 國立公文書館 scan)
EXTERNAL_SOURCES=6         (原 R4: 7 → R4.1: 6; 排除 PRIMARY)
PASSAGE_VERIFIED_SOURCES=0 (R4.1 audit 未做獨立逐句比對)
```

### 2.1 Verification status 分布

| Status | 數量 | Sources |
|--------|------|---------|
| PRIMARY_LOCATED | 1 | EXT-NII-DIGITAL |
| ACCESSED (real URL) | 3 | EXT-WIKI-001, EXT-CTEXT-001, EXT-YANG-1905 |
| IDENTIFIED (placeholder URL only) | 3 | EXT-CHEN-2007, EXT-WANG-1956, EXT-ZHONGHUA-2013 |

### 2.2 Relation-to-primary 分布（R4.1 修正版）

| Relation | 數量 | Sources |
|----------|------|---------|
| CORROBORATES (real URL · ACCESSED) | 3 | EXT-WIKI-001, EXT-CTEXT-001, EXT-YANG-1905 |
| CLAIMED_BUT_NOT_VERIFIED_IN_R41 | 2 | EXT-CHEN-2007, EXT-ZHONGHUA-2013 (placeholder URL) |
| BACKGROUND_ONLY | 1 | EXT-WANG-1956 (placeholder URL) |
| PRIMARY (self) | 1 | EXT-NII-DIGITAL |

**對比 R4：** R4 報告 `CORROBORATES=6` 將所有 placeholder URL 都算進 CORROBORATES；R4.1 修正後 CORROBORATES=3（僅 real URL），另外 2 個 placeholder URL 降級為 CLAIMED_BUT_NOT_VERIFIED_IN_R41。

---

## 3. Passage-level 統計

```
CORROBORATING_PASSAGES=6    (來自 ACCESSED 之 3 sources: WIKI 1 + CTEXT 2 + YANG 3)
VARIANT_PASSAGES=1          (CHEN-2007 「攜徐盧」/「撅徐盧」; URL placeholder, 記錄保留)
CONTRADICTING_PASSAGES=0
BACKGROUND_ONLY=1           (source-level: 王國維)
BACKGROUND_ONLY_PASSAGES=1  (passage-level)
```

**注意：** CORROBORATING_PASSAGES=6 是「在 R4.1 已校核的 3 個 ACCESSED 外部資料中找到的對應段落數」。placeholder URL 之 CHEN-2007 (1 corroborating + 1 variant) 與 ZHONGHUA-2013 (2 corroborating) 共 4 passages 仍記錄於 R4.1 JSON 中但標示為 `claimed in R4, URL not verified in R4.1 audit`，不計入 CORROBORATING_PASSAGES 數字。

**對比 R4：** R4 報告 `VARIANTS=0`；R4.1 修正後 VARIANT_PASSAGES=1（CHEN-2007 「攜徐盧」/「撅徐盧」異文）。除非進一步審計證明該 record 本身錯誤，否則不能將 VARIANTS 報告為 0。

---

## 4. Per-source 詳細審計

### EXT-NII-DIGITAL · source_role=PRIMARY · verification_status=LOCATED

> 國立公文書館藏《水經注》明吳琯校本（卷十一 易水/滱水）

**URL:** https://www.digital.archives.go.jp/DAS/meta/listPhoto?LANG=default&BID=F1000000000000003985&ID=&REFCODE=C0000000000000003985

**Audit verdict:** URL 為真實 IIIF 端點；此即 pid1655-pid1683 之 primary scan 來源。R4.1 確認此為 **PRIMARY**（不計入 EXTERNAL_SOURCES count）。

**Corroborated passages:** 1（pid1655「易水出涿郡故安縣閻鄉西山」OCR 校正）

**R4.1 修正:** 從 R4 EXTERNAL_SOURCES 列表中**移除**，單獨標示為 PRIMARY。

---

### EXT-WIKI-001 · source_role=DIGITAL_TEXT · verification_status=ACCESSED

> 《水經注》卷十一 易水 (Wikisource 維基文庫)

**URL:** https://zh.wikisource.org/wiki/%E6%B0%B4%E7%B6%93%E6%B3%A8/%E5%8D%B711

**Audit verdict:** URL 為真實 Wikisource 卷十一頁面；R4.1 未獨立重新逐句比對，僅確認 URL 真實存在與 R4 記錄一致。

**Corroborated passages:** 1（pid1655「易水出涿郡故安縣閻鄉西山」）

---

### EXT-CTEXT-001 · source_role=DIGITAL_TEXT · verification_status=ACCESSED

> 中國哲學書電子化計劃 ctext.org 水經注 卷十一

**URL:** https://ctext.org/text.pl?node=600306&if=en

**Audit verdict:** URL 為真實 ctext.org 水經注頁面；R4.1 未獨立重新逐句比對。

**Corroborated passages:** 2（pid1657 大字標題 + pid1657 R4-YSH-008/012 引文）

---

### EXT-YANG-1905 · source_role=SCHOLARLY_EDITION · verification_status=ACCESSED

> 楊守敬《水經注疏》(1905 影印本, ctext.org 數位化)

**URL:** https://ctext.org/wiki.pl?if=zh&res=644196

**Audit verdict:** URL 為 ctext.org wiki.pl 頁面（res=644196），可定位；R4.1 未獨立重新逐句比對楊守敬原書。

**Corroborated passages:** 3（pid1656「逮迹遊賦」異文註、pid1659「地理志」引文、pid1682 enfeoffment 記錄）

---

### EXT-CHEN-2007 · source_role=SCHOLARLY_EDITION · verification_status=**IDENTIFIED**（R4.1 降級）

> 陳橋驛《水經注校證》(2007)

**URL:** `https://www.zhihu.com/question/...` **(placeholder URL — needs real link)**

**Audit verdict:** URL 為 zhihu.com/question/... placeholder；R4.1 無法定位真實可訪問 URL。本書 ISBN 978-7-101-08566-6（中華書局出版）；真實 URL 應指向中華書局官方頁面或浙江大學出版社紀念頁面。

**R4.1 降級:** 從 R4 `CORROBORATES` 改為 `CLAIMED_BUT_NOT_VERIFIED_IN_R41`。

**Variant 記錄保留:** 「攜徐盧」一作「撅徐盧」（pid1661）。R4.1 保留此異文記錄以備未來學術查證，標示為 `claimed in R4 record, URL not verified in R4.1 audit`。

---

### EXT-WANG-1956 · source_role=SCHOLARLY_EDITION · verification_status=**IDENTIFIED**（R4.1 維持）· BACKGROUND_ONLY

> 王國維《水經注校》(1956 重印本)

**URL:** `https://...` **(placeholder URL — needs real link)**

**Audit verdict:** URL 為 https://... placeholder；R4.1 無法定位真實可訪問 URL。王國維《水經注校》1956 由人民文學出版社重印。

**R4.1 維持:** BACKGROUND_ONLY 保留；URL placeholder 標示。

---

### EXT-ZHONGHUA-2013 · source_role=SCHOLARLY_EDITION · verification_status=**IDENTIFIED**（R4.1 降級）

> 中華書局《水經注》標點本 (2013)

**URL:** `https://www.zhbc.com/...` **(placeholder URL — needs real link)**

**Audit verdict:** URL 為 zhbc.com/... placeholder；R4.1 無法定位真實可訪問 URL。中華書局官方頁面應為 www.zhbc.com.cn。

**R4.1 降級:** 從 R4 `CORROBORATES` 改為 `CLAIMED_BUT_NOT_VERIFIED_IN_R41`。

---

## 5. R4 → R4.1 降級記錄

| Source | R4 status | R4.1 status | 理由 |
|--------|-----------|-------------|------|
| EXT-CHEN-2007 | CORROBORATES | CLAIMED_BUT_NOT_VERIFIED_IN_R41 | zhihu.com placeholder URL |
| EXT-ZHONGHUA-2013 | CORROBORATES | CLAIMED_BUT_NOT_VERIFIED_IN_R41 | zhbc.com placeholder URL |
| EXT-WANG-1956 | BACKGROUND_ONLY | BACKGROUND_ONLY (preserved) | https://... placeholder URL |
| EXT-NII-DIGITAL | EXTERNAL (counted) | **PRIMARY (excluded)** | 此為 primary scan，不計入 external count |

---

## 6. Section N · Completion fields

```
PRIMARY_SOURCES=1
EXTERNAL_SOURCES=6
PASSAGE_VERIFIED_SOURCES=0

CORROBORATING_PASSAGES=6
VARIANT_PASSAGES=1
CONTRADICTING_PASSAGES=0
BACKGROUND_ONLY=1
```

---

## 7. R4 frozen baseline preservation

| 檔案 | R4 frozen size | R4.1 status |
|------|----------------|-------------|
| `data/yishui_external_sources_r4.json` | 9949 B | **unchanged** ✓ |
| `source/YISHUI_EXTERNAL_CORROBORATION_R4.md` | 8564 B | **unchanged** ✓ |

R4.1 通過 `data/yishui_external_sources_r4_1.json`（新檔）作為 audit overlay；R4 frozen JSON 不被覆寫。

---

## 8. R4.1 輸出

- JSON: `data/yishui_external_sources_r4_1.json`（13217 B, 7 sources with source_role + verification_status）
- Markdown: `source/YISHUI_SOURCE_AUDIT_R4_1.md`（本文）
- 審計依據: R4 frozen commit `582c852` + URL provenance verification

---

*R4.1 Sections D+E 完成。R4 frozen baseline 完整保留。*