import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../axios';
import { Package, Trash2, Search, Filter } from 'lucide-react';

const fallbackImage = "data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3e%3crect width='400' height='300' fill='%23f1f5f9'/%3e%3cg transform='translate(160,100)'%3e%3csvg width='80' height='80' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='1.5'%3e%3crect x='3' y='3' width='18' height='18' rx='2'/%3e%3ccircle cx='8.5' cy='8.5' r='1.5'/%3e%3cpolyline points='21 15 16 10 5 21'/%3e%3c/svg%3e%3c/g%3e%3c/svg%3e";

const MyListings = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      try {
        const res = await axios.get(`/api/products?seller=${user._id}&status=all`);
        setProducts(res.data.data.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing? This cannot be undone.')) return;
    try {
      await axios.delete(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  const filtered = products.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || p.status === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    all: products.length,
    available: products.filter(p => p.status !== 'sold').length,
    sold: products.filter(p => p.status === 'sold').length,
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1100px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>

      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ background: 'rgba(59,130,246,0.1)', padding: '10px', borderRadius: '12px' }}>
            <Package size={28} color="#3b82f6" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: '#233559' }}>My Listings</h1>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Manage all your items listed for sale</p>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
        {[
          { key: 'all', label: 'All', color: '#233559' },
          { key: 'available', label: 'Active', color: '#16a34a' },
          { key: 'sold', label: 'Sold', color: '#C02535' },
        ].map(tab => (
          <button key={tab.key} onClick={() => setFilter(tab.key)} style={{
            padding: '8px 20px', borderRadius: '20px', fontWeight: 700, fontSize: '0.9rem',
            border: filter === tab.key ? `2px solid ${tab.color}` : '2px solid #e2e8f0',
            background: filter === tab.key ? tab.color : 'white',
            color: filter === tab.key ? 'white' : tab.color,
            cursor: 'pointer', transition: 'all 0.2s'
          }}>
            {tab.label} ({counts[tab.key]})
          </button>
        ))}
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '20px', padding: '6px 16px' }}>
            <Search size={16} color="var(--text-muted)" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search your listings..."
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem', background: 'transparent' }}
            />
          </div>
        </div>
        <Link to="/sell" className="btn-primary" style={{ padding: '8px 20px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
          + New Listing
        </Link>
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>Loading your listings...</div>
      ) : filtered.length === 0 ? (
        <div className="glass-card" style={{ padding: '80px', textAlign: 'center' }}>
          <Package size={48} color="var(--text-muted)" style={{ marginBottom: '16px', opacity: 0.5 }} />
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            {search || filter !== 'all' ? 'No listings match your filter.' : "You haven't listed anything yet."}
          </p>
          <Link to="/sell" className="btn-primary">Sell Your First Item</Link>
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
                <span style={{
                  position: 'absolute', top: '10px', right: '10px',
                  background: product.status === 'sold' ? '#C02535' : '#16a34a',
                  color: 'white', padding: '4px 12px', borderRadius: '20px',
                  fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase'
                }}>
                  {product.status === 'sold' ? 'Sold' : 'Active'}
                </span>
              </div>

              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {product.category}
                </span>
                <h3 style={{ margin: '4px 0 6px', fontSize: '1rem', fontWeight: 700, color: '#233559', lineHeight: 1.3 }}>{product.title}</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Listed on {new Date(product.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#16a34a' }}>
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {product.status === 'sold' && (
                    <button
                      onClick={() => handleDelete(product._id)}
                      style={{
                        background: 'transparent', border: '1.5px solid rgba(239,68,68,0.35)',
                        color: '#ef4444', cursor: 'pointer', padding: '6px 12px',
                        borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '5px',
                        fontWeight: 600, fontSize: '0.82rem', transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
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

export default MyListings;
