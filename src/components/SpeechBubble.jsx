export default function SpeechBubble({ children, color = '#FFFFFF' }) {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div style={{
        background: color,
        borderRadius: 20,
        padding: '16px 20px',
        border: '1.5px solid rgba(0,0,0,0.05)',
        boxShadow: '0 2px 0 rgba(0,0,0,0.03), 0 8px 24px rgba(0,0,0,0.06)',
        maxWidth: 260,
      }}>
        {children}
      </div>
      <div style={{
        position: 'absolute',
        bottom: -8,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 0,
        height: 0,
        borderLeft: '8px solid transparent',
        borderRight: '8px solid transparent',
        borderTop: `8px solid ${color}`,
        filter: 'drop-shadow(0 2px 1px rgba(0,0,0,0.04))',
      }} />
    </div>
  );
}
