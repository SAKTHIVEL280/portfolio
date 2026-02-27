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
      className="flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer"
      style={{
        width: "36px",
        height: "36px",
        color: "hsl(var(--nav-muted))",
      }}
      aria-label="Toggle theme"
    >
      {isLight ? <Moon size={14} /> : <Sun size={14} />}
    </button>
  );
};

export default ThemeToggle;
