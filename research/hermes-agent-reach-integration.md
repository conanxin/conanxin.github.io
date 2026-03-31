# Hermes Agent × Agent Reach 集成方案

**版本**: 1.0  
**日期**: 2026-03-31  
**状态**: 设计方案，待实施

---

## 1. 集成目标

### 1.1 现状分析

**Hermes 当前能力**:
- ✅ Web 搜索 (DuckDuckGo/Firecrawl)
- ✅ Web 提取 (Jina Reader/Firecrawl)
- ✅ GitHub 操作 (gh CLI)
- ✅ 代码执行、终端操作
- ❌ 社交媒体 (Twitter/X, Reddit)
- ❌ 视频平台 (YouTube, Bilibili)
- ❌ 国内平台 (小红书, 微博, 抖音)
- ❌ 诊断系统

**Agent Reach 补充**:
- ✅ Twitter/X 读取/搜索 (bird CLI)
- ✅ Reddit 读取/搜索
- ✅ YouTube 字幕提取
- ✅ Bilibili 字幕
- ✅ 小红书读取/搜索
- ✅ 微博/V2EX/雪球
- ✅ 统一诊断系统

### 1.2 集成价值

| 场景 | 当前方案 | Agent Reach 方案 | 收益 |
|------|---------|------------------|------|
| 分析竞品口碑 | 无法直接获取 | 小红书 + 微博搜索 | 新增能力 |
| 技术调研 | 仅能搜网页 | YouTube 教程字幕 | 视频内容 |
| 社媒监控 | 不支持 | Twitter/Reddit 搜索 | 新增能力 |
| 故障排查 | 手动检查 | `doctor` 自动诊断 | 效率提升 |

---

## 2. 架构设计

### 2.1 集成模式选择

**方案 A: 直接调用 Agent Reach CLI** (推荐)
```
User Request → Hermes → agent-reach <command> → Result
                ↓
         复用现有工具调用机制
```

**方案 B: Python 库调用**
```
User Request → Hermes → from agent_reach import ... → Result
                ↓
         需要修改 Hermes 代码
```

**方案 C: MCP Server 集成**
```
User Request → Hermes → MCP Client → Agent Reach MCP Server → Result
                ↓
         需要配置 MCP
```

**决策**: 采用 **方案 A (CLI)** + **方案 C (MCP 可选)**
- CLI 方案零代码改动，立即可用
- MCP 方案适合未来标准化集成

### 2.2 集成架构

```
┌─────────────────────────────────────────────────────────────┐
│                    Hermes Agent                             │
├─────────────────────────────────────────────────────────────┤
│  Skills Layer                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ web-search  │  │  web-extract│  │  agent-reach-bridge │ │ ← 新增
│  │  (existing) │  │  (existing) │  │     (new skill)     │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │           Agent Reach Integration Layer                 ││
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   ││
│  │  │  Twitter │ │ YouTube  │ │  XiaoHong│ │  Doctor  │   ││
│  │  │  Channel │ │  Channel │ │  Channel │ │  Tool    │   ││
│  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘   ││
│  └───────┼────────────┼────────────┼────────────┼──────────┘│
└──────────┼────────────┼────────────┼────────────┼───────────┘
           │            │            │            │
           ▼            ▼            ▼            ▼
     ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
     │  bird    │ │ yt-dlp   │ │ internal │ │ agent-   │
     │  CLI     │ │  CLI     │ │ parser   │ │  reach   │
     └──────────┘ └──────────┘ └──────────┘ └──────────┘
```

---

## 3. 实施计划

### Phase 1: 基础安装与诊断 (Day 1)

**目标**: 安装 Agent Reach，验证基础功能

```bash
# Step 1: 安装 Agent Reach
pip install agent-reach

# Step 2: 运行诊断
agent-reach doctor

# Step 3: 验证关键平台
agent-reach channels list
```

**预期输出**:
```
✅ Web (Jina Reader)
✅ YouTube (yt-dlp)
⚠️  Twitter (bird) — 未配置认证
⚠️  Reddit — 需要代理
```

---

### Phase 2: Skill 开发 (Day 2-3)

#### 2.1 创建 `agent-reach-bridge` Skill

