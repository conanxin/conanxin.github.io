# 《水經注》易水專題 — R4.3A 文本證據勘誤（errata）

**TASK_ID** = `WATER_CLASSIC_R4_3A_EVIDENCE_RECONCILIATION`
**生成時間** = 2026-10-10 19:23 GMT+8
**overlay 對象** = `R4.3 · 《水經注》易水專題文本證據逐句比對` (commit `69c396d`)
**狀態** = R4.3 凍結 JSON **未修改**；本檔為獨立加掛的 errata overlay

---

## 1. 統計勘誤（statistical reconciliation）

R4.3 摘要區塊（`verification_summary`）的逐句比較結果統計，與 `records[]` 數組實際內容不一致。R4.3A 直接從 `records[]` 18 條記錄的 `comparison_result` 字段重新聚合，得出 ground truth：

| 字段 | R4.3 上報值 | R4.3A ground truth | 差異 |
|---|---|---|---|
| `PASSAGES_COMPARED` | 18 | 18 | ✓ 一致 |
| `CORROBORATES` | **8** | **10** | -2 |
| `VARIANT` / `VARIANTS` | **8** | **5** | -3 |
| `CONTRADICTIONS` | 0 | 0 | ✓ 一致 |
| `INCONCLUSIVE` / `INCONCLUSIVE_DIRECTION` | **2** | **3** | -1 |
| 合計 | 18 | 18 | ✓ 數量級正確 |

R4.3 `verification_summary` 採用 `VARIANTS=8` 與 `INCONCLUSIVE=2` 的加總分組，而 `records[]` 實際使用單數 `VARIANT` 與長籥名 `INCONCLUSIVE_DIRECTION`。R4.3A 採用 literal key 重新分組。

按 pid × gid 維度的 ground truth：

| Group | records | corroborates | variants | inconclusive |
|---|---|---|---|---|
| p01_yishui_origin (pid1655) | 3 | 3 | 0 | 0 |
| p02_fanyang_rongcheng_section_header (pid1657) | 3 | 3 | 0 | 0 |
| p03_daliting_jumaxshui_huxie_tongcheng (pid1659) | 3 | **3** | **0** | 0 |
| p04a_fanyang_enfeoffment_timing (pid1661) | 3 | 0 | 3 | 0 |
| p04b_rongcheng_enfeoffment_xululu (pid1661) | 3 | 0 | 2 | 1 |
| p04c_yijing_position (pid1661) | 3 | 0 | 0 | 3 |
| 合計 | 18 | 10 | 5 | 3 |

R4.3 上報值：p03 為 corroborates=2 variants=1，p04b 為 corroborates=1 variants=2；ground truth 修正為 p03=3 corroborates, p04b=0 corroborates+2 variants+1 inconclusive。R4.3 JSON 完整保留作爲歷史記錄；本勘誤使用 errata 形式表達。

---

## 2. 底本影像定位（PRIMARY_IMAGES_LOCATED）

### 2.1 路徑與哈希（精確路徑檢查，不做遞歸 find）

R4 影像審查記錄 `data/yishui_image_review_r4.json` (R4 frozen commit `582c852`) 列出 12 個 page_object_id 影像，全部位於：

```
/home/conanxin/.openclaw/workspace/.tmp_yishui_r4/pid1654.jpg ~ pid1683.jpg
```

R4.3A 階段 B.2 精確路徑檢查結果：

| pid | 文件大小 (B) | 存在 | mtime |
|---|---|---|---|
| 1654 | 252297 | ✓ | 2026-09-28 17:13 |
| 1655 | 264355 | ✓ | 2026-09-28 17:11 |
| 1656 | 350598 | ✓ | 2026-09-28 17:13 |
| 1657 | 340498 | ✓ | 2026-09-28 17:13 |
| 1658 | 346529 | ✓ | 2026-09-28 17:13 |
| 1659 | 344777 | ✓ | 2026-09-28 17:13 |
| 1660 | 349256 | ✓ | 2026-09-28 17:13 |
| 1661 | 350687 | ✓ | 2026-09-28 17:13 |
| 1662 | 335519 | ✓ | 2026-09-28 17:13 |
| 1681 | 358556 | ✓ | 2026-09-28 17:13 |
| 1682 | 345315 | ✓ | 2026-09-28 17:13 |
| 1683 | 368563 | ✓ | 2026-09-28 17:13 |

