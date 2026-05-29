import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../axios';
import {
  LayoutDashboard, Package, ShoppingBag, MessageSquare,
  PlusCircle, TrendingUp, User, LogOut, ChevronRight, Heart
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ listings: 0, sold: 0, purchases: 0, wishlist: 0 });
  const [recentListings, setRecentListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const displayName = user?.name
    ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
    : '';

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const [resListings, resPurchases, resWishlist] = await Promise.all([
          axios.get(`/api/products?seller=${user._id}&status=all`),
          axios.get(`/api/products?buyer=${user._id}&status=sold`),
          axios.get('/api/users/wishlist'),
        ]);
        const listings = resListings.data.data.products || [];
        const purchases = resPurchases.data.data.products || [];
        const wishlist = resWishlist.data.data.wishlist || [];
        const sold = listings.filter(p => p.status === 'sold').length;
        setStats({ listings: listings.length, sold, purchases: purchases.length, wishlist: wishlist.length });
        setRecentListings(listings.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleLogout = () => { if (window.confirm('Are you sure you want to logout?')) { logout(); navigate('/login'); } };

  const statCards = [
    { icon: <Package size={28} />, label: 'Total Listings', value: stats.listings, color: '#3b82f6', bg: 'rgba(59,130,246,0.08)', to: '/my-listings' },
    { icon: <TrendingUp size={28} />, label: 'Items Sold', value: stats.sold, color: '#16a34a', bg: 'rgba(22,163,74,0.08)', to: '/my-listings' },
    { icon: <ShoppingBag size={28} />, label: 'Purchases', value: stats.purchases, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', to: '/purchases' },
    { icon: <Heart size={28} />, label: 'Wishlist', value: stats.wishlist, color: '#ef4444', bg: 'rgba(239,68,68,0.08)', to: '/wishlist' },
  ];

  const quickLinks = [
    { icon: <PlusCircle size={20} />, label: 'Sell an Item', to: '/sell', color: '#C02535' },
    { icon: <Package size={20} />, label: 'My Listings', to: '/my-listings', color: '#3b82f6' },
    { icon: <ShoppingBag size={20} />, label: 'My Purchases', to: '/purchases', color: '#f59e0b' },
    { icon: <MessageSquare size={20} />, label: 'Messages', to: '/chat', color: '#8b5cf6' },
    { icon: <Heart size={20} />, label: 'Wishlist', to: '/wishlist', color: '#ef4444' },
    { icon: <User size={20} />, label: 'Profile', to: '/profile', color: '#16a34a' },
  ];

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1100px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #233559 0%, #C02535 100%)',
        borderRadius: '16px',
        padding: '36px 40px',
        marginBottom: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        color: 'white',
        boxShadow: '0 8px 30px rgba(35,53,89,0.18)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '70px', height: '70px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', fontWeight: 800, border: '3px solid rgba(255,255,255,0.4)'
          }}>
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem' }}>Welcome back,</p>
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 800 }}>{displayName} 👋</h1>
            <p style={{ margin: '4px 0 0', opacity: 0.7, fontSize: '0.85rem' }}>{user?.email}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link to="/sell" style={{
            background: 'white', color: '#C02535', padding: '10px 20px',
            borderRadius: '10px', textDecoration: 'none', fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem'
          }}>
            <PlusCircle size={18} /> Sell Item
          </Link>
          <button onClick={handleLogout} style={{
            background: 'rgba(255,255,255,0.15)', color: 'white', padding: '10px 20px',
            borderRadius: '10px', border: '1px solid rgba(255,255,255,0.3)',
            fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center',
            gap: '8px', fontSize: '0.9rem'
          }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '36px' }}>
        {statCards.map((card, i) => (
          <Link
            key={i}
            to={card.to}
            className="glass-card"
            style={{
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              textDecoration: 'none',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 8px 30px ${card.color}22`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            <div style={{ background: card.bg, color: card.color, padding: '14px', borderRadius: '12px', flexShrink: 0 }}>
              {card.icon}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</p>
              <p style={{ margin: '4px 0 0', fontSize: '2rem', fontWeight: 800, color: card.color }}>
                {loading ? '—' : card.value}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px', alignItems: 'start' }}>

        {/* Quick Links */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <h2 style={{ margin: '0 0 20px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LayoutDashboard size={20} color="var(--primary)" /> Quick Actions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {quickLinks.map((link, i) => (
              <Link key={i} to={link.to} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', borderRadius: '10px', textDecoration: 'none',
                color: 'var(--text-main)', background: 'rgba(0,0,0,0.02)',
                border: '1px solid var(--glass-border)', transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = `rgba(${link.color.includes('#3b') ? '59,130,246' : link.color.includes('#C0') ? '192,37,53' : link.color.includes('#f5') ? '245,158,11' : link.color.includes('#8b') ? '139,92,246' : link.color.includes('#ef') ? '239,68,68' : '22,163,74'},0.06)`; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.02)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: link.color }}>{link.icon}</span>
                  <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{link.label}</span>
                </div>
                <ChevronRight size={16} color="var(--text-muted)" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Listings */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={20} color="var(--primary)" /> Recent Listings
            </h2>
            <Link to="/my-listings" style={{ fontSize: '0.85rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>View All →</Link>
          </div>
          {loading ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>Loading...</p>
          ) : recentListings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 0' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>No listings yet.</p>
              <Link to="/sell" className="btn-primary" style={{ fontSize: '0.9rem', padding: '8px 20px' }}>+ Sell Something</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentListings.map(p => (
                <Link key={p._id} to={`/product/${p._id}`} style={{
                  display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none',
                  padding: '10px', borderRadius: '10px', background: 'rgba(0,0,0,0.02)',
                  border: '1px solid var(--glass-border)', transition: 'background 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(192,37,53,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.02)'}
                >
                  <img src={p.images?.[0]} alt={p.title}
                    style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', background: '#e2e8f0' }}
                    onError={e => { e.target.style.background = '#e2e8f0'; e.target.style.display = 'none'; }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</p>
                    <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#16a34a', fontWeight: 700 }}>₹{Number(p.price).toLocaleString('en-IN')}</p>
                  </div>
                  <span style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: '12px', background: p.status === 'sold' ? '#fee2e2' : '#dcfce7', color: p.status === 'sold' ? '#b91c1c' : '#15803d', fontWeight: 600, textTransform: 'capitalize', flexShrink: 0 }}>
                    {p.status || 'active'}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
