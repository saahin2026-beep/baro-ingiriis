import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../utils/DataContext';
import { useLanguage } from '../utils/useLanguage';
import Geel from '../components/Geel';
import PrimaryButton from '../components/PrimaryButton';
import GreenTopBar from '../components/GreenTopBar';

export default function LessonIntro() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { lessonData } = useData();
  const data = lessonData?.[id];

  if (!data) { navigate('/home'); return null; }

  return (
    <div style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FFF8 100%)', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <GreenTopBar leftIcon="←" leftOnClick={() => navigate('/home')} title={`${t('lesson.lesson')} ${data.id}`} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 20px 32px', animation: 'fadeSlideUp 0.4s ease-out both' }}>
        <div style={{ animation: 'scaleIn 0.5s ease-out 0.2s both' }}><Geel size={110} expression="happy" /></div>
        <div style={{
          width: 48, height: 48, borderRadius: '50%', background: '#4CAF50',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginTop: 16, boxShadow: '0 4px 12px rgba(76,175,80,0.3)',
        }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif' }}>{data.id}</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#333', fontFamily: 'Nunito, sans-serif', marginTop: 10, textAlign: 'center' }}>
          {data.titleSo}
        </h1>
        <p style={{ fontSize: 13, color: '#757575', fontFamily: 'Nunito, sans-serif', marginTop: 2 }}>({data.titleEn})</p>

        <p style={{ fontSize: 13, color: '#9E9E9E', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginTop: 16 }}>
          {t('lesson.ability_intro')}
        </p>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#4CAF50', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginTop: 4 }}>
          {data.ability}
        </p>

        {data.explanation.map((line, i) => (
          <p key={i} style={{ fontSize: 13, color: '#757575', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginTop: 8, lineHeight: 1.6 }}>
            {line}
          </p>
        ))}

        <div style={{ width: '100%', marginTop: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#333', fontFamily: 'Nunito, sans-serif', marginBottom: 10 }}>
            {t('lesson.chunks_title')}
          </p>
          {data.chunks.map((chunk, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px',
              borderRadius: 12, background: '#F5F5F5', marginBottom: 6,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4CAF50', marginTop: 7, flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#2E7D32', fontFamily: 'Nunito, sans-serif' }}>{chunk.en}</p>
                <p style={{ fontSize: 12, color: '#757575', fontFamily: 'Nunito, sans-serif', marginTop: 1 }}>{chunk.so}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ flex: 1, minHeight: 20 }} />
        <PrimaryButton onClick={() => navigate(`/lesson/${id}/play`)}>{t('lesson.start')}</PrimaryButton>
      </div>
    </div>
  );
}
