import { useState, useEffect } from 'react';
import { Eye, EyeOff, ArrowLeft, GraduationCap, BookOpen, Shield, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

const roles = [
  { id: 'student', label: 'Student', icon: GraduationCap },
  { id: 'faculty', label: 'Faculty', icon: BookOpen },
  { id: 'admin', label: 'Admin', icon: Shield },
];

const stats = [
  { value: '94%', label: 'Avg Attendance', color: 'hsl(152 60% 54%)' },
  { value: '12', label: 'Notifications', color: 'hsl(38 92% 60%)' },
  { value: '3', label: 'Pending Tasks', color: 'hsl(340 65% 60%)' },
  { value: '8', label: 'Departments', color: 'hsl(210 80% 60%)' },
];

export default function AuthPage({ onLogin, theme = 'light' }) {
  const [mode, setMode] = useState('login'); // login | signup | reset
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 860);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    setError('');
    setSuccess('');
  }, [mode]);

  const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (mode !== 'reset' && (!password || password.length < 6)) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (mode === 'signup' && !name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setLoading(false);

    if (mode === 'reset') {
      setSuccess('Password reset link sent to your email!');
      return;
    }

    onLogin?.({
      uid: 'demo-' + role,
      email,
      displayName: name || email.split('@')[0],
      role,
      department: 'Computer Science',
      avatar: null,
    });
  };

  const isDark = theme === 'dark';

  // ─── CSS Variables with fallbacks ───
  const v = {
    bgCard: isDark ? 'hsl(224 30% 12%)' : 'hsl(0 0% 100%)',
    bgHover: isDark ? 'hsl(224 25% 16%)' : 'hsl(220 20% 96%)',
    textMain: isDark ? 'hsl(210 20% 92%)' : 'hsl(222 47% 11%)',
    textMuted: isDark ? 'hsl(215 15% 55%)' : 'hsl(215 16% 47%)',
    primary: 'hsl(152 60% 42%)',
    primaryHover: 'hsl(152 60% 36%)',
    primaryGlow: isDark ? 'hsl(152 60% 20% / 0.2)' : 'hsl(152 60% 42% / 0.1)',
    border: isDark ? 'hsl(220 15% 22%)' : 'hsl(220 13% 91%)',
    danger: 'hsl(0 72% 51%)',
    success: 'hsl(152 60% 42%)',
    radius: '12px',
  };

  // ─── LEFT PANEL ───
  const leftPanel = (
    <div style={{
      width: isMobile ? '100%' : '45%',
      minHeight: isMobile ? 280 : '100vh',
      background: 'linear-gradient(170deg, hsl(222 47% 6%) 0%, hsl(224 40% 12%) 60%, hsl(230 35% 14%) 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: isMobile ? '40px 24px 32px' : '48px 48px 40px',
      position: 'relative',
      overflow: 'hidden',
      flexShrink: 0,
    }}>
      {/* Animated gradient mesh */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 50% at 20% 40%, hsl(152 60% 30% / 0.08) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 20%, hsl(210 80% 50% / 0.05) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 50% 80%, hsl(270 60% 50% / 0.04) 0%, transparent 60%)',
        animation: 'meshFloat 12s ease-in-out infinite alternate',
        pointerEvents: 'none',
      }} />

      {/* Floating decorative circles */}
      <div style={{
        position: 'absolute', top: '15%', right: '10%',
        width: 180, height: 180, borderRadius: '50%',
        background: 'radial-gradient(circle, hsl(152 60% 50% / 0.06) 0%, transparent 70%)',
        animation: 'blobFloat 8s ease-in-out infinite alternate',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '20%', left: '5%',
        width: 120, height: 120, borderRadius: '50%',
        background: 'radial-gradient(circle, hsl(210 80% 60% / 0.05) 0%, transparent 70%)',
        animation: 'blobFloat 10s ease-in-out infinite alternate-reverse',
        pointerEvents: 'none',
      }} />

      {/* Brand */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <GraduationCap size={28} style={{ color: 'hsl(152 60% 54%)' }} />
          <span style={{
            fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', color: '#fff',
          }}>
            Campus<span style={{ color: 'hsl(152 60% 54%)' }}>Connect</span>
          </span>
        </div>
      </div>

      {/* Hero text */}
      {!isMobile && (
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{
            fontSize: 'clamp(32px, 3.5vw, 48px)',
            fontWeight: 800,
            letterSpacing: '-0.06em',
            lineHeight: 0.95,
            color: '#fff',
            margin: '0 0 16px',
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          }}>
            Your entire<br />campus,<br />
            <span style={{ color: 'hsl(152 60% 54%)' }}>one tap away.</span>
          </h1>
          <p style={{
            fontSize: 15, lineHeight: 1.6,
            color: 'rgba(255,255,255,0.45)',
            maxWidth: 340,
          }}>
            A unified platform for attendance, grades, payments, and campus communication — designed for the modern university.
          </p>
        </div>
      )}

      {/* Stat tiles */}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 10,
        marginTop: isMobile ? 20 : 0,
      }}>
        {stats.map(stat => (
          <div key={stat.label} style={{
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 14,
            padding: isMobile ? '12px 14px' : '16px 18px',
            display: 'flex', flexDirection: 'column', gap: 4,
          }}>
            <span style={{
              fontSize: isMobile ? 22 : 26, fontWeight: 800,
              color: stat.color, letterSpacing: '-0.03em',
            }}>
              {stat.value}
            </span>
            <span style={{
              fontSize: 11, fontWeight: 500,
              color: 'rgba(255,255,255,0.45)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}>
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  // ─── RIGHT PANEL ───
  const rightPanel = (
    <div style={{
      flex: 1,
      minHeight: isMobile ? 'auto' : '100vh',
      background: v.bgCard,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isMobile ? '32px 20px 48px' : '40px',
      overflow: 'auto',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 420,
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.6s cubic-bezier(0.4,0,0.2,1), transform 0.6s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {/* Mode tabs */}
        <div style={{
          display: 'flex', gap: 0,
          background: v.bgHover,
          borderRadius: 10, padding: 3, marginBottom: 28,
        }}>
          {[
            { id: 'login', label: 'Sign In' },
            { id: 'signup', label: 'Sign Up' },
            { id: 'reset', label: 'Reset' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setMode(tab.id)}
              style={{
                flex: 1, padding: '10px 0',
                fontSize: 13, fontWeight: mode === tab.id ? 700 : 500,
                border: 'none', cursor: 'pointer',
                borderRadius: 8,
                background: mode === tab.id ? v.bgCard : 'transparent',
                color: mode === tab.id ? v.textMain : v.textMuted,
                boxShadow: mode === tab.id ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.2s ease',
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Title */}
        <h2 style={{
          fontSize: 28, fontWeight: 800,
          letterSpacing: '-0.04em',
          color: v.textMain, margin: '0 0 6px',
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        }}>
          {mode === 'login' && 'Sign in'}
          {mode === 'signup' && 'Create account'}
          {mode === 'reset' && 'Reset password'}
        </h2>
        <p style={{
          fontSize: 14, color: v.textMuted,
          margin: '0 0 24px', lineHeight: 1.5,
        }}>
          {mode === 'login' && 'Welcome back! Enter your credentials to continue.'}
          {mode === 'signup' && 'Join your campus community in seconds.'}
          {mode === 'reset' && "Enter your email and we'll send a reset link."}
        </p>

        {/* Error / Success */}
        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 16px', marginBottom: 16,
            borderRadius: 10,
            background: 'hsl(0 72% 51% / 0.08)',
            border: '1px solid hsl(0 72% 51% / 0.15)',
            color: v.danger, fontSize: 13, fontWeight: 500,
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 16px', marginBottom: 16,
            borderRadius: 10,
            background: 'hsl(152 60% 42% / 0.08)',
            border: '1px solid hsl(152 60% 42% / 0.15)',
            color: v.success, fontSize: 13, fontWeight: 500,
          }}>
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <span>{success}</span>
          </div>
        )}

        {/* Role selector */}
        {mode !== 'reset' && (
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: 'block', fontSize: 13, fontWeight: 600,
              color: v.textMuted, marginBottom: 8,
            }}>
              I am a
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              {roles.map(r => {
                const Icon = r.icon;
                const selected = role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    style={{
                      flex: 1, padding: '12px 8px',
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', gap: 6,
                      border: selected ? '1.5px solid hsl(152 60% 42%)' : `1.5px solid ${v.border}`,
                      borderRadius: 12, cursor: 'pointer',
                      background: selected ? v.primaryGlow : 'transparent',
                      color: selected ? v.primary : v.textMuted,
                      transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                      boxShadow: selected ? '0 0 0 3px hsl(152 60% 42% / 0.1)' : 'none',
                      transform: selected ? 'translateY(-1px)' : 'translateY(0)',
                    }}
                  >
                    <Icon size={20} />
                    <span style={{ fontSize: 12, fontWeight: selected ? 700 : 500 }}>{r.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Name (signup only) */}
          {mode === 'signup' && (
            <div>
              <label htmlFor="auth-name" style={{
                display: 'block', fontSize: 13, fontWeight: 600,
                color: v.textMuted, marginBottom: 6,
              }}>
                Full Name
              </label>
              <input
                id="auth-name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your full name"
                autoComplete="name"
                style={{
                  width: '100%', height: 46,
                  border: `1.5px solid ${v.border}`,
                  borderRadius: 10, padding: '0 16px',
                  fontSize: 14, color: v.textMain,
                  background: 'transparent',
                  outline: 'none',
                  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                  boxSizing: 'border-box',
                }}
                onFocus={e => {
                  e.target.style.borderColor = 'hsl(152 60% 42%)';
                  e.target.style.boxShadow = '0 0 0 3px hsl(152 60% 42% / 0.1)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = v.border;
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="auth-email" style={{
              display: 'block', fontSize: 13, fontWeight: 600,
              color: v.textMuted, marginBottom: 6,
            }}>
              Email Address
            </label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@university.edu"
              autoComplete="email"
              style={{
                width: '100%', height: 46,
                border: `1.5px solid ${v.border}`,
                borderRadius: 10, padding: '0 16px',
                fontSize: 14, color: v.textMain,
                background: 'transparent',
                outline: 'none',
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                boxSizing: 'border-box',
              }}
              onFocus={e => {
                e.target.style.borderColor = 'hsl(152 60% 42%)';
                e.target.style.boxShadow = '0 0 0 3px hsl(152 60% 42% / 0.1)';
              }}
              onBlur={e => {
                e.target.style.borderColor = v.border;
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Password */}
          {mode !== 'reset' && (
            <div>
              <label htmlFor="auth-password" style={{
                display: 'block', fontSize: 13, fontWeight: 600,
                color: v.textMuted, marginBottom: 6,
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  style={{
                    width: '100%', height: 46,
                    border: `1.5px solid ${v.border}`,
                    borderRadius: 10, padding: '0 48px 0 16px',
                    fontSize: 14, color: v.textMain,
                    background: 'transparent',
                    outline: 'none',
                    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = 'hsl(152 60% 42%)';
                    e.target.style.boxShadow = '0 0 0 3px hsl(152 60% 42% / 0.1)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = v.border;
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute', right: 4, top: '50%',
                    transform: 'translateY(-50%)',
                    width: 36, height: 36, borderRadius: 8,
                    border: 'none', background: 'transparent',
                    cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    color: v.textMuted,
                    transition: 'color 0.2s ease',
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Forgot password (login mode) */}
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => setMode('reset')}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 13, color: v.primary, fontWeight: 600,
                    marginTop: 8, padding: 0,
                    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                  }}
                >
                  Forgot password?
                </button>
              )}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', height: 48,
              background: loading ? v.primaryHover : v.primary,
              color: '#fff', border: 'none',
              borderRadius: 10, fontSize: 15, fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              transition: 'all 0.2s ease',
              marginTop: 4,
              opacity: loading ? 0.85 : 1,
              boxShadow: '0 4px 14px hsl(152 60% 42% / 0.25)',
            }}
          >
            {loading && (
              <span style={{
                width: 18, height: 18, borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: '#fff',
                animation: 'authSpin 0.6s linear infinite',
                flexShrink: 0,
              }} />
            )}
            {mode === 'login' && (loading ? 'Signing in...' : 'Sign In')}
            {mode === 'signup' && (loading ? 'Creating account...' : 'Create Account')}
            {mode === 'reset' && (loading ? 'Sending...' : 'Send Reset Link')}
          </button>
        </form>

        {/* Switch modes */}
        {mode !== 'reset' && (
          <p style={{
            textAlign: 'center', marginTop: 24,
            fontSize: 13, color: v.textMuted,
          }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: v.primary, fontWeight: 700, fontSize: 13,
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                padding: 0,
              }}
            >
              {mode === 'login' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        )}

        {mode === 'reset' && (
          <button
            type="button"
            onClick={() => setMode('login')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              justifyContent: 'center', width: '100%',
              marginTop: 20, background: 'none', border: 'none',
              cursor: 'pointer', color: v.textMuted,
              fontSize: 13, fontWeight: 500,
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            }}
          >
            <ArrowLeft size={14} />
            Back to Sign In
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes authSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes meshFloat {
          0% { opacity: 0.7; transform: scale(1); }
          100% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes blobFloat {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(15px, -20px) scale(1.15); }
        }
      `}</style>

      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        minHeight: '100vh',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        background: v.bgCard,
      }}>
        {leftPanel}
        {rightPanel}
      </div>
    </>
  );
}
