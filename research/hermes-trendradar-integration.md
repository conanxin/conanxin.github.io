# Hermes + TrendRadar 集成方案设计

## 方案概述

将 TrendRadar 作为 Hermes 的**智能信息感知层**，为 Hermes Agent 提供实时热点数据、舆情监控和趋势分析能力。

```
┌─────────────────────────────────────────────────────────────────┐
│                    集成架构概览                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────────────┐         ┌──────────────────┐            │
│   │   TrendRadar     │         │     Hermes       │            │
│   │                  │         │                  │            │
│   │ • 热点聚合       │◄───────►│ • Agent 执行     │            │
│   │ • AI 筛选        │   API   │ • Skill 系统     │            │
│   │ • 舆情分析       │         │ • 工作流编排     │            │
│   │ • 多渠道推送     │         │ • 自主改进       │            │
│   └──────────────────┘         └──────────────────┘            │
│            │                            │                      │
│            │                            │                      │
│            └────────────┬───────────────┘                      │
│                         ↓                                      │
│              ┌────────────────────┐                           │
│              │   统一数据层        │                           │
│              │   - 热点数据库      │                           │
│              │   - 分析结果缓存    │                           │
│              │   - 推送队列        │                           │
│              └────────────────────┘                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 集成模式设计

### 模式 1: TrendRadar 作为 Hermes 数据源 (推荐)

**架构**:
```
TrendRadar 监控热点 ──► 数据存储 ──► Hermes Skill 查询 ──► Agent 决策
```

**适用场景**:
- Agent 需要了解当前热点上下文
- 基于趋势做出决策
- 舆情监控任务

### 模式 2: Hermes 触发 TrendRadar 分析

**架构**:
```
用户请求 ──► Hermes Agent ──► 调用 TrendRadar API ──► 深度分析 ──► 结果返回
```

**适用场景**:
- 特定主题的深度研究
- 竞品分析
- 趋势预测

### 模式 3: 双向协同 (高级)

**架构**:
```
TrendRadar 热点 ──► Hermes 分析 ──► 生成洞察 ──► TrendRadar 推送
     ▲                                               │
     └──────────────── 反馈优化 ──────────────────────┘
```

**适用场景**:
- 全自动舆情监控
- 智能简报生成
- 趋势预警系统

---

## 详细实现方案

### 方案 1: TrendRadar 作为数据源

#### 1.1 数据同步架构

```python
# trendradar_ingestor.py
"""
TrendRadar 数据摄入服务
负责将 TrendRadar 数据同步到 Hermes 可用的数据存储
"""

import asyncio
import json
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict, Optional
import httpx

