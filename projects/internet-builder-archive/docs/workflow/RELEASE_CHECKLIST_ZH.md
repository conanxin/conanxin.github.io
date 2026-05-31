# 发布检查清单 · 中文

每次新增条目或修改状态后，执行以下检查清单。全部通过后方可 git push。

---

## 1. 数据校验

- [ ] `data/items.json` 是合法 JSON，无语法错误
- [ ] `data/paths.json` 是合法 JSON，无语法错误
- [ ] `data/staging_review.json` 是合法 JSON（如有修改）
- [ ] `total` 计数正确
- [ ] `verified_embed` 计数正确
- [ ] `verified_source` 计数正确
- [ ] `verified total = verified_embed + verified_source`
- [ ] `staging` 计数正确
- [ ] 所有 `verified_*` 条目均有 `curator_note_zh`
- [ ] 所有 `verified_*` 条目的 `curator_note_zh` 非空

---

## 2. 路径校验

- [ ] `paths.json` 不引用任何 `staging` 条目
- [ ] 所有 `paths[].item_ids` 中的 ID 均存在于 `items.json`
- [ ] 每条路径的 `item_ids` 数量与路径静态页一致
- [ ] `paths.json` 包含 5 条路径，所有字段完整

---

## 3. 嵌入校验

- [ ] `embed_url` 只包含 youtube.com/embed/ 或 player.vimeo.com/ 格式
- [ ] 无 `verified_embed` 条目的 `embed_url` 为空
- [ ] 无 `staging` 条目被设为 `verified_embed`

---

## 4. 页面校验

检查以下核心页面存在且无语法错误：
- [ ] `index.html`
- [ ] `guide.html`
- [ ] `paths/index.html`
- [ ] `paths/founder-spirit.html`
- [ ] `paths/tech-startup-history.html`
- [ ] `paths/media-and-society.html`
- [ ] `paths/creator-mindset.html`
- [ ] `paths/organization-and-strategy.html`

---

## 5. Meta / SEO 校验

- [ ] `index.html` 有完整 og:title / og:description / og:url / og:image / twitter:card
- [ ] `guide.html` 有完整 og:* / twitter:* meta
- [ ] 所有 5 个路径页有完整 og:* / twitter:* meta
- [ ] `og:image` 指向的文件存在于仓库
- [ ] `canonical` URL 正确

---

## 6. README / launch docs 校验

- [ ] `README.md` 统计数字与 items.json 一致
- [ ] `docs/launch/LAUNCH_POST_ZH.md` 统计数字一致
- [ ] `docs/launch/X_THREAD_ZH.md` 统计数字一致
- [ ] `docs/launch/README_SHOWCASE_BLOCK.md` 统计数字一致
- [ ] 新增的 case study / workflow 链接已加入 README

---

## 7. 截图 / 分享卡片校验

- [ ] 6 个截图文件均存在（`assets/screenshots/*.png`）
- [ ] 5 个 SVG 分享卡片均存在（`assets/path-cards/*.svg`）
- [ ] SVG 分享卡片 item count 与 paths.json 一致
- [ ] SVG 无外部字体/图片/CSS 引用

---

## 8. sitemap / robots 校验

- [ ] `sitemap.xml` 包含所有 iba 核心页面
- [ ] `robots.txt` 包含 `Sitemap:` 行
- [ ] sitemap.xml 无破损 XML

---

## 9. 外部链接抽查

每次新增 / 修改 source_url 后，至少抽检 1–3 条：

- [ ] 用 HEAD 请求验证 source_url 可访问（允许 403/405/429 平台限制）
- [ ] 如返回 404/410 → 降级为 staging，不得保留为 verified
- [ ] 新加入的 embed_url 用 HEAD 验证

---

## 10. staging review 校验

- [ ] `staging_review.json` 条目数量与 items.json 中 staging 数量一致
- [ ] `staging_review.json` 不包含 verified 条目
- [ ] `docs/STAGING_REVIEW_PACKET_ZH.md` 与 staging_review.json 一致

---

## 11. 临时文件检查

- [ ] 无 `items.backup*.json` 文件
- [ ] 无 `phase*_update.py` 临时脚本
- [ ] 无其他未预期的临时文件

---

## 12. git commit / push 检查

- [ ] `git status` 干净（只有本阶段变更）
- [ ] `git add` 只添加 `projects/internet-builder-archive/` 下本任务涉及文件
- [ ] commit message 格式：`[简短前缀] [描述]（Phase X）`
- [ ] `git push origin main` 成功

---

## 快速命令参考

```bash
# 数据校验
python3 -c "import json; items=json.load(open('data/items.json')); print(f'total={len(items)} verified={sum(1 for i in items if i[\"status\"] in [\"verified_embed\",\"verified_source\"])} staging={sum(1 for i in items if i[\"status\"]==\"staging\")}')"

# paths.json 校验
python3 -c "import json; p=json.load(open('data/paths.json')); print('paths:',len(p['paths'])); print('no staging:', all(i not in [si for path in p['paths'] for i in path['item_ids'] for si in [\"iba-002\",\"iba-013\",\"iba-020\",\"iba-022\",\"iba-029\",\"iba-066\",\"iba-073\"]))"

# app.js 语法检查
node --check app.js

# JSON 合法性
python3 -c "import json; json.load(open('data/items.json')); json.load(open('data/paths.json')); print('OK')"
```