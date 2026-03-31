# TrendRadar 深度研究报告

## 项目概览

**TrendRadar** 是一个 AI 驱动的舆情监控与热点趋势追踪工具，旨在解决信息过载问题，帮助用户只看真正关心的新闻资讯。

- **作者**: sansan0
- **GitHub**: https://github.com/sansan0/TrendRadar
- **Stars**: 50k+ ⭐
- **Forks**: 22.8k
- **当前版本**: v6.6.0
- **首次发布**: 2025年7月

---

## 核心定位

```
┌─────────────────────────────────────────────────────────────────┐
│                    TrendRadar 定位                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   最快 30 秒部署的热点助手                                        │
│   ────────────────────────                                       │
│                                                                 │
│   告别无效刷屏，只看真正关心的新闻资讯                              │
│                                                                 │
│   聚合多平台热点 + RSS 订阅                                       │
│   ↓                                                             │
│   AI 智能筛选新闻 + AI 翻译                                       │
│   ↓                                                             │
│   AI 分析简报 → 直推手机                                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 核心功能

### 1. 多平台热点聚合

**支持平台**:
- 知乎、微博、百度、抖音、B站
- GitHub、HackerNews、ProductHunt
- RSS 订阅源
- 自定义数据源

**数据源**: 使用 [newsnow](https://github.com/ourongxing/newsnow) API

### 2. AI 智能筛选

```
┌─────────────────────────────────────────────────────────────┐
│                    AI 筛选流程                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  原始数据                                                    │
│     ↓                                                       │
│  ┌──────────────┐                                          │
│  │ 关键词过滤   │  ← 用户配置关键词                          │
│  └──────┬───────┘                                          │
│         ↓                                                   │
│  ┌──────────────┐                                          │
│  │ AI 相关性    │  ← LLM 评估相关性                          │
│  │ 评估         │                                          │
│  └──────┬───────┘                                          │
│         ↓                                                   │
│  ┌──────────────┐                                          │
│  │ AI 智能打分  │  ← 多维度评分                              │
│  │ - 时效性     │                                          │
│  │ - 重要性     │                                          │
│  │ - 用户兴趣   │                                          │
│  └──────┬───────┘                                          │
│         ↓                                                   │
│  筛选后的高价值内容                                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3. AI 分析与简报生成

**AI 能力**:
- 内容摘要生成
- 情感分析
- 趋势预测
- 多语言翻译
- 简报直推

### 4. 多渠道推送

**支持渠道**:
| 渠道 | 类型 | 说明 |
|------|------|------|
| 企业微信 | 即时通讯 | 企业级推送 |
| 个人微信 | 即时通讯 | 个人使用 |
| 钉钉 | 即时通讯 | 办公场景 |
| 飞书 | 即时通讯 | 协同办公 |
| Telegram | 即时通讯 | 国际用户 |
| 邮件 | 异步通讯 | 详细报告 |
| ntfy | 推送服务 | 跨平台 |
| Bark | iOS推送 | iPhone用户 |
| Slack | 团队协作 | 开发者 |
| Webhook | 通用接口 | 自定义集成 |

### 5. MCP 架构支持

**MCP (Model Context Protocol)** 集成:
- 支持 AI 自然语言对话分析
- 情感洞察
- 趋势预测
- AI 对话内容直推多渠道

---

## 技术架构

### 系统架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                    TrendRadar 系统架构                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                    数据层                                  │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │ │
│  │  │ 知乎热榜 │ │ 微博热搜 │ │ GitHub   │ │ RSS订阅  │     │ │
│  │  │ 百度热搜 │ │ 抖音热榜 │ │ HN       │ │ 自定义   │     │ │
│  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘     │ │
│  │       └────────────┴────────────┴────────────┘            │ │
│  └───────────────────────────┬───────────────────────────────┘ │
│                              ↓                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                    处理层                                  │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │                 调度系统                             │ │ │
│  │  │   timeline.yaml - 统一时间线调度                      │ │ │
│  │  └────────────────────┬────────────────────────────────┘ │ │
│  │                       ↓                                    │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │              AI 处理引擎                             │ │ │
│  │  │  • 智能筛选 (ai_filter/)                           │ │ │
│  │  │  • 内容分析 (ai_analysis_prompt.txt)               │ │ │
│  │  │  • 翻译处理 (ai_translation_prompt.txt)            │ │ │
│  │  │  • 兴趣匹配 (ai_interests.txt)                     │ │ │
│  │  └────────────────────┬────────────────────────────────┘ │ │
│  └────────────────────────┼───────────────────────────────────┘ │
│                           ↓                                     │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                    输出层                                  │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │                  推送系统                            │ │ │
│  │  │  微信/钉钉/飞书/Telegram/邮件/Slack/...             │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                              │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │                  MCP 服务                            │ │ │
│  │  │  自然语言对话 / 情感分析 / 趋势预测                 │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                              │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │                  报告生成                            │ │ │
│  │  │  HTML 报告 / Markdown / JSON                        │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 技术栈

