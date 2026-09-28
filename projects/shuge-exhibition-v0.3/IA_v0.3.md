# SHUGE DH Exhibition v0.3 — Information Architecture

**Status:** v0.2 COMPLETE → v0.3 Digital Exhibition Refinement
**Goal:** upgrade v0.2 from "technical demonstration" to "public digital humanities exhibition"
**Companion doc:** `DESIGN_v0.3.md` (visual spec)

---

## 1. Site Map (v0.3)

```
shuge-exhibition-v0.3/
│
├── index.html                       # 总览 — 5 展厅 + 5 case study 导览 + 治理指标
│
├── cases/                           # 5 个完整 case studies (新)
│   ├── case1/index.html             # 水经注数字生命史
│   ├── case2/index.html             # 古代水利与河防
│   ├── case3/index.html             # 建筑营造知识
│   ├── case4/index.html             # 乃粒跨文本互证
│   └── case5/index.html             # AI-assisted historical research
│
├── rooms/                           # 5 个展厅 (v0.2 升级:5-section 结构)
│   ├── room1/index.html             # From Catalogue to Research Infrastructure
│   ├── room2/index.html             # The Life of a Book: 水经注 Case Study
│   ├── room3/index.html             # Historical Hydrology & River Defense
│   ├── room4/index.html             # Architecture & Construction Knowledge
│   └── room5/index.html             # AI-assisted Historical Research
│
├── css/style.css
├── js/main.js
│
└── data/                            # 16 JSON 文件 (12 继承 + 4 新增)
    ├── (12 v0.2 继承)
    ├── case_studies.json            # NEW — 5 case studies (6 sections)
    ├── evidence_cards_v3.json       # NEW — 12 升级版 cards (4 新字段)
    ├── na_li_cross_textual.json     # NEW — 乃粒跨文本互证
    └── room_intros.json             # NEW — 每个 room 5-section 内容
```

---

## 2. URL Conventions

| URL pattern | Page type |
|---|---|
| `/projects/shuge-exhibition-v0.3/` | 总览 (index.html) |
| `/projects/shuge-exhibition-v0.3/cases/caseN/` | case study N (1-5) |
| `/projects/shuge-exhibition-v0.3/rooms/roomN/` | room N (1-5) |
| `/projects/shuge-exhibition-v0.3/data/*.json` | read-only data |
| `/projects/shuge-exhibition-v0.3/css/style.css` | stylesheet |
| `/projects/shuge-exhibition-v0.3/js/main.js` | scripts |

---

## 3. Page-by-Page IA

### 3.1 `index.html` (总览)

**Audience:** new visitor, general public.

**Sections (in order):**
1. **Site title + subtitle** — "书格数字人文研究站 · v0.3"
2. **Site intro** — 1 paragraph, 5 sentences (what + why + how)
3. **Governance badges** — 6 indicators (LEAKAGE=0, ABSTENTION=PASS, etc.)
4. **5 Cases block** — 5 cards linking to `cases/caseN/`
5. **5 Rooms block** — 5 cards linking to `rooms/roomN/`
6. **Take-away**

---

### 3.2 `cases/case1/` (水经注数字生命史)

**Audience:** digital humanities researcher, library scientist.

**Sections (6 + takeaway):**
1. **Question** — research question
2. **Source** — work metadata + OCR engine + collection membership + workspace
3. **Evidence** — summary + 3 sample citation_ids + 2 page viewer framework refs
5. **Citation** — total count + format spec + immutable_since
5. **Interpretation Boundary** — 5 limitations + 4 regression gates
6. **Further Research** — 4 future directions
7. **Take-away** — 2-3 sentence distillation

---

### 3.3 `cases/case2/` (古代水利与河防)

**Sections (6 + takeaway):**
1. **Question** — collection definition question
2. **Source** — collection_id + definition version + corpus fingerprint + work seeds + include terms
3. **Evidence** — membership distribution + rebuild test results
4. **Citation** — total count + sample IDs + works_in_collection count
5. **Interpretation Boundary** — 5 limitations (cross-collection, manual preservation, etc.)
6. **Further Research** — 3 future directions
7. **Take-away**

---

### 3.4 `cases/case3/` (建筑营造知识)

**Sections (6 + takeaway):**
1. **Question** — collection definition question
2. **Source** — collection_id + work seeds + include terms + cross-collection overlap
3. **Evidence** — membership distribution + cross-collection overlap
4. **Citation** — total + sample IDs
5. **Interpretation Boundary** — 3 limitations + 3 gates
6. **Further Research** — 3 future directions
7. **Take-away**

---

### 3.5 `cases/case4/` (乃粒跨文本互证)

**Sections (6 + takeaway):**
1. **Question** — cross-textual research question
2. **Source** — primary work (天工开物) + 4 secondary works + terms probed
3. **Evidence** — cross_textual_examples table (term × work grid)
4. **Citation** — format + unique_work_ids + immutability
5. **Interpretation Boundary** — 4 limitations + 4 gates
6. **Further Research** — 3 directions
7. **Take-away**

---

### 3.6 `cases/case5/` (AI-assisted Historical Research)

**Sections (6 + takeaway):**
1. **Question** — AI role question
2. **Source** — 6 system layers + 4 AI-does-NOT-do items
3. **Evidence** — 6 governance metrics + evidence_card_count
4. **Citation** — v0.3 fields present + format
5. **Interpretation Boundary** — 6 limitations + 4 human-held boundaries
6. **Further Research** — 5 directions
7. **Take-away**

---

### 3.7 `rooms/room1/` (升级:5-section)

**Audience:** infrastructure engineer, librarian.

