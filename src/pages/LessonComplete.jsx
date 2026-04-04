import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Star, Fire, CheckCircle, CurrencyCircleDollar } from '@phosphor-icons/react';
import PhraseIcon from '../utils/PhraseIcon';
import { storage } from '../utils/storage';
import { useData } from '../utils/DataContext';
import { useLanguage } from '../utils/useLanguage';
import Geel from '../components/Geel';
import PrimaryButton from '../components/PrimaryButton';
import Confetti from '../components/Confetti';

export default function LessonComplete() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const dahabEarned = location.state?.dahabEarned || 0;
  const { lessonData, getRandomPhrase } = useData();
  const data = lessonData?.[id];
  const [celebration] = useState(() => getRandomPhrase('celebration'));
  const state = storage.get();
  const [countdown, setCountdown] = useState(5);
  const [skipped, setSkipped] = useState(false);
  const nextLessonId = Number(id) + 1;
  const nextLesson = lessonData?.[nextLessonId];
  const nextChunkWord = nextLesson?.chunks?.[0]?.en || '';

  useEffect(() => {
    if (id) storage.completeLesson(Number(id), dahabEarned);
  }, [id]);

  useEffect(() => {
    if (skipped || !nextLesson) return;
    if (countdown <= 0) {
      navigate(`/lesson/${nextLessonId}`);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, skipped, nextLesson]);

  if (!data) { navigate('/home'); return null; }

  return (
    <div style={{ background: 'linear-gradient(180deg, #ECFEFF 0%, #CFFAFE 50%, #FFFFFF 100%)', minHeight: '100dvh', position: 'relative', overflow: 'hidden' }}>
      <Confetti />
      <div style={{ padding: '40px 24px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Trophy badge with Geel */}
        <div style={{
          width: 110, height: 110, borderRadius: '50%', background: '#FFF8E1',
          border: '3px solid #FFC107', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(255,193,7,0.3)',
        }}>
          <Geel size={75} expression="celebrating" />
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 900, color: '#1E293B', fontFamily: 'Nunito, sans-serif', marginTop: 16, textAlign: 'center' }}>
          {celebration.text} <PhraseIcon name={celebration.emoji} size={24} color="#FFC107" />
        </h1>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 10, marginTop: 24, width: '100%' }}>
          {/* XP */}
          <div style={{ flex: 1, background: 'linear-gradient(180deg, #ECFEFF, #CFFAFE)', borderRadius: 16, borderBottom: '3px solid #A5F3FC', padding: '14px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <Star size={28} weight="fill" color="#FFCA28" />
            <p style={{ fontSize: 22, fontWeight: 800, color: '#0891B2', fontFamily: 'Nunito, sans-serif' }}>+10</p>
            <p style={{ fontSize: 11, color: '#64748B', fontFamily: 'Nunito, sans-serif' }}>{t('complete.xp_label')}</p>
          </div>
          {/* Dahab */}
          <div style={{ flex: 1, background: 'linear-gradient(180deg, #FEF3C7, #FDE68A)', borderRadius: 16, borderBottom: '3px solid #D97706', padding: '14px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <CurrencyCircleDollar size={26} weight="fill" color="#F59E0B" />
            <p style={{ fontSize: 22, fontWeight: 800, color: '#92400E', fontFamily: 'Nunito, sans-serif' }}>+{dahabEarned}</p>
            <p style={{ fontSize: 11, color: '#78350F', fontFamily: 'Nunito, sans-serif' }}>Dahab</p>
          </div>
          {/* Streak */}
          <div style={{ flex: 1, background: 'linear-gradient(180deg, #E3F2FD, #BBDEFB)', borderRadius: 16, borderBottom: '3px solid #90CAF9', padding: '14px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <Fire size={28} weight="fill" color="#FF7043" />
            <p style={{ fontSize: 22, fontWeight: 800, color: '#1E88E5', fontFamily: 'Nunito, sans-serif' }}>{state.streak || 0}</p>
            <p style={{ fontSize: 11, color: '#64748B', fontFamily: 'Nunito, sans-serif' }}>{t('complete.streak_label')}</p>
          </div>
        </div>

        {/* Ability */}
        <div style={{ background: '#F1F5F9', borderRadius: 14, padding: '14px 16px', marginTop: 20, width: '100%' }}>
          <p style={{ fontSize: 12, color: '#64748B', fontFamily: 'Nunito, sans-serif' }}>{t('complete.ability')}</p>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#0891B2', fontFamily: 'Nunito, sans-serif', marginTop: 4 }}>{data.ability}</p>
        </div>

        {/* Chunks */}
        <div style={{ marginTop: 16, width: '100%' }}>
          <p style={{ fontSize: 12, color: '#64748B', fontFamily: 'Nunito, sans-serif', marginBottom: 8 }}>{t('complete.learned')}</p>
          {data.chunks.map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#0891B2' }} />
              <span style={{ fontSize: 14, fontWeight: 600, color: '#1E293B', fontFamily: 'Nunito, sans-serif' }}>{c.en}</span>
            </div>
          ))}
        </div>

        <div style={{ height: 24 }} />
        {nextLesson ? (
          <>
            {/* Next lesson teaser */}
            <div style={{
              width: '100%',
              background: 'linear-gradient(180deg, #F0FDFA, #CFFAFE)',
              border: '1.5px dashed #A5F3FC',
              borderRadius: 16,
              padding: '14px 16px',
              marginTop: 8,
              marginBottom: 12,
            }}>
              <p style={{ fontSize: 11, color: '#0891B2', fontFamily: 'Nunito, sans-serif', marginBottom: 4, fontWeight: 700 }}>
                Casharka xiga 👀
              </p>
              <p style={{ fontSize: 15, fontWeight: 800, color: '#0E7490', fontFamily: 'Nunito, sans-serif', marginBottom: 2 }}>
                {nextLesson.titleSo}
              </p>
              <p style={{
                fontSize: 14,
                fontFamily: 'Nunito, sans-serif',
                color: 'transparent',
                textShadow: '0 0 10px #0891B2',
                userSelect: 'none',
              }}>
                {nextChunkWord}...
              </p>
            </div>

            {/* Auto-advance button with countdown */}
            <button
              onClick={() => navigate(`/lesson/${nextLessonId}`)}
              style={{
                width: '100%', padding: '16px 24px', borderRadius: 16, border: 'none',
                background: 'linear-gradient(180deg, #22D3EE 0%, #0891B2 40%, #0E7490 100%)',
                borderBottom: '4px solid #155E75',
                boxShadow: '0 4px 12px rgba(8,145,178,0.3)',
                fontSize: 15, fontWeight: 800, color: 'white',
                fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
                textTransform: 'uppercase', letterSpacing: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              }}
            >
              <span>Bilow Casharka {nextLessonId}</span>
              <span style={{
                fontSize: 13, fontWeight: 700,
                background: 'rgba(255,255,255,0.2)',
                borderRadius: 20, padding: '2px 10px',
              }}>
                {countdown}s
              </span>
            </button>

            {/* Skip to home — small, secondary */}
            <button
              onClick={() => { setSkipped(true); navigate('/home'); }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 13, color: '#94A3B8', fontFamily: 'Nunito, sans-serif',
                marginTop: 10, textDecoration: 'underline', padding: '4px 0',
              }}
            >
              Ku noqo guriga
            </button>
          </>
        ) : (
          <PrimaryButton onClick={() => navigate('/home')}>{t('complete.continue')}</PrimaryButton>
        )}
      </div>
    </div>
  );
}
