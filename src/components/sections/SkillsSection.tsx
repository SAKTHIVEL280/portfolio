import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Matter from "matter-js";

gsap.registerPlugin(ScrollTrigger);

const skills = [
  { label: "Python", type: "core" },
  { label: "C", type: "core" },
  { label: "Java", type: "core" },
  { label: "Applied AI", type: "core" },
  { label: "AI Automations", type: "core" },
  { label: "SQL", type: "core" },
  { label: "Firebase", type: "core" },
  { label: "Supabase", type: "core" },
  { label: "Vercel", type: "core" },
  { label: "Context Engineering", type: "core" },
  { label: "AI Designing", type: "core" },
  { label: "JavaScript", type: "augmented" },
  { label: "React", type: "augmented" },
  { label: "Next.js", type: "augmented" },
  { label: "Tauri", type: "augmented" },
];

const SkillsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const engineRef = useRef<Matter.Engine | null>(null);
  const gravityTriggered = useRef(false);

  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    const { Engine, World, Bodies, Body, Mouse, MouseConstraint, Runner, Events } = Matter;

    const width = container.offsetWidth;
    const height = container.offsetHeight || 520;

    const engine = Engine.create({ gravity: { x: 0, y: 0 } });
    engineRef.current = engine;

    // Walls — floor, left, right, ceiling
    const t = 50;
    World.add(engine.world, [
      Bodies.rectangle(width / 2, height + t / 2, width + 100, t, { isStatic: true }),
      Bodies.rectangle(-t / 2, height / 2, t, height * 3, { isStatic: true }),
      Bodies.rectangle(width + t / 2, height / 2, t, height * 3, { isStatic: true }),
      Bodies.rectangle(width / 2, -t / 2 - 200, width + 100, t, { isStatic: true }),
    ]);

    // Create bodies for each skill pill
    const spacing = 58;
    const cols = Math.min(5, Math.floor((width - 80) / 180));
    const startX = width / 2 - ((cols - 1) * 180) / 2;

    const bodies = skills.map((skill, i) => {
      const pillW = skill.label.length * 9.5 + 44;
      const pillH = 42;
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * 180;
      const y = 80 + row * spacing;

      const body = Bodies.rectangle(x, y, pillW, pillH, {
        chamfer: { radius: 21 },
        restitution: 0.45,
        friction: 0.3,
        frictionAir: 0.035,
        density: 0.002,
        isStatic: true,
        label: skill.label,
      });
      (body as any).skillIndex = i;
      (body as any).skillType = skill.type;
      return body;
    });

    World.add(engine.world, bodies);

    // Mouse drag
    const mouse = Mouse.create(container);
    const mc = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.6, damping: 0.1, render: { visible: false } },
    });
    World.add(engine.world, mc);

    // Throw velocity on drag end
    Events.on(mc, "enddrag", (e: any) => {
      const body = e.body;
      if (body) {
        const vx = body.velocity.x;
        const vy = body.velocity.y;
        Body.setVelocity(body, { x: vx * 2.5, y: vy * 2.5 });
      }
    });

    const runner = Runner.create();
    Runner.run(runner, engine);

    // Sync DOM positions
    let raf: number;
    const sync = () => {
      bodies.forEach((body) => {
        const i = (body as any).skillIndex;
        const el = pillRefs.current.get(i);
        if (el) {
          const w = el.offsetWidth;
          const h = el.offsetHeight;
          el.style.transform = `translate(${body.position.x - w / 2}px, ${body.position.y - h / 2}px) rotate(${body.angle}rad)`;
        }
      });
      raf = requestAnimationFrame(sync);
    };
    raf = requestAnimationFrame(sync);

    // ScrollTrigger — drop all pills with staggered timing
    ScrollTrigger.create({
      trigger: container,
      start: "top 75%",
      once: true,
      onEnter: () => {
        if (gravityTriggered.current) return;
        gravityTriggered.current = true;
        engine.gravity.y = 1.2;

        bodies.forEach((body, i) => {
          setTimeout(() => {
            Body.setStatic(body, false);
            Body.applyForce(body, body.position, {
              x: (Math.random() - 0.5) * 0.025,
              y: -0.008 + Math.random() * 0.004,
            });
          }, i * 60 + Math.random() * 40);
        });
      },
    });

    return () => {
      cancelAnimationFrame(raf);
      Runner.stop(runner);
      Engine.clear(engine);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} id="skills" className="relative">
      <div
        className="w-full overflow-hidden"
        style={{ background: "hsl(var(--section-light))" }}
      >
        <div className="px-8 md:px-16 pt-32 pb-4">
          <h2
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-3"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(0 0% 4%)" }}
          >
            Skills & Stack
          </h2>
          <p
            className="text-base mb-12 tracking-wide"
            style={{ color: "hsl(0 0% 45%)", fontFamily: "'Inter', sans-serif" }}
          >
            Grab, drag, and throw them around.
          </p>
        </div>

        <div
          ref={canvasRef}
          className="relative mx-6 md:mx-16 mb-16 select-none overflow-hidden rounded-2xl"
          style={{
            height: "520px",
            cursor: "grab",
            background: "hsl(0 0% 96%)",
            border: "1px solid hsl(0 0% 88%)",
          }}
        >
          {skills.map((skill, i) => (
            <div
              key={skill.label}
              ref={(el) => { if (el) pillRefs.current.set(i, el); }}
              className="absolute top-0 left-0 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap select-none"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                background: skill.type === "augmented" ? "hsl(0 0% 8%)" : "hsl(0 0% 100%)",
                color: skill.type === "augmented" ? "hsl(0 0% 95%)" : "hsl(0 0% 10%)",
                border: skill.type === "core" ? "1.5px solid hsl(0 0% 78%)" : "none",
                boxShadow: "0 2px 8px hsl(0 0% 0% / 0.06)",
                pointerEvents: "none",
                willChange: "transform",
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
