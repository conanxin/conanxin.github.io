# DATA_SCHEMA.md — 信抵达之前

## 数据文件结构

```
data/
├── motifs.json       # 母题定义
├── works.json        # 作品条目
└── sources.json      # 数据源与版权信息
```

---

## motifs.json

定义 8 个母题的结构化数据。

### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | 是 | 母题唯一标识，kebab-case |
| `name` | string | 是 | 母题中文名称 |
| `slug` | string | 是 | URL 友好标识 |
| `short_desc` | string | 是 | 一句话描述（≤30 字） |
| `full_desc` | string | 是 | 完整母题说明（80-150 字） |
| `visual_hint` | string | 是 | 视觉设计线索提示 |
| `icon_svg` | string | 否 | 内联 SVG 路径或图标名称 |
| `color` | string | 是 | 主题色（HEX） |
| `works_count` | number | 否 | 关联作品数量（运行时计算） |
| `stage_mapping` | array | 否 | 关联的信件旅程阶段 ID 数组 |

### 示例

```json
[
  {
    "id": "ghostwritten",
    "name": "代写之信",
    "slug": "ghostwritten",
    "short_desc": "写信人与署名者不是同一人",
    "full_desc": "代写之信的核心张力在于：信的真实性、情感归属与伦理边界成为叙事焦点。自动手记人偶、职业代笔人、甚至假冒签名——信成为一面镜子，照见写作者与委托者之间复杂的情感债务。",
    "visual_hint": "两支笔交叉、镜像文字、代笔人背影",
    "icon_svg": "pen-fork",
    "color": "#5B7C99",
    "stage_mapping": ["writing", "sealing"]
  },
  {
    "id": "belated",
    "name": "迟到之信",
    "slug": "belated",
    "short_desc": "时间差成为情感放大器",
    "full_desc": "信在邮路上延误，或寄达时人事已非。迟到之信的核心悖论：最真挚的情感往往需要时间的错位才能被完整接收。邮戳上的日期与现实的落差，构成叙事的核心张力。",
    "visual_hint": "泛黄的邮戳、时钟叠影、季节变迁",
    "icon_svg": "clock-envelope",
    "color": "#C4A35A",
    "stage_mapping": ["waiting", "arriving", "re-reading"]
  },
  {
    "id": "from-the-dead",
    "name": "亡者之信",
    "slug": "from-the-dead",
    "short_desc": "字迹犹温，写信人已经不在",
    "full_desc": "信成为生者与逝者之间的桥梁。写完信的人已经离世，但墨迹未干、信纸尚温。亡者之信探讨的是：书写如何超越死亡，以及收信人如何在阅读中完成哀悼与告别。",
    "visual_hint": "羽毛笔、飘落的花瓣、未拆封的信封",
    "icon_svg": "feather-flower",
    "color": "#8B7B8B",
    "stage_mapping": ["writing", "arriving", "archiving"]
  }
]
```

---

## works.json

定义所有作品的结构化数据。

### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | 是 | 唯一标识，kebab-case |
| `title` | object | 是 | `{ "original": "原文", "zh": "中文译名" }` |
| `year` | number | 是 | 发行/出版年份 |
| `medium` | string | 是 | 媒介类型 |
| `motifs` | array | 是 | 关联母题 ID 数组（1-3 个） |
| `pitch` | string | 是 | 一句话定位（≤30 字） |
| `letter_desc` | string | 是 | 关键场景描述（80-120 字） |
| `quote` | object | 是 | `{ "text": "原文", "zh": "中文翻译", "source": "出处场景" }` |
| `context` | string | 否 | 历史或创作背景（50-80 字） |
| `region` | string | 是 | 国家/地区代码（ISO 3166-1 alpha-2） |
| `language` | string | 是 | 原作语言 |
| `creators` | array | 否 | 创作者列表 `[{ "name": "", "role": "director|author|studio" }]` |
| `image_strategy` | string | 是 | 图像处理策略 |
| `journey_stages` | array | 否 | 关联的信件旅程阶段 ID 数组 |
| `related_works` | array | 否 | 关联作品 ID 数组（建议 2-4 个） |
| `external_links` | object | 否 | `{ "imdb": "", "douban": "", "official": "" }` |
| `content_warning` | string | 否 | 内容警示（如有） |

### medium 枚举值
- `film` — 电影
- `novel` — 小说
- `animation` — 动画
- `drama` — 戏剧
- `documentary` — 纪录片
- `project` — 真实项目/网站
- `historical` — 历史资料/档案

### image_strategy 枚举值
- `svg` — 使用抽象 SVG 插画
- `placeholder` — 使用色块 + 文字占位
- `public_domain` — 使用公共领域图像（需标注来源）
- `text_only` — 纯文字展示，无图像

