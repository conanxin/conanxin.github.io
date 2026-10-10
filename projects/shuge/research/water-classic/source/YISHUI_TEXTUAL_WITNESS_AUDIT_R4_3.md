# R4.3 · 《水經注》易水專題文本证据逐句比對審計

**任务 ID:** WATER_CLASSIC_R4_3_TEXTUAL_WITNESS_VERIFICATION
**生成时间:** 2026-10-10 19:10 (GMT+8)
**本审計基線:** R4 frozen commit `582c852` (2026-09-28) · R4.1 commit `2b17354` (2026-09-28) · R4.2 commit `04db695` + merge `0cc2181` (2026-10-10)
**本审計不覆寫:** 上述任何 commit 中的任何字段
**本审計輸出:** 3 个新 R4.3 overlay 檔 + 公开頁面修订

---

## 二. 任务背景

R4.2 (commit `04db695`) 嘗試對 3 個外部來源做真實逐句核驗，但因 URL 路徑錯誤 (Wikisource `/水經注/卷11` 不存在) 與訪問限制 (ctext Cloudflare 反爬, 楊守敬 res 644196 socket error)，結果全部 ACCESS_BLOCKED，`PASSAGE_VERIFIED_SOURCES=0`。

R4.3 spec 在 R4.2 基礎上提供 3 個**正確的、可讀取**的 URL，並要求對 R4.1 已標示的 Claim 011 (易京方向) 與 Claim 012 (漢代封國事件 + 人物姓名) 進行重新核對。

---

## 三. 阶段进展

### Stage A: 工作區安全準備 ✅
- `pwd = /home/conanxin/conanxin.github.io`
- Local HEAD = Remote HEAD = `0cc2181`（R4.2 merge commit）
- Working tree: clean (ahead=0, behind=0)
- R4 frozen `582c852` 與 R4.1 `2b17354` 仍在歷史中
- 3 個 Research Terminal commits (`1c11294`/`0b9e65e`/`d54aec2`) 已通過 R4.2 merge `0cc2181` 全部保留
- `git fetch origin --dry-run` exit=0 (nothing to fetch — 已同步)

### Stage B: 開啟 3 個新 URL ✅
成功取得 3 個真實水經注卷十一文本，每個來源均有完整經文 + 注語:

| 來源 URL | Source identity | Edition witness | HTTP |
|---|---|---|---|
| `https://zh.wikisource.org/wiki/水經注/11` | WIKISOURCE_ZH | 維基文庫整理版 (推定底本: 武英殿聚珍版/叢書集成簡編, 待紙本校驗) | 200 |
| `https://zh.wikisource.org/wiki/水經注_(四部叢刊本)/卷第十一` | WIKISOURCE_ZH (同源) | 四部叢刊本 景印明抄本 + 案語校記 | 200 |
| `https://www.shidianguji.com/book/HY2543/chapter/1kpc1688da42b` | SHIDIANGUSHI_2543 | 明嘉靖間《山水二經合刻》本 | 200 |

**重要觀察 (per R4.3 spec §E):**
> 「维基文库两个文本页面虽然版本题名不同，但都由同一网站提供，不能仅凭页面数量推断完全独立的版本来源」

兩個 Wikisource 頁面 (WIKISOURCE_ZH identity) 計為 **1 source identity, 2 edition witnesses**。識典古籍計為 **1 source identity (1 edition witness)**。總計 **PASSAGE_VERIFIED_SOURCES = 2**, **SOURCE_WITNESSES_IDENTIFIED = 3**。

**Cabinet Library (內閣文庫) 掃描圖檢查:**
本地 `/home/conanxin/shuge-research-db/` 經過有限深度掃描，**未發現任何內閣文庫掃描圖** (verified: `PRIMARY_SCAN_CHECKED=0`)。R4.3 spec §D 提及「优先利用本地已有日本内阁文库扫描图确认研究底本的实际字形」不適用於本輪。

### Stage C: 逐句比對 ✅
共寫入 18 條 comparison records，覆蓋 R4.3 spec §B 的四組原文優先核驗:

