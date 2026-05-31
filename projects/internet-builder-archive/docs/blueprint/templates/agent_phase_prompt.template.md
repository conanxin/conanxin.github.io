# Agent Phase Prompt Template

复制本模板，根据具体项目填写占位符。

---

```
你现在是 cloud_hermes / 云端 Hermes agent。请只在云端环境执行本任务。

任务名称：
{{PHASE_NAME}}

主站目录：
{{HOST_DIR}}/

项目目录：
{{PROJECT_DIR}}/

项目线上地址：
{{PROJECT_URL}}/

任务背景：
[简要说明项目当前状态和本阶段目标]

当前最新统计：
- total: {{TOTAL}}
- verified_embed: {{VE}}
- verified_source: {{VS}}
- verified total: {{VERIFIED}}
- staging: {{STAGING}}
- paths: {{PATHS}}

[上一 Phase 完成内容简述]

本阶段目标：
[本阶段要做什么]

硬性边界：
1. 只允许修改或新增 {{PROJECT_DIR}} 下的文件
2. 不要修改 {{HOST_DIR}} 其他目录、首页、assets、其他 projects、workflow、系统配置、agent 配置
3. 不要修改 data/items.json（除非本任务明确涉及）
4. 不要修改 data/paths.json（除非本任务明确涉及）
5. 不要修改 data/staging_review.json（除非本任务明确涉及）
6. 不要修改 {{STAGING_COUNT}} 条 staging 的状态（除非用户明确授权处理特定条目）
7. 不要修改 source_url、embed_url、source_status、embed_status、verification_status（除非本任务明确涉及）
8. 不要新增或采用非官方 embed
9. 不要安装新依赖
10. 不要运行长服务
11. 不要读取或提交 .env、token、密钥、日志、缓存、数据库、凭据文件
12. 不要引入外部 CDN
13. 不要加入第三方追踪脚本
14. 不要生成虚假数据、虚假用户反馈、虚假浏览量或夸张宣传
15. 不要在项目目录内新增 items.backup*.json 或 phase*_update.py 临时脚本
16. 本轮可以 commit + push，但只允许提交 {{PROJECT_DIR}} 下本任务涉及文件

修改前核查：
1. cd {{HOST_DIR}}
2. git status -sb
3. git log --oneline -10
4. 确认上一 Phase commit {{PREV_COMMIT}} 已存在
5. 检查 data/items.json：
   - total={{TOTAL}}
   - verified_embed={{VE}}
   - verified_source={{VS}}
   - staging={{STAGING}}
   - verified total={{VERIFIED}}
6. 检查 data/paths.json：
   - {{PATHS}} 条路径
   - 不引用 staging
7. 如统计与预期不符，停止并报告

处理范围：
[明确说明本 Phase 允许修改的文件范围]

请执行以下任务：

A. [任务 A]
[详细说明任务 A 的执行步骤]

B. [任务 B]
[详细说明任务 B 的执行步骤]

[根据需要添加更多任务]

校验：
1. 检查 data/items.json 是合法 JSON
2. 检查 data/paths.json 是合法 JSON
3. 检查 data/staging_review.json 是合法 JSON（如有修改）
4. 检查 total={{TOTAL}}
5. 检查 verified_embed={{VE}}
6. 检查 verified_source={{VS}}
7. 检查 staging={{STAGING}}
8. 检查 67 条 verified 均有 curator_note_zh（如有变化）
9. 检查 paths.json 不引用 staging
10. 检查 HTML 无外部 CDN 新增
11. 检查 app.js 语法
12. 检查项目目录内没有 items.backup*.json 或 phase*_update.py 临时脚本
13. git status --short
14. git add 只添加 {{PROJECT_DIR}} 下本任务涉及文件
15. git commit -m "{{COMMIT_MESSAGE}}"
16. git push origin main
17. 输出 git status

完成后输出结构化报告：
STATUS
HOST_SCOPE
PROJECT_DIR
FILES_CREATED
FILES_MODIFIED
VALIDATION_RESULT
DATA_CHANGES（如有）
GIT_STATUS_CHECK
GIT_COMMIT
GIT_PUSH_RESULT
PROJECT_URL
NEXT_STEP_RECOMMENDATION
```

---

## 占位符说明

| 占位符 | 含义 | 示例 |
|--------|------|------|
| `{{PHASE_NAME}}` | 本阶段名称 | Phase 3A — 新增纪录片资料 |
| `{{HOST_DIR}}` | 主站目录 | /home/ubuntu/conanxin.github.io/ |
| `{{PROJECT_DIR}}` | 项目目录 | /home/ubuntu/conanxin.github.io/projects/my-archive/ |
| `{{PROJECT_URL}}` | 项目线上地址 | https://conanxin.github.io/projects/my-archive/ |
| `{{TOTAL}}` | 当前 total | 74 |
| `{{VE}}` | verified_embed | 31 |
| `{{VS}}` | verified_source | 36 |
| `{{VERIFIED}}` | verified total | 67 |
| `{{STAGING}}` | staging count | 7 |
| `{{PATHS}}` | paths count | 5 |
| `{{STAGING_COUNT}}` | staging 数量文字 | 7 条 |
| `{{PREV_COMMIT}}` | 上一阶段 commit hash | 90dec41 |
| `{{COMMIT_MESSAGE}}` | 本次 commit 消息 | Add new documentary entries |
| `{{DOMAIN}}` | 域名 | conanxin.github.io |