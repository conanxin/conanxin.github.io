#!/usr/bin/env python3
"""
信抵达之前 — 项目本地验证脚本
验证：JSON 合法性、引用完整性、文件存在性、无外部 CDN
"""

import json, os, sys, re

PROJECT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(PROJECT_DIR, "data")
ASSETS_DIR = os.path.join(PROJECT_DIR, "assets")

def load_json(name):
    path = os.path.join(DATA_DIR, name)
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def fail(msg):
    print(f"FAIL: {msg}")
    return False

def ok(msg):
    print(f"PASS: {msg}")
    return True

all_pass = True

# 1. JSON validity
for fname in ["motifs.json", "works.json", "sources.json", "journey.json", "routes.json", "source_audit.json"]:
    try:
        load_json(fname)
        ok(f"{fname} 格式合法")
    except Exception as e:
        all_pass &= fail(f"{fname} 解析失败: {e}")

motifs = load_json("motifs.json")
works = load_json("works.json")
sources = load_json("sources.json")
journey = load_json("journey.json")
routes = load_json("routes.json")

motif_ids = {m["id"] for m in motifs}
source_ids = {s["id"] for s in sources}
work_ids = {w["id"] for w in works}

# 2. works.source_ids exist
for w in works:
    for sid in w.get("source_ids", []):
        if sid not in source_ids:
            all_pass &= fail(f"作品 {w['id']} 引用不存在来源: {sid}")
ok("works.source_ids 全部存在")

# 3. works.motifs exist
for w in works:
    for mid in w.get("motifs", []):
        if mid not in motif_ids:
            all_pass &= fail(f"作品 {w['id']} 引用不存在母题: {mid}")
ok("works.motifs 全部存在")

# 4. routes.work_ids exist
for r in routes:
    for wid in r.get("works", []):
        if wid not in work_ids:
            all_pass &= fail(f"路线 {r['id']} 引用不存在作品: {wid}")
ok("routes.works 全部存在")

# 5. journey.relatedWorks exist
for j in journey:
    for wid in j.get("relatedWorks", []):
        if wid not in work_ids:
            all_pass &= fail(f"旅程 {j['id']} 引用不存在作品: {wid}")
ok("journey.relatedWorks 全部存在")

# 6. SVG files exist
for m in motifs:
    icon_path = os.path.join(ASSETS_DIR, "icons", f"{m['id']}.svg")
    if not os.path.isfile(icon_path):
        all_pass &= fail(f"缺少图标: {icon_path}")
ok("母题图标全部存在")

diag_path = os.path.join(ASSETS_DIR, "diagrams", "letter-route.svg")
if not os.path.isfile(diag_path):
    all_pass &= fail(f"缺少图表: {diag_path}")
ok("diagram SVG 存在")

# 7. Core files exist
for fname in ["index.html", "style.css", "app.js"]:
    if not os.path.isfile(os.path.join(PROJECT_DIR, fname)):
        all_pass &= fail(f"缺少核心文件: {fname}")
ok("核心文件存在")

# 8. No external CDN dependencies
cdn_patterns = [
    r"fonts\.googleapis",
    r"fonts\.gstatic",
    r"cdn\.jsdelivr",
    r"unpkg",
    r"cdnjs",
    r"d3js\.org",
    r"\bd3\b",
]
for fname in ["index.html", "style.css", "app.js"]:
    path = os.path.join(PROJECT_DIR, fname)
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    for pat in cdn_patterns:
        if re.search(pat, content):
            all_pass &= fail(f"{fname} 包含外部 CDN 引用: {pat}")
ok("无外部 CDN 依赖")

print()
if all_pass:
    print("=== 验证结果: PASS ===")
    sys.exit(0)
else:
    print("=== 验证结果: FAIL ===")
    sys.exit(1)
