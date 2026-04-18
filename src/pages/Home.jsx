import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FestivalBanner from '../components/FestivalBanner';
import BookCard from '../components/BookCard';
import Footer from '../components/Footer';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/books';
import {
  SearchIcon, ChevronRightIcon, ChevronLeftIcon,
  ZapIcon, SmartphoneIcon, ShieldIcon, RefreshIcon, ArrowRightIcon,
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
        <div className="skeleton" style={{ height: 12, width: '70%', marginBottom: 12 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="skeleton" style={{ height: 20, width: 70 }} />
          <div className="skeleton" style={{ height: 32, width: 64 }} />
        </div>
      </div>
    </div>
  );
}

/* ── Featured slider ── */
function FeaturedSlider({ books }) {
  const [idx, setIdx] = useState(0);
  const [animating, setAnimating] = useState(false);
  const max = Math.max(0, books.length - 1);

  const go = useCallback((dir) => {
    if (animating) return;
    setAnimating(true);
    setIdx(i => dir === 'next' ? (i >= max ? 0 : i + 1) : (i <= 0 ? max : i - 1));
    setTimeout(() => setAnimating(false), 350);
  }, [animating, max]);

  // Auto-advance
  useEffect(() => {
    const t = setInterval(() => go('next'), 4000);
    return () => clearInterval(t);
  }, [go]);

  if (!books.length) return null;
  const book = books[idx];

  return (
    <div style={{ position: 'relative', overflow: 'hidden', background: 'var(--dark-2)', direction: 'rtl' }}>
      <style>{`
        .slider-content { display: grid; grid-template-columns: 1fr 260px; gap: 40px; align-items: center; max-width: 1280px; margin: 0 auto; padding: 40px 24px; }
        @media (max-width: 700px) { .slider-content { grid-template-columns: 1fr; gap: 20px; } .slider-cover { display: none; } }
      `}</style>

      <div className="slider-content" key={idx} style={{ animation: 'fadeIn 0.35s ease forwards' }}>
        <div>
          <div style={{ display: 'inline-block', background: 'var(--primary)', color: '#fff', padding: '3px 12px', fontSize: 11, fontWeight: 700, marginBottom: 16, letterSpacing: 1 }}>
            کتاب ویژه
          </div>
          <h2 style={{ fontSize: 'clamp(20px,3vw,32px)', fontWeight: 900, color: '#fff', lineHeight: 1.4, marginBottom: 12 }}>{book.title}</h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>{book.author}</p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, marginBottom: 24, maxWidth: 480 }} className="clamp-3">{book.shortDescription}</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--primary)' }}>{book.price.toLocaleString('fa-IR')} ت</span>
            <Link to={`/book/${book.id}`} style={{
              background: 'var(--primary)', color: '#fff',
              padding: '10px 24px', fontSize: 14, fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              مشاهده کتاب <ArrowRightIcon size={15} />
            </Link>
          </div>
        </div>
        <div className="slider-cover" style={{ width: 200, height: 270, margin: '0 auto', boxShadow: '8px 8px 0 rgba(0,0,0,0.4)', overflow: 'hidden', background: 'var(--primary-light)', flexShrink: 0 }}>
          <img src={book.cover} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
        </div>
      </div>

      {/* Nav buttons */}
      <button onClick={() => go('prev')} style={{
        position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
        background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
        color: '#fff', width: 38, height: 38, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.15s',
      }} onMouseEnter={e => e.currentTarget.style.background = 'var(--primary)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
        <ChevronRightIcon size={18} />
      </button>
      <button onClick={() => go('next')} style={{
        position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
        background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
        color: '#fff', width: 38, height: 38, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.15s',
      }} onMouseEnter={e => e.currentTarget.style.background = 'var(--primary)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
        <ChevronLeftIcon size={18} />
      </button>

      {/* Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, padding: '0 0 16px' }}>
        {books.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{
            width: i === idx ? 24 : 8, height: 8, background: i === idx ? 'var(--primary)' : 'rgba(255,255,255,0.25)',
            border: 'none', cursor: 'pointer', transition: 'all 0.25s',
          }} />
        ))}
      </div>
    </div>
  );
}

/* ── Category pill ── */
const CAT_COLORS = {
  'همه': { bg: 'var(--primary)', text: '#fff' },
  'برنامه‌نویسی': { bg: '#1D4ED8', text: '#fff' },
  'طراحی': { bg: '#7C3AED', text: '#fff' },
  'کسب‌وکار': { bg: '#D97706', text: '#fff' },
  'توسعه فردی': { bg: '#059669', text: '#fff' },
  'علم': { bg: '#DC2626', text: '#fff' },
};

export default function Home() {
  const { books } = useApp();
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
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(15,118,110,0.25)', border: '1px solid rgba(20,184,166,0.4)',
              padding: '5px 16px', marginBottom: 20,
            }}>
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
              <a href="#books" style={{
                background: 'var(--primary)', color: '#fff', padding: '13px 28px',
                fontSize: 15, fontWeight: 700, transition: 'background 0.2s',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--primary)'}
              >مشاهده کتاب‌ها <ArrowRightIcon size={16} /></a>
              <Link to="/blog" style={{
                background: 'rgba(255,255,255,0.08)', color: '#fff', padding: '13px 28px',
                fontSize: 15, fontWeight: 600, border: '1px solid rgba(255,255,255,0.15)',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              >بلاگ</Link>
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

          {/* Book stack */}
          <div className="hide-mobile" style={{ position: 'relative', width: 220, height: 280 }}>
            {featured.slice(0, 3).map((book, i) => (
              <div key={book.id} style={{
                position: 'absolute', top: i * 16, left: i * -10,
                width: 160, height: 210, overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                transform: `rotate(${[-4, 0, 4][i]}deg)`,
                zIndex: 3 - i, background: 'var(--primary-light)',
                transition: 'transform 0.3s',
              }}>
                <img src={book.cover} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section style={{ background: 'var(--dark-2)', direction: 'rtl', padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 16 }}>
          {features.map(({ icon, title, sub, color }) => (
            <div key={title} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#fff' }}>
              <div style={{ background: color + '22', border: `1px solid ${color}44`, color, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {icon}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{title}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 1 }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured slider */}
      <FeaturedSlider books={featured} />

      {/* All books */}
      <section id="books" style={{ background: 'var(--bg)', padding: '48px 24px', direction: 'rtl', flex: 1 }}>
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
            {['همه', ...CATEGORIES].map(c => {
              const active = cat === c;
              const color = CAT_COLORS[c] || { bg: 'var(--primary)', text: '#fff' };
              return (
                <button key={c} onClick={() => setCat(c)} style={{
                  padding: '7px 16px', fontSize: 13, fontWeight: 600,
                  border: '2px solid', cursor: 'pointer', transition: 'all 0.18s',
                  borderColor: active ? color.bg : 'var(--border)',
                  background: active ? color.bg : 'var(--surface)',
                  color: active ? color.text : 'var(--text-2)',
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

      <Footer />
    </div>
  );
}
