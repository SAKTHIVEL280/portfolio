import { useRef, useEffect } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import TextPressure from "../TextPressure";

gsap.registerPlugin(CustomEase);
CustomEase.create("smoothOut", "M0,0 C0.25,1 0.5,1 1,1");
CustomEase.create("dramatic", "M0,0 C0.16,1 0.3,1 1,1");

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);
  const cornerTLRef = useRef<HTMLDivElement>(null);
  const cornerBRRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const swapRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const master = gsap.timeline({ defaults: { ease: "dramatic" } });

      // Initial full white overlay wipes away
      master.to(overlayRef.current, {
        scaleY: 0,
        duration: 1,
        ease: "power4.inOut",
        transformOrigin: "top center",
      }, 0);

      // Grid lines fade in
      if (gridRef.current) {
        const lines = gridRef.current.querySelectorAll(".grid-line");
        master.fromTo(lines, { opacity: 0 }, { opacity: 1, duration: 1.5, stagger: 0.05, ease: "power2.out" }, 0.4);
      }

      // Left accent bar slides down
      master.fromTo(accentRef.current, { scaleY: 0 }, { scaleY: 1, duration: 0.8, transformOrigin: "top" }, 0.6);

      // Corner brackets
      master.fromTo(cornerTLRef.current, { opacity: 0, x: -10, y: -10 }, { opacity: 0.3, x: 0, y: 0, duration: 0.6 }, 0.8);
      master.fromTo(cornerBRRef.current, { opacity: 0, x: 10, y: 10 }, { opacity: 0.3, x: 0, y: 0, duration: 0.6 }, 0.8);

      // Intro text clips in
      master.fromTo(introRef.current,
        { clipPath: "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0% 0 0)", duration: 0.8, ease: "power3.inOut" },
        0.7
      );

      // Name reveals from bottom with mask
      master.fromTo(nameRef.current,
        { clipPath: "inset(100% 0 0 0)", y: 40 },
        { clipPath: "inset(0% 0 0 0)", y: 0, duration: 1.2, ease: "power3.out" },
        0.9
      );

      // Role line
      master.fromTo(roleRef.current,
        { clipPath: "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0% 0 0)", duration: 0.8, ease: "power3.inOut" },
        1.4
      );

      // Swap text
      master.fromTo(swapRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6 }, 1.6);

      // Scroll indicator
      master.fromTo(scrollRef.current, { opacity: 0 }, { opacity: 0.5, duration: 0.8 }, 2.0);
      gsap.to(scrollRef.current, { y: 6, yoyo: true, repeat: -1, duration: 1.4, ease: "sine.inOut" });

      // Text swap loop
      const swapContainer = swapRef.current;
      if (swapContainer) {
        const lines = swapContainer.querySelectorAll(".swap-line");
        const swapTl = gsap.timeline({ repeat: -1, delay: 2.5 });
        swapTl.to(lines[0], { y: "-100%", opacity: 0, duration: 0.5, ease: "power3.in" }, "+=3");
        swapTl.fromTo(lines[1], { y: "50%", opacity: 0 }, { y: "-100%", opacity: 1, duration: 0.5, ease: "power3.out" }, "<0.1");
        swapTl.to(lines[1], { y: "-200%", opacity: 0, duration: 0.5, ease: "power3.in" }, "+=3");
        swapTl.fromTo(lines[0], { y: "50%" }, { y: "0%", opacity: 1, duration: 0.5, ease: "power3.out" }, "<0.1");
        swapTl.set(lines[1], { y: "0%" });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="h-screen w-full relative flex items-center overflow-hidden"
      style={{ background: "hsl(0 0% 3%)", color: "hsl(0 0% 93%)" }}
    >
      {/* Wipe overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-50"
        style={{ background: "hsl(0 0% 93%)" }}
      />

      {/* Subtle grid */}
      <div ref={gridRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={`v${i}`}
            className="grid-line absolute top-0 bottom-0 opacity-0"
            style={{
              left: `${(i + 1) * (100 / 7)}%`,
              width: "1px",
              background: "hsl(0 0% 15%)",
            }}
          />
        ))}
        {[...Array(4)].map((_, i) => (
          <div
            key={`h${i}`}
            className="grid-line absolute left-0 right-0 opacity-0"
            style={{
              top: `${(i + 1) * (100 / 5)}%`,
              height: "1px",
              background: "hsl(0 0% 12%)",
            }}
          />
        ))}
      </div>

      {/* Corner brackets */}
      <div ref={cornerTLRef} className="absolute top-8 left-8 opacity-0">
        <div className="w-8 h-8 border-l border-t" style={{ borderColor: "hsl(0 0% 30%)" }} />
      </div>
      <div ref={cornerBRRef} className="absolute bottom-8 right-8 opacity-0">
        <div className="w-8 h-8 border-r border-b" style={{ borderColor: "hsl(0 0% 30%)" }} />
      </div>

      {/* Left accent bar */}
      <div
        ref={accentRef}
        className="absolute left-8 md:left-16 top-[15%] bottom-[15%] w-[2px] origin-top"
        style={{ background: "hsl(0 0% 93%)", transform: "scaleY(0)" }}
      />

      {/* Main content */}
      <div className="relative z-10 w-full px-12 md:px-24 lg:px-32">
        {/* Intro */}
        <div ref={introRef} className="mb-4" style={{ clipPath: "inset(0 100% 0 0)" }}>
          <p
            className="text-xs md:text-sm tracking-[0.4em] uppercase"
            style={{ fontFamily: "'Inter', sans-serif", color: "hsl(0 0% 50%)" }}
          >
            hello.! I'm
          </p>
        </div>

        {/* Name - TextPressure */}
        <div ref={nameRef} style={{ clipPath: "inset(100% 0 0 0)", height: "clamp(80px, 16vw, 220px)" }}>
          <TextPressure
            text="SAKTHIVEL"
            flex
            alpha={false}
            stroke={false}
            width
            weight
            italic
            textColor="#ededed"
            strokeColor="#333333"
            minFontSize={36}
          />
        </div>

        {/* Role line with border */}
        <div className="mt-6 md:mt-8 flex items-start gap-6 md:gap-12">
          <div ref={roleRef} className="flex-1" style={{ clipPath: "inset(0 100% 0 0)" }}>
            <div className="h-px w-full mb-6" style={{ background: "hsl(0 0% 20%)" }} />
            <div className="flex items-start justify-between flex-wrap gap-y-4">
              {/* Swap text */}
              <div ref={swapRef} className="h-5 md:h-6 overflow-hidden relative opacity-0">
                <div className="swap-line absolute inset-0 flex items-center">
                  <span
                    className="text-xs md:text-sm tracking-[0.25em] uppercase"
                    style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(0 0% 50%)" }}
                  >
                    AI — Native Engineer
                  </span>
                </div>
                <div className="swap-line absolute inset-0 flex items-center translate-y-full opacity-0">
                  <span
                    className="text-xs md:text-sm tracking-wide"
                    style={{ fontFamily: "'Inter', sans-serif", color: "hsl(0 0% 50%)" }}
                  >
                    I build professional products using AI
                  </span>
                </div>
              </div>

              {/* Coordinates-style metadata */}
              <div className="hidden md:flex items-center gap-10">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "hsl(0 0% 30%)", fontFamily: "'Inter', sans-serif" }}>
                    Location
                  </span>
                  <span className="text-xs mt-1" style={{ color: "hsl(0 0% 55%)", fontFamily: "'Space Grotesk', sans-serif" }}>
                    India
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "hsl(0 0% 30%)", fontFamily: "'Inter', sans-serif" }}>
                    Status
                  </span>
                  <span className="text-xs mt-1 flex items-center gap-1.5" style={{ color: "hsl(0 0% 55%)", fontFamily: "'Space Grotesk', sans-serif" }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" style={{ boxShadow: "0 0 6px hsl(120 60% 50%)" }} />
                    Available
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div ref={scrollRef} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-0">
        <div className="w-[1px] h-10" style={{ background: "linear-gradient(to bottom, hsl(0 0% 40%), transparent)" }} />
      </div>
    </section>
  );
};

export default HeroSection;
