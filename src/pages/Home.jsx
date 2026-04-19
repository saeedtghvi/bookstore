import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FestivalBanner from '../components/FestivalBanner';
import BookCard from '../components/BookCard';
import Footer from '../components/Footer';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/books';
import {
  SearchIcon, ChevronRightIcon, ChevronLeftIcon,
  ZapIcon, SmartphoneIcon, ShieldIcon, RefreshIcon,
  StarIcon, CartIcon, BookOpenIcon, CheckIcon, ArrowRightIcon,
} from '../components/Icons';

/* ── Skeleton card ── */
function SkeletonCard() {
  return (
    <div style={{ border: '1.5px solid var(--border)', background: 'var(--surface)' }}>
      <div className="skeleton" style={{ paddingTop: '145%' }} />
      <div style={{ padding: '12px 13px 14px' }}>
        <div className="skeleton" style={{ height: 16, width: '80%', marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 12, width: '50%', marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 12, width: '100%', marginBottom: 8 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="skeleton" style={{ height: 20, width: 70 }} />
          <div className="skeleton" style={{ height: 32, width: 64 }} />
        </div>
      </div>
    </div>
  );
}

/* ── Featured Books Section ── */
function FeaturedSection({ books }) {
  const navigate = useNavigate();
  const { addToCart, hasPurchased } = useApp();
  const [activeIdx, setActiveIdx] = useState(0);
  const [added, setAdded] = useState({});

  if (!books.length) return null;
  const active = books[activeIdx];
  const discount = active.originalPrice
    ? Math.round((1 - active.price / active.originalPrice) * 100) : 0;
  const owned = hasPurchased(active.id);

  const handleBuy = (book) => {
    if (owned) { navigate('/panel'); return; }
    addToCart(book);
    setAdded(p => ({ ...p, [book.id]: true }));
    setTimeout(() => setAdded(p => ({ ...p, [book.id]: false })), 1600);
  };

  return (
    <section style={{ background: '#FAFAF8', borderTop: '1.5px solid var(--border)', borderBottom: '1.5px solid var(--border)', direction: 'rtl', overflow: 'hidden' }}>
      <style>{`
        .featured-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 0;
          max-width: 1280px;
          margin: 0 auto;
          min-height: 360px;
        }
        .featured-thumbs {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        @media (max-width: 860px) {
          .featured-grid {
            grid-template-columns: 1fr;
          }
          .featured-sidebar {
            border-right: none !important;
            border-top: 1.5px solid var(--border);
            padding: 20px 24px !important;
          }
        }
      `}</style>

      <div className="featured-grid">
        {/* Left: active book detail */}
        <div style={{ padding: '40px 40px 40px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 0 }} key={active.id} className="fade-in">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <div style={{ width: 28, height: 3, background: 'var(--primary)' }} />
            <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--primary)', letterSpacing: 1, textTransform: 'uppercase' }}>کتاب ویژه</span>
          </div>

          <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>
            {/* Cover */}
            <div style={{ width: 140, height: 190, flexShrink: 0, overflow: 'hidden', background: 'var(--primary-light)', boxShadow: '5px 5px 0 var(--border)', position: 'relative' }}>
              <img src={active.cover} alt={active.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => e.target.style.display = 'none'} />
              {discount > 0 && (
                <div style={{ position: 'absolute', top: 0, right: 0, background: '#DC2626', color: '#fff', padding: '4px 8px', fontSize: 11, fontWeight: 800 }}>−{discount}%</div>
              )}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ fontSize: 'clamp(18px,2.5vw,26px)', fontWeight: 900, lineHeight: 1.35, marginBottom: 8, color: 'var(--text)' }}>{active.title}</h2>
              <p style={{ fontSize: 14, color: 'var(--primary)', fontWeight: 700, marginBottom: 12 }}>{active.author}</p>

              {/* Stars */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
                <div style={{ display: 'flex', color: '#D97706' }}>
                  {[1,2,3,4,5].map(i => <StarIcon key={i} size={14} filled={i <= Math.round(active.rating)} />)}
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{active.rating}</span>
                <span style={{ fontSize: 12, color: 'var(--text-3)' }}>({active.reviewCount?.toLocaleString('fa-IR')} نظر)</span>
              </div>

              <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.9, marginBottom: 20 }} className="clamp-3">{active.shortDescription}</p>

              {/* Tags */}
              {active.tags?.length > 0 && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
                  {active.tags.slice(0, 4).map(t => (
                    <span key={t} style={{ fontSize: 11, padding: '3px 10px', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 600 }}>{t}</span>
                  ))}
                </div>
              )}

              {/* Price + CTA */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div>
                  <span style={{ fontSize: 24, fontWeight: 900, color: 'var(--text)' }}>{active.price.toLocaleString('fa-IR')}</span>
                  <span style={{ fontSize: 13, color: 'var(--text-3)', marginRight: 4 }}>تومان</span>
                  {active.originalPrice && (
                    <div style={{ fontSize: 12, color: 'var(--text-3)', textDecoration: 'line-through' }}>{active.originalPrice.toLocaleString('fa-IR')}</div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => handleBuy(active)} style={{
                    background: owned ? 'var(--primary)' : (added[active.id] ? 'var(--green)' : 'var(--dark)'),
                    color: '#fff', border: 'none', padding: '11px 22px', fontSize: 13, fontWeight: 800,
                    cursor: 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: 7,
                  }}
                  onMouseEnter={e => { if (!owned && !added[active.id]) e.currentTarget.style.background = 'var(--primary)'; }}
                  onMouseLeave={e => { if (!owned && !added[active.id]) e.currentTarget.style.background = 'var(--dark)'; }}
                  >
                    {owned ? <><BookOpenIcon size={14} /> مطالعه</> : added[active.id] ? <><CheckIcon size={14} /> افزوده شد</> : <><CartIcon size={14} /> خرید کتاب</>}
                  </button>
                  <Link to={`/book/${active.id}`} style={{ background: 'transparent', color: 'var(--primary)', border: '1.5px solid var(--primary)', padding: '11px 18px', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}>
                    جزئیات <ArrowRightIcon size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: thumbnails sidebar */}
        <div className="featured-sidebar" style={{ borderRight: '1.5px solid var(--border)', padding: '32px 24px', background: '#F2F0EB', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-3)', marginBottom: 4, letterSpacing: 1 }}>همه کتاب‌های ویژه</p>
          {books.map((book, i) => (
            <button key={book.id} onClick={() => setActiveIdx(i)} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
              background: i === activeIdx ? '#fff' : 'transparent',
              border: i === activeIdx ? '1.5px solid var(--primary)' : '1.5px solid transparent',
              cursor: 'pointer', textAlign: 'right', transition: 'all 0.18s',
              boxShadow: i === activeIdx ? '3px 3px 0 var(--primary-light)' : 'none',
            }}
            onMouseEnter={e => { if (i !== activeIdx) e.currentTarget.style.background = 'rgba(255,255,255,0.6)'; }}
            onMouseLeave={e => { if (i !== activeIdx) e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{ width: 44, height: 60, flexShrink: 0, overflow: 'hidden', background: 'var(--primary-light)' }}>
                <img src={book.cover} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: i === activeIdx ? 'var(--primary)' : 'var(--text)' }} className="clamp-2">{book.title}</p>
                <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{book.author}</p>
                <p style={{ fontSize: 13, fontWeight: 800, color: 'var(--text)', marginTop: 3 }}>{book.price.toLocaleString('fa-IR')} ت</p>
              </div>
              {i === activeIdx && <div style={{ width: 3, height: 40, background: 'var(--primary)', flexShrink: 0 }} />}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Category pill ── */
const CAT_COLORS = {
  'رمان کلاسیک': { bg: '#1D4ED8', text: '#fff' },
  'برنامه‌نویسی': { bg: '#1D4ED8', text: '#fff' },
  'طراحی': { bg: '#7C3AED', text: '#fff' },
  'کسب‌وکار': { bg: '#D97706', text: '#fff' },
  'توسعه فردی': { bg: '#059669', text: '#fff' },
  'علم': { bg: '#DC2626', text: '#fff' },
};

export default function Home() {
  const { books, bookCategories } = useApp();
  const [cat, setCat] = useState('همه');
  const [sort, setSort] = useState('default');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    let r = books;
    if (cat !== 'همه') r = r.filter(b => b.category === cat);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || (b.tags || []).some(t => t.toLowerCase().includes(q)));
    }
    if (sort === 'price-asc')  return [...r].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') return [...r].sort((a, b) => b.price - a.price);
    if (sort === 'rating')     return [...r].sort((a, b) => b.rating - a.rating);
    if (sort === 'newest')     return [...r].sort((a, b) => b.id - a.id);
    return r;
  }, [books, cat, sort, search]);

  const featured = books.filter(b => b.featured);
  const allCats = ['همه', ...(bookCategories || CATEGORIES)];

  const features = [
    { icon: <ZapIcon size={18} />, title: 'دسترسی فوری', sub: 'بلافاصله پس از خرید', color: '#D97706' },
    { icon: <SmartphoneIcon size={18} />, title: 'روی همه دستگاه‌ها', sub: 'موبایل، تبلت، لپ‌تاپ', color: '#2563EB' },
    { icon: <ShieldIcon size={18} />, title: 'قیمت کمتر از چاپی', sub: 'تا ۵۰٪ ارزان‌تر', color: '#059669' },
    { icon: <RefreshIcon size={18} />, title: 'آپدیت رایگان', sub: 'نسخه‌های جدید رایگان', color: '#7C3AED' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <FestivalBanner />
      <Navbar />

      {/* Hero */}
      <section style={{
        background: 'var(--dark)', color: '#fff', direction: 'rtl',
        padding: 'clamp(48px,8vw,88px) 24px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -80, left: -80, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(15,118,110,0.35), transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: -60, right: 100, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,116,144,0.2), transparent 70%)' }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'center' }}>
          <div className="fade-in">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(15,118,110,0.25)', border: '1px solid rgba(20,184,166,0.4)', padding: '5px 16px', marginBottom: 20 }}>
              <div style={{ width: 6, height: 6, background: 'var(--primary)', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#5EEAD4' }}>نسل جدید کتاب‌های دیجیتال</span>
            </div>
            <h1 style={{ fontSize: 'clamp(28px,4.5vw,58px)', fontWeight: 900, lineHeight: 1.2, marginBottom: 20, letterSpacing: -1 }}>
              کتاب‌های مورد علاقه‌تان را<br />
              <span style={{ color: 'var(--primary)' }}>با محیطی زیبا</span> بخوانید
            </h1>
            <p style={{ fontSize: 'clamp(14px,2vw,16px)', color: 'rgba(255,255,255,0.6)', lineHeight: 2, maxWidth: 480, marginBottom: 32 }}>
              تجربه‌ای متفاوت از مطالعه — با امکانات پیشرفته، قیمتی کمتر از نسخه چاپی، و دسترسی فوری پس از خرید.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/digital" style={{ background: 'var(--primary)', color: '#fff', padding: '13px 28px', fontSize: 15, fontWeight: 700, transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: 8 }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--primary)'}
              >کتاب‌های دیجیتال <ArrowRightIcon size={16} /></Link>
              <Link to="/physical" style={{ background: 'rgba(255,255,255,0.08)', color: '#FEF3C7', padding: '13px 28px', fontSize: 15, fontWeight: 700, border: '1px solid rgba(254,243,199,0.3)', transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: 8 }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(146,64,14,0.4)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              >کتاب‌های چاپی <ArrowRightIcon size={16} /></Link>
            </div>
            <div style={{ display: 'flex', gap: 32, marginTop: 40, flexWrap: 'wrap' }}>
              {[['۸+', 'کتاب دیجیتال'], ['۲۴+', 'هزار خواننده'], ['۴.۸', 'میانگین امتیاز']].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--primary)' }}>{n}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="hide-mobile" style={{ position: 'relative', width: 220, height: 280 }}>
            {featured.slice(0, 3).map((book, i) => (
              <div key={book.id} style={{ position: 'absolute', top: i * 16, left: i * -10, width: 160, height: 210, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', transform: `rotate(${[-4, 0, 4][i]}deg)`, zIndex: 3 - i, background: 'var(--primary-light)' }}>
                <img src={book.cover} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features strip — between hero (dark) and featured (light cream) */}
      <section style={{ background: 'var(--primary)', direction: 'rtl', padding: '16px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 16 }}>
          {features.map(({ icon, title, sub }) => (
            <div key={title} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#fff' }}>
              <div style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {icon}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{title}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 1 }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured books — light cream, clearly distinct from dark hero */}
      {featured.length > 0 && <FeaturedSection books={featured} />}

      {/* All books */}
      <section id="books" style={{ background: '#fff', padding: '48px 24px', direction: 'rtl', flex: 1 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800 }}>همه کتاب‌ها</h2>
              <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 3 }}>{books.length} کتاب موجود</p>
            </div>
          </div>

          {/* Search + Sort */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
              <div style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none' }}>
                <SearchIcon size={16} />
              </div>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="جستجو در عنوان، نویسنده، موضوع..."
                style={{ width: '100%', padding: '10px 42px 10px 16px', border: '2px solid var(--border)', fontSize: 14, background: 'var(--surface)', outline: 'none', transition: 'border-color 0.2s', color: 'var(--text)' }}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: '10px 16px', border: '2px solid var(--border)', fontSize: 13, color: 'var(--text-2)', outline: 'none', background: 'var(--surface)', cursor: 'pointer' }}>
              <option value="default">مرتب‌سازی پیش‌فرض</option>
              <option value="price-asc">ارزان‌ترین</option>
              <option value="price-desc">گران‌ترین</option>
              <option value="rating">بهترین امتیاز</option>
              <option value="newest">جدیدترین</option>
            </select>
          </div>

          {/* Category filter */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
            {allCats.map(c => {
              const active = cat === c;
              const color = CAT_COLORS[c] || { bg: 'var(--primary)', text: '#fff' };
              return (
                <button key={c} onClick={() => setCat(c)} style={{
                  padding: '7px 16px', fontSize: 13, fontWeight: 600,
                  border: '2px solid', cursor: 'pointer', transition: 'all 0.18s',
                  borderColor: active ? (c === 'همه' ? 'var(--primary)' : color.bg) : 'var(--border)',
                  background: active ? (c === 'همه' ? 'var(--primary)' : color.bg) : 'var(--surface)',
                  color: active ? (c === 'همه' ? '#fff' : color.text) : 'var(--text-2)',
                }}>{c}</button>
              );
            })}
          </div>

          <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 20 }}>{filtered.length} کتاب</p>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 22 }}>
              {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 22 }}>
              {filtered.map(b => <BookCard key={b.id} book={b} />)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-3)' }}>
              <div style={{ width: 64, height: 64, border: '2px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--text-3)' }}>
                <SearchIcon size={28} />
              </div>
              <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-2)' }}>کتابی یافت نشد</p>
              <p style={{ fontSize: 13, marginTop: 6 }}>جستجو یا فیلتر دیگری را امتحان کنید</p>
            </div>
          )}
        </div>
      </section>

      {/* Physical Books Banner */}
      <section style={{ background: '#292524', direction: 'rtl', padding: '48px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(146,64,14,0.4)', border: '1px solid rgba(254,243,199,0.2)', padding: '5px 14px', marginBottom: 16 }}>
              <div style={{ width: 6, height: 6, background: '#FCD34D', borderRadius: '50%' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#FCD34D' }}>جدید</span>
            </div>
            <h2 style={{ fontSize: 'clamp(22px,3vw,36px)', fontWeight: 900, color: '#fff', lineHeight: 1.3, marginBottom: 12 }}>
              کتاب‌های چاپی<br />
              <span style={{ color: '#FCD34D' }}>با بهترین وضعیت</span>
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.9, maxWidth: 440, marginBottom: 28 }}>
              کتاب‌های چاپی در چهار درجه کیفیت — نو، در حد نو، خوانده شده و بسیار خوانده شده. ارسال به سراسر کشور با بسته‌بندی استاندارد.
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 28 }}>
              {[['نو', '#059669'], ['در حد نو', '#0284C7'], ['خوانده شده', '#D97706'], ['بسیار خوانده شده', '#DC2626']].map(([label, color]) => (
                <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                  <span style={{ width: 8, height: 8, background: color, display: 'inline-block', borderRadius: '50%' }} />
                  {label}
                </span>
              ))}
            </div>
            <Link to="/physical" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#92400E', color: '#FEF3C7', padding: '13px 28px', fontSize: 15, fontWeight: 700, transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#78350F'}
              onMouseLeave={e => e.currentTarget.style.background = '#92400E'}
            >مشاهده کتاب‌های چاپی <ArrowRightIcon size={16} /></Link>
          </div>
          {/* Decorative book stack */}
          <div className="hide-mobile" style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            {[{ h: 140, c: '#92400E' }, { h: 180, c: '#78350F' }, { h: 120, c: '#B45309' }, { h: 160, c: '#6B3A2A' }, { h: 100, c: '#92400E' }].map((b, i) => (
              <div key={i} style={{ width: 28, height: b.h, background: b.c, border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 2, height: '60%', background: 'rgba(255,255,255,0.1)' }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