**5 sections:**
1. **Introduction** — 3-sentence framing
2. **Objects** — 5 .object-card items (each: name + description + kind tag)
3. **Evidence** — 9 milestones timeline (v0.2 retained) + governance metrics
4. **Take-away** — inherited
5. **Further Reading** — 3 references

---

### 3.8 `rooms/room2/` (升级:5-section)

**5 sections:**
1. **Introduction** — 1 paragraph (Water Classic life)
2. **Objects** — 5 items (PDF / OCR text / 60-page sample / Page Viewer Framework / Collection)
3. **Evidence** — 60-page table + 5 page viewer frameworks
4. **Take-away**
5. **Further Reading** — 3 references

---

### 3.9 `rooms/room3/` (升级:5-section)

**5 sections:**
1. **Introduction** — collection framing
2. **Objects** — 5 items (work seeds / page members / terms / snapshot / cards)
3. **Evidence** — 30-page sample + collection governance table + 6 evidence cards
4. **Take-away**
5. **Further Reading** — 3 references

---

### 3.10 `rooms/room4/` (升级:5-section)

**5 sections:**
1. **Introduction** — collection framing
2. **Objects** — 5 items
3. **Evidence** — 30-page sample + cross-collection compare + 6 evidence cards
4. **Take-away**
5. **Further Reading** — 3 references

---

### 3.11 `rooms/room5/` (升级:5-section)

**5 sections:**
1. **Introduction** — AI role framing
2. **Objects** — 5 items (12 cards / 3 workspaces / 6 layers / 6 metrics / Citation Viewer)
3. **Evidence** — 12 evidence_cards_v3 (with 4 new fields) + 3 workspaces
4. **Take-away**
5. **Further Reading** — 3 references

---

## 4. Cross-Page Navigation

Every page has a `.topnav` with:
- 总览 (top-level)
- 5 展厅 (rooms)
- 5 案例 (cases) [v0.3 NEW]
- v0.2 链接 (backwards compatibility)
- GitHub repo link (right-aligned)

Every case study has a `.case-study-back` returning to its related room (if any).

---

## 5. Data Dependencies

| JSON file | Used by | Required |
|---|---|---|
| `manifest.json` | index.html | yes |
| `works.json` | index.html, rooms | yes |
| `collections.json` | rooms 3, 4, cases 2, 3 | yes |
| `citations.json` | rooms 3, 4 | yes |
| `institutions.json` | rooms 2 | yes |
| `workspaces.json` | rooms 5, case 5 | yes |
| `water_classic_pages.json` | room 2 | yes |
| `hydrology_pages.json` | room 3 | yes |
| `architecture_pages.json` | room 4 | yes |
| `evidence_cards.json` | rooms 3, 4 (v0.2 backward compat) | yes |
| `timeline.json` | room 1 | yes |
| `map_placeholder.json` | index.html, room 1 | yes |
| `case_studies.json` | cases (all 5) | yes (v0.3 NEW) |
| `evidence_cards_v3.json` | room 5, case 5 | yes (v0.3 NEW) |
| `na_li_cross_textual.json` | case 4 | yes (v0.3 NEW) |
| `room_intros.json` | rooms (all 5 — used to populate Introduction / Objects / Further Reading) | yes (v0.3 NEW) |

---

## 6. Read-only DB Constraints (inherited from v0.1, v0.2, P5-D)

- All data via `SELECT` only — no `INSERT`/`UPDATE`/`DELETE`
- Sandbox copy: `shutil.copy(shuge.db, /tmp/v03_export.db)` + `sqlite3.connect('file:/tmp/v03_export.db?mode=ro', uri=True)`
- 5 work post_ids: 124575 (水经注) / 48341 (河防一览) / 44159 (工程做法) / 168491 (园冶) / 211203 (天工开物)
- Collection IDs: 1 (historical-hydrology) / 2 (architecture-construction)
- DB size frozen at 45,989,888 bytes (P5-D 终态)

---

## 7. Component Inventory (v0.3)

| Component | New in | Used by |
|---|---|---|
| `.case-study-hero` | v0.3 | all 5 cases |
| `.case-section` | v0.3 | all 5 cases |
| `.section-num` + `.section-label` | v0.3 | all 5 cases |
| `.objects-grid` + `.object-card` | v0.3 | all 5 rooms |
| `.room-introduction` | v0.3 | all 5 rooms |
| `.room-objects` | v0.3 | all 5 rooms |
| `.room-evidence` | v0.3 | all 5 rooms |
| `.room-takeaway` | v0.3 | all 5 rooms |
| `.room-further-reading` | v0.3 | all 5 rooms |
| `.takeaway` + `.takeaway-label` | v0.2 (inherited) | all pages |
| `.source-context-block` | v0.3 | room 5, case 5 |
| `.citation-path-block` | v0.3 | room 5, case 5 |
| `.evidence-card-footer-meta` | v0.3 | all evidence cards |
| `.evidence-card-v3` | v0.3 | room 5, case 5 |
| `.case-study-back` | v0.3 | all 5 cases |
| `.nav-cases` (topnav subset) | v0.3 | all pages |

---

## 8. Future Phases (NOT in v0.3 scope)

The following are explicitly **deferred**:

- v0.4 (planned): IIIF image URL exposure + full page image viewer
- v0.5 (planned): cross-collection graph visualization (D3.js, NOT Neo4j)
- v0.6 (planned): Notion sync (requires notion_token)
- v0.7 (planned): embedding-based retrieval (out of v0.3 scope, hard rule)
- v0.8 (planned): PP-OCRv5 secondary OCR for 天工开物 POOR pages
- v0.9 (planned): Harvard OpenTOK / Wayback path integration

v0.3 stops here. After delivery, do not enter next phase.

---

**Stop after completion. Do not enter next phase.**