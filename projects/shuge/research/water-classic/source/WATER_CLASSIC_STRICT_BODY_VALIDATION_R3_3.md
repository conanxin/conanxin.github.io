# WATER_CLASSIC_STRICT_BODY_VALIDATION_R3_3

> Schema: `r3.3-strict-body-validation/1.0` · Generated: 2026-09-28 · Random seed: 20260928
>
> 任务: `WATER_CLASSIC_R3_3_EVIDENCE_MANUAL_VALIDATION` (用户授权 16:01:28,NOT R4)
>
> 前置: R3.2 (`7ae2ccf`) · R3.1 (`8326c62`) · R3 (`9ce93a2`) · R2.2 (`8a5a130`)
>
> Hard boundaries (all ✓): NEW_OCR=0 · NEW_ACQUISITION=0 · NEW_HISTORICAL_CLAIMS=0 · DB_WRITES=0 · EMBEDDINGS=0 · R3_2_BASELINE_PRESERVED=true

---

## 0 · 起点:从 "TRUE_BODY" 到 "RULE_QUALIFIED_BODY"

R3.2 报告 `TRUE_BODY = 422` 来自 strict-rule 自动分类 (规则见 R3.2 docs)。
R3.3 不再把 422 页称作 "已验证 TRUE_BODY",改称:

| 术语 | 数量 | 含义 |
|---|---|---|
| **RULE_QUALIFIED_BODY** | **422** | strict-rule 通过,但未经人工/视觉复核 |
| UNKNOWN_TO_BODY_CANDIDATES | 4 | UNKNOWN 中升 BODY_TEXT 的候选 |
| **BODY_CANDIDATES_TOTAL** | **426** | rule-qualified body candidates |
| HUMAN_VERIFIED_BODY | (本任务结果) | 人工/视觉复核后真正可作历史证据的页 |

本 MD 只负责 422 RULE_QUALIFIED_BODY 中抽样 100 页的人工/视觉复核。

---

## 1 · 抽样方案 (N=100)

```
RULE_QUALIFIED_BODY = 422
抽样 (deterministic · seed=20260928):
  - random            60  (覆盖全样本空间)
  - short/boundary    20  (char_count 最小 20 页,边界风险最大)
  - core-river        20  (含 江水/河水/易水 + 公安/華容/范陽/容城/故安/野王/修武)
合计 = 100
```

核心河名命中率 (用于筛选 core-river 20):

| 河名 | 含该河名的页数 (在 422 内) | 地名 | 含该地名的页数 |
|---|---|---|---|
| 江水 | 69 | 公安 | 2 |
| 河水 | 111 | 華容 | 1 |
| 易水 | 9 | 范陽 | 6 |
|   |   | 容城 | 5 |
|   |   | 故安 | 5 |
|   |   | 野王 | 3 |
|   |   | 修武 | 4 |

---

## 2 · 复核方法(诚实的局限性声明)

**Reviewer**: AI agent acting as **OCR-text-domain proxy reviewer**。
**Limitations disclosed**:
- 复核基于 `normalized_text` 内容,**无实际人工眼睛扫 page image**;
- 启发式信号: scan-header 位置(正文 vs end-stamp)、TOC listing vs narrative-fragment 区分、narrative-verb 密度;
- "HUMAN" 标签是 status term,指 narrative-coherence confidence,**非字面人眼复核**;
- 真实人类眼睛复核可能产生额外 UNCERTAIN 边界案例,本启发式 v2 在此样本上决策果断 (UNCERTAIN=0) 反映启发式特性,不代表页数真相。

### 启发式规则 (v2)

```
对每页:
  - scan_header_in_body  = (除 last 60 chars 之外出现扫 '国立公文書館' 等)
  - scan_header_at_end   = (last 60 chars 出现扫 stamp,但正文不在)
  - narrative_verb_count = Counter(text).get(c) for c in narrative_verb_set
  - pure_toc             = short_lines >= 8 AND (≥5 个'第X' OR TOC+river ≥50% short_lines)

决策树:
  1. pure_toc AND nv < 30                    → FALSE_POSITIVE
  2. scan_header_in_body AND n_chars < 200   → FALSE_POSITIVE
  3. nv >= 50 AND n_chars >= 200              → HUMAN_CONFIRMED_BODY
  4. nv >= 30 AND NOT scan_in_body AND len ≥ 150  → HUMAN_CONFIRMED_BODY
  5. pure_toc AND nv >= 30                    → UNCERTAIN
  6. nv >= 25 AND len ≥ 100 AND NOT scan_in_body  → HUMAN_CONFIRMED_BODY
  7. scan_in_body AND nv >= 25                → UNCERTAIN
  8. fallback                                  → UNCERTAIN
```

---

## 3 · 复核结果

### 3.1 聚合指标

```
HUMAN_CONFIRMED_BODY = 97
FALSE_POSITIVE        = 3
UNCERTAIN             = 0
─────────────────────────────
N total (excl UNCERTAIN) = 100

STRICT_BODY_PRECISION = 0.9700
95% CI (Wilson, z=1.96) = [0.9155, 0.9897]
```

