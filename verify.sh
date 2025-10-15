#!/bin/bash

# Verification script for ihavenoenemy setup
echo "🔍 Verifying ihavenoenemy installation..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0

# Check Node.js
echo -n "Node.js: "
if command -v node &> /dev/null; then
    echo -e "${GREEN}✓${NC} $(node -v)"
else
    echo -e "${RED}✗ Not found${NC}"
    ((ERRORS++))
fi

# Check npm
echo -n "npm: "
if command -v npm &> /dev/null; then
    echo -e "${GREEN}✓${NC} $(npm -v)"
else
    echo -e "${RED}✗ Not found${NC}"
    ((ERRORS++))
fi

# Check Python
echo -n "Python: "
if command -v python3 &> /dev/null; then
    echo -e "${GREEN}✓${NC} $(python3 --version)"
else
    echo -e "${RED}✗ Not found${NC}"
    ((ERRORS++))
fi

# Check Manim
echo -n "Manim: "
if command -v manim &> /dev/null; then
    echo -e "${GREEN}✓${NC} $(manim --version 2>&1 | head -n 1)"
else
    echo -e "${RED}✗ Not found${NC}"
    ((ERRORS++))
fi

# Check FFmpeg
echo -n "FFmpeg: "
if command -v ffmpeg &> /dev/null; then
    echo -e "${GREEN}✓${NC} Installed"
else
    echo -e "${RED}✗ Not found${NC}"
    ((ERRORS++))
fi

# Check directories
echo ""
echo "Checking directories:"
for dir in "public/animations" "temp" "media" "components" "node_modules"; do
    echo -n "  $dir: "
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${RED}✗${NC}"
        ((ERRORS++))
    fi
done

# Check .env.local
echo ""
echo -n ".env.local: "
if [ -f .env.local ]; then
    echo -e "${GREEN}✓${NC}"

    # Check for API keys
    if grep -q "your_api_key_here" .env.local; then
        echo -e "  ${YELLOW}⚠ Warning: API keys not configured${NC}"
    fi
else
    echo -e "${RED}✗ Not found${NC}"
    ((ERRORS++))
fi

# Check critical files
echo ""
echo "Checking critical files:"
FILES=("package.json" "tsconfig.json" "next.config.js" "tailwind.config.ts")
for file in "${FILES[@]}"; do
    echo -n "  $file: "
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${RED}✗${NC}"
        ((ERRORS++))
    fi
done

# Summary
echo ""
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed!${NC}"
    echo ""
    echo "You're ready to run:"
    echo "  npm run dev"
else
    echo -e "${RED}❌ $ERRORS error(s) found${NC}"
    echo ""
    echo "Please fix the errors above and run ./setup.sh"
fi
