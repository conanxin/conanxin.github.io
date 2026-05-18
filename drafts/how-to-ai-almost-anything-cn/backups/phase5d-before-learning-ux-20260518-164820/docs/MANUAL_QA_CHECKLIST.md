# 人工 QA 检查清单
# How2AI 中文课程页 — Phase 4 发布前审查

**项目目录**: `~/conanxin.github.io/drafts/how-to-ai-almost-anything-cn/`
**执行环境**: cloud_hermes
**生成时间**: 2026-05-18

---

## A. 首页检查（Hero）

- [ ] Hero 标题 `How to AI (Almost) Anything` 是否清楚可见
- [ ] 副标题"把 AI 接入真实世界的多模态、多感官与交互系统"是否能在 10 秒内理解课程定位
- [ ] 三个按钮是否存在并可点击：
  - [ ] 🚀 开始学习 → 跳转 #sessions
  - [ ] 📚 查看官方阅读清单 → 跳转 #readings + 切换到 official 标签
  - [ ] 📖 七角色论文读法 → 跳转 #seven-roles
- [ ] Hero 统计数据是否正确（27 个学习节点 / 5 大模块 / 32 精选导读 / 85+ 官方文献）
- [ ] Hero 进度区是否存在（`heroProgressSessions` / `heroProgressReadings`）
- [ ] 进度条是否存在（初始状态应为 0%，空白状态）
- [ ] Module 进度条（5 色段）是否显示
- [ ] 页面顶部是否有 `noindex` meta 标签（draft 状态必须保留）
- [ ] 底部版权声明是否包含："本页面为基于 MIT MAS.S60 公开课程资料整理的中文学习导览，不代表 MIT 官方中文版本"
- [ ] 底部是否有"关于链接状态"说明段落

---

## B. 课程结构检查

### 模块导航
- [ ] 6 个 Module Tab 是否存在：全部 / Module 0 · 导论 / Module 1 · AI 基础 / Module 2 · 多模态 AI / Module 3 · 大模型 / Module 4 · 交互式 AI
- [ ] Tab 切换是否生效（点击后只显示对应模块的 session）
- [ ] "全部" Tab 是否默认选中

### 时间线
- [ ] 时间线是否渲染出所有 session（至少 21 个时间线项）
- [ ] 点击时间线项是否跳转并展开对应的 session 卡片
- [ ] 课程类型（lecture / discussion / project）是否用不同颜色/图标区分
- [ ] "放假" session 是否灰色显示

### Session 卡片
- [ ] 是否显示 Week X · 日期
- [ ] 是否同时显示中文标题和原始英文标题
- [ ] Lecture 类型是否有 🏗️ 图标（绿色左边框）
- [ ] Discussion 类型是否有 💬 图标（黄色左边框）
- [ ] Project 类型是否有 🚀 图标（橙色左边框）
- [ ] 点击卡片 header 是否展开内容（显示 ▼ 图标变为旋转）
- [ ] 展开后是否显示：中文摘要 / 关键概念标签 / 学习目标 / 思考题 / 项目关联 / Slides 链接 / 视频链接
- [ ] Slides 链接是否指向 MIT slides URL（非空）
- [ ] 视频链接是否指向 YouTube URL（非空）
- [ ] "标记为已完成" checkbox 是否可勾选
- [ ] 勾选后是否出现 ✅ 标记
- [ ] 刷新页面后 checkbox 状态是否保留（localStorage）
- [ ] "学习笔记"按钮是否存在
- [ ] "打开思考题"按钮是否存在（仅 lecture/discussion 有）

---

## C. 学习交互检查

### 模块 Tab 切换
- [ ] 点击 Module 0 Tab：只显示导论 session（约 2 个）
- [ ] 点击 Module 1 Tab：只显示 AI 基础 session（约 4 个）
- [ ] 点击 Module 2 Tab：只显示多模态 AI session（约 7 个）
- [ ] 点击 Module 3 Tab：只显示大模型 session（约 6 个）
- [ ] 点击 Module 4 Tab：只显示交互式 AI session（约 4 个）
- [ ] 时间线是否同步过滤（点击 Tab 后时间线也只显示对应 session）

### Session 展开/折叠
- [ ] 第一张卡片点击能否展开
- [ ] 展开第二张卡片时第一张是否自动折叠
- [ ] 展开时是否有 slideDown 动画

### localStorage 持久化
- [ ] 勾选 2–3 个 session 的 checkbox
- [ ] 刷新页面（Cmd+R / Ctrl+R）
- [ ] checkbox 状态是否保留
- [ ] 进度条百分比是否更新
- [ ] Hero 进度数字是否更新（例：2/23）

### 笔记 Modal
- [ ] 点击"学习笔记"按钮是否打开 modal
- [ ] Modal 是否显示本节的中文摘要（顶部引用区）
- [ ] 文本域是否可输入
- [ ] 输入文字后点击"💾 保存笔记"是否有 toast 提示
- [ ] 刷新页面后笔记内容是否保留
- [ ] "导出为 Markdown"按钮是否生成下载内容
- [ ] "清空"按钮是否清空文本
- [ ] 点击 × 按钮或背景是否关闭 modal
- [ ] ESC 键是否关闭 modal

### Markdown 导出
- [ ] 导出内容是否包含课程标题
- [ ] 导出内容是否包含导出时间
- [ ] 导出内容是否列出已完成的 session checkbox
- [ ] 导出内容是否包含阅读状态