**文件**: `~/.hermes/skills/agent-reach-bridge/SKILL.md`

```markdown
# Agent Reach Bridge

让 Hermes Agent 具备互联网全平台访问能力。

## 可用工具

### 社交媒体
- `ar-twitter-read <url>` — 读取推文内容
- `ar-twitter-search <query>` — 搜索推文
- `ar-reddit-search <query>` — 搜索 Reddit
- `ar-weibo-search <query>` — 搜索微博
- `ar-xhs-search <query>` — 搜索小红书

### 视频平台
- `ar-youtube-subs <url>` — 提取 YouTube 字幕
- `ar-bilibili-subs <url>` — 提取 Bilibili 字幕

### 内容平台
- `ar-web-read <url>` — 读取任意网页 (Jina Reader)
- `ar-rss <url>` — 读取 RSS 订阅
- `ar-github-repo <owner/repo>` — 查看仓库信息

### 诊断
- `ar-doctor` — 检查所有平台状态
- `ar-config <platform>` — 配置指定平台

## 使用示例

用户: "帮我看看这个 YouTube 视频讲了什么"
→ 执行: `ar-youtube-subs "https://youtube.com/watch?v=xxx"`

用户: "小红书上大家怎么评价 iPhone 16"
→ 执行: `ar-xhs-search "iPhone 16 评测"`
```

#### 2.2 创建工具脚本

**文件**: `~/.hermes/skills/agent-reach-bridge/scripts/ar-bridge.py`

