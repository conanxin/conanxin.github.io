# 策展型资料库数据模型 · 中文

本文档说明策展型资料库的通用数据模型。适用于任何使用 items.json / paths.json / staging_review.json 结构的项目。

---

## 1. 数据模型概述

策展型资料库有三类核心数据：

| 数据文件 | 作用 | 状态管理对象 |
|----------|------|-------------|
| items.json | 全部条目 | 条目状态 |
| paths.json | 专题路径 | 路径包含关系 |
| staging_review.json | 待复核条目 | 复核进度 |

---

## 2. Item（条目）核心字段

### 2.1 标识字段

| 字段 | 说明 | 示例 |
|------|------|------|
| id | 唯一标识，格式：`{{PREFIX}}-{{NUMBER}}` | `iba-001`、`movie-042` |
| title_zh | 中文标题 | `《教父》导演剪辑版分析` |
| title_en | 英文原题 | `The Godfather Director's Cut Analysis` |
| canonical_title_en | 权威英文标题 | `The Godfather` |

### 2.2 分类字段

| 字段 | 说明 | 枚举值 |
|------|------|--------|
| category | 内容大类 | `video`、`interview`、`article`、`memo`、`podcast`、`documentary`、`writing`、`other` |
| type | 内容形式 | `video`、`audio`、`article`、`text`、`document`、`memo` |
| year | 年份 | `1972`、`2024` |
| duration | 时长 | `90min`、`1h30m`、`45min` |
| language | 内容语言 | `en`、`zh`、`multi` |

### 2.3 来源字段

| 字段 | 说明 | 要求 |
|------|------|------|
| source_url | 主来源 URL | 必须可访问，或标注平台限制 |
| embed_url | 可嵌入播放器的 URL | 仅允许官方 YouTube/Vimeo/官方播放器 |
| secondary_urls | 备选来源 | 可含 Internet Archive 存档 |

**source_url 优先级**：
1. 作者官网 / 官方发布页
2. 出版方 / 发布机构官网
3. 大学 / 博物馆 / 档案机构
4. 官方 YouTube / Vimeo 频道
5. Internet Archive 存档
6. 可信媒体
7. 可信转载（须注明来源）

**embed_url 格式要求**：
- YouTube：`https://www.youtube.com/embed/{{VIDEO_ID}}`
- Vimeo：`https://player.vimeo.com/video/{{VIDEO_ID}}`
- 不得使用非官方来源的 embed

### 2.4 来源状态字段

| 字段 | 说明 | 枚举值 |
|------|------|--------|
| source_status | 来源可用性 | `已找到可信来源`、`需要人工复核`、`待核实` |
| embed_status | 嵌入可行性 | `已嵌入`、`不可嵌入`、`待核实` |
| verification_status | 综合验证状态 | `verified_embed`、`verified_source`、`staging` |
| source_type | 来源类型 | `official`、`archive`、`author_site`、`publication`、`trusted_archive`、`unknown` |
| media_platform | 视频平台 | `youtube`、`vimeo`、`apple`、`bbc`、`other` |

### 2.5 中文策展字段

| 字段 | 说明 | 字数建议 |
|------|------|----------|
| summary_zh | 一段式简介 | 100–300 字 |
| why_it_matters_zh | 为什么值得看 | 50–200 字 |
| background_zh | 背景信息 | 100–400 字 |
| key_points_zh | 关键要点列表 | 每点 20–80 字，3–5 条 |
| recommended_for_zh | 适合谁看 | 30–150 字 |
| content_format_zh | 内容形式 | 10–50 字 |
| reading_or_watching_guide_zh | 观看/阅读指引 | 30–200 字 |
| related_themes_zh | 相关主题 | 主题1｜主题2｜主题3 格式 |
| curator_note_zh | 策展人注 | 50–300 字，体现判断与背景 |

### 2.6 关联字段

| 字段 | 说明 |
|------|------|
| people | 相关人物列表 |
| organization | 相关机构/公司 |
| author | 作者/创作者 |
| tags | 标签列表 |
| notes_zh | 补充备注 |

### 2.7 翻译字段

| 字段 | 说明 |
|------|------|
| translation_status | `已翻译`、`待翻译`、`部分翻译` |
| title_en | 英文原题（必须保留） |
| canonical_title_en | 权威英文标题 |

