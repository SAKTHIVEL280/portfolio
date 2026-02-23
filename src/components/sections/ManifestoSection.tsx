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

  // Loopy, flowing path with actual loops, figure-eights, and smooth curves
  const svgPath = `
    M -10 40
    C 60 10, 140 10, 200 60
    C 260 110, 220 200, 160 220
    C 100 240, 60 180, 100 140
    C 140 100, 220 120, 260 180
    Q 300 240, 340 200
    C 380 160, 420 100, 400 180
    C 380 260, 300 300, 260 340
    C 220 380, 280 440, 340 420
    C 400 400, 440 340, 460 400
    Q 480 460, 440 500
    C 400 540, 320 520, 280 560
    C 240 600, 300 680, 360 660
    C 420 640, 460 580, 480 640
    C 500 700, 440 760, 380 780
    Q 320 800, 280 840
    C 240 880, 300 940, 360 920
    C 420 900, 460 840, 480 900
    C 500 960, 440 1020, 380 1040
    C 320 1060, 240 1020, 220 1080
    C 200 1140, 260 1200, 340 1180
    Q 420 1160, 460 1220
    C 500 1280, 440 1340, 380 1360
    C 320 1380, 240 1340, 200 1400
    C 160 1460, 220 1540, 300 1540
    C 380 1540, 440 1480, 480 1540
    Q 520 1600, 460 1660
    C 400 1720, 300 1700, 240 1740
    C 180 1780, 240 1840, 340 1820
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
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 520 1860"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <filter id="lineGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
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
          stroke="hsl(0 0% 25%)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.2"
          filter="url(#lineGlow)"
        />

        {/* Main line — thicker */}
        <path
          ref={pathRef}
          d={svgPath}
          stroke="hsl(0 0% 22%)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.5"
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
