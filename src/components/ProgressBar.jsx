export default function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div style={{ height: 6, background: '#E0E0E0', borderRadius: 6, boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.08)' }}>
      <div style={{
        height: '100%',
        width: `${pct}%`,
        background: 'linear-gradient(90deg, #FFC107, #FFD54F, #FFC107)',
        backgroundSize: '200% 100%',
        animation: pct > 0 ? 'shimmer 2s linear infinite' : 'none',
        borderRadius: 6,
        transition: 'width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }} />
    </div>
  );
}
