import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BookOpenIcon, HomeIcon, UserIcon, LogOutIcon, CheckIcon, SunIcon, MoonIcon, PlusIcon, MinusIcon } from '../components/Icons';

export default function CustomerPanel() {
  const { user, books, logout } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState('library');
  const [readingBook, setReadingBook] = useState(null);
  const [fontSize, setFontSize] = useState(16);
  const [darkReader, setDarkReader] = useState(false);

  const myBooks = books.filter(b => user.purchasedBooks?.includes(b.id));

  const navItems = [
    { id: 'library', icon: <BookOpenIcon size={16} />, label: 'کتابخانه من' },
    { id: 'dashboard', icon: <HomeIcon size={16} />, label: 'داشبورد' },
    { id: 'profile', icon: <UserIcon size={16} />, label: 'پروفایل' },
  ];

  // Full-screen reader
  if (readingBook) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: darkReader ? '#1a1714' : '#faf9f6', zIndex: 300, display: 'flex', flexDirection: 'column', direction: 'rtl' }}>
        {/* Toolbar */}
        <div style={{
          padding: '0 20px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: `1.5px solid ${darkReader ? 'rgba(255,255,255,0.08)' : 'var(--border)'}`,
          background: darkReader ? '#252220' : '#fff', flexShrink: 0,
        }}>
          <button onClick={() => setReadingBook(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: darkReader ? 'var(--primary-2)' : 'var(--primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
            ← بازگشت
          </button>
          <span style={{ fontSize: 13, fontWeight: 700, color: darkReader ? '#fff' : 'var(--text)' }} className="clamp-1">{readingBook.title}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Font size */}
            <div style={{ display: 'flex', alignItems: 'center', border: `1.5px solid ${darkReader ? 'rgba(255,255,255,0.15)' : 'var(--border)'}` }}>
              <button onClick={() => setFontSize(s => Math.max(12, s - 2))} style={{ width: 32, height: 32, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: darkReader ? '#fff' : 'var(--text-2)' }}>
                <MinusIcon size={13} />
              </button>
              <span style={{ fontSize: 12, fontWeight: 700, minWidth: 28, textAlign: 'center', color: darkReader ? '#fff' : 'var(--text)', borderLeft: `1px solid ${darkReader ? 'rgba(255,255,255,0.1)' : 'var(--border)'}`, borderRight: `1px solid ${darkReader ? 'rgba(255,255,255,0.1)' : 'var(--border)'}`, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{fontSize}</span>
              <button onClick={() => setFontSize(s => Math.min(24, s + 2))} style={{ width: 32, height: 32, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: darkReader ? '#fff' : 'var(--text-2)' }}>
                <PlusIcon size={13} />
              </button>
            </div>
            {/* Dark mode */}
            <button onClick={() => setDarkReader(p => !p)} style={{
              background: darkReader ? 'rgba(255,255,255,0.1)' : 'var(--bg)',
              border: `1.5px solid ${darkReader ? 'rgba(255,255,255,0.15)' : 'var(--border)'}`,
              cursor: 'pointer', padding: '6px 12px', fontSize: 12, fontWeight: 600,
              color: darkReader ? '#fff' : 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 6,
            }}>
              {darkReader ? <SunIcon size={13} /> : <MoonIcon size={13} />}
              {darkReader ? 'روشن' : 'تاریک'}
            </button>
          </div>
        </div>
        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 'clamp(24px,5vw,64px) clamp(20px,12vw,140px)' }}>
          {readingBook.sampleContent ? (
            <div dangerouslySetInnerHTML={{ __html: readingBook.sampleContent }}
              style={{ fontSize, lineHeight: 2.1, color: darkReader ? '#E5E0D8' : 'var(--text)', fontFamily: "'Vazirmatn', Georgia, serif", maxWidth: 700, margin: '0 auto' }}
            />
          ) : (
            <div style={{ maxWidth: 600, margin: '80px auto', textAlign: 'center', color: darkReader ? 'rgba(255,255,255,0.3)' : 'var(--text-3)' }}>
              <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}><BookOpenIcon size={48} /></div>
              <p style={{ fontSize: 16 }}>محتوای این کتاب در حال آماده‌سازی است</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', direction: 'rtl', display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{ width: 210, background: '#fff', borderLeft: '1.5px solid var(--border)', position: 'sticky', top: 0, height: '100vh', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
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
      <main style={{ flex: 1, padding: 28, overflowY: 'auto' }}>

        {/* DASHBOARD */}
        {tab === 'dashboard' && (
          <div className="fade-in">
            <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>خوش آمدید، {user.name}</h1>
            <p style={{ color: 'var(--text-3)', marginBottom: 28, fontSize: 13 }}>خلاصه حساب شما</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 14, marginBottom: 32 }}>
              {[
                { icon: <BookOpenIcon size={20} />, value: myBooks.length, label: 'کتاب خریداری شده', bg: 'var(--primary-light)', tc: 'var(--primary)' },
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
                <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <BookOpenIcon size={15} /> کتاب‌های اخیر
                </h2>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {myBooks.slice(0, 4).map(b => (
                    <div key={b.id} onClick={() => setReadingBook(b)}
                      style={{ display: 'flex', gap: 10, background: '#fff', padding: 12, cursor: 'pointer', border: '1.5px solid var(--border)', width: 200, transition: 'border-color 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                    >
                      <div style={{ width: 36, height: 48, background: 'var(--primary-light)', flexShrink: 0, overflow: 'hidden' }}>
                        <img src={b.cover} alt={b.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 12, fontWeight: 700 }} className="clamp-2">{b.title}</p>
                        <p style={{ fontSize: 10, color: 'var(--primary)', marginTop: 4, fontWeight: 600 }}>مطالعه ←</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* LIBRARY */}
        {tab === 'library' && (
          <div className="fade-in">
            <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>کتابخانه من</h1>
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
                {myBooks.map(book => (
                  <div key={book.id} style={{ background: '#fff', border: '1.5px solid var(--border)', overflow: 'hidden', transition: 'border-color 0.15s, box-shadow 0.15s' }}
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
                    <div style={{ padding: '12px 13px 14px' }}>
                      <p style={{ fontSize: 13, fontWeight: 800, marginBottom: 2 }} className="clamp-2">{book.title}</p>
                      <p style={{ fontSize: 11, color: 'var(--primary)', marginBottom: 12, fontWeight: 600 }}>{book.author}</p>
                      <button onClick={() => setReadingBook(book)} style={{
                        width: '100%', background: 'var(--dark)', color: '#fff', border: 'none',
                        padding: '8px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--primary)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'var(--dark)'}
                      >
                        <BookOpenIcon size={13} /> شروع مطالعه
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PROFILE */}
        {tab === 'profile' && (
          <div className="fade-in" style={{ maxWidth: 460 }}>
            <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 28 }}>اطلاعات حساب</h1>
            <div style={{ background: '#fff', padding: 28, border: '1.5px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 52, height: 52, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  <UserIcon size={26} />
                </div>
                <div>
                  <p style={{ fontSize: 17, fontWeight: 800 }}>{user.name}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>کاربر عادی</p>
                </div>
              </div>
              {[['ایمیل', user.email], ['کتاب‌های خریداری شده', `${myBooks.length} کتاب`]].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-3)' }}>{l}</span>
                  <span style={{ fontWeight: 700 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
