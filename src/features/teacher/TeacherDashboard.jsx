import { useMemo, useState } from 'react';
import { BarChart3, Bell, Calendar, CheckCircle2, ClipboardList, Megaphone, Plus, Search, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import MiniBarChart from '../../components/ui/MiniBarChart';
import StatCard from '../../components/ui/StatCard';

const page = { display: 'grid', gap: 16, animation: 'fadeInUp 0.35s ease both' };
const autoGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 };
const list = { display: 'grid', gap: 12 };

export default function TeacherDashboard() {
  const {
    activeTab,
    students,
    classes,
    setClasses,
    assignments,
    setAssignments,
    notifications,
    setNotifications,
    showToast,
  } = useApp();
  const lowAttendance = useMemo(() => students.filter((student) => student.attendance < 75), [students]);
  const submitted = assignments.filter((assignment) => assignment.status === 'submitted' || assignment.status === 'graded').length;

  switch (activeTab) {
    case 'roster':
      return <RosterView students={students} />;
    case 'assignments':
      return <AssignmentView assignments={assignments} setAssignments={setAssignments} showToast={showToast} />;
    case 'schedule':
      return <ScheduleView classes={classes} setClasses={setClasses} showToast={showToast} />;
    case 'performance':
      return <PerformanceView students={students} lowAttendance={lowAttendance} />;
    case 'announcements':
      return <AnnouncementsView notifications={notifications} setNotifications={setNotifications} showToast={showToast} />;
    case 'dashboard':
    default:
      return (
        <div style={page}>
          <div style={autoGrid}>
            <StatCard icon={<Users size={20} />} label="Active Students" value={students.length} meta="Across assigned sections" />
            <StatCard icon={<Calendar size={20} />} label="Classes Today" value={classes.length} meta={`${classes.filter((item) => !item.marked).length} pending attendance`} accent="hsl(var(--info))" />
            <StatCard icon={<ClipboardList size={20} />} label="Assignments" value={assignments.length} meta={`${submitted} reviewed or submitted`} accent="hsl(var(--warning))" />
            <StatCard icon={<Bell size={20} />} label="Attendance Alerts" value={lowAttendance.length} meta="Below institutional threshold" accent="hsl(var(--danger))" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) minmax(280px, 0.7fr)', gap: 16 }}>
            <Card>
              <SectionTitle icon={<BarChart3 size={18} />} title="Class Health" />
              <MiniBarChart
                data={classes.map((item) => ({
                  label: item.course.split(' ')[0],
                  value: item.attendance,
                  color: item.attendance < 40 ? 'hsl(var(--danger))' : 'hsl(var(--primary))',
                }))}
              />
            </Card>
            <Card>
              <SectionTitle icon={<CheckCircle2 size={18} />} title="Priority Actions" />
              <div style={list}>
                {[
                  `${classes.filter((item) => !item.marked).length} attendance sessions pending`,
                  `${assignments.filter((item) => item.status === 'pending').length} assignment drafts due`,
                  `${lowAttendance.length} students need intervention`,
                ].map((item) => (
                  <div key={item} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, color: 'hsl(var(--text-muted))' }}>
                    <span>{item}</span>
                    <Badge variant="info">today</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      );
  }
}

function SectionTitle({ icon, title, action }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 16 }}>
      <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8, fontSize: 16 }}>
        {icon}
        {title}
      </h3>
      {action}
    </div>
  );
}

