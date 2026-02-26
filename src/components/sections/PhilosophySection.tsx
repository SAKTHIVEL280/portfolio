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
  const headingRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const numberRefs = useRef<HTMLSpanElement[]>([]);
  const titleRefs = useRef<HTMLHeadingElement[]>([]);
  const descRefs = useRef<HTMLParagraphElement[]>([]);
  const lineRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading — smooth fade up with slight Y offset
      if (headingRef.current) {
        const line1 = headingRef.current.querySelector(".phil-line-1");
        const line2 = headingRef.current.querySelector(".phil-line-2");

        if (line1) {
          gsap.fromTo(line1,
            { y: 40, opacity: 0 },
            {
              y: 0, opacity: 1, duration: 1.2, ease: "power3.out",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 75%",
                end: "bottom top",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
        if (line2) {
          gsap.fromTo(line2,
            { y: 40, opacity: 0 },
            {
              y: 0, opacity: 1, duration: 1.2, delay: 0.2, ease: "power3.out",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 75%",
                end: "bottom top",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      }

      // Cards — clean, elegant stagger
      cardRefs.current.forEach((card, i) => {
        if (!card) return;

        const line = lineRefs.current[i];
        const number = numberRefs.current[i];
        const title = titleRefs.current[i];
        const desc = descRefs.current[i];

        // Timeline for each card — one cohesive sequence
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });

        // Border line draws in smoothly
        if (line) {
          tl.fromTo(line,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.8, ease: "power2.inOut" },
            0
          );
        }

        // Number fades in
        if (number) {
          tl.fromTo(number,
            { y: 12, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
            0.2
          );
        }

        // Title fades up
        if (title) {
          tl.fromTo(title,
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
            0.3
          );
        }

        // Description fades up
        if (desc) {
          tl.fromTo(desc,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
            0.45
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="philosophy" className="relative py-24 md:py-32" style={{ background: "hsl(var(--section-dark))" }}>
      <div className="flex flex-col md:flex-row">
        {/* Sticky left heading */}
        <div className="md:w-1/2 md:h-screen md:sticky md:top-0 flex items-center px-8 md:px-16 py-20 md:py-0">
          <div ref={headingRef}>
            <h2
              className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(var(--foreground))" }}
            >
              <span className="phil-line-1 block" style={{ opacity: 0 }}>I don't chase innovation.</span>
              <span className="phil-line-2 block text-muted-foreground" style={{ opacity: 0 }}>I eliminate friction.</span>
            </h2>
          </div>
        </div>

        {/* Scrolling right principles */}
        <div className="md:w-1/2 flex flex-col gap-0 px-8 md:px-16 pb-16">
          {principles.map((p, i) => (
            <div
              key={i}
              ref={(el) => { if (el) cardRefs.current[i] = el; }}
              className="py-16 md:py-20"
            >
              {/* Animated border */}
              <div
                ref={(el) => { if (el) lineRefs.current[i] = el; }}
                className="h-px w-full mb-8 origin-left"
                style={{ background: "hsl(var(--border))", transform: "scaleX(0)" }}
              />
              <span
                ref={(el) => { if (el) numberRefs.current[i] = el; }}
                className="text-xs tracking-widest uppercase text-muted-foreground mb-4 block"
                style={{ opacity: 0 }}
              >
                0{i + 1}
              </span>
              <h3
                ref={(el) => { if (el) titleRefs.current[i] = el; }}
                className="text-2xl md:text-4xl font-bold mb-6"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(var(--foreground))", opacity: 0 }}
              >
                {p.title}
              </h3>
              <p
                ref={(el) => { if (el) descRefs.current[i] = el; }}
                className="text-base md:text-lg leading-relaxed text-muted-foreground max-w-md"
                style={{ fontFamily: "'Inter', sans-serif", opacity: 0 }}
              >
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