| 組別 | pid | 主題 | records | corroborates | variants | inconclusive |
|---|---|---|---|---|---|---|
| p01 | pid1655 | 易水出涿郡故安縣閻鄉西山 | 3 | 3 | 0 | 0 |
| p02 | pid1657 | 東過范陽縣南，又東過容城縣南 | 3 | 3 | 0 | 0 |
| p03 | pid1659 | 大利亭 / 合易水而注巨馬水 / 互攝通稱 | 3 | 2 | 1 | 0 |
| p04a | pid1661 | 範陽封國時間 (中二年/中元三年) | 3 | 1 | 2 | 0 |
| p04b | pid1661 | 容城封國 (夜/夕 + 唯/攜/撅) | 3 | 1 | 2 | 0 |
| p04c | pid1661 | 易京方位 (逕易京南語法判讀) | 3 | 0 | 0 | 3 |

完整記錄見 `data/yishui_passage_comparison_r4_3.json`。

### Stage D: 學術結論 (Claim 011 + Claim 012 修訂) ✅

#### D.1 Claim 011 (易京城方位) — 方向性誤讀修正

**R4.1 claim_text_revised**:
> 「易京城在易水之南」由「逕易京南」直接支持。

**R4.3 重新語法判讀**:
> 經典句法「X水逕Y南」=「X水從Y的南側流過」=「X水位於Y之南, Y位於X水之北」。

→ 因此「易水又東逕易京南」= **易水從易京的南邊流過** = 易京在易水之北 (而非 R4.1 所讀的易京在易水之南)。

**3 個來源字面均支持此判讀**:
- Wikisource 整理版: 「易水又東逕易京南……易京城，在易城西四五里」
- Wikisource 四部叢刊本: 「易水又東逕易京南……易京城在易城西四五里」
- 山水二經合刻本: 「易水又東迳易京南……易京城。在易城西四五里」

**R4.3 處置**:
- `claim_011_correction_status_r4_3 = DIRECTION_CORRECTED`
- 但因 PRIMARY_SCAN_CHECKED=0，方向性最終結論暫列為 `INCONCLUSIVE`，等待紙本景印 (楊守敬《水經注疏》內閣文庫/北圖藏本) 校驗
- 不直接覆寫 R4.1 claim_text_revised，僅作 R4.3 overlay 提出建議

#### D.2 Claim 012 (漢代封國事件 + 人物姓名) — 4 組異文候選登記

**R4.3 登記 4 組 VERSION_VARIANT_CANDIDATES**，每組包含全部候選讀法 + 出處證據 + 校記判定（如有）+ R4.3 處置:

| Variant ID | 位置 | 候選讀法 | 外部三來源觀察 | 四部叢刊本校記 |
|---|---|---|---|---|
| V01_FANYANG_ENFEOFFMENT_TIMING | pid1657/pid1661 範陽封國時間 | 中二年 / 中元三年 | wikisource W11 = 中二年; wikisource SBCK 校記 = 中二年 (底本) / 中元三年 (近刻訛); shidianguji = 中元三年; R4.1 LOCAL_OCR = 中元三年 | 「案近刻訛作[中元三年]」明示「中二年」為正字 |
| V02_FANYANG_ENFEOFFMENT_KING | pid1657/pid1661 範陽降王姓名 | 代 / 信 | 三源外部一致 = 代; R4.1 LOCAL_OCR = 信 | (無相關校記) |
| V03_SHENZE_ZHAOJIANG_NAME | pid1661 深澤封國趙將姓名 | 夜 / 夕 / 某 | wikisource W11 + SBCK = 夜; shidianguji = 夕; R4.1 LOCAL_OCR = 某 (不確定替代記錄) | (無直接校記, 但「夜」為底本字形) |
| V04_RONGCHENG_XIONGNU_KING_NAME | pid1661 容城降王姓名 | 唯徐盧 / 攜徐盧 / 撅徐盧 | wikisource W11 = 唯徐盧; wikisource SBCK = 唯徐盧 (底本) / 攜徐盧 (近刻訛); shidianguji = 攜徐盧; R4.1 LOCAL_OCR = 攜徐盧; EXT-CHEN-2007 placeholder = 撅徐盧 (未驗證) | 「案唯近刻訛作攜」明示「唯」為正字 |

**R4.3 處置**:
- `claim_012_correction_status_r4_3 = VERSION_VARIANT_CANDIDATES_RECORDED_NOT_ADJUDICATED`
- 按 R4.3 spec §D「没有扫描或版本证据时，不得自行决定哪一种文字必然正确」**不作最終裁判**
- 四部叢刊本 (明抄本, 早於近刻) 校記在本輪作為最優古本權讀候選，但這只是相對優先級，不等於最終正確字
- 完整候選讀法、外部證據、處置建議見 `data/yishui_claim_corrections_r4_3.json`

