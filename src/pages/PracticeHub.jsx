import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { BookOpen, ListNumbers, ArrowsLeftRight, PuzzlePiece, Shuffle, Stack, CheckCircle, CaretRight, Calendar, Fire } from '@phosphor-icons/react';
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

  useEffect(() => { storage.checkDailyReset(); }, []);

  const dailyState = state.dailyPractice || {};
  const isDailyCompleted = dailyState.completed && dailyState.date === new Date().toISOString().split('T')[0];
  const dailyProgress = dailyState.progress || 0;
  const dailyStreak = state.dailyStreak || 0;

  const getTimeUntilReset = () => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight - now;
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div style={{ background: '#FBF7F0', minHeight: '100dvh' }}>
      {/* Teal header */}
      <div style={{ background: 'linear-gradient(180deg, #22D3EE 0%, #0891B2 40%, #0E7490 100%)', padding: '16px 20px 24px', borderRadius: '0 0 24px 24px', boxShadow: '0 4px 20px rgba(8,145,178,0.3)' }}>
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

      {/* Daily Mix Card */}
      <div style={{ padding: '16px 16px 0' }}>
        {!isDailyCompleted ? (
          <div style={{
            padding: 3, borderRadius: 22,
            background: 'linear-gradient(90deg, #0891B2, #22D3EE, #7C3AED, #E11D48, #0891B2)',
            backgroundSize: '200% 100%',
            animation: 'borderRotate 8s linear infinite',
          }}>
            <button
              onClick={() => navigate('/practice/daily')}
              style={{
                width: '100%', padding: 0,
                background: 'linear-gradient(135deg, #FFFFFF 0%, #F0FDFF 100%)',
                borderRadius: 20, border: 'none', cursor: 'pointer',
                textAlign: 'left', overflow: 'hidden',
              }}
            >
              <div style={{ padding: '18px 18px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <Calendar size={20} weight="fill" color="#0891B2" />
                      <span style={{ fontSize: 18, fontWeight: 800, color: '#1E293B', fontFamily: 'Nunito, sans-serif' }}>
                        {lang === 'en' ? 'Daily Mix' : 'Jimicsiga Maanta'}
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: '#64748B', fontFamily: 'Nunito, sans-serif' }}>
                      {lang === 'en' ? '12 exercises \u2022 All skills' : '12 su\'aalo \u2022 Dhammaan xirfadaha'}
                    </p>
                  </div>
                  {dailyStreak > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#FFF7ED', padding: '6px 10px', borderRadius: 10 }}>
                      <Fire size={16} weight="fill" color="#EA580C" />
                      <span style={{ fontSize: 13, fontWeight: 800, color: '#EA580C', fontFamily: 'Nunito, sans-serif' }}>{dailyStreak}</span>
                    </div>
                  )}
                </div>

                {dailyProgress > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 11, color: '#64748B', fontFamily: 'Nunito, sans-serif' }}>{dailyProgress}/12</span>
                      <span style={{ fontSize: 11, color: '#0891B2', fontWeight: 700, fontFamily: 'Nunito, sans-serif' }}>{Math.round((dailyProgress / 12) * 100)}%</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 3, background: '#E2E8F0', overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: 3, background: 'linear-gradient(90deg, #0891B2, #22D3EE)', width: `${(dailyProgress / 12) * 100}%`, transition: 'width 0.4s ease' }} />
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {[
                    { label: 'vocab', color: '#0891B2' },
                    { label: 'plurals', color: '#7C3AED' },
                    { label: 'opposites', color: '#EA580C' },
                    { label: 'word form.', color: '#16A34A' },
                    { label: 'conjugation', color: '#E11D48' },
                    { label: 'sentence', color: '#2563EB' },
                  ].map((skill, i) => (
                    <span key={skill.label} style={{
                      fontSize: 9, fontWeight: 700, padding: '4px 10px', borderRadius: 6,
                      background: `${skill.color}12`, color: skill.color,
                      fontFamily: 'Nunito, sans-serif',
                      animation: `pillPulse 3s ease-in-out ${i * 0.5}s infinite`,
                    }}>
                      {skill.label} x2
                    </span>
                  ))}
                </div>
              </div>

              <div style={{
                padding: '14px 18px',
                background: 'linear-gradient(180deg, #0891B2 0%, #0E7490 100%)',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 3s linear infinite',
                }} />
                <span style={{ fontSize: 14, fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif', textTransform: 'uppercase', letterSpacing: 1, position: 'relative', zIndex: 1 }}>
                  {dailyProgress > 0 ? (lang === 'en' ? 'CONTINUE' : 'SII WAD') : (lang === 'en' ? 'START' : 'BILOW')}
                </span>
              </div>
            </button>
          </div>
        ) : (
          <div style={{
            background: 'linear-gradient(135deg, #0891B2, #22D3EE)',
            borderRadius: 20, padding: 18,
            boxShadow: '0 4px 16px rgba(8,145,178,0.25)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle size={24} weight="fill" color="white" />
                <span style={{ fontSize: 18, fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif' }}>
                  {lang === 'en' ? 'Daily Complete!' : 'Maanta Waa Dhammaatay!'}
                </span>
              </div>
              {dailyStreak > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.2)', padding: '6px 10px', borderRadius: 10 }}>
                  <Fire size={16} weight="fill" color="white" />
                  <span style={{ fontSize: 13, fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif' }}>{dailyStreak}</span>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.9)', fontFamily: 'Nunito, sans-serif' }}>
                {dailyState.correctCount}/12 {lang === 'en' ? 'correct' : 'sax'} {'\u2022'} +{dailyState.dahabEarned || 0} Dahab
              </span>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontFamily: 'Nunito, sans-serif' }}>
                {lang === 'en' ? 'Resets in' : 'Dib u bilowga'} {getTimeUntilReset()}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Feature cards */}
      <div style={{ padding: '16px 16px 100px' }}>
        <p style={{ fontSize: 13, fontWeight: 800, color: '#64748B', fontFamily: 'Nunito, sans-serif', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
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
                <p style={{ fontSize: 15, fontWeight: 700, color: '#1E293B', fontFamily: 'Nunito, sans-serif' }}>
                  {lang === 'en' ? feature.titleEn : feature.title}
                </p>
                <p style={{ fontSize: 12, color: '#64748B', fontFamily: 'Nunito, sans-serif', marginTop: 2 }}>
                  {lang === 'en' ? feature.descriptionEn : feature.description}
                </p>
                {/* Mini progress bar */}
                {progress > 0 && !isCompleted && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                    <div style={{ flex: 1, height: 4, borderRadius: 2, background: '#E2E8F0', overflow: 'hidden' }}>
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