```python
#!/usr/bin/env python3
"""Agent Reach Bridge — Unified interface for Hermes Agent."""

import argparse
import subprocess
import json
import sys
from typing import Optional


def run_command(cmd: list[str], timeout: int = 60) -> tuple[int, str, str]:
    """Run shell command and return (exit_code, stdout, stderr)."""
    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=timeout,
            encoding='utf-8',
            errors='replace'
        )
        return result.returncode, result.stdout, result.stderr
    except subprocess.TimeoutExpired:
        return -1, "", "Command timed out"
    except Exception as e:
        return -1, "", str(e)


class AgentReachBridge:
    """Bridge between Hermes and Agent Reach upstream tools."""
    
    # ========== 社交媒体 ==========
    
    def twitter_read(self, url: str) -> dict:
        """读取推文内容。"""
        # 使用 bird CLI
        code, out, err = run_command(['bird', 'read', url])
        if code != 0:
            return {"success": False, "error": err or "Failed to read tweet"}
        return {"success": True, "content": out}
    
    def twitter_search(self, query: str, limit: int = 20) -> dict:
        """搜索推文。"""
        code, out, err = run_command(['bird', 'search', query, '--limit', str(limit)])
        if code != 0:
            return {"success": False, "error": err or "Search failed"}
        return {"success": True, "results": out}
    
    def reddit_search(self, query: str) -> dict:
        """搜索 Reddit。"""
        # 优先使用 exa，回退到 bird
        code, out, err = run_command(['exa', 'search', '--site', 'reddit.com', query])
        if code != 0:
            return {"success": False, "error": err or "Search failed"}
        return {"success": True, "results": out}
    
    def weibo_search(self, query: str) -> dict:
        """搜索微博。"""
        # 使用内置实现或外部工具
        # TODO: 需要具体实现
        return {"success": False, "error": "Not implemented yet"}
    
    def xhs_search(self, query: str) -> dict:
        """搜索小红书。"""
        # TODO: 需要具体实现
        return {"success": False, "error": "Not implemented yet"}
    
    # ========== 视频平台 ==========
    
    def youtube_subs(self, url: str, lang: Optional[str] = None) -> dict:
        """提取 YouTube 字幕。"""
        cmd = ['yt-dlp', '--skip-download', '--write-subs', '--write-auto-subs', 
               '--sub-langs', lang or 'zh-CN,zh-TW,en', '--dump-json', url]
        code, out, err = run_command(cmd, timeout=120)
        
        if code != 0:
            return {"success": False, "error": err or "Failed to extract subtitles"}
        
        try:
            data = json.loads(out.split('\n')[0])
            return {
                "success": True,
                "title": data.get('title'),
                "description": data.get('description'),
                "subtitles": data.get('subtitles', {}),
                "automatic_captions": data.get('automatic_captions', {})
            }
        except json.JSONDecodeError:
            return {"success": False, "error": "Failed to parse video info"}
    
    def bilibili_subs(self, url: str) -> dict:
        """提取 Bilibili 字幕。"""
        # yt-dlp 也支持 Bilibili
        return self.youtube_subs(url)  # 复用逻辑
    
    # ========== 内容平台 ==========
    
    def web_read(self, url: str) -> dict:
        """读取任意网页。"""
        # 使用 Jina Reader
        code, out, err = run_command(['curl', '-s', f'https://r.jina.ai/{url}'])
        if code != 0:
            return {"success": False, "error": err}
        return {"success": True, "content": out}
    
    def rss_read(self, url: str, limit: int = 10) -> dict:
        """读取 RSS 订阅。"""
        code, out, err = run_command(['python3', '-c', 
            f'import feedparser; f = feedparser.parse("{url}"); '
            f'print(json.dumps([{{"title": e.title, "link": e.link}} '
            f'for e in f.entries[:{limit}]], ensure_ascii=False))'])
        if code != 0:
            return {"success": False, "error": err}
        try:
            return {"success": True, "entries": json.loads(out)}
        except:
            return {"success": False, "error": "Parse error"}
    
    def github_repo(self, repo: str) -> dict:
        """查看 GitHub 仓库信息。"""
        code, out, err = run_command(['gh', 'repo', 'view', repo, '--json', 
                                      'name,description,stargazersCount,primaryLanguage,pushedAt'])
        if code != 0:
            return {"success": False, "error": err}
        try:
            return {"success": True, "data": json.loads(out)}
        except:
            return {"success": False, "error": "Parse error"}
    
    # ========== 诊断 ==========
    
    def doctor(self) -> dict:
        """运行完整诊断。"""
        code, out, err = run_command(['agent-reach', 'doctor'])
        return {
            "success": code == 0,
            "report": out or err
        }
    
    def config_status(self) -> dict:
        """获取配置状态。"""
        # 检查各平台配置
        platforms = {
            "twitter": self._check_cmd(['bird', 'check']),
            "youtube": self._check_cmd(['yt-dlp', '--version']),
            "github": self._check_cmd(['gh', '--version']),
        }
        return {"success": True, "platforms": platforms}
    
    def _check_cmd(self, cmd: list[str]) -> dict:
        """检查命令是否可用。"""
        code, _, _ = run_command(cmd, timeout=10)
        return {"available": code == 0}


def main():
    parser = argparse.ArgumentParser(description='Agent Reach Bridge for Hermes')
    parser.add_argument('action', choices=[
        'twitter-read', 'twitter-search', 'reddit-search', 'weibo-search', 'xhs-search',
        'youtube-subs', 'bilibili-subs',
        'web-read', 'rss-read', 'github-repo',
        'doctor', 'config-status'
    ])
    parser.add_argument('--url', '-u', help='URL parameter')
    parser.add_argument('--query', '-q', help='Search query')
    parser.add_argument('--repo', '-r', help='Repository (owner/repo)')
    parser.add_argument('--lang', '-l', help='Language code')
    parser.add_argument('--limit', type=int, default=20, help='Result limit')
    
    args = parser.parse_args()
    
    bridge = AgentReachBridge()
    
    # Route to appropriate method
    action_map = {
        'twitter-read': lambda: bridge.twitter_read(args.url),
        'twitter-search': lambda: bridge.twitter_search(args.query, args.limit),
        'reddit-search': lambda: bridge.reddit_search(args.query),
        'weibo-search': lambda: bridge.weibo_search(args.query),
        'xhs-search': lambda: bridge.xhs_search(args.query),
        'youtube-subs': lambda: bridge.youtube_subs(args.url, args.lang),
        'bilibili-subs': lambda: bridge.bilibili_subs(args.url),
        'web-read': lambda: bridge.web_read(args.url),
        'rss-read': lambda: bridge.rss_read(args.url, args.limit),
        'github-repo': lambda: bridge.github_repo(args.repo),
        'doctor': bridge.doctor,
        'config-status': bridge.config_status,
    }
    
    if args.action in action_map:
        result = action_map[args.action]()
        print(json.dumps(result, ensure_ascii=False, indent=2))
        sys.exit(0 if result.get('success') else 1)
    else:
        print(json.dumps({"success": False, "error": "Unknown action"}))
        sys.exit(1)


if __name__ == '__main__':
    main()
```

