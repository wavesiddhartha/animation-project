/**
 * Manim Rendering Pipeline
 * Executes Manim code and generates animation videos
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, mkdir, readdir, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const execAsync = promisify(exec);

export interface ManimRenderOptions {
  quality?: 'low' | 'medium' | 'high' | 'production';
  format?: 'mp4' | 'mov' | 'gif';
  transparent?: boolean;
  fps?: number;
}

export interface ManimRenderResult {
  success: boolean;
  videoPath?: string;
  error?: string;
  logs?: string;
}

/**
 * Render Manim code to video
 */
export async function renderManimCode(
  code: string,
  options: ManimRenderOptions = {}
): Promise<ManimRenderResult> {
  const {
    quality = 'high',
    format = 'mp4',
    transparent = false,
    fps = 60,
  } = options;

  // Create unique ID for this render
  const renderId = `manim_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  const outputDir = path.join(process.cwd(), 'public', 'animations');
  const tempDir = path.join(process.cwd(), 'temp');
  const scriptPath = path.join(tempDir, `${renderId}.py`);

  try {
    // Ensure directories exist
    await mkdir(outputDir, { recursive: true });
    await mkdir(tempDir, { recursive: true });

    console.log(`[Manim] Writing code to file: ${scriptPath}`);
    // Write Manim code to file
    await writeFile(scriptPath, code, 'utf-8');

    // Determine quality flag
    const qualityFlag = {
      low: '-ql',
      medium: '-qm',
      high: '-qh',
      production: '-qk',
    }[quality];

    // Build manim command
    const transparentFlag = transparent ? '--transparent' : '';
    const fpsFlag = `--fps ${fps}`;

    const command = `manim ${qualityFlag} ${transparentFlag} ${fpsFlag} -o ${renderId}.${format} "${scriptPath}"`;

    console.log('[Manim] Executing command:', command);

    // Execute Manim
    let stdout = '';
    let stderr = '';
    try {
      const result = await execAsync(command, {
        cwd: process.cwd(),
        timeout: 300000, // 5 minutes timeout
      });
      stdout = result.stdout;
      stderr = result.stderr;

      console.log('[Manim] Command completed');
      if (stderr) {
        console.warn('[Manim] Stderr output:', stderr.substring(0, 500));
      }
    } catch (execError: any) {
      stdout = execError.stdout || '';
      stderr = execError.stderr || '';
      console.error('[Manim] Command failed:', execError.message);
      console.error('[Manim] Stdout:', stdout.substring(0, 500));
      console.error('[Manim] Stderr:', stderr.substring(0, 500));
      throw execError;
    }

    // Find the generated video
    const mediaDir = path.join(process.cwd(), 'media', 'videos');
    console.log('[Manim] Looking for video in:', mediaDir);
    const videoPath = await findGeneratedVideo(mediaDir, renderId, format);

    if (!videoPath) {
      console.error('[Manim] Video not found. Media dir contents:');
      try {
        const { stdout: lsOutput } = await execAsync(`find "${mediaDir}" -type f -name "*.${format}" 2>/dev/null || echo "No videos found"`);
        console.error(lsOutput);
      } catch {}
      throw new Error('Generated video not found in media directory');
    }

    console.log('[Manim] Found video at:', videoPath);

    // Move video to public directory
    const publicVideoPath = path.join(outputDir, `${renderId}.${format}`);
    console.log('[Manim] Moving video to:', publicVideoPath);
    await execAsync(`mv "${videoPath}" "${publicVideoPath}"`);

    // Clean up temp file
    await unlink(scriptPath);
    console.log('[Manim] Cleanup complete');

    return {
      success: true,
      videoPath: `/animations/${renderId}.${format}`,
      logs: stdout + stderr,
    };
  } catch (error: any) {
    console.error('[Manim] Render error:', error.message);

    // Clean up temp file
    try {
      if (existsSync(scriptPath)) {
        await unlink(scriptPath);
      }
    } catch {}

    // Provide more detailed error message
    let errorMessage = error.message;
    const errorLogs = error.stdout || error.stderr || '';

    if (errorLogs.includes('ModuleNotFoundError')) {
      errorMessage = 'Manim module not found. Please ensure Manim is installed correctly.';
    } else if (errorLogs.includes('SyntaxError')) {
      errorMessage = 'Python syntax error in generated code.';
    } else if (errorLogs.includes('AttributeError')) {
      errorMessage = 'Invalid Manim method or attribute used.';
    } else if (errorLogs.includes('FileNotFoundError')) {
      errorMessage = 'File or resource not found during rendering.';
    }

    return {
      success: false,
      error: errorMessage,
      logs: errorLogs,
    };
  }
}

/**
 * Find generated video file recursively
 */
async function findGeneratedVideo(
  dir: string,
  renderId: string,
  format: string
): Promise<string | null> {
  if (!existsSync(dir)) {
    return null;
  }

  const files = await readdir(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory()) {
      const found = await findGeneratedVideo(fullPath, renderId, format);
      if (found) return found;
    } else if (file.name === `${renderId}.${format}`) {
      return fullPath;
    }
  }

  return null;
}

/**
 * Validate Manim code syntax and structure
 */
export async function validateManimCode(code: string): Promise<{ valid: boolean; error?: string }> {
  const tempFile = path.join(process.cwd(), 'temp', `validate_${Date.now()}.py`);

  try {
    // Pre-validation checks
    const preValidation = preValidateManimCode(code);
    if (!preValidation.valid) {
      return preValidation;
    }

    await mkdir(path.dirname(tempFile), { recursive: true });
    await writeFile(tempFile, code, 'utf-8');

    // Try to parse with Python
    const { stderr } = await execAsync(`python3 -m py_compile "${tempFile}"`);

    if (stderr && stderr.includes('SyntaxError')) {
      await unlink(tempFile);
      return {
        valid: false,
        error: `Python syntax error: ${stderr}`,
      };
    }

    await unlink(tempFile);

    return { valid: true };
  } catch (error: any) {
    try {
      await unlink(tempFile);
    } catch {}

    return {
      valid: false,
      error: `Validation failed: ${error.message || error.stderr || 'Unknown error'}`,
    };
  }
}

/**
 * Pre-validate Manim code structure before Python compilation
 */
function preValidateManimCode(code: string): { valid: boolean; error?: string } {
  // Check for required imports
  if (!code.includes('from manim import') && !code.includes('import manim')) {
    return {
      valid: false,
      error: 'Missing Manim import statement. Code must include "from manim import *"',
    };
  }

  // Check for Scene class
  if (!code.includes('class') || !code.includes('Scene')) {
    return {
      valid: false,
      error: 'Missing Scene class. Code must define a class that inherits from Scene',
    };
  }

  // Check for construct method
  if (!code.includes('def construct(self)')) {
    return {
      valid: false,
      error: 'Missing construct method. Scene class must have a construct(self) method',
    };
  }

  // Check for forbidden elements (MathTex, Tex, LaTeX)
  const forbiddenPatterns = [
    { pattern: /MathTex\s*\(/i, name: 'MathTex()' },
    { pattern: /Tex\s*\(/i, name: 'Tex()' },
    { pattern: /\\frac/gi, name: 'LaTeX \\frac' },
    { pattern: /\\sqrt/gi, name: 'LaTeX \\sqrt' },
    { pattern: /\\sum/gi, name: 'LaTeX \\sum' },
    { pattern: /\\int/gi, name: 'LaTeX \\int' },
    { pattern: /\\begin\{/gi, name: 'LaTeX environment' },
    { pattern: /\\end\{/gi, name: 'LaTeX environment' },
    { pattern: /\$\$[^$]+\$\$/g, name: 'LaTeX math mode' },
    { pattern: /\$[^$]+\$/g, name: 'LaTeX math mode' },
  ];

  for (const { pattern, name } of forbiddenPatterns) {
    if (pattern.test(code)) {
      return {
        valid: false,
        error: `❌ Code contains forbidden ${name}. ONLY use Text() and simple shapes (Circle, Square, Line, etc). NO LaTeX or MathTex allowed.`,
      };
    }
  }

  // Check for basic code structure
  if (code.trim().length < 50) {
    return {
      valid: false,
      error: 'Code is too short to be valid',
    };
  }

  // Track advanced animation features (for quality metrics)
  const advancedFeatures = {
    transform: /Transform\s*\(/i.test(code),
    animationGroup: /AnimationGroup\s*\(/i.test(code),
    vgroup: /VGroup\s*\(/i.test(code),
    rotate: /Rotate\s*\(/i.test(code),
    colorStyling: /set_fill\s*\(|set_stroke\s*\(/i.test(code),
    lagRatio: /lag_ratio\s*=/i.test(code),
    scaling: /\.animate\.scale\s*\(/i.test(code),
  };

  const advancedFeaturesUsed = Object.entries(advancedFeatures)
    .filter(([_, used]) => used)
    .map(([feature, _]) => feature);

  if (advancedFeaturesUsed.length > 0) {
    console.log(`✨ Advanced Manim features detected: ${advancedFeaturesUsed.join(', ')}`);
    console.log(`🎯 Animation quality score: ${advancedFeaturesUsed.length}/7 advanced techniques used`);
  } else {
    console.log(`⚠️  Basic animation only - no advanced features detected. Consider using Transform, AnimationGroup, VGroup, etc.`);
  }

  // Check for proper positioning (quality check)
  const hasPositioning = /\.move_to\s*\(|\.shift\s*\(|\.next_to\s*\(/i.test(code);
  if (!hasPositioning) {
    console.warn('⚠️  Warning: No positioning methods detected. Objects may go off-screen.');
  }

  // Check for cleanup transitions
  const hasCleanup = /FadeOut\s*\(/i.test(code);
  if (!hasCleanup) {
    console.warn('⚠️  Warning: No FadeOut detected. Screen may become cluttered.');
  }

  return { valid: true };
}

/**
 * Extract scene class name from Manim code
 */
export function extractSceneClassName(code: string): string | null {
  const match = code.match(/class\s+(\w+)\s*\(\s*Scene\s*\)/);
  return match ? match[1] : null;
}

/**
 * Wrap user code in a complete Manim scene if needed
 */
export function ensureCompleteManimCode(code: string): string {
  // Check if code already has proper imports and scene class
  const hasImports = code.includes('from manim import');
  const hasSceneClass = code.includes('class') && code.includes('Scene');

  if (hasImports && hasSceneClass) {
    return code;
  }

  // Wrap code in a complete scene
  return `from manim import *

class GeneratedScene(Scene):
    def construct(self):
${code.split('\n').map(line => '        ' + line).join('\n')}
`;
}