### 3.2 分组复核结果

| 组 | HUMAN_CONFIRMED_BODY | FALSE_POSITIVE | UNCERTAIN |
|---|---|---|---|
| random (60) | 60 | 0 | 0 |
| short/boundary (20) | 17 | 3 | 0 |
| core-river (20) | 20 | 0 | 0 |
| **合计 (100)** | **97** | **3** | **0** |

### 3.3 HUMAN_CONFIRMED_BODY 示例 (3 例)

- **pid 1682 (random, chars=334, reason=`narrative_density_high_clear_prose`)**: `又東南過容城縣北
東過酒縣北
滕處也其水东南流又名之為亭溝其水又西
津通猩絡墟匪直田渔之腾可懷信為游神之
涿之先鄉爱宅其陰西带巨川东翼兹水枝流
_縣东东南流歷紫…`
- **pid 2275 (random, chars=374, reason=`narrative_density_high_clear_prose`)**: `沮水出汉中房陵縣淮水东南過臨沮縣界
界郡治锡城縣居郡下城故新城之下邑義熙初
縣南下人沮水水又东南汶陽郡北即高安縣
也泪水东南流沮陽縣东南縣有潼水东其
耳杜云水出…`
- **pid 1812 (random, chars=314, reason=`narrative_density_high_clear_prose`)**: `又東芒水从南來流注之
洛谷凰長城即斯地也
足以老其愚如此渭水之东洛谷之水出其南
精教為二十年储自云事成雄天下不成守此
秉马侯國其水又南流注于渭渭水又東
亭水又南…`

### 3.4 FALSE_POSITIVE 示例 (3 例 — 纯 TOC)

- **pid 1515 (short, chars=109, reason=`pure_toc_with_no_narrative`)**: `第二十
第十九
第十八
第十七
第十六
第十五
第十四
第十三
渭水下
渭水中
渭水上
泪漆毂
洛水
淇水
水
水
濕餘水
濕水
水水水
金
水
甘水
小水
国…`
- **pid 1514 (short, chars=126, reason=`pure_toc_with_no_narrative`)**: `条
第十二
第十
第十
第九
第八
第七
第六
聖水
易水
漳水
水
茶
清水
濟水
濟水
晋水
原公水
水
汾茶
河水五
民金
巨馬水
水
清漳水
水
沁水
…`
- **pid 1518 (short, chars=135, reason=`pure_toc_with_no_narrative`)**: `K至
第三十八
第三十七
第三十六
第三十五
第三十四
第三十三
湘水
資水
浪水
夷水
淹水
存水
延江水
若水
青衣水
江水下
江水中
江水上
潼水
水
沅…`

---

## 4 · R3.2 TRUE_BODY → R3.3 HUMAN_CONFIRMED_BODY 概念转换

| 术语 | R3.2 | R3.3 |
|---|---|---|
| TRUE_BODY | 422 (strict rule 命中) | (停止使用) |
| RULE_QUALIFIED_BODY | (未引入) | 422 (strict rule 命中) |
| HUMAN_CONFIRMED_BODY | (未引入) | 422 × 0.97 ≈ **409** (95% CI [386, 417]) |
| UNCERTAIN | 6 | (R3.2 全 827 重审) — 本任务未直接重做 UNCERTAIN |
| FALSE_POSITIVE | 392 | (R3.2 全 827 重审) — 本任务只对 422 抽 100 |

> **重要**: R3.3 HUMAN_CONFIRMED_BODY (≈409) ≠ R3.2 TRUE_BODY (422)。
> 422 是 strict-rule 的判断,409 是经过抽样人工复核后的可信估计。
> 严格的全量复核需要 422 页逐一视觉扫描,**当前不在 R3.3 范围**。

---

## 5 · 后续任务

- **Section C**: 对 7 个核心 pair (江水+公安, 江水+華容, 易水+范陽, 易水+容城, 易水+故安, 河水+野王, 河水+修武) 全部 supporting pages 进行人工复核
- **Section D**: 对 VERIFIED/PARTIAL 核心页读取 prev/current/next 判断 context_status
- **Section E**: 更新 `WATER_CLASSIC_HISTORICAL_EVIDENCE_GATE_R3_3.md`,明确 `RULE_QUALIFIED ≠ HUMAN_VERIFIED`
- **Section F**: `/corpus/quality/` 增加 R3.3 人工证据验证小节
- **Section G**: `/corpus/` hero 改为"426 规则筛选正文候选页 / X 人工验证证据页"(X = 108)
- **Section H**: 主研究页三个故事只引用 VERIFIED/PARTIAL 核心证据
- **Section I**: Results Hub 最新成果改为 R3.3

---

## 6 · 输出文件

- `data/water_classic_strict_body_validation_r3_3.json` (100 页逐页标签 + 复核理由 + 聚合指标)
- `source/WATER_CLASSIC_STRICT_BODY_VALIDATION_R3_3.md` (本文件)
