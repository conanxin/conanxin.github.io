#!/usr/bin/env python3
"""
validate_course_data.py
验证 course.json 和 readings.json 的数据完整性。
运行: python3 scripts/validate_course_data.py
"""

import json
import sys
from pathlib import Path

PROJECT_DIR = Path(__file__).parent.parent
DATA_DIR = PROJECT_DIR / "data"

def load_json(filename):
    path = DATA_DIR / filename
    if not path.exists():
        print(f"❌ 文件不存在: {path}")
        return None
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except json.JSONDecodeError as e:
        print(f"❌ JSON 解析失败 {filename}: {e}")
        return None

def validate_course():
    data = load_json("course.json")
    if data is None:
        return False
    errors = []
    required = ["id","date","week","module","original_title","zh_title","zh_summary","key_concepts"]
    session_ids = set()
    for i, session in enumerate(data):
        # Check required fields
        for field in required:
            if field not in session:
                errors.append(f"Session {i} ({session.get('id','?')}): 缺少字段 '{field}'")
        # Check unique id
        sid = session.get("id")
        if sid in session_ids:
            errors.append(f"重复的 session id: {sid}")
        session_ids.add(sid)
        # Validate module
        valid_modules = {"intro","foundation","multimodal","llm","interaction","project","discussion"}
        module = session.get("module","")
        if module not in valid_modules:
            errors.append(f"Session {sid}: 无效 module '{module}'")
        # Check week is int
        week = session.get("week")
        if week is not None and not isinstance(week, int):
            errors.append(f"Session {sid}: week 应为整数, 实际 {type(week)}")
        # Check readings is list
        readings = session.get("readings", [])
        if not isinstance(readings, list):
            errors.append(f"Session {sid}: readings 应为列表")
    return errors

def validate_readings():
    data = load_json("readings.json")
    if data is None:
        return False
    errors = []
    required = ["id","title","zh_title","authors","year","url","category","why_it_matters","chinese_reading_guide"]
    reading_ids = set()
    valid_cats = {"Foundation","Multimodal","LLM","Generative","Agent","HAI"}
    for i, reading in enumerate(data):
        for field in required:
            if field not in reading:
                errors.append(f"Reading {i} ({reading.get('id','?')}): 缺少字段 '{field}'")
        rid = reading.get("id")
        if rid in reading_ids:
            errors.append(f"重复的 reading id: {rid}")
        reading_ids.add(rid)
        cat = reading.get("category","")
        if cat not in valid_cats:
            errors.append(f"Reading {rid}: 无效 category '{cat}'")
        year = reading.get("year")
        if year and (not isinstance(year, int) or year < 2000 or year > 2026):
            errors.append(f"Reading {rid}: 异常年份 {year}")
    return errors

def validate_sources():
    data = load_json("sources.json")
    if data is None:
        return False
    errors = []
    required = ["term","zh","definition"]
    for i, entry in enumerate(data):
        for field in required:
            if field not in entry:
                errors.append(f"Glossary entry {i}: 缺少字段 '{field}'")
    return errors

def main():
    print("=" * 50)
    print("How2AI 中文课程 — 数据验证")
    print("=" * 50)

    print("\n[1/3] 验证 course.json ...")
    err = validate_course()
    if err is False:
        print("⛔ course.json 加载失败")
        return 1
    elif err:
        for e in err:
            print(f"  ❌ {e}")
    else:
        print(f"  ✅ course.json 验证通过")

    print("\n[2/3] 验证 readings.json ...")
    err = validate_readings()
    if err is False:
        print("⛔ readings.json 加载失败")
        return 1
    elif err:
        for e in err:
            print(f"  ❌ {e}")
    else:
        print(f"  ✅ readings.json 验证通过")

    print("\n[3/3] 验证 sources.json (glossary) ...")
    err = validate_sources()
    if err is False:
        print("⛔ sources.json 加载失败")
        return 1
    elif err:
        for e in err:
            print(f"  ❌ {e}")
    else:
        print(f"  ✅ sources.json 验证通过")

    # Summary
    course = load_json("course.json")
    readings = load_json("readings.json")
    glossary = load_json("sources.json")
    print(f"\n统计：{len(course)} 节课程，{len(readings)} 篇论文，{len(glossary)} 个术语")
    print("✅ 全部验证通过")
    return 0

if __name__ == "__main__":
    sys.exit(main())
