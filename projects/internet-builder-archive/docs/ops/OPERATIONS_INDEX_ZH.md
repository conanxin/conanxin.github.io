# 运维索引 · 中文

> 本文档是 internet-builder-archive 项目的运维索引，提供常用命令、文件索引、故障处理和 agent 操作注意事项。
> 维护者请收藏本文档。

---

## 1. 常用文件索引

### 核心数据

| 文件 | 用途 | 备注 |
|------|------|------|
| `data/items.json` | 74 条条目主数据 | **不要手动编辑**；通过 Phase 流程更新 |
| `data/paths.json` | 5 条专题路径 | item_ids 只引用 verified 条目 |
| `data/staging_review.json` | 7 条 staging 复核清单 | 包含 priority/reason/needed_from_user |

### 文档

| 文件 | 用途 |
|------|------|
| `docs/workflow/NEW_ITEM_INGESTION_WORKFLOW_ZH.md` | 新增资料完整录入流程 |
| `docs/workflow/SOURCE_VERIFICATION_CHECKLIST_ZH.md` | 来源优先级与核实标准 |
| `docs/workflow/EMBED_POLICY_ZH.md` | 合法嵌入政策 |
| `docs/workflow/PATHWAY_UPDATE_WORKFLOW_ZH.md` | 路径加入/移除流程 |
| `docs/workflow/RELEASE_CHECKLIST_ZH.md` | 发布前完整检查清单 |
| `docs/blueprint/CURATED_ARCHIVE_BLUEPRINT_ZH.md` | 通用策展资料库蓝图 |
| `docs/blueprint/ARCHIVE_DATA_MODEL_ZH.md` | 数据模型与状态机说明 |
| `docs/blueprint/PHASE_PLAN_TEMPLATE_ZH.md` | 完整阶段计划模板 |
| `docs/blueprint/AGENT_RUNBOOK_ZH.md` | Agent 安全边界与协作规范 |
| `docs/blueprint/QUALITY_AUDIT_TEMPLATE_ZH.md` | 审计模板 |
| `docs/blueprint/SKILL_DRAFT_CURATED_ARCHIVE_BUILDER_ZH.md` | Skill 设计草案 |
| `docs/case-study/INTERNET_BUILDER_ARCHIVE_CASE_STUDY_ZH.md` | 完整项目复盘长文 |
| `docs/case-study/CASE_STUDY_SUMMARY_ZH.md` | 800–1200 字摘要 |
| `docs/case-study/CASE_STUDY_X_THREAD_ZH.md` | 11 条 X 帖子串 |
| `docs/ops/PROJECT_HANDOFF_CURRENT_STATE_ZH.md` | 项目当前状态交接清单 |
| `docs/CONTENT_GUIDE.md` | 内容录入规范（Phase 1） |
| `docs/DATA_SCHEMA.md` | 数据 schema 说明 |

### 页面

| 文件 | 用途 |
|------|------|
| `index.html` | 资料库首页（搜索 + 分类筛选 + 卡片） |
| `guide.html` | 中文导览页（项目说明 + 专题路径 + 使用指南） |
| `paths/index.html` | 专题路径索引页 |
| `paths/founder-spirit.html` | 路径 ① |
| `paths/tech-startup-history.html` | 路径 ② |
| `paths/media-and-society.html` | 路径 ③ |
| `paths/creator-mindset.html` | 路径 ④ |
| `paths/organization-and-strategy.html` | 路径 ⑤ |

### 资源

| 文件 | 用途 |
|------|------|
| `assets/screenshots/` | 6 张页面截图（用于 README 展示） |
| `assets/path-cards/*.svg` | 5 张 SVG 分享卡片（1200×630） |
| `assets/iba-share-card.svg` | 项目总分享卡片 |
| `launch/LAUNCH_POST_ZH.md` | 中文发布帖 |
| `launch/X_THREAD_ZH.md` | X 帖子串（原始版） |
| `launch/PATH_SHORT_POSTS_ZH.md` | 5 条路径短发布帖 |

---

## 2. 常用检查命令

### 基本状态检查

```bash
cd /home/ubuntu/conanxin.github.io
git status -sb                         # 查看当前 git 状态
git log --oneline -10                  # 最近 10 条 commits
git log --oneline --all | head -20      # 查看所有分支 commits
```

### JSON 合法性与数据校验

