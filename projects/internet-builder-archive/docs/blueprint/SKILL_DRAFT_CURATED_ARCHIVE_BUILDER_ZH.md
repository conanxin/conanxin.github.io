# Skill 雏形：策展型资料库构建器 · CURATED ARCHIVE BUILDER

**文件版本**：v0.1 draft
**创建阶段**：Phase 2P（internet-builder-archive 项目）
**安装状态**：❌ 尚未安装 — 本文档为设计草案

---

## 1. 概述

**Skill 名称（建议）**：`curated-archive-builder`

**Skill 类型**：workflow + content management

**适用场景**：从截图、链接列表或原始材料出发，构建一个可上线、可搜索、可维护的中文策展型静态资料库。

**输入**：
- 用户提供的截图、URL 列表、或原始材料
- 项目主题和分类定义
- 可选：是否允许联网检索

**输出**：
- 完整项目结构（data/、pages/、assets/、docs/）
- items.json / paths.json / staging_review.json
- index.html + guide.html + 路径页
- 发布材料（Launch post、X thread、分享卡片）
- 后续录入 workflow

**不输出**：虚假数据、伪造来源、非官方 embed

---

## 2. 与本项目的关系

本文档是 internet-builder-archive 项目（Phase 2P）的方法论抽象。

internet-builder-archive 是 `curated-archive-builder` Skill 的**第一个实例**，也是**验证案例**。

```ascii
internet-builder-archive (Phase 2P)
    ↓ 抽象
CURATED ARCHIVE BUILDER Skill (draft v0.1)
    ↓ 实例化
未来其他策展资料库项目（如 AI 论文库、电影资料库）
```

本 Skill draft 的设计基于以下经验：
- 74 条策展条目的完整生命周期
- 三态状态机（staging → verified_source → verified_embed）
- 5 条专题路径
- 10+ 个 Phase 的迭代
- Phase 2M 审计与降级机制
- Phase 2O 后续录入 workflow

---

## 3. 核心设计原则

### 3.1 可信度优先

```
不伪造来源
不采用非官方 embed
不确定就 staging
降级不是失败，是诚实的数据维护
```

### 3.2 三态状态机

```
candidate → staging → verified_source → verified_embed
                ↓
            archived / removed
```

### 3.3 分层策展字段

```
Level 1: summary_zh（最简简介）
Level 2: + why_it_matters_zh
Level 3: + background_zh / key_points_zh / curator_note_zh
```

### 3.4 派生内容同步

```
items.json 变化
  → paths.json 同步
  → 路径页同步
  → README 统计同步
  → launch materials 统计同步
```

### 3.5 Phase 驱动

```
每个 Phase 单独执行
完成校验 + 报告 + commit + push
等待用户确认后继续
```

---

## 4. Skill 结构

### 4.1 文件结构

```
~/.hermes/skills/curated-archive-builder/
├── SKILL.md                    # 主 Skill 文件
├── references/
│   ├── BLUEPRINT.md           # 本 Blueprint（通用方法论）
│   ├── DATA_MODEL.md           # 数据模型
│   ├── PHASE_PLAN.md           # 阶段计划
│   └── AUDIT_TEMPLATE.md       # 审计模板
├── templates/
│   ├── new_item.template.json  # 条目模板
│   ├── new_path.template.json  # 路径模板
│   └── agent_prompt.md         # Agent 操作提示词模板
└── scripts/
    └── validate_archive.py    # 可选：校验脚本
```

### 4.2 SKILL.md 结构

```yaml
name: curated-archive-builder
description: |
  Build a curated, Chinese-language static archive from screenshots, links, or raw materials.
  Supports: source verification, three-state status management, thematic pathways,
  bilingual curation fields, and GitHub Pages deployment.
trigger: |
  用户提到"资料库"、"策展"、"archive"、"索引"、
  或要求从截图/链接构建资料库
phases:
  - phase_0_skeleton
  - phase_1a_ingestion
  - phase_1b_source_lookup
  - phase_1c_embed_check
  - phase_1d_chinese_curation
  - phase_1e_mvp_publish
  - phase_2a_deep_curation
  - phase_2b_staging_review
  - phase_2c_pathways
  - phase_2d_guide_page
  - phase_2f_launch_materials
  - phase_2m_audit
  - phase_2o_workflow
  - phase_2p_blueprint
boundaries:
  - no_fake_sources
  - no_unofficial_embeds
  - no_cross_agent_file_modification
  - no_external_cdn
  - no_third_party_tracking
  - staging_before_verified
```

---

## 5. Phase 分解

### Phase 0：项目骨架

**目标**：创建最小可用项目结构

**输出**：index.html + styles.css + app.js + README.md + data/items.json + docs/CONTENT_GUIDE.md + docs/DATA_SCHEMA.md

