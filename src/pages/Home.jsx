import { useNavigate } from 'react-router-dom';
import { Fire, Star, SealCheck, Target, Lock, Check, Play, Egg, Book, GraduationCap, Crown, Confetti as ConfettiIcon } from '@phosphor-icons/react';
import { storage } from '../utils/storage';
import { useData } from '../utils/DataContext';
import { useLanguage } from '../utils/useLanguage';
import Geel from '../components/Geel';
import BottomNav from '../components/BottomNav';

export default function Home() {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const state = storage.get();
  const { lessonsList } = useData();
  const lessons = lessonsList || [];
  const { lessonsCompleted = [], currentLesson = 1, xp = 0, streak = 0 } = state;

  return (
    <div style={{ background: '#F7F8FA', minHeight: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      {/* Green header */}
      <div style={{ background: 'linear-gradient(180deg, #56C45A 0%, #4CAF50 40%, #3D9142 100%)', padding: 'clamp(12px, 3vw, 20px) 20px clamp(14px, 3.5vw, 24px)', borderRadius: '0 0 24px 24px', flexShrink: 0, boxShadow: '0 4px 20px rgba(56,142,60,0.3)' }}>
        {/* Geel with evolution ring + stage name */}
        {(() => {
          const completedCount = state.lessonsCompleted?.length || 0;

          const BADGE_ICONS = { Egg, Book, GraduationCap, Crown, Star };
          const GEEL_STAGES = [
            { level: 0, name: 'Geel Yar', nameEn: 'Baby Geel', color: '#FF9800', badgeIcon: 'Egg' },
            { level: 3, name: 'Geel Baro', nameEn: 'Student Geel', color: '#4CAF50', badgeIcon: 'Book' },
            { level: 6, name: 'Geel Xirfad', nameEn: 'Skilled Geel', color: '#2196F3', badgeIcon: 'GraduationCap' },
            { level: 9, name: 'Geel Libaax', nameEn: 'Master Geel', color: '#9C27B0', badgeIcon: 'Crown' },
            { level: 10, name: 'Geel Legend', nameEn: 'Legend Geel', color: '#FFC107', badgeIcon: 'Star' },
          ];

          let stage = GEEL_STAGES[0];
          for (const s of GEEL_STAGES) if (completedCount >= s.level) stage = s;
          const stageIdx = GEEL_STAGES.indexOf(stage);
          const nextStage = GEEL_STAGES[stageIdx + 1];
          const evoProgress = nextStage ? (completedCount - stage.level) / (nextStage.level - stage.level) : 1;

          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
              <div style={{ position: 'relative', flexShrink: 0, width: 'clamp(44px, 12vw, 56px)', height: 'clamp(44px, 12vw, 56px)' }}>
                <svg width="100%" height="100%" viewBox="0 0 52 52">
                  <circle cx="26" cy="26" r="23" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="4" />
                  <circle cx="26" cy="26" r="23" fill="none"
                    stroke={nextStage ? 'white' : '#FFD700'}
                    strokeWidth="4" strokeLinecap="round"
                    strokeDasharray={`${evoProgress * 144.5} 144.5`}
                    transform="rotate(-90 26 26)"
                    style={{ transition: 'stroke-dasharray 0.6s ease' }}
                  />
                </svg>
                <div style={{
                  position: 'absolute', inset: 5, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden',
                }}>
                  <Geel size={34} />
                </div>
                <div style={{
                  position: 'absolute', bottom: -3, right: -3,
                  width: 20, height: 20, borderRadius: '50%',
                  background: 'white', border: `2px solid ${stage.color}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                }}>{(() => { const BadgeIcon = BADGE_ICONS[stage.badgeIcon]; return BadgeIcon ? <BadgeIcon size={12} weight="fill" color={stage.color} /> : null; })()}</div>
              </div>
              <div>
                <p style={{ fontSize: 'clamp(15px, 4vw, 18px)', fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif', margin: 0 }}>
                  {stage.name}
                </p>
                <p style={{ fontSize: 'clamp(10px, 2.8vw, 12px)', color: 'rgba(255,255,255,0.75)', fontFamily: 'Nunito, sans-serif', margin: '2px 0 0' }}>
                  {lang === 'en' ? stage.nameEn : stage.nameEn}
                </p>
              </div>
            </div>
          );
        })()}
        {/* Stats row */}
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          {/* Streak */}
          <div style={{
            flex: 1, background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 16,
            padding: '12px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          }}>
            <div style={{
              width: 'clamp(30px, 8vw, 40px)', height: 'clamp(30px, 8vw, 40px)', borderRadius: 'clamp(8px, 2vw, 12px)', background: '#FBE9E7',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06), inset 0 -1px 2px rgba(0,0,0,0.04)',
            }}>
              <Fire size={20} weight="fill" color="#FF7043" />
            </div>
            <span style={{ fontSize: 'clamp(16px, 4.5vw, 22px)', fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif' }}>{streak}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.8)', fontFamily: 'Nunito, sans-serif' }}>{t('home.streak')}</span>
          </div>

          {/* XP */}
          <div style={{
            flex: 1, background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 16,
            padding: '12px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          }}>
            <div style={{
              width: 'clamp(30px, 8vw, 40px)', height: 'clamp(30px, 8vw, 40px)', borderRadius: 'clamp(8px, 2vw, 12px)', background: '#FFF8E1',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06), inset 0 -1px 2px rgba(0,0,0,0.04)',
            }}>
              <Star size={20} weight="fill" color="#FFCA28" />
            </div>
            <span style={{ fontSize: 'clamp(16px, 4.5vw, 22px)', fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif' }}>{xp}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.8)', fontFamily: 'Nunito, sans-serif' }}>{t('home.xp')}</span>
          </div>

          {/* Done */}
          <div style={{
            flex: 1, background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 16,
            padding: '12px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          }}>
            <div style={{
              width: 'clamp(30px, 8vw, 40px)', height: 'clamp(30px, 8vw, 40px)', borderRadius: 'clamp(8px, 2vw, 12px)', background: '#E8F5E9',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06), inset 0 -1px 2px rgba(0,0,0,0.04)',
            }}>
              <SealCheck size={20} weight="fill" color="#4CAF50" />
            </div>
            <span style={{ fontSize: 'clamp(16px, 4.5vw, 22px)', fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif' }}>{lessonsCompleted.length}/10</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.8)', fontFamily: 'Nunito, sans-serif' }}>{t('home.done')}</span>
          </div>
        </div>
      </div>

      {/* CONTENT — fills remaining screen */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        padding: 'clamp(12px, 3vw, 20px) 16px 0',
        paddingBottom: 'max(70px, calc(60px + env(safe-area-inset-bottom)))',
        overflow: 'visible', minHeight: 0,
      }}>

      {(() => {
        const completedCount = state.lessonsCompleted?.length || 0;
        const currentLessonId = state.currentLesson || 1;
        const allDone = completedCount >= 10;

        // Stage color for accent
        const GEEL_STAGES = [
          { level: 0, color: '#FF9800' },
          { level: 3, color: '#4CAF50' },
          { level: 6, color: '#2196F3' },
          { level: 9, color: '#9C27B0' },
          { level: 10, color: '#FFC107' },
        ];
        let stageColor = '#FF9800';
        for (const s of GEEL_STAGES) {
          if (completedCount >= s.level) stageColor = s.color;
        }

        const currentLesson = (lessons || []).find((l) => l.id === currentLessonId);

        return (
          <>
            {/* CURRENT MISSION */}
            {!allDone && currentLesson && (
              <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', marginBottom: 14, minHeight: 'clamp(100px, 18vh, 180px)' }}>
                <p style={{
                  fontSize: 12, fontWeight: 800, color: '#9E9E9E', fontFamily: 'Nunito, sans-serif',
                  textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 10, paddingLeft: 4,
                  flexShrink: 0,
                }}>
                  {lang === 'en' ? 'Next Lesson' : 'Casharka xiga'}
                </p>
                <div
                  onClick={() => navigate(`/lesson/${currentLessonId}`)}
                  style={{
                    background: 'linear-gradient(180deg, #FFFFFF 0%, #FCFCFC 100%)', borderRadius: 24,
                    padding: 'clamp(16px, 4vw, 24px) clamp(14px, 3.5vw, 22px)',
                    border: '1px solid rgba(0,0,0,0.05)', borderLeft: `5px solid ${stageColor}`,
                    borderBottom: '3px solid rgba(0,0,0,0.06)',
                    display: 'flex', alignItems: 'center', gap: 18,
                    cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    flex: '1 1 auto', minHeight: 0,
                    transition: 'transform 0.15s',
                  }}
                  onPointerDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
                  onPointerUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                  onPointerLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  <div style={{
                    width: 'clamp(52px, 14vw, 72px)', height: 'clamp(52px, 14vw, 72px)', borderRadius: 'clamp(14px, 3.5vw, 20px)',
                    background: `linear-gradient(135deg, ${stageColor}, ${stageColor}BB)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 6px 20px ${stageColor}33`, flexShrink: 0,
                  }}>
                    <span style={{ fontSize: 'clamp(22px, 6vw, 32px)', fontWeight: 900, color: 'white', fontFamily: 'Nunito, sans-serif' }}>
                      {currentLessonId}
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 'clamp(16px, 4.2vw, 20px)', fontWeight: 800, color: '#333', fontFamily: 'Nunito, sans-serif', margin: 0 }}>
                      {currentLesson.titleSo}
                    </p>
                    <p style={{ fontSize: 'clamp(12px, 3.2vw, 15px)', color: '#9E9E9E', fontFamily: 'Nunito, sans-serif', margin: '4px 0 0' }}>
                      {currentLesson.titleEn}
                    </p>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 10,
                      background: '#E8F5E9', borderRadius: 8, padding: '5px 12px',
                    }}>
                      <Star size={14} weight="fill" color="#4CAF50" />
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#4CAF50', fontFamily: 'Nunito, sans-serif' }}>
                        +10 XP
                      </span>
                    </div>
                  </div>
                  <div style={{
                    width: 'clamp(44px, 12vw, 56px)', height: 'clamp(44px, 12vw, 56px)', borderRadius: '50%',
                    background: '#4CAF50', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 16px rgba(76,175,80,0.35)', flexShrink: 0,
                  }}>
                    <Play size={22} weight="fill" color="white" />
                  </div>
                </div>
              </div>
            )}

            {/* When all done */}
            {allDone && (
              <div style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', marginBottom: 14,
              }}>
                <ConfettiIcon size={48} weight="fill" color="#FFC107" />
                <p style={{ fontSize: 22, fontWeight: 900, color: '#333', fontFamily: 'Nunito, sans-serif', margin: '10px 0 0', textAlign: 'center' }}>
                  {lang === 'en' ? 'All lessons completed!' : 'Dhammaan casharro waa la dhammaystiray!'}
                </p>
                <p style={{ fontSize: 14, color: '#9E9E9E', fontFamily: 'Nunito, sans-serif', marginTop: 6, textAlign: 'center' }}>
                  Geel Legend ayaad tahay <Star size={14} weight="fill" color="#FFC107" />
                </p>
              </div>
            )}

            {/* LESSON GRID */}
            <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', marginBottom: 14, minHeight: 'clamp(120px, 22vh, 220px)' }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', marginBottom: 10,
                paddingLeft: 4, paddingRight: 4, flexShrink: 0,
              }}>
                <p style={{
                  fontSize: 12, fontWeight: 800, color: '#9E9E9E', fontFamily: 'Nunito, sans-serif',
                  textTransform: 'uppercase', letterSpacing: 1.5, margin: 0,
                }}>
                  {lang === 'en' ? 'All Lessons' : 'Dhammaan casharro'}
                </p>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#9E9E9E', fontFamily: 'Nunito, sans-serif', margin: 0 }}>
                  {completedCount}/10
                </p>
              </div>

              {/* Wrapped grid — 5 per row, centered vertically */}
              <div style={{
                flex: 1,
                display: 'flex', flexWrap: 'wrap',
                gap: 'clamp(8px, 2.5vw, 14px)',
                justifyContent: 'center', alignContent: 'center',
                padding: 'clamp(4px, 1.5vw, 10px) 0',
              }}>
                {(lessons || []).slice(0, 10).map((lesson) => {
                  const id = lesson.id;
                  const isCompleted = (state.lessonsCompleted || []).includes(id);
                  const isCurrent = id === currentLessonId && !isCompleted;
                  const isLocked = id > currentLessonId;

                  return (
                    <div key={id}
                      onClick={() => { if (!isLocked) navigate(`/lesson/${id}`); }}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        gap: 6, cursor: isLocked ? 'not-allowed' : 'pointer',
                        opacity: isLocked ? 0.25 : 1,
                        width: 'clamp(48px, 16%, 64px)',
                      }}
                    >
                      <div style={{
                        width: isCurrent ? 'clamp(46px, 12vw, 56px)' : 'clamp(40px, 10vw, 48px)',
                        height: isCurrent ? 'clamp(46px, 12vw, 56px)' : 'clamp(40px, 10vw, 48px)',
                        borderRadius: isCurrent ? 'clamp(14px, 3.5vw, 18px)' : '50%',
                        background: isCompleted ? 'white' : isCurrent ? '#4CAF50' : '#F5F5F5',
                        border: isCompleted ? '2.5px solid #4CAF50' : isCurrent ? '3px solid #388E3C' : '2px solid #E0E0E0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: isCurrent ? '0 4px 14px rgba(76,175,80,0.35)' : 'none',
                        transition: 'all 0.3s ease',
                      }}>
                        {isCompleted ? (
                          <Check size={20} weight="bold" color="#4CAF50" />
                        ) : isCurrent ? (
                          <span style={{ fontSize: 20, fontWeight: 900, color: 'white', fontFamily: 'Nunito, sans-serif' }}>{id}</span>
                        ) : (
                          <Lock size={16} weight="fill" color="#BDBDBD" />
                        )}
                      </div>
                      <span style={{
                        fontSize: 'clamp(9px, 2.3vw, 11px)', fontWeight: 600, color: '#9E9E9E', fontFamily: 'Nunito, sans-serif',
                        textAlign: 'center', lineHeight: 1.2, maxWidth: 'clamp(44px, 12vw, 56px)',
                      }}>
                        {isLocked ? '???' : (lesson.titleSo || '').split(' ').slice(0, 2).join(' ')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* DAILY CHALLENGE — pinned at bottom */}
            <div style={{
              background: 'linear-gradient(180deg, #FFFFFF 0%, #FCFCFC 100%)', borderRadius: 20,
              padding: 'clamp(14px, 3.5vw, 20px) clamp(14px, 3.5vw, 20px)',
              border: '1px solid rgba(0,0,0,0.05)', borderBottom: '3px solid rgba(0,0,0,0.06)',
              display: 'flex', alignItems: 'center', gap: 16,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)', flexShrink: 0,
            }}>
              <div style={{
                width: 'clamp(42px, 11vw, 56px)', height: 'clamp(42px, 11vw, 56px)', borderRadius: 'clamp(12px, 3vw, 16px)',
                background: '#FFF3E0', display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}><Target size={28} weight="fill" color="#FF9800" /></div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 'clamp(14px, 3.5vw, 16px)', fontWeight: 700, color: '#333', fontFamily: 'Nunito, sans-serif', margin: 0 }}>
                  {lang === 'en' ? "Today's Challenge" : 'Tartanka Maanta'}
                </p>
                <p style={{ fontSize: 'clamp(11px, 2.8vw, 13px)', color: '#9E9E9E', fontFamily: 'Nunito, sans-serif', margin: '3px 0 0' }}>
                  {lang === 'en' ? 'Complete 1 lesson today' : '1 cashaar dhammee maanta'}
                </p>
                <div style={{ marginTop: 10, height: 'clamp(4px, 1.2vw, 6px)', borderRadius: 3, background: '#F0F0F0', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 3,
                    width: completedCount > 0 ? '100%' : '0%',
                    background: 'linear-gradient(90deg, #FF9800, #FFC107)',
                    transition: 'width 0.5s ease',
                  }} />
                </div>
              </div>
              <div style={{
                padding: '6px 14px', borderRadius: 10,
                background: completedCount > 0 ? '#E8F5E9' : '#F5F5F5',
              }}>
                <span style={{
                  fontSize: 13, fontWeight: 800, fontFamily: 'Nunito, sans-serif',
                  color: completedCount > 0 ? '#4CAF50' : '#BDBDBD',
                }}>
                  {completedCount > 0 ? <><Check size={14} weight="bold" color="#4CAF50" /> Done</> : '0/1'}
                </span>
              </div>
            </div>
          </>
        );
      })()}

      </div>

      <BottomNav active="casharo" />
    </div>
  );
}