### 阅读系统
- [ ] 精选阅读（默认显示）是否渲染 32 篇卡片
- [ ] 6 个分类 filter 按钮是否可点击（全部 / Foundation / Multimodal / LLM / Generative / Agent / HAI）
- [ ] 点击 filter 后是否只显示对应分类的卡片
- [ ] 切换到"官方完整阅读清单"是否显示 85+ 卡片
- [ ] 4 个官方分类 filter 是否可用（核心阅读 / 讨论阅读 / 项目参考 / 补充材料）
- [ ] 阅读状态按钮（待读 / 在读 / 已读 / 跳过）是否存在
- [ ] 点击状态按钮后是否出现 toast
- [ ] 刷新页面后阅读状态是否保留
- [ ] Hero 阅读进度是否更新（0/32 → 1/32）

---

## D. 七角色论文读法检查

- [ ] 七角色轮盘 SVG 是否渲染（600×600 圆形区域）
- [ ] 是否显示 7 个扇区（每个扇区一种颜色）
- [ ] 7 个角色按钮是否可点击（Peer Reviewer / Archaeologist / Academic Researcher / Industry Practitioner / Hacker / Private Investigator / Social Impact Assessor）
- [ ] 点击角色按钮后是否切换到对应详情卡片
- [ ] 详情卡片是否包含：标题 / 核心问题 / 3–5 个要点 / 适用场景
- [ ] 每个角色的中文名称是否清晰

---

## E. 其他 Section 检查

### 多模态 AI 概念地图
- [ ] SVG 是否渲染（900×500 深色背景）
- [ ] 中心节点"多模态 AI"是否可见
- [ ] 8 个模态节点（视觉/语言/音频/触觉/嗅觉/传感器/医疗/音乐）是否可见
- [ ] 虚线连接是否从中心到各模态节点
- [ ] "核心挑战"框（表示/翻译/对齐/融合/共同学习）是否可见
- [ ] "关键方法"框（Transformer/对比学习/扩散等）是否可见

### 新模态 AI 化流程图
- [ ] 5 个 stage 是否水平排列（数据 → 表征 → 架构 → 训练 → 评估 → 部署）
- [ ] 每个 stage 是否有中文标题 + 英文副标题
- [ ] 箭头连接是否存在
- [ ] 深色背景是否正确（#0a0a1a）

### 术语表
- [ ] 搜索框是否存在（placeholder "搜索术语... (中/英文)"）
- [ ] 输入中文或英文是否过滤结果
- [ ] 术语卡片是否显示：英文术语 / 中文译法 / 定义

### 来源链接
- [ ] 4 个来源分类卡片是否显示（MIT 课程 / YouTube / 授课团队 / Almost Anything 系列）
- [ ] 每个链接是否指向正确的外部 URL

### 课程对应说明
- [ ] 4 个说明卡片是否显示（✅ 保留 / 📝 中文 / 🚫 不包含 / 📁 数据文件）
- [ ] 数据文件说明中是否列出 5 个 JSON 文件及其用途

---

## F. 移动端检查（390px 宽度）

- [ ] 水平方向是否出现滚动条（应无）
- [ ] Hero 标题是否正常换行，不溢出
- [ ] 三个按钮是否堆叠显示（不横向并排）
- [ ] Nav tabs 是否有横向滚动
- [ ] Session 卡片宽度是否自适应
- [ ] 阅读卡片是否从 2 列变为 1 列
- [ ] 七角色轮盘是否缩放适应宽度（max-width: 280px）
- [ ] Modal 宽度是否为 95%
- [ ] 笔记 modal 文本域是否可滚动

---

## G. 发布前必须修正项检查

### 必须确认
- [ ] `index.html` 中不存在"永久 404"、"permanent 404"、"真实 404"等文案
  （搜索命令：`grep -i "永久.*404\|permanent.*404\|真实.*404" index.html`，应返回空）
- [ ] `noindex` meta 标签存在于 `<head>` 中
- [ ] 不使用 MIT slides 原图（无 `<img src="...lec*.pdf">`）
- [ ] 不是逐字翻译 slides（内容为中文导读，不是逐段翻译）

### 链接状态
- [ ] MIT slides PDF 链接保留在 `course.json` 中（不做删除处理）
- [ ] footer 中有关于 MIT slides "网络可能不可达" 的说明
- [ ] `sources.json` 存在且包含所有外部来源

### 数据文件
- [ ] `course.json` 存在，含 27 节
- [ ] `readings.json` 存在，含 32 篇
- [ ] `official_reading_map.json` 存在，含 85 篇
- [ ] `glossary.json` 存在，含 47 条
- [ ] `sources.json` 存在，含 36 个来源

---

## H. 快速冒烟测试（命令行）

```bash
# 启动本地服务
cd ~/conanxin.github.io/drafts/how-to-ai-almost-anything-cn
python3 -m http.server 8080

# 验证所有文件 HTTP 200
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/index.html
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/assets/css/styles.css
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/assets/js/app.js
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/data/course.json
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/data/readings.json

# 验证数据
python3 scripts/validate_course_data.py
python3 scripts/check_links.py  # 关注 MIT slides 状态
```

---

## I. 发现问题记录

发现任何问题请记录：
- 问题描述：________________
- 文件/行号：________________
- 严重程度（Critical / Minor / Cosmetic）：________________
- 是否影响发布：________________
