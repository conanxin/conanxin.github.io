#!/bin/bash
# Development server for WSL2
# Usage: ./scripts/dev-server.sh [port]

set -e

PORT=${1:-8080}
SRC_DIR="$(dirname "$0")/../src"
cd "$SRC_DIR"

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║               XIN CONAN DIGITAL GARDEN                       ║"
echo "║                    Development Server                        ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "  📁 Source: $(pwd)"
echo "  🌐 URL:   http://localhost:$PORT"
echo "  🔧 Press Ctrl+C to stop"
echo ""
echo "───────────────────────────────────────────────────────────────"
echo ""

# Use Python's built-in HTTP server
python3 -m http.server "$PORT" --directory .
