import { describe, expect, it } from "vitest";
import { googleAuthErrorMessage } from "./googleAuth";

describe("googleAuthErrorMessage", () => {
  it("hides cancelled popup errors", () => {
    expect(googleAuthErrorMessage({ code: "auth/popup-closed-by-user" })).toBeNull();
    expect(googleAuthErrorMessage({ code: "auth/cancelled-popup-request" })).toBeNull();
  });

  it("explains an email that already uses a password account", () => {
    expect(googleAuthErrorMessage({ code: "auth/account-exists-with-different-credential" })).toBe(
      "An account already exists with this email. Log in with email and password.",
    );
  });

  it("uses the Error message for API failures", () => {
    expect(
      googleAuthErrorMessage(new Error("No AIQMX account for this Google user. Sign up first.")),
    ).toBe("No AIQMX account for this Google user. Sign up first.");
  });
});