#### 2.3 创建便捷别名脚本

**文件**: `~/.hermes/skills/agent-reach-bridge/scripts/ar`

```bash
#!/bin/bash
# Agent Reach 便捷命令

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

show_help() {
    cat << 'EOF'
Agent Reach for Hermes — 互联网全平台访问

用法: ar <command> [options]

社交媒体:
  ar twitter <url>          读取推文
  ar twitter-search <query> 搜索推文
  ar reddit <query>         搜索 Reddit
  ar weibo <query>          搜索微博
  ar xhs <query>            搜索小红书

视频:
  ar youtube <url>          提取 YouTube 字幕
  ar bilibili <url>         提取 Bilibili 字幕

内容:
  ar web <url>              读取网页内容
  ar rss <url>              读取 RSS
  ar github <owner/repo>    查看仓库信息

诊断:
  ar doctor                 运行完整诊断
  ar status                 查看配置状态
  ar help                   显示此帮助

示例:
  ar twitter https://x.com/elonmusk/status/...
  ar youtube "https://youtube.com/watch?v=xxx"
  ar xhs "iPhone 16 评测"
EOF
}

case "$1" in
    twitter)
        if [[ "$2" == *"search"* ]]; then
            python3 "$SCRIPT_DIR/ar-bridge.py" twitter-search --query "$3"
        else
            python3 "$SCRIPT_DIR/ar-bridge.py" twitter-read --url "$2"
        fi
        ;;
    twitter-search)
        python3 "$SCRIPT_DIR/ar-bridge.py" twitter-search --query "$2"
        ;;
    reddit)
        python3 "$SCRIPT_DIR/ar-bridge.py" reddit-search --query "$2"
        ;;
    weibo)
        python3 "$SCRIPT_DIR/ar-bridge.py" weibo-search --query "$2"
        ;;
    xhs)
        python3 "$SCRIPT_DIR/ar-bridge.py" xhs-search --query "$2"
        ;;
    youtube)
        python3 "$SCRIPT_DIR/ar-bridge.py" youtube-subs --url "$2"
        ;;
    bilibili)
        python3 "$SCRIPT_DIR/ar-bridge.py" bilibili-subs --url "$2"
        ;;
    web)
        python3 "$SCRIPT_DIR/ar-bridge.py" web-read --url "$2"
        ;;
    rss)
        python3 "$SCRIPT_DIR/ar-bridge.py" rss-read --url "$2"
        ;;
    github)
        python3 "$SCRIPT_DIR/ar-bridge.py" github-repo --repo "$2"
        ;;
    doctor)
        agent-reach doctor
        ;;
    status)
        python3 "$SCRIPT_DIR/ar-bridge.py" config-status
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo "未知命令: $1"
        echo "运行 'ar help' 查看用法"
        exit 1
        ;;
esac
```

---

### Phase 3: 诊断系统集成 (Day 4)

将 Agent Reach 的 `doctor` 集成到 Hermes 的系统检查中。

#### 3.1 创建诊断检查点

**文件**: `~/.hermes/skills/agent-reach-bridge/doctor_integration.py`

