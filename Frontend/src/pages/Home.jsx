import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Users, MapPin, ShieldAlert, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

/* ---------- student reviews ---------- */
const REVIEWS = [
  { id: 1, rating: 5, text: "Prices are reasonable", author: "Priya S.", dept: "ECE" },
  { id: 2, rating: 5, text: "Helped me declutter my room!", author: "Ravi K.", dept: "CSE" },
  { id: 3, rating: 4, text: "Good concept, needs more users", author: "Ananya M.", dept: "MBA" },
  { id: 4, rating: 5, text: "Bought lab coat for half price!", author: "Sahil T.", dept: "Pharma" },
  { id: 5, rating: 5, text: "Sold my calculator in two days", author: "Divya R.", dept: "MECH" },
  { id: 6, rating: 4, text: "Very helpful for freshers", author: "Kiran P.", dept: "CIVIL" },
  { id: 7, rating: 5, text: "Great way to save on textbooks", author: "Meera V.", dept: "BCA" },
  { id: 8, rating: 5, text: "Easy to use, love the UI!", author: "Arjun D.", dept: "IT" },
];

const StarRating = ({ rating, size = 13 }) => (
  <span style={{ display: 'inline-flex', gap: '2px' }}>
    {[1, 2, 3, 4, 5].map(i => (
      <Star key={i} size={size}
        fill={i <= rating ? '#FECC2F' : 'none'}
        color={i <= rating ? '#FECC2F' : '#d1d5db'}
        strokeWidth={1.5}
      />
    ))}
  </span>
);

