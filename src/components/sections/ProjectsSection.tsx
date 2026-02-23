import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  { title: "Redactify", domains: ["AI Security", "Privacy"], color: "#1a1a1a" },
  { title: "VoiceSOP", domains: ["Applied AI", "Automation"], color: "#0d0d0d" },
  { title: "MyLuQ", domains: ["Systems Engineering", "Rust"], color: "#141414" },
  { title: "daeq.in", domains: ["Design", "User Experience"], color: "#111111" },
];

const ProjectsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      if (!track) return;

      const totalWidth = track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${totalWidth}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      {/* Custom cursor */}
      <div
        className={`view-cursor ${cursorVisible ? "active" : ""}`}
        style={{ transform: `translate(${cursorPos.x - 50}px, ${cursorPos.y - 50}px) scale(${cursorVisible ? 1 : 0})` }}
      >
        VIEW
      </div>

      <section
        ref={sectionRef}
        id="projects"
        className="overflow-hidden"
        style={{ background: "hsl(var(--section-dark))" }}
      >
        <div ref={trackRef} className="flex h-screen items-center gap-8 px-16 will-change-transform" style={{ width: "fit-content" }}>
          {/* Section label */}
          <div className="flex-shrink-0 w-[30vw] flex flex-col justify-center pr-8">
            <h2
              className="text-5xl md:text-7xl font-bold leading-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(var(--foreground))" }}
            >
              Selected<br />Works
            </h2>
            <div className="w-16 h-px bg-muted-foreground mt-8" />
          </div>

          {projects.map((project, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[60vw] md:w-[40vw] flex flex-col gap-4 cursor-none"
              onMouseEnter={() => setCursorVisible(true)}
              onMouseLeave={() => setCursorVisible(false)}
            >
              {/* Placeholder image */}
              <div
                className="w-full aspect-[4/3] flex items-center justify-center relative overflow-hidden"
                style={{ background: project.color }}
              >
                {/* Abstract geometric placeholder */}
                <svg viewBox="0 0 400 300" className="w-full h-full opacity-20" fill="none">
                  <rect x="50" y="50" width="120" height="120" stroke="hsl(var(--foreground))" strokeWidth="0.5" transform={`rotate(${i * 15} 110 110)`} />
                  <circle cx="280" cy="150" r="60" stroke="hsl(var(--foreground))" strokeWidth="0.5" />
                  <line x1="0" y1="200" x2="400" y2="100" stroke="hsl(var(--foreground))" strokeWidth="0.3" />
                </svg>
                <span
                  className="absolute text-8xl font-bold opacity-5 select-none"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(var(--foreground))" }}
                >
                  0{i + 1}
                </span>
              </div>
              <div>
                <h3
                  className="text-2xl md:text-3xl font-bold"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(var(--foreground))" }}
                >
                  {project.title}
                </h3>
                <div className="flex gap-3 mt-2">
                  {project.domains.map((d, j) => (
                    <span key={j} className="text-xs tracking-widest uppercase text-muted-foreground">
                      {d}{j < project.domains.length - 1 ? " ·" : ""}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default ProjectsSection;
