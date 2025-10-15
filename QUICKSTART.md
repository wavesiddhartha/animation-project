# Quick Start Guide

Get **ihavenoenemy** running in 5 minutes!

## Prerequisites Check

Run these commands to verify you have everything:

```bash
node -v        # Should be 18+
npm -v         # Should be 9+
python3 --version  # Should be 3.8+
manim --version    # Should show Manim Community version
ffmpeg -version    # Should show FFmpeg version
```

## Installation Steps

### 1. Install System Requirements

**macOS:**
```bash
brew install python@3.11 ffmpeg
brew install --cask mactex-no-gui
pip3 install manim
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install python3 python3-pip ffmpeg texlive texlive-latex-extra
pip3 install manim
```

**Windows:**
```powershell
choco install python ffmpeg miktex
pip3 install manim
```

### 2. Setup Project

```bash
# Run automated setup
./setup.sh

# OR manually:
npm install
mkdir -p public/animations temp media
```

### 3. Configure API Keys

Edit `.env.local`:

```env
DEEPSEEK_API_KEY=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
ELEVENLABS_API_KEY=sk_5c033d703d68f4a96526e3c89853194c6b841152f9169135
```

### 4. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## First Animation

1. Enter a topic: **"Pythagorean Theorem"**
2. Select difficulty: **Intermediate**
3. Click **Generate Animation**
4. Wait 30-60 seconds
5. Watch your AI-generated math animation!

## What Happens Behind the Scenes?

1. **DeepSeek R1** (via OpenRouter) analyzes your topic and generates:
   - Detailed mathematical explanation
   - Perfect Manim Python code

2. **Manim** renders the animation:
   - Creates stunning visual animations
   - Outputs high-quality MP4 video

3. **ElevenLabs** generates narration:
   - Converts explanation to natural speech
   - Creates professional audio

4. **FFmpeg** combines everything:
   - Syncs audio with video
   - Creates final educational content

## Architecture Overview

```
User Input (Math Topic)
    ↓
DeepSeek R1 AI (via OpenRouter API)
    ├─→ Explanation Text
    └─→ Manim Python Code
        ↓
Manim Renderer
    ↓
Animation Video (MP4)
    ↓
ElevenLabs TTS
    ↓
Audio Narration (MP3)
    ↓
FFmpeg Sync
    ↓
Final Educational Video
```

## Common Use Cases

### Example Topics to Try:

**Beginner:**
- Addition and Multiplication
- Basic Fractions
- Simple Geometry

**Intermediate:**
- Pythagorean Theorem
- Quadratic Equations
- Trigonometric Functions

**Advanced:**
- Fourier Transform
- Taylor Series
- Vector Calculus
- Complex Analysis

## Customization

### Change Narrator Voice

Edit `lib/elevenlabs.ts`:
```typescript
voiceId = '21m00Tcm4TlvDq8ikWAM' // Rachel (default)
```

Browse voices at: https://elevenlabs.io/voice-library

### Adjust Rendering Quality

In `app/page.tsx`, change:
```typescript
quality: 'high' // Options: low, medium, high, production
```

### Modify Animation Style

Edit the system prompt in `lib/deepseek.ts` to customize:
- Color schemes
- Animation speed
- Visual style
- Complexity level

## Troubleshooting

**"Manim command not found"**
```bash
pip3 install --upgrade manim
export PATH="$PATH:$HOME/.local/bin"
```

**"FFmpeg not found"**
```bash
# macOS
brew install ffmpeg

# Linux
sudo apt install ffmpeg
```

**"LaTeX errors in Manim"**
```bash
# macOS
brew install --cask mactex-no-gui

# Linux
sudo apt install texlive-full
```

**"API Key errors"**
- Verify keys in `.env.local`
- Check API quotas at OpenRouter and ElevenLabs dashboards
- Ensure no extra spaces in keys

**"Slow rendering"**
- Use 'medium' or 'low' quality for testing
- Reduce complexity in DeepSeek prompt
- Check system resources (CPU/RAM)

## Performance Tips

1. **Cache Management**: Generated videos are cached in `public/animations/`
2. **Quality Settings**: Use lower quality during development
3. **Parallel Requests**: System handles one render at a time to prevent resource exhaustion
4. **Cleanup**: Periodically delete `temp/` and `media/` folders

## Next Steps

- Explore different math topics
- Customize voice and animation settings
- Build your own features
- Share your creations!

## Support

- **Documentation**: See README.md for full details
- **Issues**: Report bugs on GitHub
- **Community**: Join our Discord (link in README)

---

**Happy Learning! 🎓✨**
