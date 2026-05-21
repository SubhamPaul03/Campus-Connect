import { useMemo, useState } from 'react';
import { BarChart3, Bell, Building2, CreditCard, HeadphonesIcon, Plus, Search, ShieldCheck, Users } from 'lucide-react';
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

export default function AdminDashboard() {
  const {
    activeTab,
    students,
    setStudents,
    departments,
    payments,
    setPayments,
    notifications,
    setNotifications,
    requests,
    setRequests,
    showToast,
  } = useApp();
  const dues = useMemo(() => payments.filter((payment) => payment.status !== 'paid'), [payments]);
  const totalDue = dues.reduce((sum, payment) => sum + payment.amount, 0);

  switch (activeTab) {
    case 'users':
      return <UsersView students={students} setStudents={setStudents} showToast={showToast} />;
    case 'departments':
      return <DepartmentsView departments={departments} setDepartments={setDepartments} showToast={showToast} />;
    case 'analytics':
      return <AnalyticsView students={students} departments={departments} payments={payments} />;
    case 'notices':
      return <NoticesView notifications={notifications} setNotifications={setNotifications} showToast={showToast} />;
    case 'fees':
      return <FeesView payments={payments} setPayments={setPayments} totalDue={totalDue} showToast={showToast} />;
    case 'support':
      return <SupportQueue requests={requests} setRequests={setRequests} showToast={showToast} />;
    case 'dashboard':
    default:
      return (
        <div style={page}>
          <div style={autoGrid}>
            <StatCard icon={<Users size={20} />} label="Users" value={students.length} meta="Students in mock directory" />
            <StatCard icon={<Building2 size={20} />} label="Departments" value={departments.length} meta="Academic units" accent="hsl(var(--info))" />
            <StatCard icon={<CreditCard size={20} />} label="Open Dues" value={`Rs. ${totalDue.toLocaleString('en-IN')}`} meta={`${dues.length} pending ledgers`} accent="hsl(var(--warning))" />
            <StatCard icon={<HeadphonesIcon size={20} />} label="Support Queue" value={requests.length} meta="Open service requests" accent="hsl(var(--danger))" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(280px, 0.8fr)', gap: 16 }}>
            <Card>
              <SectionTitle icon={<BarChart3 size={18} />} title="Department Size" />
              <MiniBarChart data={departments.map((item) => ({ label: item.code, value: item.students, color: item.color }))} />
            </Card>
            <Card>
              <SectionTitle icon={<ShieldCheck size={18} />} title="Scalability Backlog" />
              <div style={list}>
                {['Role permissions', 'Parent portal', 'QR attendance', 'AI analytics'].map((item) => (
                  <div key={item} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                    <span>{item}</span>
                    <Badge variant="open">ready</Badge>
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

function UsersView({ students, setStudents, showToast }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', department: 'Computer Science', semester: 1 });
  const filtered = students.filter((student) => {
    const haystack = `${student.name} ${student.email} ${student.department} ${student.rollNo}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  const addUser = () => {
    if (!form.name.trim() || !form.email.includes('@')) {
      showToast?.('Enter a valid name and email.', 'error');
      return;
    }

    const nextNumber = students.length + 1;
    setStudents((prev) => [
      {
        id: `STU${Date.now()}`,
        name: form.name.trim(),
        email: form.email.trim(),
        department: form.department,
        semester: Number(form.semester) || 1,
        rollNo: `${form.department.slice(0, 2).toUpperCase()}2026-${String(nextNumber).padStart(3, '0')}`,
        attendance: 100,
        avatar: null,
        phone: '',
        dob: '',
        bloodGroup: '',
        address: '',
      },
      ...prev,
    ]);
    setForm({ name: '', email: '', department: 'Computer Science', semester: 1 });
    setOpen(false);
    showToast?.('User added.');
  };

  return (
    <div style={page}>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Card style={{ flex: 1, minWidth: 240, display: 'flex', alignItems: 'center', gap: 12, padding: 12 }}>
          <Search size={18} color="hsl(var(--text-muted))" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search users, departments, or roll numbers"
            style={{ flex: 1, border: 0, outline: 0, background: 'transparent', minHeight: 34 }}
          />
        </Card>
        <Button icon={<Plus size={16} />} onClick={() => setOpen(true)}>
          Add User
        </Button>
      </div>
      <div style={list}>
        {filtered.map((student) => (
          <Card key={student.id} hover style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 16, alignItems: 'center' }}>
            <div>
              <strong>{student.name}</strong>
              <div style={{ color: 'hsl(var(--text-muted))', fontSize: 13 }}>{student.email}</div>
            </div>
            <Badge variant="info">{student.department}</Badge>
            <Badge variant={student.attendance < 75 ? 'alert' : 'paid'}>{student.attendance}%</Badge>
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Add User">
        <div style={{ display: 'grid', gap: 14 }}>
          <Input label="Full Name" value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
          <Input label="Email" type="email" value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} />
          <Input label="Department" value={form.department} onChange={(event) => setForm((prev) => ({ ...prev, department: event.target.value }))} />
          <Input label="Semester" type="number" value={form.semester} onChange={(event) => setForm((prev) => ({ ...prev, semester: event.target.value }))} />
          <Button onClick={addUser} fullWidth>Create User</Button>
        </div>
      </Modal>
    </div>
  );
}

function DepartmentsView({ departments, setDepartments, showToast }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', code: '', head: '', faculty: 8, students: 120, courses: 16 });

  const addDepartment = () => {
    if (!form.name.trim() || !form.code.trim()) {
      showToast?.('Department name and code are required.', 'error');
      return;
    }

    setDepartments((prev) => [
      {
        id: `DEPT${Date.now()}`,
        name: form.name.trim(),
        code: form.code.trim().toUpperCase(),
        head: form.head.trim() || 'Department Head',
        faculty: Number(form.faculty) || 0,
        students: Number(form.students) || 0,
        courses: Number(form.courses) || 0,
        color: 'hsl(var(--primary))',
      },
      ...prev,
    ]);
    setForm({ name: '', code: '', head: '', faculty: 8, students: 120, courses: 16 });
    setOpen(false);
    showToast?.('Department added.');
  };

  return (
    <div style={page}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button icon={<Plus size={16} />} onClick={() => setOpen(true)}>Add Department</Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
        {departments.map((department) => (
          <Card key={department.id} hover style={{ borderTop: `3px solid ${department.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <strong>{department.name}</strong>
                <div style={{ color: 'hsl(var(--text-muted))', fontSize: 13, marginTop: 4 }}>{department.head}</div>
              </div>
              <Badge variant="info">{department.code}</Badge>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 18 }}>
              <Metric label="Faculty" value={department.faculty} />
              <Metric label="Students" value={department.students} />
              <Metric label="Courses" value={department.courses} />
            </div>
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Add Department">
        <div style={{ display: 'grid', gap: 14 }}>
          <Input label="Department Name" value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
          <Input label="Code" value={form.code} onChange={(event) => setForm((prev) => ({ ...prev, code: event.target.value }))} />
          <Input label="Head" value={form.head} onChange={(event) => setForm((prev) => ({ ...prev, head: event.target.value }))} />
          <Input label="Faculty" type="number" value={form.faculty} onChange={(event) => setForm((prev) => ({ ...prev, faculty: event.target.value }))} />
          <Input label="Students" type="number" value={form.students} onChange={(event) => setForm((prev) => ({ ...prev, students: event.target.value }))} />
          <Input label="Courses" type="number" value={form.courses} onChange={(event) => setForm((prev) => ({ ...prev, courses: event.target.value }))} />
          <Button onClick={addDepartment} fullWidth>Create Department</Button>
        </div>
      </Modal>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div style={{ padding: 12, borderRadius: 'var(--radius-sm)', background: 'hsl(var(--bg-hover))' }}>
      <strong>{value}</strong>
      <div style={{ color: 'hsl(var(--text-muted))', fontSize: 12 }}>{label}</div>
    </div>
  );
}

function AnalyticsView({ students, departments, payments }) {
  const paid = payments.filter((payment) => payment.status === 'paid').reduce((sum, payment) => sum + payment.amount, 0);
  const due = payments.filter((payment) => payment.status !== 'paid').reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div style={page}>
      <div style={autoGrid}>
        <StatCard label="Average Attendance" value={`${Math.round(students.reduce((sum, item) => sum + item.attendance, 0) / students.length)}%`} />
        <StatCard label="Fee Collected" value={`Rs. ${paid.toLocaleString('en-IN')}`} accent="hsl(var(--success))" />
        <StatCard label="Fee Outstanding" value={`Rs. ${due.toLocaleString('en-IN')}`} accent="hsl(var(--warning))" />
      </div>
      <Card>
        <SectionTitle icon={<BarChart3 size={18} />} title="Students by Department" />
        <MiniBarChart data={departments.map((item) => ({ label: item.code, value: item.students, color: item.color }))} height={150} />
      </Card>
    </div>
  );
}

function NoticesView({ notifications, setNotifications, showToast }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', audience: 'All Students', priority: 'medium', meta: 'Admin Office' });

  const publishNotice = () => {
    if (!form.title.trim()) {
      showToast?.('Notice title is required.', 'error');
      return;
    }

    setNotifications((prev) => [
      {
        id: `NOTIF${Date.now()}`,
        title: form.title.trim(),
        tag: form.priority === 'high' ? 'alert' : 'new',
        meta: form.meta.trim() || 'Admin Office',
        audience: form.audience.trim() || 'All Students',
        read: false,
        createdAt: new Date().toISOString(),
        priority: form.priority,
      },
      ...prev,
    ]);
    setForm({ title: '', audience: 'All Students', priority: 'medium', meta: 'Admin Office' });
    setOpen(false);
    showToast?.('Notice published.');
  };

  return (
    <div style={page}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button icon={<Bell size={16} />} onClick={() => setOpen(true)}>
          Publish Notice
        </Button>
      </div>
      <div style={list}>
        {notifications.map((notice) => (
          <Card key={notice.id} hover style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
            <div>
              <strong>{notice.title}</strong>
              <div style={{ color: 'hsl(var(--text-muted))', fontSize: 13, marginTop: 4 }}>{notice.meta} - {notice.audience}</div>
            </div>
            <Badge variant={notice.read ? 'read' : notice.tag}>{notice.read ? 'read' : notice.tag}</Badge>
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Publish Notice">
        <div style={{ display: 'grid', gap: 14 }}>
          <Input label="Title" value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} />
          <Input label="Source" value={form.meta} onChange={(event) => setForm((prev) => ({ ...prev, meta: event.target.value }))} />
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

function FeesView({ payments, setPayments, totalDue, showToast }) {
  const collectPayment = (payment) => {
    if (payment.status === 'paid') {
      showToast?.(`Receipt opened for ${payment.label}.`, 'info');
      return;
    }

    setPayments((prev) => prev.map((item) => item.id === payment.id ? {
      ...item,
      status: 'paid',
      meta: 'Collected by admin desk',
      method: `Receipt CC-${Date.now().toString().slice(-5)}`,
    } : item));
    showToast?.('Payment collected and receipt generated.');
  };

  return (
    <div style={page}>
      <StatCard icon={<CreditCard size={20} />} label="Outstanding Balance" value={`Rs. ${totalDue.toLocaleString('en-IN')}`} meta="Across open fee ledgers" accent="hsl(var(--warning))" />
      <div style={list}>
        {payments.map((payment) => (
          <Card key={payment.id} hover style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 16, alignItems: 'center' }}>
            <div>
              <strong>{payment.label}</strong>
              <div style={{ color: 'hsl(var(--text-muted))', fontSize: 13 }}>{payment.meta}</div>
            </div>
            <strong>Rs. {payment.amount.toLocaleString('en-IN')}</strong>
            <Button size="sm" variant={payment.status === 'paid' ? 'ghost' : 'primary'} onClick={() => collectPayment(payment)}>
              {payment.status === 'paid' ? 'Receipt' : 'Collect'}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

function SupportQueue({ requests, setRequests, showToast }) {
  const updateStatus = (id, status) => {
    setRequests((prev) => prev.map((request) => request.id === id ? { ...request, status, eta: status === 'resolved' ? 'Complete' : request.eta } : request));
    showToast?.(`Request marked ${status}.`);
  };

  if (!requests.length) {
    return <EmptyState icon={<HeadphonesIcon size={24} />} title="Support queue is clear" description="New student and staff requests will appear here." />;
  }

  return (
    <div style={page}>
      {requests.map((request) => (
        <Card key={request.id} hover style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center' }}>
          <div>
            <strong>{request.title}</strong>
            <div style={{ color: 'hsl(var(--text-muted))', fontSize: 13, marginTop: 4 }}>{request.owner} - ETA {request.eta} - {request.detail}</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Badge variant={request.status === 'resolved' ? 'resolved' : request.status}>{request.status}</Badge>
            {request.status !== 'resolved' && (
              <Button size="sm" variant="ghost" onClick={() => updateStatus(request.id, 'resolved')}>Resolve</Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
