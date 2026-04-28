import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import LessonComplete from '../LessonComplete';
import { storage } from '../../utils/storage';

const mockRecordLessonCompletion = vi.fn(() => ({
  streakIncreased: true, currentStreak: 1, milestone: null, xpMultiplier: { multiplier: 1, hoursLeft: 0, label: null },
}));

vi.mock('../../utils/streak', async () => {
  const actual = await vi.importActual('../../utils/streak');
  return { ...actual, recordLessonCompletion: () => mockRecordLessonCompletion() };
});

vi.mock('../../utils/observability', () => ({ trackEvent: vi.fn() }));

vi.mock('../../utils/DataContext', () => ({
  useData: () => ({
    lessonData: {
      1: { id: 1, titleSo: 'Casharka 1', titleEn: 'Lesson 1', exercises: [], chunks: [] },
      2: { id: 2, titleSo: 'Casharka 2', titleEn: 'Lesson 2', exercises: [], chunks: [] },
    },
    getRandomPhrase: () => ({ text: 'Mahadsanid!', emoji: 'star' }),
  }),
}));

function renderAt(lessonId, locationState) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: `/lesson/${lessonId}/complete`, state: locationState }]}>
      <Routes>
        <Route path="/lesson/:id/complete" element={<LessonComplete />} />
        <Route path="/home" element={<div>HOME</div>} />
        <Route path="/lesson/:id" element={<div>LESSON-INTRO</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  localStorage.clear();
  mockRecordLessonCompletion.mockClear();
});

describe('LessonComplete', () => {
  it('writes the lesson to storage and increments the streak on mount', async () => {
    renderAt(1, { dahabEarned: 7 });

    await waitFor(() => {
      const s = storage.get();
      expect(s.lessonsCompleted).toContain(1);
    });
    expect(storage.get().dahab).toBe(7);
    expect(storage.get().xp).toBe(10);
    expect(mockRecordLessonCompletion).toHaveBeenCalledTimes(1);
  });

  it('falls back to a default 5 dahab when no location.state is provided', async () => {
    renderAt(1, undefined);
    await waitFor(() => {
      expect(storage.get().lessonsCompleted).toContain(1);
    });
    expect(storage.get().dahab).toBe(5);
  });

  it('redirects to /home if the lesson id does not exist in lessonData', async () => {
    renderAt(99, { dahabEarned: 5 });
    await screen.findByText('HOME');
  });

  it('does not double-write when the same lesson id is completed twice in storage', async () => {
    storage.completeLesson(1, 5); // pretend the user already completed it
    renderAt(1, { dahabEarned: 5 });
    await waitFor(() => expect(mockRecordLessonCompletion).toHaveBeenCalled());
    // lessonsCompleted should still be deduplicated
    expect(storage.get().lessonsCompleted.filter((x) => x === 1)).toHaveLength(1);
  });
});
