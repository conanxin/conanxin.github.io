# 策展型资料库质量审计模板 · 中文

本文档提供策展型资料库的标准审计流程与报告模板。

---

## 1. 数据审计

### 1.1 JSON 合法性与结构

```bash
# 检查 items.json 合法
python3 -c "import json; json.load(open('data/items.json'))"

# 检查 paths.json 合法
python3 -c "import json; json.load(open('data/paths.json'))"

# 检查 staging_review.json 合法
python3 -c "import json; json.load(open('data/staging_review.json'))"
```

**校验项**：
- [ ] items.json 是合法 JSON
- [ ] paths.json 是合法 JSON
- [ ] staging_review.json 是合法 JSON
- [ ] 所有 id 唯一
- [ ] 无重复 id

### 1.2 数据统计

**必须校验**：
- [ ] total = len(items)
- [ ] verified_embed = len([i for i in items if i['status']=='verified_embed'])
- [ ] verified_source = len([i for i in items if i['status']=='verified_source'])
- [ ] staging = len([i for i in items if i['status']=='staging'])
- [ ] verified total = verified_embed + verified_source
- [ ] 所有 verified 条目有 `curator_note_zh`

---

## 2. 来源审计

### 2.1 source_url 抽查

从 verified 条目中抽查 20 个外部 source_url：

**抽样规则**：
- 覆盖所有主要 category（article、video、interview、documentary、memo）
- 优先抽样较老的条目（year < 2015）
- 优先抽样非官方来源

**检查方式**：

```python
import urllib.request
ctx = ssl.create_default_context()
url = "https://example.com/source"
req = urllib.request.Request(url, method='GET')
req.add_header('User-Agent', 'Mozilla/5.0')
try:
    with urllib.request.urlopen(req, timeout=10, context=ctx) as r:
        status = r.status
except urllib.error.HTTPError as e:
    status = e.code
except Exception as e:
    status = f"ERROR: {e}"
```

**状态分类**：
| 状态 | 含义 | 处理 |
|------|------|------|
| HTTP 200 | 可访问 | ✅ |
| HTTP 301/302 | 重定向 | 跟随重定向，记录新 URL |
| HTTP 403/405 | 平台限制 | ⚠️ YouTube/Vimeo/Apple 等平台常见，不一定失效 |
| HTTP 404 | 失效 | ❌ 降级为 staging 或修复 |
| ERROR | 异常 | ❌ 检查原因 |

### 2.2 embed_url 合规审计

**校验项**：
- [ ] embed_url 格式为 youtube.com/embed 或 player.vimeo.com
- [ ] 无非官方 embed（如 torrent embed、非官方搬运）
- [ ] embed_url 指向的页面可访问（允许平台限制）

```python
import re
embed = item.get('embed_url', '')
if embed:
    valid = re.match(r'^https://(www\.)?youtube\.com/embed/.+', embed) or \
            re.match(r'^https://player\.vimeo\.com/video/\d+', embed)
    if not valid:
        print(f"INVALID EMBED: {item['id']} {embed}")
```

---

## 3. staging 审计

**校验项**：
- [ ] staging 条目数量与 staging_review.json 一致
- [ ] 所有 staging 条目有 reason 和 priority
- [ ] staging 条目的 source_url 仍为待确认状态
- [ ] P0 条目的 needed_from_user 清晰

**staging 降级检查**：
- [ ] 长期 staging（>3 个 Phase 未处理）是否需要降级或归档
- [ ] 用户提供了截图的 P0 条目是否及时处理

---

## 4. paths.json 审计

**校验项**：
- [ ] paths.json 不引用 staging 条目
- [ ] 所有 item_ids 在 items.json 中存在
- [ ] 每条路径的 item_ids 数量与静态页一致
- [ ] page_url 指向存在的文件
- [ ] share_card_url 指向存在的 SVG

---

## 5. 派生页面统计同步