---

## 3. Item 状态机

```
┌─────────────┐
│  candidate  │  ← 刚录入，未核实
└──────┬──────┘
       ▼
┌─────────────┐
│  staging    │  ← 部分确认，有不确定性
└──────┬──────┘
       ▼
┌──────────────────┐     ┌────────────────────┐
│ verified_source   │ ←→ │ verified_embed     │
│ (来源确认)         │     │ (来源+嵌入确认)      │
└──────────────────┘     └────────────────────┘
       │
       ▼
┌─────────────┐
│  archived   │  ← 降级（旧来源失效）
└─────────────┘
```

### 降级触发条件

条目降级（archived / removed）的触发条件：

| 触发条件 | 处理方式 |
|----------|----------|
| source_url 失效（404/403/410） | 查找 Internet Archive 或降级为 staging |
| 来源不可靠（SEO 站/无来源转载） | 降级为 staging，删除不可靠 source_url |
| 同名误配（配错资料） | 降级为 staging，注明误配原因 |
| 版权风险（发现非授权完整片源） | 立即移除 embed_url，保留 source_url 或降级 |
| 内容变更（长视频被切成短视频） | 降级为 staging，注明变更 |

### 为什么“降级”是可靠性机制

降级不是失败，而是**诚实的数据维护**：
- 保留失效 URL 说明数据曾经过核实
- 降级为 staging 表示数据需要人工处理
- 不会呈现不可访问的链接给用户
- 不会为了表面完成率而牺牲数据可信度

---

## 4. Path（专题路径）核心字段

| 字段 | 说明 | 示例 |
|------|------|------|
| id | 唯一标识 | `founder-spirit` |
| title_zh | 中文标题 | `创始人精神谱系` |
| subtitle_zh | 副标题 | `从 Steve Jobs 到当下的技术创始人` |
| description_zh | 路径说明 | 100–300 字 |
| item_ids | 包含的条目 ID 列表 | `["iba-001","iba-002"]` |
| page_url | 静态页面路径 | `paths/founder-spirit.html` |
| share_card_url | SVG 分享卡片路径 | `assets/path-cards/founder-spirit.svg` |
| estimated_time_zh | 预计阅读/观看时长 | `约 15 小时` |

### Path 的约束

- **item_ids 必须只包含 verified 条目**（verified_embed 或 verified_source）
- **不得引用 staging 条目**
- **条目降级后必须从 paths 中移除**
- **paths.json 更新后必须同步所有派生页面**

---

## 5. Staging Review（待复核条目）核心字段

| 字段 | 说明 | 示例 |
|------|------|------|
| id | 条目 ID | `iba-013` |
| title_zh | 中文标题 | `中文译名` |
| priority | 优先级 | `P0`（最高）/ `P1` / `P2` |
| reason | 待复核原因 | `来源不可靠`、`embed 不可用`、`待核实` |
| needed_from_user | 需要用户提供的 | `原帖截图`、`官方链接`、`内容截图` |
| recommended_action | 建议处理方式 | `补充截图后升级为 verified_source`、`降级为 archived` |
| created_phase | 创建阶段 | `Phase 1B` |
| notes | 备注 | `用户已提供截图，等待确认` |

### Priority 定义

| 优先级 | 含义 | 处理方式 |
|--------|------|----------|
| P0 | 用户已提供截图，来源基本确认 | 尽快处理 |
| P1 | 来源部分可验证，需要人工判断 | 下一个批次处理 |
| P2 | 来源不明确，需要用户提供截图 | 等待用户提供 |

---

## 6. 字段约束总结

| 约束 | 说明 |
|------|------|
| id 唯一 | 每个 id 在 items.json 中唯一 |
| status 枚举 | 只允许 `verified_embed`、`verified_source`、`staging` |
| embed_url 格式 | 必须为 youtube.com/embed 或 player.vimeo.com |
| source_url 非空 | verified 条目必须有 source_url |
| paths 不含 staging | paths.json 的 item_ids 不得引用 staging 条目 |
| JSON 合法 | 所有 JSON 文件必须合法 |
| 中文字段非空 | verified 条目必须有 curator_note_zh |