import React from 'react';

const Navbar = ({ cartCount, onCartClick, searchQuery, onSearchChange }) => {
  return (
    <nav style={{
      background: 'white',
      borderBottom: '1px solid #e5e7eb',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 12px rgba(124,58,237,0.08)'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <span style={{ fontSize: '28px' }}>📚</span>
          <div>
            <span style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#7c3aed',
              letterSpacing: '-0.5px'
            }}>
              کتاب‌خانه
            </span>
            <span style={{
              fontSize: '11px',
              color: '#9ca3af',
              display: 'block',
              marginTop: '-2px'
            }}>
              بهترین کتاب‌ها برای شما
            </span>
          </div>
        </div>

        {/* Search */}
        <div style={{
          flex: 1,
          maxWidth: '480px',
          position: 'relative'
        }}>
          <span style={{
            position: 'absolute',
            right: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '18px',
            color: '#9ca3af',
            pointerEvents: 'none'
          }}>🔍</span>
          <input
            type="text"
            placeholder="جستجو در کتاب‌ها..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 48px 10px 16px',
              border: '2px solid #e5e7eb',
              borderRadius: '50px',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s',
              background: '#f9fafb',
              direction: 'rtl'
            }}
            onFocus={(e) => e.target.style.borderColor = '#7c3aed'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>

        {/* Cart Button */}
        <button
          onClick={onCartClick}
          style={{
            position: 'relative',
            background: '#7c3aed',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            transition: 'background 0.2s, transform 0.1s',
            flexShrink: 0
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#5b21b6'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#7c3aed'}
        >
          <span style={{ fontSize: '18px' }}>🛒</span>
          <span>سبد خرید</span>
          {cartCount > 0 && (
            <span style={{
              background: '#f59e0b',
              color: 'white',
              borderRadius: '50%',
              width: '22px',
              height: '22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: '700'
            }}>
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
