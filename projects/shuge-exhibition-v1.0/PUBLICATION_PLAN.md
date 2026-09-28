# SHUGE DH v1.0 Candidate — PUBLICATION PLAN

**Date:** 2026-09-28
**Status:** REVIEW (DRAFT — Not auto-published)
**Project:** shuge-exhibition-v1.0 · `projects/shuge-exhibition-v1.0/`
**Predecessor:** v0.9 Public Research Portfolio (commit `39a6ec1`)

---

## 1. Working Title

# 《从〈水经注〉到数字证据：一部古籍的数字生命史》

**Short title (zh):** 水经注 · 数字生命史
**Short title (en):** *Shuijing Zhu* · A Digital Life History
**Working version:** v1.0 Candidate

---

## 2. Goal

First real publicly-readable scholarly output of the SHUGE DH Research Platform. Built entirely on existing evidence (no new acquisition, no OCR, no embeddings, no auto-published). Uses only IDs and prose already present in v0.5–v0.9 data + corpus.

The article is a **meta-historical reflection** — not a new research paper on rivers, but a case study of *how* 《水经注》 (Northern Wei, 6th c.) becomes digital evidence: from the original classical text, through the platform's hosting/shuge collecting path, into OCR queue, into citation IDs, into evidence paragraphs, and finally into a public-readable longform page.

---

## 3. Boundaries (硬规则 — 全部继承)

From v0.1-v0.9 + v1.0 new:

- ✅ **不下载新资源** — No new downloads
- ✅ **不修改研究数据库** — Frozen P5-D snapshot
- ✅ **不运行 OCR** — No PP-OCRv5/rapidocr
- ✅ **不改变 Citation ID** — All 6 `SHUGE:p<post_id>:<page_seq>` IDs preserved verbatim
- ✅ **不自动补写历史事实** ★ v1.0 NEW: Every factual claim has at least one `citation_id` OR is marked `[Limitation: unverified]`
- ✅ **不自动 PUBLISHED** ★ v1.0 NEW: Final status = REVIEW unless user explicitly approves
- ✅ **不引入 Neo4j / embeddings / 向量数据库** — Pure static JSON
- ✅ **不引入后台 / GIS server / WebSocket / API server** — Zero endpoint
- ✅ **不抓取 shuge.org / Conan Xin Archive** — ID-only references
- ✅ **不暴露 bibliography full_text** — `full_text_unavailable: true` preserved
- ✅ **书格 ≠ publisher** ★ v1.0 NEW (spec §7): shuge.org is a **source platform / hosting platform**, NOT the original publisher of pre-modern Chinese classics
- ✅ **Peer Review demo 标记** ★ v1.0 NEW (spec §8): Must be labeled `SIMULATED WORKFLOW / NOT EXTERNAL PEER REVIEW`

---

## 4. Article Status Lifecycle

| Status | v1.0 Allowed? | Auto-transitions? | User approval needed? |
|---|---|---|---|
| DRAFT | yes | yes (auto from prior phase) | no |
| REVIEW | yes (v1.0 final) | yes (auto from DRAFT) | no |
| REVISED | yes (if requested) | yes (auto from REVIEW) | yes (recommended) |
| PUBLISHED | **NO** | **NO** | **REQUIRED** — explicit user approval |

**v1.0 final state:** REVIEW (DRAFT → REVIEW automatic; not auto-PUBLISHED)

---

## 5. Deliverables (4 + 3 pages + 2 docs)

### Markdown deliverables (3):
1. `PUBLICATION_PLAN.md` — this file
2. `EVIDENCE_DOSSIER.md` — cite-only claims with provenance
3. `ARTICLE_OUTLINE.md` — section-by-section spec

### HTML pages (3 new):
1. `/publications/water-classic-digital-life/index.html` — longform public page
2. `/publications/water-classic-digital-life/evidence/index.html` — appendix
3. `/methods/citation-bound-historical-research/index.html` — methods note

