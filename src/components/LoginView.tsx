import { useState } from "react";
import { INVITE_CODES, ORG_UNITS } from "../data/orgAccess";
import { useAuth } from "../lib/authContext";

function codeForUnit(unitId: string): string {
  const found = Object.entries(INVITE_CODES).find(([, v]) => v.unitId === unitId);
  return found?.[0] ?? "—";
}

export function LoginView() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("register");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "login") await login(email, password);
      else await register({ email, password, fullName, inviteCode });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="panel auth-card">
        <p className="eyebrow">One IMCA access</p>
        <h2>{mode === "login" ? "Sign in" : "Create your account"}</h2>
        <p className="muted">
          Each person has their own login. Invite codes only place you in the correct unit —
          they do not let others see your private drafts.
        </p>

        <div className="auth-mode-tabs">
          <button
            type="button"
            className={`tab ${mode === "register" ? "active" : ""}`}
            onClick={() => setMode("register")}
          >
            Register
          </button>
          <button
            type="button"
            className={`tab ${mode === "login" ? "active" : ""}`}
            onClick={() => setMode("login")}
          >
            Sign in
          </button>
        </div>

        <form className="auth-form" onSubmit={submit}>
          {mode === "register" ? (
            <>
              <label>
                <span>Full name</span>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Your name"
                />
              </label>
              <label>
                <span>Unit invite code</span>
                <input
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  required
                  placeholder="e.g., IMCA-YOUTH-1001"
                />
              </label>
            </>
          ) : null}

          <label>
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@imca.org"
            />
          </label>
          <label>
            <span>Password (min 8 characters)</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </label>

          {error ? <p className="error">{error}</p> : null}

          <button type="submit" className="btn primary" disabled={busy}>
            {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <details className="auth-codes">
          <summary>Unit invite codes (for rollout)</summary>
          <p className="muted small">
            Share the matching code with each unit/council director. Department heads and ED
            have special codes. Change these later in production.
          </p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Unit</th>
                  <th>Department</th>
                  <th>Code</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Executive Director Office</td>
                  <td>Executive</td>
                  <td>
                    <code>IMCA-ED-0001</code>
                  </td>
                </tr>
                <tr>
                  <td>Operations Dept Head</td>
                  <td>Operations</td>
                  <td>
                    <code>IMCA-OPS-HEAD</code>
                  </td>
                </tr>
                <tr>
                  <td>Education Dept Head</td>
                  <td>Education</td>
                  <td>
                    <code>IMCA-EDU-HEAD</code>
                  </td>
                </tr>
                <tr>
                  <td>Social Services Dept Head</td>
                  <td>Social Services</td>
                  <td>
                    <code>IMCA-SS-HEAD</code>
                  </td>
                </tr>
                <tr>
                  <td>Community Engagement Dept Head</td>
                  <td>Community Engagement</td>
                  <td>
                    <code>IMCA-CE-HEAD</code>
                  </td>
                </tr>
                {ORG_UNITS.filter((u) => u.id !== "exec-office").map((u) => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.departmentName}</td>
                      <td>
                        <code>{codeForUnit(u.id)}</code>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </details>
      </div>
    </div>
  );
}
