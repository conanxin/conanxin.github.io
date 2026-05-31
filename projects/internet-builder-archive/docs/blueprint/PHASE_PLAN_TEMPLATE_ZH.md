# 策展型资料库阶段计划模板 · 中文

本文档提供从 0 到发布的通用阶段计划模板，适用于任何策展型静态资料库项目。

---

## Phase 0：项目骨架

**目标**：创建最小可用项目结构。

**输入**：项目名称、目标主题、初步分类。

**输出**：
- `data/items.json`（空或含 1–3 条 placeholder）
- `data/paths.json`（空或框架）
- `data/staging_review.json`（空数组）
- `index.html`（基础筛选+搜索）
- `styles.css` / `app.js`
- `README.md`
- `docs/CONTENT_GUIDE.md`
- `docs/DATA_SCHEMA.md`

**校验**：
- JSON 合法
- 页面可本地打开
- 无外部 CDN

**人工确认**：是（需用户确认项目主题和分类）

---

## Phase 1A：截图/原始材料录入

**目标**：将用户提供的截图或原始材料录入为 staging 条目。

**输入**：截图、链接列表、手工整理材料。

**输出**：
- `data/items.json` 追加候选条目
- `data/staging_review.json` 更新

**校验**：
- id 唯一
- 字段尽量填写，缺少字段标注为空
- staging 条目标注 `status: staging`

**人工确认**：否（除非条目数量超过 20 条）

---

## Phase 1B：来源核实

**目标**：对 Phase 1A 录入的条目进行来源核实。

**输入**：`data/items.json`（staging 条目）。

**输出**：
- 每个 staging 条目更新 `source_url`
- `source_status` 更新
- 部分条目可升级为 `verified_source`

**处理规则**：
- 优先官方来源
- 无法找到可靠来源 → 保持 staging，注明原因
- 找到 Internet Archive 存档 → `source_type: archive`，`secondary_urls` 保留存档

**校验**：
- source_url 非空或标注平台限制
- 不使用 SEO 站 / 无来源转载

**人工确认**：P0 条目需要用户截图确认

---

## Phase 1C：嵌入判断

**目标**：对 Phase 1B 升级的 verified_source 条目判断是否可嵌入。

**输入**：Phase 1B 的 verified_source 条目。

**输出**：
- `embed_url` 填写（如有）
- `embed_status` 更新
- 可嵌入 → `verified_embed`
- 不可嵌入 → `verified_source`

**处理规则**：
- 只允许官方 YouTube / Vimeo / 官方播放器
- 非官方完整片源 → `embed_status: 不可嵌入`，不采用

**校验**：
- embed_url 格式必须为 youtube.com/embed 或 player.vimeo.com
- 不得使用非官方 embed

**人工确认**：否

---

## Phase 1D：中文策展字段

**目标**：为所有 verified 条目生成中文策展字段。

**输入**：verified 条目（verified_embed / verified_source）。

**输出**：
每个 verified 条目填写：
- `title_zh`
- `summary_zh`
- `why_it_matters_zh`
- `background_zh`
- `key_points_zh`（3–5 条）
- `recommended_for_zh`
- `content_format_zh`
- `reading_or_watching_guide_zh`
- `related_themes_zh`
- `curator_note_zh`

**处理规则**：
- 视频/音频必须写中文简介
- 英文内容必须保留 `title_en`
- 不要臆造不熟悉领域的策展字段

**校验**：
- 70 条 verified 均应有 curator_note_zh
- 无空字段

**人工确认**：否（自动执行）

---

## Phase 1E：MVP 发布

**目标**：发布最小可用版本到 GitHub Pages。

**输入**：Phase 1A–1D 输出。

**输出**：
- GitHub Pages 可访问
- `sitemap.xml`（如主站需要）
- `robots.txt`（如主站需要）

**校验**：
- index.html 可访问
- JSON 无语法错误
- 搜索功能可用

**人工确认**：是（发布前确认）

---

## Phase 2A：核心内容深化

**目标**：为 verified 条目补充增强字段。

**输入**：verified 条目（70 条+）。

**输出**：
- `content_format_zh`
- `reading_or_watching_guide_zh`
- `related_themes_zh`
- `curator_note_zh`（深化）
- `tags`

