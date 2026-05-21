import Skeleton from '../ui/Skeleton';

export default function RouteFallback() {
  return (
    <div className="page-transition" style={{ display: 'grid', gap: 16 }}>
      <div className="grid-4">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} style={{ padding: 20, border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)', background: 'hsl(var(--bg-card))' }}>
            <Skeleton width="42%" height="12px" />
            <Skeleton width="70%" height="28px" style={{ marginTop: 14 }} />
            <Skeleton width="55%" height="12px" style={{ marginTop: 10 }} />
          </div>
        ))}
      </div>
      <Skeleton height="360px" style={{ borderRadius: 'var(--radius)' }} />
    </div>
  );
}
