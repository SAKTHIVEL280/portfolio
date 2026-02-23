import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const coreSkills = [
  "Python", "C", "Java", "SQL", "Firebase", "Supabase", "Vercel"
];

const aiSkills = [
  "Applied AI", "AI Automations", "Context Engineering", "AI Designing"
];

const augmentedSkills = [
  "JavaScript", "React", "Next.js", "Tauri"
];

const SkillsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const svgPathRef = useRef<SVGPathElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  // SVG curve morph on scroll
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (svgPathRef.current) {
        gsap.fromTo(
          svgPathRef.current,
          { attr: { d: "M0,80 Q360,160 720,80 Q1080,0 1440,80 L1440,200 L0,200 Z" } },
          {
            attr: { d: "M0,180 Q360,180 720,180 Q1080,180 1440,180 L1440,200 L0,200 Z" },
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 90%",
              end: "top 30%",
              scrub: 0.6,
            },
          }
        );
      }

      // Stagger in skill cards
      if (cardsRef.current) {
        const items = cardsRef.current.querySelectorAll(".skill-card");
        gsap.fromTo(
          items,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.04,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="skills" className="relative">
      {/* SVG Morphing Curve */}
      <div className="relative w-full" style={{ marginTop: "-1px" }}>
        <svg
          viewBox="0 0 1440 200"
          className="w-full block"
          preserveAspectRatio="none"
          style={{ height: "clamp(80px, 12vw, 200px)" }}
        >
          <path
            ref={svgPathRef}
            d="M0,80 Q360,160 720,80 Q1080,0 1440,80 L1440,200 L0,200 Z"
            fill="hsl(0 0% 100%)"
          />
        </svg>
      </div>

      {/* Main Content */}
      <div
        className="w-full"
        style={{ background: "hsl(0 0% 100%)" }}
      >
        <div className="px-8 md:px-16 lg:px-24 pb-32 pt-8">
          {/* Header */}
          <div className="mb-20">
            <p
              className="text-xs tracking-[0.3em] uppercase mb-4"
              style={{ color: "hsl(0 0% 50%)", fontFamily: "'Inter', sans-serif" }}
            >
              What I work with
            </p>
            <h2
              className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight"
              style={{ color: "hsl(0 0% 4%)" }}
            >
              Skills &<br />Stack
            </h2>
          </div>

          {/* Skill Groups */}
          <div ref={cardsRef} className="space-y-16">
            {/* Core */}
            <div>
              <h3
                className="text-sm tracking-[0.2em] uppercase mb-6 pb-3"
                style={{
                  color: "hsl(0 0% 40%)",
                  fontFamily: "'Inter', sans-serif",
                  borderBottom: "1px solid hsl(0 0% 88%)",
                }}
              >
                Core Languages & Platforms
              </h3>
              <div className="flex flex-wrap gap-3">
                {coreSkills.map((skill) => (
                  <div
                    key={skill}
                    className="skill-card group relative px-6 py-3 rounded-full cursor-default transition-all duration-300"
                    style={{
                      border: "1px solid hsl(0 0% 85%)",
                      color: "hsl(0 0% 15%)",
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    <span className="relative z-10 text-sm md:text-base font-medium transition-colors duration-300 group-hover:text-white">
                      {skill}
                    </span>
                    <div
                      className="absolute inset-0 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 ease-out"
                      style={{ background: "hsl(0 0% 8%)" }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* AI */}
            <div>
              <h3
                className="text-sm tracking-[0.2em] uppercase mb-6 pb-3"
                style={{
                  color: "hsl(0 0% 40%)",
                  fontFamily: "'Inter', sans-serif",
                  borderBottom: "1px solid hsl(0 0% 88%)",
                }}
              >
                AI & Intelligence
              </h3>
              <div className="flex flex-wrap gap-3">
                {aiSkills.map((skill) => (
                  <div
                    key={skill}
                    className="skill-card group relative px-6 py-3 rounded-full cursor-default transition-all duration-300"
                    style={{
                      background: "hsl(0 0% 8%)",
                      color: "hsl(0 0% 95%)",
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    <span className="relative z-10 text-sm md:text-base font-medium transition-colors duration-300 group-hover:text-black">
                      {skill}
                    </span>
                    <div
                      className="absolute inset-0 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 ease-out"
                      style={{ background: "hsl(0 0% 92%)", border: "1px solid hsl(0 0% 80%)" }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Augmented */}
            <div>
              <h3
                className="text-sm tracking-[0.2em] uppercase mb-6 pb-3"
                style={{
                  color: "hsl(0 0% 40%)",
                  fontFamily: "'Inter', sans-serif",
                  borderBottom: "1px solid hsl(0 0% 88%)",
                }}
              >
                AI-Augmented
              </h3>
              <div className="flex flex-wrap gap-3">
                {augmentedSkills.map((skill) => (
                  <div
                    key={skill}
                    className="skill-card group relative px-6 py-3 rounded-full cursor-default transition-all duration-300"
                    style={{
                      border: "1px solid hsl(0 0% 85%)",
                      color: "hsl(0 0% 15%)",
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    <span className="relative z-10 text-sm md:text-base font-medium transition-colors duration-300 group-hover:text-white">
                      {skill}
                    </span>
                    <div
                      className="absolute inset-0 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 ease-out"
                      style={{ background: "hsl(0 0% 8%)" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom statement */}
          <div className="mt-24 max-w-2xl">
            <p
              className="text-2xl md:text-3xl font-medium leading-relaxed"
              style={{ color: "hsl(0 0% 20%)", fontFamily: "'Space Grotesk', sans-serif" }}
            >
              I don't just write code — I craft experiences that blur the line between design and engineering.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
