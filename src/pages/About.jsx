import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart } from '@phosphor-icons/react';
import { useLanguage } from '../utils/useLanguage';
import Geel from '../components/Geel';

export default function About() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div style={{ background: '#FAFAFA', minHeight: '100dvh' }}>
      {/* Green top bar */}
      <div style={{
        background: '#4CAF50', padding: '10px 16px',
        display: 'flex', alignItems: 'center', gap: 10, minHeight: 48,
      }}>
        <button onClick={() => navigate('/astaanta')} style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 4,
          display: 'flex', alignItems: 'center',
        }}>
          <ArrowLeft size={22} weight="bold" color="white" />
        </button>
        <span style={{ fontSize: 17, fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif' }}>
          {t('about.title')}
        </span>
      </div>

      <div style={{ padding: '24px 16px' }}>
        {/* App icon + name */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
          <div style={{
            width: 80, height: 80, borderRadius: 20, background: '#E8F5E9',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(76,175,80,0.2)',
          }}>
            <Geel size={60} />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#333', fontFamily: 'Nunito, sans-serif', marginTop: 12 }}>
            Baro Ingiriis
          </h1>
          <p style={{ fontSize: 13, color: '#9E9E9E', fontFamily: 'Nunito, sans-serif', marginTop: 2 }}>
            Version 1.0.0
          </p>
        </div>

        {/* Description */}
        <div style={{ background: 'white', borderRadius: 14, padding: '16px', border: '1px solid #EEEEEE', marginBottom: 16 }}>
          <p style={{ fontSize: 14, color: '#555', fontFamily: 'Nunito, sans-serif', lineHeight: 1.7 }}>
            {t('about.description')}
          </p>
        </div>

        {/* Info rows */}
        <div style={{ background: 'white', borderRadius: 14, overflow: 'hidden', border: '1px solid #EEEEEE' }}>
          <InfoRow label={t('about.language_label')} value={t('about.language_value')} />
          <InfoRow label={t('about.lessons_label')} value="10" />
          <InfoRow label={t('about.type_label')} value={t('about.type_value')} />
          <InfoRow label={t('about.method_label')} value={t('about.method_value')} last />
        </div>

        {/* Footer */}
        <p style={{ fontSize: 12, color: '#BDBDBD', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginTop: 32 }}>
          Baro Ingiriis v1.0.0
        </p>
        <p style={{ fontSize: 11, color: '#D1D1D1', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginTop: 4 }}>
          {t('astaanta.footer')} <Heart size={12} weight="fill" color="#E53935" style={{ display: 'inline', verticalAlign: 'middle' }} />
        </p>
      </div>
    </div>
  );
}

function InfoRow({ label, value, last }) {
  return (
    <div style={{
      padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      borderBottom: last ? 'none' : '1px solid #F5F5F5',
    }}>
      <span style={{ fontSize: 14, color: '#757575', fontFamily: 'Nunito, sans-serif' }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 700, color: '#333', fontFamily: 'Nunito, sans-serif' }}>{value}</span>
    </div>
  );
}
