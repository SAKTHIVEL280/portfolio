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

  // Centered loopy path — sweeps left and right equally with smooth curves and loops
  const svgPath = `
    M 250 0
    C 80 60, 40 140, 120 200
    C 200 260, 380 200, 420 280
    C 460 360, 340 420, 240 400
    C 140 380, 60 440, 100 520
    C 140 600, 300 580, 400 620
    C 500 660, 460 760, 340 780
    C 220 800, 80 760, 60 840
    C 40 920, 180 960, 300 940
    C 420 920, 480 1000, 400 1060
    C 320 1120, 120 1080, 80 1160
    C 40 1240, 200 1300, 340 1280
    C 480 1260, 500 1360, 400 1420
    C 300 1480, 100 1440, 80 1520
    C 60 1600, 220 1660, 360 1640
    C 500 1620, 480 1720, 360 1760
    C 240 1800, 140 1860, 250 1900
  `;

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      className="relative py-40 md:py-56"
      style={{ background: "hsl(var(--section-dark))" }}
    >
      {/* SVG flowing loopy line — centered */}
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 540 1900"
        preserveAspectRatio="none"
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
          opacity="0.25"
          filter="url(#lineGlow)"
        />

        {/* Main line */}
        <path
          ref={pathRef}
          d={svgPath}
          stroke="hsl(0 0% 35%)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.7"
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
