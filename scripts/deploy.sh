#!/bin/bash
# Deploy to GitHub Pages
# Usage: ./scripts/deploy.sh

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Config
REPO_URL="git@github.com:xin-conan/xin-conan.github.io.git"
BUILD_DIR="_site"
SRC_DIR="src"

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║               XIN CONAN DIGITAL GARDEN                       ║"
echo "║                   Deployment Script                          ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Check if we're in the right directory
if [ ! -d "$SRC_DIR" ]; then
    echo -e "${RED}Error: src/ directory not found. Run this from project root.${NC}"
    exit 1
fi

# Get current version/timestamp
VERSION=$(date +"%Y%m%d-%H%M%S")
COMMIT_MSG="Deploy: $VERSION"

echo -e "${BLUE}→ Preparing build...${NC}"

# Clean and create build directory
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"

# Copy source files
cp -r "$SRC_DIR"/* "$BUILD_DIR/"

echo -e "${BLUE}→ Build ready in $BUILD_DIR/${NC}"

# Initialize git in build directory
cd "$BUILD_DIR"
git init -q
git checkout -q -b main 2>/dev/null || git checkout -q main

# Add all files
git add -A

# Check if there are changes
if git diff --staged --quiet; then
    echo -e "${YELLOW}⚠ No changes to deploy${NC}"
    exit 0
fi

# Commit
git commit -q -m "$COMMIT_MSG"

echo -e "${BLUE}→ Pushing to GitHub Pages...${NC}"

# Push to GitHub
git push -f "$REPO_URL" main

echo ""
echo -e "${GREEN}✓ Deployed successfully!${NC}"
echo ""
echo "  🌐 Live URL: https://xin-conan.github.io"
echo "  📦 Version:  $VERSION"
echo ""

# Cleanup
cd ..
rm -rf "$BUILD_DIR"

echo -e "${BLUE}→ Cleanup complete${NC}"
echo ""
