import { useState, useEffect } from 'react';
import { SpeakerHigh } from '@phosphor-icons/react';
import Geel from '../components/Geel';
import OptionCard from '../components/OptionCard';
import FeedbackBanner from '../components/FeedbackBanner';
import { useData } from '../utils/DataContext';
import { playAudio, getAudioPath } from '../utils/audio';

export default function ListenChooseExercise({ data, onComplete }) {
  const [answered, setAnswered] = useState(false);
  const [wrongIndex, setWrongIndex] = useState(null);
  const [bannerPhrase, setBannerPhrase] = useState(null);
  const [bannerType, setBannerType] = useState(null);
  const [bannerVisible, setBannerVisible] = useState(false);
  const { getRandomPhrase } = useData();
  const [isPlaying, setIsPlaying] = useState(false);

  const audioSrc = data.lessonId ? getAudioPath(data.lessonId, data.prompt) : null;

  const handlePlayAudio = async () => {
    if (isPlaying || !audioSrc) return;
    setIsPlaying(true);
    await playAudio(audioSrc);
    setIsPlaying(false);
  };

  useEffect(() => {
    if (audioSrc) {
      const timer = setTimeout(() => handlePlayAudio(), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleTap = (index) => {
    if (answered || bannerVisible) return;
    if (index === data.correctIndex) {
      setAnswered(true);
      setBannerType('correct');
      setBannerPhrase(getRandomPhrase('encouragement'));
      setBannerVisible(true);
    } else {
      setWrongIndex(index);
      setBannerType('wrong');
      setBannerPhrase(getRandomPhrase('feedback'));
      setBannerVisible(true);
    }
  };

  const getCorrectProp = (i) => {
    if (i === data.correctIndex && answered) return true;
    if (i === wrongIndex) return false;
    return null;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
        <Geel size={90} expression={answered ? 'celebrating' : 'happy'} />
      </div>

      <div
        onClick={handlePlayAudio}
        style={{
          display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px',
          borderRadius: 16, background: 'linear-gradient(180deg, #EBF5FF 0%, #D6EBFF 100%)', border: '1.5px solid #90CAF9',
          borderBottom: '3px solid #42A5F5', marginBottom: 20, cursor: 'pointer',
          boxShadow: '0 2px 12px rgba(33,150,243,0.1)',
          transition: 'transform 0.15s',
          transform: isPlaying ? 'scale(0.98)' : 'scale(1)',
        }}
      >
        <div style={{
          width: 48, height: 48, borderRadius: 14, background: '#1E88E5',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          boxShadow: '0 2px 8px rgba(30,136,229,0.3)',
          animation: isPlaying ? 'pulse 1s ease-in-out infinite' : 'none',
        }}>
          <SpeakerHigh size={26} weight="fill" color="white" />
        </div>
        <p style={{ fontSize: 18, fontWeight: 800, color: '#1565C0', fontFamily: 'Nunito, sans-serif' }}>{data.prompt}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data.options.map((opt, i) => (
          <OptionCard key={i} text={opt} number={i + 1} selected={i === data.correctIndex && answered} correct={getCorrectProp(i)} onClick={() => handleTap(i)} disabled={answered || bannerVisible} />
        ))}
      </div>

      <FeedbackBanner type={bannerType === 'correct' ? 'correct' : 'wrong'} phrase={bannerPhrase} visible={bannerVisible}
        onContinue={() => { if (bannerType === 'correct') { onComplete(); } else { setWrongIndex(null); setBannerPhrase(null); setBannerType(null); setBannerVisible(false); } }} />
    </div>
  );
}
