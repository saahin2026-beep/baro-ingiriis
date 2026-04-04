import { createContext, useContext, useState, useEffect } from 'react';
import { fetchLessons, fetchPhrases, fetchOnboardingContent } from './dataService';

import hardcodedLessonData from '../data/lessonData';
import { lessons as hardcodedLessonsList } from '../data/lessons';
import {
  feedbackPhrases as hardcodedFeedback,
  encouragementPhrases as hardcodedEncouragement,
  celebrationPhrases as hardcodedCelebration,
} from '../data/phrases';

const DataContext = createContext(null);

function getInitialLessons() {
  try {
    const cached = localStorage.getItem('hadaling-data-cache');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed.lessonData && Object.keys(parsed.lessonData).length > 0) return parsed;
    }
  } catch {}
  return { lessonData: hardcodedLessonData, lessonsList: hardcodedLessonsList };
}

function getInitialPhrases() {
  try {
    const cached = localStorage.getItem('hadaling-phrases-cache');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed.feedback && parsed.feedback.length > 0) return parsed;
    }
  } catch {}
  return {
    feedback: hardcodedFeedback,
    encouragement: hardcodedEncouragement,
    celebration: hardcodedCelebration,
  };
}

export function DataProvider({ children }) {
  const [lessonData, setLessonData] = useState(() => getInitialLessons().lessonData);
  const [lessonsList, setLessonsList] = useState(() => getInitialLessons().lessonsList);
  const [phrases, setPhrases] = useState(() => getInitialPhrases());
  const [onboardingContent, setOnboardingContent] = useState(null);

  // Silent background sync
  useEffect(() => {
    async function syncFromSupabase() {
      try {
        const lessonsResult = await fetchLessons();
        if (lessonsResult?.lessonData && Object.keys(lessonsResult.lessonData).length > 0) {
          setLessonData(lessonsResult.lessonData);
          setLessonsList(lessonsResult.lessonsList);
        }
      } catch {}

      try {
        const phrasesResult = await fetchPhrases();
        if (phrasesResult?.feedback?.length > 0) {
          setPhrases(phrasesResult);
        }
      } catch {}

      try {
        const onboardingResult = await fetchOnboardingContent();
        if (onboardingResult) setOnboardingContent(onboardingResult);
      } catch {}
    }

    syncFromSupabase();
  }, []);

  const getRandomPhrase = (category) => {
    const list = phrases?.[category];
    if (!list || list.length === 0) return { text: '', emoji: '' };
    return list[Math.floor(Math.random() * list.length)];
  };

  return (
    <DataContext.Provider value={{ lessonData, lessonsList, phrases, loading: false, getRandomPhrase, onboardingContent }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
