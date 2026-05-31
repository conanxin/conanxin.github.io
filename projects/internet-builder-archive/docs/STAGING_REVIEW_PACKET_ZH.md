# 旧互联网建设者资料库 · staging 条目人工复核清单

> 本文档为 Phase 2B-A 阶段生成的人工复核指南，整理当前 10 条 `status = "staging"` 条目，说明每条的复核原因、所需补充信息和推荐处理动作。
>
> **本清单不修改 data/items.json，不改变任何条目的 status。**
> 所有复核结论将在 Phase 2B-B 阶段根据用户补充信息逐一实施。

---

## 复核优先级说明

| 优先级 | 含义 |
|--------|------|
| **P0** | 内容存在误配风险，或无任何可用来源，必须用户提供原始截图确认，否则不得转为 verified |
| **P1** | 已有可信来源，但嵌入版本为非官方转载，可保留为 verified_source；如用户确认有官方版本可升级为 verified_embed |
| **P2** | 无（本期 10 条均属 P0 或 P1） |

---

## P0 条目（4 条）— 必须用户提供原始截图或明确说明后才能处理

---

### [iba-013] 玩医生的游戏

- **中文标题**：玩医生的游戏
- **英文原题**：Playing Doc Game
- **分类**：文章与人生思考
- **类型**：article
- **source_url**：未填写
- **source_status**：需要人工复核
- **embed_status**：未找到可嵌入版本
- **verification_status**：标题含义不明，未找到匹配的可信来源。主来源未填写，保持 staging。建议用户提供原始截图后重新检索。
- **notes_zh 摘要**：⚠️ 截图标题为'Playing Doc Game'，含义不明，无法在公开资料中找到匹配度高且可信的来源。不要伪造链接，等待用户提供完整截图后再核实。
- **source_notes_zh**：无法确认来源，等待用户提供原始截图。

**为什么还不能转 verified**：截图标题含义不明，无法确认对应哪篇文章或视频；source_url 完全未填写；无任何可用来源。

**用户需要补充什么**：用户提供原始截图（包括完整标题、作者、来源网站或平台信息），或明确说明这是哪篇文章/视频。

**复核方式**：用户提供截图 → 根据截图内容重新检索来源 → 更新 source_url → 决定 status。

**推荐复核动作**：改名并重新查源，或删除。

---

### [iba-029] 扼住咽喉（剧情片，非纪录片）

- **中文标题**：扼住咽喉（剧情片，非纪录片）
- **英文原题**：Choke (2008) - Feature Film (NOT Documentary)
- **分类**：纪录片
- **类型**：documentary
- **source_url**：https://www.imdb.com/title/tt0760528/
- **source_status**：需要人工复核
- **embed_status**：未找到可嵌入版本
- **verification_status**：IMDB 收录的 Choke 实为 2008年 Chuck Palahniuk 同名小说改编的剧情片（伊娃·格林/山姆·洛克威尔主演），非纪录片。截图需核实——如果用户截图确实是纪录片版 Choke，则需要用户提供具体来源；如果用户截图是同名剧情片，则需要重新分类或删除。
- **notes_zh 摘要**：⚠️ 需要人工复核原始截图！IMDB 收录结果为剧情片，未找到可靠的纪录片来源。不要将此条目当作纪录片使用。
- **source_notes_zh**：IMDB 页面记录的是 Chuck Palahniuk 小说改编剧情片，非纪录片。需要人工复核原始截图，确认用户提供的 Choke 具体是什么内容。

**为什么还不能转 verified**：IMDB 确认为剧情片而非纪录片，与资料库定位不符；但截图内容尚未确认，用户截图可能是同名纪录片也可能是剧情片。

**用户需要补充什么**：用户提供原始截图，确认截图内容是纪录片还是剧情片。如为纪录片，提供纪录片版 Choke 的真实 IMDB 链接或 YouTube 链接；如为剧情片，确认是否应删除或移出纪录片分类。

**复核方式**：用户提供截图 → 如为纪录片，搜索纪录片版 Choke 并更新来源；如为剧情片，删除或重新分类。

**推荐复核动作**：确认后转为 verified_source（纪录片），或删除（剧情片），或合并到其他条目。

---

### [iba-066] 同一条河两次

- **中文标题**：同一条河两次
- **英文原题**：The Same River Twice - David Quammen
- **分类**：公司内部备忘录与经典文本
- **类型**：memo
- **year**：1999
- **source_url**：https://books.google.com/books/about/The_Same_River_Twice.html
- **source_status**：需要人工复核
- **embed_status**：不适用
- **verification_status**：需要人工复核：无法确认此条是指 David Quammen 的同名书籍还是一篇短文/备忘录。如为书籍，则需更新 source_url 为出版信息；如为短文，则需进一步核实原始来源。
- **notes_zh 摘要**：⚠️ 截图标题为"The Same River Twice - David Quammen"，作者 David Quammen 为著名科学作家，但无法确认截图具体对应哪篇文章或视频。需用户提供原始截图确认内容。
- **source_notes_zh**：Google Books 页面显示 David Quammen 有同名书籍，但「The Same River Twice」作为内部备忘录的出处和具体内容仍需人工核实。

