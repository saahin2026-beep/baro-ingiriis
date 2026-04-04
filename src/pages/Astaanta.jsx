import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trash, Warning, Bell, ChartBar,
  ShieldCheck, BookOpen, Info, Crown, SignOut, CaretRight, Globe, Heart
} from '@phosphor-icons/react';
import { storage } from '../utils/storage';
import { useLanguage } from '../utils/useLanguage';
import Geel from '../components/Geel';
import BottomNav from '../components/BottomNav';

export default function Astaanta() {
  const navigate = useNavigate();
  const { t, lang, setLang } = useLanguage();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetDone, setResetDone] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const state = storage.get();

  const handleReset = () => {
    storage.reset();
    setResetDone(true);
    setShowResetConfirm(false);
    setTimeout(() => { window.location.href = '/'; }, 1500);
  };

  return (
    <div style={{ background: '#FBF7F0', minHeight: '100dvh' }}>
      {/* Green top bar */}
      <div style={{
        background: 'linear-gradient(180deg, #22D3EE 0%, #0891B2 40%, #0E7490 100%)', padding: '10px 16px',
        display: 'flex', alignItems: 'center', gap: 10, minHeight: 48,
        boxShadow: '0 4px 20px rgba(8,145,178,0.3)',
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
        }}>
          <Geel size={26} />
        </div>
        <span style={{ fontSize: 17, fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif' }}>
          {t('astaanta.title')}
        </span>
      </div>

      <div style={{ overflowY: 'auto', paddingBottom: 100 }}>
        {/* Banner */}
        <div style={{ padding: '16px 16px 0' }}>
          <div style={{
            background: 'linear-gradient(135deg, #0891B2 0%, #22D3EE 100%)',
            borderRadius: 16, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14,
            boxShadow: '0 2px 12px rgba(8,145,178,0.25)', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', right: -20, top: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
            <div style={{
              width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Crown size={24} weight="fill" color="white" />
            </div>
            <div style={{ flex: 1, zIndex: 1 }}>
              <p style={{ fontSize: 15, fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif' }}>{t('astaanta.banner_title')}</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', fontFamily: 'Nunito, sans-serif', marginTop: 2 }}>{t('astaanta.banner_sub')}</p>
            </div>
          </div>
        </div>

        {/* Profile section — tappable */}
        <div
          onClick={() => setShowProfile(true)}
          style={{ padding: '20px 16px 0', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}
        >
          <div style={{
            width: 64, height: 64, borderRadius: '50%', background: '#ECFEFF',
            border: '3px solid #0891B2', display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', boxShadow: '0 2px 8px rgba(8,145,178,0.2)',
          }}>
            <Geel size={50} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 18, fontWeight: 800, color: '#1E293B', fontFamily: 'Nunito, sans-serif' }}>
              {state.userName || (state.guestMode ? t('astaanta.guest') : t('astaanta.student'))}
            </p>
            <p style={{ fontSize: 13, color: '#64748B', fontFamily: 'Nunito, sans-serif', marginTop: 1 }}>
              {state.authComplete ? (state.profileComplete ? '@' + (state.username || '') : t('astaanta.student_sub')) : t('astaanta.guest_sub')}
            </p>
          </div>
          <CaretRight size={18} weight="bold" color="#94A3B8" />
        </div>

        <div style={{ height: 1, background: '#E2E8F0', margin: '20px 16px 0' }} />

        {/* Menu */}
        <div style={{ padding: '8px 16px 0' }}>
          <MenuItem icon={BookOpen} iconColor="#1E88E5" iconBg="#E3F2FD" label={t('astaanta.manage_courses')} sublabel={t('astaanta.manage_courses_sub')} onClick={() => navigate('/home')} />
          <MenuItem icon={ChartBar} iconColor="#FB8C00" iconBg="#FFF3E0" label={t('astaanta.progress')} sublabel={`${state.xp || 0} XP · ${state.lessonsCompleted?.length || 0}/10`} onClick={() => navigate('/progress/stats')} />
          {/* Language toggle */}
          <div style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 4px',
            borderBottom: '1px solid #F1F5F9',
          }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: '#E0F2F1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Globe size={20} weight="fill" color="#00897B" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#1E293B', fontFamily: 'Nunito, sans-serif' }}>{t('astaanta.appearance')}</p>
              <p style={{ fontSize: 12, color: '#64748B', fontFamily: 'Nunito, sans-serif', marginTop: 1 }}>
                {lang === 'so' ? 'Soomaali' : 'English'}
              </p>
            </div>
            <div
              onClick={() => setLang(lang === 'so' ? 'en' : 'so')}
              style={{
                width: 96, height: 36, borderRadius: 18, background: '#ECFEFF', cursor: 'pointer',
                display: 'flex', alignItems: 'center', padding: '3px',
                position: 'relative', transition: 'background 0.3s',
                border: '1px solid #CFFAFE',
              }}
            >
              <div style={{
                position: 'absolute', left: lang === 'so' ? 3 : 'calc(100% - 49px)',
                width: 46, height: 30, borderRadius: 15, background: '#0891B2',
                transition: 'left 0.3s ease', boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif' }}>
                  {lang === 'so' ? 'SO' : 'EN'}
                </span>
              </div>
              <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', padding: '0 10px', zIndex: 0 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: lang === 'so' ? 'transparent' : '#64748B', fontFamily: 'Nunito, sans-serif' }}>SO</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: lang === 'en' ? 'transparent' : '#64748B', fontFamily: 'Nunito, sans-serif' }}>EN</span>
              </div>
            </div>
          </div>
          <MenuItem icon={Bell} iconColor="#8E24AA" iconBg="#F3E5F5" label={t('astaanta.notifications')} sublabel={t('astaanta.notifications_sub')} onClick={() => setShowComingSoon(true)} />
          <MenuItem icon={ShieldCheck} iconColor="#0891B2" iconBg="#ECFEFF" label={t('astaanta.security')} sublabel={state.guestMode ? t('astaanta.security_guest') : t('astaanta.security_verified')} onClick={() => setShowComingSoon(true)} />
          <MenuItem icon={Info} iconColor="#64748B" iconBg="#F1F5F9" label={t('astaanta.about')} sublabel={t('astaanta.about_sub')} onClick={() => navigate('/about')} />

          <div style={{ height: 1, background: '#E2E8F0', margin: '8px 0' }} />

          <MenuItem icon={Trash} iconColor="#E53935" iconBg="#FFEBEE" label={t('astaanta.reset')} sublabel={t('astaanta.reset_sub')} danger onClick={() => setShowResetConfirm(true)} />
          <MenuItem icon={SignOut} iconColor="#E53935" iconBg="#FFEBEE" label={t('astaanta.signout')} sublabel={t('astaanta.signout_sub')} danger onClick={() => setShowResetConfirm(true)} />
        </div>

        <p style={{ fontSize: 12, color: '#94A3B8', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginTop: 28 }}>Hadaling v1.0.0</p>
        <p style={{ fontSize: 11, color: '#D1D1D1', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginTop: 4 }}>{t('astaanta.footer')} <Heart size={12} weight="fill" color="#E53935" style={{ display: 'inline', verticalAlign: 'middle' }} /></p>
      </div>

      {/* Coming Soon Modal */}
      {showComingSoon && (
        <Modal onClose={() => setShowComingSoon(false)}>
          <Geel size={80} expression="encouraging" />
          <h3 style={{ fontSize: 20, fontWeight: 800, color: '#1E293B', fontFamily: 'Nunito, sans-serif', marginTop: 12 }}>{t('coming_soon.title')}</h3>
          <p style={{ fontSize: 14, color: '#64748B', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginTop: 8, lineHeight: 1.6 }}>{t('coming_soon.message')}</p>
          <button onClick={() => setShowComingSoon(false)} style={{
            width: '100%', padding: '14px 0', borderRadius: 14, border: 'none', background: '#0891B2',
            fontSize: 15, fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
            marginTop: 20, textTransform: 'uppercase', letterSpacing: 0.5,
          }}>{t('coming_soon.close')}</button>
        </Modal>
      )}

      {/* Reset Modal */}
      {showResetConfirm && (
        <Modal onClose={() => setShowResetConfirm(false)}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#FFEBEE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Warning size={28} weight="fill" color="#E53935" />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1E293B', fontFamily: 'Nunito, sans-serif', marginTop: 12 }}>{t('reset.title')}</h3>
          <p style={{ fontSize: 14, color: '#64748B', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginTop: 8, lineHeight: 1.6 }}>{t('reset.message')}</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 20, width: '100%' }}>
            <button onClick={() => setShowResetConfirm(false)} style={{
              flex: 1, padding: '14px 0', borderRadius: 14, border: '2px solid #E2E8F0', background: 'white',
              fontSize: 15, fontWeight: 800, color: '#64748B', fontFamily: 'Nunito, sans-serif', cursor: 'pointer', textTransform: 'uppercase',
            }}>{t('reset.cancel')}</button>
            <button onClick={handleReset} style={{
              flex: 1, padding: '14px 0', borderRadius: 14, border: 'none', background: '#E53935',
              fontSize: 15, fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif', cursor: 'pointer', textTransform: 'uppercase',
            }}>{t('reset.confirm')}</button>
          </div>
        </Modal>
      )}

      {resetDone && (
        <Modal>
          <Geel size={80} expression="encouraging" />
          <p style={{ fontSize: 16, fontWeight: 800, color: '#1E293B', fontFamily: 'Nunito, sans-serif', marginTop: 12 }}>{t('reset.done')}</p>
          <p style={{ fontSize: 13, color: '#64748B', fontFamily: 'Nunito, sans-serif', marginTop: 4 }}>{t('reset.redirecting')}</p>
        </Modal>
      )}

      {/* Profile Detail Popup */}
      {showProfile && (
        <Modal onClose={() => setShowProfile(false)}>
          <div style={{ width: '100%' }}>
            {/* Header */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%', background: '#ECFEFF',
                border: '3px solid #0891B2', display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', boxShadow: '0 2px 8px rgba(8,145,178,0.2)',
              }}>
                <Geel size={60} />
              </div>
              <p style={{ fontSize: 20, fontWeight: 800, color: '#1E293B', fontFamily: 'Nunito, sans-serif', marginTop: 12 }}>
                {state.userName || 'Martida'}
              </p>
              {state.username && (
                <p style={{ fontSize: 14, color: '#0891B2', fontFamily: 'Nunito, sans-serif', marginTop: 2 }}>
                  @{state.username}
                </p>
              )}
            </div>

            {/* Profile fields */}
            <div style={{ width: '100%', borderRadius: 12, overflow: 'hidden', border: '1px solid #E2E8F0' }}>
              <ProfileRow label={t('profile_popup.name')} value={state.userName || '—'} />
              <ProfileRow label={t('profile_popup.username')} value={state.username ? '@' + state.username : '—'} />
              <ProfileRow label={t('profile_popup.email')} value={state.userEmail || '—'} />
              <ProfileRow label={t('profile_popup.phone')} value={state.userPhone || '—'} />
              <ProfileRow label={t('profile_popup.birthday')} value={state.userBirthday || '—'} />
              <ProfileRow label={t('profile_popup.city')} value={state.userCity || '—'} last />
            </div>

            {!state.authComplete && (
              <p style={{ fontSize: 12, color: '#64748B', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginTop: 16 }}>
                {t('profile_popup.guest_note')}
              </p>
            )}

            <button onClick={() => setShowProfile(false)} style={{
              width: '100%', padding: '14px 0', borderRadius: 14, border: 'none', background: '#0891B2',
              fontSize: 15, fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif',
              cursor: 'pointer', marginTop: 20, textTransform: 'uppercase', letterSpacing: 0.5,
            }}>{t('btn.close')}</button>
          </div>
        </Modal>
      )}

      <BottomNav active="astaanta" />
    </div>
  );
}

