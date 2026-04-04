import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { Timer } from '@phosphor-icons/react';

const ExerciseTimer = forwardRef(function ExerciseTimer({ isPaused = false }, ref) {
  const [elapsed, setElapsed] = useState(0);
  const startTimeRef = useRef(Date.now());

  useImperativeHandle(ref, () => ({
    getElapsed: () => Date.now() - startTimeRef.current,
    reset: () => {
      startTimeRef.current = Date.now();
      setElapsed(0);
    },
  }));

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setElapsed(Date.now() - startTimeRef.current);
    }, 100);
    return () => clearInterval(interval);
  }, [isPaused]);

  const seconds = (elapsed / 1000).toFixed(1);

  const getColor = () => {
    if (elapsed < 2000) return '#8B5CF6';
    if (elapsed < 4000) return '#F59E0B';
    if (elapsed < 6000) return '#10B981';
    if (elapsed < 8000) return '#0891B2';
    return '#94A3B8';
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 4,
      fontSize: 14, fontWeight: 600, fontFamily: 'Nunito, sans-serif',
      color: getColor(), transition: 'color 0.3s ease',
    }}>
      <Timer size={16} weight="fill" />
      {seconds}s
    </div>
  );
});

export default ExerciseTimer;