**为什么还不能转 verified**：David Quammen 是著名科学作家，确实有书籍《The Same River Twice》（1999），但截图可能是书籍章节、杂志文章或其他内容；无足够证据确定这是「备忘录」还是「书籍节选」，两者在策展定位上有本质区别。

**用户需要补充什么**：用户提供原始截图，确认截图内容是书籍节选、杂志文章、演讲实录还是内部备忘录；如能确认是备忘录，提供原始来源网站。

**复核方式**：用户提供截图 → 如为备忘录片段，搜索原始来源；如为书籍章节，更新 source_url 为出版信息；决定是否保留或重新分类。

**推荐复核动作**：确认后转为 verified_source（备忘录/文章），或保持 staging（无法确认时）。

---

### [iba-073] 我们的工作方式与原因：亨特·哈里森

- **中文标题**：我们的工作方式与原因：亨特·哈里森
- **英文原题**：How we work and why - Hunter Harrison
- **分类**：公司内部备忘录与经典文本
- **类型**：memo
- **year**：未填写
- **source_url**：未填写
- **source_status**：未找到可靠来源
- **embed_status**：不适用
- **verification_status**：未找到可靠来源：未能确认存在标题为「How We Work and Why」的 Hunter Harrison 备忘录或文献。该条目待人工复核真实来源。
- **notes_zh 摘要**：⚠️ 截图标题为"How we work and why - Hunter Harrison"，Hunter Harrison 是铁路行业知名高管，但未找到可信的对应来源。需用户提供原始截图或更多上下文。
- **source_notes_zh**：未能找到可靠的原始来源。Hunter Harrison 是著名的铁路运营变革管理者，曾在 Canadian National Railway 和 CSX 推行「精确调度铁路运营」（Precision Scheduled Railroading）。网络检索未能确认存在名为「How We Work and Why」的公开备忘录或演讲记录。

**为什么还不能转 verified**：source_url 完全未填写；Hunter Harrison 以铁路运营管理闻名（精确调度铁路运营 PSR），检索未找到以「How We Work and Why」为题的备忘录或演讲；可能为同名误配或截图内容描述不准确。

**用户需要补充什么**：用户提供原始截图，确认截图内容是备忘录、演讲、采访还是其他形式；提供原始来源链接或更多上下文（如时间、场合、发布平台）。

**复核方式**：用户提供截图 → 如有来源则更新 source_url 并转为 verified_source；如无来源则确认是否删除。

**推荐复核动作**：有来源 → verified_source；无来源 → 删除。

---

## P1 条目（6 条）— 已有可信来源，但嵌入版本为非官方转载

> 以下 6 条均已找到可信来源（source_status = "已找到可信来源"），但 embed_status 为"不可嵌入"（未找到官方/合法嵌入版本）。这类条目可转为 verified_source；如用户能补充官方 embed URL，则可升级为 verified_embed。

---

### [iba-051] 与大卫·奥格威谈广告

- **中文标题**：与大卫·奥格威谈广告
- **英文原题**：A conversation about advertising, with David Ogilvy
- **分类**：访谈
- **类型**：interview
- **year**：1982
- **duration**：55 min
- **source_url**：https://www.youtube.com/watch?v=KjyQIJROVqk
- **source_status**：已找到可信来源
- **embed_status**：不可嵌入
- **verification_status**：YouTube 频道 Mad for the Ad 发布的 David Ogilvy 访谈，非官方但内容真实，未找到官方发布版本
- **notes_zh 摘要**：非官方频道 Mad for the Ad 发布，无官方 embed 可用。仅找到非官方转载，embed_url 留空。介意者可访问 source_url 查看。

**复核状态**：可转为 verified_source。用户如有 1982 年 David Ogilvy 官方发布来源，可升级 embed。

**推荐复核动作**：转 verified_source。

---

### [iba-053] 百分之一

- **中文标题**：百分之一
- **英文原题**：The One Percent
- **分类**：访谈
- **类型**：interview
- **year**：2019
- **duration**：1 hr 15 min
- **source_url**：https://www.youtube.com/watch?v=7Pq-S557XQU
- **source_status**：已找到可信来源
- **embed_status**：不可嵌入
- **verification_status**：Sam Altman Y Combinator 演讲 The One Percent 片段被非官方频道转载，未找到 Altman 官方频道发布的完整版
- **notes_zh 摘要**：非官方频道转载（Goal achiever），非完整官方片源，介意者可直接搜索 Sam Altman + Y Combinator 查看原演讲。

**复核状态**：可转为 verified_source。用户如有 Sam Altman 官方频道发布版本，可升级 embed。

**推荐复核动作**：转 verified_source。

