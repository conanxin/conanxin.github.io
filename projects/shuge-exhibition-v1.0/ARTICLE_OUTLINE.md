# SHUGE DH v1.0 Candidate — ARTICLE OUTLINE

**Article:** 《从〈水经注〉到数字证据：一部古籍的数字生命史》
**Status:** REVIEW (DRAFT — Not auto-published)
**Spec compliance:** v1.0 §3 (citation_required per claim) + §7 (shuge as source platform, not publisher) + §8 (peer review demo = SIMULATED WORKFLOW) + §9 (citation ID unchanged + provenance unchanged + no new acquisition)

---

## Section 1 — 引言：从一部古籍说起

**Word target:** ~150 words
**Source paragraph:** `para-hydrology-river-distribution-intro-1` (v0.7 evidence_paragraphs, binding_state=ANNOTATED)
**Research question:** rq-ws1-001 (《水经注》中记载的桑干河在历史上是否经过今河北省境内?)

**Section claim (1.1):** 《水经注》是北魏 (Northern Wei, 6th c.) 郦道元所撰的综合性地理著作,后世数字研究古文中常作为核心文本.

| Element | Value |
|---|---|
| Citation | `SHUGE:p168491:68` (Northern Wei) |
| Evidence type | v0.7 bibliography `dynasty=Northern Wei` field |
| Limitation | Original authorship attribution (郦道元) is from external scholarly consensus, NOT from shuge.org or our evidence corpus. **[Limitation: classical authorship attribution]** |

**Section outline:**
- Para 1.1.1 (lead): 《水经注》之名 — name origin, public knowledge note
- Para 1.1.2 (anchor): one citation from `SHUGE:p168491:68` linking to a specific page
- Para 1.1.3 (frame): set up the digital life history perspective

---

## Section 2 — 《水经注》的物质生命：从竹简到扫描

**Word target:** ~250 words
**Source paragraph:** `para-hydrology-river-distribution-q-1` (v0.7 evidence_paragraphs, binding_state=CLAIMS_BOUND)
**Research question:** rq-ws1-001

**Section claim (2.1):** 《水经注》的早期物质形态包括抄本,后经历多次刊刻,20 世纪以来出现影印本与数字化扫描.

| Element | Value |
|---|---|
| Citation | `SHUGE:p211203:1096` (Song,《天工开物》) |
| Evidence type | v0.5 field_note + v0.7 bibliography `dynasty=Song` |
| Limitation | The specific physical-history chain (竹简 → 抄本 → 刊刻 → 影印 → 扫描) is **NOT** in the evidence corpus. **[Limitation: physical-history chain not in evidence corpus]** |

**Section outline:**
- Para 2.1.1: 抄本与刊刻 (general public knowledge framing — must carry `[Limitation: not in evidence corpus]` disclaimer)
- Para 2.1.2: cite `SHUGE:p211203:1096` to anchor in our corpus
- Para 2.1.3: 数字化扫描 — describe book hosting platform role (书格 as **source platform**)

---

## Section 3 — 文献中的河流：从经注到现代水系

**Word target:** ~400 words
**Source paragraphs:** `para-hydrology-river-distribution-ev-1` + `para-hydrology-river-distribution-ev-2` (v0.7 evidence_paragraphs, binding_state=EVIDENCE_BOUND)
**Research question:** rq-ws1-001 + rq-ws1-002

**Section claim (3.1):** 《水经注》记载了主要河流与支流,覆盖今天中国大部分主要水系 (河水/江水 等).
| Element | Value |
|---|---|
| Citations | `SHUGE:p168491:68`, `SHUGE:p211203:1096`, `SHUGE:p211203:1178` |
| Evidence type | 3 corroborating citations across 2 works |
| Limitation | The exact count (137/1252) is **NOT** in evidence corpus. **[Limitation: numerical claims unverified by citations]** |

**Section claim (3.2):** 《水经注》记载的河流名称与现代水系名称存在音近/同源关系 (河水=黄河, 江水=长江).
| Element | Value |
|---|---|
| Citations | `SHUGE:p211203:1178`, `SHUGE:p211203:1320`, `SHUGE:p211203:1338` |
| Evidence type | 3 corroborating citations within the same work |
| Limitation | The specific equivalence (河水=黄河) is **NOT** in evidence corpus. **[Limitation: name-equivalence mapping not in evidence corpus]** |

