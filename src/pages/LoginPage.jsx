import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, EnvelopeSimple, Lock, Eye, EyeSlash } from '@phosphor-icons/react';
import { supabase } from '../utils/supabase';
import { storage } from '../utils/storage';
import { useLanguage } from '../utils/useLanguage';
import Geel from '../components/Geel';

export default function LoginPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleLogin = async () => {
    if (!form.email.trim() || !form.password) { setError(t('login.error_fill')); return; }
    setLoading(true); setError('');

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      if (loginError) {
        setError(t('login.error_credentials'));
        setLoading(false); return;
      }

      // Check if profile is complete
      const { data: profile } = await supabase
        .from('profiles')
        .select('profile_complete, name')
        .eq('id', data.user.id)
        .single();

      storage.update({
        authComplete: true,
        userId: data.user.id,
        userName: profile?.name || '',
        profileComplete: profile?.profile_complete || false,
      });

      if (profile?.profile_complete) {
        navigate('/home');
      } else {
        navigate('/profile-setup/0');
      }
    } catch (e) {
      setError(t('login.error_generic')); console.error(e);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: '#FBF7F0' }}>
      <div style={{ padding: '16px 20px 0' }}>
        <button onClick={() => navigate('/auth-gate')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <ArrowLeft size={20} weight="bold" color="#0891B2" />
          <span style={{ fontSize: 14, fontWeight: 700, color: '#0891B2', fontFamily: 'Nunito, sans-serif' }}>{t('btn.back')}</span>
        </button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0 8px' }}>
        <Geel size={80} expression="happy" />
      </div>

      <div style={{
        flex: 1, background: 'linear-gradient(165deg, #064E5E 0%, #0E7490 40%, #0891B2 100%)',
        borderRadius: '28px 28px 0 0', padding: '32px 24px 48px',
      }}>
        <h2 style={{ fontSize: 26, fontWeight: 900, color: 'white', fontFamily: 'Nunito, sans-serif', marginBottom: 4 }}>
          {t('login.title')}
        </h2>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontFamily: 'Nunito, sans-serif', marginBottom: 24 }}>
          {t('login.subtitle')}
        </p>

        {error && (
          <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(244,67,54,0.15)', marginBottom: 16 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#EF9A9A', fontFamily: 'Nunito, sans-serif' }}>{error}</p>
          </div>
        )}

        <label style={darkLabelStyle}>{t('signup.email_label')}</label>
        <div style={{ ...darkInputWrap, ...(focusedField === 'email' ? focusGlow : {}) }}>
          <EnvelopeSimple size={18} weight="fill" color="rgba(255,255,255,0.4)" />
          <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} placeholder={t('signup.email_placeholder')} style={darkInputStyle} />
        </div>

        <label style={darkLabelStyle}>{t('signup.password_label')}</label>
        <div style={{ ...darkInputWrap, ...(focusedField === 'password' ? focusGlow : {}) }}>
          <Lock size={18} weight="fill" color="rgba(255,255,255,0.4)" />
          <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => update('password', e.target.value)} onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)} placeholder={t('signup.password_placeholder')} style={darkInputStyle} />
          <button onClick={() => setShowPassword(!showPassword)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            {showPassword ? <EyeSlash size={18} color="rgba(255,255,255,0.4)" /> : <Eye size={18} color="rgba(255,255,255,0.4)" />}
          </button>
        </div>

        <div style={{ height: 8 }} />
        <button onClick={handleLogin} disabled={loading} style={{
          width: '100%', padding: '16px 0', borderRadius: 14, border: 'none',
          background: loading ? '#22D3EE' : 'linear-gradient(180deg, #06B6D4 0%, #0891B2 40%, #0E7490 100%)',
          fontSize: 16, fontWeight: 800,
          color: 'white', fontFamily: 'Nunito, sans-serif', cursor: loading ? 'not-allowed' : 'pointer',
          borderBottom: '4px solid #0E7490', boxShadow: '0 4px 12px rgba(8,145,178,0.4)',
          textTransform: 'uppercase', letterSpacing: 1,
          opacity: loading ? 0.7 : 1,
          transform: 'translateY(0)', transition: 'all 0.08s ease',
        }}>
          {loading ? t('login.loading') : t('login.button')}
        </button>

        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginTop: 16 }}>
          {t('login.no_account')} <span onClick={() => navigate('/signup')} style={{ color: '#22D3EE', cursor: 'pointer', fontWeight: 700, textDecoration: 'underline' }}>{t('login.signup_link')}</span>
        </p>
      </div>
    </div>
  );
}

const darkLabelStyle = { fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.5)', fontFamily: 'Nunito, sans-serif', marginBottom: 6, display: 'block', letterSpacing: 1, textTransform: 'uppercase' };
const darkInputWrap = {
  display: 'flex', alignItems: 'center', gap: 10, padding: '16px 18px',
  borderRadius: 14, background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.15)',
  borderBottom: '3px solid rgba(255,255,255,0.08)',
  backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
  marginBottom: 16, transition: 'all 0.2s ease',
};
const darkInputStyle = {
  flex: 1, background: 'none', border: 'none', outline: 'none',
  fontSize: 15, color: 'white', fontFamily: 'Nunito, sans-serif', fontWeight: 600,
};
const focusGlow = {
  boxShadow: '0 0 0 4px rgba(8,145,178,0.15)',
  borderColor: 'rgba(8,145,178,0.5)',
};
