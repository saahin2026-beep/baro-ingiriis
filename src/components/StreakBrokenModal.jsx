import { X, Snowflake, HeartBreak } from '@phosphor-icons/react';
import { useFocusTrap } from '../utils/useFocusTrap';

export default function StreakBrokenModal({ lostStreak, onClose, onBuyFreeze, onStartLesson }) {
  const ref = useFocusTrap(onClose);
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="streak-broken-title" onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 1000 }}>
      <div ref={ref} tabIndex={-1} onClick={(e) => e.stopPropagation()} style={{ background: 'white', borderRadius: 24, padding: 32, maxWidth: 340, width: '100%', textAlign: 'center', position: 'relative', outline: 'none' }}>
        <button type="button" onClick={onClose} aria-label="Close" style={{ position: 'absolute', top: 16, right: 16, background: '#F1F5F9', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <X size={18} color="#64748B" />
        </button>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <HeartBreak size={40} weight="fill" color="#EF4444" />
        </div>
        <h2 id="streak-broken-title" style={{ fontSize: 22, fontWeight: 800, color: '#EF4444', fontFamily: 'Nunito, sans-serif', margin: '0 0 8px' }}>Streak-kaagii wuu jabay</h2>
        {lostStreak > 0 && (
          <p style={{ fontSize: 15, color: '#64748B', fontFamily: 'Nunito, sans-serif', margin: '0 0 8px' }}>
            <strong style={{ color: '#EF4444' }}>{lostStreak}</strong> maalmood ayaad lahayd
          </p>
        )}
        <p style={{ fontSize: 14, color: '#94A3B8', fontFamily: 'Nunito, sans-serif', margin: '0 0 24px' }}>Ha quusanin — maanta dib u bilow!</p>
        <div style={{ background: '#E0F2FE', borderRadius: 12, padding: 14, marginBottom: 20, display: 'flex', alignItems: 'flex-start', gap: 10, textAlign: 'left' }}>
          <Snowflake size={20} weight="fill" color="#0891B2" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#0891B2', fontFamily: 'Nunito, sans-serif', margin: '0 0 4px' }}>Streak-kaaga ilaali!</p>
            <p style={{ fontSize: 12, color: '#0E7490', fontFamily: 'Nunito, sans-serif', margin: 0 }}>Freeze iibso si aad mustaqbalka uga ilaaliso.</p>
          </div>
        </div>
        <button type="button" onClick={onStartLesson} style={{ width: '100%', padding: '16px 24px', background: '#10B981', color: 'white', border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 700, fontFamily: 'Nunito, sans-serif', cursor: 'pointer', marginBottom: 10 }}>
          Casharka maanta bilow
        </button>
        <button type="button" onClick={onBuyFreeze} style={{ width: '100%', padding: '14px 24px', background: '#E0F2FE', color: '#0891B2', border: 'none', borderRadius: 14, fontSize: 14, fontWeight: 700, fontFamily: 'Nunito, sans-serif', cursor: 'pointer' }}>
          <Snowflake size={16} weight="fill" style={{ verticalAlign: 'middle', marginRight: 6 }} />
          Freeze iibso (50 Dahab)
        </button>
      </div>
    </div>
  );
}
