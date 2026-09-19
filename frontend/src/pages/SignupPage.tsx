import { Link, Navigate } from "react-router-dom";
import { getToken } from "../auth";

export function SignupPage() {
  if (getToken()) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="shell">
      <aside className="panel">
        <p className="mark">AIQMX</p>
        <h1>Create your account.</h1>
        <p className="lede">
          Choose the account type that fits you. Every account is reviewed
          before it goes live.
        </p>
      </aside>
      <main className="form-side">
        <div style={{ width: "100%", maxWidth: "22rem" }}>
          <Link className="login-back" to="/login">
            ← Log in
          </Link>
          <p className="kicker">Account</p>
          <h2>Sign up</h2>
          <div className="role-grid">
            <Link className="role-card" to="/register/homeowner">
              <span className="role-name">Homeowner</span>
              <span className="role-desc">
                Manage your property and connect with pros.
              </span>
            </Link>
            <Link className="role-card" to="/register/tenant">
              <span className="role-name">Tenant</span>
              <span className="role-desc">
                Search rentals and manage your lease in one place.
              </span>
            </Link>
            <Link className="role-card" to="/register/professional">
              <span className="role-name">Professional</span>
              <span className="role-desc">
                Licensed trades and companies offering services.
              </span>
            </Link>
            <Link className="role-card" to="/register/agent">
              <span className="role-name">Agent</span>
              <span className="role-desc">
                Buyer's or seller's agents working with brokerages.
              </span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
