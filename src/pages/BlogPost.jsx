import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useApp } from '../context/AppContext';

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { posts } = useApp();
  const post = posts.find(p => p.slug === slug);
  const related = posts.filter(p => p.id !== post?.id).slice(0, 3);

  if (!post) return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <p style={{ fontSize: 18 }}>مقاله‌ای یافت نشد</p>
      <button onClick={() => navigate('/blog')} style={{ marginTop: 12, padding: '10px 24px', background: 'var(--purple)', color: '#fff', border: 'none', borderRadius: 'var(--r-pill)', cursor: 'pointer' }}>بازگشت به بلاگ</button>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1, direction: 'rtl', background: 'var(--bg)' }}>
        {/* Hero */}
        <div style={{ position: 'relative', height: 'clamp(220px,35vw,380px)', overflow: 'hidden', background: 'var(--dark)' }}>
          <img src={post.cover} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', padding: '32px 24px', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }}>
            <div style={{ maxWidth: 800, width: '100%', margin: '0 auto' }}>
              <span style={{ display: 'inline-block', background: 'var(--purple)', color: '#fff', padding: '3px 12px', borderRadius: 'var(--r-pill)', fontSize: 12, fontWeight: 700, marginBottom: 10 }}>{post.category}</span>
              <h1 style={{ color: '#fff', fontSize: 'clamp(18px,3.5vw,32px)', fontWeight: 900, lineHeight: 1.3 }}>{post.title}</h1>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 800, margin: '0 auto', padding: '36px 24px' }}>
          {/* Meta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13, color: 'var(--text-3)', marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
            <span>✍️ {post.author}</span>
            <span>📅 {post.date}</span>
            <span>⏱ {post.readTime} دقیقه مطالعه</span>
          </div>

          {/* Excerpt */}
          <p style={{ fontSize: 17, color: 'var(--text-2)', lineHeight: 2, background: 'var(--purple-light)', borderRight: '4px solid var(--purple)', padding: '16px 20px', borderRadius: 'var(--r-md)', marginBottom: 28 }}>
            {post.excerpt}
          </p>

          {/* Content */}
          <div dangerouslySetInnerHTML={{ __html: post.content }}
            style={{ fontSize: 16, lineHeight: 2.1, color: 'var(--text)' }}
          />
          <style>{`
            article h2, article h3 { margin: 2em 0 0.75em; font-weight: 800; line-height: 1.3; }
            article p { margin-bottom: 1.4em; }
            article blockquote { border-right: 3px solid var(--purple); padding-right: 16px; margin: 1.5em 0; color: var(--text-2); font-style: italic; }
            article strong { color: var(--text); }
          `}</style>

          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
            {post.tags?.map(t => (
              <span key={t} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--r-pill)', padding: '4px 14px', fontSize: 13, color: 'var(--text-2)' }}>#{t}</span>
            ))}
          </div>

          {/* Back */}
          <button onClick={() => navigate('/blog')} style={{ marginTop: 32, padding: '10px 24px', background: 'none', border: '2px solid var(--border)', borderRadius: 'var(--r-pill)', fontSize: 14, fontWeight: 600, cursor: 'pointer', color: 'var(--text-2)', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--purple)'; e.currentTarget.style.color = 'var(--purple)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-2)'; }}
          >← بازگشت به بلاگ</button>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div style={{ background: '#fff', padding: '40px 24px', borderTop: '1px solid var(--border)', direction: 'rtl' }}>
            <div style={{ maxWidth: 1280, margin: '0 auto' }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20 }}>مقالات مرتبط</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
                {related.map(p => (
                  <div key={p.id} onClick={() => navigate(`/blog/${p.slug}`)} className="hover-lift"
                    style={{ background: 'var(--bg)', borderRadius: 'var(--r-lg)', overflow: 'hidden', cursor: 'pointer', border: '1px solid var(--border)' }}>
                    <img src={p.cover} alt={p.title} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
                    <div style={{ padding: 16 }}>
                      <h3 style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.5 }} className="clamp-2">{p.title}</h3>
                      <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 6 }}>{p.date} · {p.readTime} دقیقه</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
