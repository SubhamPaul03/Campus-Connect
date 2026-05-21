import { forwardRef } from 'react';

const baseStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  fontWeight: 650,
  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
  borderRadius: 'var(--radius-sm)',
  cursor: 'pointer',
  transition: 'var(--transition)',
  border: 'none',
  outline: 'none',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  userSelect: 'none',
  position: 'relative',
  letterSpacing: '0.01em',
};

const sizeStyles = {
  sm: { height: '34px', padding: '0 12px', fontSize: '13px' },
  md: { height: '40px', padding: '0 16px', fontSize: '14px' },
  lg: { height: '46px', padding: '0 20px', fontSize: '15px' },
};

const variantStyles = {
  primary: {
    background: 'hsl(var(--primary))',
    color: '#ffffff',
  },
  solid: {
    background: 'hsl(var(--text-main))',
    color: 'hsl(var(--text-inverse))',
  },
  ghost: {
    background: 'transparent',
    border: '1px solid hsl(var(--border))',
    color: 'hsl(var(--text-main))',
  },
  outline: {
    background: 'transparent',
    border: '1px solid hsl(var(--primary))',
    color: 'hsl(var(--primary))',
  },
  danger: {
    background: 'hsl(var(--danger))',
    color: '#ffffff',
  },
};

const hoverVariants = {
  primary: {
    background: 'hsl(var(--primary-hover))',
    boxShadow: '0 0 0 3px hsl(var(--primary-glow))',
  },
  solid: {
    opacity: 0.88,
  },
  ghost: {
    background: 'hsl(var(--bg-hover))',
  },
  outline: {
    background: 'hsl(var(--primary-glow))',
  },
  danger: {
    filter: 'brightness(1.1)',
  },
};

const disabledStyle = {
  opacity: 0.5,
  cursor: 'not-allowed',
  pointerEvents: 'none',
};

const spinnerKeyframes = `
@keyframes btn-spin {
  to { transform: rotate(360deg); }
}
`;

let styleInjected = false;
function injectSpinnerStyle() {
  if (styleInjected || typeof document === 'undefined') return;
  const style = document.createElement('style');
  style.textContent = spinnerKeyframes;
  document.head.appendChild(style);
  styleInjected = true;
}

const spinnerStyle = {
  width: '16px',
  height: '16px',
  border: '2px solid currentColor',
  borderTopColor: 'transparent',
  borderRadius: '50%',
  animation: 'btn-spin 0.6s linear infinite',
  flexShrink: 0,
};

const Button = forwardRef(({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  loading = false,
  fullWidth = false,
  disabled = false,
  className = '',
  style = {},
  onMouseEnter,
  onMouseLeave,
  ...props
}, ref) => {
  injectSpinnerStyle();

  const isDisabled = disabled || loading;

  const computedStyle = {
    ...baseStyle,
    ...sizeStyles[size] || sizeStyles.md,
    ...variantStyles[variant] || variantStyles.primary,
    ...(fullWidth ? { width: '100%' } : {}),
    ...(isDisabled ? disabledStyle : {}),
    ...style,
  };

  const handleMouseEnter = (e) => {
    if (!isDisabled) {
      const hoverStyle = hoverVariants[variant] || hoverVariants.primary;
      Object.assign(e.currentTarget.style, hoverStyle);
    }
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e) => {
    if (!isDisabled) {
      const vStyles = variantStyles[variant] || variantStyles.primary;
      e.currentTarget.style.background = vStyles.background;
      e.currentTarget.style.boxShadow = '';
      e.currentTarget.style.opacity = '';
      e.currentTarget.style.filter = '';
    }
    onMouseLeave?.(e);
  };

  return (
    <button
      ref={ref}
      className={className}
      style={computedStyle}
      disabled={isDisabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-busy={loading}
      aria-disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <span style={spinnerStyle} aria-hidden="true" />
      ) : icon ? (
        <span style={{ display: 'inline-flex', flexShrink: 0 }} aria-hidden="true">{icon}</span>
      ) : null}
      {children && <span>{children}</span>}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
