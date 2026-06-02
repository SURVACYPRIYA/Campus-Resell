import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Sample slides – replace URLs with actual featured images if needed
const slides = [
  {
    id: 1,
    title: 'Discover Great Deals',
    subtitle: 'Browse the best student offers today',
    image: 'https://images.unsplash.com/photo-1508898578281-774ac4893a31?w=1200&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Sell Your Stuff',
    subtitle: 'Turn unused items into cash fast',
    image: 'https://images.unsplash.com/photo-1593642634443-44adaa06623a?w=1200&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Connect Instantly',
    subtitle: 'Chat with fellow students in real time',
    image: 'https://images.unsplash.com/photo-1517502166878-35c93a0072bb?w=1200&auto=format&fit=crop',
  },
];

const slideTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.8,
};

const HeroCarousel = () => {
  const [active, setActive] = useState(0);

  // Auto‑advance slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px', marginBottom: '40px' }}>
      <AnimatePresence initial={false} exitBeforeEnter>
        {slides.map((slide, i) =>
          i === active ? (
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={slideTransition}
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '400px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#fff',
                textShadow: '0 2px 8px rgba(0,0,0,0.6)',
                padding: '20px',
                position: 'relative',
              }}
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                style={{ fontSize: '2.8rem', fontWeight: '800', marginBottom: '10px' }}
              >
                {slide.title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                style={{ fontSize: '1.4rem', maxWidth: '700px', textAlign: 'center' }}
              >
                {slide.subtitle}
              </motion.p>
            </motion.div>
          ) : null
        )}
      </AnimatePresence>
      {/* Navigation dots */}
      <div
        style={{
          position: 'absolute',
          bottom: '15px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px',
        }}
      >
        {slides.map((_, i) => (
          <div
            key={i}
            onClick={() => setActive(i)}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: i === active ? 'var(--primary)' : 'rgba(255,255,255,0.6)',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