| 类别 | 技术 |
|------|------|
| **语言** | Python 3.12+ |
| **包管理** | uv (现代Python包管理器) |
| **部署** | Docker, GitHub Actions, GitHub Pages |
| **协议** | MCP (Model Context Protocol) |
| **前端** | HTML + CSS (报告展示) |

### 项目结构

```
TrendRadar/
├── .github/                # GitHub Actions 工作流
├── _image/                 # 图片资源
├── config/                 # 配置文件
│   ├── ai_filter/         # AI 筛选配置
│   ├── custom/            # 自定义配置
│   ├── ai_analysis_prompt.txt
│   ├── ai_interests.txt
│   ├── ai_translation_prompt.txt
│   ├── config.yaml        # 主配置
│   ├── frequency_words.txt
│   └── timeline.yaml      # 时间线调度
├── docker/                 # Docker 配置
├── docs/                   # 文档
├── mcp_server/            # MCP 服务
├── output/                 # 输出目录
├── trendradar/            # 核心代码
│   └── core.py
├── index.html             # GitHub Pages 展示
├── pyproject.toml         # Python 项目配置
├── requirements.txt       # 依赖
└── setup-*.sh/bat        # 安装脚本
```

---

## 部署方式

### 1. GitHub Actions 部署（推荐，30秒）

```yaml
# 一键 fork 即可运行
# 自动定时任务
# 数据保存在 GitHub Pages
```

**优势**:
- 零成本
- 自动运行
- 无需服务器

### 2. Docker 部署

```bash
# 本地/服务器部署
docker-compose up -d

# 数据自持
# 完全控制
```

### 3. 本地部署

```bash
# 安装依赖
uv sync

# 运行
python trendradar/core.py
```

---

## 配置详解

### 核心配置文件

**config/config.yaml**:
```yaml
# 数据源配置
sources:
  zhihu: true
  weibo: true
  github: true
  rss:
    - "https://example.com/feed.xml"

# AI 配置
ai:
  provider: openai
  api_key: "${API_KEY}"
  model: gpt-4o-mini
  
  # 智能筛选
  filter:
    enabled: true
    threshold: 0.7
    
  # 分析配置
  analysis:
    enabled: true
    prompt_file: "config/ai_analysis_prompt.txt"
    
  # 翻译配置
  translation:
    enabled: true
    target_languages: ["zh", "en"]

# 推送配置
notifications:
  wechat:
    enabled: true
    webhook_url: "${WECHAT_WEBHOOK}"
  telegram:
    enabled: true
    bot_token: "${TG_BOT_TOKEN}"
    chat_id: "${TG_CHAT_ID}"

# 调度配置
timeline: "config/timeline.yaml"
```

**timeline.yaml**（统一时间线调度）:
```yaml
# 定义任务调度
schedule:
  - name: "morning_brief"
    cron: "0 8 * * *"  # 每天8点
    tasks:
      - fetch_hot_news
      - ai_filter
      - ai_analysis
      - push_notification
      
  - name: "hourly_update"
    cron: "0 * * * *"  # 每小时
    tasks:
      - fetch_hot_news
      - ai_filter
```

---

## MCP 架构集成

### MCP (Model Context Protocol) 支持

```
┌─────────────────────────────────────────────────────────────┐
│                    MCP 集成架构                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌──────────────┐                                          │
│   │   AI 客户端   │  ← Cherry Studio, Claude Desktop, etc   │
│   │  (MCP Client)│                                          │
│   └──────┬───────┘                                          │
│          │ MCP 协议                                          │
│          ↓                                                   │
│   ┌──────────────┐                                          │
│   │  TrendRadar  │                                          │
│   │  MCP Server  │  ← mcp_server/                           │
│   └──────┬───────┘                                          │
│          │                                                   │
│          ↓                                                   │
│   ┌──────────────────────────────────────┐                 │
│   │           功能接口                    │                 │
│   │  • 自然语言查询热点                   │                 │
│   │  • 情感分析                          │                 │
│   │  • 趋势预测                          │                 │
│   │  • 对话式探索                        │                 │
│   └──────────────────────────────────────┘                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### MCP 功能示例

```python
# AI 对话示例
用户: "最近 AI 领域有什么重要新闻？"

TrendRadar MCP:
└── 查询热点数据库
└── AI 分析重要性
└── 生成简报
└── 返回结构化结果

响应:
"根据最近 24 小时的数据，AI 领域有以下重要动态：
1. OpenAI 发布 GPT-5 预览版 - 重要性: 9/10
2. Google Gemini 2.0 更新 - 重要性: 8/10
3. ..."
```

---

## 创新亮点

### 1. 统一时间线调度系统 (v6.0+)

**问题**: 多任务调度复杂，容易冲突

**解决方案**: timeline.yaml 统一调度
```yaml
# 所有任务在一个时间线中管理
schedule:
  - name: "data_collection"
    cron: "*/10 * * * *"  # 每10分钟
  
  - name: "ai_analysis" 
    cron: "0 */6 * * *"    # 每6小时
    depends_on: data_collection
