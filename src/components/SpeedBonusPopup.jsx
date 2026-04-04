import { useEffect, useState } from 'react';
import { CurrencyCircleDollar } from '@phosphor-icons/react';

export default function SpeedBonusPopup({ dahab, label, color }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!visible || dahab === 0) return null;

  return (
    <div style={{
      position: 'fixed', bottom: '25%', left: '50%',
      transform: 'translateX(-50%)', zIndex: 100, pointerEvents: 'none',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
      animation: 'dahabFloat 1.5s ease-out forwards',
    }}>
      <span style={{
        fontSize: label ? 48 : 36, fontWeight: 900, fontFamily: 'Nunito, sans-serif',
        color: color || '#F59E0B', lineHeight: 1,
        textShadow: label ? `0 0 20px ${color}80` : 'none',
      }}>
        +{dahab}
      </span>
      {label && (
        <span style={{
          fontSize: 13, fontWeight: 700, fontFamily: 'Nunito, sans-serif',
          color, opacity: 0.9, letterSpacing: 1,
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <CurrencyCircleDollar size={14} weight="fill" color={color} /> {label}
        </span>
      )}
    </div>
  );
}