`PRIMARY_IMAGES_LOCATED = 12`（位於 `.tmp_yishui_r4/`，CAS 路徑 `/home/conanxin/shuge-research-db/archive/objects/` 同時存在但 R4 影像審查未使用 CAS 存儲）

底本身份（依 R4 影像審查 JSON `source_metadata` 字段）：

- **機構**: 国立公文書館 (National Archives of Japan, 内閣文庫)
- **索書號**: 漢2355 / 函291 / 冊14(5)
- **版本**: **明 吳琯 校《水經注》卷之十一**
- **底本名稱**: 明 吳琯 校 (Wu Guan collated edition of the Ming Dynasty)
- **序文題署**: 「漢桑欽撰　後魏酈道元注　明吳琯校」（pid1655 圖像識別確認）

---

## 3. AI 影像複核（PRIMARY_IMAGES_REVIEWED）

### 3.1 AI 視覺審查披露（mandatory disclosure per R4.3A spec §B）

> **本節所有影像辨識結果均由 OpenClaw 多模態視覺（view_image 工具）自動辨識，非人眼專家审定。**
> 辨識結果可能受印本漫漶、異體字、繁簡差異、AI 模型幻覺等因素影響。
> 凡不確定字皆以 `?` 標記或於 CHARGERENCE_NOTES 中明列。
> 本節不作为「專家校訂」，僅作爲計算機視覺輔助證據。

### 3.2 pid1655（封面 + 卷首）

- **AI 識別結果**: 正文第一行 = 「易水出涿郡故安縣閻鄉西山」
- **CHARGERENCE_NOTES**: 「閻」字清晰（門字框內為閻，未出現简体阎字形）；「酈道元」使用「酈」（右耳旁+裡），與現代簡體「郦」為繁簡關係。
- **CORROBORATES**: 與 R4.3 報告、外部三源字面一致

### 3.3 pid1657（範陽容城段頭大字標題 + 漢景帝中元年段）

- **AI 識別結果**:
  - 大字雙行標題 = 「東過范陽縣南，又東過容城縣南」（**寫「容城」，不是「容成」**）
  - 正文 = 「漢景帝中元年封匈奴降王**代**爲侯國。王莽之通順也，易水又東，與源泉水合。」
- **CHARGERENCE_NOTES**:
  - **範陽受封降王姓名 = 代**（3 個外部源全作「代」；R4.1 LOCAL_OCR 寫作「信」；底本影像字面亦作「代」）
  - 「容城」二字清晰可辨
- **CORROBORATES**: 標題與外部源一致；V02（代/信）底本影像支持「代」

### 3.4 pid1659（互攝、大利亭、巨馬水段）

- **AI 識別結果**:
  - 「又東合易水而注巨馬水也」— 出現
  - 「又並亂流入濡水是則易水與諸水**互攝通稱**」— 出現（清晰）
  - 「南流於容城縣西北**大利亭**東南合易水而注巨」— 出現
- **CHARGERENCE_NOTES**: 「攝」字（手旁+隹結構）完整；「互」字清晰
- **CORROBORATES**: 三術語全部與 R4.3 外部三源字面一致

### 3.5 pid1661（封侯三段 + 易京城方位）

**5 個目標區域 AI 識別結果**:

| 區域 | AI 識別字面 | 不確定字 |
|---|---|---|
| 易京城方位 | 「易水又東逕易京南...易京城**在易城西四五里**」後接「趙建武四年石虎自遼西」 | 無 |
| 範陽封侯段 | 本頁主要寫「中山靖王子**劉脩**為侯國」（樊輿縣，非範陽）；「景帝中元三年以封匈奴降王」 | 字跡較密 |
| **深澤封侯** | 「漢高帝六年封趙將**夜**於容城皆為侯國王莽更名深澤」 | 「夜」字左撇清晰 |
| **容城封侯** | 「匈奴降王**攜徐盧**於容城」 | 「攜」字（手旁+隹）完整 |
| **範陽封國時間** | 「景帝**中元三年**」 | 字跡清晰 |

**CHARGERENCE_NOTES**:

