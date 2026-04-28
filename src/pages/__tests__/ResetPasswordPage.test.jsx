import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ResetPasswordPage from '../ResetPasswordPage';

const mockGetSession = vi.fn();
const mockUpdateUser = vi.fn();
let registeredAuthCallback = null;

vi.mock('../../utils/supabase', () => ({
  supabase: {
    auth: {
      getSession: () => mockGetSession(),
      updateUser: (...args) => mockUpdateUser(...args),
      onAuthStateChange: (cb) => {
        registeredAuthCallback = cb;
        return { data: { subscription: { unsubscribe: () => {} } } };
      },
    },
  },
}));

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/reset-password']}>
      <Routes>
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/login" element={<div>LOGIN</div>} />
        <Route path="/forgot-password" element={<div>FORGOT</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  mockGetSession.mockReset();
  mockUpdateUser.mockReset();
  registeredAuthCallback = null;
});

describe('ResetPasswordPage', () => {
  it('shows the expired-link state when there is no recovery session', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });
    renderPage();

    await screen.findByText(/expired|fadhiyay/i);
  });

  it('authorizes when a session is present and lets the user submit a new password', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: 'u-1', email: 'a@b.co' } } },
    });
    mockUpdateUser.mockResolvedValue({ error: null });
    const user = userEvent.setup();
    renderPage();

    // Wait until the form (not the expired state) shows
    const submitBtn = await screen.findByRole('button', { name: /^save|kaydi$/i });

    const pwInputs = screen.getAllByDisplayValue('').filter((el) => el.type === 'password');
    await user.type(pwInputs[0], 'newpass1234');
    await user.type(pwInputs[1], 'newpass1234');

    await user.click(submitBtn);

    expect(mockUpdateUser).toHaveBeenCalledWith({ password: 'newpass1234' });
    await screen.findByText(/password updated|cusboonaysiiyay/i);
  });

  it('rejects mismatched passwords without calling Supabase', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: 'u-1' } } },
    });
    const user = userEvent.setup();
    renderPage();

    const submitBtn = await screen.findByRole('button', { name: /^save|kaydi$/i });
    const pwInputs = screen.getAllByDisplayValue('').filter((el) => el.type === 'password');
    await user.type(pwInputs[0], 'newpass1234');
    await user.type(pwInputs[1], 'differenT123');

    await user.click(submitBtn);

    await screen.findByText(/don't match|isma eka/i);
    expect(mockUpdateUser).not.toHaveBeenCalled();
  });

  it('rejects passwords shorter than 8 chars', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: 'u-1' } } },
    });
    const user = userEvent.setup();
    renderPage();

    const submitBtn = await screen.findByRole('button', { name: /^save|kaydi$/i });
    const pwInputs = screen.getAllByDisplayValue('').filter((el) => el.type === 'password');
    await user.type(pwInputs[0], 'short');
    await user.type(pwInputs[1], 'short');

    await user.click(submitBtn);

    expect(mockUpdateUser).not.toHaveBeenCalled();
  });

  it('PASSWORD_RECOVERY auth event grants authorization even if no initial session', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });
    renderPage();

    // Initial render shows expired state
    await screen.findByText(/expired|fadhiyay/i);

    // Now simulate the recovery event firing
    await registeredAuthCallback('PASSWORD_RECOVERY', { user: { id: 'u-1' } });

    // Form should now be visible
    await screen.findByRole('button', { name: /^save|kaydi$/i });
  });
});
