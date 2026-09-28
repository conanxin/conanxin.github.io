# SHUGE DH Research Platform v0.7 — DESIGN

## 1. 定位

**v0.6 = Research Graph + Project Pages** — 把研究平台从数据层升级到项目层。  
**v0.7 = Evidence-backed Research Writing Environment** — 把项目层升级到 **写作环境** 层。

每个 Research Project 现在可以承载完整的 Research Draft: outline → sections → paragraphs (claims + citations + evidence cards + field notes) → bibliography → revision history。

v0.7 是 v0.6 的「内容下沉路径」,不新增数据层,而是把已经存在的 citations / evidence cards / field notes **编织**进文章结构中。

## 2. 核心问题

v0.6 解决了「研究平台有哪些项目?」(3 个 research projects + 10 个 place profiles)。  
v0.7 解决:**这些项目最终产出什么?** — **草稿、段落、引用、参考文献**。

写作不是一个孤立的活动,它必须严格 evidence-backed: 每段落的每条 claim 都必须:
1. 引用至少一个 citation_id
2. (若是实证 claim) 绑定至少一个 evidence_card_id
3. (若是田野 claim) 绑定至少一个 field_note_id
4. 段落有 binding_state (ANNOTATED / CLAIMS_BOUND / EVIDENCE_BOUND / FIELD_NOTE_BOUND / METADATA_ONLY)

**v0.7 = research environment 而非 content product**。 它是 research team 的写作底座,不输出 published article。

## 3. 核心新增实体

### 3.1 Research Draft (新)

```
draft_id (local)           draft-<slug>
project_id                 rp-* (v0.6 已有)
language                   zh-CN
owner                      research-team
status                     IN_PROGRESS / LOCKED / ABANDONED
outline[]                  section_id + heading_zh + heading_para + claim_count_target
sections[]                 section_id + status + paragraph_ids + citation_ids_used
citation_ids[]             (继承自 project_id)
evidence_card_ids[]        (继承自 project_id)
field_note_ids[]           (继承自 project_id)
evidence_links[]           link_id + citation_id + use_count + first_used_section_id
revision_history[]         rev_id + at + author + summary_zh + sections_modified
linked_archive_note_ids    (FIELD_NOTE ID 引用 Archive)
linked_archive_rq_ids      (RESEARCH QUESTION ID 引用 Archive)
linked_archive_gap_ids     (GAP ID 引用 Archive)
stats                      sections/paragraphs/citations/notes/links/word_count/revisions
```

**为什么是 evidence_links?** 一个 citation 可能在多个 section 中使用,evidence_links 记录首次使用位置 + 使用次数 + section 关联。draft 因此不是「静态文本」,而是「引用拓扑」。

### 3.2 Evidence-backed Paragraph (新)

```
paragraph_id (local)       para-<draft_slug>-<sfx>
draft_id                   draft-*
section_id                 sec-*
order                      integer
title_zh                   段落小标题
body_excerpt               段落正文片段(不超过 200 字;实际段落体在 Markdown 文件中)
claims[]                   cl-* local IDs,每条 claim 对应一段陈述
citation_ids[]             引用的 citation 列表(零个 = 段落无 binding_state)
evidence_card_ids[]         引用的 evidence cards(可选,实证 claim 需要)
field_note_ids[]           引用的 field notes(可选,田野 claim 需要)
owner                      research-team / field-team
status                     OUTLINE / DRAFT / REVISED
binding_state              ANNOTATED / CLAIMS_BOUND / EVIDENCE_BOUND / FIELD_NOTE_BOUND / METADATA_ONLY
word_count                 段落字数估算
binding_rule               claims_required / citation_required_if_claim_external / ...
last_revised_at            ISO8601
```

**binding_state 是 v0.7 核心**:
- `ANNOTATED` — 仅有引文标注,无 claim 结构
- `CLAIMS_BOUND` — 段落有明确 claim,每个 claim 都引用 citation
- `EVIDENCE_BOUND` — CLAIMS_BOUND + 至少一个 evidence_card(实证 claim)
- `FIELD_NOTE_BOUND` — EVIDENCE_BOUND + 至少一个 field_note(田野 claim)
- `METADATA_ONLY` — 无 claim,仅有元信息(如讨论方法局限)

