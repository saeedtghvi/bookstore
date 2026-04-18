import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useApp } from '../context/AppContext';

export default function Blog() {
  const { posts } = useApp();
  const navigate = useNavigate();
  const [cat, setCat] = useState('همه');
  const cats = ['همه', ...new Set(posts.map(p => p.category))];
  const filtered = cat === 'همه' ? posts : posts.filter(p => p.category === cat);
  const [featured, ...rest] = filtered;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1, direction: 'rtl', background: 'var(--bg)' }}>
        {/* Header */}
        <div style={{ background: 'var(--dark)', color: '#fff', padding: '40px 24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(24px,4vw,40px)', fontWeight: 900, marginBottom: 8 }}>بلاگ کتاب‌خانه</h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)' }}>مقاله‌ها، معرفی‌ها و راهنماهای مطالعه</p>
        </div>

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px' }}>
          {/* Category filter */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
            {cats.map(c => (
              <button key={c} onClick={() => setCat(c)} style={{
                padding: '6px 16px', borderRadius: 'var(--r-pill)', fontSize: 13, fontWeight: 600,
                border: '2px solid', cursor: 'pointer', transition: 'all 0.18s',
                borderColor: cat === c ? 'var(--purple)' : 'var(--border)',
                background: cat === c ? 'var(--purple)' : '#fff',
                color: cat === c ? '#fff' : 'var(--text-2)',
              }}>{c}</button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 80, color: 'var(--text-3)' }}>
              <div style={{ fontSize: 48 }}>📝</div>
              <p style={{ marginTop: 12 }}>پستی یافت نشد</p>
            </div>
          ) : (
            <>
              {/* Featured */}
              {featured && (
                <div onClick={() => navigate(`/blog/${featured.slug}`)}
                  style={{ background: '#fff', borderRadius: 'var(--r-xl)', overflow: 'hidden', marginBottom: 32, cursor: 'pointer', border: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 1fr' }}
                  className="hover-lift"
                >
                  <div style={{ height: 300, overflow: 'hidden' }}>
                    <img src={featured.cover} alt={featured.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                      onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                      onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                    />
                  </div>
                  <div style={{ padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <span style={{ display: 'inline-block', background: 'var(--purple-light)', color: 'var(--purple)', padding: '3px 12px', borderRadius: 'var(--r-pill)', fontSize: 11, fontWeight: 700, marginBottom: 12, width: 'fit-content' }}>
                      {featured.category}
                    </span>
                    <h2 style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.4, marginBottom: 12 }}>{featured.title}</h2>
                    <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.8, marginBottom: 20 }} className="clamp-3">{featured.excerpt}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, color: 'var(--text-3)' }}>
                      <span>✍️ {featured.author}</span>
                      <span>📅 {featured.date}</span>
                      <span>⏱ {featured.readTime} دقیقه</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
                {rest.map(post => (
                  <div key={post.id} onClick={() => navigate(`/blog/${post.slug}`)}
                    className="hover-lift"
                    style={{ background: '#fff', borderRadius: 'var(--r-lg)', overflow: 'hidden', cursor: 'pointer', border: '1px solid var(--border)' }}
                  >
                    <div style={{ height: 180, overflow: 'hidden' }}>
                      <img src={post.cover} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                        onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
                        onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                      />
                    </div>
                    <div style={{ padding: 20 }}>
                      <span style={{ display: 'inline-block', background: 'var(--purple-light)', color: 'var(--purple)', padding: '2px 10px', borderRadius: 'var(--r-pill)', fontSize: 11, fontWeight: 700, marginBottom: 10 }}>
                        {post.category}
                      </span>
                      <h3 style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.5, marginBottom: 8 }} className="clamp-2">{post.title}</h3>
                      <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 16 }} className="clamp-2">{post.excerpt}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, color: 'var(--text-3)' }}>
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>{post.readTime} دقیقه مطالعه</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
