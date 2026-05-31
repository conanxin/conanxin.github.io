# 新增资料录入流程 · 中文

本文档说明未来向「旧互联网建设者资料库」新增资料条目的标准工作流。所有新增条目必须经过本流程处理。

---

## 阶段总览

```
输入 → 候选录入 → 来源核实 → 嵌入判断 → 中文化 → 状态判断 → 路径判断 → 派生同步 → 审计 → 完成
```

---

## 阶段 1：输入（Input）

用户提供以下任一或多个信息：

- 截图（含标题、作者、类型、时长等信息）
- URL（直接链接）
- 标题（中英文均可）
- 简短说明（类型、适合人群、推荐理由等）

### 录入要求

- 用户提供的标题不完整时，以 **英文原题优先**，中文译名可待后续补全
- 若截图包含时长 / 年份，优先记录
- 若截图包含作者或公司，记录在 `people` 或 `organization`

---

## 阶段 2：候选录入（Candidate Ingestion）

为每条新增资料生成候选条目，使用 `docs/templates/new_item.template.json` 模板。

### 生成字段

- `id`：按现有编号规则分配（例如：`iba-075`）
- `title_en`：`canonical_title_en` — 英文原题，优先从官方来源确认
- `title_zh`：中文译名，暂填 `""`（空）或用户提供的翻译
- `category`、`source_category`、`type`：根据截图或用户提供信息判断
- `year`：从截图 / URL / 来源确认，若不确定填 `null`
- `duration`：若为视频或音频，记录大概时长
- `people`、`organization`：根据截图或用户提供信息
- `language`：`en`（英文资料）或 `zh`（中文资料）
- `translation_status`：`待翻译` / `已译名` / `仅标题` — 初始为 `待翻译`
- `status`：**初始必须设为 `staging`**，不得直接设为 `verified_*`
- `source_url`：留空 `""` 或用户提供的 URL
- `embed_url`：留空 `""`
- `notes_zh`：记录用户提供的说明

### 硬性规则

> ⚠️ **候选条目必须以 `staging` 状态录入，不得伪造已验证状态。**

---

## 阶段 3：来源核实（Source Lookup）

目标：找到可信、可持续的 `source_url`。

### 来源优先级

1. **作者官网**（author's own site）
2. **公司 / 出版方 / 发布机构官网**（official site）
3. **大学 / 博物馆 / 档案机构**（institutional archive）
4. **官方 YouTube / Vimeo / 播客平台**（official platform embed）
5. **Internet Archive 存档**（archive.org）
6. **可信媒体**（trusted media）
7. **可信转载**（trusted republication with attribution）

详细规则见 `docs/workflow/SOURCE_VERIFICATION_CHECKLIST_ZH.md`。

### 嵌入政策

详细规则见 `docs/workflow/EMBED_POLICY_ZH.md`。

简单原则：
- **允许**：官方 YouTube / Vimeo embed（来自官方频道或经授权频道）
- **不允许**：非官方完整纪录片 / 盗版 full movie / 来源不明的搬运

### 核实结果记录

- 找到官方来源 → 填入 `source_url`，`source_status: 已找到`
- 找到 Archive.org 存档 → 填入 `source_url`，`source_type: archive`，`source_status: 已找到`
- 找不到可靠来源 → 保持 `staging`，`source_status: 需要人工复核`，`notes_zh` 说明原因

---

## 阶段 4：嵌入判断（Embed Eligibility）

判断该条目是否可嵌入播放器。

### 判断规则

见 `docs/workflow/EMBED_POLICY_ZH.md`。

**可嵌入**：YouTube / Vimeo 官方 embed 或发布机构官方播放器（需 HTTP 200 验证）

**不可嵌入**：PDF、备忘录、纯文章、无合法 embed 的视频

### 记录方式

- 可嵌入 → `embed_status: 可嵌入`，`embed_url` 填入 iframe src
- 不可嵌入 → `embed_status: 不可嵌入` 或 `未找到合法嵌入`，`embed_url` 留空

---

## 阶段 5：中文化（Chinese Localization）

### 需要翻译的字段

| 字段 | 说明 |
|------|------|
| `title_zh` | 英文标题的中文译名 |
| `summary_zh` | 一段式简介（100–300 字） |
| `why_it_matters_zh` | 为什么值得看（50–200 字） |
| `background_zh` | 背景信息（100–400 字） |
| `key_points_zh` | 关键要点（3–7 条，每条 20–80 字） |
| `recommended_for_zh` | 适合谁看（30–150 字） |
| `content_format_zh` | 内容形式（10–50 字） |
| `reading_or_watching_guide_zh` | 观看 / 阅读指引（30–200 字） |
| `related_themes_zh` | 相关主题（用 `｜` 分隔，5–10 个） |
| `curator_note_zh` | 策展人注（50–300 字，体现策展判断） |

### 翻译原则

- **英文资料必须翻译成中文**，不得保留纯英文简介
- 视频 / 音频必须写中文简介，不能只写"请观看原视频"
- 翻译时以原文为准，不要添加未经确认的信息
- 不得使用标题党表达（如"必看！"、"史上最！"）
- **Industrial Society and Its Future** 等争议文本保持中性资料型表达

