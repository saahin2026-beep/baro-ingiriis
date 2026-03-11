import { useState } from 'react';
import { supabase } from '../utils/supabase';

export default function AdminAuth({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: dbError } = await supabase
        .from('admin_settings')
        .select('value')
        .eq('key', 'admin_password')
        .single();

      if (dbError) throw dbError;

      if (data.value === password) {
        sessionStorage.setItem('baro-admin', 'true');
        onLogin();
      } else {
        setError('Password incorrect');
      }
    } catch (err) {
      setError('Login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
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
          Baro Admin
        </h1>
        <p style={{ fontSize: 13, color: '#999', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginTop: 4 }}>
          Enter admin password to continue
        </p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={{
            width: '100%', padding: '12px 14px', borderRadius: 10, border: '2px solid #E0E0E0',
            fontSize: 15, fontFamily: 'Nunito, sans-serif', marginTop: 24, outline: 'none',
            boxSizing: 'border-box',
          }}
          onFocus={(e) => { e.target.style.borderColor = '#4CAF50'; }}
          onBlur={(e) => { e.target.style.borderColor = '#E0E0E0'; }}
        />

        {error && (
          <p style={{ fontSize: 13, color: '#E53935', fontFamily: 'Nunito, sans-serif', marginTop: 8 }}>
            {error}
          </p>
        )}

        <button type="submit" disabled={loading || !password} style={{
          width: '100%', padding: '14px 0', borderRadius: 12, border: 'none',
          background: loading || !password ? '#C8E6C9' : '#4CAF50',
          fontSize: 15, fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif',
          cursor: loading || !password ? 'not-allowed' : 'pointer', marginTop: 16,
        }}>
          {loading ? 'Checking...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
