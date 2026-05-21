import { useState } from "react";

const css = `
  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; min-height: 100vh; background: #f6f5f1; color: #171717; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  button, input { font: inherit; }
  .auth-shell { min-height: 100vh; display: grid; grid-template-columns: minmax(360px, 0.9fr) minmax(420px, 1.1fr); }
  .auth-panel { position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; padding: 46px; background: #10231f; color: #fff; }
  .auth-panel::before { content: ""; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(49, 148, 115, 0.28), transparent 45%), radial-gradient(circle at 70% 25%, rgba(236, 184, 77, 0.18), transparent 30%); }
  .brand, .panel-copy, .panel-grid { position: relative; z-index: 1; }
  .brand { font-size: 22px; font-weight: 800; letter-spacing: -0.03em; }
  .brand span { color: #72d0a7; }
  .panel-copy h1 { max-width: 460px; margin: 0 0 18px; font-size: clamp(42px, 5vw, 68px); line-height: 0.96; letter-spacing: -0.06em; }
  .panel-copy p { max-width: 390px; margin: 0; color: rgba(255,255,255,0.68); line-height: 1.65; }
  .panel-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
  .panel-tile { min-height: 78px; border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; padding: 14px; background: rgba(255,255,255,0.05); }
  .panel-tile strong { display: block; margin-bottom: 6px; font-size: 20px; }
  .panel-tile span { color: rgba(255,255,255,0.62); font-size: 13px; }
  .auth-main { display: flex; align-items: center; justify-content: center; padding: 36px; }
  .auth-card { width: min(100%, 430px); }
  .auth-title { margin: 0 0 8px; font-size: 34px; letter-spacing: -0.045em; }
  .auth-subtitle { margin: 0 0 28px; color: #6f716d; line-height: 1.55; }
  .role-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 22px; }
  .role-btn { min-height: 68px; border: 1px solid #d9d8d1; border-radius: 8px; background: #fff; color: #42443f; cursor: pointer; font-weight: 700; }
  .role-btn[aria-pressed="true"] { border-color: #1e7a55; color: #0d563c; background: #eaf6ef; box-shadow: 0 0 0 3px rgba(30,122,85,0.11); }
  .field { margin-bottom: 16px; }
  .field label { display: block; margin-bottom: 7px; color: #5b5e58; font-size: 12px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; }
  .field input { width: 100%; height: 48px; border: 1px solid #d9d8d1; border-radius: 8px; background: #fff; color: #171717; padding: 0 14px; outline: none; }
  .field input:focus { border-color: #1e7a55; box-shadow: 0 0 0 3px rgba(30,122,85,0.12); }
  .password-row { position: relative; }
  .password-row input { padding-right: 92px; }
  .text-btn { border: 0; background: transparent; color: #1e7a55; cursor: pointer; font-weight: 800; padding: 0; }
  .password-toggle { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); font-size: 13px; }
  .forgot-row { display: flex; justify-content: flex-end; margin: -4px 0 20px; }
  .primary-btn { width: 100%; height: 50px; border: 0; border-radius: 8px; background: #171717; color: #fff; cursor: pointer; font-weight: 800; }
  .primary-btn:disabled { cursor: progress; opacity: 0.65; }
  .switch-row { margin-top: 20px; text-align: center; color: #686b65; }
  .message { margin-bottom: 16px; border-radius: 8px; padding: 12px 14px; font-size: 14px; }
  .message.error { border: 1px solid #f0bbb5; background: #fff0ee; color: #9d2d21; }
  .message.success { border: 1px solid #b8dbc6; background: #eff9f3; color: #155d40; }
  .back-btn { margin-bottom: 26px; }
  .app-loading { min-height: 100vh; display: grid; place-items: center; color: #5b5e58; }
  @media (max-width: 860px) {
    .auth-shell { grid-template-columns: 1fr; }
    .auth-panel { min-height: 330px; padding: 30px; }
    .panel-grid { display: none; }
    .auth-main { align-items: flex-start; padding: 30px 18px 44px; }
  }
`;

