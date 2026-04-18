import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookCard from '../components/BookCard';
import { useApp } from '../context/AppContext';

function Stars({ rating, count }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ color: '#D97706', fontSize: 16 }}>{'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}</span>
      <span style={{ fontSize: 14, fontWeight: 700 }}>{rating}</span>
      <span style={{ fontSize: 13, color: 'var(--text-3)' }}>({count?.toLocaleString('fa-IR')} نظر)</span>
    </div>
  );
}

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { books, addToCart, hasPurchased, user } = useApp();
  const [tab, setTab] = useState('about');
  const [added, setAdded] = useState(false);

  const book = books.find(b => b.id === Number(id));
  if (!book) return <div style={{ textAlign: 'center', padding: 80 }}><p>کتاب یافت نشد</p></div>;

  const owned = hasPurchased(book.id);
  const discount = book.originalPrice ? Math.round((1 - book.price / book.originalPrice) * 100) : 0;
  const related = books.filter(b => b.category === book.category && b.id !== book.id).slice(0, 4);

  const handleBuy = () => {
    if (owned) { navigate('/panel'); return; }
    addToCart(book);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1, direction: 'rtl', background: 'var(--bg)' }}>
        {/* Breadcrumb */}
        <div style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '10px 24px' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', fontSize: 13, color: 'var(--text-3)', display: 'flex', gap: 8, alignItems: 'center' }}>
            <span onClick={() => navigate('/')} style={{ cursor: 'pointer', color: 'var(--purple)' }}>خانه</span>
            <span>›</span>
            <span>{book.category}</span>
            <span>›</span>
            <span style={{ color: 'var(--text-2)' }}>{book.title}</span>
          </div>
        </div>

        {/* Main info */}
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 48, alignItems: 'start' }}>
            {/* Cover */}
            <div style={{ position: 'sticky', top: 80 }}>
              <div style={{
                width: 220, borderRadius: 'var(--r-lg)', overflow: 'hidden',
                boxShadow: '0 12px 48px rgba(0,0,0,0.18)', background: 'var(--purple-light)',
              }}>
                <img src={book.cover} alt={book.title} style={{ width: '100%', display: 'block' }} onError={e => { e.target.style.display = 'none'; }} />
              </div>
              {discount > 0 && (
                <div style={{ textAlign: 'center', marginTop: 10, background: '#FEF3C7', color: 'var(--gold)', padding: '6px 12px', borderRadius: 'var(--r-pill)', fontSize: 13, fontWeight: 700 }}>
                  {discount}٪ تخفیف جشنواره
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <span style={{ display: 'inline-block', background: 'var(--purple-light)', color: 'var(--purple)', padding: '3px 12px', borderRadius: 'var(--r-pill)', fontSize: 12, fontWeight: 600, marginBottom: 12 }}>
                {book.category}
              </span>
              <h1 style={{ fontSize: 'clamp(22px,4vw,34px)', fontWeight: 900, lineHeight: 1.2, marginBottom: 8 }}>{book.title}</h1>
              <p style={{ fontSize: 16, color: 'var(--purple)', fontWeight: 600, marginBottom: 4 }}>نوشته: {book.author}</p>
              {book.translator && <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 12 }}>ترجمه: {book.translator}</p>}
              <Stars rating={book.rating} count={book.reviewCount} />

              {/* Meta */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, margin: '20px 0', padding: '16px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                {[
                  ['📄', `${book.pageCount} صفحه`],
                  ['📅', `${book.publishYear}`],
                  ['🏠', book.publisher],
                  ['🌐', book.language],
                ].map(([icon, val]) => (
                  <div key={val} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--text-2)' }}>
                    <span>{icon}</span><span>{val}</span>
                  </div>
                ))}
              </div>

              <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 2, marginBottom: 24 }}>{book.shortDescription}</p>

              {/* Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 28 }}>
                {book.tags?.map(t => (
                  <span key={t} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--r-pill)', padding: '3px 12px', fontSize: 12, color: 'var(--text-2)' }}>#{t}</span>
                ))}
              </div>

              {/* Price + Buy */}
              <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 900 }}>
                    {book.price.toLocaleString('fa-IR')} <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-3)' }}>تومان</span>
                  </div>
                  {book.originalPrice && (
                    <div style={{ fontSize: 13, color: 'var(--text-3)', textDecoration: 'line-through' }}>{book.originalPrice.toLocaleString('fa-IR')} تومان</div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button onClick={handleBuy} style={{
                    background: owned ? '#059669' : 'var(--purple)', color: '#fff',
                    border: 'none', borderRadius: 'var(--r-pill)', padding: '12px 28px',
                    fontSize: 15, fontWeight: 700, cursor: 'pointer',
                  }}>
                    {owned ? '📖 مطالعه در پنل' : added ? '✓ به سبد اضافه شد' : '🛒 افزودن به سبد'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ marginTop: 48 }}>
            <div style={{ display: 'flex', gap: 4, borderBottom: '2px solid var(--border)', marginBottom: 28 }}>
              {[['about', 'درباره کتاب'], ['sample', 'نمونه رایگان']].map(([key, label]) => (
                <button key={key} onClick={() => setTab(key)} style={{
                  padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 14, fontWeight: 700, color: tab === key ? 'var(--purple)' : 'var(--text-3)',
                  borderBottom: `2px solid ${tab === key ? 'var(--purple)' : 'transparent'}`,
                  marginBottom: -2, transition: 'all 0.2s',
                }}>{label}</button>
              ))}
            </div>

            {tab === 'about' && (
              <div style={{ maxWidth: 720 }}>
                {book.description?.split('\n\n').map((p, i) => (
                  <p key={i} style={{ fontSize: 15, lineHeight: 2.1, color: 'var(--text-2)', marginBottom: 16 }}>{p}</p>
                ))}
              </div>
            )}

            {tab === 'sample' && book.sampleContent && (
              <div style={{ maxWidth: 720, background: '#fff', borderRadius: 'var(--r-xl)', border: '1px solid var(--border)', overflow: 'hidden' }}>
                <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)' }}>📖 نمونه رایگان — {book.title}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-3)' }}>برای خواندن کامل کتاب را خریداری کنید</span>
                </div>
                <div dangerouslySetInnerHTML={{ __html: book.sampleContent }} />
              </div>
            )}
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div style={{ marginTop: 56 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20 }}>کتاب‌های مشابه</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 20 }}>
                {related.map(b => <BookCard key={b.id} book={b} />)}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
