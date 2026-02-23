import { useRef, useEffect } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import TextPressure from "../TextPressure";

gsap.registerPlugin(CustomEase);
CustomEase.create("smoothOut", "M0,0 C0.25,1 0.5,1 1,1");

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const swapRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "smoothOut" } });

      // Background number
      tl.fromTo(numberRef.current, { opacity: 0, scale: 0.8 }, { opacity: 0.03, scale: 1, duration: 1.5 }, 0);

      // Horizontal line draws in
      tl.fromTo(lineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "power3.inOut" }, 0.2);

      // Intro fades up
      tl.fromTo(introRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, 0.4);

      // Name reveal
      tl.fromTo(nameRef.current, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, 0.6);

      // Swap text
      tl.fromTo(swapRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.7 }, 1.0);

      // Scroll hint
      tl.fromTo(scrollHintRef.current, { opacity: 0 }, { opacity: 0.4, duration: 0.8 }, 1.4);

      // Scroll hint pulse
      gsap.to(scrollHintRef.current, {
        y: 8,
        yoyo: true,
        repeat: -1,
        duration: 1.2,
        ease: "sine.inOut",
      });

      // Text swap loop
      const swapContainer = swapRef.current;
      if (swapContainer) {
        const lines = swapContainer.querySelectorAll(".swap-line");
        const swapTl = gsap.timeline({ repeat: -1, delay: 2 });
        swapTl.to(lines[0], { y: "-100%", opacity: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" }, "+=3");
        swapTl.to(lines[1], { y: "-100%", opacity: 1, duration: 0.6, ease: "elastic.out(1, 0.5)" }, "<");
        swapTl.to(lines[1], { y: "-200%", opacity: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" }, "+=3");
        swapTl.to(lines[0], { y: "0%", opacity: 1, duration: 0.6, ease: "elastic.out(1, 0.5)" }, "<");
        swapTl.set(lines[1], { y: "0%" });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="h-screen w-full relative flex flex-col justify-center overflow-hidden"
      style={{ background: "hsl(var(--hero-bg))", color: "hsl(var(--hero-fg))" }}
    >
      {/* Giant background number */}
      <span
        ref={numberRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none opacity-0"
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "clamp(300px, 50vw, 700px)",
          fontWeight: 700,
          lineHeight: 1,
          color: "hsl(var(--hero-fg))",
        }}
      >
        01
      </span>

      {/* Content */}
      <div className="relative z-10 px-8 md:px-16 lg:px-24">
        {/* Intro line */}
        <p
          ref={introRef}
          className="text-sm md:text-base tracking-[0.3em] uppercase mb-6 opacity-0"
          style={{ fontFamily: "'Inter', sans-serif", color: "hsl(var(--muted-foreground))" }}
        >
          hello.! I'm
        </p>

        {/* Horizontal line */}
        <div
          ref={lineRef}
          className="w-full h-px mb-6 origin-left"
          style={{ background: "hsl(0 0% 25%)", transform: "scaleX(0)" }}
        />

        {/* Name - TextPressure */}
        <div ref={nameRef} className="opacity-0 w-full" style={{ height: "clamp(100px, 18vw, 250px)" }}>
          <TextPressure
            text="SAKTHIVEL"
            flex
            alpha={false}
            stroke={false}
            width
            weight
            italic
            textColor="#ededed"
            strokeColor="#555555"
            minFontSize={36}
          />
        </div>

        {/* Bottom row: swap text left, metadata right */}
        <div className="flex items-end justify-between mt-6 md:mt-10">
          {/* Text swap */}
          <div ref={swapRef} className="h-7 md:h-8 overflow-hidden relative opacity-0">
            <div className="swap-line absolute inset-0 flex items-center">
              <span
                className="text-xs md:text-sm tracking-[0.25em] uppercase"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(var(--muted-foreground))" }}
              >
                AI — Native Engineer
              </span>
            </div>
            <div className="swap-line absolute inset-0 flex items-center translate-y-full opacity-0">
              <span
                className="text-xs md:text-sm tracking-wide"
                style={{ fontFamily: "'Inter', sans-serif", color: "hsl(var(--muted-foreground))" }}
              >
                I build professional products using AI
              </span>
            </div>
          </div>

          {/* Metadata */}
          <div className="hidden md:flex items-center gap-8">
            <span className="text-xs tracking-[0.2em] uppercase" style={{ color: "hsl(0 0% 30%)", fontFamily: "'Inter', sans-serif" }}>
              Portfolio — 2026
            </span>
            <span className="text-xs tracking-[0.2em] uppercase" style={{ color: "hsl(0 0% 30%)", fontFamily: "'Inter', sans-serif" }}>
              Based in India
            </span>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div ref={scrollHintRef} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0">
        <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "hsl(0 0% 35%)", fontFamily: "'Inter', sans-serif" }}>
          Scroll
        </span>
        <div className="w-px h-8" style={{ background: "hsl(0 0% 25%)" }} />
      </div>
    </section>
  );
};

export default HeroSection;
