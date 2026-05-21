import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../axios';
import { Loader2, Package, Mail, User, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProducts = async () => {
      try {
        const res = await axios.get(`/api/products?seller=${user._id}&status=all`);
        setProducts(res.data.data.products);
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
      <div className="glass-card" style={{ padding: '40px', marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}>
        <img 
          src={user.avatar} 
          alt={user.name} 
          style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid var(--glass-border)', objectFit: 'cover' }} 
        />
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {user.name}
            <ShieldCheck style={{ color: '#16a34a' }} size={28} title="Verified AU User" />
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
              
              <div style={{ position: 'relative', height: '200px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', marginBottom: '15px', overflow: 'hidden' }}>
                <img 
                  src={product.images[0] || 'https://via.placeholder.com/300?text=No+Image'} 
                  alt={product.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
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
                <h3 style={{ marginBottom: '15px', marginTop: '5px' }}>{product.title}</h3>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--secondary)' }}>
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </span>
                <Link to={`/product/${product._id}`} className="btn-primary" style={{ padding: '6px 15px', fontSize: '0.9rem', background: 'white', color: 'var(--text-main)', border: '1px solid var(--glass-border)', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
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
