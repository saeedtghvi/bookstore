import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CartIcon, XIcon, PlusIcon, MinusIcon, TrashIcon, TagIcon, CheckIcon } from './Icons';

export default function Cart() {
  const {
    cart, cartOpen, setCartOpen,
    removeFromCart, updateQty, cartTotal, purchase, user,
    appliedDiscount, applyDiscount, removeDiscount, discountAmount, finalTotal,
  } = useApp();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [codeSuccess, setCodeSuccess] = useState('');

  if (!cartOpen) return null;

  const handleCheckout = () => {
    if (!user) { setCartOpen(false); navigate('/login'); return; }
    purchase(cart.map(i => i.id));
    setCartOpen(false);
    setCode('');
    setCodeError('');
    setCodeSuccess('');
    navigate('/panel');
  };

  const handleApplyCode = () => {
    if (!code.trim()) return;
    const res = applyDiscount(code.trim());
    if (res.ok) {
      setCodeSuccess(`کد اعمال شد — ${res.pct}٪ تخفیف`);
      setCodeError('');
    } else {
      setCodeError(res.error);
      setCodeSuccess('');
    }
  };

  return (
    <>
      <div onClick={() => setCartOpen(false)} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 200,
        animation: 'fadeInFast 0.2s ease forwards',
      }} />
      <div style={{
        position: 'fixed', top: 0, left: 0, height: '100vh',
        width: 390, maxWidth: '94vw', background: 'var(--surface)',
        zIndex: 201, display: 'flex', flexDirection: 'column',
        borderRight: '2px solid var(--dark)',
        boxShadow: '8px 0 0 var(--dark)',
        animation: 'slideRight 0.25s cubic-bezier(0.25,0.46,0.45,0.94) forwards',
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 20px', borderBottom: '1.5px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--surface)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ background: 'var(--primary)', color: '#fff', padding: '6px 8px', display: 'flex' }}>
              <CartIcon size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>سبد خرید</h2>
              <p style={{ fontSize: 12, color: 'var(--text-3)' }}>{cart.length} کتاب</p>
            </div>
          </div>
          <button onClick={() => setCartOpen(false)} style={{
            background: 'transparent', border: '1.5px solid var(--border)',
            width: 34, height: 34, cursor: 'pointer',
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
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 220, gap: 14, color: 'var(--text-3)' }}>
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
                <div style={{ width: 48, height: 64, flexShrink: 0, background: 'var(--primary-light)', overflow: 'hidden' }}>
                  <img src={item.cover} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => e.target.style.display = 'none'} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }} className="clamp-1">{item.title}</p>
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
                    <span style={{ fontSize: 13, fontWeight: 800, minWidth: 24, textAlign: 'center', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)', height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text)' }}>{item.qty}</span>
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
          <div style={{ padding: 20, borderTop: '1.5px solid var(--border)', background: 'var(--surface)' }}>
            {/* Discount code */}
            <div style={{ marginBottom: 14 }}>
              {appliedDiscount ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', background: '#F0FDF4', border: '1px solid #86EFAC' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#15803D', fontWeight: 700 }}>
                    <TagIcon size={14} />
                    کد <span style={{ background: '#DCF8E7', padding: '2px 8px' }}>{appliedDiscount.code}</span> — {appliedDiscount.pct}٪ تخفیف
                  </div>
                  <button onClick={removeDiscount} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: 12 }}>حذف</button>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', gap: 0, alignItems: 'stretch' }}>
                    <input
                      value={code} onChange={e => setCode(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleApplyCode()}
                      placeholder="کد تخفیف دارید؟"
                      style={{ flex: 1, padding: '9px 12px', border: '1.5px solid var(--border)', borderLeft: 'none', fontSize: 13, background: 'var(--bg)', color: 'var(--text)', outline: 'none', direction: 'ltr', textAlign: 'right' }}
                    />
                    <button onClick={handleApplyCode} style={{
                      background: 'var(--dark)', color: '#fff', border: 'none',
                      padding: '9px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 5,
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--primary)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--dark)'}
                    >
                      <TagIcon size={13} /> اعمال
                    </button>
                  </div>
                  {codeError && <p style={{ fontSize: 12, color: 'var(--red)', marginTop: 5 }}>{codeError}</p>}
                  {codeSuccess && <p style={{ fontSize: 12, color: 'var(--green)', marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}><CheckIcon size={12} /> {codeSuccess}</p>}
                </div>
              )}
            </div>

            {/* Totals */}
            <div style={{ padding: '10px 12px', background: 'var(--bg)', border: '1px solid var(--border)', marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: appliedDiscount ? 6 : 0 }}>
                <span style={{ color: 'var(--text-2)', fontSize: 13 }}>جمع کل</span>
                <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{cartTotal.toLocaleString('fa-IR')} تومان</span>
              </div>
              {appliedDiscount && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ color: 'var(--green)', fontSize: 13 }}>تخفیف ({appliedDiscount.pct}٪)</span>
                    <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--green)' }}>−{discountAmount.toLocaleString('fa-IR')} تومان</span>
                  </div>
                  <div style={{ height: 1, background: 'var(--border)', margin: '6px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text)', fontSize: 14, fontWeight: 700 }}>قابل پرداخت</span>
                    <span style={{ fontWeight: 900, fontSize: 17, color: 'var(--primary)' }}>{finalTotal.toLocaleString('fa-IR')} تومان</span>
                  </div>
                </>
              )}
              {!appliedDiscount && (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <span style={{ fontWeight: 900, fontSize: 17, color: 'var(--text)' }}>{cartTotal.toLocaleString('fa-IR')} تومان</span>
                </div>
              )}
            </div>

            <button onClick={handleCheckout} style={{
              width: '100%', background: 'var(--dark)', color: '#fff',
              border: 'none', padding: '14px',
              fontSize: 14, fontWeight: 800, cursor: 'pointer', transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--primary)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--dark)'}
            >
              {user ? 'تکمیل خرید ←' : 'ورود و خرید ←'}
            </button>

            <p style={{ fontSize: 11, color: 'var(--text-3)', textAlign: 'center', marginTop: 10 }}>
              کدهای تخفیف: BOOK20 | READ10 | HELLO15
            </p>
          </div>
        )}
      </div>
    </>
  );
}
