import { useEffect, useState } from 'react';
import { X } from '@phosphor-icons/react';

export default function WrongAnswerPopup() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', top: '35%', left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 100, pointerEvents: 'none',
      animation: 'hd-wrongShake 0.6s ease-out',
    }}>
      <div style={{
        background: '#EF4444', color: 'white',
        width: 64, height: 64, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 8px 32px rgba(239, 68, 68, 0.4)',
      }}>
        <X size={32} weight="bold" />
      </div>
    </div>
  );
}