**校验**：
- curator_note_zh 非空
- 无占位语

**人工确认**：否

---

## Phase 2B：staging 复核

**目标**：处理 staging 条目，将其升级为 verified 或降级。

**输入**：`data/staging_review.json`（待复核条目）。

**输出**：
- 部分 staging → verified_source 或 verified_embed
- 部分 staging 降级或归档
- `data/staging_review.json` 更新

**处理规则**：
- P0：用户已提供截图 → 优先处理
- P1：来源部分可验证 → 下个批次
- P2：来源不明确 → 等待用户提供截图

**校验**：
- staging 条目数量更新
- staging_review.json 同步更新

**人工确认**：是（P0 条目必须用户确认）

---

## Phase 2C：专题路径

**目标**：设计并实现 5 条专题路径。

**输入**：verified 条目（67 条+）。

**输出**：
- `data/paths.json`（5 条路径，每条含 item_ids）
- `paths/index.html`（路径总览）
- `paths/{{PATH_ID}}.html`（5 个静态路径页）

**处理规则**：
- 只包含 verified 条目
- 不引用 staging
- 路径数量可调整

**校验**：
- paths.json 不引用 staging
- 所有 item_ids 存在

**人工确认**：是（路径设计需用户确认）

---

## Phase 2D：导览页

**目标**：创建 guide.html 中文导览页。

**输入**：items.json + paths.json。

**输出**：
- `guide.html`（18KB+，8+ 节）
- `index.html` 导航更新

**校验**：
- 导览页覆盖所有主要内容
- 链接正确

**人工确认**：否

---

## Phase 2E：主站入口

**目标**：在主站创建项目入口（如适用）。

**输入**：主站 projects 配置。

**输出**：
- 主站 projects/data.json 更新（如需要）
- 项目页可从主站访问

**校验**：
- 主站项目页可访问

**人工确认**：是

---

## Phase 2F：发布材料

**目标**：创建 Launch post 和 X thread。

**输入**：当前数据统计。

**输出**：
- `docs/launch/LAUNCH_POST_ZH.md`
- `docs/launch/X_THREAD_ZH.md`
- `docs/launch/README_SHOWCASE_BLOCK.md`
- `assets/iba-share-card.svg`

**校验**：
- 统计数字准确
- 发布材料可读

**人工确认**：是

---

## Phase 2G：OG Meta / Twitter Card

**目标**：为所有页面添加 Open Graph 和 Twitter Card meta。

**输入**：index.html + guide.html + 路径页。

**输出**：
- 所有页面添加 og:title / og:description / og:image / og:url / twitter:card / twitter:image

**校验**：
- og:image 指向存在的文件
- 每个页面有完整 meta

**人工确认**：否

---

## Phase 2H：路径静态页

**目标**：完成 5 条专题路径的独立静态页。

**输入**：paths.json + items.json。

**输出**：
- 5 个 `paths/{{PATH_ID}}.html`
- 每个包含路径说明 + 条目卡片

**校验**：
- 路径页可访问
- 条目卡片完整

**人工确认**：否

---

## Phase 2I：截图与展示

**目标**：生成 README 用截图。

**输入**：index.html + 路径页。

**输出**：
- `assets/screenshots/*.png`
- `docs/SCREENSHOTS.md`（如需要）

**校验**：
- 截图清晰
- README 引用正确

**人工确认**：是

---

## Phase 2J：sitemap / robots

**目标**：更新 sitemap.xml 和 robots.txt。

**输入**：项目 URL 结构。

**输出**：
- `sitemap.xml` 更新（如在主站目录下）
- `robots.txt` 更新（如在主站目录下）

**校验**：
- sitemap 包含所有核心页面
- robots.txt 含 Sitemap 行

**人工确认**：否

---

## Phase 2K：路径分享卡片

**目标**：为每条路径生成 SVG 分享卡片。

**输入**：paths.json。

**输出**：
- 5 个 `assets/path-cards/{{PATH_ID}}.svg`
- 更新路径页 og:image

**校验**：
- SVG 1200×630
- 纯 SVG，无外部资源
- 路径页 og:image 指向对应卡片

**人工确认**：否

---

## Phase 2L：路径短发布帖

