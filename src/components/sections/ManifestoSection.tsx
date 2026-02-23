import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

const renderLineWithHighlights = (line: string) => {
  if (line === "") return null;

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
        style={{ position: "relative", display: "inline" }}
      >
        <span
          className="highlight-bg"
          style={{
            position: "absolute",
            inset: "-4px -8px",
            borderRadius: "6px",
            background: "hsl(0 0% 20%)",
            transform: "scaleX(0)",
            transformOrigin: "left",
            zIndex: 0,
            transition: "none",
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
  const pathRef = useRef<SVGPathElement>(null);
  const blockRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!pathRef.current || !sectionRef.current) return;

    const path = pathRef.current;
    const length = path.getTotalLength();

    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

    const ctx = gsap.context(() => {
      // Draw SVG line on scroll
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          end: "bottom 30%",
          scrub: 0.6,
        },
      }).to(path, { strokeDashoffset: 0, ease: "none" }, 0);

      // Text blocks with highlights
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
                  // Animate ALL highlight backgrounds in this line
                  const bgs = line.querySelectorAll<HTMLElement>(".highlight-bg");
                  if (bgs.length > 0) {
                    gsap.to(bgs, {
                      scaleX: 1,
                      duration: 0.7,
                      delay: 0.4,
                      stagger: 0.1,
                      ease: "power3.out",
                    });
                  }
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
            const bgs = block.querySelectorAll<HTMLElement>(".highlight-bg");
            gsap.set(bgs, { scaleX: 0 });
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Simple elegant path — starts top-left, smooth flowing curves, NO tight loops
  const svgPath = `
    M 0 20
    C 120 20, 200 100, 270 200
    C 340 300, 420 350, 500 300
    C 560 260, 520 180, 440 160
    C 360 140, 300 220, 320 320
    C 340 440, 460 520, 540 480
    L 540 480
    C 540 480, 480 560, 380 620
    C 280 680, 180 720, 140 800
    C 100 880, 160 960, 260 980
    C 360 1000, 480 940, 520 860
    C 540 800, 480 740, 400 740
    C 300 740, 200 820, 180 920
    C 160 1040, 240 1160, 360 1180
    C 480 1200, 540 1120, 520 1040
    C 500 960, 400 920, 320 960
    C 220 1020, 140 1140, 180 1260
    C 220 1380, 360 1440, 460 1400
    C 520 1370, 540 1300, 480 1260
    C 420 1220, 320 1280, 300 1380
    C 280 1480, 360 1580, 460 1560
    C 520 1540, 540 1480, 500 1440
  `;

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      className="relative py-40 md:py-56"
      style={{ background: "hsl(var(--section-dark))" }}
    >
      {/* SVG flowing line — much thicker, clean curves */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 540 1560"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          ref={pathRef}
          d={svgPath}
          stroke="hsl(0 0% 25%)"
          strokeWidth="8"
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
            ref={(el) => { if (el) blockRefs.current[i] = el; }}
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
