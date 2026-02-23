import { useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Magnetic from "./Magnetic";

gsap.registerPlugin(ScrollTrigger);

const sections = [
  { id: "hero", label: "01 / Hero" },
  { id: "manifesto", label: "02 / Manifesto" },
  { id: "projects", label: "03 / Projects" },
  { id: "philosophy", label: "04 / Philosophy" },
  { id: "skills", label: "05 / Skills" },
  { id: "footer", label: "06 / Contact" },
];

const DynamicIsland = () => {
  const [active, setActive] = useState(sections[0].label);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const triggers: ScrollTrigger[] = [];

    // Delay to ensure sections are mounted
    const timer = setTimeout(() => {
      sections.forEach((s) => {
        const el = document.getElementById(s.id);
        if (!el) return;
        const st = ScrollTrigger.create({
          trigger: el,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActive(s.label),
          onEnterBack: () => setActive(s.label),
        });
        triggers.push(st);
      });
    }, 500);

    return () => {
      clearTimeout(timer);
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <Magnetic strength={10}>
      <div
        onClick={() => setExpanded(!expanded)}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 cursor-pointer select-none"
      >
        <div
          className="flex items-center justify-center border border-border bg-background/80 backdrop-blur-md transition-all duration-500 ease-out"
          style={{
            borderRadius: "9999px",
            padding: expanded ? "16px 32px" : "10px 24px",
            minWidth: expanded ? "280px" : "auto",
          }}
        >
          {expanded ? (
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs tracking-widest uppercase text-muted-foreground">
                {active}
              </span>
              <a
                href="mailto:sakthivel.hsr06@gmail.com"
                className="text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                Copy Email →
              </a>
            </div>
          ) : (
            <span
              className="text-xs tracking-widest uppercase text-muted-foreground"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {active}
            </span>
          )}
        </div>
      </div>
    </Magnetic>
  );
};

export default DynamicIsland;
