import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, EnvelopeSimple, Lock, Eye, EyeSlash } from '@phosphor-icons/react';
import { supabase } from '../utils/supabase';
import { storage } from '../utils/storage';
import { useLanguage } from '../utils/useLanguage';
import Geel from '../components/Geel';

export default function SignupPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    if (!form.name.trim() || form.name.trim().length < 2) return t('signup.error_name');
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return t('signup.error_email');
    if (!form.password || form.password.length < 6) return t('signup.error_password');
    return null;
  };

  const handleSignup = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true); setError('');

    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email: form.email.trim().toLowerCase(),
        password: form.password,
        options: { data: { name: form.name.trim() } },
      });

      if (signupError) {
        if (signupError.message.includes('already registered')) setError(t('signup.error_exists'));
        else setError(signupError.message);
        setLoading(false); return;
      }

      storage.update({ authComplete: true, userId: data.user?.id, userName: form.name.trim(), userEmail: form.email.trim().toLowerCase() });
      navigate('/profile-setup/0');
    } catch (e) {
      setError(t('signup.error_generic')); console.error(e);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: '#FFFFFF' }}>
      {/* White top with back + Geel */}
      <div style={{ padding: '16px 20px 0' }}>
        <button onClick={() => navigate('/auth-gate')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <ArrowLeft size={20} weight="bold" color="#4CAF50" />
          <span style={{ fontSize: 14, fontWeight: 700, color: '#4CAF50', fontFamily: 'Nunito, sans-serif' }}>{t('btn.back')}</span>
        </button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0 8px' }}>
        <Geel size={80} expression="happy" />
      </div>

      {/* Dark green form area */}
      <div style={{
        flex: 1, background: 'linear-gradient(180deg, #1A5C1F 0%, #2E7D32 40%, #1B5E20 100%)',
        borderRadius: '28px 28px 0 0', padding: '32px 24px 48px',
      }}>
        <h2 style={{ fontSize: 26, fontWeight: 900, color: 'white', fontFamily: 'Nunito, sans-serif', marginBottom: 4 }}>
          {t('signup.title')}
        </h2>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontFamily: 'Nunito, sans-serif', marginBottom: 24 }}>
          {t('signup.have_account')} <span onClick={() => navigate('/login')} style={{ color: '#81C784', cursor: 'pointer', fontWeight: 700, textDecoration: 'underline' }}>{t('signup.login_link')}</span>
        </p>

        {error && (
          <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(244,67,54,0.15)', marginBottom: 16 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#EF9A9A', fontFamily: 'Nunito, sans-serif' }}>{error}</p>
          </div>
        )}

        {/* Name */}
        <label style={darkLabelStyle}>{t('signup.name_label')}</label>
        <div style={{ ...darkInputWrap, ...(focusedField === 'name' ? focusGlow : {}) }}>
          <User size={18} weight="fill" color="rgba(255,255,255,0.4)" />
          <input value={form.name} onChange={(e) => update('name', e.target.value)} onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)} placeholder={t('signup.name_placeholder')} style={darkInputStyle} />
        </div>

        {/* Email */}
        <label style={darkLabelStyle}>{t('signup.email_label')}</label>
        <div style={{ ...darkInputWrap, ...(focusedField === 'email' ? focusGlow : {}) }}>
          <EnvelopeSimple size={18} weight="fill" color="rgba(255,255,255,0.4)" />
          <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} placeholder={t('signup.email_placeholder')} style={darkInputStyle} />
        </div>

        {/* Password */}
        <label style={darkLabelStyle}>{t('signup.password_label')}</label>
        <div style={{ ...darkInputWrap, ...(focusedField === 'password' ? focusGlow : {}) }}>
          <Lock size={18} weight="fill" color="rgba(255,255,255,0.4)" />
          <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => update('password', e.target.value)} onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)} placeholder={t('signup.password_placeholder')} style={darkInputStyle} />
          <button onClick={() => setShowPassword(!showPassword)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            {showPassword ? <EyeSlash size={18} color="rgba(255,255,255,0.4)" /> : <Eye size={18} color="rgba(255,255,255,0.4)" />}
          </button>
        </div>

        <div style={{ height: 8 }} />
        <button onClick={handleSignup} disabled={loading} style={{
          width: '100%', padding: '16px 0', borderRadius: 14, border: 'none',
          background: loading ? '#66BB6A' : 'linear-gradient(180deg, #5CBF60 0%, #4CAF50 40%, #45A049 100%)',
          fontSize: 16, fontWeight: 800,
          color: 'white', fontFamily: 'Nunito, sans-serif', cursor: loading ? 'not-allowed' : 'pointer',
          borderBottom: '4px solid #2E7D32', boxShadow: '0 4px 12px rgba(76,175,80,0.4)',
          textTransform: 'uppercase', letterSpacing: 1,
          opacity: loading ? 0.7 : 1,
          transform: 'translateY(0)', transition: 'all 0.08s ease',
        }}>
          {loading ? t('signup.loading') : t('signup.button')}
        </button>
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
  boxShadow: '0 0 0 4px rgba(76,175,80,0.15)',
  borderColor: 'rgba(76,175,80,0.5)',
};
