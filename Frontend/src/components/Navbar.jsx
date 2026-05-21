import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, MessageSquare, LogOut, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

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
          <Link to="/" style={{ display: 'flex', alignItems: 'center', height: '100%', textDecoration: 'none' }}>
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
          </Link>
        </div>

        {/* Right: Navigation Links */}
        <div style={{ 
          position: 'relative', 
          zIndex: 1, 
          display: 'flex', 
          gap: '20px', 
          alignItems: 'center' 
        }}>
          {user ? (
            <>
              <Link to="/marketplace" className="nav-link" style={{ color: '#233559', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>Marketplace</Link>
              <Link to="/sell" className="nav-link" style={{ color: '#233559', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>
                <PlusCircle size={18} style={{ color: 'var(--primary)' }} /> <span>Sell</span>
              </Link>
              <Link to="/chat" className="nav-link" style={{ color: '#233559', display: 'flex', alignItems: 'center' }}><MessageSquare size={18} /></Link>
              <Link to="/profile" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', color: '#233559', padding: '4px 12px', background: 'rgba(35, 53, 89, 0.05)', borderRadius: '20px', border: '1px solid rgba(35, 53, 89, 0.1)' }}>
                <img src={user.avatar} alt={user.name} style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{user.name}</span>
              </Link>
              <button onClick={logout} style={{ background: 'transparent', border: 'none', color: '#233559', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'} onMouseLeave={(e) => e.currentTarget.style.color = '#233559'}>
                <LogOut size={18} />
              </button>
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
