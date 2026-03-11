export default function AppShell({ children }) {
  return (
    <div
      style={{
        maxWidth: 430,
        margin: '0 auto',
        minHeight: '100dvh',
        position: 'relative',
        background: '#FFFFFF',
        boxShadow: '0 0 40px rgba(0,0,0,0.1)',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
}
