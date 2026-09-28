# SHUGE DH Research Platform v0.8 — DESIGN

## 1. 定位

**v0.7 = Evidence-backed Draft** — 把项目层升级到 evidence-backed 写作底座,每个 Project 承载 Draft + Paragraphs。  
**v0.8 = Evidence-backed Research Publication** — 把 Draft 升级到 **Research Article** 形态,并建立 **Publication Workflow** 与 **Export Layer**。

v0.8 是 v0.7 的「内容上升路径」,不取代 v0.7,而是在其之上:
- Article 由 Draft 生成(1 draft → 1 article)
- Article 经历 DRAFT → REVIEW → REVISED → (PUBLISHED,边界内禁止) 状态机
- Article 可通过 Export Layer 导出为 Markdown / CSL JSON / BibTeX 三种格式
- Article 与 Research Workspace / Field Notes / Conan Xin Archive Bridge 保持 ID link

v0.8 不发布「论文产品」,而是发布 **「可发布的 research article 结构与导出格式」**,把发布决策权留给 research team。

## 2. 核心问题

v0.7 解决了「evidence-backed 草稿与段落如何组织?」(3 drafts · 27 paragraphs · 5 binding states)。  
v0.8 解决:**这些草稿如何变成可发表的研究文章?**
1. 哪些草稿已经准备好进入正式评审?
2. 评审如何进行?标准是什么?
3. 评审通过后,如何导出为学界接受的格式?
4. 与 Research Workspace / Field Notes / Conan Xin Archive 的 ID link 如何保持?

## 3. 核心新增实体

### 3.1 Research Article (新)

```
article_id (local)        article-<slug>
draft_id                  draft-* (v0.7 已有)
project_id                rp-* (v0.6 已有)
title_zh / title_en
short_title_zh / short_title_en
language                  zh-CN
owner                     research-team
abstract_zh / abstract_en
sections[]                section_id + heading_zh + heading_en + status + paragraphs_resolved[]
claims[]                  claim_id + paragraph_id + binding_state (跨 paragraphs 聚合)
citations[]               citation_ids (从 draft 继承)
bibliography_works        work_ids (聚合 v0.7 bibliography)
bibliography_institutions institution_ids
bibliography_citations    citation_ids
review_status             DRAFT / REVIEW / REVISED / PUBLISHED
review_notes              每个状态的描述
linked_archive_note_ids   FN-* (v0.5+)
linked_archive_rq_ids     rq-* (v0.5+)
linked_archive_gap_ids    gap-* (v0.5+)
linked_workspace_id       ws-* (article→workspace 反向绑定)
linked_project_id         rp-* (article→project 绑定)
stats                     sections · paragraphs · claims · citations · evidence_cards · field_notes · word_count
```

**article_id 命名规则**: 由 draft_id 生成 `article-<slug>`,与 draft 一一对应,严格不重命名。

**review_status 4 态**:
- `DRAFT` — 草稿(草稿状态,待研究人员完成所有 paragraphs 的 binding_state 后进入 REVIEW)
- `REVIEW` — 评审中(由 peer reviewers 校验每条 claim)
- `REVISED` — 已修订(reviewer 反馈已纳入修订)
- `PUBLISHED` — 已发布(**本演示不进入此状态 — 严格边界**)

### 3.2 Publication Workflow (新 — 状态机)

```
DRAFT
  ↓ entry: draft 完成且所有 paragraphs ≥ CLAIMS_BOUND
  ↓ exit: 所有 binding_state=CLAIMS_BOUND 段落至少有 1 citation,所有 FIELD_NOTE_BOUND 段落至少有 1 field_note
  ↓
REVIEW
  ↓ entry: reviewer_id 分配 + rubric 启用
  ↓ exit: 所有 reviewer scores ≥ 3,无 critical (BLOCKING)
  ↓
REVISED
  ↓ entry: 修订记录已写入 revision_history,至少 1 段被显式修订
  ↓ exit: research_team 决策:PUBLISHED 或 REVISE_MORE
  ↓
PUBLISHED ★ 严格边界:本演示不进入此状态
```

**5 transitions**:
- `DRAFT → REVIEW`
- `REVIEW → DRAFT`(block:reviewer blocking + scores < 3)
- `REVIEW → REVISED`(pass:all scores ≥ 3)
- `REVISED → PUBLISHED`(**禁止**)
- `REVISED → DRAFT`(revise more)

**5 rubric_dimensions**:
- claims_correctness(0-5,passing=4)
- citation_coverage(0-5,passing=4)
- evidence_card_match(0-5,passing=4)
- binding_state_compliance(0-5,passing=3)
- archive_link_consistency(0-5,passing=5)

