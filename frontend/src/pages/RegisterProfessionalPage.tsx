import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

export function RegisterProfessionalPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [trade, setTrade] = useState("");
  const [company, setCompany] = useState("");
  const [license, setLicense] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function onSubmit(event: FormEvent) {
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
    setError("");
    setSubmitted(true);
  }

  return (
    <div className="shell">
      <aside className="panel">
        <p className="mark">AIQMX</p>
        <h1>Professional account.</h1>
        <p className="lede">
          List your trade, get matched with homeowners, and manage your jobs.
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
              Thanks, {name || "there"}. Your professional account request has
              been submitted and is pending approval. We'll email {email ||
                "you"}{" "}
              once your license and details are verified.
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
            <p className="kicker">Professional</p>
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
