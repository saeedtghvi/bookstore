import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CartIcon, XIcon, PlusIcon, MinusIcon, TrashIcon } from './Icons';

export default function Cart() {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateQty, cartTotal, purchase, user } = useApp();
  const navigate = useNavigate();

  if (!cartOpen) return null;

  const handleCheckout = () => {
    if (!user) { setCartOpen(false); navigate('/login'); return; }
    purchase(cart.map(i => i.id));
    setCartOpen(false);
    navigate('/panel');
  };

  return (
    <>
      <div onClick={() => setCartOpen(false)} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        zIndex: 200,
      }} />
      <div style={{
        position: 'fixed', top: 0, left: 0, height: '100vh',
        width: 380, maxWidth: '92vw', background: 'var(--surface)',
        zIndex: 201, display: 'flex', flexDirection: 'column',
        borderRight: '2px solid var(--dark)',
        boxShadow: '8px 0 0 var(--dark)',
        animation: 'slideRight 0.25s cubic-bezier(0.25,0.46,0.45,0.94) forwards',
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 20px', borderBottom: '1.5px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ background: 'var(--primary)', color: '#fff', padding: '6px 8px', display: 'flex' }}>
              <CartIcon size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 800 }}>سبد خرید</h2>
              <p style={{ fontSize: 12, color: 'var(--text-3)' }}>{cart.length} کتاب</p>
            </div>
          </div>
          <button onClick={() => setCartOpen(false)} style={{
            background: 'transparent', border: '1.5px solid var(--border)',
            width: 34, height: 34, fontSize: 18, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-2)', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--dark)'; e.currentTarget.style.background = 'var(--bg)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'transparent'; }}
          >
            <XIcon size={17} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
          {cart.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 200, gap: 14, color: 'var(--text-3)' }}>
              <div style={{ border: '2px dashed var(--border)', padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CartIcon size={36} />
              </div>
              <p style={{ fontSize: 14, fontWeight: 500 }}>سبد خرید خالی است</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} style={{
                display: 'flex', gap: 12, padding: 12, marginBottom: 8,
                border: '1.5px solid var(--border)', background: 'var(--bg)',
                alignItems: 'center',
              }}>
                {/* Cover */}
                <div style={{ width: 48, height: 64, flexShrink: 0, background: 'var(--primary-light)', overflow: 'hidden' }}>
                  <img src={item.cover} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => e.target.style.display = 'none'} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 700 }} className="clamp-1">{item.title}</p>
                  <p style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 600, marginTop: 2 }}>{item.author}</p>
                  <p style={{ fontSize: 13, fontWeight: 800, marginTop: 5, color: 'var(--text)' }}>
                    {(item.price * item.qty).toLocaleString('fa-IR')} تومان
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border)' }}>
                    <button onClick={() => updateQty(item.id, item.qty + 1)} style={{
                      width: 28, height: 28, background: 'transparent', border: 'none',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--text)', transition: 'background 0.12s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-light)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    ><PlusIcon size={13} /></button>
                    <span style={{ fontSize: 13, fontWeight: 800, minWidth: 24, textAlign: 'center', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)', height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.qty}</span>
                    <button onClick={() => item.qty > 1 ? updateQty(item.id, item.qty - 1) : removeFromCart(item.id)} style={{
                      width: 28, height: 28, background: 'transparent', border: 'none',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--text)', transition: 'background 0.12s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    ><MinusIcon size={13} /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 3, fontSize: 11,
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
                  >
                    <TrashIcon size={12} /> حذف
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ padding: 20, borderTop: '1.5px solid var(--dark)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, padding: '10px 12px', background: 'var(--bg)', border: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--text-2)', fontSize: 14, fontWeight: 600 }}>جمع کل</span>
              <span style={{ fontWeight: 900, fontSize: 17 }}>{cartTotal.toLocaleString('fa-IR')} تومان</span>
            </div>
            <button onClick={handleCheckout} style={{
              width: '100%', background: 'var(--dark)', color: '#fff',
              border: 'none', padding: '14px',
              fontSize: 14, fontWeight: 800, cursor: 'pointer', transition: 'background 0.15s',
              letterSpacing: '0.3px',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--primary)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--dark)'}
            >
              {user ? 'تکمیل خرید ←' : 'ورود و خرید ←'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
