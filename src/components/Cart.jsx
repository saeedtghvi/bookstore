import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Cart() {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateQty, cartTotal, purchase, user } = useApp();
  const navigate = useNavigate();

  if (!cartOpen) return null;

  const handleCheckout = () => {
    if (!user) { setCartOpen(false); navigate('/login'); return; }
    const ids = cart.map(i => i.id);
    purchase(ids);
    setCartOpen(false);
    navigate('/panel');
  };

  return (
    <>
      <div onClick={() => setCartOpen(false)} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
        backdropFilter: 'blur(2px)', zIndex: 200,
      }} />
      <div className="slide-right" style={{
        position: 'fixed', top: 0, left: 0, height: '100vh',
        width: 380, maxWidth: '92vw', background: 'var(--surface)',
        zIndex: 201, display: 'flex', flexDirection: 'column',
        boxShadow: '-4px 0 40px rgba(0,0,0,0.18)',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>🛒</span>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 700 }}>سبد خرید</h2>
              <p style={{ fontSize: 12, color: 'var(--text-3)' }}>{cart.length} کتاب</p>
            </div>
          </div>
          <button onClick={() => setCartOpen(false)} style={{
            background: 'var(--bg)', border: 'none', borderRadius: '50%',
            width: 34, height: 34, fontSize: 20, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-2)',
          }}>×</button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
          {cart.length === 0
            ? <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 200, gap: 12, color: 'var(--text-3)' }}>
                <span style={{ fontSize: 48 }}>📭</span>
                <p style={{ fontSize: 14 }}>سبد خرید خالی است</p>
              </div>
            : cart.map(item => (
              <div key={item.id} style={{
                display: 'flex', gap: 12, padding: 12,
                background: 'var(--bg)', borderRadius: 'var(--r-md)', marginBottom: 8, alignItems: 'center',
              }}>
                <div style={{ width: 48, height: 64, borderRadius: 6, overflow: 'hidden', flexShrink: 0, background: 'var(--purple-light)' }}>
                  <img src={item.cover} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 700 }} className="clamp-1">{item.title}</p>
                  <p style={{ fontSize: 11, color: 'var(--purple)', marginTop: 2 }}>{item.author}</p>
                  <p style={{ fontSize: 13, fontWeight: 700, marginTop: 6 }}>{(item.price * item.qty).toLocaleString('fa-IR')} ت</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <button onClick={() => updateQty(item.id, item.qty + 1)} style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--purple-light)', border: 'none', cursor: 'pointer', color: 'var(--purple)', fontWeight: 700 }}>+</button>
                    <span style={{ fontSize: 13, fontWeight: 700, minWidth: 18, textAlign: 'center' }}>{item.qty}</span>
                    <button onClick={() => item.qty > 1 ? updateQty(item.id, item.qty - 1) : removeFromCart(item.id)} style={{ width: 24, height: 24, borderRadius: '50%', background: '#FEE2E2', border: 'none', cursor: 'pointer', color: 'var(--red)', fontWeight: 700 }}>−</button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: 'var(--text-3)' }}>حذف</button>
                </div>
              </div>
            ))
          }
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ padding: 20, borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{ color: 'var(--text-2)', fontSize: 14 }}>جمع کل:</span>
              <span style={{ fontWeight: 800, fontSize: 17 }}>{cartTotal.toLocaleString('fa-IR')} تومان</span>
            </div>
            <button onClick={handleCheckout} style={{
              width: '100%', background: 'var(--purple)', color: '#fff',
              border: 'none', borderRadius: 'var(--r-pill)', padding: '13px',
              fontSize: 15, fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--purple-2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--purple)'}
            >
              {user ? 'تکمیل خرید ←' : 'ورود و خرید ←'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
