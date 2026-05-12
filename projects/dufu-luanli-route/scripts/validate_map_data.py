#!/usr/bin/env python3
"""
validate_map_data.py — Phase 6A Map Data Validation
Du Fu Luánlí Route Interactive Page

Validates:
  data/map_points.json   — WGS84 candidate map points
  data/route_segments.geojson — schematic route LineString features

Requires Python standard library only.
"""

import json
import sys
import os
from pathlib import Path

# ─── Constants ────────────────────────────────────────────────────────────────

SCRIPT_DIR = Path(__file__).parent
SOURCE_DIR = SCRIPT_DIR.parent

LOCATIONS_PATH = SOURCE_DIR / "data" / "locations.json"
MAP_POINTS_PATH = SOURCE_DIR / "data" / "map_points.json"
ROUTE_SEGMENTS_PATH = SOURCE_DIR / "data" / "route_segments.geojson"

ALLOWED_ACCURACY = {"city", "district", "scenic", "approximate", "disputed"}
ALLOWED_CERTAINTY = {"schematic", "approximate", "disputed"}
REQUIRED_MAP_POINT_FIELDS = [
    "id", "locationId", "name", "modern",
    "lat", "lng", "accuracy", "stage", "siteType", "note"
]

# ─── Helpers ─────────────────────────────────────────────────────────────────

errors: list[str] = []
warnings: list[str] = []


def fatal(msg: str):
    errors.append(f"FATAL: {msg}")


def warn(msg: str):
    warnings.append(f"WARNING: {msg}")


def load_json(path: Path) -> dict | list | None:
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        fatal(f"File not found: {path}")
        return None
    except json.JSONDecodeError as e:
        fatal(f"JSON parse error in {path}: {e}")
        return None


# ─── Load reference data ───────────────────────────────────────────────────────

locations = {}
mp_data = load_json(LOCATIONS_PATH)
if mp_data:
    for loc in mp_data:
        locations[loc["id"]] = loc

map_points = load_json(MAP_POINTS_PATH)
route_data = load_json(ROUTE_SEGMENTS_PATH)

# ─── 1. map_points.json ───────────────────────────────────────────────────────

map_point_ids: set[str] = set()
accuracy_dist: dict[str, int] = {}
stage_dist: dict[str, int] = {}

if map_points is None:
    pass  # already fatal'd
elif not isinstance(map_points, list):
    fatal("map_points.json must be a JSON array")
elif len(map_points) == 0:
    fatal("map_points.json is an empty array")
else:
    for idx, pt in enumerate(map_points):
        pid = pt.get("id", "")

        # Required fields
        for field in REQUIRED_MAP_POINT_FIELDS:
            if field not in pt:
                fatal(f"map_points[{idx}]: missing required field '{field}' (id={pid!r})")

        # id uniqueness
        if pid:
            if pid in map_point_ids:
                fatal(f"map_points: duplicate id {pid!r}")
            map_point_ids.add(pid)

        # locationId reference
        loc_id = pt.get("locationId", "")
        if loc_id and loc_id not in locations:
            fatal(f"map_points[{idx}]: locationId {loc_id!r} not found in locations.json")

        # lat/lng range
        lat = pt.get("lat")
        lng = pt.get("lng")
        if not isinstance(lat, (int, float)):
            fatal(f"map_points[{idx}]: lat must be numeric (got {type(lat).__name__})")
        elif not (-90 <= lat <= 90):
            fatal(f"map_points[{idx}]: lat {lat} out of range [-90, 90]")
        if not isinstance(lng, (int, float)):
            fatal(f"map_points[{idx}]: lng must be numeric (got {type(lng).__name__})")
        elif not (-180 <= lng <= 180):
            fatal(f"map_points[{idx}]: lng {lng} out of range [-180, 180]")

        # accuracy enum
        acc = pt.get("accuracy", "")
        if acc not in ALLOWED_ACCURACY:
            fatal(f"map_points[{idx}]: accuracy {acc!r} not in {ALLOWED_ACCURACY}")

        # siteType array
        st = pt.get("siteType")
        if not isinstance(st, list):
            fatal(f"map_points[{idx}]: siteType must be an array")

        # name non-empty
        if not pt.get("name", "").strip():
            fatal(f"map_points[{idx}]: name is empty")

        # note non-empty
        if not pt.get("note", "").strip():
            warn(f"map_points[{idx}] ({pid}): note is empty — should explain coordinate provenance")

        # accumulate distributions
        if acc in accuracy_dist:
            accuracy_dist[acc] += 1
        else:
            accuracy_dist[acc] = 1

        stage = pt.get("stage", "unknown")
        stage_dist[stage] = stage_dist.get(stage, 0) + 1