### 示例（5 个作品）

```json
[
  {
    "id": "letters-to-ama",
    "title": {
      "original": "給阿嬤的情書",
      "zh": "给阿嬷的情书"
    },
    "year": 2020,
    "medium": "documentary",
    "motifs": ["immigrant", "archive"],
    "pitch": "侨批是离散华人家庭的情感基础设施",
    "letter_desc": "导演用家族收藏的侨批串联起跨越大半世纪的亲情。这些从泰国寄往潮汕的信件，每一笔汇款数字背后都是一个儿子对母亲报喜不报忧的善意谎言。",
    "quote": {
      "text": "（片中旁白）",
      "zh": "「批一封，银二元」—— 这不是普通的信，这是整个家的生命线。",
      "source": "片中关于侨批的解说"
    },
    "context": "侨批（又称银信）是 19 世纪至 20 世纪中叶海外华人寄回中国的家书与汇款合一的特殊邮政形式，2013 年入选联合国教科文组织《世界记忆名录》。",
    "region": "TW",
    "language": "zh",
    "creators": [
      { "name": "廖克发", "role": "director" }
    ],
    "image_strategy": "svg",
    "journey_stages": ["writing", "sending", "waiting", "arriving", "archiving"],
    "related_works": ["brooklyn", "safe-conduct"],
    "external_links": {
      "douban": "https://movie.douban.com/subject/34850561/"
    }
  },
  {
    "id": "violet-evergarden",
    "title": {
      "original": "ヴァイオレット・エヴァーガーデン",
      "zh": "紫罗兰永恒花园"
    },
    "year": 2018,
    "medium": "animation",
    "motifs": ["ghostwritten"],
    "pitch": "代写他人情书，却在别人的情感中学会爱",
    "letter_desc": "薇尔莉特是一名自动手记人偶，专门为不擅长表达情感的人代写书信。她在为一对无法当面言和的父女写信时，第一次理解了"我爱你"三个字的分量。",
    "quote": {
      "text": "私は、あなたを愛しています。",
      "zh": "我爱您。—— 这不是代笔的套话，是我终于学会的话。",
      "source": "薇尔莉特为父女写的信"
    },
    "context": "京都动画制作，改编自晓佳奈的轻小说。作品以战后世界为背景，通过代写信件探讨"语言能否传达心意"这一主题。",
    "region": "JP",
    "language": "ja",
    "creators": [
      { "name": "京都动画", "role": "studio" },
      { "name": "石立太一", "role": "director" }
    ],
    "image_strategy": "svg",
    "journey_stages": ["writing", "sealing", "arriving"],
    "related_works": ["cyrano", "central-station"],
    "external_links": {
      "douban": "https://movie.douban.com/subject/26934980/"
    }
  },
  {
    "id": "love-letter",
    "title": {
      "original": "Love Letter",
      "zh": "情书"
    },
    "year": 1995,
    "medium": "film",
    "motifs": ["belated", "from-the-dead"],
    "pitch": "发往天国的信，收到同名女孩的回信",
    "letter_desc": "博子在未婚夫藤井树的三周年忌日，按他旧通讯录的地址寄出一封信。没想到收信人是与他同名同姓的女同学。两个女人通过信件拼出一个从未被告白的青春。",
    "quote": {
      "text": "お元気ですか？私は元気です。",
      "zh": "你好吗？我很好。—— 这句简单的问候，是整部影片最沉重的叹息。",
      "source": "博子寄出的第一封信"
    },
    "context": "岩井俊二自编自导，中山美穗一人分饰两角。影片以北海道小樽的雪景为背景，成为日本纯爱电影的经典之作。",
    "region": "JP",
    "language": "ja",
    "creators": [
      { "name": "岩井俊二", "role": "director" }
    ],
    "image_strategy": "svg",
    "journey_stages": ["writing", "sending", "waiting", "arriving", "re-reading"],
    "related_works": ["cape-no7", "last-letter-from-lover"],
    "external_links": {
      "douban": "https://movie.douban.com/subject/1292220/"
    }
  },
  {
    "id": "cape-no7",
    "title": {
      "original": "海角七號",
      "zh": "海角七号"
    },
    "year": 2008,
    "medium": "film",
    "motifs": ["belated", "immigrant"],
    "pitch": "七封 1945 年的信，迟到了六十年才抵达",
    "letter_desc": "一位日本教师在战败遣返时写下七封信给台湾的恋人，却因地址不详被退回。六十年后，这些信被一个失意的乐团主唱偶然发现，成为连接两个时代的桥梁。",
    "quote": {
      "text": "（日文信件片段）",
      "zh": "「我会假装你忘了我，假装你到一个遥远的地方...」—— 一封永远无法寄达的信，却最终被陌生人读完。",
      "source": "日本教师的第七封信"
    },
    "context": "魏德圣执导，创下台湾电影票房纪录。影片交织日据时代与当代台湾两条叙事线，以恒春的海洋与音乐为背景。",
    "region": "TW",
    "language": "zh",
    "creators": [
      { "name": "魏德圣", "role": "director" }
    ],
    "image_strategy": "svg",
    "journey_stages": ["writing", "waiting", "arriving", "re-reading", "archiving"],
    "related_works": ["love-letter", "letters-to-juliet"],
    "external_links": {
      "douban": "https://movie.douban.com/subject/3157605/"
    }
  },
  {
    "id": "brooklyn",
    "title": {
      "original": "Brooklyn",
      "zh": "布鲁克林"
    },
    "year": 2015,
    "medium": "film",
    "motifs": ["immigrant"],
    "pitch": "家书中的经济汇报与情感表达相互缠绕",
    "letter_desc": "1950 年代，爱尔兰女孩艾莉丝独自移居纽约布鲁克林。她寄回的家书必须在报喜与报忧之间小心平衡——信纸上提到的每一件新衣服，都是用对家乡的思念换来的。",
    "quote": {
      "text": "（片中家书片段）",
      "zh": "「我在这里一切都好。」—— 所有移民家书中最大的谎言，也是最深的温柔。",
      "source": "艾莉丝寄给姐姐的家书"
    },
    "context": "改编自科尔姆·托宾同名小说。影片获奥斯卡最佳影片提名，以细腻的笔触描绘移民女性的身份认同危机。",
    "region": "IE",
    "language": "en",
    "creators": [
      { "name": "约翰·克劳利", "role": "director" },
      { "name": "科尔姆·托宾", "role": "author" }
    ],
    "image_strategy": "placeholder",
    "journey_stages": ["writing", "sending", "waiting", "arriving"],
    "related_works": ["letters-to-ama", "letters-from-rivka"],
    "external_links": {
      "imdb": "https://www.imdb.com/title/tt2381111/"
    }
  }
]
```

