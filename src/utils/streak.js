/**
 * Streak system with milestones, freezes, and XP multipliers.
 *
 * IMPORTANT: this is the richer of TWO parallel streak systems in the
 * codebase. The simpler one lives in storage.js (`completeLesson`,
 * `checkStreak`) and is invoked directly by lesson completion. This
 * one is invoked by GeelWorld and AppShell streak modals. They store
 * to different localStorage keys (`hadaling-streak` vs the main
 * `hadaling:state` blob) and they don't auto-sync — changes in one
 * don't propagate to the other.
 *
 * Long-term cleanup is to consolidate into a single source of truth.
 * Don't add new code that mixes the two systems. See docs/ARCHITECTURE.md
 * §8 for context.
 *
 * MILESTONES, freeze pricing, and tier rewards are configured at the
 * top of this file. Changing any of them is a gameplay change —
 * update the doc and the tests.
 */

const STREAK_KEY = 'hadaling-streak';

export const MILESTONES = {
  3:   { dahab: 10,  xpMultiplier: null, xpDuration: 0,  badge: '🔥' },
  7:   { dahab: 25,  xpMultiplier: 2,    xpDuration: 24, badge: '🔥' },
  14:  { dahab: 50,  xpMultiplier: null, xpDuration: 0,  badge: '💪' },
  30:  { dahab: 100, xpMultiplier: null, xpDuration: 0,  badge: '🐪' },
  60:  { dahab: 200, xpMultiplier: null, xpDuration: 0,  badge: '⭐' },
  100: { dahab: 500, xpMultiplier: null, xpDuration: 0,  badge: '👑' },
};

function getDefaultStreakData() {
  return {
    currentStreak: 0,
    longestStreak: 0,
    lastLessonDate: null,
    freezesOwned: 0,
    milestonesClaimed: { 3: false, 7: false, 14: false, 30: false, 60: false, 100: false },
    xpMultiplier: 1.0,
    xpMultiplierExpiresAt: null,
  };
}

export function getStreakData() {
  const stored = localStorage.getItem(STREAK_KEY);
  if (stored) return { ...getDefaultStreakData(), ...JSON.parse(stored) };
  return getDefaultStreakData();
}

export function saveStreakData(data) {
  localStorage.setItem(STREAK_KEY, JSON.stringify(data));
}

export function getTodayDate() {
  return new Date().toLocaleDateString('en-CA');
}

export function getYesterdayDate() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString('en-CA');
}

export function hasCompletedLessonToday() {
  return getStreakData().lastLessonDate === getTodayDate();
}

export function getActiveXPMultiplier() {
  const data = getStreakData();
  if (data.xpMultiplier > 1 && data.xpMultiplierExpiresAt) {
    const expiresAt = new Date(data.xpMultiplierExpiresAt);
    if (new Date() < expiresAt) {
      const hoursLeft = Math.ceil((expiresAt - new Date()) / (1000 * 60 * 60));
      return { multiplier: data.xpMultiplier, hoursLeft, label: `${data.xpMultiplier}x XP (${hoursLeft}h)` };
    }
  }
  return { multiplier: 1, hoursLeft: 0, label: null };
}

export function checkStreakStatus() {
  const data = getStreakData();
  const today = getTodayDate();
  const yesterday = getYesterdayDate();

  if (data.lastLessonDate === today) {
    return { status: 'active', streak: data.currentStreak };
  }

  if (data.lastLessonDate === yesterday) {
    return { status: 'pending', streak: data.currentStreak, message: 'Cashar dhameystir si aad streak-kaaga u ilaaliso!' };
  }

  if (data.lastLessonDate && data.lastLessonDate < yesterday) {
    const lastDate = new Date(data.lastLessonDate);
    const todayDate = new Date(today);
    const daysMissed = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24)) - 1;

    if (data.freezesOwned > 0 && data.freezesOwned >= daysMissed) {
      const newData = { ...data, freezesOwned: data.freezesOwned - daysMissed, lastLessonDate: yesterday };
      saveStreakData(newData);
      return { status: 'freeze_used', streak: data.currentStreak, freezesUsed: daysMissed, freezesRemaining: newData.freezesOwned };
    }

    const lostStreak = data.currentStreak;
    const newData = { ...data, currentStreak: 0, freezesOwned: 0, milestonesClaimed: { 3: false, 7: false, 14: false, 30: false, 60: false, 100: false } };
    saveStreakData(newData);
    return { status: 'broken', streak: 0, lostStreak };
  }

  return { status: 'new', streak: 0 };
}

