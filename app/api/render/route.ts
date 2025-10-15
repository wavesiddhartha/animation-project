import { NextRequest, NextResponse } from 'next/server';
import { renderManimCode, ensureCompleteManimCode, validateManimCode } from '@/lib/manim';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes for rendering

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, quality = 'medium', format = 'mp4', retryCount = 0 } = body;

    if (!code) {
      return NextResponse.json(
        { error: 'Manim code is required' },
        { status: 400 }
      );
    }

    console.log(`[Render] Attempt ${retryCount + 1}: Starting render with quality: ${quality}`);

    // Ensure code is complete
    const completeCode = ensureCompleteManimCode(code);

    // Validate code first
    const validation = await validateManimCode(completeCode);
    if (!validation.valid) {
      console.error('[Render] Manim validation failed:', validation.error);
      console.error('[Render] Code that failed validation:', completeCode.substring(0, 500) + '...');
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid Manim code',
          details: validation.error,
          code: completeCode, // Return code for debugging
        },
        { status: 400 }
      );
    }

    console.log('[Render] Validation passed, starting render...');

    // Render the animation with retry logic
    let result = await renderManimCode(completeCode, { quality, format });

    // If render fails and we haven't retried yet, try with lower quality
    if (!result.success && retryCount === 0 && quality !== 'low') {
      console.warn('[Render] First attempt failed, retrying with lower quality...');
      result = await renderManimCode(completeCode, { quality: 'low', format });
    }

    if (!result.success) {
      console.error('[Render] Render failed:', result.error);

      // Provide better error messages based on error type
      let userFriendlyError = result.error || 'Failed to render animation';
      const errorLogs = result.logs || '';

      if (errorLogs.includes('Animation only works on Mobjects')) {
        userFriendlyError = 'Code error: Tried to animate a variable that doesn\'t exist. The AI will learn from this and retry.';
      } else if (errorLogs.includes('TypeError')) {
        userFriendlyError = 'Code error: Type mismatch in the generated code. The AI will adjust and retry.';
      } else if (errorLogs.includes('NameError') || errorLogs.includes('not defined')) {
        userFriendlyError = 'Code error: Variable used before being defined. The AI will fix this and retry.';
      } else if (errorLogs.includes('AttributeError')) {
        userFriendlyError = 'Code error: Invalid method or property used. The AI will correct this.';
      } else if (errorLogs.includes('SyntaxError')) {
        userFriendlyError = 'Code error: Python syntax issue. The AI will regenerate correct code.';
      }

      return NextResponse.json(
        {
          success: false,
          error: userFriendlyError,
          logs: result.logs,
          technicalError: result.error,
        },
        { status: 500 }
      );
    }

    console.log('[Render] Render successful:', result.videoPath);

    return NextResponse.json({
      success: true,
      videoPath: result.videoPath,
      logs: result.logs,
    });
  } catch (error: any) {
    console.error('[Render] API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to render animation',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
