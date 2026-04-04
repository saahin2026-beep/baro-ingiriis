import { useNavigate } from 'react-router-dom';
import { Book, ChartBar, User, Globe } from '@phosphor-icons/react';
import { useLanguage } from '../utils/useLanguage';

const NAV_ITEMS = [
  { key: 'geel-world', Icon: Globe, label: 'Geel World', path: '/geel-world' },
  { key: 'casharo', Icon: Book, labelKey: 'nav.lessons', path: '/home' },
  { key: 'xirfadaha', Icon: ChartBar, labelKey: 'nav.progress', path: '/progress' },
  { key: 'astaanta', Icon: User, labelKey: 'nav.profile', path: '/astaanta' },
];

export default function BottomNav({ active = 'casharo' }) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 520, zIndex: 50,
    }}>
      <div style={{
        background: 'linear-gradient(180deg, #FFFFFF, #FAFAFA)',
        boxShadow: '0 -2px 0 rgba(0,0,0,0.02), 0 -8px 24px rgba(0,0,0,0.06)',
        paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '8px 0 0' }}>
          {NAV_ITEMS.map((n) => {
            const isActive = active === n.key;
            return (
              <div key={n.key} onClick={() => { if (n.path && !isActive) navigate(n.path); }}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: 'clamp(3px, 0.8vw, 6px)', cursor: 'pointer',
                }}>
                <div style={{
                  background: isActive ? 'rgba(8,145,178,0.1)' : 'transparent',
                  borderRadius: 12, padding: '6px 16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}>
                  <n.Icon size={24} weight="fill" color={isActive ? '#0891B2' : '#BDBDBD'} />
                </div>
                <span style={{
                  fontSize: 'clamp(10px, 2.5vw, 13px)', fontWeight: isActive ? 800 : 600,
                  color: isActive ? '#0891B2' : '#BDBDBD', fontFamily: 'Nunito, sans-serif',
                }}>
                  {n.label || t(n.labelKey)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
