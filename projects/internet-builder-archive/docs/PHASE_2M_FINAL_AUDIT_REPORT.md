# Phase 2M 报告：最终内容审计与链接抽查

**日期**：2026-05-31
**git commit**：eeaef2a（Phase 2L）

---

## 1. 本阶段目标

对 internet-builder-archive 项目进行最终内容审计与链接抽查，确认数据一致性、页面完整性、Meta/SEO 配置，并保守抽查外部 source_url 状态。

---

## 2. 数据统计审计结果

| 指标 | 预期 | 实际 | 状态 |
|------|------|------|------|
| total | 74 | 74 | ✅ |
| verified_embed | 31 | 31 | ✅ |
| verified_source | 39 | 39 | ✅ |
| verified total | 70 | 70 | ✅ |
| staging | 4 | 4 | ✅ |
| curator_note_zh | 70 | 70 | ✅ |
| paths | 5 | 5 | ✅ |

**staging 条目确认**：iba-013、iba-029、iba-066、iba-073 — 全部保留 ✅

**paths.json 一致性**：
- 所有 33 个 item_ids 存在于 items.json ✅
- 不引用任何 staging 条目 ✅
- 5 条路径均有 page_url 与 share_card_url ✅

---

## 3. 页面与内部链接审计结果

### 核心页面（全部存在 ✅）

| 页面 | 状态 |
|------|------|
| index.html | ✅ |
| guide.html | ✅ |
| paths/index.html | ✅ |
| paths/founder-spirit.html | ✅ |
| paths/tech-startup-history.html | ✅ |
| paths/media-and-society.html | ✅ |
| paths/creator-mindset.html | ✅ |
| paths/organization-and-strategy.html | ✅ |

### CSS / JS / 数据文件

| 文件 | 状态 |
|------|------|
| styles.css | ✅ |
| app.js | ✅ |
| data/items.json | ✅ |
| data/paths.json | ✅ |
| data/staging_review.json | ✅ |

### SVG 分享卡片（全部存在 ✅）

| 文件 | 大小 |
|------|------|
| assets/iba-share-card.svg | ✅ |
| assets/path-cards/founder-spirit.svg | 4,592 B |
| assets/path-cards/tech-startup-history.svg | 4,844 B |
| assets/path-cards/media-and-society.svg | 4,392 B |
| assets/path-cards/creator-mindset.svg | 4,313 B |
| assets/path-cards/organization-and-strategy.svg | 4,560 B |

### 截图 PNG（全部存在 ✅）

| 文件 | 大小 |
|------|------|
| assets/screenshots/home-desktop.png | 165,490 B |
| assets/screenshots/home-mobile.png | 129,316 B |
| assets/screenshots/guide-desktop.png | 226,720 B |
| assets/screenshots/path-founder-spirit-desktop.png | 147,454 B |
| assets/screenshots/path-creator-mindset-desktop.png | 154,702 B |
| assets/screenshots/path-index-desktop.png | 71,789 B |

### 发布文档（全部存在 ✅）

| 文件 | 大小 |
|------|------|
| docs/launch/LAUNCH_POST_ZH.md | 5,394 B |
| docs/launch/X_THREAD_ZH.md | 4,940 B |
| docs/launch/README_SHOWCASE_BLOCK.md | 4,055 B |
| docs/launch/PATH_SHORT_POSTS_ZH.md | 14,102 B |

---

## 4. Meta / SEO 审计结果

### 7 个页面的完整 Meta 检查

| 页面 | og:title | og:description | og:url | og:image | og:image:w/h | twitter:card | twitter:image | 状态 |
|------|----------|----------------|--------|----------|---------------|---------------|---------------|------|
| index.html | ✅ | ✅ | ✅ | iba-share-card.svg | 1200/630 | ✅ | iba-share-card.svg | ✅ |
| guide.html | ✅ | ✅ | ✅ | iba-share-card.svg | 1200/630 | ✅ | iba-share-card.svg | ✅ |
| founder-spirit.html | ✅ | ✅ | ✅ | founder-spirit.svg | 1200/630 | ✅ | founder-spirit.svg | ✅ |
| tech-startup-history.html | ✅ | ✅ | ✅ | tech-startup-history.svg | 1200/630 | ✅ | tech-startup-history.svg | ✅ |
| media-and-society.html | ✅ | ✅ | ✅ | media-and-society.svg | 1200/630 | ✅ | media-and-society.svg | ✅ |
| creator-mindset.html | ✅ | ✅ | ✅ | creator-mindset.svg | 1200/630 | ✅ | creator-mindset.svg | ✅ |
| organization-and-strategy.html | ✅ | ✅ | ✅ | organization-and-strategy.svg | 1200/630 | ✅ | organization-and-strategy.svg | ✅ |

**注**：路径页缺少 `og:site_name` 与 `og:locale`，属可选字段，不影响功能。

---

## 5. sitemap / robots 审计结果

**sitemap.xml**：✅ 包含 8 个 iba 核心 URL，无 SVG/PNG/MD/JSON，无重复
**robots.txt**：✅ 包含 `Sitemap: https://conanxin.github.io/sitemap.xml`

---

## 6. 外部链接抽查结果（20 条）