```bash
# 校验 items.json 合法
python3 -c "import json; json.load(open('projects/internet-builder-archive/data/items.json')); print('OK')"

# 校验 paths.json 合法
python3 -c "import json; json.load(open('projects/internet-builder-archive/data/paths.json')); print('OK')"

# 校验 staging_review.json 合法
python3 -c "import json; json.load(open('projects/internet-builder-archive/data/staging_review.json')); print('OK')"

# 统计条目数量
python3 << 'EOF'
import json
items = json.load(open('projects/internet-builder-archive/data/items.json'))
paths_data = json.load(open('projects/internet-builder-archive/data/paths.json'))
sr = json.load(open('projects/internet-builder-archive/data/staging_review.json'))
print(f"total={len(items)} verified={len([i for i in items if i.get('status') in ['verified_embed','verified_source']])} ve={len([i for i in items if i.get('status')=='verified_embed'])} vs={len([i for i in items if i.get('status')=='verified_source'])} staging={len([i for i in items if i.get('status')=='staging'])} paths={len(paths_data['paths'])} sr={len(sr)}")
EOF
```

### JavaScript 语法检查

```bash
cd /home/ubuntu/conanxin.github.io/projects/internet-builder-archive
node --check app.js
```

### 无临时文件检查

```bash
cd /home/ubuntu/conanxin.github.io/projects/internet-builder-archive
# 检查没有 items.backup*.json
find . -name 'items.backup*.json' | grep -v '.git'
# 检查没有 phase*_update.py
find . -name 'phase*_update.py' | grep -v '.git'
```

### 路径数据一致性检查

```bash
# 检查 paths.json 不引用 staging
python3 << 'EOF'
import json
items = json.load(open('projects/internet-builder-archive/data/items.json'))
paths_data = json.load(open('projects/internet-builder-archive/data/paths.json'))
staging_ids = {i['id'] for i in items if i.get('status')=='staging'}
for p in paths_data['paths']:
    for pid in p['item_ids']:
        if pid in staging_ids:
            print(f"ERROR: {p['id']} references staging {pid}")
print("OK: no staging references in paths" if all(pid not in staging_ids for p in paths_data['paths'] for pid in p['item_ids']) else "FAIL")
EOF
```

### 外部链接抽查（抽样）

```bash
# 抽查 source_url（随机 5 条 verified 条目）
python3 << 'EOF'
import json, urllib.request, ssl
items = json.load(open('projects/internet-builder-archive/data/items.json'))
verified = [i for i in items if i.get('status') in ['verified_embed','verified_source']]
import random; samples = random.sample(verified, min(5, len(verified)))
ctx = ssl.create_default_context()
for item in samples:
    if item.get('source_url'):
        try:
            req = urllib.request.Request(item['source_url'], method='HEAD')
            req.add_header('User-Agent', 'Mozilla/5.0')
            r = urllib.request.urlopen(req, timeout=10, context=ctx)
            print(f"OK {item['id']}: {r.status}")
        except Exception as e:
            print(f"FAIL {item['id']}: {e}")
EOF
```

---

## 3. 常用维护任务

### 新增条目

1. 使用 `docs/workflow/NEW_ITEM_INGESTION_WORKFLOW_ZH.md` 中的流程
2. 参考 `docs/templates/new_item.template.json` 创建条目
3. 参考 `docs/templates/agent_prompt_new_item_ingestion_zh.md` 提交给 agent
4. 执行完成后运行 `docs/workflow/RELEASE_CHECKLIST_ZH.md` 检查清单

### 修复失效 source_url

1. 确认 items.json 中该条目 status 为 verified_source 或 verified_embed
2. 按 `docs/workflow/SOURCE_VERIFICATION_CHECKLIST_ZH.md` 查找替代来源
3. 更新 items.json 中该条目的 `source_url` 和 `source_status`
4. 如果原来源完全失效且无可靠替代，按 `docs/workflow/SOURCE_VERIFICATION_CHECKLIST_ZH.md` 降级为 staging
5. 同步更新 `data/staging_review.json`（如降级）

### 更新路径页

当 paths.json 中 item_ids 变化时（新增或移除）：

1. 更新 `data/paths.json` 中的 `item_ids`
2. 重新生成对应路径的 `paths/*.html` 静态页
3. 如果 item count 变化，更新 `paths/index.html` 中的计数
4. 如果涉及 `creator-mindset`，同步更新 `assets/path-cards/creator-mindset.svg` badge 数字
5. 运行 `docs/workflow/RELEASE_CHECKLIST_ZH.md`

### 更新分享卡片

