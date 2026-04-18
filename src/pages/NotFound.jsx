import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpenIcon, HomeIcon, ArrowRightIcon } from '../components/Icons';
import Navbar from '../components/Navbar';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', direction: 'rtl', textAlign: 'center' }}>
        {/* Big 404 */}
        <div style={{ position: 'relative', marginBottom: 32 }}>
          <div style={{ fontSize: 'clamp(80px,18vw,160px)', fontWeight: 900, lineHeight: 1, color: 'var(--primary-light)', userSelect: 'none', letterSpacing: -4 }}>
            404
          </div>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', color: 'var(--primary)' }}>
            <BookOpenIcon size={56} />
          </div>
        </div>

        <h1 style={{ fontSize: 'clamp(20px,4vw,28px)', fontWeight: 900, marginBottom: 12, color: 'var(--text)' }}>
          صفحه‌ای پیدا نشد
        </h1>
        <p style={{ fontSize: 15, color: 'var(--text-3)', marginBottom: 32, maxWidth: 400, lineHeight: 1.8 }}>
          صفحه‌ای که دنبالش بودید وجود ندارد یا جابجا شده. شاید از لینک اشتباهی آمده‌اید.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={() => navigate(-1)} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'var(--dark)', color: '#fff', border: 'none',
            padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--primary)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--dark)'}
          >
            ← برگشت
          </button>
          <Link to="/" style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'var(--primary)', color: '#fff',
            padding: '12px 24px', fontSize: 14, fontWeight: 700,
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--primary)'}
          >
            <HomeIcon size={16} /> صفحه اصلی
          </Link>
        </div>

        {/* Decorative books */}
        <div style={{ marginTop: 56, display: 'flex', gap: 8, opacity: 0.25 }}>
          {[...Array(7)].map((_, i) => (
            <div key={i} style={{
              width: `${20 + Math.random() * 12}px`, height: `${60 + Math.random() * 30}px`,
              background: ['var(--primary)', 'var(--dark)', '#D97706', '#7C3AED'][i % 4],
              transform: `rotate(${(Math.random() - 0.5) * 8}deg)`,
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}