class TrendRadarIngestor:
    """TrendRadar 数据摄入器"""
    
    def __init__(self, config_path: str = "config/trendradar.yaml"):
        self.config = self._load_config(config_path)
        self.data_dir = Path("~/.hermes/trendradar").expanduser()
        self.data_dir.mkdir(parents=True, exist_ok=True)
        self.cache_file = self.data_dir / "hot_topics_cache.json"
        self.last_update = None
        
    def _load_config(self, path: str) -> dict:
        """加载配置"""
        import yaml
        with open(path, 'r') as f:
            return yaml.safe_load(f)
    
    async def fetch_from_trendradar(self) -> List[Dict]:
        """
        从 TrendRadar 获取最新热点数据
        
        支持多种数据获取方式:
        1. 直接读取 TrendRadar 输出文件
        2. 调用 TrendRadar API
        3. 读取 TrendRadar GitHub Pages JSON
        """
        topics = []
        
        # 方式 1: 读取本地输出文件
        output_dir = Path(self.config.get('output_dir', 'output'))
        if output_dir.exists():
            for json_file in output_dir.glob('*.json'):
                with open(json_file, 'r') as f:
                    data = json.load(f)
                    topics.extend(self._normalize_data(data))
        
        # 方式 2: 调用 TrendRadar API (如果部署了服务)
        if self.config.get('api_endpoint'):
            async with httpx.AsyncClient() as client:
                resp = await client.get(
                    f"{self.config['api_endpoint']}/api/hot_topics",
                    timeout=30
                )
                if resp.status_code == 200:
                    topics.extend(self._normalize_data(resp.json()))
        
        # 方式 3: 从 GitHub Pages 获取 (公开数据)
        if self.config.get('github_pages_url'):
            async with httpx.AsyncClient() as client:
                resp = await client.get(
                    f"{self.config['github_pages_url']}/data/hot_topics.json",
                    timeout=30
                )
                if resp.status_code == 200:
                    topics.extend(self._normalize_data(resp.json()))
        
        return topics
    
    def _normalize_data(self, raw_data: dict) -> List[Dict]:
        """标准化数据格式"""
        normalized = []
        
        for item in raw_data.get('topics', []):
            normalized.append({
                'id': item.get('id', ''),
                'title': item.get('title', ''),
                'source': item.get('source', ''),
                'url': item.get('url', ''),
                'hot_score': item.get('score', 0),
                'ai_relevance': item.get('ai_relevance', 0),
                'category': item.get('category', 'general'),
                'keywords': item.get('keywords', []),
                'summary': item.get('summary', ''),
                'sentiment': item.get('sentiment', 'neutral'),
                'timestamp': item.get('timestamp', datetime.now().isoformat()),
                'raw_content': item.get('content', '')
            })
        
        return normalized
    
    async def update_cache(self, topics: List[Dict]):
        """更新本地缓存"""
        cache_data = {
            'last_update': datetime.now().isoformat(),
            'topics': topics,
            'stats': {
                'total': len(topics),
                'sources': list(set(t['source'] for t in topics)),
                'categories': list(set(t['category'] for t in topics))
            }
        }
        
        with open(self.cache_file, 'w', encoding='utf-8') as f:
            json.dump(cache_data, f, ensure_ascii=False, indent=2)
        
        self.last_update = datetime.now()
        print(f"✅ 缓存已更新: {len(topics)} 条热点")
    
    async def run_scheduled_sync(self):
        """定时同步任务"""
        while True:
            try:
                print("🔄 同步 TrendRadar 数据...")
                topics = await self.fetch_from_trendradar()
                await self.update_cache(topics)
                
                # 等待下次同步 (默认 10 分钟)
                await asyncio.sleep(self.config.get('sync_interval', 600))
            except Exception as e:
                print(f"❌ 同步失败: {e}")
                await asyncio.sleep(60)  # 出错后 1 分钟重试


# 启动摄入服务
if __name__ == "__main__":
    ingestor = TrendRadarIngestor()
    asyncio.run(ingestor.run_scheduled_sync())
```

#### 1.2 Hermes Skill 实现

```python
# skills/trendradar_skill.py
"""
TrendRadar Skill for Hermes
为 Hermes Agent 提供热点数据查询和分析能力
"""

import json
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict, Optional

from hermes.tools.registry import registry


