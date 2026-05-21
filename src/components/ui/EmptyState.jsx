import { Inbox } from 'lucide-react';
import Card from './Card';
import Button from './Button';

export default function EmptyState({
  icon,
  title = 'Nothing here yet',
  description = 'New activity will appear here when it is available.',
  actionLabel,
  onAction,
}) {
  return (
    <Card style={{ padding: 40, textAlign: 'center' }}>
      <div style={{ display: 'grid', placeItems: 'center', gap: 12, maxWidth: 420, margin: '0 auto' }}>
        <div
          aria-hidden="true"
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            background: 'hsl(var(--primary) / 0.1)',
            color: 'hsl(var(--primary))',
          }}
        >
          {icon || <Inbox size={24} />}
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: 18, color: 'hsl(var(--text-main))' }}>{title}</h3>
          <p style={{ margin: '6px 0 0', color: 'hsl(var(--text-muted))', fontSize: 14, lineHeight: 1.6 }}>
            {description}
          </p>
        </div>
        {actionLabel && onAction && (
          <Button variant="primary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
    </Card>
  );
}
