# Phase 2E — 主站项目入口报告

**日期：** 2026-05-31
**状态：** ✅ 完成

## 本阶段目标

在主站 projects 列表中增加"旧互联网建设者资料库"项目入口，让访问者可以从 conanxin.github.io/projects/ 发现本项目。

## 识别到的主站项目入口文件

| 文件 | 说明 |
|---|---|
| `projects/index.html` | 主站 projects 列表页，JS 动态从 `projects/data.json` 渲染项目卡片 |
| `projects/data.json` | 项目元数据 JSON，`projects/index.html` JS 渲染所用数据源 |

项目入口通过 `projects/data.json` 管理（featured=true 的项目会在 projects/index.html 渲染卡片）。修改此 JSON 文件即可，无需修改 HTML。

## 实际修改文件

| 文件 | 操作 |
|---|---|
| `projects/data.json` | 修改：新增 internet-builder-archive 条目（插入在数组最前面，research 类目顶部） |

## 新增入口文案

```json
{
  "title": "旧互联网建设者资料库",
  "subtitle": "Internet Builder Archive",
  "slug": "internet-builder-archive",
  "category": "research",
  "type": "ARCHIVE",
  "status": "已上线",
  "status_color": "#3fb950",
  "updated": "2026-05-31",
  "summary": "一组关于旧互联网、创业公司、公司备忘录、访谈、纪录片、创作者心智与媒介社会的中文化策展资料库。收录 74 条条目，64 条 verified，5 条专题路径，含中文导览页与搜索筛选。",
  "entry_url": "/projects/internet-builder-archive/",
  "source_kind": "static-site",
  "featured": true,
  "tags": ["资料库", "互联网史", "创业", "访谈", "纪录片", "公司备忘录", "策展", "中文化"],
  "guide_url": "/projects/internet-builder-archive/guide.html"
}
```

## 未修改其他项目的说明

`projects/data.json` 的修改采用插入方式，不影响现有 20 个项目条目的任何字段。`projects/index.html` 未修改。

## 里程碑 commit 核查

| commit | 是否存在 | 说明 |
|---|---|---|
| `3b4c7f1` | ❌ 不存在 | 历史报告中 Phase 2A-2a 的 commit hash 有误 |
| `6b75214` | ✅ 存在 | Phase 2A-2a 实际 commit hash 为 6b75214 |
| `02538bc` | ✅ 存在 | Phase 2D 最新 commit |

**建议：** 所有历史里程碑中的 `3b4c7f1` 应更正为 `6b75214`。后续以 `git log --oneline` 为准。

## 校验结果

| 检查项 | 结果 |
|---|---|
| items.json 合法 | ✅ 74 条 |
| paths.json 合法 | ✅ 5 条路径 |
| path refs 有效+非 staging | ✅ |
| guide.html 存在 | ✅ |
| 主站 data.json 含 iba 条目 | ✅ |
| index.html 无新 CDN | ✅ |
| guide.html 无 CDN | ✅ |
| 主站 data.json 合法 JSON | ✅ |

## Git 信息

- **commit hash：** 待 commit 后确认
- **主站 URL：** https://conanxin.github.io/
- **项目 URL：** https://conanxin.github.io/projects/internet-builder-archive/
- **导览页 URL：** https://conanxin.github.io/projects/internet-builder-archive/guide.html

## 下一步建议

1. **Phase 2B（人工）：** 复核 10 条 staging 条目
2. **Phase 2F：** 生成中文发布帖 / X 帖子串 / README 展示图
3. **Phase 2G：** 为项目生成 Open Graph / 社交分享卡片