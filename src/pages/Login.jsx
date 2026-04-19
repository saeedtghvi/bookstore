import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BookOpenIcon } from '../components/Icons';

export default function Login() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [address, setAddress] = useState({ noPhysical: false, phone: '', province: '', city: '', address: '', postalCode: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPublisher, setShowPublisher] = useState(false);
  const [pubForm, setPubForm] = useState({ email: '', password: '' });
  const [pubError, setPubError] = useState('');
  const { login, register, user } = useApp();
  const navigate = useNavigate();

  if (user) { navigate(user.role === 'admin' ? '/admin' : user.role === 'publisher' ? '/publisher' : '/panel'); return null; }

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));
  const setA = (k) => (e) => setAddress(p => ({ ...p, [k]: e.type === 'checkbox' ? e.target.checked : e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const res = mode === 'login'
      ? login(form.email, form.password)
      : register(form.name, form.email, form.password, address);
    setLoading(false);
    if (res.ok) navigate(res.role === 'admin' ? '/admin' : res.role === 'publisher' ? '/publisher' : '/panel');
    else setError(res.error);
  };

  const handlePublisherLogin = async (e) => {
    e.preventDefault();
    setPubError(''); setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const res = login(pubForm.email, pubForm.password);
    setLoading(false);
    if (res.ok && res.role === 'publisher') navigate('/publisher');
    else if (res.ok) setPubError('این حساب دسترسی ناشر ندارد');
    else setPubError(res.error);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 24px 60px', direction: 'rtl' }}>
      <div style={{ width: '100%', maxWidth: 460 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{ background: 'var(--primary)', color: '#fff', padding: '8px 10px', display: 'flex' }}>
              <BookOpenIcon size={22} />
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text)' }}>بوک‌وی</h1>
          </div>
        </div>

        {!showPublisher ? (
          <div style={{ background: '#fff', padding: 32, boxShadow: '4px 4px 0 var(--dark)', border: '2px solid var(--dark)' }}>
            {/* Toggle */}
            <div style={{ display: 'flex', background: 'var(--bg)', padding: 4, marginBottom: 28, gap: 4 }}>
              {[['login', 'ورود'], ['register', 'ثبت‌نام']].map(([m, l]) => (
                <button key={m} onClick={() => { setMode(m); setError(''); }} style={{
                  flex: 1, padding: '9px', border: 'none', cursor: 'pointer',
                  fontSize: 14, fontWeight: 700, transition: 'all 0.2s',
                  background: mode === m ? 'var(--primary)' : 'transparent',
                  color: mode === m ? '#fff' : 'var(--text-3)',
                }}>{l}</button>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              {mode === 'register' && (
                <Field label="نام و نام خانوادگی" type="text" value={form.name} onChange={set('name')} placeholder="نام کامل" required />
              )}
              <Field label="ایمیل" type="email" value={form.email} onChange={set('email')} placeholder="example@email.com" required />
              <Field label="رمز عبور" type="password" value={form.password} onChange={set('password')} placeholder="حداقل ۶ کاراکتر" required />

              {mode === 'register' && (
                <div style={{ marginTop: 8, marginBottom: 16, padding: '16px', background: 'var(--bg)', border: '1.5px solid var(--border)' }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-2)', marginBottom: 12 }}>اطلاعات ارسال (برای کتاب‌های چاپی)</p>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: address.noPhysical ? 0 : 14, padding: '10px 12px', background: address.noPhysical ? 'var(--primary-light)' : '#fff', border: `1.5px solid ${address.noPhysical ? 'var(--primary)' : 'var(--border)'}`, transition: 'all 0.15s' }}>
                    <input type="checkbox" checked={address.noPhysical} onChange={setA('noPhysical')} style={{ width: 16, height: 16, cursor: 'pointer', accentColor: 'var(--primary)' }} />
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: address.noPhysical ? 'var(--primary)' : 'var(--text)', lineHeight: 1 }}>قصد خرید کتاب چاپی ندارم</p>
                      <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 3 }}>اطلاعات آدرس لازم نیست ثبت شود</p>
                    </div>
                  </label>
                  {!address.noPhysical && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
                      <Field label="شماره موبایل" type="tel" value={address.phone} onChange={setA('phone')} placeholder="09xxxxxxxxx" dir="ltr" />
                      <Field label="استان" type="text" value={address.province} onChange={setA('province')} placeholder="مثلاً: تهران" />
                      <Field label="شهر" type="text" value={address.city} onChange={setA('city')} placeholder="شهر" />
                      <Field label="کد پستی" type="text" value={address.postalCode} onChange={setA('postalCode')} placeholder="۱۰ رقم" dir="ltr" />
                      <div style={{ gridColumn: '1/-1' }}>
                        <Field label="آدرس دقیق" type="text" value={address.address} onChange={setA('address')} placeholder="خیابان، کوچه، پلاک، واحد" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {error && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', padding: '10px 14px', color: '#DC2626', fontSize: 13, marginBottom: 16 }}>{error}</div>}

              <button type="submit" disabled={loading} style={{ width: '100%', background: 'var(--primary)', color: '#fff', border: 'none', padding: '13px', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, transition: 'background 0.2s' }}
                onMouseEnter={e => !loading && (e.currentTarget.style.background = 'var(--primary-2)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--primary)')}
              >{loading ? 'در حال پردازش...' : mode === 'login' ? 'ورود به حساب' : 'ساخت حساب'}</button>
            </form>
          </div>
        ) : (
          <div style={{ background: '#1C1917', padding: 32, boxShadow: '4px 4px 0 #92400E', border: '2px solid #92400E' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <div style={{ width: 4, height: 24, background: '#FCD34D' }} />
              <p style={{ fontSize: 16, fontWeight: 800, color: '#FEF3C7' }}>پورتال ناشران</p>
            </div>
            <form onSubmit={handlePublisherLogin}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#D6D3D1', marginBottom: 5 }}>ایمیل</label>
                <input type="email" value={pubForm.email} onChange={e => setPubForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="publisher@..." required
                  style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #44403C', fontSize: 13, background: '#292524', color: '#FEF3C7', outline: 'none', direction: 'ltr' }}
                  onFocus={e => e.target.style.borderColor = '#92400E'}
                  onBlur={e => e.target.style.borderColor = '#44403C'} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#D6D3D1', marginBottom: 5 }}>رمز عبور</label>
                <input type="password" value={pubForm.password} onChange={e => setPubForm(p => ({ ...p, password: e.target.value }))}
                  required
                  style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #44403C', fontSize: 13, background: '#292524', color: '#FEF3C7', outline: 'none', direction: 'ltr' }}
                  onFocus={e => e.target.style.borderColor = '#92400E'}
                  onBlur={e => e.target.style.borderColor = '#44403C'} />
              </div>
              {pubError && <div style={{ background: '#450A0A', border: '1px solid #7F1D1D', padding: '10px 14px', color: '#FCA5A5', fontSize: 13, marginBottom: 16 }}>{pubError}</div>}
              <button type="submit" disabled={loading} style={{ width: '100%', background: '#92400E', color: '#FEF3C7', border: 'none', padding: '13px', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'در حال پردازش...' : 'ورود به پورتال ناشران'}
              </button>
            </form>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <span onClick={() => navigate('/')} style={{ cursor: 'pointer', fontSize: 13, color: 'var(--primary)' }}>← بازگشت به سایت</span>
          <span onClick={() => { setShowPublisher(p => !p); setError(''); setPubError(''); }}
            style={{ cursor: 'pointer', fontSize: 12, color: 'var(--text-3)', userSelect: 'none', opacity: 0.4 }}>
            {showPublisher ? '← ورود کاربران' : '•••'}
          </span>
        </div>
      </div>
    </div>
  );
}

function Field({ label, type, value, onChange, placeholder, required, dir }) {
  return (
    <div style={{ marginBottom: 0 }}>
      {label && <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>{label}</label>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} dir={dir}
        style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--border)', fontSize: 13, outline: 'none', transition: 'border-color 0.2s', background: '#fff', direction: type === 'email' || type === 'password' || dir === 'ltr' ? 'ltr' : 'rtl', textAlign: 'right', marginBottom: 12 }}
        onFocus={e => e.target.style.borderColor = 'var(--primary)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
      />
    </div>
  );
}
