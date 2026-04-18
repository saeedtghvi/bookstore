import React from 'react';

const Cart = ({ isOpen, onClose, items, onRemove, onUpdateQty }) => {
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const formatPrice = (price) => price.toLocaleString('fa-IR') + ' تومان';

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
          zIndex: 200,
          backdropFilter: 'blur(2px)'
        }}
      />

      {/* Sidebar */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        height: '100vh',
        width: '380px',
        maxWidth: '90vw',
        background: 'white',
        zIndex: 201,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.15)',
        animation: 'slideIn 0.25s ease'
      }}>
        <style>{`
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `}</style>

        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>🛒</span>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1e1b4b' }}>سبد خرید</h2>
              <p style={{ fontSize: '12px', color: '#9ca3af' }}>{items.length} کتاب انتخاب شده</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#f3f4f6',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              fontSize: '18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6b7280'
            }}
          >
            ×
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {items.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '200px',
              gap: '16px',
              color: '#9ca3af'
            }}>
              <span style={{ fontSize: '48px' }}>📭</span>
              <p style={{ fontSize: '15px' }}>سبد خرید شما خالی است</p>
            </div>
          ) : (
            items.map(item => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  gap: '12px',
                  padding: '14px',
                  background: '#f9fafb',
                  borderRadius: '12px',
                  marginBottom: '10px',
                  alignItems: 'center'
                }}
              >
                {/* Cover mini */}
                <div style={{
                  width: '50px',
                  height: '64px',
                  background: 'linear-gradient(135deg, #ede9fe, #ddd6fe)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  overflow: 'hidden'
                }}>
                  <img
                    src={item.cover}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#1e1b4b',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {item.title}
                  </p>
                  <p style={{ fontSize: '11px', color: '#7c3aed', marginTop: '2px' }}>{item.author}</p>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: '#1e1b4b', marginTop: '6px' }}>
                    {formatPrice(item.price * item.qty)}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  {/* Qty controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      onClick={() => onUpdateQty(item.id, item.qty + 1)}
                      style={{
                        width: '26px', height: '26px', borderRadius: '50%',
                        background: '#ede9fe', border: 'none', cursor: 'pointer',
                        color: '#7c3aed', fontWeight: '700', fontSize: '16px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                    >+</button>
                    <span style={{ fontSize: '14px', fontWeight: '700', minWidth: '20px', textAlign: 'center' }}>
                      {item.qty}
                    </span>
                    <button
                      onClick={() => item.qty > 1 ? onUpdateQty(item.id, item.qty - 1) : onRemove(item.id)}
                      style={{
                        width: '26px', height: '26px', borderRadius: '50%',
                        background: '#fee2e2', border: 'none', cursor: 'pointer',
                        color: '#ef4444', fontWeight: '700', fontSize: '16px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                    >−</button>
                  </div>
                  <button
                    onClick={() => onRemove(item.id)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#d1d5db', fontSize: '11px'
                    }}
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{
            padding: '20px 24px',
            borderTop: '1px solid #e5e7eb',
            background: 'white'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <span style={{ color: '#6b7280', fontSize: '14px' }}>جمع کل:</span>
              <span style={{ fontWeight: '800', fontSize: '18px', color: '#1e1b4b' }}>
                {formatPrice(total)}
              </span>
            </div>
            <button style={{
              width: '100%',
              background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              padding: '14px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              ادامه فرآیند خرید →
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
