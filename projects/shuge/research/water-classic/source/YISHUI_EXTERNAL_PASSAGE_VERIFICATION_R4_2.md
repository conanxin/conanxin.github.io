# YISHUI_EXTERNAL_PASSAGE_VERIFICATION_R4_2.md

> **R4.2 · 《水經注》易水專題外部版本逐句核驗審計層**
> 基線：R4 frozen commit `582c8524631e160d167682e10848450b33ceae96`；R4.1 commit `2b17354fea7d1fa4159eea7ecae2e8258a7f79ae`
> 邊界：NEW_OCR=0、DB_WRITES=0、EMBEDDINGS=0；R4 frozen 未被覆寫；R4.1 數據結構未變；不進入 R5

---

## 0. 總覽

| 字段 | 值 |
|---|---|
| `task` | WATER_CLASSIC_R4_2_EXTERNAL_PASSAGE_VERIFICATION |
| `basis` | R4 frozen 582c852 + R4.1 2b17354 |
| `overlay_layer` | R4.2 = R4.1 之上的方法學審計層（不改 R4 frozen JSON，不改 R4.1 數據結構） |
| `generated_at` | 2026-10-10T18:18:00+08:00 |
| `status` | PASSAGE_VERIFICATION_BLOCKED（外部 real-URL 全部 ACCESS_BLOCKED） |
| `PASSAGE_VERIFIED_SOURCES` | **0** |
| `PASSAGES_COMPARED` | **0** |
| `CORROBORATES` | **0** |
| `VARIANTS` | **0** |
| `CONTRADICTIONS` | **0** |
| `INCONCLUSIVE` | **3** |
| `CLAIMS_REVISED` | **0** |

---

## 1. 為何 R4.2 沒有真實逐句核驗結果

R4.2 試圖對 R4.1 已標示為 `ACCESSED_real_URL_passage_unre_verified_in_R41` 的 3 個外部來源做真正的逐句核驗：

1. **EXT-WIKI-001** — Wikisource 《水經注》卷十一
2. **EXT-CTEXT-001** — ctext.org 水經注 卷十一（node=600306）
3. **EXT-YANG-1905** — ctext.org 楊守敬《水經注疏》（res=644196）

每一個來源在 `web_fetch` 階段均被阻斷，未能實際打開並讀到對應正文。**依 R34 §B「只有實際打開對應資料並確認相關句子，才能標為 PASSAGE_VERIFIED」**，本輪 R4.2 不能標任何來源為 PASSAGE_VERIFIED。

### 1.1 EXT-WIKI-001 阻斷細節

| 嘗試 | URL | 結果 |
|---|---|---|
| 第 1 次 | `https://zh.wikisource.org/wiki/水經注/卷11` | HTTP 404 — 頁面存在但「此頁面目前沒有內容」 |
| 第 2 次（變體） | `https://zh.wikisource.org/wiki/水經注/卷十一` | HTTP 404 — 同樣無內容 |
| 第 3 次（總目） | `https://zh.wikisource.org/wiki/水經注` | HTTP 200 — 僅返回卷一…卷四十目錄列表，無正文 |

Wikisource 該卷正文目前**確實未由社區完成錄入**（這是維基文庫的客觀編輯狀態，不是抓取失敗）。要等到社區完成卷十一 易水/滱水 篇的錄入，才能做真實逐句核驗。

### 1.2 EXT-CTEXT-001 阻斷細節

| 嘗試 | URL | 結果 |
|---|---|---|
| 第 1 次 | `https://ctext.org/text.pl?node=600306&if=zh` | HTTP 200，但返回 Cloudflare 反爬頁面，明確寫到：「Attention LLMs, robots, scrapers and other automated processes: you do not have authorization to scrape this page. You must not attempt to bypass restrictions.」 |
| 第 2 次（無 if 參數） | `https://ctext.org/text.pl?node=600306` | 同樣 HTTP 200 + 同樣 Cloudflare 反爬頁面 |

ctext.org 對所有 web_fetch 類自動化抓取一律返回反爬頁面。該平台建議訂閱機構賬戶使用 JSON API / Python 模塊。**個人 web 抓取路徑在 ctext 上不可行**，需機構訂閱或鏡像。

### 1.3 EXT-YANG-1905 阻斷細節

| 嘗試 | URL | 結果 |
|---|---|---|
| 第 1 次 | `https://ctext.org/wiki.pl?if=zh&res=644196` | `fetch failed \| other side closed \| UND_ERR_SOCKET`（socket 層錯誤，連接未建立） |

楊守敬《水經注疏》(1905 影印本) 在 ctext 上是 res=644196 wiki 條目；連接在 socket 層即被遠端關閉，無 HTTP 響應可讀。

---

## 2. R4.2 仍交付的內容（誠實的本地研究）

雖然 PASSAGE_VERIFIED 仍為 0，R4.2 並未空轉。本輪交付：

### 2.1 阻斷事實記錄
`data/yishui_external_passages_r4_2.json` 對每個 ACCESS_BLOCKED 來源都精確記錄了：
- 嘗試次數、每次的精確 URL、每次的精確錯誤訊息（404 / 200-but-Cloudflare-blocked / UND_ERR_SOCKET）
- 該來源本來應該核驗的 `primary_pid` 列表（1655/1657/1659/1661/1662）
- 對每個 pid 的 `primary_excerpt`（R4 frozen OCR 文本）+ `expected_locator` + `expected_phrase_to_find`

