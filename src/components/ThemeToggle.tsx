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
      className="fixed top-6 right-6 z-[60] cursor-pointer hover:scale-110 active:scale-95 transition-transform duration-300"
      style={{ opacity: 0, color: "hsl(var(--foreground))" }}
      aria-label="Toggle theme"
    >
      <div ref={iconRef}>
        {isLight ? <Moon size={20} strokeWidth={1.5} /> : <Sun size={20} strokeWidth={1.5} />}
      </div>
    </button>
  );
};

export default ThemeToggle;