const roles = ["student", "faculty", "admin"];

export default function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const clearForm = () => {
    setStatus({ type: "", text: "" });
    setName("");
    setEmail("");
    setPassword("");
  };

  const submit = async () => {
    setStatus({ type: "", text: "" });
    if (!email.trim()) return setStatus({ type: "error", text: "Enter your college email." });
    if (mode !== "reset" && password.length < 6) {
      return setStatus({ type: "error", text: "Password must be at least 6 characters." });
    }
    if (mode === "signup" && !name.trim()) return setStatus({ type: "error", text: "Enter your full name." });

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 550));
    setLoading(false);

    if (mode === "reset") {
      setStatus({ type: "success", text: "Reset link sent. Check your inbox." });
      return;
    }

    onLogin?.({
      uid: "demo-user",
      email,
      displayName: mode === "signup" ? name : email.split("@")[0],
      role,
    });
  };

  return (
    <>
      <style>{css}</style>
      <main className="auth-shell">
        <section className="auth-panel" aria-label="Campus Connect overview">
          <div className="brand">Campus<span>Connect</span></div>
          <div className="panel-copy">
            <h1>One desk for campus life.</h1>
            <p>Payments, notices, classes, attendance, events, and support requests for students, faculty, and administrators.</p>
          </div>
          <div className="panel-grid">
            <div className="panel-tile"><strong>94%</strong><span>attendance tracked</span></div>
            <div className="panel-tile"><strong>12</strong><span>new notifications</span></div>
            <div className="panel-tile"><strong>3</strong><span>payments pending</span></div>
            <div className="panel-tile"><strong>8</strong><span>active departments</span></div>
          </div>
        </section>

        <section className="auth-main">
          <div className="auth-card">
            {mode === "reset" && (
              <button className="text-btn back-btn" onClick={() => { setMode("login"); clearForm(); }}>Back to login</button>
            )}
            <h2 className="auth-title">{mode === "signup" ? "Create account" : mode === "reset" ? "Reset password" : "Sign in"}</h2>
            <p className="auth-subtitle">
              {mode === "reset" ? "We will send a recovery link to your registered college email." : "Choose your role and continue into the campus workspace."}
            </p>

            {mode !== "reset" && (
              <div className="role-row" aria-label="Choose role">
                {roles.map((item) => (
                  <button key={item} className="role-btn" aria-pressed={role === item} onClick={() => setRole(item)}>
                    {item[0].toUpperCase() + item.slice(1)}
                  </button>
                ))}
              </div>
            )}

            {status.text && <div className={`message ${status.type}`}>{status.text}</div>}

            {mode === "signup" && (
              <div className="field">
                <label htmlFor="name">Full name</label>
                <input id="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Rahul Kumar" />
              </div>
            )}

            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@college.edu" onKeyDown={(event) => event.key === "Enter" && submit()} />
            </div>

            {mode !== "reset" && (
              <div className="field">
                <label htmlFor="password">Password</label>
                <div className="password-row">
                  <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" onKeyDown={(event) => event.key === "Enter" && submit()} />
                  <button className="text-btn password-toggle" onClick={() => setShowPassword((value) => !value)}>{showPassword ? "Hide" : "Show"}</button>
                </div>
              </div>
            )}

            {mode === "login" && (
              <div className="forgot-row">
                <button className="text-btn" onClick={() => { setMode("reset"); setStatus({ type: "", text: "" }); }}>Forgot password?</button>
              </div>
            )}

            <button className="primary-btn" onClick={submit} disabled={loading}>
              {loading ? "Working..." : mode === "signup" ? "Create account" : mode === "reset" ? "Send reset link" : `Sign in as ${role}`}
            </button>

            {mode !== "reset" && (
              <div className="switch-row">
                {mode === "login" ? "New here? " : "Already have an account? "}
                <button className="text-btn" onClick={() => { setMode(mode === "login" ? "signup" : "login"); clearForm(); }}>
                  {mode === "login" ? "Create account" : "Sign in"}
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
