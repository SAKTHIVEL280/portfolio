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
  const dotRef = useRef<SVGCircleElement>(null);
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

      // Animate dot along path
      if (dotRef.current) {
        drawTl.to(
          dotRef.current,
          {
            motionPath: {
              path: path,
              align: path,
              alignOrigin: [0.5, 0.5],
            },
            ease: "none",
          },
          0
        );

        // We'll manually position the dot using scroll progress
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 60%",
          end: "bottom 30%",
          scrub: 0.6,
          onUpdate: (self) => {
            if (!dotRef.current || !path) return;
            const point = path.getPointAtLength(self.progress * length);
            const svgEl = svgRef.current;
            if (!svgEl) return;
            dotRef.current.setAttribute("cx", String(point.x));
            dotRef.current.setAttribute("cy", String(point.y));
            dotRef.current.style.opacity = self.progress > 0.01 ? "1" : "0";
          },
        });
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

  // Loopy, organic flowing path with actual loops and figure-eights
  const svgPath = `
    M -20 20
    C 80 20, 120 100, 200 120
    C 280 140, 340 60, 380 120
    C 420 180, 360 260, 300 280
    C 240 300, 180 240, 160 300
    C 140 360, 200 420, 280 400
    C 360 380, 420 320, 460 380
    C 500 440, 440 520, 380 540
    C 320 560, 240 500, 200 560
    C 160 620, 220 700, 300 720
    C 380 740, 460 680, 480 740
    C 500 800, 420 860, 360 880
    C 300 900, 220 840, 180 900
    C 140 960, 200 1040, 280 1060
    C 360 1080, 440 1020, 460 1080
    C 480 1140, 400 1200, 340 1220
    C 280 1240, 200 1180, 160 1240
    C 120 1300, 180 1380, 260 1400
    C 340 1420, 420 1360, 460 1420
    C 500 1480, 440 1560, 360 1580
    C 280 1600, 200 1540, 160 1600
    C 120 1660, 200 1740, 300 1760
    C 400 1780, 480 1720, 500 1800
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
        viewBox="0 0 520 1820"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <filter id="glow">
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
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          opacity="0.3"
          filter="url(#glow)"
        />

        {/* Main line */}
        <path
          ref={pathRef}
          d={svgPath}
          stroke="hsl(0 0% 25%)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
        />

        {/* Traveling dot */}
        <circle
          ref={dotRef}
          cx="-20"
          cy="20"
          r="5"
          fill="hsl(0 0% 70%)"
          opacity="0"
          filter="url(#glow)"
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
