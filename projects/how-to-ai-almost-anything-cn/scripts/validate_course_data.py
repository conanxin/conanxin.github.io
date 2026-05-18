#!/usr/bin/env python3
"""
validate_course_data.py — Phase 2
验证 Phase 2 数据结构：
  course.json, readings.json, official_reading_map.json,
  glossary.json, sources.json, raw_schedule_links.json
运行: python3 scripts/validate_course_data.py
"""

import json, sys
from pathlib import Path

PROJECT_DIR = Path(__file__).parent.parent
DATA_DIR = PROJECT_DIR / "data"

def load_json(filename):
    path = DATA_DIR / filename
    if not path.exists():
        print(f"  ❌ 文件不存在: {path}")
        return None
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except json.JSONDecodeError as e:
        print(f"  ❌ JSON 解析失败 {filename}: {e}")
        return None

# ─── course.json ────────────────────────────────────────────────
def validate_course():
    data = load_json("course.json")
    if data is None:
        return False
    errors = []
    required = ["id","date","week","module","original_title","zh_title","zh_summary","key_concepts"]
    session_ids = set()
    valid_modules = {
        "mod0-intro","mod1-foundations","mod2-multimodal",
        "mod3-llm","mod4-interactive","special"
    }
    for i, s in enumerate(data):
        sid = s.get("id","?")
        for f in required:
            if f not in s:
                errors.append(f"  ❌ Session {sid}: 缺少字段 '{f}'")
        if sid in session_ids:
            errors.append(f"  ❌ 重复 session id: {sid}")
        session_ids.add(sid)
        module = s.get("module","")
        if module not in valid_modules:
            errors.append(f"  ❌ Session {sid}: 无效 module '{module}'")
        week = s.get("week")
        if week is not None and not isinstance(week, int):
            errors.append(f"  ❌ Session {sid}: week 应为整数, 实际 {type(week)}")
        readings = s.get("readings", [])
        if not isinstance(readings, list):
            errors.append(f"  ❌ Session {sid}: readings 应为列表")
    if not errors:
        print(f"  ✅ course.json 验证通过 ({len(data)} 节)")
    return errors

# ─── readings.json ──────────────────────────────────────────────
def validate_readings():
    data = load_json("readings.json")
    if data is None:
        return False
    errors = []
    required = ["id","title","zh_title","authors","year","url","category","why_it_matters","chinese_reading_guide"]
    reading_ids = set()
    valid_cats = {"Foundation","Multimodal","LLM","Generative","Agent","HAI","Supplementary"}
    for r in data:
        rid = r.get("id","?")
        for f in required:
            if f not in r:
                errors.append(f"  ❌ Reading {rid}: 缺少字段 '{f}'")
        if rid in reading_ids:
            errors.append(f"  ❌ 重复 reading id: {rid}")
        reading_ids.add(rid)
        cat = r.get("category","")
        if cat not in valid_cats:
            errors.append(f"  ❌ Reading {rid}: 无效 category '{cat}'")
        year = r.get("year")
        if year and (not isinstance(year, int) or year < 2000 or year > 2026):
            errors.append(f"  ❌ Reading {rid}: 异常年份 {year}")
    if not errors:
        print(f"  ✅ readings.json 验证通过 ({len(data)} 篇精选导读)")
    return errors

# ─── official_reading_map.json ─────────────────────────────────
def validate_official_readings():
    data = load_json("official_reading_map.json")
    if data is None:
        return False
    errors = []
    required = ["id","original_title","type","reading_role"]
    reading_ids = set()
    valid_roles = {"core_reading","discussion_reading","project_reference","supplementary","tool_resource"}
    valid_types = {"paper","video","blog","colab","book","github","website"}
    for r in data:
        rid = r.get("id","?")
        for f in required:
            if f not in r:
                errors.append(f"  ❌ OfficialReading {rid}: 缺少字段 '{f}'")
        if rid in reading_ids:
            errors.append(f"  ❌ 重复 official reading id: {rid}")
        reading_ids.add(rid)
        role = r.get("reading_role","")
        if role and role not in valid_roles:
            errors.append(f"  ❌ OfficialReading {rid}: 无效 reading_role '{role}'")
        typ = r.get("type","")
        if typ and typ not in valid_types:
            errors.append(f"  ❌ OfficialReading {rid}: 无效 type '{typ}'")
        # appears_in_sessions should be a list
        sessions = r.get("appears_in_sessions")
        if sessions is not None and not isinstance(sessions, list):
            errors.append(f"  ❌ OfficialReading {rid}: appears_in_sessions 应为列表")
    if not errors:
        print(f"  ✅ official_reading_map.json 验证通过 ({len(data)} 篇官方阅读)")
    return errors

# ─── glossary.json ──────────────────────────────────────────────
def validate_glossary():
    data = load_json("glossary.json")
    if data is None:
        return False
    errors = []
    required = ["id","term_en","term_zh","definition_zh"]
    term_ids = set()
    for e in data:
        eid = e.get("id","?")
        for f in required:
            if f not in e:
                errors.append(f"  ❌ Glossary {eid}: 缺少字段 '{f}'")
        if eid in term_ids:
            errors.append(f"  ❌ 重复 glossary id: {eid}")
        term_ids.add(eid)
    if not errors:
        print(f"  ✅ glossary.json 验证通过 ({len(data)} 条术语)")
    return errors

