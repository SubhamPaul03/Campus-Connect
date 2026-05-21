import { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import {
  BookOpen, Clock, TrendingUp, CreditCard, Bell, Calendar, FileText,
  CheckCircle2, AlertCircle, Download, Upload, Eye, ChevronRight,
  Award, BarChart3, Target, Zap
} from 'lucide-react';

/* ── helpers ─────────────────────────────────────────────── */
const fmt = v => `Rs. ${Number(v).toLocaleString('en-IN')}`;
const pct = v => `${Math.round(v)}%`;

const greet = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const today = new Date().toLocaleDateString('en-IN', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
});

/* ── mock data the context may not yet hold ──────────────── */
const assignmentsData = [
  { id: 1, title: 'Binary Search Tree Implementation', course: 'Data Structures', due: '2026-05-25', status: 'pending', marks: null },
  { id: 2, title: 'Process Scheduling Simulator', course: 'Operating Systems', due: '2026-05-23', status: 'submitted', marks: null },
  { id: 3, title: 'Cloud Deployment Report', course: 'Cloud Computing', due: '2026-05-18', status: 'graded', marks: '42/50' },
  { id: 4, title: 'ER Diagram — Library System', course: 'DBMS Tutorial', due: '2026-05-20', status: 'graded', marks: '38/40' },
  { id: 5, title: 'Mutex & Semaphore Lab', course: 'Operating Systems', due: '2026-05-28', status: 'pending', marks: null },
];

const examsData = [
  { id: 1, subject: 'Data Structures', date: '2026-06-02', time: '10:00 AM', room: 'Hall A', type: 'Mid-Sem', duration: '2h', syllabus: 'Trees, Graphs, Hashing, Sorting' },
  { id: 2, subject: 'Operating Systems', date: '2026-06-04', time: '02:00 PM', room: 'Hall B', type: 'Mid-Sem', duration: '2h', syllabus: 'Processes, Threads, Scheduling, Deadlocks' },
  { id: 3, subject: 'Cloud Computing', date: '2026-06-06', time: '10:00 AM', room: 'Lab 301', type: 'Practical', duration: '3h', syllabus: 'AWS, Docker, Kubernetes, CI/CD' },
  { id: 4, subject: 'DBMS', date: '2026-06-09', time: '10:00 AM', room: 'Hall A', type: 'End-Sem', duration: '3h', syllabus: 'SQL, Normalization, Transactions, Indexing' },
];

const resultsData = {
  sgpa: 8.74,
  cgpa: 8.52,
  semester: 'Spring 2026',
  subjects: [
    { name: 'Data Structures', grade: 'A', marks: 88, total: 100, credits: 4 },
    { name: 'Operating Systems', grade: 'A-', marks: 82, total: 100, credits: 4 },
    { name: 'Cloud Computing', grade: 'A+', marks: 95, total: 100, credits: 3 },
    { name: 'DBMS', grade: 'B+', marks: 76, total: 100, credits: 4 },
    { name: 'Mathematics IV', grade: 'A', marks: 85, total: 100, credits: 3 },
  ],
};

const resourcesData = [
  { id: 1, title: 'DSA Lecture Notes', course: 'Data Structures', type: 'pdf', size: '2.4 MB', uploader: 'Dr. Mehra' },
  { id: 2, title: 'OS Video — Scheduling', course: 'Operating Systems', type: 'video', size: '148 MB', uploader: 'Prof. Iyer' },
  { id: 3, title: 'Cloud Lab Manual', course: 'Cloud Computing', type: 'pdf', size: '5.1 MB', uploader: 'Ms. Das' },
  { id: 4, title: 'SQL Practice Set', course: 'DBMS Tutorial', type: 'link', size: '—', uploader: 'Prof. Khan' },
  { id: 5, title: 'Graph Algorithms PDF', course: 'Data Structures', type: 'pdf', size: '1.8 MB', uploader: 'Dr. Mehra' },
  { id: 6, title: 'Docker Tutorial', course: 'Cloud Computing', type: 'video', size: '210 MB', uploader: 'Ms. Das' },
];

