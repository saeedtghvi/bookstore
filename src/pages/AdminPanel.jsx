import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BookOpenIcon, FileTextIcon, HomeIcon, SettingsIcon, LogOutIcon, GlobeIcon, EditIcon, TrashIcon, PlusIcon, CheckIcon } from '../components/Icons';

const EMPTY_BOOK = { title: '', author: '', translator: '', price: '', originalPrice: '', cover: '', category: 'رمان کلاسیک', shortDescription: '', description: '', sampleContent: '', tags: '', pageCount: '', publishYear: '', publisher: '', language: 'فارسی', featured: false, rating: 4.5, reviewCount: 0 };
const EMPTY_POST = { title: '', slug: '', excerpt: '', content: '', author: '', category: 'راهنما', cover: '', readTime: 5, tags: '' };

export default function AdminPanel() {
  const { user, books, addBook, updateBook, deleteBook, posts, addPost, updatePost, deletePost, logout } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState('dashboard');
  const [bookForm, setBookForm] = useState(null);
  const [postForm, setPostForm] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);

  const nav = [
    { id: 'dashboard', icon: <HomeIcon size={16} />, label: 'داشبورد' },
    { id: 'books', icon: <BookOpenIcon size={16} />, label: 'کتاب‌ها' },
    { id: 'blog', icon: <FileTextIcon size={16} />, label: 'بلاگ' },
  ];

  const setB = (k) => (e) => setBookForm(p => ({ ...p, [k]: e.type === 'checkbox' ? e.target.checked : e.target.value }));
  const setP = (k) => (e) => setPostForm(p => ({ ...p, [k]: e.target.value }));

  const saveBook = () => {
    const book = { ...bookForm, price: Number(bookForm.price), originalPrice: Number(bookForm.originalPrice) || 0, pageCount: Number(bookForm.pageCount) || 0, publishYear: Number(bookForm.publishYear) || 0, tags: (bookForm.tags || '').split(',').map(t => t.trim()).filter(Boolean) };
    if (book.id) updateBook(book); else addBook(book);
    setBookForm(null);
  };

  const savePost = () => {
    const post = { ...postForm, tags: (postForm.tags || '').split(',').map(t => t.trim()).filter(Boolean), date: new Date().toLocaleDateString('fa-IR') };
    if (post.id) updatePost(post); else addPost(post);
    setPostForm(null);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', direction: 'rtl', display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{ width: 220, background: 'var(--dark)', position: 'sticky', top: 0, height: '100vh', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            <div style={{ background: 'var(--primary)', padding: '5px 6px', display: 'flex' }}>
              <SettingsIcon size={14} />
            </div>
            <p style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>پنل مدیریت</p>
          </div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4, marginRight: 30 }}>{user.name}</p>
        </div>
        <nav style={{ flex: 1, padding: 12 }}>
          {nav.map(n => (
            <button key={n.id} onClick={() => { setTab(n.id); setBookForm(null); setPostForm(null); }} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 'var(--r-md)', border: 'none', cursor: 'pointer',
              background: tab === n.id ? 'rgba(255,255,255,0.12)' : 'transparent',
              color: tab === n.id ? '#fff' : 'rgba(255,255,255,0.5)',
              fontSize: 14, fontWeight: tab === n.id ? 700 : 400, marginBottom: 4, textAlign: 'right',
            }}>
              <span>{n.icon}</span> {n.label}
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
      <main style={{ flex: 1, padding: 28, overflowY: 'auto' }}>

        {/* DASHBOARD */}
        {tab === 'dashboard' && (
          <div className="fade-in">
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>داشبورد</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16, marginBottom: 32 }}>
              {[
                { icon: <BookOpenIcon size={22} />, value: books.length, label: 'کتاب', color: 'var(--primary-light)', tc: 'var(--primary)' },
                { icon: <FileTextIcon size={22} />, value: posts.length, label: 'مقاله بلاگ', color: '#FEF3C7', tc: '#B45309' },
                { icon: <CheckIcon size={22} />, value: books.filter(b => b.featured).length, label: 'کتاب ویژه', color: '#D1FAE5', tc: '#059669' },
              ].map(s => (
                <div key={s.label} style={{ background: s.color, border: `1.5px solid ${s.tc}22`, padding: 20 }}>
                  <div style={{ color: s.tc, marginBottom: 10 }}>{s.icon}</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: s.tc }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: s.tc, opacity: 0.8, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ background: '#fff', borderRadius: 'var(--r-xl)', padding: 20, border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>آخرین کتاب‌ها</h3>
              {books.slice(-4).reverse().map(b => (
                <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ width: 36, height: 48, borderRadius: 6, overflow: 'hidden', background: 'var(--purple-light)', flexShrink: 0 }}>
                    <img src={b.cover} alt={b.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 600 }}>{b.title}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-3)' }}>{b.author} · {b.price?.toLocaleString('fa-IR')} ت</p>
                  </div>
                  <button onClick={() => { setTab('books'); setBookForm(b); }} style={{ fontSize: 12, color: 'var(--purple)', background: 'var(--purple-light)', border: 'none', padding: '4px 10px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}><EditIcon size={11} /> ویرایش</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BOOKS */}
        {tab === 'books' && !bookForm && (
          <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 800 }}>مدیریت کتاب‌ها</h1>
                <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 2 }}>{books.length} کتاب ثبت شده</p>
              </div>
              <button onClick={() => setBookForm(EMPTY_BOOK)} style={{ background: 'var(--purple)', color: '#fff', border: 'none', padding: '10px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><PlusIcon size={14} /> کتاب جدید</button>
            </div>
            <div style={{ background: '#fff', borderRadius: 'var(--r-xl)', border: '1px solid var(--border)', overflow: 'hidden' }}>
              {books.map((b, i) => (
                <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderBottom: i < books.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ width: 40, height: 52, borderRadius: 6, overflow: 'hidden', background: 'var(--purple-light)', flexShrink: 0 }}>
                    <img src={b.cover} alt={b.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 700 }} className="clamp-1">{b.title}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{b.author} · {b.category}</p>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--purple)', whiteSpace: 'nowrap' }}>{b.price?.toLocaleString('fa-IR')} ت</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => setBookForm(b)} style={{ fontSize: 12, background: 'var(--purple-light)', color: 'var(--purple)', border: 'none', padding: '5px 12px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}><EditIcon size={11} /> ویرایش</button>
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
              <h1 style={{ fontSize: 22, fontWeight: 800 }}>{bookForm.id ? 'ویرایش کتاب' : 'کتاب جدید'}</h1>
              <button onClick={() => setBookForm(null)} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--r-pill)', padding: '8px 16px', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>انصراف</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <AF label="عنوان کتاب *" value={bookForm.title} onChange={setB('title')} required />
              <AF label="نویسنده *" value={bookForm.author} onChange={setB('author')} required />
              <AF label="مترجم" value={bookForm.translator} onChange={setB('translator')} />
              <AF label="قیمت (تومان) *" value={bookForm.price} onChange={setB('price')} type="number" required />
              <AF label="قیمت اصلی (قبل از تخفیف)" value={bookForm.originalPrice} onChange={setB('originalPrice')} type="number" />
              <AF label="دسته‌بندی" value={bookForm.category} onChange={setB('category')} type="select" options={['رمان کلاسیک','رمان معاصر','فانتزی','کلاسیک','ادبیات فارسی','علمی-تخیلی','رمان تاریخی']} />
              <AF label="آدرس تصویر جلد" value={bookForm.cover} onChange={setB('cover')} span={2} />
              <AF label="توضیح کوتاه" value={bookForm.shortDescription} onChange={setB('shortDescription')} span={2} />
              <AF label="توضیح کامل" value={bookForm.description} onChange={setB('description')} type="textarea" rows={4} span={2} />
              <AF label="تعداد صفحه" value={bookForm.pageCount} onChange={setB('pageCount')} type="number" />
              <AF label="سال انتشار" value={bookForm.publishYear} onChange={setB('publishYear')} type="number" />
              <AF label="ناشر" value={bookForm.publisher} onChange={setB('publisher')} />
              <AF label="برچسب‌ها (با کاما جدا کنید)" value={bookForm.tags} onChange={setB('tags')} />
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', marginBottom: 16 }}>
                  <input type="checkbox" checked={bookForm.featured} onChange={setB('featured')} />
                  <span>کتاب ویژه (نمایش در بخش Featured)</span>
                </label>
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-2)' }}>
                  📖 محتوای کتاب (HTML) — این محتوا برای خوانندگان نمایش داده می‌شود
                </label>
                <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '8px 12px', marginBottom: 6, fontSize: 12, color: 'var(--text-3)' }}>
                  می‌توانید HTML کامل صفحات کتاب را اینجا وارد کنید: &lt;h2&gt;فصل اول&lt;/h2&gt;&lt;p&gt;متن...&lt;/p&gt;
                </div>
                <textarea value={bookForm.sampleContent} onChange={setB('sampleContent')} rows={10}
                  placeholder="<h2>فصل اول</h2>&#10;<p>متن کتاب را اینجا بنویسید...</p>&#10;<blockquote>نقل قول مهم</blockquote>"
                  style={{ width: '100%', padding: '12px', border: '2px solid var(--border)', borderRadius: 'var(--r-md)', fontSize: 13, resize: 'vertical', fontFamily: 'monospace', direction: 'ltr', outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = 'var(--purple)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={saveBook} style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '12px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckIcon size={15} /> ذخیره کتاب
              </button>
              <button onClick={() => setBookForm(null)} style={{ background: 'var(--bg)', color: 'var(--text-2)', border: '1px solid var(--border)', borderRadius: 'var(--r-pill)', padding: '12px 20px', fontSize: 14, cursor: 'pointer' }}>انصراف</button>
            </div>
          </div>
        )}

        {/* BLOG LIST */}
        {tab === 'blog' && !postForm && (
          <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 800 }}>مدیریت بلاگ</h1>
                <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 2 }}>{posts.length} مقاله</p>
              </div>
              <button onClick={() => setPostForm(EMPTY_POST)} style={{ background: 'var(--purple)', color: '#fff', border: 'none', borderRadius: 'var(--r-pill)', padding: '10px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><PlusIcon size={14} /> مقاله جدید</button>
            </div>
            <div style={{ background: '#fff', borderRadius: 'var(--r-xl)', border: '1px solid var(--border)', overflow: 'hidden' }}>
              {posts.map((p, i) => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderBottom: i < posts.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ width: 60, height: 40, borderRadius: 8, overflow: 'hidden', background: 'var(--bg)', flexShrink: 0 }}>
                    <img src={p.cover} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 700 }} className="clamp-1">{p.title}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 1 }}>{p.date} · {p.category} · {p.readTime} دقیقه</p>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => setPostForm({ ...p, tags: p.tags?.join(', ') || '' })} style={{ fontSize: 12, background: 'var(--purple-light)', color: 'var(--purple)', border: 'none', padding: '5px 12px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}><EditIcon size={11} /> ویرایش</button>
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
              <h1 style={{ fontSize: 22, fontWeight: 800 }}>{postForm.id ? 'ویرایش مقاله' : 'مقاله جدید'}</h1>
              <button onClick={() => setPostForm(null)} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--r-pill)', padding: '8px 16px', fontSize: 13, cursor: 'pointer' }}>انصراف</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <AF label="عنوان مقاله *" value={postForm.title} onChange={setP('title')} span={2} required />
              <AF label="آدرس (slug) — مثال: my-post-title" value={postForm.slug} onChange={setP('slug')} />
              <AF label="دسته‌بندی" value={postForm.category} onChange={setP('category')} type="select" options={['راهنما','معرفی کتاب','سبک زندگی','اخبار']} />
              <AF label="نویسنده" value={postForm.author} onChange={setP('author')} />
              <AF label="زمان مطالعه (دقیقه)" value={postForm.readTime} onChange={setP('readTime')} type="number" />
              <AF label="آدرس تصویر شاخص" value={postForm.cover} onChange={setP('cover')} span={2} />
              <AF label="خلاصه مقاله" value={postForm.excerpt} onChange={setP('excerpt')} type="textarea" rows={3} span={2} />
              <AF label="برچسب‌ها (با کاما)" value={postForm.tags} onChange={setP('tags')} span={2} />
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-2)' }}>📝 محتوای مقاله (HTML)</label>
                <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '8px 12px', marginBottom: 6, fontSize: 12, color: 'var(--text-3)' }}>
                  تگ‌های مجاز: &lt;h2&gt; &lt;h3&gt; &lt;p&gt; &lt;strong&gt; &lt;blockquote&gt; &lt;ul&gt; &lt;li&gt;
                </div>
                <textarea value={postForm.content} onChange={setP('content')} rows={12}
                  placeholder="<h2>عنوان بخش</h2>&#10;<p>متن مقاله...</p>&#10;<blockquote>نقل قول</blockquote>"
                  style={{ width: '100%', padding: '12px', border: '2px solid var(--border)', borderRadius: 'var(--r-md)', fontSize: 13, resize: 'vertical', fontFamily: 'monospace', direction: 'ltr', outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = 'var(--purple)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={savePost} style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '12px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><CheckIcon size={15} /> انتشار مقاله</button>
              <button onClick={() => setPostForm(null)} style={{ background: 'var(--bg)', color: 'var(--text-2)', border: '1px solid var(--border)', borderRadius: 'var(--r-pill)', padding: '12px 20px', fontSize: 14, cursor: 'pointer' }}>انصراف</button>
            </div>
          </div>
        )}
      </main>

      {/* Delete confirm */}
      {confirmDel && (
        <>
          <div onClick={() => setConfirmDel(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: '#fff', borderRadius: 'var(--r-xl)', padding: 28, zIndex: 301, maxWidth: 360, width: '90%', textAlign: 'center', direction: 'rtl' }}>
            <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'center', color: 'var(--red)' }}><TrashIcon size={36} /></div>
            <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 8 }}>حذف {confirmDel.type === 'book' ? 'کتاب' : 'مقاله'}؟</h3>
            <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 20 }}>«{confirmDel.name}» حذف خواهد شد. این عمل قابل بازگشت نیست.</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button onClick={() => setConfirmDel(null)} style={{ padding: '9px 20px', border: '1px solid var(--border)', borderRadius: 'var(--r-pill)', background: '#fff', cursor: 'pointer', fontSize: 13 }}>انصراف</button>
              <button onClick={() => { confirmDel.type === 'book' ? deleteBook(confirmDel.id) : deletePost(confirmDel.id); setConfirmDel(null); }} style={{ padding: '9px 20px', border: 'none', borderRadius: 'var(--r-pill)', background: '#DC2626', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>حذف کن</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Admin Form Field
function AF({ label, value, onChange, type = 'text', options, rows = 3, span, required, placeholder }) {
  const style = {
    gridColumn: span ? '1/-1' : undefined,
  };
  return (
    <div style={style}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-2)' }}>{label}</label>
      {type === 'textarea'
        ? <textarea value={value} onChange={onChange} rows={rows} required={required} placeholder={placeholder}
            style={{ width: '100%', padding: '10px 12px', border: '2px solid var(--border)', borderRadius: 'var(--r-md)', fontSize: 14, resize: 'vertical', outline: 'none', fontFamily: 'inherit' }}
            onFocus={e => e.target.style.borderColor = 'var(--purple)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        : type === 'select'
        ? <select value={value} onChange={onChange} style={{ width: '100%', padding: '10px 12px', border: '2px solid var(--border)', borderRadius: 'var(--r-md)', fontSize: 14, outline: 'none', background: '#fff' }}
            onFocus={e => e.target.style.borderColor = 'var(--purple)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          >
            {options?.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        : <input type={type} value={value} onChange={onChange} required={required} placeholder={placeholder}
            style={{ width: '100%', padding: '10px 12px', border: '2px solid var(--border)', borderRadius: 'var(--r-md)', fontSize: 14, outline: 'none', background: '#fff' }}
            onFocus={e => e.target.style.borderColor = 'var(--purple)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
      }
    </div>
  );
}
