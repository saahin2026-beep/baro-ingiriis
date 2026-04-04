import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Fire, Trophy, CheckCircle } from '@phosphor-icons/react';
import { storage } from '../utils/storage';
import { useLanguage } from '../utils/useLanguage';
import practiceFeatures from '../data/practiceFeatures';
import Geel from '../components/Geel';

const FEATURE_KEYS = Object.keys(practiceFeatures);

export default function Progress() {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const state = storage.get();
  const { xp = 0, streak = 0, longestStreak = 0, lessonsCompleted = [] } = state;
  const completedFeatures = state.practiceCompleted || {};

  const lessonPct = Math.round((lessonsCompleted.length / 10) * 100);

  return (
    <div style={{ background: '#FBF7F0', minHeight: '100dvh' }}>
      {/* Green top bar */}
      <div style={{ background: 'linear-gradient(180deg, #22D3EE 0%, #0891B2 40%, #0E7490 100%)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10, minHeight: 48, boxShadow: '0 4px 20px rgba(8,145,178,0.3)' }}>
        <button onClick={() => navigate('/astaanta')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
          <ArrowLeft size={22} weight="bold" color="white" />
        </button>
        <span style={{ fontSize: 17, fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif' }}>
          {t('progress.title')}
        </span>
      </div>

      <div style={{ padding: '20px 16px 40px' }}>
        {/* Geel */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <Geel size={100} expression={lessonPct > 50 ? 'celebrating' : 'happy'} />
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          <StatCard icon={Star} iconColor="#FFCA28" iconBg="#FFF8E1" label={t('progress.total_xp')} value={xp} />
          <StatCard icon={Fire} iconColor="#FF7043" iconBg="#FBE9E7" label={t('progress.current_streak')} value={`${streak} ${t('progress.days')}`} />
          <StatCard icon={Trophy} iconColor="#AB47BC" iconBg="#F3E5F5" label={t('progress.longest_streak')} value={`${longestStreak} ${t('progress.days')}`} />
          <StatCard icon={CheckCircle} iconColor="#0891B2" iconBg="#ECFEFF" label={t('progress.lessons_done')} value={`${lessonsCompleted.length}/10`} />
        </div>

        {/* Growth Area */}
        <p style={{ fontSize: 15, fontWeight: 700, color: '#1E293B', fontFamily: 'Nunito, sans-serif', marginBottom: 14, marginTop: 8 }}>
          {lang === 'en' ? 'Growth Area' : 'Horumarkaaga'}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 24 }}>
          <ProgressRing
            percentage={lessonPct}
            label={lang === 'en' ? 'Lessons' : 'Casharro'}
            color="#0891B2"
          />
          {FEATURE_KEYS.map((key) => {
            const feature = practiceFeatures[key];
            const done = completedFeatures[key];
            const progress = state[`practice_${key}_progress`] || 0;
            const pct = done ? 100 : Math.round((progress / feature.exercises.length) * 100);
            return (
              <ProgressRing
                key={key}
                percentage={pct}
                label={lang === 'en' ? feature.titleEn : feature.title}
                color={feature.color}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, iconColor, iconBg, label, value }) {
  return (
    <div style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FCFCFC 100%)', borderRadius: 16, padding: '16px 14px', border: '1px solid rgba(0,0,0,0.05)', borderBottom: '3px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.06), inset 0 -1px 2px rgba(0,0,0,0.04)' }}>
        <Icon size={24} weight="fill" color={iconColor} />
      </div>
      <span style={{ fontSize: 20, fontWeight: 800, color: '#1E293B', fontFamily: 'Nunito, sans-serif' }}>{value}</span>
      <span style={{ fontSize: 11, fontWeight: 600, color: '#64748B', fontFamily: 'Nunito, sans-serif', textAlign: 'center' }}>{label}</span>
    </div>
  );
}

function ProgressRing({ percentage, label, color }) {
  const radius = 38;
  const stroke = 7;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{
      background: 'linear-gradient(180deg, #FFFFFF 0%, #FCFCFC 100%)', borderRadius: 16, padding: '14px 8px 10px',
      border: '1px solid rgba(0,0,0,0.05)', borderBottom: '3px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: 6,
    }}>
      <div style={{ position: 'relative', width: 86, height: 86 }}>
        <svg width="86" height="86" viewBox="0 0 86 86">
          <defs>
            <filter id={`glow-${color.replace('#','')}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle cx="43" cy="43" r={radius} fill="none" stroke="#E2E8F0" strokeWidth={stroke} />
          <circle cx="43" cy="43" r={radius} fill="none" stroke={color} strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 43 43)"
            filter={`url(#glow-${color.replace('#','')})`}
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#1E293B', fontFamily: 'Nunito, sans-serif' }}>
            {percentage}%
          </span>
        </div>
      </div>
      <span style={{
        fontSize: 11, fontWeight: 600, color: '#64748B', fontFamily: 'Nunito, sans-serif',
        textAlign: 'center', lineHeight: 1.2,
      }}>
        {label}
      </span>
    </div>
  );
}
