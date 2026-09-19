import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setSession, signup, signupWithGoogle } from "../auth";
import { GoogleButton } from "../components/GoogleButton";
import { googleAuthErrorMessage } from "../googleAuth";

export function RegisterHomeownerPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function finish(action: () => Promise<void>) {
    setError("");
    setBusy(true);
    try {
      await action();
      navigate("/");
    } catch (err) {
      const googleMessage = googleAuthErrorMessage(err);
      if (googleMessage === null) return;
      setError(googleMessage);
    } finally {
      setBusy(false);
    }
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      setError("Please fill in all fields, including password, before submitting.");
      return;
    }
    await finish(async () => {
      const session = await signup({
        email: email.trim(),
        password,
        role: "homeowner",
        display_name: name.trim(),
        profile: { phone: phone.trim() },
      });
      setSession(session);
    });
  }

  async function onGoogle() {
    await finish(async () => {
      const session = await signupWithGoogle({
        role: "homeowner",
        display_name: name.trim() || undefined,
        profile: { phone: phone.trim() },
      });
      setSession(session);
    });
  }

  return (
    <div className="shell">
      <aside className="panel">
        <p className="mark">AIQMX</p>
        <h1>Homeowner account.</h1>
        <p className="lede">Track your property, request work, and keep everything in one place.</p>
      </aside>
      <main className="form-side">
        <form onSubmit={onSubmit} noValidate>
          <Link className="login-back" to="/signup">
            ← AIQMX
          </Link>
          <p className="kicker">Homeowner</p>
          <h2>Create account</h2>
          <GoogleButton busy={busy} label="Sign up with Google" onClick={() => void onGoogle()} />
          <p className="hint">
            Google fills in your name and email. Other fields below are optional.
          </p>
          <p className="auth-divider">or</p>
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error ? <p className="error">{error}</p> : null}
          <button type="submit" disabled={busy}>
            {busy ? "Creating…" : "Create account"}
          </button>
          <p className="signup-link">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </form>
      </main>
    </div>
  );
}