```python
"""Integrate Agent Reach diagnostics into Hermes health checks."""

import subprocess
import json
from typing import Dict, List, Tuple


class AgentReachDiagnostics:
    """Agent Reach diagnostics for Hermes."""
    
    CHECKS = [
        ("Web (Jina)", "web", ['curl', '-s', 'https://r.jina.ai/http://example.com']),
        ("YouTube (yt-dlp)", "youtube", ['yt-dlp', '--version']),
        ("Twitter (bird)", "twitter", ['bird', '--version']),
        ("GitHub (gh)", "github", ['gh', '--version']),
        ("RSS (feedparser)", "rss", ['python3', '-c', 'import feedparser']),
    ]
    
    def run_checks(self) -> List[Dict]:
        """Run all diagnostic checks."""
        results = []
        
        for name, key, cmd in self.CHECKS:
            try:
                result = subprocess.run(
                    cmd,
                    capture_output=True,
                    timeout=10,
                    check=False
                )
                results.append({
                    "name": name,
                    "key": key,
                    "status": "ok" if result.returncode == 0 else "error",
                    "available": result.returncode == 0
                })
            except Exception as e:
                results.append({
                    "name": name,
                    "key": key,
                    "status": "error",
                    "available": False,
                    "error": str(e)
                })
        
        return results
    
    def get_summary(self) -> Dict:
        """Get diagnostic summary."""
        results = self.run_checks()
        available = sum(1 for r in results if r["available"])
        
        return {
            "total": len(results),
            "available": available,
            "unavailable": len(results) - available,
            "platforms": results
        }
    
    def format_report(self) -> str:
        """Format diagnostic report for display."""
        summary = self.get_summary()
        
        lines = [
            "Agent Reach 诊断报告",
            "=" * 40,
            f"平台总数: {summary['total']}",
            f"可用: {summary['available']}",
            f"待配置: {summary['unavailable']}",
            "",
            "详细状态:",
            "-" * 40,
        ]
        
        for platform in summary["platforms"]:
            icon = "✅" if platform["available"] else "❌"
            lines.append(f"{icon} {platform['name']}")
        
        return "\n".join(lines)


def check_agent_reach() -> Tuple[bool, str]:
    """Check if Agent Reach is installed and working."""
    try:
        result = subprocess.run(
            ['agent-reach', '--version'],
            capture_output=True,
            timeout=5
        )
        if result.returncode == 0:
            version = result.stdout.decode().strip()
            return True, f"Agent Reach {version}"
        return False, "Agent Reach installed but not responding"
    except FileNotFoundError:
        return False, "Agent Reach not installed"
    except Exception as e:
        return False, f"Error checking Agent Reach: {e}"


if __name__ == '__main__':
    # Run diagnostics
    installed, msg = check_agent_reach()
    print(f"Agent Reach 状态: {msg}")
    
    if installed:
        diag = AgentReachDiagnostics()
        print("\n" + diag.format_report())
```

---

### Phase 4: 自动化工作流 (Day 5)

#### 4.1 创建安装脚本

**文件**: `~/hermes-agent/scripts/install-agent-reach.sh`

```bash
#!/bin/bash
# 自动安装 Agent Reach 及其依赖

set -e

echo "🔧 安装 Agent Reach for Hermes..."

# 1. 检查 Python 版本
python3 --version || { echo "❌ Python 3 未安装"; exit 1; }

# 2. 安装 Agent Reach
echo "📦 安装 agent-reach..."
pip install --upgrade agent-reach

# 3. 安装上游工具
echo "📦 安装上游工具..."

# yt-dlp (YouTube/Bilibili)
pip install --upgrade yt-dlp

# bird CLI (Twitter)
if ! command -v bird &> /dev/null; then
    echo "📦 安装 bird CLI (Twitter)..."
    npm install -g @steipete/bird || echo "⚠️ npm 不可用，跳过 bird 安装"
fi

# gh CLI (GitHub)
if ! command -v gh &> /dev/null; then
    echo "📦 安装 gh CLI (GitHub)..."
    # 根据系统安装 gh
    if command -v apt-get &> /dev/null; then
        curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
        echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
        sudo apt-get update && sudo apt-get install -y gh
    elif command -v brew &> /dev/null; then
        brew install gh
    else
        echo "⚠️ 无法自动安装 gh CLI，请手动安装"
    fi
fi

# 4. 验证安装
echo ""
echo "✅ 验证安装..."
agent-reach --version
echo ""

# 5. 运行诊断
echo "🔍 运行初始诊断..."
agent-reach doctor || true

echo ""
echo "🎉 Agent Reach 安装完成!"
echo ""
echo "使用方法:"
echo "  ar doctor       — 运行诊断"
echo "  ar status       — 查看配置状态"
echo "  ar help         — 显示帮助"
```

