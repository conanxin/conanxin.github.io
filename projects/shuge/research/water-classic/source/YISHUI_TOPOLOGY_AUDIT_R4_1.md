# YISHUI_TOPOLOGY_AUDIT_R4_1.md

**易水文本空間拓撲審計 · R4.1**
*WATER_CLASSIC_R4_1_SCHOLARLY_AUDIT*

```
schema_version: r4.1-yishui-core-topology-audit/1.0
generated_at:  2026-09-28T18:05:00+08:00
task:          WATER_CLASSIC_R4_1_SCHOLARLY_AUDIT
section:       R4.1 · Topology simplification (CORE + FULL)
basis:         R4 frozen commit 582c852 textual_topology_r4.json preserved as FULL_TOPOLOGY
```

---

## 0. Reviewer honesty disclosure

**R4.1 對 R4 文本空間拓撲做 presentation-layer 簡化，但保留 R4 frozen FULL_TOPOLOGY 不動。** 主要修訂：

1. **CORE_TOPOLOGY 新建**：從 R4 FULL_TOPOLOGY 72 nodes / 29 edges 中精簡出 9 核心節點 + 15 核心邊，依用戶指定（易水/故安/范陽/容城/濡水/巨馬水/大利亭）+ 證據需求（武陽/易京）；
2. **FULL_TOPOLOGY 完整保留**：R4.1 不修改 `data/yishui_textual_topology_r4.json` 任何 byte；在 /yishui/ 公開頁面以可摺疊 (fold/appendix) 形式呈現；
3. **Claim-to-edge binding**：每條 CORE 邊綁定 `relation_id`、`claim_id`、`canonical_citation`、`exact_excerpt`、`support_status`，點擊 / 展開可查看證據；
4. **Layout bug 修正**：R4 原 SVG 大量節點使用相同 `cy=380` 座標，與頁面聲稱的「y軸按 pid1655 → pid1683 排列」不一致，導致節點視覺重疊；R4.1 CORE_TOPOLOGY 採用 5 列 x 3 行佈局，每節點獨立座標。

---

## 1. R4 layout 問題診斷

### 1.1 cy=380 座標衝突

`projects/shuge/research/water-classic/yishui/index.html` 中 SVG topology 大量使用相同 `cy=380`：

```
grep "cy=\"380\"" yishui/index.html | wc -l
→ 17 個節點重疊於 cy=380
```

**問題：** 原 SVG 設計意圖是「x 軸按節點類型分組（mountain/river/tributary/place/special）」、「y 軸按 pid 1655→1683 排列」，但實際 y 軸**完全沒有變化**（所有節點 cy=380），造成視覺上同一水平線重疊。

### 1.2 與「y軸按 pid1655 → pid1683 排列」聲稱不一致

頁面文字宣稱 SVG 按 pid 順序排列（pid1655 在上、pid1683 在下），但實際 SVG 無 y 軸差異——這是 presentation-layer 的虛假聲明。

---

## 2. CORE_TOPOLOGY 設計

### 2.1 節點選擇（9 節點）

| 來源 | 節點 | 理由 |
|------|------|------|
| 用戶指定 | 易水、故安、范陽、容城、濡水、巨馬水、大利亭 | 用戶 Section G 明列 |
| 證據需求 | 武陽 | R4-YSH-009 燕下都記錄（pid1656） |
| 證據需求 | 易京 | R4-YSH-011 公孫瓚記錄（pid1661） |

排除但保留於 FULL_TOPOLOGY: 金毫陂（pid1657，R4-YSH-010 金臺所在陂）、蘭馬臺（pid1657，臺名非獨立核心節點）、其他 65 個節點（FULL_TOPOLOGY 詳列）。

### 2.2 SVG 佈局（5 列 × 3 行）

```
                        y=150 (北)
            [濡水 cn_05]
y=250 (中-西)  [易水 cn_01]                              [易京 cn_09]
y=250 (中-東)  [故安 cn_02]
              [范陽 cn_03]   [容城 cn_04]
y=350 (中線)  ───────────────────────────────────────────
y=450 (南-西)  [武陽 cn_08]
y=500 (南-東)  [大利亭 cn_07]
y=550 (南)     [巨馬水 cn_06]
```

實際座標（cn_01 ~ cn_09）：見 `data/yishui_core_topology_r4_1.json` 之 `core_nodes` 陣列。

### 2.3 邊選擇（15 條）

