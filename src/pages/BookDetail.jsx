import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookCard from '../components/BookCard';
import { useApp } from '../context/AppContext';
import { StarIcon, CartIcon, BookOpenIcon, CheckIcon, ChevronRightIcon } from '../components/Icons';
import { BOOK_CONDITIONS } from '../data/books';

function Stars({ rating, count }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ display: 'flex', color: '#D97706' }}>
        {[1,2,3,4,5].map(i => <StarIcon key={i} size={14} filled={i <= Math.round(rating)} />)}
      </div>
      <span style={{ fontSize: 14, fontWeight: 800 }}>{rating}</span>
      {count && <span style={{ fontSize: 12, color: 'var(--text-3)' }}>({count.toLocaleString('fa-IR')} نظر)</span>}
    </div>
  );
}

function MetaPill({ label, value }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '10px 16px', border: '1px solid var(--border)', minWidth: 80 }}>
      <span style={{ fontSize: 10, color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{value}</span>
    </div>
  );
}

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { books, addToCart, hasPurchased } = useApp();
  const [tab, setTab] = useState('about');
  const [added, setAdded] = useState(false);
  const [imgErr, setImgErr] = useState(false);

  // برای کتاب‌های هر دو نوع — انتخاب بین دیجیتال و چاپی
  const [selectedType, setSelectedType] = useState(null); // null = auto

  const book = books.find(b => b.id === Number(id));
  if (!book) return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, direction: 'rtl' }}>
        <BookOpenIcon size={48} />
        <p style={{ fontSize: 17, fontWeight: 600 }}>کتاب یافت نشد</p>
        <button onClick={() => navigate('/')} style={{ padding: '10px 24px', background: 'var(--primary)', color: '#fff', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>بازگشت به خانه</button>
      </div>
      <Footer />
    </div>
  );

  const owned = hasPurchased(book.id);
  const isBoth = book.type === 'both';
  // نوع انتخاب شده — برای کتاب‌های هر دو نوع
  const activeType = isBoth ? (selectedType || 'digital') : (book.type || 'digital');
  const activePrice = isBoth && activeType === 'physical' ? (book.physicalPrice || book.price) : book.price;
  const activeOriginalPrice = isBoth && activeType === 'physical' ? null : book.originalPrice;
  const discount = activeOriginalPrice ? Math.round((1 - activePrice / activeOriginalPrice) * 100) : 0;
  const related = books.filter(b => b.category === book.category && b.id !== book.id).slice(0, 4);
  const conditionInfo = BOOK_CONDITIONS.find(c => c.value === book.condition);

  const handleBuy = () => {
    if (owned) { navigate('/panel'); return; }
    addToCart({ ...book, selectedType: activeType, price: activePrice });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <main style={{ flex: 1, direction: 'rtl', background: 'var(--bg)' }}>

        {/* Breadcrumb */}
        <div style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '10px 24px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-3)' }}>
            <span onClick={() => navigate('/')} style={{ cursor: 'pointer', color: 'var(--primary)', fontWeight: 600 }}>خانه</span>
            <ChevronRightIcon size={12} />
            <span onClick={() => navigate('/')} style={{ cursor: 'pointer', color: 'var(--primary)', fontWeight: 600 }}>{book.category}</span>
            <ChevronRightIcon size={12} />
            <span className="clamp-1" style={{ maxWidth: 200 }}>{book.title}</span>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
            HERO: Cover + Info side by side (desktop)
                  Cover stacked on top (mobile)
        ═══════════════════════════════════════════════ */}
        <div style={{ background: '#fff', borderBottom: '1.5px solid var(--border)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>

            {/* Responsive grid — CSS media query via style tag */}
            <style>{`
              .book-hero { display: grid; grid-template-columns: 260px 1fr; gap: 48px; align-items: start; }
              .book-buy-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
              @media (max-width: 700px) {
                .book-hero { grid-template-columns: 1fr; gap: 24px; }
                .book-cover-wrap { max-width: 200px; margin: 0 auto; }
                .book-buy-row { flex-direction: column; align-items: flex-start; }
              }
            `}</style>

            <div className="book-hero">

              {/* ── LEFT: Cover ── */}
              <div className="book-cover-wrap">
                {/* Cover image */}
                <div style={{
                  position: 'relative',
                  paddingTop: '148%',
                  background: 'var(--primary-light)',
                  border: '1.5px solid var(--border)',
                  overflow: 'hidden',
                  boxShadow: '6px 6px 0 var(--border)',
                }}>
                  {!imgErr ? (
                    <img src={book.cover} alt={book.title}
                      onError={() => setImgErr(true)}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, color: 'var(--primary)' }}>
                      <BookOpenIcon size={48} />
                      <span style={{ fontSize: 12, fontWeight: 600, padding: '0 16px', textAlign: 'center' }}>{book.title}</span>
                    </div>
                  )}
                  {/* Discount ribbon */}
                  {discount > 0 && (
                    <div style={{ position: 'absolute', top: 0, left: 0, background: 'var(--red)', color: '#fff', padding: '5px 10px', fontSize: 12, fontWeight: 800 }}>
                      −{discount}%
                    </div>
                  )}
                </div>

                {/* Tags below cover */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 14 }}>
                  {book.tags?.map(t => (
                    <span key={t} style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '3px 10px', fontSize: 11, color: 'var(--text-2)', fontWeight: 500 }}>
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* ── RIGHT: Info ── */}
              <div>
                {/* Category + Type badges */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
                  <span style={{ display: 'inline-block', background: 'var(--primary)', color: '#fff', padding: '3px 12px', fontSize: 11, fontWeight: 700, letterSpacing: '0.3px' }}>
                    {book.category}
                  </span>
                  {book.type === 'digital' && (
                    <span style={{ display: 'inline-block', background: 'var(--primary-light)', color: 'var(--primary)', padding: '3px 10px', fontSize: 11, fontWeight: 700, border: '1px solid var(--primary)' }}>
                      دیجیتال
                    </span>
                  )}
                  {book.type === 'physical' && (
                    <span style={{ display: 'inline-block', background: '#FEF3C7', color: '#92400E', padding: '3px 10px', fontSize: 11, fontWeight: 700, border: '1px solid #FCD34D' }}>
                      چاپی
                    </span>
                  )}
                  {book.type === 'both' && (
                    <span style={{ display: 'inline-block', background: '#EFF6FF', color: '#1D4ED8', padding: '3px 10px', fontSize: 11, fontWeight: 700, border: '1px solid #BFDBFE' }}>
                      دیجیتال + چاپی
                    </span>
                  )}
                  {conditionInfo && (
                    <span style={{ display: 'inline-block', background: conditionInfo.bg, color: conditionInfo.color, padding: '3px 10px', fontSize: 11, fontWeight: 700, border: `1px solid ${conditionInfo.color}40` }}>
                      وضعیت: {conditionInfo.label}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 style={{ fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 900, lineHeight: 1.2, marginBottom: 10, color: 'var(--text)' }}>
                  {book.title}
                </h1>

                {/* Author */}
                <p style={{ fontSize: 15, color: 'var(--primary)', fontWeight: 700, marginBottom: 4 }}>
                  {book.author}
                </p>
                {book.translator && (
                  <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 12 }}>
                    ترجمه: {book.translator}
                  </p>
                )}

                {/* Rating */}
                <div style={{ marginBottom: 20 }}>
                  <Stars rating={book.rating} count={book.reviewCount} />
                </div>

                {/* Short description */}
                <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.9, marginBottom: 24, borderRight: '3px solid var(--primary)', paddingRight: 14 }}>
                  {book.shortDescription}
                </p>

                {/* Meta pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
                  <MetaPill label="صفحه" value={book.pageCount} />
                  <MetaPill label="سال" value={book.publishYear} />
                  <MetaPill label="ناشر" value={book.publisher} />
                  <MetaPill label="زبان" value={book.language} />
                  <MetaPill label="نوع" value={book.type === 'digital' ? 'دیجیتال' : book.type === 'physical' ? 'چاپی' : book.type === 'both' ? 'دیجیتال+چاپی' : 'دیجیتال'} />
                  {book.condition && conditionInfo && (
                    <MetaPill label="وضعیت" value={conditionInfo.label} />
                  )}
                </div>

                {/* ── نوع انتخاب برای کتاب‌های هر دو نوع ── */}
                {isBoth && (
                  <div style={{ marginBottom: 20, border: '1.5px solid var(--border)', background: 'var(--bg)' }}>
                    <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', fontSize: 12, fontWeight: 700, color: 'var(--text-2)' }}>
                      نسخه مورد نظر را انتخاب کنید:
                    </div>
                    <div style={{ display: 'flex' }}>
                      <button onClick={() => setSelectedType('digital')} style={{
                        flex: 1, padding: '14px 16px', border: 'none', cursor: 'pointer',
                        borderLeft: '1.5px solid var(--border)',
                        background: activeType === 'digital' ? 'var(--primary-light)' : 'transparent',
                        transition: 'background 0.15s',
                      }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: activeType === 'digital' ? 'var(--primary)' : 'var(--text-2)', marginBottom: 3 }}>
                          {activeType === 'digital' && <CheckIcon size={12} />} دیجیتال
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--text)' }}>
                          {book.price.toLocaleString('fa-IR')} <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-3)' }}>تومان</span>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>دسترسی فوری</div>
                      </button>
                      <button onClick={() => setSelectedType('physical')} style={{
                        flex: 1, padding: '14px 16px', border: 'none', cursor: 'pointer',
                        background: activeType === 'physical' ? '#FEF3C7' : 'transparent',
                        transition: 'background 0.15s',
                      }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: activeType === 'physical' ? '#92400E' : 'var(--text-2)', marginBottom: 3 }}>
                          {activeType === 'physical' && <CheckIcon size={12} />} چاپی
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--text)' }}>
                          {(book.physicalPrice || book.price).toLocaleString('fa-IR')} <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-3)' }}>تومان</span>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>ارسال به آدرس</div>
                      </button>
                    </div>
                  </div>
                )}

                {/* ── Price + Buy ── */}
                <div style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', padding: 20 }} className="book-buy-row">
                  {/* Price */}
                  <div>
                    {activeOriginalPrice && (
                      <div style={{ fontSize: 13, color: 'var(--text-3)', textDecoration: 'line-through', marginBottom: 2 }}>
                        {activeOriginalPrice.toLocaleString('fa-IR')} تومان
                      </div>
                    )}
                    <div style={{ fontSize: 30, fontWeight: 900, color: 'var(--text)', lineHeight: 1 }}>
                      {activePrice.toLocaleString('fa-IR')}
                      <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-3)', marginRight: 5 }}>تومان</span>
                    </div>
                    {discount > 0 && (
                      <div style={{ fontSize: 12, color: 'var(--red)', fontWeight: 700, marginTop: 4 }}>
                        {discount}٪ تخفیف جشنواره
                      </div>
                    )}
                    {activeType === 'physical' && conditionInfo && (
                      <div style={{ fontSize: 12, fontWeight: 700, color: conditionInfo.color, marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ width: 8, height: 8, background: conditionInfo.color, display: 'inline-block', borderRadius: '50%' }} />
                        وضعیت: {conditionInfo.label}
                      </div>
                    )}
                  </div>

                  {/* Buttons */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    {owned ? (
                      <button onClick={() => navigate('/panel')} style={{
                        background: 'var(--primary)', color: '#fff', border: 'none',
                        padding: '13px 28px', fontSize: 14, fontWeight: 800, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-2)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'var(--primary)'}
                      >
                        <BookOpenIcon size={16} /> {activeType === 'physical' ? 'مشاهده سفارش' : 'مطالعه کتاب'}
                      </button>
                    ) : (
                      <>
                        <button onClick={handleBuy} style={{
                          background: added ? 'var(--green)' : (activeType === 'physical' ? '#92400E' : 'var(--dark)'),
                          color: '#fff', border: 'none',
                          padding: '13px 28px', fontSize: 14, fontWeight: 800, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.2s',
                        }}
                        onMouseEnter={e => { if (!added) e.currentTarget.style.background = 'var(--primary)'; }}
                        onMouseLeave={e => { if (!added) e.currentTarget.style.background = added ? 'var(--green)' : (activeType === 'physical' ? '#92400E' : 'var(--dark)'); }}
                        >
                          {added ? <><CheckIcon size={16} /> افزوده شد</> : <><CartIcon size={16} /> {activeType === 'physical' ? 'سفارش چاپی' : 'افزودن به سبد'}</>}
                        </button>
                        {activeType !== 'physical' && (
                          <button onClick={() => setTab('sample')} style={{
                            background: 'transparent', color: 'var(--primary)', border: '1.5px solid var(--primary)',
                            padding: '13px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary-light)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                          >
                            نمونه رایگان
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Guarantees */}
                <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
                  {activeType === 'physical' ? (
                    [['ارسال به سراسر کشور'], ['بسته‌بندی استاندارد'], ['ضمانت سلامت کتاب']].map(([t]) => (
                      <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-3)', fontWeight: 500 }}>
                        <CheckIcon size={12} /> {t}
                      </div>
                    ))
                  ) : (
                    [['دسترسی فوری پس از خرید'], ['بدون محدودیت مطالعه'], ['آپدیت‌های رایگان']].map(([t]) => (
                      <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-3)', fontWeight: 500 }}>
                        <CheckIcon size={12} /> {t}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
            TABS: About / Sample
        ═══════════════════════════════════════════════ */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
          {/* Tab bar */}
          <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid var(--border)', marginBottom: 32 }}>
            {[['about', 'درباره کتاب'], ['sample', 'نمونه رایگان']].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)} style={{
                padding: '11px 22px', background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 14, fontWeight: 700,
                color: tab === key ? 'var(--primary)' : 'var(--text-3)',
                borderBottom: `2px solid ${tab === key ? 'var(--primary)' : 'transparent'}`,
                marginBottom: -2, transition: 'all 0.15s',
              }}>
                {label}
              </button>
            ))}
          </div>

          {/* About */}
          {tab === 'about' && (
            <div style={{ maxWidth: 760 }} className="fade-in">
              {book.description?.split('\n\n').map((p, i) => (
                <p key={i} style={{ fontSize: 15, lineHeight: 2.1, color: 'var(--text-2)', marginBottom: 18 }}>{p}</p>
              ))}
            </div>
          )}

          {/* Sample */}
          {tab === 'sample' && (
            <div style={{ maxWidth: 760 }} className="fade-in">
              {book.sampleContent ? (
                <div style={{ border: '1.5px solid var(--border)', background: '#fff' }}>
                  {/* Sample header */}
                  <div style={{ padding: '10px 18px', borderBottom: '1px solid var(--border)', background: 'var(--bg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: 'var(--text-2)' }}>
                      <BookOpenIcon size={14} /> نمونه رایگان — {book.title}
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text-3)', background: 'var(--primary-light)', padding: '2px 8px', color: 'var(--primary)', fontWeight: 600 }}>
                      پیش‌نمایش
                    </span>
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: book.sampleContent }} />
                  {/* CTA after sample */}
                  <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border)', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>برای خواندن ادامه کتاب:</p>
                      <p style={{ fontSize: 13, color: 'var(--text-3)' }}>فقط {book.price.toLocaleString('fa-IR')} تومان — دسترسی فوری</p>
                    </div>
                    <button onClick={handleBuy} style={{
                      background: 'var(--dark)', color: '#fff', border: 'none',
                      padding: '11px 24px', fontSize: 13, fontWeight: 800, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 7, transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--primary)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--dark)'}
                    >
                      <CartIcon size={14} /> خرید کتاب
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-3)', border: '2px dashed var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}><BookOpenIcon size={32} /></div>
                  <p>نمونه‌ای برای این کتاب موجود نیست</p>
                </div>
              )}
            </div>
          )}

          {/* ═══════ Related Books ═══════ */}
          {related.length > 0 && (
            <div style={{ marginTop: 56, paddingTop: 40, borderTop: '1.5px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800 }}>کتاب‌های مشابه</h2>
                <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{related.length} کتاب</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))', gap: 18 }}>
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
