import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const manifestoText = [
  "I don't begin with tools or trends.",
  "I begin with intuition —",
  "then turn it into systems.",
  "I design and ship complex software",
  "by collapsing ideas directly into production.",
  "From concept to live deployment,",
  "faster than traditional development allows.",
  "No ceremony. No unnecessary layers.",
  "Just software that works.",
  "Every project here started as a question.",
  "The answer became a product.",
];

const SYMBOLS = "!@#$%&*+^?/<>{}[]~";

const scrambleLine = (el: HTMLElement, finalText: string) => {
  let iteration = 0;
  const maxIterations = 8;
  const interval = setInterval(() => {
    el.textContent = finalText
      .split("")
      .map((char, i) => {
        if (i < (iteration / maxIterations) * finalText.length) return char;
        if (char === " ") return " ";
        return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      })
      .join("");
    iteration++;
    if (iteration > maxIterations) {
      clearInterval(interval);
      el.textContent = finalText;
    }
  }, 35);
};

const ManifestoSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<HTMLParagraphElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = lineRefs.current.filter(Boolean);

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: containerRef.current,
        scrub: 0.5,
        onUpdate: (self) => {
          const progress = self.progress;
          lines.forEach((line, i) => {
            const lineStart = i / lines.length;
            const lineEnd = (i + 1) / lines.length;
            if (progress >= lineStart && !line.dataset.activated) {
              line.dataset.activated = "true";
              line.style.color = "hsl(var(--manifesto-active))";
              scrambleLine(line, manifestoText[i]);
            }
            if (progress < lineStart && line.dataset.activated) {
              line.dataset.activated = "";
              line.style.color = "hsl(var(--manifesto-muted))";
              line.textContent = manifestoText[i];
            }
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="manifesto" className="min-h-[200vh] relative" style={{ background: "hsl(var(--section-dark))" }}>
      <div ref={containerRef} className="h-screen flex items-center justify-center px-8 md:px-16">
        <div className="max-w-3xl">
          {manifestoText.map((line, i) => (
            <p
              key={i}
              ref={(el) => { if (el) lineRefs.current[i] = el; }}
              className="text-xl md:text-3xl lg:text-4xl leading-relaxed md:leading-relaxed mb-2 transition-colors duration-300"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 500,
                color: "hsl(var(--manifesto-muted))",
              }}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ManifestoSection;
