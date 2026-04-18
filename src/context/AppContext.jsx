import React, { createContext, useContext, useState, useEffect } from 'react';
import { BOOKS } from '../data/books';
import { POSTS } from '../data/posts';

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

const DEFAULT_USERS = [
  { id: 1, name: 'مدیر سایت', email: 'admin@book.ir', password: 'admin123', role: 'admin', purchasedBooks: [] },
  { id: 2, name: 'کاربر آزمایشی', email: 'user@book.ir', password: 'user123', role: 'customer', purchasedBooks: [1, 3, 8] },
];

const DISCOUNT_CODES = { 'BOOK20': 20, 'READ10': 10, 'HELLO15': 15 };

function load(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export function AppProvider({ children }) {
  const [user, setUser]         = useState(() => load('user', null));
  const [users, setUsers]       = useState(() => load('users', DEFAULT_USERS));
  const [books, setBooks]       = useState(() => load('books', BOOKS));
  const [posts, setPosts]       = useState(() => load('posts', POSTS));
  const [cart, setCart]         = useState(() => load('cart', []));
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState(() => load('wishlist', []));
  const [reviews, setReviews]   = useState(() => load('reviews', {}));
  const [darkMode, setDarkMode] = useState(() => load('darkMode', false));
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [readProgress, setReadProgress] = useState(() => load('readProgress', {}));

  useEffect(() => { save('user', user); },             [user]);
  useEffect(() => { save('users', users); },           [users]);
  useEffect(() => { save('books', books); },           [books]);
  useEffect(() => { save('posts', posts); },           [posts]);
  useEffect(() => { save('cart', cart); },             [cart]);
  useEffect(() => { save('wishlist', wishlist); },     [wishlist]);
  useEffect(() => { save('reviews', reviews); },       [reviews]);
  useEffect(() => { save('readProgress', readProgress); }, [readProgress]);
  useEffect(() => {
    save('darkMode', darkMode);
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Auth
  const login = (email, password) => {
    const found = users.find(u => u.email === email && u.password === password);
    if (found) { setUser(found); return { ok: true, role: found.role }; }
    return { ok: false, error: 'ایمیل یا رمز عبور اشتباه است' };
  };
  const register = (name, email, password) => {
    if (users.find(u => u.email === email)) return { ok: false, error: 'این ایمیل قبلاً ثبت شده' };
    const newUser = { id: Date.now(), name, email, password, role: 'customer', purchasedBooks: [] };
    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
    return { ok: true, role: 'customer' };
  };
  const logout = () => { setUser(null); setCart([]); setAppliedDiscount(null); };

  // Cart
  const addToCart = (book) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === book.id);
      if (ex) return prev.map(i => i.id === book.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...book, qty: 1 }];
    });
  };
  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const updateQty = (id, qty) => setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  // Discount
  const applyDiscount = (code) => {
    const pct = DISCOUNT_CODES[code.toUpperCase()];
    if (pct) { setAppliedDiscount({ code: code.toUpperCase(), pct }); return { ok: true, pct }; }
    return { ok: false, error: 'کد تخفیف معتبر نیست' };
  };
  const removeDiscount = () => setAppliedDiscount(null);
  const discountAmount = appliedDiscount ? Math.round(cartTotal * appliedDiscount.pct / 100) : 0;
  const finalTotal = cartTotal - discountAmount;

  // Purchase
  const purchase = (bookIds) => {
    if (!user) return false;
    const updated = { ...user, purchasedBooks: [...new Set([...user.purchasedBooks, ...bookIds])] };
    setUser(updated);
    setUsers(prev => prev.map(u => u.id === user.id ? updated : u));
    setCart([]);
    setAppliedDiscount(null);
    return true;
  };
  const hasPurchased = (bookId) => user?.purchasedBooks?.includes(bookId);

  // Wishlist
  const toggleWishlist = (bookId) => {
    setWishlist(prev => prev.includes(bookId) ? prev.filter(id => id !== bookId) : [...prev, bookId]);
  };
  const isWishlisted = (bookId) => wishlist.includes(bookId);

  // Reviews
  const addReview = (bookId, { rating, text }) => {
    if (!user) return false;
    const review = {
      id: Date.now(), userId: user.id, name: user.name,
      rating, text, date: new Date().toLocaleDateString('fa-IR'),
    };
    setReviews(prev => ({ ...prev, [bookId]: [...(prev[bookId] || []), review] }));
    return true;
  };
  const getBookReviews = (bookId) => reviews[bookId] || [];

  // Reading progress
  const saveReadProgress = (bookId, pct) => {
    setReadProgress(prev => ({ ...prev, [bookId]: pct }));
  };
  const getReadProgress = (bookId) => readProgress[bookId] || 0;

  // Books CRUD (admin)
  const addBook    = (book) => setBooks(prev => [...prev, { ...book, id: Date.now() }]);
  const updateBook = (book) => setBooks(prev => prev.map(b => b.id === book.id ? book : b));
  const deleteBook = (id)   => setBooks(prev => prev.filter(b => b.id !== id));

  // Posts CRUD (admin)
  const addPost    = (post) => setPosts(prev => [...prev, { ...post, id: Date.now() }]);
  const updatePost = (post) => setPosts(prev => prev.map(p => p.id === post.id ? post : p));
  const deletePost = (id)   => setPosts(prev => prev.filter(p => p.id !== id));

  return (
    <AppContext.Provider value={{
      user, users, login, register, logout,
      books, addBook, updateBook, deleteBook,
      posts, addPost, updatePost, deletePost,
      cart, cartOpen, setCartOpen, addToCart, removeFromCart, updateQty, cartCount, cartTotal,
      purchase, hasPurchased,
      wishlist, toggleWishlist, isWishlisted,
      reviews, addReview, getBookReviews,
      darkMode, setDarkMode,
      appliedDiscount, applyDiscount, removeDiscount, discountAmount, finalTotal,
      readProgress, saveReadProgress, getReadProgress,
    }}>
      {children}
    </AppContext.Provider>
  );
}
