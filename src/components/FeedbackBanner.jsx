import { CheckCircle, XCircle } from '@phosphor-icons/react';
import { useLanguage } from '../utils/useLanguage';
import PhraseIcon from '../utils/PhraseIcon';

export default function FeedbackBanner({ type, phrase, onContinue, visible }) {
  const { t } = useLanguage();
  if (!visible || !phrase) return null;
  const isCorrect = type === 'correct';

  return (
    <div className="animate-slide-up-banner" style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
      display: 'flex', justifyContent: 'center',
      transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease',
    }}>
      <div style={{
        width: '100%', maxWidth: 430,
        background: isCorrect ? 'linear-gradient(180deg, #E8F5E9 0%, #C8E6C9 100%)' : 'linear-gradient(180deg, #FFEBEE 0%, #FFCDD2 100%)',
        borderTop: isCorrect ? '4px solid #4CAF50' : '4px solid #EF5350',
        borderRadius: '28px 28px 0 0',
        padding: '24px 20px 28px',
        boxShadow: isCorrect ? '0 -8px 32px rgba(76,175,80,0.15)' : '0 -8px 32px rgba(244,67,54,0.12)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          {isCorrect ? <CheckCircle size={32} weight="fill" color="#4CAF50" /> : <XCircle size={32} weight="fill" color="#F44336" />}
          <span style={{ fontSize: 18, fontWeight: 800, color: isCorrect ? '#2E7D32' : '#C62828', fontFamily: 'Nunito, sans-serif' }}>
            {isCorrect ? t('btn.correct') : t('btn.wrong')}
          </span>
        </div>
        <p style={{ fontSize: 14, color: isCorrect ? '#388E3C' : '#D32F2F', fontFamily: 'Nunito, sans-serif', marginBottom: 14, marginLeft: 42 }}>
          <PhraseIcon name={phrase.emoji} size={16} color={isCorrect ? '#388E3C' : '#D32F2F'} /> {phrase.text}
        </p>
        <button onClick={onContinue} style={{
          width: '100%', padding: '16px 24px', borderRadius: 16, border: 'none',
          background: isCorrect ? 'linear-gradient(180deg, #5CBF60 0%, #4CAF50 40%, #45A049 100%)' : 'linear-gradient(180deg, #EF5350 0%, #F44336 50%, #E53935 100%)',
          borderBottom: isCorrect ? '3px solid #2E7D32' : '3px solid #C62828',
          boxShadow: isCorrect ? '0 3px 10px rgba(46,125,50,0.25)' : '0 3px 10px rgba(198,40,40,0.25)',
          fontSize: 15, fontWeight: 800, color: 'white',
          fontFamily: 'Nunito, sans-serif', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 1,
          transform: 'translateY(0)', transition: 'all 0.08s ease',
        }}
          onPointerDown={(e) => {
            e.currentTarget.style.transform = 'translateY(2px)';
            e.currentTarget.style.borderBottom = isCorrect ? '1px solid #2E7D32' : '1px solid #C62828';
          }}
          onPointerUp={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderBottom = isCorrect ? '3px solid #2E7D32' : '3px solid #C62828';
          }}
          onPointerLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderBottom = isCorrect ? '3px solid #2E7D32' : '3px solid #C62828';
          }}
        >
          {isCorrect ? t('btn.continue') : t('btn.retry')}
        </button>
      </div>
    </div>
  );
}
