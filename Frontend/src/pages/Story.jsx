import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Heart } from 'lucide-react';

const Story = () => {
  return (
    <div style={{ padding: '60px 20px', maxWidth: '900px', margin: '0 auto', lineHeight: '1.8' }}>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', marginBottom: '60px' }}
      >
        <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Our Origins</span>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', color: '#233559', marginTop: '10px' }}>The Anurag Resell Story</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="glass-card"
        style={{ padding: '50px', marginBottom: '40px', borderTop: '4px solid var(--primary)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', color: 'var(--primary)' }}>
          <BookOpen size={32} />
          <h2 style={{ fontSize: '1.8rem', color: '#233559', margin: 0 }}>How It Started</h2>
        </div>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '20px' }}>
          It all began with a simple problem every student faces: textbooks are expensive, and after the semester ends, they just gather dust. Meanwhile, juniors are constantly searching for affordable study materials. 
        </p>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>
          We realized that our campus had all the resources it needed, but lacked a centralized, safe platform to connect buyers and sellers. WhatsApp groups were chaotic, and public marketplaces felt unsafe and lacked trust.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="glass-card"
        style={{ padding: '50px', marginBottom: '40px', borderTop: '4px solid var(--secondary)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', color: 'var(--secondary)' }}>
          <Users size={32} />
          <h2 style={{ fontSize: '1.8rem', color: '#233559', margin: 0 }}>Built By Students, For Students</h2>
        </div>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '20px' }}>
          Campus Resell was built to bridge that gap. By restricting access to verified university emails, we created a closed-loop ecosystem where trust is built-in. You aren't buying from a stranger; you're buying from a peer.
        </p>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>
          From engineering calculators to lab coats and dorm essentials, our platform makes sustainable living accessible.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        style={{ textAlign: 'center', marginTop: '60px' }}
      >
        <Heart size={48} color="var(--primary)" style={{ marginBottom: '20px' }} />
        <h3 style={{ fontSize: '1.5rem', color: '#233559', marginBottom: '15px' }}>Join the Movement</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Every item you buy or sell here reduces waste and helps a fellow student. Thank you for being a part of our story.
        </p>
      </motion.div>

    </div>
  );
};

export default Story;