const Home = () => {
  const { user } = useAuth();
  return (
    <>
      <style>{`
        @keyframes home-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .home-marquee-track {
          display: flex;
          animation: home-marquee 32s linear infinite;
          width: max-content;
        }
        .home-marquee-track:hover { animation-play-state: paused; }
        .home-review-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
          padding: 0 24px;
          font-size: 0.82rem;
          border-right: 1px solid #e2e8f0;
        }
        @keyframes rcardIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .rcard { animation: rcardIn 0.55s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', paddingBottom: '50px' }}>

        {/* HERO BANNER */}
        <div style={{
          background: 'linear-gradient(rgba(35, 53, 89, 0.45), rgba(35, 53, 89, 0.8)), url("https://cdn.sanity.io/images/v1rb7aqk/production/8464c338f5114e1e77dd9f93a77560b5c27f139d-7008x4672.jpg?rect=873,435,5297,3891&q=80&auto=format&w=1920") center/cover no-repeat',
          width: '100%',
          minHeight: '75vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: '100px 20px',
          color: '#ffffff',
          textAlign: 'center',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '-50%', left: '-30%', width: '80%', height: '180%', background: 'radial-gradient(ellipse at center, rgba(193, 38, 50, 0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-50%', right: '-30%', width: '80%', height: '180%', background: 'radial-gradient(ellipse at center, rgba(254, 204, 47, 0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              style={{ fontSize: '4rem', fontWeight: '800', marginBottom: '20px', color: '#ffffff', lineHeight: '1.15', maxWidth: '950px', letterSpacing: '-0.02em' }}
            >
              Smart student reselling <br /> takes more than grades.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              style={{ fontSize: '1.4rem', color: '#cbd5e1', marginBottom: '40px', maxWidth: '750px', lineHeight: '1.5', fontWeight: '500' }}
            >
              And, we create the space for peer-to-peer exchange
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.4 }}
              style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}
            >
              <Link to={user ? "/marketplace" : "/login"} style={{ padding: '16px 45px', fontSize: '1.1rem', fontWeight: '700', borderRadius: '30px', background: '#C02535', color: '#ffffff', textDecoration: 'none', boxShadow: '0 4px 20px rgba(192, 37, 53, 0.45)', transition: 'transform 0.2s', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >Browse Deals</Link>
              <Link to={user ? "/sell" : "/login"} style={{ padding: '14px 43px', fontSize: '1.1rem', fontWeight: '700', borderRadius: '30px', background: 'transparent', color: '#ffffff', border: '2px solid #ffffff', textDecoration: 'none', transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.color = '#233559'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#ffffff'; }}
              >Sell An Item</Link>
            </motion.div>
          </div>
        </div>

        {/* PAGE CONTAINER */}
        <div style={{ padding: '60px 20px 40px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>

          {/* FEATURE CARDS */}
          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {[
              { icon: <ShieldCheck size={32} />, title: "Secure & Verified", desc: "Only students with verified college emails can join the community." },
              { icon: <Zap size={32} />, title: "Instant Chat", desc: "Real-time 'Chat to Buy' feature connects you instantly with sellers." },
              { icon: <Users size={32} />, title: "Campus Community", desc: "Trust your peers. Buy and sell within a closed, safe ecosystem." }
            ].map((feature, i) => (
              <motion.div key={i} whileHover={{ y: -10 }} className="glass-card"
                style={{ padding: '40px 30px', textAlign: 'center', borderTop: '4px solid var(--primary)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <div style={{ color: 'var(--primary)', marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>{feature.icon}</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: 'var(--text-main)', fontWeight: '700' }}>{feature.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.5' }}>{feature.desc}</p>
              </motion.div>
            ))}
          </section>

          {/* CAMPUS STATS */}
          <section id="stats" style={{ marginTop: '80px', textAlign: 'center' }}>
            <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>PORTAL PERFORMANCE</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginTop: '10px', marginBottom: '40px', color: '#233559' }}>AU Resell in Numbers</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '25px' }}>
              {[
                { metric: "₹4,20,000+", label: "Student Savings", detail: "Saved by buying books and items from peers" },
                { metric: "1,450+", label: "Successful Trades", detail: "Textbooks, lab coats, and cycles exchanged" },
                { metric: "2,200+", label: "Verified Students", detail: "Registered users with verified AU emails" },
                { metric: "24 Hrs", label: "Average Deal Time", detail: "Fast peer connection and transaction response" }
              ].map((stat, i) => (
                <div key={i} className="glass-card" style={{ padding: '30px 20px', textAlign: 'center', borderTop: '4px solid var(--secondary)' }}>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '8px' }}>{stat.metric}</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '5px' }}>{stat.label}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{stat.detail}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ===== STUDENT REVIEWS SECTION ===== */}
          <section style={{ marginTop: '80px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Community Voice</span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginTop: '10px', marginBottom: '8px', color: '#233559' }}>What Students Say</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Real reviews from verified Anurag University students</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '12px' }}>
                <StarRating rating={5} size={16} />
                <span style={{ fontWeight: '700', color: '#233559', fontSize: '1rem' }}>4.7</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>avg · {REVIEWS.length} reviews</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
              {REVIEWS.map((r, i) => (
                <div
                  key={r.id}
                  className="glass-card rcard"
                  style={{ padding: '24px', animationDelay: `${i * 0.06}s`, borderTop: '3px solid var(--secondary)', cursor: 'default' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(193,38,50,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}
                >
                  <div style={{ marginBottom: '10px' }}>
                    <StarRating rating={r.rating} size={14} />
                  </div>
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', fontStyle: 'italic', lineHeight: 1.6, marginBottom: '16px' }}>
                    &ldquo;{r.text}&rdquo;
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '12px', borderTop: '1px solid var(--glass-border)' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), #8b1a25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: '800', color: 'white', flexShrink: 0 }}>
                      {r.author.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-main)' }}>{r.author}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--primary)', fontWeight: '600' }}>{r.dept} · AU</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* MEETUP SAFETY COVENANTS */}
          <section className="glass-card" style={{ marginTop: '80px', padding: '40px', background: '#f8fafc', borderLeft: '6px solid var(--primary)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', marginBottom: '15px' }}>
                <ShieldAlert size={28} />
                <span style={{ fontWeight: '700', fontSize: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Safety Covenant</span>
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '20px', color: '#233559' }}>Recommended Campus Meetup Zones</h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '20px' }}>
                For maximum safety, always arrange to meet buyers/sellers on-campus during daylight hours.
                Never transfer money online before verifying the item condition in person.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'col', gap: '15px', justifyContent: 'center' }}>
              {[
                { title: "📚 Central Library Lobby", desc: "Monitored, safe indoor space (Block-A)" },
                { title: "☕ Block-D Cafeteria", desc: "Highly populated open social space" },
                { title: "🌳 Administrative Plaza", desc: "Central location with campus security presence" }
              ].map((zone, i) => (
                <div key={i} style={{ display: 'flex', gap: '15px', padding: '15px', background: 'white', borderRadius: '8px', border: '1px solid var(--glass-border)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', marginBottom: '10px' }}>
                  <MapPin style={{ color: 'var(--secondary)', flexShrink: 0 }} />
                  <div>
                    <h4 style={{ fontWeight: '700', color: 'var(--text-main)', marginBottom: '3px' }}>{zone.title}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{zone.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>{/* end page container */}

        {/* FOOTER */}
        <footer style={{ marginTop: '100px', background: '#262F4B url("https://images.unsplash.com/photo-1529429617-4e4e6c2a5d3b?w=1920") center/cover no-repeat', color: '#ffffff', display: 'flex', flexDirection: 'column', fontFamily: "'Outfit', sans-serif", width: '100%' }}>
          <div style={{ padding: '60px 40px 40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <div>
              <img src="https://cdn.sanity.io/images/v1rb7aqk/production/358a0b743e7fbbd8be475f4dca39d275afe10fa5-352x76.png?q=70&auto=format&w=640" alt="Campus Resell" style={{ width: '180px', objectFit: 'contain', marginBottom: '20px', filter: 'brightness(0) invert(1)' }} />
              <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.6' }}>Empowering students to trade, reuse, and save. Join the Campus Resell community today!</p>
            </div>
            <div>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '20px', fontWeight: '600', borderBottom: '2px solid var(--primary)', paddingBottom: '8px', display: 'inline-block' }}>Explore</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li><a href="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>Home</a></li>
                <li><a href="/marketplace" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>Marketplace</a></li>
                <li><a href="/sell" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>Sell an Item</a></li>
                <li><Link to="/contact" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '20px', fontWeight: '600', borderBottom: '2px solid var(--primary)', paddingBottom: '8px', display: 'inline-block' }}>About</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li><Link to="/story" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>Our Story</Link></li>
                <li><Link to="/team" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>Team</Link></li>
                <li><Link to="/faq" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '20px', fontWeight: '600', borderBottom: '2px solid var(--primary)', paddingBottom: '8px', display: 'inline-block' }}>Contact</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', color: '#94a3b8', fontSize: '0.9rem' }}>
                <li>📞 Toll Free: 1800-RES-SELL</li>
                <li>✉️ support@campusresell.com</li>
                <li>📍 123 Campus Avenue, Hyderabad, India</li>
              </ul>
            </div>
          </div>
          <div style={{ background: '#C02535', padding: '20px 40px', fontSize: '0.85rem', color: '#EBBBC0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
            <span>© {new Date().getFullYear()} Campus Resell. All rights reserved.</span>
            <span>Designed for the Student Resell Community.</span>
          </div>
        </footer>

      </div>

      {/* ===== FLOATING REVIEWS TICKER ===== */}
      <div style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        zIndex: 9999,
        background: '#ffffff',
        borderTop: '2px solid var(--glass-border)',
        height: '42px',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        boxShadow: '0 -2px 16px rgba(0,0,0,0.07)',
      }}>
        {/* Left accent bar */}
        <div style={{ width: '5px', height: '100%', background: 'var(--primary)', flexShrink: 0 }} />
        {/* Fade left */}
        <div style={{ position: 'absolute', left: '5px', top: 0, bottom: 0, width: '60px', background: 'linear-gradient(to right, #fff, transparent)', zIndex: 2, pointerEvents: 'none' }} />
        {/* Fade right */}
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '60px', background: 'linear-gradient(to left, #fff, transparent)', zIndex: 2, pointerEvents: 'none' }} />

        <div className="home-marquee-track">
          {[...REVIEWS, ...REVIEWS].map((r, i) => (
            <span key={i} className="home-review-chip">
              <StarRating rating={r.rating} size={12} />
              <span style={{ color: 'var(--text-main)', fontWeight: '600', fontSize: '0.8rem' }}>&ldquo;{r.text}&rdquo;</span>
              <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.75rem' }}>&mdash; {r.author}</span>
            </span>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