### 3.3 Export Layer (新)

支持 3 种导出格式:

| format_id | name | mime_type | file_ext | 用例 |
|---|---|---|---|---|
| markdown | Markdown | text/markdown; charset=utf-8 | .md | 本地编辑/预览 |
| csl_json | CSL JSON | application/vnd.citationstyles.csl+json | .json | Zotero / Mendeley / Pandoc 导入 |
| bibtex | BibTeX | application/x-bibtex | .bib | LaTeX 文档参考文献 |

**5 boundary invariants**:
- SHALL NOT auto-generate article 正文
- SHALL NOT change Citation ID format (SHUGE:p<post_id>:<page_seq>)
- SHALL NOT expose full_text of any work/institution
- SHALL include Conan Xin Archive Bridge footer in every export
- SHALL NOT export body_excerpt > 200 chars from v0.7 paragraphs

**5-step export workflow**:
1. author selects article_id + review_status target (must be REVISED or above)
2. author selects format (Markdown / CSL JSON / BibTeX)
3. export_specs renders article content into target format (read-only)
4. research_team downloads exported file (manual, no API)
5. exported file marked with v0.8 watermark

### 3.4 Conan Xin Archive Bridge — v0.8 扩展

v0.7 已建立 4 shared namespaces + 4 local-only + 6 invariants。v0.8 在此基础上:

**5 shared ID namespaces**(扩展):
- `field_note_id` (FN-*) — v0.5+ 已有
- `research_question_id` (rq-*) — v0.5+ 已有
- `gap_id` (gap-*) — v0.5+ 已有
- `workspace_id` (ws-*) — v0.5+ 已有,**v0.8 新增 article→workspace 反向绑定**
- `project_id` (rp-*) — v0.6+ 已有,**v0.8 新增 article→project 绑定**

**4 local-only namespaces**(新增):
- `article_id` (article-*) — v0.8 独有
- `review_id` (review-*) — 评审记录 local ID
- `rubric_score_id` (rubric-*) — 评审打分 local ID
- `export_record_id` (export-*) — 导出记录 local ID

**8 archive_bridge_invariants**(新增 + 继承):
1. SHALL NOT write Archive(继承)
2. SHALL NOT read Archive(继承)
3. SHALL NOT change Citation ID(继承)
4. SHALL NOT LLM auto-write 正文(继承 + 收紧)
5. SHALL NOT 直接进入 PUBLISHED 状态 ★(v0.8 新增)
6. SHALL include "Generated by..." footer in every export ★(v0.8 新增)
7. SHALL NOT export body_excerpt > 200 字符 ★(v0.8 新增)
8. MAY reference IDs in linked_archive_* ★(v0.8 显式)

**6 schema additions**(v0.8 新增):
- `research_articles.json → articles[].article_id`
- `research_articles.json → articles[].review_status`
- `research_articles.json → articles[].linked_workspace_id`
- `research_articles.json → articles[].linked_project_id`
- `publication_workflow.json → states[]`
- `export_specs.json → formats[]`

## 4. 视觉与交互规范

继承 v0.7 全部规范(数字博物馆 × 学术实验室)。新增:

### 4.1 Article Page

- **Masthead** — 站点总名 + 当前 article_id 引用
- **Topnav** — 继承 15 栏目 + 新增 /articles/ + /publications/ + /export/
- **Hero** — article_id + short_title_zh + short_title_en + review_status badge + language badge + owner + abstract preview
- **Sections Detail** — section_id + status + word_count + claims_count + citations_count + paragraphs_resolved (table)
- **Claims Index** — all_claims table: claim_id + paragraph_id + binding_state
- **Citations Index** — citations table: citation_id (link to bibliography)
- **Bibliography Preview** — works + institutions + citations (3 lists)
- **Linked Archive IDs** — read-only ID table (linked_archive_note_ids/rq_ids/gap_ids/workspace_id/project_id)
- **Stats Table** — sections · paragraphs · claims · citations · evidence_cards · field_notes · word_count
- **Footer**

### 4.2 Publications Hub Page (/publications/)

- **3 Cards** — /articles/ + /export/ + /publication-invariants/
- **Stats** — total_articles · articles_in_draft · articles_in_review · articles_in_revised · articles_in_published (must be 0)
- **Review Status Distribution** — pie/bar: DRAFT/REVIEW/REVISED/PUBLISHED
- **Workflow State Machine** — visual state diagram (4 states + 5 transitions)
- **Rubric Visualization** — 5 dimensions + passing scores
- **Future Plan** — outline only (publish channel selection)

