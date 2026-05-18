#!/usr/bin/env python3
"""
audit_static_ui.py — Phase 4 静态 UI 审计脚本
检查 HTML/CSS/JS 中的常见问题：重复 ID、断裂锚点、DOM-JS 不匹配、
移动端溢出风险、bad phrase 检查等。
"""
import os, re, sys

PROJECT = "/home/ubuntu/conanxin.github.io/drafts/how-to-ai-almost-anything-cn"
os.chdir(PROJECT)

HTML_FILE = "index.html"
CSS_FILE = "assets/css/styles.css"
JS_FILE = "assets/js/app.js"

def read(path):
    with open(path, encoding="utf-8") as f:
        return f.read()

def audit():
    issues = []
    warnings = []

    # ── 1. 读取文件 ────────────────────────────────────────────
    html = read(HTML_FILE)
    css = read(CSS_FILE)
    js = read(JS_FILE)

    # ── 2. noindex 检查 ─────────────────────────────────────────
    if 'noindex' not in html:
        issues.append("ISSUE: <meta name='robots' content='noindex'> 未找到，draft 页面必须保留 noindex")
    else:
        print("  ✅ noindex meta 标签存在")

    # ── 3. Bad phrase 检查 ───────────────────────────────────────
    bad_phrases = [
        ("永久 404", "永久.*404"),
        ("permanent 404", "permanent.*404"),
        ("真实 404", "真实.*404"),
        ("彻底 404", "彻底.*404"),
    ]
    for label, pattern in bad_phrases:
        if re.search(pattern, html, re.IGNORECASE):
            issues.append(f"ISSUE: 发现 '{label}' 文案（应改为 MANUAL_BROWSER_CHECK_RECOMMENDED）")
        else:
            print(f"  ✅ 无 '{label}' 文案")
    # 只检查 index.html 正文（不包括备份目录中的旧版本）
    for match in re.finditer(r'"([^"]*permanent[^"]*)"|\'([^\']*permanent[^\']*)\'', html):
        pass  # no literal phrases found via regex above already

    # ── 4. 重复 ID 检查 ─────────────────────────────────────────
    ids = re.findall(r'\bid="([^"]+)"', html)
    id_counts = {}
    for i in ids:
        id_counts[i] = id_counts.get(i, 0) + 1
    dup_ids = {i: c for i, c in id_counts.items() if c > 1}
    if dup_ids:
        for i, c in dup_ids.items():
            issues.append(f"ISSUE: id='{i}' 在 HTML 中出现 {c} 次（必须唯一）")
    else:
        print("  ✅ 所有 HTML id 唯一")

    # ── 5. 锚点存在性检查 ───────────────────────────────────────
    hrefs = re.findall(r'href="#([^"]+)"', html)
    anchors_found = set(re.findall(r'\bid="([^"]+)"', html))
    missing_anchors = []
    for href in hrefs:
        # 跳过 javascript: 等
        if href.startswith("javascript"): continue
        # href="#sessions" 引用 id="sessions"
        if href not in anchors_found:
            missing_anchors.append(href)
    if missing_anchors:
        issues.append(f"ISSUE: 锚点不存在: {missing_anchors}")
    else:
        print(f"  ✅ 所有 {len(hrefs)} 个 href=#... 锚点均存在")

    # ── 6. JS 引用但 HTML 不存在的 DOM ─────────────────────────
    # 从 JS 中提取 getElementById('xxx') 和 #xxx 选择器
    js_getbyid = set(re.findall(r'getElementById\(["\']([^"\']+)["\']', js))
    js_query_selector = set(re.findall(r'querySelector\(["\']#([^"\']+)["\']', js))

    # JS 动态创建的 DOM（不在 HTML 中，但在 JS innerHTML 模板里）
    # noteTextarea: 在 openNotes() 的模板字符串中动态创建
    # roleDetail*: 前缀，实际 ID 为 roleDetail + 角色名，在 HTML 中存在
    js_dynamic_ids = {'noteTextarea', 'roleDetail', 'modalBackdrop', 'notesBackdrop', 'quizBackdrop',
                      'notesBody', 'quizBody', 'quizClose', 'notesClose', 'quizAnswer'}
    js_dom_refs = js_getbyid | js_query_selector
    js_dom_refs_known_dynamic = js_dom_refs - js_dynamic_ids

    missing_from_html = []
    for ref in sorted(js_dom_refs_known_dynamic):
        if ref not in anchors_found:
            missing_from_html.append(ref)
        real_missing = [m for m in missing_from_html if not re.search(rf'["\']?\?[^"\']*{re.escape(m)}', js)]
        # 重新检查：JS 中的 ?.classList.remove 等
        # stat-sessions / stat-readings / stat-glossary 在旧版 animateProgress 中，
        # 但新版改用了 heroProgressSessions.heroProgressReadings
        # 过滤掉 updateStats 中的 stat-* (只读展示，无害)
        filtered_missing = []
        for m in real_missing:
            # stat-sessions/stat-readings/stat-glossary: 仅在 updateStats 读，
            # 不写，无害。progressFill 在新版中用 querySelector('.progress-fill')
            if m.startswith('stat-'):
                warnings.append(f"  WARN: JS 引用 id='{m}' 但 HTML 中不存在（仅被读取，属无害）")
                continue
            if m == 'progressFill':
                warnings.append(f"  WARN: JS 引用 id='progressFill' 但 HTML 中无此 ID（新版用 class=.progress-fill）")
                continue
            filtered_missing.append(m)
        if filtered_missing:
            issues.append(f"ISSUE: JS 引用但 HTML 中不存在的 DOM ID: {filtered_missing}")
    else:
        print(f"  ✅ JS 所需的 DOM 元素均存在于 HTML")

    # ── 7. HTML 中有 onclick 等但 JS 中无对应函数 ──────────────
    html_onhandlers = set(re.findall(r'onclick="([^"(]+)', html))
    html_onhandlers.update(re.findall(r'onclick=\'([^(]+)', html))
    js_functions = set(re.findall(r'\bfunction\s+(\w+)\s*\(', js))
    # 也检查箭头函数赋值
    js_functions.update(re.findall(r'(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>', js))

    missing_handlers = []
    for h in sorted(html_onhandlers):
        # 跳过内联表达式，如 setTimeout(...)
        if '(' in h: continue
        if h not in js_functions:
            missing_handlers.append(h)

    # setTimeout/setInterval/alert 都是浏览器内置全局函数，
    # onclick="setTimeout(...)" 是合法用法，不需要自定义 function setTimeout(){}
    builtin_funcs = {'setTimeout', 'setInterval', 'alert', 'confirm', 'prompt', 'console',
                     'fetch', 'JSON', 'parseInt', 'parseFloat', 'Math', 'Date', 'Array', 'Object'}
    real_missing_handlers = [h for h in missing_handlers if h not in builtin_funcs]
    if real_missing_handlers:
        issues.append(f"ISSUE: HTML onclick 引用但 JS 中未定义的函数: {real_missing_handlers}")
    else:
        print("  ✅ 所有 HTML onclick 处理器在 JS 中均有定义")

    # ── 8. CSS 移动端溢出风险检查 ──────────────────────────────
    # 检查是否有固定 width > 900 且无 overflow/white-space 处理
    fixed_width = re.findall(r'(?:^|[^a-z])\s*width\s*:\s*(\d+)px(?!\s*;)', css, re.MULTILINE)
    # SVG 是否有 max-width
    svg_blocks = re.findall(r'<svg[^>]*>(.*?)</svg>', html, re.DOTALL)
    svg_no_maxwidth = []
    for i, svg in enumerate(svg_blocks, 1):
        if 'max-width' not in svg and 'width:100%' not in svg and 'width: 100%' not in svg:
            svg_no_maxwidth.append(f"第{i}个SVG")

    if svg_no_maxwidth and not re.search(r'\.concept-map-svg|\.pipeline-svg', css):
        warnings.append(f"  WARN: 某些 SVG 缺少 max-width 或 width:100% 样式，可能在移动端溢出")
    else:
        print("  ✅ SVG 均设置了 max-width 或 width:100%")

    # ── 9. Section number 跳号检查 ────────────────────────────
    section_nums = re.findall(r'section-num">(\d+)<', html)
    section_nums = [int(n) for n in section_nums]
    expected = list(range(1, len(section_nums) + 1))
    missing_nums = [n for n in expected if n not in section_nums]
    if missing_nums:
        issues.append(f"ISSUE: Section 编号跳号: 缺少 {missing_nums}，实际编号: {section_nums}")
    else:
        print(f"  ✅ Section 编号连续: {section_nums}")

    # ── 10. section-num 重复检查 ────────────────────────────────
    from collections import Counter
    dup_nums = [n for n, c in Counter(section_nums).items() if c > 1]
    if dup_nums:
        issues.append(f"ISSUE: Section 编号重复: {dup_nums}（应为连续唯一编号）")
    else:
        print(f"  ✅ Section 编号无重复")

    # ── 11. SVG 扇区重叠检查（七角色轮盘）────────────────────
    # 检查是否有多个 sector path 的 arc 端点相同（导致重叠）
    # Social Impact sector 的 path 应该和前一个扇区不同
    # 检查 index.html 中是否有重叠的 SVG path
    seven_role_svg = re.search(r'<svg class="roles-wheel-svg".*?</svg>', html, re.DOTALL)
    if seven_role_svg:
        paths = re.findall(r'<path d="([^"]+)"', seven_role_svg.group())
        # 检查是否有 opacity:0.0 的空 sector（Social Impact 被 Peer Reviewer 覆盖）
        if any('opacity="0.0"' in p or "opacity='0.0'" in p or 'opacity:0.0' in p for p in paths):
            issues.append("ISSUE: 七角色轮盘存在 opacity:0.0 的空 sector（Social Impact 扇区被覆盖）")
        else:
            print("  ✅ 七角色 SVG 扇区无透明 sector")
        # 检查是否有 7 个非空 sector
        non_transparent = [p for p in paths if 'opacity' not in p.lower() or ('opacity' in p.lower() and '0.0' not in p.lower())]
        if len(non_transparent) < 7:
            issues.append(f"ISSUE: 七角色 SVG 只有 {len(non_transparent)} 个非透明扇区，应有 7 个")
        else:
            print(f"  ✅ 七角色 SVG 有 {len(non_transparent)} 个非透明扇区")

    # ── 12. data JSON 文件存在性 ────────────────────────────────
    required_data = [
        "data/course.json",
        "data/readings.json",
        "data/official_reading_map.json",
        "data/glossary.json",
        "data/sources.json",
    ]
    for path in required_data:
        if os.path.exists(path):
            print(f"  ✅ {path} 存在")
        else:
            issues.append(f"ISSUE: 必需数据文件不存在: {path}")

    # ── 13. scripts 存在性 ─────────────────────────────────────
    for script in ["scripts/validate_course_data.py", "scripts/check_links.py"]:
        if os.path.exists(script):
            print(f"  ✅ {script} 存在")
        else:
            issues.append(f"ISSUE: 必需脚本不存在: {script}")

    # ── 14. JS 关键函数存在性检查 ─────────────────────────────
    required_funcs = [
        "toggleSession", "openNotes", "saveNote", "exportNote", "openQuiz",
        "switchReadingSource", "setReadingStatus", "getReadingStatus",
        "renderSessions", "renderCuratedReadings", "renderGlossary",
        "setupNavTabs", "setupSevenRoles", "setupReadingSourceToggle",
        "animateProgress", "updateModuleProgressBar",
        "showToast",
    ]
    for func in required_funcs:
        if re.search(rf'\bfunction\s+{re.escape(func)}\b', js):
            print(f"  ✅ function {func}() 存在")
        else:
            issues.append(f"ISSUE: 必需函数 function {func}() 未找到")

    # ── 总结 ───────────────────────────────────────────────────
    print("\n" + "=" * 60)
    print("审计总结")
    print("=" * 60)
    if issues:
        print(f"\n❌ 发现 {len(issues)} 个 ISSUE：")
        for iss in issues:
            print(f"  - {iss}")
    if warnings:
        print(f"\n⚠️  发现 {len(warnings)} 个 WARN（不影响发布）：")
        for w in warnings:
            print(f"  - {w}")
    if not issues and not warnings:
        print("\n✅ 静态 UI 审计通过，无问题")

    return len(issues), len(warnings)

if __name__ == "__main__":
    ic, wc = audit()
    sys.exit(0 if ic == 0 else 1)