| # | 条目 | 分类 | 状态 | URL |
|---|------|------|------|-----|
| 1 | iba-007 | 文章与人生思考 | ⚠️ TIMEOUT | indiehackers.com |
| 2 | iba-051 | 访谈 | ⚠️ PLATFORM_LIMIT | youtube.com |
| 3 | iba-012 | 文章与人生思考 | ⚠️ 404（URL路径问题，页面可能已迁移） | orwell.ru |
| 4 | iba-020 | 文章与人生思考 | ❌ 404（文章已删除或迁移） | stevepavlina.com |
| 5 | iba-046 | 纪录片 | ⚠️ PLATFORM_LIMIT（IMDb 反自动化） | imdb.com |
| 6 | iba-043 | 纪录片 | ⚠️ PLATFORM_LIMIT | imdb.com |
| 7 | iba-026 | 纪录片 | ⚠️ PLATFORM_LIMIT | imdb.com |
| 8 | iba-070 | 公司内部备忘录 | ✅ OK（200） | ashimoto.com |
| 9 | iba-017 | 文章与人生思考 | ⚠️ OSError（archive.org 网络限制） | archive.org |
| 10 | iba-049 | 访谈 | ⚠️ OSError（web.archive.org 网络限制） | web.archive.org |
| 11 | iba-054 | 访谈 | ⚠️ PLATFORM_LIMIT | youtube.com |
| 12 | iba-044 | 纪录片 | ⚠️ PLATFORM_LIMIT | imdb.com |
| 13 | iba-063 | 访谈 | ⚠️ PLATFORM_LIMIT | youtube.com |
| 14 | iba-002 | 文章与人生思考 | ❌ 404（站点已不存在） | lightningdoor.com |
| 15 | iba-028 | 纪录片 | ⚠️ PLATFORM_LIMIT | imdb.com |
| 16 | iba-040 | 纪录片 | ⚠️ PLATFORM_LIMIT | imdb.com |
| 17 | iba-001 | 文章与人生思考 | ✅ OK（200） | timferriss.org |
| 18 | iba-047 | 纪录片 | ⚠️ PLATFORM_LIMIT | imdb.com |
| 19 | iba-042 | 纪录片 | ⚠️ PLATFORM_LIMIT | imdb.com |
| 20 | iba-022 | 文章与人生思考 | ❌ 404（文章已删除或迁移） | stevepavlina.com |

**统计**：✅ 2 / ⚠️ 15 / ❌ 3

**说明**：
- YouTube / IMDb / web.archive.org 限制自动化访问，结果标注为平台限制，不代表链接失效
- stevepavlina.com 两篇文章返回 404，需后续确认迁移路径或替换
- lightningdoor.com 站点已不存在
- orwell.ru 404 可能是 URL 路径问题，页面可能已迁移

**注意**：以上均为保守抽查，不建议大规模替换 source_url。如需修复，建议在 Phase 2B-B2 中结合用户截图一并处理。

---

## 7. 内容抽样审计（10 条 verified 条目）

覆盖分类：访谈×2、备忘录×2、纪录片×3、文章×3

| 条目 | 空字段 | 红旗词 | 备注 |
|------|--------|--------|------|
| iba-056 | 无 | "最"×2 | 正常策展语 |
| iba-070 | 无 | "最"×1 | 正常策展语 |
| iba-034 | 无 | 无 | ✅ 最干净 |
| iba-012 | 无 | "最"×2 | 正常策展语 |
| iba-045 | 无 | "极""最""完美" | "完美"出现于背景描述，非营销语气，可接受 |
| iba-006 | 无 | "最"×1 | 正常策展语 |
| iba-071 | 无 | "最"×2、"极"×1 | 正常策展语 |
| iba-049 | 无 | "最"×2 | 正常策展语 |
| iba-027 | 无 | "最"×1 | 正常策展语 |
| iba-033 | 无 | "最"×1 | 正常策展语 |

**结论**：无占位语、无重复模板。所有"最"字均为描述性语气（最年长、最尖锐、最早等），非标题党夸张表达。内容质量良好。

---

## 8. 发现的问题

### 记录（不自动修复）
1. **iba-012**（orwell.ru）— 404，当前 URL 路径可能已变更，需人工确认正确路径
2. **iba-020、iba-022**（stevepavlina.com）— 404，博文已删除或迁移，需人工确认
3. **iba-002**（lightningdoor.com）— 404，站点已不存在
4. **路径页缺少 og:site_name / og:locale** — 可选字段，不影响功能，记录仅供参考

### 需要人工处理（Phase 2B-B2）
- 以上 3 条 source_url 建议在用户补充截图后，结合实际情况决定是否替换

---

## 9. 本阶段已修复的问题

无。本阶段为纯审计阶段，按要求不自动修复外部 source_url。

---

## 10. 未修复但建议后续处理的问题

1. **4 条 staging 条目**（iba-013、iba-029、iba-066、iba-073）— 等待用户补充截图后处理
2. **3 条疑似失效 source_url**（iba-012、iba-020、iba-022）— 建议 Phase 2B-B2 中结合截图一并确认
3. **iba-002**（lightningdoor.com 已不存在）— 需替换为替代来源或移除

---

## 11. 是否修改 items.json

❌ 否

## 12. 是否修改 paths.json

❌ 否

---

**Git commit**：eeaef2a（Phase 2L）
**GitHub Pages 地址**：
- 项目页：https://conanxin.github.io/projects/internet-builder-archive/
- 导览页：https://conanxin.github.io/projects/internet-builder-archive/guide.html
- 路径索引：https://conanxin.github.io/projects/internet-builder-archive/paths/
- 5 条路径页（略，详见 sitemap）
- sitemap：https://conanxin.github.io/sitemap.xml
- robots：https://conanxin.github.io/robots.txt

---

## 下一步建议

1. **Phase 2B-B2**：用户补充 4 条 P0 截图（iba-013、iba-029、iba-066、iba-073）后，agent 处理 remaining staging；同步核实上述 3 条疑似失效 source_url
2. **Phase 2N**：为项目整理成案例复盘文章（如复盘从原帖到上线的全过程）
3. **Phase 2O**：建立后续新增资料的录入流程（CONTENT_GUIDE 更新 + 标准化模板）