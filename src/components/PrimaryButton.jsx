export default function PrimaryButton({ children, onClick, disabled = false, variant = 'primary', style: propStyle }) {
  if (variant === 'secondary') {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        style={{
          width: '100%',
          padding: '16px 24px',
          borderRadius: 16,
          border: 'none',
          background: disabled ? '#E0E0E0' : 'linear-gradient(180deg, #FFFFFF 0%, #F8F8F8 100%)',
          borderBottom: disabled ? '1px solid #BDBDBD' : '4px solid #D0D0D0',
          boxShadow: disabled ? 'none' : '0 4px 12px rgba(0,0,0,0.06)',
          fontSize: 15,
          fontWeight: 800,
          fontFamily: 'Nunito, sans-serif',
          color: '#333',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          transition: 'all 0.08s ease',
          textTransform: 'uppercase',
          letterSpacing: 1,
          transform: 'translateY(0)',
          ...propStyle,
        }}
        onPointerDown={(e) => {
          if (!disabled) {
            e.currentTarget.style.transform = 'translateY(3px)';
            e.currentTarget.style.borderBottom = '1px solid #D0D0D0';
            e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
          }
        }}
        onPointerUp={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.borderBottom = '4px solid #D0D0D0';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)';
        }}
        onPointerLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.borderBottom = '4px solid #D0D0D0';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)';
        }}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%',
        padding: '16px 24px',
        borderRadius: 16,
        border: 'none',
        background: disabled ? '#BDBDBD' : 'linear-gradient(180deg, #5CBF60 0%, #4CAF50 40%, #45A049 100%)',
        borderBottom: disabled ? '1px solid #9E9E9E' : '4px solid #2E7D32',
        boxShadow: disabled ? 'none' : '0 4px 12px rgba(46,125,50,0.3)',
        fontSize: 15,
        fontWeight: 800,
        fontFamily: 'Nunito, sans-serif',
        color: 'white',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.08s ease',
        textTransform: 'uppercase',
        letterSpacing: 1,
        transform: 'translateY(0)',
        ...propStyle,
      }}
      onPointerDown={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(3px)';
          e.currentTarget.style.borderBottom = '1px solid #2E7D32';
          e.currentTarget.style.boxShadow = '0 1px 4px rgba(46,125,50,0.2)';
        }
      }}
      onPointerUp={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderBottom = '4px solid #2E7D32';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(46,125,50,0.3)';
      }}
      onPointerLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderBottom = '4px solid #2E7D32';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(46,125,50,0.3)';
      }}
    >
      {children}
    </button>
  );
}
