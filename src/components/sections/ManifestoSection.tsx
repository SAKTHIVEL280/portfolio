import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const blocks = [
  {
    lines: [
      "I don't begin with tools or trends.",
      "I begin with intuition —",
      "then turn it into systems.",
    ],
  },
  {
    lines: [
      "I design and ship complex software",
      "by collapsing ideas directly into production.",
    ],
  },
  {
    lines: [
      "From concept to live deployment,",
      "faster than traditional development allows.",
      "No ceremony. No unnecessary layers.",
      "Just software that works.",
    ],
  },
  {
    lines: [
      "Every project here started as a question.",
      "The answer became a product.",
    ],
  },
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
  const pathRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const blockRefs = useRef<HTMLDivElement[]>([]);
  const lineRefs = useRef<Map<string, HTMLParagraphElement>>(new Map());

  useEffect(() => {
    const ctx = gsap.context(() => {
      const path = pathRef.current;
      if (!path) return;

      // Set up the SVG path draw
      const pathLength = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      });

      // Draw the line as the user scrolls through the entire section
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1,
        },
      });

      // Animate each block in
      blockRefs.current.forEach((block, blockIdx) => {
        if (!block) return;

        const allLines = block.querySelectorAll("[data-line]");

        // Fade + slide each block
        gsap.fromTo(
          block,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: block,
              start: "top 85%",
              end: "top 50%",
              scrub: 0.5,
            },
          }
        );

        // Scramble each line when it enters view
        allLines.forEach((line) => {
          const lineEl = line as HTMLElement;
          const text = lineEl.dataset.line || "";

          ScrollTrigger.create({
            trigger: lineEl,
            start: "top 80%",
            onEnter: () => {
              if (!lineEl.dataset.activated) {
                lineEl.dataset.activated = "true";
                lineEl.style.color = "hsl(var(--manifesto-active))";
                scrambleLine(lineEl, text);
              }
            },
            onLeaveBack: () => {
              lineEl.dataset.activated = "";
              lineEl.style.color = "hsl(var(--manifesto-muted))";
              lineEl.textContent = text;
            },
          });
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      className="relative py-32 md:py-48"
      style={{ background: "hsl(var(--section-dark))" }}
    >
      {/* SVG flowing line in background */}
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
        viewBox="0 0 1440 2400"
        fill="none"
      >
        <path
          ref={pathRef}
          d="M -50 0 
             Q 200 200, 400 300 
             T 800 500 
             Q 1100 600, 1000 800 
             T 600 1000 
             Q 200 1100, 300 1300 
             T 700 1500 
             Q 1100 1600, 900 1800 
             T 500 2000 
             Q 200 2100, 400 2400"
          stroke="hsl(var(--manifesto-muted))"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.3"
        />
      </svg>

      <div className="relative z-10 max-w-4xl mx-auto px-8 md:px-16">
        {blocks.map((block, blockIdx) => (
          <div
            key={blockIdx}
            ref={(el) => {
              if (el) blockRefs.current[blockIdx] = el;
            }}
            className={`mb-32 md:mb-48 last:mb-0 ${
              blockIdx % 2 === 1 ? "md:ml-auto md:text-right md:max-w-2xl" : "md:max-w-2xl"
            }`}
          >
            {/* Block number */}
            <span
              className="text-xs tracking-[0.3em] uppercase mb-6 block"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: "hsl(var(--manifesto-muted))",
              }}
            >
              0{blockIdx + 1}
            </span>

            {block.lines.map((line, lineIdx) => (
              <p
                key={lineIdx}
                data-line={line}
                className="text-xl md:text-3xl lg:text-4xl leading-relaxed md:leading-relaxed mb-1 transition-colors duration-500"
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
        ))}
      </div>
    </section>
  );
};

export default ManifestoSection;
