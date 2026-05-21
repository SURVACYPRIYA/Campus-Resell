import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';
import { Upload, IndianRupee, Tag, FileText, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CreateProduct = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Books',
    imageUrl: ''
  });

  const categories = ['Books', 'Cycles', 'Electronics', 'Others'];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return navigate('/login');

    setLoading(true);

    try {
      await axios.post(
        '/api/products',
        {
          ...formData,
          price: Number(formData.price),
          images: [
            formData.imageUrl ||
              'https://via.placeholder.com/300?text=Product+Image'
          ]
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      navigate('/marketplace');
    } catch (err) {
      console.error(err);
      alert('Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: '40px 20px',
        maxWidth: '600px',
        margin: '0 auto'
      }}
    >
      <div
        className="glass-card animate-fade-in"
        style={{
          padding: '40px'
        }}
      >
        <h1
          style={{
            fontSize: '2rem',
            marginBottom: '30px',
            textAlign: 'center'
          }}
        >
          Create New Listing
        </h1>

        <form onSubmit={handleSubmit}>
          {/* PRODUCT TITLE */}
          <div
            style={{
              marginBottom: '20px'
            }}
          >
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                color: 'var(--text-muted)'
              }}
            >
              Product Title
            </label>

            <div
              style={{
                position: 'relative'
              }}
            >
              <Tag
                style={{
                  position: 'absolute',
                  left: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }}
                size={18}
              />

              <input
                type="text"
                className="input-glass"
                style={{
                  paddingLeft: '45px'
                }}
                placeholder="e.g. MacBook Pro 2021"
                value={formData.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: e.target.value
                  })
                }
                required
              />
            </div>
          </div>

          {/* PRICE + CATEGORY */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              marginBottom: '20px'
            }}
          >
            {/* PRICE */}
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: 'var(--text-muted)'
                }}
              >
                Price (₹)
              </label>

              <div
                style={{
                  position: 'relative'
                }}
              >
                <IndianRupee
                  style={{
                    position: 'absolute',
                    left: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)'
                  }}
                  size={18}
                />

                <input
                  type="number"
                  className="input-glass"
                  style={{
                    paddingLeft: '45px'
                  }}
                  placeholder="₹0"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: e.target.value
                    })
                  }
                  required
                />
              </div>
            </div>

            {/* CATEGORY */}
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: 'var(--text-muted)'
                }}
              >
                Category
              </label>

              <select
                className="input-glass"
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value
                  })
                }
                style={{
                  appearance: 'none'
                }}
              >
                {categories.map((cat) => (
                  <option
                    key={cat}
                    value={cat}
                    style={{
                      background: 'var(--bg-dark)'
                    }}
                  >
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div
            style={{
              marginBottom: '20px'
            }}
          >
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                color: 'var(--text-muted)'
              }}
            >
              Description
            </label>

            <textarea
              className="input-glass"
              rows="4"
              placeholder="Describe your item..."
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value
                })
              }
              required
            ></textarea>
          </div>

          {/* IMAGE URL */}
          <div
            style={{
              marginBottom: '30px'
            }}
          >
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                color: 'var(--text-muted)'
              }}
            >
              Image URL (Optional)
            </label>

            <div
              style={{
                position: 'relative'
              }}
            >
              <Upload
                style={{
                  position: 'absolute',
                  left: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }}
                size={18}
              />

              <input
                type="text"
                className="input-glass"
                style={{
                  paddingLeft: '45px'
                }}
                placeholder="https://images.unsplash.com/..."
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    imageUrl: e.target.value
                  })
                }
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="btn-primary"
            style={{
              width: '100%',
              padding: '15px',
              fontSize: '1.1rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px'
            }}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              'Post Listing'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;