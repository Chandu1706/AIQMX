import { Navigate, useNavigate } from "react-router-dom";
import { clearSession, getEmail, getToken } from "../auth";

export function HomePage() {
  const navigate = useNavigate();
  const token = getToken();
  const email = getEmail();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-body">
      <header className="app-header">
        <p>AIQMX</p>
        <button
          type="button"
          onClick={() => {
            clearSession();
            navigate("/");
          }}
        >
          Sign out
        </button>
      </header>
      <h1>You are signed in.</h1>
      <p>Signed in as {email}.</p>
    </div>
  );
}