### 4.3 Export Page (/export/)

- **Format Tabs** — Markdown / CSL JSON / BibTeX (3 formats)
- **Format Spec** — mime_type + file_ext + export_includes + export_excludes
- **Demo Markdown Preview** — first 600 chars of demo_article REVISED export
- **Demo CSL JSON** — single entry (JSON code block)
- **Demo BibTeX** — single entry (text code block)
- **5 Boundary Invariants** — boundary list (red badges)
- **Export Workflow** — 5-step documentation
- **Footer**

### 4.4 Research Writing (Hub) Page - Update for v0.8

- Topnav 加 3 个: /articles/ + /publications/ + /export/

## 5. 严格边界 (v0.8 强调 — 全部 hard rule)

继承所有 v0.1-v0.7 边界 + v0.8 新增:

- ✅ **不下载资源** — 所有数据来自 P5-D frozen snapshot
- ✅ **不修改数据库** — 仅读 citations + works + institutions JSON
- ✅ **不运行 OCR** — 无模型调用
- ✅ **不改变 Citation ID** — `SHUGE:p<post_id>:<page_seq>` 自 P5-B2 起保持不变
- ✅ **不引入 LLM 自动写作** ★ — 继承 v0.7,进一步收紧: 文章正文只能来自 v0.7 draft paragraphs,不允许自动补全/改写/扩展
- ✅ **不引入向量数据库** — 无 embedding / vector search
- ✅ **不引入 Neo4j** — 纯静态 JSON
- ✅ **不引入后台服务** — 零 API endpoint
- ✅ **不抓取 shuge.org / Conan Xin Archive** — 仅 ID 引用
- ✅ **不直接进入 PUBLISHED** ★ — v0.8 严格边界: 必须经过 DRAFT → REVIEW → REVISED → (decision) → PUBLISHED 状态机;本演示无 PUBLISHED article
- ✅ **不暴露 full_text** ★ — export 永远包含 `full_text_unavailable: true`
- ✅ **export SHALL include v0.8 footer** ★ — "Generated by SHUGE DH Research Platform v0.8 · READ-ONLY ID LINK"
- ✅ **body_excerpt ≤ 200 字符** ★ — export 不复制长文本
- ✅ **citation_id 永远原样输出** ★ — export 不修改 SHUGE:p<post_id>:<page_seq>
- ✅ **review_status PUBLISHED 边界** ★ — articles 集合中无 PUBLISHED article,这是设计边界,不是数据缺失

## 6. Article 写作流程的最小文档

### 6.1 Article 创建步骤

1. 选定 draft_id (从 /drafts/) — 必须是 status=REVISED 或以上
2. 生成 article_id (`article-<slug>`)
3. 设置 review_status = DRAFT
4. 选定 reviewer_id(分配)
5. 进入 REVIEW 状态
6. reviewer 按 5 维度打分(0-5)
7. 通过 → REVISED;失败 → DRAFT
8. REVISED 状态进行修订记录更新
9. research_team 决策:是否进入 PUBLISHED(**本演示不进入**)

### 6.2 Article Export 步骤

1. 选定 article_id(必须是 status=REVISED 或以上)
2. 选定 format: Markdown / CSL JSON / BibTeX
3. 调用 export_specs.render(article, format)
4. 生成 export_record_id (local) 用于审计
5. 输出文件,带 v0.8 footer

### 6.3 Article 升级规则

- DRAFT → REVIEW: 所有 paragraphs binding_state ≥ CLAIMS_BOUND
- REVIEW → REVISED: 所有 reviewer scores ≥ 3,无 BLOCKING
- REVISED → PUBLISHED: research_team 决策 + publish_channel 指定(**禁止在 v0.8 演示**)

## 7. 完成度检查清单

```
✅ research_articles.json 生成 (3 articles · 15 sections · 27 paragraphs · 48 claims · 360 字)
✅ publication_workflow.json 生成 (4 states · 5 transitions · 5 rubric_dimensions)
✅ export_specs.json 生成 (3 formats · 5 boundary invariants · demo_md=1775 chars)
✅ publication_invariants.json 生成 (5 shared namespaces · 4 local-only · 8 invariants · 6 schema additions)
✅ DESIGN_v0.8.md 生成
✅ IA_v0.8.md 生成
✅ 3 new pages: /articles/ + /publications/ + /export/
✅ CSS additions
✅ 所有 28+3 = 31 HTML routes 200 OK
✅ git commit + push
✅ v0.8 完成停止,不进入下一阶段
```