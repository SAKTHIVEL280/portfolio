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
      "by collapsing ideas directly",
      "into production.",
    ],
  },
  {
    lines: [
      "From concept to live deployment,",
      "faster than traditional",
      "development allows.",
      "",
      "No ceremony. No unnecessary layers.",
      "Just software that works.",
    ],
  },
  {
    lines: [
      "Every project here started",
      "as a question.",
      "The answer became a product.",
    ],
  },
];

const SYMBOLS = "!@#$%&*+^?/<>{}[]~";

const scrambleLine = (el: HTMLElement, finalText: string) => {
  let iteration = 0;
  const maxIterations = 10;
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
  }, 30);
};

const ManifestoSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGPathElement>(null);
  const blockRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!pathRef.current || !sectionRef.current) return;

    const path = pathRef.current;
    const length = path.getTotalLength();

    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    if (glowRef.current) {
      gsap.set(glowRef.current, { strokeDasharray: length, strokeDashoffset: length });
    }

    const ctx = gsap.context(() => {
      // Draw the line on scroll
      const drawTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          end: "bottom 30%",
          scrub: 0.6,
        },
      });

      drawTl.to(path, { strokeDashoffset: 0, ease: "none" }, 0);
      if (glowRef.current) {
        drawTl.to(glowRef.current, { strokeDashoffset: 0, ease: "none" }, 0);
      }

      // Text reveal per block
      blockRefs.current.forEach((block, blockIdx) => {
        if (!block) return;
        const lines = block.querySelectorAll<HTMLElement>(".manifesto-line");

        gsap.set(lines, { opacity: 0, y: 50 });

        ScrollTrigger.create({
          trigger: block,
          start: "top 78%",
          onEnter: () => {
            lines.forEach((line, i) => {
              const text = blocks[blockIdx]?.lines[i];
              if (!text || text === "") return;

              gsap.to(line, {
                opacity: 1,
                y: 0,
                duration: 0.9,
                delay: i * 0.15,
                ease: "power3.out",
                onStart: () => scrambleLine(line, text),
              });
            });
          },
          onLeaveBack: () => {
            gsap.to(lines, {
              opacity: 0,
              y: 50,
              duration: 0.4,
              stagger: 0.04,
              ease: "power2.in",
            });
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Centered, loopy flowing path with elegant curves and loops
  const svgPath = `
    M 260 20
    C 320 60, 380 120, 340 180
    C 300 240, 200 200, 180 260
    C 160 320, 240 380, 320 360
    C 400 340, 420 280, 380 220
    C 340 160, 240 180, 200 240
    C 160 300, 200 400, 280 420
    Q 360 440, 340 520
    C 320 600, 220 580, 180 640
    C 140 700, 200 780, 280 780
    C 360 780, 400 720, 380 660
    C 360 600, 280 580, 240 640
    C 200 700, 240 800, 320 820
    Q 400 840, 380 920
    C 360 1000, 260 980, 220 1040
    C 180 1100, 240 1180, 320 1180
    C 400 1180, 440 1120, 400 1060
    C 360 1000, 260 1020, 220 1080
    C 180 1140, 220 1240, 300 1260
    Q 380 1280, 360 1360
    C 340 1440, 240 1420, 200 1480
    C 160 1540, 220 1620, 300 1620
    C 380 1620, 420 1560, 380 1500
    C 340 1440, 260 1460, 240 1540
    C 220 1620, 280 1720, 340 1740
    Q 400 1760, 360 1840
  `;

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      className="relative py-40 md:py-56"
      style={{ background: "hsl(var(--section-dark))" }}
    >
      {/* SVG flowing loopy line */}
      <svg
        ref={svgRef}
        className="absolute pointer-events-none"
        style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "100%", height: "100%" }}
        viewBox="0 0 520 1860"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
      >
        <defs>
          <filter id="lineGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Glow layer */}
        <path
          ref={glowRef}
          d={svgPath}
          stroke="hsl(0 0% 30%)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.35"
          filter="url(#lineGlow)"
        />

        {/* Main line */}
        <path
          ref={pathRef}
          d={svgPath}
          stroke="hsl(0 0% 35%)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.8"
        />
      </svg>

      <div className="relative z-10 max-w-4xl mx-auto px-8 md:px-16">
        {blocks.map((block, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) blockRefs.current[i] = el;
            }}
            className={i < blocks.length - 1 ? "mb-44 md:mb-64" : ""}
          >
            {/* Block number */}
            <span
              className="text-[10px] tracking-[0.5em] uppercase mb-6 block"
              style={{
                color: "hsl(var(--muted-foreground))",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              0{i + 1}
            </span>

            {block.lines.map((line, j) => (
              <p
                key={j}
                className="manifesto-line text-2xl md:text-4xl lg:text-5xl leading-snug md:leading-snug font-bold"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  color: line === "" ? "transparent" : "hsl(var(--foreground))",
                  minHeight: line === "" ? "0.6em" : undefined,
                  opacity: 0,
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
