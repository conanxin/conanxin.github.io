# 嵌入政策 · 中文

本文档说明「旧互联网建设者资料库」对 embed_url 的政策边界。

---

## 1. 基本原则

**只允许使用官方发布的、公开可访问的嵌入播放器。**

核心原则：不得使用非官方、非授权、侵权的完整内容嵌入。

---

## 2. 允许的嵌入来源

### 2.1 YouTube

**允许条件**：embed_url 必须来自以下来源之一：

- 官方频道（上传者拥有版权或经授权）
- 官方播放列表
- 演讲/访谈的官方发布版本

**embed_url 格式**（必须完全匹配）：
```
https://www.youtube.com/embed/[VIDEO_ID]
```

不允许：
- ❌ 非官方用户上传的完整纪录片
- ❌ 来自未授权频道的完整演讲
- ❌ 使用 `youtube.com/watch?v=` 而非 `/embed/` 的链接

### 2.2 Vimeo

**允许条件**：官方上传或经授权发布

**embed_url 格式**：
```
https://player.vimeo.com/video/[VIDEO_ID]
```

### 2.3 官方播客平台

以下平台的官方 embed 通常允许：
- Apple Podcasts（仅限有 embed 的剧集）
- Spotify（官方 Podcast embed）
- 原始发布机构官网的 embed 播放器

### 2.4 其他发布机构

大学、博物馆、媒体机构官网的原生嵌入播放器：
- Stanford eCorner
- The Criterion Collection
- 各大院校公开课平台

需验证：
- embed 来自官方域名
- 内容为该机构合法发布或授权发布

---

## 3. 不允许的嵌入来源

- ❌ 非官方完整纪录片在 YouTube / Vimeo 的完整上传
- ❌ 盗版 full movie 嵌入
- ❌ 来源不明的 YouTube 搬运（非官方频道、非官方字幕组）
- ❌ 未经授权的 conference 完整演讲录像
- ❌ 任何形式的无授权版权内容

### 判断原则

> 如果该 embed 来自一个专门搬运他人内容的频道，而非原始发布机构，则不允许。

---

## 4. source-only 条目的处理

### 4.1 什么情况下保留为 source-only

- 内容为 PDF、备忘录、文章
- 视频/音频无合法 embed（如私人录制、未公开发布）
- 版权方未提供 embed

### 4.2 source-only 字段记录

```json
{
  "embed_url": "",
  "embed_status": "不可嵌入",
  "embed_source_note": "该内容为 [PDF/文章/内部备忘录]，无合法公开嵌入来源"
}
```

或：
```json
{
  "embed_url": "",
  "embed_status": "未找到合法嵌入",
  "embed_source_note": "YouTube 存在非官方搬运，本项目不采用"
}
```

---

## 5. embed_url 验证流程

```
1. 检查 embed_url 格式是否为 youtube.com/embed/ 或 player.vimeo.com/
2. HEAD 请求验证 HTTP 200
   （YouTube/Vimeo 平台限制通常返回 403/405 → 跳过步骤 3）
3. 如返回非 200 → 降级为 source_only，embed_status 改为 "嵌入不可用"
```

---

## 6. 典型案例

### 案例 A：Bruce Lee 访谈（允许）

- 原始来源：Bruce Lee 基金会官网或授权机构
- embed：YouTube 官方频道
- ✅ `embed_url: "https://www.youtube.com/embed/..."`
- ✅ `embed_status: 可嵌入`

### 案例 B：完整纪录片非官方搬运（不允许）

- 问题来源：YouTube 频道 "Documentary Central" 完整上传了版权纪录片
- ❌ 不得采用，即使该 embed 可播放
- 正确做法：保留 `source_url`（如有），`embed_url` 留空，标注 `embed_status: 不可嵌入`

### 案例 C：Steve Pavlina 博客文章（source-only）

- 类型：文字博客
- embed_url：留空
- ✅ `embed_status: 不可嵌入`（文章无视频/音频）
- ✅ `source_url: "https://stevepavlina.com/blog/..."`

---

## 7. 快速检查清单

- [ ] embed_url 来自 youtube.com/embed/ 或 player.vimeo.com/ 或官方域名
- [ ] 来源为官方频道或经授权发布
- [ ] 非完整纪录片非官方搬运
- [ ] embed_status 记录正确
- [ ] 如内容不可嵌入，source-only 处理方式正确