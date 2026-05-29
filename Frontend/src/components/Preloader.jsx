import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Preloader = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Show preloader for 2.2 seconds before triggering exit
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 800); // Wait for exit animation to finish before unmounting
    }, 2200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '24px', 
              padding: '0 20px',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}
          >
            {/* Self-Drawing 3D Box Logo */}
            <motion.div 
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <motion.svg 
                width="140" height="140" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"
              >
                {/* Hexagon outline */}
                <motion.path 
                  d="M 50 15 L 85 35 L 85 75 L 50 95 L 15 75 L 15 35 Z" 
                  stroke="#C12632" strokeWidth="6" strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                />
                {/* Inner Y lines */}
                <motion.path 
                  d="M 15 35 L 50 55 L 85 35 M 50 55 V 95" 
                  stroke="#C12632" strokeWidth="6" strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, delay: 0.3, ease: "easeInOut" }}
                />
                {/* Trade Arrows inside */}
                <motion.path 
                  d="M 35 45 L 50 30 L 65 45 M 50 30 V 50" 
                  stroke="#233559" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.9, type: "spring", stiffness: 200 }}
                />
              </motion.svg>
            </motion.div>
            
            {/* Text Block sliding from the right */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', overflow: 'hidden' }}>
              <motion.h1 
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
                style={{
                  fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                  fontWeight: 900,
                  color: '#233559',
                  margin: '0',
                  letterSpacing: '0.02em',
                  lineHeight: '1.1'
                }}
              >
                AU CAMPUS TRADE
              </motion.h1>
              
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.8, delay: 0.8, ease: "easeInOut" }}
                style={{
                  height: '2px',
                  background: 'var(--primary)',
                  margin: '8px 0',
                  borderRadius: '1px'
                }}
              />

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.1, ease: "easeOut" }}
                style={{
                  margin: 0,
                  fontSize: 'clamp(0.8rem, 2vw, 1.2rem)',
                  fontWeight: 700,
                  letterSpacing: '0.25em',
                  color: 'var(--text-muted)'
                }}
              >
                FOR STUDENTS. BY STUDENTS.
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