---

### [iba-057] 1983年的史蒂夫·乔布斯：阿斯本国际设计大会演讲

- **中文标题**：1983年的史蒂夫·乔布斯：阿斯本国际设计大会演讲
- **英文原题**：A 28-year-old Steve Jobs gives a talk at the 1983 International Design Conference in Aspen
- **分类**：访谈
- **类型**：interview
- **year**：1983
- **duration**：55 min
- **source_url**：https://www.youtube.com/watch?v=oivan-V7IWE
- **source_status**：已找到可信来源
- **embed_status**：不可嵌入
- **verification_status**：1983 阿斯本国际设计大会完整演讲录像被多个用户上传；未找到 ID26 设计大会官方存档发布的版本
- **notes_zh 摘要**：非官方频道发布（用户 Sridhar Seshadri），未找到 ID26 官方存档版本。

**复核状态**：可转为 verified_source。1983 年 Computer History Museum 已有 Jobs 失落访谈官方发布（iba-040），但阿斯本设计大会版本属不同内容，可作为补充资料保留。

**推荐复核动作**：转 verified_source。

---

### [iba-058] 约翰·麦Afee 的疯狂访谈

- **中文标题**：约翰·麦Afee 的疯狂访谈
- **英文原题**：John McAfee Wild Interview
- **分类**：访谈
- **类型**：interview
- **year**：2019
- **duration**：21 min
- **source_url**：https://www.youtube.com/watch?v=4R1EREuD7EQ
- **source_status**：已找到可信来源
- **embed_status**：不可嵌入
- **verification_status**：BIG LS 频道发布的 John McAfee 访谈，McAfee 本人有较多网络直播但质量参差
- **notes_zh 摘要**：非官方频道 BIG LS 发布（粉丝性质），McAfee 本人有很多网络直播但质量参差。

**复核状态**：可转为 verified_source。McAfee 本人后来做过很多网络直播，内容真实性可确认但非正式官方发布。

**推荐复核动作**：转 verified_source。

---

### [iba-059] 迈克尔·乔丹的智慧

- **中文标题**：迈克尔·乔丹的智慧
- **英文原题**：Michael Jordan's Wisdom
- **分类**：访谈
- **类型**：interview
- **year**：2009
- **duration**：21 min
- **source_url**：https://www.youtube.com/watch?v=7n5L0IR0HmE
- **source_status**：已找到可信来源
- **embed_status**：不可嵌入
- **verification_status**：多个 YouTube 频道发布了迈克尔·乔丹的「智慧」类精选片段，内容来自 ESPN 纪录片和 Nike 广告；未找到乔丹本人或 ESPN 官方频道发布的确切版本
- **notes_zh 摘要**：非官方频道发布的片段精选，来源为 ESPN 纪录片和 Nike 广告，片段出处多元。未找到 ESPN 官方频道的确切 embed。

**复核状态**：可转为 verified_source（来源为 ESPN/Nike 内容）。

**推荐复核动作**：转 verified_source。

---

### [iba-062] 卡比尔·古普塔：征服心灵

- **中文标题**：卡比尔·古普塔：征服心灵
- **英文原题**：Kapil Gupta: Conquering the Mind
- **分类**：访谈
- **类型**：interview
- **year**：2020
- **duration**：40 min
- **source_url**：https://www.youtube.com/watch?v=nCA-8qjKTCo
- **source_status**：已找到可信来源
- **embed_status**：不可嵌入
- **verification_status**：Vital Life 频道发布的卡比尔·古普塔访谈，谈论他的人生哲学和征服心灵的方法，未找到 Kapil Gupta 官方频道
- **notes_zh 摘要**：非官方频道 Vital Life 发布，Kapil Gupta 本人有较多播客内容但未找到统一官方发布频道。

**复核状态**：可转为 verified_source。Kapil Gupta 为耐克/谷歌前高管教练，内容有一定价值，但发布渠道为粉丝搬运。

**推荐复核动作**：转 verified_source。

---

## 复核完成后的下一阶段

**Phase 2B-B**（需要用户提供截图或补充信息）：

1. 用户提供 P0 条目的原始截图或来源说明
2. 根据截图内容决定每条的处理方式：
   - 有可信来源 → 转 verified_source
   - 有官方 embed → 转 verified_embed
   - 无法确认 → 保持 staging 或删除
   - 同名误配 → 删除或重新分类
3. 更新 data/items.json 的 status 字段
4. 如有新增 verified 条目涉及 paths.json 中已有的路径，确认路径完整性

---

## 按分类统计

| 分类 | 条目数 | P0 | P1 |
|------|--------|----|----|
| 访谈 | 6 | 0 | 6 |
| 公司内部备忘录与经典文本 | 2 | 2 | 0 |
| 文章与人生思考 | 1 | 1 | 0 |
| 纪录片 | 1 | 1 | 0 |
| **合计** | **10** | **4** | **6** |