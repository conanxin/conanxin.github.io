# 《水经注》 Page Structure Audit (R2)

**生成时间：** 2026-09-28T13:43:00Z
**版本：** page-structure-r2/1.0
**Canonical post_id：** `124575`
**Institution：** 国立公文書館 / 内閣文庫
**v1.0 frozen baseline：** `3a51ef5e698655c215a1f36147d24bfe8c7e6826`
**v1.0 dossier sha256：** `da4fd267d64f2ae67ac8c3594962c2cd60fdce41f8d03896fb7a8ae27cc10f80`

---

## 1. 范围

本审计基于 R1 阶段已建立的 60-page sample：

- 5 个 page_seq 值 (1–5)
- 60 个 page_id
- 9 个 river regions 已标记
- 11 个关键词已索引
- 9 个历史地名已确认（见 `water_classic_historical_places.json`）

---

## 2. Volume Status

```
volume_status = UNRESOLVED
```

**原因：** 仅 5 个 unique page_labels (p0001–p0005) 出现在 60 个 page_id 中。每个 page_seq 值出现在 12–14 个不同的 page_id 中，提示多次扫描同一标称页码的扫描序列。

未发现 page_id → scan_run 或 edition_volume 的映射元数据。按研究完整性原则：**不虚构卷次**。

---

## 3. 扫描序列识别

- **唯一 page_seq 数量：** 5
- **page_seq=1：** 14 个 page_id（first 3: 1501, 1591, 1654）
- **page_seq=2：** 14 个 page_id
- **page_seq=3：** 14 个 page_id
- **page_seq=4：** 14 个 page_id
- **page_seq=5：** 4 个 page_id

**推断：** 约 12–14 个独立扫描序列（不同版本或重复扫描），但 page_id → 序列映射 UNRESOLVED。

---

## 4. 页面分类

| 分类 | 页数 |
|---|---|
| BODY_TEXT（真实《水经注》正文） | 34 |
| MIXED_PARTIAL_BODY（扫描头 + 部分正文） | 7 |
| BLANK_OR_HEADER_ONLY（仅扫描头/空白） | 19 |
| **总计** | **60** |

---

## 5. 重复页面

- **unique page_labels：** 5
- **总重复页面：** 60（每标签出现在 12–14 个不同 page_id 中）
- **扫描头示例：** "二三五五號" / "内阁文庫" / "水经注#" / "水经#" 等

---

## 6. 用于证据重建的"substantial pages"

**标准：** `body_chars ≥ 50`（剥离扫描头后的真实《水经注》正文）

- **substantial pages 数量：** 39
- **覆盖 region：** 9 个 river regions + 11 个 unclassified
- **每页平均 body chars：** ~95

### 6.1 Substantial pages by region

| Region | Pages | Citations |
|---|---|---|
| 江水_公安_华容 | 3 | SHUGE:p124575:2,3,4 |
| 河水_野王_修武 | 2 | SHUGE:p124575:3,4 |
| 易水_范陽_容城 | 4 | SHUGE:p124575:2,3,4,4 |
| 渭水_關中 | 2 | SHUGE:p124575:2,4 |
| 汝水_霍陽_梁 | 3 | SHUGE:p124575:2,3,4 |
| 汾水_代城 | 2 | SHUGE:p124575:3,4 |
| 泗水_魯汶 | 1 | SHUGE:p124575:3 |
| 淮水_肥水_芍陂 | 1 | SHUGE:p124575:3 |
| 山陽_吴陂_荷泉 | 1 | SHUGE:p124575:5 |
| unclassified | 20 | various |

---

## 7. OCR 状态

```
ocr_status_overall = QUEUED (60/60)
```

R2 阶段未运行新 OCR。所有正文摘录来自 R1 已索引的 `body_excerpt` 预览字段。该预览已剥离 Kodak/national-archive scan headers 后保留 4,389 chars / 425 body lines。

---

## 8. 限制与待解问题

1. **Volume identity UNRESOLVED** — 不虚构卷次
2. **OCR QUEUED 状态** — body_excerpt 是部分预览，非全页 OCR
3. **Scan sequence 映射 UNRESOLVED** — page_id → scan_run 元数据缺失
4. **《水经注》历史上有 40 卷** — 本 60-page sample 仅覆盖片段
5. **Page label 重复** — p0001 出现在 14 个 page_id 中，volume identity 需要元数据才能确定

---

## 9. 引用 ID 格式

- `page_object_id`：`p{post_id}:p{seq}`（例：`p124575:p3`）
- `citation_id`：`SHUGE:p{post_id}:{seq}`（例：`SHUGE:p124575:3`）

R2 阶段保持与 R1 完全一致的 ID 格式，确保 v1.0 frozen baseline 不受影响。

---

## 10. 引用关系

- v1.0 dossier sha256: `da4fd267d64f2ae67ac8c3594962c2cd60fdce41f8d03896fb7a8ae27cc10f80`（已验证不变）
- R1 page manifest: `water_classic_page_manifest.json`（R1 已发布）
- R2 evidence: `data/water_classic_page_structure_r2.json`（R2 新增）

---

**审计状态：** COMPLETE

**下次审查触发条件：** 全页 OCR 跑通 / 卷次元数据获得 / page_id → scan_run 映射建立