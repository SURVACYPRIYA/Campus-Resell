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
  const [imageFiles, setImageFiles] = useState([]);

  const categories = ['Books', 'Cycles', 'Electronics', 'Others'];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return navigate('/login');

    setLoading(true);

    // Validate that at least one image is provided (file(s) or link)
    if (imageFiles.length === 0 && !formData.imageUrl) {
      alert('Please provide at least one product image (photo or link).');
      setLoading(false);
      return;
    }

    // Prepare image URLs (placeholder handling for file uploads)
    const imageUrls = [];
    // Add URLs from uploaded files
    imageFiles.forEach((file) => {
      const fileUrl = URL.createObjectURL(file);
      imageUrls.push(fileUrl);
    });
    // Add URLs from link input (comma‑separated)
    if (formData.imageUrl) {
      const links = formData.imageUrl.split(',').map(l => l.trim()).filter(l => l);
      imageUrls.push(...links);
    }
    // Fallback placeholder if still empty
    if (imageUrls.length === 0) {
      imageUrls.push('https://via.placeholder.com/300?text=Product+Image');
    }

    try {
      await axios.post(
        '/api/products',
        {
          ...formData,
          price: Number(formData.price),
          images: imageUrls
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

          {/* IMAGE INPUT (Camera or Link) */}
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
              Add Product Image (Required)
            </label>

            {/* Option 1: Capture Photo via Camera */}
            <div
              style={{
                marginBottom: '15px',
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
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                className="input-glass"
                style={{
                  paddingLeft: '45px'
                }}
                onChange={(e) => {
                  if (e.target.files) {
                    // Convert FileList to array and merge with existing selection
                    setImageFiles([...imageFiles, ...Array.from(e.target.files)]);
                  }
                }}
              />
              {/* Preview selected files */}
              <div style={{ marginTop: '10px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {imageFiles.map((file, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>{file.name}</span>
                    <button
                      type="button"
                      className="btn-primary"
                      style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                      onClick={() => setImageFiles(imageFiles.filter((_, i) => i !== idx))}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Option 2: Provide Image Link */}
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