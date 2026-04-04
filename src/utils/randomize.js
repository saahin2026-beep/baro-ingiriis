export function shuffle(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function shuffleOptions(options, correctIndex) {
  const tagged = options.map((opt, i) => ({ value: opt, originalIndex: i }));
  const shuffled = shuffle(tagged);
  const newCorrectIndex = shuffled.findIndex(item => item.originalIndex === correctIndex);
  return { options: shuffled.map(item => item.value), correctIndex: newCorrectIndex };
}
