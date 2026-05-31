# Phase 2P 报告：策展型资料库蓝图与方法论抽象

**日期**：2026-05-31
**git commit**：90dec41（Phase 2O）

---

## 1. 本阶段目标

将 internet-builder-archive 项目沉淀的方法论抽象为一套通用"策展型资料库模板 / Skill 雏形"，为未来其他同类项目提供可复用的蓝图、模板与 Agent 操作规范。

---

## 2. 新增 blueprint 文件列表（6 个）

| 文件 | 大小 | 说明 |
|------|------|------|
| docs/blueprint/CURATED_ARCHIVE_BLUEPRINT_ZH.md | 6,913 bytes | 通用结构、适用场景、MVP/增强版/长期维护 |
| docs/blueprint/ARCHIVE_DATA_MODEL_ZH.md | 7,808 bytes | item/path/staging_review 数据模型与状态机 |
| docs/blueprint/PHASE_PLAN_TEMPLATE_ZH.md | 10,930 bytes | 完整阶段模板（Phase 0–2P） |
| docs/blueprint/AGENT_RUNBOOK_ZH.md | 5,689 bytes | Agent 安全边界、协作模式、执行检查清单 |
| docs/blueprint/QUALITY_AUDIT_TEMPLATE_ZH.md | 6,610 bytes | 数据/来源/paths/SEO 审计流程与报告模板 |
| docs/blueprint/SKILL_DRAFT_CURATED_ARCHIVE_BUILDER_ZH.md | 8,359 bytes | curated-archive-builder Skill 设计草案 |

---

## 3. 新增 blueprint/templates 文件列表（5 个）

| 文件 | 大小 | 说明 |
|------|------|------|
| docs/blueprint/templates/archive_item.template.json | 1,649 bytes | 通用条目 JSON 模板（占位符） |
| docs/blueprint/templates/archive_path.template.json | 523 bytes | 通用路径 JSON 模板（占位符） |
| docs/blueprint/templates/staging_review.template.json | 402 bytes | 通用 staging review JSON 模板（占位符） |
| docs/blueprint/templates/phase_report.template.md | 1,352 bytes | 通用阶段报告 Markdown 模板 |
| docs/blueprint/templates/agent_phase_prompt.template.md | 4,235 bytes | 通用 Agent 阶段提示词模板（含占位符说明） |

---

## 4. 更新的文档

| 文件 | 更新内容 |
|------|----------|
| README.md | 新增 "Blueprint / 通用资料库模板" 小节（6 个链接） |
| docs/launch/README_SHOWCASE_BLOCK.md | 将"后续计划"小节替换为"通用模板 / Blueprint"小节 |

---

## 5. Skill Draft 摘要

**Skill 名称**：curated-archive-builder（设计草案，尚未安装）

**核心设计原则**：
- 可信度优先（不伪造来源、不采用非官方 embed）
- 三态状态机（staging → verified_source → verified_embed）
- 分层策展字段（Level 1–3）
- 派生内容同步
- Phase 驱动工作流

**与本项目的关系**：
internet-builder-archive 是 `curated-archive-builder` Skill 的第一个实例和验证案例，Phase 2P 将其抽象为通用设计草案。

**安装状态**：❌ 尚未安装 — 仅设计草案，不跨 agent 混用

---

## 6. 是否修改数据文件

| 文件 | 修改 |
|------|------|
| data/items.json | ❌ 否 |
| data/paths.json | ❌ 否 |
| data/staging_review.json | ❌ 否 |

---

## 7. 校验结果

| 检查项 | 状态 |
|--------|------|
| items.json JSON 合法 | ✅ |
| paths.json JSON 合法 | ✅ |
| staging_review.json JSON 合法 | ✅ |
| total=74 | ✅ |
| verified_embed=31 | ✅ |
| verified_source=36 | ✅ |
| verified total=67 | ✅ |
| staging=7 | ✅ |
| 67 条 verified 均有 curator_note_zh | ✅ |
| paths.json 不引用 staging | ✅ |
| 6 个 blueprint 文档存在 | ✅ |
| 5 个 blueprint templates JSON 合法 | ✅ |
| phase_report.template.md 存在 | ✅ |
| agent_phase_prompt.template.md 存在 | ✅ |
| Skill draft 存在 | ✅ |
| README.md 有 Blueprint 链接 | ✅ |
| README_SHOWCASE_BLOCK.md 有 Blueprint 链接 | ✅ |
| items.json 未被修改 | ✅ |
| paths.json 未被修改 | ✅ |
| staging_review.json 未被修改 | ✅ |
| HTML 无外部 CDN 新增 | ✅ |
| app.js 语法正确 | ✅ |
| 无临时文件 | ✅ |

---

**Git commit**：90dec41（Phase 2O）
**GitHub Pages 地址**：https://conanxin.github.io/projects/internet-builder-archive/

---

## 下一步建议

1. **Phase 2B-B2**：用户补充 7 条 staging 的截图或来源（iba-013/029/066/073 P0；iba-002/020/022 P2）
2. **Phase 3A**：使用本 Blueprint 新增下一批资料（如 AI 论文资料库、电影资料库）
3. **安装 Skill**：如用户确认，再将 Skill draft 安装到指定 agent；安装前必须先核查该 agent 环境，不得跨 agent 混用