import React from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  return (
    <div style={{ padding: '60px 20px', maxWidth: '1000px', margin: '0 auto', minHeight: 'calc(100vh - 200px)' }}>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'center', marginBottom: '60px' }}
      >
        <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Get in Touch</span>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', color: '#233559', marginTop: '10px' }}>Contact Us</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '10px', maxWidth: '600px', margin: '10px auto 0' }}>
          Have a question or need assistance with the Campus Resell portal? We're here to help!
        </p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
        
        {/* Contact Information Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card"
            style={{ padding: '30px', display: 'flex', alignItems: 'center', gap: '20px', borderLeft: '4px solid var(--primary)' }}
          >
            <div style={{ background: 'rgba(193, 38, 50, 0.1)', padding: '15px', borderRadius: '50%', color: 'var(--primary)' }}>
              <Phone size={28} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '5px', color: '#233559' }}>Call Us</h3>
              <p style={{ color: 'var(--text-muted)' }}>Toll Free: 1800-RES-SELL</p>
              <p style={{ color: 'var(--text-muted)' }}>Support: 81 81 057 057</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-card"
            style={{ padding: '30px', display: 'flex', alignItems: 'center', gap: '20px', borderLeft: '4px solid var(--secondary)' }}
          >
            <div style={{ background: 'rgba(254, 204, 47, 0.15)', padding: '15px', borderRadius: '50%', color: 'var(--secondary)' }}>
              <Mail size={28} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '5px', color: '#233559' }}>Email Us</h3>
              <p style={{ color: 'var(--text-muted)' }}>support@campusresell.com</p>
              <p style={{ color: 'var(--text-muted)' }}>info@anurag.edu.in</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass-card"
            style={{ padding: '30px', display: 'flex', alignItems: 'center', gap: '20px', borderLeft: '4px solid #16a34a' }}
          >
            <div style={{ background: '#dcfce7', padding: '15px', borderRadius: '50%', color: '#16a34a' }}>
              <MapPin size={28} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '5px', color: '#233559' }}>Visit Us</h3>
              <p style={{ color: 'var(--text-muted)' }}>123 Campus Avenue,</p>
              <p style={{ color: 'var(--text-muted)' }}>Hyderabad, India</p>
            </div>
          </motion.div>
        </div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-card"
          style={{ padding: '40px' }}
        >
          <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', color: '#233559' }}>Send a Message</h2>
          <form onSubmit={(e) => { 
            e.preventDefault(); 
            toast.custom((t) => (
              <div
                style={{
                  background: 'linear-gradient(135deg, #064e3b, #065f46)',
                  padding: '14px 22px',
                  borderRadius: '16px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
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
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: '150px' }}>
                  <span style={{ fontWeight: '700', color: '#f8fafc', fontSize: '0.95rem', lineHeight: '1.2' }}>
                    Message Sent
                  </span>
                  <span style={{ color: '#a7f3d0', fontSize: '0.8rem', fontWeight: '500', marginTop: '2px' }}>
                    We will get back to you soon.
                  </span>
                </div>
              </div>
            ), { duration: 4000 });
          }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-main)', fontWeight: '600' }}>Your Name</label>
              <input type="text" className="input-glass" placeholder="John Doe" required />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-main)', fontWeight: '600' }}>Your Email</label>
              <input type="email" className="input-glass" placeholder="john@anurag.edu.in" required />
            </div>
            
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-main)', fontWeight: '600' }}>Message</label>
              <textarea 
                className="input-glass" 
                placeholder="How can we help you?" 
                rows="5" 
                style={{ resize: 'vertical' }}
                required 
              ></textarea>
            </div>
            
            <button type="submit" className="btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
              <Send size={18} />
              Send Message
            </button>
          </form>
        </motion.div>

      </div>
    </div>
  );
};

export default Contact;
