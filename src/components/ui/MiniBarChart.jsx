export default function MiniBarChart({ data = [], height = 120 }) {
  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <div style={{ display: 'flex', alignItems: 'end', gap: 10, height }} aria-label="Bar chart">
      {data.map((item) => {
        const barHeight = `${Math.max((item.value / max) * 100, 8)}%`;
        return (
          <div key={item.label} style={{ flex: 1, minWidth: 0, display: 'grid', gap: 8, alignItems: 'end' }}>
            <div
              title={`${item.label}: ${item.value}`}
              style={{
                height: barHeight,
                borderRadius: '8px 8px 4px 4px',
                background: item.color || 'hsl(var(--primary))',
                boxShadow: 'inset 0 1px 0 hsl(0 0% 100% / 0.22)',
                transition: 'height 0.5s ease',
              }}
            />
            <span style={{ color: 'hsl(var(--text-muted))', fontSize: 11, fontWeight: 700, textAlign: 'center', whiteSpace: 'nowrap' }}>
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