# ─── 2. route_segments.geojson ────────────────────────────────────────────────

seg_count = 0
if route_data is None:
    pass  # already fatal'd
elif route_data.get("type") != "FeatureCollection":
    fatal("route_segments.geojson: top-level type must be 'FeatureCollection'")
elif not isinstance(route_data.get("features"), list):
    fatal("route_segments.geojson: 'features' must be an array")
else:
    for fidx, feat in enumerate(route_data["features"]):
        ftype = feat.get("type")
        if ftype != "Feature":
            fatal(f"features[{fidx}]: type must be 'Feature' (got {ftype!r})")

        props = feat.get("properties", {})
        seg_id = props.get("id", f"feature-{fidx}")

        # from/to references
        from_id = props.get("from", "")
        to_id = props.get("to", "")
        if from_id and from_id not in map_point_ids:
            fatal(f"features[{fidx}] ({seg_id}): 'from' id {from_id!r} not found in map_points")
        if to_id and to_id not in map_point_ids:
            fatal(f"features[{fidx}] ({seg_id}): 'to' id {to_id!r} not found in map_points")

        # certainty enum
        cert = props.get("certainty", "")
        if cert not in ALLOWED_CERTAINTY:
            fatal(f"features[{fidx}] ({seg_id}): certainty {cert!r} not in {ALLOWED_CERTAINTY}")

        # geometry
        geom = feat.get("geometry", {})
        gtype = geom.get("type")
        if gtype != "LineString":
            fatal(f"features[{fidx}] ({seg_id}): geometry.type must be 'LineString' (got {gtype!r})")

        coords = geom.get("coordinates", [])
        if not isinstance(coords, list) or len(coords) < 2:
            fatal(f"features[{fidx}] ({seg_id}): LineString must have at least 2 coordinate pairs")

        for cidx, coord in enumerate(coords):
            if not isinstance(coord, list) or len(coord) < 2:
                fatal(f"features[{fidx}] ({seg_id}): coordinates[{cidx}] must be [lng, lat]")
            lng_c, lat_c = coord[0], coord[1]
            if not isinstance(lng_c, (int, float)):
                fatal(f"features[{fidx}] ({seg_id}): coordinates[{cidx}][0] (lng) must be numeric")
            if not isinstance(lat_c, (int, float)):
                fatal(f"features[{fidx}] ({seg_id}): coordinates[{cidx}][1] (lat) must be numeric")
            if not (-180 <= lng_c <= 180):
                fatal(f"features[{fidx}] ({seg_id}): coordinates[{cidx}][0] lng {lng_c} out of range")
            if not (-90 <= lat_c <= 90):
                fatal(f"features[{fidx}] ({seg_id}): coordinates[{cidx}][1] lat {lat_c} out of range")

        seg_count += 1

# ─── 3. Cross-reference summary ───────────────────────────────────────────────

orphan_from = []
orphan_to = []
# re-check from/to against loaded map_points (already done above, but collect stats)
# Already validated above, nothing to add here.

# ─── Output ───────────────────────────────────────────────────────────────────

print("=" * 60)
print("MAP DATA VALIDATION REPORT — Phase 6A")
print("=" * 60)
print()

print(f"map_points.json   : {MAP_POINTS_PATH}")
print(f"locations.json    : {LOCATIONS_PATH}  (reference only)")
print(f"route_segments    : {ROUTE_SEGMENTS_PATH}")
print()

if map_points is not None:
    print(f"MAP POINTS COUNT  : {len(map_points)}")
if route_data is not None:
    print(f"ROUTE SEGMENTS    : {seg_count}")
print()

print("ACCURACY DISTRIBUTION:")
for k, v in sorted(accuracy_dist.items()):
    print(f"  {k:<20s} {v}")
print()

print("STAGE DISTRIBUTION:")
for k, v in sorted(stage_dist.items()):
    print(f"  {k:<20s} {v}")
print()

print(f"ERRORS   : {len(errors)}")
for e in errors:
    print(f"  {e}")
print()

print(f"WARNINGS : {len(warnings)}")
for w in warnings:
    print(f"  {w}")
print()

if errors:
    print("RESULT: FAIL — fatal errors found")
    sys.exit(1)
elif warnings:
    print("RESULT: PASS — valid, with warnings")
    sys.exit(0)
else:
    print("RESULT: PASS")
    sys.exit(0)
