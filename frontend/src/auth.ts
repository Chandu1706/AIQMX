const TOKEN_KEY = "aiqmx_token";
const EMAIL_KEY = "aiqmx_email";
const UID_KEY = "aiqmx_uid";
const ROLE_KEY = "aiqmx_role";

export type AuthSession = {
  access_token: string;
  email?: string | null;
  uid?: string | null;
  role?: string | null;
  status?: string | null;
  detail?: string;
};

function readError(payload: AuthSession & { detail?: unknown }, fallback: string): string {
  if (typeof payload.detail === "string") return payload.detail;
  return fallback;
}

export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function getEmail(): string | null {
  return sessionStorage.getItem(EMAIL_KEY);
}

export function getUid(): string | null {
  return sessionStorage.getItem(UID_KEY);
}

export function getRole(): string | null {
  return sessionStorage.getItem(ROLE_KEY);
}

export function setSession(session: AuthSession): void {
  sessionStorage.setItem(TOKEN_KEY, session.access_token);
  if (session.email) sessionStorage.setItem(EMAIL_KEY, session.email);
  if (session.uid) sessionStorage.setItem(UID_KEY, session.uid);
  if (session.role) sessionStorage.setItem(ROLE_KEY, session.role);
}

export function clearSession(): void {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(EMAIL_KEY);
  sessionStorage.removeItem(UID_KEY);
  sessionStorage.removeItem(ROLE_KEY);
}

async function postAuth(path: string, body: unknown): Promise<AuthSession> {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = (await response.json().catch(() => ({}))) as AuthSession;
  if (!response.ok) {
    throw new Error(readError(payload, "Authentication failed"));
  }
  if (!payload.access_token) {
    throw new Error("No access token returned");
  }
  return payload;
}

export async function login(email: string, password: string): Promise<AuthSession> {
  return postAuth("/auth/login", { email, password });
}

export async function signup(input: {
  email: string;
  password: string;
  role: "homeowner" | "professional" | "agent" | "tenant";
  display_name?: string;
  profile?: Record<string, string>;
}): Promise<AuthSession> {
  return postAuth("/auth/signup", input);
}

export async function fetchMe(): Promise<{
  uid: string;
  email?: string | null;
  role?: string | null;
  status?: string | null;
}> {
  const token = getToken();
  if (!token) throw new Error("Not signed in");
  const response = await fetch("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      typeof payload.detail === "string" ? payload.detail : "Could not load profile",
    );
  }
  return payload;
}

export async function logout(): Promise<void> {
  const token = getToken();
  try {
    if (token) {
      await fetch("/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  } finally {
    clearSession();
  }
}
