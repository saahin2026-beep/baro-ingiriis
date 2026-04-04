import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, CurrencyCircleDollar, Timer } from '@phosphor-icons/react';
import { useData } from '../utils/DataContext';
import { storage } from '../utils/storage';
import { calculateDahab } from '../utils/speedScore';
import ExerciseWrapper from '../components/ExerciseWrapper';
import ProgressBar from '../components/ProgressBar';
import SpeedBonusPopup from '../components/SpeedBonusPopup';
import ChooseExercise from '../exercises/ChooseExercise';
import FillGapExercise from '../exercises/FillGapExercise';
import OrderExercise from '../exercises/OrderExercise';
import ListenChooseExercise from '../exercises/ListenChooseExercise';
import ScenarioExercise from '../exercises/ScenarioExercise';

const EXERCISE_MAP = {
  choose: ChooseExercise,
  fillgap: FillGapExercise,
  order: OrderExercise,
  listen: ListenChooseExercise,
  scenario: ScenarioExercise,
};

export default function LessonPlay() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lessonData } = useData();
  const data = lessonData?.[id];
  const [currentExercise, setCurrentExercise] = useState(0);
  const [exerciseKey, setExerciseKey] = useState(0);
  const [sessionDahab, setSessionDahab] = useState(0);
  const [lastReward, setLastReward] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const exerciseStartRef = useRef(Date.now());
  const timerIntervalRef = useRef(null);

  if (!data) { navigate('/home'); return null; }

  const exercise = data.exercises[currentExercise];
  const ExerciseComponent = EXERCISE_MAP[exercise.type];
  const enrichedData = { ...exercise, lessonId: Number(id) };

  // Start timer for each exercise
  if (!timerIntervalRef.current) {
    timerIntervalRef.current = setInterval(() => {
      setElapsed(Date.now() - exerciseStartRef.current);
    }, 100);
  }

  const getTimerColor = () => {
    if (elapsed < 2000) return '#8B5CF6';
    if (elapsed < 4000) return '#F59E0B';
    if (elapsed < 6000) return '#10B981';
    if (elapsed < 8000) return '#0891B2';
    return '#94A3B8';
  };

  const handleNext = (wasCorrect = true) => {
    const responseTime = Date.now() - exerciseStartRef.current;
    const reward = calculateDahab(responseTime, wasCorrect);

    if (reward.total > 0) {
      setLastReward(reward);
      setSessionDahab((prev) => prev + reward.total);
      setTimeout(() => setLastReward(null), 1500);
    }

    if (currentExercise < 4) {
      setCurrentExercise((p) => p + 1);
      setExerciseKey((p) => p + 1);
      // Reset timer for next exercise
      exerciseStartRef.current = Date.now();
      setElapsed(0);
    } else {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
      navigate(`/lesson/${id}/complete`, {
        state: { dahabEarned: sessionDahab + reward.total }
      });
    }
  };

  return (
    <div style={{ background: '#0F172A', minHeight: '100dvh', display: 'flex', flexDirection: 'column', animation: 'darkFadeIn 0.3s ease-out' }}>
      <div style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => { clearInterval(timerIntervalRef.current); navigate('/home'); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <X size={22} weight="bold" color="#94A3B8" />
        </button>
        <div style={{ flex: 1 }}>
          <ProgressBar current={currentExercise + 1} total={5} dark={true} color="#4CAF50" />
        </div>

        {/* Timer */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          fontSize: 14, fontWeight: 600, fontFamily: 'Nunito, sans-serif',
          color: getTimerColor(), transition: 'color 0.3s ease',
          marginRight: 8,
        }}>
          <Timer size={14} weight="fill" />
          {(elapsed / 1000).toFixed(1)}s
        </div>

        {/* Dahab counter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <CurrencyCircleDollar size={16} weight="fill" color="#F59E0B" />
          <span style={{
            fontSize: 15, fontWeight: 800, fontFamily: 'Nunito, sans-serif',
            color: sessionDahab > 0 ? '#D97706' : '#94A3B8',
            minWidth: 28, textAlign: 'right', transition: 'color 0.3s',
          }}>
            {sessionDahab}
          </span>
        </div>
      </div>

      {/* Speed bonus popup */}
      {lastReward && lastReward.total > 0 && (
        <SpeedBonusPopup dahab={lastReward.total} label={lastReward.label} color={lastReward.color} />
      )}

      <ExerciseWrapper instruction={exercise.instruction} dark={true}>
        <ExerciseComponent key={exerciseKey} data={enrichedData} onComplete={handleNext} dark={true} />
      </ExerciseWrapper>
    </div>
  );
}
