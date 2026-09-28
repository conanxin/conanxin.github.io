# 《水经注》 Evidence-First Research Questions (R2)

**生成时间：** 2026-09-28T13:43:00Z
**范围：** 基于 R1 60-page sample + 9 river regions + 9 historical places

---

## 总览

R2 阶段围绕 **3 个核心研究问题 (RQ1–RQ3)** 展开，每个问题绑定到 R1 已确认的 river region + historical place，所有描述严格 evidence-first（先有 OCR 证据，再建立 claim）。

| RQ | 研究问题 | 关联 river group | 关联历史地名 |
|---|---|---|---|
| RQ1 | 江水与沿岸城邑如何共同被描述？ | 江水（公安 / 華容） | 公安縣、華容 |
| RQ2 | 河水—野王—修武呈现什么空间关系？ | 河水（野王 / 修武） | 野王縣、修武 |
| RQ3 | 易水—范阳—容城—故安之间的文本空间序列是什么？ | 易水（范陽 / 容城 / 故安城） | 范陽、容城、故安城 |

---

## RQ1: 江水与沿岸城邑如何共同被描述？

**研究问题：** 长江（江水）及其沿岸的 公安縣 / 華容 在《水经注》文本中如何被共同描述？

**关联 river group：** `R-jian-shui-gongan-huarong`（江水 · 公安 / 華容）

**关联历史地名：** 公安縣、華容

**已知证据（R1 substantial pages）：**

- **page count：** 3
- **citation_ids：** `SHUGE:p124575:2`、`SHUGE:p124575:3`、`SHUGE:p124575:4`
- **total body chars：** ~315
- **support_status：** `SUPPORTED`
- **aggregate_excerpt（preview）：** 三页 body_excerpt 中均出现江水叙事片段

**限制：**

- 60-page sample 中江水相关 OCR 片段有限
- 公安 / 華容 在 body_excerpt 中以分散词出现，未发现完整句描述
- 全页 OCR QUEUED，无法判断江水叙事与城邑描述的关联深度
- 现代坐标绑定 UNRESOLVED

**claim：** `r2-cl-001`（见 `water_classic_evidence_claims_r2.json`）

---

## RQ2: 河水—野王—修武呈现什么空间关系？

**研究问题：** 黄河（河水）沿岸 野王縣 / 修武 在《水经注》文本中呈现什么空间关系？

**关联 river group：** `R-he-shui-yewang-xiuwu`（河水 · 野王 / 修武）

**关联历史地名：** 野王縣、修武

**已知证据（R1 substantial pages）：**

- **page count：** 2
- **citation_ids：** `SHUGE:p124575:3`、`SHUGE:p124575:4`
- **total body chars：** ~218
- **support_status：** `PARTIALLY_SUPPORTED`
- **aggregate_excerpt（preview）：** 两页均出现 野王、修武 词

**限制：**

- body_excerpt 显示河水叙事中"野王"与"修武"两县在同一水文地理片段出现
- 空间关系（上下游、流域归属、地理距离）需全页 OCR 才能确认
- 现代坐标绑定 UNRESOLVED

**claim：** `r2-cl-002`

---

## RQ3: 易水—范阳—容城—故安之间的文本空间序列是什么？

**研究问题：** 易水流域中 范陽 / 容城 / 故安城 在《水经注》文本中按什么序列出现？

**关联 river group：** `R-yi-shui-fanyang-rongcheng`（易水 · 范陽 / 容城 / 故安城）

**关联历史地名：** 范陽、容城、故安城

**已知证据（R1 substantial pages）：**

- **page count：** 4
- **citation_ids：** `SHUGE:p124575:2`、`SHUGE:p124575:3`、`SHUGE:p124575:4`、`SHUGE:p124575:4`
- **total body chars：** ~448
- **support_status：** `SUPPORTED`
- **aggregate_excerpt（preview）：** 多页 substantial body_excerpt 中出现 范陽、容城、故安城 三地名

**限制：**

- 三地（范陽 / 容城 / 故安城）在多页 substantial body_excerpt 中出现
- 文本序列判断需要按 page_seq 排序并读全页 OCR
- body_excerpt 来自 R1 部分预览，仅能确认三地均出现于易水片段
- 现代坐标绑定 UNRESOLVED

**claim：** `r2-cl-003`

---

## Evidence-First 原则

所有 RQ 的展开严格遵循：

1. **先有 OCR 证据**（body_excerpt ≥ 50 chars）
2. **再建立 claim**
3. **claim 必须绑定 RQ + citation_id**
4. **限制与待解问题必须明确列出**

---

## 与 R1 的关系

R2 不引入新 OCR、不引入新 resource acquisition、不修改 R1 已建立的 page manifest / canonical identity。R2 的所有 RQ 都是对 R1 已收集证据的二次组织与历史地理问题构建。

**R1 保留路由：** `https://conanxin.github.io/projects/shuge/research/water-classic-evidence-r1/`

---

## 研究问题状态

```
RQ1 — 江水 + 公安/華容 — SUPPORTED（3 页）
RQ2 — 河水 + 野王/修武 — PARTIALLY_SUPPORTED（2 页）
RQ3 — 易水 + 范陽/容城/故安城 — SUPPORTED（4 页）

下一步触发条件：全页 OCR 跑通后重审 RQ → 提供更精细的地理关系描述
```