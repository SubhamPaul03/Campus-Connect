import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

const backdropStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.5)',
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '16px',
  animation: 'modalFadeIn 0.2s ease-out',
};

const contentBaseStyle = {
  background: 'hsl(var(--bg-card))',
  borderRadius: 'var(--radius-lg)',
  width: 'calc(100% - 32px)',
  maxHeight: '85vh',
  overflowY: 'auto',
  boxShadow: 'var(--shadow-lg)',
  border: '1px solid hsl(var(--border))',
  animation: 'modalScaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
  position: 'relative',
};

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '20px 24px',
  borderBottom: '1px solid hsl(var(--border))',
};

const titleStyle = {
  fontSize: '18px',
  fontWeight: 750,
  color: 'hsl(var(--text-main))',
  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
  margin: 0,
  lineHeight: 1.3,
};

const bodyStyle = {
  padding: '24px',
};

const animationCSS = `
@keyframes modalFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes modalScaleIn {
  from { opacity: 0; transform: scale(0.95) translateY(8px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
`;

let modalStyleInjected = false;
function injectModalStyles() {
  if (modalStyleInjected || typeof document === 'undefined') return;
  const style = document.createElement('style');
  style.textContent = animationCSS;
  document.head.appendChild(style);
  modalStyleInjected = true;
}

export default function Modal({ open, onClose, title, children, maxWidth = 520 }) {
  const contentRef = useRef(null);

  useEffect(() => {
    injectModalStyles();
  }, []);

  // Escape key to close
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Focus trap - focus the content on open
  useEffect(() => {
    if (open && contentRef.current) {
      contentRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div
      style={backdropStyle}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={contentRef}
        style={{ ...contentBaseStyle, maxWidth: `${maxWidth}px` }}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={headerStyle}>
          <h3 id="modal-title" style={titleStyle}>{title}</h3>
          <Button
            variant="ghost"
            size="sm"
            icon={<X size={18} />}
            onClick={onClose}
            aria-label="Close modal"
            style={{ padding: '0', width: '34px', minWidth: '34px', border: 'none' }}
          />
        </div>
        <div style={bodyStyle}>
          {children}
        </div>
      </div>
    </div>
  );
}
