import { useNavigate } from 'react-router-dom';
import { BookOpen, ListNumbers, ArrowsLeftRight, PuzzlePiece, Shuffle, Stack, CheckCircle, CaretRight } from '@phosphor-icons/react';
import { storage } from '../utils/storage';
import { useLanguage } from '../utils/useLanguage';
import practiceFeatures from '../data/practiceFeatures';
import Geel from '../components/Geel';
import BottomNav from '../components/BottomNav';

const ICON_MAP = { BookOpen, ListNumbers, ArrowsLeftRight, PuzzlePiece, Shuffle, Stack };
const FEATURE_KEYS = Object.keys(practiceFeatures);

export default function PracticeHub() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const state = storage.get();
  const completedFeatures = state.practiceCompleted || {};

  return (
    <div style={{ background: '#F7F8FA', minHeight: '100dvh' }}>
      {/* Green header */}
      <div style={{ background: 'linear-gradient(180deg, #56C45A 0%, #4CAF50 40%, #3D9142 100%)', padding: '16px 20px 24px', borderRadius: '0 0 24px 24px', boxShadow: '0 4px 20px rgba(56,142,60,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <Geel size={40} />
          <div>
            <p style={{ fontSize: 18, fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif' }}>
              {lang === 'en' ? 'Practice' : 'Xirfadaha'}
            </p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontFamily: 'Nunito, sans-serif' }}>
              {lang === 'en' ? 'Build your skills' : 'Kor u qaad xirfadahaaga'}
            </p>
          </div>
        </div>

        {/* Overall practice progress */}
        <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '12px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontFamily: 'Nunito, sans-serif' }}>
              {lang === 'en' ? 'Overall Progress' : 'Horumarkaaga guud'}
            </span>
            <span style={{ fontSize: 14, fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif' }}>
              {Object.keys(completedFeatures).filter((k) => completedFeatures[k]).length}/{FEATURE_KEYS.length}
            </span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.2)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 3, background: 'white',
              width: `${(Object.keys(completedFeatures).filter((k) => completedFeatures[k]).length / FEATURE_KEYS.length) * 100}%`,
              transition: 'width 0.4s ease',
            }} />
          </div>
        </div>
      </div>

      {/* Feature cards */}
      <div style={{ padding: '16px 16px 100px' }}>
        <p style={{ fontSize: 13, fontWeight: 800, color: '#9E9E9E', fontFamily: 'Nunito, sans-serif', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {lang === 'en' ? 'Practice Activities' : 'Jimcsiyo ku celceli'}
        </p>

        {FEATURE_KEYS.map((key) => {
          const feature = practiceFeatures[key];
          const Icon = ICON_MAP[feature.icon] || BookOpen;
          const isCompleted = completedFeatures[key];
          const progress = state[`practice_${key}_progress`] || 0;

          return (
            <button
              key={key}
              onClick={() => navigate(`/practice/${key}`)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 14,
                padding: '18px 16px', background: 'linear-gradient(180deg, #FFFFFF 0%, #FCFCFC 100%)', borderRadius: 16,
                border: `1px solid ${feature.color}15`,
                borderBottom: `4px solid ${feature.color}40`,
                marginBottom: 10, cursor: 'pointer', textAlign: 'left',
                boxShadow: `0 2px 12px ${feature.color}10`, transition: 'all 0.08s ease',
                transform: 'translateY(0)',
              }}
              onPointerDown={(e) => { e.currentTarget.style.transform = 'translateY(3px)'; e.currentTarget.style.borderBottom = `1px solid ${feature.color}40`; }}
              onPointerUp={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderBottom = `4px solid ${feature.color}40`; }}
              onPointerLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderBottom = `4px solid ${feature.color}40`; }}
            >
              {/* Icon */}
              <div style={{
                width: 50, height: 50, borderRadius: 14, background: feature.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {isCompleted ? (
                  <CheckCircle size={26} weight="fill" color={feature.color} />
                ) : (
                  <Icon size={26} weight="fill" color={feature.color} />
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#333', fontFamily: 'Nunito, sans-serif' }}>
                  {lang === 'en' ? feature.titleEn : feature.title}
                </p>
                <p style={{ fontSize: 12, color: '#9E9E9E', fontFamily: 'Nunito, sans-serif', marginTop: 2 }}>
                  {lang === 'en' ? feature.descriptionEn : feature.description}
                </p>
                {/* Mini progress bar */}
                {progress > 0 && !isCompleted && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                    <div style={{ flex: 1, height: 4, borderRadius: 2, background: '#E0E0E0', overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: 2, background: feature.color, width: `${(progress / feature.exercises.length) * 100}%` }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: feature.color, fontFamily: 'Nunito, sans-serif' }}>{progress}/{feature.exercises.length}</span>
                  </div>
                )}
                {isCompleted && (
                  <p style={{ fontSize: 11, fontWeight: 700, color: feature.color, fontFamily: 'Nunito, sans-serif', marginTop: 4 }}>
                    {lang === 'en' ? 'Completed!' : 'Waa la dhammaystiray!'}
                  </p>
                )}
              </div>

              <CaretRight size={18} weight="bold" color="#BDBDBD" />
            </button>
          );
        })}
      </div>

      <BottomNav active="xirfadaha" />
    </div>
  );
}
