import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import {
  mockPayments,
  mockNotifications,
  mockClasses,
  mockRequests,
  mockStudents,
  mockDepartments,
  mockMessages,
  mockEvents,
  mockAssignments,
  mockExams,
  mockResults,
  mockResources,
} from '../mock/database';
import { getServerState, saveServerState } from '../services/apiClient';

const AppContext = createContext(null);
const STORAGE_PREFIX = 'campus-connect:';

function readStoredValue(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const value = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function usePersistentState(key, fallback) {
  const [value, setValue] = useState(() => readStoredValue(key, fallback));

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
    } catch {}
  }, [key, value]);

  return [value, setValue];
}

export function AppProvider({ children }) {
  const [apiStatus, setApiStatus] = useState('checking');
  const hasLoadedServerState = useRef(false);
  const saveTimer = useRef(null);
  // ── Theme ──────────────────────────────────────────────
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('cc-theme');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {}
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('cc-theme', theme);
    } catch {}
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  }, []);

  // ── User ───────────────────────────────────────────────
  const [user, setUser] = usePersistentState('user', null);

  // ── Navigation ─────────────────────────────────────────
  const [activeTab, setActiveTab] = usePersistentState('active-tab', 'dashboard');

  // ── Data States (from mock) ────────────────────────────
  const [payments, setPayments] = usePersistentState('payments', mockPayments);
  const [notifications, setNotifications] = usePersistentState('notifications', mockNotifications);
  const [classes, setClasses] = usePersistentState('classes', mockClasses);
  const [requests, setRequests] = usePersistentState('requests', mockRequests);
  const [students, setStudents] = usePersistentState('students', mockStudents);
  const [departments, setDepartments] = usePersistentState('departments', mockDepartments);
  const [messages, setMessages] = usePersistentState('messages', mockMessages);
  const [events, setEvents] = usePersistentState('events', mockEvents.map((event) => ({ ...event, joined: false })));
  const [assignments, setAssignments] = usePersistentState('assignments', mockAssignments);
  const [exams] = usePersistentState('exams', mockExams);
  const [results] = usePersistentState('results', mockResults);
  const [resources] = usePersistentState('resources', mockResources);

  useEffect(() => {
    let cancelled = false;

    async function loadServerState() {
      try {
        const serverState = await getServerState();
        if (cancelled) return;

        if (serverState.payments?.length) setPayments(serverState.payments);
        if (serverState.notifications?.length) setNotifications(serverState.notifications);
        if (serverState.classes?.length) setClasses(serverState.classes);
        if (serverState.requests?.length) setRequests(serverState.requests);
        if (serverState.students?.length) setStudents(serverState.students);
        if (serverState.departments?.length) setDepartments(serverState.departments);
        if (serverState.messages?.length) setMessages(serverState.messages);
        if (serverState.events?.length) setEvents(serverState.events);
        if (serverState.assignments?.length) setAssignments(serverState.assignments);

        hasLoadedServerState.current = true;
        setApiStatus('online');
      } catch {
        hasLoadedServerState.current = true;
        setApiStatus('offline');
      }
    }

    loadServerState();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hasLoadedServerState.current || apiStatus !== 'online') return;

    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await saveServerState({
          payments,
          notifications,
          classes,
          requests,
          students,
          departments,
          messages,
          events,
          assignments,
        });
        setApiStatus('online');
      } catch {
        setApiStatus('offline');
      }
    }, 350);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [apiStatus, payments, notifications, classes, requests, students, departments, messages, events, assignments]);

  // ── Toast Notification System ──────────────────────────
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  // ── Search / Filter ────────────────────────────────────
  const [searchQuery, setSearchQuery] = usePersistentState('search-query', '');

  // ── Context Value ──────────────────────────────────────
  const value = {
    theme,
    toggleTheme,
    user,
    setUser,
    activeTab,
    setActiveTab,
    payments,
    setPayments,
    notifications,
    setNotifications,
    classes,
    setClasses,
    requests,
    setRequests,
    students,
    setStudents,
    departments,
    setDepartments,
    messages,
    setMessages,
    events,
    setEvents,
    assignments,
    setAssignments,
    exams,
    results,
    resources,
    toast,
    showToast,
    apiStatus,
    searchQuery,
    setSearchQuery,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return ctx;
}

export default AppContext;
