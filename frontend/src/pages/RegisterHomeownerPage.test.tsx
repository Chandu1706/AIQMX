import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { RegisterHomeownerPage } from "./RegisterHomeownerPage";

vi.mock("../auth", () => ({
  signup: vi.fn(),
  signupWithGoogle: vi.fn(),
  setSession: vi.fn(),
}));

describe("RegisterHomeownerPage", () => {
  it("offers email signup and Google signup", () => {
    render(
      <MemoryRouter>
        <RegisterHomeownerPage />
      </MemoryRouter>,
    );
    expect(screen.getByRole("button", { name: "Create account" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign up with Google" })).toBeInTheDocument();
  });
});
