import { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { QrCode, Shield, Phone, Mail, Droplets } from 'lucide-react';

// Seeded pseudo-random for deterministic QR pattern
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export default function DigitalId() {
  const { user } = useApp();
  const [flipped, setFlipped] = useState(false);

  const initials = user?.displayName
    ? user.displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const qrPattern = useMemo(() => {
    const rand = seededRandom(42);
    const grid = [];
    for (let i = 0; i < 64; i++) {
      // Edges and corners are always dark (like real QR)
      const row = Math.floor(i / 8);
      const col = i % 8;
      const isCorner = (row < 2 && col < 2) || (row < 2 && col > 5) || (row > 5 && col < 2);
      grid.push(isCorner || rand() > 0.5);
    }
    return grid;
  }, []);

  const barcodeWidths = useMemo(() => {
    const rand = seededRandom(99);
    const widths = [];
    for (let i = 0; i < 40; i++) {
      widths.push(rand() > 0.5 ? 2 : 1);
    }
    return widths;
  }, []);

  const cardStyle = {
    width: '100%',
    maxWidth: 380,
    aspectRatio: '1.586',
    perspective: '1000px',
    cursor: 'pointer',
    margin: '0 auto',
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
  };

  const innerStyle = {
    width: '100%',
    height: '100%',
    position: 'relative',
    transformStyle: 'preserve-3d',
    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
  };

  const faceBase = {
    position: 'absolute',
    top: 0, left: 0, width: '100%', height: '100%',
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.1)',
  };

  // ─── FRONT ───
  const frontFace = (
    <div style={{
      ...faceBase,
      background: 'hsl(var(--bg-card))',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Gradient header */}
      <div style={{
        background: 'linear-gradient(135deg, hsl(152 60% 40%), hsl(170 55% 42%))',
        padding: '16px 20px 28px',
        position: 'relative',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{
            fontSize: 13, fontWeight: 800, letterSpacing: '0.08em',
            color: 'rgba(255,255,255,0.95)', textTransform: 'uppercase',
          }}>
            Campus Connect
          </span>
          <Shield size={18} style={{ color: 'rgba(255,255,255,0.7)' }} />
        </div>

        {/* Holographic strip */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0, height: 6,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2) 20%, rgba(255,255,255,0.4) 40%, rgba(255,255,255,0.1) 60%, rgba(255,255,255,0.3) 80%, transparent)',
          animation: 'holoShift 3s linear infinite',
        }} />
      </div>

      {/* Avatar overlapping header */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        marginTop: -24, position: 'relative', zIndex: 2,
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'linear-gradient(135deg, hsl(152 60% 45%), hsl(170 55% 50%))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 22, fontWeight: 800,
          border: '3px solid hsl(var(--bg-card))',
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        }}>
          {initials}
        </div>
      </div>

      {/* Info section */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', padding: '8px 20px 0',
        position: 'relative',
      }}>
        {/* Radial gradient overlay for depth */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 30% 20%, hsl(var(--primary) / 0.03) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          fontSize: 18, fontWeight: 800, color: 'hsl(var(--text-main))',
          letterSpacing: '-0.02em', textAlign: 'center',
        }}>
          {user?.displayName || 'Student Name'}
        </div>

        <div style={{
          fontSize: 12, color: 'hsl(var(--text-muted))',
          marginTop: 2, textTransform: 'capitalize',
        }}>
          {user?.role || 'Student'} • {user?.department || 'Computer Science'}
        </div>

        {/* Details grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: '6px 16px', marginTop: 12, width: '100%',
          fontSize: 11, maxWidth: 280,
        }}>
          {[
            { label: 'Roll No', value: user?.uid?.slice(-6)?.toUpperCase() || 'CS2024' },
            { label: 'Semester', value: '6th' },
            { label: 'Blood Group', value: 'O+' },
            { label: 'Phone', value: '+91 98XXX XXXXX' },
          ].map(item => (
            <div key={item.label} style={{
              display: 'flex', flexDirection: 'column', gap: 1,
            }}>
              <span style={{ color: 'hsl(var(--text-muted))', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {item.label}
              </span>
              <span style={{ color: 'hsl(var(--text-main))', fontWeight: 600, fontSize: 12 }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        background: 'hsl(var(--bg-hover))',
        padding: '8px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderTop: '1px solid hsl(var(--border-light))',
        flexShrink: 0,
      }}>
        <span style={{
          fontSize: 9, fontWeight: 700, letterSpacing: '0.1em',
          color: 'hsl(var(--text-muted))', textTransform: 'uppercase',
        }}>
          Valid Through Spring 2026
        </span>
      </div>

      {/* Holographic animated overlay */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 16,
        background: 'linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.03) 50%, transparent 70%)',
        pointerEvents: 'none',
      }} />
    </div>
  );

  // ─── BACK ───
  const backFace = (
    <div style={{
      ...faceBase,
      transform: 'rotateY(180deg)',
      background: 'hsl(var(--bg-card))',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      {/* Header stripe */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 8,
        background: 'linear-gradient(135deg, hsl(152 60% 40%), hsl(170 55% 42%))',
      }} />

      {/* QR Code */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 10,
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(8, 1fr)',
          gap: 2,
          padding: 12,
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        }}>
          {qrPattern.map((dark, i) => (
            <div
              key={i}
              style={{
                width: 12, height: 12,
                borderRadius: 2,
                background: dark ? '#1a1a2e' : '#f0f0f0',
              }}
            />
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <QrCode size={14} style={{ color: 'hsl(var(--text-muted))' }} />
          <span style={{
            fontSize: 11, fontWeight: 600, color: 'hsl(var(--text-muted))',
            letterSpacing: '0.03em',
          }}>
            Scan for verification
          </span>
        </div>
      </div>

      {/* Emergency Contact */}
      <div style={{
        marginTop: 16, padding: '10px 16px',
        background: 'hsl(var(--bg-hover))',
        borderRadius: 10, width: '100%', maxWidth: 240,
      }}>
        <div style={{
          fontSize: 9, fontWeight: 700, letterSpacing: '0.08em',
          color: 'hsl(var(--text-muted))', textTransform: 'uppercase',
          marginBottom: 6,
        }}>
          Emergency Contact
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
          <Phone size={11} style={{ color: 'hsl(var(--text-muted))' }} />
          <span style={{ fontSize: 11, color: 'hsl(var(--text-main))', fontWeight: 500 }}>
            +91 98765 43210
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Mail size={11} style={{ color: 'hsl(var(--text-muted))' }} />
          <span style={{ fontSize: 11, color: 'hsl(var(--text-main))', fontWeight: 500 }}>
            campus@university.edu
          </span>
        </div>
      </div>

      {/* Barcode */}
      <div style={{
        marginTop: 14,
        display: 'flex', alignItems: 'flex-end', gap: 1,
        height: 28, justifyContent: 'center',
      }}>
        {barcodeWidths.map((w, i) => (
          <div
            key={i}
            style={{
              width: w,
              height: i % 3 === 0 ? 28 : i % 2 === 0 ? 22 : 25,
              background: i % 2 === 0 ? 'hsl(var(--text-main))' : 'transparent',
              borderRadius: 0.5,
            }}
          />
        ))}
      </div>

      <div style={{
        fontSize: 9, color: 'hsl(var(--text-muted))', marginTop: 6,
        fontWeight: 600, letterSpacing: '0.15em', fontFamily: 'monospace',
      }}>
        {user?.uid?.toUpperCase() || 'DEMO-STUDENT'}
      </div>

      {/* Bottom stripe */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 8,
        background: 'linear-gradient(135deg, hsl(152 60% 40%), hsl(170 55% 42%))',
      }} />
    </div>
  );

  return (
    <>
      {/* Keyframe animation for holographic effect */}
      <style>{`
        @keyframes holoShift {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      <div
        style={cardStyle}
        onClick={() => setFlipped(f => !f)}
        role="button"
        tabIndex={0}
        aria-label={flipped ? 'Flip to front of ID card' : 'Flip to back of ID card'}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFlipped(f => !f); } }}
      >
        <div style={innerStyle}>
          {frontFace}
          {backFace}
        </div>
      </div>
    </>
  );
}
