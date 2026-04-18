import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--dark)', color: '#fff', direction: 'rtl', marginTop: 'auto' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32, marginBottom: 40 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 28 }}>📚</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>کتاب‌خانه</span>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.8 }}>
              نسل جدید کتاب‌های دیجیتال<br />
              با قیمتی مناسب‌تر از نسخه چاپی
            </p>
          </div>
          {/* Links */}
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: 'rgba(255,255,255,0.7)' }}>دسترسی سریع</h4>
            {[['/', 'صفحه اصلی'], ['/blog', 'بلاگ'], ['/login', 'ورود']].map(([to, label]) => (
              <Link key={to} to={to} style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 8, transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
              >{label}</Link>
            ))}
          </div>
          {/* Contact */}
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: 'rgba(255,255,255,0.7)' }}>تماس با ما</h4>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.9 }}>
              پشتیبانی ۲۴ ساعته<br />
              support@book.ir<br />
              تلفن: ۰۲۱-۱۲۳۴۵۶۷۸
            </p>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>© ۱۴۰۳ کتاب‌خانه — همه حقوق محفوظ است</p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>ساخته شده با ❤️</p>
        </div>
      </div>
    </footer>
  );
}
