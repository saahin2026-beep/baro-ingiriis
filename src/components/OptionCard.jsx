import { CheckCircle, XCircle } from '@phosphor-icons/react';

export default function OptionCard({ icon: IconComponent, iconColor, iconBg, emoji, text, selected, correct, onClick, disabled = false, number }) {
  let bg = 'linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%)';
  let border = '#EBEBEB';
  let borderBot = '4px solid #DCDCDC';
  let shadow = '0 2px 8px rgba(0,0,0,0.04)';
  let color = '#333333';
  let circleBg = iconBg || 'linear-gradient(180deg, #F5F5F5, #EBEBEB)';
  let circleBorder = iconBg ? 'transparent' : '#E0E0E0';
  let circleIconColor = iconColor || '#999';
  let circleContent = null;

  if (correct === true) {
    bg = 'linear-gradient(180deg, #E8F5E9, #C8E6C9)';
    border = '#4CAF50'; borderBot = '4px solid #2E7D32'; color = '#2E7D32';
    shadow = '0 2px 12px rgba(76,175,80,0.2)';
    circleBg = '#4CAF50'; circleBorder = '#2E7D32';
    circleContent = <CheckCircle size={18} weight="fill" color="white" />;
  } else if (correct === false) {
    bg = 'linear-gradient(180deg, #FFEBEE, #FFCDD2)';
    border = '#F44336'; borderBot = '4px solid #C62828'; color = '#C62828';
    shadow = '0 2px 12px rgba(244,67,54,0.15)';
    circleBg = '#F44336'; circleBorder = '#C62828';
    circleContent = <XCircle size={18} weight="fill" color="white" />;
  } else if (selected) {
    bg = 'linear-gradient(180deg, #E3F2FD, #D0E8FD)';
    border = '#1E88E5'; borderBot = '4px solid #1565C0'; color = '#333333';
    if (!iconBg) { circleBorder = '#1E88E5'; }
  }

  const defaultBorderBot = '4px solid #DCDCDC';
  const defaultShadow = '0 2px 8px rgba(0,0,0,0.04)';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', padding: '14px 16px',
        borderRadius: 16, border: `1.5px solid ${border}`,
        borderBottom: borderBot,
        background: bg,
        boxShadow: shadow,
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.6 : 1,
        minHeight: 52, textAlign: 'left', fontFamily: 'Nunito, sans-serif',
        transition: 'all 0.08s ease', gap: 14,
        transform: 'translateY(0)',
      }}
      onPointerDown={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(3px)';
          e.currentTarget.style.borderBottom = `1px solid ${border}`;
          e.currentTarget.style.boxShadow = '0 0 2px rgba(0,0,0,0.02)';
        }
      }}
      onPointerUp={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderBottom = borderBot;
        e.currentTarget.style.boxShadow = shadow;
      }}
      onPointerLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderBottom = borderBot;
        e.currentTarget.style.boxShadow = shadow;
      }}
    >
      {(number !== undefined || IconComponent || emoji) && (
        <div style={{
          width: 32, height: 32, borderRadius: 10,
          border: circleBorder !== 'transparent' ? `1.5px solid ${circleBorder}` : 'none',
          background: circleBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          {circleContent || (
            IconComponent ? <IconComponent size={18} weight="fill" color={correct === true ? 'white' : circleIconColor} /> :
            emoji ? <span style={{ fontSize: 14 }}>{emoji}</span> :
            <span style={{ fontSize: 14, fontWeight: 800, color: '#999', fontFamily: 'Nunito, sans-serif' }}>{number}</span>
          )}
        </div>
      )}
      <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color }}>{text}</span>
    </button>
  );
}
