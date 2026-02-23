import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Matter from "matter-js";
import FallingText from "../FallingText";

gsap.registerPlugin(ScrollTrigger);

const allSkills = [
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
] as const;

const SkillsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const curveRef = useRef<HTMLDivElement>(null);
  const playgroundRef = useRef<HTMLDivElement>(null);

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

  // Single Matter.js engine for the pill playground
  useEffect(() => {
    const container = playgroundRef.current;
    if (!container) return;

    const { Engine, World, Bodies, Body, Mouse, MouseConstraint, Runner, Bounds } = Matter;

    const width = container.offsetWidth;
    const height = 500;

    const engine = Engine.create({ gravity: { x: 0, y: 0 } });

    // Walls: floor, left, right (no ceiling so pills feel open at top)
    const wallOpts = { isStatic: true, render: { visible: false } };
    World.add(engine.world, [
      Bodies.rectangle(width / 2, height + 25, width, 50, wallOpts),
      Bodies.rectangle(-25, height / 2, 50, height * 2, wallOpts),
      Bodies.rectangle(width + 25, height / 2, 50, height * 2, wallOpts),
    ]);

    // Create pill bodies (initially static, floating in grid)
    const pillEls: HTMLDivElement[] = [];
    const pillBodies: Matter.Body[] = [];
    const dropped = new Set<number>();

    allSkills.forEach((skill, i) => {
      // Create DOM element
      const el = document.createElement("div");
      el.textContent = skill.label;
      el.className = "absolute px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap select-none";
      el.style.fontFamily = "'Space Grotesk', sans-serif";
      el.style.background = skill.type === "augmented" ? "hsl(0 0% 8%)" : "hsl(0 0% 95%)";
      el.style.color = skill.type === "augmented" ? "hsl(0 0% 92%)" : "hsl(0 0% 8%)";
      el.style.border = skill.type === "core" ? "1px solid hsl(0 0% 70%)" : "none";
      el.style.cursor = "grab";
      el.style.pointerEvents = "none"; // We'll handle interaction through container
      el.style.willChange = "transform";
      container.appendChild(el);

      // Measure pill dimensions
      const rect = el.getBoundingClientRect();
      const pillW = rect.width;
      const pillH = rect.height;

      // Grid placement
      const cols = Math.min(5, Math.floor(width / 200));
      const colWidth = (width - 80) / cols;
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = 60 + col * colWidth + (Math.random() * 30);
      const y = 50 + row * 60;

      const body = Bodies.rectangle(x, y, pillW, pillH, {
        chamfer: { radius: 20 },
        restitution: 0.6,
        friction: 0.1,
        frictionAir: 0.03,
        isStatic: true,
      });

      pillEls.push(el);
      pillBodies.push(body);
    });

    World.add(engine.world, pillBodies);

    // Mouse constraint for dragging (attached to container)
    const mouse = Mouse.create(container);
    const mc = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });
    World.add(engine.world, mc);

    // Hover detection via container mousemove - drop pills when cursor touches them
    let gravityEnabled = false;
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      pillBodies.forEach((body, i) => {
        if (!body.isStatic || dropped.has(i)) return;
        if (Bounds.contains(body.bounds, { x: mx, y: my })) {
          dropped.add(i);
          if (!gravityEnabled) {
            engine.gravity.y = 1.2;
            gravityEnabled = true;
          }
          Body.setStatic(body, false);
          Body.applyForce(body, body.position, {
            x: (Math.random() - 0.5) * 0.03,
            y: 0.01,
          });
        }
      });
    };
    container.addEventListener("mousemove", onMouseMove);

    // Run engine
    const runner = Runner.create();
    Runner.run(runner, engine);

    // RAF sync DOM positions
    let rafId: number;
    const sync = () => {
      pillBodies.forEach((body, i) => {
        const el = pillEls[i];
        if (!el) return;
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        el.style.transform = `translate(${body.position.x - w / 2}px, ${body.position.y - h / 2}px) rotate(${body.angle}rad)`;
      });
      rafId = requestAnimationFrame(sync);
    };
    rafId = requestAnimationFrame(sync);

    return () => {
      cancelAnimationFrame(rafId);
      container.removeEventListener("mousemove", onMouseMove);
      Runner.stop(runner);
      World.clear(engine.world, false);
      Engine.clear(engine);
      // Clean up dynamically created pill elements
      pillEls.forEach((el) => el.remove());
    };
  }, []);

  return (
    <section ref={sectionRef} id="skills" className="relative">
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
            Hover each pill to drop it. Drag, throw, and play.
          </p>
        </div>

        {/* Physics pill playground */}
        <div
          ref={playgroundRef}
          className="relative mx-8 md:mx-16 mb-16"
          style={{ height: "500px", cursor: "grab", overflow: "hidden" }}
        />

        {/* Falling Text */}
        <div className="mx-8 md:mx-16 mb-16" style={{ height: "400px" }}>
          <FallingText
            text="I don't just write code I craft experiences that blur the line between design and engineering building systems that feel alive and purposeful"
            highlightWords={["craft", "experiences", "design", "engineering", "alive", "purposeful"]}
            highlightClass="font-bold"
            trigger="scroll"
            backgroundColor="transparent"
            wireframes={false}
            gravity={0.56}
            fontSize="2rem"
            mouseConstraintStiffness={0.9}
          />
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