---

## sources.json

记录数据来源、版权状态与使用许可。

### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | 是 | 来源唯一标识 |
| `name` | string | 是 | 来源名称 |
| `type` | string | 是 | 来源类型 |
| `url` | string | 否 | 来源 URL |
| `license` | string | 否 | 许可证类型 |
| `copyright_status` | string | 是 | 版权状态 |
| `usage_notes` | string | 否 | 使用注意事项 |
| `attribution` | string | 否 | 需要标注的署名信息 |

### type 枚举值
- `film_database` — 电影资料库（豆瓣、IMDb）
- `archive` — 档案馆/图书馆
- `project` — 第三方项目
- `public_domain` — 公共领域资源
- `original` — 原创撰写

### copyright_status 枚举值
- `copyrighted` — 受版权保护（仅引用信息，不使用图像）
- `fair_use` — 合理使用范围
- `cc` — Creative Commons 许可
- `public_domain` — 公共领域
- `unknown` — 版权状态不明（避免使用）

### 示例

```json
[
  {
    "id": "douban",
    "name": "豆瓣电影",
    "type": "film_database",
    "url": "https://movie.douban.com",
    "license": null,
    "copyright_status": "copyrighted",
    "usage_notes": "仅引用基本信息和外部链接，不抓取海报或简介",
    "attribution": null
  },
  {
    "id": "letters-of-note",
    "name": "Letters of Note",
    "type": "project",
    "url": "https://lettersofnote.com",
    "license": null,
    "copyright_status": "fair_use",
    "usage_notes": "可引用信件标题和摘要，全文转载需获得授权",
    "attribution": "Shaun Usher"
  },
  {
    "id": "nara-postcards",
    "name": "美国国家档案馆侨批收藏",
    "type": "archive",
    "url": "https://catalog.archives.gov",
    "license": null,
    "copyright_status": "public_domain",
    "usage_notes": "美国联邦政府作品，属于公共领域",
    "attribution": "National Archives and Records Administration"
  }
]
```

---

## 补充：信件旅程阶段定义

用于时间线和作品关联的标准化阶段：

```json
[
  { "id": "writing", "name": "写下", "desc": "信纸上的第一笔墨迹" },
  { "id": "sealing", "name": "封口", "desc": "折叠、火漆、秘密的开始" },
  { "id": "sending", "name": "投递", "desc": "进入邮政系统的瞬间" },
  { "id": "waiting", "name": "等待", "desc": "邮路上的时间与不确定性" },
  { "id": "arriving", "name": "抵达", "desc": "信被拆开的时刻" },
  { "id": "re-reading", "name": "重读", "desc": "多年后再读，语境已变" },
  { "id": "archiving", "name": "档案化", "desc": "从私人记忆到公共历史" }
]
```
