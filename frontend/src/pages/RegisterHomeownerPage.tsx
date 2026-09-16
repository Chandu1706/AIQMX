import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

export function RegisterHomeownerPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      setError("Please fill in all fields, including password, before submitting.");
      return;
    }
    setError("");
    setSubmitted(true);
  }

  return (
    <div className="shell">
      <aside className="panel">
        <p className="mark">AIQMX</p>
        <h1>Homeowner account.</h1>
        <p className="lede">
          Track your property, request work, and keep everything in one
          place.
        </p>
      </aside>
      <main className="form-side">
        {submitted ? (
          <div style={{ width: "100%", maxWidth: "22rem" }}>
            <Link className="login-back" to="/">
              ← AIQMX
            </Link>
            <p className="kicker">Account</p>
            <h2>Sign up</h2>
            <p className="pending">
              <strong>Pending approval</strong>
              Thanks, {name || "there"}. Your homeowner account request has
              been submitted and is pending approval. We'll email {email ||
                "you"}{" "}
              once it's reviewed.
            </p>
            <Link className="login-back" to="/login">
              Back to log in
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate>
            <Link className="login-back" to="/signup">
              ← AIQMX
            </Link>
            <p className="kicker">Homeowner</p>
            <h2>Create account</h2>
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error ? <p className="error">{error}</p> : null}
            <button type="submit">Create account</button>
            <p className="signup-link">
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </form>
        )}
      </main>
    </div>
  );
}
