import { initializeApp, getApps } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup, type Auth, type User } from "firebase/auth";

export type GooglePopupSession = {
  idToken: string;
  email: string | null;
  displayName: string | null;
  refreshIdToken: () => Promise<string>;
};

let authPromise: Promise<Auth> | null = null;

async function getFirebaseAuth(): Promise<Auth> {
  if (!authPromise) {
    authPromise = (async () => {
      const response = await fetch("/auth/config");
      const payload = (await response.json().catch(() => ({}))) as {
        apiKey?: string;
        authDomain?: string;
        projectId?: string;
        detail?: unknown;
      };
      if (!response.ok || !payload.apiKey || !payload.authDomain || !payload.projectId) {
        throw new Error(
          typeof payload.detail === "string"
            ? payload.detail
            : "Google sign-in is not configured on the server",
        );
      }
      const app =
        getApps()[0] ??
        initializeApp({
          apiKey: payload.apiKey,
          authDomain: payload.authDomain,
          projectId: payload.projectId,
        });
      return getAuth(app);
    })();
  }
  const auth = await authPromise;
  await auth.authStateReady();
  return auth;
}

function sessionFromUser(user: User): Promise<GooglePopupSession> {
  return user.getIdToken().then((idToken) => ({
    idToken,
    email: user.email,
    displayName: user.displayName,
    refreshIdToken: () => user.getIdToken(true),
  }));
}

export function googleAuthErrorMessage(err: unknown): string | null {
  if (!err || typeof err !== "object") {
    return err instanceof Error ? err.message : "Google sign-in failed";
  }
  const code = "code" in err ? String(err.code) : "";
  if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
    return null;
  }
  if (code === "auth/account-exists-with-different-credential") {
    return "An account already exists with this email. Log in with email and password.";
  }
  if (err instanceof Error && err.message) {
    return err.message;
  }
  return "Google sign-in failed";
}

export async function signInWithGooglePopup(): Promise<GooglePopupSession> {
  const auth = await getFirebaseAuth();
  const existing = auth.currentUser;
  const alreadyGoogle = existing?.providerData.some(
    (provider) => provider.providerId === "google.com",
  );
  if (existing && alreadyGoogle) {
    return sessionFromUser(existing);
  }

  const provider = new GoogleAuthProvider();
  provider.addScope("email");
  provider.addScope("profile");
  const credential = await signInWithPopup(auth, provider);
  return sessionFromUser(credential.user);
}
