import { useNavigate } from 'react-router-dom';
import { Lock, Check, CaretRight } from '@phosphor-icons/react';
import { storage } from '../utils/storage';
import { useData } from '../utils/DataContext';
import { useLanguage } from '../utils/useLanguage';
import Geel from '../components/Geel';
import BottomNav from '../components/BottomNav';

const LESSON_EMOJIS = {
  1: '👋', 2: '👨‍👩‍👧‍👦', 3: '🔢', 4: '🍽️', 5: '⏰',
  6: '📍', 7: '💼', 8: '🚗', 9: '🏥', 10: '🎉',
};

export default function Home() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const state = storage.get();
  const { lessonsList } = useData();
  const lessons = (lessonsList || []).slice(0, 10);
  const { lessonsCompleted = [], currentLesson = 1 } = state;

  return (
    <div style={{ background: '#FBF7F0', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      {/* ═══ HEADER ═══ */}
      <div style={{
        background: 'linear-gradient(180deg, #22D3EE 0%, #0891B2 40%, #0E7490 100%)',
        padding: 'clamp(16px, 4vw, 24px)',
        borderRadius: '0 0 24px 24px',
        boxShadow: '0 4px 20px rgba(8,145,178,0.3)',
        display: 'flex', alignItems: 'center', gap: 'clamp(10px, 2.5vw, 16px)',
        flexShrink: 0,
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Geel size={36} />
        </div>
        <div>
          <p style={{ fontSize: 'clamp(16px, 4vw, 22px)', fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif', margin: 0 }}>
            {lang === 'en' ? 'Lessons' : 'Casharka'}
          </p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', fontFamily: 'Nunito, sans-serif', margin: '3px 0 0' }}>
            {lessonsCompleted.length} of 10 complete
          </p>
        </div>
      </div>

      {/* ═══ LESSON CARDS ═══ */}
      <div style={{
        flex: 1, padding: 'clamp(16px, 4vw, 24px) clamp(14px, 3.5vw, 20px)',
        paddingBottom: 'max(110px, calc(90px + env(safe-area-inset-bottom)))',
        overflowY: 'auto',
      }}>
        {lessons.map((lesson) => {
          const id = lesson.id;
          const isCompleted = (lessonsCompleted || []).includes(id);
          const isCurrent = id === currentLesson && !isCompleted;
          const isLocked = id > currentLesson;

          // ── COMPLETED ──
          if (isCompleted) {
            return (
              <div
                key={id}
                onClick={() => navigate(`/lesson/${id}`)}
                style={{
                  background: 'white', borderRadius: 'clamp(14px, 3.5vw, 20px)', padding: 'clamp(14px, 3.5vw, 20px)', marginBottom: 'clamp(10px, 2.5vw, 14px)',
                  display: 'flex', alignItems: 'center', gap: 'clamp(10px, 2.5vw, 16px)',
                  border: '2px solid #22C55E', cursor: 'pointer',
                }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: 14, background: '#F0FDF4',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Check size={26} weight="bold" color="#22C55E" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#22C55E', fontFamily: 'Nunito, sans-serif' }}>
                      LESSON {id}
                    </span>
                    <span style={{
                      fontSize: 10, color: '#22C55E', background: '#DCFCE7',
                      padding: '2px 8px', borderRadius: 6, fontFamily: 'Nunito, sans-serif', fontWeight: 600,
                    }}>
                      {lang === 'en' ? 'Done' : 'Dhammaystay'}
                    </span>
                  </div>
                  <p style={{ fontSize: 'clamp(15px, 3.8vw, 19px)', fontWeight: 800, color: '#1E293B', fontFamily: 'Nunito, sans-serif', margin: '4px 0 0' }}>
                    {lesson.titleSo}
                  </p>
                  <p style={{ fontSize: 13, color: '#64748B', fontFamily: 'Nunito, sans-serif', margin: '2px 0 0' }}>
                    {lesson.titleEn}
                  </p>
                </div>
                <CaretRight size={20} weight="bold" color="#CBD5E1" />
              </div>
            );
          }

          // ── CURRENT ──
          if (isCurrent) {
            return (
              <div
                key={id}
                onClick={() => navigate(`/lesson/${id}`)}
                style={{
                  background: 'linear-gradient(135deg, #0891B2 0%, #0E7490 100%)',
                  borderRadius: 'clamp(14px, 3.5vw, 20px)', padding: 'clamp(16px, 4vw, 22px)', marginBottom: 'clamp(10px, 2.5vw, 14px)',
                  display: 'flex', alignItems: 'center', gap: 'clamp(10px, 2.5vw, 16px)',
                  cursor: 'pointer',
                  animation: 'subtlePulse 3s ease-in-out infinite',
                }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: 14,
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, fontSize: 28,
                }}>
                  {LESSON_EMOJIS[id] || '📚'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.8)', fontFamily: 'Nunito, sans-serif' }}>
                      LESSON {id}
                    </span>
                    <span style={{
                      fontSize: 10, color: 'white', background: 'rgba(255,255,255,0.25)',
                      padding: '2px 8px', borderRadius: 6, fontFamily: 'Nunito, sans-serif', fontWeight: 600,
                    }}>
                      {lang === 'en' ? 'Next' : 'Xiga'}
                    </span>
                  </div>
                  <p style={{ fontSize: 17, fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif', margin: '4px 0 0' }}>
                    {lesson.titleSo}
                  </p>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', fontFamily: 'Nunito, sans-serif', margin: '2px 0 0' }}>
                    {lesson.titleEn}
                  </p>
                </div>
                <div style={{ background: 'white', padding: '10px 16px', borderRadius: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#0891B2', fontFamily: 'Nunito, sans-serif' }}>
                    {lang === 'en' ? 'START' : 'BILOW'}
                  </span>
                </div>
              </div>
            );
          }

          // ── LOCKED ──
          return (
            <div
              key={id}
              style={{
                background: 'white', borderRadius: 'clamp(14px, 3.5vw, 20px)', padding: 'clamp(14px, 3.5vw, 20px)', marginBottom: 'clamp(10px, 2.5vw, 14px)',
                display: 'flex', alignItems: 'center', gap: 'clamp(10px, 2.5vw, 16px)',
                opacity: 0.6, cursor: 'default',
              }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 14, background: '#F1F5F9',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Lock size={22} weight="fill" color="#94A3B8" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', fontFamily: 'Nunito, sans-serif' }}>
                  LESSON {id}
                </span>
                <p style={{ fontSize: 'clamp(15px, 3.8vw, 19px)', fontWeight: 800, color: '#64748B', fontFamily: 'Nunito, sans-serif', margin: '4px 0 0' }}>
                  {lesson.titleSo}
                </p>
                <p style={{ fontSize: 13, color: '#94A3B8', fontFamily: 'Nunito, sans-serif', margin: '2px 0 0' }}>
                  {lesson.titleEn}
                </p>
              </div>
              <Lock size={20} weight="fill" color="#CBD5E1" />
            </div>
          );
        })}
      </div>

      <BottomNav active="casharo" />
    </div>
  );
}
