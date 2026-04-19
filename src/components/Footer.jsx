import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpenIcon } from './Icons';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--dark)', color: '#fff', direction: 'rtl', marginTop: 'auto', borderTop: '2px solid var(--primary)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32, marginBottom: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ background: 'var(--primary)', padding: '6px 8px', display: 'flex' }}>
                <BookOpenIcon size={18} />
              </div>
              <span style={{ fontSize: 18, fontWeight: 900, letterSpacing: -0.5 }}>بوک‌وی</span>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.9 }}>
              فروشگاه کتاب‌های الکترونیک و چاپی<br />
              با قیمتی کمتر از نسخه چاپی
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 700, marginBottom: 14, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>دسترسی سریع</h4>
            {[
              ['/', 'صفحه اصلی'],
              ['/digital', 'کتاب‌های الکترونیک'],
              ['/physical', 'کتاب‌های چاپی'],
              ['/blog', 'بلاگ'],
              ['/login', 'ورود به حساب'],
            ].map(([to, label]) => (
              <Link key={to} to={to} style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 9, transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--primary-2)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
              >{label}</Link>
            ))}
          </div>
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 700, marginBottom: 14, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>ناشران</h4>
            <Link to="/login" style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 9, transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--primary-2)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
            >پورتال ناشران</Link>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 2, marginTop: 12 }}>
              پشتیبانی ۲۴/۷<br />
              support@bookvey.ir
            </p>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>© ۱۴۰۳ بوک‌وی</p>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>ساخته شده با دقت</p>
        </div>
      </div>
    </footer>
  );
}
