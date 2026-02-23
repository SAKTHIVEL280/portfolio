import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextPressure from "../TextPressure";

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const metaLeftRef = useRef<HTMLDivElement>(null);
  const metaRightRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 3.8, // Wait for intro loader
      });

      // Tag line wipes in
      tl.fromTo(
        tagRef.current,
        { clipPath: "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0% 0 0)", duration: 1, ease: "power4.inOut" },
        0
      );

      // Name scales up from nothing
      tl.fromTo(
        nameRef.current,
        { clipPath: "inset(50% 20% 50% 20%)", opacity: 0 },
        { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, duration: 1.4, ease: "power4.out" },
        0.3
      );

      // Divider draws
      tl.fromTo(
        dividerRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1.2, ease: "power3.inOut", transformOrigin: "left" },
        0.8
      );

      // Meta left
      tl.fromTo(
        metaLeftRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        1.2
      );

      // Meta right
      tl.fromTo(
        metaRightRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        1.3
      );

      // Scroll indicator
      tl.fromTo(
        scrollRef.current,
        { opacity: 0 },
        { opacity: 0.4, duration: 1 },
        1.8
      );

      // Scroll indicator pulse
      gsap.to(scrollRef.current, {
        y: 8,
        yoyo: true,
        repeat: -1,
        duration: 1.5,
        ease: "sine.inOut",
        delay: 5,
      });

      // Parallax on scroll
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 0.5,
        onUpdate: (self) => {
          const p = self.progress;
          if (nameRef.current) {
            gsap.set(nameRef.current, { y: p * 80 });
          }
          if (tagRef.current) {
            gsap.set(tagRef.current, { y: p * 40, opacity: 1 - p * 1.5 });
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="h-screen w-full relative flex flex-col justify-center overflow-hidden"
      style={{ background: "hsl(var(--section-dark))" }}
    >
      <div className="relative z-10 w-full px-8 md:px-16 lg:px-24">
        {/* Tagline */}
        <div ref={tagRef} className="mb-6" style={{ clipPath: "inset(0 100% 0 0)" }}>
          <span
            className="text-xs md:text-sm tracking-[0.4em] uppercase"
            style={{
              fontFamily: "'Inter', sans-serif",
              color: "hsl(var(--muted-foreground))",
            }}
          >
            AI–Native Engineer & Builder
          </span>
        </div>

        {/* Name */}
        <div
          ref={nameRef}
          className="w-full"
          style={{
            height: "clamp(90px, 18vw, 240px)",
            opacity: 0,
          }}
        >
          <TextPressure
            text="SAKTHIVEL"
            flex
            alpha={false}
            stroke={false}
            width
            weight
            italic
            textColor="hsl(0 0% 93%)"
            strokeColor="#333333"
            minFontSize={40}
          />
        </div>

        {/* Divider */}
        <div
          ref={dividerRef}
          className="w-full h-px mt-8 mb-6"
          style={{
            background: "hsl(var(--border))",
            transform: "scaleX(0)",
          }}
        />

        {/* Meta row */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div ref={metaLeftRef} className="opacity-0">
            <p
              className="text-sm md:text-base leading-relaxed max-w-sm"
              style={{
                fontFamily: "'Inter', sans-serif",
                color: "hsl(var(--muted-foreground))",
              }}
            >
              I build professional products using AI.
              <br />
              From zero to production — fast.
            </p>
          </div>

          <div ref={metaRightRef} className="opacity-0 flex items-center gap-8">
            <div className="flex flex-col">
              <span
                className="text-[10px] tracking-[0.3em] uppercase"
                style={{ color: "hsl(0 0% 30%)", fontFamily: "'Inter', sans-serif" }}
              >
                Location
              </span>
              <span
                className="text-xs mt-1"
                style={{
                  color: "hsl(var(--muted-foreground))",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                India
              </span>
            </div>
            <div className="flex flex-col">
              <span
                className="text-[10px] tracking-[0.3em] uppercase"
                style={{ color: "hsl(0 0% 30%)", fontFamily: "'Inter', sans-serif" }}
              >
                Status
              </span>
              <span
                className="text-xs mt-1 flex items-center gap-1.5"
                style={{
                  color: "hsl(var(--muted-foreground))",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full inline-block"
                  style={{
                    background: "hsl(120 60% 50%)",
                    boxShadow: "0 0 6px hsl(120 60% 50%)",
                  }}
                />
                Available
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0"
      >
        <span
          className="text-[9px] tracking-[0.4em] uppercase"
          style={{ color: "hsl(var(--muted-foreground))", fontFamily: "'Inter', sans-serif" }}
        >
          Scroll
        </span>
        <div
          className="w-px h-8"
          style={{
            background: "linear-gradient(to bottom, hsl(0 0% 40%), transparent)",
          }}
        />
      </div>
    </section>
  );
};

export default HeroSection;
