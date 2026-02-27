import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ThemeToggle from "./ThemeToggle";

gsap.registerPlugin(ScrollTrigger);

const navItems = [
  { id: "hero", label: "H" },
  { id: "manifesto", label: "M" },
  { id: "projects", label: "W" },
  { id: "philosophy", label: "P" },
  { id: "skills", label: "S" },
  { id: "footer", label: "C" },
];

const fullLabels = ["Home", "Manifesto", "Works", "Philosophy", "Stack", "Contact"];

const Navigation = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const pillRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Track active section
  useEffect(() => {
    const triggers: ScrollTrigger[] = [];
    const timer = setTimeout(() => {
      navItems.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (!el) return;
        triggers.push(
          ScrollTrigger.create({
            trigger: el,
            start: "top center",
            end: "bottom center",
            onEnter: () => setActiveIdx(i),
            onEnterBack: () => setActiveIdx(i),
          })
        );
      });
    }, 600);
    return () => {
      clearTimeout(timer);
      triggers.forEach((t) => t.kill());
    };
  }, []);

  // Show after scroll
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Animate pill entrance
  useEffect(() => {
    if (!pillRef.current) return;
    gsap.to(pillRef.current, {
      y: visible ? 0 : 30,
      opacity: visible ? 1 : 0,
      scale: visible ? 1 : 0.8,
      duration: 0.5,
      ease: "power3.out",
    });
  }, [visible]);

  // Page progress
  useEffect(() => {
    const onScroll = () => {
      if (!progressRef.current) return;
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = Math.min(scrollTop / docHeight, 1);
      progressRef.current.style.transform = `scaleX(${pct})`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      ref={pillRef}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-1 px-2 py-2 rounded-full"
      style={{
        background: "hsl(var(--nav-bg) / 0.9)",
        backdropFilter: "blur(24px)",
        border: "1px solid hsl(var(--nav-border))",
        boxShadow: "0 8px 32px hsla(0, 0%, 0%, 0.3)",
        opacity: 0,
        transform: "translateY(30px)",
      }}
    >
      {/* Progress bar */}
      <div
        className="absolute top-0 left-3 right-3 h-px overflow-hidden rounded-full"
        style={{ background: "hsl(var(--nav-border))" }}
      >
        <div
          ref={progressRef}
          className="h-full origin-left"
          style={{
            background: "hsl(var(--nav-muted))",
            transform: "scaleX(0)",
            transition: "none",
          }}
        />
      </div>

      <ThemeToggle />

      <div className="w-px h-5 mx-1" style={{ background: "hsl(var(--nav-border))" }} />

      {navItems.map((item, i) => {
        const isActive = activeIdx === i;
        const isHovered = hovered === i;
        const showLabel = isHovered || isActive;

        return (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className="relative flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer"
            style={{
              width: showLabel ? "auto" : "36px",
              height: "36px",
              padding: showLabel ? "0 14px" : "0",
              minWidth: "36px",
              background: isActive
                ? "hsl(var(--nav-active-bg))"
                : isHovered
                ? "hsl(var(--nav-border))"
                : "transparent",
              color: isActive ? "hsl(var(--nav-active-fg))" : "hsl(var(--nav-muted))",
            }}
          >
            <span
              className="text-[11px] font-semibold tracking-wider uppercase whitespace-nowrap"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {showLabel ? fullLabels[i] : item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default Navigation;
