import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { user, logout, cartCount, setCartOpen } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { to: '/', label: 'خانه' },
    { to: '/blog', label: 'بلاگ' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      background: '#fff',
      borderBottom: '1px solid var(--border)',
      position: 'sticky', top: 0, zIndex: 90,
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '0 24px',
        height: 64, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 16,
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <span style={{ fontSize: 28 }}>📚</span>
          <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--purple)', letterSpacing: -0.5 }}>
            کتاب‌خانه
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hide-mobile" style={{ display: 'flex', gap: 4 }}>
          {links.map(l => (
            <Link key={l.to} to={l.to} style={{
              padding: '6px 16px', borderRadius: 'var(--r-pill)',
              fontSize: 14, fontWeight: 600,
              color: isActive(l.to) ? 'var(--purple)' : 'var(--text-2)',
              background: isActive(l.to) ? 'var(--purple-light)' : 'transparent',
              transition: 'all 0.2s',
            }}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Cart */}
          <button onClick={() => setCartOpen(true)} style={{
            position: 'relative', background: 'var(--purple-light)',
            border: 'none', borderRadius: 'var(--r-pill)',
            padding: '8px 16px', display: 'flex', alignItems: 'center',
            gap: 6, fontSize: 14, fontWeight: 600, color: 'var(--purple)',
            cursor: 'pointer', transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#DDD6FE'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--purple-light)'}
          >
            <span style={{ fontSize: 18 }}>🛒</span>
            <span className="hide-mobile">سبد</span>
            {cartCount > 0 && (
              <span style={{
                background: 'var(--red)', color: '#fff', borderRadius: '50%',
                width: 20, height: 20, fontSize: 11, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{cartCount}</span>
            )}
          </button>

          {/* Auth */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button onClick={() => setMenuOpen(p => !p)} style={{
                background: 'var(--dark)', color: '#fff', border: 'none',
                borderRadius: 'var(--r-pill)', padding: '8px 16px',
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span>👤</span>
                <span className="hide-mobile">{user.name}</span>
              </button>
              {menuOpen && (
                <div style={{
                  position: 'absolute', top: 44, left: 0,
                  background: '#fff', borderRadius: 'var(--r-lg)',
                  boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)',
                  padding: 8, minWidth: 160, zIndex: 100,
                }}>
                  {user.role === 'admin' ? (
                    <MenuItem to="/admin" icon="⚙️" label="پنل مدیریت" onClick={() => setMenuOpen(false)} />
                  ) : (
                    <MenuItem to="/panel" icon="📖" label="کتابخانه من" onClick={() => setMenuOpen(false)} />
                  )}
                  <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
                  <button onClick={() => { logout(); setMenuOpen(false); navigate('/'); }} style={{
                    width: '100%', padding: '10px 12px', background: 'none', border: 'none',
                    cursor: 'pointer', fontSize: 14, color: 'var(--red)', fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: 8, borderRadius: 'var(--r-sm)',
                  }}>
                    <span>🚪</span> خروج
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" style={{
              background: 'var(--dark)', color: '#fff',
              padding: '8px 20px', borderRadius: 'var(--r-pill)',
              fontSize: 13, fontWeight: 700, transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--purple)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--dark)'}
            >
              ورود
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

function MenuItem({ to, icon, label, onClick }) {
  return (
    <Link to={to} onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '10px 12px', borderRadius: 'var(--r-sm)', fontSize: 14,
      fontWeight: 600, color: 'var(--text)', transition: 'background 0.15s',
    }}
    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <span>{icon}</span> {label}
    </Link>
  );
}
