import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Fire, Confetti as ConfettiIcon, CurrencyCircleDollar, Timer } from '@phosphor-icons/react';
import { storage } from '../utils/storage';
import { calculateDahabTimed } from '../utils/speedScore';
import SpeedBonusPopup from '../components/SpeedBonusPopup';
import { useLanguage } from '../utils/useLanguage';
import practiceFeatures from '../data/practiceFeatures';
import ChooseExercise from '../exercises/ChooseExercise';
import FillGapExercise from '../exercises/FillGapExercise';
import ScenarioExercise from '../exercises/ScenarioExercise';
import ScrambleExercise from '../exercises/ScrambleExercise';
import SentenceBuilderExercise from '../exercises/SentenceBuilderExercise';
import Geel from '../components/Geel';
import Confetti from '../components/Confetti';
import PrimaryButton from '../components/PrimaryButton';

const FEATURE_KEYS = Object.keys(practiceFeatures);
const EXERCISES_PER_FEATURE = 2;
const TOTAL_EXERCISES = FEATURE_KEYS.length * EXERCISES_PER_FEATURE;

function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function shuffleWithSeed(array, seed) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i) * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const FEATURE_COLORS = {
  vocabulary: '#0891B2',
  plurals: '#7C3AED',
  opposites: '#EA580C',
  wordformation: '#16A34A',
  conjugation: '#E11D48',
  sentencebuilder: '#2563EB',
};

