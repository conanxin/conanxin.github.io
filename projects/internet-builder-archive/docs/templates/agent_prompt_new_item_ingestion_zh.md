# Agent 操作提示词模板：新增资料录入

复制本模板到 Hermès chat 用于向「旧互联网建设者资料库」新增条目。

---

## 模板

```
你现在是 cloud_hermes / 云端 Hermes agent。请只在云端环境执行本任务。

任务名称：
internet-builder-archive — 新增资料录入

主站目录：
/home/ubuntu/conanxin.github.io/

项目目录：
/home/ubuntu/conanxin.github.io/projects/internet-builder-archive/

项目线上地址：
https://conanxin.github.io/projects/internet-builder-archive/

硬性边界：
1. 只允许修改或新增 /home/ubuntu/conanxin.github.io/projects/internet-builder-archive/ 下的文件。
2. 不要修改 data/items.json（直接编辑）、data/paths.json（直接编辑）或 data/staging_review.json。
3. 不要修改 7 条 existing staging 的状态。
4. 不要修改 source_url、embed_url、source_status、embed_status、verification_status（已存在的条目）。
5. 不要新增或采用非官方 embed。
6. 不要引入外部 CDN。
7. 不要加入第三方追踪脚本。
8. 不要生成虚假数据。
9. 不要在项目目录内新增 items.backup*.json。
10. 不确定来源时不得伪造，必须进入 staging。
11. 只允许通过 docs/workflow/NEW_ITEM_INGESTION_WORKFLOW_ZH.md 中的流程新增条目。

## 用户输入

用户提供的新条目信息：

- 截图路径 / URL / 标题：[用户提供]
- 类型：[视频 / 纪录片 / 访谈 / 播客 / 文章 / 备忘录 / 其他]
- 适合路径：[founder-spirit / tech-startup-history / media-and-society / creator-mindset / organization-and-strategy / 不加入路径]
- 允许联网检索来源：[是 / 否]
- 策展语言：[仅中文 / 中英双语]

## 任务

按照 docs/workflow/NEW_ITEM_INGESTION_WORKFLOW_ZH.md 执行完整录入流程：
1. 候选录入（使用 docs/templates/new_item.template.json）
2. 来源核实（按 SOURCE_VERIFICATION_CHECKLIST_ZH.md）
3. 嵌入判断（按 EMBED_POLICY_ZH.md）
4. 中文化
5. 状态判断
6. 路径判断
7. 派生同步
8. 审计（按 RELEASE_CHECKLIST_ZH.md）
9. git commit + push（只提交 projects/internet-builder-archive/ 下本任务涉及文件）

## 完成后报告

STATUS
HOST_SCOPE
PROJECT_DIR
ITEMS_ADDED
ITEMS_STATUS
PATH_ASSIGNMENTS
VALIDATION_RESULT
GIT_COMMIT
GIT_PUSH_RESULT
PROJECT_URL
```

---

## 使用说明

1. **复制模板**：将上方模板复制到 Hermès chat
2. **替换用户输入**：在 `## 用户输入` 部分填入用户提供的信息
3. **Agent 执行**：Agent 读取 workflow 文档、执行流程、完成审计后报告
4. **人工复核**：如有 staging 条目，等待用户提供截图或确认来源

---

## 注意事项

- 本模板只用于新条目录入，不用于修改已存在的 verified 条目
- 如需修改已存在条目的 source_url，使用 Phase 2M-B 工作流
- 如需将 staging 转为 verified，使用 NEW_ITEM_INGESTION_WORKFLOW_ZH.md 中的状态判断流程
- 如需要求用户补充截图或来源，请在报告中说明