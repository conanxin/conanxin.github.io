#!/usr/bin/env python3
"""
validate_dufu_data.py
Validates the Du Fu route JSON data files.
Exits 0 if all checks pass, non-zero otherwise.
"""
import json
import os
import sys

BASE = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(os.path.dirname(BASE), 'data')

def load_json(filename):
    path = os.path.join(DATA_DIR, filename)
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f), None
    except json.JSONDecodeError as e:
        return None, f"JSON parse error: {e}"
    except FileNotFoundError:
        return None, f"File not found: {filename}"

def main():
    errors = []
    warnings = []
    stats = {}
    # Data references shared across cross-check section
    locs_data = None
    routes_data = None
    poems_data = None
    timeline_data = None

    # Check locations.json
    data, err = load_json('locations.json')
    if err:
        errors.append(err)
    else:
        locs_data = data
        stats['locations'] = len(data)
        if len(data) < 17:
            errors.append(f"locations.json: expected >= 17 locations, got {len(data)}")
        required_loc_fields = ['id', 'name', 'modern', 'siteType']
        optional_loc_fields = ['theme', 'event', 'poems', 'quote',
                               'articleMeaning', 'travelTip', 'routeGroup']
        for i, loc in enumerate(data):
            missing_req = [f for f in required_loc_fields if f not in loc]
            if missing_req:
                errors.append(f"locations.json[{i}] '{loc.get('id','?')}': missing required field(s): {missing_req}")
            missing_opt = [f for f in optional_loc_fields if f not in loc]
            if missing_opt:
                warnings.append(f"locations.json[{i}] '{loc.get('id','?')}': missing optional field(s): {missing_opt} — these are OK but recommended")
        # Check duplicate ids
        ids = [loc['id'] for loc in data]
        if len(ids) != len(set(ids)):
            dupes = [x for x in ids if ids.count(x) > 1]
            errors.append(f"locations.json: duplicate ids found: {set(dupes)}")

    # Check routes.json
    data, err = load_json('routes.json')
    if err:
        errors.append(err)
    else:
        routes_data = data
        stats['routes'] = True
        if 'routes' not in data:
            errors.append("routes.json: missing 'routes' key")
        else:
            routes = data['routes']
            if '7day' not in routes:
                errors.append("routes.json: missing 'routes.7day'")
            else:
                stats['7day'] = len(routes['7day'])
                if len(routes['7day']) != 7:
                    errors.append(f"routes.json: 7day should have 7 days, got {len(routes['7day'])}")
                for i, day in enumerate(routes['7day']):
                    for field in ['day', 'title', 'theme', 'places', 'stay', 'transportTip', 'locs']:
                        if field not in day:
                            warnings.append(f"routes.json: 7day[{i}] missing '{field}' — recommended for full functionality")
                    missing_rec = [f for f in ['poems', 'tip', 'liveQuestion'] if f not in day]
                    if missing_rec:
                        warnings.append(f"routes.json: 7day[{i}] missing optional: {missing_rec}")
            if '12day' not in routes:
                errors.append("routes.json: missing 'routes.12day'")
            else:
                stats['12day'] = len(routes['12day'])
                if len(routes['12day']) != 12:
                    errors.append(f"routes.json: 12day should have 12 days, got {len(routes['12day'])}")
                for i, day in enumerate(routes['12day']):
                    for field in ['day', 'title', 'theme', 'places', 'stay', 'transportTip', 'locs']:
                        if field not in day:
                            warnings.append(f"routes.json: 12day[{i}] missing '{field}' — recommended for full functionality")
            if 'thematic' not in routes:
                errors.append("routes.json: missing 'routes.thematic'")
            else:
                stats['thematic'] = len(routes['thematic'])
                if len(routes['thematic']) < 4:
                    errors.append(f"routes.json: thematic should have >= 4 routes, got {len(routes['thematic'])}")
        if 'meta' not in data:
            errors.append("routes.json: missing 'meta' key")
        else:
            stats['meta'] = list(data['meta'].keys())

    # Check poems.json
    data, err = load_json('poems.json')
    if err:
        errors.append(err)
    else:
        poems_data = data
        stats['poems'] = len(data)
        if len(data) < 9:
            errors.append(f"poems.json: expected >= 9 poems, got {len(data)}")
        required_poem_fields = ['title', 'locationId']
        optional_poem_fields = ['locationName', 'period', 'theme', 'quote', 'note']
        for i, poem in enumerate(data):
            for field in required_poem_fields:
                if field not in poem:
                    errors.append(f"poems.json[{i}]: missing required field '{field}'")
            missing_opt = [f for f in optional_poem_fields if f not in poem]
            if missing_opt:
                warnings.append(f"poems.json[{i}] '{poem.get('title','?')}': missing optional field(s): {missing_opt} — these are OK but recommended")

    # Check timeline.json
    data, err = load_json('timeline.json')
    if err:
        errors.append(err)
    else:
        timeline_data = data
        stats['timeline'] = len(data)
        if len(data) < 8:
            errors.append(f"timeline.json: expected >= 8 nodes, got {len(data)}")
        required_tl_fields = ['year', 'title', 'event', 'whyImportant']
        for i, node in enumerate(data):
            for field in required_tl_fields:
                if field not in node:
                    errors.append(f"timeline.json[{i}]: missing required field '{field}'")

    # Cross-check: poem.locationId must exist in locations.json (data already loaded)
    if locs_data and poems_data:
        loc_ids = {loc['id'] for loc in locs_data}
        for poem in poems_data:
            if poem.get('locationId') and poem['locationId'] not in loc_ids:
                errors.append(f"poems.json: poem '{poem.get('title','?')}' references unknown locationId '{poem['locationId']}'")

    # Print CROSS_REFERENCE_CHECK section
    import re as _re
    xref_stats = {}

    # poem.locationId valid count
    if locs_data and poems_data:
        loc_ids = {loc['id'] for loc in locs_data}
        valid_poem_refs = sum(
            1 for p in poems_data
            if p.get('locationId') and p['locationId'] in loc_ids
        )
        xref_stats['poem.locationId.valid'] = valid_poem_refs
        xref_stats['poem.locationId.total'] = len(poems_data)

    # route location reference check
    if routes_data and locs_data:
        loc_ids = {loc['id'] for loc in locs_data}
        all_route_lids = []
        for day in routes_data.get('routes', {}).get('7day', []):
            all_route_lids.extend(day.get('locs', []))
        for day in routes_data.get('routes', {}).get('12day', []):
            all_route_lids.extend(day.get('locs', []))
        for t in routes_data.get('routes', {}).get('thematic', []):
            all_route_lids.extend(t.get('locs', []))
        for city_key, city_val in routes_data.get('dualCity', {}).items():
            for place in city_val.get('places', []):
                lid = place.get('loc')
                if lid:
                    all_route_lids.append(lid)
        valid_route_refs = sum(1 for l in all_route_lids if l in loc_ids)
        xref_stats['route.locationRef.total'] = len(all_route_lids)
        xref_stats['route.locationRef.valid'] = valid_route_refs
        xref_stats['route.locationRef.note'] = 'OK' if all_route_lids else 'SKIPPED — no structured locs'
    else:
        xref_stats['route.locationRef.note'] = 'SKIPPED — could not load data'

    # timeline poem title match (WARNING only)
    if timeline_data and poems_data:
        poem_titles = {p['title'] for p in poems_data}
        matched = 0
        unmatched = 0
        for node in timeline_data:
            raw = node.get('poems', '')
            parts = _re.split(r'[》,]', raw)
            titles = []
            for p in parts:
                t = p.strip()
                if not t:
                    continue
                if not t.endswith('》'):
                    t = t + '》'
                titles.append(t)
            for t in titles:
                t_clean = t.rstrip('》').strip()
                if any(t_clean in tp.rstrip('》').strip() for tp in poem_titles) or t in poem_titles:
                    matched += 1
                else:
                    unmatched += 1
        xref_stats['timeline.poemMatch.total'] = matched + unmatched
        xref_stats['timeline.poemMatch.matched'] = matched
        xref_stats['timeline.poemMatch.unmatched'] = unmatched
    else:
        xref_stats['timeline.poemMatch.unmatched'] = 'N/A'

    # Print report
    print("=" * 50)
    print("CROSS_REFERENCE_CHECK:")
    print(f"  locations.count             : {stats.get('locations', 'N/A')}")
    print(f"  poems.count                : {stats.get('poems', 'N/A')}")
    print(f"  routes.7day.count          : {stats.get('7day', 'N/A')}")
    print(f"  routes.12day.count         : {stats.get('12day', 'N/A')}")
    print(f"  routes.thematic.count      : {stats.get('thematic', 'N/A')}")
    print(f"  timeline.count             : {stats.get('timeline', 'N/A')}")
    print()
    print(f"  poem.locationId.total      : {xref_stats.get('poem.locationId.total', 'N/A')}")
    print(f"  poem.locationId.valid      : {xref_stats.get('poem.locationId.valid', 'N/A')}")
    print(f"  poem.locationId.invalid   : {max(0, xref_stats.get('poem.locationId.total', 0) - xref_stats.get('poem.locationId.valid', 0))}")
    print()
    print(f"  route.locationRef.total    : {xref_stats.get('route.locationRef.total', 'N/A')}")
    print(f"  route.locationRef.valid    : {xref_stats.get('route.locationRef.valid', 'N/A')}")
    print(f"  route.locationRef.note     : {xref_stats.get('route.locationRef.note', 'N/A')}")
    print()
    print(f"  timeline.poemMatch.total   : {xref_stats.get('timeline.poemMatch.total', 'N/A')}")
    print(f"  timeline.poemMatch.matched: {xref_stats.get('timeline.poemMatch.matched', 'N/A')}")
    print(f"  timeline.poemMatch.unmatchd: {xref_stats.get('timeline.poemMatch.unmatched', 'N/A')} (WARNING — display field)")
    print("=" * 50)
    print("Du Fu Data Validation Report")
    print("=" * 50)
    print(f"  locations : {stats.get('locations', 'N/A')} records")
    print(f"  routes    : {stats.get('routes', 'N/A')}")
    if '7day' in stats:
        print(f"    7day    : {stats['7day']} days")
    if '12day' in stats:
        print(f"    12day   : {stats['12day']} days")
    if 'thematic' in stats:
        print(f"    thematic: {stats['thematic']} routes")
    if 'meta' in stats:
        print(f"    meta    : {stats['meta']}")
    print(f"  poems     : {stats.get('poems', 'N/A')} records")
    print(f"  timeline  : {stats.get('timeline', 'N/A')} nodes")
    print("-" * 50)

    if warnings:
        print("WARN — Recommended fields missing (not fatal):")
        for w in warnings:
            print(f"  ? {w}")
        print("-" * 50)

    if errors:
        print("FAIL — Errors found:")
        for e in errors:
            print(f"  ! {e}")
        print("=" * 50)
        sys.exit(1)
    else:
        print("PASS — All checks passed.")
        print("=" * 50)
        sys.exit(0)

if __name__ == '__main__':
    main()
