export default function ProgressDots({ total, current }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 0' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i === current ? 24 : 8,
            height: 8,
            borderRadius: 4,
            background: i <= current ? '#4CAF50' : '#E0E0E0',
            transition: 'all 0.3s ease',
          }}
        />
      ))}
    </div>
  );
}
