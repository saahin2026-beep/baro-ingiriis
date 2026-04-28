import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SignupPage from '../SignupPage';
import { storage } from '../../utils/storage';

const mockSignUp = vi.fn();

vi.mock('../../utils/supabase', () => ({
  supabase: {
    auth: {
      signUp: (...args) => mockSignUp(...args),
    },
  },
}));

vi.mock('../../utils/observability', () => ({
  trackEvent: vi.fn(),
}));

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/signup']}>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/auth-gate" element={<div>AUTH</div>} />
        <Route path="/profile-setup/0" element={<div>PROFILE-SETUP</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  localStorage.clear();
  mockSignUp.mockReset();
});

describe('SignupPage — validation', () => {
  it('rejects passwords shorter than 8 characters', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByPlaceholderText(/name|magacaaga/i), 'Ahmed');
    await user.type(screen.getByPlaceholderText(/email|tusaale/i), 'a@b.co');
    await user.type(screen.getByPlaceholderText(/8 characters|8 xaraf/i), 'short1');

    await user.click(screen.getByRole('button', { name: /sign up|samee/i }));

    // We didn't call Supabase because validation failed.
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it('rejects malformed email', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByPlaceholderText(/name|magacaaga/i), 'Ahmed');
    await user.type(screen.getByPlaceholderText(/email|tusaale/i), 'not-an-email');
    await user.type(screen.getByPlaceholderText(/8 characters|8 xaraf/i), 'longenough123');

    await user.click(screen.getByRole('button', { name: /sign up|samee/i }));

    expect(mockSignUp).not.toHaveBeenCalled();
  });
});

describe('SignupPage — flow', () => {
  it('shows the check-email screen when supabase returns no session (confirmation required)', async () => {
    mockSignUp.mockResolvedValue({
      data: { user: { id: 'u-1' }, session: null }, // no session = pending confirmation
      error: null,
    });
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByPlaceholderText(/name|magacaaga/i), 'Ahmed');
    await user.type(screen.getByPlaceholderText(/email|tusaale/i), 'ahmed@example.com');
    await user.type(screen.getByPlaceholderText(/8 characters|8 xaraf/i), 'longenough123');
    await user.click(screen.getByRole('button', { name: /sign up|samee/i }));

    // The user lands on the "check your email" screen with the email displayed.
    await screen.findByText(/check your email|hubi email/i);
    expect(screen.getByText('ahmed@example.com')).toBeInTheDocument();

    // Storage flag set so the App-level auth listener can pick up after confirm.
    expect(storage.get().awaitingEmailConfirmation).toBe(true);
    expect(storage.get().pendingEmail).toBe('ahmed@example.com');
  });

  it('does NOT mark the user authComplete on signup-with-pending-confirmation', async () => {
    mockSignUp.mockResolvedValue({
      data: { user: { id: 'u-1' }, session: null },
      error: null,
    });
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByPlaceholderText(/name|magacaaga/i), 'Ahmed');
    await user.type(screen.getByPlaceholderText(/email|tusaale/i), 'ahmed@example.com');
    await user.type(screen.getByPlaceholderText(/8 characters|8 xaraf/i), 'longenough123');
    await user.click(screen.getByRole('button', { name: /sign up|samee/i }));

    await screen.findByText(/check your email|hubi email/i);
    // authComplete must remain false until they click the email link.
    expect(storage.get().authComplete).toBeFalsy();
  });

  it('surfaces the "already registered" error message from Supabase', async () => {
    mockSignUp.mockResolvedValue({
      data: { user: null, session: null },
      error: { message: 'User already registered' },
    });
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByPlaceholderText(/name|magacaaga/i), 'Ahmed');
    await user.type(screen.getByPlaceholderText(/email|tusaale/i), 'taken@example.com');
    await user.type(screen.getByPlaceholderText(/8 characters|8 xaraf/i), 'longenough123');
    await user.click(screen.getByRole('button', { name: /sign up|samee/i }));

    await screen.findByText(/already registered|horey ayaa/i);
  });

  it('passes emailRedirectTo to /profile-setup/0 (Supabase URL config dependency)', async () => {
    mockSignUp.mockResolvedValue({
      data: { user: { id: 'u-1' }, session: null },
      error: null,
    });
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByPlaceholderText(/name|magacaaga/i), 'Ahmed');
    await user.type(screen.getByPlaceholderText(/email|tusaale/i), 'ahmed@example.com');
    await user.type(screen.getByPlaceholderText(/8 characters|8 xaraf/i), 'longenough123');
    await user.click(screen.getByRole('button', { name: /sign up|samee/i }));

    expect(mockSignUp).toHaveBeenCalledWith(expect.objectContaining({
      options: expect.objectContaining({
        emailRedirectTo: expect.stringContaining('/profile-setup/0'),
      }),
    }));
  });
});
