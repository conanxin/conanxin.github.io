# Phase 2F 报告：中文发布帖、X 帖子串与 README 展示材料

**执行时间**：2026-05-31
**Phase**：2F
**Git commit 前置**：f778a21（Phase 2E）

---

## 本阶段目标

为「旧互联网建设者资料库 / Internet Builder Archive」生成可发布、可复用的中文传播材料，包括中文发布长文、X 帖子串草稿、README 展示段落、社交分享展示卡片 SVG，以及发布材料索引文档。

---

## 新增文件列表

| 文件路径 | 大小 | 说明 |
|----------|------|------|
| `docs/launch/LAUNCH_POST_ZH.md` | 5389 bytes | 中文发布长文，含项目说明、五条路径、后续计划 |
| `docs/launch/X_THREAD_ZH.md` | 4938 bytes | X 帖子串草稿，共 10 条，适合 X/Twitter 发布 |
| `docs/launch/README_SHOWCASE_BLOCK.md` | 2827 bytes | README 展示段落，可直接复制到项目 README |
| `assets/iba-share-card.svg` | 6660 bytes | 社交分享展示卡片，1200×630，纯 SVG 文本 |
| `docs/PHASE_2F_LAUNCH_MATERIALS_REPORT.md` | — | 本报告 |

---

## 修改文件列表

| 文件路径 | 修改内容 |
|----------|----------|
| `README.md` | 追加「Launch Materials / 发布材料」小节，链接到 4 份发布材料 |

---

## 发布长文摘要

**标题**：我做了一个「旧互联网建设者资料库」

**字数**：约 2000 字

**结构**：
1. 项目是什么
2. 为什么做它
3. 里面有什么（74 条，64 verified，31 可嵌入）
4. 五条专题路径
5. 适合谁
6. 怎么使用
7. 当前状态（64 verified / 10 staging）
8. 后续计划（Phase 2B 人工复核 / Phase 2G 社交分享 / Phase 2H 专题路径独立页）

**语气**：中文自然表达，有个人项目发布感，不过度营销，不夸大。

**包含链接**：
- 项目页：https://conanxin.github.io/projects/internet-builder-archive/
- 导览页：https://conanxin.github.io/projects/internet-builder-archive/guide.html
- 作者主站：https://conanxin.github.io/

---

## X 帖子串条数

**共 10 条**（符合 8–12 条要求）：

| # | 主题 |
|---|------|
| 1 | 项目公告，可单独成立，含项目名和主链接 |
| 2 | 这个资料库不只是链接清单 |
| 3 | 74 条资料的类型分布（视频/访谈/纪录片/备忘录/文章） |
| 4 | 64 条 verified 策展标准说明 |
| 5 | 5 条专题路径概览 |
| 6 | 推荐从「创始人精神谱系」开始 |
| 7 | 来源与版权原则 |
| 8 | 当前状态和后续计划 |
| 9 | 邀请语，含项目页和导览页双链接 |
| 10 | 结语 |

---

## README 展示段落说明

可复制的 Markdown block，包含：

- 一句话介绍
- 关键功能列表（5 项）
- 项目链接 + 导览页链接 + 作者主站
- 当前数据状态表格（total/verified/embed/source/staging）
- 5 条专题路径表格（路径名、核心主题、适合人群）
- 版权与来源说明
- 后续计划（Phase 2B/2G/2H）

---

## 分享卡片 SVG 说明

**文件**：`assets/iba-share-card.svg`

**规格**：
- 尺寸：1200×630（Twitter/X/Open Graph 标准比例）
- 格式：纯 SVG 文本，无外部字体、无外部图片、无外部 CSS

**内容**：
- 深色背景（#0f1923 → #1a2332 渐变）
- 左则蓝色强调条
- 顶部文件夹归档图标
- 中文标题「旧互联网建设者资料库」+ 英文副标题「Internet Builder Archive」
- 数据角标（74 items / 64 verified / 31 embeds / 5 pathways）
- 底部 URL
- 右下角 5 条路径名称药丸标签

