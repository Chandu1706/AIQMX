import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LoginPage } from "./LoginPage";

vi.mock("../auth", () => ({
  getToken: () => null,
  login: vi.fn(),
  loginWithGoogle: vi.fn(),
  setSession: vi.fn(),
  GoogleSignupRequiredError: class GoogleSignupRequiredError extends Error {},
}));

describe("LoginPage", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("renders the sign-in form", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { name: "Log in" })).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log in" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Continue with Google" })).toBeInTheDocument();
  });
});
