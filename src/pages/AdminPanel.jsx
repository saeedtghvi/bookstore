import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  BookOpenIcon, FileTextIcon, HomeIcon, SettingsIcon, LogOutIcon, GlobeIcon,
  EditIcon, TrashIcon, PlusIcon, CheckIcon, BarChartIcon, UsersIcon, UploadIcon,
  TagIcon, XIcon, StarIcon, UserIcon, BriefcaseIcon, ClockIcon, SendIcon, AlertIcon, DollarIcon,
} from '../components/Icons';

const EMPTY_BOOK = { title: '', author: '', translator: '', price: '', originalPrice: '', physicalPrice: '', cover: '', category: '', shortDescription: '', description: '', sampleContent: '', tags: '', pageCount: '', publishYear: '', publisher: '', language: 'فارسی', featured: false, rating: 4.5, reviewCount: 0, type: 'digital', condition: '' };
const EMPTY_POST = { title: '', slug: '', excerpt: '', content: '', author: '', category: '', cover: '', readTime: 5, tags: '' };
const EMPTY_USER = { name: '', email: '', password: '', role: 'customer' };

/* ── SVG bar chart ── */
function SalesChart({ books, users }) {
  const cats = {};
  books.forEach(b => { cats[b.category] = (cats[b.category] || 0) + 1; });
  const entries = Object.entries(cats).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const max = Math.max(...entries.map(e => e[1]), 1);
  const W = 480, H = 160;

  return (
    <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', padding: '20px 20px 8px' }}>
      <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: 'var(--text)' }}>توزیع کتاب‌ها بر اساس دسته</h3>
      <svg width="100%" viewBox={`0 0 ${W} ${H + 40}`} style={{ overflow: 'visible' }}>
        {entries.map(([cat, count], i) => {
          const step = (W - 40) / entries.length;
          const barW = Math.min(52, step - 10);
          const x = 20 + i * step;
          const barH = Math.max(4, (count / max) * H);
          const y = H - barH;
          return (
            <g key={cat}>
              <rect x={x} y={y} width={barW} height={barH} fill="var(--primary)" opacity="0.85" />
              <text x={x + barW / 2} y={y - 6} textAnchor="middle" fontSize={11} fill="var(--primary)" fontWeight="700">{count}</text>
              <text x={x + barW / 2} y={H + 18} textAnchor="middle" fontSize={9} fill="var(--text-3)">{cat.length > 8 ? cat.slice(0, 8) + '…' : cat}</text>
            </g>
          );
        })}
        <line x1={16} y1={H} x2={W - 16} y2={H} stroke="var(--border)" strokeWidth={1} />
      </svg>
      <div style={{ display: 'flex', gap: 20, marginTop: 8, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 13, color: 'var(--text-2)' }}><span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: 16 }}>{books.length}</span> کتاب کل</div>
        <div style={{ fontSize: 13, color: 'var(--text-2)' }}><span style={{ fontWeight: 800, color: '#D97706', fontSize: 16 }}>{users.filter(u => u.role === 'customer').length}</span> کاربر عادی</div>
        <div style={{ fontSize: 13, color: 'var(--text-2)' }}><span style={{ fontWeight: 800, color: '#059669', fontSize: 16 }}>{users.reduce((s, u) => s + (u.purchasedBooks?.length || 0), 0)}</span> خرید کل</div>
      </div>
    </div>
  );
}

