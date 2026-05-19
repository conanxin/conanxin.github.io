# Phase 8C Browser QA Checklist

## A. 基础加载
- [ ] 正式 URL 可打开
- [ ] 页面显示 Public release version: Phase 8C Route Report
- [ ] 页面无 noindex
- [ ] CSS/JS 正常加载
- [ ] Console 无红色 JS error

## B. 路线 hash
- [ ] #route-multisensory 可直达路线
- [ ] #route-large-models 可直达路线
- [ ] #route-agents 可直达路线
- [ ] #route-project 可直达路线
- [ ] route tab 高亮正确
- [ ] 刷新后仍保持路线

## C. mini quiz
- [ ] 可选择答案
- [ ] 答题后显示正确/错误
- [ ] 显示解释
- [ ] 得分 x/5 更新
- [ ] 刷新后分数保留

## D. 错题回顾
- [ ] 答错后出现错题回顾
- [ ] 显示我的答案
- [ ] 显示正确答案
- [ ] 显示解释
- [ ] 只重做错题按钮可用
- [ ] 只清除错题，不清除答对题

## E. 路线学习报告
- [ ] 点击生成路线学习报告
- [ ] 报告包含 10 个 section
- [ ] 包含 quiz 错题
- [ ] 包含下一周计划
- [ ] 可复制或下载 Markdown

## F. 复制路线链接
- [ ] 点击复制路线链接
- [ ] toast 或提示出现
- [ ] 粘贴后 URL 含 #route-xxx
- [ ] 新窗口打开可直达路线

## G. badge 双向跳转
- [ ] session 卡片 route badge 可点击
- [ ] reading 卡片 route badge 可点击
- [ ] glossary 卡片 route badge 可点击
- [ ] 点击后滚动到专题路线 section
- [ ] 对应路线高亮

## H. 移动端
- [ ] 390px 宽度无横向滚动
- [ ] route tabs 可点击
- [ ] quiz options 不撑破
- [ ] 错题回顾可读
- [ ] 导出按钮不溢出
- [ ] badge 自动换行

## I. localStorage
- [ ] how2ai_route_progress 存在
- [ ] how2ai_route_quiz_scores 存在
- [ ] how2ai_route_quiz_answers 存在
- [ ] how2ai_active_route 存在
- [ ] 刷新后状态保留
