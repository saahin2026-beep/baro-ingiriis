import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChooseExercise from '../ChooseExercise';

vi.mock('../../utils/DataContext', () => ({
  useData: () => ({
    getRandomPhrase: () => ({ text: 'Sax!', emoji: '⭐' }),
  }),
}));

const exercise = {
  type: 'choose',
  prompt: "Hi, I'm Ahmed.",
  options: ['Salaan, magacaygu waa Ahmed', 'Nabad gelyo', 'Sidee tahay?'],
  correctIndex: 0,
};

describe('ChooseExercise — practiceMode', () => {
  it('calls onComplete(true) shortly after tapping the correct option', async () => {
    const onComplete = vi.fn();
    const user = userEvent.setup();

    render(<ChooseExercise data={exercise} onComplete={onComplete} practiceMode />);

    await user.click(screen.getByText(exercise.options[exercise.correctIndex]));

    await waitFor(() => expect(onComplete).toHaveBeenCalledWith(true), { timeout: 1500 });
  });

  it('calls onComplete(false) and exposes the correct answer when wrong option tapped', async () => {
    const onComplete = vi.fn();
    const user = userEvent.setup();

    render(<ChooseExercise data={exercise} onComplete={onComplete} practiceMode />);

    await user.click(screen.getByText(exercise.options[1])); // wrong

    await waitFor(() => expect(onComplete).toHaveBeenCalledWith(false), { timeout: 2000 });
    // Correct answer text revealed
    expect(screen.getByText(/Jawaabta saxda/)).toBeInTheDocument();
  });

  it('ignores subsequent taps after the answer is locked in', async () => {
    const onComplete = vi.fn();
    const user = userEvent.setup();

    render(<ChooseExercise data={exercise} onComplete={onComplete} practiceMode />);

    await user.click(screen.getByText(exercise.options[0])); // correct
    await user.click(screen.getByText(exercise.options[1])); // attempted second tap
    await user.click(screen.getByText(exercise.options[2])); // attempted third tap

    await waitFor(() => expect(onComplete).toHaveBeenCalled(), { timeout: 2000 });
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenLastCalledWith(true);
  });
});

describe('ChooseExercise — main lesson mode (default)', () => {
  it('does not advance until the user taps the correct option (retry-until-right)', async () => {
    const onComplete = vi.fn();
    const user = userEvent.setup();

    render(<ChooseExercise data={exercise} onComplete={onComplete} />);

    // Wrong option — does NOT call onComplete
    await user.click(screen.getByText(exercise.options[1]));

    // Wait a beat — even though FeedbackBanner appears, onComplete shouldn't fire on wrong in non-practice
    await new Promise((r) => setTimeout(r, 200));
    expect(onComplete).not.toHaveBeenCalled();
  });
});
