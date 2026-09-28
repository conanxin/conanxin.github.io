# SHUGE DH Research Platform v0.7 — IA

## 信息架构总览

v0.7 在 v0.6 平台之上加入「Research Writing」作为第 13 个一级栏目。v0.7 不再只是数据/项目/田野的展示层,而是 **evidence-backed writing environment**: 每个 Research Project 现在承载完整的 Draft(草稿),Draft 由 Paragraphs 构成,每个 Paragraph 必须 binding 到 citation / evidence card / field note。

```
Research Platform v0.7
├── 1. 总览 (Overview)
├── 2. Rooms (5 展厅, 数字博物馆叙事)
├── 3. Cases (5 案例研究)
├── 4. Evidence Explorer (54 nodes · 2310 edges)
├── 5. Places (10 places, 5 categories)
├── 6. Fieldwork (田野工作桥)
├── 7. Workspaces (3 research workspaces)
├── 8. Field Notes (4 demo notes)
├── 9. Timeline (4 layers · 18 events)
├── 10. Projects (3 research projects, drilldown)
├── 11. Place Profiles (10 place profiles, drilldown)
├── 12. Field Note Input (input spec + rules + YAML demo)
└── 13. Research Writing ★ NEW v0.7
    ├── /research-writing/  (hub: 3 cards + stats + binding_state distribution)
    ├── /drafts/  (3 drafts · 15 sections · 27 paragraphs · revision history)
    └── /bibliography/  (3 works · 1 institution · 6 citations)
```

**15 个一级栏目**(新增 /research-writing/ hub + /drafts/ + /bibliography/)

---

## 1. /research-writing/ (Hub)

**作用**: Research Writing 的总入口。3 个 draft 卡片 + stats + binding_state pie。

**原型结构**:

| 区域 | 类型 | 内容 |
|---|---|---|
| Masthead | 静态 | SHUGE DH Research Platform · v0.7 |
| Topnav | 静态 | 13 栏目 |
| Hero | 静态 + JS | title_zh / title_en / version / generated_at / boundary badge |
| Stats Table | JS | total_drafts · total_paragraphs · total_word_count · total_citation_links · total_field_note_bindings · total_revisions |
| Binding State Distribution | JS | pie/bar: ANNOTATED · CLAIMS_BOUND · EVIDENCE_BOUND · FIELD_NOTE_BOUND · METADATA_ONLY |
| Draft Cards | JS | 3 cards: draft_id + status badge + word_count + citations_used + last_revised_at |
| Cross-link Strip | 静态 | Conan's Archive Bridge: READ-ONLY ID LINK · 6 invariants |
| Footer | 静态 | link to DESIGN + IA |

---

## 2. /drafts/ (Draft Detail)

**作用**: 展示 3 个 Research Draft 的完整结构。

**原型结构**:

| 区域 | 类型 | 内容 |
|---|---|---|
| Masthead | 静态 | 同上 |
| Topnav | 静态 | 13 栏目 |
| Hero | 静态 | title · version · drafts count · total word count |
| Draft Filter | JS | 按 status 过滤 (IN_PROGRESS / LOCKED / ABANDONED) |
| Draft Detail | JS drilldown | 5 sections: outline + sections detail + evidence links + revision history + bibliography preview |
| Revision History Timeline | JS | rev-1/2/3 with at / author / summary / sections_modified / paragraphs_added/revised |
| Stats Table | JS | per-draft: sections · citations · word_count · revisions |
| Footer | 静态 | |

---

## 3. /bibliography/ (Bibliography Layer)

**作用**: 聚合 citations + works + institutions,作为 Draft 引用的统一视图。

**原型结构**:

| 区域 | 类型 | 内容 |
|---|---|---|
| Masthead | 静态 | 同上 |
| Topnav | 静态 | 13 栏目 |
| Hero | 静态 | title · version · works count · institutions · citations |
| Filter Bar | JS | by dynasty / language / collection_slug / cited_count range |
| Institutions Strip | JS | 1 inst-shuge · type=publisher · url (read-only ID) |
| Works Grid | JS | 3 works · work_id · title · institution_id |
| Citations Table | JS | citation_id → work_id → page_seq → short_form_zh → cited_count → cited_in_drafts[] |
| Stats | JS | works · institutions · citations · max_citation_count · total_drafts_referenced |
| Footer | 静态 | |

---

## 4. URL 路径

```
/projects/shuge-exhibition-v0.7/
├── /                                              总览
├── /projects/                                     3 research projects
├── /places-profile/                               10 place profiles
├── /field-note-input/                             input spec
├── /archive-bridge/                               bridge schema
├── /research-writing/                             ★ NEW: writing hub
├── /drafts/                                       ★ NEW: 3 drafts
├── /bibliography/                                 ★ NEW: works + institutions + citations
├── /evidence-explorer/                            54 nodes
├── /places/                                       10 places
├── /fieldwork/                                    fieldwork schema
├── /workspaces/                                   3 workspaces
├── /field-notes/                                  4 notes
├── /timeline/                                     4 layers · 18 events
├── /cases/case1-5/                                5 cases
└── /rooms/room1-5/                                5 rooms
```

---

## 5. 数据流

