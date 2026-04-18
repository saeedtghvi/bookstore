import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FestivalBanner from '../components/FestivalBanner';
import BookCard from '../components/BookCard';
import Footer from '../components/Footer';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/books';

export default function Home() {
  const { books } = useApp();
  const [cat, setCat] = useState('همه');
  const [sort, setSort] = useState('default');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let r = books;
    if (cat !== 'همه') r = r.filter(b => b.category === cat);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
    }
    if (sort === 'price-asc') return [...r].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') return [...r].sort((a, b) => b.price - a.price);
    if (sort === 'rating') return [...r].sort((a, b) => b.rating - a.rating);
    return r;
  }, [books, cat, sort, search]);

  const featured = books.filter(b => b.featured).slice(0, 4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <FestivalBanner />
      <Navbar />

      {/* Hero */}
      <section style={{
        background: 'var(--dark)', color: '#fff', direction: 'rtl',
        padding: 'clamp(48px,8vw,96px) 24px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -80, left: -80, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(91,33,182,0.3), transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: -60, right: 100, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(185,83,9,0.2), transparent 70%)' }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'center' }}>
          <div>
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(91,33,182,0.3)', border: '1px solid rgba(91,33,182,0.5)',
              borderRadius: 'var(--r-pill)', padding: '5px 16px', marginBottom: 20,
            }}>
              <span style={{ fontSize: 14 }}>✨</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#C4B5FD' }}>نسل جدید کتاب‌های دیجیتال</span>
            </div>

            <h1 style={{ fontSize: 'clamp(32px,5vw,60px)', fontWeight: 900, lineHeight: 1.15, marginBottom: 20, letterSpacing: -1 }}>
              کتاب‌های مورد علاقه‌تان را<br />
              <span style={{ color: '#C4B5FD' }}>با محیطی زیبا</span> بخوانید
            </h1>
            <p style={{ fontSize: 'clamp(14px,2vw,17px)', color: 'rgba(255,255,255,0.65)', lineHeight: 2, maxWidth: 500, marginBottom: 32 }}>
              تجربه‌ای متفاوت از مطالعه — با امکانات پیشرفته، قیمتی کمتر از نسخه چاپی، و دسترسی فوری پس از خرید.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href="#books" style={{
                background: 'var(--purple)', color: '#fff', padding: '13px 28px',
                borderRadius: 'var(--r-pill)', fontSize: 15, fontWeight: 700, transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--purple-2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--purple)'}
              >مشاهده کتاب‌ها ↓</a>
              <Link to="/blog" style={{
                background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '13px 28px',
                borderRadius: 'var(--r-pill)', fontSize: 15, fontWeight: 600,
                border: '1px solid rgba(255,255,255,0.2)', transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              >بلاگ</Link>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 32, marginTop: 40, flexWrap: 'wrap' }}>
              {[['۸+', 'کتاب دیجیتال'], ['۲۴+', 'هزار خواننده'], ['۴.۸', 'میانگین امتیاز']].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: '#C4B5FD' }}>{n}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero book stack */}
          <div className="hide-mobile" style={{ position: 'relative', width: 220, height: 280 }}>
            {featured.slice(0, 3).map((book, i) => (
              <div key={book.id} style={{
                position: 'absolute',
                top: i * 16, left: i * -10,
                width: 160, height: 210,
                borderRadius: 12, overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                transform: `rotate(${[-4, 0, 4][i]}deg)`,
                zIndex: 3 - i, background: 'var(--purple-light)',
              }}>
                <img src={book.cover} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section style={{ background: 'var(--dark-2)', direction: 'rtl', padding: '20px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 16 }}>
          {[
            ['💰', 'قیمت کمتر از چاپی', 'تا ۵۰٪ ارزان‌تر'],
            ['⚡', 'دسترسی فوری', 'بلافاصله پس از خرید'],
            ['📱', 'روی همه دستگاه‌ها', 'موبایل، تبلت، لپ‌تاپ'],
            ['🔁', 'آپدیت رایگان', 'نسخه‌های جدید رایگان'],
          ].map(([icon, title, sub]) => (
            <div key={title} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#fff' }}>
              <span style={{ fontSize: 22, background: 'rgba(255,255,255,0.1)', borderRadius: 10, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{title}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section style={{ background: 'var(--bg)', padding: '48px 24px', direction: 'rtl' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800 }}>کتاب‌های ویژه</h2>
              <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 4 }}>انتخاب‌های برتر هفته</p>
            </div>
            <a href="#books" style={{ fontSize: 13, color: 'var(--purple)', fontWeight: 600 }}>همه کتاب‌ها ←</a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
            {featured.map(b => <BookCard key={b.id} book={b} />)}
          </div>
        </div>
      </section>

      {/* All books with filter */}
      <section id="books" style={{ background: '#fff', padding: '48px 24px', direction: 'rtl', flex: 1 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>همه کتاب‌ها</h2>

          {/* Search + Sort */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
              <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: 'var(--text-3)', pointerEvents: 'none' }}>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="جستجو در کتاب‌ها..."
                style={{ width: '100%', padding: '10px 42px 10px 16px', border: '2px solid var(--border)', borderRadius: 'var(--r-pill)', fontSize: 14, background: 'var(--bg)', outline: 'none', transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = 'var(--purple)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: '10px 16px', borderRadius: 'var(--r-pill)', border: '2px solid var(--border)', fontSize: 13, color: 'var(--text-2)', outline: 'none', background: 'var(--bg)', cursor: 'pointer' }}>
              <option value="default">مرتب‌سازی</option>
              <option value="price-asc">ارزان‌ترین</option>
              <option value="price-desc">گران‌ترین</option>
              <option value="rating">بهترین امتیاز</option>
            </select>
          </div>

          {/* Category filter */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCat(c)} style={{
                padding: '6px 16px', borderRadius: 'var(--r-pill)', fontSize: 13, fontWeight: 600,
                border: '2px solid', cursor: 'pointer', transition: 'all 0.18s',
                borderColor: cat === c ? 'var(--purple)' : 'var(--border)',
                background: cat === c ? 'var(--purple)' : '#fff',
                color: cat === c ? '#fff' : 'var(--text-2)',
              }}>{c}</button>
            ))}
          </div>

          <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 20 }}>{filtered.length} کتاب</p>

          {filtered.length > 0
            ? <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 22 }}>
                {filtered.map(b => <BookCard key={b.id} book={b} />)}
              </div>
            : <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-3)' }}>
                <div style={{ fontSize: 56 }}>🔍</div>
                <p style={{ fontSize: 16, fontWeight: 600, marginTop: 12 }}>کتابی یافت نشد</p>
              </div>
          }
        </div>
      </section>

      <Footer />
    </div>
  );
}