**binding_state 的语义: 写作的证据强度**。一段 FIELD_NOTE_BOUND 的 paragraph 意味着 claim 由实地考察 + 文献 + 证据卡片三重支撑。

### 3.3 Bibliography Layer (新)

聚合 v0.3 citations + v0.6 works + institutions:

```
work_id                   work-shuge-<post_id>
title_zh / title_en       (来自 works.json · v0.3 inherited)
collection_slug           hist-hyd / arch
institution_id            inst-shuge
language                  zh-CN
dynasty                   Northern Wei / Song / Qing / Ming / PRC
page_count_estimate

institution_id             inst-shuge
name_zh / name_en
type                      publisher
url                       (read-only ID reference only)
note                      "Read-only ID reference only. No archive content fetched."

citation_id               SHUGE:p<post_id>:<page_seq>
work_id                   关联 work
short_form_zh / short_form_en
cited_in_drafts[]         draft-* 列表
cited_count               被引用次数
full_text_unavailable     true(永远)
text_source               "P5-D snapshot only (citation ID preserved)"
```

**Bibliography 是只读的引用视图**: 聚合自 citations.json (v0.3) + works.json (v0.3) + institutions.json (v0.3) 的 ID 列表,不复制原文,只复制 ID + 引用次数 + short_form。

### 3.4 Conan Xin Archive Bridge — v0.7 扩展

v0.6 archive_bridge.json 已建立 ID-only 链接边界。v0.7 在此基础上扩展:

**shared ID namespaces**(已有):
- `field_note_id` (FN-*) — v0.5+ 已有
- `research_question_id` (rq-*) — v0.5+ 已有
- `gap_id` (gap-*) — v0.5+ 已有

**新增 local-only namespaces**(v0.7 独有):
- `draft_id` (draft-*) — 仅 v0.7
- `paragraph_id` (para-*) — 仅 v0.7
- `claim_id` (cl-*) — 仅 v0.7
- `section_id` (sec-*) — 仅 v0.7
- `revision_id` (rev-*) — 仅 v0.7

**v0.7 新增 schema fields**:
- `research_drafts.json → drafts[].linked_archive_note_ids` — 引用 FN-*
- `research_drafts.json → drafts[].linked_archive_rq_ids` — 引用 rq-*
- `research_drafts.json → drafts[].linked_archive_gap_ids` — 引用 gap-*
- `evidence_paragraphs.json → paragraphs[].field_note_ids` — 段落级别 FN-* 绑定

## 4. 视觉与交互规范

继承 v0.6 全部规范(数字博物馆 × 学术实验室)。新增:

### 4.1 Draft Page

- **Masthead** — 站点总名 + 当前 project_id 引用
- **Topnav** — 继承 12 栏目 + 新增 /research-writing/ + /drafts/ + /bibliography/
- **Hero** — draft_id + draft_title_zh + draft_title_en + language badge + status badge + owner + last_revised_at
- **Outline Section** — 5-level outline: section_id + heading_zh + claim_count_target + paragraph_count_target + status (OUTLINE/DRAFT/REVISED)
- **Sections Detail** — section_id + status + word_count + citation_ids_used (mono)
- **Evidence Links** — table: citation_id → use_count → first_used_section_id
- **Revision History** — timeline-style: rev_id + at + author + summary_zh + sections_modified + paragraphs_added/revised
- **Bibliography Preview** — top 10 most-cited citations with short_form
- **Stats Table** — sections/paragraphs/citations/notes/links/word_count/revisions
- **Footer**

### 4.2 Paragraph Page (Within Draft)

- **Claim Strip** — list of claims with [SHOW] toggle
- **Citation Strip** — list of citation_ids with [SHOW] toggle (monospace)
- **Evidence Card Strip** — list of evidence_card_ids with [SHOW] toggle
- **Field Note Strip** — list of field_note_ids with [SHOW] toggle
- **Binding State Badge** — color-coded badge (5 states)
- **Word Count + Status** — meta strip

### 4.3 Bibliography Page

