import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FestivalBanner from '../components/FestivalBanner';
import BookCard from '../components/BookCard';
import Footer from '../components/Footer';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/books';
import { SearchIcon, BookOpenIcon, ZapIcon, SmartphoneIcon, ShieldIcon, RefreshIcon } from '../components/Icons';

function SkeletonCard() {
  return (
    <div style={{ border: '1.5px solid var(--border)', background: 'var(--surface)' }}>
      <div className="skeleton" style={{ paddingTop: '145%' }} />
      <div style={{ padding: '12px 13px 14px' }}>
        <div className="skeleton" style={{ height: 16, width: '80%', marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 12, width: '50%', marginBottom: 8 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
          <div className="skeleton" style={{ height: 20, width: 70 }} />
          <div className="skeleton" style={{ height: 32, width: 64 }} />
        </div>
      </div>
    </div>
  );
}

export default function DigitalBooks() {
  const { books, bookCategories } = useApp();
  const navigate = useNavigate();
  const [cat, setCat] = useState('همه');
  const [sort, setSort] = useState('default');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  // فقط کتاب‌های دیجیتال یا هر دو نوع
  const digitalBooks = useMemo(() => books.filter(b => !b.type || b.type === 'digital' || b.type === 'both'), [books]);

  const filtered = useMemo(() => {
    let r = digitalBooks;
    if (cat !== 'همه') r = r.filter(b => b.category === cat);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        (b.tags || []).some(t => t.toLowerCase().includes(q))
      );
    }
    if (sort === 'price-asc')  return [...r].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') return [...r].sort((a, b) => b.price - a.price);
    if (sort === 'rating')     return [...r].sort((a, b) => b.rating - a.rating);
    if (sort === 'newest')     return [...r].sort((a, b) => b.id - a.id);
    return r;
  }, [digitalBooks, cat, sort, search]);

  const allCats = ['همه', ...(bookCategories || CATEGORIES)];

  const features = [
    { icon: <ZapIcon size={16} />, title: 'دسترسی فوری', sub: 'بلافاصله پس از خرید' },
    { icon: <SmartphoneIcon size={16} />, title: 'همه دستگاه‌ها', sub: 'موبایل، تبلت، لپ‌تاپ' },
    { icon: <ShieldIcon size={16} />, title: 'قیمت مناسب', sub: 'تا ۵۰٪ ارزان‌تر از چاپی' },
    { icon: <RefreshIcon size={16} />, title: 'آپدیت رایگان', sub: 'نسخه‌های جدید رایگان' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <FestivalBanner />
      <Navbar />

      {/* Hero strip */}
      <section style={{ background: 'var(--dark)', color: '#fff', direction: 'rtl', padding: '40px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
            <div style={{ background: 'var(--primary)', padding: '8px 10px', display: 'flex' }}>
              <BookOpenIcon size={20} />
            </div>
            <div>
              <h1 style={{ fontSize: 'clamp(22px,3vw,34px)', fontWeight: 900, lineHeight: 1.2 }}>کتاب‌های الکترونیک</h1>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>بخوانید، هر جا، هر زمان — بدون کاغذ</p>
            </div>
          </div>

          {/* Features */}
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 20, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            {features.map(f => (
              <div key={f.title} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.8)' }}>
                <div style={{ color: 'var(--primary)' }}>{f.icon}</div>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700 }}>{f.title}</p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 1 }}>{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Books section */}
      <section style={{ background: '#fff', padding: '40px 24px', direction: 'rtl', flex: 1 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>

          {/* Search + Sort */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
              <div style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none' }}>
                <SearchIcon size={16} />
              </div>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="جستجو در عنوان، نویسنده، موضوع..."
                style={{ width: '100%', padding: '10px 42px 10px 16px', border: '2px solid var(--border)', fontSize: 14, background: 'var(--surface)', outline: 'none', transition: 'border-color 0.2s', color: 'var(--text)' }}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <select value={sort} onChange={e => setSort(e.target.value)}
              style={{ padding: '10px 16px', border: '2px solid var(--border)', fontSize: 13, color: 'var(--text-2)', outline: 'none', background: 'var(--surface)', cursor: 'pointer' }}>
              <option value="default">مرتب‌سازی پیش‌فرض</option>
              <option value="price-asc">ارزان‌ترین</option>
              <option value="price-desc">گران‌ترین</option>
              <option value="rating">بهترین امتیاز</option>
              <option value="newest">جدیدترین</option>
            </select>
          </div>

          {/* Category filter */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
            {allCats.map(c => (
              <button key={c} onClick={() => setCat(c)} style={{
                padding: '7px 16px', fontSize: 13, fontWeight: 600,
                border: '2px solid', cursor: 'pointer', transition: 'all 0.18s',
                borderColor: cat === c ? 'var(--primary)' : 'var(--border)',
                background: cat === c ? 'var(--primary)' : 'var(--surface)',
                color: cat === c ? '#fff' : 'var(--text-2)',
              }}>{c}</button>
            ))}
          </div>

          <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 20 }}>
            {filtered.length} کتاب الکترونیک
          </p>

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
              <button onClick={() => { setSearch(''); setCat('همه'); }} style={{ marginTop: 16, padding: '9px 20px', background: 'var(--primary)', color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                حذف فیلترها
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
