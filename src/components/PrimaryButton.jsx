export default function PrimaryButton({ children, onClick, disabled = false, variant = 'primary', style: propStyle }) {
  const isSecondary = variant === 'secondary';

  const base = {
    width: '100%',
    padding: 'clamp(14px, 3.5vw, 20px) clamp(20px, 5vw, 28px)',
    borderRadius: 'clamp(12px, 3vw, 18px)',
    border: 'none',
    fontSize: 'clamp(14px, 3.5vw, 18px)',
    fontWeight: 800,
    fontFamily: 'Nunito, sans-serif',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.08s ease',
    textTransform: 'uppercase',
    letterSpacing: 'clamp(0.5px, 0.12vw, 1px)',
    transform: 'translateY(0)',
    ...propStyle,
  };

  if (isSecondary) {
    return (
      <button onClick={onClick} disabled={disabled} style={{
        ...base,
        background: disabled ? '#E0E0E0' : 'linear-gradient(180deg, #FFFFFF 0%, #F8F8F8 100%)',
        borderBottom: disabled ? '1px solid #BDBDBD' : '4px solid #D0D0D0',
        boxShadow: disabled ? 'none' : '0 4px 12px rgba(0,0,0,0.06)',
        color: '#1E293B',
      }}
        onPointerDown={(e) => { if (!disabled) { e.currentTarget.style.transform = 'translateY(3px)'; e.currentTarget.style.borderBottom = '1px solid #D0D0D0'; } }}
        onPointerUp={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderBottom = '4px solid #D0D0D0'; }}
        onPointerLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderBottom = '4px solid #D0D0D0'; }}
      >{children}</button>
    );
  }

  return (
    <button onClick={onClick} disabled={disabled} style={{
      ...base,
      background: disabled ? '#BDBDBD' : 'linear-gradient(180deg, #22D3EE 0%, #0891B2 40%, #0E7490 100%)',
      borderBottom: disabled ? '1px solid #9E9E9E' : '4px solid #155E75',
      boxShadow: disabled ? 'none' : '0 4px 12px rgba(8,145,178,0.3)',
      color: 'white',
    }}
      onPointerDown={(e) => { if (!disabled) { e.currentTarget.style.transform = 'translateY(3px)'; e.currentTarget.style.borderBottom = '1px solid #155E75'; } }}
      onPointerUp={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderBottom = '4px solid #155E75'; }}
      onPointerLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderBottom = '4px solid #155E75'; }}
    >{children}</button>
  );
}
