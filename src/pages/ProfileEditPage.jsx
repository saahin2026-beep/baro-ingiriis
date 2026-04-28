import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, At, Phone, Calendar, MapPin } from '@phosphor-icons/react';
import { supabase } from '../utils/supabase';
import { storage } from '../utils/storage';
import { useLanguage } from '../utils/useLanguage';
import somaliCities from '../data/somaliCities';
import Toast from '../components/Toast';

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', username: '', phone: '', birthday: '', city: '' });
  const [original, setOriginal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) { navigate('/login'); return; }

      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('name, username, phone, birthday, city')
        .eq('id', userData.user.id)
        .maybeSingle();

      if (!mounted) return;
      if (fetchError) {
        setError(t('profile.error_generic'));
        setLoading(false);
        return;
      }

      const initial = {
        name: profile?.name || '',
        username: profile?.username || '',
        phone: profile?.phone || '',
        birthday: profile?.birthday || '',
        city: profile?.city || '',
      };
      setForm(initial);
      setOriginal(initial);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [navigate, t]);

  const update = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setError('');
  };

  const validate = () => {
    if (form.name.trim().length < 2) return t('signup.error_name');
    const usernameNorm = form.username.trim().toLowerCase();
    if (!usernameNorm || usernameNorm.length < 3) return t('profile.error_username_length');
    if (!/^[a-z0-9_]+$/.test(usernameNorm)) return t('profile.error_username_chars');
    const cleanedPhone = (form.phone || '').replace(/[\s-]+/g, '');
    if (!cleanedPhone) return t('profile.error_phone');
    if (!/^\+?\d{7,15}$/.test(cleanedPhone)) return t('profile.error_phone');
    if (!form.birthday) return t('profile.error_birthday');
    if (!form.city) return t('profile.error_city');
    return null;
  };

  const dirty = original && Object.keys(form).some((k) => (form[k] || '') !== (original[k] || ''));

  const handleSave = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }

    setSaving(true);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) { navigate('/login'); return; }

    const payload = {
      name: form.name.trim(),
      username: form.username.trim().toLowerCase(),
      phone: form.phone.trim(),
      birthday: form.birthday,
      city: form.city,
    };

    const { error: updateError } = await supabase
      .from('profiles')
      .update(payload)
      .eq('id', userData.user.id);

    setSaving(false);
    if (updateError) {
      if (updateError.message?.includes('unique') || updateError.code === '23505') {
        setError(t('profile.error_username_taken'));
      } else {
        setError(updateError.message);
      }
      return;
    }

    storage.update({ userName: payload.name, username: payload.username });
    setOriginal(payload);
    setToast({ message: t('profile_edit.saved'), type: 'success' });
  };

  if (loading) {
    return (
      <div className="page-fixed" style={{
        background: 'linear-gradient(180deg, #064E5E 0%, #0E7490 30%, #0891B2 70%, #0E7490 100%)',
      }} />
    );
  }

  return (
    <div className="page-scroll" style={{
      background: 'linear-gradient(180deg, #064E5E 0%, #0E7490 30%, #0891B2 70%, #0E7490 100%)',
      paddingBottom: 'max(40px, env(safe-area-inset-bottom))',
    }}>
      <Toast {...(toast || {})} onDismiss={() => setToast(null)} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px' }}>
        <button type="button" aria-label="Back" onClick={() => navigate('/astaanta')} style={{
          background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 12,
          padding: 10, cursor: 'pointer', display: 'flex', alignItems: 'center',
        }}>
          <ArrowLeft size={20} weight="bold" color="white" />
        </button>
        <h1 style={{ fontSize: 17, fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif', margin: 0 }}>
          {t('profile_edit.title')}
        </h1>
      </div>

      <form onSubmit={handleSave} style={{ padding: '0 16px', maxWidth: 480, margin: '0 auto' }}>
        <div style={{
          background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          borderRadius: 18, padding: 18, border: '1px solid rgba(255,255,255,0.12)', marginBottom: 16,
        }}>
          {error && (
            <div role="alert" style={{ padding: '8px 12px', borderRadius: 10, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.25)', marginBottom: 14 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#FCA5A5', fontFamily: 'Nunito, sans-serif' }}>{error}</p>
            </div>
          )}

          <Field icon={User} label={t('signup.name_label')}>
            <input value={form.name} onChange={(e) => update('name', e.target.value)} autoComplete="name" style={inputStyle} />
          </Field>

          <Field icon={At} label={t('profile.username_label')}>
            <input value={form.username} onChange={(e) => update('username', e.target.value.toLowerCase())} autoComplete="username" style={inputStyle} />
          </Field>

          <Field icon={Phone} label={t('profile.phone_label')}>
            <input value={form.phone} onChange={(e) => update('phone', e.target.value)} autoComplete="tel" inputMode="tel" placeholder={t('profile.phone_placeholder')} style={inputStyle} />
          </Field>

          <Field icon={Calendar} label={t('profile.birthday_label')}>
            <input
              type="date"
              value={form.birthday}
              onChange={(e) => update('birthday', e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              min="1940-01-01"
              style={{ ...inputStyle, colorScheme: 'dark' }}
            />
          </Field>

          <Field icon={MapPin} label={t('profile.city_label')}>
            <select value={form.city} onChange={(e) => update('city', e.target.value)} style={{ ...inputStyle, appearance: 'none' }}>
              <option value="" disabled>{t('profile.city_label')}</option>
              {somaliCities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>

          <button type="submit" disabled={saving || !dirty} style={{
            width: '100%', padding: 14, marginTop: 4,
            background: (saving || !dirty)
              ? 'rgba(245,158,11,0.4)'
              : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            border: 'none', borderRadius: 12,
            fontSize: 14, fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif',
            cursor: (saving || !dirty) ? 'not-allowed' : 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px',
          }}>
            {saving ? t('profile_edit.saving') : t('profile_edit.save')}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ icon: Icon, label, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={labelStyle}>{label}</label>
      <div style={inputWrap}>
        <div style={iconWrap}><Icon size={16} weight="fill" color="white" /></div>
        {children}
      </div>
    </div>
  );
}

const labelStyle = { fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.5)', fontFamily: 'Nunito, sans-serif', marginBottom: 6, display: 'block', letterSpacing: '0.5px', textTransform: 'uppercase' };
const inputWrap = { display: 'flex', alignItems: 'center', gap: 10, padding: 3, borderRadius: 12, background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.12)' };
const iconWrap = { width: 36, height: 36, borderRadius: 9, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 };
const inputStyle = { flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 14, color: 'white', fontFamily: 'Nunito, sans-serif', fontWeight: 600, padding: '8px 4px 8px 0' };
