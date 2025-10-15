# ihavenoenemy

AI-Powered Mathematical Animation Platform

Transform mathematical concepts into stunning, educational animations using cutting-edge AI technology.

## Features

- **DeepSeek R1 Integration**: Advanced AI generates comprehensive math explanations and perfect Manim code
- **Manim Rendering**: Professional-quality mathematical animations
- **ElevenLabs Audio**: Natural-sounding narration with emotional depth
- **Award-Winning UI**: Modern, fluid interface with stunning animations
- **Video Synchronization**: Seamless audio-video sync with FFmpeg
- **Real-time Progress**: Live updates during generation and rendering

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Framer Motion
- **AI Models**:
  - DeepSeek R1 (via OpenRouter) for math explanations and code generation
  - ElevenLabs for text-to-speech narration
- **Animation**: Manim Community Edition
- **Video Processing**: FFmpeg
- **Deployment**: Vercel-ready

## Prerequisites

1. **Node.js** 18+ and npm
2. **Python** 3.8+ with pip
3. **Manim Community Edition**
4. **FFmpeg**
5. **API Keys**:
   - DeepSeek API key (via OpenRouter)
   - ElevenLabs API key

## Installation

### 1. Install System Dependencies

#### macOS
```bash
# Install Homebrew if not installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Python
brew install python@3.11

# Install FFmpeg
brew install ffmpeg

# Install LaTeX (required for Manim)
brew install --cask mactex-no-gui
```

#### Linux (Ubuntu/Debian)
```bash
# Install Python
sudo apt update
sudo apt install python3.11 python3-pip

# Install FFmpeg
sudo apt install ffmpeg

# Install LaTeX
sudo apt install texlive texlive-latex-extra
```

#### Windows
```powershell
# Use Chocolatey package manager
choco install python
choco install ffmpeg
choco install miktex
```

### 2. Install Manim Community Edition

```bash
# Install Manim via pip
pip3 install manim

# Verify installation
manim --version
```

### 3. Clone and Setup Project

```bash
# Navigate to project directory
cd ihavenoenemy

# Install Node.js dependencies
npm install

# Create .env.local file with your API keys
cp .env.local.example .env.local
```

### 4. Configure API Keys

Edit `.env.local`:

```env
DEEPSEEK_API_KEY=your_deepseek_api_key_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=ihavenoenemy
```

## Running the Application

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Usage

1. **Enter a Math Topic**: Type any mathematical concept (e.g., "Pythagorean Theorem", "Chain Rule", "Fourier Transform")

2. **Select Difficulty**: Choose beginner, intermediate, or advanced level

3. **Generate**: Click "Generate Animation" and watch the magic happen:
   - DeepSeek R1 generates explanation and Manim code
   - Manim renders the animation
   - ElevenLabs creates narration audio
   - System combines everything into a final video

4. **View Results**:
   - Watch the animation
   - Listen to the narration
   - Read the explanation
   - View the generated Manim code

## API Endpoints

### POST /api/generate
Generate explanation and Manim code for a math topic.

**Request:**
```json
{
  "topic": "Pythagorean Theorem",
  "difficulty": "intermediate"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "explanation": "...",
    "manimCode": "...",
    "reasoning": "..."
  }
}
```

### POST /api/render
Render Manim code to video.

**Request:**
```json
{
  "code": "from manim import *\n...",
  "quality": "high",
  "format": "mp4"
}
```

**Response:**
```json
{
  "success": true,
  "videoPath": "/animations/video.mp4"
}
```

### POST /api/audio
Generate audio narration from text.

**Request:**
```json
{
  "text": "The Pythagorean theorem states...",
  "voiceId": "21m00Tcm4TlvDq8ikWAM",
  "withTimestamps": false
}
```

**Response:**
```json
{
  "success": true,
  "audio": "base64_encoded_audio"
}
```

### POST /api/sync
Synchronize video and audio.

**Request:**
```json
{
  "videoPath": "/animations/video.mp4",
  "audioData": "base64_encoded_audio",
  "fadeIn": true,
  "fadeOut": true
}
```

## Project Structure

```
ihavenoenemy/
├── app/
│   ├── api/
│   │   ├── generate/      # DeepSeek R1 integration
│   │   ├── render/        # Manim rendering
│   │   ├── audio/         # ElevenLabs TTS
│   │   └── sync/          # Video/audio sync
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── lib/
│   ├── deepseek.ts        # DeepSeek API client
│   ├── elevenlabs.ts      # ElevenLabs API client
│   ├── manim.ts           # Manim rendering logic
│   └── sync.ts            # Video synchronization
├── components/            # React components
├── public/
│   └── animations/        # Generated videos
├── temp/                  # Temporary files
└── media/                 # Manim output
```

## Customization

### Change Voice
Edit `lib/elevenlabs.ts` and modify the default `voiceId`:

```typescript
voiceId = 'your_preferred_voice_id'
```

Get available voices at: https://elevenlabs.io/voice-library

### Adjust Rendering Quality
Modify quality settings in `app/api/render/route.ts`:

```typescript
quality: 'low' | 'medium' | 'high' | 'production'
```

### Custom Manim Styles
Edit the system prompt in `lib/deepseek.ts` to change animation style preferences.

## Troubleshooting

### Manim Not Found
```bash
# Make sure Manim is in PATH
which manim

# Reinstall if needed
pip3 install --upgrade manim
```

### FFmpeg Errors
```bash
# Verify FFmpeg installation
ffmpeg -version

# Reinstall if needed
brew reinstall ffmpeg  # macOS
```

### LaTeX Errors
Manim requires LaTeX for text rendering. Ensure LaTeX is installed:

```bash
# macOS
brew install --cask mactex-no-gui

# Linux
sudo apt install texlive-full
```

### API Errors
- Verify API keys in `.env.local`
- Check API quotas and limits
- Ensure internet connection

## Performance Tips

1. **Quality**: Use 'medium' quality for faster renders during testing
2. **Caching**: Generated animations are cached in `public/animations/`
3. **Cleanup**: Periodically clean `temp/` and `media/` directories
4. **Parallel**: Multiple requests are handled sequentially to avoid resource exhaustion

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - See LICENSE file for details

## Credits

- **DeepSeek R1**: Advanced reasoning AI model
- **Manim Community**: Mathematical animation framework
- **ElevenLabs**: Natural text-to-speech
- **OpenRouter**: AI model routing platform

## Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/yourusername/ihavenoenemy/issues)
- Email: support@ihavenoenemy.com

---

Built with passion for mathematics education.
