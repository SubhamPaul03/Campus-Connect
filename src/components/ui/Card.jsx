import { useState } from 'react';

const baseStyle = {
  background: 'hsl(var(--bg-card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: 'var(--radius)',
  transition: 'var(--transition)',
};

const glassStyle = {
  backdropFilter: 'blur(16px) saturate(180%)',
  WebkitBackdropFilter: 'blur(16px) saturate(180%)',
  background: 'hsl(var(--bg-card) / 0.7)',
  borderColor: 'hsl(var(--border-light) / 0.5)',
};

const hoverActiveStyle = {
  boxShadow: 'var(--shadow-lg)',
  transform: 'translateY(-2px)',
};

export default function Card({
  children,
  className = '',
  hover = false,
  glass = false,
  padding = true,
  style = {},
  onClick,
  ...props
}) {
  const [isHovered, setIsHovered] = useState(false);

  const computedStyle = {
    ...baseStyle,
    ...(padding ? { padding: '20px' } : {}),
    ...(glass ? glassStyle : {}),
    ...(onClick ? { cursor: 'pointer' } : {}),
    ...(hover && isHovered ? hoverActiveStyle : {}),
    ...style,
  };

  return (
    <div
      className={className}
      style={computedStyle}
      onClick={onClick}
      onMouseEnter={hover ? () => setIsHovered(true) : undefined}
      onMouseLeave={hover ? () => setIsHovered(false) : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? 'Interactive card' : undefined}
      {...props}
    >
      {children}
    </div>
  );
}
