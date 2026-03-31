# Hermes + TrendRadar 快速上手指南

## 5 分钟快速集成

### 步骤 1: 部署 TrendRadar (2 分钟)

```bash
# 1. Fork 项目到你的 GitHub
# 访问: https://github.com/sansan0/TrendRadar
# 点击 Fork 按钮

# 2. 启用 GitHub Actions
# 在你的 Fork 中，点击 Actions → 启用 Actions

# 3. 配置密钥
# Settings → Secrets → New repository secret
# 添加: API_KEY (你的 OpenAI API Key)

# 4. 完成！
# 等待 1-2 分钟，自动运行
# 查看结果: https://yourname.github.io/TrendRadar
```

### 步骤 2: 添加 Hermes Skill (2 分钟)

```bash
# 1. 复制 Skill 文件
cp ~/research/hermes-trendradar-integration/skills/trendradar_skill.py \
   ~/hermes-agent/skills/

# 2. 添加到 Hermes 配置
echo "trendradar" >> ~/hermes-agent/config/enabled_skills.txt

# 3. 重启 Hermes
hermes restart
```

### 步骤 3: 测试使用 (1 分钟)

```bash
# 在 Hermes 中测试
hermes

# 输入查询
👤 You: 查询最近 24 小时关于 AI Agent 的热点新闻

# Hermes 将使用 TrendRadar Skill 返回结果
```

---

## 常用查询示例

### 基础查询

```
查询今天知乎热榜前 10
搜索 GitHub 上关于 MCP 的热门项目
查看过去 6 小时 AI 领域的重要新闻
```

### 高级分析

```
分析 "ChatDev" 项目的最新动态和发展趋势
监控竞品 "OpenAI" 最近的产品发布和技术突破
生成一份关于 "多智能体系统" 的趋势报告
```

### 自动监控

```
每天早 8 点推送 AI 领域的晨间简报
当 "Hermes" 被提及时立即通知我
每周一生成上周的技术趋势总结
```

---

## 配置参数速查

### TrendRadar 配置 (config.yaml)

```yaml
# 数据源
sources:
  zhihu: true        # 知乎热榜
  weibo: true        # 微博热搜
  github: true       # GitHub Trending
  rss:               # RSS 订阅
    - "https://example.com/feed.xml"

# AI 设置
ai:
  provider: openai
  api_key: "${API_KEY}"
  model: gpt-4o-mini
  filter_threshold: 0.7  # 筛选阈值 (0-1)

# 推送渠道
notifications:
  telegram:
    enabled: true
    bot_token: "${TG_BOT_TOKEN}"
    chat_id: "${TG_CHAT_ID}"
```

### Hermes Skill 配置

```python
# ~/.hermes/config.yaml
skills:
  trendradar:
    data_source: "github_pages"  # 或 "local", "api"
    github_pages_url: "https://yourname.github.io/TrendRadar"
    cache_ttl: 600              # 缓存时间 (秒)
    default_limit: 10           # 默认返回数量
```

---

## 故障排除

### 问题 1: TrendRadar 数据未更新

**检查**:
```bash
# 查看 GitHub Actions 运行状态
# https://github.com/yourname/TrendRadar/actions

# 检查是否配置了 API_KEY
# Settings → Secrets → API_KEY
```

**解决**:
```bash
# 手动触发运行
# Actions → TrendRadar Workflow → Run workflow
```

### 问题 2: Hermes 无法读取数据

**检查**:
```bash
# 检查缓存文件
ls -la ~/.hermes/trendradar/

# 查看日志
hermes logs | grep trendradar
```

**解决**:
```bash
# 清除缓存重启
rm ~/.hermes/trendradar/hot_topics_cache.json
hermes restart
```

### 问题 3: 推送未收到

**检查**:
```bash
# 验证推送配置
# 检查 webhook URL 或 bot token 是否正确

# 测试推送
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"text":"Test message"}'
```

---

## 进阶配置

### 自定义筛选规则

```yaml
# config/ai_filter/custom_rules.yaml
rules:
  - name: "AI 技术"
    keywords: ["AI", "人工智能", "LLM", "大模型"]
    min_score: 0.8
    
  - name: "竞品监控"
    keywords: ["OpenAI", "Anthropic", "Claude", "GPT"]
    min_score: 0.9
    alert_immediately: true
```

### 定时任务设置

```yaml
# config/timeline.yaml
schedule:
  - name: "morning_brief"
    cron: "0 8 * * *"  # 每天 8:00
    tasks:
      - fetch_hot_news
      - ai_analysis
      - generate_brief
      - push_to_telegram
      
  - name: "hourly_check"
    cron: "0 * * * *"  # 每小时
    tasks:
      - fetch_hot_news
      - check_urgent
```

---

## 资源链接

- **TrendRadar GitHub**: https://github.com/sansan0/TrendRadar
- **详细集成方案**: ./hermes-trendradar-integration.md
- **MCP 文档**: https://modelcontextprotocol.io/
- **Docker 镜像**: https://hub.docker.com/r/wantcat/trendradar

---

**开始你的智能信息监控之旅！** 🚀
