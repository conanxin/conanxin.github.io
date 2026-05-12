#!/usr/bin/env python3
"""
audit_dufu_crossrefs.py
Cross-reference audit for dufu-luanli-route-page data files.
Outputs structured report: CROSS_REFERENCE_CHECK section with counts.
Exit 0 = PASS (no FATAL errors), exit 1 = FAIL (missing required refs).
WARNs do not affect exit code.
"""
import json
import os
import sys

BASE = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(os.path.dirname(BASE), 'data')

ALLOWED_SITE_TYPE_PARTS = {
    "成熟景区", "文学寻访点", "历史对应点",
    "考证提示点", "古道寻访"
}

def load_json(name):
    path = os.path.join(DATA_DIR, name)
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f), None
    except json.JSONDecodeError as e:
        return None, f"JSON parse error: {e}"
    except FileNotFoundError:
        return None, f"File not found: {name}"

def main():
    errors = []
    warnings = []
    counts = {}

    # Load all files
    locs_data, err = load_json("locations.json")
    routes_data, err = load_json("routes.json")
    poems_data, err = load_json("poems.json")
    timeline_data, err = load_json("timeline.json")

    if any(x is None for x in [locs_data, routes_data, poems_data, timeline_data]):
        print("FAIL — Could not load one or more data files.")
        sys.exit(1)

    loc_ids = {loc["id"] for loc in locs_data}
    poem_titles = {p["title"] for p in poems_data}

    # ============================================================
    # 1. poem.locationId → locations.id
    # ============================================================
    poem_loc_errors = []
    for p in poems_data:
        if p.get("locationId") and p["locationId"] not in loc_ids:
            poem_loc_errors.append(
                f"poem '{p.get('title','?')}' references unknown locationId '{p['locationId']}'"
            )
    counts["poem.locationId.total"] = len(poems_data)
    counts["poem.locationId.valid"] = len(poems_data) - len(poem_loc_errors)
    counts["poem.locationId.invalid"] = len(poem_loc_errors)
    if poem_loc_errors:
        errors.extend([f"[poem.locationId] {e}" for e in poem_loc_errors])

    # ============================================================
    # 2. Route location references (locs arrays)
    # ============================================================
    route_loc_errors = []
    route_locs_checked = []

    # Helper to collect all locs from a list of items
    def check_locs(items, label):
        for i, item in enumerate(items):
            locs_list = item.get("locs", [])
            route_locs_checked.extend(locs_list)
            for lid in locs_list:
                if lid not in loc_ids:
                    route_loc_errors.append(f"{label}[{i}] locs: '{lid}' not in locations")

    if "routes" in routes_data:
        check_locs(routes_data["routes"].get("7day", []), "7day")
        check_locs(routes_data["routes"].get("12day", []), "12day")
        check_locs(routes_data["routes"].get("thematic", []), "thematic")
        for city_key, city_val in routes_data.get("dualCity", {}).items():
            for j, place in enumerate(city_val.get("places", [])):
                lid = place.get("loc")
                if lid:
                    route_locs_checked.append(lid)
                    if lid not in loc_ids:
                        route_loc_errors.append(
                            f"dualCity.{city_key}.places[{j}] loc: '{lid}' not in locations"
                        )

    valid_route_locs = [l for l in route_locs_checked if l in loc_ids]
    counts["route.locationRef.total"] = len(route_locs_checked)
    counts["route.locationRef.valid"] = len(valid_route_locs)
    counts["route.locationRef.invalid"] = len(route_loc_errors)
    if route_loc_errors:
        errors.extend([f"[route.locationRef] {e}" for e in route_loc_errors])

    # Warn if routes have no structured locs (not an error, just info)
    if not route_locs_checked:
        warnings.append("routes.json: no structured locs arrays found — route location reference check SKIPPED")

    # ============================================================
    # 3. Timeline poem title matching (WARNING only)
    # ============================================================
    tl_poem_warnings = []
    tl_poem_matched = 0
    tl_poem_unmatched = 0

    for node in timeline_data:
        raw = node.get("poems", "")
        # Split by both '》' and ',' to handle various formats
        import re
        parts = re.split(r'[》,]', raw)
        titles = [p.strip() + "》" if not p.strip().endswith("》") else p.strip()
                  for p in parts if p.strip()]
        # Clean up — normalize trailing 》
        cleaned = []
        for t in titles:
            t = t.strip()
            if not t.endswith("》"):
                t = t + "》"
            if t not in poem_titles:
                # Try without trailing 》
                t2 = t.rstrip("》").rstrip(" ")
                if t2 not in [pt.rstrip("》") for pt in poem_titles]:
                    tl_poem_unmatched += 1
                    tl_poem_warnings.append(
                        f"timeline '{node.get('title','?')}' poem title '{t}' not in poems.json"
                    )
                else:
                    tl_poem_matched += 1
            else:
                tl_poem_matched += 1

    counts["timeline.poemMatch.total"] = tl_poem_matched + tl_poem_unmatched
    counts["timeline.poemMatch.matched"] = tl_poem_matched
    counts["timeline.poemMatch.unmatched"] = tl_poem_unmatched
    warnings.extend([f"[timeline.poems] {w}" for w in tl_poem_warnings])

    # ============================================================
    # 4. siteType values (WARNING only)
    # ============================================================
    site_type_warnings = []
    for loc in locs_data:
        st = loc.get("siteType", "")
        # Split on both '、' and '+' for combination types
        import re
        parts = re.split(r'[、+]', st)
        parts = [p.strip() for p in parts if p.strip()]
        for part in parts:
            if part and part not in ALLOWED_SITE_TYPE_PARTS:
                site_type_warnings.append(
                    f"location '{loc['id']}' siteType part '{part}' not in allowed list"
                )
    warnings.extend([f"[siteType] {w}" for w in site_type_warnings])

    # ============================================================
    # 5. routeGroup empty check (WARNING only)
    # ============================================================
    for loc in locs_data:
        if not loc.get("routeGroup"):
            warnings.append(f"location '{loc['id']}' has empty routeGroup")

    # ============================================================
    # 6. Duplicate location ids
    # ============================================================
    ids = [loc["id"] for loc in locs_data]
    dupes = [x for x in ids if ids.count(x) > 1]
    if dupes:
        errors.append(f"duplicate location ids: {set(dupes)}")

    # ============================================================
    # Print structured report
    # ============================================================
    print("=" * 54)
    print("CROSS-REFERENCE AUDIT — Du Fu Route Data")
    print("=" * 54)
    print()
    print("CROSS_REFERENCE_CHECK:")
    print(f"  locations.count             : {len(locs_data)}")
    print(f"  poems.count                  : {len(poems_data)}")
    print(f"  routes.7day.count            : {len(routes_data.get('routes',{}).get('7day',[]))}")
    print(f"  routes.12day.count           : {len(routes_data.get('routes',{}).get('12day',[]))}")
    print(f"  routes.thematic.count        : {len(routes_data.get('routes',{}).get('thematic',[]))}")
    print(f"  timeline.count               : {len(timeline_data)}")
    print()
    print(f"  poem.locationId.total        : {counts.get('poem.locationId.total','N/A')}")
    print(f"  poem.locationId.valid        : {counts.get('poem.locationId.valid','N/A')}")
    print(f"  poem.locationId.invalid      : {counts.get('poem.locationId.invalid','N/A')}")
    print()
    print(f"  route.locationRef.total      : {counts.get('route.locationRef.total','N/A')}")
    print(f"  route.locationRef.valid      : {counts.get('route.locationRef.valid','N/A')}")
    print(f"  route.locationRef.invalid   : {counts.get('route.locationRef.invalid','N/A')}")
    if not route_locs_checked:
        print(f"  route.locationRef.note      : SKIPPED — no structured locs arrays found")
    print()
    print(f"  timeline.poemMatch.total     : {counts.get('timeline.poemMatch.total','N/A')}")
    print(f"  timeline.poemMatch.matched   : {counts.get('timeline.poemMatch.matched','N/A')}")
    print(f"  timeline.poemMatch.unmatched : {counts.get('timeline.poemMatch.unmatched','N/A')} (WARNING — display field)")
    print()
    print(f"  siteType.invalid_parts       : {len(site_type_warnings)} (WARNING)")
    print(f"  routeGroup.empty             : {sum(1 for loc in locs_data if not loc.get('routeGroup'))} (WARNING)")
    print(f"  duplicate_ids                : {len(dupes)}")
    print()
    print("-" * 54)

    if warnings:
        print("WARNINGS:")
        for w in warnings:
            print(f"  ? {w}")
        print("-" * 54)

    if errors:
        print("ERRORS:")
        for e in errors:
            print(f"  ! {e}")
        print("=" * 54)
        print("RESULT: FAIL")
        sys.exit(1)
    else:
        print("RESULT: PASS — no fatal cross-reference errors")
        print("=" * 54)
        sys.exit(0)

if __name__ == "__main__":
    main()
