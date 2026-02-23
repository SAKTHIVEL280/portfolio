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
      "faster than traditional development allows.",
      "",
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

const ManifestoSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const blockRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!pathRef.current || !sectionRef.current) return;

    const path = pathRef.current;
    const length = path.getTotalLength();

    // Set initial state — full dash, fully hidden
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });

    const ctx = gsap.context(() => {
      // Draw the SVG line on scroll
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 0.3,
        },
      });

      // Animate each text block
      blockRefs.current.forEach((block) => {
        if (!block) return;
        const lines = block.querySelectorAll(".manifesto-line");

        gsap.set(lines, { opacity: 0, y: 40 });

        ScrollTrigger.create({
          trigger: block,
          start: "top 75%",
          end: "top 30%",
          onEnter: () => {
            gsap.to(lines, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.12,
              ease: "power3.out",
            });
          },
          onLeaveBack: () => {
            gsap.to(lines, {
              opacity: 0,
              y: 40,
              duration: 0.4,
              stagger: 0.05,
              ease: "power2.in",
            });
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Flowing SVG path that weaves through the section
  // Coordinates designed for a tall section with 4 blocks
  const svgPath = `
    M -50 0 
    C 200 80, 400 160, 300 320
    S 80 480, 200 640
    S 500 720, 420 960
    S 100 1040, 180 1200
    S 480 1360, 360 1520
    S 60 1600, 200 1760
    S 500 1840, 380 2000
    S 120 2160, 250 2300
    C 380 2400, 500 2500, 450 2600
  `;

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      className="relative py-32 md:py-48"
      style={{ background: "hsl(var(--section-dark))" }}
    >
      {/* Flowing SVG line */}
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 500 2600"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          ref={pathRef}
          d={svgPath}
          stroke="hsl(var(--border))"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />
      </svg>

      <div className="relative z-10 max-w-4xl mx-auto px-8 md:px-16">
        {blocks.map((block, i) => (
          <div
            key={i}
            ref={(el) => { if (el) blockRefs.current[i] = el; }}
            className={`${i < blocks.length - 1 ? "mb-40 md:mb-56" : ""}`}
          >
            {block.lines.map((line, j) => (
              <p
                key={j}
                className="manifesto-line text-2xl md:text-4xl lg:text-5xl leading-snug md:leading-snug font-bold"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  color: line === "" ? "transparent" : "hsl(var(--foreground))",
                  minHeight: line === "" ? "0.5em" : undefined,
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
