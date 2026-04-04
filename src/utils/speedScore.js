// Speed tier configuration (for Daily Mix only)
export const SPEED_TIERS = {
  lightning: { maxMs: 2000, bonus: 20, label: 'Lightning', color: '#8B5CF6' },
  fast: { maxMs: 4000, bonus: 15, label: 'Fast', color: '#F59E0B' },
  quick: { maxMs: 6000, bonus: 10, label: 'Quick', color: '#10B981' },
  good: { maxMs: 8000, bonus: 5, label: 'Good', color: '#0891B2' },
  normal: { maxMs: 12000, bonus: 2, label: '', color: '#64748B' },
  slow: { maxMs: Infinity, bonus: 1, label: '', color: '#94A3B8' },
};

// Fixed Dahab for lessons (no timer)
export const LESSON_DAHAB_PER_CORRECT = 5;

export function getSpeedTier(responseTimeMs) {
  for (const [tier, config] of Object.entries(SPEED_TIERS)) {
    if (responseTimeMs <= config.maxMs) {
      return { tier, bonus: config.bonus, label: config.label, color: config.color };
    }
  }
  return { tier: 'slow', bonus: 1, label: '', color: '#94A3B8' };
}

// Daily Mix: speed-based Dahab
export function calculateDahabTimed(responseTimeMs, isCorrect) {
  if (!isCorrect) return { total: 0, tier: 'wrong', label: '', color: '#EF4444' };
  const { tier, bonus, label, color } = getSpeedTier(responseTimeMs);
  return { total: bonus, tier, label, color };
}

// Lessons: fixed +5 Dahab per correct
export function calculateDahabLesson(isCorrect) {
  if (!isCorrect) return { total: 0, tier: 'wrong', label: '', color: '#EF4444' };
  return { total: LESSON_DAHAB_PER_CORRECT, tier: 'lesson', label: '', color: '#10B981' };
}

export function calculateAvgSpeedScore(attempts) {
  const correct = attempts.filter(a => a.correct);
  if (correct.length === 0) return 0;
  const total = correct.reduce((sum, a) => sum + getSpeedTier(a.response_time_ms).bonus, 0);
  return Math.round((total / correct.length) * 100) / 100;
}
