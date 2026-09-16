import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

type AgentSide = "buyer" | "seller";

export function RegisterAgentPage() {
  const [side, setSide] = useState<AgentSide>("buyer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [brokerage, setBrokerage] = useState("");
  const [license, setLicense] = useState("");
  const [markets, setMarkets] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (
      !name.trim() ||
      !email.trim() ||
      !brokerage.trim() ||
      !license.trim() ||
      !markets.trim() ||
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
        <h1>Agent account.</h1>
        <p className="lede">
          Represent buyers or sellers and reach homeowners across your
          markets.
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
              Thanks, {name || "there"}. Your {side === "buyer" ? "buyer's" : "seller's"}{" "}
              agent account request has been submitted and is pending
              approval. We'll email {email || "you"} once it's reviewed.
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
            <p className="kicker">Agent</p>
            <h2>Create account</h2>
            <label htmlFor="side">I represent</label>
            <div className="toggle-group" id="side" role="group" aria-label="I represent">
              <button
                type="button"
                className={side === "buyer" ? "active" : ""}
                onClick={() => setSide("buyer")}
              >
                Buyer
              </button>
              <button
                type="button"
                className={side === "seller" ? "active" : ""}
                onClick={() => setSide("seller")}
              >
                Seller
              </button>
            </div>
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
            <label htmlFor="brokerage">Brokerage</label>
            <input
              id="brokerage"
              name="brokerage"
              type="text"
              autoComplete="organization"
              required
              value={brokerage}
              onChange={(e) => setBrokerage(e.target.value)}
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
            <label htmlFor="markets">Markets</label>
            <input
              id="markets"
              name="markets"
              type="text"
              placeholder="e.g. Austin, Round Rock, Cedar Park"
              required
              value={markets}
              onChange={(e) => setMarkets(e.target.value)}
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