**字体**：仅使用 `font-family="sans-serif"`，系统自带字体，中文由浏览器自行渲染。

---

## 校验结果

| 检查项 | 结果 |
|--------|------|
| data/items.json 合法 JSON | ✅ |
| data/paths.json 合法 JSON | ✅ |
| 74 条 ID 唯一 | ✅ |
| 64 条 verified 均有 curator_note_zh | ✅ |
| paths.json 不引用 staging | ✅ |
| X_THREAD_ZH.md 帖子数 = 10 | ✅ |
| assets/iba-share-card.svg 存在 | ✅ |
| SVG 无外部图片/字体/CSS 引用 | ✅（仅 xmlns URI，无实际外部资源） |
| README.md 仅追加，不重写 | ✅ |
| index.html 无新增 CDN 依赖 | ✅ |
| app.js 语法正确 | ✅ |
| 项目目录无 backup/phase*_update.py 文件 | ✅ |

---

## 预校验结果（Git add 前）

| 项目外未提交文件 | 说明 |
|-----------------|------|
| `.backup-uap-v0_6_1-20260511_203745/` | UAP 项目备份，与本任务无关 |
| `.backup-uap-v0_6_2-20260511_210758/` | UAP 项目备份，与本任务无关 |
| `.backup-uap-v0_6_2-20260511_210805/` | UAP 项目备份，与本任务无关 |
| `backups/` | 未知用途备份目录 |
| `drafts/how-to-ai-almost-anything-cn/reports/phase5g_online_fetch/` | AI 项目草稿，与本任务无关 |
| `drafts/oppo-mothers-day-report/extensions/crisis-and-redesign.bak.oppo_1_6_20260513_1359M29S/` | OPPO 项目草稿，与本任务无关 |
| `projects/data.json.bak.phase7a` | 备份文件 |
| `projects/how-to-ai-almost-anything-cn/backups/` | AI 项目备份，与本任务无关 |
| `projects/how-to-ai-almost-anything-cn/reports/phase8c_r2_online_fetch/` | AI 项目报告，与本任务无关 |

以上均为其他项目目录的文件，不在 `projects/internet-builder-archive/` 下，本次 `git add` 仅作用于本任务涉及的文件。

---

## Git 提交信息

**本次 git add 范围**：
```
projects/internet-builder-archive/docs/launch/LAUNCH_POST_ZH.md
projects/internet-builder-archive/docs/launch/X_THREAD_ZH.md
projects/internet-builder-archive/docs/launch/README_SHOWCASE_BLOCK.md
projects/internet-builder-archive/assets/iba-share-card.svg
projects/internet-builder-archive/docs/PHASE_2F_LAUNCH_MATERIALS_REPORT.md
projects/internet-builder-archive/README.md
```

**commit message**：`Add launch materials for internet builder archive`

---

## GitHub Pages 地址

| 资源 | URL |
|------|-----|
| 📂 资料库首页 | https://conanxin.github.io/projects/internet-builder-archive/ |
| 🗺 导览页 | https://conanxin.github.io/projects/internet-builder-archive/guide.html |
| 🎨 分享卡片 SVG | https://conanxin.github.io/projects/internet-builder-archive/assets/iba-share-card.svg |
| 🏠 作者主站 | https://conanxin.github.io/ |

---

## 下一步建议

| Phase | 内容 | 优先级 |
|-------|------|--------|
| **Phase 2B** | 人工复核 10 条 staging 条目（需用户提供原始截图确认来源和内容） | 高（需用户参与） |
| **Phase 2G** | 为资料库页面添加 Open Graph meta 标签（og:title、og:description、og:image）便于社交平台分享 | 高 |
| **Phase 2H** | 为 5 条专题路径各生成独立静态介绍页，提供更详细的路径说明和跳转链接 | 中 |

---

## 完成状态

✅ Phase 2F 全部任务完成，所有校验通过，等待用户确认后发布。