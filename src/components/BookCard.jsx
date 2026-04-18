import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

function Stars({ rating }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <span style={{ color: '#D97706', fontSize: 13 }}>
        {'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}
      </span>
      <span style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 500 }}>{rating}</span>
    </div>
  );
}

export default function BookCard({ book, variant = 'default' }) {
  const navigate = useNavigate();
  const { addToCart, hasPurchased } = useApp();
  const [imgErr, setImgErr] = useState(false);
  const [added, setAdded] = useState(false);

  const owned = hasPurchased(book.id);
  const discount = book.originalPrice
    ? Math.round((1 - book.price / book.originalPrice) * 100)
    : 0;

  const handleBuy = (e) => {
    e.stopPropagation();
    if (owned) { navigate('/panel'); return; }
    addToCart(book);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  if (variant === 'list') return (
    <div onClick={() => navigate(`/book/${book.id}`)}
      className="hover-lift"
      style={{
        display: 'flex', gap: 16, background: 'var(--surface)',
        borderRadius: 'var(--r-lg)', padding: 16, cursor: 'pointer',
        border: '1px solid var(--border)',
      }}>
      {/* Cover */}
      <div style={{
        width: 72, height: 96, borderRadius: 'var(--r-sm)', flexShrink: 0,
        overflow: 'hidden', background: 'var(--purple-light)',
      }}>
        {!imgErr
          ? <img src={book.cover} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setImgErr(true)} />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>📖</div>
        }
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }} className="clamp-1">{book.title}</p>
        <p style={{ fontSize: 13, color: 'var(--purple)', fontWeight: 500, marginBottom: 6 }}>{book.author}</p>
        <Stars rating={book.rating} />
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 800, fontSize: 15 }}>{book.price.toLocaleString('fa-IR')} ت</span>
          {discount > 0 && <span style={{ fontSize: 11, color: 'var(--red)', background: '#FEE2E2', padding: '1px 6px', borderRadius: 4 }}>%{discount}</span>}
        </div>
      </div>
    </div>
  );

  return (
    <div onClick={() => navigate(`/book/${book.id}`)}
      className="hover-lift"
      style={{
        background: 'var(--surface)', borderRadius: 'var(--r-lg)',
        overflow: 'hidden', cursor: 'pointer',
        border: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        boxShadow: 'var(--shadow-sm)',
      }}>
      {/* Cover */}
      <div style={{ position: 'relative', paddingTop: '140%', background: 'var(--purple-light)', overflow: 'hidden' }}>
        {!imgErr
          ? <img src={book.cover} alt={book.title}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              onError={() => setImgErr(true)} />
          : <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <span style={{ fontSize: 42 }}>📖</span>
              <span style={{ fontSize: 11, color: 'var(--purple)', fontWeight: 600, padding: '0 12px', textAlign: 'center' }} className="clamp-2">{book.title}</span>
            </div>
        }
        {/* Category badge */}
        <span style={{
          position: 'absolute', top: 10, right: 10,
          background: 'rgba(91,33,182,0.88)', backdropFilter: 'blur(4px)',
          color: '#fff', padding: '3px 9px', borderRadius: 'var(--r-pill)', fontSize: 11, fontWeight: 600,
        }}>{book.category}</span>
        {/* Discount badge */}
        {discount > 0 && (
          <span style={{
            position: 'absolute', top: 10, left: 10,
            background: '#DC2626', color: '#fff', padding: '3px 8px',
            borderRadius: 'var(--r-pill)', fontSize: 11, fontWeight: 700,
          }}>%{discount}</span>
        )}
        {/* Owned badge */}
        {owned && (
          <span style={{
            position: 'absolute', bottom: 10, right: 10,
            background: '#059669', color: '#fff', padding: '3px 10px',
            borderRadius: 'var(--r-pill)', fontSize: 11, fontWeight: 700,
          }}>✓ خریداری شده</span>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '14px 14px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <p style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.4 }} className="clamp-2">{book.title}</p>
        <p style={{ fontSize: 12, color: 'var(--purple)', fontWeight: 600 }}>{book.author}</p>
        <Stars rating={book.rating} />
        <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.7, flex: 1 }} className="clamp-2">
          {book.shortDescription}
        </p>
        {/* Price + Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800 }}>{book.price.toLocaleString('fa-IR')} <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-3)' }}>تومان</span></div>
            {book.originalPrice && <div style={{ fontSize: 11, color: 'var(--text-3)', textDecoration: 'line-through' }}>{book.originalPrice.toLocaleString('fa-IR')}</div>}
          </div>
          <button onClick={handleBuy} style={{
            background: owned ? '#059669' : (added ? '#059669' : 'var(--purple)'),
            color: '#fff', border: 'none', borderRadius: 'var(--r-pill)',
            padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
            transition: 'background 0.3s', display: 'flex', alignItems: 'center', gap: 5,
          }}>
            {owned ? '📖 مطالعه' : added ? '✓ افزوده شد' : '+ سبد خرید'}
          </button>
        </div>
      </div>
    </div>
  );
}