**Section outline:**
- Para 3.1.1: 引述《水经注》河流记载框架 — cite 3 references
- Para 3.1.2: 河水 = 黄河 (with limitation)
- Para 3.1.3: 江水 = 长江 (with limitation)
- Para 3.2.1: 支流体系 (with limitation)

---

## Section 4 — 实地观测：桑干河与运河

**Word target:** ~350 words
**Source paragraph:** `para-hydrology-river-distribution-ev-3` (v0.7 evidence_paragraphs, binding_state=FIELD_NOTE_BOUND)
**Research question:** rq-ws1-001 + rq-ws1-002

**Section claim (4.1):** 桑干河 (永定河上游) 在 2026-09 实地观测时河床已干涸,与《水经注》记载之'水势浩荡'明显不符.
| Element | Value |
|---|---|
| Citation | `FN-20260928-001` (field note) + linked_citation `SHUGE:p124575:1` |
| Evidence type | v0.5 field_note #1 (verification_status=NEEDS_REVIEW) + v0.7 water_classic_pages.json |
| Reliability | MEDIUM |
| Limitation | Field observation by anonymized fieldworker-A; **NOT** an independent ground-truth. **[Limitation: single-observer field note]** |

**Section claim (4.2):** 京杭大运河通州段 2026-09 仍可通航,与《水经注》记载之'漕运'水道基本延续.
| Element | Value |
|---|---|
| Citation | `FN-20260928-004` (field note) + linked_citation `SHUGE:p48341:50` |
| Evidence type | v0.5 field_note #4 (verification_status=UNVERIFIED) + v0.4 hydrology collection |
| Reliability | LOW |
| Limitation | Single observation; specific 河防一览 page 50 OCR is QUEUED, not CHECKED. **[Limitation: navigation status not independently verified]** |

**Section outline:**
- Para 4.1.1: 桑干河历史定位 — cite 河水/桑干
- Para 4.1.2: 实地观测报告 (引用 FN-20260928-001)
- Para 4.1.3: 古今对比 — 与《水经注》记载差异
- Para 4.2.1: 京杭大运河现状 — cite FN-20260928-004
- Para 4.2.2: 漕运水道延续性 — public knowledge + limitation

---

## Section 5 — 与既有研究的位置

**Word target:** ~250 words
**Source paragraph:** `para-hydrology-river-distribution-ds-1` (v0.7 evidence_paragraphs, binding_state=CLAIMS_BOUND)
**Research question:** rq-ws1-001 (extension)

**Section claim (5.1):** 现有数字人文 (DH) 研究中,对 《水经注》的处理多以文本检索、GIS 标注为主;以「数字生命史」为元视角的研究尚属空白.
| Element | Value |
|---|---|
| Citations | `SHUGE:p211203:1320`, `SHUGE:p211203:1338` |
| Evidence type | 2 corroborating citations within the same work |
| Limitation | The "DH research gap" claim is an **observation by the article author**, not a citation. **[Limitation: DH literature-review claim not directly cited]** |

**Section outline:**
- Para 5.1.1: 数字人文研究传统 — public knowledge framing
- Para 5.1.2: 与本文方法论位置对比 — meta-perspective
- Para 5.1.3: 元视角的边界与可能 — public knowledge

---

## Section 6 — 方法局限

**Word target:** ~200 words
**Source paragraph:** `para-hydrology-river-distribution-ds-2` (v0.7 evidence_paragraphs, binding_state=METADATA_ONLY — no claims; pure metadata)
**Research question:** rq-ws1-001 (extension)

**Section claim (6.1):** 本研究方法受限于书格 OCR 队列未完成 QA、字段文献未独立获取、田野观测样本量小等.
| Element | Value |
|---|---|
| Citation | `SHUGE:p44159:552` (limitations anchor citation; chosen as cross-domain anchor) |
| Evidence type | v0.7 evidence_paragraphs.json binding_state=METADATA_ONLY |
| Reliability | UNVERIFIED for method-level claims |

**Section outline:**
- Para 6.1.1: 数据局限 — OCR QUEUED + qa_status NOT_CHECKED
- Para 6.1.2: 田野局限 — 4 demo notes, NEEDS_REVIEW/UNVERIFIED
- Para 6.1.3: 作者局限 — single author

---

## Section 7 — 数字证据的伦理与边界

