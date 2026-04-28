import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProfileEditPage from '../ProfileEditPage';
import { storage } from '../../utils/storage';

const mockUpdate = vi.fn();
const mockEq = vi.fn();
const mockSelect = vi.fn();
const mockMaybeSingle = vi.fn();
const mockGetUser = vi.fn();
const mockRpc = vi.fn();

vi.mock('../../utils/supabase', () => ({
  supabase: {
    auth: { getUser: () => mockGetUser() },
    from: () => ({
      select: () => {
        mockSelect();
        return { eq: () => ({ maybeSingle: () => mockMaybeSingle() }) };
      },
      update: (payload) => {
        mockUpdate(payload);
        return {
          eq: (col, val) => {
            mockEq(col, val);
            return Promise.resolve({ error: null });
          },
        };
      },
    }),
    rpc: (...args) => mockRpc(...args),
  },
}));

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/profile-edit']}>
      <Routes>
        <Route path="/profile-edit" element={<ProfileEditPage />} />
        <Route path="/astaanta" element={<div>ASTAANTA</div>} />
        <Route path="/login" element={<div>LOGIN</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  localStorage.clear();
  mockUpdate.mockReset();
  mockEq.mockReset();
  mockMaybeSingle.mockReset();
  mockGetUser.mockReset();
  mockRpc.mockReset();
  mockRpc.mockResolvedValue({ data: true, error: null }); // username available by default
  mockGetUser.mockResolvedValue({ data: { user: { id: 'u-1', user_metadata: { name: 'Ahmed' } } } });
});

describe('ProfileEditPage — load', () => {
  it('hydrates the form from the existing profile row', async () => {
    mockMaybeSingle.mockResolvedValue({
      data: { name: 'Ahmed', username: 'ahmed99', phone: '+252611234567', birthday: '1995-05-15', city: 'Muqdisho' },
      error: null,
    });

    renderPage();
    expect(await screen.findByDisplayValue('Ahmed')).toBeInTheDocument();
    expect(screen.getByDisplayValue('ahmed99')).toBeInTheDocument();
    expect(screen.getByDisplayValue('+252611234567')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1995-05-15')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveValue('Muqdisho');
  });

  it('falls back to localStorage userName/username when the row is sparse (existing user pre data-loss-fix)', async () => {
    mockMaybeSingle.mockResolvedValue({ data: { name: '', username: '', phone: null, birthday: null, city: 'Muqdisho' }, error: null });
    storage.update({ userName: 'Ahmed', username: 'ahmed99' });

    renderPage();
    expect(await screen.findByDisplayValue('Ahmed')).toBeInTheDocument();
    expect(screen.getByDisplayValue('ahmed99')).toBeInTheDocument();
  });

  it('redirects to /login if no auth user', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    renderPage();
    await screen.findByText('LOGIN');
  });
});

describe('ProfileEditPage — save', () => {
  it('save button is disabled when form has not been edited (dirty check)', async () => {
    mockMaybeSingle.mockResolvedValue({
      data: { name: 'Ahmed', username: 'ahmed99', phone: '+252611234567', birthday: '1995-05-15', city: 'Muqdisho' },
      error: null,
    });

    renderPage();
    const saveBtn = await screen.findByRole('button', { name: /save|kaydi/i });
    expect(saveBtn).toBeDisabled();
  });

  it('persists ALL fields to Supabase on submit, not just the edited one', async () => {
    mockMaybeSingle.mockResolvedValue({
      data: { name: 'Ahmed', username: 'ahmed99', phone: '+252611234567', birthday: '1995-05-15', city: 'Muqdisho' },
      error: null,
    });
    const user = userEvent.setup();
    renderPage();

    const nameInput = await screen.findByDisplayValue('Ahmed');
    await user.clear(nameInput);
    await user.type(nameInput, 'Mohamed');

    await user.click(screen.getByRole('button', { name: /save|kaydi/i }));

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Mohamed',
        username: 'ahmed99',
        phone: '+252611234567',
        birthday: '1995-05-15',
        city: 'Muqdisho',
      }),
    );
  });

  it('disables save while a username availability check is in flight', async () => {
    mockMaybeSingle.mockResolvedValue({
      data: { name: 'Ahmed', username: 'ahmed99', phone: '+252611234567', birthday: '1995-05-15', city: 'Muqdisho' },
      error: null,
    });
    // Make the RPC hang so we can observe the "checking" state.
    mockRpc.mockReturnValue(new Promise(() => {}));

    const user = userEvent.setup();
    renderPage();

    const usernameInput = await screen.findByDisplayValue('ahmed99');
    await user.clear(usernameInput);
    await user.type(usernameInput, 'newhandle');

    // Wait for debounce + state transition to "checking"
    await screen.findByRole('progressbar', {}, { timeout: 1500 }).catch(() => null);

    // Whether by the spinner or by status, the save button should be disabled while checking.
    // We assert via the button's disabled property since the spinner isn't role=progressbar.
    const saveBtn = screen.getByRole('button', { name: /save|kaydi/i });
    // The form is dirty AND username is checking → button must be disabled.
    expect(saveBtn).toBeDisabled();
  });

  it('blocks save when the username is taken', async () => {
    mockMaybeSingle.mockResolvedValue({
      data: { name: 'Ahmed', username: 'ahmed99', phone: '+252611234567', birthday: '1995-05-15', city: 'Muqdisho' },
      error: null,
    });
    mockRpc.mockResolvedValue({ data: false, error: null }); // taken

    const user = userEvent.setup();
    renderPage();

    const usernameInput = await screen.findByDisplayValue('ahmed99');
    await user.clear(usernameInput);
    await user.type(usernameInput, 'taken');

    // Wait for the "taken" status to render
    await screen.findByText(/already taken|horey ayaa/i, {}, { timeout: 2000 });

    const saveBtn = screen.getByRole('button', { name: /save|kaydi/i });
    expect(saveBtn).toBeDisabled();
  });

  it('skips the username check entirely when the value matches the current username (does not flag your own name as taken)', async () => {
    mockMaybeSingle.mockResolvedValue({
      data: { name: 'Ahmed', username: 'ahmed99', phone: '+252611234567', birthday: '1995-05-15', city: 'Muqdisho' },
      error: null,
    });
    const user = userEvent.setup();
    renderPage();

    // Edit a different field — username unchanged
    const nameInput = await screen.findByDisplayValue('Ahmed');
    await user.clear(nameInput);
    await user.type(nameInput, 'Mohamed');

    // Give debounce time to fire if it were going to
    await new Promise((r) => setTimeout(r, 700));

    // No RPC call should have happened — username didn't change
    expect(mockRpc).not.toHaveBeenCalled();
  });
});
