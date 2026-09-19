import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the landing headline", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { name: "The all in one real estate platform" }),
    ).toBeInTheDocument();
  });
});
