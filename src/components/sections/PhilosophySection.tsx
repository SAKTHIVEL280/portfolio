import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const principles = [
  {
    title: "Applied AI",
    description:
      "Not AI for AI's sake. Every model, pipeline, and automation I build solves a tangible problem — reducing cost, increasing speed, or eliminating human error at scale.",
  },
  {
    title: "SaaS Architecture",
    description:
      "Multi-tenant systems, subscription billing, role-based access, and real-time data. I architect products that scale from day one with clean separation of concerns.",
  },
  {
    title: "Rapid Deployment",
    description:
      "From zero to production in days, not months. CI/CD pipelines, infrastructure as code, and relentless prioritization of shipping over perfection.",
  },
  {
    title: "User-Centric Design",
    description:
      "Beautiful interfaces that don't make you think. Every interaction is intentional. Every pixel serves a purpose. Design is the product.",
  },
];

const PhilosophySection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const blockRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      blockRefs.current.forEach((block) => {
        if (!block) return;
        gsap.set(block, { clipPath: "inset(100% 0 0 0)" });
        gsap.to(block, {
          clipPath: "inset(0% 0 0 0)",
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: block,
            start: "top 80%",
            end: "top 30%",
            scrub: 0.5,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="philosophy" className="min-h-[300vh] relative pb-0" style={{ background: "hsl(var(--section-dark))" }}>
      <div className="flex flex-col md:flex-row">
        {/* Sticky left heading */}
        <div className="md:w-1/2 md:h-screen md:sticky md:top-0 flex items-center px-8 md:px-16 py-20 md:py-0">
          <h2
            className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(var(--foreground))" }}
          >
            I don't chase innovation.
            <br />
            <span className="text-muted-foreground">I eliminate friction.</span>
          </h2>
        </div>

        {/* Scrolling right principles */}
        <div className="md:w-1/2 flex flex-col gap-0 px-8 md:px-16 pb-8">
          {principles.map((p, i) => (
            <div
              key={i}
              ref={(el) => { if (el) blockRefs.current[i] = el; }}
              className="py-24 md:py-32 border-t border-border"
            >
              <span className="text-xs tracking-widest uppercase text-muted-foreground mb-4 block">
                0{i + 1}
              </span>
              <h3
                className="text-2xl md:text-4xl font-bold mb-6"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(var(--foreground))" }}
              >
                {p.title}
              </h3>
              <p className="text-base md:text-lg leading-relaxed text-muted-foreground max-w-md" style={{ fontFamily: "'Inter', sans-serif" }}>
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PhilosophySection;