class TrendRadarSkill:
    """TrendRadar 数据查询 Skill"""
    
    def __init__(self):
        self.cache_dir = Path("~/.hermes/trendradar").expanduser()
        self.cache_file = self.cache_dir / "hot_topics_cache.json"
        
    def _load_cache(self) -> Optional[Dict]:
        """加载缓存数据"""
        if not self.cache_file.exists():
            return None
        
        with open(self.cache_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    def query_hot_topics(
        self,
        category: Optional[str] = None,
        source: Optional[str] = None,
        keyword: Optional[str] = None,
        min_score: float = 0.5,
        limit: int = 10,
        time_range: str = "24h"
    ) -> List[Dict]:
        """
        查询热点话题
        
        Args:
            category: 分类筛选 (tech/finance/social/...)
            source: 来源筛选 (zhihu/weibo/github/...)
            keyword: 关键词筛选
            min_score: 最低相关度分数
            limit: 返回数量限制
            time_range: 时间范围 (1h/6h/24h/7d)
        """
        cache = self._load_cache()
        if not cache:
            return []
        
        topics = cache.get('topics', [])
        
        # 时间范围过滤
        cutoff_time = self._parse_time_range(time_range)
        topics = [
            t for t in topics 
            if datetime.fromisoformat(t['timestamp']) > cutoff_time
        ]
        
        # 分类过滤
        if category:
            topics = [t for t in topics if t['category'] == category]
        
        # 来源过滤
        if source:
            topics = [t for t in topics if t['source'] == source]
        
        # 关键词过滤
        if keyword:
            keyword_lower = keyword.lower()
            topics = [
                t for t in topics 
                if keyword_lower in t['title'].lower() 
                or keyword_lower in ' '.join(t['keywords']).lower()
            ]
        
        # 分数过滤
        topics = [t for t in topics if t['ai_relevance'] >= min_score]
        
        # 按热度排序
        topics.sort(key=lambda x: x['hot_score'], reverse=True)
        
        return topics[:limit]
    
    def get_trend_analysis(self, topic_id: str) -> Optional[Dict]:
        """获取单个话题的详细分析"""
        cache = self._load_cache()
        if not cache:
            return None
        
        for topic in cache.get('topics', []):
            if topic['id'] == topic_id:
                return {
                    'topic': topic,
                    'analysis': {
                        'sentiment': topic.get('sentiment', 'neutral'),
                        'keywords': topic.get('keywords', []),
                        'related_topics': self._find_related(topic, cache['topics'])
                    }
                }
        
        return None
    
    def get_summary_report(self, time_range: str = "24h") -> str:
        """生成热点摘要报告"""
        topics = self.query_hot_topics(time_range=time_range, limit=20)
        
        if not topics:
            return "暂无热点数据"
        
        report_lines = [
            f"## 📈 热点趋势报告 ({time_range})",
            f"",
            f"**统计时间**: {datetime.now().strftime('%Y-%m-%d %H:%M')}",
            f"**热点数量**: {len(topics)}",
            f"",
            f"### 🔥 热门话题 TOP 10",
            f""
        ]
        
        for i, topic in enumerate(topics[:10], 1):
            emoji = "🥇" if i == 1 else "🥈" if i == 2 else "🥉" if i == 3 else "•"
            report_lines.append(
                f"{emoji} **{topic['title']}**\n"
                f"   📊 热度: {topic['hot_score']:.1f} | "
                f"相关度: {topic['ai_relevance']:.1f} | "
                f"来源: {topic['source']}\n"
                f"   📝 {topic.get('summary', '暂无摘要')[:100]}..."
            )
        
        # 分类统计
        categories = {}
        for t in topics:
            cat = t['category']
            categories[cat] = categories.get(cat, 0) + 1
        
        report_lines.extend([
            f"",
            f"### 📊 分类分布",
            f""
        ])
        for cat, count in sorted(categories.items(), key=lambda x: -x[1]):
            report_lines.append(f"- {cat}: {count} 条")
        
        return '\n'.join(report_lines)
    
    def _parse_time_range(self, time_range: str) -> datetime:
        """解析时间范围"""
        now = datetime.now()
        
        if time_range == "1h":
            return now - timedelta(hours=1)
        elif time_range == "6h":
            return now - timedelta(hours=6)
        elif time_range == "24h":
            return now - timedelta(days=1)
        elif time_range == "7d":
            return now - timedelta(days=7)
        else:
            return now - timedelta(days=1)
    
    def _find_related(self, topic: Dict, all_topics: List[Dict], limit: int = 5) -> List[Dict]:
        """查找相关话题"""
        related = []
        topic_keywords = set(topic.get('keywords', []))
        
        for t in all_topics:
            if t['id'] == topic['id']:
                continue
            
            other_keywords = set(t.get('keywords', []))
            overlap = topic_keywords & other_keywords
            
            if len(overlap) >= 2:  # 至少 2 个共同关键词
                related.append({
                    'id': t['id'],
                    'title': t['title'],
                    'common_keywords': list(overlap),
                    'score': len(overlap)
                })
        
        related.sort(key=lambda x: -x['score'])
        return related[:limit]


# 注册到 Hermes
@registry.register(
    name="trendradar_query",
    toolset="trendradar",
    schema={
        "name": "trendradar_query",
        "description": "查询 TrendRadar 热点数据，获取实时舆情和趋势信息",
        "parameters": {
            "type": "object",
            "properties": {
                "query_type": {
                    "type": "string",
                    "enum": ["hot_topics", "trend_analysis", "summary_report"],
                    "description": "查询类型"
                },
                "category": {
                    "type": "string",
                    "description": "分类筛选 (tech/finance/social/...)"
                },
                "keyword": {
                    "type": "string",
                    "description": "关键词筛选"
                },
                "time_range": {
                    "type": "string",
                    "enum": ["1h", "6h", "24h", "7d"],
                    "default": "24h",
                    "description": "时间范围"
                },
                "limit": {
                    "type": "integer",
                    "default": 10,
                    "description": "返回数量限制"
                }
            },
            "required": ["query_type"]
        }
    }
)
def trendradar_tool(args: dict, **kwargs) -> str:
    """TrendRadar 工具函数"""
    skill = TrendRadarSkill()
    
    query_type = args.get('query_type')
    
    if query_type == "hot_topics":
        topics = skill.query_hot_topics(
            category=args.get('category'),
            keyword=args.get('keyword'),
            time_range=args.get('time_range', '24h'),
            limit=args.get('limit', 10)
        )
        return json.dumps(topics, ensure_ascii=False, indent=2)
    
    elif query_type == "summary_report":
        return skill.get_summary_report(
            time_range=args.get('time_range', '24h')
        )
    
    else:
        return json.dumps({"error": "Unknown query type"})
```

---

### 方案 2: Hermes 触发深度分析

#### 2.1 深度分析服务

```python
# trendradar_analyzer.py
"""
TrendRadar 深度分析服务
Hermes Agent 可以调用此服务进行特定主题的深度研究
"""

import asyncio
from typing import List, Dict, Optional
from dataclasses import dataclass

@dataclass
class AnalysisResult:
    """分析结果"""
    topic: str
    sentiment: str
    key_points: List[str]
    trend_prediction: str
    related_news: List[Dict]
    risk_assessment: str
    opportunities: List[str]


class TrendRadarAnalyzer:
    """TrendRadar 深度分析器"""
    
    def __init__(self, llm_client):
        self.llm = llm_client
        self.skill = TrendRadarSkill()
    
    async def deep_analysis(self, keyword: str, depth: str = "standard") -> AnalysisResult:
        """
        对特定主题进行深度分析
        
        Args:
            keyword: 分析主题/关键词
            depth: 分析深度 (quick/standard/deep)
        """
        # 1. 收集相关数据
        related_topics = self.skill.query_hot_topics(
            keyword=keyword,
            time_range="7d",
            limit=50
        )
        
        if not related_topics:
            return AnalysisResult(
                topic=keyword,
                sentiment="unknown",
                key_points=["未找到相关数据"],
                trend_prediction="无法预测",
                related_news=[],
                risk_assessment="无数据",
                opportunities=[]
            )
        
        # 2. LLM 深度分析
        analysis_prompt = self._build_analysis_prompt(keyword, related_topics, depth)
        
        llm_response = await self.llm.analyze(analysis_prompt)
        
        # 3. 解析结果
        return self._parse_analysis_result(keyword, related_topics, llm_response)
    
    def _build_analysis_prompt(self, keyword: str, topics: List[Dict], depth: str) -> str:
        """构建分析提示词"""
        
        topic_summaries = "\n".join([
            f"- {t['title']} (热度: {t['hot_score']:.1f}, 情感: {t['sentiment']})\n"
            f"  摘要: {t.get('summary', 'N/A')[:200]}"
            for t in topics[:20]
        ])
        
        depth_instruction = {
            "quick": "快速分析，重点关注核心要点",
            "standard": "标准分析，平衡深度和效率",
            "deep": "深度分析，详细研究所有方面"
        }.get(depth, "standard")
        
        return f"""
你是一位专业的舆情分析师。请对以下主题进行深度分析：

## 分析主题
{keyword}

## 相关数据 ({len(topics)} 条)
{topic_summaries}

## 分析要求 ({depth_instruction})
1. **情感分析**: 整体舆论倾向 (positive/negative/neutral/mixed)
2. **关键要点**: 提取 5-10 个核心要点
3. **趋势预测**: 预测未来 7-30 天的发展趋势
4. **风险评估**: 识别潜在风险和危机信号
5. **机会识别**: 发现可能的机会点

请以结构化 JSON 格式输出：
{{
    "sentiment": "positive/negative/neutral/mixed",
    "key_points": ["要点1", "要点2", ...],
    "trend_prediction": "趋势预测内容",
    "risk_assessment": "风险评估内容",
    "opportunities": ["机会1", "机会2", ...]
}}
"""
    
    def _parse_analysis_result(self, keyword: str, topics: List[Dict], llm_response: str) -> AnalysisResult:
        """解析 LLM 分析结果"""
        import json
        import re
        
        # 尝试提取 JSON
        json_match = re.search(r'```json\n(.*?)\n```', llm_response, re.DOTALL)
        if json_match:
            json_str = json_match.group(1)
        else:
            json_match = re.search(r'({.*})', llm_response, re.DOTALL)
            json_str = json_match.group(1) if json_match else "{}"
        
        try:
            data = json.loads(json_str)
        except json.JSONDecodeError:
            data = {}
        
        return AnalysisResult(
            topic=keyword,
            sentiment=data.get('sentiment', 'unknown'),
            key_points=data.get('key_points', []),
            trend_prediction=data.get('trend_prediction', ''),
            related_news=topics[:10],
            risk_assessment=data.get('risk_assessment', ''),
            opportunities=data.get('opportunities', [])
        )


# 使用示例
async def example_usage():
    """使用示例"""
    from hermes.agent import AIAgent
    
    agent = AIAgent()
    analyzer = TrendRadarAnalyzer(agent.llm_client)
    
    # 分析 AI Agent 趋势
    result = await analyzer.deep_analysis("AI Agent", depth="deep")
    
    print(f"主题: {result.topic}")
    print(f"情感: {result.sentiment}")
    print(f"关键要点: {result.key_points}")
    print(f"趋势预测: {result.trend_prediction}")
```

---

### 方案 3: 双向协同 (高级)

#### 3.1 协同工作流

```yaml
# workflows/trendradar_hermes.yaml
"""
Hermes + TrendRadar 协同工作流定义
"""

workflow:
  name: "智能舆情监控与响应"
  description: "全自动舆情监控、分析、决策、推送工作流"
  
  triggers:
    - type: scheduled
      cron: "0 */6 * * *"  # 每6小时执行
    - type: webhook
      endpoint: "/webhook/urgent"
  
  steps:
    # 步骤 1: 数据收集
    - name: collect_data
      action: trendradar.fetch
      config:
        sources: ["zhihu", "weibo", "github", "rss"]
        ai_filter: true
        min_score: 0.7
      
    # 步骤 2: Hermes Agent 分析
    - name: analyze_with_hermes
      action: hermes.agent.analyze
      input: "{{ steps.collect_data.output }}"
      prompt: |
        分析以下热点数据，识别需要关注的重要趋势:
        {{ input }}
        
        请输出:
        1. 重要趋势列表 (按优先级排序)
        2. 建议的响应措施
        3. 需要深入分析的主题
      
    # 步骤 3: 深度分析 (条件执行)
    - name: deep_analysis
      action: trendradar.deep_analyze
      condition: "{{ steps.analyze_with_hermes.output.priority == 'high' }}"
      input: "{{ steps.analyze_with_hermes.output.topics }}"
      
    # 步骤 4: 生成简报
    - name: generate_brief
      action: hermes.agent.generate_report
      input:
        hot_topics: "{{ steps.collect_data.output }}"
        analysis: "{{ steps.analyze_with_hermes.output }}"
        deep_analysis: "{{ steps.deep_analysis.output }}"
      template: "brief_report.md"
      
    # 步骤 5: 多渠道推送
    - name: push_notifications
      action: trendradar.push
      input: "{{ steps.generate_brief.output }}"
      channels:
        - wechat
        - telegram
        - email
      condition: "{{ steps.analyze_with_hermes.output.has_important_news }}"
      
    # 步骤 6: 学习优化
    - name: learn_and_optimize
      action: hermes.improvement_loop.record
      input:
        workflow: "trendradar_hermes"
        result: "{{ steps.generate_brief.output }}"
        feedback: "{{ steps.push_notifications.delivery_status }}"
```

---

## 部署方案

### 部署架构

```
┌─────────────────────────────────────────────────────────────────┐
│                    生产部署架构                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                   Docker Compose                          │ │
│  │                                                           │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │ │
│  │  │  TrendRadar  │  │    Hermes    │  │   Redis      │   │ │
│  │  │  (监控服务)   │  │   (Agent)    │  │  (缓存/队列)  │   │ │
│  │  │              │  │              │  │              │   │ │
│  │  │ Port: 8080   │  │ Port: 8081   │  │ Port: 6379   │   │ │
│  │  └──────┬───────┘  └──────┬───────┘  └──────────────┘   │ │
│  │         │                 │                             │ │
│  │         └────────┬────────┘                             │ │
│  │                  │                                      │ │
│  │         ┌────────┴────────┐                             │ │
│  │         │  Shared Volume  │                             │ │
│  │         │  /data/trends   │                             │ │
│  │         └─────────────────┘                             │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                              │                                  │
│                              ↓                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              Nginx Reverse Proxy                          │ │
│  │                   Port: 80/443                            │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Docker Compose 配置

```yaml
# docker-compose.integration.yml
version: '3.8'

services:
  trendradar:
    image: wantcat/trendradar:latest
    container_name: trendradar
    restart: unless-stopped
    volumes:
      - ./trendradar-config:/app/config
      - trendradar-data:/app/output
      - trendradar-logs:/app/logs
    environment:
      - TZ=Asia/Shanghai
      - API_KEY=${API_KEY}
    ports:
      - "8080:8080"
    networks:
      - hermes-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  trendradar-mcp:
    image: wantcat/trendradar:mcp-latest
    container_name: trendradar-mcp
    restart: unless-stopped
    volumes:
      - trendradar-data:/data:ro
    environment:
      - MCP_PORT=8082
      - DATA_PATH=/data
    ports:
      - "8082:8082"
    networks:
      - hermes-network
    depends_on:
      - trendradar

  hermes:
    image: hermes-agent:latest
    container_name: hermes
    restart: unless-stopped
    volumes:
      - ./hermes-config:/app/config
      - hermes-data:/app/data
      - trendradar-data:/app/trendradar-data:ro
    environment:
      - TRENDRADAR_API_URL=http://trendradar:8080
      - MCP_SERVER_URL=http://trendradar-mcp:8082
      - REDIS_URL=redis://redis:6379
    ports:
      - "8081:8081"
    networks:
      - hermes-network
    depends_on:
      - trendradar
      - redis

  redis:
    image: redis:7-alpine
    container_name: hermes-redis
    restart: unless-stopped
    volumes:
      - redis-data:/data
    ports:
      - "6379:6379"
    networks:
      - hermes-network

  nginx:
    image: nginx:alpine
    container_name: hermes-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    networks:
      - hermes-network
    depends_on:
      - trendradar
      - hermes

volumes:
  trendradar-data:
  trendradar-logs:
  hermes-data:
  redis-data:

networks:
  hermes-network:
    driver: bridge
```

### 启动脚本

```bash
#!/bin/bash
# deploy.sh - 一键部署 Hermes + TrendRadar 集成环境

set -e

echo "🚀 开始部署 Hermes + TrendRadar 集成环境..."

# 1. 检查环境
echo "📋 检查环境..."
command -v docker >/dev/null 2>&1 || { echo "❌ Docker 未安装"; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo "❌ Docker Compose 未安装"; exit 1; }

# 2. 创建目录
echo "📁 创建目录结构..."
mkdir -p trendradar-config
mkdir -p hermes-config
mkdir -p ssl

# 3. 下载配置文件模板
echo "⚙️  下载配置模板..."
if [ ! -f "trendradar-config/config.yaml" ]; then
    curl -sL https://raw.githubusercontent.com/sansan0/TrendRadar/master/config/config.yaml \
        -o trendradar-config/config.yaml
fi

# 4. 提示配置
echo ""
echo "⚠️  请在启动前完成以下配置："
echo ""
echo "1. 编辑 trendradar-config/config.yaml，配置："
echo "   - API_KEY (LLM API 密钥)"
echo "   - 推送渠道 (微信/Telegram/钉钉等)"
echo ""
echo "2. 编辑 hermes-config/config.yaml，配置："
echo "   - 模型设置"
echo "   - Skill 启用列表"
echo ""
read -p "配置完成后按回车继续..."

# 5. 启动服务
echo "🐳 启动 Docker 服务..."
docker-compose -f docker-compose.integration.yml up -d

# 6. 检查状态
echo "🔍 检查服务状态..."
sleep 5

docker-compose -f docker-compose.integration.yml ps

echo ""
echo "✅ 部署完成！"
echo ""
echo "📊 服务地址："
echo "  • TrendRadar: http://localhost:8080"
echo "  • Hermes: http://localhost:8081"
echo "  • MCP Server: http://localhost:8082"
echo ""
echo "📚 查看日志："
echo "  docker-compose -f docker-compose.integration.yml logs -f"
echo ""
```

---

## 使用示例

### 场景 1: 追踪技术趋势并生成报告

```python
# examples/track_tech_trends.py
"""
示例：追踪 AI Agent 技术趋势并生成分析报告
"""

import asyncio
from hermes.agent import AIAgent

async def track_ai_agent_trends():
    """追踪 AI Agent 趋势"""
    
    agent = AIAgent(
        model="anthropic/claude-opus-4.6",
        enabled_toolsets=["trendradar", "web", "file"]
    )
    
    # 1. 查询相关热点
    response = await agent.chat("""
请使用 trendradar_query 工具查询最近 7 天关于 "AI Agent" 的热点话题，
重点关注技术突破和产品发布。
""")
    
    print("📊 热点数据：")
    print(response)
    
    # 2. 深度分析
    analysis = await agent.chat("""
基于以上热点数据，请：
1. 分析当前 AI Agent 领域的主要发展趋势
2. 识别值得关注的新兴技术和产品
3. 预测未来 1-3 个月的发展方向
4. 生成一份简明的趋势报告

请以 Markdown 格式输出报告。
""")
    
    print("\n📈 分析报告：")
    print(analysis)
    
    # 3. 保存报告
    await agent.chat("""
请将这份报告保存到 reports/ai-agent-trends-2026-03.md
""")
    
    return analysis

if __name__ == "__main__":
    asyncio.run(track_ai_agent_trends())
```

### 场景 2: 竞品监控与预警

```python
# examples/competitor_monitoring.py
"""
示例：竞品监控系统
"""

import asyncio
from datetime import datetime
from hermes.agent import AIAgent

class CompetitorMonitor:
    """竞品监控器"""
    
    def __init__(self, competitors: list):
        self.agent = AIAgent(enabled_toolsets=["trendradar", "web"])
        self.competitors = competitors
        self.alerts = []
    
    async def monitor(self):
        """执行监控"""
        for competitor in self.competitors:
            print(f"🔍 监控 {competitor}...")
            
            # 查询相关热点
            response = await self.agent.chat(f"""
使用 trendradar_query 查询关于 "{competitor}" 的最新动态，
包括产品发布、融资新闻、技术突破等。
""")
            
            # 分析重要性
            analysis = await self.agent.chat(f"""
分析 {competitor} 的以下动态：
{response}

请判断：
1. 是否有重要的产品发布？
2. 是否有战略级动作？
3. 对我们的影响程度 (高/中/低)
4. 建议的应对措施
""")
            
            if "高" in analysis or "重要" in analysis:
                self.alerts.append({
                    'competitor': competitor,
                    'analysis': analysis,
                    'timestamp': datetime.now().isoformat()
                })
        
        # 生成监控报告
        if self.alerts:
            await self._send_alert_report()
    
    async def _send_alert_report(self):
        """发送预警报告"""
        report = f"""
## 🚨 竞品动态预警报告

**生成时间**: {datetime.now().strftime('%Y-%m-%d %H:%M')}

### 重要发现 ({len(self.alerts)} 条)

"""
        for alert in self.alerts:
            report += f"""
#### {alert['competitor']}
{alert['analysis']}

---
"""
        
        # 发送通知
        await self.agent.chat(f"""
请将以下报告通过 telegram 发送到监控频道：

{report}
""")

# 使用示例
async def main():
    monitor = CompetitorMonitor([
        "OpenAI",
        "Anthropic",
        "Google Gemini",
        "智谱AI",
        "月之暗面"
    ])
    
    await monitor.monitor()

if __name__ == "__main__":
    asyncio.run(main())
```

---

## 监控与维护

### 健康检查端点

```python
# health_check.py
"""
健康检查脚本
"""

import asyncio
import httpx
from datetime import datetime

async def health_check():
    """检查集成系统健康状态"""
    
    services = {
        'trendradar': 'http://localhost:8080/health',
        'hermes': 'http://localhost:8081/health',
        'mcp': 'http://localhost:8082/health',
        'redis': 'redis://localhost:6379'
    }
    
    results = {}
    
    async with httpx.AsyncClient() as client:
        for name, url in services.items():
            try:
                if url.startswith('redis'):
                    # Redis 检查
                    import redis
                    r = redis.from_url(url)
                    r.ping()
                    results[name] = {'status': 'healthy', 'latency': '<1ms'}
                else:
                    # HTTP 检查
                    start = datetime.now()
                    resp = await client.get(url, timeout=5)
                    latency = (datetime.now() - start).total_seconds() * 1000
                    
                    results[name] = {
                        'status': 'healthy' if resp.status_code == 200 else 'unhealthy',
                        'latency': f"{latency:.0f}ms"
                    }
            except Exception as e:
                results[name] = {'status': 'error', 'error': str(e)}
    
    # 输出结果
    print("🏥 健康检查报告")
    print("=" * 50)
    for name, result in results.items():
        status = result['status']
        emoji = "✅" if status == 'healthy' else "❌"
        print(f"{emoji} {name}: {status}")
        if 'latency' in result:
            print(f"   延迟: {result['latency']}")
        if 'error' in result:
            print(f"   错误: {result['error']}")
    
    return results

if __name__ == "__main__":
    asyncio.run(health_check())
```

---

## 总结

### 集成价值

| 维度 | 价值 |
|------|------|
| **数据** | Hermes 获得实时热点感知能力 |
| **决策** | 基于趋势数据做出更明智的决策 |
| **效率** | 自动化信息收集和分析流程 |
| **响应** | 快速响应市场变化和热点事件 |

### 三种集成模式选择

| 模式 | 适用场景 | 复杂度 |
|------|----------|--------|
| **数据源模式** | Agent 需要了解热点上下文 | ⭐⭐ |
| **触发分析模式** | 特定主题深度研究 | ⭐⭐⭐ |
| **双向协同模式** | 全自动舆情监控 | ⭐⭐⭐⭐ |

### 下一步建议

1. **立即**: 部署数据源模式，为 Hermes 添加热点查询能力
2. **本周**: 实现 2-3 个具体使用场景（技术趋势追踪、竞品监控）
3. **本月**: 根据使用反馈优化，考虑升级到双向协同模式

---

*设计日期: 2026-03-30*
*版本: v1.0*
