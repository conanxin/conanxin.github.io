# PUBLISH_RESEARCH_TO_DRAMA_OSS

继续 Research-to-Drama Engine，执行 PUBLISH_RESEARCH_TO_DRAMA_OSS。
本任务是实际开源发布，不是再做发布准备或研究认证。

背景：中文图文页、Notion 开发纪事、GitHub 项目说明已完成；完整 Engine 源码尚待从你能访问的真实工作树发布。
原工作树：/home/ubuntu/research-to-drama-skills
建议公开仓库：conanxin/research-to-drama-skills
中文介绍页：https://conanxin.github.io/projects/research-to-drama-engine/
公开文档：https://github.com/conanxin/conanxin.github.io/tree/main/projects/research-to-drama-engine
文档提交：a7c00d4fb0d344df072a7949693411808e0d25c2
Notion 发布交接：https://app.notion.com/p/3e034a28189a812daa20c73c03bf0e91

执行：
1. 读取真实 HEAD、README、LICENSE、源码/Schema/Skill/测试目录、依赖和 remote；确认 GitHub CLI 当前账户为 conanxin。不要输出认证信息。若源码仓库已经公开，核对并补缺，不重复创建。不回退或改写原研究历史。
2. 在 repo 外建立独立公开发行树，从真实工程导出自有代码、Schemas、Skills、文档、必要测试和一个可复现的公开示例。原研究工作树保持不变。排除私人邮件、个人地址、认证信息、原始私人扫描和未筛选日志，不把原研究 .git 历史直接推上公网。导出清单记录来源 HEAD 与文件范围；示例若为脱敏或合成数据，明确标注，不伪装历史证据。
3. 沿用原工程许可证；自有代码无许可证时采用 MIT，第三方内容保持自身许可及归属。核对 vendor/screenwriting-skills 的真实上游；许可不明的第三方目录不直接整包发布。不要从聊天摘要重写一个替代引擎。
4. 从实际代码恢复 README 的安装方式、依赖、最小使用示例和测试命令，不编造 pip 包、CLI 或自动化能力。加入公开开发纪事及上述中文页链接。当前公开口径：研究协议与 Agent 工作流原型；五个正式样本来自同一 Fogolla 底层来源链；P2 Shadow 已验收；正式第二链未完成；L2保持、L3 CONDITIONAL；不写未经测量的总体完成百分比或零幻觉保证。
5. 执行项目已有的最小可重复验证；依赖私有材料而不能执行的测试明确列出，不算通过。只做本次发行必要检查，不重跑所有历史研究阶段。
6. 使用当前已授权的 gh/git 创建或更新 conanxin/research-to-drama-skills 公开仓库，推送干净发行树。目标若已存在先确认身份与内容；不 force-push，不覆盖 classic-to-drama-engine。实际命令按当前 gh 支持执行。
7. 仓库可回读后，确认 README 与 Homepage 指向中文页；更新 conanxin.github.io 项目页面“源码待发布”为真实源码链接，复用现有设计，不另建后端。更新 Notion 发布交接中的实际状态。

研究边界：不修改原 Claim/CO/EA/World/DD/SB/STX；不重跑 Shadow；不发送第二封档案馆邮件。TRANSCRIPTION_VERIFIED=false、EVIDENCE_LINEAGE_INDEPENDENT=PROVISIONAL、L3=CONDITIONAL 保持。发布成功不等于史料核验或正式第二链完成。

返回：公开源码 URL、发布 commit、来源 HEAD、许可证、导出范围、实际测试命令与结果、README 与中文页链接、Notion 更新结果。只有实际创建并回读成功才能写“已开源”。遇到真实访问或许可阻塞，准确报告唯一剩余阻塞，不制造下一轮准备阶段。
