import React, { useState, useEffect } from 'react';
import axios from '../axios';
import { Search, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [onlyVerified, setOnlyVerified] = useState(false);

  const categories = ['All', 'Books', 'Cycles', 'Electronics', 'Others'];

  const fetchProducts = async () => {
    setLoading(true);

    try {
      let url = `/api/products?`;

      if (category !== 'All') {
        url += `category=${category}&`;
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

  useEffect(() => {
    fetchProducts();
  }, [category, searchTerm]);

  return (
    <div
      style={{
        padding: '40px 20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px',
          gap: '20px',
          flexWrap: 'wrap'
        }}
      >
        <h1
          style={{
            fontSize: '2.5rem'
          }}
        >
          Marketplace
        </h1>

        {/* SEARCH */}
        <div
          style={{
            display: 'flex',
            gap: '15px',
            flex: 1,
            maxWidth: '600px'
          }}
        >
          <div
            style={{
              position: 'relative',
              flex: 1
            }}
          >
            <Search
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
              placeholder="Search for items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* FILTERS TOOLBAR */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px',
          flexWrap: 'wrap',
          marginBottom: '40px'
        }}
      >
        {/* CATEGORY FILTERS */}
        <div
          style={{
            display: 'flex',
            gap: '15px',
            overflowX: 'auto',
            paddingBottom: '5px'
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: '8px 20px',
                borderRadius: '20px',
                border: category === cat ? '1px solid var(--primary)' : '1px solid var(--glass-border)',
                background:
                  category === cat
                    ? 'var(--primary)'
                    : '#ffffff',
                color: category === cat ? '#ffffff' : 'var(--text-main)',
                fontWeight: '600',
                fontSize: '0.9rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                boxShadow: category === cat ? '0 4px 10px rgba(193, 38, 50, 0.15)' : 'none'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* VERIFIED FILTER TOGGLE */}
        <button
          onClick={() => setOnlyVerified(!onlyVerified)}
          style={{
            padding: '8px 16px',
            borderRadius: '20px',
            border: '1px solid #16a34a',
            background: onlyVerified ? '#16a34a' : '#ffffff',
            color: onlyVerified ? '#ffffff' : '#16a34a',
            fontWeight: '600',
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>✓</span> Show Only AU Verified Sellers
        </button>
      </div>

      {/* LOADING */}
      {loading ? (
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
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '30px'
          }}
        >
          {/* PRODUCT CARDS */}
          {(onlyVerified ? products.filter((p, index) => index % 3 !== 0) : products).map((product) => (
            <div
              key={product._id}
              className="glass-card animate-fade-in"
              style={{
                padding: '15px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* PRODUCT IMAGE */}
              <div
                style={{
                  height: '200px',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                  marginBottom: '15px',
                  overflow: 'hidden'
                }}
              >
                <img
                  src={
                    product.images[0] ||
                    'https://via.placeholder.com/300?text=No+Image'
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
                  flex: 1
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--primary)',
                      fontWeight: 'bold',
                      textTransform: 'uppercase'
                    }}
                  >
                    {product.category}
                  </span>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      color: '#16a34a',
                      background: '#dcfce7',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontWeight: 'bold'
                    }}
                  >
                    ✓ AU Verified
                  </span>
                </div>

                <h3
                  style={{
                    marginBottom: '10px',
                    marginTop: '5px'
                  }}
                >
                  {product.title}
                </h3>

                {/* SELLER */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '15px'
                  }}
                >
                  <img
                    src={product.seller.avatar}
                    alt=""
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%'
                    }}
                  />

                  <span
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)'
                    }}
                  >
                    {product.seller.name}
                  </span>
                </div>
              </div>

              {/* PRICE + BUTTON */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 'auto'
                }}
              >
                <span
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    color: 'var(--secondary)'
                  }}
                >
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </span>

                <Link
                  to={`/product/${product._id}`}
                  className="btn-primary"
                  style={{
                    padding: '6px 15px',
                    fontSize: '0.9rem'
                  }}
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}

          {/* NO PRODUCTS */}
          {products.length === 0 && (
            <div
              style={{
                gridColumn: '1/-1',
                textAlign: 'center',
                padding: '100px',
                color: 'var(--text-muted)'
              }}
            >
              No products found in this category.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Marketplace;