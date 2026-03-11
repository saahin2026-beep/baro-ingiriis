import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, Confetti as ConfettiIcon } from '@phosphor-icons/react';
import { storage } from '../utils/storage';
import practiceFeatures from '../data/practiceFeatures';
import ChooseExercise from '../exercises/ChooseExercise';
import FillGapExercise from '../exercises/FillGapExercise';
import ScenarioExercise from '../exercises/ScenarioExercise';
import ScrambleExercise from '../exercises/ScrambleExercise';
import SentenceBuilderExercise from '../exercises/SentenceBuilderExercise';
import Geel from '../components/Geel';
import Confetti from '../components/Confetti';
import PrimaryButton from '../components/PrimaryButton';

export default function PracticeSession() {
  const { featureKey } = useParams();
  const navigate = useNavigate();
  const feature = practiceFeatures[featureKey];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [completed, setCompleted] = useState(false);

  if (!feature) { navigate('/progress'); return null; }

  const exercise = feature.exercises[currentIndex];

  const handleExerciseComplete = (wasCorrect) => {
    if (wasCorrect) setCorrectCount((c) => c + 1);
    const nextIndex = currentIndex + 1;
    storage.update({ [`practice_${featureKey}_progress`]: nextIndex });

    if (nextIndex >= feature.exercises.length) {
      const state = storage.get();
      const pc = state.practiceCompleted || {};
      pc[featureKey] = true;
      storage.update({ practiceCompleted: pc, [`practice_${featureKey}_progress`]: feature.exercises.length });
      setCompleted(true);
    } else {
      setCurrentIndex(nextIndex);
    }
  };

  const progress = (currentIndex / feature.exercises.length) * 100;
  const accuracyPct = completed ? Math.round((correctCount / feature.exercises.length) * 100) : 0;

  if (completed) {
    return (
      <div style={{ background: 'white', minHeight: '100dvh', position: 'relative', overflow: 'hidden' }}>
        <Confetti />
        <div style={{ padding: '60px 24px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            width: 110, height: 110, borderRadius: '50%', background: feature.bg,
            border: `3px solid ${feature.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 4px 16px ${feature.color}33`,
          }}>
            <Geel size={75} expression="celebrating" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#333', fontFamily: 'Nunito, sans-serif', marginTop: 20, textAlign: 'center' }}>
            Hambalyo! <ConfettiIcon size={24} weight="fill" color="#FFC107" style={{ display: 'inline', verticalAlign: 'middle' }} />
          </h1>
          <p style={{ fontSize: 15, color: '#757575', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginTop: 8 }}>
            Waxaad dhammaysay {feature.title}
          </p>

          {/* Accuracy stats */}
          <div style={{ display: 'flex', gap: 12, marginTop: 24, width: '100%' }}>
            <div style={{ flex: 1, background: '#E8F5E9', borderRadius: 14, padding: '16px 10px', textAlign: 'center' }}>
              <p style={{ fontSize: 28, fontWeight: 800, color: '#4CAF50', fontFamily: 'Nunito, sans-serif' }}>{correctCount}/{feature.exercises.length}</p>
              <p style={{ fontSize: 11, color: '#757575', fontFamily: 'Nunito, sans-serif', marginTop: 2 }}>Sax</p>
            </div>
            <div style={{ flex: 1, background: accuracyPct >= 70 ? '#E8F5E9' : '#FFF3E0', borderRadius: 14, padding: '16px 10px', textAlign: 'center' }}>
              <p style={{ fontSize: 28, fontWeight: 800, color: accuracyPct >= 70 ? '#4CAF50' : '#FF9800', fontFamily: 'Nunito, sans-serif' }}>{accuracyPct}%</p>
              <p style={{ fontSize: 11, color: '#757575', fontFamily: 'Nunito, sans-serif', marginTop: 2 }}>Saxnaan</p>
            </div>
          </div>

          {accuracyPct < 70 && (
            <p style={{ fontSize: 13, color: '#FF9800', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginTop: 12 }}>
              Isku day mar kale si aad u hesho 70%+
            </p>
          )}

          <div style={{ height: 24 }} />
          <PrimaryButton onClick={() => navigate('/progress')}>KU NOQO XIRFADAHA</PrimaryButton>
          {accuracyPct < 100 && (
            <>
              <div style={{ height: 10 }} />
              <PrimaryButton variant="secondary" onClick={() => {
                setCurrentIndex(0); setCorrectCount(0); setCompleted(false);
                storage.update({ [`practice_${featureKey}_progress`]: 0 });
                const state = storage.get();
                const pc = state.practiceCompleted || {};
                delete pc[featureKey];
                storage.update({ practiceCompleted: pc });
              }}>MAR KALE KU CELI</PrimaryButton>
            </>
          )}
        </div>
      </div>
    );
  }

  const renderExercise = () => {
    const baseProps = { data: exercise, onComplete: handleExerciseComplete, practiceMode: true };

    switch (exercise.type) {
      case 'choose':
        return <ChooseExercise key={currentIndex} {...baseProps} />;
      case 'fillgap':
        return <FillGapExercise key={currentIndex} {...baseProps} />;
      case 'scenario':
        return <ScenarioExercise key={currentIndex} {...baseProps} />;
      case 'scramble':
        return <ScrambleExercise key={currentIndex} data={exercise} featureColor={feature.color} onComplete={handleExerciseComplete} practiceMode />;
      case 'sentenceBuilder':
        return <SentenceBuilderExercise key={currentIndex} data={exercise} featureColor={feature.color} onComplete={handleExerciseComplete} practiceMode />;
      default:
        return <ChooseExercise key={currentIndex} {...baseProps} />;
    }
  };

  return (
    <div style={{ background: 'white', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => navigate('/progress')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <X size={22} weight="bold" color="#757575" />
        </button>
        <div style={{ flex: 1, height: 8, borderRadius: 4, background: '#E0E0E0', overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 4, background: feature.color, width: `${progress}%`, transition: 'width 0.4s ease' }} />
        </div>
        <span style={{ fontSize: 13, fontWeight: 800, color: feature.color, fontFamily: 'Nunito, sans-serif' }}>
          {currentIndex + 1}/{feature.exercises.length}
        </span>
      </div>

      <div style={{ padding: '8px 20px 0', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: feature.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 13, fontWeight: 800, fontFamily: 'Nunito, sans-serif' }}>
          {currentIndex + 1}
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#9E9E9E', fontFamily: 'Nunito, sans-serif', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {exercise.type}
        </span>
      </div>

      <div style={{ padding: '0 20px 8px' }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: '#333', fontFamily: 'Nunito, sans-serif' }}>{exercise.instruction}</p>
      </div>

      <div style={{ flex: 1, padding: '0 20px 120px', display: 'flex', flexDirection: 'column' }}>
        {renderExercise()}
      </div>
    </div>
  );
}
