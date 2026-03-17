import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import App from "@/App";

vi.mock("@/pages/Index", () => ({
  default: () => <div>home-page</div>,
}));

vi.mock("@/pages/Projects", () => ({
  default: () => <div>projects-page</div>,
}));

vi.mock("@/pages/NotFound", () => ({
  default: () => <div>not-found-page</div>,
}));

vi.mock("@/components/ui/toaster", () => ({
  Toaster: () => null,
}));

vi.mock("@/components/ui/sonner", () => ({
  Toaster: () => null,
}));

afterEach(() => {
  cleanup();
  window.history.replaceState({}, "", "/");
});

describe("app routes", () => {
  it("renders the home route", () => {
    window.history.pushState({}, "", "/");
    render(<App />);

    expect(screen.getByText("home-page")).toBeInTheDocument();
  });

  it("renders the projects route", () => {
    window.history.pushState({}, "", "/projects");
    render(<App />);

    expect(screen.getByText("projects-page")).toBeInTheDocument();
  });

  it("renders the catch-all route", () => {
    window.history.pushState({}, "", "/missing-route");
    render(<App />);

    expect(screen.getByText("not-found-page")).toBeInTheDocument();
  });
});