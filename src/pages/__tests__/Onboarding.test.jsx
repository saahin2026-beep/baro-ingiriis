import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Onboarding from '../Onboarding';
import { storage } from '../../utils/storage';

vi.mock('../../utils/observability', () => ({ trackEvent: vi.fn() }));

vi.mock('../../utils/DataContext', () => ({
  useData: () => ({
    onboardingContent: null, // forces DEFAULTS fallback inside Onboarding
    getRandomPhrase: () => ({ text: 'Sax!', emoji: 'star' }),
  }),
}));

function renderAt(step) {
  return render(
    <MemoryRouter initialEntries={[`/onboarding/${step}`]}>
      <Routes>
        <Route path="/onboarding/:step" element={<Onboarding />} />
        <Route path="/auth-gate" element={<div>AUTH-GATE</div>} />
        <Route path="/home" element={<div>HOME</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  localStorage.clear();
});

describe('Onboarding — step 1 (intent)', () => {
  it('persists the chosen intent to storage when the user picks an option', async () => {
    const user = userEvent.setup();
    renderAt(1);

    // Each intent option is rendered as a button. Click the first one.
    const buttons = await screen.findAllByRole('button');
    // Find one that's not a "back" or nav button — Screen1 has 4 intent options
    // Use one we know is in DEFAULTS: "Nolol maalmeed"
    await user.click(screen.getByText(/nolol maalmeed|daily/i).closest('button'));

    expect(storage.get().intent).toBeTruthy();
  });
});

describe('Onboarding — step 2 (comfort)', () => {
  it('persists the chosen comfort level to storage', async () => {
    const user = userEvent.setup();
    renderAt(2);

    await user.click(screen.getByText(/waan fahmaa wax yar|wax yar/i).closest('button'));

    expect(storage.get().comfort).toBeTruthy();
  });
});

describe('Onboarding — step 5 (save progress decision — final step)', () => {
  it('"Kaydi horumarka" sets onboardingComplete and routes to /auth-gate (saved-progress path)', async () => {
    const user = userEvent.setup();
    renderAt(5);

    await user.click(screen.getByRole('button', { name: /kaydi horumarka|save/i }));

    expect(storage.get().onboardingComplete).toBe(true);
    expect(storage.get().guestMode).toBe(false);
    await screen.findByText('AUTH-GATE');
  });

  it('"Ku sii wad hadda" marks the user as guest and routes to /home', async () => {
    const user = userEvent.setup();
    renderAt(5);

    await user.click(screen.getByRole('button', { name: /ku sii wad|continue/i }));

    expect(storage.get().onboardingComplete).toBe(true);
    expect(storage.get().guestMode).toBe(true);
    await screen.findByText('HOME');
  });
});

describe('Onboarding — guard', () => {
  it('does not render past step 5 (the previous Screen6 was removed)', () => {
    // The component just renders no screen at step 6+ because that case was removed.
    renderAt(6);
    // ProgressDots and headers may still render. The key thing: the
    // mounting at step 6 has no concrete content (no Screen6 fn), so
    // the screen should be effectively empty save for ambient/page chrome.
    expect(screen.queryByRole('button', { name: /kaydi horumarka|save/i })).not.toBeInTheDocument();
  });
});
