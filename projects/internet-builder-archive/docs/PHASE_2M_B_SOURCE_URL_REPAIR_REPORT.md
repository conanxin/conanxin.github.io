# Phase 2M-B 报告：source_url 修复与来源状态复核

**日期**：2026-05-31
**git commit**：6600105（Phase 2M）

---

## 1. 本阶段目标

处理 Phase 2M 最终审计发现的 4 条疑似失效 source_url（iba-002、iba-012、iba-020、iba-022），为每条找到更可靠或可访问的来源，或明确降级为 staging。

---

## 2. 处理的 4 条列表

### iba-012 — Why I Write（乔治·奥威尔）

| 字段 | 旧值 | 新值 |
|------|------|------|
| source_url | https://www.orwell.ru/en/why_i_write/（404） | https://www.orwellfoundation.com/the-orwell-foundation/orwell/essays-and-other-works/why-i-write/ |
| source_type | archive | author_foundation |
| source_notes_zh | 使用 orwell.ru 奥威尔官方存档 | Orwell Foundation 是奥威尔基金会官方运营的权威网站，发布本文的正式版本 |
| verification_status | 本文已进入公有领域，orwell.ru 为高质量的奥威尔作品存档站 | 原 orwell.ru URL 已失效（返回 404），已替换为 Orwell Foundation 官方页面 |
| secondary_urls | web.archive.org 存档 | Orwell Foundation 官方 + 原 orwell.ru 存档 + Gutenberg 备档 |

**状态**：✅ verified_source 保留（source_type 更新为 author_foundation）
**验证**：Orwell Foundation URL 返回 HTTP 200，页面包含完整 essay 内容（82,794 bytes）

---

### iba-002 — 真正的英雄已经死去

| 字段 | 值 |
|------|------|
| source_url | https://www.lightningdoor.com/blog/the-real-heroes-are-dead（404） |
| source_status | 需要人工复核 |
| verification_status | 原 source_url 失效（404），本环境无法确认可靠替代来源，建议人工查找并更新 |
| status | **verified_source → staging** |

**secondary_urls**：web.archive.org 存档（本环境网络限制未确认）
**降级原因**：lightningdoor.com 主域名可访问（200），但原博文路径已 404；本环境网络限制无法确认 archive.org 存档可用性，需要人工确认
**是否使用 Internet Archive**：尝试过但网络限制无法验证，secondary_urls 暂保留

---

### iba-020 — 现在就做

| 字段 | 值 |
|------|------|
| source_url | https://www.stevepavlina.com/blog/2005/09/do-it-now/（404） |
| source_status | 需要人工复核 |
| verification_status | 原 source_url 失效（404），本环境无法确认可靠替代来源，建议人工查找并更新 |
| status | **verified_source → staging** |

**secondary_urls**：web.archive.org 存档（本环境网络限制未确认）
**降级原因**：stevepavlina.com 主域名可访问（200），但原博文路径已 404；本环境网络限制无法确认 archive.org 存档可用性，需要人工确认
**注意**：iba-020 原在 paths.json 的 creator-mindset 路径中，已同步移除

---

### iba-022 — 为什么我总是迟到

| 字段 | 值 |
|------|------|
| source_url | https://www.stevepavlina.com/blog/2013/04/why-am-i-always-late/（404） |
| source_status | 需要人工复核 |
| verification_status | 原 source_url 失效（404），本环境无法确认可靠替代来源，建议人工查找并更新 |
| status | **verified_source → staging** |

**降级原因**：同上

---

## 3. Internet Archive 使用情况

- 本环境无法访问 web.archive.org（网络限制）
- secondary_urls 中暂保留 web.archive.org 存档路径，实际可用性待人工确认
- iba-012 已找到官方权威替代来源（Orwell Foundation），无需依赖 archive.org

---

## 4. 降级为 staging 的条目

iba-002、iba-020、iba-022（3 条）已降级为 staging，已加入 staging_review.json，STAGING_REVIEW_PACKET_ZH.md 追加 P2 小节。

---

## 5. 是否修改 items.json

✅ 是（仅 3 条降级 + 1 条替换 source_url）

---

## 6. 是否修改 staging_review.json

✅ 是（追加 iba-002、iba-020、iba-022，优先级 P2）

---

## 7. 最终统计

| 指标 | 修改前 | 修改后 |
|------|--------|--------|
| total | 74 | 74 |
| verified_embed | 31 | 31 |
| verified_source | 39 | 36 |
| verified total | 70 | 67 |
| staging | 4 | 7 |

**staging 构成**：
- P0（需用户截图确认）：iba-013、iba-029、iba-066、iba-073（4 条）
- P2（source_url 失效，需人工查找）：iba-002、iba-020、iba-022（3 条）

---

## 8. 未解决的问题

1. **iba-002**：lightningdoor.com 博文已下线，需人工确认替代来源
2. **iba-020**：stevepavlina.com 博文路径已变更，需人工在博客中搜索"Do It Now"并更新 URL
3. **iba-022**：stevepavlina.com 博文路径已变更，需人工在博客中搜索"Why am I always late"并更新 URL

---

## 9. 校验结果（修改后）

| 检查项 | 状态 |
|--------|------|
| items.json JSON 合法 | ✅ |
| paths.json JSON 合法 | ✅ |
| total=74 | ✅ |
| id 唯一 | ✅ |
| 67 条 verified 均有 curator_note_zh | ✅ |
| staging_review.json 含 7 条 | ✅ |
| paths.json 不引用 staging | ✅ |
| 4 条 P0 原 staging 未被错误修改 | ✅ |
| app.js 语法正确 | ✅ |
| 无临时文件 | ✅ |

---

**Git commit**：6600105（Phase 2M）
**GitHub Pages 地址**：
- 项目页：https://conanxin.github.io/projects/internet-builder-archive/
- staging 复核清单：https://conanxin.github.io/projects/internet-builder-archive/docs/STAGING_REVIEW_PACKET_ZH.md

---

## 下一步建议

1. **Phase 2B-B2**：用户补充 iba-013、iba-029、iba-066、iba-073 截图 → 处理 P0 staging；同步核实 iba-002、iba-020、iba-022（3 条 P2 staging）的人工处理方式
2. **Phase 2N**：为项目整理成案例复盘文章
3. **Phase 2O**：建立后续新增资料录入流程