# Phase 2A-2a — 发布报告
## 第一批 verified_embed 纪录片中文策展深化

---

## 发布版本
- **Phase 2A-2a**
- 发布日期：2026-05-31

---

## 本阶段处理范围

### 目标确认
本批次计划处理约 11 条第一批 verified_embed 纪录片，目标条目：
- iba-024 / iba-025 / iba-026 / iba-027 / iba-028
- iba-031 / iba-032 / iba-033 / iba-034 / iba-035 / iba-036

### 实际深化条目（11 条）

| ID | 中文标题 | 类型 |
|----|----------|------|
| iba-024 | 当我们曾是国王 | 体育人物纪录片 |
| iba-025 | 一路向南 | 探险纪录公路电影 |
| iba-026 | 大卫·林奇：艺术人生 | 导演人物纪录片 |
| iba-027 | 灰熊人 | 自然纪录电影 |
| iba-028 | 地球之盐 | 人物纪录电影 |
| iba-031 | 狗镇男孩与滑板少年 | 体育文化纪录片 |
| iba-032 | 冲浪巨头 | 体育文化纪录片 |
| iba-033 | 自我的世纪（系列） | 系列政治纪录片（4集） |
| iba-034 | 书呆子的胜利（系列） | 系列科技史纪录片（3集） |
| iba-035 | 通用魔法公司 | 科技创业失败案例纪录片 |
| iba-036 | 文明（系列） | 系列艺术史纪录片（13集） |

### 未处理纪录片列表

**留待 Phase 2A-2b 处理（11 条）：**
iba-037 伊卡洛斯 / iba-038 可卡因牛仔 / iba-039 深水 / iba-040 最后之舞 / iba-041 创业公司.com / iba-042 战争迷雾 / iba-043 打印传奇 / iba-044 亲爱的扎卡里 / iba-045 寿司之神 / iba-046 走钢丝 / iba-047 灵魂之夏

**不处理（iba-029 已明确需人工复核，为 staging，不在 verified_embed 范围）：**
iba-029 staging → 待 Phase 2B 人工复核

**iba-030 / iba-048**：
iba-030 为 verified_source（非 verified_embed），不在本阶段范围内。
iba-048 为 verified_source（非 verified_embed），不在本阶段范围内。

---

## 新增字段列表

每个条目新增 7 个策展字段：background_zh、key_points_zh、recommended_for_zh、content_format_zh、reading_or_watching_guide_zh、related_themes_zh、curator_note_zh。

---

## 页面适配说明

Phase 2A-1 已完成 app.js curationHtml 渲染区块和 styles.css 策展样式，无需本阶段修改。

---

## 内容安全与版权说明

所有内容基于训练数据知识撰写，未直接复制英文影评或网站介绍。遵守：
- 争议人物或事件保持中性说明
- 不提供盗版观看建议
- 每条内容有差异化表达，不机械套模板

---

## Git 状态核查

```
## main...origin/main   ← 工作区 clean，main 与 origin/main 同步
```

上一阶段 Phase 2A-1 产生的 `8062d45` 已成功 push 到 origin/main。本次工作区 clean，仅有 projects/internet-builder-archive/ 目录下的本地修改待 commit。

---

## 校验结果

| 检查项 | 结果 |
|--------|------|
| items.json 合法 JSON | ✅ |
| 总计 74 条，id 唯一 | ✅ |
| 11 条目标条目全部新增 7 个策展字段 | ✅ |
| staging 条目状态未被修改 | ✅ |
| source_url / embed_url 未被覆盖或清空 | ✅ |
| embed_url 格式仅 youtube.com/embed 或 player.vimeo.com | ✅ |
| 无外部 CDN 依赖 | ✅ |
| 无临时脚本残留 | ✅ |
| 全站统计 | ✅ verified_embed:31 / verified_source:33 / staging:10 / total:74 |
| curator_note_zh 已有条目数量 | 28（Phase 2A-1 的 17 + 本次 11） |

---

## Git 操作

### Commit 信息
```
Enrich documentary archive entries batch one
```

---

## GitHub Pages 访问地址
```
https://conanxin.github.io/projects/internet-builder-archive/
```

---

## 下一步建议

- **Phase 2A-2b**：深化剩余 11 条 verified_embed 纪录片（iba-037~iba-047，iba-029 staging 除外）
- **Phase 2A-3**：深化 22 条 verified_source 文章（iba-001~iba-023）
- **Phase 2B**：人工复核 10 条 staging，需要用户提供原始截图补充后转为 verified