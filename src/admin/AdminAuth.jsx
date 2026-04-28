import { useState } from 'react';
import { supabase } from '../utils/supabase';
import { isAdminEmail } from './adminConfig';

export default function AdminAuth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const normalizedEmail = email.trim().toLowerCase();

    if (!isAdminEmail(normalizedEmail)) {
      setError('Access denied');
      setLoading(false);
      return;
    }

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (authError || !isAdminEmail(data?.user?.email)) {
      if (data?.session) await supabase.auth.signOut();
      setError('Login failed');
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100dvh', background: '#F5F5F5',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <form onSubmit={handleSubmit} style={{
        background: 'white', borderRadius: 16, padding: 32, width: '100%', maxWidth: 360,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#333', fontFamily: 'Nunito, sans-serif', textAlign: 'center' }}>
          Hadaling Admin
        </h1>
        <p style={{ fontSize: 13, color: '#999', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginTop: 4 }}>
          Sign in with admin credentials
        </p>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Admin email"
          autoComplete="email"
          style={{
            width: '100%', padding: '12px 14px', borderRadius: 10, border: '2px solid #E0E0E0',
            fontSize: 15, fontFamily: 'Nunito, sans-serif', marginTop: 24, outline: 'none',
            boxSizing: 'border-box',
          }}
          onFocus={(e) => { e.target.style.borderColor = '#0891B2'; }}
          onBlur={(e) => { e.target.style.borderColor = '#E0E0E0'; }}
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoComplete="current-password"
          style={{
            width: '100%', padding: '12px 14px', borderRadius: 10, border: '2px solid #E0E0E0',
            fontSize: 15, fontFamily: 'Nunito, sans-serif', marginTop: 12, outline: 'none',
            boxSizing: 'border-box',
          }}
          onFocus={(e) => { e.target.style.borderColor = '#0891B2'; }}
          onBlur={(e) => { e.target.style.borderColor = '#E0E0E0'; }}
        />

        {error && (
          <p style={{ fontSize: 13, color: '#E53935', fontFamily: 'Nunito, sans-serif', marginTop: 8 }}>
            {error}
          </p>
        )}

        <button type="submit" disabled={loading || !email || !password} style={{
          width: '100%', padding: '14px 0', borderRadius: 12, border: 'none',
          background: loading || !email || !password ? '#CFFAFE' : '#0891B2',
          fontSize: 15, fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif',
          cursor: loading || !email || !password ? 'not-allowed' : 'pointer', marginTop: 16,
        }}>
          {loading ? 'Checking...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
