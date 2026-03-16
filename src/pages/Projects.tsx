import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SmoothScroll from "@/components/SmoothScroll";
import ThemeToggle from "@/components/ThemeToggle";
import Magnetic from "@/components/Magnetic";

import redactifyImg from "@/assets/redactify.png";
import voicesopImg from "@/assets/voicesop.png";
import groundworkImg from "@/assets/groundwork.png";
import daeqImg from "@/assets/daeq.png";
import kiteImg from "@/assets/kite.png";
import studyvaultImg from "@/assets/studyvault.png";

gsap.registerPlugin(ScrollTrigger);

interface Project {
  title: string;
  domains: string[];
  image: string;
  description: string;
  year: string;
  link: string;
  highlights: string[];
}

const projects: Project[] = [
  {
    title: "Redactify",
    domains: ["AI Security", "Privacy"],
    image: redactifyImg,
    year: "2026",
    link: "https://redactify.daeq.in",
    description: "AI-powered document redaction that runs 100% in your browser. No uploads, no servers — your data never leaves your device.",
    highlights: ["BERT NER model for PII detection", "PDF, DOCX & TXT support", "Zero data transmission"],
  },
  {
    title: "VoiceSOP",
    domains: ["Applied AI", "Automation"],
    image: voicesopImg,
    year: "2026",
    link: "https://github.com/SAKTHIVEL280/VoiceSOP",
    description: "Transforms spoken instructions into structured Standard Operating Procedures. Record once, distribute everywhere.",
    highlights: ["Voice-to-SOP pipeline", "AI-structured formatting", "Next.js + Supabase"],
  },
  {
    title: "Groundwork",
    domains: ["Developer Tooling", "Architecture"],
    image: groundworkImg,
    year: "2026",
    link: "https://groundwork.daeq.in",
    description: "Free, open-source pre-code planning tool. Define problems, map personas, design data models, and export AI-ready briefs.",
    highlights: ["10 structured planning sections", "Visual canvas + AI suggestions", "Exportable briefs & PRDs"],
  },
  {
    title: "daeq.in",
    domains: ["Design", "User Experience"],
    image: daeqImg,
    year: "2025",
    link: "https://daeq.in",
    description: "The AI-native build partner for startups who need to move fast. Websites, automation, and AI delivered in days, not weeks.",
    highlights: ["3× faster than traditional agencies", "Full design-to-deployment", "AI-powered workflows"],
  },
  {
    title: "Kite Browser",
    domains: ["Systems", "Browser Architecture"],
    image: kiteImg,
    year: "2026",
    link: "https://github.com/SAKTHIVEL280/Kite",
    description: "Still. Sharp. Yours. A different kind of browser built for focus, privacy, and minimalist aesthetics. Redefining the internet's primary interface.",
    highlights: ["Liquid Glass UI Engine", "Adaptive Theme System", "Zero Telemetry Architecture"],
  },
  {
    title: "Study Vault",
    domains: ["EdTech", "Applied AI"],
    image: studyvaultImg,
    year: "2026",
    link: "https://github.com/SAKTHIVEL280/StudyVault",
    description: "AI-powered study management system. Transform passive notes into active learning environments with automated summaries and natural language querying.",
    highlights: ["'Ask Your Notes' AI Chat", "Automated Study Flashcards", "Visual Concept Canvas"],
  },
];

