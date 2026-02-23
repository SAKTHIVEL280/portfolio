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

      // Heading cinematic entrance
      if (headingRef.current) {
        const chars = headingRef.current.querySelectorAll(".heading-char");
        gsap.set(chars, { y: 120, opacity: 0, rotateX: 90 });
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
          onEnter: () => {
            gsap.to(chars, {
              y: 0,
              opacity: 1,
              rotateX: 0,
              duration: 1.2,
              stagger: 0.04,
              ease: "power4.out",
            });
          },
        });
      }

      // Horizontal scroll
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

      // Card reveal with clip-path + y-axis + rotation for premium feel
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        gsap.set(card, {
          clipPath: "inset(20% 8% 20% 8%)",
          opacity: 0,
          scale: 0.85,
          y: 80,
          rotateY: 8,
        });
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
          onEnter: () => {
            gsap.to(card, {
              clipPath: "inset(0% 0% 0% 0%)",
              opacity: 1,
              scale: 1,
              y: 0,
              rotateY: 0,
              duration: 1.6,
              delay: i * 0.2,
              ease: "power4.out",
            });
          },
        });
      });

      // Parallax images inside cards on horizontal scroll
      imageRefs.current.forEach((img) => {
        if (!img) return;
        gsap.to(img, {
          xPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${totalWidth}`,
            scrub: 1,
          },
        });
      });

      // Title slide-up on horizontal scroll reveal
      titleRefs.current.forEach((titleEl, i) => {
        if (!titleEl) return;
        gsap.fromTo(
          titleEl,
          { y: 40, opacity: 0, clipPath: "inset(100% 0 0 0)" },
          {
            y: 0,
            opacity: 1,
            clipPath: "inset(0% 0 0 0)",
            duration: 1,
            delay: i * 0.2 + 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // Subtle scale on each card during horizontal scroll
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const startFraction = i / projects.length;
        const endFraction = (i + 1) / projects.length;

        gsap.fromTo(
          card,
          { scale: 0.95 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: () => `top+=${totalWidth * startFraction} top`,
              end: () => `top+=${totalWidth * endFraction} top`,
              scrub: 1,
            },
          }
        );
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

  const headingText = "Selected Works";

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
        <div ref={trackRef} className="flex h-screen items-center gap-8 px-16 will-change-transform" style={{ width: "fit-content", perspective: "1200px" }}>
          {/* Section label */}
          <div ref={headingRef} className="flex-shrink-0 w-[30vw] flex flex-col justify-center pr-8" style={{ perspective: "600px" }}>
            <h2
              className="text-5xl md:text-7xl font-bold leading-tight overflow-hidden"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(var(--foreground))" }}
            >
              {headingText.split("").map((char, i) => (
                <span
                  key={i}
                  className="heading-char inline-block"
                  style={{ transformOrigin: "bottom center" }}
                >
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
              style={{ transformStyle: "preserve-3d" }}
              onMouseEnter={() => setCursorVisible(true)}
              onMouseLeave={() => setCursorVisible(false)}
            >
              {/* Project image with parallax */}
              <div className="w-full aspect-[4/3] relative overflow-hidden rounded-sm">
                <div
                  ref={(el) => { if (el) imageRefs.current[i] = el; }}
                  className="w-[116%] h-full"
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
              <div
                ref={(el) => { if (el) titleRefs.current[i] = el; }}
              >
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
