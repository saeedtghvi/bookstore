import React, { useState } from 'react';

const BookCard = ({ book, onAddToCart }) => {
  const [imgError, setImgError] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(book);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const formatPrice = (price) => {
    return price.toLocaleString('fa-IR') + ' تومان';
  };

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - (half ? 1 : 0));
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 2px 16px rgba(124,58,237,0.07)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      display: 'flex',
      flexDirection: 'column',
      cursor: 'default'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 8px 32px rgba(124,58,237,0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 16px rgba(124,58,237,0.07)';
    }}
    >
      {/* Cover */}
      <div style={{
        height: '220px',
        background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
        overflow: 'hidden',
        position: 'relative',
        flexShrink: 0
      }}>
        {!imgError ? (
          <img
            src={book.cover}
            alt={book.title}
            onError={() => setImgError(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '48px' }}>📖</span>
            <span style={{ fontSize: '12px', color: '#7c3aed', fontWeight: '600' }}>{book.title}</span>
          </div>
        )}
        {/* Category badge */}
        <span style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'rgba(124,58,237,0.9)',
          color: 'white',
          padding: '4px 10px',
          borderRadius: '50px',
          fontSize: '11px',
          fontWeight: '600',
          backdropFilter: 'blur(4px)'
        }}>
          {book.category}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: '700',
          color: '#1e1b4b',
          marginBottom: '4px',
          lineHeight: '1.4'
        }}>
          {book.title}
        </h3>
        <p style={{
          fontSize: '13px',
          color: '#7c3aed',
          fontWeight: '500',
          marginBottom: '8px'
        }}>
          {book.author}
        </p>

        {/* Rating */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '10px'
        }}>
          <span style={{ color: '#f59e0b', fontSize: '13px', letterSpacing: '1px' }}>
            {'★'.repeat(Math.floor(book.rating))}{'☆'.repeat(5 - Math.floor(book.rating))}
          </span>
          <span style={{ fontSize: '12px', color: '#9ca3af' }}>{book.rating}</span>
        </div>

        <p style={{
          fontSize: '12px',
          color: '#6b7280',
          lineHeight: '1.7',
          marginBottom: '16px',
          flex: 1,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {book.description}
        </p>

        {/* Price + Button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'auto'
        }}>
          <div>
            <span style={{
              fontSize: '17px',
              fontWeight: '700',
              color: '#1e1b4b'
            }}>
              {formatPrice(book.price)}
            </span>
          </div>
          <button
            onClick={handleAdd}
            style={{
              background: added ? '#10b981' : '#7c3aed',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              padding: '8px 18px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>{added ? '✓' : '+'}</span>
            <span>{added ? 'افزوده شد' : 'سبد خرید'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
