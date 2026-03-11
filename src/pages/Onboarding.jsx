import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storage } from '../utils/storage';
import { useData } from '../utils/DataContext';
import { House, Briefcase, GraduationCap, Trophy, Plant, Leaf, Tree } from '@phosphor-icons/react';
import Geel from '../components/Geel';
import PrimaryButton from '../components/PrimaryButton';
import ProgressDots from '../components/ProgressDots';
import OptionCard from '../components/OptionCard';
import SpeechBubble from '../components/SpeechBubble';
import FeedbackBanner from '../components/FeedbackBanner';

const INTENT_ICONS = [House, Briefcase, GraduationCap, Trophy];
const INTENT_COLORS = [
  { iconColor: '#FB8C00', iconBg: '#FFF3E0' },
  { iconColor: '#6D4C41', iconBg: '#EFEBE9' },
  { iconColor: '#5C6BC0', iconBg: '#E8EAF6' },
  { iconColor: '#F9A825', iconBg: '#FFF8E1' },
];
const COMFORT_ICONS = [Plant, Leaf, Tree];
const COMFORT_COLORS = [
  { iconColor: '#66BB6A', iconBg: '#E8F5E9' },
  { iconColor: '#43A047', iconBg: '#E8F5E9' },
  { iconColor: '#2E7D32', iconBg: '#E8F5E9' },
];

// Hardcoded defaults (fallback if Supabase not loaded yet)
const DEFAULTS = {
  screen0: { title: 'Baro Ingiriis', subtitle: 'Kalsooni ku baro, daqiiqado yar gudaheed', buttonText: 'BILOW →', footer: 'Baro Ingiriis si fudud' },
  screen1: { question: 'Maxaad Ingiriis u baranaysaa?', options: [{ text: 'Nolol maalmeed' }, { text: 'Shaqo' }, { text: 'Iskuul' }, { text: 'Kalsooni' }] },
  screen2: { question: 'Sidee ayaad Ingiriis u dareemaysaa hadda?', options: [{ text: 'Waan fahmaa wax yar' }, { text: 'Waan fahmaa caadi' }, { text: 'Waan rabaa inaan is hagaajiyo' }], helperText: 'Ma aha imtixaan.' },
  screen3: { label: 'Ingiriis', instruction: 'Dooro micnaha saxda ah:', prompt: "Hi, I'm Ahmed.", options: ['Salaan, magacaygu waa Ahmed', 'Nabad gelyo', 'Sidee tahay?'], correctIndex: 0 },
  screen4: { title: 'Aragtay?', line1: 'Tani waa sida casharradu u shaqeeyaan.', line2: 'Waa fudud, waadna awooddaa.', buttonText: 'SII WAD' },
  screen5: { title: 'Ma rabtaa inaad kaydiso horumarkaaga?', subtitle: 'Si aadan u lumin XP-gaaga iyo streak-gaaga', primaryButton: 'KAYDI HORUMARKA', secondaryButton: 'KU SII WAD HADDA' },
  screen6: { lessonTitle: 'Is-barasho fudud', lessonSubtitle: '(Simple introductions)', introLine: 'Casharkan waa mid fudud. Aan bilowno.', buttonText: 'BILOW CASHARKA' },
};

export default function Onboarding() {
  const { step } = useParams();
  const navigate = useNavigate();
  const currentStep = parseInt(step, 10);
  const { onboardingContent, getRandomPhrase } = useData();

  const getContent = (key) => onboardingContent?.[key] || DEFAULTS[key];

  const goNext = () => {
    if (currentStep < 6) navigate(`/onboarding/${currentStep + 1}`);
    else { storage.update({ onboardingComplete: true }); navigate('/lesson/1'); }
  };

  return (
    <div className="animate-slide-in" style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', animation: 'fadeSlideUp 0.4s ease-out both' }}>
      {currentStep === 0 && <Screen0 goNext={goNext} c={getContent('screen0')} />}
      {currentStep === 1 && <Screen1 goNext={goNext} c={getContent('screen1')} />}
      {currentStep === 2 && <Screen2 goNext={goNext} c={getContent('screen2')} />}
      {currentStep === 3 && <Screen3 goNext={goNext} c={getContent('screen3')} getRandomPhrase={getRandomPhrase} />}
      {currentStep === 4 && <Screen4 goNext={goNext} c={getContent('screen4')} />}
      {currentStep === 5 && <Screen5 goNext={goNext} c={getContent('screen5')} />}
      {currentStep === 6 && <Screen6 goNext={goNext} c={getContent('screen6')} />}
    </div>
  );
}

