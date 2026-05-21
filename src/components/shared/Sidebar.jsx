import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard, CreditCard, Bell, BookOpen, HeadphonesIcon, MessageSquare,
  Users, Building2, BarChart3, ChevronLeft, ChevronRight, LogOut, Sun, Moon,
  GraduationCap, ClipboardList, FileText, Calendar, Award, BookMarked, IdCard
} from 'lucide-react';

const navConfig = {
  student: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'attendance', label: 'Attendance', icon: ClipboardList },
    { id: 'assignments', label: 'Assignments', icon: FileText },
    { id: 'exams', label: 'Exams', icon: BookMarked },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'results', label: 'Results', icon: Award },
    { id: 'resources', label: 'Resources', icon: BookOpen },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'idcard', label: 'ID Card', icon: IdCard },
    { id: 'notifications', label: 'Notifications', icon: Bell, countKey: 'notifications' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, countKey: 'messages' },
    { id: 'support', label: 'Support', icon: HeadphonesIcon },
  ],
  faculty: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'roster', label: 'Roster', icon: Users },
    { id: 'assignments', label: 'Assignments', icon: FileText },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'performance', label: 'Performance', icon: BarChart3 },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'messages', label: 'Messages', icon: MessageSquare, countKey: 'messages' },
  ],
  admin: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'departments', label: 'Departments', icon: Building2 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'notices', label: 'Notices', icon: Bell },
    { id: 'fees', label: 'Fees', icon: CreditCard },
    { id: 'messages', label: 'Messages', icon: MessageSquare, countKey: 'messages' },
    { id: 'support', label: 'Support', icon: HeadphonesIcon },
  ],
};

