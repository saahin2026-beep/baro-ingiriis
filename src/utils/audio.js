import { Howl } from 'howler';

const audioCache = {};

/**
 * Play an audio file. Falls back silently if file doesn't exist.
 * @param {string} src - Path to audio file, e.g. '/audio/lesson-1/nice-to-meet-you.mp3'
 * @returns {Promise<void>}
 */
export function playAudio(src) {
  return new Promise((resolve) => {
    try {
      if (!audioCache[src]) {
        audioCache[src] = new Howl({
          src: [src],
          html5: true,
          preload: true,
          onend: () => resolve(),
          onloaderror: () => {
            console.warn('Audio not found:', src);
            resolve();
          },
          onplayerror: () => {
            console.warn('Audio play failed:', src);
            resolve();
          },
        });
      }

      const sound = audioCache[src];
      sound.off('end').on('end', () => resolve());
      sound.play();
    } catch (err) {
      console.warn('Audio error:', src, err);
      resolve();
    }
  });
}

/**
 * Preload audio files so they're ready for instant playback.
 * @param {string[]} sources - Array of audio file paths
 */
export function preloadAudio(sources) {
  sources.forEach((src) => {
    if (!audioCache[src]) {
      audioCache[src] = new Howl({
        src: [src],
        html5: true,
        preload: true,
      });
    }
  });
}

/**
 * Stop all currently playing audio.
 */
export function stopAllAudio() {
  Object.values(audioCache).forEach((sound) => {
    try { sound.stop(); } catch (e) { /* ignore */ }
  });
}

/**
 * Generate the expected audio path for a lesson chunk.
 * Convention: /audio/lesson-{id}/{slug}.mp3
 */
export function getAudioPath(lessonId, englishText) {
  const slug = englishText
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  return `/audio/lesson-${lessonId}/${slug}.mp3`;
}
