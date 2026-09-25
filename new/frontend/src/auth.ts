const TOKEN_KEY = "aiqmx_token";
const EMAIL_KEY = "aiqmx_email";

export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function getEmail(): string | null {
  return sessionStorage.getItem(EMAIL_KEY);
}

export function setSession(token: string, email: string): void {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(EMAIL_KEY, email);
}

export function clearSession(): void {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(EMAIL_KEY);
}

type LoginResult = {
  access_token: string;
  email: string;
  detail?: string;
};

export async function login(email: string, password: string): Promise<LoginResult> {
  const response = await fetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const payload = (await response.json().catch(() => ({}))) as LoginResult;
  if (!response.ok) {
    throw new Error(typeof payload.detail === "string" ? payload.detail : "Could not sign in");
  }
  return payload;
}
