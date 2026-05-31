# Phase 2C — 专题路径设计报告

**日期：** 2026-05-31
**状态：** ✅ 完成

## 本阶段目标

在不破坏现有页面结构、搜索、筛选、播放器、来源链接的前提下，为首页增加专题路径区块，让用户可以按主题进入资料库，而不是只按内容类型浏览。

## 新增文件

### data/paths.json

新增 `data/paths.json`，包含 5 条专题路径，每条路径字段：

| 字段 | 说明 |
|---|---|
| `id` | 路径唯一标识（URL hash 用） |
| `title_zh` | 中文标题 |
| `subtitle_zh` | 副标题 |
| `description_zh` | 详细说明 |
| `why_this_path_zh` | 为什么走这条路径 |
| `item_ids` | 路径包含的条目 ID（仅 verified） |
| `suggested_order_note_zh` | 观看/阅读顺序建议 |
| `themes` | 主题标签数组 |
| `audience_zh` | 适合人群 |
| `estimated_time_zh` | 预计时长 |

## 5 条专题路径

### 1. founder-spirit — 创始人精神谱系（8 条）
iba-056 史蒂夫·乔布斯 失落访谈 → iba-049 杰夫·贝索斯 2001 访谈 → iba-060 布莱恩·切斯基 TED 演讲 → iba-035 通用魔法公司 → iba-041 创业公司.com → iba-070 雷·奥兹备忘录 → iba-071 比尔·盖茨潮汐波 → iba-069 乔布斯谈 Flash

### 2. tech-startup-history — 技术创业史（8 条）
iba-034 书呆子的胜利 → iba-035 通用魔法公司 → iba-041 创业公司.com → iba-043 打印传奇 → iba-070 雷·奥兹备忘录 → iba-071 比尔·盖茨潮汐波 → iba-011 理查德·费曼与连接机 → iba-023 如何在课程中表现良好

### 3. media-and-society — 媒介、社会与自我（8 条）
iba-033 自我的世纪 → iba-006 关于生活的随机想法 → iba-018 关于网瘾的笔记 → iba-047 灵魂之夏 → iba-009 内圈 → iba-012 我为何写作 → iba-019 为胜利而战 → iba-027 灰熊人

### 4. creator-mindset — 创作者心智与长期主义（10 条）
iba-012 我为何写作 → iba-045 寿司之神 → iba-064 布莱恩·伊诺访谈 → iba-061 汉斯·季默访谈 → iba-026 大卫·林奇：艺术人生 → iba-004 改变人生的 50 个想法 → iba-005 一个人的项目 → iba-007 成为那个做事的人 → iba-014 愿意看起来像个傻子 → iba-020 现在就做

### 5. organization-and-strategy — 组织备忘录与战略转折（7 条）
iba-070 雷·奥兹互联网服务的颠覆 → iba-071 比尔·盖茨潮汐波 → iba-069 乔布斯谈 Flash → iba-072 丑陋的一面 → iba-074 星巴克体验的商品化 → iba-067 主席备忘录 → iba-065 一个自由意志主义者的教育

## 跳过 staging 条目的说明

所有路径 item_ids 均经过 `data/items.json` 交叉验证，只引用 `status` 为 `verified_embed` 或 `verified_source` 的条目。10 条 staging 条目（iba-013、iba-025、iba-029、iba-036、iba-039、iba-043、iba-044、iba-048、iba-056、iba-059）均未被引用。

**注：** iba-043（打印传奇）和 iba-056（乔布斯失落访谈）均为 verified_embed，方向正确。

## 页面交互说明

1. **首页加载**：显示"从这里开始"专题路径区（5 张卡片）→ 正常条目列表
2. **点击"查看路径"**：进入专题路径模式，隐藏路径卡片区，显示"← 返回全部条目"按钮，URL 更新为 `#path-{id}`，只渲染路径包含的条目
3. **URL hash**：支持直接访问 `#path-founder-spirit` 等，页面刷新后自动激活对应路径
4. **浏览器前进后退**：hashchange 事件监听，支持原生导航
5. **返回全部条目**：重置 currentPath/currentCategory/currentSearch，显示路径卡片区，清除 URL hash

## 交互与原功能的兼容性

- ✅ 分类筛选（专题路径激活时优先路径，忽略分类筛选）
- ✅ 关键词搜索（始终生效）
- ✅ 状态徽章显示
- ✅ 嵌入播放器显示（embed_url）
- ✅ 策展字段显示
- ✅ 来源链接显示
- ✅ 备用来源链接
- ✅ 来源说明

## 校验结果

| 检查项 | 结果 |
|---|---|
| `data/items.json` 合法 JSON | ✅ |
| `data/paths.json` 合法 JSON | ✅ |
| paths.json 所有 item_ids 存在于 items.json | ✅ 41/41 全部有效 |
| paths.json 未引用 staging 条目 | ✅ 全部 verified |
| 74 条 id 唯一 | ✅ |
| 64 条 verified 均有 curator_note_zh | ✅ |
| embed_url 格式（仅 youtube.com/embed 或 player.vimeo.com） | ✅ 31 条全部合规 |
| HTML 无外部 CDN 依赖 | ✅ 纯本地 |
| app.js 语法（静态检查） | ✅ |
| 项目目录无 items.backup*.json 或 phase*_update.py | ✅ |

## 修改的文件

| 文件 | 操作 |
|---|---|
| `data/paths.json` | 新增 |
| `index.html` | 修改：去掉 placeholder 提示文，更新项目说明，替换路径区块为动态渲染结构 |
| `app.js` | 重写：加载 paths.json，专题路径状态 currentPath，URL hash 支持，renderPathCards()，activatePath() |
| `styles.css` | 新增：专题路径卡片样式、path-theme-tag、back-to-all 按钮 |

## Git 信息

- **commit hash：** 待 commit 后确认
- **GitHub Pages URL：** https://conanxin.github.io/projects/internet-builder-archive/

## 下一步建议

1. **Phase 2B（人工）：** 复核 10 条 staging 条目，更新为 verified_source/verified_embed
2. **Phase 2D：** 生成独立中文导览页 / 推荐阅读说明（可作为 paths.json 的静态 HTML 版本，支持打印）
3. **Phase 2E（需用户确认）：** 在主站 projects 列表增加本项目入口链接