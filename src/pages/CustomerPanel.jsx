import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function CustomerPanel() {
  const { user, books, logout } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState('library');
  const [readingBook, setReadingBook] = useState(null);
  const [fontSize, setFontSize] = useState(16);
  const [darkReader, setDarkReader] = useState(false);

  const myBooks = books.filter(b => user.purchasedBooks?.includes(b.id));

  const navItems = [
    { id: 'library', icon: '📚', label: 'کتابخانه من' },
    { id: 'dashboard', icon: '🏠', label: 'داشبورد' },
    { id: 'profile', icon: '👤', label: 'پروفایل' },
  ];

  // Full screen reader
  if (readingBook) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: darkReader ? '#1a1714' : '#fff', zIndex: 300, display: 'flex', flexDirection: 'column', direction: 'rtl' }}>
        {/* Reader toolbar */}
        <div style={{ padding: '12px 20px', borderBottom: `1px solid ${darkReader ? 'rgba(255,255,255,0.1)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: darkReader ? '#252220' : '#f9f9f9', flexShrink: 0 }}>
          <button onClick={() => setReadingBook(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: darkReader ? '#C4B5FD' : 'var(--purple)', display: 'flex', alignItems: 'center', gap: 6 }}>
            ← بازگشت
          </button>
          <span style={{ fontSize: 14, fontWeight: 700, color: darkReader ? '#fff' : 'var(--text)' }}>{readingBook.title}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setFontSize(s => Math.max(12, s - 2))} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: darkReader ? '#fff' : 'var(--text-2)' }}>A−</button>
            <button onClick={() => setFontSize(s => Math.min(24, s + 2))} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, fontWeight: 700, color: darkReader ? '#fff' : 'var(--text-2)' }}>A+</button>
            <button onClick={() => setDarkReader(p => !p)} style={{ background: darkReader ? 'rgba(255,255,255,0.1)' : 'var(--bg)', border: 'none', cursor: 'pointer', borderRadius: 'var(--r-pill)', padding: '4px 12px', fontSize: 12, fontWeight: 600, color: darkReader ? '#fff' : 'var(--text-2)' }}>
              {darkReader ? '☀️ روشن' : '🌙 تاریک'}
            </button>
          </div>
        </div>
        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 'clamp(20px,4vw,60px) clamp(20px,10vw,120px)' }}>
          {readingBook.sampleContent ? (
            <div dangerouslySetInnerHTML={{ __html: readingBook.sampleContent }}
              style={{ fontSize, lineHeight: 2.1, color: darkReader ? '#E5E0D8' : 'var(--text)', fontFamily: "'Vazirmatn', Georgia, serif", maxWidth: 720, margin: '0 auto' }}
            />
          ) : (
            <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center', padding: '80px 0', color: darkReader ? '#888' : 'var(--text-3)' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>📖</div>
              <p style={{ fontSize: 17 }}>محتوای این کتاب در حال آماده‌سازی است</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', direction: 'rtl', display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{ width: 220, background: '#fff', borderLeft: '1px solid var(--border)', position: 'sticky', top: 0, height: '100vh', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '24px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 32 }}>📚</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--purple)' }}>کتاب‌خانه</span>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-3)', marginRight: 42 }}>پنل کاربری</p>
        </div>
        <nav style={{ flex: 1, padding: 12 }}>
          {navItems.map(n => (
            <button key={n.id} onClick={() => setTab(n.id)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 'var(--r-md)', border: 'none', cursor: 'pointer',
              background: tab === n.id ? 'var(--purple-light)' : 'transparent',
              color: tab === n.id ? 'var(--purple)' : 'var(--text-2)',
              fontSize: 14, fontWeight: tab === n.id ? 700 : 500,
              marginBottom: 4, transition: 'all 0.18s', textAlign: 'right',
            }}>
              <span style={{ fontSize: 18 }}>{n.icon}</span> {n.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: 12, borderTop: '1px solid var(--border)' }}>
          <button onClick={() => { logout(); navigate('/'); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 'var(--r-md)', border: 'none', cursor: 'pointer', background: '#FEF2F2', color: '#DC2626', fontSize: 13, fontWeight: 600 }}>
            🚪 خروج
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: 28, overflowY: 'auto' }}>
        {tab === 'dashboard' && (
          <div className="fade-in">
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>خوش آمدید، {user.name} 👋</h1>
            <p style={{ color: 'var(--text-3)', marginBottom: 28 }}>خلاصه فعالیت‌های شما</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
              {[
                { icon: '📚', value: myBooks.length, label: 'کتاب خریداری شده', color: 'var(--purple-light)', textColor: 'var(--purple)' },
                { icon: '🌟', value: '۴.۸', label: 'میانگین امتیاز', color: '#FEF3C7', textColor: '#B45309' },
                { icon: '⏰', value: '∞', label: 'دسترسی دائمی', color: '#D1FAE5', textColor: '#059669' },
              ].map(s => (
                <div key={s.label} style={{ background: s.color, borderRadius: 'var(--r-xl)', padding: 20 }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: s.textColor }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: s.textColor, opacity: 0.8, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
            {myBooks.length > 0 && (
              <div style={{ marginTop: 28 }}>
                <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16 }}>آخرین کتاب‌های من</h2>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {myBooks.slice(0, 4).map(b => (
                    <div key={b.id} onClick={() => setReadingBook(b)} style={{ display: 'flex', gap: 10, background: '#fff', borderRadius: 'var(--r-md)', padding: 12, cursor: 'pointer', border: '1px solid var(--border)', transition: 'box-shadow 0.2s', width: 200 }}
                      onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                    >
                      <div style={{ width: 40, height: 52, borderRadius: 6, overflow: 'hidden', background: 'var(--purple-light)', flexShrink: 0 }}>
                        <img src={b.cover} alt={b.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 12, fontWeight: 700 }} className="clamp-2">{b.title}</p>
                        <p style={{ fontSize: 10, color: 'var(--purple)', marginTop: 2 }}>📖 مطالعه</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'library' && (
          <div className="fade-in">
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>کتابخانه من</h1>
            <p style={{ color: 'var(--text-3)', marginBottom: 28 }}>{myBooks.length} کتاب خریداری شده</p>
            {myBooks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-3)' }}>
                <div style={{ fontSize: 56, marginBottom: 12 }}>📭</div>
                <p style={{ fontSize: 16, fontWeight: 600 }}>هنوز کتابی نخریده‌اید</p>
                <button onClick={() => navigate('/')} style={{ marginTop: 16, padding: '10px 24px', background: 'var(--purple)', color: '#fff', border: 'none', borderRadius: 'var(--r-pill)', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
                  مشاهده کتاب‌ها
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
                {myBooks.map(book => (
                  <div key={book.id} style={{ background: '#fff', borderRadius: 'var(--r-lg)', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ position: 'relative', paddingTop: '130%', background: 'var(--purple-light)', overflow: 'hidden' }}>
                      <img src={book.cover} alt={book.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', padding: '20px 12px 12px' }}>
                        <span style={{ color: '#fff', fontSize: 11, fontWeight: 600 }}>✓ در مجموعه شما</span>
                      </div>
                    </div>
                    <div style={{ padding: '12px 14px 14px' }}>
                      <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }} className="clamp-2">{book.title}</p>
                      <p style={{ fontSize: 11, color: 'var(--purple)', marginBottom: 12 }}>{book.author}</p>
                      <button onClick={() => setReadingBook(book)} style={{ width: '100%', background: 'var(--purple)', color: '#fff', border: 'none', borderRadius: 'var(--r-pill)', padding: '8px', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--purple-2)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'var(--purple)'}
                      >📖 شروع مطالعه</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'profile' && (
          <div className="fade-in" style={{ maxWidth: 480 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 28 }}>اطلاعات حساب</h1>
            <div style={{ background: '#fff', borderRadius: 'var(--r-xl)', padding: 28, border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--purple-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>👤</div>
                <div>
                  <p style={{ fontSize: 18, fontWeight: 800 }}>{user.name}</p>
                  <p style={{ fontSize: 13, color: 'var(--text-3)' }}>کاربر عادی</p>
                </div>
              </div>
              {[['📧 ایمیل', user.email], ['📚 کتاب‌ها', `${myBooks.length} کتاب`]].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
                  <span style={{ color: 'var(--text-3)' }}>{l}</span>
                  <span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