export default function Sidebar({ onLogout }) {
  const { user, activeTab, setActiveTab, notifications, messages, theme, toggleTheme } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const role = user?.role || 'student';
  const items = navConfig[role] || navConfig.student;
  const initials = user?.displayName
    ? user.displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const getCount = (key) => {
    if (key === 'notifications') return notifications?.filter(n => !n.read)?.length || 0;
    if (key === 'messages') return messages?.filter(m => !m.read)?.length || 0;
    return 0;
  };

  const sidebarWidth = collapsed ? 72 : 260;

  // ─── Mobile horizontal nav ───
  if (isMobile) {
    return (
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'hsl(var(--bg-sidebar))',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center', gap: 0,
        overflowX: 'auto', overflowY: 'hidden',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        height: 56,
        padding: '0 8px',
      }}>
        {/* Brand */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '0 12px 0 8px', flexShrink: 0,
          borderRight: '1px solid rgba(255,255,255,0.1)',
          marginRight: 4, height: '100%',
        }}>
          <GraduationCap size={20} style={{ color: 'hsl(152 60% 54%)' }} />
          <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.03em', color: '#fff' }}>
            C<span style={{ color: 'hsl(152 60% 54%)' }}>C</span>
          </span>
        </div>

        {items.map(item => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          const count = item.countKey ? getCount(item.countKey) : 0;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 2, padding: '8px 14px', border: 'none', cursor: 'pointer',
                background: active ? 'hsl(var(--primary-glow))' : 'transparent',
                color: active ? 'hsl(var(--primary))' : 'rgba(255,255,255,0.6)',
                borderRadius: 10, flexShrink: 0, position: 'relative',
                transition: 'var(--transition)',
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              }}
            >
              <Icon size={18} />
              <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, whiteSpace: 'nowrap' }}>{item.label}</span>
              {count > 0 && (
                <span style={{
                  position: 'absolute', top: 4, right: 6,
                  width: 16, height: 16, borderRadius: '50%',
                  background: 'hsl(var(--danger))', color: '#fff',
                  fontSize: 9, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    );
  }

  // ─── Desktop sidebar ───
  return (
    <aside style={{
      width: sidebarWidth,
      minWidth: sidebarWidth,
      height: '100vh',
      background: 'hsl(var(--bg-sidebar))',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1), min-width 0.3s cubic-bezier(0.4,0,0.2,1)',
      position: 'sticky',
      top: 0,
      left: 0,
      zIndex: 50,
      overflow: 'hidden',
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    }}>
      {/* Brand header */}
      <div style={{
        padding: collapsed ? '24px 0 16px' : '24px 20px 16px',
        display: 'flex', flexDirection: 'column',
        alignItems: collapsed ? 'center' : 'flex-start',
        gap: 12, flexShrink: 0,
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <GraduationCap size={collapsed ? 24 : 22} style={{ color: 'hsl(152 60% 54%)', flexShrink: 0 }} />
          {!collapsed && (
            <span style={{
              fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em',
              color: '#fff', whiteSpace: 'nowrap',
            }}>
              Campus<span style={{ color: 'hsl(152 60% 54%)' }}>Connect</span>
            </span>
          )}
        </div>
        {!collapsed && (
          <span style={{
            fontSize: 11, fontWeight: 600, letterSpacing: '0.04em',
            color: 'hsl(152 60% 54%)',
            background: 'rgba(74, 222, 128, 0.1)',
            padding: '3px 10px', borderRadius: 9999,
            textTransform: 'uppercase',
          }}>
            Spring 2026
          </span>
        )}
      </div>

      {/* Nav items */}
      <nav style={{
        flex: 1, overflowY: 'auto', overflowX: 'hidden',
        padding: collapsed ? '12px 8px' : '12px',
        display: 'flex', flexDirection: 'column', gap: 2,
        scrollbarWidth: 'none',
      }}>
        {items.map(item => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          const hovered = hoveredItem === item.id;
          const count = item.countKey ? getCount(item.countKey) : 0;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              title={collapsed ? item.label : undefined}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: collapsed ? '10px 0' : '10px 14px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                border: 'none', cursor: 'pointer', width: '100%',
                borderRadius: 10,
                background: active
                  ? 'hsl(var(--primary-glow))'
                  : hovered
                    ? 'rgba(255,255,255,0.06)'
                    : 'transparent',
                color: active ? 'hsl(var(--primary))' : 'rgba(255,255,255,0.7)',
                fontWeight: active ? 700 : 500,
                fontSize: 14,
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                transition: 'var(--transition)',
                position: 'relative',
                textAlign: 'left',
              }}
            >
              <Icon size={18} style={{ flexShrink: 0 }} />
              {!collapsed && (
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>
                  {item.label}
                </span>
              )}
              {count > 0 && (
                <span style={{
                  position: collapsed ? 'absolute' : 'static',
                  top: collapsed ? 4 : 'auto',
                  right: collapsed ? 10 : 'auto',
                  minWidth: 20, height: 20, borderRadius: 9999,
                  background: 'hsl(var(--danger))', color: '#fff',
                  fontSize: 11, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 6px', flexShrink: 0,
                }}>
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom gradient overlay */}
      <div style={{
        position: 'relative', flexShrink: 0,
      }}>
        <div style={{
          position: 'absolute', top: -40, left: 0, right: 0, height: 40,
          background: 'linear-gradient(to top, hsl(var(--bg-sidebar)), transparent)',
          pointerEvents: 'none',
        }} />

        {/* Theme toggle */}
        <div style={{ padding: collapsed ? '8px' : '8px 12px' }}>
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start',
              gap: 12, width: '100%', padding: '10px 14px',
              border: 'none', borderRadius: 10, cursor: 'pointer',
              background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)',
              fontSize: 13, fontWeight: 500,
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              transition: 'var(--transition)',
            }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            {!collapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>
        </div>

        {/* User profile */}
        <div style={{
          padding: collapsed ? '12px 8px' : '12px 16px',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'center', gap: 12,
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'hsl(var(--primary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 14, fontWeight: 700,
            flexShrink: 0,
          }}>
            {initials}
          </div>
          {!collapsed && (
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{
                color: '#fff', fontSize: 14, fontWeight: 700,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {user?.displayName || 'User'}
              </div>
              <div style={{
                color: 'rgba(255,255,255,0.45)', fontSize: 13,
                textTransform: 'capitalize',
              }}>
                {user?.role || 'Student'}
              </div>
            </div>
          )}
        </div>

        {/* Sign out */}
        <div style={{ padding: collapsed ? '0 8px 8px' : '0 12px 8px' }}>
          <button
            onClick={onLogout}
            aria-label="Sign out"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start',
              gap: 10, width: '100%', padding: '10px 14px',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10, cursor: 'pointer',
              background: 'transparent', color: 'rgba(255,255,255,0.5)',
              fontSize: 13, fontWeight: 500,
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              transition: 'var(--transition)',
            }}
          >
            <LogOut size={16} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <div style={{ padding: '0 12px 16px', display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={() => setCollapsed(c => !c)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{
              width: 32, height: 32, borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)',
              color: 'rgba(255,255,255,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'var(--transition)',
            }}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </div>
    </aside>
  );
}
