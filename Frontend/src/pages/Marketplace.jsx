import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from '../axios';
import { Search, Loader2, Share2, Heart } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const fallbackImage = "data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3e%3crect width='800' height='600' fill='%23f1f5f9'/%3e%3cg transform='translate(360, 260)'%3e%3csvg width='80' height='80' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3e%3crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3e%3ccircle cx='8.5' cy='8.5' r='1.5'/%3e%3cpolyline points='21 15 16 10 5 21'/%3e%3c/svg%3e%3c/g%3e%3c/svg%3e";

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [wishlistIds, setWishlistIds] = useState(new Set());

  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Category tabs shown on Marketplace.
  // Backend schema enum is: Books | Cycles | Electronics | Others
  const categories = ['All', 'Books', 'Cycles', 'Electronics', 'Others'];

  // If the URL param isn't one of the supported backend categories, fallback to All.
  const normalizedCategory = categories.includes(category) ? category : 'All';





  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `/api/products?`;
      if (normalizedCategory && normalizedCategory !== 'All') {
        url += `category=${encodeURIComponent(normalizedCategory)}&`;
      }


      if (searchTerm) {
        url += `search=${searchTerm}&`;
      }
      const res = await axios.get(url);
      setProducts(res.data.data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Sync selected category with homepage query param: /marketplace?category=Electronics
  useEffect(() => {
    const qpCategory = searchParams.get('category');
    if (qpCategory && qpCategory !== category) {
      setCategory(qpCategory);
    }

    const qpSearch = searchParams.get('search');

    if (qpSearch && qpSearch !== searchTerm) {
      setSearchTerm(qpSearch);
    }

    if (!qpCategory && category !== 'All') {
      setCategory('All');
    }
  }, [searchParams]);


  useEffect(() => {
    fetchProducts();
  }, [category, searchTerm]);

  // Fetch wishlist on load
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) return;
      try {
        const res = await axios.get('/api/users/wishlist');
        const ids = new Set(res.data.data.wishlist.map(p => p._id));
        setWishlistIds(ids);
      } catch (err) {
        console.error('Failed to fetch wishlist', err);
      }
    };
    fetchWishlist();
  }, [user]);

  const handleToggleWishlist = async (productId, title) => {
    try {
      const res = await axios.post(`/api/users/wishlist/${productId}`);
      const isWishlisted = res.data.isWishlisted;
      setWishlistIds(prev => {
        const next = new Set(prev);
        if (isWishlisted) {
          next.add(productId);
        } else {
          next.delete(productId);
        }
        return next;
      });
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
            border: `1px solid ${isWishlisted ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.1)'}`,
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
            background: isWishlisted ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #64748b, #475569)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: isWishlisted ? '0 4px 10px rgba(239, 68, 68, 0.3)' : 'none'
          }}>
            <Heart size={20} fill={isWishlisted ? 'white' : 'none'} color={isWishlisted ? 'white' : '#f8fafc'} />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: '150px' }}>
            <span style={{ fontWeight: '700', color: '#f8fafc', fontSize: '0.95rem', lineHeight: '1.2' }}>
              {isWishlisted ? 'Saved to Wishlist' : 'Removed from Wishlist'}
            </span>
            <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: '500', marginTop: '2px', maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {title}
            </span>
          </div>
        </div>
      ), { duration: 3000 });
    } catch (err) {
      console.error(err);
      toast.error('Failed to update wishlist');
    }
  };

  const handleShare = (product) => {
    const url = `${window.location.origin}/product/${product._id}`;
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out ${product.title} on Campus Resell!`,
        url: url,
      }).catch((err) => console.error('Share failed', err));
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', gap: '20px', flexWrap: 'wrap' }}>
        <h1 style={{ fontSize: '2.5rem' }}>Marketplace</h1>
        {/* SEARCH */}
        <div style={{ display: 'flex', gap: '15px', flex: 1, maxWidth: '600px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
            <input type="text" className="input-glass" style={{ paddingLeft: '45px' }} placeholder="Search for items..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>
      </div>

      {/* FILTERS TOOLBAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', flexWrap: 'wrap', marginBottom: '40px' }}>
        {/* CATEGORY FILTERS */}
        <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '5px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                const next = new URLSearchParams(searchParams);
                if (cat === 'All') next.delete('category');
                else next.set('category', cat);
                setSearchParams(next, { replace: true });
              }}
              style={{
              padding: '8px 20px',

              borderRadius: '20px',
              border: category === cat ? '1px solid var(--primary)' : '1px solid var(--glass-border)',
              background: category === cat ? 'var(--primary)' : '#ffffff',
              color: category === cat ? '#ffffff' : 'var(--text-main)',
              fontWeight: '600',
              fontSize: '0.9rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
              boxShadow: category === cat ? '0 4px 10px rgba(193, 38, 50, 0.15)' : 'none'
            }}>{cat}</button>
          ))}
        </div>
      </div>

      {/* LOADING */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
          <Loader2 className="animate-spin" size={48} color="var(--primary)" />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
          {/* PRODUCT CARDS */}
          {products.map((product, index) => (
            <div key={product._id} className="glass-card animate-fade-in" style={{ padding: '15px', display: 'flex', flexDirection: 'column', animationDelay: `${index * 0.08}s` }}>
              {/* PRODUCT IMAGE */}
              <div style={{ width: '100%', height: '200px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', marginBottom: '15px', overflow: 'hidden', position: 'relative' }}>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleToggleWishlist(product._id, product.title);
                  }}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    zIndex: 5,
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
                    color: wishlistIds.has(product._id) ? '#ef4444' : 'var(--text-muted)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  title={wishlistIds.has(product._id) ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <Heart size={18} fill={wishlistIds.has(product._id) ? '#ef4444' : 'none'} />
                </button>
                <img src={product.images[0] || fallbackImage} alt={product.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.onerror = null; e.target.src = fallbackImage; }} />
              </div>

              {/* PRODUCT DETAILS */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase' }}>{product.category}</span>
                  <span style={{ fontSize: '0.65rem', color: '#16a34a', background: '#dcfce7', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>✓ AU Verified</span>
                </div>
                <h3 style={{ marginBottom: '4px', marginTop: '5px' }}>{product.title}</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '10px' }}>{new Date(product.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                {/* SELLER */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), #8b1a25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'white', userSelect: 'none' }}>{product.seller.name?.charAt(0)?.toUpperCase() || '?'}</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{product.seller.name}</span>
                </div>
                {/* PRICE + BUTTON */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span style={{ fontSize: '1.35rem', fontWeight: '800', color: '#16a34a' }}>₹{Number(product.price).toLocaleString("en-IN")}</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link to={`/product/${product._id}`} className="btn-primary" style={{ padding: '6px 15px', fontSize: '0.9rem' }}>View Details</Link>
                    <button onClick={() => handleShare(product)} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '6px', fontSize: '0.9rem' }} title="Share Product"><Share2 size={20} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* NO PRODUCTS */}
          {products.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px', color: 'var(--text-muted)' }}>No products found in this category.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Marketplace;