当路径 item count 变化时，更新对应 SVG badge 数字：
- 在 `assets/path-cards/*.svg` 中找到 `<text ...>10</text>` 所在行
- 将数字替换为当前 item_ids 长度

### 更新 sitemap

每次新增页面后确认 `sitemap.xml` 包含新路径页面 URL。

### 生成截图

```bash
# 使用 Chromium headless 截取页面
cd /home/ubuntu/conanxin.github.io
python3 -c "
from subprocess import run
pages = [
    ('index.html','assets/screenshots/home-desktop.png'),
    ('guide.html','assets/screenshots/guide-desktop.png'),
]
for page, out in pages:
    run(['/snap/bin/chromium','--headless','--screenshot='+out,'--window-size=1440,1100','file://'+page])
print('Done')
"
```

---

## 4. 故障处理

### source_url 失效

**表现**：HTTP 404 或无法访问

**处理步骤**：
1. 确认 items.json 中该条目 status（verified_source/verified_embed/staging）
2. 如果是 verified 条目且 source_url 失效，按 SOURCE_VERIFICATION_CHECKLIST 查找替代
3. 找不到替代 → 降级为 staging，更新 `data/staging_review.json`
4. 不要保留 404 链接

### embed_url 不合法

**表现**：iframe 或 audio 标签无法播放

**处理步骤**：
1. 确认 embed_url 来自官方来源（YouTube 官方频道、Vimeo 官方等）
2. 确认使用了正确的 embed 格式（YouTube: `https://www.youtube-nocookie.com/embed/...`）
3. 非官方 embed → 移除 embed_url，保留 source_url，embed_status 标为"不可嵌入"
4. 运行 `docs/workflow/RELEASE_CHECKLIST_ZH.md`

### paths 引用 staging

**表现**：校验脚本发现 paths.json 中有 staging 条目 ID

**处理步骤**：
1. 立即从 paths.json 对应路径的 `item_ids` 中移除该 ID
2. 重新生成该路径的静态 HTML
3. 同步更新 `paths/index.html` 和路径 SVG 分享卡片（如 item count 变化）
4. 检查 staging_review.json 是否需要更新

### 派生页面统计不一致

**表现**：paths/index.html 或 README 显示的 item count 与 paths.json 实际不符

**处理步骤**：
1. 用 `python3 -c "..."` 重新计算 paths.json 中各路径的实际 item 数量
2. 更新 `paths/index.html` 中的数字
3. 更新对应的路径 SVG 分享卡片
4. 运行 `docs/workflow/RELEASE_CHECKLIST_ZH.md`

### GitHub Pages 缓存延迟

**表现**：push 成功后页面未更新

**处理步骤**：
1. 等待 1–2 分钟（GitHub Pages 默认缓存时间）
2. 清除浏览器缓存或使用隐私模式
3. 确认 `Settings → Pages` 中 Source 指向 `main` 分支
4. 确认 `sitemap.xml` 和 `robots.txt` 已推送到 `main` 分支

---

## 5. Agent 操作注意事项

### 当前项目维护环境

本项目在 **cloud_hermes** 环境维护。所有 Phase 命令和 agent 操作必须通过 cloud_hermes 执行。

### 不要混用的环境

| 环境 | 说明 |
|------|------|
| 本地 Hermes | 不应在本项目中执行操作 |
| 本地 OpenClaw | 不应在本项目中执行操作 |
| 云端 OpenClaw | 不应在本项目中执行操作 |
| cloud_hermes | **正确**：本项目的维护环境 |

### 跨 agent 安装 Skill 的前提

1. 用户先指定目标 agent 名称和配置
2. 核查该 agent 的 skill 目录路径（`~/.hermes/skills/`）
3. 将 `docs/blueprint/SKILL_DRAFT_CURATED_ARCHIVE_BUILDER_ZH.md` 转换为正式 SKILL.md
4. 在目标 agent 中执行安装验证
5. **严禁**跨 agent 混用 skill 配置

### Phase 命令格式

每次新增 Phase 建议通过以下格式提交：

```
internet-builder-archive Phase X — [阶段名称]
```

Phase 报告结构：
- STATUS
- HOST_SCOPE
- PROJECT_DIR
- FILES_CREATED
- FILES_MODIFIED
- VALIDATION_RESULT
- GIT_STATUS_CHECK
- GIT_COMMIT
- GIT_PUSH_RESULT
- NEXT_STEP_RECOMMENDATION

---

*本文档由 cloud_hermes agent 在 Phase 2Q 生成。*