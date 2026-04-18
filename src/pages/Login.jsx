import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Login() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register, user } = useApp();
  const navigate = useNavigate();

  if (user) { navigate(user.role === 'admin' ? '/admin' : '/panel'); return null; }

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const res = mode === 'login'
      ? login(form.email, form.password)
      : register(form.name, form.email, form.password);
    setLoading(false);
    if (res.ok) navigate(res.role === 'admin' ? '/admin' : '/panel');
    else setError(res.error);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, direction: 'rtl' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>📚</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--purple)' }}>کتاب‌خانه</h1>
        </div>

        <div style={{ background: '#fff', borderRadius: 'var(--r-xl)', padding: 32, boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)' }}>
          {/* Toggle */}
          <div style={{ display: 'flex', background: 'var(--bg)', borderRadius: 'var(--r-pill)', padding: 4, marginBottom: 28 }}>
            {[['login', 'ورود'], ['register', 'ثبت‌نام']].map(([m, l]) => (
              <button key={m} onClick={() => { setMode(m); setError(''); }} style={{
                flex: 1, padding: '9px', borderRadius: 'var(--r-pill)', border: 'none', cursor: 'pointer',
                fontSize: 14, fontWeight: 700, transition: 'all 0.2s',
                background: mode === m ? '#fff' : 'transparent',
                color: mode === m ? 'var(--purple)' : 'var(--text-3)',
                boxShadow: mode === m ? 'var(--shadow-sm)' : 'none',
              }}>{l}</button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <Field label="نام" type="text" value={form.name} onChange={set('name')} placeholder="نام و نام خانوادگی" required />
            )}
            <Field label="ایمیل" type="email" value={form.email} onChange={set('email')} placeholder="example@email.com" required />
            <Field label="رمز عبور" type="password" value={form.password} onChange={set('password')} placeholder="حداقل ۶ کاراکتر" required />

            {error && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 'var(--r-md)', padding: '10px 14px', color: '#DC2626', fontSize: 13, marginBottom: 16 }}>
                ⚠️ {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', background: 'var(--purple)', color: '#fff',
              border: 'none', borderRadius: 'var(--r-pill)', padding: '13px',
              fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1, transition: 'background 0.2s',
            }}
            onMouseEnter={e => !loading && (e.currentTarget.style.background = 'var(--purple-2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--purple)')}
            >
              {loading ? 'در حال پردازش...' : mode === 'login' ? 'ورود به حساب' : 'ساخت حساب'}
            </button>
          </form>

          {/* Demo accounts */}
          <div style={{ marginTop: 24, padding: '14px', background: 'var(--bg)', borderRadius: 'var(--r-md)', fontSize: 12, color: 'var(--text-3)' }}>
            <p style={{ fontWeight: 700, marginBottom: 6, color: 'var(--text-2)' }}>حساب‌های آزمایشی:</p>
            <p>👤 کاربر: user@book.ir / user123</p>
            <p style={{ marginTop: 3 }}>⚙️ مدیر: admin@book.ir / admin123</p>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-3)' }}>
          <span onClick={() => navigate('/')} style={{ cursor: 'pointer', color: 'var(--purple)' }}>← بازگشت به سایت</span>
        </p>
      </div>
    </div>
  );
}

function Field({ label, type, value, onChange, placeholder, required }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6 }}>{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} required={required}
        style={{ width: '100%', padding: '11px 14px', border: '2px solid var(--border)', borderRadius: 'var(--r-md)', fontSize: 14, outline: 'none', transition: 'border-color 0.2s', background: 'var(--bg)', direction: type === 'email' || type === 'password' ? 'ltr' : 'rtl', textAlign: 'right' }}
        onFocus={e => e.target.style.borderColor = 'var(--purple)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
      />
    </div>
  );
}
