import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { getToken, GoogleSignupRequiredError, login, loginWithGoogle, setSession } from "../auth";
import { GoogleButton } from "../components/GoogleButton";
import { googleAuthErrorMessage } from "../googleAuth";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (getToken()) {
    return <Navigate to="/" replace />;
  }

  async function finishAuth(action: () => Promise<void>) {
    setError("");
    setBusy(true);
    try {
      await action();
      navigate("/");
    } catch (err) {
      if (err instanceof GoogleSignupRequiredError) {
        navigate("/signup?google=1");
        return;
      }
      const googleMessage = googleAuthErrorMessage(err);
      if (googleMessage === null) return;
      setError(googleMessage);
    } finally {
      setBusy(false);
    }
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    await finishAuth(async () => {
      const result = await login(email.trim(), password);
      setSession(result);
    });
  }

  async function onGoogle() {
    await finishAuth(async () => {
      const result = await loginWithGoogle();
      setSession(result);
    });
  }

  return (
    <div className="shell">
      <aside className="panel">
        <p className="mark">AIQMX</p>
        <h1>Sign in to continue.</h1>
        <p className="lede">
          Authorized users only. Homeowners, tenants, professionals, and agents use this same door.
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
            {busy ? "Signing in…" : "Log in"}
          </button>
          <p className="auth-divider">or</p>
          <GoogleButton busy={busy} label="Continue with Google" onClick={() => void onGoogle()} />
          <p className="signup-link">
            New here? <Link to="/signup">Create account</Link>
          </p>
        </form>
      </main>
    </div>
  );
}
