import { Link } from "react-router-dom";

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M14.5 8.5V6.8c0-.7.5-1.3 1.2-1.3H17V3h-1.8C12.8 3 11 4.8 11 7.2v1.3H9v2.7h2V21h3.5v-9.8h2.3l.5-2.7h-2.8z"
      />
    </svg>
  );
}

function IconX() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M14.7 10.3 21 3h-1.9l-5.2 6-4.1-6H3.2l6.6 9.6L3 21h1.9l5.7-6.6 4.5 6.6H21l-6.3-10.7zm-2 2.3-.7-1L5.6 4.3h2.3l4.4 6.4.7 1 6.1 8.8h-2.3l-5.1-7.9z"
      />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8zm8.2 1.6a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2zM12 8.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2zm0 2a1.8 1.8 0 1 0 1.8 1.8A1.8 1.8 0 0 0 12 10.2z"
      />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M6.5 9.5H3.8V21h2.7V9.5zM5.2 3A1.7 1.7 0 1 0 5.2 6.4 1.7 1.7 0 0 0 5.2 3zM21 21h-2.7v-5.6c0-1.8-.6-3-2.1-3s-2.2 1.1-2.2 3V21H11V9.5h2.6v1.6c.6-1.1 1.8-1.9 3.5-1.9 2.6 0 3.9 1.7 3.9 5.2V21z"
      />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="lp-foot">
      <div className="lp-foot-grid">
        <div className="lp-foot-brand">
          <Link className="lp-logo" to="/">
            AIQMX
          </Link>
          <p>
            The all in one real estate platform for listings, agents, and
            property work.
          </p>
        </div>
        <div>
          <h2>Quick links</h2>
          <Link to="/listings">Property listings</Link>
          <Link to="/agents">Agents</Link>
          <Link to="/products">Products</Link>
        </div>
        <div>
          <h2>Resources</h2>
          <Link to="/glossary">Glossary</Link>
          <Link to="/news">News</Link>
          <Link to="/about">FAQ</Link>
        </div>
        <div>
          <h2>Company</h2>
          <Link to="/about">About us</Link>
          <Link to="/about">Contact</Link>
        </div>
      </div>
      <div className="lp-foot-bottom">
        <p className="lp-copy">Copyright © {new Date().getFullYear()} AIQMX</p>
        <div className="lp-social">
          <a href="https://facebook.com" aria-label="Facebook">
            <IconFacebook />
          </a>
          <a href="https://x.com" aria-label="X">
            <IconX />
          </a>
          <a href="https://instagram.com" aria-label="Instagram">
            <IconInstagram />
          </a>
          <a href="https://linkedin.com" aria-label="LinkedIn">
            <IconLinkedIn />
          </a>
        </div>
      </div>
    </footer>
  );
}
