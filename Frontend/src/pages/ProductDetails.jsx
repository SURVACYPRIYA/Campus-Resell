import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../axios';
import {
  MessageCircle,
  ShieldAlert,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProductDetails = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const { user } = useAuth();

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);

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
            background: '#f1f5f9',
            height: '450px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          <img
            src={
              product.images[0] ||
              'https://via.placeholder.com/600?text=Product+Image'
            }
            alt={product.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
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
            <div>
              <span
                style={{
                  background: 'var(--primary)',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  textTransform: 'uppercase'
                }}
              >
                {product.category}
              </span>

              <h1
                style={{
                  fontSize: '2.5rem',
                  marginTop: '10px'
                }}
              >
                {product.title}
              </h1>
            </div>

            {/* REPORT BUTTON */}
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
          </div>

          {/* PRICE */}
          <h2
            style={{
              fontSize: '2rem',
              color: 'var(--secondary)',
              marginBottom: '30px'
            }}
          >
            ₹{Number(product.price).toLocaleString("en-IN")}
          </h2>

          {/* DESCRIPTION */}
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
            <img
              src={product.seller.avatar}
              alt=""
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '25px',
                border: '2px solid var(--primary)'
              }}
            />

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

          {/* CHAT / CONNECT BUTTON */}
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
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;