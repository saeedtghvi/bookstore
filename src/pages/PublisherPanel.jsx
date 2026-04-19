import React, { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BOOK_CONDITIONS } from '../data/books';
import {
  BookOpenIcon, SettingsIcon, LogOutIcon, GlobeIcon, CheckIcon, PlusIcon,
  TrashIcon, EditIcon, StarIcon, BarChartIcon, BriefcaseIcon, ClockIcon,
  TrendingUpIcon, DollarIcon, SendIcon, AlertIcon, UploadIcon, XIcon,
} from '../components/Icons';

const EMPTY_BOOK = {
  title: '', author: '', translator: '', price: '', originalPrice: '', physicalPrice: '',
  cover: '', category: '', shortDescription: '', description: '', tags: '',
  pageCount: '', publishYear: '', publisher: '', language: 'فارسی',
  featured: false, rating: 4.5, reviewCount: 0, type: 'digital', condition: '',
};

function StatCard({ icon, value, label, color, sub }) {
  return (
    <div style={{ background: '#fff', border: `1.5px solid ${color}33`, padding: '20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ color, opacity: 0.8 }}>{icon}</div>
      <div style={{ fontSize: 28, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: 12, color: '#78716C', fontWeight: 600 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: '#A8A29E' }}>{sub}</div>}
    </div>
  );
}

export default function PublisherPanel() {
  const {
    user, logout,
    books, bookCategories,
    pendingBooks, submitBook, withdrawalRequests, submitWithdrawal,
    getPublisherBooks, getPublisherSales,
  } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState('dashboard');
  const [bookForm, setBookForm] = useState(null);
  const [withdrawForm, setWithdrawForm] = useState(false);
  const [wAmount, setWAmount] = useState('');
  const [wNote, setWNote] = useState('');
  const [wMsg, setWMsg] = useState('');
  const [submitMsg, setSubmitMsg] = useState('');
  const coverInputRef = useRef(null);

  const pubId = user?.id;
  const myBooks = useMemo(() => getPublisherBooks(pubId), [books, pubId]);
  const salesData = useMemo(() => getPublisherSales(pubId), [books, pubId]);
  const myPending = useMemo(() => pendingBooks.filter(b => b.publisherId === pubId), [pendingBooks, pubId]);
  const myWithdrawals = useMemo(() => withdrawalRequests.filter(r => r.publisherId === pubId), [withdrawalRequests, pubId]);

  const totalSales = salesData.reduce((s, b) => s + b.salesCount, 0);
  const totalRevenue = salesData.reduce((s, b) => s + b.revenue, 0);
  const publisherShare = Math.round(totalRevenue * 0.7);
  const paidAmount = myWithdrawals.filter(r => r.status === 'approved').reduce((s, r) => s + r.amount, 0);
  const pendingAmount = myWithdrawals.filter(r => r.status === 'pending').reduce((s, r) => s + r.amount, 0);
  const balance = publisherShare - paidAmount - pendingAmount;

  const setB = (k) => (e) => setBookForm(p => ({ ...p, [k]: e.type === 'checkbox' ? e.target.checked : e.target.value }));

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setBookForm(p => ({ ...p, cover: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmitBook = () => {
    if (!bookForm.title || !bookForm.price) return;
    const book = {
      ...bookForm,
      price: Number(bookForm.price),
      originalPrice: Number(bookForm.originalPrice) || 0,
      physicalPrice: Number(bookForm.physicalPrice) || 0,
      pageCount: Number(bookForm.pageCount) || 0,
      publishYear: Number(bookForm.publishYear) || 0,
      tags: (bookForm.tags || '').split(',').map(t => t.trim()).filter(Boolean),
      category: bookForm.category || (bookCategories[0] || 'عمومی'),
    };
    submitBook(book, pubId);
    setBookForm(null);
    setSubmitMsg('درخواست ارسال شد و در انتظار تایید ادمین است');
    setTimeout(() => setSubmitMsg(''), 4000);
  };

  const handleWithdraw = () => {
    if (!wAmount || Number(wAmount) <= 0) return;
    if (Number(wAmount) > balance) { setWMsg('مبلغ بیشتر از موجودی است'); return; }
    submitWithdrawal(pubId, Number(wAmount), wNote);
    setWAmount(''); setWNote(''); setWithdrawForm(false);
    setWMsg('درخواست تسویه ارسال شد — ظرف ۲۴ ساعت واریز می‌شود');
    setTimeout(() => setWMsg(''), 5000);
  };

  const nav = [
    { id: 'dashboard', icon: <BarChartIcon size={16} />, label: 'داشبورد' },
    { id: 'books',     icon: <BookOpenIcon size={16} />,  label: 'کتاب‌هایم' },
    { id: 'submit',    icon: <PlusIcon size={16} />,       label: 'ارسال کتاب جدید' },
    { id: 'pending',   icon: <ClockIcon size={16} />,      label: `درخواست‌ها${myPending.length ? ` (${myPending.length})` : ''}` },
    { id: 'finance',   icon: <DollarIcon size={16} />,     label: 'مالی و تسویه' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#FBF7F2', direction: 'rtl', display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{ width: 220, background: '#1C1917', position: 'sticky', top: 0, height: '100vh', display: 'flex', flexDirection: 'column', flexShrink: 0, overflowY: 'auto' }}>
        <div style={{ padding: '20px 16px', borderBottom: '1px solid #44403C' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            <div style={{ background: '#92400E', padding: '5px 6px', display: 'flex' }}><BriefcaseIcon size={14} /></div>
            <p style={{ fontSize: 14, fontWeight: 800, color: '#FEF3C7' }}>پنل ناشر</p>
          </div>
          <p style={{ fontSize: 11, color: '#A8A29E', marginTop: 4, marginRight: 30 }}>{user?.name}</p>
        </div>
        <nav style={{ flex: 1, padding: 12 }}>
          {nav.map(n => (
            <button key={n.id} onClick={() => { setTab(n.id); setBookForm(null); }} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', border: 'none', cursor: 'pointer', marginBottom: 4,
              background: tab === n.id ? 'rgba(146,64,14,0.4)' : 'transparent',
              color: tab === n.id ? '#FCD34D' : '#A8A29E',
              fontSize: 13, fontWeight: tab === n.id ? 700 : 400, textAlign: 'right',
              borderRight: tab === n.id ? '3px solid #92400E' : '3px solid transparent',
            }}><span>{n.icon}</span> {n.label}</button>
          ))}
        </nav>
        <div style={{ padding: 12, borderTop: '1px solid #44403C' }}>
          <button onClick={() => navigate('/')} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', color: '#A8A29E', fontSize: 12, marginBottom: 6 }}>
            <GlobeIcon size={13} /> مشاهده سایت
          </button>
          <button onClick={() => { logout(); navigate('/'); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', border: 'none', cursor: 'pointer', background: 'rgba(220,38,38,0.1)', color: '#FCA5A5', fontSize: 12 }}>
            <LogOutIcon size={13} /> خروج
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: 28, overflowY: 'auto', minWidth: 0 }}>

        {/* ── DASHBOARD ── */}
        {tab === 'dashboard' && (
          <div className="fade-in">
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6, color: '#1C1917' }}>داشبورد ناشر</h1>
            <p style={{ fontSize: 13, color: '#78716C', marginBottom: 28 }}>خلاصه عملکرد فروش کتاب‌های شما</p>

            {submitMsg && <div style={{ background: '#D1FAE5', border: '1px solid #059669', padding: '12px 16px', fontSize: 13, color: '#065F46', fontWeight: 600, marginBottom: 20 }}>✓ {submitMsg}</div>}
            {wMsg && <div style={{ background: '#FEF3C7', border: '1px solid #D97706', padding: '12px 16px', fontSize: 13, color: '#92400E', fontWeight: 600, marginBottom: 20 }}>✓ {wMsg}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16, marginBottom: 32 }}>
              <StatCard icon={<BookOpenIcon size={22} />} value={myBooks.length} label="کتاب منتشرشده" color="#0F766E" />
              <StatCard icon={<ClockIcon size={22} />} value={myPending.filter(b => b.status === 'pending').length} label="در انتظار تایید" color="#D97706" />
              <StatCard icon={<TrendingUpIcon size={22} />} value={totalSales.toLocaleString('fa-IR')} label="فروش کل" color="#1D4ED8" sub="تعداد فروش" />
              <StatCard icon={<DollarIcon size={22} />} value={`${(publisherShare / 1000).toFixed(0)}K`} label="درآمد شما" color="#059669" sub="۷۰٪ از فروش کل" />
              <StatCard icon={<DollarIcon size={22} />} value={`${(balance / 1000).toFixed(0)}K`} label="موجودی قابل تسویه" color="#7C3AED" sub="تومان" />
            </div>

            {/* Top selling books */}
            <div style={{ background: '#fff', border: '1.5px solid #E5DDD5', padding: 24, marginBottom: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 16, color: '#1C1917' }}>پرفروش‌ترین کتاب‌ها</h3>
              {salesData.length === 0 ? (
                <p style={{ fontSize: 13, color: '#A8A29E', textAlign: 'center', padding: '20px 0' }}>هنوز کتابی منتشر نشده</p>
              ) : (
                [...salesData].sort((a, b) => b.salesCount - a.salesCount).slice(0, 5).map((book, i) => (
                  <div key={book.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #F5F5F4' }}>
                    <span style={{ fontSize: 16, fontWeight: 900, color: '#92400E', minWidth: 24 }}>#{i + 1}</span>
                    <div style={{ width: 36, height: 48, background: '#FEF3C7', overflow: 'hidden', flexShrink: 0 }}>
                      <img src={book.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#1C1917' }} className="clamp-1">{book.title}</p>
                      <p style={{ fontSize: 11, color: '#78716C' }}>{book.author}</p>
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <p style={{ fontSize: 14, fontWeight: 800, color: '#059669' }}>{book.salesCount} فروش</p>
                      <p style={{ fontSize: 11, color: '#A8A29E' }}>{book.revenue.toLocaleString('fa-IR')} ت</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quick actions */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button onClick={() => setTab('submit')} style={{ background: '#92400E', color: '#FEF3C7', border: 'none', padding: '11px 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                <PlusIcon size={14} /> ارسال کتاب جدید
              </button>
              {balance > 0 && (
                <button onClick={() => setTab('finance')} style={{ background: '#059669', color: '#fff', border: 'none', padding: '11px 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <DollarIcon size={14} /> درخواست تسویه ({balance.toLocaleString('fa-IR')} ت)
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── MY BOOKS ── */}
        {tab === 'books' && (
          <div className="fade-in">
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4, color: '#1C1917' }}>کتاب‌های منتشرشده</h1>
            <p style={{ fontSize: 13, color: '#78716C', marginBottom: 24 }}>{myBooks.length} کتاب</p>

            {myBooks.length === 0 ? (
              <div style={{ background: '#fff', border: '1.5px solid #E5DDD5', padding: '60px 0', textAlign: 'center' }}>
                <BookOpenIcon size={40} />
                <p style={{ fontSize: 15, fontWeight: 600, color: '#44403C', marginTop: 16 }}>هنوز کتابی منتشر نشده</p>
                <p style={{ fontSize: 13, color: '#A8A29E', marginTop: 6 }}>اولین کتاب خود را ارسال کنید</p>
                <button onClick={() => setTab('submit')} style={{ background: '#92400E', color: '#FEF3C7', border: 'none', padding: '10px 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer', marginTop: 20 }}>
                  ارسال کتاب
                </button>
              </div>
            ) : (
              <>
                {/* Sales table */}
                <div style={{ background: '#fff', border: '1.5px solid #E5DDD5', overflow: 'hidden', marginBottom: 24 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 80px 100px 100px 100px', gap: 8, padding: '10px 16px', background: '#F5F5F4', borderBottom: '1.5px solid #E5DDD5', fontSize: 11, fontWeight: 700, color: '#78716C' }}>
                    <span>کتاب</span><span>نوع</span><span>قیمت</span><span>تعداد فروش</span><span>درآمد کل</span><span>سهم شما (۷۰٪)</span>
                  </div>
                  {salesData.map((book, i) => (
                    <div key={book.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 80px 100px 100px 100px', gap: 8, padding: '12px 16px', borderBottom: i < salesData.length - 1 ? '1px solid #F5F5F4' : 'none', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <div style={{ width: 32, height: 42, overflow: 'hidden', background: '#FEF3C7', flexShrink: 0 }}>
                          <img src={book.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 700, color: '#1C1917' }} className="clamp-1">{book.title}</p>
                          <p style={{ fontSize: 11, color: '#78716C' }}>{book.author}</p>
                        </div>
                      </div>
                      <span style={{ fontSize: 11, padding: '2px 8px', fontWeight: 700, background: book.type === 'physical' ? '#FEF3C7' : 'var(--primary-light)', color: book.type === 'physical' ? '#92400E' : 'var(--primary)', display: 'inline-block' }}>
                        {book.type === 'digital' ? 'الکترونیک' : book.type === 'physical' ? 'چاپی' : 'هر دو'}
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#1C1917' }}>{book.price?.toLocaleString('fa-IR')}</span>
                      <span style={{ fontSize: 15, fontWeight: 800, color: '#1D4ED8' }}>{book.salesCount.toLocaleString('fa-IR')}</span>
                      <span style={{ fontSize: 13, color: '#44403C' }}>{book.revenue.toLocaleString('fa-IR')}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#059669' }}>{Math.round(book.revenue * 0.7).toLocaleString('fa-IR')}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: '#fff', border: '1.5px solid #E5DDD5', padding: '16px 20px', display: 'flex', gap: 32, flexWrap: 'wrap' }}>
                  <div><p style={{ fontSize: 12, color: '#78716C', marginBottom: 4 }}>مجموع درآمد</p><p style={{ fontSize: 18, fontWeight: 900, color: '#1C1917' }}>{totalRevenue.toLocaleString('fa-IR')} ت</p></div>
                  <div><p style={{ fontSize: 12, color: '#78716C', marginBottom: 4 }}>سهم ناشر (۷۰٪)</p><p style={{ fontSize: 18, fontWeight: 900, color: '#059669' }}>{publisherShare.toLocaleString('fa-IR')} ت</p></div>
                  <div><p style={{ fontSize: 12, color: '#78716C', marginBottom: 4 }}>تسویه‌شده</p><p style={{ fontSize: 18, fontWeight: 900, color: '#1D4ED8' }}>{paidAmount.toLocaleString('fa-IR')} ت</p></div>
                  <div><p style={{ fontSize: 12, color: '#78716C', marginBottom: 4 }}>موجودی قابل تسویه</p><p style={{ fontSize: 18, fontWeight: 900, color: '#7C3AED' }}>{balance.toLocaleString('fa-IR')} ت</p></div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── SUBMIT NEW BOOK ── */}
        {tab === 'submit' && !bookForm && (
          <div className="fade-in">
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4, color: '#1C1917' }}>ارسال کتاب جدید</h1>
            <p style={{ fontSize: 13, color: '#78716C', marginBottom: 24 }}>پس از ارسال، ادمین بررسی و در صورت تایید منتشر می‌شود</p>
            {submitMsg && <div style={{ background: '#D1FAE5', border: '1px solid #059669', padding: '12px 16px', fontSize: 13, color: '#065F46', fontWeight: 600, marginBottom: 20 }}>✓ {submitMsg}</div>}
            <button onClick={() => setBookForm({ ...EMPTY_BOOK, category: bookCategories[0] || '', publisher: user?.publisherName || '' })}
              style={{ background: '#92400E', color: '#FEF3C7', border: 'none', padding: '12px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <PlusIcon size={15} /> شروع تعریف کتاب
            </button>
          </div>
        )}

        {tab === 'submit' && bookForm && (
          <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: '#1C1917' }}>تعریف کتاب جدید</h1>
              <button onClick={() => setBookForm(null)} style={{ background: '#F5F5F4', border: '1px solid #E5DDD5', padding: '8px 16px', fontSize: 13, cursor: 'pointer', color: '#78716C' }}>انصراف</button>
            </div>
            <div style={{ background: '#fff', border: '1.5px solid #E5DDD5', padding: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <PF label="عنوان کتاب *" value={bookForm.title} onChange={setB('title')} required />
                <PF label="نویسنده *" value={bookForm.author} onChange={setB('author')} required />
                <PF label="مترجم" value={bookForm.translator} onChange={setB('translator')} />
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#78716C', marginBottom: 6 }}>نوع کتاب</label>
                  <select value={bookForm.type} onChange={setB('type')} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E5DDD5', fontSize: 13, background: '#fff', color: '#1C1917', outline: 'none' }}>
                    <option value="digital">الکترونیک</option>
                    <option value="physical">چاپی</option>
                    <option value="both">الکترونیک + چاپی</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#78716C', marginBottom: 6 }}>دسته‌بندی</label>
                  <select value={bookForm.category} onChange={setB('category')} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E5DDD5', fontSize: 13, background: '#fff', color: '#1C1917', outline: 'none' }}>
                    {bookCategories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <PF label="قیمت الکترونیک (تومان) *" value={bookForm.price} onChange={setB('price')} type="number" required />
                <PF label="قیمت اصلی (قبل از تخفیف)" value={bookForm.originalPrice} onChange={setB('originalPrice')} type="number" />
                {(bookForm.type === 'physical' || bookForm.type === 'both') && (
                  <PF label="قیمت چاپی (تومان)" value={bookForm.physicalPrice} onChange={setB('physicalPrice')} type="number" />
                )}
                {(bookForm.type === 'physical' || bookForm.type === 'both') && (
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#78716C', marginBottom: 6 }}>وضعیت چاپی</label>
                    <select value={bookForm.condition} onChange={setB('condition')} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E5DDD5', fontSize: 13, background: '#fff', color: '#1C1917', outline: 'none' }}>
                      <option value="">انتخاب کنید</option>
                      {BOOK_CONDITIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                )}
                {/* Cover */}
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#78716C', marginBottom: 8 }}>تصویر جلد</label>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    {bookForm.cover && (
                      <div style={{ width: 80, height: 108, overflow: 'hidden', background: '#FEF3C7', flexShrink: 0, border: '1.5px solid #E5DDD5' }}>
                        <img src={bookForm.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <button type="button" onClick={() => coverInputRef.current?.click()} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px', background: '#FEF3C7', color: '#92400E', border: '1.5px dashed #92400E', cursor: 'pointer', fontSize: 13, fontWeight: 600, marginBottom: 8, width: '100%', justifyContent: 'center' }}>
                        <UploadIcon size={15} /> آپلود تصویر از کامپیوتر
                      </button>
                      <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverUpload} style={{ display: 'none' }} />
                      <p style={{ fontSize: 11, color: '#A8A29E', marginBottom: 6, textAlign: 'center' }}>یا آدرس اینترنتی:</p>
                      <input type="text" value={typeof bookForm.cover === 'string' && !bookForm.cover.startsWith('data:') ? bookForm.cover : ''} onChange={setB('cover')}
                        placeholder="https://example.com/cover.jpg"
                        style={{ width: '100%', padding: '8px 12px', border: '1.5px solid #E5DDD5', fontSize: 13, color: '#1C1917', outline: 'none', direction: 'ltr' }} />
                    </div>
                  </div>
                </div>
                <PF label="توضیح کوتاه" value={bookForm.shortDescription} onChange={setB('shortDescription')} span={2} />
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#78716C', marginBottom: 6 }}>توضیح کامل</label>
                  <textarea value={bookForm.description} onChange={setB('description')} rows={4}
                    style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E5DDD5', fontSize: 13, resize: 'vertical', outline: 'none', fontFamily: 'inherit', background: '#fff', color: '#1C1917' }} />
                </div>
                <PF label="تعداد صفحه" value={bookForm.pageCount} onChange={setB('pageCount')} type="number" />
                <PF label="سال انتشار" value={bookForm.publishYear} onChange={setB('publishYear')} type="number" />
                <PF label="برچسب‌ها (با کاما جدا کنید)" value={bookForm.tags} onChange={setB('tags')} span={2} />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button onClick={handleSubmitBook} style={{ background: '#92400E', color: '#FEF3C7', border: 'none', padding: '12px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <SendIcon size={14} /> ارسال برای بررسی
                </button>
                <button onClick={() => setBookForm(null)} style={{ background: '#F5F5F4', color: '#78716C', border: '1px solid #E5DDD5', padding: '12px 20px', fontSize: 14, cursor: 'pointer' }}>انصراف</button>
              </div>
            </div>
          </div>
        )}

        {/* ── PENDING REQUESTS ── */}
        {tab === 'pending' && (
          <div className="fade-in">
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4, color: '#1C1917' }}>درخواست‌های ارسالی</h1>
            <p style={{ fontSize: 13, color: '#78716C', marginBottom: 24 }}>وضعیت کتاب‌هایی که برای بررسی ارسال کرده‌اید</p>

            {myPending.length === 0 ? (
              <div style={{ background: '#fff', border: '1.5px solid #E5DDD5', padding: '60px 0', textAlign: 'center' }}>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#44403C' }}>هیچ درخواستی ارسال نشده</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {myPending.map(book => {
                  const isPending = book.status === 'pending';
                  const isRejected = book.status === 'rejected';
                  return (
                    <div key={book.id} style={{ background: '#fff', border: `1.5px solid ${isPending ? '#D97706' : isRejected ? '#DC2626' : '#059669'}33`, padding: 16, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                      <div style={{ width: 52, height: 70, overflow: 'hidden', background: '#FEF3C7', flexShrink: 0 }}>
                        <img src={book.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: '#1C1917', marginBottom: 4 }}>{book.title}</p>
                        <p style={{ fontSize: 12, color: '#78716C' }}>{book.author} · {book.category}</p>
                        <p style={{ fontSize: 11, color: '#A8A29E', marginTop: 4 }}>ارسال: {book.submittedAt}</p>
                        {isRejected && book.rejectReason && (
                          <p style={{ fontSize: 12, color: '#DC2626', marginTop: 6, background: '#FEF2F2', padding: '6px 10px' }}>دلیل رد: {book.rejectReason}</p>
                        )}
                      </div>
                      <div>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', fontSize: 12, fontWeight: 700, background: isPending ? '#FEF3C7' : isRejected ? '#FEF2F2' : '#D1FAE5', color: isPending ? '#92400E' : isRejected ? '#DC2626' : '#059669' }}>
                          {isPending ? '⏳ در انتظار' : isRejected ? '✗ رد شد' : '✓ تایید شد'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── FINANCE ── */}
        {tab === 'finance' && (
          <div className="fade-in">
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4, color: '#1C1917' }}>مالی و تسویه حساب</h1>
            <p style={{ fontSize: 13, color: '#78716C', marginBottom: 24 }}>مدیریت درآمد و درخواست واریز وجه</p>

            {wMsg && <div style={{ background: '#FEF3C7', border: '1px solid #D97706', padding: '12px 16px', fontSize: 13, color: '#92400E', fontWeight: 600, marginBottom: 20 }}>✓ {wMsg}</div>}

            {/* Balance summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16, marginBottom: 28 }}>
              <StatCard icon={<TrendingUpIcon size={22} />} value={totalRevenue.toLocaleString('fa-IR')} label="درآمد کل فروش" color="#1D4ED8" sub="تومان" />
              <StatCard icon={<DollarIcon size={22} />} value={publisherShare.toLocaleString('fa-IR')} label="سهم شما (۷۰٪)" color="#059669" sub="تومان" />
              <StatCard icon={<CheckIcon size={22} />} value={paidAmount.toLocaleString('fa-IR')} label="تسویه‌شده" color="#0284C7" sub="تومان" />
              <StatCard icon={<ClockIcon size={22} />} value={pendingAmount.toLocaleString('fa-IR')} label="در انتظار واریز" color="#D97706" sub="تومان" />
              <StatCard icon={<DollarIcon size={22} />} value={balance.toLocaleString('fa-IR')} label="قابل تسویه" color="#7C3AED" sub="تومان" />
            </div>

            {/* Withdrawal request */}
            <div style={{ background: '#fff', border: '1.5px solid #E5DDD5', padding: 24, marginBottom: 24, maxWidth: 500 }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 4, color: '#1C1917' }}>درخواست تسویه حساب</h3>
              <p style={{ fontSize: 12, color: '#78716C', marginBottom: 16 }}>واریز ظرف ۲۴ ساعت انجام می‌شود</p>

              {balance <= 0 ? (
                <p style={{ fontSize: 13, color: '#A8A29E', background: '#F5F5F4', padding: '12px 16px' }}>موجودی قابل تسویه ندارید</p>
              ) : !withdrawForm ? (
                <button onClick={() => setWithdrawForm(true)} style={{ background: '#059669', color: '#fff', border: 'none', padding: '11px 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <DollarIcon size={14} /> درخواست تسویه ({balance.toLocaleString('fa-IR')} ت قابل دریافت)
                </button>
              ) : (
                <div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#78716C', marginBottom: 5 }}>مبلغ درخواستی (تومان)</label>
                    <input type="number" value={wAmount} onChange={e => setWAmount(e.target.value)}
                      placeholder={`حداکثر ${balance.toLocaleString('fa-IR')}`}
                      style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E5DDD5', fontSize: 13, outline: 'none' }} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#78716C', marginBottom: 5 }}>توضیحات (اختیاری)</label>
                    <input type="text" value={wNote} onChange={e => setWNote(e.target.value)}
                      placeholder="مثلاً: تسویه دوره‌ای"
                      style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E5DDD5', fontSize: 13, outline: 'none' }} />
                  </div>
                  {wMsg && <p style={{ fontSize: 13, color: '#DC2626', marginBottom: 12 }}>{wMsg}</p>}
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={handleWithdraw} style={{ background: '#059669', color: '#fff', border: 'none', padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>ارسال درخواست</button>
                    <button onClick={() => { setWithdrawForm(false); setWMsg(''); }} style={{ background: '#F5F5F4', color: '#78716C', border: '1px solid #E5DDD5', padding: '10px 16px', fontSize: 13, cursor: 'pointer' }}>انصراف</button>
                  </div>
                </div>
              )}
            </div>

            {/* Withdrawal history */}
            {myWithdrawals.length > 0 && (
              <div style={{ background: '#fff', border: '1.5px solid #E5DDD5', overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1.5px solid #E5DDD5', background: '#F5F5F4' }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1C1917' }}>تاریخچه تسویه</h3>
                </div>
                {myWithdrawals.map((req, i) => (
                  <div key={req.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: i < myWithdrawals.length - 1 ? '1px solid #F5F5F4' : 'none' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#1C1917' }}>{req.amount.toLocaleString('fa-IR')} تومان</p>
                      <p style={{ fontSize: 11, color: '#A8A29E' }}>{req.requestedAt}{req.note ? ` · ${req.note}` : ''}</p>
                    </div>
                    <span style={{ padding: '3px 12px', fontSize: 11, fontWeight: 700, background: req.status === 'approved' ? '#D1FAE5' : req.status === 'rejected' ? '#FEF2F2' : '#FEF3C7', color: req.status === 'approved' ? '#059669' : req.status === 'rejected' ? '#DC2626' : '#92400E' }}>
                      {req.status === 'approved' ? '✓ پرداخت شد' : req.status === 'rejected' ? '✗ رد شد' : '⏳ در انتظار'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function PF({ label, value, onChange, type = 'text', required, span }) {
  return (
    <div style={{ gridColumn: span ? '1/-1' : undefined }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: '#78716C' }}>{label}</label>
      <input type={type} value={value} onChange={onChange} required={required}
        style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E5DDD5', fontSize: 13, outline: 'none', background: '#fff', color: '#1C1917' }}
        onFocus={e => e.target.style.borderColor = '#92400E'}
        onBlur={e => e.target.style.borderColor = '#E5DDD5'}
      />
    </div>
  );
}
