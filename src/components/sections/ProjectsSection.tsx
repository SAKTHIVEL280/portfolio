import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
  const dividerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const imageRefs = useRef<HTMLDivElement[]>([]);
  const titleRefs = useRef<HTMLDivElement[]>([]);
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

    // Heading char-by-char entrance
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
          // Divider draws in
          if (dividerRef.current) {
            gsap.fromTo(dividerRef.current,
              { scaleX: 0 },
              { scaleX: 1, duration: 1, delay: 0.5, ease: "power3.out" }
            );
          }
        },
        onLeaveBack: () => {
          gsap.to(chars, {
            y: 120, opacity: 0, rotateX: 90,
            duration: 0.6, stagger: 0.02, ease: "power2.in",
          });
          if (dividerRef.current) {
            gsap.to(dividerRef.current, { scaleX: 0, duration: 0.4, ease: "power2.in" });
          }
        },
      });
    }

    // Set initial card states — hidden
    cardRefs.current.forEach((card) => {
      if (!card) return;
      gsap.set(card, { opacity: 0, y: 60, scale: 0.92 });
    });
    titleRefs.current.forEach((el) => {
      if (!el) return;
      gsap.set(el, { opacity: 0, y: 30 });
    });

    // Track which cards are currently revealed
    const revealed = new Set<number>();

    // Horizontal scroll + card reveal driven by scroll progress
    const st = ScrollTrigger.create({
      trigger: wrapper,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.8,
      onUpdate: (self) => {
        const scrollAmount = getScrollAmount();
        const progress = self.progress;

        // Move track horizontally
        gsap.set(track, { x: -scrollAmount * progress });

        // Image parallax — shift images within their containers
        imageRefs.current.forEach((img) => {
          if (!img) return;
          gsap.set(img, { xPercent: -8 * progress });
        });

        // Reveal/hide cards based on viewport position (repeatable)
        cardRefs.current.forEach((card, i) => {
          if (!card) return;

          const rect = card.getBoundingClientRect();
          const inView = rect.left < window.innerWidth * 0.85 && rect.right > -100;

          if (inView && !revealed.has(i)) {
            revealed.add(i);
            gsap.to(card, {
              opacity: 1, y: 0, scale: 1,
              duration: 0.9, ease: "power3.out",
            });
            if (titleRefs.current[i]) {
              gsap.to(titleRefs.current[i], {
                opacity: 1, y: 0,
                duration: 0.7, delay: 0.15, ease: "power3.out",
              });
            }
          } else if (!inView && revealed.has(i)) {
            revealed.delete(i);
            gsap.to(card, {
              opacity: 0, y: 60, scale: 0.92,
              duration: 0.5, ease: "power2.in",
            });
            if (titleRefs.current[i]) {
              gsap.to(titleRefs.current[i], {
                opacity: 0, y: 30,
                duration: 0.4, ease: "power2.in",
              });
            }
          }
        });
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
      {createPortal(
        <div
          className="view-cursor"
          style={{
            left: cursorPos.x - 50,
            top: cursorPos.y - 50,
            opacity: cursorVisible ? 1 : 0,
            transform: `scale(${cursorVisible ? 1 : 0})`,
            transition: "opacity 0.25s ease, transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)",
          }}
        >
          VIEW
        </div>,
        document.body
      )}

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
              <div ref={dividerRef} className="w-16 h-px bg-muted-foreground mt-8 origin-left" style={{ transform: "scaleX(0)" }} />
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
                  <div
                    ref={(el) => { if (el) imageRefs.current[i] = el; }}
                    className="w-[116%] h-full"
                  >
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
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
        </div>
      </div>
    </>
  );
};

export default ProjectsSection;
