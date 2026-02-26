import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const coreSkills = ["Python", "C", "Java", "SQL", "Firebase", "Supabase", "Vercel"];
const aiSkills = ["Applied AI", "AI Automations", "Context Engineering", "AI Designing"];
const augmentedSkills = ["JavaScript", "React", "Next.js", "Tauri"];

const SkillsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const wavePath1 = useRef<SVGPathElement>(null);
  const wavePath2 = useRef<SVGPathElement>(null);
  const wavePath3 = useRef<SVGPathElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (wavePath1.current) {
        gsap.fromTo(wavePath1.current,
          { attr: { d: "M0,120 C180,20 360,220 540,80 C720,-40 900,200 1080,60 C1260,-20 1380,180 1440,100 L1440,320 L0,320 Z" } },
          { attr: { d: "M0,300 C180,305 360,298 540,302 C720,300 900,304 1080,300 C1260,302 1380,300 1440,300 L1440,320 L0,320 Z" }, ease: "power1.inOut",
            scrollTrigger: { trigger: sectionRef.current, start: "top 100%", end: "top 20%", scrub: 0.5 } }
        );
      }
      if (wavePath2.current) {
        gsap.fromTo(wavePath2.current,
          { attr: { d: "M0,160 C200,60 400,260 600,100 C800,0 1000,240 1200,120 C1350,40 1400,200 1440,140 L1440,320 L0,320 Z" } },
          { attr: { d: "M0,304 C200,300 400,306 600,302 C800,304 1000,300 1200,304 C1350,302 1400,304 1440,302 L1440,320 L0,320 Z" }, ease: "power1.inOut",
            scrollTrigger: { trigger: sectionRef.current, start: "top 95%", end: "top 15%", scrub: 0.8 } }
        );
      }
      if (wavePath3.current) {
        gsap.fromTo(wavePath3.current,
          { attr: { d: "M0,200 C240,100 480,280 720,150 C960,60 1200,260 1440,180 L1440,320 L0,320 Z" } },
          { attr: { d: "M0,308 C240,306 480,310 720,306 C960,308 1200,306 1440,308 L1440,320 L0,320 Z" }, ease: "power1.inOut",
            scrollTrigger: { trigger: sectionRef.current, start: "top 90%", end: "top 10%", scrub: 1.2 } }
        );
      }

      if (cardsRef.current) {
        const items = cardsRef.current.querySelectorAll(".skill-card");
        gsap.fromTo(items, { y: 60, opacity: 0 }, {
          y: 0, opacity: 1, stagger: 0.04, duration: 0.6, ease: "power3.out",
          scrollTrigger: { trigger: cardsRef.current, start: "top 80%", end: "top 20%", toggleActions: "play none none none" },
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const SkillPill = ({ skill, variant }: { skill: string; variant: "light" | "dark" }) => (
    <div className={`skill-card group relative px-6 py-3 rounded-full cursor-default transition-all duration-300 font-heading ${
      variant === "dark"
        ? "bg-text-dark text-primary"
        : "border border-border-light text-text-body"
    }`}>
      <span className={`relative z-10 text-sm md:text-base font-medium transition-colors duration-300 ${
        variant === "dark" ? "group-hover:text-surface-black" : "group-hover:text-surface-pure"
      }`}>
        {skill}
      </span>
      <div className={`absolute inset-0 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 ease-out ${
        variant === "dark"
          ? "bg-pill-hover-bg border border-pill-hover-border"
          : "bg-text-dark"
      }`} />
    </div>
  );

  return (
    <section ref={sectionRef} id="skills" className="relative">
      {/* SVG Morphing Curves */}
      <div className="relative w-full" style={{ marginTop: "-1px" }}>
        <svg viewBox="0 0 1440 320" className="w-full block" preserveAspectRatio="none" style={{ height: "clamp(160px, 25vw, 400px)" }}>
          <path ref={wavePath1} d="M0,120 C180,20 360,220 540,80 C720,-40 900,200 1080,60 C1260,-20 1380,180 1440,100 L1440,320 L0,320 Z" className="fill-surface-muted" />
          <path ref={wavePath2} d="M0,160 C200,60 400,260 600,100 C800,0 1000,240 1200,120 C1350,40 1400,200 1440,140 L1440,320 L0,320 Z" className="fill-surface-soft" />
          <path ref={wavePath3} d="M0,200 C240,100 480,280 720,150 C960,60 1200,260 1440,180 L1440,320 L0,320 Z" className="fill-surface-pure" />
        </svg>
      </div>

      {/* Main Content */}
      <div className="w-full bg-surface-pure">
        <div className="px-8 md:px-16 lg:px-24 pb-32 pt-8">
          <div className="mb-20">
            <p className="text-xs tracking-[0.3em] uppercase mb-4 font-body text-text-caption">What I work with</p>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight font-heading text-text-dark">
              Skills &<br />Stack
            </h2>
          </div>

          <div ref={cardsRef} className="space-y-16">
            <div>
              <h3 className="text-sm tracking-[0.2em] uppercase mb-6 pb-3 font-body text-text-label border-b border-border-lighter">Core Languages & Platforms</h3>
              <div className="flex flex-wrap gap-3">
                {coreSkills.map((skill) => <SkillPill key={skill} skill={skill} variant="light" />)}
              </div>
            </div>

            <div>
              <h3 className="text-sm tracking-[0.2em] uppercase mb-6 pb-3 font-body text-text-label border-b border-border-lighter">AI & Intelligence</h3>
              <div className="flex flex-wrap gap-3">
                {aiSkills.map((skill) => <SkillPill key={skill} skill={skill} variant="dark" />)}
              </div>
            </div>

            <div>
              <h3 className="text-sm tracking-[0.2em] uppercase mb-6 pb-3 font-body text-text-label border-b border-border-lighter">AI-Augmented</h3>
              <div className="flex flex-wrap gap-3">
                {augmentedSkills.map((skill) => <SkillPill key={skill} skill={skill} variant="light" />)}
              </div>
            </div>
          </div>

          <div className="mt-24 max-w-2xl">
            <p className="text-2xl md:text-3xl font-medium leading-relaxed font-heading text-text-subtle">
              I don't just write code — I craft experiences that blur the line between design and engineering.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
