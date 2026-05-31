# 数据字段说明 / DATA_SCHEMA

## 字段列表

```json
{
  "id": "string",           // 唯一标识符，格式如 "iba-001"
  "title_zh": "string",     // 中文标题（必须）
  "title_en": "string",     // 英文原题（英文内容必填）
  "category": "string",     // 主分类
  "type": "string",         // 资料类型
  "year": "string",         // 年份，如 "1996"
  "duration": "string",     // 时长，如 "01:23:45" 或 "45min"
  "people": "string",       // 作者/演讲者/受访者
  "organization": "string", // 所属公司/机构
  "source_url": "string",   // 原始链接（待补时写 null）
  "embed_url": "string",    // 嵌入 URL（无嵌入时写 null）
  "language": "string",     // 原始语言，如 "en", "zh", "ja"
  "translation_status": "string", // 翻译状态：translated / original / partial
  "summary_zh": "string",   // 中文简介（视频/音频必填）
  "why_it_matters_zh": "string", // 为什么值得看
  "notes_zh": "string",     // 备注（可选）
  "tags": ["string"],      // 标签数组
  "status": "string"       // 条目状态：placeholder | verified | unverified | pending_link
}
```

## 字段规则

| 字段 | 规则 |
|------|------|
| `title_zh` | 必须有；英文内容需翻译为中文标题 |
| `title_en` | 英文内容填写原文；中文内容写 null |
| `embed_url` | 视频/音频可嵌入时填写；不支持嵌入写 null |
| `source_url` | 有原始链接则填；待补写 null（status 标 pending_link） |
| `summary_zh` | 视频/音频**必须**填写中文简介；其他类型建议填写 |
| `why_it_matters_zh` | 必须填写，说明价值 |
| `status` | placeholder（占位）、verified（已核实）、unverified（未核实）、pending_link（待补链接） |

## 嵌入规则

- **可嵌入**：YouTube、Vimeo、SoundCloud、Spotify 等 → `embed_url` 显示 iframe/audio
- **不可嵌入**：外部网站 PDF、Bloch 文章、播客页面 → 仅显示 source_url 按钮
- **待补链接**：`source_url` 写 null，status 标 pending_link，卡片显示 `[待补链接]`

## 禁止规则

- 不得伪造 `source_url` 或 `embed_url`
- 不得将 placeholder 条目标记为 verified
- 不得在未确认情况下将 status 改为 verified
