import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Phone, Calendar, MapPin, At } from '@phosphor-icons/react';
import { supabase } from '../utils/supabase';
import { storage } from '../utils/storage';
import { useLanguage } from '../utils/useLanguage';
import somaliCities from '../data/somaliCities';
import Geel from '../components/Geel';
import PrimaryButton from '../components/PrimaryButton';
import ProgressDots from '../components/ProgressDots';

const STEP_CONFIGS = [
  { key: 'username', icon: At, labelKey: 'profile.username_label', placeholderKey: 'profile.username_placeholder', questionKey: 'profile.username_question' },
  { key: 'phone', icon: Phone, labelKey: 'profile.phone_label', placeholderKey: 'profile.phone_placeholder', questionKey: 'profile.phone_question' },
  { key: 'birthday', icon: Calendar, labelKey: 'profile.birthday_label', placeholderKey: '', questionKey: 'profile.birthday_question' },
  { key: 'city', icon: MapPin, labelKey: 'profile.city_label', placeholderKey: '', questionKey: 'profile.city_question' },
];

export default function ProfileSetup() {
  const { step } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const currentStep = parseInt(step, 10);
  const [formData, setFormData] = useState({ username: '', phone: '', birthday: '', city: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const stepConfig = STEP_CONFIGS[currentStep];
  if (!stepConfig) { navigate('/home'); return null; }

  const updateField = (value) => {
    setFormData((f) => ({ ...f, [stepConfig.key]: value }));
    setError('');
  };

  const validate = () => {
    const val = formData[stepConfig.key];
    if (stepConfig.key === 'username') {
      if (!val.trim() || val.trim().length < 3) return t('profile.error_username_length');
      if (!/^[a-zA-Z0-9_]+$/.test(val.trim())) return t('profile.error_username_chars');
    }
    if (stepConfig.key === 'phone' && !val.trim()) return t('profile.error_phone');
    if (stepConfig.key === 'birthday' && !val) return t('profile.error_birthday');
    if (stepConfig.key === 'city' && !val) return t('profile.error_city');
    return null;
  };

  const handleNext = async () => {
    const err = validate();
    if (err) { setError(err); return; }

    if (currentStep < STEP_CONFIGS.length - 1) {
      navigate(`/profile-setup/${currentStep + 1}`);
    } else {
      // Last step — save all to Supabase
      setSaving(true);
      try {
        const state = storage.get();
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            username: formData.username.trim().toLowerCase(),
            phone: formData.phone.trim(),
            birthday: formData.birthday,
            city: formData.city,
            profile_complete: true,
          })
          .eq('id', state.userId);

        if (updateError) {
          if (updateError.message.includes('unique')) setError(t('profile.error_username_taken'));
          else setError(updateError.message);
          setSaving(false); return;
        }

        storage.update({
          profileComplete: true,
          username: formData.username.trim().toLowerCase(),
          userPhone: formData.phone.trim(),
          userBirthday: formData.birthday,
          userCity: formData.city,
        });
        navigate('/home');
      } catch (e) {
        setError(t('profile.error_generic')); console.error(e);
      }
      setSaving(false);
    }
  };

  const StepIcon = stepConfig.icon;

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: '#FFFFFF' }}>
      <div style={{ padding: '20px 24px 0' }}>
        <ProgressDots total={STEP_CONFIGS.length} current={currentStep} />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 24px 40px' }}>
        {/* Geel */}
        <Geel size={100} expression={currentStep === STEP_CONFIGS.length - 1 ? 'celebrating' : 'happy'} />
        <div style={{ height: 20 }} />

        {/* Icon badge */}
        <div style={{
          width: 56, height: 56, borderRadius: '50%', background: '#E8F5E9',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 16, boxShadow: '0 2px 8px rgba(76,175,80,0.15)',
        }}>
          <StepIcon size={26} weight="fill" color="#4CAF50" />
        </div>

        {/* Question */}
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#333', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginBottom: 8 }}>
          {t(stepConfig.questionKey)}
        </h2>
        <p style={{ fontSize: 13, color: '#9E9E9E', fontFamily: 'Nunito, sans-serif', marginBottom: 24 }}>
          {t(stepConfig.labelKey)}
        </p>

        {error && (
          <div style={{ padding: '12px 16px', borderRadius: 10, background: '#FFEBEE', marginBottom: 16, width: '100%' }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#E53935', fontFamily: 'Nunito, sans-serif' }}>{error}</p>
          </div>
        )}

        {/* Input field — different per step */}
        <div style={{ width: '100%', marginBottom: 24 }}>
          {stepConfig.key === 'city' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 280, overflowY: 'auto' }}>
              {somaliCities.map((city) => (
                <button
                  key={city}
                  onClick={() => updateField(city)}
                  style={{
                    width: '100%', padding: '14px 16px', borderRadius: 12, textAlign: 'left',
                    border: formData.city === city ? '2px solid #4CAF50' : '2px solid #E0E0E0',
                    background: formData.city === city ? '#E8F5E9' : 'white',
                    color: formData.city === city ? '#2E7D32' : '#333',
                    fontSize: 15, fontWeight: formData.city === city ? 700 : 600,
                    fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {formData.city === city && <MapPin size={16} weight="fill" color="#4CAF50" style={{ marginRight: 8, verticalAlign: 'middle' }} />}
                  {city}
                </button>
              ))}
            </div>
          ) : stepConfig.key === 'birthday' ? (
            <input
              type="date"
              value={formData.birthday}
              onChange={(e) => updateField(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              min="1940-01-01"
              style={{
                width: '100%', padding: '16px', borderRadius: 14, border: '2px solid #E0E0E0',
                fontSize: 16, fontFamily: 'Nunito, sans-serif', color: '#333',
                outline: 'none', boxSizing: 'border-box', background: 'white',
              }}
            />
          ) : (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '16px',
              borderRadius: 14, border: '2px solid #E0E0E0', background: 'white',
            }}>
              <StepIcon size={20} weight="fill" color="#BDBDBD" />
              <input
                value={formData[stepConfig.key]}
                onChange={(e) => updateField(e.target.value)}
                placeholder={t(stepConfig.placeholderKey)}
                style={{
                  flex: 1, background: 'none', border: 'none', outline: 'none',
                  fontSize: 16, color: '#333', fontFamily: 'Nunito, sans-serif',
                }}
              />
            </div>
          )}
        </div>

        <div style={{ flex: 1 }} />

        <PrimaryButton onClick={handleNext} disabled={saving}>
          {saving ? t('profile.loading') : currentStep === STEP_CONFIGS.length - 1 ? t('profile.finish') : t('btn.continue')}
        </PrimaryButton>
      </div>
    </div>
  );
}
