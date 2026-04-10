/**
 * Shuffle exercise options while keeping correctIndex accurate.
 * Uses index tracking (not string matching) to handle duplicate option text.
 */
export function shuffleOptions(exercise) {
  if (!exercise.options || exercise.correctIndex === undefined) return exercise;
  if (exercise.type === 'order') return exercise;

  const options = exercise.options;
  const correctIdx = exercise.correctIndex;

  // Create index array [0, 1, 2] and shuffle that
  const indices = options.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  // Build shuffled options using the shuffled indices
  const shuffled = indices.map(i => options[i]);

  // Find where the original correct index ended up
  const newCorrectIndex = indices.indexOf(correctIdx);

  return {
    ...exercise,
    options: shuffled,
    correctIndex: newCorrectIndex,
  };
}
