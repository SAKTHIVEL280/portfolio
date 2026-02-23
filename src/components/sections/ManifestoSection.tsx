import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Words to highlight with animated background
const highlightWords = new Set([
  "intuition", "systems", "ship", "production", "live", "faster",
  "No ceremony", "works", "question", "product"
]);

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
    // Only scramble the text nodes, not the highlighted spans
    const spans = el.querySelectorAll<HTMLElement>("[data-word]");
    if (spans.length > 0) {
      spans.forEach((span) => {
        const word = span.getAttribute("data-word") || "";
        span.textContent = word
          .split("")
          .map((char, i) => {
            if (i < (iteration / maxIterations) * word.length) return char;
            if (char === " ") return " ";
            return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
          })
          .join("");
      });
    } else {
      el.textContent = finalText
        .split("")
        .map((char, i) => {
          if (i < (iteration / maxIterations) * finalText.length) return char;
          if (char === " ") return " ";
          return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        })
        .join("");
    }
    iteration++;
    if (iteration > maxIterations) {
      clearInterval(interval);
      // Restore the original HTML
      if (spans.length > 0) {
        spans.forEach((span) => {
          span.textContent = span.getAttribute("data-word") || "";
        });
      } else {
        el.textContent = finalText;
      }
    }
  }, 30);
};

// Renders line with highlighted words wrapped in spans
const renderLineWithHighlights = (line: string) => {
  if (line === "") return null;

  // Check for multi-word highlights first
  let parts: (string | { text: string; highlighted: boolean })[] = [line];

  // Process highlights
  const processed: (string | { text: string; highlighted: boolean })[] = [];
  const sortedHighlights = Array.from(highlightWords).sort((a, b) => b.length - a.length);

  let remaining = line;
  const result: { text: string; highlighted: boolean }[] = [];

  while (remaining.length > 0) {
    let found = false;
    for (const word of sortedHighlights) {
      const idx = remaining.indexOf(word);
      if (idx === 0) {
        result.push({ text: word, highlighted: true });
        remaining = remaining.slice(word.length);
        found = true;
        break;
      } else if (idx > 0) {
        result.push({ text: remaining.slice(0, idx), highlighted: false });
        result.push({ text: word, highlighted: true });
        remaining = remaining.slice(idx + word.length);
        found = true;
        break;
      }
    }
    if (!found) {
      result.push({ text: remaining, highlighted: false });
      remaining = "";
    }
  }

  return result.map((part, i) =>
    part.highlighted ? (
      <span
        key={i}
        data-word={part.text}
        className="highlight-word"
        style={{
          position: "relative",
          display: "inline",
        }}
      >
        <span
          className="highlight-bg"
          style={{
            position: "absolute",
            inset: "-2px -6px",
            borderRadius: "4px",
            background: "hsl(0 0% 22%)",
            transform: "scaleX(0)",
            transformOrigin: "left",
            zIndex: 0,
          }}
        />
        <span style={{ position: "relative", zIndex: 1 }}>{part.text}</span>
      </span>
    ) : (
      <span key={i} data-word={part.text}>{part.text}</span>
    )
  );
};

const ManifestoSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const blockRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!pathRef.current || !sectionRef.current) return;

    const path = pathRef.current;
    const length = path.getTotalLength();

    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

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
                onStart: () => {
                  scrambleLine(line, text);
                  // Animate highlight backgrounds
                  const highlightBgs = line.querySelectorAll<HTMLElement>(".highlight-bg");
                  highlightBgs.forEach((bg, hIdx) => {
                    gsap.to(bg, {
                      scaleX: 1,
                      duration: 0.6,
                      delay: i * 0.15 + 0.3 + hIdx * 0.1,
                      ease: "power3.out",
                    });
                  });
                },
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
            // Reset highlights
            const highlightBgs = block.querySelectorAll<HTMLElement>(".highlight-bg");
            gsap.set(highlightBgs, { scaleX: 0 });
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Clean elegant path — starts from top-left, smooth flowing S-curves
  const svgPath = `
    M 0 40
    C 60 40, 140 60, 200 120
    C 280 200, 350 280, 420 260
    C 500 240, 520 160, 480 100
    C 440 40, 340 60, 300 140
    C 260 220, 280 340, 380 380
    C 480 420, 520 360, 500 280
    C 480 200, 380 160, 300 220
    C 200 300, 120 420, 160 520
    C 200 620, 360 640, 440 580
    C 520 520, 480 440, 400 420
    C 300 400, 160 480, 120 580
    C 80 680, 180 780, 300 780
    C 420 780, 500 700, 480 620
    C 460 540, 360 500, 280 560
    C 180 630, 100 740, 140 840
    C 180 940, 320 980, 420 940
    C 520 900, 500 820, 420 800
    C 320 780, 180 840, 140 940
    C 100 1040, 200 1140, 340 1140
    C 480 1140, 520 1060, 480 980
    C 440 900, 320 880, 240 940
    C 140 1020, 80 1140, 140 1240
    C 200 1340, 360 1360, 440 1300
    C 520 1240, 480 1160, 400 1160
    C 300 1160, 160 1240, 140 1340
    C 120 1440, 240 1540, 380 1520
    C 480 1500, 520 1420, 460 1380
    C 380 1340, 240 1400, 200 1500
    C 160 1600, 280 1700, 400 1680
    C 500 1660, 520 1580, 460 1540
    C 380 1500, 220 1560, 180 1660
    C 140 1760, 260 1860, 380 1840
    C 460 1820, 480 1780, 440 1760
    C 380 1740, 300 1800, 280 1880
    L 280 1960
  `;

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      className="relative py-40 md:py-56"
      style={{ background: "hsl(var(--section-dark))" }}
    >
      {/* SVG flowing line — thicker stroke, starts top-left */}
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 540 1960"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          ref={pathRef}
          d={svgPath}
          stroke="hsl(0 0% 35%)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.85"
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
                {renderLineWithHighlights(line)}
              </p>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ManifestoSection;
