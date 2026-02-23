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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    const wrapper = wrapperRef.current;
    if (!track || !wrapper) return;

    const getScrollAmount = () => track.scrollWidth - window.innerWidth;

    // Set wrapper height to create scroll space
    const setWrapperHeight = () => {
      wrapper.style.height = `${getScrollAmount() + window.innerHeight}px`;
    };
    setWrapperHeight();
    window.addEventListener("resize", setWrapperHeight);

    // Heading entrance
    if (headingRef.current) {
      const chars = headingRef.current.querySelectorAll(".heading-char");
      gsap.set(chars, { y: 120, opacity: 0, rotateX: 90 });
      ScrollTrigger.create({
        trigger: wrapper,
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

    // Horizontal scroll via ScrollTrigger
    const st = ScrollTrigger.create({
      trigger: wrapper,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.8,
      onUpdate: (self) => {
        const scrollAmount = getScrollAmount();
        gsap.set(track, { x: -scrollAmount * self.progress });
      },
    });

    return () => {
      st.kill();
      window.removeEventListener("resize", setWrapperHeight);
    };
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

      <div ref={wrapperRef} className="relative" style={{ background: "hsl(var(--section-dark))" }}>
        <div className="sticky top-0 h-screen overflow-hidden">
          <div ref={trackRef} className="flex h-full items-center gap-8 px-16 will-change-transform" style={{ width: "fit-content" }}>
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
                className="flex-shrink-0 w-[60vw] md:w-[40vw] flex flex-col gap-4 cursor-none"
                onMouseEnter={() => setCursorVisible(true)}
                onMouseLeave={() => setCursorVisible(false)}
              >
                <div className="w-full aspect-[4/3] relative overflow-hidden rounded-sm">
                  <div className="w-[116%] h-full">
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                  </div>
                </div>
                <div>
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
        </div>
      </div>
    </>
  );
};

export default ProjectsSection;