### `translation_status` 更新

- 初始 → `待翻译`
- 标题译完 → `已译名`
- 所有策展字段完成 → `已完成`

---

## 阶段 6：状态判断（Status Assignment）

### 转为 `verified_source` 的条件（必须全部满足）

1. `source_url` 已找到且可访问（或 Archive.org 存档）
2. `source_status: 已找到` 或 `source_type: archive`
3. `translation_status: 已译名` 或 `已完成`（标题必须已翻译）
4. `curator_note_zh` 已填写
5. 无明显版权问题

### 转为 `verified_embed` 的条件（必须全部满足）

1. 满足以上 `verified_source` 全部条件
2. `embed_url` 已填入且为合法官方 embed
3. `embed_status: 可嵌入`
4. HTTP 验证 embed_url 返回 200

### 保持在 `staging` 的情况

- 来源未确认
- 无法找到可靠替代来源
- 标题尚未翻译
- 策展字段未完成
- 版权状态不明

---

## 阶段 7：路径判断（Pathway Assignment）

### 当前 5 条路径

| 路径 ID | 标题 | 适合谁 |
|---------|------|--------|
| founder-spirit | 创始人精神谱系 | 创业者、技术公司创始人 |
| tech-startup-history | 技术创业史 | 对科技史、创业史感兴趣的人 |
| media-and-society | 媒介、社会与自我 | 媒介研究者、内容创作者 |
| creator-mindset | 创作者心智与长期主义 | 内容创作者、独立工作者 |
| organization-and-strategy | 组织备忘录与战略转折 | 产品经理、战略研究者 |

### 加入路径的条件

1. `status` 为 `verified_source` 或 `verified_embed`
2. 有 `curator_note_zh`
3. 该路径的 `item_ids` 中尚未包含此条目
4. 条目主题与路径主题高度相关

### 加入路径后的派生同步

见 `docs/workflow/PATHWAY_UPDATE_WORKFLOW_ZH.md`。

必须同步更新：
- `data/paths.json` — 加入对应路径的 `item_ids`
- `paths/*.html` — 对应路径静态页
- `paths/index.html` — 路径列表 item count
- `assets/path-cards/*.svg` — 如 item count 改变
- `README.md`、`guide.html` — 如公开统计变化

### 从路径移除（当条目降级为 staging 时）

1. 从 `paths.json` 的 `item_ids` 中移除
2. 重建对应路径静态页
3. 更新 item count 派生内容（同上）

---

## 阶段 8：派生同步（Derived Sync）

每次修改 items.json 后，必须检查并同步以下派生内容：

### 必须检查的派生内容

| 文件 | 检查项 |
|------|--------|
| `paths/*.html` | item_ids 与 paths.json 一致 |
| `paths/index.html` | 各路径 item count 准确 |
| `assets/path-cards/*.svg` | 各路径 item count 准确 |
| `README.md` | 统计数字准确 |
| `docs/launch/*.md` | 统计数字准确 |
| `guide.html` | staging 数量准确 |
| `index.html` | 公开统计 meta 准确 |
| `docs/STAGING_REVIEW_PACKET_ZH.md` | staging 条目与 items.json 一致 |
| `sitemap.xml` | 新页面已加入 |

详细派生同步规则见 Phase 2M-C 工作记录。

---

## 阶段 9：审计（Audit）

每次新增条目后，执行 `docs/workflow/RELEASE_CHECKLIST_ZH.md` 中的快速校验：

### 必检项

1. items.json JSON 合法
2. paths.json JSON 合法，paths.json 不引用 staging
3. `total` / `verified_embed` / `verified_source` / `staging` 统计准确
4. 所有 verified 条目有 `curator_note_zh`
5. embed_url 只允许 youtube.com/embed 或 player.vimeo.com
6. HTML 无外部 CDN 新增
7. app.js 无新增语法错误
8. 无 items.backup*.json 或 phase*_update.py

### 外部链接抽查（每次至少抽检 1–3 条）

- 对新加入的 source_url 做 HEAD 请求
- YouTube / Vimeo 等平台允许 403/405/429
- 404 或明确失效的 URL → 降级为 staging

---

## 阶段 10：完成（Done）

完成以上全部阶段后：
1. 如有新统计变化 → 更新 README 和 launch docs
2. git commit + push
3. 通知用户新增条目已完成

---

## 快速参考：状态流转

```
staging（新录入）
  ↓ 来源确认 + title 翻译 + curator_note
verified_source
  ↓ embed_url 验证通过
verified_embed
  ↓ 来源失效
staging（降级）
```

---

## 相关文档

- [来源核实清单](SOURCE_VERIFICATION_CHECKLIST_ZH.md)
- [嵌入政策](EMBED_POLICY_ZH.md)
- [路径更新流程](PATHWAY_UPDATE_WORKFLOW_ZH.md)
- [发布检查清单](RELEASE_CHECKLIST_ZH.md)
- [新增条目 JSON 模板](../templates/new_item.template.json)
- [Agent 操作提示词模板](../templates/agent_prompt_new_item_ingestion_zh.md)
- [CONTENT_GUIDE](../CONTENT_GUIDE.md)