function Screen0({ goNext, c }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 24px 40px', background: 'linear-gradient(180deg, #E8F5E9 0%, #FFFFFF 50%)' }}>
      <div style={{ height: 70 }} />
      <div style={{ width: 110, height: 110, borderRadius: 28, background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(76,175,80,0.2)', animation: 'scaleIn 0.5s ease-out 0.2s both' }}>
        <Geel size={85} />
      </div>
      <div style={{ height: 24 }} />
      <h1 style={{ fontSize: 28, fontWeight: 900, color: '#333', fontFamily: 'Nunito, sans-serif', textAlign: 'center' }}>{c.title}</h1>
      <p style={{ fontSize: 15, color: '#757575', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginTop: 6, lineHeight: 1.5 }}>{c.subtitle}</p>
      <div style={{ flex: 1 }} />
      <PrimaryButton onClick={goNext}>{c.buttonText}</PrimaryButton>
      <p style={{ fontSize: 12, color: '#BDBDBD', fontFamily: 'Nunito, sans-serif', marginTop: 16 }}>{c.footer}</p>
    </div>
  );
}

function Screen1({ goNext, c }) {
  const [selected, setSelected] = useState(null);
  const handleTap = (value) => { setSelected(value); storage.update({ intent: value }); setTimeout(goNext, 500); };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px 24px 40px' }}>
      <ProgressDots total={5} current={0} />
      <div style={{ height: 24 }} />
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}><Geel size={90} /></div>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: '#333', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginBottom: 20 }}>{c.question}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {(c.options || []).map((opt, i) => (
          <OptionCard key={i} icon={INTENT_ICONS[i]} iconColor={INTENT_COLORS[i]?.iconColor} iconBg={INTENT_COLORS[i]?.iconBg}
            text={opt.text || opt} number={i + 1} selected={selected === (opt.text || opt)} correct={null}
            onClick={() => handleTap(opt.text || opt)} />
        ))}
      </div>
    </div>
  );
}

function Screen2({ goNext, c }) {
  const [selected, setSelected] = useState(null);
  const handleTap = (value) => { setSelected(value); storage.update({ comfort: value }); setTimeout(goNext, 500); };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px 24px 40px' }}>
      <ProgressDots total={5} current={1} />
      <div style={{ height: 24 }} />
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}><Geel size={90} /></div>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: '#333', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginBottom: 20 }}>{c.question}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {(c.options || []).map((opt, i) => (
          <OptionCard key={i} icon={COMFORT_ICONS[i]} iconColor={COMFORT_COLORS[i]?.iconColor} iconBg={COMFORT_COLORS[i]?.iconBg}
            text={opt.text || opt} number={i + 1} selected={selected === (opt.text || opt)} correct={null}
            onClick={() => handleTap(opt.text || opt)} />
        ))}
      </div>
      <p style={{ fontSize: 13, color: '#9E9E9E', fontFamily: 'Nunito, sans-serif', textAlign: 'center', fontStyle: 'italic', marginTop: 16 }}>{c.helperText}</p>
    </div>
  );
}

