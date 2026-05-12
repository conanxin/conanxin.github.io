# Data Maintenance Guide

杜甫流离路线页面的内容数据维护手册。
内容更新优先编辑 `data/*.json`，不要继续在 `app.js` 中堆内容数据。

---

## 数据文件说明

| 文件 | 负责内容 |
|------|----------|
| `data/locations.json` | 地点卡片与地图节点数据（21条） |
| `data/routes.json` | 7天线、12天线、主题短线、双城读诗线与路线元信息 |
| `data/poems.json` | 诗歌到地点的映射（12首） |
| `data/timeline.json` | 历史时间线节点（9个节点） |

---

## 修改地点数据（locations.json）

### 必填字段

新增或修改地点时，以下字段必须存在：

```json
{
  "id": "unique-slug",
  "name": "历史地名",
  "modern": "今日对应地点",
  "theme": "地点主题（如：现实主义转折点）",
  "event": "杜甫在该地点发生的事件描述",
  "poems": "相关诗歌（逗号分隔）",
  "quote": "关键诗句（可为空字符串）",
  "articleMeaning": "该地点在文章中的意义",
  "travelTip": "今日旅行提示",
  "routeGroup": "所属路线组（如：fengxian, qiangcun, sanli）",
  "siteType": "地点类型"
}
```

### id 命名规则

- 全部小写
- 使用连字符 `-` 分隔（如 `qiangcun`、`shihao`、`jianmenguan`）
- **一旦稳定，不要随意修改**——因为 `poems.json` 和 `routes.json` 中的 `locationId` 字段依赖这些 id
- id 本身仅用于内部引用，用户界面显示的是 `name` 字段

### siteType 可选值

| 值 | 含义 |
|----|------|
| `成熟景区` | 5A/4A 景区，设施完善 |
| `历史对应点` | 遗址或考古确认地点 |
| `文学寻访点` | 文学记载但无完善景区的地点 |
| `文学寻访点+历史对应点` | 两者兼有 |
| `文学寻访点+考证提示点` | 需一定考证或向导 |

---

## 修改诗歌数据（poems.json）

### 必填字段

```json
{
  "title": "《诗歌标题》",
  "locationId": "对应地点的 id（必须在 locations.json 中存在）",
  "locationName": "地点显示名",
  "period": "创作时间（如：755、759、756/757）",
  "theme": "诗歌主题",
  "quote": "代表诗句（可为空字符串）",
  "note": "简短注释"
}
```

### 关键约束

- `locationId` **必须**能在 `locations.json` 中找到对应的 id
- 同一地点可以有多首诗（如 `lingwu` 沦陷长安对应《春望》《月夜》《哀江头》）
- 每次修改后运行 `validate_dufu_data.py` 检查引用完整性

---

## 修改路线数据（routes.json）

### 顶层结构

```json
{
  "meta": { ... },       // 路线元信息（名称/天数/季节/交通/难度/人群/说明）
  "routes": {
    "7day": [ ... ],      // 7天精华线，每日一个对象
    "12day": [ ... ],    // 12天完整线，每日一个对象
    "thematic": [ ... ]  // 主题短线数组
  },
  "dualCity": {          // 西安+成都双城读诗线
    "xi'an": { ... },
    "chengdu": { ... }
  }
}
```

### 每日行程字段（7day / 12day）

```json
{
  "day": 1,
  "title": "天水秦州",
  "theme": "流寓秦州，诗歌爆发",
  "places": "天水城区、南郭寺、杜少陵祠",
  "stay": "1天",
  "transportTip": "交通建议",
  "poems": "相关诗歌",
  "tip": "旅行提示",
  "liveQuestion": "现场思考题",
  "locs": ["locationId1", "locationId2"]
}
```

### 主题短线字段（thematic）

