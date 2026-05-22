import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Loader2, Mail, Lock, User, UserPlus } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [googleHovered, setGoogleHovered] = useState(false);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        setError('');
        await googleLogin(tokenResponse.access_token, true);
        navigate('/marketplace');
      } catch (err) {
        console.error('Google Login error:', err);
        setError(err.response?.data?.message || err.message || 'Google registration failed');
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => setError('Google registration failed'),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await register(name, email, password);
      navigate('/marketplace');
    } catch (err) {
      console.error("Register error:", err);
      setError(err.response?.data?.message || err.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    if (!password) return { level: 0, text: '', color: '' };
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { level: 1, text: 'Weak', color: '#ef4444' };
    if (score <= 2) return { level: 2, text: 'Fair', color: '#f59e0b' };
    if (score <= 3) return { level: 3, text: 'Good', color: '#3b82f6' };
    return { level: 4, text: 'Strong', color: '#22c55e' };
  };

  const strength = getPasswordStrength();

  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginBottom: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'var(--text-main)',
    letterSpacing: '0.02em'
  };

  const asteriskStyle = {
    color: '#ef4444',
    fontSize: '1rem',
    fontWeight: '700',
    lineHeight: 1
  };

  const inputWrapperStyle = (field) => ({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    border: `2px solid ${focusedField === field ? 'var(--primary)' : 'rgba(0,0,0,0.08)'}`,
    borderRadius: '14px',
    background: focusedField === field ? 'rgba(193, 38, 50, 0.02)' : 'rgba(255,255,255,0.7)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: focusedField === field ? '0 0 0 4px rgba(193, 38, 50, 0.08)' : '0 1px 3px rgba(0,0,0,0.04)',
    overflow: 'hidden'
  });

  const iconStyle = {
    padding: '0 0 0 16px',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0
  };

  const inputStyle = {
    border: 'none',
    outline: 'none',
    background: 'transparent',
    padding: '14px 16px',
    fontSize: '0.95rem',
    width: '100%',
    color: 'var(--text-main)',
    fontFamily: 'inherit'
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '85vh',
      padding: '20px',
      position: 'relative'
    }}>
      {/* Decorative background elements */}
      <div style={{
        position: 'absolute',
        width: '250px',
        height: '250px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(193,38,50,0.08) 0%, transparent 70%)',
        top: '5%',
        right: '10%',
        animation: 'pulse 4s ease-in-out infinite',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        width: '180px',
        height: '180px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(193,38,50,0.06) 0%, transparent 70%)',
        bottom: '10%',
        left: '12%',
        animation: 'pulse 5s ease-in-out infinite 1s',
        pointerEvents: 'none'
      }} />

      <div className="animate-fade-in" style={{
        width: '100%',
        maxWidth: '440px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(255,255,255,0.6)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)',
          padding: '48px 40px 40px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          {/* Top gradient accent bar */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #C12632, #e85d6a, #C12632)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 3s linear infinite'
          }} />

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #C12632, #e85d6a)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 8px 24px rgba(193, 38, 50, 0.25)'
            }}>
              <UserPlus size={26} color="#fff" />
            </div>
            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: '800',
              color: 'var(--text-main)',
              margin: '0 0 6px',
              letterSpacing: '-0.02em'
            }}>Create Account</h2>
            <p style={{
              color: 'var(--text-muted)',
              fontSize: '0.92rem',
              margin: 0,
              lineHeight: 1.5
            }}>Join the campus marketplace community</p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              color: '#dc2626',
              marginBottom: '20px',
              textAlign: 'center',
              background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
              padding: '12px 16px',
              borderRadius: '12px',
              fontSize: '0.88rem',
              fontWeight: '500',
              border: '1px solid #fecaca',
              animation: 'shake 0.4s ease-in-out'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>
                Full Name <span style={asteriskStyle}>*</span>
              </label>
              <div style={inputWrapperStyle('name')}>
                <span style={iconStyle}><User size={18} /></span>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField('')}
                  required
                  disabled={isLoading}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>
                College Email <span style={asteriskStyle}>*</span>
              </label>
              <div style={inputWrapperStyle('email')}>
                <span style={iconStyle}><Mail size={18} /></span>
                <input
                  type="email"
                  placeholder="student@univ.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('')}
                  required
                  disabled={isLoading}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '8px' }}>
              <label style={labelStyle}>
                Password <span style={asteriskStyle}>*</span>
              </label>
              <div style={inputWrapperStyle('password')}>
                <span style={iconStyle}><Lock size={18} /></span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('')}
                  required
                  disabled={isLoading}
                  style={{ ...inputStyle, paddingRight: '48px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px',
                    borderRadius: '8px',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Password strength bar */}
            {password && (
              <div style={{ marginBottom: '22px' }}>
                <div style={{
                  display: 'flex',
                  gap: '4px',
                  marginBottom: '6px'
                }}>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} style={{
                      flex: 1,
                      height: '4px',
                      borderRadius: '4px',
                      background: i <= strength.level ? strength.color : 'rgba(0,0,0,0.06)',
                      transition: 'all 0.3s ease'
                    }} />
                  ))}
                </div>
                <p style={{
                  fontSize: '0.78rem',
                  fontWeight: '600',
                  color: strength.color,
                  margin: 0,
                  textAlign: 'right'
                }}>{strength.text}</p>
              </div>
            )}

            {!password && <div style={{ marginBottom: '22px' }} />}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '14px',
                background: isLoading ? '#d1636d' : 'linear-gradient(135deg, #C12632, #d43f4b)',
                color: '#fff',
                border: 'none',
                borderRadius: '14px',
                fontSize: '1rem',
                fontWeight: '700',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 16px rgba(193, 38, 50, 0.3)',
                letterSpacing: '0.02em'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 24px rgba(193, 38, 50, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(193, 38, 50, 0.3)';
              }}
            >
              {isLoading ? <><Loader2 size={18} className="animate-spin" /> Creating account...</> : 'Create Account'}
            </button>
          </form>

          {/* Login link */}
          <p style={{
            marginTop: '24px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.9rem'
          }}>
            Already have an account?{' '}
            <Link to="/login" style={{
              color: 'var(--primary)',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'opacity 0.2s'
            }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >Sign In</Link>
          </p>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '24px 0'
          }}>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent)' }} />
            <span style={{
              padding: '0 16px',
              color: 'var(--text-muted)',
              fontSize: '0.82rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.08em'
            }}>or continue with</span>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent)' }} />
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={() => handleGoogleLogin()}
            disabled={isLoading}
            onMouseEnter={() => setGoogleHovered(true)}
            onMouseLeave={() => setGoogleHovered(false)}
            style={{
              width: '100%',
              padding: '13px 16px',
              background: googleHovered ? '#f5f5f5' : '#ffffff',
              color: '#3c4043',
              border: '1.5px solid #dadce0',
              borderRadius: '14px',
              fontSize: '0.97rem',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: googleHovered ? '0 4px 12px rgba(0,0,0,0.12)' : '0 1px 4px rgba(0,0,0,0.08)',
              transform: googleHovered ? 'translateY(-1px)' : 'translateY(0)',
              letterSpacing: '0.02em',
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </svg>
            Continue with Google
          </button>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

export default Register;