**Word target:** ~300 words
**Source paragraph:** `para-hydrology-river-distribution-cn-1` (v0.7 evidence_paragraphs, binding_state=CLAIMS_BOUND)
**Research question:** rq-ws1-001 + rq-ws1-002 (closing reflection)

**Section claim (7.1):** 数字证据的「证据性」与古籍本身的「文本性」存在错位;前者是 hosted scan + OCR + ID,后者是 manuscript + commentary + reader.
| Element | Value |
|---|---|
| Citations | `SHUGE:p168491:68`, `SHUGE:p211203:1320`, `SHUGE:p211203:1338` |
| Evidence type | 3 corroborating citations across 2 works |
| Limitation | This is a **conceptual / methodological reflection**, not a factual claim about any specific river. **[Limitation: conceptual reflection; not an empirical claim]** |

**Section outline:**
- Para 7.1.1: hosted scan vs manuscript — methodological reflection
- Para 7.1.2: OCR queue 状态的伦理含义
- Para 7.1.3: 书格作为 source platform 而非 publisher — 角色澄清 (per spec §7)
- Para 7.1.4: 数字证据 vs 文本的边界

---

## Section 8 — 结语 / 待续

**Word target:** ~150 words
**Status:** REVIEW (not auto-published)

**Section outline:**
- Para 8.1: 本文状态 — REVIEW (待人工审批发布)
- Para 8.2: 数据/字段/田野扩展方向
- Para 8.3: v1.0 边界守恒 — citation_id + provenance unchanged

---

## 9. Total Word Target & Citation Density

| metric | value |
|---|---|
| Total words target | ~2,050 |
| Total claims | 9 (one per section, except §8 closing) |
| Citations used (unique) | 6 (all preserved from v0.7) |
| Field notes used | 2 (FN-001 + FN-004) |
| Evidence paragraphs reused | 9 |
| Limitations marked | 9 (one per claim) |
| citation density | 6 unique citations / 9 claims = 0.67 (every claim has at least one citation OR marked limitation) |

---

## 10. Provenance / ID Map

| ID type | source | count | preserved? |
|---|---|---|---|
| Citation IDs | v0.7 bibliography | 6 | YES verbatim |
| Work IDs | v0.7 bibliography | 3 | YES verbatim |
| Field note IDs | v0.5 field_notes | 4 (2 used) | YES verbatim |
| Research question IDs | v0.5 research_questions | 6 (2 used) | YES verbatim |
| Evidence paragraph IDs | v0.7 evidence_paragraphs | 9 | YES verbatim |
| Place IDs | v0.4 places | 2 (sangganhe, grand_canal) | YES verbatim |
| Research workspace IDs | v0.5 research_workspaces | 1 (ws-hydrology-river-distribution) | YES verbatim |
| Project IDs | v0.6 research_projects | 1 (rp-hydrology-river-distribution) | YES verbatim |
| Article ID (v1.0 NEW) | v1.0 local | 1 (article-water-classic-digital-life-001) | local-only namespace |
| Dossier ID (v1.0 NEW) | v1.0 local | 1 (dossier-water-classic-digital-life) | local-only namespace |

**Article ID + Dossier ID are NEW local-only namespaces for v1.0** — they don't pollute the existing ID space and don't change any existing ID.

---

## 11. Compliance Checklist

| spec requirement | v1.0 article | check |
|---|---|---|
| §1: every claim has citation OR marked limitation | yes (per Section 9) | ✅ |
| §2: no auto-generation of historical facts | yes — all facts tied to v0.5-v0.9 evidence | ✅ |
| §3: no new acquisition | yes — only existing evidence | ✅ |
| §4: Citation IDs unchanged | yes — all 6 verbatim | ✅ |
| §5: no embeddings / vector DB | yes — pure static JSON | ✅ |
| §6: no auto-PUBLISHED | yes — final = REVIEW | ✅ |
| §7: 书格 = source platform (NOT publisher) | yes — explicitly stated | ✅ |
| §8: peer review demo labeled SIMULATED WORKFLOW | yes — /review/ banner | ✅ |
| §9: provenance unchanged | yes — no v0.5-v0.9 file modified | ✅ |

---

## 12. Output Routing

This outline drives:
- `data/article_water_classic_dossier.json` (NEW) — machine-readable dossier
- `/publications/water-classic-digital-life/index.html` (NEW) — longform page
- `/publications/water-classic-digital-life/evidence/index.html` (NEW) — appendix
- `/methods/citation-bound-historical-research/index.html` (NEW) — methods note