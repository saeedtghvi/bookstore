import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { StarIcon, CartIcon, BookOpenIcon, CheckIcon } from './Icons';

function Stars({ rating }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <div style={{ display: 'flex', color: '#D97706' }}>
        {[1,2,3,4,5].map(i => (
          <StarIcon key={i} size={11} filled={i <= Math.round(rating)} />
        ))}
      </div>
      <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600 }}>{rating}</span>
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
    ? Math.round((1 - book.price / book.originalPrice) * 100) : 0;

  const handleBuy = (e) => {
    e.stopPropagation();
    if (owned) { navigate('/panel'); return; }
    addToCart(book);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  if (variant === 'list') return (
    <div onClick={() => navigate(`/book/${book.id}`)}
      style={{
        display: 'flex', gap: 14, background: 'var(--surface)', cursor: 'pointer',
        border: '1.5px solid var(--border)', padding: 14, transition: 'border-color 0.15s, box-shadow 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '3px 3px 0 var(--primary-light)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div style={{ width: 60, height: 80, flexShrink: 0, background: 'var(--primary-light)', overflow: 'hidden' }}>
        {!imgErr ? <img src={book.cover} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setImgErr(true)} />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}><BookOpenIcon size={24} /></div>
        }
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }} className="clamp-1">{book.title}</p>
        <p style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600, marginBottom: 6 }}>{book.author}</p>
        <Stars rating={book.rating} />
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 800, fontSize: 14 }}>{book.price.toLocaleString('fa-IR')} ت</span>
          {discount > 0 && <span style={{ fontSize: 10, color: 'var(--red)', background: '#FEE2E2', padding: '1px 5px', fontWeight: 700 }}>%{discount}</span>}
        </div>
      </div>
    </div>
  );

  return (
    <div onClick={() => navigate(`/book/${book.id}`)}
      style={{
        background: 'var(--surface)', cursor: 'pointer',
        border: '1.5px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        transition: 'border-color 0.15s, box-shadow 0.15s, transform 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '4px 4px 0 var(--primary-light)'; e.currentTarget.style.transform = 'translate(-2px,-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
    >
      {/* Cover */}
      <div style={{ position: 'relative', paddingTop: '145%', background: 'var(--primary-light)', overflow: 'hidden' }}>
        {!imgErr
          ? <img src={book.cover} alt={book.title} onError={() => setImgErr(true)}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--primary)' }}>
              <BookOpenIcon size={36} />
              <span style={{ fontSize: 11, fontWeight: 600, padding: '0 12px', textAlign: 'center' }} className="clamp-2">{book.title}</span>
            </div>
        }
        {/* Category */}
        <span style={{
          position: 'absolute', top: 0, right: 0,
          background: 'var(--dark)', color: '#fff',
          padding: '4px 8px', fontSize: 10, fontWeight: 700,
        }}>{book.category}</span>
        {/* Discount */}
        {discount > 0 && (
          <span style={{
            position: 'absolute', top: 0, left: 0,
            background: 'var(--red)', color: '#fff',
            padding: '4px 8px', fontSize: 10, fontWeight: 800,
          }}>−{discount}%</span>
        )}
        {/* Owned */}
        {owned && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'var(--primary)', color: '#fff',
            padding: '6px 10px', fontSize: 11, fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <CheckIcon size={12} /> خریداری شده
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '12px 13px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
        <p style={{ fontSize: 14, fontWeight: 800, lineHeight: 1.4 }} className="clamp-2">{book.title}</p>
        <p style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600 }}>{book.author}</p>
        <Stars rating={book.rating} />
        <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.7, flex: 1 }} className="clamp-2">
          {book.shortDescription}
        </p>
        {/* Price + Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6, gap: 8 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--text)' }}>
              {book.price.toLocaleString('fa-IR')}
              <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-3)', marginRight: 3 }}>ت</span>
            </div>
            {book.originalPrice && (
              <div style={{ fontSize: 10, color: 'var(--text-3)', textDecoration: 'line-through' }}>
                {book.originalPrice.toLocaleString('fa-IR')}
              </div>
            )}
          </div>
          <button onClick={handleBuy} style={{
            background: owned ? 'var(--primary)' : (added ? 'var(--green)' : 'var(--dark)'),
            color: '#fff', border: 'none',
            padding: '7px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
            transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: 5,
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => { if (!owned && !added) e.currentTarget.style.background = 'var(--primary)'; }}
          onMouseLeave={e => { if (!owned && !added) e.currentTarget.style.background = 'var(--dark)'; }}
          >
            {owned ? <><BookOpenIcon size={13} /> مطالعه</> : added ? <><CheckIcon size={13} /> افزوده شد</> : <><CartIcon size={13} /> خرید</>}
          </button>
        </div>
      </div>
    </div>
  );
}
