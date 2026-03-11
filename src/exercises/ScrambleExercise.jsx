import { useState } from 'react';
import FeedbackBanner from '../components/FeedbackBanner';
import { useData } from '../utils/DataContext';

export default function ScrambleExercise({ data, featureColor, onComplete, practiceMode = false }) {
  const { getRandomPhrase } = useData();
  const [placed, setPlaced] = useState([]);
  const [available, setAvailable] = useState(() =>
    data.pieces.map((p, i) => ({ text: p, id: i })).sort(() => Math.random() - 0.5)
  );
  const [bannerPhrase, setBannerPhrase] = useState(null);
  const [bannerType, setBannerType] = useState(null);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handlePlace = (piece) => {
    if (isCorrect || bannerVisible) return;
    setPlaced((p) => [...p, piece]);
    setAvailable((a) => a.filter((x) => x.id !== piece.id));
  };

  const handleRemove = (piece) => {
    if (isCorrect || bannerVisible) return;
    setAvailable((a) => [...a, piece]);
    setPlaced((p) => p.filter((x) => x.id !== piece.id));
  };

  const handleCheck = () => {
    const formed = placed.map((p) => p.text).join('');
    if (formed === data.answer) {
      setIsCorrect(true);
      setBannerType('correct');
      setBannerPhrase(getRandomPhrase('encouragement'));
      setBannerVisible(true);
    } else {
      if (practiceMode) {
        setIsCorrect(false);
        setBannerType('wrong');
        setBannerPhrase({ text: `Jawaabta saxda: ${data.answer}`, emoji: 'BookOpen' });
        setBannerVisible(true);
      } else {
        setBannerType('wrong');
        setBannerPhrase(getRandomPhrase('feedback'));
        setBannerVisible(true);
      }
    }
  };

  const handleReset = () => {
    setAvailable(data.pieces.map((p, i) => ({ text: p, id: i })).sort(() => Math.random() - 0.5));
    setPlaced([]);
  };

  const formed = placed.map((p) => p.text).join('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* Hint */}
      <div style={{ background: '#F7F7F7', borderRadius: 12, padding: '10px 14px', marginBottom: 14, textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: '#999', fontFamily: 'Nunito, sans-serif', margin: 0 }}>Micnaha Soomaaliga:</p>
        <p style={{ fontSize: 20, fontWeight: 800, color: '#333', fontFamily: 'Nunito, sans-serif', margin: '4px 0 0' }}>{data.hint}</p>
        <span style={{
          display: 'inline-block', marginTop: 6, padding: '2px 10px', borderRadius: 6,
          background: `${featureColor}15`, fontSize: 11, fontWeight: 700, color: featureColor,
        }}>
          {data.mode === 'letters' ? 'Xarfaha' : 'Qeybaha'} — {data.answer.length} xaraf
        </span>
      </div>

      {/* Drop zone */}
      <div style={{
        minHeight: 56, borderRadius: 14, padding: '12px 14px',
        display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', justifyContent: 'center',
        marginBottom: 14, transition: 'all 0.2s',
        background: isCorrect ? '#E8F5E9' : '#FAFAFA',
        border: isCorrect ? '2px solid #4CAF50' : placed.length > 0 ? '2px solid #E0E0E0' : '2px dashed #D0D0D0',
      }}>
        {placed.length === 0 && (
          <span style={{ fontSize: 13, color: '#bbb', fontFamily: 'Nunito, sans-serif', fontStyle: 'italic' }}>
            Halkan ku dhig {data.mode === 'letters' ? 'xarfaha' : 'qeybaha'}...
          </span>
        )}
        {placed.map((p) => (
          <button key={p.id} onClick={() => handleRemove(p)} style={{
            padding: data.mode === 'letters' ? '8px 14px' : '8px 16px', borderRadius: 10,
            background: isCorrect ? '#C8E6C9' : '#E8F5E9', border: '1.5px solid #A5D6A7',
            color: '#2E7D32', fontSize: data.mode === 'letters' ? 20 : 16,
            fontWeight: 800, fontFamily: 'Nunito, sans-serif', cursor: isCorrect ? 'default' : 'pointer',
          }}>{p.text}</button>
        ))}
      </div>

      {/* Formed word preview */}
      {placed.length > 0 && (
        <p style={{ textAlign: 'center', fontSize: 22, fontWeight: 900, color: isCorrect ? '#2E7D32' : featureColor, fontFamily: 'Nunito, sans-serif', marginBottom: 12, letterSpacing: 1 }}>
          {formed}
        </p>
      )}

      {/* Available pieces */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 14, minHeight: 44 }}>
        {available.map((p) => (
          <button key={p.id} onClick={() => handlePlace(p)} style={{
            padding: data.mode === 'letters' ? '10px 16px' : '10px 18px', borderRadius: 12,
            border: '2px solid #E0E0E0', background: 'white', color: '#333',
            fontSize: data.mode === 'letters' ? 20 : 16, fontWeight: 800, fontFamily: 'Nunito, sans-serif',
            cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
          }}>{p.text}</button>
        ))}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 8, marginTop: 'auto', paddingTop: 12 }}>
        {!isCorrect && (
          <button onClick={handleReset} style={{
            flex: 1, padding: '14px', borderRadius: 14, border: '2px solid #E0E0E0',
            background: 'white', color: '#666', fontSize: 14, fontWeight: 700,
            fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
          }}>DIB U BILOW</button>
        )}
        {available.length === 0 && !isCorrect && !bannerVisible && (
          <button onClick={handleCheck} style={{
            flex: 2, padding: '14px', borderRadius: 14, border: 'none',
            background: featureColor, color: 'white', fontSize: 14, fontWeight: 800,
            fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
            boxShadow: `0 2px 10px ${featureColor}44`,
          }}>HUBI</button>
        )}
      </div>

      <FeedbackBanner type={bannerType === 'correct' ? 'correct' : 'wrong'} phrase={bannerPhrase} visible={bannerVisible}
        onContinue={() => {
          if (bannerType === 'correct') onComplete(true);
          else if (practiceMode) onComplete(false);
          else { handleReset(); setBannerPhrase(null); setBannerType(null); setBannerVisible(false); }
        }} />
    </div>
  );
}