#### 4.2 创建更新脚本

**文件**: `~/hermes-agent/scripts/update-agent-reach.sh`

```bash
#!/bin/bash
# 更新 Agent Reach 及其依赖

set -e

echo "🔄 更新 Agent Reach..."

# 更新 agent-reach
pip install --upgrade agent-reach

# 更新上游工具
pip install --upgrade yt-dlp
npm update -g @steipete/bird 2>/dev/null || true

echo "✅ 更新完成"
agent-reach --version
```

---

## 4. 使用示例

### 场景 1: 技术调研

```
用户: "帮我调研一下 Vibe Coding 在 Twitter 上的讨论"

Hermes → ar twitter-search "vibe coding"

结果:
{
  "success": true,
  "results": [
    {"author": "@ptr"", "text": "Vibe coding is the future...", "likes": 1234},
    ...
  ]
}
```

### 场景 2: 视频学习

```
用户: "这个 YouTube 教程讲了什么 https://youtube.com/watch?v=xxx"

Hermes → ar youtube "https://youtube.com/watch?v=xxx"

结果:
{
  "success": true,
  "title": "Python Asyncio Deep Dive",
  "subtitles": {
    "en": "[full transcript...]"
  }
}
```

### 场景 3: 竞品调研

```
用户: "小红书上 iPhone 16 的口碑怎么样"

Hermes → ar xhs "iPhone 16 评测"

结果:
{
  "success": true,
  "results": [
    {"title": "iPhone 16 真实体验", "likes": 5000, ...},
    ...
  ]
}
```

### 场景 4: 故障排查

```
用户: "检查一下我的网络工具配置"

Hermes → ar doctor

结果:
✅ Web (Jina) — 可用
✅ YouTube — 可用
⚠️  Twitter — 需要配置认证
   → 运行: agent-reach configure twitter-cookies "..."
```

---

## 5. 配置指南

### 5.1 Twitter/X 配置

```bash
# 方法 1: Cookie 导出 (推荐)
# 1. 浏览器登录 Twitter
# 2. 安装 Cookie-Editor 插件
# 3. 导出 Cookie 并发送给 Agent
# 4. Agent 执行:
agent-reach configure twitter-cookies "auth_token=xxx; ct0=yyy"

# 方法 2: 环境变量
export AUTH_TOKEN="xxx"
export CT0="yyy"
```

### 5.2 GitHub 配置

```bash
# 使用 gh CLI 登录
gh auth login

# 或配置 Token
agent-reach configure github-token "ghp_xxx"
```

### 5.3 代理配置 (服务器部署)

```bash
# 配置住宅代理 (用于 Reddit/Bilibili)
agent-reach configure proxy "http://user:pass@ip:port"
```

---

## 6. 监控与维护

### 6.1 每日健康检查

```bash
# 添加到 crontab
0 9 * * * ~/.hermes/skills/agent-reach-bridge/doctor_integration.py >> /tmp/ar-health.log 2>&1
```

### 6.2 自动更新

```bash
# 每周自动更新
0 3 * * 1 ~/hermes-agent/scripts/update-agent-reach.sh >> /tmp/ar-update.log 2>&1
```

---

## 7. 风险与应对

| 风险 | 概率 | 影响 | 应对 |
|------|------|------|------|
| 平台封禁 (Twitter/XHS) | 中 | 高 | 多账号轮换、降低频率 |
| 上游工具变更 | 低 | 中 | 定期更新、版本锁定 |
| Cookie 过期 | 高 | 中 | 定期检查、自动提醒 |
| 代理失效 | 中 | 中 | 备用代理池 |

---

## 8. 下一步行动

1. **立即执行**: 运行安装脚本
   ```bash
   bash ~/hermes-agent/scripts/install-agent-reach.sh
   ```

2. **验证**: 运行诊断
   ```bash
   ar doctor
   ```

3. **配置**: 根据诊断结果配置需要认证的平台

4. **测试**: 使用示例场景验证功能

5. **文档**: 将使用方法更新到 Hermes 知识库

---

**创建日期**: 2026-03-31  
**版本**: 1.0  
**状态**: 待实施