**目标**：为每条路径生成短发布文案。

**输入**：paths.json。

**输出**：
- `docs/launch/PATH_SHORT_POSTS_ZH.md`

**校验**：
- 每条路径 3 种中文版本
- 每条路径 5 个短标题
- 每条路径 1 个英文简介

**人工确认**：否

---

## Phase 2M：最终审计

**目标**：对整个项目进行最终审计。

**输入**：全部数据 + 页面。

**输出**：
- `docs/PHASE_X_FINAL_AUDIT_REPORT.md`
- 修复发现的问题（如有）

**校验**：
- 数据一致性
- 页面可访问
- 链接正常

**人工确认**：是（审计报告需用户确认）

---

## Phase 2M-B：失效链接修复

**目标**：处理审计发现的失效 source_url。

**输入**：审计报告中的失效链接列表。

**输出**：
- 修复或降级失效 source_url
- 更新 `data/items.json`
- 更新 `data/staging_review.json`（如降级）

**处理规则**：
- 优先找官方替代来源
- 无法找到 → 降级为 staging

**校验**：
- 修复后的 source_url 可访问
- staging 条目数量更新

**人工确认**：否

---

## Phase 2M-C：派生内容同步

**目标**：同步 source 修复后的派生内容。

**输入**：Phase 2M-B 修复结果。

**输出**：
- 更新 `paths/*.html`（如有）
- 更新 `README.md` 统计（如有）
- 更新路径分享卡片（如 item count 变化）
- 更新 `docs/launch/*` 统计（如有）

**校验**：
- 路径 item count 与 paths.json 一致
- 统计数字准确

**人工确认**：否

---

## Phase 2N：案例复盘

**目标**：整理项目案例复盘文章。

**输入**：全部历史 Phase 报告。

**输出**：
- `docs/case-study/INTERNET_BUILDER_ARCHIVE_CASE_STUDY_ZH.md`
- `docs/case-study/CASE_STUDY_SUMMARY_ZH.md`
- `docs/case-study/CASE_STUDY_X_THREAD_ZH.md`

**校验**：
- 统计数字准确
- 文章可读

**人工确认**：否

---

## Phase 2O：后续录入 Workflow

**目标**：建立后续新增资料的流程。

**输入**：当前数据状态。

**输出**：
- `docs/workflow/NEW_ITEM_INGESTION_WORKFLOW_ZH.md`
- `docs/workflow/SOURCE_VERIFICATION_CHECKLIST_ZH.md`
- `docs/workflow/EMBED_POLICY_ZH.md`
- `docs/workflow/PATHWAY_UPDATE_WORKFLOW_ZH.md`
- `docs/workflow/RELEASE_CHECKLIST_ZH.md`
- `docs/templates/new_item.template.json`
- `docs/templates/agent_prompt_new_item_ingestion_zh.md`

**校验**：
- workflow 文档完整
- JSON 模板合法

**人工确认**：否

---

## Phase 2P：蓝图与方法论

**目标**：抽象通用模板与方法论。

**输入**：全部 Phase 报告与文档。

**输出**：
- `docs/blueprint/CURATED_ARCHIVE_BLUEPRINT_ZH.md`
- `docs/blueprint/ARCHIVE_DATA_MODEL_ZH.md`
- `docs/blueprint/PHASE_PLAN_TEMPLATE_ZH.md`
- `docs/blueprint/AGENT_RUNBOOK_ZH.md`
- `docs/blueprint/QUALITY_AUDIT_TEMPLATE_ZH.md`
- `docs/blueprint/SKILL_DRAFT_CURATED_ARCHIVE_BUILDER_ZH.md`
- `docs/blueprint/templates/*`

**校验**：
- 所有模板合法
- Skill draft 不安装

**人工确认**：否

---

## 附录：阶段编号说明

- **Phase 1**：基础建设阶段（1A–1E）
- **Phase 2**：增强与发布阶段（2A–2P）
- **Phase 3**：维护与扩展阶段（3A+）
- **Phase M**：中间维护阶段（审计、修复、同步，2M、2M-B、2M-C）

每个 Phase 完成后必须：
1. 运行校验
2. git commit + push
3. 输出结构化报告
4. 等待用户确认下一阶段