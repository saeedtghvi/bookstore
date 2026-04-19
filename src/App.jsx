import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Home from './pages/Home';
import BookDetail from './pages/BookDetail';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Login from './pages/Login';
import CustomerPanel from './pages/CustomerPanel';
import AdminPanel from './pages/AdminPanel';
import DigitalBooks from './pages/DigitalBooks';
import PhysicalBooks from './pages/PhysicalBooks';
import NotFound from './pages/NotFound';
import Cart from './components/Cart';

function ProtectedRoute({ children, role }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function AppContent() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book/:id" element={<BookDetail />} />
        <Route path="/digital" element={<DigitalBooks />} />
        <Route path="/physical" element={<PhysicalBooks />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/login" element={<Login />} />
        <Route path="/panel/*" element={
          <ProtectedRoute role="customer"><CustomerPanel /></ProtectedRoute>
        } />
        <Route path="/admin/*" element={
          <ProtectedRoute role="admin"><AdminPanel /></ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Cart />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </AppProvider>
  );
}