**必须检查的文件**：
- [ ] README.md — verified count、staging count
- [ ] docs/launch/LAUNCH_POST_ZH.md — 统计
- [ ] docs/launch/X_THREAD_ZH.md — 统计
- [ ] docs/launch/README_SHOWCASE_BLOCK.md — 统计
- [ ] paths/index.html — 路径 item count
- [ ] paths/{{PATH_ID}}.html — 路径 item count（如有）
- [ ] assets/path-cards/{{PATH_ID}}.svg — 路径 item count（如有）

**同步规则**：
- 任何 items.json 变化 → 更新所有引用统计的文件
- 任何 paths.json 变化 → 更新路径页 item count
- 只同步准确数字，不四舍五入

---

## 6. Meta / SEO 审计

**必须检查的页面**：
- [ ] index.html
- [ ] guide.html
- [ ] paths/index.html
- [ ] paths/{{PATH_ID}}.html（所有 5 条路径）

**每个页面必须包含**：
- [ ] `<title>`
- [ ] `<meta name="description">`
- [ ] `<link rel="canonical">`
- [ ] `<meta property="og:title">`
- [ ] `<meta property="og:description">`
- [ ] `<meta property="og:url">`
- [ ] `<meta property="og:image">`
- [ ] `<meta name="twitter:card">`
- [ ] `<meta name="twitter:image">`

**og:image 额外校验**：
- [ ] og:image 指向的文件存在
- [ ] og:image 为 SVG 或 PNG/JPG（1200×630 推荐）
- [ ] 每个路径页 og:image 指向对应路径分享卡片

---

## 7. sitemap / robots 审计

**sitemap.xml**：
- [ ] 包含所有核心页面 URL
- [ ] 每个 URL 有 `<loc>`
- [ ] 每个 URL 有 `<lastmod>`
- [ ] changefreq 和 priority 合理

**robots.txt**：
- [ ] 包含 `Sitemap: https://{{DOMAIN}}/sitemap.xml`
- [ ] 无错误的 disallow 规则

---

## 8. 失效链接降级机制

### 降级触发

当 source_url 抽查发现以下情况时：
- HTTP 404 → 立即降级为 staging
- HTTP 410 → 立即降级为 staging
- 域名不存在 → 立即降级为 staging

### 降级处理

```python
if status in [404, 410] or '域名不存在' in str(err):
    # 查找 Internet Archive
    archive_url = f"https://web.archive.org/web/{source_url}"
    # 或降级为 staging
    item['status'] = 'staging'
    item['notes_zh'] = f"来源失效，降级待复核（发现于 Phase X 审计）"
```

---

## 9. 最终审计报告模板

```markdown
# Phase X 审计报告

**日期**：
**git commit**：

---

## 1. 数据统计

| 指标 | 数值 |
|------|------|
| total | N |
| verified_embed | N |
| verified_source | N |
| verified | N |
| staging | N |
| paths | N |

---

## 2. 数据一致性

- [ ] items.json JSON 合法
- [ ] paths.json JSON 合法
- [ ] staging_review.json JSON 合法
- [ ] total=74
- [ ] verified_embed=31
- [ ] verified_source=36
- [ ] staging=7
- [ ] 67 verified 均有 curator_note_zh
- [ ] paths.json 不引用 staging

---

## 3. 来源审计

| URL | 状态 | 处理 |
|-----|------|------|
| ... | ... | ... |

---

## 4. 派生页面同步

- [ ] README.md 统计
- [ ] docs/launch/ 统计
- [ ] paths/index.html item count
- [ ] 路径分享卡片 item count

---

## 5. 发现的问题

1. ...
2. ...

---

## 6. 已修复的问题

1. ...

---

## 7. 未修复但需后续处理的问题

1. ...

---

## 8. 校验结果

| 检查项 | 状态 |
|--------|------|
| ... | ✅/❌ |

---

**Git commit**：
**GitHub Pages 地址**：
**下一步建议**：
```