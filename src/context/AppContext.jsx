import React, { createContext, useContext, useState, useEffect } from 'react';
import { BOOKS } from '../data/books';
import { POSTS } from '../data/posts';

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

const DEFAULT_USERS = [
  { id: 1, name: 'مدیر سایت', email: 'admin@book.ir', password: 'admin123', role: 'admin', purchasedBooks: [], joinDate: '۱۴۰۳/۰۱/۰۱', noPhysical: true, phone: '', province: '', city: '', address: '', postalCode: '' },
  { id: 2, name: 'کاربر آزمایشی', email: 'user@book.ir', password: 'user123', role: 'customer', purchasedBooks: [1, 3, 8], joinDate: '۱۴۰۳/۰۳/۱۵', noPhysical: false, phone: '09121234567', province: 'تهران', city: 'تهران', address: 'خیابان ولیعصر، پلاک ۱۲', postalCode: '1234567890' },
];

const DEFAULT_BOOK_CATEGORIES = ['رمان کلاسیک', 'رمان معاصر', 'فانتزی', 'کلاسیک', 'ادبیات فارسی', 'علمی-تخیلی', 'رمان تاریخی'];
const DEFAULT_POST_CATEGORIES = ['راهنما', 'معرفی کتاب', 'سبک زندگی', 'اخبار'];

const DEFAULT_CUSTOMER_GROUPS = [
  { id: 1, name: 'مشتریان برنزی', color: '#B45309', minBooks: 1, maxBooks: 2, description: 'خریداران تازه‌وارد' },
  { id: 2, name: 'مشتریان نقره‌ای', color: '#6B7280', minBooks: 3, maxBooks: 5, description: 'خریداران وفادار' },
  { id: 3, name: 'مشتریان طلایی', color: '#D97706', minBooks: 6, maxBooks: 999, description: 'خریداران ویژه' },
];

