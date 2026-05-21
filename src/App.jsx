import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useApp } from "./context/AppContext";
import AuthPage from "./features/auth/AuthPage";
import CampusConnect from "./CampusConnect";

export default function App() {
  const { user, setUser, theme, toast } = useApp();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && !user) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0],
          role: "student",
          department: "Computer Science",
          avatar: null,
        });
      }
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  // Show a premium loading screen while checking auth state
  if (!authChecked) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "hsl(var(--bg-app))",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 44,
              height: 44,
              border: "3px solid hsl(var(--border))",
              borderTopColor: "hsl(var(--primary))",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p
            style={{
              color: "hsl(var(--text-muted))",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Loading Campus Connect...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <AuthPage
        onLogin={(userData) => setUser(userData)}
        theme={theme}
      />
    );
  }

  return (
    <>
      <CampusConnect />
      {/* Global Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 9999,
            animation: "toastSlideIn 0.3s ease-out",
          }}
        >
          <div
            style={{
              background: toast.type === "error"
                ? "hsl(var(--danger))"
                : toast.type === "warning"
                ? "hsl(var(--warning))"
                : "hsl(var(--primary))",
              color: "#fff",
              padding: "14px 24px",
              borderRadius: "var(--radius)",
              fontSize: 14,
              fontWeight: 650,
              boxShadow: "var(--shadow-lg)",
              maxWidth: 380,
            }}
          >
            {toast.message}
          </div>
        </div>
      )}
    </>
  );
}
