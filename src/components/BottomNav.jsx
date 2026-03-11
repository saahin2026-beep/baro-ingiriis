import { useNavigate } from 'react-router-dom';
import { Book, ChartBar, User } from '@phosphor-icons/react';
import { useLanguage } from '../utils/useLanguage';

const NAV_ITEMS = [
  { key: 'casharo', Icon: Book, labelKey: 'nav.lessons', path: '/home' },
  { key: 'xirfadaha', Icon: ChartBar, labelKey: 'nav.progress', path: '/progress' },
  { key: 'astaanta', Icon: User, labelKey: 'nav.profile', path: '/astaanta' },
];

export default function BottomNav({ active = 'casharo' }) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
      display: 'flex', justifyContent: 'center',
    }}>
      <div style={{
        width: '100%', maxWidth: 430,
        background: 'linear-gradient(180deg, #FFFFFF, #FAFAFA)',
        borderTop: 'none',
        boxShadow: '0 -2px 0 rgba(0,0,0,0.02), 0 -8px 24px rgba(0,0,0,0.06)',
        paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '8px 0 0' }}>
          {NAV_ITEMS.map((n) => {
            const isActive = active === n.key;
            const isDisabled = !n.path;
            return (
              <div key={n.key} onClick={() => { if (n.path && !isActive) navigate(n.path); }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: isDisabled ? 'not-allowed' : 'pointer', opacity: isDisabled ? 0.4 : 1 }}>
                <div style={{
                  background: isActive ? 'rgba(76,175,80,0.1)' : 'transparent',
                  borderRadius: 12,
                  padding: isActive ? '6px 16px' : '6px 16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}>
                  <n.Icon size={24} weight="fill" color={isActive ? '#4CAF50' : '#BDBDBD'} />
                </div>
                <span style={{ fontSize: 11, fontWeight: isActive ? 800 : 600, color: isActive ? '#4CAF50' : '#BDBDBD', fontFamily: 'Nunito, sans-serif' }}>{t(n.labelKey)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
