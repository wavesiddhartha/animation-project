import { NextRequest, NextResponse } from 'next/server';
import { syncVideoAudio } from '@/lib/sync';

export const runtime = 'nodejs';
export const maxDuration = 300;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { videoPath, audioData, fadeIn = true, fadeOut = true, volume = 1.0 } = body;

    if (!videoPath || !audioData) {
      return NextResponse.json(
        { error: 'Video path and audio data are required' },
        { status: 400 }
      );
    }

    const result = await syncVideoAudio(audioData, { fadeIn, fadeOut, volume });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      outputPath: result.outputPath,
    });
  } catch (error: any) {
    console.error('Sync API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to sync video and audio',
      },
      { status: 500 }
    );
  }
}
