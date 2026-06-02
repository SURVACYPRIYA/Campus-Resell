import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Who can join Campus Resell?",
      answer: "Only currently enrolled students and staff with a verified university email address (e.g., @anurag.edu.in) can create an account and access the marketplace. This ensures our community remains secure and peer-to-peer."
    },
    {
      question: "Is it safe to buy and sell on the platform?",
      answer: "Yes! Because the platform is restricted to verified university members, you are dealing directly with your peers. We also highly recommend meeting in public, designated safe zones on campus to complete your transactions."
    },
    {
      question: "How does the payment process work?",
      answer: "Campus Resell connects buyers and sellers, but we do not process payments through the platform. You and the seller will agree on a payment method (UPI, cash, etc.) through the in-app chat and handle it directly during your campus meetup."
    },
    {
      question: "What items can I sell?",
      answer: "You can sell almost any item useful to a student: textbooks, engineering calculators, lab coats, electronics, bicycles, and dorm room essentials. Prohibited items include illegal goods, weapons, and anything against university policy."
    },
    {
      question: "How do I chat with a seller?",
      answer: "When viewing a product, click the 'Chat to Buy / Connect' button. This will open a private chat room with the seller where you can negotiate the price and arrange a meetup time and location."
    }
  ];

  return (
    <div style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto', minHeight: 'calc(100vh - 200px)' }}>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'center', marginBottom: '50px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px', color: 'var(--primary)' }}>
          <HelpCircle size={48} />
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#233559' }}>Frequently Asked Questions</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '10px' }}>
          Got questions? We've got answers.
        </p>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="glass-card"
            style={{ overflow: 'hidden' }}
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              style={{
                width: '100%',
                padding: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                color: 'var(--text-main)',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}
            >
              {faq.question}
              <motion.div
                animate={{ rotate: openIndex === index ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                style={{ color: 'var(--text-muted)' }}
              >
                <ChevronDown size={20} />
              </motion.div>
            </button>
            
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div style={{ padding: '0 20px 20px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

    </div>
  );
};

export default FAQ;
