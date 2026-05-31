# Phase 2B-A 报告：staging 条目人工复核清单生成

**执行时间**：2026-05-31
**Phase**：2B-A
**Git commit 前置**：d9e095c（Phase 2G）

---

## 本阶段目标

不验证、不猜测、不改状态。只根据 data/items.json 中当前 `status == "staging"` 的 10 条条目，生成人工复核指南和机器可读文件，帮助用户在后续 Phase 2B-B 阶段补充原始截图或明确判断后逐一处理。

---

## staging 条目总数

**10 条**（从 data/items.json 自动读取，符合预期）

---

## staging 条目列表

| # | ID | 中文标题 | 类型 | source_status | 复核优先级 |
|---|-----|----------|------|---------------|------------|
| 1 | iba-013 | 玩医生的游戏 | article | 需要人工复核 | **P0** |
| 2 | iba-029 | 扼住咽喉（剧情片，非纪录片） | documentary | 需要人工复核 | **P0** |
| 3 | iba-051 | 与大卫·奥格威谈广告 | interview | 已找到可信来源 | P1 |
| 4 | iba-053 | 百分之一 | interview | 已找到可信来源 | P1 |
| 5 | iba-057 | 1983年的史蒂夫·乔布斯：阿斯本国际设计大会演讲 | interview | 已找到可信来源 | P1 |
| 6 | iba-058 | 约翰·麦Afee 的疯狂访谈 | interview | 已找到可信来源 | P1 |
| 7 | iba-059 | 迈克尔·乔丹的智慧 | interview | 已找到可信来源 | P1 |
| 8 | iba-062 | 卡比尔·古普塔：征服心灵 | interview | 已找到可信来源 | P1 |
| 9 | iba-066 | 同一条河两次 | memo | 需要人工复核 | **P0** |
| 10 | iba-073 | 我们的工作方式与原因：亨特·哈里森 | memo | 未找到可靠来源 | **P0** |

---

## 各分类 staging 数量

| 分类 | 条目数 | 条目 ID |
|------|--------|---------|
| 访谈 | 6 | iba-051, iba-053, iba-057, iba-058, iba-059, iba-062 |
| 公司内部备忘录与经典文本 | 2 | iba-066, iba-073 |
| 文章与人生思考 | 1 | iba-013 |
| 纪录片 | 1 | iba-029 |

---

## P0/P1 数量

| 优先级 | 数量 | 条目 |
|--------|------|------|
| **P0** | 4 | iba-013, iba-029, iba-066, iba-073 |
| **P1** | 6 | iba-051, iba-053, iba-057, iba-058, iba-059, iba-062 |

**P0 定义**：source_url 完全未填写，或来源需人工复核确认内容匹配性。
**P1 定义**：已有可信来源（source_status = "已找到可信来源"），但嵌入版本为非官方转载，可转 verified_source。

---

## 生成文件列表

| 文件路径 | 大小 | 说明 |
|----------|------|------|
| `docs/STAGING_REVIEW_PACKET_ZH.md` | 约 14KB | 逐条人工复核说明，含完整字段、P0/P1 分类、推荐动作 |
| `data/staging_review.json` | — | 机器可读复核文件，10 条 staging，含 priority/reason/needed/recommended |
| `docs/PHASE_2B_A_STAGING_REVIEW_PACKET_REPORT.md` | — | 本报告 |

---

## 是否修改 data/items.json

**否** — 本阶段仅读取 data/items.json 生成清单，未修改任何条目。

---

## 是否修改 paths.json

**否** — 未触碰 paths.json。

---

## 校验结果

| 检查项 | 结果 |
|--------|------|
| data/items.json 合法 JSON | ✅ |
| data/paths.json 合法 JSON | ✅ |
| data/staging_review.json 合法 JSON | ✅ |
| data/staging_review.json 包含 10 条 | ✅ |
| staging_review.json 所有 id 存在于 items.json | ✅ |
| staging_review.json 不含 verified 条目 | ✅ |
| data/items.json 未被修改 | ✅ |
| data/paths.json 未被修改 | ✅ |
| 74 条 ID 唯一 | ✅ |
| 64 条 verified 均有 curator_note_zh | ✅ |
| paths.json 不引用 staging | ✅ |
| HTML 无新增外部 CDN | ✅ |
| app.js 语法正确 | ✅ |
| 项目目录无 backup/phase*_update.py 文件 | ✅ |

---

## Git 提交信息

**本次 git add 范围**：
```
projects/internet-builder-archive/docs/STAGING_REVIEW_PACKET_ZH.md
projects/internet-builder-archive/data/staging_review.json
projects/internet-builder-archive/docs/PHASE_2B_A_STAGING_REVIEW_PACKET_REPORT.md
projects/internet-builder-archive/README.md
```

**commit message**：`Add staging review packet for internet builder archive (Phase 2B-A)`

---

## GitHub Pages 地址

| 资源 | URL |
|------|-----|
| 📂 资料库首页 | https://conanxin.github.io/projects/internet-builder-archive/ |
| 🗺 导览页 | https://conanxin.github.io/projects/internet-builder-archive/guide.html |
| 📋 staging 人工复核清单 | https://conanxin.github.io/projects/internet-builder-archive/docs/STAGING_REVIEW_PACKET_ZH.md |
| 📄 staging_review.json | https://conanxin.github.io/projects/internet-builder-archive/data/staging_review.json |

---

## 下一步建议

| Phase | 内容 | 优先级 | 执行方 |
|-------|------|--------|--------|
| **Phase 2B-B** | 用户提供 P0 条目原始截图或补充信息后，逐条转为 verified / 删除 / 保持 staging | 高 | 用户 + agent |
| **Phase 2H** | 为 5 条专题路径各生成独立静态介绍页 | 中 | agent |
| **Phase 2I** | 生成 README 展示截图或页面截图，作为发布材料补充 | 中 | agent |

### Phase 2B-B 输入说明

用户只需提供：
1. P0 条目（共 4 条）的原始截图或更多上下文信息
2. P1 条目（共 6 条）如有官方 embed URL 可一并提供（如无，可直接转 verified_source）

Phase 2B-B agent 将根据用户提供的信息更新 data/items.json 的 status 字段，实施本清单中推荐的处理动作。