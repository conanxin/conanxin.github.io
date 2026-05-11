# The Little Archivist — v0.6 Shared Assets Demo

## Overview

v0.6 is a low-risk validation version based on v0.5 Public Demo. The primary change is the introduction of a shared model assets directory (`../assets/models/`) to reduce STL duplication across versions.

## What Changed from v0.5

| Aspect | v0.5 | v0.6 |
|--------|------|------|
| STL location | `v0_6/models/*.stl` (local) | `../assets/models/*.stl` (shared) |
| STL files in v0_6/models | 10 | 0 |
| Config files | `models/parts_config.json`, `models/models.json` | Same (local) |
| Functionality | Public Demo | Same as v0.5 |

## Shared Assets

v0.6 loads STL files from:
```
../assets/models/
```

This directory contains the canonical 10 STL files:
- assembly_preview.stl
- base_shell.stl
- torso_shell.stl
- head_shell.stl
- neck_sleeve.stl
- partition.stl
- access_panel.stl
- breathing_cam.stl
- follower.stl
- crank.stl

## Why This Approach

1. **Low risk**: v0.5 remains fully intact as a stable backup
2. **Reversible**: If shared assets cause issues, v0.5 is unaffected
3. **Precedent**: If v0.6 proves stable, older versions (v0.1–v0.4) can be migrated incrementally
4. **Storage**: Eliminates 1 copy of 10 duplicated STL files per version

## Files in This Directory

| File | Purpose |
|------|---------|
| index.html | Demo page |
| app.js | Three.js scene logic |
| style.css | Demo styles |
| states_config.json | 5-state narrative config |
| models/parts_config.json | Part metadata (local) |
| models/models.json | Model list (local) |

## Status

- Recommended public demo: **v0.6**
- Stable backup: v0.5
- This is a resource deduplication experiment, not a functional change
