import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';
import { IndianRupee, Tag, Loader2, X, Camera, ImagePlus, Link, ZoomIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/* Required star */
const Req = () => <span style={{ color: 'var(--primary)', marginLeft: '3px' }}>*</span>;

/* ─── Camera Modal ─────────────────────────────────────────── */
const CameraModal = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => setReady(true);
        }
      } catch {
        setError('Camera access denied. Please allow camera permissions in your browser.');
      }
    })();
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
      onCapture(file);
    }, 'image/jpeg', 0.92);
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.85)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: '#1a1a1a', borderRadius: '16px', overflow: 'hidden',
          width: 'min(95vw, 560px)', boxShadow: '0 20px 60px rgba(0,0,0,0.6)'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 18px', background: '#111'
        }}>
          <span style={{ color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Camera size={18} color="var(--primary)" /> Camera
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%',
              width: '30px', height: '30px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer'
            }}
          >
            <X size={16} color="white" />
          </button>
        </div>

        {/* Video feed */}
        <div style={{ position: 'relative', background: '#000', aspectRatio: '4/3' }}>
          {error ? (
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', color: '#aaa', padding: '24px', textAlign: 'center'
            }}>
              <Camera size={40} style={{ marginBottom: '12px', opacity: 0.4 }} />
              <p style={{ fontSize: '0.9rem' }}>{error}</p>
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          )}
          {!ready && !error && (
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: '#aaa', fontSize: '0.9rem'
            }}>
              Starting camera…
            </div>
          )}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>

        {/* Capture button */}
        <div style={{ padding: '18px', display: 'flex', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={handleCapture}
            disabled={!ready || !!error}
            style={{
              background: ready && !error ? 'var(--primary)' : '#555',
              border: 'none', borderRadius: '50px', color: 'white',
              padding: '12px 36px', fontSize: '1rem', fontWeight: 600,
              cursor: ready && !error ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', gap: '8px',
              transition: 'background 0.2s'
            }}
          >
            <Camera size={18} /> Capture Photo
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Component ──────────────────────────────────────── */
const CreateProduct = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Books',
    imageUrl: ''
  });
  const [imageFiles, setImageFiles] = useState([]);

  const categories = ['Books', 'Cycles', 'Electronics', 'Others'];

  const addFiles = (fileList) => {
    if (fileList) setImageFiles(prev => [...prev, ...Array.from(fileList)]);
  };

  const handleCameraCapture = (file) => {
    setImageFiles(prev => [...prev, file]);
    setShowCamera(false);
  };

  const removeFile = (idx) => setImageFiles(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    setLoading(true);

    if (imageFiles.length === 0 && !formData.imageUrl) {
      toast('Please provide at least one product image (photo or link).');
      setLoading(false);
      return;
    }

    const imageUrls = [];
    imageFiles.forEach((file) => imageUrls.push(URL.createObjectURL(file)));
    if (formData.imageUrl) {
      formData.imageUrl.split(',').map(l => l.trim()).filter(Boolean).forEach(l => imageUrls.push(l));
    }
    if (imageUrls.length === 0) imageUrls.push('https://via.placeholder.com/300?text=Product+Image');

    try {
      await axios.post(
        '/api/products',
        { ...formData, price: Number(formData.price), images: imageUrls },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      navigate('/marketplace');
    } catch (err) {
      console.error(err);
      toast.error('Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = {
    display: 'block', marginBottom: '8px',
    color: 'var(--text-muted)', fontWeight: '500', fontSize: '0.92rem'
  };

  return (
    <>
      {/* Camera Modal */}
      {showCamera && (
        <CameraModal
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}

      <div style={{ padding: '40px 20px', maxWidth: '620px', margin: '0 auto' }}>
        <div className="glass-card animate-fade-in" style={{ padding: '40px' }}>

          <h1 style={{ fontSize: '2rem', marginBottom: '8px', textAlign: 'center' }}>
            Create New Listing
          </h1>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '30px' }}>
            Fields marked <span style={{ color: 'var(--primary)' }}>*</span> are required
          </p>

          <form onSubmit={handleSubmit}>

            {/* PRODUCT TITLE */}
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Product Title <Req /></label>
              <div style={{ position: 'relative' }}>
                <Tag
                  style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                  size={18}
                />
                <input
                  type="text" className="input-glass" style={{ paddingLeft: '45px' }}
                  placeholder="e.g. MacBook Pro 2021"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* PRICE + CATEGORY */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={labelStyle}>Price (₹) <Req /></label>
                <div style={{ position: 'relative' }}>
                  <IndianRupee
                    style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                    size={18}
                  />
                  <input
                    type="number" className="input-glass" style={{ paddingLeft: '45px' }}
                    placeholder="₹0" value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Category <Req /></label>
                <select
                  className="input-glass" value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{ appearance: 'none' }}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} style={{ background: 'var(--bg-dark)' }}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Description <Req /></label>
              <textarea
                className="input-glass" rows="4"
                placeholder="Describe your item..."
                value={formData.description}
                style={{ resize: 'vertical', minHeight: '100px', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            {/* PHOTOS */}
            <div style={{ marginBottom: '30px' }}>
              <label style={labelStyle}>Product Photos <Req /></label>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                Click a live photo using your camera, or pick existing images from your device.
              </p>

              {/* Two action tiles */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>

                {/* Camera */}
                <button
                  type="button"
                  onClick={() => setShowCamera(true)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', gap: '8px', padding: '18px 10px',
                    border: '2px dashed var(--glass-border)', borderRadius: '10px',
                    background: 'transparent', cursor: 'pointer',
                    color: 'var(--text-muted)', fontSize: '0.85rem', fontFamily: 'inherit',
                    transition: 'border-color 0.2s, background 0.2s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'rgba(193,38,50,0.04)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.background = 'transparent'; }}
                >
                  <Camera size={26} color="var(--primary)" />
                  <span>Click a Photo</span>
                </button>

                {/* Gallery */}
                <label
                  htmlFor="gallery-upload"
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', gap: '8px', padding: '18px 10px',
                    border: '2px dashed var(--glass-border)', borderRadius: '10px',
                    cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.85rem',
                    transition: 'border-color 0.2s, background 0.2s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'rgba(193,38,50,0.04)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.background = 'transparent'; }}
                >
                  <ImagePlus size={26} color="var(--primary)" />
                  <span>Choose from Gallery</span>
                </label>
                <input
                  id="gallery-upload" type="file" accept="image/*" multiple
                  style={{ display: 'none' }}
                  onChange={(e) => addFiles(e.target.files)}
                />
              </div>

              {/* Thumbnail Grid */}
              {imageFiles.length > 0 && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(85px, 1fr))',
                    gap: '10px', marginBottom: '14px'
                  }}
                >
                  {imageFiles.map((file, idx) => {
                    const src = URL.createObjectURL(file);
                    return (
                      <div
                        key={idx}
                        style={{
                          position: 'relative', borderRadius: '8px', overflow: 'hidden',
                          aspectRatio: '1', boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
                        }}
                      >
                        <img
                          src={src} alt={file.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                        <button
                          type="button" onClick={() => removeFile(idx)} title="Remove"
                          style={{
                            position: 'absolute', top: '5px', right: '5px',
                            background: 'rgba(0,0,0,0.65)', border: 'none',
                            borderRadius: '50%', width: '24px', height: '24px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', padding: 0, transition: 'background 0.2s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(193,38,50,0.9)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.65)'}
                        >
                          <X size={13} color="white" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Image URL input */}
              <div style={{ position: 'relative' }}>
                <Link
                  style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                  size={16}
                />
                <input
                  type="text" className="input-glass" style={{ paddingLeft: '45px' }}
                  placeholder="Or paste image URL (comma-separated for multiple)"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit" className="btn-primary"
              style={{
                width: '100%', padding: '15px', fontSize: '1.1rem',
                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px'
              }}
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Post Listing'}
            </button>

          </form>
        </div>
      </div>
    </>
  );
};

export default CreateProduct;