export function recordLessonCompletion() {
  const data = getStreakData();
  const today = getTodayDate();
  const yesterday = getYesterdayDate();

  if (data.lastLessonDate === today) {
    return { streakIncreased: false, currentStreak: data.currentStreak, milestone: null, xpMultiplier: getActiveXPMultiplier() };
  }

  const newStreak = (data.lastLessonDate === yesterday || data.lastLessonDate === null) ? data.currentStreak + 1 : 1;

  let milestone = null;
  const newMilestonesClaimed = { ...data.milestonesClaimed };

  if (MILESTONES[newStreak] && !data.milestonesClaimed[newStreak]) {
    const config = MILESTONES[newStreak];
    milestone = { day: newStreak, dahab: config.dahab, xpMultiplier: config.xpMultiplier, xpDuration: config.xpDuration, badge: config.badge };
    newMilestonesClaimed[newStreak] = true;
  }

  let newXpMultiplier = data.xpMultiplier;
  let newXpExpiresAt = data.xpMultiplierExpiresAt;

  if (milestone?.xpMultiplier) {
    newXpMultiplier = milestone.xpMultiplier;
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + milestone.xpDuration);
    newXpExpiresAt = expiresAt.toISOString();
  }

  const newData = {
    ...data,
    currentStreak: newStreak,
    longestStreak: Math.max(data.longestStreak, newStreak),
    lastLessonDate: today,
    milestonesClaimed: newMilestonesClaimed,
    xpMultiplier: newXpMultiplier,
    xpMultiplierExpiresAt: newXpExpiresAt,
  };
  saveStreakData(newData);

  return {
    streakIncreased: true,
    currentStreak: newStreak,
    previousStreak: data.currentStreak,
    milestone,
    isNewRecord: newStreak > data.longestStreak,
    xpMultiplier: getActiveXPMultiplier(),
  };
}

export function purchaseStreakFreeze(currentDahab, deductDahabFn) {
  const data = getStreakData();
  if (data.freezesOwned >= 2) return { success: false, message: 'Waad haysataa 2 freeze (ugu badan).' };
  if (currentDahab < 50) return { success: false, message: `50 Dahab ayaad u baahan tahay. Waad haysataa ${currentDahab}.` };

  deductDahabFn(50);
  const newData = { ...data, freezesOwned: data.freezesOwned + 1 };
  saveStreakData(newData);
  return { success: true, freezesOwned: newData.freezesOwned, message: `Streak freeze waa la iibsaday! Waad haysataa ${newData.freezesOwned}.` };
}

export function getNextMilestone(currentStreak) {
  const keys = Object.keys(MILESTONES).map(Number).sort((a, b) => a - b);
  for (const day of keys) {
    if (day > currentStreak) return { day, daysLeft: day - currentStreak, reward: MILESTONES[day] };
  }
  return null;
}

export function getStreakTier(streak) {
  if (streak >= 100) return { label: 'Legend', color: '#F59E0B', icon: '👑' };
  if (streak >= 60) return { label: 'Champion', color: '#8B5CF6', icon: '⭐' };
  if (streak >= 30) return { label: '1 Bil', color: '#10B981', icon: '🐪' };
  if (streak >= 14) return { label: '2 Toddobaad', color: '#0891B2', icon: '💪' };
  if (streak >= 7) return { label: '1 Toddobaad', color: '#EF4444', icon: '🔥' };
  if (streak >= 3) return { label: 'Bilaabay', color: '#64748B', icon: '✨' };
  return { label: 'Cusub', color: '#94A3B8', icon: '🌱' };
}
