import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setSession, signup, signupWithGoogle } from "../auth";
import { GoogleButton } from "../components/GoogleButton";
import { googleAuthErrorMessage } from "../googleAuth";

export function RegisterProfessionalPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [trade, setTrade] = useState("");
  const [company, setCompany] = useState("");
  const [license, setLicense] = useState("");
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
    if (
      !name.trim() ||
      !email.trim() ||
      !trade.trim() ||
      !company.trim() ||
      !license.trim() ||
      !password.trim()
    ) {
      setError("Please fill in all fields, including password, before submitting.");
      return;
    }
    await finish(async () => {
      const session = await signup({
        email: email.trim(),
        password,
        role: "professional",
        display_name: name.trim(),
        profile: {
          trade: trade.trim(),
          company: company.trim(),
          license: license.trim(),
        },
      });
      setSession(session);
    });
  }

  async function onGoogle() {
    await finish(async () => {
      const session = await signupWithGoogle({
        role: "professional",
        display_name: name.trim() || undefined,
        profile: {
          trade: trade.trim(),
          company: company.trim(),
          license: license.trim(),
        },
      });
      setSession(session);
    });
  }

  return (
    <div className="shell">
      <aside className="panel">
        <p className="mark">AIQMX</p>
        <h1>Professional account.</h1>
        <p className="lede">List your trade, get matched with homeowners, and manage your jobs.</p>
      </aside>
      <main className="form-side">
        <form onSubmit={onSubmit} noValidate>
          <Link className="login-back" to="/signup">
            ← AIQMX
          </Link>
          <p className="kicker">Professional</p>
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
          <label htmlFor="trade">Trade</label>
          <input
            id="trade"
            name="trade"
            type="text"
            placeholder="Electrician, plumber, HVAC..."
            required
            value={trade}
            onChange={(e) => setTrade(e.target.value)}
          />
          <label htmlFor="company">Company</label>
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            required
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
          <label htmlFor="license">License number</label>
          <input
            id="license"
            name="license"
            type="text"
            required
            value={license}
            onChange={(e) => setLicense(e.target.value)}
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
