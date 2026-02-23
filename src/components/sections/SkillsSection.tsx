import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Matter from "matter-js";

gsap.registerPlugin(ScrollTrigger);

const coreSkills = [
  "Python", "C", "Java", "Applied AI", "AI Automations",
  "SQL", "Firebase", "Supabase", "Vercel", "Context Engineering", "AI Designing",
];
const augmentedSkills = ["JavaScript", "React", "Next.js", "Tauri"];

const SkillsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const curveRef = useRef<HTMLDivElement>(null);
  const physicsRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const bodiesRef = useRef<Matter.Body[]>([]);
  const [hasDropped, setHasDropped] = useState(false);

  // Curve flattening on scroll
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (curveRef.current) {
        gsap.fromTo(
          curveRef.current,
          { borderRadius: "50% 50% 0 0 / 100px 100px 0 0" },
          {
            borderRadius: "0% 0% 0 0 / 0px 0px 0 0",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              end: "top 20%",
              scrub: true,
            },
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Matter.js physics — only start when section enters view
  useEffect(() => {
    const container = physicsRef.current;
    if (!container) return;

    const { Engine, World, Bodies, Mouse, MouseConstraint, Runner } = Matter;
    const engine = Engine.create({ gravity: { x: 0, y: 0, scale: 0.001 } });
    engineRef.current = engine;

    const width = container.offsetWidth;
    const height = 500;

    // Walls
    const walls = [
      Bodies.rectangle(width / 2, height + 25, width, 50, { isStatic: true }),
      Bodies.rectangle(-25, height / 2, 50, height, { isStatic: true }),
      Bodies.rectangle(width + 25, height / 2, 50, height, { isStatic: true }),
    ];
    World.add(engine.world, walls);

    // Create pill bodies — positioned in a grid, gravity off initially
    const allSkills = [
      ...coreSkills.map((s) => ({ label: s, type: "core" as const })),
      ...augmentedSkills.map((s) => ({ label: s, type: "augmented" as const })),
    ];

    const bodies = allSkills.map((skill, i) => {
      const pillWidth = skill.label.length * 10 + 40;
      const pillHeight = 40;
      const cols = 4;
      const colWidth = (width - 120) / cols;
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = 80 + col * colWidth + Math.random() * 30;
      const y = 60 + row * 55;
      const body = Bodies.rectangle(x, y, pillWidth, pillHeight, {
        chamfer: { radius: 20 },
        restitution: 0.5,
        friction: 0.1,
        frictionAir: 0.02,
        label: skill.label,
        isStatic: true,
      });
      (body as any).skillType = skill.type;
      (body as any).skillIndex = i;
      return body;
    });

    bodiesRef.current = bodies;
    World.add(engine.world, bodies);

    // Mouse constraint
    const mouse = Mouse.create(container);
    const mc = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });
    World.add(engine.world, mc);

    // Runner
    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    // Sync DOM
    const sync = () => {
      bodies.forEach((body) => {
        const idx = (body as any).skillIndex;
        const el = pillRefs.current.get(idx);
        if (el) {
          el.style.transform = `translate(${body.position.x - el.offsetWidth / 2}px, ${body.position.y - el.offsetHeight / 2}px) rotate(${body.angle}rad)`;
        }
      });
      requestAnimationFrame(sync);
    };
    const rafId = requestAnimationFrame(sync);

    return () => {
      cancelAnimationFrame(rafId);
      Runner.stop(runner);
      Engine.clear(engine);
    };
  }, []);

  // Drop pills on hover
  const handleDrop = () => {
    if (hasDropped || !engineRef.current) return;
    setHasDropped(true);

    // Enable gravity
    engineRef.current.gravity.y = 1;

    // Make all bodies dynamic with staggered timing
    bodiesRef.current.forEach((body, i) => {
      setTimeout(() => {
        Matter.Body.setStatic(body, false);
        // Give a small random impulse for variety
        Matter.Body.applyForce(body, body.position, {
          x: (Math.random() - 0.5) * 0.01,
          y: 0,
        });
      }, i * 40);
    });
  };

  const allSkills = [
    ...coreSkills.map((s) => ({ label: s, type: "core" as const })),
    ...augmentedSkills.map((s) => ({ label: s, type: "augmented" as const })),
  ];

  return (
    <section ref={sectionRef} id="skills" className="relative">
      {/* Inversion curve */}
      <div
        ref={curveRef}
        className="w-full overflow-hidden"
        style={{
          background: "hsl(var(--section-light))",
          borderRadius: "50% 50% 0 0 / 100px 100px 0 0",
        }}
      >
        <div className="px-8 md:px-16 pt-32 pb-8">
          <h2
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(0 0% 4%)" }}
          >
            Skills & Stack
          </h2>
          <p className="text-lg mb-16" style={{ color: "hsl(0 0% 40%)", fontFamily: "'Inter', sans-serif" }}>
            Hover to unleash. Drag, throw, and play.
          </p>
        </div>

        {/* Physics container */}
        <div
          ref={physicsRef}
          className="relative mx-8 md:mx-16 mb-16 select-none"
          style={{ height: "500px", cursor: "grab" }}
          onMouseEnter={handleDrop}
          onTouchStart={handleDrop}
        >
          {allSkills.map((skill, i) => (
            <div
              key={i}
              ref={(el) => { if (el) pillRefs.current.set(i, el); }}
              className="absolute top-0 left-0 px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap pointer-events-none"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                background: skill.type === "augmented" ? "hsl(0 0% 8%)" : "hsl(0 0% 95%)",
                color: skill.type === "augmented" ? "hsl(0 0% 92%)" : "hsl(0 0% 8%)",
                border: skill.type === "core" ? "1px solid hsl(0 0% 20%)" : "none",
              }}
            >
              {skill.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
