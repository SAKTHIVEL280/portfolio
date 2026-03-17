import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import HeroSection from "@/components/sections/HeroSection";

describe("Hero content contract", () => {
  it("renders key brand copy and omits deprecated role label", () => {
    render(<HeroSection />);

    expect(screen.getByRole("heading", { name: "Sakthivel" })).toBeInTheDocument();
    expect(screen.getByText("I build products which", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("people can actually use", { exact: false })).toBeInTheDocument();
    expect(
      screen.getByText(
        "I leverage AI to collapse ideas directly into production, bridging the gap between concept and reality with professional precision and speed.",
      ),
    ).toBeInTheDocument();

    expect(screen.queryByText(/AI Native Engineer/i)).not.toBeInTheDocument();
  });

  it("exposes social links and accessibility labels", () => {
    render(<HeroSection />);

    const xLink = screen.getByRole("link", { name: "Visit X profile" });
    const linkedinLink = screen.getByRole("link", { name: "Visit LinkedIn profile" });
    const githubLink = screen.getByRole("link", { name: "Visit GitHub profile" });

    expect(xLink).toHaveAttribute("href", "https://x.com/SAKTHIVEL_E_");
    expect(linkedinLink).toHaveAttribute("href", "https://www.linkedin.com/in/sakthivel-e-1924a0292/");
    expect(githubLink).toHaveAttribute("href", "https://github.com/SAKTHIVEL280");
  });
});
