import Card from './Card';

export default function StatCard({ icon, label, value, meta, accent = 'hsl(var(--primary))' }) {
  return (
    <Card hover style={{ padding: 20, position: 'relative', overflow: 'hidden' }}>
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '0 auto auto 0',
          width: '100%',
          height: 3,
          background: accent,
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ color: 'hsl(var(--text-muted))', fontSize: 12, fontWeight: 750, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {label}
          </div>
          <div style={{ color: 'hsl(var(--text-main))', fontSize: 28, fontWeight: 850, lineHeight: 1.1, marginTop: 8 }}>
            {value}
          </div>
          {meta && (
            <div style={{ color: 'hsl(var(--text-muted))', fontSize: 13, fontWeight: 600, marginTop: 4 }}>
              {meta}
            </div>
          )}
        </div>
        {icon && (
          <div
            aria-hidden="true"
            style={{
              width: 42,
              height: 42,
              borderRadius: 'var(--radius-sm)',
              display: 'grid',
              placeItems: 'center',
              background: 'hsl(var(--bg-hover))',
              color: accent,
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
