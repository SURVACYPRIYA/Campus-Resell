import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { MessageSquare, X, Send, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FeedbackModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Thank you for your feedback!');
    setIsOpen(false);
    setRating(0);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '60px', // Above the marquee ticker
          right: '25px',
          zIndex: 9998,
          background: 'var(--primary)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '56px',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(193, 38, 50, 0.4)',
          cursor: 'pointer',
          transition: 'transform 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        title="Share your feedback"
      >
        <MessageSquare size={24} />
      </button>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-card"
              style={{
                width: '100%',
                maxWidth: '500px',
                padding: '30px',
                position: 'relative',
                background: '#ffffff'
              }}
            >
              <button 
                onClick={() => setIsOpen(false)}
                style={{
                  position: 'absolute', top: '20px', right: '20px',
                  background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer'
                }}
              >
                <X size={24} />
              </button>

              <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#233559', marginBottom: '8px' }}>
                We value your thoughts!
              </h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '25px', fontSize: '0.95rem' }}>
                Help us improve the Campus Resell experience.
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Category Selection */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-main)', fontSize: '0.9rem' }}>Feedback Type</label>
                  <select className="input-glass" required style={{ width: '100%', cursor: 'pointer' }}>
                    <option value="">Select an option...</option>
                    <option value="bug">Report a Bug</option>
                    <option value="feature">Suggest a Feature</option>
                    <option value="general">General Feedback</option>
                  </select>
                </div>

                {/* Star Rating */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-main)', fontSize: '0.9rem' }}>Rate your experience</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={28}
                        style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                        fill={(hoveredRating || rating) >= star ? '#FECC2F' : 'none'}
                        color={(hoveredRating || rating) >= star ? '#FECC2F' : '#cbd5e1'}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        onClick={() => setRating(star)}
                      />
                    ))}
                  </div>
                </div>

                {/* Text Area */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-main)', fontSize: '0.9rem' }}>Your Message</label>
                  <textarea 
                    className="input-glass" 
                    placeholder="Tell us what you love or what could be better..." 
                    rows={4} 
                    required 
                    style={{ resize: 'none', width: '100%' }}
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', marginTop: '10px' }}>
                  <Send size={18} /> Send Feedback
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FeedbackModal;