/* ── Category manager ── */
function CategoryManager({ categories, onAdd, onRemove, label }) {
  const [newCat, setNewCat] = useState('');
  return (
    <div style={{ marginBottom: 20 }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-2)', marginBottom: 10 }}>{label}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
        {categories.map(c => (
          <span key={c} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', background: 'var(--primary-light)', color: 'var(--primary)', fontSize: 12, fontWeight: 600 }}>
            {c}
            <button onClick={() => onRemove(c)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: 0, display: 'flex', lineHeight: 1 }}>
              <XIcon size={11} />
            </button>
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input value={newCat} onChange={e => setNewCat(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && newCat.trim()) { onAdd(newCat.trim()); setNewCat(''); }}}
          placeholder="دسته‌بندی جدید..."
          style={{ flex: 1, padding: '8px 12px', border: '1.5px solid var(--border)', fontSize: 13, background: 'var(--surface)', color: 'var(--text)', outline: 'none' }}
        />
        <button onClick={() => { if (newCat.trim()) { onAdd(newCat.trim()); setNewCat(''); }}} style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '8px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
          <PlusIcon size={13} /> افزودن
        </button>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const {
    user, users, addUser, deleteUser,
    books, addBook, updateBook, deleteBook,
    posts, addPost, updatePost, deletePost,
    logout, festivalEnabled, setFestivalEnabled,
    bookCategories, addBookCategory, removeBookCategory,
    postCategories, addPostCategory, removePostCategory,
    discountCodes, addDiscountCode, removeDiscountCode,
    customerGroups, addCustomerGroup, updateCustomerGroup, deleteCustomerGroup,
    getUserGroup, getUserSpending,
    siteSettings, updateSiteSettings, resetSiteSettings, bulkUpdatePrices,
    pendingBooks, approveBook, rejectBook, withdrawalRequests, updateWithdrawal,
    navLinks, updateNavLinks,
  } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState('dashboard');
  const [bookForm, setBookForm] = useState(null);
  const [postForm, setPostForm] = useState(null);
  const [userForm, setUserForm] = useState(null);
  const [groupForm, setGroupForm] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);
  const [newCodeForm, setNewCodeForm] = useState({ code: '', pct: '' });
  const [codeMsg, setCodeMsg] = useState('');
  const coverInputRef = useRef(null);
  const [settingsSection, setSettingsSection] = useState('bulk');
  const [bulkForm, setBulkForm] = useState({ bookType: 'digital', mode: 'percent', amount: '', direction: 'increase', priceField: 'price' });
  const [bulkDone, setBulkDone] = useState('');
  const [landingForm, setLandingForm] = useState(null);
  const [storeForm, setStoreForm] = useState(null);
  const [shipForm, setShipForm] = useState(null);
  const [settingsSaved, setSettingsSaved] = useState('');
  const [pubSubTab, setPubSubTab] = useState('books');
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [newNavLink, setNewNavLink] = useState({ label: '', to: '' });

  const nav = [
    { id: 'dashboard',  icon: <HomeIcon size={16} />,      label: 'داشبورد' },
    { id: 'books',      icon: <BookOpenIcon size={16} />,  label: 'کتاب‌ها' },
    { id: 'blog',       icon: <FileTextIcon size={16} />,  label: 'بلاگ' },
    { id: 'users',      icon: <UsersIcon size={16} />,     label: 'کاربران' },
    { id: 'club',       icon: <StarIcon size={16} />,      label: 'باشگاه مشتریان' },
    { id: 'stats',      icon: <BarChartIcon size={16} />,  label: 'آمار' },
    { id: 'publishers', icon: <BriefcaseIcon size={16} />, label: 'ناشران', badge: (pendingBooks?.length || 0) + (withdrawalRequests?.filter(r => r.status === 'pending').length || 0) },
    { id: 'settings',   icon: <SettingsIcon size={16} />,  label: 'تنظیمات' },
  ];

  const setB = (k) => (e) => setBookForm(p => ({ ...p, [k]: e.type === 'checkbox' ? e.target.checked : e.target.value }));
  const setP = (k) => (e) => setPostForm(p => ({ ...p, [k]: e.target.value }));
  const setU = (k) => (e) => setUserForm(p => ({ ...p, [k]: e.target.value }));

  const saveBook = () => {
    const book = { ...bookForm, price: Number(bookForm.price), originalPrice: Number(bookForm.originalPrice) || 0, physicalPrice: Number(bookForm.physicalPrice) || 0, pageCount: Number(bookForm.pageCount) || 0, publishYear: Number(bookForm.publishYear) || 0, tags: (bookForm.tags || '').split(',').map(t => t.trim()).filter(Boolean) };
    if (!book.category) book.category = bookCategories[0] || 'عمومی';
    if (!book.type) book.type = 'digital';
    if (book.id) updateBook(book); else addBook(book);
    setBookForm(null);
  };

  const savePost = () => {
    const post = { ...postForm, tags: (postForm.tags || '').split(',').map(t => t.trim()).filter(Boolean), date: new Date().toLocaleDateString('fa-IR') };
    if (!post.category) post.category = postCategories[0] || 'عمومی';
    if (post.id) updatePost(post); else addPost(post);
    setPostForm(null);
  };

  const saveUser = () => {
    const res = addUser(userForm);
    if (res.ok) setUserForm(null);
    else alert(res.error);
  };

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setBookForm(p => ({ ...p, cover: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const handleAddCode = () => {
    if (!newCodeForm.code.trim() || !newCodeForm.pct) return;
    addDiscountCode(newCodeForm.code.trim(), newCodeForm.pct);
    setCodeMsg(`کد ${newCodeForm.code.toUpperCase()} با ${newCodeForm.pct}٪ تخفیف افزوده شد`);
    setNewCodeForm({ code: '', pct: '' });
    setTimeout(() => setCodeMsg(''), 3000);
  };

  const customerUsers = users.filter(u => u.role === 'customer');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', direction: 'rtl', display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{ width: 220, background: 'var(--dark)', position: 'sticky', top: 0, height: '100vh', display: 'flex', flexDirection: 'column', flexShrink: 0, overflowY: 'auto' }}>
        <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            <div style={{ background: 'var(--primary)', padding: '5px 6px', display: 'flex' }}><SettingsIcon size={14} /></div>
            <p style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>پنل مدیریت</p>
          </div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4, marginRight: 30 }}>{user.name}</p>
        </div>
        <nav style={{ flex: 1, padding: 12 }}>
          {nav.map(n => (
            <button key={n.id} onClick={() => { setTab(n.id); setBookForm(null); setPostForm(null); setUserForm(null); }} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', border: 'none', cursor: 'pointer',
              background: tab === n.id ? 'rgba(255,255,255,0.12)' : 'transparent',
              color: tab === n.id ? '#fff' : 'rgba(255,255,255,0.5)',
              fontSize: 13, fontWeight: tab === n.id ? 700 : 400, marginBottom: 4, textAlign: 'right',
              borderRight: tab === n.id ? '3px solid var(--primary)' : '3px solid transparent',
            }}>
              <span>{n.icon}</span>
              <span style={{ flex: 1 }}>{n.label}</span>
              {n.badge > 0 && <span style={{ background: '#DC2626', color: '#fff', fontSize: 10, fontWeight: 800, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{n.badge}</span>}
            </button>
          ))}
        </nav>
        <div style={{ padding: 12, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button onClick={() => navigate('/')} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', fontSize: 12, marginBottom: 6 }}>
            <GlobeIcon size={13} /> مشاهده سایت
          </button>
          <button onClick={() => { logout(); navigate('/'); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', border: 'none', cursor: 'pointer', background: 'rgba(220,38,38,0.15)', color: '#FCA5A5', fontSize: 12 }}>
            <LogOutIcon size={13} /> خروج
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: 28, overflowY: 'auto', minWidth: 0 }}>

        {/* DASHBOARD */}
        {tab === 'dashboard' && (
          <div className="fade-in">
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24, color: 'var(--text)' }}>داشبورد</h1>

            {/* Festival toggle */}
            <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>بنر جشنواره قیمت</p>
                <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>نمایش تایمر شمارش معکوس در بالای صفحه</p>
              </div>
              <button onClick={() => setFestivalEnabled(p => !p)} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: festivalEnabled ? 'var(--primary)' : 'var(--bg)',
                color: festivalEnabled ? '#fff' : 'var(--text-2)',
                border: `2px solid ${festivalEnabled ? 'var(--primary)' : 'var(--border)'}`,
                padding: '9px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
              }}>
                <div style={{ width: 36, height: 20, background: festivalEnabled ? 'rgba(255,255,255,0.3)' : 'var(--border)', borderRadius: 10, position: 'relative', transition: 'background 0.2s' }}>
                  <div style={{ position: 'absolute', top: 2, right: festivalEnabled ? 2 : 18, width: 16, height: 16, background: festivalEnabled ? '#fff' : 'var(--text-3)', borderRadius: '50%', transition: 'right 0.2s' }} />
                </div>
                {festivalEnabled ? 'فعال است' : 'غیرفعال'}
              </button>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 16, marginBottom: 28 }}>
              {[
                { icon: <BookOpenIcon size={22} />, value: books.length, label: 'کتاب', color: 'var(--primary-light)', tc: 'var(--primary)' },
                { icon: <FileTextIcon size={22} />, value: posts.length, label: 'مقاله بلاگ', color: '#FEF3C7', tc: '#B45309' },
                { icon: <UsersIcon size={22} />, value: customerUsers.length, label: 'کاربر', color: '#EDE9FE', tc: '#7C3AED' },
                { icon: <CheckIcon size={22} />, value: users.reduce((s, u) => s + (u.purchasedBooks?.length || 0), 0), label: 'خرید کل', color: '#D1FAE5', tc: '#059669' },
              ].map(s => (
                <div key={s.label} style={{ background: s.color, border: `1.5px solid ${s.tc}22`, padding: 20 }}>
                  <div style={{ color: s.tc, marginBottom: 10 }}>{s.icon}</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: s.tc }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: s.tc, opacity: 0.8, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: 'var(--text)' }}>آخرین کتاب‌ها</h3>
                {books.slice(-4).reverse().map(b => (
                  <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ width: 32, height: 42, overflow: 'hidden', background: 'var(--primary-light)', flexShrink: 0 }}>
                      <img src={b.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }} className="clamp-1">{b.title}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-3)' }}>{b.price?.toLocaleString('fa-IR')} ت</p>
                    </div>
                    <button onClick={() => { setTab('books'); setBookForm({ ...b, tags: (b.tags || []).join(', ') }); }} style={{ fontSize: 11, color: 'var(--primary)', background: 'var(--primary-light)', border: 'none', padding: '3px 8px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}><EditIcon size={10} /> ویرایش</button>
                  </div>
                ))}
              </div>
              <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: 'var(--text)' }}>آخرین کاربران</h3>
                {customerUsers.slice(-4).reverse().map(u => {
                  const grp = getUserGroup(u);
                  return (
                    <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ width: 32, height: 32, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: 13, fontWeight: 800, flexShrink: 0 }}>{u.name[0]}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{u.name}</p>
                        <p style={{ fontSize: 11, color: 'var(--text-3)' }}>{u.purchasedBooks?.length || 0} کتاب</p>
                      </div>
                      {grp && <span style={{ fontSize: 10, padding: '2px 8px', fontWeight: 700, background: grp.color + '20', color: grp.color }}>{grp.name.split(' ')[1]}</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* BOOKS LIST */}
        {tab === 'books' && !bookForm && (
          <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)' }}>مدیریت کتاب‌ها</h1>
                <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 2 }}>{books.length} کتاب ثبت شده</p>
              </div>
              <button onClick={() => setBookForm({ ...EMPTY_BOOK, category: bookCategories[0] || '' })} style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><PlusIcon size={14} /> کتاب جدید</button>
            </div>
            <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', overflow: 'hidden' }}>
              {books.map((b, i) => (
                <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderBottom: i < books.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ width: 40, height: 52, overflow: 'hidden', background: 'var(--primary-light)', flexShrink: 0 }}>
                    <img src={b.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }} className="clamp-1">{b.title}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{b.author} · {b.category}</p>
                  </div>
                  {b.featured && <span style={{ fontSize: 10, background: 'var(--primary-light)', color: 'var(--primary)', padding: '2px 8px', fontWeight: 700 }}>ویژه</span>}
                  {b.type === 'physical' && <span style={{ fontSize: 10, background: '#FEF3C7', color: '#92400E', padding: '2px 8px', fontWeight: 700 }}>چاپی</span>}
                  {b.type === 'both' && <span style={{ fontSize: 10, background: '#EFF6FF', color: '#1D4ED8', padding: '2px 8px', fontWeight: 700 }}>هر دو</span>}
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', whiteSpace: 'nowrap' }}>{b.price?.toLocaleString('fa-IR')} ت</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => setBookForm({ ...b, tags: (b.tags || []).join(', ') })} style={{ fontSize: 12, background: 'var(--primary-light)', color: 'var(--primary)', border: 'none', padding: '5px 12px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}><EditIcon size={11} /> ویرایش</button>
                    <button onClick={() => setConfirmDel({ type: 'book', id: b.id, name: b.title })} style={{ fontSize: 12, background: '#FEF2F2', color: '#DC2626', border: 'none', padding: '5px 12px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}><TrashIcon size={11} /> حذف</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BOOK FORM */}
        {tab === 'books' && bookForm && (
          <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)' }}>{bookForm.id ? 'ویرایش کتاب' : 'کتاب جدید'}</h1>
              <button onClick={() => setBookForm(null)} style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '8px 16px', fontSize: 13, cursor: 'pointer', fontWeight: 600, color: 'var(--text-2)' }}>انصراف</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <AF label="عنوان کتاب *" value={bookForm.title} onChange={setB('title')} required />
              <AF label="نویسنده *" value={bookForm.author} onChange={setB('author')} required />
              <AF label="مترجم" value={bookForm.translator} onChange={setB('translator')} />
              <AF label="نوع کتاب" value={bookForm.type || 'digital'} onChange={setB('type')} type="select" options={['digital', 'physical', 'both']} optionLabels={['دیجیتال', 'چاپی', 'دیجیتال + چاپی']} />
              <AF label="دسته‌بندی" value={bookForm.category} onChange={setB('category')} type="select" options={bookCategories} />
              <AF label="قیمت دیجیتال (تومان) *" value={bookForm.price} onChange={setB('price')} type="number" required />
              <AF label="قیمت اصلی (قبل از تخفیف)" value={bookForm.originalPrice} onChange={setB('originalPrice')} type="number" />
              {(bookForm.type === 'physical' || bookForm.type === 'both') && (
                <AF label={bookForm.type === 'both' ? 'قیمت نسخه چاپی (تومان)' : 'قیمت چاپی (تومان)'} value={bookForm.physicalPrice} onChange={setB('physicalPrice')} type="number" />
              )}
              {(bookForm.type === 'physical' || bookForm.type === 'both') && (
                <AF label="وضعیت نسخه چاپی" value={bookForm.condition || ''} onChange={setB('condition')} type="select" options={['new', 'like_new', 'read', 'well_read']} optionLabels={['نو', 'در حد نو', 'خوانده شده', 'بسیار خوانده شده']} />
              )}
              {/* Cover upload */}
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-2)' }}>تصویر جلد</label>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  {bookForm.cover && (
                    <div style={{ width: 80, height: 108, overflow: 'hidden', background: 'var(--primary-light)', flexShrink: 0, border: '1.5px solid var(--border)' }}>
                      <img src={bookForm.cover} alt="جلد" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <button type="button" onClick={() => coverInputRef.current?.click()} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px', background: 'var(--primary-light)', color: 'var(--primary)', border: '1.5px dashed var(--primary)', cursor: 'pointer', fontSize: 13, fontWeight: 600, marginBottom: 8, width: '100%', justifyContent: 'center' }}>
                      <UploadIcon size={15} /> آپلود تصویر از کامپیوتر
                    </button>
                    <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverUpload} style={{ display: 'none' }} />
                    <p style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 6, textAlign: 'center' }}>یا آدرس اینترنتی:</p>
                    <input type="text"
                      value={typeof bookForm.cover === 'string' && !bookForm.cover.startsWith('data:') ? bookForm.cover : ''}
                      onChange={setB('cover')} placeholder="https://example.com/cover.jpg"
                      style={{ width: '100%', padding: '8px 12px', border: '1.5px solid var(--border)', fontSize: 13, background: 'var(--surface)', color: 'var(--text)', outline: 'none', direction: 'ltr' }}
                    />
                  </div>
                </div>
              </div>
              <AF label="توضیح کوتاه" value={bookForm.shortDescription} onChange={setB('shortDescription')} span={2} />
              <AF label="توضیح کامل" value={bookForm.description} onChange={setB('description')} type="textarea" rows={4} span={2} />
              <AF label="تعداد صفحه" value={bookForm.pageCount} onChange={setB('pageCount')} type="number" />
              <AF label="سال انتشار" value={bookForm.publishYear} onChange={setB('publishYear')} type="number" />
              <AF label="ناشر" value={bookForm.publisher} onChange={setB('publisher')} />
              <AF label="برچسب‌ها (با کاما جدا کنید)" value={bookForm.tags} onChange={setB('tags')} />
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', marginBottom: 16, color: 'var(--text-2)' }}>
                  <input type="checkbox" checked={bookForm.featured} onChange={setB('featured')} />
                  <span>کتاب ویژه (نمایش در اسلایدر)</span>
                </label>
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-2)' }}>محتوای کتاب (HTML)</label>
                <textarea value={bookForm.sampleContent} onChange={setB('sampleContent')} rows={10}
                  placeholder="<h2>فصل اول</h2>&#10;<p>متن کتاب را اینجا بنویسید...</p>"
                  style={{ width: '100%', padding: '12px', border: '2px solid var(--border)', fontSize: 13, resize: 'vertical', fontFamily: 'monospace', direction: 'ltr', outline: 'none', background: 'var(--surface)', color: 'var(--text)' }}
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={saveBook} style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '12px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckIcon size={15} /> ذخیره کتاب
              </button>
              <button onClick={() => setBookForm(null)} style={{ background: 'var(--bg)', color: 'var(--text-2)', border: '1px solid var(--border)', padding: '12px 20px', fontSize: 14, cursor: 'pointer' }}>انصراف</button>
            </div>
          </div>
        )}

        {/* BLOG LIST */}
        {tab === 'blog' && !postForm && (
          <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)' }}>مدیریت بلاگ</h1>
                <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 2 }}>{posts.length} مقاله</p>
              </div>
              <button onClick={() => setPostForm({ ...EMPTY_POST, category: postCategories[0] || '' })} style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><PlusIcon size={14} /> مقاله جدید</button>
            </div>
            <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', overflow: 'hidden' }}>
              {posts.map((p, i) => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderBottom: i < posts.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ width: 60, height: 40, overflow: 'hidden', background: 'var(--bg)', flexShrink: 0 }}>
                    <img src={p.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }} className="clamp-1">{p.title}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 1 }}>{p.date} · {p.category} · {p.readTime} دقیقه</p>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => setPostForm({ ...p, tags: p.tags?.join(', ') || '' })} style={{ fontSize: 12, background: 'var(--primary-light)', color: 'var(--primary)', border: 'none', padding: '5px 12px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}><EditIcon size={11} /> ویرایش</button>
                    <button onClick={() => setConfirmDel({ type: 'post', id: p.id, name: p.title })} style={{ fontSize: 12, background: '#FEF2F2', color: '#DC2626', border: 'none', padding: '5px 12px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}><TrashIcon size={11} /> حذف</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* POST FORM */}
        {tab === 'blog' && postForm && (
          <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)' }}>{postForm.id ? 'ویرایش مقاله' : 'مقاله جدید'}</h1>
              <button onClick={() => setPostForm(null)} style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '8px 16px', fontSize: 13, cursor: 'pointer', color: 'var(--text-2)' }}>انصراف</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <AF label="عنوان مقاله *" value={postForm.title} onChange={setP('title')} span={2} required />
              <AF label="آدرس (slug)" value={postForm.slug} onChange={setP('slug')} />
              <AF label="دسته‌بندی" value={postForm.category} onChange={setP('category')} type="select" options={postCategories} />
              <AF label="نویسنده" value={postForm.author} onChange={setP('author')} />
              <AF label="زمان مطالعه (دقیقه)" value={postForm.readTime} onChange={setP('readTime')} type="number" />
              <AF label="آدرس تصویر شاخص" value={postForm.cover} onChange={setP('cover')} span={2} />
              <AF label="خلاصه مقاله" value={postForm.excerpt} onChange={setP('excerpt')} type="textarea" rows={3} span={2} />
              <AF label="برچسب‌ها (با کاما)" value={postForm.tags} onChange={setP('tags')} span={2} />
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-2)' }}>محتوای مقاله (HTML)</label>
                <textarea value={postForm.content} onChange={setP('content')} rows={12}
                  placeholder="<h2>عنوان بخش</h2>&#10;<p>متن مقاله...</p>"
                  style={{ width: '100%', padding: '12px', border: '2px solid var(--border)', fontSize: 13, resize: 'vertical', fontFamily: 'monospace', direction: 'ltr', outline: 'none', background: 'var(--surface)', color: 'var(--text)' }}
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={savePost} style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '12px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><CheckIcon size={15} /> انتشار مقاله</button>
              <button onClick={() => setPostForm(null)} style={{ background: 'var(--bg)', color: 'var(--text-2)', border: '1px solid var(--border)', padding: '12px 20px', fontSize: 14, cursor: 'pointer' }}>انصراف</button>
            </div>
          </div>
        )}

        {/* USERS */}
        {tab === 'users' && (
          <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)' }}>مدیریت کاربران</h1>
                <p style={{ color: 'var(--text-3)', marginTop: 2, fontSize: 13 }}>{users.length} کاربر</p>
              </div>
              <button onClick={() => setUserForm({ ...EMPTY_USER })} style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                <PlusIcon size={14} /> کاربر جدید
              </button>
            </div>

            {/* Add user form */}
            {userForm && (
              <div style={{ background: 'var(--surface)', border: '1.5px solid var(--primary)', padding: 20, marginBottom: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: 'var(--text)' }}>افزودن کاربر جدید</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <AF label="نام کامل *" value={userForm.name} onChange={setU('name')} required />
                  <AF label="ایمیل *" value={userForm.email} onChange={setU('email')} required />
                  <AF label="رمز عبور *" value={userForm.password} onChange={setU('password')} />
                  <AF label="نقش" value={userForm.role} onChange={setU('role')} type="select" options={['customer', 'admin']} />
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                  <button onClick={saveUser} style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '9px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><CheckIcon size={14} /> ذخیره</button>
                  <button onClick={() => setUserForm(null)} style={{ background: 'var(--bg)', color: 'var(--text-2)', border: '1px solid var(--border)', padding: '9px 16px', fontSize: 13, cursor: 'pointer' }}>انصراف</button>
                </div>
              </div>
            )}

            <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', overflow: 'hidden' }}>
              {/* Table header */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 80px 100px 130px 80px', gap: 8, padding: '10px 16px', background: 'var(--bg)', borderBottom: '1.5px solid var(--border)', fontSize: 11, fontWeight: 700, color: 'var(--text-3)' }}>
                <span>نام / ایمیل</span><span>تاریخ عضویت</span><span>نقش</span><span>کتاب‌ها</span><span>پرداخت کل</span><span>عملیات</span>
              </div>
              {users.map((u, i) => {
                const grp = getUserGroup(u);
                const spending = getUserSpending(u);
                return (
                  <div key={u.id} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 80px 100px 130px 80px', gap: 8, padding: '12px 16px', borderBottom: i < users.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'center' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 30, height: 30, background: u.role === 'admin' ? '#1D4ED8' : 'var(--primary-light)', color: u.role === 'admin' ? '#fff' : 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, flexShrink: 0 }}>{u.name[0]}</div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{u.name}</p>
                          <p style={{ fontSize: 11, color: 'var(--text-3)', direction: 'ltr', textAlign: 'right' }}>{u.email}</p>
                        </div>
                      </div>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{u.joinDate || '—'}</span>
                    <span style={{ padding: '2px 8px', fontSize: 11, fontWeight: 700, background: u.role === 'admin' ? '#EEF2FF' : 'var(--primary-light)', color: u.role === 'admin' ? '#1D4ED8' : 'var(--primary)', display: 'inline-block', textAlign: 'center' }}>
                      {u.role === 'admin' ? 'مدیر' : 'کاربر'}
                    </span>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>{u.purchasedBooks?.length || 0}</p>
                      {grp && <p style={{ fontSize: 10, color: grp.color, fontWeight: 700, marginTop: 2 }}>{grp.name}</p>}
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>{spending.toLocaleString('fa-IR')} ت</p>
                    </div>
                    <div>
                      {u.role !== 'admin' && (
                        <button onClick={() => setConfirmDel({ type: 'user', id: u.id, name: u.name })} style={{ background: '#FEF2F2', color: '#DC2626', border: 'none', padding: '4px 10px', cursor: 'pointer', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
                          <TrashIcon size={10} /> حذف
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CUSTOMER CLUB */}
        {tab === 'club' && (
          <div className="fade-in">
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4, color: 'var(--text)' }}>باشگاه مشتریان</h1>
            <p style={{ color: 'var(--text-3)', marginBottom: 28, fontSize: 13 }}>تعریف گروه‌های مشتری، مدیریت تخفیف‌ها و آمار گروه‌ها</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {/* Groups */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>گروه‌های مشتری</h2>
                  <button onClick={() => setGroupForm({ name: '', color: '#0F766E', minBooks: 0, maxBooks: 999, description: '' })} style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <PlusIcon size={12} /> گروه جدید
                  </button>
                </div>

                {groupForm && (
                  <div style={{ background: 'var(--surface)', border: '1.5px solid var(--primary)', padding: 16, marginBottom: 16 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <input value={groupForm.name} onChange={e => setGroupForm(p => ({ ...p, name: e.target.value }))} placeholder="نام گروه (مثلاً: مشتریان طلایی)" style={{ padding: '8px 12px', border: '1.5px solid var(--border)', fontSize: 13, background: 'var(--surface)', color: 'var(--text)', outline: 'none' }} />
                      <input value={groupForm.description} onChange={e => setGroupForm(p => ({ ...p, description: e.target.value }))} placeholder="توضیح گروه" style={{ padding: '8px 12px', border: '1.5px solid var(--border)', fontSize: 13, background: 'var(--surface)', color: 'var(--text)', outline: 'none' }} />
                      <div style={{ display: 'flex', gap: 10 }}>
                        <input type="number" value={groupForm.minBooks} onChange={e => setGroupForm(p => ({ ...p, minBooks: Number(e.target.value) }))} placeholder="حداقل کتاب" style={{ flex: 1, padding: '8px 12px', border: '1.5px solid var(--border)', fontSize: 13, background: 'var(--surface)', color: 'var(--text)', outline: 'none' }} />
                        <input type="number" value={groupForm.maxBooks} onChange={e => setGroupForm(p => ({ ...p, maxBooks: Number(e.target.value) }))} placeholder="حداکثر کتاب" style={{ flex: 1, padding: '8px 12px', border: '1.5px solid var(--border)', fontSize: 13, background: 'var(--surface)', color: 'var(--text)', outline: 'none' }} />
                        <input type="color" value={groupForm.color} onChange={e => setGroupForm(p => ({ ...p, color: e.target.value }))} style={{ width: 44, height: 38, padding: 2, border: '1.5px solid var(--border)', cursor: 'pointer' }} />
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => { if (groupForm.id) updateCustomerGroup(groupForm); else addCustomerGroup(groupForm); setGroupForm(null); }} style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '8px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}><CheckIcon size={13} /> ذخیره</button>
                        <button onClick={() => setGroupForm(null)} style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '8px 12px', fontSize: 13, cursor: 'pointer', color: 'var(--text-2)' }}>انصراف</button>
                      </div>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {customerGroups.map(g => {
                    const count = customerUsers.filter(u => (u.purchasedBooks?.length || 0) >= g.minBooks && (u.purchasedBooks?.length || 0) <= g.maxBooks).length;
                    return (
                      <div key={g.id} style={{ background: 'var(--surface)', border: `1.5px solid ${g.color}33`, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 12, height: 12, background: g.color, flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{g.name}</p>
                          <p style={{ fontSize: 12, color: 'var(--text-3)' }}>{g.description} · {g.minBooks}–{g.maxBooks === 999 ? '∞' : g.maxBooks} کتاب</p>
                        </div>
                        <div style={{ background: g.color + '20', color: g.color, padding: '4px 10px', fontSize: 13, fontWeight: 800 }}>{count} نفر</div>
                        <button onClick={() => setGroupForm({ ...g })} style={{ background: 'var(--bg)', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: 4 }}><EditIcon size={13} /></button>
                        <button onClick={() => deleteCustomerGroup(g.id)} style={{ background: 'var(--bg)', border: 'none', cursor: 'pointer', color: 'var(--red)', padding: 4 }}><TrashIcon size={13} /></button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Discount code generator */}
              <div>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>مدیریت کدهای تخفیف</h2>
                <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', padding: 20, marginBottom: 16 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', marginBottom: 10 }}>ایجاد کد تخفیف جدید</p>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <input value={newCodeForm.code} onChange={e => setNewCodeForm(p => ({ ...p, code: e.target.value.toUpperCase() }))} placeholder="کد تخفیف (مثلاً: SUMMER30)" style={{ flex: 2, padding: '9px 12px', border: '1.5px solid var(--border)', fontSize: 13, background: 'var(--surface)', color: 'var(--text)', outline: 'none', direction: 'ltr' }} />
                    <input type="number" value={newCodeForm.pct} onChange={e => setNewCodeForm(p => ({ ...p, pct: e.target.value }))} placeholder="درصد %" style={{ flex: 1, padding: '9px 12px', border: '1.5px solid var(--border)', fontSize: 13, background: 'var(--surface)', color: 'var(--text)', outline: 'none' }} />
                    <button onClick={handleAddCode} style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '9px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <PlusIcon size={13} /> ساخت
                    </button>
                  </div>
                  {codeMsg && <p style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600 }}><CheckIcon size={12} /> {codeMsg}</p>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {Object.entries(discountCodes).map(([code, pct]) => (
                    <div key={code} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--surface)', border: '1.5px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <TagIcon size={14} />
                        <span style={{ fontSize: 14, fontWeight: 800, direction: 'ltr', color: 'var(--text)' }}>{code}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--primary)' }}>{pct}%</span>
                        <button onClick={() => removeDiscountCode(code)} style={{ background: '#FEF2F2', color: '#DC2626', border: 'none', padding: '4px 10px', cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>حذف</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STATS */}
        {tab === 'stats' && (
          <div className="fade-in">
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24, color: 'var(--text)' }}>آمار</h1>
            <SalesChart books={books} users={users} />
            <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
              {books.sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 4).map((book, i) => (
                <div key={book.id} style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', padding: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ fontSize: 18, fontWeight: 900, color: 'var(--primary)', minWidth: 24 }}>#{i + 1}</span>
                  <div style={{ width: 36, height: 48, background: 'var(--primary-light)', overflow: 'hidden', flexShrink: 0 }}>
                    <img src={book.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }} className="clamp-2">{book.title}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-3)' }}>امتیاز: {book.rating}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PUBLISHERS */}
        {tab === 'publishers' && (
          <div className="fade-in">
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20, color: 'var(--text)' }}>مدیریت ناشران</h1>

            {/* Sub-nav */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 28, borderBottom: '2px solid var(--border)', paddingBottom: 0 }}>
              {[
                ['books', 'کتاب‌های در انتظار تأیید', pendingBooks?.length || 0],
                ['withdrawals', 'درخواست‌های تسویه', withdrawalRequests?.filter(r => r.status === 'pending').length || 0],
              ].map(([id, label, cnt]) => (
                <button key={id} onClick={() => setPubSubTab(id)} style={{
                  padding: '9px 18px', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700,
                  background: pubSubTab === id ? 'var(--primary)' : 'var(--surface)',
                  color: pubSubTab === id ? '#fff' : 'var(--text-2)',
                  borderBottom: pubSubTab === id ? '2px solid var(--primary)' : '2px solid transparent',
                  marginBottom: -2, display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  {label}
                  {cnt > 0 && <span style={{ background: '#DC2626', color: '#fff', fontSize: 10, fontWeight: 800, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cnt}</span>}
                </button>
              ))}
            </div>

            {/* Pending Books */}
            {pubSubTab === 'books' && (
              <div>
                {(!pendingBooks || pendingBooks.length === 0) ? (
                  <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', padding: '40px 20px', textAlign: 'center' }}>
                    <div style={{ color: 'var(--text-3)', marginBottom: 8 }}><CheckIcon size={36} /></div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>هیچ کتابی در انتظار تأیید نیست</p>
                    <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 4 }}>همه درخواست‌ها بررسی شده‌اند</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {pendingBooks.map(pb => (
                      <div key={pb.id} style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', padding: 20 }}>
                        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                          {/* Cover */}
                          <div style={{ width: 60, height: 80, background: 'var(--primary-light)', flexShrink: 0, overflow: 'hidden', border: '1px solid var(--border)' }}>
                            {pb.cover ? <img src={pb.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} /> : null}
                          </div>
                          {/* Info */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>{pb.title}</h3>
                              <span style={{ fontSize: 11, padding: '2px 8px', background: '#FEF3C7', color: '#92400E', fontWeight: 700 }}>
                                {pb.type === 'digital' ? 'الکترونیک' : pb.type === 'physical' ? 'چاپی' : 'الکترونیک + چاپی'}
                              </span>
                            </div>
                            <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 4 }}>{pb.author} · {pb.category}</p>
                            <p style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 700, marginBottom: 8 }}>{Number(pb.price || 0).toLocaleString('fa-IR')} تومان</p>
                            {pb.shortDescription && <p style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.7 }} className="clamp-2">{pb.shortDescription}</p>}
                            <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                              <span style={{ fontSize: 11, color: 'var(--text-3)' }}><ClockIcon size={11} /> {pb.submittedAt || 'نامشخص'}</span>
                              {pb.pageCount && <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{pb.pageCount} صفحه</span>}
                              {pb.publishYear && <span style={{ fontSize: 11, color: 'var(--text-3)' }}>سال {pb.publishYear}</span>}
                            </div>
                          </div>
                          {/* Actions */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
                            <button onClick={() => { approveBook(pb.id); }} style={{ background: '#059669', color: '#fff', border: 'none', padding: '9px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                              <CheckIcon size={14} /> تأیید
                            </button>
                            <button onClick={() => { setRejectModal(pb.id); setRejectReason(''); }} style={{ background: '#FEF2F2', color: '#DC2626', border: '1.5px solid #FECACA', padding: '9px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                              <XIcon size={14} /> رد کردن
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Withdrawal Requests */}
            {pubSubTab === 'withdrawals' && (
              <div>
                {(!withdrawalRequests || withdrawalRequests.length === 0) ? (
                  <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', padding: '40px 20px', textAlign: 'center' }}>
                    <div style={{ color: 'var(--text-3)', marginBottom: 8 }}><DollarIcon size={36} /></div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>هیچ درخواست تسویه‌ای وجود ندارد</p>
                  </div>
                ) : (
                  <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', overflow: 'hidden' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 140px 120px 140px', gap: 8, padding: '10px 16px', background: 'var(--bg)', borderBottom: '1.5px solid var(--border)', fontSize: 11, fontWeight: 700, color: 'var(--text-3)' }}>
                      <span>#</span><span>توضیح / ناشر</span><span>مبلغ</span><span>وضعیت</span><span>عملیات</span>
                    </div>
                    {withdrawalRequests.map((wr, i) => {
                      const pub = users.find(u => u.id === wr.publisherId);
                      const isPending = wr.status === 'pending';
                      return (
                        <div key={wr.id} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 140px 120px 140px', gap: 8, padding: '14px 16px', borderBottom: i < withdrawalRequests.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'center' }}>
                          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>#{wr.id}</span>
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{pub?.name || 'ناشر'}</p>
                            {wr.note && <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{wr.note}</p>}
                            <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{wr.date || ''}</p>
                          </div>
                          <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--primary)' }}>{Number(wr.amount).toLocaleString('fa-IR')} ت</span>
                          <span style={{
                            padding: '4px 10px', fontSize: 12, fontWeight: 700, display: 'inline-block',
                            background: wr.status === 'approved' ? '#D1FAE5' : wr.status === 'rejected' ? '#FEF2F2' : '#FEF3C7',
                            color: wr.status === 'approved' ? '#059669' : wr.status === 'rejected' ? '#DC2626' : '#92400E',
                          }}>
                            {wr.status === 'approved' ? 'پرداخت شد' : wr.status === 'rejected' ? 'رد شد' : 'در انتظار'}
                          </span>
                          {isPending ? (
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button onClick={() => updateWithdrawal(wr.id, 'approved')} style={{ background: '#059669', color: '#fff', border: 'none', padding: '5px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                                <CheckIcon size={11} /> پرداخت
                              </button>
                              <button onClick={() => updateWithdrawal(wr.id, 'rejected')} style={{ background: '#FEF2F2', color: '#DC2626', border: 'none', padding: '5px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                                رد
                              </button>
                            </div>
                          ) : <span style={{ fontSize: 12, color: 'var(--text-3)' }}>—</span>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* SETTINGS */}
        {tab === 'settings' && (
          <div className="fade-in">
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20, color: 'var(--text)' }}>تنظیمات</h1>

            {/* Sub-nav */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 28, borderBottom: '2px solid var(--border)', paddingBottom: 0, flexWrap: 'wrap' }}>
              {[
                ['bulk', 'تغییر قیمت گروهی'],
                ['landing', 'محتوای لندینگ‌ها'],
                ['store', 'اطلاعات فروشگاه'],
                ['shipping', 'تنظیمات ارسال'],
                ['categories', 'دسته‌بندی‌ها'],
                ['menu', 'مدیریت منو'],
              ].map(([id, label]) => (
                <button key={id} onClick={() => setSettingsSection(id)} style={{
                  padding: '9px 18px', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700,
                  background: settingsSection === id ? 'var(--primary)' : 'var(--surface)',
                  color: settingsSection === id ? '#fff' : 'var(--text-2)',
                  borderBottom: settingsSection === id ? '2px solid var(--primary)' : '2px solid transparent',
                  marginBottom: -2,
                }}>{label}</button>
              ))}
            </div>

            {/* ── تغییر قیمت گروهی ── */}
            {settingsSection === 'bulk' && (
              <div>
                <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 20 }}>قیمت کتاب‌ها را به صورت دسته‌جمعی کاهش یا افزایش دهید.</p>
                <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', padding: 24, maxWidth: 560 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6 }}>نوع کتاب</label>
                      <select value={bulkForm.bookType} onChange={e => setBulkForm(p => ({ ...p, bookType: e.target.value }))}
                        style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--border)', fontSize: 13, background: 'var(--surface)', color: 'var(--text)', outline: 'none' }}>
                        <option value="digital">دیجیتال</option>
                        <option value="physical">چاپی</option>
                        <option value="all">همه کتاب‌ها</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6 }}>فیلد قیمت</label>
                      <select value={bulkForm.priceField} onChange={e => setBulkForm(p => ({ ...p, priceField: e.target.value }))}
                        style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--border)', fontSize: 13, background: 'var(--surface)', color: 'var(--text)', outline: 'none' }}>
                        <option value="price">قیمت فروش</option>
                        <option value="originalPrice">قیمت اصلی (قبل از تخفیف)</option>
                        <option value="physicalPrice">قیمت چاپی</option>
                        <option value="both">قیمت فروش + چاپی</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6 }}>روش تغییر</label>
                      <select value={bulkForm.mode} onChange={e => setBulkForm(p => ({ ...p, mode: e.target.value }))}
                        style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--border)', fontSize: 13, background: 'var(--surface)', color: 'var(--text)', outline: 'none' }}>
                        <option value="percent">درصدی (%)</option>
                        <option value="fixed">عدد ثابت (تومان)</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6 }}>جهت</label>
                      <select value={bulkForm.direction} onChange={e => setBulkForm(p => ({ ...p, direction: e.target.value }))}
                        style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--border)', fontSize: 13, background: 'var(--surface)', color: 'var(--text)', outline: 'none' }}>
                        <option value="increase">افزایش ↑</option>
                        <option value="decrease">کاهش ↓</option>
                      </select>
                    </div>
                    <div style={{ gridColumn: '1/-1' }}>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6 }}>
                        مقدار {bulkForm.mode === 'percent' ? '(درصد)' : '(تومان)'}
                      </label>
                      <input type="number" value={bulkForm.amount} onChange={e => setBulkForm(p => ({ ...p, amount: e.target.value }))}
                        placeholder={bulkForm.mode === 'percent' ? 'مثلاً: ۱۰' : 'مثلاً: ۵۰۰۰۰'}
                        style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--border)', fontSize: 13, background: 'var(--surface)', color: 'var(--text)', outline: 'none' }} />
                    </div>
                  </div>

                  {/* Preview */}
                  {bulkForm.amount > 0 && (
                    <div style={{ background: bulkForm.direction === 'increase' ? '#D1FAE5' : '#FEF3C7', border: `1px solid ${bulkForm.direction === 'increase' ? '#059669' : '#D97706'}`, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: 'var(--text)' }}>
                      {bulkForm.direction === 'increase' ? '↑' : '↓'} {bulkForm.mode === 'percent' ? `${bulkForm.amount}٪ ` : `${Number(bulkForm.amount).toLocaleString('fa-IR')} تومان `}
                      {bulkForm.direction === 'increase' ? 'افزایش' : 'کاهش'} قیمت برای کتاب‌های {bulkForm.bookType === 'digital' ? 'دیجیتال' : bulkForm.bookType === 'physical' ? 'چاپی' : 'همه'}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <button
                      disabled={!bulkForm.amount || Number(bulkForm.amount) <= 0}
                      onClick={() => {
                        bulkUpdatePrices({ ...bulkForm, amount: Number(bulkForm.amount) });
                        setBulkDone(`قیمت‌ها با موفقیت ${bulkForm.direction === 'increase' ? 'افزایش' : 'کاهش'} یافت`);
                        setTimeout(() => setBulkDone(''), 3500);
                      }}
                      style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '10px 24px', fontSize: 13, fontWeight: 700, cursor: !bulkForm.amount || Number(bulkForm.amount) <= 0 ? 'not-allowed' : 'pointer', opacity: !bulkForm.amount || Number(bulkForm.amount) <= 0 ? 0.5 : 1 }}>
                      اعمال تغییرات
                    </button>
                    {bulkDone && <span style={{ fontSize: 13, color: '#059669', fontWeight: 700 }}>✓ {bulkDone}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* ── محتوای لندینگ‌ها ── */}
            {settingsSection === 'landing' && (
              <div style={{ maxWidth: 640 }}>
                <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 20 }}>متن‌های نمایش داده شده در صفحه اصلی را ویرایش کنید.</p>

                {/* هیرو */}
                <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', padding: 24, marginBottom: 20 }}>
                  <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)', marginBottom: 16, borderBottom: '1.5px solid var(--border)', paddingBottom: 10 }}>هیرو صفحه اصلی</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[
                      ['heroBadge', 'بج بالا (نوار کوچک)'],
                      ['heroTitle', 'خط اول تیتر'],
                      ['heroTitleAccent', 'خط دوم تیتر (رنگی)'],
                      ['heroTitleEnd', 'خط سوم تیتر'],
                      ['heroSubtitle', 'متن زیر تیتر'],
                      ['heroDigitalBtn', 'دکمه کتاب‌های دیجیتال'],
                      ['heroPhysicalBtn', 'دکمه کتاب‌های چاپی'],
                    ].map(([key, label]) => (
                      <div key={key}>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 4 }}>{label}</label>
                        <input value={siteSettings[key] || ''} onChange={e => updateSiteSettings({ [key]: e.target.value })}
                          style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--border)', fontSize: 13, background: 'var(--surface)', color: 'var(--text)', outline: 'none' }}
                          onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                          onBlur={e => e.target.style.borderColor = 'var(--border)'}
                        />
                      </div>
                    ))}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                      {[
                        ['heroStat1', 'آمار ۱ (عدد)', 'heroStat1Label', 'آمار ۱ (برچسب)'],
                        ['heroStat2', 'آمار ۲ (عدد)', 'heroStat2Label', 'آمار ۲ (برچسب)'],
                        ['heroStat3', 'آمار ۳ (عدد)', 'heroStat3Label', 'آمار ۳ (برچسب)'],
                      ].map(([k1, l1, k2, l2]) => (
                        <div key={k1} style={{ background: 'var(--bg)', padding: 10, border: '1px solid var(--border)' }}>
                          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-3)', marginBottom: 4 }}>{l1}</label>
                          <input value={siteSettings[k1] || ''} onChange={e => updateSiteSettings({ [k1]: e.target.value })}
                            style={{ width: '100%', padding: '6px 8px', border: '1px solid var(--border)', fontSize: 13, background: '#fff', color: 'var(--text)', outline: 'none', marginBottom: 6 }} />
                          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-3)', marginBottom: 4 }}>{l2}</label>
                          <input value={siteSettings[k2] || ''} onChange={e => updateSiteSettings({ [k2]: e.target.value })}
                            style={{ width: '100%', padding: '6px 8px', border: '1px solid var(--border)', fontSize: 13, background: '#fff', color: 'var(--text)', outline: 'none' }} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* بنر چاپی */}
                <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', padding: 24, marginBottom: 20 }}>
                  <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)', marginBottom: 16, borderBottom: '1.5px solid var(--border)', paddingBottom: 10 }}>بنر کتاب‌های چاپی</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[
                      ['physicalTitle', 'تیتر (خط اول)'],
                      ['physicalTitleAccent', 'تیتر (خط دوم — رنگ طلایی)'],
                      ['physicalSubtitle', 'توضیح'],
                      ['physicalBtn', 'متن دکمه'],
                    ].map(([key, label]) => (
                      <div key={key}>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 4 }}>{label}</label>
                        <input value={siteSettings[key] || ''} onChange={e => updateSiteSettings({ [key]: e.target.value })}
                          style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--border)', fontSize: 13, background: 'var(--surface)', color: 'var(--text)', outline: 'none' }}
                          onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                          onBlur={e => e.target.style.borderColor = 'var(--border)'}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={() => { resetSiteSettings(); }} style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', padding: '9px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                  بازگشت به تنظیمات پیش‌فرض
                </button>
              </div>
            )}

            {/* ── اطلاعات فروشگاه ── */}
            {settingsSection === 'store' && (
              <div style={{ maxWidth: 540 }}>
                <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 20 }}>اطلاعات پایه فروشگاه شما.</p>
                <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', padding: 24 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {[
                      ['siteName', 'نام فروشگاه'],
                      ['siteDesc', 'توضیح کوتاه فروشگاه'],
                      ['siteEmail', 'ایمیل تماس'],
                      ['sitePhone', 'شماره تلفن'],
                      ['siteAddress', 'آدرس'],
                    ].map(([key, label]) => (
                      <div key={key}>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>{label}</label>
                        <input value={siteSettings[key] || ''} onChange={e => updateSiteSettings({ [key]: e.target.value })}
                          style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--border)', fontSize: 13, background: 'var(--surface)', color: 'var(--text)', outline: 'none' }}
                          onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                          onBlur={e => e.target.style.borderColor = 'var(--border)'}
                        />
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: 12, color: '#059669', fontWeight: 600, marginTop: 16 }}>✓ تغییرات به صورت خودکار ذخیره می‌شوند</p>
                </div>
              </div>
            )}

            {/* ── تنظیمات ارسال ── */}
            {settingsSection === 'shipping' && (
              <div style={{ maxWidth: 540 }}>
                <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 20 }}>هزینه ارسال و حد رایگان شدن آن را تنظیم کنید.</p>
                <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', padding: 24 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>هزینه ارسال (تومان)</label>
                      <input type="number" value={siteSettings.shippingCost || ''} onChange={e => updateSiteSettings({ shippingCost: Number(e.target.value) })}
                        style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--border)', fontSize: 13, background: 'var(--surface)', color: 'var(--text)', outline: 'none' }}
                        onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                        onBlur={e => e.target.style.borderColor = 'var(--border)'}
                      />
                      <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>فعلاً: {(siteSettings.shippingCost || 0).toLocaleString('fa-IR')} تومان</p>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>حداقل خرید برای ارسال رایگان (تومان)</label>
                      <input type="number" value={siteSettings.freeShippingMin || ''} onChange={e => updateSiteSettings({ freeShippingMin: Number(e.target.value) })}
                        style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--border)', fontSize: 13, background: 'var(--surface)', color: 'var(--text)', outline: 'none' }}
                        onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                        onBlur={e => e.target.style.borderColor = 'var(--border)'}
                      />
                      <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>فعلاً: خریدهای بالای {(siteSettings.freeShippingMin || 0).toLocaleString('fa-IR')} تومان ارسال رایگان دارند</p>
                    </div>
                  </div>
                  <div style={{ marginTop: 20, padding: '12px 16px', background: 'var(--primary-light)', border: '1px solid var(--primary)', fontSize: 13, color: 'var(--primary)' }}>
                    <strong>خلاصه:</strong> ارسال {(siteSettings.shippingCost || 0).toLocaleString('fa-IR')} تومان — رایگان از {(siteSettings.freeShippingMin || 0).toLocaleString('fa-IR')} تومان به بالا
                  </div>
                  <p style={{ fontSize: 12, color: '#059669', fontWeight: 600, marginTop: 16 }}>✓ تغییرات به صورت خودکار ذخیره می‌شوند</p>
                </div>
              </div>
            )}

            {/* ── دسته‌بندی‌ها ── */}
            {settingsSection === 'categories' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', padding: 24 }}>
                  <CategoryManager categories={bookCategories} onAdd={addBookCategory} onRemove={removeBookCategory} label="دسته‌بندی‌های کتاب" />
                </div>
                <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', padding: 24 }}>
                  <CategoryManager categories={postCategories} onAdd={addPostCategory} onRemove={removePostCategory} label="دسته‌بندی‌های بلاگ" />
                </div>
              </div>
            )}

            {/* ── مدیریت منو ── */}
            {settingsSection === 'menu' && (
              <div style={{ maxWidth: 560 }}>
                <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 20 }}>لینک‌های نمایش داده‌شده در نوار ناوبری سایت را مدیریت کنید.</p>
                <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', padding: 24, marginBottom: 20 }}>
                  <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)', marginBottom: 16, borderBottom: '1.5px solid var(--border)', paddingBottom: 10 }}>لینک‌های فعلی منو</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {(navLinks || []).map(link => (
                      <div key={link.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'var(--bg)', border: `1.5px solid ${link.enabled ? 'var(--primary)' : 'var(--border)'}` }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{link.label}</p>
                          <p style={{ fontSize: 11, color: 'var(--text-3)', direction: 'ltr', textAlign: 'right' }}>{link.to}</p>
                        </div>
                        {/* Enable/disable toggle */}
                        <button onClick={() => updateNavLinks(navLinks.map(l => l.id === link.id ? { ...l, enabled: !l.enabled } : l))}
                          style={{
                            padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 700,
                            background: link.enabled ? 'var(--primary)' : 'var(--bg)',
                            color: link.enabled ? '#fff' : 'var(--text-3)',
                            border: `1.5px solid ${link.enabled ? 'var(--primary)' : 'var(--border)'}`,
                          }}>
                          {link.enabled ? 'فعال' : 'غیرفعال'}
                        </button>
                        {/* Delete (only for custom links, not system ones with id<=4) */}
                        {link.id > 4 && (
                          <button onClick={() => updateNavLinks(navLinks.filter(l => l.id !== link.id))}
                            style={{ background: '#FEF2F2', color: '#DC2626', border: 'none', padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <TrashIcon size={13} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add custom link */}
                <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', padding: 24 }}>
                  <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)', marginBottom: 16, borderBottom: '1.5px solid var(--border)', paddingBottom: 10 }}>افزودن لینک سفارشی</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>عنوان لینک</label>
                      <input value={newNavLink.label} onChange={e => setNewNavLink(p => ({ ...p, label: e.target.value }))}
                        placeholder="مثلاً: تماس با ما"
                        style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--border)', fontSize: 13, background: 'var(--surface)', color: 'var(--text)', outline: 'none' }}
                        onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                        onBlur={e => e.target.style.borderColor = 'var(--border)'}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>آدرس (مسیر)</label>
                      <input value={newNavLink.to} onChange={e => setNewNavLink(p => ({ ...p, to: e.target.value }))}
                        placeholder="مثلاً: /contact"
                        dir="ltr"
                        style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--border)', fontSize: 13, background: 'var(--surface)', color: 'var(--text)', outline: 'none' }}
                        onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                        onBlur={e => e.target.style.borderColor = 'var(--border)'}
                      />
                    </div>
                    <button
                      disabled={!newNavLink.label.trim() || !newNavLink.to.trim()}
                      onClick={() => {
                        if (!newNavLink.label.trim() || !newNavLink.to.trim()) return;
                        const maxId = Math.max(...(navLinks || []).map(l => l.id), 4);
                        updateNavLinks([...(navLinks || []), { id: maxId + 1, label: newNavLink.label.trim(), to: newNavLink.to.trim(), enabled: true }]);
                        setNewNavLink({ label: '', to: '' });
                      }}
                      style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, opacity: (!newNavLink.label.trim() || !newNavLink.to.trim()) ? 0.5 : 1 }}>
                      <PlusIcon size={14} /> افزودن به منو
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Reject book modal */}
      {rejectModal && (
        <>
          <div onClick={() => setRejectModal(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'var(--surface)', padding: 28, zIndex: 301, maxWidth: 400, width: '90%', direction: 'rtl', border: '2px solid var(--dark)', boxShadow: '6px 6px 0 var(--dark)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, color: '#DC2626' }}>
              <XIcon size={22} />
              <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)' }}>رد درخواست کتاب</h3>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 14 }}>دلیل رد کتاب را بنویسید (اختیاری):</p>
            <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={3} placeholder="مثلاً: اطلاعات ناقص است..."
              style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--border)', fontSize: 13, resize: 'vertical', outline: 'none', background: 'var(--bg)', color: 'var(--text)', fontFamily: 'inherit', marginBottom: 16 }}
              onFocus={e => e.target.style.borderColor = '#DC2626'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setRejectModal(null)} style={{ padding: '9px 16px', border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', fontSize: 13, color: 'var(--text)' }}>انصراف</button>
              <button onClick={() => { rejectBook(rejectModal, rejectReason); setRejectModal(null); setRejectReason(''); }} style={{ padding: '9px 20px', border: 'none', background: '#DC2626', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
                رد کردن
              </button>
            </div>
          </div>
        </>
      )}

      {/* Delete confirm */}
      {confirmDel && (
        <>
          <div onClick={() => setConfirmDel(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'var(--surface)', padding: 28, zIndex: 301, maxWidth: 360, width: '90%', textAlign: 'center', direction: 'rtl', border: '2px solid var(--dark)', boxShadow: '6px 6px 0 var(--dark)' }}>
            <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'center', color: 'var(--red)' }}><TrashIcon size={36} /></div>
            <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 8, color: 'var(--text)' }}>
              حذف {confirmDel.type === 'book' ? 'کتاب' : confirmDel.type === 'post' ? 'مقاله' : 'کاربر'}؟
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 20 }}>«{confirmDel.name}» حذف خواهد شد.</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button onClick={() => setConfirmDel(null)} style={{ padding: '9px 20px', border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', fontSize: 13, color: 'var(--text)' }}>انصراف</button>
              <button onClick={() => {
                if (confirmDel.type === 'book') deleteBook(confirmDel.id);
                else if (confirmDel.type === 'post') deletePost(confirmDel.id);
                else if (confirmDel.type === 'user') deleteUser(confirmDel.id);
                setConfirmDel(null);
              }} style={{ padding: '9px 20px', border: 'none', background: '#DC2626', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>حذف کن</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function AF({ label, value, onChange, type = 'text', options, optionLabels, rows = 3, span, required }) {
  return (
    <div style={{ gridColumn: span ? '1/-1' : undefined }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-2)' }}>{label}</label>
      {type === 'textarea'
        ? <textarea value={value} onChange={onChange} rows={rows} required={required}
            style={{ width: '100%', padding: '10px 12px', border: '2px solid var(--border)', fontSize: 14, resize: 'vertical', outline: 'none', fontFamily: 'inherit', background: 'var(--surface)', color: 'var(--text)' }}
            onFocus={e => e.target.style.borderColor = 'var(--primary)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        : type === 'select'
        ? <select value={value} onChange={onChange} style={{ width: '100%', padding: '10px 12px', border: '2px solid var(--border)', fontSize: 14, outline: 'none', background: 'var(--surface)', color: 'var(--text)' }}
            onFocus={e => e.target.style.borderColor = 'var(--primary)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          >
            {options?.map((o, i) => <option key={o} value={o}>{optionLabels ? optionLabels[i] : o}</option>)}
          </select>
        : <input type={type} value={value} onChange={onChange} required={required}
            style={{ width: '100%', padding: '10px 12px', border: '2px solid var(--border)', fontSize: 14, outline: 'none', background: 'var(--surface)', color: 'var(--text)' }}
            onFocus={e => e.target.style.borderColor = 'var(--primary)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
      }
    </div>
  );
}
