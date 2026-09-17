import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, setSession } from "../auth";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const result = await login(email.trim(), password);
      setSession(result.access_token, result.email);
      navigate("/app");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="shell">
      <aside className="panel">
        <p className="mark">AIQMX</p>
        <h1>Sign in to continue.</h1>
        <p className="lede">
          Authorized users only. Homeowners, professionals, and agents use this
          same door.
        </p>
      </aside>
      <main className="form-side">
        <form onSubmit={onSubmit} noValidate>
          <Link className="login-back" to="/">
            ← AIQMX
          </Link>
          <p className="kicker">Account</p>
          <h2>Log in</h2>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error ? <p className="error">{error}</p> : null}
          <button type="submit" disabled={busy}>
            Log in
          </button>
          <p className="hint">Demo: admin@aiqmx.local / admin123</p>
          <p className="signup-link">
            New here? <Link to="/signup">Create account</Link>
          </p>
        </form>
      </main>
    </div>
  );
}