function Screen3({ goNext, c, getRandomPhrase }) {
  const [answered, setAnswered] = useState(false);
  const [wrongIndex, setWrongIndex] = useState(null);
  const [bannerPhrase, setBannerPhrase] = useState(null);
  const [bannerType, setBannerType] = useState(null);
  const [bannerVisible, setBannerVisible] = useState(false);

  const correctIdx = c.correctIndex ?? 0;

  const handleTap = (index) => {
    if (answered || bannerVisible) return;
    if (index === correctIdx) {
      setAnswered(true); setBannerType('correct'); setBannerPhrase(getRandomPhrase('encouragement')); setBannerVisible(true);
    } else {
      setWrongIndex(index); setBannerType('wrong'); setBannerPhrase(getRandomPhrase('feedback')); setBannerVisible(true);
    }
  };
  const getCorrectProp = (i) => { if (i === correctIdx && answered) return true; if (i === wrongIndex) return false; return null; };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px 24px 160px 24px' }}>
      <ProgressDots total={5} current={2} />
      <div style={{ height: 8 }} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 12 }}>
        <Geel size={100} expression={answered ? 'celebrating' : 'happy'} />
        <div style={{ marginTop: 8 }}>
          <SpeechBubble color={answered ? '#E8F5E9' : '#FFFFFF'}>
            <p style={{ fontSize: 13, color: '#757575', fontFamily: 'Nunito, sans-serif', marginBottom: 2 }}>{c.label}</p>
            <p style={{ fontSize: 18, fontWeight: 800, color: answered ? '#2E7D32' : '#333', fontFamily: 'Nunito, sans-serif' }}>{c.prompt}</p>
          </SpeechBubble>
        </div>
      </div>
      <p style={{ fontSize: 15, fontWeight: 600, color: '#333', fontFamily: 'Nunito, sans-serif', marginBottom: 14 }}>{c.instruction}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {(c.options || []).map((opt, i) => (
          <OptionCard key={i} text={opt} number={i + 1} selected={i === correctIdx && answered} correct={getCorrectProp(i)} onClick={() => handleTap(i)} disabled={answered || bannerVisible} />
        ))}
      </div>
      <FeedbackBanner type={bannerType === 'correct' ? 'correct' : 'wrong'} phrase={bannerPhrase} visible={bannerVisible}
        onContinue={() => { if (bannerType === 'correct') goNext(); else { setWrongIndex(null); setBannerPhrase(null); setBannerType(null); setBannerVisible(false); } }} />
    </div>
  );
}

function Screen4({ goNext, c }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 32px 40px' }}>
      <ProgressDots total={5} current={3} />
      <div style={{ flex: 1 }} />
      <Geel size={140} expression="encouraging" />
      <div style={{ height: 24 }} />
      <h2 style={{ fontSize: 24, fontWeight: 900, color: '#333', fontFamily: 'Nunito, sans-serif', textAlign: 'center' }}>{c.title}</h2>
      <p style={{ fontSize: 15, color: '#757575', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginTop: 8, lineHeight: 1.6 }}>{c.line1}</p>
      <p style={{ fontSize: 15, color: '#757575', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginTop: 4 }}>{c.line2}</p>
      <div style={{ flex: 1 }} />
      <PrimaryButton onClick={goNext}>{c.buttonText}</PrimaryButton>
    </div>
  );
}

function Screen5({ goNext, c }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 24px 40px' }}>
      <ProgressDots total={5} current={4} />
      <div style={{ flex: 1 }} />
      <Geel size={120} />
      <div style={{ height: 24 }} />
      <h2 style={{ fontSize: 20, fontWeight: 800, color: '#333', fontFamily: 'Nunito, sans-serif', textAlign: 'center' }}>{c.title}</h2>
      <p style={{ fontSize: 14, color: '#757575', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginTop: 8 }}>{c.subtitle}</p>
      <div style={{ height: 32 }} />
      <PrimaryButton onClick={() => { storage.update({ guestMode: false }); goNext(); }}>{c.primaryButton}</PrimaryButton>
      <div style={{ height: 10 }} />
      <PrimaryButton variant="secondary" onClick={() => { storage.update({ guestMode: true }); goNext(); }}>{c.secondaryButton}</PrimaryButton>
      <div style={{ flex: 1 }} />
    </div>
  );
}

function Screen6({ goNext, c }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 24px 40px' }}>
      <div style={{ flex: 1 }} />
      <Geel size={140} expression="celebrating" />
      <div style={{ height: 16 }} />
      <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#4CAF50', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(76,175,80,0.3)' }}>
        <span style={{ fontSize: 20, fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif' }}>1</span>
      </div>
      <div style={{ height: 12 }} />
      <h2 style={{ fontSize: 24, fontWeight: 900, color: '#333', fontFamily: 'Nunito, sans-serif', textAlign: 'center' }}>{c.lessonTitle}</h2>
      <p style={{ fontSize: 14, color: '#757575', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginTop: 4 }}>{c.lessonSubtitle}</p>
      <div style={{ height: 16 }} />
      <p style={{ fontSize: 15, color: '#757575', fontFamily: 'Nunito, sans-serif', textAlign: 'center' }}>{c.introLine}</p>
      <div style={{ flex: 1 }} />
      <PrimaryButton onClick={goNext}>{c.buttonText}</PrimaryButton>
    </div>
  );
}
