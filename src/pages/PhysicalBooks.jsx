import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FestivalBanner from '../components/FestivalBanner';
import BookCard from '../components/BookCard';
import Footer from '../components/Footer';
import { useApp } from '../context/AppContext';
import { BOOK_CONDITIONS } from '../data/books';
import { SearchIcon, BookOpenIcon, CheckIcon, CartIcon, StarIcon } from '../components/Icons';

function ConditionBadge({ condition, large = false }) {
  const c = BOOK_CONDITIONS.find(x => x.value === condition);
  if (!c) return null;
  return (
    <span style={{
      display: 'inline-block',
      background: c.bg, color: c.color,
      border: `1px solid ${c.color}40`,
      padding: large ? '5px 14px' : '3px 9px',
      fontSize: large ? 13 : 11,
      fontWeight: 700,
    }}>
      {c.label}
    </span>
  );
}

function PhysicalBookCard({ book }) {
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
    addToCart({ ...book, selectedType: 'physical' });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div onClick={() => navigate(`/book/${book.id}`)}
      style={{
        background: 'var(--surface)', cursor: 'pointer',
        border: '1.5px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        transition: 'border-color 0.15s, box-shadow 0.15s, transform 0.15s',
        position: 'relative',
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
              <span style={{ fontSize: 11, fontWeight: 600, padding: '0 12px', textAlign: 'center' }}>{book.title}</span>
            </div>
        }
        {/* Category badge */}
        <span style={{ position: 'absolute', top: 0, right: 0, background: 'var(--dark)', color: '#fff', padding: '4px 8px', fontSize: 10, fontWeight: 700 }}>
          {book.category}
        </span>
        {/* Discount */}
        {discount > 0 && (
          <span style={{ position: 'absolute', top: 0, left: 0, background: 'var(--red)', color: '#fff', padding: '4px 8px', fontSize: 10, fontWeight: 800 }}>
            −{discount}%
          </span>
        )}
        {/* Condition badge */}
        {book.condition && (
          <div style={{ position: 'absolute', bottom: 8, right: 8 }}>
            <ConditionBadge condition={book.condition} />
          </div>
        )}
        {/* چاپی label */}
        <span style={{
          position: 'absolute', bottom: book.condition ? 32 : 8, left: 8,
          background: '#92400E', color: '#FEF3C7',
          padding: '2px 7px', fontSize: 9, fontWeight: 800, letterSpacing: 0.3,
        }}>چاپی</span>
      </div>

      {/* Info */}
      <div style={{ padding: '12px 13px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
        <p style={{ fontSize: 14, fontWeight: 800, lineHeight: 1.4 }} className="clamp-2">{book.title}</p>
        <p style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600 }}>{book.author}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ display: 'flex', color: '#D97706' }}>
            {[1,2,3,4,5].map(i => <StarIcon key={i} size={11} filled={i <= Math.round(book.rating)} />)}
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600 }}>{book.rating}</span>
        </div>
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
            background: owned ? 'var(--primary)' : (added ? 'var(--green)' : '#92400E'),
            color: '#fff', border: 'none',
            padding: '7px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
            transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: 5,
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => { if (!owned && !added) e.currentTarget.style.background = 'var(--primary)'; }}
          onMouseLeave={e => { if (!owned && !added) e.currentTarget.style.background = '#92400E'; }}
          >
            {owned ? <><CheckIcon size={13} /> ثبت شده</> : added ? <><CheckIcon size={13} /> افزوده شد</> : <><CartIcon size={13} /> سفارش</>}
          </button>
        </div>
      </div>
    </div>
  );
}

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

