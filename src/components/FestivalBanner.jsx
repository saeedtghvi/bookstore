import React, { useState, useEffect } from 'react';

// هر ۷ روز یه بار به صورت خودکار ریست میشه
// بر اساس زمان Unix epoch محاسبه میشه - نیازی به ذخیره‌سازی نیست
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function getTimeLeft() {
  const now = Date.now();
  const elapsed = now % SEVEN_DAYS_MS;
  const remaining = SEVEN_DAYS_MS - elapsed;

  const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
  const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((remaining % (60 * 1000)) / 1000);

  return { days, hours, minutes, seconds };
}

const TimeBox = ({ value, label }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px'
  }}>
    <div style={{
      background: 'rgba(255,255,255,0.2)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255,255,255,0.3)',
      borderRadius: '10px',
      width: '52px',
      height: '52px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '22px',
      fontWeight: '800',
      color: 'white',
      fontVariantNumeric: 'tabular-nums'
    }}>
      {String(value).padStart(2, '0')}
    </div>
    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.75)', fontWeight: '500' }}>
      {label}
    </span>
  </div>
);

const Separator = () => (
  <span style={{
    fontSize: '22px',
    fontWeight: '800',
    color: 'rgba(255,255,255,0.6)',
    marginTop: '-10px',
    alignSelf: 'center'
  }}>:</span>
);

const FestivalBanner = () => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%)',
      padding: '16px 24px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle at 10% 50%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 90% 50%, rgba(255,255,255,0.06) 0%, transparent 50%)'
      }} />

      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        flexWrap: 'wrap'
      }}>
        {/* Label */}
        <div style={{ color: 'white' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255,255,255,0.15)',
            padding: '4px 14px',
            borderRadius: '50px',
            marginBottom: '4px'
          }}>
            <span style={{ fontSize: '14px' }}>🎉</span>
            <span style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '1px' }}>جشنواره قیمت</span>
          </div>
          <p style={{ fontSize: '13px', opacity: 0.85 }}>تا پایان جشنواره</p>
        </div>

        {/* Countdown */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <TimeBox value={timeLeft.days} label="روز" />
          <Separator />
          <TimeBox value={timeLeft.hours} label="ساعت" />
          <Separator />
          <TimeBox value={timeLeft.minutes} label="دقیقه" />
          <Separator />
          <TimeBox value={timeLeft.seconds} label="ثانیه" />
        </div>

        {/* CTA */}
        <button style={{
          background: 'white',
          color: '#dc2626',
          border: 'none',
          borderRadius: '50px',
          padding: '10px 24px',
          fontSize: '13px',
          fontWeight: '800',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          transition: 'transform 0.1s',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          استفاده از تخفیف ↓
        </button>
      </div>
    </div>
  );
};

export default FestivalBanner;
