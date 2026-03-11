const STORAGE_KEY = 'baro-ingiriisi';

function defaultState() {
  return {
    onboardingComplete: false,
    intent: null,
    comfort: null,
    guestMode: true,
    currentLesson: 1,
    lessonsCompleted: [],
    xp: 0,
    streak: 0,
    lastActiveDate: null,
    longestStreak: 0,
    language: 'so',
    authComplete: false,
    profileComplete: false,
    userId: null,
    userName: '',
    username: '',
    userEmail: '',
    userPhone: '',
    userBirthday: '',
    userCity: '',
    practiceCompleted: {},
  };
}

function getToday() {
  return new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
}

function getYesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

export const storage = {
  get() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? { ...defaultState(), ...JSON.parse(raw) } : defaultState();
    } catch {
      return defaultState();
    }
  },

  set(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Storage write failed:', e);
    }
  },

  update(partial) {
    const current = this.get();
    this.set({ ...current, ...partial });
  },

  reset() {
    localStorage.removeItem(STORAGE_KEY);
  },

  completeLesson(lessonId) {
    const current = this.get();
    const completed = current.lessonsCompleted || [];
    if (!completed.includes(lessonId)) {
      completed.push(lessonId);
    }

    // Streak logic
    const today = getToday();
    const yesterday = getYesterday();
    let { streak, lastActiveDate, longestStreak } = current;

    if (lastActiveDate === today) {
      // Already active today, no streak change
    } else if (lastActiveDate === yesterday) {
      // Consecutive day — increment streak
      streak += 1;
    } else {
      // Missed a day (or first time) — reset to 1
      streak = 1;
    }

    if (streak > (longestStreak || 0)) {
      longestStreak = streak;
    }

    this.set({
      ...current,
      lessonsCompleted: completed,
      currentLesson: Math.min(Math.max(current.currentLesson, lessonId + 1), 10),
      xp: (current.xp || 0) + 10,
      streak,
      lastActiveDate: today,
      longestStreak,
    });
  },

  // Call this on app load to check if streak should reset
  checkStreak() {
    const current = this.get();
    const today = getToday();
    const yesterday = getYesterday();

    if (current.lastActiveDate && current.lastActiveDate !== today && current.lastActiveDate !== yesterday) {
      // Missed a day — reset streak
      this.update({ streak: 0 });
    }
  },
};
