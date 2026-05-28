import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Lock, Loader2, KeyRound, EyeOff, Eye } from 'lucide-react';
import axios from '../axios';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');
  const [focusedField, setFocusedField] = useState('');

  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');
    
    if (password !== confirmPassword) {
      setStatus('error');
      setMessage('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setStatus('error');
      setMessage('Password must be at least 6 characters.');
      return;
    }

    try {
      await axios.post(`/api/auth/reset-password/${token}`, { password });
      setStatus('success');
      setMessage('Your password has been successfully reset.');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (err) {
      console.error("Reset password error:", err);
      setStatus('error');
      setMessage(err.response?.data?.message || err.message || 'Failed to reset password');
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
              <KeyRound size={26} color="#fff" />
            </div>
            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: '800',
              color: 'var(--text-main)',
              margin: '0 0 6px',
              letterSpacing: '-0.02em'
            }}>Reset Password</h2>
            <p style={{
              color: 'var(--text-muted)',
              fontSize: '0.92rem',
              margin: 0,
              lineHeight: 1.5
            }}>Enter your new password below.</p>
          </div>

          {/* Status Messages */}
          {status === 'error' && (
            <div className="animate-fade-in" style={{
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
              {message}
            </div>
          )}
          
          {status === 'success' && (
            <div className="animate-fade-in" style={{
              color: '#16a34a',
              marginBottom: '20px',
              textAlign: 'center',
              background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
              padding: '16px',
              borderRadius: '12px',
              fontSize: '0.9rem',
              fontWeight: '600',
              border: '1px solid #bbf7d0',
              lineHeight: 1.5
            }}>
              {message}
              <p style={{ fontSize: '0.8rem', marginTop: '10px', color: '#15803d' }}>Redirecting to login...</p>
            </div>
          )}

          {status !== 'success' && (
            <form onSubmit={handleSubmit}>
                {/* New Password */}
                <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>
                    New Password <span style={asteriskStyle}>*</span>
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
                    disabled={status === 'loading'}
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

                {/* Confirm Password */}
                <div style={{ marginBottom: '28px' }}>
                <label style={labelStyle}>
                    Confirm Password <span style={asteriskStyle}>*</span>
                </label>
                <div style={inputWrapperStyle('confirm')}>
                    <span style={iconStyle}><Lock size={18} /></span>
                    <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onFocus={() => setFocusedField('confirm')}
                    onBlur={() => setFocusedField('')}
                    required
                    disabled={status === 'loading'}
                    style={{ ...inputStyle, paddingRight: '48px' }}
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                </div>

                {/* Submit */}
                <button
                type="submit"
                disabled={status === 'loading'}
                style={{
                    width: '100%',
                    padding: '14px',
                    background: status === 'loading' ? '#d1636d' : 'linear-gradient(135deg, #C12632, #d43f4b)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '14px',
                    fontSize: '1rem',
                    fontWeight: '700',
                    cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 4px 16px rgba(193, 38, 50, 0.3)',
                    letterSpacing: '0.02em'
                }}
                onMouseEnter={(e) => {
                    if (status !== 'loading') {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 6px 24px rgba(193, 38, 50, 0.4)';
                    }
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(193, 38, 50, 0.3)';
                }}
                >
                {status === 'loading' ? <><Loader2 size={18} className="animate-spin" /> Resetting...</> : 'Reset Password'}
                </button>
            </form>
          )}

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

export default ResetPassword;
