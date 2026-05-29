import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, PlusCircle, HelpCircle, BookOpen, Mail, ChevronDown, LifeBuoy, LogOut } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { toast } from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { globalUnread } = useNotification();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSupportMenu, setShowSupportMenu] = useState(false);

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
          <Link to="/chat" className="nav-link" style={{ position: 'relative', color: '#233559', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <MessageSquare size={18} style={{ color: 'var(--primary)' }} />
              {globalUnread > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-8px',
                  background: '#16a34a',
                  color: 'white',
                  fontSize: '0.65rem',
                  fontWeight: 'bold',
                  minWidth: '16px',
                  height: '16px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                  border: '1.5px solid #ffffff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  {globalUnread > 99 ? '99+' : globalUnread}
                </span>
              )}
            </div>
            <span>Chat</span>
          </Link>
          {/* Support Dropdown */}
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
            <button
              onClick={() => { setShowProfileMenu(false); setShowSupportMenu(v => !v); }}
              style={{
                background: showSupportMenu ? 'rgba(193,38,50,0.1)' : 'transparent',
                border: '1.5px solid',
                borderColor: showSupportMenu ? 'var(--primary)' : 'rgba(35,53,89,0.15)',
                cursor: 'pointer',
                color: showSupportMenu ? 'var(--primary)' : '#233559',
                fontWeight: '600',
                fontSize: '0.88rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '20px',
                transition: 'all 0.2s ease',
                letterSpacing: '0.02em'
              }}
              onMouseEnter={(e) => {
                if (!showSupportMenu) {
                  e.currentTarget.style.background = 'rgba(193,38,50,0.07)';
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.color = 'var(--primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!showSupportMenu) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'rgba(35,53,89,0.15)';
                  e.currentTarget.style.color = '#233559';
                }
              }}
              title="Support"
            >
              <LifeBuoy size={15} />
              Support
              <ChevronDown size={14} style={{ transition: 'transform 0.2s', transform: showSupportMenu ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </button>

            {showSupportMenu && (
              <div style={{
                position: 'absolute',
                top: '44px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#ffffff',
                border: '1px solid var(--glass-border)',
                borderRadius: '14px',
                boxShadow: '0 8px 32px rgba(35,53,89,0.12), 0 2px 8px rgba(0,0,0,0.06)',
                zIndex: 1000,
                minWidth: '210px',
                overflow: 'hidden',
                padding: '8px 0'
              }}>
                {/* Section header */}
                <div style={{ padding: '6px 16px 10px', borderBottom: '1px solid #f1f5f9', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary)' }}>Help & Resources</span>
                </div>
                {[
                  { icon: <BookOpen size={16} />, label: 'Our Story', path: '/story' },
                  { icon: <HelpCircle size={16} />, label: 'FAQ', path: '/faq' },
                  { icon: <Mail size={16} />, label: 'Contact Us', path: '/contact' },
                ].map((item) => (
                  <button
                    key={item.path}
                    onClick={() => { setShowSupportMenu(false); navigate(item.path); }}
                    style={{
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      padding: '10px 16px',
                      cursor: 'pointer',
                      color: 'var(--text-main)',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      transition: 'background 0.15s, color 0.15s'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(193,38,50,0.06)'; e.currentTarget.style.color = 'var(--primary)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-main)'; }}
                  >
                    <span style={{ color: 'var(--primary)', opacity: 0.8 }}>{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {user ? (
            <>
              <div style={{ position: 'relative', display: 'inline-flex' }}>
                <button 
                  onClick={() => { setShowSupportMenu(false); setShowProfileMenu(v => !v); }}
                  style={{
                    background: showProfileMenu ? 'rgba(35,53,89,0.08)' : 'rgba(35, 53, 89, 0.03)',
                    border: '1.5px solid',
                    borderColor: showProfileMenu ? 'rgba(35,53,89,0.2)' : 'rgba(35, 53, 89, 0.1)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '4px 14px 4px 6px',
                    borderRadius: '30px',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!showProfileMenu) {
                      e.currentTarget.style.background = 'rgba(35,53,89,0.06)';
                      e.currentTarget.style.borderColor = 'rgba(35,53,89,0.15)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!showProfileMenu) {
                      e.currentTarget.style.background = 'rgba(35, 53, 89, 0.03)';
                      e.currentTarget.style.borderColor = 'rgba(35, 53, 89, 0.1)';
                    }
                  }}
                  title="Profile Menu"
                >
                   <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), #8b1a25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 4px rgba(193,38,50,0.2)' }}>
                     <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'white', userSelect: 'none' }}>{user.name?.charAt(0)?.toUpperCase()}</span>
                   </div>
                   <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#233559' }}>{displayName}</span>
                   <ChevronDown size={14} style={{ color: '#233559', transition: 'transform 0.2s', transform: showProfileMenu ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                </button>
                {showProfileMenu && (
                  <div style={{
                    position: 'absolute',
                    top: '50px',
                    right: 0,
                    background: '#ffffff',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '14px',
                    boxShadow: '0 8px 32px rgba(35,53,89,0.12), 0 2px 8px rgba(0,0,0,0.06)',
                    zIndex: 1000,
                    minWidth: '200px',
                    overflow: 'hidden',
                    padding: '8px 0'
                  }}>
                    <div style={{ padding: '6px 16px 10px', borderBottom: '1px solid #f1f5f9', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary)' }}>My Account</span>
                    </div>
                    {[
                      { icon: '🏠', label: 'Dashboard', path: '/dashboard' },
                      { icon: '📦', label: 'My Listings', path: '/my-listings' },
                      { icon: '🛍️', label: 'Purchases', path: '/purchases' },
                      { icon: '❤️', label: 'Wishlist', path: '/wishlist' },
                    ].map((item) => (
                      <button
                        key={item.path}
                        onClick={() => { setShowProfileMenu(false); navigate(item.path); }}
                        style={{
                          width: '100%', background: 'none', border: 'none', textAlign: 'left',
                          padding: '10px 16px', cursor: 'pointer', color: 'var(--text-main)',
                          fontSize: '0.9rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '12px',
                          transition: 'background 0.15s'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(35,53,89,0.04)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
                      >
                        <span style={{ opacity: 0.8 }}>{item.icon}</span> {item.label}
                      </button>
                    ))}
                    <hr style={{ margin: '4px 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        toast.custom((t) => (
                          <div style={{
                            background: '#ffffff', padding: '20px 24px', borderRadius: '16px',
                            boxShadow: '0 10px 40px rgba(35, 53, 89, 0.2)', display: 'flex', flexDirection: 'column', gap: '16px',
                            border: '1px solid var(--glass-border)', opacity: t.visible ? 1 : 0,
                            transform: t.visible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-10px)',
                            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)', width: '320px', pointerEvents: 'auto'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                                <LogOut size={20} />
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontWeight: '700', color: '#233559', fontSize: '1.05rem' }}>Log Out</span>
                                <span style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '2px' }}>Are you sure you want to log out?</span>
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                              <button
                                onClick={() => toast.dismiss(t.id)}
                                style={{ flex: 1, padding: '10px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s', fontSize: '0.9rem' }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#f1f5f9'}
                              >Cancel</button>
                              <button
                                onClick={() => { toast.dismiss(t.id); logout(); }}
                                style={{ flex: 1, padding: '10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s', fontSize: '0.9rem' }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#dc2626'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#ef4444'}
                              >Yes, Log Out</button>
                            </div>
                          </div>
                        ), { duration: Infinity, position: 'top-center', id: 'logout-toast' });
                      }}
                      style={{
                        width: '100%', background: 'none', border: 'none', textAlign: 'left',
                        padding: '10px 16px', cursor: 'pointer', color: '#ef4444',
                        fontSize: '0.9rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '12px',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.05)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
                    >
                      <span>🚪</span> Logout
                    </button>
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
