# Agent 操作规范 · 中文

本文档说明如何在策展型资料库项目中安全、高效地使用 cloud Hermes agent。

---

## 1. 基本原则

### 1.1 一次只执行一个 Phase

每个 Phase 必须：
1. 单独执行
2. 完成校验
3. 输出结构化报告
4. 等待用户确认

不要在一个会话中连续执行多个 Phase。每个 Phase 执行完成后报告，用户确认后再继续。

### 1.2 阶段报告必须包含结构化输出

每个 Phase 完成后，输出必须包含：

```
STATUS
HOST_SCOPE
PROJECT_DIR
FILES_CREATED
FILES_MODIFIED
VALIDATION_RESULT
GIT_STATUS_CHECK
GIT_COMMIT
GIT_PUSH_RESULT
NEXT_STEP_RECOMMENDATION
```

### 1.3 安全边界

**硬性边界（绝对不可违反）**：
- 不伪造来源、不采用非官方 embed
- 不修改边界外的文件（首页、assets、其他 projects、workflow、系统配置）
- 不读取或提交凭据文件（.env、token、密钥）
- 不安装新依赖、不运行长服务
- 不在项目目录内新增 items.backup*.json
- 不修改 staging 条目状态（除非用户明确授权）
- 不引入外部 CDN 或第三方追踪脚本

**边界声明格式**：
每个 agent prompt 必须包含：

```
硬性边界：
1. 只允许修改或新增 {{PROJECT_DIR}} 下的文件
2. 不要修改主站其他目录...
3. ...
```

---

## 2. Agent Prompt 结构

每个 Phase 的 agent prompt 应包含：

### 2.1 任务标识

```
任务名称：
{{PHASE_NAME}}

主站目录：
/home/ubuntu/conanxin.github.io/

项目目录：
{{PROJECT_DIR}}/
```

### 2.2 任务背景

说明项目的当前状态和本阶段的目标。包含：
- 当前数据统计
- 上一 Phase 完成情况
- 本 Phase 目标

### 2.3 修改前核查

每个 prompt 必须包含修改前核查步骤：

```
修改前核查：
1. cd /home/ubuntu/conanxin.github.io
2. git status -sb
3. git log --oneline -10
4. 确认上一 Phase commit {{COMMIT_HASH}} 已存在
5. 检查 data/items.json...
6. 如统计不符，停止并报告
```

### 2.4 处理范围

明确说明本 Phase 允许修改的文件范围。不要超出处理范围修改文件。

### 2.5 硬性边界

列出本 Phase 的所有硬性边界。

### 2.6 校验清单

本 Phase 完成后必须运行的校验项。

### 2.7 报告格式

明确要求输出的报告格式。

---

## 3. 数据修改规则

### 3.1 什么可以改

| 操作 | 允许条件 |
|------|----------|
| 修改 items.json | 明确的任务（如修复 source_url）且不违反边界 |
| 修改 paths.json | 条目降级为 staging 时同步移除 |
| 修改 staging 条目 | 用户明确授权处理 P0 条目 |
| 修改 README / docs | 统计变化同步、更新链接 |

### 3.2 什么不能改

| 操作 | 原因 |
|------|------|
| 伪造来源 | 数据可信度基础 |
| 采用非官方 embed | 版权风险 |
| 修改边界外文件 | 安全边界 |
| 修改 staging 状态 | 除非用户授权处理特定条目 |

---

## 4. 协作模式

### 4.1 标准工作流

```
用户 → Phase N → 报告 → 用户确认 → Phase N+1 → ...
```

### 4.2 异常处理

当发现问题时：
1. 停止执行
2. 报告问题
3. 说明原因
4. 等待用户指令

不要在未确认的情况下继续执行。

### 4.3 用户交互模式

**Telegram 超短命令**：
- `继续` → 继续下一 Phase
- `核查` → 重新检查当前状态
- `报告` → 重新输出当前 Phase 报告
- `停止` → 停止当前任务

### 4.4 任务完成标准

每个 Phase 完成的标准：
1. 所有校验通过
2. git commit + push 完成
3. 结构化报告已输出
4. 用户确认或等待下一指令

---

## 5. 避免 Agent 环境混淆

### 5.1 环境识别

cloud Hermes = `/home/ubuntu/conanxin.github.io/` 仓库
OpenClaw = 本地其他 agent
本地 Hermes = 本地终端

### 5.2 任务分配原则

| 任务 | 执行环境 |
|------|----------|
| internet-builder-archive 项目 | cloud Hermes |
| 本地文件操作 | 本地 Hermes |
| 其他 GitHub 项目 | 根据项目位置确定 |

### 5.3 防止跨 agent 污染

- 每个任务开始前检查 `git status -sb`
- 确认在正确的工作目录
- 边界外文件绝不修改
- 不在 cloud Hermes 中执行本地 OpenClaw 的任务

---

## 6. 本项目有效的协作模式

internet-builder-archive 项目验证有效的模式：

### 6.1 截图驱动录入

用户发来截图 → agent 识别材料 → 录入为 staging → 人工确认 P0 → agent 处理

### 6.2 分层策展字段

```
level 1: summary_zh（最简简介）
level 2: + why_it_matters_zh（价值说明）
level 3: + background_zh / key_points_zh / curator_note_zh（全量策展）
```

### 6.3 三态状态机

```
staging（待处理）→ verified_source（来源确认）→ verified_embed（来源+嵌入确认）
```

### 6.4 降级可靠机制

发现 source_url 失效 → 不是删除，而是降级为 staging 或 archived
保留历史记录，说明数据曾经过核实

### 6.5 派生内容同步

条目状态变化 → 同步更新 paths.json → 同步更新路径页 → 同步更新 README 统计 → 同步更新 launch materials

---

## 7. Agent 执行检查清单

每次 Phase 执行前：

- [ ] `git status -sb` — 确认工作区干净
- [ ] `git log --oneline -5` — 确认上一 Phase commit 存在
- [ ] 检查 items.json / paths.json 统计
- [ ] 确认处理范围在边界内
- [ ] 确认不修改 staging 条目状态（除非授权）
- [ ] 确认不引入外部依赖

每次 Phase 执行后：

- [ ] 运行所有校验
- [ ] 确认 JSON 合法
- [ ] `git status -sb` — 确认只有本 Phase 文件变更
- [ ] `git commit -m "{{MESSAGE}}"`
- [ ] `git push origin main`
- [ ] 输出结构化报告