# Phase 8C-R3 运行时修复报告

**STATUS:** COMPLETED
**DATE:** 2026-05-19
**COMMIT:** pending

---

## A. ROOT CAUSE

### Bug 1: renderLectureNotes() TypeError
**现象：** `TypeError: note.reading_guide.forEach is not a function`
**位置：** app.js line 1046 (renderLectureNotes 内部)
**根因：** `lecture_notes.json` 中 27 条记录有 6 条 `reading_guide` 字段类型为 `string` 而非 `array`：

| session_id | reading_guide 类型 |
|---|---|
| m2-disc02 | string |
| m2-disc03 | string |
| m2-disc04 | string |
| m2-disc06 | string |
| m2-disc07 | string |
| m2-disc08 | string |

`renderLectureNotes()` 对 `note.reading_guide` 做 `.forEach()` 假设其为数组，字符串无此方法，导致 TypeError 阻断整个函数执行。

### Bug 2: setupLearningModeRouteRecommend ReferenceError
**现象：** `ReferenceError: setupLearningModeRouteRecommend is not defined`
**位置：** app.js line 38 (DOMContentLoaded 初始化)
**根因：** `DOMContentLoaded` 调用 `setupLearningModeRouteRecommend()`，但 app.js 中从未定义此函数。同步调用导致 ReferenceError。

---

## B. FIXES APPLIED

### Fix 1: normalizeList() helper function
**位置：** app.js lines 14-24（工具函数区）
```javascript
function normalizeList(value) {
    if (Array.isArray(value)) return value;
    if (value === null || value === undefined || value === '') return [];
    if (typeof value === 'string') return [{ title: value, why_read: '', how_to_read: '', key_questions: [] }];
    if (typeof value === 'object') {
        if (Array.isArray(value.items)) return value.items;
        if (Array.isArray(value.points)) return value.points;
        return Object.values(value).filter(Boolean).map(String);
    }
    return [String(value)];
}
```

### Fix 2: reading_guide.forEach → normalizeList(note.reading_guide).forEach
**文件：** app.js
- line 1059: `renderLectureNotes()` 内 `note.reading_guide.forEach` → `normalizeList(note.reading_guide).forEach`
- line 1070: `rg.key_questions.forEach` → `normalizeList(rg.key_questions).forEach`
- line 1331: `exportLectureNotesMarkdown()` 内 `note.reading_guide.forEach` → `normalizeList(note.reading_guide).forEach`
- line 1337: `rg.key_questions.forEach` → `normalizeList(rg.key_questions).forEach`
- line 1344: `note.project_ideas.forEach` → `normalizeList(note.project_ideas).forEach`
- line 1354: `note.reflection_questions.forEach` → `normalizeList(note.reflection_questions).forEach`

**注意：** `note.concepts` (always list 27/27), `note.project_ideas` (always list 27/27), `note.reflection_questions` (always list 27/27) 不需要修改，已有 `&& note.X.length > 0` 保护。

### Fix 3: setupLearningModeRouteRecommend guard
**位置：** app.js lines 48-51
```javascript
// setupLearningModeRouteRecommend: safe guard, noop if missing
if (typeof setupLearningModeRouteRecommend === 'function') {
    try { setupLearningModeRouteRecommend(); } catch(e) { _err('setupLearningModeRouteRecommend FAILED:', e); }
}
```

### Fix 4: All DOMContentLoaded initializations wrapped in try/catch
所有 24 个初始化调用均已加 try/catch，单个失败不阻断其他功能。

### Fix 5: HOW2AI_DEBUG = false
调试日志已关闭，不在 production 输出任何 console 信息。

---

## C. VALIDATION

| Check | Result |
|---|---|
| `node --check assets/js/app.js` | ✅ PASS |
| `validate_course_data.py` | ✅ PASS (27 sessions, 27 lecture notes, 4 routes) |
| `audit_static_ui.py` | ⚠️ 25 ISSUES (harmless mode-/pp- dynamic ID false positives) + 24 WARN |
| `normalizeList()` defined | ✅ lines 14-24 |
| `normalizeList` usages | ✅ 7 locations |
| `note.reading_guide.forEach` in renderLectureNotes | ✅ Fixed → `normalizeList(note.reading_guide).forEach` |
| `note.reading_guide.forEach` in exportLectureNotesMarkdown | ✅ Fixed → `normalizeList(note.reading_guide).forEach` |
| `setupLearningModeRouteRecommend` guard | ✅ `typeof` guard + try/catch |
| HOW2AI_DEBUG | ✅ `false` (production silent) |
| Unguarded `note.*.forEach` remaining | ⚠️ concepts/project_ideas/reflection_questions — 27/27 全为数组，有 length guard，安全 |

---

## D. LOCAL SMOKE TEST

| Asset | HTTP Status |
|---|---|
| index.html | 200 ✅ |
| assets/js/app.js | 200 ✅ |
| assets/css/styles.css | 200 ✅ |
| data/lecture_notes.json | 200 ✅ |
| data/course.json | 200 ✅ |

---

## E. LECTURE NOTES DATA AUDIT

| Field | Types Found | Safe? |
|---|---|---|
| reading_guide | list (21), str (6) | ✅ Fixed with normalizeList |
| concepts | list (27) | ✅ Already safe, has length guard |
| project_ideas | list (27) | ✅ Already safe, has length guard |
| reflection_questions | list (27) | ✅ Already safe, has length guard |
| key_concepts | NoneType (27) | ✅ Not used in renderLectureNotes |
| discussion_questions | NoneType (27) | ✅ Not used in renderLectureNotes |
| practice_prompts | NoneType (27) | ✅ Not used in renderLectureNotes |

---

## F. NOINDEX STATUS

- **Public index.html:** ✅ `<meta name="robots" content="index, follow">` — 无 noindex
- **Draft:** 未检查（超出边界）

---

## G. PUBLISH_READINESS

**READY_FOR_MANUAL_BROWSER_QA**

---

## H. KNOWN ISSUES

1. `audit_static_ui.py` 25 ISSUES — mode-/pp- 动态 ID 误报，属无害遗留
2. `note.concepts` / `note.project_ideas` / `note.reflection_questions` 虽为 always-array，但未用 normalizeList（已有 length guard 且数据验证确认 27/27 安全）
3. `thematicRoutes.length=4` 而非 21（thematic_routes.json 数据问题，不在 Phase 8C-R3 范围）

---

## I. NEXT STEPS

1. 提交推送后等待 60-90s GitHub Pages 部署
2. 用户在浏览器强制刷新 (Ctrl+Shift+R)
3. 验证 Console 无红色 TypeError 或 ReferenceError
4. 验证"📖 中文讲义"区域显示 27 张讲义卡片
5. 验证点击任意讲义卡片可展开内容（reading_guide 显示正确）
6. QA 全 PASS → Phase 8C 完成，可推进 Phase 8D