**校验**：JSON 合法、页面可本地打开

---

### Phase 1A：截图/原始材料录入

**目标**：将用户提供的材料录入为 staging 条目

**输入**：截图、URL 列表、手工材料

**输出**：items.json 追加候选条目 + staging_review.json 更新

---

### Phase 1B：来源核实

**目标**：查找每个 staging 条目的可信来源

**规则**：official → author_site → archive → trusted_archive；无法找到 → 降级

---

### Phase 1C：嵌入判断

**目标**：判断是否有可合法嵌入的内容

**规则**：只允许 youtube.com/embed 和 player.vimeo.com

---

### Phase 1D：中文策展字段

**目标**：为所有 verified 条目生成中文策展字段

**输出**：title_zh + summary_zh + why_it_matters_zh + background_zh + key_points_zh + curator_note_zh + ...

---

### Phase 1E：MVP 发布

**目标**：发布最小可用版本到 GitHub Pages

---

### Phase 2A–2P

见 `docs/blueprint/PHASE_PLAN_TEMPLATE_ZH.md`

---

## 6. 安全边界

| 边界 | 说明 |
|------|------|
| 不伪造来源 | 只使用可验证的来源 |
| 不采用非官方 embed | 只使用 youtube.com/embed 和 player.vimeo.com |
| 不跨 agent 修改文件 | 每个任务只修改指定项目目录 |
| 不引入外部 CDN | 纯本地资源 |
| 不加入第三方追踪 | 无 analytics / tracking |
| staging 优先 | 不确定时就 staging |
| 降级是机制 | source_url 失效 → 降级，不是删除 |

---

## 7. 典型工作流

```
用户：我想把一组截图做成资料库
↓（触发 Skill）
Agent：确认项目主题 + 分类
↓（Phase 0）
Agent：创建项目骨架
↓（Phase 1A）
Agent：录入截图材料为 staging 条目
↓（Phase 1B）
Agent：核实来源，升级部分 staging 为 verified_source
↓（Phase 1C）
Agent：判断 embed，升级 verified_source 为 verified_embed
↓（Phase 1D）
Agent：为所有 verified 条目生成中文策展字段
↓（Phase 1E）
Agent：发布 MVP
...（Phase 2A–2P）
```

---

## 8. 安装说明（未来）

> ⚠️ 本 Skill draft 尚未安装。以下是未来安装时需要执行的步骤。

如要将本 Skill 安装到指定 agent（如 OpenClaw），需要：

1. **确认目标 agent 的 skill 目录**：检查 `~/.hermes/skills/` 是否存在，配置如何
2. **确认 agent 是否支持 Skill**：检查 agent 配置中 `skills` 相关设置
3. **不要跨 agent 混用**：本 Skill 是为 cloud Hermes 设计的，不能直接用于本地 OpenClaw 或其他 agent
4. **测试安装**：在目标 agent 中执行 `skills_list` 确认 Skill 加载成功
5. **测试执行**：用 Phase 0 模板测试 Skill 是否正常工作

**安装命令（未来参考）**：

```bash
# 克隆本 Blueprint 到 skill 目录
mkdir -p ~/.hermes/skills/curated-archive-builder/
cp -r docs/blueprint/* ~/.hermes/skills/curated-archive-builder/references/
cp docs/templates/new_item.template.json ~/.hermes/skills/curated-archive-builder/templates/
# 编辑 SKILL.md 填入真实路径
$EDITOR ~/.hermes/skills/curated-archive-builder/SKILL.md
```

**安装后验证**：

```
agent > skills_list
curated-archive-builder: Build a curated static archive from screenshots or raw materials
```

---

## 9. 当前状态

| 项目 | 状态 |
|------|------|
| internet-builder-archive | ✅ Phase 2P 完成 |
| CURATED ARCHIVE BUILDER Skill draft | ❌ 尚未安装（仅设计草案） |
| Blueprint 文档 | ✅ 已创建于 docs/blueprint/ |
| 模板文件 | ✅ 已创建于 docs/blueprint/templates/ |
| Agent Runbook | ✅ 已创建于 docs/blueprint/AGENT_RUNBOOK_ZH.md |
| Quality Audit Template | ✅ 已创建于 docs/blueprint/QUALITY_AUDIT_TEMPLATE_ZH.md |

---

## 10. 下一步

1. **Phase 2B-B2**：用户补充 7 条 staging 的截图或来源（iba-013/029/066/073 P0；iba-002/020/022 P2）
2. **Phase 3A**：使用本 Blueprint 新增下一批资料（如 AI 论文资料库）
3. **安装 Skill**：如用户确认，再将 Skill draft 安装到指定 agent；安装前必须先核查该 agent 环境