function MenuItem({ icon: Icon, iconColor, iconBg, label, sublabel, onClick, danger }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 4px',
      background: 'none', border: 'none', borderBottom: '1px solid #F1F5F9',
      cursor: onClick ? 'pointer' : 'default', textAlign: 'left', transition: 'background 0.15s',
    }}
      onPointerDown={(e) => { if (onClick) e.currentTarget.style.background = '#F8F8F8'; }}
      onPointerUp={(e) => { e.currentTarget.style.background = 'none'; }}
      onPointerLeave={(e) => { e.currentTarget.style.background = 'none'; }}
    >
      <div style={{ width: 42, height: 42, borderRadius: 12, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={20} weight="fill" color={iconColor} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 15, fontWeight: 700, fontFamily: 'Nunito, sans-serif', color: danger ? '#E53935' : '#1E293B' }}>{label}</p>
        {sublabel && <p style={{ fontSize: 12, fontFamily: 'Nunito, sans-serif', marginTop: 1, color: danger ? '#EF9A9A' : '#64748B' }}>{sublabel}</p>}
      </div>
      <CaretRight size={18} weight="bold" color={danger ? '#EF9A9A' : '#94A3B8'} />
    </button>
  );
}

function ProfileRow({ label, value, last }) {
  return (
    <div style={{
      padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      borderBottom: last ? 'none' : '1px solid #F1F5F9', background: 'white',
    }}>
      <span style={{ fontSize: 13, color: '#64748B', fontFamily: 'Nunito, sans-serif' }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 700, color: '#1E293B', fontFamily: 'Nunito, sans-serif', maxWidth: '60%', textAlign: 'right', wordBreak: 'break-all' }}>{value}</span>
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={onClose}
    >
      <div style={{ background: 'white', borderRadius: 24, padding: '24px 20px', width: '100%', maxWidth: 340, boxShadow: '0 20px 60px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