- **Filter Bar** — by dynasty / language / collection_slug / cited_count range
- **Works Grid** — work_id + title_zh + institution_id
- **Institutions Strip** — institution_id + name + type + URL(read-only)
- **Citations Table** — citation_id → work_id → page_seq → cited_count → cited_in_drafts[]
- **Stats** — works/institutions/citations/max_citation_count

### 4.4 Research Writing (Hub) Page

- **3 Cards** — /drafts/ + /bibliography/ + /writing-invariants/
- **Stats** — total_drafts / total_paragraphs / total_word_count / total_citation_links / total_field_note_bindings
- **Draft Cards** — draft_id + status + word_count + citations_used + last_revised_at
- **Binding State Distribution** — pie/bar of paragraphs by binding_state
- **Future Plan** — outline only

## 5. 严格边界 (v0.7.0 强调 — 全部 hard rule)

继承所有 v0.1-v0.6 边界 + v0.7 新增:

- ✅ **不下载资源** — 所有数据来自 P5-D frozen snapshot
- ✅ **不修改数据库** — 仅读 citations + works + institutions JSON
- ✅ **不运行 OCR** — 无模型调用
- ✅ **不改变 Citation ID** — `SHUGE:p<post_id>:<page_seq>` 自 P5-B2 起保持不变
- ✅ **不引入 LLM 自动写作** — evidence_paragraphs.json 是描述层,不是生成层;body_excerpt 字段来自手工 Markdown 草稿片段,不通过模型生成
- ✅ **不引入向量数据库** — 无 embedding / vector search / similarity search
- ✅ **不引入 Neo4j** — 纯静态 JSON + 静态 HTML
- ✅ **不引入后台服务** — 零 API endpoint
- ✅ **不抓取 shuge.org / Conan Xin Archive** — 仅 ID 引用
- ✅ **draft_status 不显示 LOCKED/PUBLISHED** — 草稿永远是 IN_PROGRESS,无 published state
- ✅ **evidence_links 不暴露 full_text** — `full_text_unavailable: true` 强制,text_source 字段标识仅 ID
- ✅ **body_excerpt ≤ 200 字符** — 写作环境不存 full prose
- ✅ **revision_history at 字段** — 每次修订手动记录,不通过 webhook 触发
- ✅ **写作完成 = IN_PROGRESS → (无 LOCKED 转换)** — research team 自行决定何时停止;v0.7 不锁定草稿

## 6. 写作流程的最小文档

### 6.1 Draft 创建步骤

1. 选定 project_id (rp-*) 从 /projects/
2. 决定 language (zh-CN 唯一支持)
3. 起草 outline (5 sections 推荐) — 至少 intro + question + evidence + conclusion
4. 为每 section 分配 paragraph_count_target
5. 状态 OUTLINE
6. 待 outline 通过 → status: DRAFT, 开始填入 paragraphs
7. 为每 paragraph 标记 binding_state
8. 每次修订 → 增 revision_history 一条

### 6.2 段落写作步骤

1. 在 outline 中选定 section_id
2. 起草 body_excerpt (≤ 200 字)
3. 列出 claims (≥ 1)
4. 为每条 claim 选定 citation_id (零条 → binding_state = METADATA_ONLY)
5. 若 claim 是实证 → 选定 evidence_card_id
6. 若 claim 是田野 → 选定 field_note_id
7. 更新 binding_state
8. 更新 word_count

### 6.3 段落升级规则

- OUTLINE → DRAFT: body_excerpt 已填 + 至少 1 claim
- DRAFT → REVISED: 所有 claim 至少 1 citation 引用 + owner 已校对

## 7. 完成度检查清单

```
✅ research_drafts.json 生成 (3 drafts · 15 sections · 27 paragraphs)
✅ evidence_paragraphs.json 生成 (27 paragraphs · 48 claims · 54 cite links)
✅ bibliography.json 生成 (3 works · 1 institution · 6 citations)
✅ writing_invariants.json 生成 (4 shared namespaces · 6 invariants · 4 schema additions)
✅ DESIGN_v0.7.md 生成
✅ IA_v0.7.md 生成
✅ 3 new pages: /research-writing/ + /drafts/ + /bibliography/
✅ CSS additions
✅ 所有 25+3 = 28 HTML routes 200 OK
✅ git commit + push
✅ v0.7 完成停止,不进入下一阶段
```