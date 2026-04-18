import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CartIcon, UserIcon, BookOpenIcon, SettingsIcon, LogOutIcon, SunIcon, MoonIcon } from './Icons';

export default function Navbar() {
  const { user, logout, cartCount, setCartOpen, darkMode, setDarkMode } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { to: '/', label: 'خانه' },
    { to: '/blog', label: 'بلاگ' },
  ];
  const isActive = (p) => location.pathname === p;

  return (
    <nav style={{
      background: 'var(--nav-bg)',
      borderBottom: '2px solid var(--dark)',
      position: 'sticky', top: 0, zIndex: 90,
      transition: 'background 0.3s',
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '0 24px',
        height: 60, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 16,
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{ background: 'var(--primary)', padding: '6px 8px', display: 'flex', alignItems: 'center' }}>
            <BookOpenIcon size={18} />
          </div>
          <span style={{ fontSize: 17, fontWeight: 900, color: 'var(--text)', letterSpacing: -0.3 }}>
            کتاب‌خانه
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hide-mobile" style={{ display: 'flex', gap: 0 }}>
          {links.map(l => (
            <Link key={l.to} to={l.to} style={{
              padding: '6px 16px',
              fontSize: 14, fontWeight: 600,
              color: isActive(l.to) ? '#fff' : 'var(--text-2)',
              background: isActive(l.to) ? 'var(--primary)' : 'transparent',
              transition: 'all 0.15s',
              display: 'inline-block',
            }}
            onMouseEnter={e => { if (!isActive(l.to)) e.currentTarget.style.color = 'var(--primary)'; }}
            onMouseLeave={e => { if (!isActive(l.to)) e.currentTarget.style.color = 'var(--text-2)'; }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Dark mode toggle */}
          <button onClick={() => setDarkMode(d => !d)} style={{
            background: 'transparent', border: '1.5px solid var(--border)',
            width: 36, height: 36, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-2)', transition: 'all 0.15s',
          }}
          title={darkMode ? 'حالت روشن' : 'حالت تاریک'}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-2)'; }}
          >
            {darkMode ? <SunIcon size={16} /> : <MoonIcon size={16} />}
          </button>

          {/* Cart */}
          <button onClick={() => setCartOpen(true)} style={{
            position: 'relative', background: 'transparent',
            border: '1.5px solid var(--border)', padding: '7px 14px',
            display: 'flex', alignItems: 'center', gap: 7,
            fontSize: 13, fontWeight: 600, color: 'var(--text)',
            cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text)'; }}
          >
            <CartIcon size={17} />
            <span className="hide-mobile">سبد خرید</span>
            {cartCount > 0 && (
              <span style={{
                background: 'var(--red)', color: '#fff',
                width: 18, height: 18, fontSize: 10, fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{cartCount}</span>
            )}
          </button>

          {/* Auth */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button onClick={() => setMenuOpen(p => !p)} style={{
                background: 'var(--dark)', color: '#fff', border: 'none',
                padding: '8px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 7, transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--primary)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--dark)'}
              >
                <UserIcon size={15} />
                <span className="hide-mobile">{user.name.split(' ')[0]}</span>
              </button>
              {menuOpen && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 98 }} onClick={() => setMenuOpen(false)} />
                  <div style={{
                    position: 'absolute', top: 44, left: 0,
                    background: 'var(--surface)', border: '1.5px solid var(--dark)',
                    boxShadow: '4px 4px 0 var(--dark)',
                    padding: 6, minWidth: 170, zIndex: 99,
                  }}>
                    {user.role === 'admin' ? (
                      <MenuItem to="/admin" icon={<SettingsIcon size={15} />} label="پنل مدیریت" onClick={() => setMenuOpen(false)} />
                    ) : (
                      <MenuItem to="/panel" icon={<BookOpenIcon size={15} />} label="کتابخانه من" onClick={() => setMenuOpen(false)} />
                    )}
                    <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
                    <button onClick={() => { logout(); setMenuOpen(false); navigate('/'); }} style={{
                      width: '100%', padding: '9px 12px', background: 'none', border: 'none',
                      cursor: 'pointer', fontSize: 13, color: 'var(--red)', fontWeight: 600,
                      display: 'flex', alignItems: 'center', gap: 8, direction: 'rtl',
                    }}>
                      <LogOutIcon size={15} /> خروج
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link to="/login" style={{
              background: 'var(--dark)', color: '#fff',
              padding: '8px 20px', fontSize: 13, fontWeight: 700,
              transition: 'background 0.15s', display: 'inline-block',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--primary)'}
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
      padding: '9px 12px', fontSize: 13,
      fontWeight: 600, color: 'var(--text)', transition: 'background 0.12s',
    }}
    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      {icon} {label}
    </Link>
  );
}
