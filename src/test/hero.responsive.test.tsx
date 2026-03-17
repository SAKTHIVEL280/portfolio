import { describe, expect, it, afterEach } from "vitest";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import HeroSection from "@/components/sections/HeroSection";

afterEach(() => {
  cleanup();
  window.innerWidth = 1280;
});

describe("Hero responsive behavior", () => {
  it("applies mobile layout styles when viewport is mobile", async () => {
    window.innerWidth = 390;

    render(<HeroSection />);
    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    const bg = screen.getByTestId("hero-bg");
    const leftBlock = screen.getByTestId("hero-left-block");
    const tagline = screen.getByTestId("hero-tagline");

    await waitFor(() => {
      expect(bg).toHaveStyle({ backgroundAttachment: "scroll" });
      expect(leftBlock).toHaveStyle({ transform: "translate(-18px, -48px)" });
      expect(tagline).toHaveStyle({ marginLeft: "0px" });
    });
  });

  it("applies tablet layout styles when viewport is tablet", async () => {
    window.innerWidth = 1024;

    render(<HeroSection />);
    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    const bg = screen.getByTestId("hero-bg");
    const leftBlock = screen.getByTestId("hero-left-block");
    const tagline = screen.getByTestId("hero-tagline");

    await waitFor(() => {
      expect(bg).toHaveStyle({ backgroundAttachment: "fixed" });
      expect(leftBlock).toHaveStyle({ transform: "translate(-82px, -96px)" });
      expect(tagline).toHaveStyle({ marginLeft: "130px" });
    });
  });

  it("applies wide-screen layout styles on large displays", async () => {
    window.innerWidth = 1920;

    render(<HeroSection />);
    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    const leftBlock = screen.getByTestId("hero-left-block");
    const tagline = screen.getByTestId("hero-tagline");

    await waitFor(() => {
      expect(leftBlock).toHaveStyle({ transform: "translate(-165px, -162px)" });
      expect(tagline).toHaveStyle({ marginLeft: "300px" });
    });
  });
});
