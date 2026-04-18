import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import BookCard from './components/BookCard';
import Cart from './components/Cart';
import FestivalBanner from './components/FestivalBanner';
import { books, categories } from './data/books';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('همه');
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [sortBy, setSortBy] = useState('default');

  // Filter & Sort books
  const filteredBooks = useMemo(() => {
    let result = books;

    if (selectedCategory !== 'همه') {
      result = result.filter(b => b.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-asc') result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') result = [...result].sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') result = [...result].sort((a, b) => b.rating - a.rating);

    return result;
  }, [searchQuery, selectedCategory, sortBy]);

  const handleAddToCart = (book) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === book.id);
      if (existing) {
        return prev.map(i => i.id === book.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...book, qty: 1 }];
    });
  };

  const handleRemoveFromCart = (id) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  const handleUpdateQty = (id, qty) => {
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  };

  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);

  return (
    <div>
      <Navbar
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Festival countdown banner */}
      <FestivalBanner />

      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #0ea5e9 100%)',
        padding: '60px 24px',
        textAlign: 'center',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 40%)'
        }} />
        <div style={{ position: 'relative' }}>
          {/* Tag line */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: '50px',
            padding: '6px 18px',
            marginBottom: '20px'
          }}>
            <span style={{ fontSize: '16px' }}>✨</span>
            <span style={{ fontSize: '13px', fontWeight: '600', letterSpacing: '0.5px' }}>
              نسل جدید کتاب‌های دیجیتال
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 52px)',
            fontWeight: '800',
            marginBottom: '16px',
            lineHeight: '1.2'
          }}>
            📚 کتاب‌خانه آنلاین
          </h1>
          <p style={{
            fontSize: 'clamp(14px, 2vw, 18px)',
            opacity: 0.9,
            maxWidth: '580px',
            margin: '0 auto',
            lineHeight: '2'
          }}>
            کتاب‌های HTML با امکانات پیشرفته — نه PDF ساده<br />
            <span style={{ opacity: 0.75, fontSize: '0.9em' }}>
              با قیمتی کمتر از نسخه چاپی و PDF
            </span>
          </p>

          {/* Feature badges */}
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            marginTop: '28px',
            flexWrap: 'wrap'
          }}>
            {[
              { icon: '🖥️', label: 'خواندن آنلاین', sub: 'در پنل کاربری' },
              { icon: '💡', label: 'امکانات پیشرفته', sub: 'جستجو، نشانه‌گذاری، فونت' },
              { icon: '💰', label: 'قیمت مناسب‌تر', sub: 'از چاپی و PDF' }
            ].map(item => (
              <div key={item.label} style={{
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '14px',
                padding: '14px 20px',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.2)',
                minWidth: '140px'
              }}>
                <div style={{ fontSize: '26px', marginBottom: '6px' }}>{item.icon}</div>
                <div style={{ fontWeight: '700', fontSize: '14px' }}>{item.label}</div>
                <div style={{ fontSize: '11px', opacity: 0.75, marginTop: '2px' }}>{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Filters & Sort */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '24px',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Categories */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '7px 16px',
                  borderRadius: '50px',
                  border: '2px solid',
                  borderColor: selectedCategory === cat ? '#7c3aed' : '#e5e7eb',
                  background: selectedCategory === cat ? '#7c3aed' : 'white',
                  color: selectedCategory === cat ? 'white' : '#6b7280',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '8px 16px',
              borderRadius: '50px',
              border: '2px solid #e5e7eb',
              fontSize: '13px',
              color: '#6b7280',
              outline: 'none',
              cursor: 'pointer',
              background: 'white',
              direction: 'rtl'
            }}
          >
            <option value="default">مرتب‌سازی پیش‌فرض</option>
            <option value="price-asc">قیمت: کم به زیاد</option>
            <option value="price-desc">قیمت: زیاد به کم</option>
            <option value="rating">بهترین امتیاز</option>
          </select>
        </div>

        {/* Results count */}
        <p style={{
          fontSize: '14px',
          color: '#9ca3af',
          marginBottom: '20px'
        }}>
          {filteredBooks.length} کتاب یافت شد
        </p>

        {/* Books Grid */}
        {filteredBooks.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '24px'
          }}>
            {filteredBooks.map(book => (
              <BookCard
                key={book.id}
                book={book}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '80px 24px',
            color: '#9ca3af'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
            <p style={{ fontSize: '18px', fontWeight: '600' }}>کتابی یافت نشد</p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>عبارت جستجو یا دسته‌بندی را تغییر دهید</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{
        background: '#1e1b4b',
        color: 'white',
        textAlign: 'center',
        padding: '32px 24px',
        marginTop: '40px'
      }}>
        <p style={{ fontSize: '24px', marginBottom: '8px' }}>📚</p>
        <p style={{ fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>کتاب‌خانه آنلاین</p>
        <p style={{ fontSize: '12px', opacity: 0.5 }}>© ۱۴۰۳ — با ❤️ ساخته شده</p>
      </footer>

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemove={handleRemoveFromCart}
        onUpdateQty={handleUpdateQty}
      />
    </div>
  );
}

export default App;