從 R4 FULL_TOPOLOGY 29 edges 中選擇涉及核心節點的 15 條，並補充「武陽=燕下都」(e_007, R4-YSH-009) 之 historical_relation self-loop。

每條 core_edge 完整記錄於 `data/yishui_core_topology_r4_1.json` 之 `core_edges` 陣列。

---

## 3. Claim-to-edge binding 範例

### ce_001: 故安 → 易水（R4-YSH-002）

| 欄位 | 值 |
|------|-----|
| edge_id | ce_001 |
| subject | 故安 |
| predicate | 易水出於 |
| object | 易水 |
| relation_id | r_1655_origin_01 |
| claim_id | R4-YSH-002 |
| canonical_citation | SHUGE:p124575:1655 |
| exact_excerpt | 易水出涿郡故安縣閻鄉西山 |
| support_status | TEXT_REPORTS |

### ce_005: 大利亭 → 巨馬水（R4-YSH-007）

| 欄位 | 值 |
|------|-----|
| edge_id | ce_005 |
| subject | 大利亭 |
| predicate | 合易水注巨馬水 |
| object | 巨馬水 |
| relation_id | r_1659_meets_01 |
| claim_id | R4-YSH-007 |
| canonical_citation | SHUGE:p124575:1659 |
| exact_excerpt | 合易水而注巨馬水也 |
| support_status | TEXT_REPORTS |

### ce_012: 易水 → 易京（R4-YSH-011 — PARTIALLY_SUPPORTED）

| 欄位 | 值 |
|------|-----|
| edge_id | ce_012 |
| subject | 易水 |
| predicate | 東逕易京南 |
| object | 易京 |
| relation_id | r_1661_passes_south_of_yijing |
| claim_id | R4-YSH-011 |
| canonical_citation | SHUGE:p124575:1661 |
| exact_excerpt | 易水又東逕易京南 |
| support_status | TEXT_REPORTS（僅「易水之南」部分） |
| note | 「範陽以東、容城以西」為 TEXTUAL_INFERENCE（見 R4-YSH-011 claim_011_revised=true） |

完整 15 條見 `data/yishui_core_topology_r4_1.json`。

---

## 4. FULL_TOPOLOGY 保留

| 檔案 | R4 frozen | R4.1 status |
|------|-----------|-------------|
| `data/yishui_textual_topology_r4.json` | 19257 B (72 nodes / 29 edges) | **unchanged** ✓ |

R4.1 在公開頁面以可摺疊 `<details>` 區塊呈現 FULL_TOPOLOGY，不修改其 JSON byte。

---

## 5. R4 → R4.1 改動對照

| 領域 | R4 | R4.1 |
|------|-----|------|
| 公開頁面 SVG | 72 nodes 全部同 cy=380 衝突 | 9 節點 5 列佈局，每節點獨立座標 |
| 公開頁面 Claim 數字 | 12/12 SUPPORTED | 7 SUPPORTED + 5 PARTIALLY_SUPPORTED |
| 公開頁面「96 relations」 | 突出 | 移至 secondary details |
| 公開頁面「72 nodes」 | 突出 | 移至 secondary details |
| FULL_TOPOLOGY JSON | — | **不變**（R4 frozen） |

---

## 6. Section N · Completion fields

```
CORE_TOPOLOGY_NODES=9
CORE_TOPOLOGY_EDGES=15
FULL_TOPOLOGY_PRESERVED=true
```

---

## 7. R4 frozen baseline preservation

| 檔案 | R4 frozen size | R4.1 status |
|------|----------------|-------------|
| `data/yishui_textual_topology_r4.json` | 19257 B | **unchanged** ✓ |
| `data/yishui_spatial_relations_r4.json` | 40015 B | **unchanged** ✓ |

R4.1 通過 `data/yishui_core_topology_r4_1.json`（新檔）作為 CORE_TOPOLOGY audit overlay；FULL_TOPOLOGY（R4 frozen）不被覆寫。

---

## 8. R4.1 輸出

- JSON: `data/yishui_core_topology_r4_1.json`（10613 B, 9 core nodes + 15 core edges + claim-to-edge binding）
- Markdown: `source/YISHUI_TOPOLOGY_AUDIT_R4_1.md`（本文）
- 審計依據: R4 frozen commit `582c852` + R4 textual_topology_r4.json + R4 spatial_relations_r4.json

---

*R4.1 Sections G+H 完成。R4 frozen FULL_TOPOLOGY 完整保留。CORE_TOPOLOGY 為 presentation-layer overlay。*