function RosterView({ students }) {
  const [query, setQuery] = useState('');
  const filtered = students.filter((student) => {
    const haystack = `${student.name} ${student.rollNo} ${student.department}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  return (
    <div style={page}>
      <Card style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12 }}>
        <Search size={18} color="hsl(var(--text-muted))" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search students, roll numbers, or departments"
          style={{ flex: 1, border: 0, outline: 0, background: 'transparent', minHeight: 34 }}
        />
      </Card>
      <div style={list}>
        {filtered.map((student) => (
          <Card key={student.id} hover style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 16, alignItems: 'center' }}>
            <div>
              <strong>{student.name}</strong>
              <div style={{ color: 'hsl(var(--text-muted))', fontSize: 13 }}>{student.rollNo} - {student.department}</div>
            </div>
            <span style={{ color: 'hsl(var(--text-muted))', fontSize: 13 }}>Sem {student.semester}</span>
            <Badge variant={student.attendance < 75 ? 'alert' : 'paid'}>{student.attendance}%</Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AssignmentView({ assignments, setAssignments, showToast }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', course: '', dueDate: '', totalMarks: 50, description: '' });

  const createAssignment = () => {
    if (!form.title.trim() || !form.course.trim() || !form.dueDate) {
      showToast?.('Please fill title, course, and due date.', 'error');
      return;
    }

    setAssignments((prev) => [
      {
        id: `ASG${Date.now()}`,
        title: form.title.trim(),
        course: form.course.trim(),
        dueDate: form.dueDate,
        status: 'pending',
        marks: null,
        totalMarks: Number(form.totalMarks) || 50,
        description: form.description.trim() || 'Assignment details will be shared in class.',
      },
      ...prev,
    ]);
    setForm({ title: '', course: '', dueDate: '', totalMarks: 50, description: '' });
    setOpen(false);
    showToast?.('Assignment published.');
  };

  return (
    <div style={page}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button icon={<Plus size={16} />} onClick={() => setOpen(true)}>
          New Assignment
        </Button>
      </div>
      <div style={list}>
        {assignments.map((assignment) => (
          <Card key={assignment.id} hover>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'start' }}>
              <div>
                <strong>{assignment.title}</strong>
                <p style={{ margin: '6px 0 0', color: 'hsl(var(--text-muted))', fontSize: 13, lineHeight: 1.5 }}>
                  {assignment.course} - Due {assignment.dueDate}
                </p>
              </div>
              <Badge variant={assignment.status}>{assignment.status}</Badge>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="New Assignment">
        <div style={{ display: 'grid', gap: 14 }}>
          <Input label="Title" value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} />
          <Input label="Course" value={form.course} onChange={(event) => setForm((prev) => ({ ...prev, course: event.target.value }))} />
          <Input label="Due Date" type="date" value={form.dueDate} onChange={(event) => setForm((prev) => ({ ...prev, dueDate: event.target.value }))} />
          <Input label="Total Marks" type="number" value={form.totalMarks} onChange={(event) => setForm((prev) => ({ ...prev, totalMarks: event.target.value }))} />
          <Input label="Description" textarea value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} />
          <Button onClick={createAssignment} fullWidth>Publish Assignment</Button>
        </div>
      </Modal>
    </div>
  );
}

function ScheduleView({ classes, setClasses, showToast }) {
  const markAttendance = (id) => {
    setClasses((prev) => prev.map((item) => item.id === id ? { ...item, marked: true, attendance: Math.min(item.attendance + 1, 100) } : item));
    showToast?.('Attendance marked for this class.');
  };

  return (
    <div style={page}>
      {classes.map((item) => (
        <Card key={item.id} hover style={{ display: 'grid', gridTemplateColumns: '96px 1fr auto', gap: 16, alignItems: 'center' }}>
          <strong>{item.time}</strong>
          <div>
            <strong>{item.course}</strong>
            <div style={{ color: 'hsl(var(--text-muted))', fontSize: 13 }}>{item.room} - {item.day} - {item.type}</div>
          </div>
          <Button size="sm" variant={item.marked ? 'ghost' : 'primary'} onClick={() => item.marked ? showToast?.('Attendance already marked.', 'info') : markAttendance(item.id)}>
            {item.marked ? 'Review' : 'Mark'}
          </Button>
        </Card>
      ))}
    </div>
  );
}

function PerformanceView({ students, lowAttendance }) {
  const chart = [
    { label: '90+', value: students.filter((item) => item.attendance >= 90).length, color: 'hsl(var(--success))' },
    { label: '75-89', value: students.filter((item) => item.attendance >= 75 && item.attendance < 90).length, color: 'hsl(var(--info))' },
    { label: '<75', value: lowAttendance.length, color: 'hsl(var(--danger))' },
  ];

  return (
    <div style={page}>
      <Card>
        <SectionTitle icon={<BarChart3 size={18} />} title="Attendance Distribution" />
        <MiniBarChart data={chart} />
      </Card>
      {lowAttendance.length ? (
        <div style={list}>
          {lowAttendance.map((student) => (
            <Card key={student.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <span>{student.name}</span>
              <Badge variant="alert">{student.attendance}% attendance</Badge>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No attendance risks" description="All assigned students are above the attendance threshold." />
      )}
    </div>
  );
}

function AnnouncementsView({ notifications, setNotifications, showToast }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', audience: 'All Students', priority: 'medium' });

  const publishNotice = () => {
    if (!form.title.trim()) {
      showToast?.('Please enter an announcement title.', 'error');
      return;
    }

    setNotifications((prev) => [
      {
        id: `NOTIF${Date.now()}`,
        title: form.title.trim(),
        tag: form.priority === 'high' ? 'alert' : 'new',
        meta: 'Faculty Desk',
        audience: form.audience,
        read: false,
        createdAt: new Date().toISOString(),
        priority: form.priority,
      },
      ...prev,
    ]);
    setForm({ title: '', audience: 'All Students', priority: 'medium' });
    setOpen(false);
    showToast?.('Announcement published.');
  };

  return (
    <div style={page}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button icon={<Megaphone size={16} />} onClick={() => setOpen(true)}>
          Create Notice
        </Button>
      </div>
      <div style={list}>
        {notifications.map((item) => (
          <Card key={item.id} hover style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
            <div>
              <strong>{item.title}</strong>
              <div style={{ color: 'hsl(var(--text-muted))', fontSize: 13, marginTop: 4 }}>{item.meta} - {item.audience}</div>
            </div>
            <Badge variant={item.priority === 'high' ? 'alert' : 'info'}>{item.priority}</Badge>
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Create Announcement">
        <div style={{ display: 'grid', gap: 14 }}>
          <Input label="Title" value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} />
          <Input label="Audience" value={form.audience} onChange={(event) => setForm((prev) => ({ ...prev, audience: event.target.value }))} />
          <label style={{ display: 'grid', gap: 6, fontSize: 13, fontWeight: 650 }}>
            Priority
            <select
              value={form.priority}
              onChange={(event) => setForm((prev) => ({ ...prev, priority: event.target.value }))}
              style={{ minHeight: 42, border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius-sm)', background: 'hsl(var(--bg-app))', padding: '0 12px' }}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
          <Button onClick={publishNotice} fullWidth>Publish</Button>
        </div>
      </Modal>
    </div>
  );
}
