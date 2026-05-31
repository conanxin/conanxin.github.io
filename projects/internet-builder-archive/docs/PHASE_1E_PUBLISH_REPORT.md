# Phase 1E — 发布报告 / Publish Report

## 发布版本
- **Phase 1 MVP**
- 发布日期：2026-05-31

## 修正上一报告统计口误
上一份质量检查报告中出现"73 条 verified + 10 条 staging"的说法为**错误**。
正确统计应为：

| 状态 | 数量 | 说明 |
|------|------|------|
| verified_embed | 31 | 有可嵌入播放器（YouTube / Vimeo） |
| verified_source | 33 | 有可靠来源链接，但不可嵌入 |
| staging | 10 | 待补充来源或待人工复核 |
| **verified 总计** | **64** | 31 + 33 = 64 |
| **总计** | **74** | 64 + 10 = 74 |

## 最终全站统计
- 总计：74 条
- verified_embed：31 条
- verified_source：33 条
- staging：10 条
- verified 总计：64 条
- id 唯一性：✅ 全部唯一
- null 字段：✅ 0 个
- source_url 格式：✅ 全部合规（已填写的均为 https:// 开头）
- embed_url 格式：✅ 全部为 youtube.com/embed/ 或 player.vimeo.com/video/
- 外部 CDN 依赖：✅ 0 个（纯静态页面）

## 文件清理结果

### 删除的备份文件（6 个）
- `data/items.backup.phase1a.json`
- `data/items.backup.phase1b-before-source-lookup.json`
- `data/items.backup.phase1c-a-before-interviews-lookup.json`
- `data/items.backup.phase1c-b-before-documentaries-lookup.json`
- `data/items.backup.phase1c-c-before-written-content-lookup.json`
- `data/items.backup.phase1d-a-before-detail-enrichment.json`

### 删除的临时脚本
- phase1c_update.py（Phase 1C-A 残留，已在 Phase 1C-B 前删除）
- phase1c_b_update.py（Phase 1C-B 残留，已在 Phase 1C-C 前删除）
- phase1c_c_update.py（Phase 1C-C 末清理）
- phase1d_a_enrich.py（Phase 1D-A 废弃脚本，已在 Phase 1E 质量检查时删除）

### 新增文件
- `.gitignore`（包含 data/items.backup*.json / phase*_update.py / *.tmp / .DS_Store）

### 保留文件
- `index.html`（3639 bytes）
- `styles.css`（8122 bytes）
- `app.js`（8678 bytes）
- `data/items.json`（180521 bytes）
- `README.md`
- `docs/CONTENT_GUIDE.md`
- `docs/DATA_SCHEMA.md`
- `docs/PHASE_1A_IMAGE_CONTENT_INGEST_REPORT.md`
- `docs/PHASE_1B_MEMOS_SOURCE_LOOKUP_REPORT.md`
- `docs/PHASE_1C_A_INTERVIEWS_EMBED_LOOKUP_REPORT.md`
- `docs/PHASE_1C_B_DOCUMENTARIES_SOURCE_EMBED_LOOKUP_REPORT.md`
- `docs/PHASE_1C_C_WRITTEN_CONTENT_SOURCE_LOOKUP_REPORT.md`
- `docs/PHASE_1E_PUBLISH_REPORT.md`（本文档）

## 校验结果

| 检查项 | 结果 |
|--------|------|
| items.json 合法 JSON | ✅ |
| 总计 74 条 | ✅ |
| id 唯一性 | ✅ |
| verified_embed 31 | ✅ |
| verified_source 33 | ✅ |
| staging 10 | ✅ |
| verified 总计 64 | ✅ |
| 无 null 字段 | ✅ |
| source_url 格式合规 | ✅ |
| embed_url 格式合规（仅 yt/vimeo） | ✅ |
| index.html 无外部 CDN | ✅ |
| app.js 语法正确 | ✅ |
| 无临时脚本残留 | ✅ |
| 备份文件已删除 | ✅ |
| 核心页面文件存在 | ✅ |

## Git 操作

### Commit 信息
```
Add internet builder archive project
```

## GitHub Pages 访问地址
```
https://conanxin.github.io/projects/internet-builder-archive/
```

## 后续建议

### Phase 2A — 内容深化（recommended）
为 64 条 verified 条目补充 enrichment 字段：
- `background_zh`：历史背景与上下文
- `key_points_zh`：核心要点（3-5 条）
- `recommended_for_zh`：适合什么人群

### Phase 2B — 人工复核 staging 条目
10 条 staging 需要用户提供原始截图或补充信息后转为 verified：
- iba-013：Playing Doc Game 标题含义待确认
- iba-029：Choke 是否为纪录片需人工确认
- iba-066 / iba-073：备忘录截图待核实
- 以及其他 6 条访谈 staging

### Phase 2C — 页面增强
- 在 conanxin.github.io 首页增加项目入口导航
- 增加专题路径推荐（"创业第一课" / "VC 与投资" / "产品与互联网史" 等）
- 增加按年份筛选
- 增加"编辑推荐"徽章