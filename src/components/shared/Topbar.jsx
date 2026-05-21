import { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Bell, Sun, Moon } from 'lucide-react';

const pageDescriptions = {
  dashboard: 'Your personalized campus command center',
  attendance: 'Track your class presence and maintain requirements',
  assignments: 'Submit work and track deadlines',
  exams: 'Upcoming examination schedule',
  events: 'Campus events and registrations',
  results: 'Academic performance and grade reports',
  resources: 'Study materials and course resources',
  payments: 'Fee ledger, dues, and payment history',
  idcard: 'Your digital campus identification',
  notifications: 'Official notices and announcements',
  messages: 'Campus communication channels',
  support: 'Service requests and help desk',
  roster: 'Class attendance management',
  schedule: 'Class and event scheduling',
  performance: 'Student academic tracking',
  announcements: 'Publish campus-wide notices',
  users: 'Student and faculty management',
  departments: 'Academic department overview',
  analytics: 'Campus-wide metrics and insights',
  notices: 'Manage official announcements',
  fees: 'Fee collection and tracking',
};

const pageTitles = {
  dashboard: 'Dashboard',
  attendance: 'Attendance',
  assignments: 'Assignments',
  exams: 'Exams',
  events: 'Events',
  results: 'Results',
  resources: 'Resources',
  payments: 'Payments',
  idcard: 'ID Card',
  notifications: 'Notifications',
  messages: 'Messages',
  support: 'Support',
  roster: 'Roster',
  schedule: 'Schedule',
  performance: 'Performance',
  announcements: 'Announcements',
  users: 'Users',
  departments: 'Departments',
  analytics: 'Analytics',
  notices: 'Notices',
  fees: 'Fees',
};

export default function Topbar() {
  const { user, activeTab, notifications, theme, toggleTheme, searchQuery, setSearchQuery, apiStatus } = useApp();
  const [searchFocused, setSearchFocused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [themeRotation, setThemeRotation] = useState(0);
  const searchRef = useRef(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const unreadCount = notifications?.filter(n => !n.read)?.length || 0;
  const initials = user?.displayName
    ? user.displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const title = pageTitles[activeTab] || activeTab?.charAt(0).toUpperCase() + activeTab?.slice(1) || 'Dashboard';
  const description = pageDescriptions[activeTab] || '';

  const handleThemeToggle = () => {
    setThemeRotation(r => r + 180);
    toggleTheme();
  };

  return (
    <header style={{
      display: 'flex',
      alignItems: isMobile ? 'flex-start' : 'center',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
      gap: isMobile ? 16 : 20,
      padding: isMobile ? '20px 16px 16px' : '24px 32px 20px',
      background: 'hsl(var(--bg-card))',
      borderBottom: '1px solid hsl(var(--border-light))',
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      position: 'sticky',
      top: isMobile ? 56 : 0,
      zIndex: 40,
    }}>
      {/* Left: Title + Description */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 style={{
          fontSize: 'clamp(22px, 3vw, 30px)',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          color: 'hsl(var(--text-main))',
          margin: 0,
          lineHeight: 1.2,
        }}>
          {title}
        </h1>
        {description && (
          <p style={{
            margin: '4px 0 0',
            fontSize: 14,
            color: 'hsl(var(--text-muted))',
            maxWidth: 500,
            lineHeight: 1.4,
          }}>
            {description}
          </p>
        )}
      </div>

      {/* Right: Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        width: isMobile ? '100%' : 'auto',
        flexShrink: 0,
      }}>
        {/* Search */}
        <div style={{
          position: 'relative',
          flex: isMobile ? 1 : 'none',
          width: isMobile ? '100%' : (searchFocused ? 380 : 320),
          transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'hsl(var(--text-muted))',
              pointerEvents: 'none',
            }}
          />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search campus..."
            value={searchQuery || ''}
            onChange={e => setSearchQuery?.(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            aria-label="Search campus"
            style={{
              width: '100%',
              height: 40,
              background: 'hsl(var(--bg-hover))',
              border: searchFocused ? '1.5px solid hsl(var(--primary))' : '1.5px solid transparent',
              borderRadius: 9999,
              paddingLeft: 40,
              paddingRight: 16,
              fontSize: 14,
              color: 'hsl(var(--text-main))',
              outline: 'none',
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              transition: 'var(--transition)',
              boxShadow: searchFocused ? '0 0 0 3px hsl(var(--primary) / 0.1)' : 'none',
            }}
          />
        </div>

        {/* Notification bell */}
        <div
          title={apiStatus === 'online' ? 'Backend connected' : apiStatus === 'offline' ? 'Using offline storage' : 'Checking backend'}
          style={{
            height: 40,
            padding: '0 12px',
            borderRadius: 9999,
            border: '1px solid hsl(var(--border-light))',
            display: isMobile ? 'none' : 'flex',
            alignItems: 'center',
            gap: 8,
            color: apiStatus === 'online' ? 'hsl(var(--success))' : apiStatus === 'offline' ? 'hsl(var(--warning))' : 'hsl(var(--text-muted))',
            background: 'hsl(var(--bg-card))',
            fontSize: 12,
            fontWeight: 750,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'currentColor',
            }}
          />
          {apiStatus === 'online' ? 'API Live' : apiStatus === 'offline' ? 'Offline' : 'Syncing'}
        </div>

        {/* Notification bell */}
        <button
          aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
          style={{
            width: 40, height: 40, borderRadius: '50%',
            border: '1px solid hsl(var(--border-light))',
            background: 'hsl(var(--bg-card))',
            cursor: 'pointer', position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'hsl(var(--text-muted))',
            transition: 'var(--transition)',
            flexShrink: 0,
          }}
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute', top: 6, right: 6,
              width: 8, height: 8, borderRadius: '50%',
              background: 'hsl(var(--danger))',
              border: '2px solid hsl(var(--bg-card))',
              boxSizing: 'content-box',
            }} />
          )}
        </button>

        {/* Theme toggle */}
        <button
          onClick={handleThemeToggle}
          aria-label="Toggle theme"
          style={{
            width: 40, height: 40, borderRadius: '50%',
            border: '1px solid hsl(var(--border-light))',
            background: 'hsl(var(--bg-card))',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'hsl(var(--text-muted))',
            transition: 'var(--transition)',
            flexShrink: 0,
          }}
        >
          <span style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
            transform: `rotate(${themeRotation}deg)`,
          }}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </span>
        </button>

        {/* User avatar */}
        <div
          aria-label={`User: ${user?.displayName || 'User'}`}
          style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'hsl(var(--primary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 13, fontWeight: 700,
            flexShrink: 0,
            cursor: 'pointer',
            border: '2px solid hsl(var(--primary) / 0.3)',
            transition: 'var(--transition)',
          }}
        >
          {initials}
        </div>
      </div>
    </header>
  );
}