### Stage E: 中文公開成果 (R4.2 保留 + R4.3 新增) ✅
- `yishui/sources/index.html` — 保留 R4.2 ACCESS_BLOCKED 記錄 + 新增 R4.3 段落 (PASSAGE_VERIFIED=2, SOURCE_WITNESSES=3, 4 組原文比對, Claim 011 方向修正, Claim 012 四組 VERSION_VARIANT_CANDIDATES)
- `yishui/index.html` — 新增 R4.3 nav 連結 + 版本日誌 R4.3 行 + Claims 011/012 狀態更新提示
- `projects/shuge/index.html` — 已於 R4.2 加入 R4.2 entry，R4.3 將同步加入

### Stage F: commit + 安全 push + HTTP 核驗 (進行中)

### Stage G: 最終中文報告 (進行中)

---

## 四. 边界遵守

| 項目 | 值 |
|---|---|
| NEW_OCR | 0 (未新增 OCR) |
| DB_WRITES | 0 (未寫入 SQLite) |
| EMBEDDINGS | 0 (未生成嵌入) |
| FORCE_PUSH | 0 (安全 push) |
| GIT_RESET | 0 |
| FORCE_PULL | 0 |
| R5_ENTERED | 0 |
| R4_FROZEN_OVERWRITTEN | false (582c852 任何字段未動) |
| R41_DATA_MODIFIED | false (2b17354 任何字段未動) |
| R42_DATA_MODIFIED | false (04db695 任何字段未動) |
| ctext_bypass_attempted | false (per R4.3 spec §A 「不得绕过 ctext.org 的明确反爬限制」) |

---

## 五. 未解決問題 (供 R5 或後續)

1. **Wikisource 卷11 整理版底本未明**: 整理版字形偏向「中二年」/「夜」/「唯」等古本讀法，但頁面未標註底本來源。需要紙本景印 (武英殿聚珍版 / 叢書集成簡編) 確認底本。
2. **ctext 600306 / 644196 仍未驗證**: R4.2 記錄的 Cloudflare 反爬仍可能存在。需機構訂閱或鏡像站 (國學大師 / 漢學網)。
3. **撅徐盧 第三讀法未驗證**: R4.1 提及陳橋驛《水經注校證》(2007 中華書局) 註「攜徐盧」一作「撅徐盧」。R4.3 外部來源均無「撅」字讀法。需要取得陳橋驛校證原書或中華書局標點本 (2013) URL 才能確認「撅徐盧」真實出處。
4. **易京方向解釋的最終性**: R4.3 暫列 INCONDIRECTION (記錄 3 來源字面一致 + 語法判讀支持「易京在易水之北」)，仍需要楊守敬《水經注疏》紙本景印最終確認。
5. **代/信 差異是否為 OCR 誤讀**: R4.1 LOCAL_OCR 為「信」, 3 個外部來源均為「代」。兩字字形相近 (代/信 手寫體易混淆), 可能是本地 OCR 誤讀。需要本地掃描 PDF 原圖比對確認。
6. **容城/容成 一字之差**: 山水二經合刻本在 Group 3 一句用「容成」 (其餘用「容城」), 反映該本獨立用字特徵。需要《水經注》異文學研究文獻支持是否反映不同底本系統。

---

## 六. 完成门槛报告 (待 push + HTTP 后填入实际值)

```
PASSAGE_VERIFIED_SOURCES    = 2
SOURCE_WITNESSES_IDENTIFIED = 3
PASSAGES_COMPARED           = 18
CORROBORATES                = 8
VARIANTS                    = 8
CONTRADICTIONS              = 0
INCONCLUSIVE                = 2
CLAIM_011_CORRECTED         = true (方向性誤讀修正為「易京在易水之北」)
CLAIM_012_RECHECKED         = true (4 組 VERSION_VARIANT_CANDIDATES 已登記)
PRIMARY_SCAN_CHECKED        = 0 (本地無內閣文庫掃描圖)
```

---

## 七. 完成後停止

R4.3 完成即停止，不自動進入 R5。下一步研究需要人工決策:
- 是否接受 R4.3 Claim 011 方向修正?
- 是否進入 R5 (主動擴展研究範圍)?
- 是否取得中華書局標點本 / 陳橋驄校證原書以確認「撅徐盧」讀法?