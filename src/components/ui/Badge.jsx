const variantMap = {
  due: { background: 'hsl(38 92% 50% / 0.12)', color: 'hsl(var(--warning))' },
  overdue: { background: 'hsl(38 92% 50% / 0.12)', color: 'hsl(var(--warning))' },
  paid: { background: 'hsl(152 56% 40% / 0.12)', color: 'hsl(var(--success))' },
  resolved: { background: 'hsl(152 56% 40% / 0.12)', color: 'hsl(var(--success))' },
  submitted: { background: 'hsl(152 56% 40% / 0.12)', color: 'hsl(var(--success))' },
  new: { background: 'hsl(217 91% 60% / 0.12)', color: 'hsl(var(--info))' },
  info: { background: 'hsl(217 91% 60% / 0.12)', color: 'hsl(var(--info))' },
  alert: { background: 'hsl(0 72% 51% / 0.12)', color: 'hsl(var(--danger))' },
  high: { background: 'hsl(0 72% 51% / 0.12)', color: 'hsl(var(--danger))' },
  open: { background: 'hsl(270 60% 55% / 0.12)', color: 'hsl(270 60% 55%)' },
  'in-progress': { background: 'hsl(270 60% 55% / 0.12)', color: 'hsl(270 60% 55%)' },
  pending: { background: 'hsl(270 60% 55% / 0.12)', color: 'hsl(270 60% 55%)' },
  read: { background: 'hsl(var(--bg-hover))', color: 'hsl(var(--text-muted))' },
  graded: { background: 'hsl(var(--bg-hover))', color: 'hsl(var(--text-muted))' },
  low: { background: 'hsl(var(--bg-hover))', color: 'hsl(var(--text-muted))' },
  default: { background: 'hsl(var(--bg-hover))', color: 'hsl(var(--text-muted))' },
};

const baseStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '24px',
  padding: '0 10px',
  borderRadius: 'var(--radius-full)',
  fontSize: '12px',
  fontWeight: 700,
  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
  whiteSpace: 'nowrap',
  textTransform: 'capitalize',
  letterSpacing: '0.02em',
  gap: '6px',
  lineHeight: 1,
};

const dotStyle = {
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  background: 'currentColor',
  flexShrink: 0,
};

export default function Badge({ variant = 'default', children, dot = false }) {
  const variantStyle = variantMap[variant] || variantMap.default;

  return (
    <span
      style={{ ...baseStyle, ...variantStyle }}
      aria-label={`Status: ${children}`}
    >
      {dot && <span style={dotStyle} aria-hidden="true" />}
      {children}
    </span>
  );
}
