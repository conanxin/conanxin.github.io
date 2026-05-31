# 路径更新流程 · 中文

本文档说明将新条目加入专题路径、或将已降级条目从路径移除的标准流程。

---

## 1. 当前 5 条路径

| 路径 ID | 标题 | 当前 item count | 适合谁 |
|---------|------|----------------|--------|
| founder-spirit | 创始人精神谱系 | 8 items | 创业者、技术公司创始人 |
| tech-startup-history | 技术创业史 | 8 items | 对科技史、创业史感兴趣的人 |
| media-and-society | 媒介、社会与自我 | 8 items | 媒介研究者、内容创作者 |
| creator-mindset | 创作者心智与长期主义 | 9 items | 内容创作者、独立工作者 |
| organization-and-strategy | 组织备忘录与战略转折 | 7 items | 产品经理、战略研究者 |

---

## 2. 加入路径的条件

新条目加入任一路径，必须满足：

1. `status` 为 `verified_source` 或 `verified_embed`
2. 有 `curator_note_zh`
3. 该路径的 `item_ids` 中尚未包含此条目
4. 条目主题与路径主题高度相关

### 判断相关性

- founder-spirit：关于创业者精神、信念、决断力的访谈/文章/演讲
- tech-startup-history：关于科技公司历史、创业公司案例的纪录片/访谈/备忘录
- media-and-society：关于媒介影响、社会结构、身份认同的内容
- creator-mindset：关于创作方法论、长期主义、行动力的内容
- organization-and-strategy：关于公司战略转折、组织管理、战略决策的内容

---

## 3. 加入路径的派生同步

当新条目加入某路径后，必须按顺序更新以下文件：

### 步骤 1：更新 data/paths.json

```python
paths_data = json.load(open('data/paths.json'))
path = next(p for p in paths_data['paths'] if p['id'] == 'target-path-id')
if 'new-item-id' not in path['item_ids']:
    path['item_ids'].append('new-item-id')
json.dump(paths_data, open('data/paths.json', 'w'), ensure_ascii=False, indent=2)
```

### 步骤 2：重建路径静态页

生成或更新 `paths/[path-id].html`。

使用 Phase 2H 建立的结构：
- og:image 指向对应的 SVG 分享卡片
- item count 从 paths.json 实时读取
- 条目列表按 item_ids 顺序展示

### 步骤 3：更新 paths/index.html

如果有路径列表 item count 显示，更新为当前路径的实际 item_ids 数量。

### 步骤 4：更新 SVG 分享卡片（如 item count 改变）

如果路径 item count 从 N 变为 N+1，更新 `assets/path-cards/[path-id].svg` 中的 badge 数字。

### 步骤 5：更新公开统计

如果 overall 统计变化（total / verified / staging），更新：
- `index.html` meta description
- `guide.html` 统计说明
- `README.md`
- `docs/launch/*.md`

### 步骤 6：更新 sitemap（如有新建路径页）

在 `sitemap.xml` 中加入新路径页 URL（priority: 0.6, changefreq: monthly）。

---

## 4. 从路径移除（当条目降级为 staging 时）

当 `item_ids` 中的条目被降级为 `staging`：

### 步骤 1：从 paths.json 移除

```python
path = next(p for p in paths_data['paths'] if p['id'] == 'affected-path-id')
if 'staged-item-id' in path['item_ids']:
    path['item_ids'].remove('staged-item-id')
```

### 步骤 2：重建路径静态页

移除该条目后重建 `paths/[path-id].html`。

### 步骤 3：更新 paths/index.html

item count 减 1。

### 步骤 4：更新 SVG 分享卡片

badge 数字减 1。

### 步骤 5：执行 Phase 2M-C 派生同步

确保所有公开统计一致（verified / staging counts）。

---

## 5. 新建路径的条件

满足以下条件时，才应考虑新建路径：

1. 有 5+ 条 verified 条目主题高度一致，但不属于现有 5 条路径
2. 新路径的主题与现有路径无重叠
3. 路径需有足够的 item 支撑（建议至少 5 条）

### 新建路径的额外派生内容

新建路径时，需要额外创建：
- `assets/path-cards/[new-path-id].svg` — SVG 分享卡片（1200×630，纯 SVG text）
- `paths/[new-path-id].html` — 路径静态页
- sitemap.xml 更新
- paths.json 更新
- README / launch docs 更新统计

---

## 6. 快速检查清单

**加入路径前**：
- [ ] 条目 status 为 verified_source 或 verified_embed
- [ ] 条目有 curator_note_zh
- [ ] 条目不在该路径 item_ids 中
- [ ] 条目与路径主题相关

**加入路径后**：
- [ ] data/paths.json 已更新
- [ ] paths/*.html 已重建
- [ ] paths/index.html item count 已更新
- [ ] SVG badge 数字已更新（如 item count 变化）
- [ ] 公开统计已更新（如 overall 统计变化）
- [ ] 无 staging 条目被加入 paths.json

**从路径移除前**：
- [ ] 条目已降级为 staging
- [ ] 该条目在 paths.json 中

**从路径移除后**：
- [ ] data/paths.json 已移除
- [ ] paths/*.html 已重建
- [ ] SVG badge 数字已更新
- [ ] 公开统计一致
- [ ] staging_review.json / STAGING_REVIEW_PACKET_ZH.md 已同步