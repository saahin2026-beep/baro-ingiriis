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
 * Generate the audio path for a lesson chunk.
 * @param {number} lessonId - Lesson number (1-10)
 * @param {string} chunkId - Chunk ID like "1-A", "2-B", etc.
 * @returns {string} Path like /audio/lessons/lesson-1/1-a.mp3
 */
export function getChunkAudioPath(lessonId, chunkId) {
  return `/audio/lessons/lesson-${lessonId}/${chunkId.toLowerCase()}.mp3`;
}

/**
 * Generate the audio path for a listen exercise.
 * @param {number} lessonId - Lesson number (1-10)
 * @param {number} exerciseIndex - Exercise index (1-based, usually 5)
 * @returns {string} Path like /audio/lessons/lesson-1/listen-5.mp3
 */
export function getListenAudioPath(lessonId, exerciseIndex = 5) {
  return `/audio/lessons/lesson-${lessonId}/listen-${exerciseIndex}.mp3`;
}

/**
 * Generate the audio path for Word of the Day.
 * @param {string} englishWord - The English word/phrase
 * @returns {string} Path like /audio/wotd/hello.mp3
 */
export function getWotdAudioPath(englishWord) {
  const slug = englishWord
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return `/audio/wotd/${slug}.mp3`;
}

/**
 * Generate the audio path for practice exercises.
 * @param {string} module - Practice module: 'vocabulary', 'word-formation', 'sentence-builder'
 * @param {string} text - The English text or sentence number
 * @returns {string} Path like /audio/practice/vocabulary/mother.mp3
 */
export function getPracticeAudioPath(module, text) {
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return `/audio/practice/${module}/${slug}.mp3`;
}

/**
 * Legacy function - maps to new chunk audio path.
 * @deprecated Use getChunkAudioPath instead
 */
export function getAudioPath(lessonId, englishText) {
  const slug = englishText
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  return `/audio/lessons/lesson-${lessonId}/${slug}.mp3`;
}
