import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AuthGate from '../AuthGate';
import { storage } from '../../utils/storage';

function renderGate() {
  return render(
    <MemoryRouter initialEntries={['/auth-gate']}>
      <Routes>
        <Route path="/auth-gate" element={<AuthGate />} />
        <Route path="/signup" element={<div>SIGNUP</div>} />
        <Route path="/login" element={<div>LOGIN</div>} />
        <Route path="/home" element={<div>HOME</div>} />
        <Route path="/geel-world" element={<div>GEELWORLD</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  localStorage.clear();
});

describe('AuthGate — voluntary path (lessons not yet started)', () => {
  it('shows the soft "save your progress" copy, not the "3 lessons done" copy', () => {
    storage.update({ lessonsCompleted: [] });
    renderGate();

    expect(screen.queryByText(/3 casharro|completed 3/i)).not.toBeInTheDocument();
    expect(screen.getByText(/save your progress|kaydiso/i)).toBeInTheDocument();
  });

  it('shows a back button so the user can escape to /home', async () => {
    storage.update({ lessonsCompleted: [] });
    const user = userEvent.setup();
    renderGate();

    await user.click(screen.getByRole('button', { name: /dib u noqo|go back/i }));
    await screen.findByText('HOME');
  });
});

describe('AuthGate — mandatory gate (3 lessons completed)', () => {
  it('shows the "3 lessons done — create account to continue" copy', () => {
    storage.update({ lessonsCompleted: [1, 2, 3] });
    renderGate();

    expect(screen.getByText(/3 casharro|completed 3/i)).toBeInTheDocument();
  });

  it('does NOT show a back button — sign-up is required to proceed', () => {
    storage.update({ lessonsCompleted: [1, 2, 3] });
    renderGate();

    // Only Sign Up and Log In buttons; no Back/aria-label="Back"
    expect(screen.queryByRole('button', { name: /^(dib u noqo|go back)$/i })).not.toBeInTheDocument();
  });
});

describe('AuthGate — already authed', () => {
  it('redirects to /geel-world if the user is already signed in (manual URL hit)', async () => {
    storage.update({ authComplete: true, lessonsCompleted: [1, 2, 3] });
    renderGate();

    await screen.findByText('GEELWORLD');
  });
});

describe('AuthGate — routing', () => {
  it('Sign Up button routes to /signup', async () => {
    storage.update({ lessonsCompleted: [] });
    const user = userEvent.setup();
    renderGate();

    await user.click(screen.getByRole('button', { name: /sign up|samee akoon/i }));
    await screen.findByText('SIGNUP');
  });

  it('Log In button routes to /login', async () => {
    storage.update({ lessonsCompleted: [] });
    const user = userEvent.setup();
    renderGate();

    await user.click(screen.getByRole('button', { name: /log in|soo gal/i }));
    await screen.findByText('LOGIN');
  });
});
