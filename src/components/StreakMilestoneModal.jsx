import { X, Gift } from '@phosphor-icons/react';
import Confetti from './Confetti';

const CONFIG = {
  3:   { title: '3 Maalmood!', subtitle: 'Waa bilowgii fiican!', color: '#EF4444' },
  7:   { title: '1 Toddobaad!', subtitle: 'Waa la isku halayn karaa!', color: '#EF4444' },
  14:  { title: '2 Toddobaad!', subtitle: 'Aad baad u fiicantahay!', color: '#8B5CF6' },
  30:  { title: '1 Bil!', subtitle: 'Geel ayaa kobcay!', color: '#10B981' },
  60:  { title: '60 Maalmood!', subtitle: 'Adigu waa champion!', color: '#F59E0B' },
  100: { title: '100 Maalmood!', subtitle: 'Legend status!', color: '#F59E0B' },
};

export default function StreakMilestoneModal({ milestone, onClose }) {
  if (!milestone) return null;
  const c = CONFIG[milestone.day] || CONFIG[3];

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 1000 }}>
      <Confetti />
      <div style={{ background: 'white', borderRadius: 24, padding: 32, maxWidth: 340, width: '100%', textAlign: 'center', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: '#F1F5F9', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <X size={18} color="#64748B" />
        </button>
        <div style={{ fontSize: 56, marginBottom: 12 }}>{milestone.badge}</div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: c.color, fontFamily: 'Nunito, sans-serif', margin: '0 0 4px' }}>{c.title}</h2>
        <p style={{ fontSize: 15, color: '#64748B', fontFamily: 'Nunito, sans-serif', margin: '0 0 20px' }}>{c.subtitle}</p>
        <div style={{ background: `${c.color}10`, borderRadius: 16, padding: 16, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 8 }}>
            <Gift size={18} weight="fill" color={c.color} />
            <span style={{ fontSize: 13, fontWeight: 700, color: c.color, fontFamily: 'Nunito, sans-serif' }}>Abaalmariintaada</span>
          </div>
          <p style={{ fontSize: 18, fontWeight: 800, color: '#334155', fontFamily: 'Nunito, sans-serif', margin: 0 }}>+{milestone.dahab} Dahab</p>
          {milestone.xpMultiplier && (
            <p style={{ fontSize: 15, fontWeight: 700, color: '#D97706', fontFamily: 'Nunito, sans-serif', margin: '8px 0 0' }}>
              {milestone.xpMultiplier}x XP ({milestone.xpDuration} saac)
            </p>
          )}
        </div>
        <button onClick={onClose} style={{ width: '100%', padding: '16px 24px', background: c.color, color: 'white', border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 700, fontFamily: 'Nunito, sans-serif', cursor: 'pointer' }}>
          Sii wad!
        </button>
      </div>
    </div>
  );
}
