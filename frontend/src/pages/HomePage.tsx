import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { fetchMe, getEmail, getRole, getToken, logout } from "../auth";

export function HomePage() {
  const navigate = useNavigate();
  const token = getToken();
  const email = getEmail();
  const role = getRole();
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    fetchMe()
      .then((me) => {
        if (!cancelled) setStatus(me.status ?? null);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Session expired");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-body">
      <header className="app-header">
        <p>AIQMX</p>
        <button
          type="button"
          onClick={async () => {
            await logout();
            navigate("/");
          }}
        >
          Sign out
        </button>
      </header>
      <h1>You are signed in.</h1>
      <p>Signed in as {email}.</p>
      {role ? <p>Role: {role}</p> : null}
      {status ? <p>Status: {status}</p> : null}
      {error ? <p className="error">{error}</p> : null}
    </div>
  );
}
