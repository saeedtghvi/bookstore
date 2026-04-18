import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  BookOpenIcon, HomeIcon, UserIcon, LogOutIcon, CheckIcon,
  SunIcon, MoonIcon, PlusIcon, MinusIcon, HeartIcon, StarIcon,
  MessageCircleIcon, BookmarkIcon,
} from '../components/Icons';

/* ── Star rating input ── */
function StarInput({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: 'flex', gap: 4, direction: 'ltr' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <button key={i} type="button"
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 2,
            color: i <= (hover || value) ? '#D97706' : 'var(--border)',
            transition: 'color 0.1s',
          }}
        >
          <StarIcon size={22} filled={i <= (hover || value)} />
        </button>
      ))}
    </div>
  );
}

/* ── Reading progress bar ── */
function ProgressBar({ pct }) {
  return (
    <div style={{ height: 3, background: 'var(--primary)', width: `${pct}%`, position: 'fixed', top: 0, right: 0, left: 0, zIndex: 9999, transition: 'width 0.2s' }} />
  );
}

export default function CustomerPanel() {
  const { user, books, logout, wishlist, isWishlisted, toggleWishlist, addReview, getBookReviews, getReadProgress, saveReadProgress } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState('library');
  const [readingBook, setReadingBook] = useState(null);
  const [fontSize, setFontSize] = useState(17);
  const [darkReader, setDarkReader] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 0, text: '' });
  const [reviewTarget, setReviewTarget] = useState(null);
  const [reviewSent, setReviewSent] = useState(false);
  const contentRef = useRef(null);

  const myBooks = books.filter(b => user.purchasedBooks?.includes(b.id));
  const wishlistBooks = books.filter(b => isWishlisted(b.id));

  // Restore scroll when opening a book
  useEffect(() => {
    if (readingBook && contentRef.current) {
      const saved = getReadProgress(readingBook.id);
      const el = contentRef.current;
      setTimeout(() => {
        if (el) el.scrollTop = (el.scrollHeight - el.clientHeight) * (saved / 100);
      }, 100);
    }
  }, [readingBook]);

  const handleScroll = (e) => {
    const el = e.currentTarget;
    const pct = Math.round((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100);
    setScrollPct(pct);
    if (readingBook) saveReadProgress(readingBook.id, pct);
  };

  const navItems = [
    { id: 'library',   icon: <BookOpenIcon size={16} />,       label: 'کتابخانه من' },
    { id: 'wishlist',  icon: <HeartIcon size={16} />,           label: `علاقه‌مندی‌ها (${wishlistBooks.length})` },
    { id: 'dashboard', icon: <HomeIcon size={16} />,            label: 'داشبورد' },
    { id: 'profile',   icon: <UserIcon size={16} />,            label: 'پروفایل' },
  ];

  // Full-screen reader
  if (readingBook) {
    const reviews = getBookReviews(readingBook.id);
    return (
      <div style={{ position: 'fixed', inset: 0, background: darkReader ? '#1a1714' : '#faf9f6', zIndex: 300, display: 'flex', flexDirection: 'column', direction: 'rtl' }}>
        <ProgressBar pct={scrollPct} />

        {/* Toolbar */}
        <div style={{
          padding: '0 20px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: `1.5px solid ${darkReader ? 'rgba(255,255,255,0.08)' : 'var(--border)'}`,
          background: darkReader ? '#252220' : '#fff', flexShrink: 0,
        }}>
          <button onClick={() => setReadingBook(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: darkReader ? 'var(--primary-2)' : 'var(--primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
            ← بازگشت
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: darkReader ? '#fff' : 'var(--text)' }} className="clamp-1">{readingBook.title}</span>
            <span style={{ fontSize: 12, color: darkReader ? 'rgba(255,255,255,0.4)' : 'var(--text-3)', padding: '2px 8px', background: darkReader ? 'rgba(255,255,255,0.08)' : 'var(--bg)' }}>
              {scrollPct}%
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Font size */}
            <div style={{ display: 'flex', alignItems: 'center', border: `1.5px solid ${darkReader ? 'rgba(255,255,255,0.15)' : 'var(--border)'}` }}>
              <button onClick={() => setFontSize(s => Math.max(12, s - 2))} style={{ width: 32, height: 32, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: darkReader ? '#fff' : 'var(--text-2)' }}>
                <MinusIcon size={13} />
              </button>
              <span style={{ fontSize: 12, fontWeight: 700, minWidth: 28, textAlign: 'center', color: darkReader ? '#fff' : 'var(--text)', borderLeft: `1px solid ${darkReader ? 'rgba(255,255,255,0.1)' : 'var(--border)'}`, borderRight: `1px solid ${darkReader ? 'rgba(255,255,255,0.1)' : 'var(--border)'}`, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{fontSize}</span>
              <button onClick={() => setFontSize(s => Math.min(26, s + 2))} style={{ width: 32, height: 32, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: darkReader ? '#fff' : 'var(--text-2)' }}>
                <PlusIcon size={13} />
              </button>
            </div>
            <button onClick={() => setDarkReader(p => !p)} style={{
              background: darkReader ? 'rgba(255,255,255,0.1)' : 'var(--bg)',
              border: `1.5px solid ${darkReader ? 'rgba(255,255,255,0.15)' : 'var(--border)'}`,
              cursor: 'pointer', padding: '6px 12px', fontSize: 12, fontWeight: 600,
              color: darkReader ? '#fff' : 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 6,
            }}>
              {darkReader ? <SunIcon size={13} /> : <MoonIcon size={13} />}
              <span className="hide-mobile">{darkReader ? 'روشن' : 'تاریک'}</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div ref={contentRef} onScroll={handleScroll} style={{ flex: 1, overflowY: 'auto', padding: 'clamp(24px,5vw,64px) clamp(20px,12vw,140px)' }}>
          {readingBook.sampleContent ? (
            <div dangerouslySetInnerHTML={{ __html: readingBook.sampleContent }}
              style={{ fontSize, lineHeight: 2.1, color: darkReader ? '#E5E0D8' : '#2D2926', fontFamily: "'Vazirmatn', Georgia, serif", maxWidth: 720, margin: '0 auto' }}
            />
          ) : (
            <div style={{ maxWidth: 600, margin: '80px auto', textAlign: 'center', color: darkReader ? 'rgba(255,255,255,0.3)' : 'var(--text-3)' }}>
              <BookOpenIcon size={48} />
              <p style={{ fontSize: 16, marginTop: 16 }}>محتوای این کتاب در حال آماده‌سازی است</p>
            </div>
          )}

          {/* Write review */}
          <div style={{ maxWidth: 720, margin: '48px auto 0', borderTop: `1px solid ${darkReader ? 'rgba(255,255,255,0.1)' : 'var(--border)'}`, paddingTop: 32 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: darkReader ? '#fff' : 'var(--text)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <MessageCircleIcon size={16} /> نظر شما
            </h3>
            {reviews.filter(r => r.userId === user.id).length > 0 ? (
              <p style={{ fontSize: 13, color: darkReader ? 'rgba(255,255,255,0.5)' : 'var(--text-3)', padding: '12px', background: darkReader ? 'rgba(255,255,255,0.05)' : 'var(--primary-light)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckIcon size={13} /> نظر شما ثبت شده است — ممنون
              </p>
            ) : reviewSent ? (
              <p style={{ fontSize: 13, color: 'var(--green)', fontWeight: 600 }}>نظر شما با موفقیت ثبت شد</p>
            ) : (
              <div>
                <StarInput value={reviewForm.rating} onChange={v => setReviewForm(p => ({ ...p, rating: v }))} />
                <textarea
                  value={reviewForm.text}
                  onChange={e => setReviewForm(p => ({ ...p, text: e.target.value }))}
                  placeholder="نظر خود را بنویسید..."
                  rows={3}
                  style={{ width: '100%', marginTop: 12, padding: '10px 14px', border: `1.5px solid ${darkReader ? 'rgba(255,255,255,0.15)' : 'var(--border)'}`, background: darkReader ? 'rgba(255,255,255,0.05)' : 'var(--bg)', color: darkReader ? '#fff' : 'var(--text)', fontSize: 13, fontFamily: 'inherit', outline: 'none', resize: 'vertical' }}
                />
                <button
                  onClick={() => {
                    if (!reviewForm.rating || !reviewForm.text.trim()) return;
                    addReview(readingBook.id, reviewForm);
                    setReviewSent(true);
                    setReviewForm({ rating: 0, text: '' });
                  }}
                  style={{ marginTop: 10, background: 'var(--primary)', color: '#fff', border: 'none', padding: '9px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                >
                  ثبت نظر
                </button>
              </div>
            )}

            {reviews.length > 0 && (
              <div style={{ marginTop: 28 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: darkReader ? '#fff' : 'var(--text)', marginBottom: 14 }}>نظرات دیگران ({reviews.length})</h4>
                {reviews.map(r => (
                  <div key={r.id} style={{ padding: 14, border: `1px solid ${darkReader ? 'rgba(255,255,255,0.1)' : 'var(--border)'}`, marginBottom: 10, background: darkReader ? 'rgba(255,255,255,0.04)' : 'var(--surface)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: 13, color: darkReader ? '#fff' : 'var(--text)' }}>{r.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        {[1,2,3,4,5].map(i => <StarIcon key={i} size={12} filled={i <= r.rating} />)}
                        <span style={{ fontSize: 11, color: darkReader ? 'rgba(255,255,255,0.4)' : 'var(--text-3)', marginRight: 4 }}>{r.date}</span>
                      </div>
                    </div>
                    <p style={{ fontSize: 13, color: darkReader ? 'rgba(255,255,255,0.7)' : 'var(--text-2)', lineHeight: 1.8 }}>{r.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', direction: 'rtl', display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{ width: 220, background: 'var(--surface)', borderLeft: '1.5px solid var(--border)', position: 'sticky', top: 0, height: '100vh', display: 'flex', flexDirection: 'column', flexShrink: 0, zIndex: 10 }}>
        <div style={{ padding: '20px 16px', borderBottom: '1.5px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            <div style={{ background: 'var(--primary)', color: '#fff', padding: '5px 6px', display: 'flex' }}>
              <BookOpenIcon size={14} />
            </div>
            <span style={{ fontSize: 15, fontWeight: 900, color: 'var(--text)' }}>کتاب‌خانه</span>
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4, marginRight: 28 }}>پنل کاربری</p>
        </div>
        <nav style={{ flex: 1, padding: 10 }}>
          {navItems.map(n => (
            <button key={n.id} onClick={() => setTab(n.id)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', border: 'none', cursor: 'pointer',
              background: tab === n.id ? 'var(--primary-light)' : 'transparent',
              color: tab === n.id ? 'var(--primary)' : 'var(--text-2)',
              fontSize: 13, fontWeight: tab === n.id ? 700 : 500,
              marginBottom: 2, transition: 'all 0.15s', textAlign: 'right',
              borderRight: tab === n.id ? '3px solid var(--primary)' : '3px solid transparent',
            }}>
              {n.icon} {n.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: 10, borderTop: '1.5px solid var(--border)' }}>
          <button onClick={() => { logout(); navigate('/'); }} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px',
            border: 'none', cursor: 'pointer', background: '#FEF2F2', color: '#DC2626',
            fontSize: 12, fontWeight: 600, transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#FEE2E2'}
          onMouseLeave={e => e.currentTarget.style.background = '#FEF2F2'}
          >
            <LogOutIcon size={14} /> خروج از حساب
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: 28, overflowY: 'auto', minWidth: 0 }}>

        {/* DASHBOARD */}
        {tab === 'dashboard' && (
          <div className="fade-in">
            <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 4, color: 'var(--text)' }}>خوش آمدید، {user.name}</h1>
            <p style={{ color: 'var(--text-3)', marginBottom: 28, fontSize: 13 }}>خلاصه حساب شما</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 14, marginBottom: 32 }}>
              {[
                { icon: <BookOpenIcon size={20} />, value: myBooks.length, label: 'کتاب خریداری شده', bg: 'var(--primary-light)', tc: 'var(--primary)' },
                { icon: <HeartIcon size={20} />, value: wishlistBooks.length, label: 'علاقه‌مندی‌ها', bg: '#FFF0F0', tc: '#EF4444' },
                { icon: <CheckIcon size={20} />, value: '∞', label: 'دسترسی دائمی', bg: '#D1FAE5', tc: '#059669' },
              ].map(s => (
                <div key={s.label} style={{ background: s.bg, border: `1.5px solid ${s.tc}22`, padding: 20 }}>
                  <div style={{ color: s.tc, marginBottom: 10 }}>{s.icon}</div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: s.tc }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: s.tc, opacity: 0.75, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
            {myBooks.length > 0 && (
              <div>
                <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text)' }}>
                  <BookOpenIcon size={15} /> کتاب‌های اخیر
                </h2>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {myBooks.slice(0, 4).map(b => {
                    const prog = getReadProgress(b.id);
                    return (
                      <div key={b.id} onClick={() => setReadingBook(b)}
                        style={{ display: 'flex', gap: 10, background: 'var(--surface)', padding: 12, cursor: 'pointer', border: '1.5px solid var(--border)', width: 220, transition: 'border-color 0.15s', flexDirection: 'column' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                      >
                        <div style={{ display: 'flex', gap: 10 }}>
                          <div style={{ width: 36, height: 48, background: 'var(--primary-light)', flexShrink: 0, overflow: 'hidden' }}>
                            <img src={b.cover} alt={b.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }} className="clamp-2">{b.title}</p>
                            <p style={{ fontSize: 10, color: 'var(--primary)', marginTop: 4, fontWeight: 600 }}>مطالعه ←</p>
                          </div>
                        </div>
                        {prog > 0 && (
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-3)', marginBottom: 3 }}>
                              <span>پیشرفت</span><span>{prog}%</span>
                            </div>
                            <div style={{ height: 3, background: 'var(--border)' }}>
                              <div style={{ height: '100%', background: 'var(--primary)', width: `${prog}%`, transition: 'width 0.3s' }} />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* LIBRARY */}
        {tab === 'library' && (
          <div className="fade-in">
            <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 4, color: 'var(--text)' }}>کتابخانه من</h1>
            <p style={{ color: 'var(--text-3)', marginBottom: 28, fontSize: 13 }}>{myBooks.length} کتاب خریداری شده</p>
            {myBooks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-3)', border: '2px dashed var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}><BookOpenIcon size={40} /></div>
                <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>هنوز کتابی نخریده‌اید</p>
                <button onClick={() => navigate('/')} style={{ padding: '10px 24px', background: 'var(--primary)', color: '#fff', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                  مشاهده کتاب‌ها ←
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 18 }}>
                {myBooks.map(book => {
                  const prog = getReadProgress(book.id);
                  const reviews = getBookReviews(book.id);
                  return (
                    <div key={book.id} style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', overflow: 'hidden', transition: 'border-color 0.15s, box-shadow 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '3px 3px 0 var(--primary-light)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      <div style={{ position: 'relative', paddingTop: '140%', background: 'var(--primary-light)', overflow: 'hidden' }}>
                        <img src={book.cover} alt={book.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'var(--primary)', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 5 }}>
                          <CheckIcon size={11} />
                          <span style={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>در مجموعه شما</span>
                        </div>
                      </div>
                      {/* Progress bar */}
                      {prog > 0 && (
                        <div style={{ height: 4, background: 'var(--border)' }}>
                          <div style={{ height: '100%', background: 'var(--primary)', width: `${prog}%` }} />
                        </div>
                      )}
                      <div style={{ padding: '12px 13px 14px' }}>
                        <p style={{ fontSize: 13, fontWeight: 800, marginBottom: 2, color: 'var(--text)' }} className="clamp-2">{book.title}</p>
                        <p style={{ fontSize: 11, color: 'var(--primary)', marginBottom: 4, fontWeight: 600 }}>{book.author}</p>
                        {prog > 0 && <p style={{ fontSize: 10, color: 'var(--text-3)', marginBottom: 8 }}>پیشرفت: {prog}%</p>}
                        {reviews.length > 0 && (
                          <div style={{ display: 'flex', gap: 2, marginBottom: 8, color: '#D97706' }}>
                            {[1,2,3,4,5].map(i => <StarIcon key={i} size={11} filled={i <= (reviews.reduce((s,r) => s + r.rating, 0) / reviews.length)} />)}
                            <span style={{ fontSize: 10, color: 'var(--text-3)', marginRight: 4 }}>({reviews.length})</span>
                          </div>
                        )}
                        <button onClick={() => { setReviewSent(false); setReadingBook(book); }} style={{
                          width: '100%', background: 'var(--dark)', color: '#fff', border: 'none',
                          padding: '8px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--primary)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'var(--dark)'}
                        >
                          <BookOpenIcon size={13} /> {prog > 0 ? 'ادامه مطالعه' : 'شروع مطالعه'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* WISHLIST */}
        {tab === 'wishlist' && (
          <div className="fade-in">
            <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 4, color: 'var(--text)' }}>علاقه‌مندی‌ها</h1>
            <p style={{ color: 'var(--text-3)', marginBottom: 28, fontSize: 13 }}>{wishlistBooks.length} کتاب ذخیره شده</p>
            {wishlistBooks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-3)', border: '2px dashed var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12, color: '#EF4444' }}>
                  <HeartIcon size={40} />
                </div>
                <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>لیست علاقه‌مندی خالی است</p>
                <p style={{ fontSize: 13, marginBottom: 20 }}>روی آیکون قلب کارت‌ها کلیک کنید تا کتاب‌ها اینجا ذخیره شوند</p>
                <button onClick={() => navigate('/')} style={{ padding: '10px 24px', background: 'var(--primary)', color: '#fff', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                  مشاهده کتاب‌ها ←
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 18 }}>
                {wishlistBooks.map(book => (
                  <div key={book.id} style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', overflow: 'hidden' }}>
                    <div style={{ position: 'relative', paddingTop: '140%', background: 'var(--primary-light)', overflow: 'hidden', cursor: 'pointer' }}
                      onClick={() => navigate(`/book/${book.id}`)}>
                      <img src={book.cover} alt={book.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                    </div>
                    <div style={{ padding: '12px 13px 14px' }}>
                      <p style={{ fontSize: 13, fontWeight: 800, marginBottom: 2, color: 'var(--text)' }} className="clamp-2">{book.title}</p>
                      <p style={{ fontSize: 11, color: 'var(--primary)', marginBottom: 10, fontWeight: 600 }}>{book.author}</p>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => navigate(`/book/${book.id}`)} style={{ flex: 1, background: 'var(--dark)', color: '#fff', border: 'none', padding: '8px', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'background 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--primary)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'var(--dark)'}>
                          مشاهده
                        </button>
                        <button onClick={() => toggleWishlist(book.id)} style={{ background: '#FFF0F0', color: '#EF4444', border: '1.5px solid #FCA5A5', padding: '8px 10px', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center' }}>
                          <HeartIcon size={13} filled />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PROFILE */}
        {tab === 'profile' && (
          <div className="fade-in" style={{ maxWidth: 480 }}>
            <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 28, color: 'var(--text)' }}>اطلاعات حساب</h1>
            <div style={{ background: 'var(--surface)', padding: 28, border: '1.5px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 52, height: 52, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  <UserIcon size={26} />
                </div>
                <div>
                  <p style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)' }}>{user.name}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>کاربر عادی</p>
                </div>
              </div>
              {[
                ['ایمیل', user.email],
                ['کتاب‌های خریداری شده', `${myBooks.length} کتاب`],
                ['علاقه‌مندی‌ها', `${wishlistBooks.length} کتاب`],
              ].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-3)' }}>{l}</span>
                  <span style={{ fontWeight: 700, color: 'var(--text)' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