```
v0.6 layer                  v0.7 layer
─────────────               ──────────
research_projects.json  ──→  research_drafts.json (per-project drafts)
research_projects.json  ──→  evidence_paragraphs.json (per-draft paragraphs)
citations.json         ──→  bibliography.json (works + institutions + citations)
archive_bridge.json    ──→  writing_invariants.json (v0.7 ID-only contract)
```

**每条 citation 引用关系**:
- `research_drafts.json → drafts[].citation_ids[]` (聚合)
- `research_drafts.json → drafts[].evidence_links[]` (拓扑)
- `evidence_paragraphs.json → paragraphs[].citation_ids[]` (段落级)
- `bibliography.json → citations[].cited_in_drafts[]` (反向索引)

**每条 field_note 引用关系**:
- `research_drafts.json → drafts[].field_note_ids[]` (聚合)
- `evidence_paragraphs.json → paragraphs[].field_note_ids[]` (段落级,田野 claim 必须)

---

## 6. 与 Conan Xin Archive Bridge (v0.7 扩展)

v0.6 已建立 6 invariants。v0.7 在此之上新增 4 个 local-only namespaces + 4 个 schema additions,确保草稿/段落/claim/section/revision 全部为 local-only,绝不暴露到 Archive。

详见 `DESIGN_v0.7.md` §3.4 与 `data/writing_invariants.json`。

---

## 7. 完整页面清单 (28 个 HTML + 32 个 JSON)

```
HTML pages (28 routes, 1 root + 13 一级栏目 + 10 二级栏目):
├── /index.html (总览)
├── /projects/index.html
├── /places-profile/index.html
├── /field-note-input/index.html
├── /archive-bridge/index.html
├── /research-writing/index.html ★ NEW
├── /drafts/index.html ★ NEW
├── /bibliography/index.html ★ NEW
├── /evidence-explorer/index.html
├── /places/index.html
├── /fieldwork/index.html
├── /workspaces/index.html
├── /field-notes/index.html
├── /timeline/index.html
├── /cases/case1-5/index.html
└── /rooms/room1-5/index.html

JSON data files (32 files):
├── v0.3 inherited (12):
│   architecture_pages.json · case_studies.json · citations.json · collections.json
│   evidence_cards.json · evidence_cards_v3.json · evidence_graph.json
│   hydrology_pages.json · institutions.json · manifest.json · na_li_cross_textual.json
│   room_intros.json · timeline.json · water_classic_pages.json · works.json
├── v0.4 inherited (4):
│   fieldwork_schema.json · places.json · place_evidence.json · workspaces.json
├── v0.5 inherited (4):
│   research_questions.json · research_workspaces.json · field_notes.json
│   timeline_layers.json
├── v0.6 inherited (4):
│   archive_bridge.json · research_projects.json · place_profiles.json
│   field_note_input_spec.json · map_placeholder.json
└── v0.7 new (4): ★
    research_drafts.json · evidence_paragraphs.json · bibliography.json
    writing_invariants.json
```

---

## 8. 复用策略

- **Topnav 复用**:13 栏目,所有页面共用
- **CSS 复用**: style.css 已继承 29.6 KB,v0.7 追加 ~80 行 paragraph-specific + claim + binding_state styles
- **JS 复用**: 沿用 fetch + render pattern,新增 toggle-drilldown + stats cards + filter pattern
- **数据复用**: v0.7 不复制 citations / works / institutions 原数据,仅记录引用次数与 short_form

---

## 9. 边界(完整继承 v0.6 + v0.7 新增)

| 边界 | v0.6 | v0.7 |
|---|---|---|
| 不下载资源 | ✓ | ✓ |
| 不修改数据库 | ✓ | ✓ |
| 不运行 OCR | ✓ | ✓ |
| 不改变 Citation ID | ✓ | ✓ |
| 不引入 Neo4j | ✓ | ✓ |
| 不引入 embeddings | ✓ | ✓ |
| 不引入后台服务 | ✓ | ✓ |
| 不抓取 shuge.org | ✓ | ✓ |
| 不抓取 Conan Xin Archive | ✓ | ✓ |
| 不存实际照片 | ✓ | ✓ |
| 不引入 iFrame / submodule | ✓ | ✓ |
| 不引入 LLM 自动写作 | (隐含) | ★ 显式边界 |
| 不引入向量数据库 | ✓ | ✓ |
| 不锁定草稿(无 LOCKED → PUBLISHED 路径) | (n/a) | ★ 显式边界 |
| body_excerpt ≤ 200 字符 | (n/a) | ★ 显式边界 |
| evidence_links 不暴露 full_text | (n/a) | ★ 显式边界 |

---

## 10. 推送策略

- ✅ 自包含 v0.7 目录,/home/conanxin/conanxin.github.io/projects/shuge-exhibition-v0.7
- ✅ 不会污染 v0.6 或之前版本
- ✅ git add projects/shuge-exhibition-v0.7/ 一次性提交
- ✅ commit message: `feat(shuge-exhibition-v0.7): Research Writing Environment — 3 drafts · 27 paragraphs · bibliography + archive bridge invariants`
- ✅ push origin main
- ✅ 完成后停止,不进入下一阶段(per user explicit instruction)