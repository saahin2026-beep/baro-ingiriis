import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import LoginPage from '../LoginPage';
import { storage } from '../../utils/storage';

const mockSignIn = vi.fn();
const mockUpsert = vi.fn();
const mockMaybeSingle = vi.fn();

vi.mock('../../utils/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: (...args) => mockSignIn(...args),
    },
    from: () => ({
      select: () => ({ eq: () => ({ maybeSingle: () => mockMaybeSingle() }) }),
      upsert: (...args) => { mockUpsert(...args); return Promise.resolve({ error: null }); },
    }),
  },
}));

vi.mock('../../utils/observability', () => ({
  trackEvent: vi.fn(),
  setObservabilityUser: vi.fn(),
}));

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth-gate" element={<div>AUTH</div>} />
        <Route path="/signup" element={<div>SIGNUP</div>} />
        <Route path="/forgot-password" element={<div>FORGOT</div>} />
        <Route path="/profile-setup/0" element={<div>PROFILE-SETUP</div>} />
        <Route path="/geel-world" element={<div>GEELWORLD</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  localStorage.clear();
  mockSignIn.mockReset();
  mockUpsert.mockReset();
  mockMaybeSingle.mockReset();
});

describe('LoginPage', () => {
  it('routes to /geel-world when login succeeds and profile is complete', async () => {
    mockSignIn.mockResolvedValue({ data: { user: { id: 'u-1' } }, error: null });
    mockMaybeSingle.mockResolvedValue({ data: { profile_complete: true, name: 'Ahmed' }, error: null });

    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByPlaceholderText(/example@email|tusaale/i), 'ahmed@example.com');
    await user.type(screen.getByPlaceholderText(/8 characters|8 xaraf/i), 'longenough123');
    await user.click(screen.getByRole('button', { name: /log in|soo gal/i }));

    await screen.findByText('GEELWORLD');
    expect(storage.get().authComplete).toBe(true);
    expect(storage.get().profileComplete).toBe(true);
  });

  it('routes to /profile-setup/0 when profile is not yet complete', async () => {
    mockSignIn.mockResolvedValue({ data: { user: { id: 'u-1' } }, error: null });
    mockMaybeSingle.mockResolvedValue({ data: { profile_complete: false, name: 'Ahmed' }, error: null });

    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByPlaceholderText(/example@email|tusaale/i), 'ahmed@example.com');
    await user.type(screen.getByPlaceholderText(/8 characters|8 xaraf/i), 'longenough123');
    await user.click(screen.getByRole('button', { name: /log in|soo gal/i }));

    await screen.findByText('PROFILE-SETUP');
  });

  it('creates a profile row if one is missing on first login', async () => {
    mockSignIn.mockResolvedValue({ data: { user: { id: 'u-1' } }, error: null });
    mockMaybeSingle.mockResolvedValue({ data: null, error: null }); // no row yet

    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByPlaceholderText(/example@email|tusaale/i), 'ahmed@example.com');
    await user.type(screen.getByPlaceholderText(/8 characters|8 xaraf/i), 'longenough123');
    await user.click(screen.getByRole('button', { name: /log in|soo gal/i }));

    await screen.findByText('PROFILE-SETUP');
    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'u-1', profile_complete: false }),
      expect.objectContaining({ onConflict: 'id' }),
    );
  });

  it('shows the unconfirmed-email message specifically (not generic "wrong password")', async () => {
    mockSignIn.mockResolvedValue({
      data: null,
      error: { message: 'Email not confirmed' },
    });

    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByPlaceholderText(/example@email|tusaale/i), 'ahmed@example.com');
    await user.type(screen.getByPlaceholderText(/8 characters|8 xaraf/i), 'longenough123');
    await user.click(screen.getByRole('button', { name: /log in|soo gal/i }));

    await screen.findByText(/not confirmed|lama xaqiijin/i);
  });

  it('shows generic credentials error for any other auth failure', async () => {
    mockSignIn.mockResolvedValue({
      data: null,
      error: { message: 'Invalid login credentials' },
    });

    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByPlaceholderText(/example@email|tusaale/i), 'ahmed@example.com');
    await user.type(screen.getByPlaceholderText(/8 characters|8 xaraf/i), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /log in|soo gal/i }));

    await screen.findByText(/wrong email|khalad/i);
  });

  it('does not call signInWithPassword when fields are empty', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('button', { name: /log in|soo gal/i }));
    expect(mockSignIn).not.toHaveBeenCalled();
  });
});
