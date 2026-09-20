import { Link, NavLink } from "react-router-dom";
import { clearSession, getEmail, getToken } from "../auth";
import "../landing.css";

export function SiteNav() {
  const signedIn = Boolean(getToken());
  const email = getEmail();

  return (
    <header className="lp-bar">
      <Link className="lp-logo" to="/">
        AIQMX
      </Link>
      <nav className="lp-mid" aria-label="Primary">
        <NavLink to="/listings">Property listings</NavLink>
        <NavLink to="/agents">Agents</NavLink>
        <NavLink to="/products">Products</NavLink>
        <NavLink to="/news">News</NavLink>
        <NavLink to="/about">About us</NavLink>
      </nav>
      <div className="lp-actions">
        {signedIn ? (
          <>
            {email ? <span className="lp-user">{email}</span> : null}
            <button
              type="button"
              className="lp-btn-login"
              onClick={() => {
                clearSession();
                window.location.href = "/";
              }}
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link className="lp-btn-login" to="/login">
              Log in
            </Link>
            <Link className="lp-btn-signup" to="/signup">
              Sign up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
