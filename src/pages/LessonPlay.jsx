import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../utils/DataContext';
import GreenTopBar from '../components/GreenTopBar';
import ExerciseWrapper from '../components/ExerciseWrapper';
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

  if (!data) { navigate('/home'); return null; }

  const exercise = data.exercises[currentExercise];
  const ExerciseComponent = EXERCISE_MAP[exercise.type];

  const enrichedData = { ...exercise, lessonId: Number(id) };

  const handleNext = () => {
    if (currentExercise < 4) {
      setCurrentExercise((p) => p + 1);
      setExerciseKey((p) => p + 1);
    } else {
      navigate(`/lesson/${id}/complete`);
    }
  };

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <GreenTopBar
        leftIcon="✕"
        leftOnClick={() => navigate('/home')}
        rightContent={
          <span style={{ fontSize: 13, fontWeight: 700, color: 'white', fontFamily: 'Nunito, sans-serif' }}>
            {currentExercise + 1}/5
          </span>
        }
        progressCurrent={currentExercise + 1}
        progressTotal={5}
      />
      <ExerciseWrapper instruction={exercise.instruction}>
        <ExerciseComponent key={exerciseKey} data={enrichedData} onComplete={handleNext} />
      </ExerciseWrapper>
    </div>
  );
}
