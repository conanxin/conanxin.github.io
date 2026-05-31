# 策展型资料库通用蓝图 · 中文

本文档抽象「旧互联网建设者资料库」的通用结构，适用于任何同类策展型静态资料库项目。

---

## 1. 什么是策展型资料库

**策展型资料库**是介于"链接清单"和"数据库"之间的一种资料组织形式。

| 类型 | 内容 | 来源 | 可维护性 | 可发现性 |
|------|------|------|-----------|----------|
| 链接清单 | 链接列表 | 任意 | 低 | 低 |
| 策展型资料库 | 结构化条目 + 上下文 + 路径 | 可验证 | 高 | 高 |
| 数据库 | 原始数据 | 原始 | 中 | 中 |
| 博客文章 | 主观叙述 | 个人 | 低 | 中 |

策展型资料库的核心特征：
- 每个条目都有中文标题、英文原题、分类、来源、简介
- 有上下文说明（为什么值得看、适合谁看）
- 有专题路径，让资料可以从列表变成路线
- 有发布材料，让项目可被发现和分享
- 有状态管理（verified / staging），区分已确认和待处理

---

## 2. 通用文件结构

```
{{PROJECT_DIR}}/
├── data/
│   ├── items.json              # 全部条目（核心数据）
│   ├── paths.json              # 专题路径配置
│   └── staging_review.json     # 待复核条目清单
├── index.html                  # 主页（筛选+搜索+卡片）
├── guide.html                  # 导览页（项目说明+使用建议）
├── styles.css                  # 样式
├── app.js                     # 交互逻辑
├── README.md                   # 项目说明
├── paths/
│   ├── index.html             # 路径总览页
│   ├── {{PATH_ID_1}}.html    # 专题路径页
│   └── {{PATH_ID_2}}.html    # ...
├── assets/
│   ├── iba-share-card.svg     # 总分享卡片
│   ├── path-cards/
│   │   └── {{PATH_ID}}.svg   # 路径专属分享卡片
│   └── screenshots/
│       └── *.png              # README 用截图
├── docs/
│   ├── CONTENT_GUIDE.md       # 录入规范
│   ├── DATA_SCHEMA.md         # 数据字段说明
│   ├── workflow/              # 录入工作流
│   ├── templates/             # JSON 模板
│   ├── launch/                # 发布材料
│   ├── case-study/           # 案例复盘
│   └── blueprint/            # 本蓝图
│       └── templates/         # 通用模板
└── {{PROJECT_SPECIFIC_DOCS}}  # 项目特定文档
```

---

## 3. 核心数据结构

### items.json

每个条目包含：

```json
{
  "id": "item-001",
  "title_zh": "中文标题",
  "title_en": "English Title",
  "canonical_title_en": "Canonical English Title",
  "category": "article|video|interview|memo|podcast|documentary|other",
  "type": "article|video|audio|text|document",
  "year": 2024,
  "duration": "90min",
  "people": ["Author Name"],
  "organization": "Organization",
  "author": "Author Name",
  "source_url": "https://...",
  "embed_url": "https://www.youtube.com/embed/...",
  "source_status": "已找到可信来源|需要人工复核|待核实",
  "embed_status": "已嵌入|不可嵌入|待核实",
  "verification_status": "verified_embed|verified_source|staging",
  "source_type": "official|archive|author_site|publication|trusted_archive",
  "language": "en|zh",
  "translation_status": "已翻译|待翻译",
  "summary_zh": "一段式中文简介",
  "why_it_matters_zh": "为什么值得看",
  "background_zh": "背景信息",
  "key_points_zh": ["关键点1", "关键点2"],
  "recommended_for_zh": "适合谁看",
  "content_format_zh": "内容形式",
  "reading_or_watching_guide_zh": "观看/阅读指引",
  "related_themes_zh": "主题1｜主题2｜主题3",
  "curator_note_zh": "策展人注（体现判断）",
  "tags": ["tag1", "tag2"],
  "status": "verified_embed|verified_source|staging",
  "secondary_urls": [],
  "notes_zh": "备注"
}
```

### paths.json

```json
{
  "paths": [
    {
      "id": "path-id",
      "title_zh": "路径标题",
      "subtitle_zh": "副标题",
      "description_zh": "路径说明",
      "item_ids": ["item-001", "item-002"],
      "page_url": "paths/path-id.html",
      "share_card_url": "assets/path-cards/path-id.svg",
      "estimated_time_zh": "约 X 小时"
    }
  ]
}
```

### staging_review.json

```json
[
  {
    "id": "item-xxx",
    "title_zh": "中文标题",
    "priority": "P0|P1|P2",
    "reason": "待补充截图|来源不可靠|embed 不可用|待核实",
    "needed_from_user": "用户需要提供...",
    "recommended_action": "建议处理方式",
    "created_phase": "Phase X",
    "notes": "备注"
  }
]
```

---

## 4. 状态机

```
candidate → staging → verified_source → verified_embed
                ↓
            archived / removed
```

- **candidate**：刚录入，未核实来源
- **staging**：来源部分确认，有不确定性
- **verified_source**：来源已确认，可访问，但无法嵌入
- **verified_embed**：来源确认 + 可合法嵌入
- **archived / removed**：已降级或移除（扩展状态）

---

## 5. 适合复用的项目类型

策展型资料库适合：

| 项目类型 | 例子 |
|----------|------|
| 纪录片资料库 | 经典纪录片索引 |
| 电影研究资料库 | 电影理论/评论/导演访谈 |
| 创业研究资料库 | YC / a16z / 经典 Startup 资料 |
| 人物访谈资料库 | 技术人物、科学家、艺术家访谈 |
| 经典文章索引 | 技术写作、媒体批评 |
| 公司备忘录资料库 | 经典内部备忘录（如 Bezos、Musk） |
| 个人 Memex | 个人资料公开索引 |
| AI 研究资料库 | AI 论文/视频/课程索引 |
| 产品历史资料库 | 产品演变、 launch 记录 |

---

## 6. MVP（最低可用版本）

MVP 应包含：

1. `data/items.json`（≥5 条 placeholder）
2. `index.html`（含搜索、筛选）
3. `styles.css` / `app.js`（基础样式+交互）
4. `README.md`（项目说明）
5. `docs/CONTENT_GUIDE.md`（录入规范）
6. `docs/DATA_SCHEMA.md`（字段说明）

MVP 不需要：
- 专题路径
- 导览页
- 分享卡片
- 发布材料

---

## 7. 增强版

在 MVP 基础上增加：

1. 5 条专题路径 + 静态路径页
2. 导览页 guide.html
3. OG meta / Twitter Card
4. SVG 分享卡片
5. 发布材料（Launch post、X thread）
6. 截图展示
7. 案例复盘
8. sitemap.xml / robots.txt
9. 后续录入 workflow
10. 蓝图与方法论文档

---

## 8. 长期维护

长期维护需要：

1. **定期审计**：每季度做一次外部链接抽查
2. **降级机制**：发现失效链接立即降级为 staging
3. **新增流程**：使用标准 workflow 录入新条目
4. **路径更新**：条目状态变化后同步 paths.json
5. **统计同步**：任何数据变化后更新 README/launch materials
6. **Skill 维护**：如安装了 Skill，定期更新 prompt 模板