```

### 2. AI 智能筛选系统 (v6.5+)

**多维度评分**:
- 关键词匹配度
- AI 相关性评估
- 用户兴趣匹配
- 时效性权重
- 来源可信度

### 3. 容器化与 uv 迁移 (v6.0+)

**现代化 Python 实践**:
- 使用 `uv` 替代 pip (更快更可靠)
- Docker 多阶段构建
- 健康检查端点
- 数据卷持久化

### 4. HTML 报告浏览器增强 (v6.6.0)

**最新功能**:
- 暗色模式
- 浮动工具栏
- 一键复制
- 宽屏模式
- Tab 导航

---

## 与 Hermes 的关联

### 1. 功能互补

| Hermes | TrendRadar | 协同场景 |
|--------|-----------|----------|
| AI Agent 执行 | 热点监控 | Hermes 执行，TrendRadar 提供上下文 |
| Skill 系统 | 数据源 | TrendRadar 数据作为 Skill 输入 |
| Improvement Loop | AI 筛选 | 共同优化信息处理流程 |
| Supervisor | 推送系统 | 监控结果通过 TrendRadar 推送 |

### 2. 集成可能性

#### 场景 1: TrendRadar 作为 Hermes 的信息源

```python
# Hermes Skill 调用 TrendRadar
class TrendRadarSkill:
    def get_hot_topics(self, category="ai"):
        """获取 TrendRadar 热点数据"""
        data = trendradar_api.query(
            category=category,
            time_range="24h",
            min_score=0.8
        )
        return self.format_for_hermes(data)
```

#### 场景 2: Hermes 分析 TrendRadar 数据

```python
# Hermes 分析热点趋势
class TrendAnalysisSkill:
    def analyze_trend(self, keyword):
        """深度分析某个趋势"""
        # 1. 从 TrendRadar 获取相关新闻
        news = trendradar.search(keyword)
        
        # 2. Hermes 进行深度分析
        analysis = self.llm.analyze(
            context=news,
            task="分析趋势走向和影响"
        )
        
        # 3. 生成报告并推送
        return analysis
```

#### 场景 3: 统一推送系统

```
Hermes 执行结果 ──┐
                 ├──→ TrendRadar 推送系统 ──→ 多渠道推送
TrendRadar 热点 ──┘
```

### 3. 架构借鉴

#### 借鉴 1: 统一调度系统

```python
# TrendRadar 的 timeline.yaml → Hermes 的 workflow
# 可以用类似的 YAML 定义 Skill 执行流程
```

#### 借鉴 2: AI 筛选打分机制

```python
# TrendRadar 的多维度评分 → Hermes 的 Skill 选择
# 可以用类似机制选择最优 Skill
```

#### 借鉴 3: 多渠道推送抽象

```python
# TrendRadar 的通知抽象层 → Hermes 的消息推送
# 统一不同平台的推送接口
```

---

## 用户评价与反馈

### 社区反馈

> "30秒部署，小白也能用" —— 用户反馈

> "解决了信息过载问题，只看关心的内容" —— 用户评价

> "开源万岁，项目很棒" —— 社区支持

### 应用场景

1. **个人用户**: 追踪感兴趣领域的热点
2. **产品经理**: 监控竞品动态和行业趋势
3. **投资人**: 追踪市场热点和项目动态
4. **研究人员**: 追踪学术前沿和技术趋势
5. **运营人员**: 监控品牌舆情和热点话题

---

## 项目数据

### GitHub 统计

- **Stars**: 50k+
- **Forks**: 22.8k
- **Commits**: 224+
- **Releases**: 58 tags
- **Contributors**: 持续增长

### 社区活跃度

- **Issues**: 26 (活跃维护)
- **Pull Requests**: 9
- **关注者**: 快速增长

### 赞助商与支持

- **早期支持者**: 73+ 位
- **资金支持**: 通过赞赏码持续获得支持

---

## 资源链接

- **GitHub**: https://github.com/sansan0/TrendRadar
- **GitHub Pages**: https://sansan0.github.io/TrendRadar
- **Docker Hub**: https://hub.docker.com/r/wantcat/trendradar
- **Trendshift**: https://trendshift.io/repositories/14726
- **MCP 文档**: https://modelcontextprotocol.io/

---

## 总结

### TrendRadar 的核心价值

1. **解决信息过载**: AI 智能筛选，只看重要内容
2. **低门槛部署**: 30秒 GitHub Actions 部署
3. **多平台聚合**: 一站式监控多平台热点
4. **AI 增强**: 智能分析、翻译、简报生成
5. **多渠道推送**: 支持几乎所有主流通知渠道
6. **MCP 集成**: 与 AI 工作流深度集成

### 对 Hermes 的启示

1. **用户友好**: 简单易用，30秒部署
2. **配置驱动**: YAML 配置，无需编码
3. **统一抽象**: 多渠道推送的统一接口
4. **AI 优先**: 全流程 AI 增强
5. **社区驱动**: 开源精神，持续迭代

---

*研究日期: 2026-03-30*
*TrendRadar 版本: v6.6.0*
