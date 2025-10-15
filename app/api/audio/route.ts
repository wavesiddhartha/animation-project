import { NextRequest, NextResponse } from 'next/server';
import { generateSpeech, generateSpeechWithTimestamps } from '@/lib/elevenlabs';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      text,
      voiceId,
      withTimestamps = false,
      stability = 0.5,
      similarityBoost = 0.75,
    } = body;

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const options = {
      voiceId,
      stability,
      similarityBoost,
    };

    if (withTimestamps) {
      // Generate with word-level timestamps for sync
      const result = await generateSpeechWithTimestamps(text, options);

      // Convert ArrayBuffer to base64
      const base64Audio = Buffer.from(result.audio).toString('base64');

      return NextResponse.json({
        success: true,
        audio: base64Audio,
        alignment: result.alignment,
      });
    } else {
      // Generate regular audio
      const audioBuffer = await generateSpeech(text, options);

      // Convert to base64
      const base64Audio = Buffer.from(audioBuffer).toString('base64');

      return NextResponse.json({
        success: true,
        audio: base64Audio,
      });
    }
  } catch (error: any) {
    console.error('Audio API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to generate audio',
      },
      { status: 500 }
    );
  }
}
