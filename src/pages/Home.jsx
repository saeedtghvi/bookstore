import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FestivalBanner from '../components/FestivalBanner';
import BookCard from '../components/BookCard';
import Footer from '../components/Footer';
import { useApp } from '../context/AppContext';
import { CATEGORIES, BOOK_CONDITIONS } from '../data/books';
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
        .featured-grid { display: grid; grid-template-columns: 1fr 380px; gap: 0; max-width: 1280px; margin: 0 auto; min-height: 360px; }
        .featured-thumbs { display: flex; gap: 12px; flex-wrap: wrap; }
        @media (max-width: 860px) {
          .featured-grid { grid-template-columns: 1fr; }
          .featured-sidebar { border-right: none !important; border-top: 1.5px solid var(--border); padding: 20px 24px !important; }
        }
      `}</style>
      <div className="featured-grid">
        <div style={{ padding: '40px 40px 40px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }} key={active.id} className="fade-in">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <div style={{ width: 28, height: 3, background: 'var(--primary)' }} />
            <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--primary)', letterSpacing: 1 }}>کتاب ویژه</span>
          </div>
          <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>
            <div style={{ width: 140, height: 190, flexShrink: 0, overflow: 'hidden', background: 'var(--primary-light)', boxShadow: '5px 5px 0 var(--border)', position: 'relative' }}>
              <img src={active.cover} alt={active.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
              {discount > 0 && <div style={{ position: 'absolute', top: 0, right: 0, background: '#DC2626', color: '#fff', padding: '4px 8px', fontSize: 11, fontWeight: 800 }}>−{discount}%</div>}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ fontSize: 'clamp(18px,2.5vw,26px)', fontWeight: 900, lineHeight: 1.35, marginBottom: 8 }}>{active.title}</h2>
              <p style={{ fontSize: 14, color: 'var(--primary)', fontWeight: 700, marginBottom: 12 }}>{active.author}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
                <div style={{ display: 'flex', color: '#D97706' }}>{[1,2,3,4,5].map(i => <StarIcon key={i} size={14} filled={i <= Math.round(active.rating)} />)}</div>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{active.rating}</span>
                <span style={{ fontSize: 12, color: 'var(--text-3)' }}>({active.reviewCount?.toLocaleString('fa-IR')} نظر)</span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.9, marginBottom: 20 }} className="clamp-3">{active.shortDescription}</p>
              {active.tags?.length > 0 && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
                  {active.tags.slice(0, 4).map(t => <span key={t} style={{ fontSize: 11, padding: '3px 10px', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 600 }}>{t}</span>)}
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div>
                  <span style={{ fontSize: 24, fontWeight: 900 }}>{active.price.toLocaleString('fa-IR')}</span>
                  <span style={{ fontSize: 13, color: 'var(--text-3)', marginRight: 4 }}>تومان</span>
                  {active.originalPrice && <div style={{ fontSize: 12, color: 'var(--text-3)', textDecoration: 'line-through' }}>{active.originalPrice.toLocaleString('fa-IR')}</div>}
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => handleBuy(active)} style={{ background: owned ? 'var(--primary)' : (added[active.id] ? 'var(--green)' : 'var(--dark)'), color: '#fff', border: 'none', padding: '11px 22px', fontSize: 13, fontWeight: 800, cursor: 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: 7 }}
                    onMouseEnter={e => { if (!owned && !added[active.id]) e.currentTarget.style.background = 'var(--primary)'; }}
                    onMouseLeave={e => { if (!owned && !added[active.id]) e.currentTarget.style.background = 'var(--dark)'; }}>
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
        <div className="featured-sidebar" style={{ borderRight: '1.5px solid var(--border)', padding: '32px 24px', background: '#F2F0EB', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-3)', marginBottom: 4, letterSpacing: 1 }}>همه کتاب‌های ویژه</p>
          {books.map((book, i) => (
            <button key={book.id} onClick={() => setActiveIdx(i)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: i === activeIdx ? '#fff' : 'transparent', border: i === activeIdx ? '1.5px solid var(--primary)' : '1.5px solid transparent', cursor: 'pointer', textAlign: 'right', transition: 'all 0.18s', boxShadow: i === activeIdx ? '3px 3px 0 var(--primary-light)' : 'none' }}
              onMouseEnter={e => { if (i !== activeIdx) e.currentTarget.style.background = 'rgba(255,255,255,0.6)'; }}
              onMouseLeave={e => { if (i !== activeIdx) e.currentTarget.style.background = 'transparent'; }}>
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

/* ── Physical mini card ── */
function PhysicalCard({ book }) {
  const navigate = useNavigate();
  const { addToCart, hasPurchased } = useApp();
  const [added, setAdded] = useState(false);
  const [imgErr, setImgErr] = useState(false);
  const owned = hasPurchased(book.id);
  const cond = BOOK_CONDITIONS.find(c => c.value === book.condition);
  const price = book.physicalPrice || book.price;

  const handleBuy = (e) => {
    e.stopPropagation();
    if (owned) { navigate('/panel'); return; }
    addToCart({ ...book, price });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div onClick={() => navigate(`/book/${book.id}`)}
      style={{ background: '#fff', cursor: 'pointer', border: '1.5px solid #E5DDD5', display: 'flex', flexDirection: 'column', transition: 'border-color 0.15s, box-shadow 0.15s, transform 0.15s', position: 'relative' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#92400E'; e.currentTarget.style.boxShadow = '4px 4px 0 #FDE68A'; e.currentTarget.style.transform = 'translate(-2px,-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5DDD5'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
      {/* Cover */}
      <div style={{ position: 'relative', paddingTop: '145%', background: '#FEF3C7', overflow: 'hidden' }}>
        {!imgErr
          ? <img src={book.cover} alt={book.title} onError={() => setImgErr(true)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#92400E' }}><BookOpenIcon size={32} /></div>
        }
        <span style={{ position: 'absolute', top: 0, right: 0, background: '#292524', color: '#FEF3C7', padding: '4px 8px', fontSize: 10, fontWeight: 700 }}>{book.category}</span>
        {cond && (
          <span style={{ position: 'absolute', bottom: 0, right: 0, background: cond.color, color: '#fff', padding: '4px 10px', fontSize: 10, fontWeight: 800 }}>{cond.label}</span>
        )}
      </div>
      {/* Info */}
      <div style={{ padding: '12px 13px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
        <p style={{ fontSize: 14, fontWeight: 800, lineHeight: 1.4 }} className="clamp-2">{book.title}</p>
        <p style={{ fontSize: 12, color: '#92400E', fontWeight: 600 }}>{book.author}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
          <div style={{ display: 'flex', color: '#D97706' }}>{[1,2,3,4,5].map(i => <StarIcon key={i} size={10} filled={i <= Math.round(book.rating)} />)}</div>
          <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600 }}>{book.rating}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 8, gap: 8 }}>
          <div style={{ fontSize: 15, fontWeight: 900, color: '#292524' }}>
            {price.toLocaleString('fa-IR')}
            <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-3)', marginRight: 3 }}>ت</span>
          </div>
          <button onClick={handleBuy} style={{ background: owned ? '#92400E' : (added ? '#059669' : '#292524'), color: '#FEF3C7', border: 'none', padding: '7px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}
            onMouseEnter={e => { if (!owned && !added) e.currentTarget.style.background = '#92400E'; }}
            onMouseLeave={e => { if (!owned && !added) e.currentTarget.style.background = '#292524'; }}>
            {owned ? <><BookOpenIcon size={13} /> مطالعه</> : added ? <><CheckIcon size={13} /> افزوده شد</> : <><CartIcon size={13} /> خرید</>}
          </button>
        </div>
      </div>
    </div>
  );
}

const CAT_COLORS = {
  'رمان کلاسیک': { bg: '#1D4ED8', text: '#fff' },
  'برنامه‌نویسی': { bg: '#1D4ED8', text: '#fff' },
  'طراحی': { bg: '#7C3AED', text: '#fff' },
  'کسب‌وکار': { bg: '#D97706', text: '#fff' },
  'توسعه فردی': { bg: '#059669', text: '#fff' },
  'علم': { bg: '#DC2626', text: '#fff' },
};

const PHYSICAL_SHOW = 8;

export default function Home() {
  const { books, bookCategories, siteSettings } = useApp();
  const s = siteSettings || {};

  // digital filters
  const [dCat, setDCat] = useState('همه');
  const [dSort, setDSort] = useState('default');
  const [dSearch, setDSearch] = useState('');

  // physical filters
  const [pCat, setPCat] = useState('همه');
  const [pCond, setPCond] = useState('همه');
  const [showAllPhysical, setShowAllPhysical] = useState(false);

  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 700); return () => clearTimeout(t); }, []);

  const digitalBooks = useMemo(() => books.filter(b => b.type === 'digital' || b.type === 'both' || !b.type), [books]);
  const physicalBooks = useMemo(() => books.filter(b => b.type === 'physical' || b.type === 'both'), [books]);

  const filteredDigital = useMemo(() => {
    let r = digitalBooks;
    if (dCat !== 'همه') r = r.filter(b => b.category === dCat);
    if (dSearch.trim()) {
      const q = dSearch.toLowerCase();
      r = r.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || (b.tags || []).some(t => t.toLowerCase().includes(q)));
    }
    if (dSort === 'price-asc')  return [...r].sort((a, b) => a.price - b.price);
    if (dSort === 'price-desc') return [...r].sort((a, b) => b.price - a.price);
    if (dSort === 'rating')     return [...r].sort((a, b) => b.rating - a.rating);
    if (dSort === 'newest')     return [...r].sort((a, b) => b.id - a.id);
    return r;
  }, [digitalBooks, dCat, dSort, dSearch]);

  const filteredPhysical = useMemo(() => {
    let r = physicalBooks;
    if (pCat !== 'همه') r = r.filter(b => b.category === pCat);
    if (pCond !== 'همه') r = r.filter(b => b.condition === pCond);
    return r;
  }, [physicalBooks, pCat, pCond]);

  const shownPhysical = showAllPhysical ? filteredPhysical : filteredPhysical.slice(0, PHYSICAL_SHOW);

  const featured = books.filter(b => b.featured);
  const allCats = ['همه', ...(bookCategories || CATEGORIES)];

  const features = [
    { icon: <ZapIcon size={18} />, title: 'دسترسی فوری', sub: 'بلافاصله پس از خرید' },
    { icon: <SmartphoneIcon size={18} />, title: 'روی همه دستگاه‌ها', sub: 'موبایل، تبلت، لپ‌تاپ' },
    { icon: <ShieldIcon size={18} />, title: 'قیمت کمتر از چاپی', sub: 'تا ۵۰٪ ارزان‌تر' },
    { icon: <RefreshIcon size={18} />, title: 'آپدیت رایگان', sub: 'نسخه‌های جدید رایگان' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <FestivalBanner />
      <Navbar />

      {/* Hero */}
      <section style={{ background: 'var(--dark)', color: '#fff', direction: 'rtl', padding: 'clamp(48px,8vw,88px) 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, left: -80, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(15,118,110,0.35), transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: -60, right: 100, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,116,144,0.2), transparent 70%)' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'center' }}>
          <div className="fade-in">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(15,118,110,0.25)', border: '1px solid rgba(20,184,166,0.4)', padding: '5px 16px', marginBottom: 20 }}>
              <div style={{ width: 6, height: 6, background: 'var(--primary)', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#5EEAD4' }}>{s.heroBadge || 'نسل جدید کتاب‌های دیجیتال'}</span>
            </div>
            <h1 style={{ fontSize: 'clamp(28px,4.5vw,58px)', fontWeight: 900, lineHeight: 1.2, marginBottom: 20, letterSpacing: -1 }}>
              {s.heroTitle || 'کتاب‌های مورد علاقه‌تان را'}<br />
              <span style={{ color: 'var(--primary)' }}>{s.heroTitleAccent || 'با محیطی زیبا'}</span> {s.heroTitleEnd || 'بخوانید'}
            </h1>
            <p style={{ fontSize: 'clamp(14px,2vw,16px)', color: 'rgba(255,255,255,0.6)', lineHeight: 2, maxWidth: 480, marginBottom: 32 }}>
              {s.heroSubtitle || 'تجربه‌ای متفاوت از مطالعه — با امکانات پیشرفته، قیمتی کمتر از نسخه چاپی، و دسترسی فوری پس از خرید.'}
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href="#digital" style={{ background: 'var(--primary)', color: '#fff', padding: '13px 28px', fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                {s.heroDigitalBtn || 'کتاب‌های دیجیتال'} <ArrowRightIcon size={16} />
              </a>
              <a href="#physical" style={{ background: 'rgba(255,255,255,0.08)', color: '#FEF3C7', padding: '13px 28px', fontSize: 15, fontWeight: 700, border: '1px solid rgba(254,243,199,0.3)', display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                {s.heroPhysicalBtn || 'کتاب‌های چاپی'} <ArrowRightIcon size={16} />
              </a>
            </div>
            <div style={{ display: 'flex', gap: 32, marginTop: 40, flexWrap: 'wrap' }}>
              {[[s.heroStat1||'۸+', s.heroStat1Label||'کتاب دیجیتال'], [s.heroStat2||'۲۴+', s.heroStat2Label||'هزار خواننده'], [s.heroStat3||'۴.۸', s.heroStat3Label||'میانگین امتیاز']].map(([n, l]) => (
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

      {/* Features strip */}
      <section style={{ background: 'var(--primary)', direction: 'rtl', padding: '16px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 16 }}>
          {features.map(({ icon, title, sub }) => (
            <div key={title} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#fff' }}>
              <div style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{title}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 1 }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && <FeaturedSection books={featured} />}

      {/* ═══════════════════════════════════════════
          DIGITAL BOOKS SECTION
      ═══════════════════════════════════════════ */}
      <section id="digital" style={{ background: '#fff', padding: '56px 24px 48px', direction: 'rtl' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>

          {/* Section header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 4, height: 28, background: 'var(--primary)' }} />
                <h2 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text)' }}>کتاب‌های دیجیتال</h2>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-3)', marginRight: 12 }}>{digitalBooks.length} عنوان — دسترسی فوری پس از خرید</p>
            </div>
            <Link to="/digital" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: 'var(--primary)', border: '1.5px solid var(--primary)', padding: '8px 16px', textDecoration: 'none', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--primary)'; }}>
              مشاهده همه <ArrowRightIcon size={14} />
            </Link>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
              <div style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none' }}><SearchIcon size={15} /></div>
              <input value={dSearch} onChange={e => setDSearch(e.target.value)} placeholder="جستجو در کتاب‌های دیجیتال..."
                style={{ width: '100%', padding: '9px 40px 9px 14px', border: '2px solid var(--border)', fontSize: 13, background: 'var(--surface)', outline: 'none', color: 'var(--text)', transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            </div>
            <select value={dSort} onChange={e => setDSort(e.target.value)} style={{ padding: '9px 14px', border: '2px solid var(--border)', fontSize: 13, color: 'var(--text-2)', outline: 'none', background: 'var(--surface)', cursor: 'pointer' }}>
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
              const active = dCat === c;
              const color = CAT_COLORS[c] || { bg: 'var(--primary)', text: '#fff' };
              return (
                <button key={c} onClick={() => setDCat(c)} style={{ padding: '6px 14px', fontSize: 12, fontWeight: 600, border: '2px solid', cursor: 'pointer', transition: 'all 0.15s', borderColor: active ? (c === 'همه' ? 'var(--primary)' : color.bg) : 'var(--border)', background: active ? (c === 'همه' ? 'var(--primary)' : color.bg) : 'var(--surface)', color: active ? (c === 'همه' ? '#fff' : color.text) : 'var(--text-2)' }}>{c}</button>
              );
            })}
          </div>

          <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 20 }}>{filteredDigital.length} کتاب</p>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 22 }}>
              {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filteredDigital.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 22 }}>
              {filteredDigital.map(b => <BookCard key={b.id} book={b} />)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-3)' }}>
              <div style={{ width: 56, height: 56, border: '2px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', color: 'var(--text-3)' }}><SearchIcon size={24} /></div>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-2)' }}>کتابی یافت نشد</p>
              <p style={{ fontSize: 13, marginTop: 6 }}>فیلتر دیگری را امتحان کنید</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PHYSICAL BOOKS SECTION
      ═══════════════════════════════════════════ */}
      {physicalBooks.length > 0 && (
        <section id="physical" style={{ background: '#FBF7F2', borderTop: '2px solid #E5DDD5', padding: '56px 24px 56px', direction: 'rtl' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>

            {/* Section header */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 4, height: 28, background: '#92400E' }} />
                  <h2 style={{ fontSize: 24, fontWeight: 900, color: '#292524' }}>کتاب‌های چاپی</h2>
                </div>
                <p style={{ fontSize: 13, color: '#78716C', marginRight: 12 }}>{physicalBooks.length} عنوان — ارسال به سراسر کشور</p>
              </div>
              <Link to="/physical" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#92400E', border: '1.5px solid #92400E', padding: '8px 16px', textDecoration: 'none', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#92400E'; e.currentTarget.style.color = '#FEF3C7'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#92400E'; }}>
                مشاهده همه <ArrowRightIcon size={14} />
              </Link>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20, alignItems: 'center' }}>
              {/* Condition filter */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <button onClick={() => setPCond('همه')} style={{ padding: '6px 14px', fontSize: 12, fontWeight: 600, border: '2px solid', cursor: 'pointer', transition: 'all 0.15s', borderColor: pCond === 'همه' ? '#92400E' : '#E5DDD5', background: pCond === 'همه' ? '#92400E' : '#fff', color: pCond === 'همه' ? '#FEF3C7' : '#78716C' }}>همه وضعیت‌ها</button>
                {BOOK_CONDITIONS.map(c => (
                  <button key={c.value} onClick={() => setPCond(c.value)} style={{ padding: '6px 14px', fontSize: 12, fontWeight: 700, border: '2px solid', cursor: 'pointer', transition: 'all 0.15s', borderColor: pCond === c.value ? c.color : '#E5DDD5', background: pCond === c.value ? c.color : '#fff', color: pCond === c.value ? '#fff' : '#78716C' }}>{c.label}</button>
                ))}
              </div>
              {/* Divider */}
              <div style={{ width: 1, height: 28, background: '#E5DDD5', margin: '0 4px' }} />
              {/* Category filter */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {allCats.map(c => (
                  <button key={c} onClick={() => setPCat(c)} style={{ padding: '6px 14px', fontSize: 12, fontWeight: 600, border: '2px solid', cursor: 'pointer', transition: 'all 0.15s', borderColor: pCat === c ? '#92400E' : '#E5DDD5', background: pCat === c ? '#FEF3C7' : '#fff', color: pCat === c ? '#92400E' : '#78716C' }}>{c}</button>
                ))}
              </div>
            </div>

            <p style={{ fontSize: 13, color: '#78716C', marginBottom: 20 }}>{filteredPhysical.length} کتاب</p>

            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 22 }}>
                {[...Array(PHYSICAL_SHOW)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : shownPhysical.length > 0 ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 22 }}>
                  {shownPhysical.map(b => <PhysicalCard key={b.id} book={b} />)}
                </div>
                {/* Show more / See all */}
                {filteredPhysical.length > PHYSICAL_SHOW && (
                  <div style={{ textAlign: 'center', marginTop: 36 }}>
                    {!showAllPhysical ? (
                      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button onClick={() => setShowAllPhysical(true)} style={{ background: '#292524', color: '#FEF3C7', border: 'none', padding: '12px 32px', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                          نمایش {filteredPhysical.length - PHYSICAL_SHOW} کتاب بیشتر
                        </button>
                        <Link to="/physical" style={{ background: '#92400E', color: '#FEF3C7', padding: '12px 28px', fontSize: 14, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                          صفحه کامل کتاب‌های چاپی <ArrowRightIcon size={15} />
                        </Link>
                      </div>
                    ) : (
                      <Link to="/physical" style={{ background: '#92400E', color: '#FEF3C7', padding: '12px 32px', fontSize: 14, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                        صفحه کامل کتاب‌های چاپی <ArrowRightIcon size={15} />
                      </Link>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#78716C' }}>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#44403C' }}>کتابی با این فیلتر یافت نشد</p>
                <p style={{ fontSize: 13, marginTop: 6 }}>فیلتر دیگری را امتحان کنید</p>
              </div>
            )}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
