export default function Skeleton({ width = '100%', height = '20px', circle = false, style = {} }) {
  const computedStyle = {
    width: circle ? height : width,
    height,
    borderRadius: circle ? '50%' : 'var(--radius-sm)',
    flexShrink: 0,
    ...style,
  };

  return (
    <div
      className="skeleton-shimmer"
      style={computedStyle}
      aria-hidden="true"
      role="presentation"
    />
  );
}
