export default function AppShell({ children }) {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 520,
        margin: '0 auto',
        minHeight: '100dvh',
        position: 'relative',
        background: '#FBF7F0',
      }}
    >
      {children}
    </div>
  );
}
