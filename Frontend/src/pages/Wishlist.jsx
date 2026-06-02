import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from '../axios';
import { Loader2, Heart, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const fallbackImage = "data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3e%3crect width='800' height='600' fill='%23f1f5f9'/%3e%3cg transform='translate(360, 260)'%3e%3csvg width='80' height='80' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3e%3crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3e%3ccircle cx='8.5' cy='8.5' r='1.5'/%3e%3cpolyline points='21 15 16 10 5 21'/%3e%3c/svg%3e%3c/g%3e%3c/svg%3e";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    try {
      const res = await axios.get('/api/users/wishlist');
      setWishlist(res.data.data.wishlist);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId, title) => {
    try {
      await axios.post(`/api/users/wishlist/${productId}`);
      setWishlist(prev => prev.filter(item => item._id !== productId));
      toast.success(`Removed "${title}" from wishlist`);
    } catch (err) {
      console.error(err);
      toast.custom((t) => (
        <div
          style={{
            background: 'linear-gradient(135deg, #1e293b, #0f172a)',
            padding: '14px 22px',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            opacity: t.visible ? 1 : 0,
            transform: t.visible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-20px)',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            cursor: 'pointer'
          }}
          onClick={() => toast.dismiss(t.id)}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 10px rgba(239, 68, 68, 0.3)'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: '150px' }}>
            <span style={{ fontWeight: '700', color: '#f8fafc', fontSize: '0.95rem', lineHeight: '1.2' }}>
              Update Failed
            </span>
            <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: '500', marginTop: '2px' }}>
              Failed to update wishlist.
            </span>
          </div>
        </div>
      ), { duration: 3000 });
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Back button and title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px' }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{
            background: 'rgba(0,0,0,0.03)',
            border: '1px solid var(--glass-border)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.07)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.03)'}
        >
          <ArrowLeft size={18} color="var(--text-main)" />
        </button>
        <div>
          <h1 style={{ fontSize: '2.2rem', margin: 0, fontWeight: 800, color: '#233559' }}>My Wishlist</h1>
          <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Items you've saved for later</p>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
          <Loader2 className="animate-spin" size={48} color="var(--primary)" />
        </div>
      ) : wishlist.length === 0 ? (
        
        /* Empty State */
        <div className="glass-card" style={{ 
          textAlign: 'center', 
          padding: '60px 40px', 
          maxWidth: '500px', 
          margin: '40px auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.08)',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem'
          }}>
            ❤️
          </div>
          <div>
            <h2 style={{ margin: '0 0 8px', fontSize: '1.4rem', fontWeight: 800 }}>Your Wishlist is Empty</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
              Find peer listings you like and tap the heart icon to save them here.
            </p>
          </div>
          <Link to="/marketplace" className="btn-primary" style={{ textDecoration: 'none', padding: '12px 30px', fontWeight: 700, borderRadius: '12px' }}>
            Browse Marketplace
          </Link>
        </div>
      ) : (
        
        /* Products Grid */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
          {wishlist.map((product, index) => (
            <div 
              key={product._id} 
              className="glass-card animate-fade-in product-card-hover" 
              style={{ 
                padding: '15px', 
                display: 'flex', 
                flexDirection: 'column', 
                position: 'relative',
                animationDelay: `${index * 0.08}s` 
              }}
            >
              {/* Heart overlay button */}
              <button
                onClick={() => handleRemove(product._id, product.title)}
                style={{
                  position: 'absolute',
                  top: '25px',
                  right: '25px',
                  zIndex: 10,
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.9)',
                  border: 'none',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#ef4444',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                title="Remove from Wishlist"
              >
                <Heart size={18} fill="#ef4444" />
              </button>

              {/* Product Image */}
              <div style={{ width: '100%', height: '200px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', marginBottom: '15px', overflow: 'hidden' }}>
                <img 
                  className="product-img"
                  src={product.images?.[0] || fallbackImage} 
                  alt={product.title} 
                  loading="lazy" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  onError={(e) => { e.target.onerror = null; e.target.src = fallbackImage; }} 
                />
              </div>

              {/* Product Info */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase' }}>{product.category}</span>
                  <span style={{ fontSize: '0.65rem', color: '#16a34a', background: '#dcfce7', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>✓ AU Verified</span>
                </div>
                <h3 style={{ marginBottom: '4px', marginTop: '5px', fontSize: '1.1rem' }}>{product.title}</h3>
                
                {/* Seller info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '8px 0 15px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), #8b1a25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'white' }}>{product.seller?.name?.charAt(0)?.toUpperCase() || '?'}</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{product.seller?.name}</span>
                </div>

                {/* Price and View Details */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span style={{ fontSize: '1.3rem', fontWeight: '800', color: '#16a34a' }}>₹{Number(product.price).toLocaleString("en-IN")}</span>
                  <Link to={`/product/${product._id}`} className="btn-primary" style={{ padding: '6px 15px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    View Details
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

export default Wishlist;
