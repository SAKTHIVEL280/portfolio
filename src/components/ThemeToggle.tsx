import { useState, useEffect, useRef } from "react";
import { Sun, Moon } from "lucide-react";
import gsap from "gsap";

const ThemeToggle = () => {
  const [isLight, setIsLight] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "light";
    }
    return false;
  });
  const btnRef = useRef<HTMLButtonElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);

  useEffect(() => {
    if (isLight) {
      document.documentElement.classList.add("theme-light");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.remove("theme-light");
      localStorage.setItem("theme", "dark");
    }

    // Animate icon on toggle (skip first mount)
    if (mounted.current && iconRef.current) {
      gsap.fromTo(
        iconRef.current,
        { rotate: -90, scale: 0, opacity: 0 },
        { rotate: 0, scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)" }
      );
    }
    mounted.current = true;
  }, [isLight]);

  // Entrance animation
  useEffect(() => {
    if (btnRef.current) {
      gsap.fromTo(
        btnRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 4, ease: "power3.out" }
      );
    }
  }, []);

  return (
    <button
      ref={btnRef}
      onClick={() => setIsLight((v) => !v)}
      className="fixed top-6 right-6 z-[60] group cursor-pointer"
      style={{ opacity: 0 }}
      aria-label="Toggle theme"
    >
      {/* Outer ring */}
      <div
        className="relative w-11 h-11 rounded-full flex items-center justify-center transition-all duration-500"
        style={{
          background: "hsl(var(--foreground) / 0.06)",
          border: "1px solid hsl(var(--foreground) / 0.1)",
        }}
      >
        {/* Hover ring expand */}
        <div
          className="absolute inset-0 rounded-full scale-100 group-hover:scale-[1.15] transition-transform duration-500 ease-out"
          style={{
            border: "1px solid hsl(var(--foreground) / 0.08)",
          }}
        />

        {/* Icon container */}
        <div ref={iconRef} className="relative z-10" style={{ color: "hsl(var(--foreground))" }}>
          {isLight ? <Moon size={16} strokeWidth={1.5} /> : <Sun size={16} strokeWidth={1.5} />}
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle;
