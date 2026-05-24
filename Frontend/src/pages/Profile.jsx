import React, { useState, useEffect } from 'react';
import axios from '../axios';
import { useAuth } from '../context/AuthContext';
import { Loader2, Package, Mail, User, ShieldCheck, Trash2, MoreVertical } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const fallbackImage = "data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3e%3crect width='800' height='600' fill='%23f1f5f9'/%3e%3cg transform='translate(360, 260)'%3e%3csvg width='80' height='80' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3e%3crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3e%3ccircle cx='8.5' cy='8.5' r='1.5'/%3e%3cpolyline points='21 15 16 10 5 21'/%3e%3c/svg%3e%3c/g%3e%3c/svg%3e";

const Profile = () => {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchUserProducts = async () => {
      try {
        const [resProducts, resPurchases] = await Promise.all([
          axios.get(`/api/products?seller=${user._id}&status=all`),
          axios.get(`/api/products?buyer=${user._id}&status=sold`)
        ]);
        setProducts(resProducts.data.data.products);
        setPurchases(resPurchases.data.data.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserProducts();
    }
  }, [user]);

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this listing? This will also remove all related chats and cannot be undone.')) {
      return;
    }
    try {
      await axios.delete(`/api/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      alert('Listing deleted successfully!');
    } catch (err) {
      console.error('Error deleting product:', err);
      alert(err.response?.data?.message || 'Failed to delete listing');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
        <Loader2 className="animate-spin" size={48} color="var(--primary)" />
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* PROFILE HEADER */}
      <div className="glass-card" style={{ padding: '40px', marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap', position: 'relative' }}>
        <div 
          style={{ 
            width: '120px', height: '120px', borderRadius: '50%', 
            border: '4px solid var(--glass-border)', 
            background: 'linear-gradient(135deg, var(--primary), #8b1a25)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <span style={{ fontSize: '3rem', fontWeight: 700, color: 'white', userSelect: 'none' }}>
            {user.name?.charAt(0)?.toUpperCase() || '?'}
          </span>
        </div>
        <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              {user.name}
              <ShieldCheck style={{ color: '#16a34a' }} size={28} title="Verified AU User" />
              {/* Dropdown trigger */}
              <button onClick={() => setShowMenu((v) => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} title="Menu">
                <MoreVertical size={20} />
              </button>
              {showMenu && (
                <div style={{
                  position: 'absolute', top: '60px', right: '20px', background: '#ffffff', border: '1px solid var(--glass-border)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 1000,
                  minWidth: '150px'
                }}>
                  <button onClick={() => { setShowMenu(false); navigate('/dashboard'); }} style={menuItemStyle}>🏠 Dashboard</button>
                  <button onClick={() => { setShowMenu(false); navigate('/my-listings'); }} style={menuItemStyle}>📦 My Listings</button>
                  <button onClick={() => { setShowMenu(false); navigate('/purchases'); }} style={menuItemStyle}>🛍️ Purchases</button>
                  <hr style={{ margin: '4px 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />
                  <button onClick={() => { setShowMenu(false); if (window.confirm('Are you sure you want to logout?')) logout(); }} style={{ ...menuItemStyle, color: '#ef4444' }}>🚪 Logout</button>
                </div>
              )}
            </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '5px' }}>
            <Mail size={18} />
            <span>{user.email}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
            <User size={18} />
            <span>Student Seller</span>
          </div>
        </div>
      </div>

      {/* UPLOADED PRODUCTS */}
      <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Package size={24} color="var(--primary)" />
        Your Listings
      </h2>
      
      {products.length === 0 ? (
        <div className="glass-card" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>You haven't listed any products yet.</p>
          <Link to="/sell" className="btn-primary">Sell an Item</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
          {products.map((product) => (
            <div key={product._id} className="glass-card animate-fade-in" style={{ padding: '15px', display: 'flex', flexDirection: 'column' }}>
              
              <div style={{ position: 'relative', width: '100%', height: '200px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', marginBottom: '15px', overflow: 'hidden' }}>
                <img 
                  src={product.images[0] || fallbackImage} 
                  alt={product.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = fallbackImage;
                  }}
                />
                <div style={{ 
                  position: 'absolute', 
                  top: '10px', 
                  right: '10px', 
                  background: product.status === 'sold' ? '#ef4444' : '#16a34a', 
                  color: 'white', 
                  padding: '4px 12px', 
                  borderRadius: '20px', 
                  fontSize: '0.8rem', 
                  fontWeight: 'bold',
                  textTransform: 'uppercase'
                }}>
                  {product.status || 'Available'}
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  {product.category}
                </span>
                <h3 style={{ marginBottom: '4px', marginTop: '5px' }}>{product.title}</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                  {new Date(product.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#16a34a' }}>
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </span>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {product.status === 'sold' && (
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      title="Delete this sold listing"
                      style={{
                        background: 'transparent',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#ef4444',
                        cursor: 'pointer',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontWeight: '600',
                        fontSize: '0.85rem',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
                        e.currentTarget.style.borderColor = '#ef4444';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                      }}
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  )}
                  <Link to={`/product/${product._id}`} className="btn-primary" style={{ padding: '6px 15px', fontSize: '0.9rem' }}>
                    View
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* YOUR PURCHASES */}
      <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', marginTop: '60px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Package size={24} color="var(--primary)" />
        Your Purchases
      </h2>
      
      {purchases.length === 0 ? (
        <div className="glass-card" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '1.2rem' }}>You haven't bought any products yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
          {purchases.map((product) => (
            <div key={product._id} className="glass-card animate-fade-in" style={{ padding: '15px', display: 'flex', flexDirection: 'column' }}>
              
              <div style={{ position: 'relative', width: '100%', height: '200px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', marginBottom: '15px', overflow: 'hidden' }}>
                <img 
                  src={product.images[0] || fallbackImage} 
                  alt={product.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = fallbackImage;
                  }}
                />
                <div style={{ 
                  position: 'absolute', 
                  top: '10px', 
                  right: '10px', 
                  background: '#16a34a', 
                  color: 'white', 
                  padding: '4px 12px', 
                  borderRadius: '20px', 
                  fontSize: '0.8rem', 
                  fontWeight: 'bold',
                  textTransform: 'uppercase'
                }}>
                  Purchased
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  {product.category}
                </span>
                <h3 style={{ marginBottom: '4px', marginTop: '5px' }}>{product.title}</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                  Bought from {product.seller?.name || 'Unknown'}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#16a34a' }}>
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </span>
                <Link to={`/product/${product._id}`} className="btn-primary" style={{ padding: '6px 15px', fontSize: '0.9rem' }}>
                  View
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Profile;
