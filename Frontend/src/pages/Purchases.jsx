import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../axios';
import { ShoppingBag, Search, Star } from 'lucide-react';

const fallbackImage = "data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3e%3crect width='400' height='300' fill='%23f1f5f9'/%3e%3cg transform='translate(160,100)'%3e%3csvg width='80' height='80' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='1.5'%3e%3crect x='3' y='3' width='18' height='18' rx='2'/%3e%3ccircle cx='8.5' cy='8.5' r='1.5'/%3e%3cpolyline points='21 15 16 10 5 21'/%3e%3c/svg%3e%3c/g%3e%3c/svg%3e";

const Purchases = () => {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      try {
        const res = await axios.get(`/api/products?buyer=${user._id}&status=sold`);
        setPurchases(res.data.data.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  const filtered = purchases.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalSpent = purchases.reduce((sum, p) => sum + Number(p.price), 0);

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1100px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>

      {/* Page Header */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'rgba(245,158,11,0.1)', padding: '10px', borderRadius: '12px' }}>
            <ShoppingBag size={28} color="#f59e0b" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: '#233559' }}>My Purchases</h1>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>All items you've bought from the marketplace</p>
          </div>
        </div>

        {/* Total Spent Card */}
        {!loading && purchases.length > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: 'white', padding: '16px 28px', borderRadius: '14px',
            boxShadow: '0 4px 20px rgba(245,158,11,0.25)'
          }}>
            <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.85 }}>Total Spent</p>
            <p style={{ margin: '4px 0 0', fontSize: '1.8rem', fontWeight: 800 }}>
              ₹{totalSpent.toLocaleString('en-IN')}
            </p>
            <p style={{ margin: '2px 0 0', fontSize: '0.78rem', opacity: 0.75 }}>{purchases.length} item{purchases.length !== 1 ? 's' : ''} purchased</p>
          </div>
        )}
      </div>

      {/* Search */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '20px', padding: '8px 18px', maxWidth: '400px' }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search your purchases..."
            style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem', background: 'transparent' }}
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>Loading your purchases...</div>
      ) : filtered.length === 0 ? (
        <div className="glass-card" style={{ padding: '80px', textAlign: 'center' }}>
          <ShoppingBag size={48} color="var(--text-muted)" style={{ marginBottom: '16px', opacity: 0.4 }} />
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            {search ? 'No purchases match your search.' : "You haven't bought anything yet."}
          </p>
          <Link to="/marketplace" className="btn-primary">Browse Marketplace</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {filtered.map(product => (
            <div key={product._id} className="glass-card animate-fade-in" style={{ padding: '16px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', width: '100%', height: '190px', borderRadius: '10px', overflow: 'hidden', marginBottom: '14px' }}>
                <img
                  src={product.images?.[0] || fallbackImage}
                  alt={product.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => { e.target.onerror = null; e.target.src = fallbackImage; }}
                />
                {/* Purchased badge */}
                <span style={{
                  position: 'absolute', top: '10px', right: '10px',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: 'white', padding: '4px 12px', borderRadius: '20px',
                  fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px'
                }}>
                  <Star size={11} fill="white" /> Purchased
                </span>
              </div>

              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {product.category}
                </span>
                <h3 style={{ margin: '4px 0 6px', fontSize: '1rem', fontWeight: 700, color: '#233559', lineHeight: 1.3 }}>{product.title}</h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                  <div style={{
                    width: '22px', height: '22px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary), #8b1a25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.65rem', fontWeight: 700, color: 'white', flexShrink: 0
                  }}>
                    {product.seller?.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                    Bought from <strong style={{ color: '#233559' }}>{product.seller?.name || 'Unknown Seller'}</strong>
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f59e0b' }}>
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {!product.rating && (
                    <Link to={`/product/${product._id}`} style={{ padding: '6px 12px', fontSize: '0.85rem', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={14} /> Rate Seller
                    </Link>
                  )}
                  <Link to={`/product/${product._id}`} className="btn-primary" style={{ padding: '6px 16px', fontSize: '0.85rem' }}>
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Purchases;