### 2.2 標準化記錄欄位（為下階段可執行設計）
每條記錄包含 R34 §C 要求的 11 個欄位：
- `primary_citation_id`（如 pid1655）
- `primary_excerpt`（R4 frozen OCR）
- `external_source_title`
- `edition_information`
- `verified_url`
- `passage_locator`
- `external_excerpt`（ACCESS_BLOCKED → null）
- `textual_variant`（ACCESS_BLOCKED → null）
- `comparison_result`（ACCESS_BLOCKED → null）
- `verification_status`（ACCESS_BLOCKED）
- `uncertainty`（精確錯誤描述）

### 2.3 下次可執行的核驗協議
JSON 中 `next_attempt_protocol` 給出了 7 步流程，明確：
- 若發現 VARIANT（如「攜徐盧」vs「撅徐盧」），需更新 claim 文本
- 若發現 CONTRADICTION，**不得**提高證據等級（保留 PARTIALLY_SUPPORTED 或降級）
- **不得**把古籍文本記載直接當成現代地理事實（R34 §D 明確邊界）

### 2.4 中文公開頁面
`yishui/sources/index.html` 公開頁面誠實展示 ACCESS_BLOCKED 狀態、列舉每個來源阻斷細節、列出未來需核驗的具體句段清單，**不**虛構任何「已核驗」字樣。

---

## 3. R34 spec 與實際狀態的差異

R34 spec §A 寫「已知遠端 main 為 `d54aec2`，比本地 R4.1 多三個 Research Terminal 提交」。實際查驗結果：

```
remote HEAD: 2b17354fea7d1fa4159eea7ecae2e8258a7f79ae
local HEAD:  2b17354fea7d1fa4159eea7ecae2e8258a7f79ae
ahead: 0
behind: 0
```

差異：
- spec 描述的「3 個 Research Terminal 提交」**在實際 remote 上不存在**
- remote 與 local 已完全同步在 R4.1 `2b17354`
- 無需 fast-forward；本輪 R4.2 提交將是 1 commit ahead of `2b17354`，正常推送即可

此差異已在 `yishui_external_passages_r4_2.json` 的 `spec_discrepancy_recorded` 字段誠實記錄。

---

## 4. R4 / R4.1 / R4.2 邊界

| 層 | commit | 性質 | R4.2 是否動 |
|---|---|---|---|
| R4 frozen | `582c852` | 文本空間研究（12 claims 全部 SUPPORTED 之舊記錄） | ❌ 不動 |
| R4.1 audit overlay | `2b17354` | 學術審計（7S + 5PS、Claim 011/012 修訂、9 nodes / 15 edges） | ❌ 不動 |
| R4.2 PASSAGE_VERIFICATION overlay | 本輪新增 | 外部逐句核驗（PASSAGE_VERIFIED 仍 0；阻斷事實記錄） | ✅ 新增 overlay |

邊界全部遵守：NEW_OCR=0、DB_WRITES=0、EMBEDDINGS=0、FORCE_PUSH=0、GIT_RESET=0、FORCE_PULL=0、R5 進入=0。

---

## 5. 真正的下一輪研究缺口（不進入 R5）

| 缺口 | 現狀 | 解決路徑 |
|---|---|---|
| Wikisource 卷11 正文 | 維基文庫社區尚未完成錄入 | 等社區完成後重新核驗（無時間預期） |
| ctext 600306 訪問 | Cloudflare 反爬阻斷 | 機構訂閱 ctext JSON API；或鏡像站（如《漢語古籍全文數據庫》、中華書局數字合作館） |
| 楊守敬《水經注疏》res=644196 | socket 錯誤連接未建立 | 換鏡像（如國學大師、漢學網）或紙本掃描比對 |
| 陳橋驛《水經注校證》2007 | placeholder URL | 找中華書局 / 杭州出版社實際電子版 |
| 王國維《水經注校》1956 | placeholder URL | 找上海書店 / 中華書局實際電子版 |
| 中華書局《水經注》標點本 2013 | placeholder URL | 中華書局官方數字平台 / 當當 / 京東電子書 |

**建議優先級**（在 R5 之外）：先恢復 ctext 機構訂閱路徑，這是核驗「攜徐盧 vs 撅徐盧」異文、Claim 012 三項漢代封國的最短路徑。

---

## 6. 完成

R4.2 雖未能產生任何 PASSAGE_VERIFIED，但已：
- 誠實記錄 3 個 real-URL 來源的阻斷事實與精確錯誤
- 為下輪真實逐句核驗預先設計好 11 個標準欄位 + 7 步協議
- 在 `yishui/sources/index.html` 公開透明展示 ACCESS_BLOCKED 狀態
- 在 `data/yishui_external_passages_r4_2.json` 留下可機讀、可審計、可重放的阻斷記錄
- 未覆蓋任何 frozen 基線、未重 OCR、未改數據庫、未進入 R5

完成 R4.2 後停止。