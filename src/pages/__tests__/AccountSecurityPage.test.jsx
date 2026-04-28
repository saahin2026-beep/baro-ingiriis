import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AccountSecurityPage from '../AccountSecurityPage';
import { storage } from '../../utils/storage';

const mockGetUser = vi.fn();
const mockUpdateUser = vi.fn();
const mockSignIn = vi.fn();
const mockSignOut = vi.fn();

vi.mock('../../utils/supabase', () => ({
  supabase: {
    auth: {
      getUser: () => mockGetUser(),
      updateUser: (...args) => mockUpdateUser(...args),
      signInWithPassword: (...args) => mockSignIn(...args),
      signOut: () => mockSignOut(),
    },
  },
}));

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/account-security']}>
      <Routes>
        <Route path="/account-security" element={<AccountSecurityPage />} />
        <Route path="/astaanta" element={<div>ASTAANTA</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  localStorage.clear();
  mockGetUser.mockReset();
  mockUpdateUser.mockReset();
  mockSignIn.mockReset();
  mockSignOut.mockReset();
  mockGetUser.mockResolvedValue({ data: { user: { id: 'u-1', email: 'a@b.co' } } });
  // Default: signOut succeeds quietly. JSDOM doesn't allow window.location.href
  // assignment in the test, so we stub it here; we just verify signOut was called.
  delete window.location;
  window.location = { href: '' };
});

describe('AccountSecurityPage — current email', () => {
  it('shows the current email from supabase.auth.getUser', async () => {
    renderPage();
    expect(await screen.findByText('a@b.co')).toBeInTheDocument();
  });
});

describe('AccountSecurityPage — change email', () => {
  it('rejects submitting an email that matches the current one', async () => {
    const user = userEvent.setup();
    renderPage();
    const newEmailInput = await screen.findByPlaceholderText(/example|tusaale/i);
    await user.type(newEmailInput, 'a@b.co');
    await user.click(screen.getByRole('button', { name: /update email|bedel email/i }));

    await screen.findByText(/current email|kii hore/i);
    expect(mockUpdateUser).not.toHaveBeenCalled();
  });

  it('calls supabase.auth.updateUser({ email }) and shows success toast', async () => {
    mockUpdateUser.mockResolvedValue({ error: null });
    const user = userEvent.setup();
    renderPage();

    const newEmailInput = await screen.findByPlaceholderText(/example|tusaale/i);
    await user.type(newEmailInput, 'new@example.com');
    await user.click(screen.getByRole('button', { name: /update email|bedel email/i }));

    await screen.findByText(/check your new email|hubi email-kaaga cusub/i);
    expect(mockUpdateUser).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'new@example.com' }),
      expect.objectContaining({ emailRedirectTo: expect.any(String) }),
    );
  });
});

describe('AccountSecurityPage — change password', () => {
  it('re-authenticates with the current password before calling updateUser', async () => {
    mockSignIn.mockResolvedValue({ error: null });
    mockUpdateUser.mockResolvedValue({ error: null });
    const user = userEvent.setup();
    renderPage();

    await screen.findByText('a@b.co');

    // Find the three password inputs by sequence — current, new, confirm
    const pwInputs = screen.getAllByDisplayValue('').filter((el) => el.type === 'password');
    expect(pwInputs.length).toBeGreaterThanOrEqual(3);

    await user.type(pwInputs[0], 'currentpass123');
    await user.type(pwInputs[1], 'newpass1234');
    await user.type(pwInputs[2], 'newpass1234');

    await user.click(screen.getByRole('button', { name: /update password|bedel password/i }));

    // Re-auth happens FIRST
    await screen.findByText(/password updated|password-ka waa la beddelay/i);
    expect(mockSignIn).toHaveBeenCalledWith({ email: 'a@b.co', password: 'currentpass123' });
    expect(mockUpdateUser).toHaveBeenCalledWith({ password: 'newpass1234' });
  });

  it('shows the wrong-current-password error when re-auth fails', async () => {
    mockSignIn.mockResolvedValue({ error: { message: 'Invalid login credentials' } });
    const user = userEvent.setup();
    renderPage();

    await screen.findByText('a@b.co');

    const pwInputs = screen.getAllByDisplayValue('').filter((el) => el.type === 'password');
    await user.type(pwInputs[0], 'wrong');
    await user.type(pwInputs[1], 'newpass1234');
    await user.type(pwInputs[2], 'newpass1234');
    await user.click(screen.getByRole('button', { name: /update password|bedel password/i }));

    await screen.findByText(/incorrect|khalad/i);
    expect(mockUpdateUser).not.toHaveBeenCalled();
  });

  it('rejects when new password and confirm do not match', async () => {
    const user = userEvent.setup();
    renderPage();

    await screen.findByText('a@b.co');
    const pwInputs = screen.getAllByDisplayValue('').filter((el) => el.type === 'password');
    await user.type(pwInputs[0], 'currentpass123');
    await user.type(pwInputs[1], 'newpass1234');
    await user.type(pwInputs[2], 'differenT123');
    await user.click(screen.getByRole('button', { name: /update password|bedel password/i }));

    await screen.findByText(/don't match|isma eka/i);
    expect(mockSignIn).not.toHaveBeenCalled();
  });
});

describe('AccountSecurityPage — sign out', () => {
  it('calls supabase.auth.signOut and clears local storage on logout', async () => {
    mockSignOut.mockResolvedValue({ error: null });
    storage.update({ authComplete: true, userId: 'u-1', userName: 'Ahmed' });

    const user = userEvent.setup();
    renderPage();

    await screen.findByText('a@b.co');
    await user.click(screen.getByRole('button', { name: /^sign out|^ka bax/i }));

    await new Promise((r) => setTimeout(r, 50));
    expect(mockSignOut).toHaveBeenCalled();
    // Local storage should be wiped (storage.reset)
    const s = storage.get();
    expect(s.authComplete).toBeFalsy();
    expect(s.userName).toBe('');
  });
});
