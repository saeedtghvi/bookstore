import React, { createContext, useContext, useState, useEffect } from 'react';
import { BOOKS } from '../data/books';
import { POSTS } from '../data/posts';

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

const DEFAULT_USERS = [
  { id: 1, name: 'مدیر سایت', email: 'admin@book.ir', password: 'admin123', role: 'admin', purchasedBooks: [] },
  { id: 2, name: 'کاربر آزمایشی', email: 'user@book.ir', password: 'user123', role: 'customer', purchasedBooks: [1, 3, 8] },
];

function load(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export function AppProvider({ children }) {
  const [user, setUser]       = useState(() => load('user', null));
  const [users, setUsers]     = useState(() => load('users', DEFAULT_USERS));
  const [books, setBooks]     = useState(() => load('books', BOOKS));
  const [posts, setPosts]     = useState(() => load('posts', POSTS));
  const [cart, setCart]       = useState(() => load('cart', []));
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => { save('user', user); },   [user]);
  useEffect(() => { save('users', users); }, [users]);
  useEffect(() => { save('books', books); }, [books]);
  useEffect(() => { save('posts', posts); }, [posts]);
  useEffect(() => { save('cart', cart); },   [cart]);

  // Auth
  const login = (email, password) => {
    const found = users.find(u => u.email === email && u.password === password);
    if (found) { setUser(found); return { ok: true }; }
    return { ok: false, error: 'ایمیل یا رمز عبور اشتباه است' };
  };
  const register = (name, email, password) => {
    if (users.find(u => u.email === email)) return { ok: false, error: 'این ایمیل قبلاً ثبت شده' };
    const newUser = { id: Date.now(), name, email, password, role: 'customer', purchasedBooks: [] };
    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
    return { ok: true };
  };
  const logout = () => { setUser(null); setCart([]); };

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

  // Purchase
  const purchase = (bookIds) => {
    if (!user) return false;
    const updated = { ...user, purchasedBooks: [...new Set([...user.purchasedBooks, ...bookIds])] };
    setUser(updated);
    setUsers(prev => prev.map(u => u.id === user.id ? updated : u));
    setCart([]);
    return true;
  };
  const hasPurchased = (bookId) => user?.purchasedBooks?.includes(bookId);

  // Books CRUD (admin)
  const addBook    = (book)   => setBooks(prev => [...prev, { ...book, id: Date.now() }]);
  const updateBook = (book)   => setBooks(prev => prev.map(b => b.id === book.id ? book : b));
  const deleteBook = (id)     => setBooks(prev => prev.filter(b => b.id !== id));

  // Posts CRUD (admin)
  const addPost    = (post)   => setPosts(prev => [...prev, { ...post, id: Date.now() }]);
  const updatePost = (post)   => setPosts(prev => prev.map(p => p.id === post.id ? post : p));
  const deletePost = (id)     => setPosts(prev => prev.filter(p => p.id !== id));

  return (
    <AppContext.Provider value={{
      user, users, login, register, logout,
      books, addBook, updateBook, deleteBook,
      posts, addPost, updatePost, deletePost,
      cart, cartOpen, setCartOpen, addToCart, removeFromCart, updateQty, cartCount, cartTotal,
      purchase, hasPurchased,
    }}>
      {children}
    </AppContext.Provider>
  );
}