### HTML updates (2):
1. `/review/index.html` — add SIMULATED WORKFLOW banner
2. `/portfolio/index.html` — add water-classic-digital-life to portfolio articles list

### JSON data (1 new + 1 v0.9 update):
1. `data/institution_roles_v1.0.json` (7.1 KB, NEW)
2. `data/article_water_classic_dossier.json` (NEW, evidence dossier for the article)

### Topnav update:
Add link to `/publications/` from the topnav.

---

## 6. Article Outline (high-level)

| # | Section | Type | Source paragraphs (v0.7 evidence_paragraphs) |
|---|---|---|---|
| 1 | 引言：从一部古籍说起 | narrative + citations | para-hydrology-river-distribution-intro-1 |
| 2 | 《水经注》的物质生命：从竹简到扫描 | narrative + provenance | para-hydrology-river-distribution-q-1 |
| 3 | 文献中的河流：从经注到现代水系 | claims + evidence | para-hydrology-river-distribution-ev-1 / ev-2 |
| 4 | 实地观测：桑干河与运河 | field notes | para-hydrology-river-distribution-ev-3 |
| 5 | 与既有研究的位置 | discussion | para-hydrology-river-distribution-ds-1 |
| 6 | 方法局限 | limitations | para-hydrology-river-distribution-ds-2 |
| 7 | 数字证据的伦理与边界 | discussion + provenance | para-hydrology-river-distribution-cn-1 |

---

## 7. Citation Manifest (final, all 6 preserved from v0.7)

| # | citation_id | work_id | page_seq | short_form | cited_in_article_sections |
|---|---|---|---|---|---|
| 1 | SHUGE:p168491:68 | work-shuge-168491 | 68 | 书海 168491:68 | §1, §3, §7 |
| 2 | SHUGE:p211203:1096 | work-shuge-211203 | 1096 | 书海 211203:1096 | §2, §3 |
| 3 | SHUGE:p211203:1178 | work-shuge-211203 | 1178 | 书海 211203:1178 | §3, §4 |
| 4 | SHUGE:p211203:1320 | work-shuge-211203 | 1320 | 书海 211203:1320 | §5, §7 |
| 5 | SHUGE:p211203:1338 | work-shuge-211203 | 1338 | 书海 211203:1338 | §5, §7 |
| 6 | SHUGE:p44159:552 | work-shuge-44159 | 552 | 书海 44159:552 | §6 (limitations) |

---

## 8. Field Note Integration (4 demo notes)

| note_id | place_id | observation | linked_citations | used_in_section |
|---|---|---|---|---|
| FN-20260928-001 | sangganhe | 桑干河河床已干涸 (实测) | SHUGE:p124575:1 | §4 |
| FN-20260928-004 | grand_canal | 大运河通州段可通航 | SHUGE:p48341:50 | §4 |

---

## 9. Verification Checklist

| item | check | pass? |
|---|---|---|
| All 6 Citation IDs preserved verbatim from v0.7 | grep | TBD |
| No new resources downloaded | git status / no new images | TBD |
| No OCR runs | no PP-OCRv5 / rapidocr calls | TBD |
| No embeddings / vector DB | no /embedding endpoint | TBD |
| Provenance unchanged | bibliography.json byte-equal | TBD |
| Article status = REVIEW (not PUBLISHED) | data | TBD |
| 书格 referenced as source platform (not publisher) | article text + data | TBD |
| Peer Review demo labeled SIMULATED WORKFLOW | /review/ banner | TBD |
| Citation-required per claim rule | EVIDENCE_DOSSIER audit | TBD |
| All HTML routes HTTP 200 | http server | TBD |
| Cross-data integrity 100% | json parse | TBD |
| Git push to main | `git push` exit 0 | TBD |

---

## 10. Final State

**v1.0 result:** A real, publicly-readable scholarly article on 《水经注》's digital life history, with citation-required-per-claim discipline, source-platform-vs-publisher audit, and explicit "REVIEW — not auto-PUBLISHED" status.

**Stop:** v1.0 final. No auto-transition to PUBLISHED. No LLM rewrites. No new downloads.