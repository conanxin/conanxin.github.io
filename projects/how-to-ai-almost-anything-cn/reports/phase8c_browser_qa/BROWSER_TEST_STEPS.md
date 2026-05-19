# Phase 8C Browser Test Steps

## 准备工作
1. 打开 Chrome DevTools (F12)
2. 切换到 Console 标签，记录任何 red error
3. 打开 DevTools Device Toolbar，设为 iPhone 14 Pro (390px) 模式

## A. 基础加载测试
1. 打开正式 URL：https://conanxin.github.io/projects/how-to-ai-almost-anything-cn/
2. 强制刷新 (Ctrl+Shift+R) 清除缓存
3. 检查页面顶部是否显示 "Public release version: Phase 8C Route Report"
4. 在 Console 检查无红色 JS error
5. 检查 DevTools Elements 面板，index.html 不含 noindex

## B. 路线 hash 导航测试
1. 在地址栏输入并回车：`https://conanxin.github.io/projects/how-to-ai-almost-anything-cn/#route-multisensory`
2. 检查页面直接显示 multisensory 路线，tab 高亮
3. 按顺序测试：`#route-large-models`、`#route-agents`、`#route-project`
4. 刷新当前页面，检查路线状态保持

## C. Mini Quiz 测试
1. 在 multisensory 路线，选择第一个问题的答案选项
2. 点击提交，检查显示正确/错误反馈和解释
3. 确认得分 (x/5) 更新
4. 刷新页面，检查分数保留

## D. 错题回顾测试
1. 故意答错一题
2. 检查是否出现"错题回顾"区域
3. 确认显示：我的答案、正确答案、解释
4. 点击"只重做错题"按钮
5. 确认只重新出现错题，答对的题保留
6. 确认重新答题后错题被清除（答对则清除）

## E. 路线学习报告测试
1. 在任意路线点击"生成路线学习报告"
2. 检查报告弹窗或区域出现
3. 确认包含 10 个 section（概览、路线进度、知识点掌握、推荐资源、学习建议、错题分析、薄弱点、下一周计划、路线链接、总结）
4. 点击复制 Markdown 或下载按钮

## F. 复制路线链接测试
1. 在路线内点击"复制路线链接"
2. 检查 toast 提示出现
3. 打开新标签页，粘贴链接
4. 确认新窗口直接显示对应路线

## G. Badge 双向跳转测试
1. 在页面找到 session 卡片
2. 点击卡片上的 route badge（如 "multisensory"）
3. 确认页面滚动到对应路线 section 并高亮
4. 对 reading 卡片和 glossary 卡片重复步骤 2-3

## H. 移动端测试 (390px)
1. 在 DevTools Device Toolbar 选择 iPhone 14 Pro (390px)
2. 刷新页面
3. 水平滚动检查（应无横向滚动）
4. 测试 route tabs 点击
5. 测试 quiz options 显示不撑破
6. 检查错题回顾内容可读
7. 检查导出按钮不溢出
8. 检查 badge 自动换行

## I. localStorage 验证
1. 在 Console 执行：`JSON.parse(localStorage.getItem('how2ai_route_progress'))`
2. 执行：`JSON.parse(localStorage.getItem('how2ai_route_quiz_scores'))`
3. 执行：`JSON.parse(localStorage.getItem('how2ai_route_quiz_answers'))`
4. 执行：`localStorage.getItem('how2ai_active_route')`
5. 确认都有有效值（不为 null）
6. 刷新页面，执行上述 get，确认值未丢失

## 测试完成
- 汇总所有 [ ] 项为 PASS/WARN/FAIL
- 如有 FAIL，记录截图和控制台输出
- 提交测试结果到 reports/phase8c_browser_qa/