export default function DailyPractice() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [exercises, setExercises] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [dahabResult, setDahabResult] = useState(null);
  const [showDahabAnimation, setShowDahabAnimation] = useState(false);
  const [sessionDahab, setSessionDahab] = useState(0);
  const [lastReward, setLastReward] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const exerciseStartRef = useRef(Date.now());
  const timerIntervalRef = useRef(null);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const seed = hashCode(today);
    const state = storage.get();

    if (state.dailyPractice?.date === today && state.dailyPractice?.exercises?.length > 0) {
      setExercises(state.dailyPractice.exercises);
      setCurrentIndex(state.dailyPractice.progress || 0);
      setCorrectCount(state.dailyPractice.correctCount || 0);
      if (state.dailyPractice.completed) {
        setDahabResult({ dahabEarned: state.dailyPractice.dahabEarned, dahabTier: state.dailyPractice.dahabTier });
        setCompleted(true);
      }
      return;
    }

    const allExercises = [];
    for (const key of FEATURE_KEYS) {
      const feature = practiceFeatures[key];
      const shuffled = shuffleWithSeed(
        feature.exercises.map((ex, i) => ({ ...ex, featureKey: key, _idx: i })),
        seed + hashCode(key)
      );
      allExercises.push(...shuffled.slice(0, EXERCISES_PER_FEATURE));
    }

    const shuffledAll = shuffleWithSeed(allExercises, seed);

    storage.update({
      dailyPractice: {
        date: today,
        progress: 0,
        completed: false,
        exercises: shuffledAll,
        correctCount: 0,
      },
    });

    setExercises(shuffledAll);
  }, []);

  // Start timer
  useEffect(() => {
    if (exercises.length === 0) return;
    exerciseStartRef.current = Date.now();
    timerIntervalRef.current = setInterval(() => {
      setElapsed(Date.now() - exerciseStartRef.current);
    }, 100);
    return () => clearInterval(timerIntervalRef.current);
  }, [exercises.length]);

  const getTimerColor = () => {
    if (elapsed < 2000) return '#8B5CF6';
    if (elapsed < 4000) return '#F59E0B';
    if (elapsed < 6000) return '#10B981';
    if (elapsed < 8000) return '#0891B2';
    return '#94A3B8';
  };

  const handleExerciseComplete = (wasCorrect) => {
    const responseTime = Date.now() - exerciseStartRef.current;
    const reward = calculateDahabTimed(responseTime, wasCorrect);

    if (reward.total > 0) {
      setLastReward(reward);
      setSessionDahab((prev) => prev + reward.total);
      setTimeout(() => setLastReward(null), 1500);
    }

    const newCorrect = wasCorrect ? correctCount + 1 : correctCount;
    setCorrectCount(newCorrect);
    const nextIndex = currentIndex + 1;

    storage.update({
      dailyPractice: {
        ...storage.get().dailyPractice,
        progress: nextIndex,
        correctCount: newCorrect,
      },
    });

    if (nextIndex >= exercises.length) {
      clearInterval(timerIntervalRef.current);
      // Store session dahab in the completion result
      const result = storage.completeDailyPractice(newCorrect);
      // Override dahab with speed-based total
      storage.update({ dahab: (storage.get().dahab || 0) + sessionDahab + reward.total });
      setDahabResult({ ...result, dahabEarned: sessionDahab + reward.total });
      setShowDahabAnimation(true);
      setTimeout(() => {
        setShowDahabAnimation(false);
        setCompleted(true);
      }, 2000);
    } else {
      setCurrentIndex(nextIndex);
      // Reset timer for next exercise
      exerciseStartRef.current = Date.now();
      setElapsed(0);
    }
  };

  if (exercises.length === 0) {
    return (
      <div style={{ background: '#0F172A', minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#94A3B8', fontFamily: 'Nunito, sans-serif' }}>Loading...</p>
      </div>
    );
  }

  const state = storage.get();
  const dailyStreak = state.dailyStreak || 0;

  // Dahab reward animation
  if (showDahabAnimation && dahabResult) {
    const isJackpot = dahabResult.dahabTier === 'jackpot';
    return (
      <div style={{
        background: '#0F172A', minHeight: '100dvh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        {isJackpot && <Confetti />}
        <div style={{
          width: 100, height: 100, borderRadius: '50%',
          background: isJackpot ? 'linear-gradient(135deg, #F59E0B, #FBBF24)' : '#1E293B',
          border: isJackpot ? 'none' : '3px solid #334155',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: isJackpot ? '0 0 40px rgba(245,158,11,0.6)' : '0 0 20px rgba(245,158,11,0.3)',
          animation: 'pop-in 0.4s ease',
        }}>
          <CurrencyCircleDollar size={48} weight="fill" color={isJackpot ? 'white' : '#F59E0B'} />
        </div>
        <p style={{
          fontSize: isJackpot ? 48 : 36, fontWeight: 900, color: '#F59E0B',
          fontFamily: 'Nunito, sans-serif', marginTop: 20,
          animation: 'pop-in 0.4s ease 0.2s both',
          textShadow: isJackpot ? '0 0 20px rgba(245,158,11,0.5)' : 'none',
        }}>
          +{dahabResult.dahabEarned}
        </p>
        <p style={{
          fontSize: 16, color: '#94A3B8', fontFamily: 'Nunito, sans-serif',
          animation: 'fade-in 0.3s ease 0.4s both',
        }}>
          {isJackpot ? 'JACKPOT!' : 'Dahab'}
        </p>
      </div>
    );
  }

  if (completed) {
    return (
      <div style={{ background: '#0F172A', minHeight: '100dvh', position: 'relative', overflow: 'hidden' }}>
        <Confetti />
        <div style={{ padding: '60px 24px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            width: 110, height: 110, borderRadius: '50%', background: '#1E293B',
            border: '3px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(8,145,178,0.3)',
          }}>
            <Geel size={75} expression="celebrating" />
          </div>

          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#F1F5F9', fontFamily: 'Nunito, sans-serif', marginTop: 20, textAlign: 'center' }}>
            {lang === 'en' ? 'Daily Complete!' : 'Maanta Waa La Dhammeeystay!'} <ConfettiIcon size={24} weight="fill" color="#FFC107" style={{ display: 'inline', verticalAlign: 'middle' }} />
          </h1>

          <p style={{ fontSize: 15, color: '#94A3B8', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginTop: 8 }}>
            {lang === 'en' ? 'Come back tomorrow to keep your streak!' : 'Berri soo noqo si aad u sii waddid!'}
          </p>

          <div style={{ display: 'flex', gap: 12, marginTop: 24, width: '100%' }}>
            <div style={{ flex: 1, background: '#1E293B', borderRadius: 14, padding: '16px 10px', textAlign: 'center' }}>
              <p style={{ fontSize: 28, fontWeight: 800, color: '#4CAF50', fontFamily: 'Nunito, sans-serif' }}>{correctCount}/{TOTAL_EXERCISES}</p>
              <p style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'Nunito, sans-serif', marginTop: 2 }}>{lang === 'en' ? 'Correct' : 'Sax'}</p>
            </div>
            <div style={{ flex: 1, background: '#1E293B', borderRadius: 14, padding: '16px 10px', textAlign: 'center' }}>
              <p style={{ fontSize: 28, fontWeight: 800, color: '#FFCA28', fontFamily: 'Nunito, sans-serif' }}>+{correctCount * 10}</p>
              <p style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'Nunito, sans-serif', marginTop: 2 }}>XP</p>
            </div>
            <div style={{
              flex: 1, borderRadius: 14, padding: '16px 10px', textAlign: 'center',
              background: dahabResult?.dahabTier === 'jackpot' ? 'linear-gradient(135deg, #F59E0B, #FBBF24)' : '#1E293B',
            }}>
              <p style={{ fontSize: 28, fontWeight: 800, color: dahabResult?.dahabTier === 'jackpot' ? '#1E293B' : '#F59E0B', fontFamily: 'Nunito, sans-serif' }}>
                +{dahabResult?.dahabEarned || 0}
              </p>
              <p style={{ fontSize: 11, color: dahabResult?.dahabTier === 'jackpot' ? '#1E293B' : '#94A3B8', fontFamily: 'Nunito, sans-serif', marginTop: 2 }}>Dahab</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, background: '#1E293B', padding: '12px 20px', borderRadius: 12 }}>
            <Fire size={24} weight="fill" color="#FF7043" />
            <span style={{ fontSize: 18, fontWeight: 800, color: '#FF7043', fontFamily: 'Nunito, sans-serif' }}>{dailyStreak}</span>
            <span style={{ fontSize: 14, color: '#94A3B8', fontFamily: 'Nunito, sans-serif', marginLeft: 4 }}>
              {lang === 'en' ? 'day streak!' : 'maalmood oo isku xigta!'}
            </span>
          </div>

          <div style={{ height: 24 }} />
          <PrimaryButton onClick={() => navigate('/progress')}>
            {lang === 'en' ? 'BACK TO PRACTICE' : 'KU NOQO XIRFADAHA'}
          </PrimaryButton>
        </div>
      </div>
    );
  }

  const exercise = exercises[currentIndex];
  const progress = (currentIndex / TOTAL_EXERCISES) * 100;
  const featureColor = FEATURE_COLORS[exercise.featureKey] || '#0891B2';

  const renderExercise = () => {
    const baseProps = { data: exercise, onComplete: handleExerciseComplete, practiceMode: true, dark: true };

    switch (exercise.type) {
      case 'choose':
        return <ChooseExercise key={currentIndex} {...baseProps} />;
      case 'fillgap':
        return <FillGapExercise key={currentIndex} {...baseProps} />;
      case 'scenario':
        return <ScenarioExercise key={currentIndex} {...baseProps} />;
      case 'scramble':
        return <ScrambleExercise key={currentIndex} data={exercise} featureColor={featureColor} onComplete={handleExerciseComplete} practiceMode dark={true} />;
      case 'sentenceBuilder':
        return <SentenceBuilderExercise key={currentIndex} data={exercise} featureColor={featureColor} onComplete={handleExerciseComplete} practiceMode dark={true} />;
      default:
        return <ChooseExercise key={currentIndex} {...baseProps} />;
    }
  };

  return (
    <div style={{ background: '#0F172A', minHeight: '100dvh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Top gradient glow */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 100,
        background: `linear-gradient(to bottom, ${featureColor}15, transparent)`,
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 1 }}>
        <button onClick={() => navigate('/progress')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <X size={22} weight="bold" color="#94A3B8" />
        </button>
        <div style={{ flex: 1, height: 8, borderRadius: 4, background: '#334155', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 4,
            background: `linear-gradient(90deg, ${featureColor}, ${featureColor}aa)`,
            width: `${progress}%`,
            transition: 'width 0.4s ease, background 0.3s ease',
          }} />
        </div>
        {/* Timer */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          fontSize: 14, fontWeight: 600, fontFamily: 'Nunito, sans-serif',
          color: getTimerColor(), transition: 'color 0.3s ease',
          marginRight: 6,
        }}>
          <Timer size={14} weight="fill" />
          {(elapsed / 1000).toFixed(1)}s
        </div>
        {/* Dahab counter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <CurrencyCircleDollar size={16} weight="fill" color="#F59E0B" />
          <span style={{
            fontSize: 14, fontWeight: 800, fontFamily: 'Nunito, sans-serif',
            color: sessionDahab > 0 ? '#D97706' : '#94A3B8',
            minWidth: 24, textAlign: 'right', transition: 'color 0.3s',
          }}>
            {sessionDahab}
          </span>
        </div>
      </div>

      <div style={{ padding: '8px 20px 0', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, position: 'relative', zIndex: 1 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8, background: featureColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontSize: 13, fontWeight: 800, fontFamily: 'Nunito, sans-serif',
          transition: 'background 0.3s ease',
        }}>
          {currentIndex + 1}
        </div>
        <span style={{
          fontSize: 11, fontWeight: 700, color: featureColor,
          fontFamily: 'Nunito, sans-serif', textTransform: 'uppercase', letterSpacing: 0.5,
          background: `${featureColor}20`, padding: '3px 8px', borderRadius: 6,
          transition: 'color 0.3s ease, background 0.3s ease',
        }}>
          {exercise.featureKey}
        </span>
      </div>

      {/* Speed bonus popup */}
      {lastReward && lastReward.total > 0 && (
        <SpeedBonusPopup dahab={lastReward.total} label={lastReward.label} color={lastReward.color} />
      )}

      <div style={{ padding: '0 20px 8px', position: 'relative', zIndex: 1 }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: '#F1F5F9', fontFamily: 'Nunito, sans-serif' }}>
          {exercise.instruction}
        </p>
      </div>

      <div style={{ flex: 1, padding: '0 20px 120px', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
        {renderExercise()}
      </div>

      {/* Bottom subtle tint */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 120,
        background: `linear-gradient(to top, ${featureColor}08, transparent)`,
        pointerEvents: 'none', zIndex: 0,
      }} />
    </div>
  );
}
