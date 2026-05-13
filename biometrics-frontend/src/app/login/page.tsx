'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/lib/api';
import { saveToken, isAuthenticated } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) router.replace('/dashboard');
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token } = await loginUser(username, password);
      saveToken(token);
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-bg">
      <div className="login-card">
        <div className="login-icon">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
            <path d="M12 10c-4 0-7 2-7 4.5V16h14v-1.5c0-2.5-3-4.5-7-4.5z"/>
            <path d="M17.5 6.5C18.4 7.6 19 9 19 10.5"/>
            <path d="M6.5 6.5C5.6 7.6 5 9 5 10.5"/>
            <path d="M20 4c1.5 1.7 2.5 3.9 2.5 6.5"/>
            <path d="M4 4C2.5 5.7 1.5 7.9 1.5 10.5"/>
          </svg>
        </div>

        <h1 className="login-title">BioTrack</h1>
        <p className="login-subtitle">Sign in to your account</p>

        {error && (
          <div className="error-box">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="field">
            <label htmlFor="username">Username</label>
            <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter username" autoComplete="username" required />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <div className="password-wrap">
              <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" autoComplete="current-password" required />
              <button type="button" className="eye-btn" onClick={() => setShowPassword(v => !v)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Sign in'}
          </button>
        </form>
      </div>

      <style>{`
        .login-bg {
          min-height: 100vh; display: flex; align-items: center; justify-content: center;
          background: #09090b; font-family: 'DM Sans', system-ui, sans-serif;
          background-image: radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.06) 0%, transparent 60%);
        }
        .login-card {
          background: #18181b; border: 1px solid #27272a; border-radius: 16px;
          padding: 40px 36px; width: 100%; max-width: 380px; text-align: center;
          box-shadow: 0 0 40px rgba(0,0,0,0.5);
        }
        .login-icon {
          width: 58px; height: 58px; border-radius: 14px;
          background: rgba(16,185,129,0.1);
          border: 1px solid rgba(16,185,129,0.25);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 20px;
          box-shadow: 0 0 20px rgba(16,185,129,0.12);
        }
        .login-title { font-size: 20px; font-weight: 600; color: #f4f4f5; margin-bottom: 6px; }
        .login-subtitle { font-size: 13px; color: #71717a; margin-bottom: 28px; }
        .error-box {
          display: flex; align-items: center; gap: 8px;
          background: rgba(239,68,68,0.1); color: #f87171;
          border: 1px solid rgba(239,68,68,0.2); border-radius: 8px;
          padding: 10px 14px; font-size: 13px; margin-bottom: 20px; text-align: left;
        }
        .login-form { display: flex; flex-direction: column; gap: 16px; text-align: left; }
        .field label { display: block; font-size: 12px; font-weight: 500; color: #a1a1aa; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.4px; }
        .field input {
          width: 100%; padding: 10px 12px;
          border: 1px solid #3f3f46; border-radius: 8px;
          font-size: 14px; color: #f4f4f5; background: #09090b;
          outline: none; transition: border-color 0.15s; box-sizing: border-box;
        }
        .field input::placeholder { color: #52525b; }
        .field input:focus { border-color: rgba(16,185,129,0.5); box-shadow: 0 0 0 3px rgba(16,185,129,0.08); }
        .password-wrap { position: relative; }
        .password-wrap input { padding-right: 40px; }
        .eye-btn {
          position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: #52525b;
          padding: 4px; display: flex;
        }
        .eye-btn:hover { color: #71717a; }
        .submit-btn {
          width: 100%; padding: 11px; border-radius: 8px; border: none;
          background: #10b981; color: #fff;
          font-size: 14px; font-weight: 500; cursor: pointer; margin-top: 4px;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s; font-family: inherit;
          box-shadow: 0 0 20px rgba(16,185,129,0.2);
        }
        .submit-btn:hover:not(:disabled) { background: #059669; box-shadow: 0 0 24px rgba(16,185,129,0.35); }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.2);
          border-top-color: #fff; border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </main>
  );
}
