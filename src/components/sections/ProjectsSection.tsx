import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsMobile } from "@/hooks/use-mobile";
import Magnetic from "@/components/Magnetic";
import redactifyImg from "@/assets/redactify.png";
import voicesopImg from "@/assets/voicesop.png";
import groundworkImg from "@/assets/groundwork.png";
import daeqImg from "@/assets/daeq.png";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  { title: "Redactify", domains: ["AI Security", "Privacy"], image: redactifyImg },
  { title: "VoiceSOP", domains: ["Applied AI", "Automation"], image: voicesopImg },
  { title: "Groundwork", domains: ["Developer Tooling", "Architecture"], image: groundworkImg },
  { title: "daeq.in", domains: ["Design", "User Experience"], image: daeqImg },
];

/* ── Mobile vertical layout ── */
const MobileProjects = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading
      if (headingRef.current) {
        gsap.fromTo(headingRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1, ease: "power3.out",
            scrollTrigger: { trigger: headingRef.current, start: "top 85%", toggleActions: "play none none reverse" },
          }
        );
      }

      // Cards stagger in with mask reveal
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const imgWrapper = card.querySelector(".project-img-wrapper");
        
        gsap.fromTo(card,
          { y: 60, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, delay: i * 0.1, ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 88%", toggleActions: "play none none reverse" },
          }
        );

        if (imgWrapper) {
          gsap.fromTo(imgWrapper,
            { clipPath: "inset(100% 0 0 0)" },
            {
              clipPath: "inset(0% 0 0 0)", duration: 1.2, delay: i * 0.1 + 0.2, ease: "power4.out",
              scrollTrigger: { trigger: card, start: "top 88%", toggleActions: "play none none reverse" },
            }
          );
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} id="projects" className="py-24 px-6" style={{ background: "hsl(var(--section-dark))" }}>
      <h2
        ref={headingRef}
        className="text-4xl font-bold mb-12"
        style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(var(--foreground))", opacity: 0 }}
      >
        Selected Works
      </h2>
      <div className="flex flex-col gap-10">
        {projects.map((project, i) => (
          <div
            key={i}
            ref={(el) => { if (el) cardRefs.current[i] = el; }}
            data-cursor="view"
            className="flex flex-col gap-4"
            style={{ opacity: 0 }}
          >
            <div className="w-full aspect-[4/3] overflow-hidden rounded-sm project-img-wrapper" style={{ clipPath: "inset(100% 0 0 0)" }}>
              <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(var(--foreground))" }}>
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

      {/* View All Projects */}
      <div className="flex justify-center mt-16">
        <Magnetic strength={20} className="inline-block">
          <Link
            to="/projects"
            data-cursor="click"
            className="group inline-flex items-center gap-3 text-lg md:text-xl font-medium transition-opacity duration-300 hover:opacity-70"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(var(--foreground))", borderBottom: "2px solid hsl(var(--foreground))" }}
          >
            View All Projects
            <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45" />
          </Link>
        </Magnetic>
      </div>
      <div id="selected-works-bottom" />
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

  useEffect(() => {
    const track = trackRef.current;
    const wrapper = wrapperRef.current;
    if (!track || !wrapper) return;

    const getScrollAmount = () => track.scrollWidth - window.innerWidth;

    const setWrapperHeight = () => {
      wrapper.style.height = `${getScrollAmount() + window.innerHeight}px`;
    };
    setWrapperHeight();
    window.addEventListener("resize", setWrapperHeight);

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
          if (dividerRef.current) {
            gsap.fromTo(dividerRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1, delay: 0.5, ease: "power3.out" });
          }
        },
        onLeaveBack: () => {
          gsap.to(chars, { y: 120, opacity: 0, rotateX: 90, duration: 0.6, stagger: 0.02, ease: "power2.in" });
          if (dividerRef.current) {
            gsap.to(dividerRef.current, { scaleX: 0, duration: 0.4, ease: "power2.in" });
          }
        },
      });
    }

    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      gsap.set(card, { opacity: 0, y: 60, scale: 0.92 });
      const imgWrapper = card.querySelector(".project-img-wrapper");
      if (imgWrapper) {
        gsap.set(imgWrapper, { clipPath: "inset(100% 0 0 0)" });
      }
    });
    titleRefs.current.forEach((el) => {
      if (!el) return;
      gsap.set(el, { opacity: 0, y: 30 });
    });

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

        imageRefs.current.forEach((img) => {
          if (!img) return;
          gsap.set(img, { xPercent: -8 * progress });
        });

        cardRefs.current.forEach((card, i) => {
          if (!card) return;
          const rect = card.getBoundingClientRect();
          const inView = rect.left < window.innerWidth * 0.85 && rect.right > -100;

          if (inView && !revealed.has(i)) {
            revealed.add(i);
            gsap.to(card, { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "power3.out" });
            
            const imgWrapper = card.querySelector(".project-img-wrapper");
            if (imgWrapper) {
              gsap.to(imgWrapper, { clipPath: "inset(0% 0 0 0)", duration: 1.2, delay: 0.2, ease: "power4.out" });
            }

            if (titleRefs.current[i]) {
              gsap.to(titleRefs.current[i], { opacity: 1, y: 0, duration: 0.7, delay: 0.15, ease: "power3.out" });
            }
          } else if (!inView && revealed.has(i)) {
            revealed.delete(i);
            gsap.to(card, { opacity: 0, y: 60, scale: 0.92, duration: 0.5, ease: "power2.in" });
            
            const imgWrapper = card.querySelector(".project-img-wrapper");
            if (imgWrapper) {
              gsap.to(imgWrapper, { clipPath: "inset(100% 0 0 0)", duration: 0.5, ease: "power2.in" });
            }

            if (titleRefs.current[i]) {
              gsap.to(titleRefs.current[i], { opacity: 0, y: 30, duration: 0.4, ease: "power2.in" });
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


  const headingText = "Selected Works";

  return (
    <div ref={wrapperRef} id="projects" className="relative" style={{ background: "hsl(var(--section-dark))" }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <div ref={trackRef} className="flex h-full items-center gap-8 px-16 will-change-transform" style={{ width: "fit-content" }}>
          <div ref={headingRef} className="flex-shrink-0 w-[30vw] flex flex-col justify-center pr-8" style={{ perspective: "600px" }}>
            <h2
              className="text-5xl md:text-7xl font-bold leading-tight overflow-hidden"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(var(--foreground))" }}
            >
            {headingText.split(" ").map((word, wi) => (
                <span key={wi} className="inline-block whitespace-nowrap">
                  {word.split("").map((char, ci) => (
                    <span key={ci} className="heading-char inline-block" style={{ transformOrigin: "bottom center" }}>
                      {char}
                    </span>
                  ))}
                  {wi < headingText.split(" ").length - 1 && <span className="inline-block">&nbsp;</span>}
                </span>
              ))}
            </h2>
            <div ref={dividerRef} className="w-16 h-px bg-muted-foreground mt-8 origin-left" style={{ transform: "scaleX(0)" }} />
          </div>

          {projects.map((project, i) => (
            <div
              key={i}
              ref={(el) => { if (el) cardRefs.current[i] = el; }}
              data-cursor="view"
              className="flex-shrink-0 w-[40vw] flex flex-col gap-4"
            >
              <div className="w-full aspect-[4/3] relative overflow-hidden rounded-sm project-img-wrapper" style={{ clipPath: "inset(100% 0 0 0)" }}>
                <div ref={(el) => { if (el) imageRefs.current[i] = el; }} className="w-[116%] h-full">
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

          {/* View All Projects — last item in track */}
          <div className="flex-shrink-0 w-[30vw] flex flex-col items-center justify-center">
            <Magnetic strength={20} className="inline-block">
              <Link
                to="/projects"
                data-cursor="click"
                className="group inline-flex items-center gap-3 text-xl md:text-2xl font-medium transition-opacity duration-300 hover:opacity-70"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(var(--foreground))", borderBottom: "2px solid hsl(var(--foreground))" }}
              >
                View All Projects
                <ArrowUpRight className="w-6 h-6 transition-transform duration-300 group-hover:rotate-45" />
              </Link>
            </Magnetic>
          </div>
        </div>
      </div>
      <div id="selected-works-bottom" />
    </div>
  );
};

const ProjectsSection = () => {
  const isMobile = useIsMobile();
  return isMobile ? <MobileProjects /> : <DesktopProjects />;
};

export default ProjectsSection;
