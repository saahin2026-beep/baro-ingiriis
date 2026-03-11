import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Fire, CheckCircle } from '@phosphor-icons/react';
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
  const { t } = useLanguage();
  const { lessonData, getRandomPhrase } = useData();
  const data = lessonData?.[id];
  const [celebration] = useState(() => getRandomPhrase('celebration'));
  const state = storage.get();

  useEffect(() => {
    if (id) storage.completeLesson(Number(id));
  }, [id]);

  if (!data) { navigate('/home'); return null; }

  return (
    <div style={{ background: 'linear-gradient(180deg, #F0FFF0 0%, #E8F5E9 50%, #FFFFFF 100%)', minHeight: '100dvh', position: 'relative', overflow: 'hidden' }}>
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

        <h1 style={{ fontSize: 24, fontWeight: 900, color: '#333', fontFamily: 'Nunito, sans-serif', marginTop: 16, textAlign: 'center' }}>
          {celebration.text} <PhraseIcon name={celebration.emoji} size={24} color="#FFC107" />
        </h1>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 10, marginTop: 24, width: '100%' }}>
          {/* XP */}
          <div style={{ flex: 1, background: 'linear-gradient(180deg, #E8F5E9, #D4ECD4)', borderRadius: 16, borderBottom: '3px solid #A5D6A7', padding: '14px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <Star size={28} weight="fill" color="#FFCA28" />
            <p style={{ fontSize: 22, fontWeight: 800, color: '#4CAF50', fontFamily: 'Nunito, sans-serif' }}>+10</p>
            <p style={{ fontSize: 11, color: '#757575', fontFamily: 'Nunito, sans-serif' }}>{t('complete.xp_label')}</p>
          </div>
          {/* Correct */}
          <div style={{ flex: 1, background: 'linear-gradient(180deg, #FFF3E0, #FFE0B2)', borderRadius: 16, borderBottom: '3px solid #FFCC80', padding: '14px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <CheckCircle size={28} weight="fill" color="#FB8C00" />
            <p style={{ fontSize: 22, fontWeight: 800, color: '#FB8C00', fontFamily: 'Nunito, sans-serif' }}>5/5</p>
            <p style={{ fontSize: 11, color: '#757575', fontFamily: 'Nunito, sans-serif' }}>{t('complete.correct_label')}</p>
          </div>
          {/* Streak */}
          <div style={{ flex: 1, background: 'linear-gradient(180deg, #E3F2FD, #BBDEFB)', borderRadius: 16, borderBottom: '3px solid #90CAF9', padding: '14px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <Fire size={28} weight="fill" color="#FF7043" />
            <p style={{ fontSize: 22, fontWeight: 800, color: '#1E88E5', fontFamily: 'Nunito, sans-serif' }}>{state.streak || 0}</p>
            <p style={{ fontSize: 11, color: '#757575', fontFamily: 'Nunito, sans-serif' }}>{t('complete.streak_label')}</p>
          </div>
        </div>

        {/* Ability */}
        <div style={{ background: '#F5F5F5', borderRadius: 14, padding: '14px 16px', marginTop: 20, width: '100%' }}>
          <p style={{ fontSize: 12, color: '#9E9E9E', fontFamily: 'Nunito, sans-serif' }}>{t('complete.ability')}</p>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#4CAF50', fontFamily: 'Nunito, sans-serif', marginTop: 4 }}>{data.ability}</p>
        </div>

        {/* Chunks */}
        <div style={{ marginTop: 16, width: '100%' }}>
          <p style={{ fontSize: 12, color: '#9E9E9E', fontFamily: 'Nunito, sans-serif', marginBottom: 8 }}>{t('complete.learned')}</p>
          {data.chunks.map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4CAF50' }} />
              <span style={{ fontSize: 14, fontWeight: 600, color: '#333', fontFamily: 'Nunito, sans-serif' }}>{c.en}</span>
            </div>
          ))}
        </div>

        <div style={{ height: 24 }} />
        <PrimaryButton onClick={() => navigate('/home')}>{t('complete.continue')}</PrimaryButton>
      </div>
    </div>
  );
}
