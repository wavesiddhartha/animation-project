/**
 * Video and Audio Synchronization System
 * Combines Manim animations with ElevenLabs audio using FFmpeg
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const execAsync = promisify(exec);

export interface SyncOptions {
  fadeIn?: boolean;
  fadeOut?: boolean;
  volume?: number;
}

export interface SyncResult {
  success: boolean;
  outputPath?: string;
  error?: string;
}

/**
 * Combine video and audio into a single file
 */
export async function syncVideoAudio(
  videoPath: string,
  audioData: string, // base64 audio
  options: SyncOptions = {}
): Promise<SyncResult> {
  const { fadeIn = true, fadeOut = true, volume = 1.0 } = options;

  const syncId = `sync_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  const outputDir = path.join(process.cwd(), 'public', 'animations');
  const tempAudioPath = path.join(process.cwd(), 'temp', `${syncId}_audio.mp3`);
  const outputPath = path.join(outputDir, `${syncId}_final.mp4`);

  try {
    // Decode base64 audio and save to file
    const audioBuffer = Buffer.from(audioData, 'base64');
    await writeFile(tempAudioPath, audioBuffer);

    // Get video duration
    const { stdout: durationOutput } = await execAsync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${path.join(process.cwd(), 'public', videoPath)}"`
    );
    const videoDuration = parseFloat(durationOutput.trim());

    // Get audio duration
    const { stdout: audioDurationOutput } = await execAsync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${tempAudioPath}"`
    );
    const audioDuration = parseFloat(audioDurationOutput.trim());

    // Build audio filters
    const filters: string[] = [];

    // Volume adjustment
    if (volume !== 1.0) {
      filters.push(`volume=${volume}`);
    }

    // Fade effects
    if (fadeIn) {
      filters.push('afade=t=in:st=0:d=0.5');
    }
    if (fadeOut) {
      filters.push(`afade=t=out:st=${audioDuration - 0.5}:d=0.5`);
    }

    const audioFilter = filters.length > 0 ? `-af "${filters.join(',')}"` : '';

    // Determine strategy based on durations
    let command: string;

    if (audioDuration > videoDuration) {
      // Audio is longer - loop video
      command = `ffmpeg -stream_loop -1 -i "${path.join(process.cwd(), 'public', videoPath)}" -i "${tempAudioPath}" ${audioFilter} -c:v libx264 -c:a aac -shortest -y "${outputPath}"`;
    } else {
      // Video is longer or equal - use as is
      command = `ffmpeg -i "${path.join(process.cwd(), 'public', videoPath)}" -i "${tempAudioPath}" ${audioFilter} -c:v copy -c:a aac -shortest -y "${outputPath}"`;
    }

    console.log('FFmpeg sync command:', command);

    // Execute FFmpeg
    await execAsync(command, { timeout: 300000 });

    // Clean up temp audio file
    await unlink(tempAudioPath);

    return {
      success: true,
      outputPath: `/animations/${syncId}_final.mp4`,
    };
  } catch (error: any) {
    console.error('Sync error:', error);

    // Clean up
    try {
      if (existsSync(tempAudioPath)) {
        await unlink(tempAudioPath);
      }
    } catch {}

    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Create a video with synchronized captions
 */
export async function addCaptionsToVideo(
  videoPath: string,
  captions: { text: string; startTime: number; endTime: number }[]
): Promise<SyncResult> {
  const syncId = `captions_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  const outputDir = path.join(process.cwd(), 'public', 'animations');
  const subtitlesPath = path.join(process.cwd(), 'temp', `${syncId}.srt`);
  const outputPath = path.join(outputDir, `${syncId}_captioned.mp4`);

  try {
    // Generate SRT file
    let srtContent = '';
    captions.forEach((caption, index) => {
      const startTime = formatSRTTime(caption.startTime);
      const endTime = formatSRTTime(caption.endTime);
      srtContent += `${index + 1}\n${startTime} --> ${endTime}\n${caption.text}\n\n`;
    });

    await writeFile(subtitlesPath, srtContent, 'utf-8');

    // Add subtitles to video
    const command = `ffmpeg -i "${path.join(process.cwd(), 'public', videoPath)}" -vf "subtitles=${subtitlesPath}:force_style='FontName=Arial,FontSize=24,PrimaryColour=&HFFFFFF&,OutlineColour=&H000000&,Outline=2'" -c:a copy -y "${outputPath}"`;

    await execAsync(command, { timeout: 300000 });

    // Clean up
    await unlink(subtitlesPath);

    return {
      success: true,
      outputPath: `/animations/${syncId}_captioned.mp4`,
    };
  } catch (error: any) {
    console.error('Captions error:', error);

    try {
      if (existsSync(subtitlesPath)) {
        await unlink(subtitlesPath);
      }
    } catch {}

    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Format time for SRT subtitles (HH:MM:SS,mmm)
 */
function formatSRTTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const millis = Math.floor((seconds % 1) * 1000);

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(millis).padStart(3, '0')}`;
}

/**
 * Adjust video speed to match audio duration
 */
export async function adjustVideoSpeed(
  videoPath: string,
  targetDuration: number
): Promise<SyncResult> {
  const syncId = `speed_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  const outputDir = path.join(process.cwd(), 'public', 'animations');
  const outputPath = path.join(outputDir, `${syncId}_adjusted.mp4`);

  try {
    // Get current duration
    const { stdout } = await execAsync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${path.join(process.cwd(), 'public', videoPath)}"`
    );
    const currentDuration = parseFloat(stdout.trim());

    // Calculate speed factor
    const speed = currentDuration / targetDuration;

    // Adjust video speed
    const command = `ffmpeg -i "${path.join(process.cwd(), 'public', videoPath)}" -filter:v "setpts=${1 / speed}*PTS" -y "${outputPath}"`;

    await execAsync(command, { timeout: 300000 });

    return {
      success: true,
      outputPath: `/animations/${syncId}_adjusted.mp4`,
    };
  } catch (error: any) {
    console.error('Speed adjustment error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}