export default function PhysicalBooks() {
  const { books, bookCategories } = useApp();
  const [cat, setCat] = useState('همه');
  const [condition, setCondition] = useState('همه');
  const [sort, setSort] = useState('default');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const physicalBooks = useMemo(() => books.filter(b => b.type === 'physical' || b.type === 'both'), [books]);

  const filtered = useMemo(() => {
    let r = physicalBooks;
    if (cat !== 'همه') r = r.filter(b => b.category === cat);
    if (condition !== 'همه') r = r.filter(b => b.condition === condition);
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
    return r;
  }, [physicalBooks, cat, condition, sort, search]);

  const allCats = ['همه', ...(bookCategories || [])];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <FestivalBanner />
      <Navbar />

      {/* Hero strip */}
      <section style={{ background: '#292524', color: '#fff', direction: 'rtl', padding: '40px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
            <div style={{ background: '#92400E', padding: '8px 10px', display: 'flex' }}>
              <BookOpenIcon size={20} />
            </div>
            <div>
              <h1 style={{ fontSize: 'clamp(22px,3vw,34px)', fontWeight: 900, lineHeight: 1.2 }}>کتاب‌های چاپی</h1>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>کتاب واقعی، لمس واقعی — ارسال سریع به سراسر کشور</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', marginTop: 20, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            {[
              { label: 'وضعیت‌ها', value: '۴ درجه‌بندی دقیق' },
              { label: 'ارسال', value: 'سراسر ایران' },
              { label: 'بسته‌بندی', value: 'ایمن و استاندارد' },
              { label: 'موجودی', value: `${physicalBooks.length} کتاب` },
            ].map(i => (
              <div key={i.label}>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>{i.label}</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#FEF3C7' }}>{i.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Condition info strip */}
      <section style={{ background: '#FEF3C7', borderBottom: '1.5px solid #FCD34D', direction: 'rtl', padding: '10px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#92400E' }}>درجه‌بندی وضعیت:</span>
          {BOOK_CONDITIONS.map(c => (
            <span key={c.value} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: c.color, fontWeight: 600 }}>
              <span style={{ width: 8, height: 8, background: c.color, display: 'inline-block', borderRadius: '50%' }} />
              {c.label}
            </span>
          ))}
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
                placeholder="جستجو در عنوان، نویسنده..."
                style={{ width: '100%', padding: '10px 42px 10px 16px', border: '2px solid var(--border)', fontSize: 14, background: 'var(--surface)', outline: 'none', transition: 'border-color 0.2s', color: 'var(--text)' }}
                onFocus={e => e.target.style.borderColor = '#92400E'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <select value={sort} onChange={e => setSort(e.target.value)}
              style={{ padding: '10px 16px', border: '2px solid var(--border)', fontSize: 13, color: 'var(--text-2)', outline: 'none', background: 'var(--surface)', cursor: 'pointer' }}>
              <option value="default">مرتب‌سازی پیش‌فرض</option>
              <option value="price-asc">ارزان‌ترین</option>
              <option value="price-desc">گران‌ترین</option>
              <option value="rating">بهترین امتیاز</option>
            </select>
          </div>

          {/* Category + Condition filters */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-3)' }}>دسته‌بندی:</span>
            {allCats.map(c => (
              <button key={c} onClick={() => setCat(c)} style={{
                padding: '6px 14px', fontSize: 12, fontWeight: 600,
                border: '1.5px solid', cursor: 'pointer', transition: 'all 0.15s',
                borderColor: cat === c ? '#92400E' : 'var(--border)',
                background: cat === c ? '#92400E' : 'var(--surface)',
                color: cat === c ? '#fff' : 'var(--text-2)',
              }}>{c}</button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24, alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-3)' }}>وضعیت:</span>
            {[{ value: 'همه', label: 'همه' }, ...BOOK_CONDITIONS].map(c => (
              <button key={c.value} onClick={() => setCondition(c.value)} style={{
                padding: '6px 14px', fontSize: 12, fontWeight: 600,
                border: '1.5px solid', cursor: 'pointer', transition: 'all 0.15s',
                borderColor: condition === c.value ? (c.color || '#92400E') : 'var(--border)',
                background: condition === c.value ? (c.bg || '#FEF3C7') : 'var(--surface)',
                color: condition === c.value ? (c.color || '#92400E') : 'var(--text-2)',
              }}>{c.label}</button>
            ))}
          </div>

          <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 20 }}>
            {filtered.length} کتاب چاپی
          </p>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 22 }}>
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 22 }}>
              {filtered.map(b => <PhysicalBookCard key={b.id} book={b} />)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-3)' }}>
              <div style={{ width: 64, height: 64, border: '2px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--text-3)' }}>
                <SearchIcon size={28} />
              </div>
              <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-2)' }}>کتاب چاپی یافت نشد</p>
              <p style={{ fontSize: 13, marginTop: 6 }}>فیلتر دیگری را امتحان کنید</p>
              <button onClick={() => { setSearch(''); setCat('همه'); setCondition('همه'); }}
                style={{ marginTop: 16, padding: '9px 20px', background: '#92400E', color: '#FEF3C7', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
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
