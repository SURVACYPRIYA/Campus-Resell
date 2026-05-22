import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Loader2, Mail, Lock, LogIn } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/marketplace');
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || err.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

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
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(193,38,50,0.08) 0%, transparent 70%)',
        top: '10%',
        left: '10%',
        animation: 'pulse 4s ease-in-out infinite',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(193,38,50,0.05) 0%, transparent 70%)',
        bottom: '15%',
        right: '15%',
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
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
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
              <LogIn size={26} color="#fff" />
            </div>
            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: '800',
              color: 'var(--text-main)',
              margin: '0 0 6px',
              letterSpacing: '-0.02em'
            }}>Welcome Back</h2>
            <p style={{
              color: 'var(--text-muted)',
              fontSize: '0.92rem',
              margin: 0,
              lineHeight: 1.5
            }}>Sign in to your ResellPortal account</p>
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
            {/* Email */}
            <div style={{ marginBottom: '20px' }}>
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
            <div style={{ marginBottom: '28px' }}>
              <label style={labelStyle}>
                Password <span style={asteriskStyle}>*</span>
              </label>
              <div style={inputWrapperStyle('password')}>
                <span style={iconStyle}><Lock size={18} /></span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
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
              {isLoading ? <><Loader2 size={18} className="animate-spin" /> Signing in...</> : 'Sign In'}
            </button>
          </form>

          {/* Register link */}
          <p style={{
            marginTop: '24px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.9rem'
          }}>
            Don't have an account?{' '}
            <Link to="/register" style={{
              color: 'var(--primary)',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'opacity 0.2s'
            }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >Register</Link>
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
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  setIsLoading(true);
                  setError('');
                  await googleLogin(credentialResponse.credential);
                  navigate('/marketplace');
                } catch (err) {
                  console.error("Google Login error:", err);
                  setError(err.response?.data?.message || err.message || 'Google login failed');
                } finally {
                  setIsLoading(false);
                }
              }}
              onError={() => {
                setError('Google login failed');
              }}
            />
          </div>
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

export default Login;
