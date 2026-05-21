import { useMemo, useState } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const channels = ['all', 'general', 'academics', 'support'];

export default function ChatPanel() {
  const { user, messages, setMessages, showToast } = useApp();
  const [channel, setChannel] = useState('all');
  const [draft, setDraft] = useState('');

  const visibleMessages = useMemo(() => {
    return messages
      .filter((message) => channel === 'all' || message.channel === channel)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }, [messages, channel]);

  const sendMessage = () => {
    const text = draft.trim();
    if (!text) return;

    setMessages((prev) => [
      ...prev,
      {
        id: `MSG${Date.now()}`,
        sender: user?.displayName || 'You',
        receiver: channel === 'all' ? 'General' : channel,
        text,
        timestamp: new Date().toISOString(),
        read: true,
        channel: channel === 'all' ? 'general' : channel,
      },
    ]);
    setDraft('');
    showToast?.('Message sent.');
  };

  return (
    <div className="page-transition" style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {channels.map((item) => (
          <button
            key={item}
            onClick={() => setChannel(item)}
            style={{
              border: channel === item ? '1px solid hsl(var(--primary))' : '1px solid hsl(var(--border))',
              background: channel === item ? 'hsl(var(--primary) / 0.1)' : 'hsl(var(--bg-card))',
              color: channel === item ? 'hsl(var(--primary))' : 'hsl(var(--text-main))',
              borderRadius: 'var(--radius-full)',
              padding: '8px 14px',
              fontWeight: 700,
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {item}
          </button>
        ))}
      </div>

      <Card style={{ display: 'grid', gap: 12, minHeight: 420 }}>
        {visibleMessages.map((message) => (
          <div key={message.id} style={{ display: 'grid', gap: 6, padding: '12px 0', borderBottom: '1px solid hsl(var(--border-light))' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <strong style={{ color: 'hsl(var(--text-main))' }}>{message.sender}</strong>
              <Badge variant={message.read ? 'read' : 'new'}>{message.channel}</Badge>
            </div>
            <p style={{ margin: 0, color: 'hsl(var(--text-muted))', lineHeight: 1.55 }}>{message.text}</p>
          </div>
        ))}
        {!visibleMessages.length && (
          <div style={{ display: 'grid', placeItems: 'center', color: 'hsl(var(--text-muted))', minHeight: 260 }}>
            <MessageSquare size={36} />
          </div>
        )}
      </Card>

      <Card style={{ display: 'flex', gap: 10, padding: 12 }}>
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') sendMessage();
          }}
          placeholder="Write a message..."
          style={{
            flex: 1,
            border: '1px solid hsl(var(--border))',
            background: 'hsl(var(--bg-app))',
            color: 'hsl(var(--text-main))',
            borderRadius: 'var(--radius-sm)',
            padding: '0 14px',
            minHeight: 42,
            outline: 'none',
          }}
        />
        <Button icon={<Send size={16} />} onClick={sendMessage}>Send</Button>
      </Card>
    </div>
  );
}
