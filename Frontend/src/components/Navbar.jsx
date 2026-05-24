import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, MessageSquare, LogOut, PlusCircle, MoreVertical } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuItemStyle = {
    width: '100%',
    background: 'none',
    border: 'none',
    textAlign: 'left',
    padding: '8px 12px',
    cursor: 'pointer',
    color: 'var(--text-main)',
    fontSize: '0.92rem'
  };

  const displayName = user?.name
    ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
    : '';

  return (
    <div style={{ 
      position: 'sticky', 
      top: '0', 
      zIndex: 1000,
      width: '100%',
      background: '#f8fafc',
      borderBottom: '1px solid #e2e8f0',
      boxShadow: '0 4px 15px rgba(35, 53, 89, 0.05)'
    }}>
      {/* Top Academic Info Strip */}
      <div style={{
        background: '#233559',
        color: '#e2e8f0',
        fontSize: '0.75rem',
        fontWeight: '500',
        letterSpacing: '0.05em',
        padding: '8px 40px',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <span>📞 Toll Free: 81 81 057 057</span>
          <span style={{ opacity: 0.5 }}>|</span>
          <span>✉️ info@anurag.edu.in</span>
        </div>
        <span style={{ color: 'var(--secondary)', fontWeight: '600' }}>🎓 OFFICIAL ANURAG PEER-TO-PEER PORTAL</span>
      </div>

      {/* Main Double-Skewed Navbar Container */}
      <div style={{ 
        position: 'relative', 
        height: '75px', 
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px'
      }}>
        {/* Double Skew Background Slices */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          zIndex: 0,
          pointerEvents: 'none'
        }}>
          <div style={{
            width: '28%',
            height: '100%',
            background: 'url(https://www.anurag.edu.in/images/header-bg-left.svg) left center / cover no-repeat',
          }} />
          <div style={{
            width: '72%',
            height: '100%',
            background: 'url(https://www.anurag.edu.in/images/header-bg-right.svg) right center / cover no-repeat',
          }} />
        </div>

        {/* Content Layer */}
        {/* Left: Official Logo */}
        <div style={{ position: 'relative', zIndex: 1, height: '40px', display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', height: '100%', textDecoration: 'none', cursor: 'default' }}>
            <img 
              src="https://cdn.sanity.io/images/v1rb7aqk/production/358a0b743e7fbbd8be475f4dca39d275afe10fa5-352x76.png?q=70&auto=format&w=640"
              alt="Anurag University Logo"
              style={{ height: '32px', objectFit: 'contain' }}
            />
            <span style={{ 
              marginLeft: '12px', 
              fontSize: '1.2rem', 
              fontWeight: '800', 
              color: '#233559',
              letterSpacing: '0.02em'
            }}>
              Resell<span style={{ color: 'var(--primary)' }}>Portal</span>
            </span>
          </div>
        </div>

        {/* Right: Navigation Links */}
        <div style={{ 
          position: 'relative', 
          zIndex: 1, 
          display: 'flex', 
          gap: '20px', 
          alignItems: 'center' 
        }}>
          <Link to="/" className="nav-link" style={{ color: '#233559', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>Home</Link>
          <Link to="/marketplace" className="nav-link" style={{ color: '#233559', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>Marketplace</Link>
          <Link to="/sell" className="nav-link" style={{ color: '#233559', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>
            <PlusCircle size={18} style={{ color: 'var(--primary)' }} /> <span>Sell</span>
          </Link>
          <Link to="/chat" className="nav-link" style={{ color: '#233559', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>
            <MessageSquare size={18} style={{ color: 'var(--primary)' }} /> <span>Chat</span>
          </Link>
          <Link to="/story" className="nav-link" style={{ color: '#233559', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>About</Link>
          <Link to="/faq" className="nav-link" style={{ color: '#233559', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>FAQ</Link>
          <Link to="/contact" className="nav-link" style={{ color: '#233559', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>Contact</Link>
          {user ? (
            <>
              <div style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', color: '#233559', padding: '4px 12px', background: 'rgba(35, 53, 89, 0.05)', borderRadius: '20px', border: '1px solid rgba(35, 53, 89, 0.1)', position: 'relative' }}>
                 <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), #8b1a25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                   <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'white', userSelect: 'none' }}>{user.name?.charAt(0)?.toUpperCase()}</span>
                 </div>
                 <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{displayName}</span>
                 <button onClick={() => setShowProfileMenu(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} title="Menu">
                   <MoreVertical size={18} />
                 </button>
                 {showProfileMenu && (
                   <div style={{ position: 'absolute', top: '44px', right: 0, background: '#ffffff', border: '1px solid var(--glass-border)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 1000, minWidth: '160px' }}>
                     <button onClick={() => { setShowProfileMenu(false); navigate('/dashboard'); }} style={menuItemStyle}>🏠 Dashboard</button>
                     <button onClick={() => { setShowProfileMenu(false); navigate('/my-listings'); }} style={menuItemStyle}>📦 My Listings</button>
                     <button onClick={() => { setShowProfileMenu(false); navigate('/purchases'); }} style={menuItemStyle}>🛍️ Purchases</button>
                     <hr style={{ margin: '4px 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />
                     <button onClick={() => { setShowProfileMenu(false); if (window.confirm('Are you sure you want to logout?')) logout(); }} style={{ ...menuItemStyle, color: '#ef4444' }}>🚪 Logout</button>
                   </div>
                 )}
               </div>
            </>
          ) : (
            <>
            <Link to="/login" style={{
              background: 'url(https://www.anurag.edu.in/images/red-union.svg) center / cover no-repeat',
              color: 'white',
              padding: '10px 24px',
              fontSize: '0.9rem',
              fontWeight: '700',
              textDecoration: 'none',
              borderRadius: '4px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '105px',
              transition: 'transform 0.2s',
              border: 'none',
              cursor: 'pointer',
              marginRight: '8px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              LOGIN
            </Link>
            <Link to="/register" style={{
              background: '#C02535',
              color: 'white',
              padding: '10px 24px',
              fontSize: '0.9rem',
              fontWeight: '700',
              textDecoration: 'none',
              borderRadius: '4px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '105px',
              transition: 'transform 0.2s',
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              REGISTER
            </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
