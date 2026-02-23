import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const navItems = [
  { id: "hero", label: "Home" },
  { id: "manifesto", label: "Manifesto" },
  { id: "projects", label: "Works" },
  { id: "philosophy", label: "Philosophy" },
  { id: "skills", label: "Stack" },
  { id: "footer", label: "Contact" },
];

const Navigation = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<HTMLAnchorElement[]>([]);
  const indicatorRef = useRef<HTMLDivElement>(null);

  // Track active section
  useEffect(() => {
    const triggers: ScrollTrigger[] = [];
    const timer = setTimeout(() => {
      navItems.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (!el) return;
        const st = ScrollTrigger.create({
          trigger: el,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActiveIdx(i),
          onEnterBack: () => setActiveIdx(i),
        });
        triggers.push(st);
      });
    }, 600);

    return () => {
      clearTimeout(timer);
      triggers.forEach((t) => t.kill());
    };
  }, []);

  // Track scroll for background
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Animate menu open/close
  useEffect(() => {
    if (!menuRef.current) return;
    const items = menuRef.current.querySelectorAll(".nav-menu-item");

    if (isOpen) {
      gsap.set(menuRef.current, { display: "flex" });
      gsap.fromTo(
        menuRef.current,
        { clipPath: "circle(0% at calc(100% - 40px) 40px)" },
        { clipPath: "circle(150% at calc(100% - 40px) 40px)", duration: 0.8, ease: "power4.inOut" }
      );
      gsap.fromTo(
        items,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.06, duration: 0.5, delay: 0.3, ease: "power3.out" }
      );
    } else {
      gsap.to(menuRef.current, {
        clipPath: "circle(0% at calc(100% - 40px) 40px)",
        duration: 0.5,
        ease: "power3.in",
        onComplete: () => {
          if (menuRef.current) gsap.set(menuRef.current, { display: "none" });
        },
      });
    }
  }, [isOpen]);

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Top bar — minimal */}
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-6 md:px-10 py-4 transition-all duration-500"
        style={{
          background: scrolled ? "hsla(0, 0%, 4%, 0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
        }}
      >
        {/* Logo / Name */}
        <a
          href="#hero"
          onClick={(e) => { e.preventDefault(); scrollToSection("hero"); }}
          className="text-sm tracking-[0.3em] uppercase font-medium transition-opacity duration-300 hover:opacity-60"
          style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(0 0% 90%)" }}
        >
          Sakthivel
        </a>

        {/* Desktop inline nav — hidden on mobile */}
        <div className="hidden md:flex items-center gap-1 relative">
          {navItems.map((item, i) => (
            <a
              key={item.id}
              ref={(el) => { if (el) itemRefs.current[i] = el; }}
              href={`#${item.id}`}
              onClick={(e) => { e.preventDefault(); scrollToSection(item.id); }}
              className="relative px-4 py-2 text-xs tracking-[0.15em] uppercase transition-all duration-300"
              style={{
                fontFamily: "'Inter', sans-serif",
                color: activeIdx === i ? "hsl(0 0% 100%)" : "hsl(0 0% 50%)",
              }}
            >
              {item.label}
              {/* Active dot */}
              <span
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full transition-all duration-500"
                style={{
                  background: activeIdx === i ? "hsl(0 0% 90%)" : "transparent",
                  transform: `translateX(-50%) scale(${activeIdx === i ? 1 : 0})`,
                }}
              />
            </a>
          ))}
        </div>

        {/* Hamburger — always visible on mobile, hidden on desktop */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden relative w-10 h-10 flex items-center justify-center z-[70]"
          aria-label="Toggle navigation"
        >
          <div className="relative w-6 h-4 flex flex-col justify-between">
            <span
              className="block w-full h-px transition-all duration-300 origin-center"
              style={{
                background: "hsl(0 0% 90%)",
                transform: isOpen ? "translateY(7.5px) rotate(45deg)" : "none",
              }}
            />
            <span
              className="block w-full h-px transition-all duration-300"
              style={{
                background: "hsl(0 0% 90%)",
                opacity: isOpen ? 0 : 1,
              }}
            />
            <span
              className="block w-full h-px transition-all duration-300 origin-center"
              style={{
                background: "hsl(0 0% 90%)",
                transform: isOpen ? "translateY(-7.5px) rotate(-45deg)" : "none",
              }}
            />
          </div>
        </button>
      </nav>

      {/* Full-screen menu overlay — mobile */}
      <div
        ref={menuRef}
        className="fixed inset-0 z-[65] flex-col items-center justify-center gap-6"
        style={{
          display: "none",
          background: "hsl(0 0% 3%)",
          clipPath: "circle(0% at calc(100% - 40px) 40px)",
        }}
      >
        {navItems.map((item, i) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => { e.preventDefault(); scrollToSection(item.id); }}
            className="nav-menu-item text-4xl md:text-5xl font-bold tracking-tight transition-opacity duration-300 hover:opacity-60"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: activeIdx === i ? "hsl(0 0% 100%)" : "hsl(0 0% 45%)",
            }}
          >
            {item.label}
          </a>
        ))}
        <span
          className="nav-menu-item text-xs tracking-[0.4em] uppercase mt-8"
          style={{ color: "hsl(0 0% 35%)", fontFamily: "'Inter', sans-serif" }}
        >
          sakthivel.hsr06@gmail.com
        </span>
      </div>
    </>
  );
};

export default Navigation;
