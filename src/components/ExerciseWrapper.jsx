export default function ExerciseWrapper({ children, instruction }) {
  return (
    <div className="animate-slide-in" style={{ display: 'flex', flexDirection: 'column', padding: '20px 20px 140px 20px', flex: 1 }}>
      <p style={{ fontSize: 15, fontWeight: 600, fontFamily: 'Nunito, sans-serif', color: '#333', marginBottom: 14 }}>
        {instruction}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        {children}
      </div>
    </div>
  );
}
