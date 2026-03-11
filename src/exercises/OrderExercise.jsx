import { useState } from 'react';
import { useLanguage } from '../utils/useLanguage';
import Geel from '../components/Geel';
import SpeechBubble from '../components/SpeechBubble';
import PrimaryButton from '../components/PrimaryButton';
import FeedbackBanner from '../components/FeedbackBanner';
import { useData } from '../utils/DataContext';

export default function OrderExercise({ data, onComplete }) {
  const { t } = useLanguage();
  const { getRandomPhrase } = useData();
  const [placedWords, setPlacedWords] = useState([]);
  const [availableWords, setAvailableWords] = useState([...data.words]);
  const [isCorrect, setIsCorrect] = useState(null);
  const [bannerPhrase, setBannerPhrase] = useState(null);
  const [bannerType, setBannerType] = useState(null);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [shakeArea, setShakeArea] = useState(false);

  const placeWord = (word, index) => { if (isCorrect || bannerVisible) return; setPlacedWords((p) => [...p, word]); setAvailableWords((p) => p.filter((_, i) => i !== index)); };
  const removeWord = (word, index) => { if (isCorrect || bannerVisible) return; setPlacedWords((p) => p.filter((_, i) => i !== index)); setAvailableWords((p) => [...p, word]); };

  const checkAnswer = () => {
    if (placedWords.join(' ') === data.correctSentence) {
      setIsCorrect(true); setBannerType('correct'); setBannerPhrase(getRandomPhrase('encouragement')); setBannerVisible(true);
    } else {
      setBannerType('wrong'); setBannerPhrase(getRandomPhrase('feedback')); setBannerVisible(true); setShakeArea(true);
    }
  };

  const allPlaced = availableWords.length === 0 && placedWords.length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 12 }}>
        <Geel size={90} expression={isCorrect ? 'celebrating' : 'happy'} />
        <div style={{ marginTop: 8 }}><SpeechBubble><p style={{ fontSize: 13, color: '#757575', fontFamily: 'Nunito, sans-serif' }}>Isku habee:</p></SpeechBubble></div>
      </div>
      <div style={{
        minHeight: 60, borderRadius: 14, padding: '12px 14px', display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 16, transition: 'all 0.3s',
        background: placedWords.length > 0 ? '#F5F5F5' : '#FAFAFA',
        border: shakeArea ? '2px solid #F44336' : placedWords.length > 0 ? '2px solid #E0E0E0' : '2px dashed #E0E0E0',
      }}>
        {placedWords.length === 0 && <span style={{ fontSize: 13, fontStyle: 'italic', color: '#BDBDBD', fontFamily: 'Nunito, sans-serif' }}>Halkan ku dhig erayada...</span>}
        {placedWords.map((w, i) => (
          <button key={`${w}-${i}`} onClick={() => removeWord(w, i)} className="animate-pop-in" style={{
            padding: '8px 16px', borderRadius: 10, background: '#E8F5E9', border: '1px solid #C8E6C9', color: '#2E7D32',
            fontSize: 15, fontWeight: 700, fontFamily: 'Nunito, sans-serif', cursor: isCorrect ? 'default' : 'pointer',
          }}>{w}</button>
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
        {availableWords.map((w, i) => (
          <button key={`${w}-${i}`} onClick={() => placeWord(w, i)} style={{
            padding: '10px 20px', borderRadius: 12, border: '2px solid #E0E0E0', background: 'white', color: '#333',
            fontWeight: 700, fontSize: 15, fontFamily: 'Nunito, sans-serif', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
          }}>{w}</button>
        ))}
      </div>
      {allPlaced && !isCorrect && !bannerVisible && (
        <div style={{ marginTop: 'auto', paddingTop: 20 }}><PrimaryButton onClick={checkAnswer}>{t('btn.check')}</PrimaryButton></div>
      )}
      <FeedbackBanner type={bannerType === 'correct' ? 'correct' : 'wrong'} phrase={bannerPhrase} visible={bannerVisible}
        onContinue={() => {
          if (bannerType === 'correct') onComplete();
          else { setShakeArea(false); setAvailableWords([...data.words]); setPlacedWords([]); setBannerPhrase(null); setBannerType(null); setBannerVisible(false); setIsCorrect(null); }
        }} />
    </div>
  );
}