- **V01 範陽封國時間**: Cabinet Library 影像字面 = **中元三年**；R4.1 LOCAL_OCR = 中元三年；Wikisource 整理版 + Wikisource 四部叢刊本校記均作 **中二年**（校記明示「中二年」為底本正字，「中元三年」為近刻訛）
- **V02 範陽受封降王**: pid1657 影像字面 = **代**；3 個外部源全作「代」；R4.1 LOCAL_OCR = 「信」（疑為本地 OCR 誤讀）
- **V03 深澤趙將姓名**: pid1661 影像字面 = **夜**；Wikisource 兩版均作「夜」；山水二經合刻作「夕」；R4.1 LOCAL_OCR = 「某」（不確定替代記錄）；《漢書·高帝紀》注引《功臣表》佐證為「夜」
- **V04 容城降王姓名**: pid1661 影像字面 = **攜徐盧**；Wikisource 整理版 + 四部叢刊本均作 **唯徐盧**（校記明示「唯」為底本正字，「攜」為近刻訛）；山水二經合刻作「攜徐盧」；陳橋驛校證（2007 中華書局）第三方讀法為「撅徐盧」（R4.3 暫未驗證）

### 3.6 R4.3A 不作最終裁判

> R4.3A 嚴格遵守 R4.3 spec §D「沒有扫描或版本證據時，不得自行決定哪一種文字必然正確」。
> 即使 Cabinet Library 影像為「明 吳琯 校」底本，**仍不是最終裁決性定本**。
> 最終裁決需待：
> 1. 中華書局標點本（陳橋驄 2013）實物查驗
> 2. 楊守敬《水經注疏》紙本景印（內閣文庫/北圖藏本）
> 3. 戴震校武英殿聚珍本抄本
> R4.3A 將上述 4 組候選讀法 + 影像字面 + 外部三源 + 校記優先級 全部登記為 VERSION_VARIANT_CANDIDATES，不覆寫任何結論。

---

## 4. Claim 011 與 Claim 012 最新證據狀態

### 4.1 Claim 011（易京方位方向性）

**R4.3A 結論**: 方向性誤讀**已識別**；**最終結論仍暫列 INCONCLUSIVE_DIRECTION**（因 PRIMARY_IMAGES_LOCATED 是 AI 多模態視覺而非人眼專家审定）。

- **語法層**: 「易水又東逕易京南」= 易水從易京南邊流過 = **易京在易水之北**（R4.3 已記錄）
- **底本影像層** (pid1661 AI 識別): 「易京城**在易城西四五里**」與「易水又東逕易京南」共同提示易京在易水之**北**（語法判讀 + 跨句一致）
- **現代位置**: R4.3A 仍標 **REAL_WORLD_LOCATION = UNRESOLVED**（不得將古籍文本記載當成現代地理事實）

`CLAIM_011_CORRECTED = DIRECTION_CORRECTED`（方向性誤讀已記錄為 overlay，**未覆寫** R4.1 claim_text_revised）

### 4.2 Claim 012（封侯四組異文候選）

`CLAIM_012_RECHECKED = 4_VERSION_VARIANT_CANDIDATES_R4_3A`（Cabinet Library 影像 + 外部三源 + 校記優先級全部登記，不作最終裁判）

| V# | 候選讀法 | Cabinet Library 影像 | Wikisource 整理版 | Wikisource 四部叢刊本 | 山水二經合刻 | R4.1 LOCAL_OCR | 校記優先級 |
|---|---|---|---|---|---|---|---|
| V01 範陽封國時間 | 中二年 / 中元三年 | 中元三年 | 中二年 | 中二年 (校記: 「中二年」為正字) | 中元三年 | 中元三年 | **中二年**（明抄校記為正） |
| V02 範陽受封降王 | 代 / 信 | 代 | 代 | 代 | 代 | 信 | **代**（底本+3 外部源共識） |
| V03 深澤趙將姓名 | 夜 / 夕 / 某 | 夜 | 夜 | 夜 | 夕 | 某 | **夜**（Cabinet Library + Wikisource + 《漢書》佐證） |
| V04 容城降王姓名 | 唯徐盧 / 攜徐盧 / 撅徐盧 | 攜徐盧 | 唯徐盧 | 唯徐盧 (校記: 「唯」為正字) | 攜徐盧 | 攜徐盧 | **唯徐盧**（明抄校記為正） |

注: 校記優先級採用 Wikisource 四部叢刊本景印明抄本校記（最古老現存明刻校勘記錄），**僅作學術優先級參考**，不作最終裁決。最終裁決仍需紙本景印。

---

## 5. R4.3A 完成門檻