function load(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export function AppProvider({ children }) {
  const [user, setUser]               = useState(() => load('user', null));
  const [users, setUsers]             = useState(() => load('users', DEFAULT_USERS));
  const [books, setBooks]             = useState(() => {
    const stored = load('books', null);
    if (!stored) return BOOKS;
    // کتاب‌های پیش‌فرض جدید که هنوز در localStorage نیستند را اضافه کن
    const storedIds = new Set(stored.map(b => b.id));
    const newDefaults = BOOKS.filter(b => !storedIds.has(b.id));
    return [...stored, ...newDefaults];
  });
  const [posts, setPosts]             = useState(() => load('posts', POSTS));
  const [cart, setCart]               = useState(() => load('cart', []));
  const [cartOpen, setCartOpen]       = useState(false);
  const [wishlist, setWishlist]       = useState(() => load('wishlist', []));
  const [reviews, setReviews]         = useState(() => load('reviews', {}));
  const [readProgress, setReadProgress] = useState(() => load('readProgress', {}));
  const [festivalEnabled, setFestivalEnabled] = useState(() => load('festivalEnabled', false));
  const [bookCategories, setBookCategories]   = useState(() => load('bookCategories', DEFAULT_BOOK_CATEGORIES));
  const [postCategories, setPostCategories]   = useState(() => load('postCategories', DEFAULT_POST_CATEGORIES));
  const [discountCodes, setDiscountCodes]     = useState(() => load('discountCodes', { 'BOOK20': 20, 'READ10': 10, 'HELLO15': 15 }));
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [customerGroups, setCustomerGroups]   = useState(() => load('customerGroups', DEFAULT_CUSTOMER_GROUPS));

  useEffect(() => { save('user', user); },                     [user]);
  useEffect(() => { save('users', users); },                   [users]);
  useEffect(() => { save('books', books); },                   [books]);
  useEffect(() => { save('posts', posts); },                   [posts]);
  useEffect(() => { save('cart', cart); },                     [cart]);
  useEffect(() => { save('wishlist', wishlist); },             [wishlist]);
  useEffect(() => { save('reviews', reviews); },               [reviews]);
  useEffect(() => { save('readProgress', readProgress); },     [readProgress]);
  useEffect(() => { save('festivalEnabled', festivalEnabled); }, [festivalEnabled]);
  useEffect(() => { save('bookCategories', bookCategories); }, [bookCategories]);
  useEffect(() => { save('postCategories', postCategories); }, [postCategories]);
  useEffect(() => { save('discountCodes', discountCodes); },   [discountCodes]);
  useEffect(() => { save('customerGroups', customerGroups); }, [customerGroups]);

  // Auth
  const login = (email, password) => {
    const found = users.find(u => u.email === email && u.password === password);
    if (found) { setUser(found); return { ok: true, role: found.role }; }
    return { ok: false, error: 'ایمیل یا رمز عبور اشتباه است' };
  };
  const register = (name, email, password, addressData = {}) => {
    if (users.find(u => u.email === email)) return { ok: false, error: 'این ایمیل قبلاً ثبت شده' };
    const newUser = {
      id: Date.now(), name, email, password, role: 'customer', purchasedBooks: [],
      joinDate: new Date().toLocaleDateString('fa-IR'),
      noPhysical: addressData.noPhysical || false,
      phone: addressData.phone || '',
      province: addressData.province || '',
      city: addressData.city || '',
      address: addressData.address || '',
      postalCode: addressData.postalCode || '',
    };
    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
    return { ok: true, role: 'customer' };
  };
  const logout = () => { setUser(null); setCart([]); setAppliedDiscount(null); };

  // Admin: add user manually
  const addUser = (userData) => {
    if (users.find(u => u.email === userData.email)) return { ok: false, error: 'این ایمیل قبلاً ثبت شده' };
    const newUser = { ...userData, id: Date.now(), purchasedBooks: [], joinDate: new Date().toLocaleDateString('fa-IR') };
    setUsers(prev => [...prev, newUser]);
    return { ok: true };
  };
  const deleteUser = (id) => setUsers(prev => prev.filter(u => u.id !== id));
  const updateUser = (updated) => setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));

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
    const pct = discountCodes[code.toUpperCase()];
    if (pct) { setAppliedDiscount({ code: code.toUpperCase(), pct }); return { ok: true, pct }; }
    return { ok: false, error: 'کد تخفیف معتبر نیست' };
  };
  const removeDiscount = () => setAppliedDiscount(null);
  const discountAmount = appliedDiscount ? Math.round(cartTotal * appliedDiscount.pct / 100) : 0;
  const finalTotal = cartTotal - discountAmount;

  // Admin: manage discount codes
  const addDiscountCode = (code, pct) => setDiscountCodes(prev => ({ ...prev, [code.toUpperCase()]: Number(pct) }));
  const removeDiscountCode = (code) => setDiscountCodes(prev => { const n = { ...prev }; delete n[code]; return n; });

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
  const toggleWishlist = (bookId) => setWishlist(prev => prev.includes(bookId) ? prev.filter(id => id !== bookId) : [...prev, bookId]);
  const isWishlisted = (bookId) => wishlist.includes(bookId);

  // Reviews
  const addReview = (bookId, { rating, text }) => {
    if (!user) return false;
    const review = { id: Date.now(), userId: user.id, name: user.name, rating, text, date: new Date().toLocaleDateString('fa-IR') };
    setReviews(prev => ({ ...prev, [bookId]: [...(prev[bookId] || []), review] }));
    return true;
  };
  const getBookReviews = (bookId) => reviews[bookId] || [];

  // Reading progress
  const saveReadProgress = (bookId, pct) => setReadProgress(prev => ({ ...prev, [bookId]: pct }));
  const getReadProgress = (bookId) => readProgress[bookId] || 0;

  // Categories
  const addBookCategory = (cat) => { if (cat && !bookCategories.includes(cat)) setBookCategories(prev => [...prev, cat]); };
  const removeBookCategory = (cat) => setBookCategories(prev => prev.filter(c => c !== cat));
  const addPostCategory = (cat) => { if (cat && !postCategories.includes(cat)) setPostCategories(prev => [...prev, cat]); };
  const removePostCategory = (cat) => setPostCategories(prev => prev.filter(c => c !== cat));

  // Customer groups
  const addCustomerGroup = (g) => setCustomerGroups(prev => [...prev, { ...g, id: Date.now() }]);
  const updateCustomerGroup = (g) => setCustomerGroups(prev => prev.map(x => x.id === g.id ? g : x));
  const deleteCustomerGroup = (id) => setCustomerGroups(prev => prev.filter(g => g.id !== id));

  // Helper: get user's group
  const getUserGroup = (u) => {
    const count = u.purchasedBooks?.length || 0;
    return customerGroups.find(g => count >= g.minBooks && count <= g.maxBooks) || null;
  };

  // Helper: user total spending
  const getUserSpending = (u) => {
    return (u.purchasedBooks || []).reduce((s, bid) => {
      const b = books.find(x => x.id === bid);
      return s + (b?.price || 0);
    }, 0);
  };

  // Books CRUD
  const addBook    = (book) => setBooks(prev => [...prev, { ...book, id: Date.now() }]);
  const updateBook = (book) => setBooks(prev => prev.map(b => b.id === book.id ? book : b));
  const deleteBook = (id)   => setBooks(prev => prev.filter(b => b.id !== id));

  // Posts CRUD
  const addPost    = (post) => setPosts(prev => [...prev, { ...post, id: Date.now() }]);
  const updatePost = (post) => setPosts(prev => prev.map(p => p.id === post.id ? post : p));
  const deletePost = (id)   => setPosts(prev => prev.filter(p => p.id !== id));

  return (
    <AppContext.Provider value={{
      user, users, login, register, logout, addUser, deleteUser, updateUser,
      books, addBook, updateBook, deleteBook,
      posts, addPost, updatePost, deletePost,
      cart, cartOpen, setCartOpen, addToCart, removeFromCart, updateQty, cartCount, cartTotal,
      purchase, hasPurchased,
      wishlist, toggleWishlist, isWishlisted,
      reviews, addReview, getBookReviews,
      readProgress, saveReadProgress, getReadProgress,
      festivalEnabled, setFestivalEnabled,
      bookCategories, addBookCategory, removeBookCategory,
      postCategories, addPostCategory, removePostCategory,
      discountCodes, addDiscountCode, removeDiscountCode,
      appliedDiscount, applyDiscount, removeDiscount, discountAmount, finalTotal,
      customerGroups, addCustomerGroup, updateCustomerGroup, deleteCustomerGroup,
      getUserGroup, getUserSpending,
    }}>
      {children}
    </AppContext.Provider>
  );
}
