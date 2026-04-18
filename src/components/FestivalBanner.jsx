import React, { useState, useEffect } from 'react';

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
function getTimeLeft() {
  const r = SEVEN_DAYS - (Date.now() % SEVEN_DAYS);
  return { days: Math.floor(r/86400000), hours: Math.floor((r%86400000)/3600000), minutes: Math.floor((r%3600000)/60000), seconds: Math.floor((r%60000)/1000) };
}

function Box({ value, label }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
      <div style={{
        background: 'rgba(255,255,255,0.12)',
        border: '1px solid rgba(255,255,255,0.22)',
        width: 46, height: 46,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20, fontWeight: 900, color: '#fff',
        fontVariantNumeric: 'tabular-nums', direction: 'ltr',
        letterSpacing: '-0.5px',
      }}>
        {String(value).padStart(2, '0')}
      </div>
      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
    </div>
  );
}

export default function FestivalBanner() {
  const [t, setT] = useState(getTimeLeft);
  useEffect(() => { const id = setInterval(() => setT(getTimeLeft()), 1000); return () => clearInterval(id); }, []);

  return (
    <div style={{
      background: '#B91C1C',
      borderBottom: '2px solid #7F1D1D',
      padding: '10px 24px', direction: 'rtl',
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 24, flexWrap: 'wrap',
      }}>
        {/* Label */}
        <div style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, background: '#FCA5A5', animation: 'pulse 1.5s infinite' }} />
          <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.5px' }}>جشنواره قیمت</span>
          <span style={{ fontSize: 12, opacity: 0.7 }}>— تا پایان جشنواره</span>
        </div>

        {/* RTL countdown: days(right) → seconds(left) */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, direction: 'rtl' }}>
          <Box value={t.days}    label="روز" />
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 22, fontWeight: 300, marginTop: 8, lineHeight: 1 }}>:</span>
          <Box value={t.hours}   label="ساعت" />
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 22, fontWeight: 300, marginTop: 8, lineHeight: 1 }}>:</span>
          <Box value={t.minutes} label="دقیقه" />
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 22, fontWeight: 300, marginTop: 8, lineHeight: 1 }}>:</span>
          <Box value={t.seconds} label="ثانیه" />
        </div>

        <button style={{
          background: '#fff', color: '#B91C1C',
          border: 'none', padding: '7px 18px',
          fontSize: 12, fontWeight: 800, cursor: 'pointer',
          letterSpacing: '0.3px', transition: 'opacity 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          استفاده از تخفیف ←
        </button>
      </div>
    </div>
  );
}