| 字段 | R4.3A 最終值 |
|---|---|
| `TASK_ID` | `WATER_CLASSIC_R4_3A_EVIDENCE_RECONCILIATION` |
| `STATUS` | `EVIDENCE_RECONCILED + SCAN_REVIEWED_AS_AI` |
| `COMMIT_SHA` | (見最終回報) |
| `PASSAGE_VERIFIED_SOURCES` | 2 |
| `SOURCE_WITNESSES_IDENTIFIED` | 3 (R4.3) + 1 (Cabinet Library 影像) = **4** |
| `PASSAGES_COMPARED` | 18 (R4.3) |
| `CORROBORATES` | **10** (R4.3A ground truth) |
| `VARIANTS` | **5** (R4.3A ground truth) |
| `CONTRADICTIONS` | 0 |
| `INCONCLUSIVE` | **3** (R4.3A ground truth) |
| `CLAIM_011_CORRECTED` | `DIRECTION_CORRECTED` (overlay, 未覆寫 R4.1) |
| `CLAIM_012_RECHECKED` | `4_VERSION_VARIANT_CANDIDATES_R4_3A` |
| `PRIMARY_IMAGES_LOCATED` | **12** (pid1654-pid1662, pid1681-pid1683) |
| `PRIMARY_IMAGES_REVIEWED` | **4** (pid1655, pid1657, pid1659, pid1661) — AI vision, 非人眼專家 |
| `PUBLIC_URL` | https://conanxin.github.io/projects/shuge/research/water-classic/yishui/sources/ |
| `HTTP_STATUS` | (待推送後核驗) |
| `BOUNDARY_NEW_OCR` | 0 |
| `BOUNDARY_DB_WRITES` | 0 |
| `BOUNDARY_EMBEDDINGS` | 0 |
| `BOUNDARY_FORCE_PUSH` | 0 |
| `BOUNDARY_R5_ENTERED` | 0 |
| `BOUNDARY_R4_3_OVERWRITTEN` | false (frozen commit `69c396d` JSON unchanged, md5 `0a7474c0e8a0288832b4218d2d5d2afb`) |
| `BOUNDARY_R4_2_OVERWRITTEN` | false (commit `04db695`) |
| `BOUNDARY_R4_1_OVERWRITTEN` | false (commit `2b17354`) |
| `BOUNDARY_R4_FROZEN_OVERWRITTEN` | false (commit `582c852`) |

---

## 6. R4.3A 未解決問題（給未來研究，不僅對應 R5）

1. **撅徐盧** 第三讀法：陳橋驄《水經注校證》(2007 中華書局) 註明「攜徐盧」一作「撅徐盧」。R4.3A 4 條 Cabinet Library 影像皆未出現「撅」字讀法；需中華書局標點本實物查驗
2. **易京方向最終性**: PRIMARY_IMAGES_REVIEWED 是 AI 多模態視覺 (view_image tool)，非人眼專家审定；楊守敬《水經注疏》紙本景印（內閣文庫/北圖藏本）為最終確認路徑
3. **代/信 差異是否為 OCR 誤讀**: Cabinet Library 影像字面 = 代；R4.1 LOCAL_OCR = 信；待本地掃描 PDF 原圖比對確認本地 OCR
4. **Wikisource 卷11 整理版底本**: 推定武英殿聚珍版/叢書集成簡編，需紙本校驗確認
5. **ctext 600306 / 644196**: R4.3A spec §A 明確禁止繞過 ctext 反爬限制；機構訂閱或鏡像站（國學大師/漢學網）為可行路徑
6. **容城/容成** 一字之差：山水二經合刻本一句作「容成」，其餘作「容城」；Cabinet Library 影像作「容城」；需《水經注》異文學研究文獻支持
7. **中華書局標點本 (2013) 紙本實物查驗**: 上述 V01-V04 四組候選的最終裁決，需紙本實物查驗，不僅依賴 AI 視覺
8. **AI 視覺 vs 人眼專家审定**: 凡「真實字形」結論須有至少一位版本學/古文獻學專家人眼複核

---

## 7. 邊界全部遵守

- NEW_OCR=0
- DB_WRITES=0
- EMBEDDINGS=0
- FORCE_PUSH=0
- GIT_RESET=0
- FORCE_PULL=0
- R5_ENTERED=0
- R4.3_FROZEN_OVERWRITTEN=false (R4.3 JSON md5 `0a7474c0e8a0288832b4218d2d5d2afb` preserved)
- R4.2_FROZEN_OVERWRITTEN=false
- R4.1_FROZEN_OVERWRITTEN=false
- R4_FROZEN_OVERWRITTEN=false
- 公開成果保持中文
- ctext_bypass_attempted=false
- 影像審查明確披露為 AI 多模態視覺，非人眼專家审定

完成 R4.3A 後停止，不進入 R5。