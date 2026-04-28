import { Snowflake, Check } from '@phosphor-icons/react';
import { useFocusTrap } from '../utils/useFocusTrap';

export default function StreakFreezeUsedModal({ streak, freezesUsed, freezesRemaining, onClose }) {
  const ref = useFocusTrap(onClose);
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="streak-freeze-title" onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 1000 }}>
      <div ref={ref} tabIndex={-1} onClick={(e) => e.stopPropagation()} style={{ background: 'white', borderRadius: 24, padding: 32, maxWidth: 320, width: '100%', textAlign: 'center', outline: 'none' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', position: 'relative' }}>
          <Snowflake size={40} weight="fill" color="#0891B2" />
          <div style={{ position: 'absolute', bottom: -4, right: -4, width: 28, height: 28, borderRadius: '50%', background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid white' }}>
            <Check size={14} weight="bold" color="white" />
          </div>
        </div>
        <h2 id="streak-freeze-title" style={{ fontSize: 22, fontWeight: 800, color: '#0891B2', fontFamily: 'Nunito, sans-serif', margin: '0 0 8px' }}>Streak waa ladnaaday!</h2>
        <p style={{ fontSize: 15, color: '#64748B', fontFamily: 'Nunito, sans-serif', margin: '0 0 16px' }}>
          {freezesUsed} freeze ayaa <strong style={{ color: '#F59E0B' }}>{streak}-maalmood</strong> streak-kaaga badbaadiyay
        </p>
        <div style={{ background: '#F1F5F9', borderRadius: 12, padding: '12px 16px', marginBottom: 24 }}>
          <p style={{ fontSize: 13, color: '#64748B', fontFamily: 'Nunito, sans-serif', margin: 0 }}>
            Freeze hadhay: <strong style={{ color: '#0891B2' }}>{freezesRemaining}</strong>
          </p>
        </div>
        <button type="button" onClick={onClose} style={{ width: '100%', padding: '16px 24px', background: '#0891B2', color: 'white', border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 700, fontFamily: 'Nunito, sans-serif', cursor: 'pointer' }}>
          Sii wad
        </button>
      </div>
    </div>
  );
}
