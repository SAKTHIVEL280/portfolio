import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsMobile } from "@/hooks/use-mobile";
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

/* ── Mobile vertical layout ── */
const MobileProjects = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.fromTo(headingRef.current, { y: 50, opacity: 0 }, {
          y: 0, opacity: 1, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: headingRef.current, start: "top 85%", toggleActions: "play none none reverse" },
        });
      }
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(card, { y: 60, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.8, delay: i * 0.1, ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 88%", toggleActions: "play none none reverse" },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} id="projects" className="py-24 px-6 bg-surface-dark">
      <h2 ref={headingRef} className="text-4xl font-bold mb-12 font-heading text-foreground" style={{ opacity: 0 }}>
        Selected Works
      </h2>
      <div className="flex flex-col gap-10">
        {projects.map((project, i) => (
          <div key={i} ref={(el) => { if (el) cardRefs.current[i] = el; }} className="flex flex-col gap-4" style={{ opacity: 0 }}>
            <div className="w-full aspect-[4/3] overflow-hidden rounded-sm">
              <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-2xl font-bold font-heading text-foreground">{project.title}</h3>
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
  );
};

/* ── Desktop horizontal scroll ── */
const DesktopProjects = () => {
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
    const setWrapperHeight = () => { wrapper.style.height = `${getScrollAmount() + window.innerHeight}px`; };
    setWrapperHeight();
    window.addEventListener("resize", setWrapperHeight);

    if (headingRef.current) {
      const chars = headingRef.current.querySelectorAll(".heading-char");
      gsap.set(chars, { y: 120, opacity: 0, rotateX: 90 });
      ScrollTrigger.create({
        trigger: wrapper,
        start: "top 80%",
        onEnter: () => {
          gsap.to(chars, { y: 0, opacity: 1, rotateX: 0, duration: 1.2, stagger: 0.04, ease: "power4.out" });
          if (dividerRef.current) gsap.fromTo(dividerRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1, delay: 0.5, ease: "power3.out" });
        },
        onLeaveBack: () => {
          gsap.to(chars, { y: 120, opacity: 0, rotateX: 90, duration: 0.6, stagger: 0.02, ease: "power2.in" });
          if (dividerRef.current) gsap.to(dividerRef.current, { scaleX: 0, duration: 0.4, ease: "power2.in" });
        },
      });
    }

    cardRefs.current.forEach((card) => { if (card) gsap.set(card, { opacity: 0, y: 60, scale: 0.92 }); });
    titleRefs.current.forEach((el) => { if (el) gsap.set(el, { opacity: 0, y: 30 }); });

    const revealed = new Set<number>();
    const st = ScrollTrigger.create({
      trigger: wrapper,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.8,
      onUpdate: (self) => {
        const scrollAmount = getScrollAmount();
        const progress = self.progress;
        gsap.set(track, { x: -scrollAmount * progress });
        imageRefs.current.forEach((img) => { if (img) gsap.set(img, { xPercent: -8 * progress }); });
        cardRefs.current.forEach((card, i) => {
          if (!card) return;
          const rect = card.getBoundingClientRect();
          const inView = rect.left < window.innerWidth * 0.85 && rect.right > -100;
          if (inView && !revealed.has(i)) {
            revealed.add(i);
            gsap.to(card, { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "power3.out" });
            if (titleRefs.current[i]) gsap.to(titleRefs.current[i], { opacity: 1, y: 0, duration: 0.7, delay: 0.15, ease: "power3.out" });
          } else if (!inView && revealed.has(i)) {
            revealed.delete(i);
            gsap.to(card, { opacity: 0, y: 60, scale: 0.92, duration: 0.5, ease: "power2.in" });
            if (titleRefs.current[i]) gsap.to(titleRefs.current[i], { opacity: 0, y: 30, duration: 0.4, ease: "power2.in" });
          }
        });
      },
    });

    return () => { st.kill(); window.removeEventListener("resize", setWrapperHeight); };
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
        <div className="view-cursor" style={{ left: cursorPos.x - 50, top: cursorPos.y - 50, opacity: cursorVisible ? 1 : 0, transform: `scale(${cursorVisible ? 1 : 0})`, transition: "opacity 0.25s ease, transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)" }}>
          VIEW
        </div>,
        document.body
      )}
      <div ref={wrapperRef} id="projects" className="relative bg-surface-dark">
        <div className="sticky top-0 h-screen overflow-hidden">
          <div ref={trackRef} className="flex h-full items-center gap-8 px-16 will-change-transform" style={{ width: "fit-content" }}>
            <div ref={headingRef} className="flex-shrink-0 w-[30vw] flex flex-col justify-center pr-8" style={{ perspective: "600px" }}>
              <h2 className="text-5xl md:text-7xl font-bold leading-tight overflow-hidden font-heading text-foreground">
                {headingText.split("").map((char, i) => (
                  <span key={i} className="heading-char inline-block" style={{ transformOrigin: "bottom center" }}>
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </h2>
              <div ref={dividerRef} className="w-16 h-px bg-muted-foreground mt-8 origin-left" style={{ transform: "scaleX(0)" }} />
            </div>

            {projects.map((project, i) => (
              <div key={i} ref={(el) => { if (el) cardRefs.current[i] = el; }} className="flex-shrink-0 w-[40vw] flex flex-col gap-4 cursor-none" onMouseEnter={() => setCursorVisible(true)} onMouseLeave={() => setCursorVisible(false)}>
                <div className="w-full aspect-[4/3] relative overflow-hidden rounded-sm">
                  <div ref={(el) => { if (el) imageRefs.current[i] = el; }} className="w-[116%] h-full">
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                  </div>
                </div>
                <div ref={(el) => { if (el) titleRefs.current[i] = el; }}>
                  <h3 className="text-2xl md:text-3xl font-bold font-heading text-foreground">{project.title}</h3>
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

const ProjectsSection = () => {
  const isMobile = useIsMobile();
  return isMobile ? <MobileProjects /> : <DesktopProjects />;
};

export default ProjectsSection;