const Projects = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const upcomingHeadingRef = useRef<HTMLHeadingElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const [activeProject, setActiveProject] = useState<number | null>(null);

  // Professional scroll management — force to top on every mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
      // Fire native scroll reset immediately
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      // Also dispatch Lenis-aware scroll-to-top event
      requestAnimationFrame(() => {
        window.dispatchEvent(new Event("lenis-scroll-top"));
        ScrollTrigger.refresh();
      });
    }
  }, []);

  // Handle micro-animations for highlights when a project becomes active
  useEffect(() => {
    if (activeProject !== null) {
      const highlights = document.querySelectorAll(`.highlights-${activeProject} > div`);
      gsap.fromTo(
        highlights,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: "power2.out",
          delay: 0.1,
        }
      );
    }
  }, [activeProject]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading entrance
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.2 }
        );
      }

      // Cards stagger with mask reveal
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const imgWrapper = card.querySelector(".project-image-clip");

        gsap.fromTo(
          card,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: 0.4 + i * 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );

        if (imgWrapper) {
          gsap.fromTo(
            imgWrapper,
            { clipPath: "inset(100% 0 0 0)" },
            {
              clipPath: "inset(0% 0 0 0)",
              duration: 1.2,
              delay: 0.4 + i * 0.08 + 0.2,
              ease: "power4.out",
              scrollTrigger: {
                trigger: card,
                start: "top 88%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });
      // Animate upcoming section heading
      if (upcomingHeadingRef.current) {
        gsap.fromTo(
          upcomingHeadingRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: upcomingHeadingRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <SmoothScroll>
      <ThemeToggle />

      <div
        ref={pageRef}
        className="min-h-screen"
        style={{ background: "hsl(var(--section-dark))" }}
      >
        {/* Header */}
        <div className="px-8 md:px-16 pt-12 pb-4">
          <Magnetic strength={15} className="inline-block">
            <Link
              to="/#selected-works-bottom"
              className="inline-flex items-center gap-2 text-sm tracking-widest uppercase transition-opacity duration-300 hover:opacity-60"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: "hsl(var(--muted-foreground))",
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </Magnetic>
        </div>

        <div className="px-8 md:px-16 pb-24 md:pb-32">
          <h1
            ref={headingRef}
            className="text-6xl md:text-8xl lg:text-9xl font-bold leading-[0.9] tracking-tighter mb-20 md:mb-28"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: "hsl(var(--foreground))",
              opacity: 0,
            }}
          >
            All Works
          </h1>

          {/* Section 1: Main Projects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 mb-32">
            {projects.slice(0, 4).map((project, i) => (
              <div
                key={i}
                ref={(el) => {
                  if (el) cardRefs.current[i] = el;
                }}
                className="project-card group relative flex flex-col cursor-pointer"
                style={{ opacity: 0 }}
                onMouseEnter={() => setActiveProject(i)}
                onMouseLeave={() => setActiveProject(null)}
              >
                {/* Floating Image Container */}
                <div
                  className="project-image-mask relative overflow-hidden w-full group"
                  style={{
                    aspectRatio: "16 / 10",
                    borderRadius: "16px",
                    transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                    willChange: "transform",
                  }}
                >
                  {/* Inner clip-path target */}
                  <div
                    className="project-image-clip w-full h-full"
                    style={{ clipPath: "inset(100% 0 0 0)" }}
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      style={{
                        filter: activeProject === i ? "brightness(0.6) saturate(1.2)" : "brightness(1) saturate(1)",
                        transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    />
                  </div>

                  {/* Premium Glass Panel Description */}
                  <div
                    className="absolute bottom-6 left-6 right-6 p-6 md:p-8 pointer-events-none"
                    style={{
                      opacity: activeProject === i ? 1 : 0,
                      transform: activeProject === i ? "translateY(0px)" : "translateY(20px)",
                      transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                      background: "rgba(255, 255, 255, 0.03)",
                      backdropFilter: "blur(20px) saturate(180%)",
                      WebkitBackdropFilter: "blur(20px) saturate(180%)",
                      borderRadius: "12px",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.4)",
                    }}
                  >
                    <p
                      className="text-xs md:text-sm leading-relaxed mb-4 font-normal"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        color: "rgba(255, 255, 255, 0.8)",
                        letterSpacing: "0.01em",
                      }}
                    >
                      {project.description}
                    </p>

                    <div className={`flex flex-col gap-1.5 mb-6 highlights-${i}`}>
                      {project.highlights.map((h, k) => (
                        <div key={k} className="flex items-center gap-2.5 opacity-0">
                          <div
                            className="w-1 h-[1px]"
                            style={{ background: "rgba(255, 255, 255, 0.4)" }}
                          />
                          <span
                            className="text-[10px] tracking-widest uppercase font-medium"
                            style={{
                              fontFamily: "'Space Grotesk', sans-serif",
                              color: "rgba(255, 255, 255, 0.5)",
                            }}
                          >
                            {h}
                          </span>
                        </div>
                      ))}
                    </div>

                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pointer-events-auto inline-flex items-center gap-3 transition-colors duration-300 hover:text-white"
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        color: "rgba(255, 255, 255, 0.9)",
                        fontSize: "10px",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                      }}
                    >
                      Explore Project
                      <Magnetic strength={10}>
                        <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center transition-colors duration-300 group-hover:border-white/40">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </div>
                      </Magnetic>
                    </a>
                  </div>
                </div>

                {/* Title & Metadata - Detached and Refined */}
                <div className="flex items-end justify-between mt-8 mb-2">
                  <div className="flex flex-col gap-1">
                    <span 
                       className="text-[10px] tracking-[0.3em] uppercase opacity-40 mb-1"
                       style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {project.domains[0]}
                    </span>
                    <h3
                      className="text-3xl md:text-4xl font-light tracking-tight"
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        color: "hsl(var(--foreground))",
                        transition: "opacity 0.3s ease",
                        opacity: activeProject === i ? 0.6 : 1,
                      }}
                    >
                      {project.title}
                    </h3>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className="text-[10px] tracking-[0.2em] uppercase opacity-40"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Year
                    </span>
                    <span
                      className="text-sm font-medium opacity-60"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {project.year}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Section 2: Upcoming / Ongoing Projects */}
          <div className="mt-40 mb-20">
            <h2
              ref={upcomingHeadingRef}
              className="text-4xl md:text-5xl font-bold mb-16"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(var(--foreground))", opacity: 0 }}
            >
              Upcoming / Ongoing Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
              {projects.slice(4).map((project, i) => {
                const globalIndex = i + 4;
                return (
                  <div
                    key={globalIndex}
                    ref={(el) => {
                      if (el) cardRefs.current[globalIndex] = el;
                    }}
                    className="project-card group relative flex flex-col cursor-pointer"
                    style={{ opacity: 0 }}
                    onMouseEnter={() => setActiveProject(globalIndex)}
                    onMouseLeave={() => setActiveProject(null)}
                  >
                    {/* Floating Image Container */}
                    <div
                      className="project-image-mask relative overflow-hidden w-full group"
                      style={{
                        aspectRatio: "16 / 10",
                        borderRadius: "16px",
                        transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                        willChange: "transform",
                      }}
                    >
                      {/* Inner clip-path target */}
                      <div
                        className="project-image-clip w-full h-full"
                        style={{ clipPath: "inset(100% 0 0 0)" }}
                      >
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover"
                          style={{
                            filter: activeProject === globalIndex ? "brightness(0.6) saturate(1.2)" : "brightness(1) saturate(1)",
                            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                          }}
                        />
                      </div>

                      {/* Premium Glass Panel Description */}
                      <div
                        className="absolute bottom-6 left-6 right-6 p-6 md:p-8 pointer-events-none"
                        style={{
                          opacity: activeProject === globalIndex ? 1 : 0,
                          transform: activeProject === globalIndex ? "translateY(0px)" : "translateY(20px)",
                          transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                          background: "rgba(255, 255, 255, 0.03)",
                          backdropFilter: "blur(20px) saturate(180%)",
                          WebkitBackdropFilter: "blur(20px) saturate(180%)",
                          borderRadius: "12px",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.4)",
                        }}
                      >
                        <p
                          className="text-xs md:text-sm leading-relaxed mb-4 font-normal"
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            color: "rgba(255, 255, 255, 0.8)",
                            letterSpacing: "0.01em",
                          }}
                        >
                          {project.description}
                        </p>

                        <div className={`flex flex-col gap-1.5 mb-6 highlights-${globalIndex}`}>
                          {project.highlights.map((h, k) => (
                            <div key={k} className="flex items-center gap-2.5 opacity-0">
                              <div
                                className="w-1 h-[1px]"
                                style={{ background: "rgba(255, 255, 255, 0.4)" }}
                              />
                              <span
                                className="text-[10px] tracking-widest uppercase font-medium"
                                style={{
                                  fontFamily: "'Space Grotesk', sans-serif",
                                  color: "rgba(255, 255, 255, 0.5)",
                                }}
                              >
                                {h}
                              </span>
                            </div>
                          ))}
                        </div>

                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="pointer-events-auto inline-flex items-center gap-3 transition-colors duration-300 hover:text-white"
                          style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            color: "rgba(255, 255, 255, 0.9)",
                            fontSize: "10px",
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                          }}
                        >
                          Explore Project
                          <Magnetic strength={10}>
                            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center transition-colors duration-300 group-hover:border-white/40">
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </div>
                          </Magnetic>
                        </a>
                      </div>
                    </div>

                    {/* Title & Metadata - Detached and Refined */}
                    <div className="flex items-end justify-between mt-8 mb-2">
                      <div className="flex flex-col gap-1">
                        <span 
                           className="text-[10px] tracking-[0.3em] uppercase opacity-40 mb-1"
                           style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                          {project.domains[0]}
                        </span>
                        <h3
                          className="text-3xl md:text-4xl font-light tracking-tight"
                          style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            color: "hsl(var(--foreground))",
                            transition: "opacity 0.3s ease",
                            opacity: activeProject === globalIndex ? 0.6 : 1,
                          }}
                        >
                          {project.title}
                        </h3>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span
                          className="text-[10px] tracking-[0.2em] uppercase opacity-40"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          Status
                        </span>
                        <span
                          className="text-sm font-medium opacity-60"
                          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                          {project.year}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </SmoothScroll>
  );
};

export default Projects;
