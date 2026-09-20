import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearSession,
  fetchMe,
  getEmail,
  getRole,
  getToken,
  getUid,
  login,
  loginWithGoogle,
  logout,
  setSession,
  signup,
  signupWithGoogle,
  GoogleSignupRequiredError,
} from "./auth";
import { signInWithGooglePopup } from "./googleAuth";

vi.mock("./googleAuth", () => ({
  signInWithGooglePopup: vi.fn(),
}));

describe("auth session", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    sessionStorage.clear();
  });

  it("stores and reads session fields", () => {
    setSession({
      access_token: "tok",
      email: "a@b.com",
      uid: "u1",
      role: "homeowner",
    });
    expect(getToken()).toBe("tok");
    expect(getEmail()).toBe("a@b.com");
    expect(getUid()).toBe("u1");
    expect(getRole()).toBe("homeowner");
  });

  it("clears the session", () => {
    setSession({ access_token: "tok", email: "a@b.com", uid: "u1", role: "agent" });
    clearSession();
    expect(getToken()).toBeNull();
    expect(getEmail()).toBeNull();
    expect(getUid()).toBeNull();
    expect(getRole()).toBeNull();
  });

  it("logs in and returns the access token", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          access_token: "id-token",
          email: "user@example.com",
          uid: "uid-1",
          role: "tenant",
        }),
      }),
    );
    const session = await login("user@example.com", "secret12");
    expect(session.access_token).toBe("id-token");
    expect(fetch).toHaveBeenCalledWith("/auth/login", expect.any(Object));
  });

  it("surfaces API error details on signup failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ detail: "An account with this email already exists" }),
      }),
    );
    await expect(
      signup({
        email: "user@example.com",
        password: "secret12",
        role: "homeowner",
      }),
    ).rejects.toThrow("An account with this email already exists");
  });

  it("requires a stored token before fetching the profile", async () => {
    await expect(fetchMe()).rejects.toThrow("Not signed in");
  });

  it("clears local session on logout even if the request fails", async () => {
    setSession({ access_token: "tok", email: "a@b.com" });
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    await expect(logout()).rejects.toThrow("offline");
    expect(getToken()).toBeNull();
  });

  it("logs in with a Google ID token", async () => {
    vi.mocked(signInWithGooglePopup).mockResolvedValue({
      idToken: "google-id",
      email: "google@example.com",
      displayName: "G User",
      refreshIdToken: vi.fn().mockResolvedValue("google-id-refreshed"),
    });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          access_token: "google-id",
          email: "google@example.com",
          uid: "uid-g",
          role: "tenant",
        }),
      }),
    );
    const session = await loginWithGoogle();
    expect(session.access_token).toBe("google-id-refreshed");
    expect(fetch).toHaveBeenCalledWith("/auth/google/login", expect.any(Object));
  });

  it("asks new Google users to finish signup instead of failing as not found", async () => {
    vi.mocked(signInWithGooglePopup).mockResolvedValue({
      idToken: "google-id",
      email: "google@example.com",
      displayName: "G User",
      refreshIdToken: vi.fn().mockResolvedValue("google-id"),
    });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 409,
        json: async () => ({
          detail: "No AIQMX account for this Google user. Sign up first.",
        }),
      }),
    );
    await expect(loginWithGoogle()).rejects.toBeInstanceOf(GoogleSignupRequiredError);
  });

  it("signs up with Google and sends the selected role", async () => {
    vi.mocked(signInWithGooglePopup).mockResolvedValue({
      idToken: "google-id",
      email: "google@example.com",
      displayName: "G User",
      refreshIdToken: vi.fn().mockResolvedValue("google-id"),
    });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          access_token: "google-id",
          email: "google@example.com",
          uid: "uid-g",
          role: "homeowner",
          status: "pending_approval",
        }),
      }),
    );
    await signupWithGoogle({
      role: "homeowner",
      profile: { phone: "555-0100" },
    });
    expect(fetch).toHaveBeenCalledWith(
      "/auth/google/signup",
      expect.objectContaining({
        body: JSON.stringify({
          id_token: "google-id",
          role: "homeowner",
          display_name: "G User",
          profile: { phone: "555-0100" },
        }),
      }),
    );
  });
});