```json
{
  "id": "changan",
  "title": "长安奉先线",
  "days": "2-3天",
  "tags": ["历史溯源"],
  "desc": "路线描述",
  "route": ["西安", "临潼", "蒲城"],
  "poems": "相关诗歌",
  "tip": "旅行提示",
  "locs": ["changan", "lianling", "fengxian"]
}
```

---

## 修改时间线数据（timeline.json）

### 字段

```json
{
  "year": "755",
  "title": "长安 → 奉先",
  "historicalPlace": "长安、骊山、奉先（蒲城）",
  "modernPlace": "西安、临潼、蒲城",
  "event": "事件详细描述",
  "poems": "相关诗歌",
  "whyImportant": "为什么重要"
}
```

### 注意事项

- `year` 建议使用字符串（部分节点为 "756/757" 跨年）
- `poems` 字段内容为逗号分隔的诗歌名
- 时间线节点顺序即为页面显示顺序

---

## 校验流程

每次修改 `data/*.json` 后，**必须**按顺序运行以下命令：

```bash
cd ~/projects/dufu-luanli-route-page

# 1. 运行验证脚本
python3 scripts/validate_dufu_data.py

# 2. 验证 locations.json 语法
python3 -m json.tool data/locations.json > /tmp/dufu_locations_check.json

# 3. 验证 routes.json 语法
python3 -m json.tool data/routes.json > /tmp/dufu_routes_check.json

# 4. 验证 poems.json 语法
python3 -m json.tool data/poems.json > /tmp/dufu_poems_check.json

# 5. 验证 timeline.json 语法
python3 -m json.tool data/timeline.json > /tmp/dufu_timeline_check.json

# 6. 本地预览
python3 -m http.server 8080
# 浏览器打开 http://localhost:8080
```

---

## 同步到 GitHub Pages

源项目和 Pages 发布目录需要**始终保持同步**。同步以下文件：

```bash
# 源项目 → Pages 发布目录
SOURCE=~/projects/dufu-luanli-route-page
PAGES=~/conanxin.github.io/projects/dufu-luanli-route

cp "$SOURCE/data/locations.json" "$PAGES/data/"
cp "$SOURCE/data/routes.json"    "$PAGES/data/"
cp "$SOURCE/data/poems.json"    "$PAGES/data/"
cp "$SOURCE/data/timeline.json" "$PAGES/data/"
cp "$SOURCE/scripts/validate_dufu_data.py" "$PAGES/scripts/"
cp "$SOURCE/docs/DATA_MAINTENANCE.md"      "$PAGES/docs/"
cp "$SOURCE/README.md"                    "$PAGES/README.md"
echo "Sync OK"
```

**注意**：`app.js`、`index.html`、`style.css` 通常不需要手动同步——它们通过 GitHub Pages 仓库的 git 推送自动更新。

---

## 不要做什么

- **不要**直接在 `app.js` 中继续堆内容数据（Phase 4B 后内容已迁移至 `data/*.json`）
- **不要**随意修改 location `id`——poems 和 routes 中的 `locationId` 依赖这些 id
- **不要**把实时交通、票价、开放时间写死进 JSON（这些属于 `transportTip`，只提供建议而非实时数据）
- **不要**把未经核实的地名考证写成确定结论（在 `articleMeaning` 中用"可能""或为"等措辞）
- **不要**删除 `FALLBACK_DATA`（除非有新的离线策略）
- **不要**修改 `projects/data.json`（根站数据文件）

---

## 推荐维护流程

1. **修改** `data/*.json`（按本手册规则）
2. **运行** `python3 scripts/validate_dufu_data.py`
3. **本地预览** `python3 -m http.server 8080`
4. **同步** Pages 发布目录（cp 命令）
5. **git diff** 检查改动范围
6. **commit + push**
7. **curl 线上检查** 确认发布成功

---

## 相关文件

- `scripts/validate_dufu_data.py` — 数据验证脚本
- `data/locations.json` — 地点数据
- `data/routes.json` — 路线数据
- `data/poems.json` — 诗歌数据
- `data/timeline.json` — 时间线数据
