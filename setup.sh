#!/bin/bash

# ihavenoenemy Setup Script
# This script helps set up the development environment

echo "🚀 Setting up ihavenoenemy..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check Node.js
echo -n "Checking Node.js installation... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} Found Node.js $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js not found"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

# Check npm
echo -n "Checking npm installation... "
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓${NC} Found npm $NPM_VERSION"
else
    echo -e "${RED}✗${NC} npm not found"
    exit 1
fi

# Check Python
echo -n "Checking Python installation... "
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo -e "${GREEN}✓${NC} Found $PYTHON_VERSION"
else
    echo -e "${RED}✗${NC} Python 3 not found"
    echo "Please install Python 3.8+ from https://python.org/"
    exit 1
fi

# Check Manim
echo -n "Checking Manim installation... "
if command -v manim &> /dev/null; then
    MANIM_VERSION=$(manim --version 2>&1 | head -n 1)
    echo -e "${GREEN}✓${NC} Found $MANIM_VERSION"
else
    echo -e "${YELLOW}!${NC} Manim not found"
    echo "Installing Manim Community Edition..."
    pip3 install manim
fi

# Check FFmpeg
echo -n "Checking FFmpeg installation... "
if command -v ffmpeg &> /dev/null; then
    FFMPEG_VERSION=$(ffmpeg -version 2>&1 | head -n 1)
    echo -e "${GREEN}✓${NC} Found FFmpeg"
else
    echo -e "${RED}✗${NC} FFmpeg not found"
    echo "Please install FFmpeg:"
    echo "  macOS: brew install ffmpeg"
    echo "  Linux: sudo apt install ffmpeg"
    echo "  Windows: choco install ffmpeg"
    exit 1
fi

# Install npm dependencies
echo ""
echo "Installing npm dependencies..."
npm install

# Create necessary directories
echo ""
echo "Creating required directories..."
mkdir -p public/animations
mkdir -p temp
mkdir -p media

# Check .env.local
echo ""
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}!${NC} .env.local not found"
    echo "Creating .env.local from template..."
    cat > .env.local << EOF
# DeepSeek R1 API Key (via OpenRouter)
DEEPSEEK_API_KEY=your_api_key_here

# ElevenLabs API
ELEVENLABS_API_KEY=your_api_key_here

# Site Info
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=ihavenoenemy
EOF
    echo -e "${YELLOW}!${NC} Please edit .env.local and add your API keys"
else
    echo -e "${GREEN}✓${NC} .env.local exists"
fi

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Edit .env.local and add your API keys"
echo "  2. Run 'npm run dev' to start the development server"
echo "  3. Open http://localhost:3000 in your browser"
echo ""
echo "For more information, see README.md"
