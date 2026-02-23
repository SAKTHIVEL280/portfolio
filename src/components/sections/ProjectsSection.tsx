import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import redactifyImg from "@/assets/redactify.png";
import voicesopImg from "@/assets/voicesop.png";
import myluqImg from "@/assets/myluq.png";
import daeqImg from "@/assets/daeq.png";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  { title: "Redactify", domains: ["AI Security", "Privacy"], image: redactifyImg },
  { title: "VoiceSOP", domains: ["Applied AI", "Automation"], image: voicesopImg },
  { title: "MyLuQ", domains: ["Systems Engineering", "Rust"], image: myluqImg },
  { title: "daeq.in", domains: ["Design", "User Experience"], image: daeqImg },
];

const ProjectsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const imageRefs = useRef<HTMLDivElement[]>([]);
  const titleRefs = useRef<HTMLDivElement[]>([]);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      if (!track) return;

      const totalWidth = track.scrollWidth - window.innerWidth;

      // Heading entrance
      if (headingRef.current) {
        const chars = headingRef.current.querySelectorAll(".heading-char");
        gsap.set(chars, { y: 120, opacity: 0, rotateX: 90 });
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 80%",
          onEnter: () => {
            gsap.to(chars, {
              y: 0, opacity: 1, rotateX: 0,
              duration: 1.2, stagger: 0.04, ease: "power4.out",
            });
          },
          onLeaveBack: () => {
            gsap.to(chars, {
              y: 120, opacity: 0, rotateX: 90,
              duration: 0.6, stagger: 0.02, ease: "power2.in",
            });
          },
        });
      }

      // Horizontal scroll pinning
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${totalWidth}`,
        pin: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
        animation: gsap.to(track, { x: -totalWidth, ease: "none" }),
      });

      // Cards and titles are always visible — horizontal scroll reveals them naturally
      cardRefs.current.forEach((card) => {
        if (!card) return;
        gsap.set(card, { opacity: 1, y: 0, scale: 1 });
      });

      titleRefs.current.forEach((titleEl) => {
        if (!titleEl) return;
        gsap.set(titleEl, { y: 0, opacity: 1 });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const headingText = "Selected Works";

  return (
    <>
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
          <div ref={headingRef} className="flex-shrink-0 w-[30vw] flex flex-col justify-center pr-8" style={{ perspective: "600px" }}>
            <h2
              className="text-5xl md:text-7xl font-bold leading-tight overflow-hidden"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(var(--foreground))" }}
            >
              {headingText.split("").map((char, i) => (
                <span key={i} className="heading-char inline-block" style={{ transformOrigin: "bottom center" }}>
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </h2>
            <div className="w-16 h-px bg-muted-foreground mt-8 origin-left" />
          </div>

          {projects.map((project, i) => (
            <div
              key={i}
              ref={(el) => { if (el) cardRefs.current[i] = el; }}
              className="flex-shrink-0 w-[60vw] md:w-[40vw] flex flex-col gap-4 cursor-none"
              onMouseEnter={() => setCursorVisible(true)}
              onMouseLeave={() => setCursorVisible(false)}
            >
              <div className="w-full aspect-[4/3] relative overflow-hidden rounded-sm">
                <div ref={(el) => { if (el) imageRefs.current[i] = el; }} className="w-[116%] h-full">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
              </div>
              <div ref={(el) => { if (el) titleRefs.current[i] = el; }}>
                <h3 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(var(--foreground))" }}>
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
