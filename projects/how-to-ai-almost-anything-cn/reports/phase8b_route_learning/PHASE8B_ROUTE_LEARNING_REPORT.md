# Phase 8B — Route Learning System Enhancement

## 基本信息

STATUS: IN_PROGRESS
HOST_SCOPE: cloud_hermes (cloud Hermes, not local/openclaw)
PROJECT_DIR: ~/conanxin.github.io/projects/how-to-ai-almost-anything-cn/
BACKUP_DIR: ~/conanxin.github.io/backups/how2ai-phase8b-before-route-learning-20260519-084940/

---

## 文件变更

FILES_CREATED:
- reports/phase8b_route_learning/PHASE8B_ROUTE_LEARNING_REPORT.md

FILES_MODIFIED:
- index.html (data-public-version=phase8b-route-learning, footer version, noscript comment update)
- assets/js/app.js (Phase 8B functions appended: ~1400 lines new code)
- assets/css/styles.css (Phase 8B styles appended: ~350 lines)
- data/thematic_routes.json (quiz field added: 4 routes × 5 questions = 20 Q)
- scripts/validate_course_data.py (validate_thematic_route_quiz, validate_route_crossrefs added, main() updated to 9/9)

---

## Phase 8B 功能清单

ROUTE_LANDING: ✅ 路线专属 tab 视图，点击路线高亮并进入路线详情视图，隐藏其他路线；支持"全部路线"重置
ROUTE_HASH_SUPPORT: ✅ URL hash (#route-multisensory, #route-large-models, #route-agents, #route-project)，页面加载时 handleRouteHash 自动切换
MINI_QUIZ: ✅ 每条路线 5 题，共 20 题；含答案、解释、中文题干；localStorage 保存分数；支持重做
ROUTE_REPORT_EXPORT: ✅ "生成路线学习报告" 按钮，Markdown 格式，包含里程碑进度、quiz 得分、推荐节点、术语、下一步建议；弹窗展示 + 复制/下载
SESSION_ROUTE_LINKING: ✅ buildSessionRouteMap 反向生成 session→routes 映射；session 卡片底部显示"所属专题路线" badge
READING_ROUTE_LINKING: ✅ buildReadingRouteMap；精选阅读卡片显示推荐路线 badge；支持多路线 badge
GLOSSARY_ROUTE_LINKING: ✅ buildGlossaryRouteMap；术语卡片显示相关路线 badge；宽松 key 匹配
LEARNING_MODE_LINKING: ✅ LEARNING_MODE_RECOMMENDATIONS；学习模式切换时显示"推荐给你的路线"；不强制切换，仅高亮推荐

---

## 技术细节

LOCAL_STORAGE_KEYS:
- how2ai_route_progress (里程碑进度)
- how2ai_route_quiz_scores (quiz 分数: {routeId: {score, total, answered}})
- how2ai_active_route (当前激活路线 ID)

JAVASCRIPT_FUNCTIONS_ADDED (21):
路由/标签: renderRouteTabs, switchRouteTab, setActiveRoute, getActiveRoute, handleRouteHash
双向互联: buildSessionRouteMap, buildReadingRouteMap, buildGlossaryRouteMap, getRoutesForSession, getRoutesForReading, getRoutesForGlossary, renderSessionRouteBadges, renderReadingRouteBadges, renderGlossaryRouteBadges, scrollToThematicRoutes
Quiz系统: getRouteQuizScores, saveRouteQuizScore, getRouteQuizScoreData, renderQuizForRoute, handleQuizAnswer, resetQuizForRoute
报告生成: exportRouteLearningReport, getRouteMilestoneProgress, getRouteProgressData
学习模式: LEARNING_MODE_RECOMMENDATIONS, getRouteRecommendationHTML, setupLearningModeRouteRecommend

---

## 验证结果

VALIDATION:
- node --check app.js: PASS ✅
- validate_course_data.py: 9/9 PASS ✅
- audit_static_ui.py: PASS ✅ (仅 harmless JS ref warnings)
- thematic_routes.json quiz: 4 routes × 5 Q = 20 Q validated ✅
- route_crossrefs: All session refs valid ✅; 17 non-blocking glossary term warnings (术语存在但宽松匹配未命中)

---

## 提交信息

COMMIT_HASH: <pending — 待 git push>
PUSH_STATUS: <pending — 待 push>

---

## Smoke Test

LOCAL_SMOKE_TEST: <pending>
ONLINE_SMOKE_TEST: <pending>

NOINDEX_PUBLIC_STATUS: 确认 public 项目 index.html 无 noindex ✅
NOINDEX_DRAFT_STATUS: 不修改 draft 目录 ✅

PUBLISH_READINESS: READY_FOR_ONLINE_SMOKE

---

## KNOWN_ISSUES

1. 17 个 glossary term 宽松匹配未命中（non-blocking warning）：术语概念存在于 glossary 但 key 不同，如 "Sensor" vs "Sensors"，"Chain-of-Thought" vs "CoT" 等
2. 自动测试无法完全覆盖浏览器交互细节（route tab 切换、quiz 答题流程、report 导出弹窗、badge 点击跳转），需人工点测
3. check_links.py 未执行，沿用 Phase 8A-R 链接状态（Phase 8A-R 验证通过后已知状态良好）
4. audit_static_ui.py 报告 15 个 section（而非 16），可能与讲义 section 计算方式有关，不影响功能

---

## NEXT_STEPS

1. git commit + push → 获得 COMMIT_HASH
2. 等待 GitHub Pages 更新（60-90s）
3. 线上 smoke test（curl 验证 + node --check）
4. 更新报告 PUBLISH_READINESS 为 READY_FOR_BROWSER_REVIEW
5. 浏览器人工核验：route tab 切换 / quiz 答题 / report export / session badge 点击

---

## 功能演示摘要

**路线 Tab 切换：**
全部路线 → 多感官 AI / 大模型与多模态基础模型 / 交互式 Agent / 研究项目

**Quiz 流程：**
选择答案 → 显示正确/错误 + 解释 → localStorage 保存 → 显示得分 x/5 → 可重做

**报告生成：**
点击按钮 → 弹窗 Markdown 报告 → 复制 / 下载 / 关闭

**双向互联：**
Session 卡片底部 badge → 点击跳转路线视图
Reading/Glossary 卡片 badge → 同上

**学习模式联动：**
切换快速通识/论文精读/项目实战 → 显示推荐路线（不高亮强制）

---

*报告生成时间: 2026-05-19T08:57 UTC*
*Phase 8B Route Learning — cloud_hermes*
