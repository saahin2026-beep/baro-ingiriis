export default function ProgressBar({ current, total, dark = false, color }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div style={{ height: 6, background: dark ? '#334155' : '#E0E0E0', borderRadius: 6, boxShadow: dark ? 'none' : 'inset 0 1px 2px rgba(0,0,0,0.08)' }}>
      <div style={{
        height: '100%',
        width: `${pct}%`,
        background: dark && color ? color : 'linear-gradient(90deg, #FFC107, #FFD54F, #FFC107)',
        backgroundSize: '200% 100%',
        animation: pct > 0 && !dark ? 'shimmer 2s linear infinite' : 'none',
        borderRadius: 6,
        transition: 'width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        boxShadow: dark && color ? `0 0 8px ${color}30` : 'none',
      }} />
    </div>
  );
}
