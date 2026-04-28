import { useEffect } from 'react';

const COLORS = {
  info: { bg: '#0891B2', shadow: 'rgba(8,145,178,0.4)' },
  error: { bg: '#DC2626', shadow: 'rgba(220,38,38,0.4)' },
  success: { bg: '#10B981', shadow: 'rgba(16,185,129,0.4)' },
};

export default function Toast({ message, type = 'info', onDismiss, duration = 3000 }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDismiss, duration);
    return () => clearTimeout(t);
  }, [message, duration, onDismiss]);

  if (!message) return null;
  const c = COLORS[type] || COLORS.info;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: 'calc(96px + env(safe-area-inset-bottom))',
        left: '50%',
        transform: 'translateX(-50%)',
        background: c.bg,
        color: 'white',
        padding: '12px 20px',
        borderRadius: 14,
        boxShadow: `0 10px 32px ${c.shadow}`,
        fontFamily: 'Nunito, sans-serif',
        fontSize: 'clamp(13px, 3.4vw, 15px)',
        fontWeight: 700,
        zIndex: 200,
        maxWidth: 'min(90vw, 420px)',
        textAlign: 'center',
        animation: 'toastSlide 0.3s ease-out',
      }}
    >
      <style>{`@keyframes toastSlide { from { transform: translate(-50%, 30px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }`}</style>
      {message}
    </div>
  );
}
