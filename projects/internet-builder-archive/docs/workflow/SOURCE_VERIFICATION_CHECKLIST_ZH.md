# 来源核实清单 · 中文

本文档说明「旧互联网建设者资料库」对外部 source_url 的核实标准。

---

## 1. 来源优先级

可信度从高到低排序：

| 优先级 | 来源类型 | 示例 | 备注 |
|--------|----------|------|------|
| 1 | 作者官网 | stevepavlina.com/blog、grahamdismond.com | 域名对应作者本人 |
| 2 | 公司/出版方/发布机构 | apple.com/newsroom、oreilly.com | 官方发布 |
| 3 | 大学/博物馆/档案机构 | Stanford eCorner、MoMA archives | 学术/机构背书 |
| 4 | 官方 YouTube/Vimeo/播客 | 官方频道的 embed | 需 HTTP 200 验证 |
| 5 | Internet Archive 存档 | web.archive.org | 作为 secondary_url，source_type: archive |
| 6 | 可信媒体 | The Verge、Wired、BBC 等 | 有完整来源标注 |
| 7 | 可信转载（带署名） | 有原始来源的 longform 博客 | 需注明原始来源 |

---

## 2. 什么不能作为主来源

以下类型**不得**作为 `source_url`：

- ❌ SEO 采集站（如 "articlegeek.com"、无原创内容的列表站）
- ❌ 无来源说明转载（整页复制，无作者、无原始链接）
- ❌ 非官方完整纪录片搬运（YouTube 完整上传他人版权内容）
- ❌ 盗版 full movie
- ❌ 来源不明的随机搬运号
- ❌ 无法确认作者与出处的页面
- ❌ 失效链接（返回 404、410、timeout）

---

## 3. 什么时候应该降级为 staging

满足以下任一条件，应将条目降级为 `staging`：

1. **无法找到可靠来源** — 原始 URL 已失效且无法找到替代
2. **来源质量可疑** — 只能找到 SEO 采集站或无来源转载
3. **版权状态不明** — 不确定是否可公开引用
4. **只找到不可靠转载** — 找不到作者/机构官方发布

### 降级操作

- `status` → `staging`
- `source_status` → `需要人工复核`
- `verification_status` → 说明为什么降级
- 在 `staging_review.json` 中加入记录
- 在 `notes_zh` 中记录已尝试的查找过程

---

## 4. source_url 失效时的处理流程

```
1. 尝试官方主页 / 同一域名的新路径
   ↓ 失败
2. 搜索 Internet Archive（web.archive.org）
   ↓ 失败
3. 搜索作者/机构当前可访问页面
   ↓ 失败
4. 搜索可信媒体或权威来源
   ↓ 失败
5. 降级为 staging，记录查找过程
```

### 示例

**iba-012（George Orwell "Why I Write"）**：
- 原 URL：orwell.ru/why_i_write/ → 404
- 处理：搜索 Internet Archive → 无直接存档 → 搜索 Orwell Foundation 官网 → 找到 https://www.orwellfoundation.com/the-work-and-legacy-of-george-orwell/reading-essays/why-i-write/ → 替换 source_url

**iba-020（Steve Pavlina "Do It Now"）**：
- 原 URL：stevepavlina.com/blog/do-it-now → 404
- 处理：尝试 stevepavlina.com → 主页正常 → 搜索 archive.org → 有存档 → 替换为 archive.org 存档 URL，source_type: archive
- 但存档 URL 同样失效 → 降级为 staging

---

## 5. 如何记录 source_notes_zh

在 `source_notes_zh` 字段中说明：

1. **来源类型**（官方/档案/转载）
2. **为什么选择该来源**（权威性、可信度）
3. **如使用 archive.org 存档**，说明：
   > 原官方链接已失效，当前来源为 Internet Archive 存档。存档时间：[年-月]。建议同时关注官方是否有新发布。

### 示例

```
source_notes_zh: "来源为 George Orwell Foundation 官方网站，
提供《Why I Write》Essay 全文。该基金会由 Orwell 遗产管理方授权运营，
为权威来源。原 orwell.ru 链接已失效（404），已替换为官方来源。"
```

---

## 6. secondary_urls 的使用

当官方来源失效，但找到了 Archive.org 存档或其他可信替代时：

- `source_url` → 填入主要可信来源
- `secondary_urls` → 可加入 Archive.org 存档 URL 和原失效 URL

示例：
```json
{
  "source_url": "https://www.orwellfoundation.com/...",
  "secondary_urls": [
    {"url": "https://web.archive.org/web/2024/https://orwell.ru/why_i_write/", "note": "原链接存档，2024年"},
    {"url": "https://orwell.ru/why_i_write/", "note": "原链接，已失效（404）"}
  ]
}
```

---

## 7. 快速检查清单

- [ ] source_url 可通过 HTTP 200 验证（允许平台限制 403/405/429）
- [ ] 来源类型明确（official / archive / publication / author_site / trusted_archive）
- [ ] 无 SEO 采集站或无来源转载
- [ ] 不采用非官方完整纪录片搬运
- [ ] source_notes_zh 记录了来源选择理由
- [ ] 如来源为 Archive.org，在 source_notes_zh 中说明存档时间