# ─── sources.json ───────────────────────────────────────────────
def validate_sources():
    data = load_json("sources.json")
    if data is None:
        return False
    errors = []
    required = ["id","title","url","type"]
    src_ids = set()
    for e in data:
        eid = e.get("id","?")
        for f in required:
            if f not in e:
                errors.append(f"  ❌ Source {eid}: 缺少字段 '{f}'")
        if eid in src_ids:
            errors.append(f"  ❌ 重复 source id: {eid}")
        src_ids.add(eid)
    if not errors:
        print(f"  ✅ sources.json 验证通过 ({len(data)} 个来源)")
    return errors

# ─── raw_schedule_links.json ───────────────────────────────────
def validate_raw_links():
    data = load_json("raw_schedule_links.json")
    if data is None:
        return False
    errors = []
    required = ["url","link_text","session_title","link_type"]
    valid_types = {"slide","video","paper","blog","colab","github","book","website","assignment","external_resource"}
    for i, l in enumerate(data):
        for f in required:
            if f not in l:
                errors.append(f"  ❌ Link {i}: 缺少字段 '{f}'")
        lt = l.get("link_type","")
        if lt and lt not in valid_types:
            errors.append(f"  ❌ Link {i}: 无效 link_type '{lt}'")
    if not errors:
        slides = sum(1 for l in data if l.get("link_type")=="slide")
        videos = sum(1 for l in data if l.get("link_type")=="video")
        papers = sum(1 for l in data if l.get("link_type")=="paper")
        print(f"  ✅ raw_schedule_links.json 验证通过 ({len(data)} 个链接: {slides} slides / {videos} videos / {papers} papers)")
    return errors

# ─── lecture_notes.json ─────────────────────────────────────────
def validate_lecture_notes():
    data = load_json("lecture_notes.json")
    if data is None:
        return False
    errors = []
    required = ["session_id", "note_status", "one_sentence", "core_question",
                 "why_it_matters", "concepts", "lecture_guide",
                 "reflection_questions", "mini_assignment"]
    course = load_json("course.json")
    course_ids = {s["id"] for s in course} if course else set()
    note_ids = set()
    for n in data:
        nid = n.get("session_id", "?")
        for f in required:
            if f not in n:
                errors.append(f"  ❌ LectureNote {nid}: 缺少字段 '{f}'")
        if nid in note_ids:
            errors.append(f"  ❌ 重复 session_id: {nid}")
        note_ids.add(nid)
        if nid not in course_ids:
            errors.append(f"  ⚠️  LectureNote {nid}: session_id 在 course.json 中未找到")
        concepts = n.get("concepts", [])
        if not isinstance(concepts, list) or len(concepts) < 1:
            errors.append(f"  ❌ LectureNote {nid}: concepts 至少需要 1 个")
        refls = n.get("reflection_questions", [])
        if not isinstance(refls, list) or len(refls) < 1:
            errors.append(f"  ❌ LectureNote {nid}: reflection_questions 至少需要 1 个")
        if not n.get("mini_assignment"):
            errors.append(f"  ❌ LectureNote {nid}: mini_assignment 不能为空")
        projects = n.get("project_ideas", [])
        if not isinstance(projects, list) or len(projects) < 1:
            errors.append(f"  ❌ LectureNote {nid}: project_ideas 至少需要 1 个")
    if not errors:
        pilot = sum(1 for n in data if n.get("note_status") == "pilot")
        print(f"  ✅ lecture_notes.json 验证通过 ({len(data)} 条讲义, 其中 {pilot} 条 pilot)")
    return errors

# ─── main ──────────────────────────────────────────────────────
def main():
    print("=" * 54)
    print("How2AI 中文课程 — Phase 7A 数据验证")
    print("=" * 54)

    all_ok = True

    checks = [
        ("[1/8] course.json ...", validate_course),
        ("[2/8] readings.json ...", validate_readings),
        ("[3/8] official_reading_map.json ...", validate_official_readings),
        ("[4/8] glossary.json ...", validate_glossary),
        ("[5/8] sources.json ...", validate_sources),
        ("[6/8] raw_schedule_links.json ...", validate_raw_links),
        ("[7/8] lecture_notes.json ...", validate_lecture_notes),
    ]

    for label, fn in checks:
        print(f"\n{label}")
        err = fn()
        if err is False:
            print("  ⛔ 文件加载失败")
            all_ok = False
        elif err:
            for e in err[:10]:
                print(f"  {e}")
            if len(err) > 10:
                print(f"  ... 还有 {len(err)-10} 个错误")
            all_ok = False

    print("\n" + "=" * 54)
    if all_ok:
        c = load_json("course.json") or []
        r = load_json("readings.json") or []
        o = load_json("official_reading_map.json") or []
        g = load_json("glossary.json") or []
        s = load_json("sources.json") or []
        lk = load_json("raw_schedule_links.json") or []
        ln = load_json("lecture_notes.json") or []
        print(f"✅ 全部验证通过")
        print(f"   Sessions: {len(c)} | Curated readings: {len(r)}")
        print(f"   Official readings: {len(o)} | Glossary: {len(g)}")
        print(f"   Sources: {len(s)} | Raw links: {len(lk)}")
        print(f"   Lecture notes: {len(ln)} (pilot: {sum(1 for n in ln if n.get('note_status')=='pilot')})")
        return 0
    else:
        print("⛔ 存在验证错误，请修复后重试")
        return 1

if __name__ == "__main__":
    sys.exit(main())
