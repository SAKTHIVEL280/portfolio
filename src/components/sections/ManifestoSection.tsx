import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const highlightWords = new Set([
  "intuition", "systems", "ship", "production", "live", "faster",
  "No ceremony", "works", "question", "product"
]);

const blocks = [
  { lines: ["I don't begin with tools or trends.", "I begin with intuition ~", "then turn it into systems."] },
  { lines: ["I design and ship complex software", "by collapsing ideas directly", "into production."] },
  { lines: ["From concept to live deployment,", "faster than traditional", "development allows.", "", "No ceremony. No unnecessary layers.", "Just software that works."] },
  { lines: ["Every project here started", "as a question.", "The answer became a product."] },
];

const SYMBOLS = "!@#$%&*+^?/<>{}[]~";

const scrambleLine = (el: HTMLElement, _finalText: string) => {
  let iteration = 0;
  const maxIterations = 10;
  const textTargets: { el: HTMLElement; word: string }[] = [];
  el.querySelectorAll<HTMLElement>(".highlight-text").forEach((ht) => {
    textTargets.push({ el: ht, word: ht.textContent || "" });
  });
  el.querySelectorAll<HTMLElement>("[data-word]").forEach((pw) => {
    if (pw.classList.contains("highlight-word")) return;
    textTargets.push({ el: pw, word: pw.getAttribute("data-word") || "" });
  });
  if (textTargets.length === 0) return;
  const interval = setInterval(() => {
    textTargets.forEach(({ el: target, word }) => {
      target.textContent = word.split("").map((char, i) => {
        if (i < (iteration / maxIterations) * word.length) return char;
        if (char === " ") return " ";
        return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      }).join("");
    });
    iteration++;
    if (iteration > maxIterations) {
      clearInterval(interval);
      textTargets.forEach(({ el: target, word }) => { target.textContent = word; });
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
        let end = word.length;
        while (end < remaining.length && /[.,;:!?]/.test(remaining[end])) end++;
        result.push({ text: remaining.slice(0, end), highlighted: true });
        remaining = remaining.slice(end);
        found = true;
        break;
      } else if (idx > 0) {
        result.push({ text: remaining.slice(0, idx), highlighted: false });
        let end = idx + word.length;
        while (end < remaining.length && /[.,;:!?]/.test(remaining[end])) end++;
        result.push({ text: remaining.slice(idx, end), highlighted: true });
        remaining = remaining.slice(end);
        found = true;
        break;
      }
    }
    if (!found) { result.push({ text: remaining, highlighted: false }); remaining = ""; }
  }

  return result.map((part, i) =>
    part.highlighted ? (
      <span key={i} data-word={part.text} className="highlight-word relative inline-block">
        <span className="highlight-bg absolute inset-[-4px_-12px] rounded-md bg-manifesto-active origin-left" style={{ transform: "scaleX(0)" }} />
        <span className="highlight-text relative z-10 text-text-dark transition-colors duration-300">{part.text}</span>
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
      gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top 60%", end: "bottom 30%", scrub: 0.6 },
      }).to(path, { strokeDashoffset: 0, ease: "none" }, 0);

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
                opacity: 1, y: 0, duration: 0.9, delay: i * 0.15, ease: "power3.out",
                onStart: () => {
                  scrambleLine(line, text);
                  const bgs = line.querySelectorAll<HTMLElement>(".highlight-bg");
                  bgs.forEach((bg, bgIdx) => {
                    gsap.to(bg, { scaleX: 1, duration: 0.6, delay: 0.35 + bgIdx * 0.1, ease: "power3.out" });
                  });
                },
              });
            });
          },
          onLeaveBack: () => {
            gsap.to(lines, { opacity: 0, y: 50, duration: 0.4, stagger: 0.04, ease: "power2.in" });
            gsap.set(block.querySelectorAll<HTMLElement>(".highlight-bg"), { scaleX: 0 });
          },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const svgPath = `M 0 40 C 100 40, 200 120, 300 240 S 460 440, 540 400 S 500 280, 400 300 S 200 500, 160 700 S 260 900, 400 880 S 540 780, 520 920 S 360 1100, 200 1100 S 80 1200, 160 1360 S 380 1480, 540 1400`;

  return (
    <section ref={sectionRef} id="manifesto" className="relative py-40 md:py-56 bg-surface-dark">
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 540 1500" preserveAspectRatio="none" fill="none">
        <path ref={pathRef} d={svgPath} className="stroke-manifesto-muted" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5" />
      </svg>

      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 md:px-16">
        {blocks.map((block, i) => (
          <div key={i} ref={(el) => { if (el) blockRefs.current[i] = el; }} className={i < blocks.length - 1 ? "mb-44 md:mb-64" : ""}>
            <span className="text-[10px] tracking-[0.5em] uppercase mb-6 block font-body text-muted-foreground">0{i + 1}</span>
            {block.lines.map((line, j) => (
              <p
                key={j}
                className="manifesto-line text-xl sm:text-2xl md:text-4xl lg:text-5xl leading-snug md:leading-snug font-bold font-heading text-foreground"
                style={{ color: line === "" ? "transparent" : undefined, minHeight: line === "" ? "0.6em" : undefined, opacity: 0 }}
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