/* ── styles ──────────────────────────────────────────────── */
const s = {
  page: {
    display: 'grid',
    gap: '24px',
    animation: 'fadeInUp 0.4s ease both',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
  },
  twoCol: {
    display: 'grid',
    gridTemplateColumns: '1.5fr 1fr',
    gap: '24px',
    alignItems: 'start',
  },
  sectionTitle: {
    fontSize: '17px',
    fontWeight: 750,
    letterSpacing: '-0.01em',
    color: 'hsl(var(--text-main))',
    margin: 0,
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    flexWrap: 'wrap',
  },
  cardStack: {
    display: 'grid',
    gap: '12px',
  },
  statCard: {
    position: 'relative',
    overflow: 'hidden',
    padding: '20px',
  },
  statAccent: (color) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: color,
  }),
  statLabel: {
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: 'hsl(var(--text-muted))',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: 800,
    letterSpacing: '-0.04em',
    color: 'hsl(var(--text-main))',
    marginTop: '8px',
    lineHeight: 1.1,
  },
  statSub: {
    fontSize: '13px',
    fontWeight: 600,
    marginTop: '4px',
    color: 'hsl(var(--primary))',
  },
  hero: {
    background: 'linear-gradient(135deg, hsl(160 50% 22%), hsl(170 50% 28%))',
    borderRadius: 'var(--radius-lg)',
    padding: '32px',
    color: '#fff',
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: '24px',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    top: '-40%',
    right: '-10%',
    width: '320px',
    height: '320px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, hsla(160,80%,60%,0.15) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  heroTitle: {
    fontSize: 'clamp(24px, 3vw, 36px)',
    fontWeight: 800,
    letterSpacing: '-0.04em',
    lineHeight: 1.1,
    margin: '8px 0',
  },
  heroSub: {
    color: 'hsla(0,0%,100%,0.72)',
    fontSize: '15px',
    lineHeight: 1.5,
    maxWidth: '520px',
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'hsla(0,0%,100%,0.15)',
    borderRadius: 'var(--radius-full)',
    padding: '6px 14px',
    fontSize: '13px',
    fontWeight: 650,
    marginTop: '16px',
    marginRight: '8px',
  },
  classCard: (i) => ({
    display: 'grid',
    gridTemplateColumns: '56px 1fr auto',
    gap: '16px',
    alignItems: 'center',
    padding: '16px',
    animation: `fadeInUp 0.35s ease ${i * 0.06}s both`,
  }),
  timeBlock: {
    width: '56px',
    height: '56px',
    borderRadius: 'var(--radius-sm)',
    background: 'hsl(var(--primary) / 0.1)',
    color: 'hsl(var(--primary))',
    display: 'grid',
    placeItems: 'center',
    fontWeight: 800,
    fontSize: '14px',
  },
  quickGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  },
  quickAction: {
    padding: '16px',
    cursor: 'pointer',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  quickIcon: (bg) => ({
    width: '40px',
    height: '40px',
    borderRadius: 'var(--radius-sm)',
    background: bg,
    display: 'grid',
    placeItems: 'center',
  }),
  eventsRow: {
    display: 'flex',
    gap: '16px',
    overflowX: 'auto',
    paddingBottom: '4px',
  },
  eventCard: {
    minWidth: '200px',
    flex: '0 0 auto',
    padding: '16px',
  },
  filterTabs: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  filterTab: (active) => ({
    padding: '8px 16px',
    borderRadius: 'var(--radius-full)',
    border: `1px solid ${active ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
    background: active ? 'hsl(var(--primary) / 0.1)' : 'transparent',
    color: active ? 'hsl(var(--primary))' : 'hsl(var(--text-muted))',
    fontWeight: 650,
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'var(--transition)',
  }),
  assignCard: (i) => ({
    padding: '18px',
    animation: `fadeInUp 0.35s ease ${i * 0.06}s both`,
  }),
  tableRow: {
    display: 'grid',
    gap: '10px',
    padding: '14px 16px',
    borderTop: '1px solid hsl(var(--border-light))',
    alignItems: 'center',
    fontSize: '14px',
    transition: 'var(--transition)',
  },
  tableHeader: {
    display: 'grid',
    gap: '10px',
    padding: '12px 16px',
    background: 'hsl(var(--bg-hover))',
    fontSize: '11px',
    textTransform: 'uppercase',
    fontWeight: 700,
    letterSpacing: '0.05em',
    color: 'hsl(var(--text-muted))',
  },
  progressBar: {
    height: '6px',
    borderRadius: 'var(--radius-full)',
    background: 'hsl(var(--bg-hover))',
    overflow: 'hidden',
  },
  progressFill: (w, color) => ({
    height: '100%',
    borderRadius: 'inherit',
    width: w,
    background: color,
    transition: 'width 0.6s ease',
  }),
  examTimeline: (i) => ({
    display: 'grid',
    gridTemplateColumns: '80px 1fr',
    gap: '20px',
    padding: '20px',
    animation: `fadeInUp 0.35s ease ${i * 0.08}s both`,
  }),
  examDateBox: {
    width: '80px',
    height: '80px',
    borderRadius: 'var(--radius)',
    background: 'hsl(var(--primary) / 0.08)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
  },
  gpaCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
    padding: '28px',
  },
  gpaValue: {
    fontSize: '56px',
    fontWeight: 800,
    letterSpacing: '-0.06em',
    lineHeight: 1,
    color: 'hsl(var(--primary))',
  },
  resourceCard: (i) => ({
    display: 'grid',
    gridTemplateColumns: '48px 1fr auto',
    gap: '16px',
    alignItems: 'center',
    padding: '16px',
    animation: `fadeInUp 0.35s ease ${i * 0.05}s both`,
  }),
  resourceIcon: (bg) => ({
    width: '48px',
    height: '48px',
    borderRadius: 'var(--radius-sm)',
    background: bg,
    display: 'grid',
    placeItems: 'center',
  }),
  paymentRow: (i) => ({
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: '16px',
    alignItems: 'center',
    padding: '18px',
    animation: `fadeInUp 0.3s ease ${i * 0.05}s both`,
  }),
  amount: {
    fontSize: '20px',
    fontWeight: 800,
    letterSpacing: '-0.03em',
    whiteSpace: 'nowrap',
  },
  notifCard: (read, i) => ({
    padding: '16px',
    opacity: read ? 0.7 : 1,
    borderLeft: `3px solid ${read ? 'hsl(var(--border))' : 'hsl(var(--primary))'}`,
    animation: `fadeInUp 0.3s ease ${i * 0.05}s both`,
  }),
  supportForm: {
    display: 'grid',
    gap: '16px',
    padding: '20px',
  },
  select: {
    width: '100%',
    height: '42px',
    border: '1px solid hsl(var(--border))',
    borderRadius: 'var(--radius-sm)',
    padding: '0 14px',
    background: 'hsl(var(--bg-app))',
    color: 'hsl(var(--text-main))',
    fontSize: '14px',
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    outline: 'none',
    transition: 'var(--transition)',
  },
  textarea: {
    width: '100%',
    minHeight: '100px',
    border: '1px solid hsl(var(--border))',
    borderRadius: 'var(--radius-sm)',
    padding: '12px 14px',
    background: 'hsl(var(--bg-app))',
    color: 'hsl(var(--text-main))',
    fontSize: '14px',
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    resize: 'vertical',
    outline: 'none',
    transition: 'var(--transition)',
    lineHeight: 1.6,
  },
  input: {
    width: '100%',
    height: '42px',
    border: '1px solid hsl(var(--border))',
    borderRadius: 'var(--radius-sm)',
    padding: '0 14px',
    background: 'hsl(var(--bg-app))',
    color: 'hsl(var(--text-main))',
    fontSize: '14px',
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    outline: 'none',
    transition: 'var(--transition)',
  },
  dropZone: (dragging) => ({
    border: `2px dashed ${dragging ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
    borderRadius: 'var(--radius)',
    padding: '40px',
    textAlign: 'center',
    background: dragging ? 'hsl(var(--primary) / 0.05)' : 'transparent',
    cursor: 'pointer',
    transition: 'var(--transition)',
  }),
  timelineDot: (active) => ({
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: active ? 'hsl(var(--primary))' : 'hsl(var(--border))',
    border: `2px solid ${active ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
    flexShrink: 0,
  }),
  timelineLine: {
    width: '2px',
    flex: 1,
    background: 'hsl(var(--border))',
    margin: '4px auto',
    minHeight: '24px',
  },
};

/* ── style injection ─────────────────────────────────────── */
const keyframesCSS = `
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
`;
let injected = false;
function injectOnce() {
  if (injected || typeof document === 'undefined') return;
  const el = document.createElement('style');
  el.textContent = keyframesCSS;
  document.head.appendChild(el);
  injected = true;
}

/* ── SVG Attendance Ring ─────────────────────────────────── */
function AttendanceRing({ percentage, size = 140 }) {
  const viewSize = 120;
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percentage / 100) * circ;
  const color =
    percentage >= 75 ? 'hsl(var(--success))'
    : percentage >= 60 ? 'hsl(var(--warning))'
    : 'hsl(var(--danger))';
  return (
    <svg width={size} height={size} viewBox={`0 0 ${viewSize} ${viewSize}`} aria-label={`Attendance: ${percentage}%`}>
      <circle cx="60" cy="60" r={r} fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
      <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" transform="rotate(-90 60 60)"
        style={{ transition: 'stroke-dashoffset 1s ease' }} />
      <text x="60" y="60" textAnchor="middle" dy="0.35em"
        fontSize="28" fontWeight="800"
        fill="hsl(var(--text-main))">{percentage}%</text>
    </svg>
  );
}

/* ── main export ─────────────────────────────────────────── */
export default function StudentDashboard() {
  injectOnce();
  const {
    user, payments, setPayments,
    notifications, setNotifications,
    classes, requests, setRequests,
    events, setEvents,
    activeTab, setActiveTab, showToast,
  } = useApp();

  const name = user?.displayName || user?.email?.split('@')[0] || 'Student';

  switch (activeTab) {
    case 'dashboard':    return <DashboardView name={name} classes={classes} payments={payments} notifications={notifications} events={events} setActiveTab={setActiveTab} />;
    case 'attendance':   return <AttendanceView classes={classes} />;
    case 'assignments':  return <AssignmentsView showToast={showToast} />;
    case 'exams':        return <ExamsView />;
    case 'events':       return <EventsView events={events} setEvents={setEvents} showToast={showToast} />;
    case 'results':      return <ResultsView />;
    case 'resources':    return <ResourcesView showToast={showToast} />;
    case 'payments':     return <PaymentsView payments={payments} setPayments={setPayments} showToast={showToast} />;
    case 'notifications':return <NotificationsView notifications={notifications} setNotifications={setNotifications} showToast={showToast} />;
    case 'support':      return <SupportView requests={requests} setRequests={setRequests} showToast={showToast} />;
    default:             return <DashboardView name={name} classes={classes} payments={payments} notifications={notifications} events={events} setActiveTab={setActiveTab} />;
  }
}

/* ═══════════════════════════════════════════════════════════
   DASHBOARD VIEW
   ═══════════════════════════════════════════════════════════ */
function DashboardView({ name, classes, payments, notifications, events, setActiveTab }) {
  const avgAtt = useMemo(() => Math.round(classes.reduce((s, c) => s + c.attendance, 0) / (classes.length || 1)), [classes]);
  const dueTotal = useMemo(() => payments.filter(p => p.status === 'due').reduce((s, p) => s + p.amount, 0), [payments]);
  const unread = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);
  const pendingAssign = assignmentsData.filter(a => a.status === 'pending').length;

  return (
    <div style={s.page}>
      {/* Hero */}
      <div style={s.hero}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'hsl(160 80% 70%)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {today}
          </span>
          <h2 style={s.heroTitle}>{greet()}, {name}</h2>
          <p style={s.heroSub}>
            You have {classes.filter(c => !c.marked).length} classes pending attendance and {pendingAssign} assignments due this week.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
            <span style={s.heroBadge}><Clock size={14} /> {classes.length} classes today</span>
            <span style={s.heroBadge}><Target size={14} /> {avgAtt}% attendance</span>
            <span style={s.heroBadge}><Zap size={14} /> {pendingAssign} tasks</span>
          </div>
        </div>
        <div style={{ display: 'grid', placeItems: 'center', position: 'relative', zIndex: 1 }}>
          <AttendanceRing percentage={avgAtt} size={130} />
        </div>
        <div style={s.heroGlow} />
      </div>

      {/* Stats */}
      <div style={s.statsGrid}>
        <Card style={s.statCard}>
          <div style={s.statAccent('hsl(var(--success))')} />
          <span style={s.statLabel}>Attendance</span>
          <div style={s.statValue}>{avgAtt}%</div>
          <span style={s.statSub}>{classes.filter(c => !c.marked).length} pending marks</span>
        </Card>
        <Card style={s.statCard}>
          <div style={s.statAccent('hsl(var(--warning))')} />
          <span style={s.statLabel}>Pending Dues</span>
          <div style={s.statValue}>{fmt(dueTotal)}</div>
          <span style={{ ...s.statSub, color: 'hsl(var(--warning))' }}>{payments.filter(p => p.status === 'due').length} unpaid</span>
        </Card>
        <Card style={s.statCard}>
          <div style={s.statAccent('hsl(var(--info))')} />
          <span style={s.statLabel}>Unread Notices</span>
          <div style={s.statValue}>{unread}</div>
          <span style={{ ...s.statSub, color: 'hsl(var(--info))' }}>{notifications.filter(n => n.tag === 'alert').length} urgent</span>
        </Card>
        <Card style={s.statCard}>
          <div style={s.statAccent('hsl(160 50% 38%)')} />
          <span style={s.statLabel}>Assignments Due</span>
          <div style={s.statValue}>{pendingAssign}</div>
          <span style={s.statSub}>this week</span>
        </Card>
      </div>

      {/* Two Column */}
      <div style={s.twoCol}>
        {/* Today's Classes */}
        <div>
          <div style={{ ...s.sectionHeader, marginBottom: '16px' }}>
            <h3 style={s.sectionTitle}>Today's Classes</h3>
            <Button variant="ghost" size="sm" icon={<ChevronRight size={16} />} onClick={() => setActiveTab('attendance')}>View all</Button>
          </div>
          <div style={s.cardStack}>
            {classes.slice(0, 4).map((cls, i) => (
              <Card key={cls.id} hover style={s.classCard(i)}>
                <div style={s.timeBlock}>{cls.time}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px', color: 'hsl(var(--text-main))' }}>{cls.course}</div>
                  <div style={{ fontSize: '13px', color: 'hsl(var(--text-muted))' }}>
                    {cls.room} · {cls.faculty}
                  </div>
                </div>
                <Badge variant={cls.marked ? 'paid' : 'due'}>{cls.marked ? 'Present' : 'Pending'}</Badge>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div style={{ ...s.sectionHeader, marginBottom: '16px' }}>
            <h3 style={s.sectionTitle}>Quick Actions</h3>
          </div>
          <div style={s.quickGrid}>
            {[
              { icon: <CreditCard size={20} />, bg: 'hsl(var(--warning) / 0.12)', color: 'hsl(var(--warning))', title: 'Pay Fees', sub: 'Open fee ledger', tab: 'payments' },
              { icon: <Upload size={20} />, bg: 'hsl(var(--info) / 0.12)', color: 'hsl(var(--info))', title: 'Submit Assignment', sub: 'Upload pending work', tab: 'assignments' },
              { icon: <BarChart3 size={20} />, bg: 'hsl(var(--success) / 0.12)', color: 'hsl(var(--success))', title: 'View Results', sub: 'Semester grades', tab: 'results' },
              { icon: <Download size={20} />, bg: 'hsl(var(--primary) / 0.12)', color: 'hsl(var(--primary))', title: 'Download ID', sub: 'Student identity', tab: 'idcard' },
            ].map((a, i) => (
              <Card key={a.title} hover onClick={() => setActiveTab(a.tab)} style={{ ...s.quickAction, animation: `fadeInUp 0.35s ease ${(i + 4) * 0.06}s both` }}>
                <div style={{ ...s.quickIcon(a.bg), color: a.color }}>{a.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: 'hsl(var(--text-main))' }}>{a.title}</div>
                  <div style={{ fontSize: '12px', color: 'hsl(var(--text-muted))', marginTop: '2px' }}>{a.sub}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div>
        <div style={{ ...s.sectionHeader, marginBottom: '16px' }}>
          <h3 style={s.sectionTitle}>Upcoming Events</h3>
          <Button variant="ghost" size="sm" onClick={() => setActiveTab('events')}>View calendar</Button>
        </div>
        <div style={s.eventsRow}>
          {events.slice(0, 5).map((ev, i) => (
            <Card key={ev.id} hover style={{ ...s.eventCard, animation: `fadeInUp 0.35s ease ${i * 0.08}s both` }}>
              <Badge variant={ev.joined ? 'paid' : ev.type === 'placement' ? 'new' : ev.type === 'academic' ? 'info' : 'open'}>{ev.joined ? 'joined' : ev.type}</Badge>
              <div style={{ fontWeight: 700, fontSize: '15px', marginTop: '10px', color: 'hsl(var(--text-main))' }}>{ev.title}</div>
              <div style={{ fontSize: '13px', color: 'hsl(var(--text-muted))', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} /> {new Date(ev.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ATTENDANCE VIEW
   ═══════════════════════════════════════════════════════════ */
function AttendanceView({ classes }) {
  const avg = useMemo(() => Math.round(classes.reduce((s, c) => s + c.attendance, 0) / (classes.length || 1)), [classes]);

  const statusFor = pct => pct >= 75 ? { label: 'Safe', color: 'hsl(var(--success))' } : pct >= 65 ? { label: 'Warning', color: 'hsl(var(--warning))' } : { label: 'Danger', color: 'hsl(var(--danger))' };

  return (
    <div style={s.page}>
      {/* Main Ring */}
      <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px', gap: '12px' }}>
        <AttendanceRing percentage={avg} size={160} />
        <div style={{ fontWeight: 750, fontSize: '18px', color: 'hsl(var(--text-main))' }}>Overall Attendance</div>
        <div style={{ fontSize: '14px', color: 'hsl(var(--text-muted))' }}>Minimum required: 75%</div>
      </Card>

      {/* Class-wise Table */}
      <Card padding={false}>
        <div style={{ ...s.tableHeader, gridTemplateColumns: '1.2fr 0.6fr 0.6fr 0.8fr 1.2fr' }}>
          <span>Course</span><span>Attendance</span><span>Status</span><span>Last Marked</span><span>Progress</span>
        </div>
        {classes.map((cls, i) => {
          const st = statusFor(cls.attendance);
          return (
            <div key={cls.id} style={{ ...s.tableRow, gridTemplateColumns: '1.2fr 0.6fr 0.6fr 0.8fr 1.2fr', animation: `fadeInUp 0.3s ease ${i * 0.06}s both` }}>
              <span style={{ fontWeight: 700 }}>{cls.course}</span>
              <span style={{ fontWeight: 700 }}>{cls.attendance}%</span>
              <span style={{ fontWeight: 650, color: st.color }}>{st.label}</span>
              <span style={{ color: 'hsl(var(--text-muted))', fontSize: '13px' }}>{cls.marked ? 'Today' : 'Yesterday'}</span>
              <div style={s.progressBar}>
                <div style={s.progressFill(`${cls.attendance}%`, st.color)} />
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ASSIGNMENTS VIEW
   ═══════════════════════════════════════════════════════════ */
function EventsView({ events, setEvents, showToast }) {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? events : events.filter((event) => event.type === filter);
  const types = ['all', ...Array.from(new Set(events.map((event) => event.type)))];

  const toggleJoin = (id) => {
    let joined = false;
    setEvents((prev) => prev.map((event) => {
      if (event.id !== id) return event;
      joined = !event.joined;
      return { ...event, joined };
    }));
    showToast(joined ? 'Event registration confirmed.' : 'Event registration cancelled.', joined ? 'success' : 'warning');
  };

  return (
    <div style={s.page}>
      <div style={s.filterTabs}>
        {types.map((type) => (
          <button key={type} onClick={() => setFilter(type)} style={s.filterTab(filter === type)}>
            {type}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        {filtered.map((event, i) => (
          <Card key={event.id} hover style={{ display: 'grid', gap: 14, animation: `fadeInUp 0.35s ease ${i * 0.06}s both` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 12 }}>
              <Badge variant={event.joined ? 'paid' : 'info'}>{event.joined ? 'registered' : event.type}</Badge>
              <span style={{ color: 'hsl(var(--text-muted))', fontSize: 13 }}>{event.time}</span>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 17 }}>{event.title}</h3>
              <p style={{ margin: '6px 0 0', color: 'hsl(var(--text-muted))', fontSize: 13, lineHeight: 1.55 }}>
                {event.description}
              </p>
            </div>
            <div style={{ display: 'grid', gap: 4, color: 'hsl(var(--text-muted))', fontSize: 13 }}>
              <span>{new Date(event.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <span>{event.location}</span>
            </div>
            <Button variant={event.joined ? 'ghost' : 'primary'} onClick={() => toggleJoin(event.id)}>
              {event.joined ? 'Cancel Registration' : 'Register'}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AssignmentsView({ showToast }) {
  const [filter, setFilter] = useState('All');
  const [submitModal, setSubmitModal] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [assignments, setAssignments] = useState(assignmentsData);
  const filters = ['All', 'Pending', 'Submitted', 'Graded'];

  const filtered = useMemo(() =>
    filter === 'All' ? assignments : assignments.filter(a => a.status.toLowerCase() === filter.toLowerCase()),
    [filter, assignments]);

  const handleSubmit = (id) => {
    setAssignments(prev => prev.map(a => a.id === id ? { ...a, status: 'submitted' } : a));
    setSubmitModal(null);
    showToast('Assignment submitted successfully!');
  };

  const badgeVariant = (status) => {
    switch (status) {
      case 'pending': return 'due';
      case 'submitted': return 'new';
      case 'graded': return 'paid';
      default: return 'info';
    }
  };

  return (
    <div style={s.page}>
      <div style={s.filterTabs}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={s.filterTab(filter === f)}>{f}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {filtered.map((a, i) => (
          <Card key={a.id} hover style={s.assignCard(i)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
              <Badge variant={badgeVariant(a.status)}>{a.status}</Badge>
              {a.marks && <span style={{ fontWeight: 700, fontSize: '15px', color: 'hsl(var(--primary))' }}>{a.marks}</span>}
            </div>
            <div style={{ fontWeight: 750, fontSize: '16px', color: 'hsl(var(--text-main))', marginBottom: '6px' }}>{a.title}</div>
            <div style={{ fontSize: '13px', color: 'hsl(var(--text-muted))', marginBottom: '16px' }}>
              <BookOpen size={13} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '4px' }} />
              {a.course} · Due {new Date(a.due).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
            </div>
            {a.status === 'pending' && (
              <Button variant="primary" size="sm" icon={<Upload size={14} />} fullWidth onClick={() => setSubmitModal(a)}>Submit</Button>
            )}
            {(a.status === 'submitted' || a.status === 'graded') && (
              <Button variant="ghost" size="sm" icon={<Eye size={14} />} fullWidth>View Submission</Button>
            )}
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card style={{ textAlign: 'center', padding: '48px', color: 'hsl(var(--text-muted))' }}>
          <FileText size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
          <p>No {filter.toLowerCase()} assignments</p>
        </Card>
      )}

      {/* Submit Modal */}
      <Modal open={!!submitModal} onClose={() => setSubmitModal(null)} title={`Submit: ${submitModal?.title || ''}`}>
        <div style={{ display: 'grid', gap: '16px' }}>
          <div style={{ fontSize: '14px', color: 'hsl(var(--text-muted))' }}>
            {submitModal?.course} · Due {submitModal?.due}
          </div>
          <div
            style={s.dropZone(dragging)}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); }}
            onClick={() => {}}
          >
            <Upload size={32} style={{ margin: '0 auto 12px', color: 'hsl(var(--text-muted))' }} />
            <p style={{ fontWeight: 650, color: 'hsl(var(--text-main))' }}>Drop files here or click to browse</p>
            <p style={{ fontSize: '13px', color: 'hsl(var(--text-muted))', marginTop: '4px' }}>PDF, DOCX, ZIP · Max 10 MB</p>
          </div>
          <Button variant="primary" fullWidth onClick={() => handleSubmit(submitModal.id)} icon={<CheckCircle2 size={16} />}>
            Confirm Submission
          </Button>
        </div>
      </Modal>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   EXAMS VIEW
   ═══════════════════════════════════════════════════════════ */
function ExamsView() {
  const nextExam = examsData[0];
  const now = new Date();
  const examDate = new Date(nextExam.date + 'T' + (nextExam.time.includes('PM') ? (parseInt(nextExam.time) + 12) : nextExam.time.split(':')[0]) + ':00:00');
  const diff = Math.max(0, examDate - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);

  return (
    <div style={s.page}>
      {/* Countdown */}
      <Card style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '24px', background: 'linear-gradient(135deg, hsl(var(--primary) / 0.06), hsl(var(--info) / 0.04))' }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          {[{ v: days, l: 'Days' }, { v: hours, l: 'Hours' }].map(t => (
            <div key={t.l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.04em', color: 'hsl(var(--primary))' }}>{t.v}</div>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'hsl(var(--text-muted))', letterSpacing: '0.06em' }}>{t.l}</div>
            </div>
          ))}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 750, fontSize: '18px', color: 'hsl(var(--text-main))' }}>Next: {nextExam.subject}</div>
          <div style={{ fontSize: '14px', color: 'hsl(var(--text-muted))', marginTop: '4px' }}>
            {nextExam.date} at {nextExam.time} · {nextExam.room}
          </div>
        </div>
        <Badge variant="alert">{nextExam.type}</Badge>
      </Card>

      {/* Timeline */}
      <div style={s.cardStack}>
        {examsData.map((ex, i) => {
          const d = new Date(ex.date);
          return (
            <Card key={ex.id} hover style={s.examTimeline(i)}>
              <div style={s.examDateBox}>
                <div style={{ fontSize: '24px', color: 'hsl(var(--primary))' }}>{d.getDate()}</div>
                <div style={{ fontSize: '12px', color: 'hsl(var(--text-muted))', fontWeight: 700 }}>{d.toLocaleDateString('en-IN', { month: 'short' })}</div>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 750, fontSize: '16px', color: 'hsl(var(--text-main))' }}>{ex.subject}</span>
                  <Badge variant={ex.type === 'Practical' ? 'new' : ex.type === 'End-Sem' ? 'alert' : 'due'}>{ex.type}</Badge>
                </div>
                <div style={{ fontSize: '14px', color: 'hsl(var(--text-muted))', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <span><Clock size={13} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '4px' }} />{ex.time} · {ex.duration}</span>
                  <span>{ex.room}</span>
                </div>
                <div style={{ fontSize: '13px', color: 'hsl(var(--text-muted))', marginTop: '8px', padding: '8px 12px', background: 'hsl(var(--bg-hover))', borderRadius: 'var(--radius-sm)' }}>
                  <strong style={{ color: 'hsl(var(--text-main))' }}>Syllabus:</strong> {ex.syllabus}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   RESULTS VIEW
   ═══════════════════════════════════════════════════════════ */
function ResultsView() {
  const { sgpa, cgpa, semester, subjects } = resultsData;

  return (
    <div style={s.page}>
      {/* GPA Header */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Card style={s.gpaCard}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'hsl(var(--text-muted))' }}>SGPA</div>
            <div style={s.gpaValue}>{sgpa}</div>
            <div style={{ fontSize: '14px', color: 'hsl(var(--text-muted))', marginTop: '4px' }}>{semester}</div>
          </div>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'hsl(var(--primary) / 0.1)', display: 'grid', placeItems: 'center' }}>
            <Award size={28} color="hsl(var(--primary))" />
          </div>
        </Card>
        <Card style={s.gpaCard}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'hsl(var(--text-muted))' }}>CGPA</div>
            <div style={{ ...s.gpaValue, color: 'hsl(var(--info))' }}>{cgpa}</div>
            <div style={{ fontSize: '14px', color: 'hsl(var(--text-muted))', marginTop: '4px' }}>Cumulative</div>
          </div>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'hsl(var(--info) / 0.1)', display: 'grid', placeItems: 'center' }}>
            <TrendingUp size={28} color="hsl(var(--info))" />
          </div>
        </Card>
      </div>

      {/* Results Table */}
      <Card padding={false}>
        <div style={{ ...s.tableHeader, gridTemplateColumns: '1.3fr 0.5fr 0.7fr 0.5fr' }}>
          <span>Subject</span><span>Grade</span><span>Marks</span><span>Credits</span>
        </div>
        {subjects.map((sub, i) => (
          <div key={sub.name} style={{ ...s.tableRow, gridTemplateColumns: '1.3fr 0.5fr 0.7fr 0.5fr', animation: `fadeInUp 0.3s ease ${i * 0.06}s both` }}>
            <span style={{ fontWeight: 700 }}>{sub.name}</span>
            <span style={{ fontWeight: 750, color: sub.grade.startsWith('A') ? 'hsl(var(--success))' : sub.grade.startsWith('B') ? 'hsl(var(--warning))' : 'hsl(var(--text-main))' }}>
              {sub.grade}
            </span>
            <div>
              <span style={{ fontWeight: 700 }}>{sub.marks}</span>
              <span style={{ color: 'hsl(var(--text-muted))' }}>/{sub.total}</span>
              <div style={{ ...s.progressBar, marginTop: '6px' }}>
                <div style={s.progressFill(`${sub.marks}%`, sub.marks >= 85 ? 'hsl(var(--success))' : sub.marks >= 70 ? 'hsl(var(--warning))' : 'hsl(var(--danger))')} />
              </div>
            </div>
            <span style={{ fontWeight: 650 }}>{sub.credits}</span>
          </div>
        ))}
        <div style={{ padding: '16px', borderTop: '1px solid hsl(var(--border))', display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
          <span>Total Credits: {subjects.reduce((s, sub) => s + sub.credits, 0)}</span>
          <span>Grade Points: {(sgpa * subjects.reduce((s, sub) => s + sub.credits, 0)).toFixed(0)}</span>
        </div>
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   RESOURCES VIEW
   ═══════════════════════════════════════════════════════════ */
function ResourcesView({ showToast }) {
  const iconMap = {
    pdf: { bg: 'hsl(var(--danger) / 0.1)', color: 'hsl(var(--danger))', icon: <FileText size={22} /> },
    video: { bg: 'hsl(var(--info) / 0.1)', color: 'hsl(var(--info))', icon: <Eye size={22} /> },
    link: { bg: 'hsl(var(--success) / 0.1)', color: 'hsl(var(--success))', icon: <BookOpen size={22} /> },
  };

  return (
    <div style={s.page}>
      <div style={s.cardStack}>
        {resourcesData.map((res, i) => {
          const ic = iconMap[res.type] || iconMap.link;
          return (
            <Card key={res.id} hover style={s.resourceCard(i)}>
              <div style={{ ...s.resourceIcon(ic.bg), color: ic.color }}>{ic.icon}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '15px', color: 'hsl(var(--text-main))' }}>{res.title}</div>
                <div style={{ fontSize: '13px', color: 'hsl(var(--text-muted))', marginTop: '2px' }}>
                  {res.course} · {res.size} · {res.uploader}
                </div>
              </div>
              <Button variant="ghost" size="sm" icon={<Download size={14} />}
                onClick={() => showToast(`Downloaded: ${res.title}`)}>
                Download
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAYMENTS VIEW
   ═══════════════════════════════════════════════════════════ */
function PaymentsView({ payments, setPayments, showToast }) {
  const due = payments.filter(p => p.status === 'due');
  const dueTotal = due.reduce((s, p) => s + p.amount, 0);
  const paidTotal = payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);

  const payDues = (id) => {
    const ids = id ? [id] : due.map(p => p.id);
    if (!ids.length) return showToast('No pending dues left.');
    setPayments(prev => prev.map(p => ids.includes(p.id) ? { ...p, status: 'paid', meta: 'Paid just now', method: `Receipt CC-${1200 + p.id}` } : p));
    showToast(id ? 'Payment completed and receipt generated.' : 'All pending dues were paid.');
  };

  return (
    <div style={s.page}>
      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {[
          { label: 'Total Due', value: fmt(dueTotal), color: 'hsl(var(--warning))', icon: <AlertCircle size={20} /> },
          { label: 'Paid This Term', value: fmt(paidTotal), color: 'hsl(var(--success))', icon: <CheckCircle2 size={20} /> },
          { label: 'Next Deadline', value: due.length ? 'May 28' : 'None', color: 'hsl(var(--info))', icon: <Calendar size={20} /> },
        ].map((c, i) => (
          <Card key={c.label} style={{ padding: '20px', animation: `fadeInUp 0.3s ease ${i * 0.06}s both` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: `${c.color.replace(')', ' / 0.1)')}`, display: 'grid', placeItems: 'center', color: c.color }}>
                {c.icon}
              </div>
              <span style={s.statLabel}>{c.label}</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.04em', color: 'hsl(var(--text-main))' }}>{c.value}</div>
          </Card>
        ))}
      </div>

      {/* Ledger */}
      <div style={s.sectionHeader}>
        <h3 style={s.sectionTitle}>Fee Ledger</h3>
        <Button variant="primary" size="sm" onClick={() => payDues()} disabled={!due.length}>Pay All Dues</Button>
      </div>
      <div style={s.cardStack}>
        {payments.map((p, i) => (
          <Card key={p.id} style={s.paymentRow(i)}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '15px', color: 'hsl(var(--text-main))', marginBottom: '4px' }}>{p.label}</div>
              <div style={{ fontSize: '13px', color: 'hsl(var(--text-muted))' }}>{p.meta} · {p.method}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Badge variant={p.status === 'due' ? 'due' : 'paid'}>{p.status}</Badge>
              <span style={s.amount}>{fmt(p.amount)}</span>
              {p.status === 'due' && (
                <Button variant="solid" size="sm" onClick={() => payDues(p.id)}>Pay</Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   NOTIFICATIONS VIEW
   ═══════════════════════════════════════════════════════════ */
function NotificationsView({ notifications, setNotifications, showToast }) {
  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true, tag: n.tag === 'alert' ? 'alert' : 'read' })));
    showToast('All notifications marked as read.');
  };

  const toggleRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read, tag: n.read ? 'new' : 'read' } : n));
  };

  return (
    <div style={s.page}>
      <div style={s.sectionHeader}>
        <h3 style={s.sectionTitle}>Notifications</h3>
        <Button variant="ghost" size="sm" onClick={markAllRead}>Mark all read</Button>
      </div>

      <div style={s.cardStack}>
        {notifications.map((n, i) => (
          <Card key={n.id} style={s.notifCard(n.read, i)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: n.read ? 600 : 750, fontSize: '15px', color: 'hsl(var(--text-main))' }}>{n.title}</div>
                <div style={{ fontSize: '13px', color: 'hsl(var(--text-muted))', marginTop: '4px' }}>
                  {n.meta} · {n.audience}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Badge variant={n.read ? 'read' : n.tag}>{n.read ? 'read' : n.tag}</Badge>
                <Button variant="ghost" size="sm" onClick={() => toggleRead(n.id)}>
                  {n.read ? 'Unread' : 'Read'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {notifications.length === 0 && (
        <Card style={{ textAlign: 'center', padding: '48px', color: 'hsl(var(--text-muted))' }}>
          <Bell size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
          <p>No notifications</p>
        </Card>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SUPPORT VIEW
   ═══════════════════════════════════════════════════════════ */
function SupportView({ requests, setRequests, showToast }) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [dept, setDept] = useState('Student Services');
  const [desc, setDesc] = useState('');

  const submit = () => {
    if (!title.trim() || !desc.trim()) return;
    setRequests(prev => [{ id: Date.now(), title, status: 'new', owner: dept, eta: 'Today', detail: desc }, ...prev]);
    showToast('Support request created.');
    setTitle(''); setDesc(''); setShowForm(false);
  };

  const steps = ['Ticket received', 'Department assigned', 'Under review', 'Resolution expected'];

  return (
    <div style={s.page}>
      <div style={s.twoCol}>
        {/* Requests List */}
        <div>
          <div style={{ ...s.sectionHeader, marginBottom: '16px' }}>
            <h3 style={s.sectionTitle}>Open Requests</h3>
            <Button variant="primary" size="sm" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Close' : 'New Request'}
            </Button>
          </div>

          {showForm && (
            <Card style={{ ...s.supportForm, marginBottom: '16px', animation: 'fadeInUp 0.3s ease both' }}>
              <input style={s.input} value={title} onChange={e => setTitle(e.target.value)} placeholder="Request title" />
              <select style={s.select} value={dept} onChange={e => setDept(e.target.value)}>
                <option>Student Services</option>
                <option>Facilities</option>
                <option>Accounts</option>
                <option>Examination Cell</option>
              </select>
              <textarea style={s.textarea} value={desc} onChange={e => setDesc(e.target.value)} placeholder="Describe your request..." />
              <Button variant="primary" fullWidth onClick={submit} disabled={!title.trim() || !desc.trim()}>Submit Request</Button>
            </Card>
          )}

          <div style={s.cardStack}>
            {requests.map((r, i) => (
              <Card key={r.id} hover style={{ padding: '16px', animation: `fadeInUp 0.3s ease ${i * 0.05}s both` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '15px', color: 'hsl(var(--text-main))', marginBottom: '4px' }}>{r.title}</div>
                    <div style={{ fontSize: '13px', color: 'hsl(var(--text-muted))' }}>{r.owner} · ETA {r.eta} · {r.detail}</div>
                  </div>
                  <Badge variant={r.status === 'resolved' ? 'resolved' : r.status === 'new' ? 'new' : 'open'}>{r.status}</Badge>
                </div>
              </Card>
            ))}
            {requests.length === 0 && (
              <Card style={{ textAlign: 'center', padding: '48px', color: 'hsl(var(--text-muted))' }}>
                <p>No support requests</p>
              </Card>
            )}
          </div>
        </div>

        {/* Service Timeline */}
        <div>
          <h3 style={{ ...s.sectionTitle, marginBottom: '16px' }}>Service Timeline</h3>
          <Card style={{ padding: '24px' }}>
            {steps.map((step, i) => (
              <div key={step} style={{ display: 'flex', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={s.timelineDot(i < 2)} />
                  {i < steps.length - 1 && <div style={s.timelineLine} />}
                </div>
                <div style={{ paddingBottom: i < steps.length - 1 ? '24px' : 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: i < 2 ? 'hsl(var(--text-main))' : 'hsl(var(--text-muted))' }}>{step}</div>
                  <div style={{ fontSize: '12px', color: 'hsl(var(--text-muted))', marginTop: '2px' }}>{i === 0 ? 'Logged today' : 'Campus support queue'}</div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
