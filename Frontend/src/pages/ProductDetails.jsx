import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../axios';
import {
  MessageCircle,
  ShieldAlert,
  Loader2,
  ArrowLeft,
  Share2,
  Camera
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CameraModal from '../components/CameraModal';

const fallbackImage = "data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3e%3crect width='800' height='600' fill='%23f1f5f9'/%3e%3cg transform='translate(360, 260)'%3e%3csvg width='80' height='80' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3e%3crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3e%3ccircle cx='8.5' cy='8.5' r='1.5'/%3e%3cpolyline points='21 15 16 10 5 21'/%3e%3c/svg%3e%3c/g%3e%3c/svg%3e";

const ProductDetails = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const { user } = useAuth();

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = React.useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState('');

  const isSeller = user && product && product.seller && user._id === product.seller._id;

  const handleUpdatePhoto = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const base64 = reader.result;
        const res = await axios.patch(
          `/api/products/${product._id}`,
          { images: [base64] },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        setProduct(res.data.data.product);
        setShowCamera(false);
        alert('Photo updated successfully!');
      } catch (err) {
        console.error('Error updating photo:', err);
        alert('Failed to update photo');
      }
    };
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);

        setProduct(res.data.data.product);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product && !isEditing) {
      setEditTitle(product.title || '');
      setEditCategory(product.category || 'Others');
      setEditPrice(product.price || '');
      setEditDescription(product.description || '');
      setEditStatus(product.status || 'available');
    }
  }, [product, isEditing]);

  const handleSaveChanges = async () => {
    if (!editTitle.trim()) {
      alert('Title cannot be empty');
      return;
    }
    if (!editPrice || Number(editPrice) <= 0) {
      alert('Price must be a positive number');
      return;
    }
    if (!editDescription.trim()) {
      alert('Description cannot be empty');
      return;
    }

    setSaving(true);
    try {
      const res = await axios.patch(
        `/api/products/${product._id}`,
        {
          title: editTitle,
          category: editCategory,
          price: Number(editPrice),
          description: editDescription,
          status: editStatus
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setProduct(res.data.data.product);
      setIsEditing(false);
      alert('Listing updated successfully!');
    } catch (err) {
      console.error('Error saving product changes:', err);
      alert(err.response?.data?.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleChat = async () => {
    if (!user) return navigate('/login');

    try {
      const res = await axios.post(
        '/api/chats',
        {
          sellerId: product.seller._id,
          productId: product._id
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      navigate('/chat', {
        state: {
          activeChatId: res.data.data.chat._id
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleReport = async () => {
    if (!user) return navigate('/login');

    const reason = window.prompt(
      'Reason for reporting this product:'
    );

    if (!reason) return;

    try {
      await axios.post(
        '/api/reports',
        {
          reportedProductId: product._id,
          reportedUserId: product.seller._id,
          reason
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      alert('Report submitted successfully.');
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: `Check out ${product.title} on Campus Resell!`,
          url: url,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '100px'
        }}
      >
        <Loader2
          className="animate-spin"
          size={48}
          color="var(--primary)"
        />
      </div>
    );
  }

  if (!product) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '100px'
        }}
      >
        Product not found.
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '40px 20px',
        maxWidth: '1000px',
        margin: '0 auto'
      }}
    >
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          marginBottom: '20px',
          transition: 'color 0.2s',
          fontSize: '0.95rem',
          fontWeight: '600'
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
      >
        <ArrowLeft size={20} />
        Back to Marketplace
      </button>

      {/* MAIN CARD */}
      <div
        className="glass-card"
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(350px, 1fr))',
          overflow: 'hidden'
        }}
      >
        {/* PRODUCT IMAGE */}
        <div
          style={{
            position: 'relative',
            background: '#f1f5f9',
            height: '100%',
            minHeight: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          {isSeller && (
            <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 10, display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowCamera(true)} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                <Camera size={16} style={{ marginRight: '6px' }} />
                Capture
              </button>
              <button onClick={() => fileInputRef.current.click()} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem', background: '#333' }}>
                Upload
              </button>
              <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={(e) => { if(e.target.files[0]) handleUpdatePhoto(e.target.files[0]) }} />
            </div>
          )}
          <img
            src={product.images[0] || fallbackImage}
            alt={product.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = fallbackImage;
            }}
          />
        </div>

        {/* PRODUCT DETAILS */}
        <div
          style={{
            padding: '40px',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* TITLE + REPORT */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '20px'
            }}
          >
            <div style={{ flex: 1 }}>
              {isEditing ? (
                <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '120px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>Category</label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="input-glass"
                      style={{ padding: '8px 12px', fontSize: '0.9rem', height: '40px' }}
                    >
                      <option value="Books">Books</option>
                      <option value="Cycles">Cycles</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                  <div style={{ flex: 1, minWidth: '120px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="input-glass"
                      style={{ padding: '8px 12px', fontSize: '0.9rem', height: '40px' }}
                    >
                      <option value="available">Available</option>
                      <option value="sold">Sold</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      background: 'var(--primary)',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      textTransform: 'uppercase',
                      fontWeight: 'bold'
                    }}
                  >
                    {product.category}
                  </span>
                  <span
                    style={{
                      background: product.status === 'sold' ? '#ef4444' : '#16a34a',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      textTransform: 'uppercase',
                      fontWeight: 'bold'
                    }}
                  >
                    {product.status || 'available'}
                  </span>
                </div>
              )}

              {isEditing ? (
                <div style={{ marginTop: '10px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>Title</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="input-glass"
                    style={{ fontSize: '1.5rem', fontWeight: 'bold', padding: '8px 12px' }}
                  />
                </div>
              ) : (
                <h1
                  style={{
                    fontSize: '2.5rem',
                    marginTop: '10px',
                    marginBottom: '5px'
                  }}
                >
                  {product.title}
                </h1>
              )}
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '5px' }}>
                Posted on {new Date(product.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div style={{ display: 'flex', gap: '15px' }}>
              <button
                onClick={handleShare}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--primary)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s'
                }}
                title="Share Product"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = 'scale(1.1)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = 'scale(1)')
                }
              >
                <Share2 size={24} />
              </button>

              {!isSeller && (
                <button
                  onClick={handleReport}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#ef4444',
                    cursor: 'pointer',
                    transition: 'transform 0.2s'
                  }}
                  title="Report Product"
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = 'scale(1.1)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = 'scale(1)')
                  }
                >
                  <ShieldAlert size={24} />
                </button>
              )}
            </div>
          </div>

          {/* PRICE */}
          {isEditing ? (
            <div style={{ marginBottom: '25px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>Price (₹)</label>
              <input
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                className="input-glass"
                style={{ fontSize: '1.25rem', fontWeight: 'bold', padding: '8px 12px', color: '#16a34a' }}
              />
            </div>
          ) : (
            <h2
              style={{
                fontSize: '2rem',
                color: '#16a34a',
                marginBottom: '30px'
              }}
            >
              ₹{Number(product.price).toLocaleString("en-IN")}
            </h2>
          )}

          {/* DESCRIPTION */}
          {isEditing ? (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, marginBottom: '30px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>Description</label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="input-glass"
                style={{ flex: 1, minHeight: '150px', resize: 'vertical', lineHeight: '1.6', padding: '12px' }}
              />
            </div>
          ) : (
            <p
              style={{
                color: 'var(--text-muted)',
                lineHeight: '1.6',
                marginBottom: '40px',
                flex: 1
              }}
            >
              {product.description}
            </p>
          )}

          {/* SELLER CARD */}
          <div
            style={{
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              marginBottom: '40px',
              background: '#f8fafc',
              border: '1px solid var(--glass-border)',
              borderRadius: '12px'
            }}
          >
            <div style={{ width: '50px', height: '50px', borderRadius: '25px', border: '2px solid var(--primary)', background: 'linear-gradient(135deg, var(--primary), #8b1a25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', userSelect: 'none' }}>{product.seller.name?.charAt(0)?.toUpperCase() || '?'}</span>
            </div>

            <div>
              <h4
                style={{
                  marginBottom: '4px'
                }}
              >
                {product.seller.name}
              </h4>

              <p
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)'
                }}
              >
                Student Seller
              </p>
            </div>
          </div>

          {/* CHAT / CONNECT BUTTON / OWNER EDIT CONTROLS */}
          {isSeller ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }}>
              {isEditing ? (
                <div style={{ display: 'flex', gap: '15px' }}>
                  <button
                    onClick={handleSaveChanges}
                    className="btn-primary"
                    style={{ flex: 1, padding: '15px' }}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    style={{
                      flex: 1,
                      padding: '15px',
                      background: 'transparent',
                      border: '1px solid var(--glass-border)',
                      color: 'var(--text-muted)',
                      borderRadius: '6px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-primary"
                    style={{ flex: 1, padding: '15px', minWidth: '150px' }}
                  >
                    Edit Listing
                  </button>
                  <div
                    style={{
                      flex: 1.5,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '15px',
                      background: 'rgba(35, 53, 89, 0.05)',
                      color: 'var(--text-muted)',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      border: '1px dashed var(--glass-border)',
                      minWidth: '200px'
                    }}
                  >
                    <span>This is your listing</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleChat}
              className="btn-primary"
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                padding: '15px'
              }}
            >
              <MessageCircle size={20} />
              Chat to Buy / Connect
            </button>
          )}
        </div>
      </div>
      {showCamera && (
        <CameraModal
          onCapture={(file) => handleUpdatePhoto(file)}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
};

export default ProductDetails;