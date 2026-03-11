import { useMemo } from 'react';

const COLORS = ['#4CAF50', '#FFC107', '#2196F3', '#F44336', '#9C27B0', '#FF9800'];

export default function Confetti() {
  const particles = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 0.8,
      size: 6 + Math.random() * 4,
    }));
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50, overflow: 'hidden' }}>
      {particles.map((p) => (
        <div
          key={p.id}
          className="animate-confetti"
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: '-10px',
            width: p.size,
            height: p.size,
            borderRadius: 2,
            background: p.color,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
