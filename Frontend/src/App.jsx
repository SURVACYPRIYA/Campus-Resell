import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Preloader from './components/Preloader';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Marketplace from './pages/Marketplace';
import ProductDetails from './pages/ProductDetails';
import ChatPage from './pages/ChatPage';
import AdminDashboard from './pages/AdminDashboard';
import CreateProduct from './pages/CreateProduct';
import Profile from './pages/Profile';
import Story from './pages/Story';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import MyListings from './pages/MyListings';
import Purchases from './pages/Purchases';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Wishlist from './pages/Wishlist';
import './index.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', color: '#233559' }}>
        <h3>Verifying credentials...</h3>
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [appReady, setAppReady] = useState(false);

  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          {!appReady && <Preloader onComplete={() => setAppReady(true)} />}
          <Router>
            <div className="app-container" style={{ opacity: appReady ? 1 : 0, transition: 'opacity 0.5s ease-in' }}>
              <Toaster
                position="top-center"
                toastOptions={{
                  duration: 3500,
                  icon: '🔔',
                  style: {
                    background: '#ffffff',
                    color: '#233559',
                    border: '2px solid var(--primary)',
                    padding: '12px 24px',
                    borderRadius: '50px',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    boxShadow: '0 8px 24px rgba(193, 38, 50, 0.15)',
                  },
                  success: {
                    icon: '✨',
                    style: { border: '2px solid #10b981', boxShadow: '0 8px 24px rgba(16, 185, 129, 0.15)' },
                    iconTheme: { primary: '#10b981', secondary: '#ffffff' },
                  },
                  error: {
                    icon: '🚨',
                    style: { border: '2px solid #ef4444', boxShadow: '0 8px 24px rgba(239, 68, 68, 0.15)' },
                    iconTheme: { primary: '#ef4444', secondary: '#ffffff' },
                  },
                }}
              />
              <Navbar />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password/:token" element={<ResetPassword />} />
                  <Route path="/story" element={<Story />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
                  <Route path="/product/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
                  <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
                  <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/sell" element={<ProtectedRoute><CreateProduct /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/my-listings" element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
                  <Route path="/purchases" element={<ProtectedRoute><Purchases /></ProtectedRoute>} />
                  <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
                </Routes>
              </main>
            </div>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
