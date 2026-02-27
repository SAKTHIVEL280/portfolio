import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
  const [isLight, setIsLight] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "light";
    }
    return false;
  });

  useEffect(() => {
    if (isLight) {
      document.documentElement.classList.add("theme-light");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.remove("theme-light");
      localStorage.setItem("theme", "dark");
    }
  }, [isLight]);

  return (
    <button
      onClick={() => setIsLight((v) => !v)}
      className="fixed top-6 right-6 z-[60] flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 cursor-pointer backdrop-blur-xl"
      style={{
        background: "hsl(var(--foreground) / 0.08)",
        border: "1px solid hsl(var(--foreground) / 0.12)",
        color: "hsl(var(--foreground))",
      }}
      aria-label="Toggle theme"
    >
      {isLight ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
};

export default ThemeToggle;
