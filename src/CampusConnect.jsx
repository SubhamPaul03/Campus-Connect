import { Suspense, lazy } from "react";
import { useApp } from "./context/AppContext";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import Sidebar from "./components/shared/Sidebar";
import Topbar from "./components/shared/Topbar";
import DigitalId from "./components/shared/DigitalId";
import RouteFallback from "./components/shared/RouteFallback";

const StudentDashboard = lazy(() => import("./features/student/StudentDashboard"));
const TeacherDashboard = lazy(() => import("./features/teacher/TeacherDashboard"));
const AdminDashboard = lazy(() => import("./features/admin/AdminDashboard"));
const ChatPanel = lazy(() => import("./features/chat/ChatPanel"));

export default function CampusConnect() {
  const { user, setUser, activeTab, setActiveTab } = useApp();
  const role = user?.role || "student";

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch {
      // Demo sessions - just clear local state
    }
    setUser(null);
    setActiveTab("dashboard");
  };

  // Render the active content based on role and tab
  const renderContent = () => {
    // Messages tab is shared across all roles
    if (activeTab === "messages") {
      return <ChatPanel />;
    }

    // ID Card tab (student only)
    if (activeTab === "idcard") {
      return (
        <div className="page-transition" style={{ maxWidth: 500, margin: "0 auto", paddingTop: 20 }}>
          <DigitalId />
        </div>
      );
    }

    // Role-specific dashboards handle their own tab routing
    switch (role) {
      case "faculty":
        return <TeacherDashboard />;
      case "admin":
        return <AdminDashboard />;
      case "student":
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar onLogout={handleLogout} />
      <main className="app-main">
        <Topbar />
        <div className="page-content" style={{ marginTop: 24 }}>
          <Suspense fallback={<RouteFallback />}>
            {renderContent()}
          </Suspense>
        </div>
      </main>
    </div>
  );
}
