import React, { useState, useEffect } from 'react';

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

function getTimeLeft() {
  const remaining = SEVEN_DAYS - (Date.now() % SEVEN_DAYS);
  return {
    days:    Math.floor(remaining / 86400000),
    hours:   Math.floor((remaining % 86400000) / 3600000),
    minutes: Math.floor((remaining % 3600000) / 60000),
    seconds: Math.floor((remaining % 60000) / 1000),
  };
}

function Box({ value, label }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
      <div style={{
        background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(6px)',
        border: '1px solid rgba(255,255,255,0.28)', borderRadius: 10,
        width: 48, height: 48,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20, fontWeight: 800, color: '#fff', fontVariantNumeric: 'tabular-nums',
        direction: 'ltr',
      }}>
        {String(value).padStart(2, '0')}
      </div>
      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>{label}</span>
    </div>
  );
}

export default function FestivalBanner() {
  const [t, setT] = useState(getTimeLeft);
  useEffect(() => {
    const id = setInterval(() => setT(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      background: 'linear-gradient(135deg, #DC2626, #991B1B)',
      padding: '12px 24px', direction: 'rtl',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 20, flexWrap: 'wrap',
      }}>
        <div style={{ color: '#fff', textAlign: 'right' }}>
          <span style={{
            background: 'rgba(255,255,255,0.2)', borderRadius: 'var(--r-pill)',
            padding: '2px 12px', fontSize: 12, fontWeight: 700,
          }}>🎉 جشنواره قیمت</span>
          <p style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>تا پایان جشنواره باقی‌مانده</p>
        </div>

        {/* RTL: days first → appears on right, seconds last → appears on left */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, direction: 'rtl' }}>
          <Box value={t.days}    label="روز" />
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 20, fontWeight: 700, marginTop: 10 }}>:</span>
          <Box value={t.hours}   label="ساعت" />
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 20, fontWeight: 700, marginTop: 10 }}>:</span>
          <Box value={t.minutes} label="دقیقه" />
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 20, fontWeight: 700, marginTop: 10 }}>:</span>
          <Box value={t.seconds} label="ثانیه" />
        </div>

        <button style={{
          background: '#fff', color: '#DC2626',
          border: 'none', borderRadius: 'var(--r-pill)',
          padding: '8px 20px', fontSize: 13, fontWeight: 800,
          cursor: 'pointer', whiteSpace: 'nowrap',
          boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
          transition: 'transform 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          استفاده از تخفیف ↓
        </button>
      </div>
    </div>
  );
}
