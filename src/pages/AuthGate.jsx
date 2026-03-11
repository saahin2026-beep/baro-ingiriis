import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../utils/useLanguage';
import Geel from '../components/Geel';

export default function AuthGate() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: '#FFFFFF' }}>
      {/* White top */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px 20px' }}>
        <Geel size={120} expression="celebrating" />
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#333', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginTop: 16 }}>
          Baro Ingiriis
        </h1>
        <p style={{ fontSize: 14, color: '#9E9E9E', fontFamily: 'Nunito, sans-serif', marginTop: 6 }}>
          {t('auth.continue_learning')}
        </p>
      </div>

      {/* Dark green bottom */}
      <div style={{
        background: 'linear-gradient(180deg, #1A5C1F 0%, #2E7D32 40%, #1B5E20 100%)',
        borderRadius: '28px 28px 0 0',
        padding: '36px 24px 48px',
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginBottom: 8 }}>
          {t('auth.completed_lessons')} {t('auth.create_account_desc')}
        </p>
        <button
          onClick={() => navigate('/signup')}
          style={{
            width: '100%', padding: '16px 0', borderRadius: 14, border: 'none',
            background: 'linear-gradient(180deg, #5CBF60 0%, #4CAF50 40%, #45A049 100%)', fontSize: 16, fontWeight: 800, color: 'white',
            fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
            borderBottom: '4px solid #2E7D32', boxShadow: '0 4px 12px rgba(76,175,80,0.4)',
            textTransform: 'uppercase', letterSpacing: 1,
            transform: 'translateY(0)', transition: 'all 0.08s ease',
          }}
        >
          {t('auth.signup')}
        </button>
        <button
          onClick={() => navigate('/login')}
          style={{
            width: '100%', padding: '16px 0', borderRadius: 14,
            border: '2px solid rgba(255,255,255,0.3)', background: 'transparent',
            fontSize: 16, fontWeight: 800, color: 'white',
            fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
            textTransform: 'uppercase', letterSpacing: 0.5,
          }}
        >
          {t('auth.login')}
        </button>
      </div>
    </div>
  );
}
