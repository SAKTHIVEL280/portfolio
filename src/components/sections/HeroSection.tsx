import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextPressure from "../TextPressure";

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const subtextRef = useRef<HTMLDivElement>(null);
  

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 3.6,
      });

      // Name scales up from center
      tl.fromTo(
        nameRef.current,
        { clipPath: "inset(50% 30% 50% 30%)", opacity: 0 },
        { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, duration: 1.6, ease: "power4.out" },
        0
      );

      // Tag line wipes in
      tl.fromTo(
        tagRef.current,
        { clipPath: "inset(0 100% 0 0)", opacity: 0 },
        { clipPath: "inset(0 0% 0 0)", opacity: 1, duration: 1.2, ease: "power4.inOut" },
        0.4
      );

      // Subtext fades up
      tl.fromTo(
        subtextRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
        0.8
      );


      // Parallax on scroll
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 0.5,
        onUpdate: (self) => {
          const p = self.progress;
          if (nameRef.current) {
            gsap.set(nameRef.current, { y: p * 100 });
          }
          if (tagRef.current) {
            gsap.set(tagRef.current, { y: p * 50, opacity: 1 - p * 2 });
          }
          if (subtextRef.current) {
            gsap.set(subtextRef.current, { y: p * 30, opacity: 1 - p * 2.5 });
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
      className="h-screen w-full relative flex flex-col justify-center items-center overflow-hidden"
      style={{ background: "hsl(var(--section-dark))" }}
    >
      <div className="relative z-10 w-full flex flex-col items-center text-center px-8">
        {/* Tagline */}
        <div ref={tagRef} className="mb-6" style={{ opacity: 0 }}>
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
          className="w-full max-w-5xl"
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

        {/* Subtext */}
        <div ref={subtextRef} className="mt-8 max-w-md" style={{ opacity: 0 }}>
          <p
            className="text-sm md:text-base leading-relaxed"
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
      </div>

    </section>
  );
};

export default HeroSection;
