import { CheckCircle, XCircle } from '@phosphor-icons/react';

export default function OptionCard({ icon: IconComponent, iconColor, iconBg, emoji, text, selected, correct, onClick, disabled = false, number, dark = false }) {
  let bg, border, borderBot, shadow, color, circleBg, circleBorder, circleIconColor, circleContent = null;

  if (dark) {
    bg = '#1E293B';
    border = '#334155';
    borderBot = '1.5px solid #334155';
    shadow = 'none';
    color = '#F1F5F9';
    circleBg = '#334155';
    circleBorder = 'transparent';
    circleIconColor = '#94A3B8';

    if (correct === true) {
      bg = 'rgba(16, 185, 129, 0.1)';
      border = '#10B981';
      borderBot = '1.5px solid #10B981';
      shadow = '0 0 20px rgba(16, 185, 129, 0.15), inset 0 0 20px rgba(16, 185, 129, 0.05)';
      color = '#6EE7B7';
      circleBg = '#10B981';
      circleBorder = 'transparent';
      circleContent = <CheckCircle size={18} weight="fill" color="white" />;
    } else if (correct === false) {
      bg = 'rgba(239, 68, 68, 0.1)';
      border = '#EF4444';
      borderBot = '1.5px solid #EF4444';
      shadow = '0 0 20px rgba(239, 68, 68, 0.12)';
      color = '#FCA5A5';
      circleBg = '#EF4444';
      circleBorder = 'transparent';
      circleContent = <XCircle size={18} weight="fill" color="white" />;
    }
  } else {
    bg = 'linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%)';
    border = '#EBEBEB';
    borderBot = '4px solid #DCDCDC';
    shadow = '0 2px 8px rgba(0,0,0,0.04)';
    color = '#333333';
    circleBg = iconBg || 'linear-gradient(180deg, #F5F5F5, #EBEBEB)';
    circleBorder = iconBg ? 'transparent' : '#E0E0E0';
    circleIconColor = iconColor || '#999';

    if (correct === true) {
      bg = 'linear-gradient(180deg, #D1FAE5, #A7F3D0)';
      border = '#10B981'; borderBot = '4px solid #059669'; color = '#059669';
      shadow = '0 2px 12px rgba(16,185,129,0.2)';
      circleBg = '#10B981'; circleBorder = '#059669';
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
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%', display: 'flex', alignItems: 'center',
        padding: dark ? 'clamp(14px, 3.5vw, 20px) clamp(16px, 4vw, 22px)' : 'clamp(12px, 3vw, 18px) clamp(14px, 3.5vw, 20px)',
        borderRadius: 'clamp(12px, 3vw, 18px)', border: `1.5px solid ${border}`,
        borderBottom: borderBot,
        background: bg,
        boxShadow: shadow,
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.6 : 1,
        minHeight: 'clamp(48px, 12vw, 64px)', textAlign: 'left', fontFamily: 'Nunito, sans-serif',
        transition: 'all 0.08s ease', gap: 'clamp(10px, 2.5vw, 16px)',
        transform: 'translateY(0)',
      }}
      onPointerDown={(e) => {
        if (!disabled && !dark) {
          e.currentTarget.style.transform = 'translateY(3px)';
          e.currentTarget.style.borderBottom = `1px solid ${border}`;
          e.currentTarget.style.boxShadow = '0 0 2px rgba(0,0,0,0.02)';
        }
      }}
      onPointerUp={(e) => {
        if (!dark) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.borderBottom = borderBot;
          e.currentTarget.style.boxShadow = shadow;
        }
      }}
      onPointerLeave={(e) => {
        if (!dark) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.borderBottom = borderBot;
          e.currentTarget.style.boxShadow = shadow;
        }
      }}
    >
      {(number !== undefined || IconComponent || emoji) && (
        <div style={{
          width: 'clamp(28px, 7vw, 38px)', height: 'clamp(28px, 7vw, 38px)', borderRadius: 'clamp(7px, 1.8vw, 12px)',
          border: circleBorder !== 'transparent' ? `1.5px solid ${circleBorder}` : 'none',
          background: circleBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          boxShadow: dark && correct === true ? '0 0 10px rgba(16, 185, 129, 0.4)' : 'none',
        }}>
          {circleContent || (
            IconComponent ? <IconComponent size={18} weight="fill" color={correct === true ? 'white' : circleIconColor} /> :
            emoji ? <span style={{ fontSize: 14 }}>{emoji}</span> :
            <span style={{ fontSize: 14, fontWeight: 800, color: dark ? '#94A3B8' : '#999', fontFamily: 'Nunito, sans-serif' }}>{number}</span>
          )}
        </div>
      )}
      <span style={{ flex: 1, fontSize: 'clamp(14px, 3.5vw, 18px)', fontWeight: 600, color, lineHeight: 1.35, wordBreak: 'break-word' }}>{text}</span>
    </button>
  );
}
