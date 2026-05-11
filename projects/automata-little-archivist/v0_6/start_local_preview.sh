#!/usr/bin/env bash
# ============================================================
# start_local_preview.sh — Launch v0.5 Public Demo Polish
# The Little Archivist / 小档案员
# ============================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}"

if ! command -v python3 &> /dev/null; then
    echo "❌ Error: python3 not found."
    exit 1
fi

DEFAULT_PORT=8795
ALT_PORT=8796
PORT="${DEFAULT_PORT}"

if lsof -Pi :"${DEFAULT_PORT}" -sTCP:LISTEN -t >/dev/null 2>&1; then
    PORT="${ALT_PORT}"
    echo "⚠️  Port ${DEFAULT_PORT} occupied. Using ${PORT}."
fi

if [ "${PORT}" = "${ALT_PORT}" ] && lsof -Pi :"${ALT_PORT}" -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "❌ Both ports occupied."
    exit 1
fi

for f in index.html app.js style.css models/parts_config.json states_config.json models/assembly_preview.stl; do
    if [ ! -f "$f" ]; then
        echo "❌ Missing: $f"
        exit 1
    fi
done

echo "=========================================="
echo "The Little Archivist — v0.5 Public Demo"
echo "=========================================="
echo "Directory:  ${SCRIPT_DIR}"
echo "Server:     python3 http.server"
echo "Address:    http://127.0.0.1:${PORT}/"
echo "=========================================="
echo "Press Ctrl+C to stop"
echo ""

python3 -m http.server "${PORT}" --bind 127.0.0.1
