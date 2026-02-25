import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextPressure from "../TextPressure";

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const subtextRef = useRef<HTMLDivElement>(null);
  const gridLinesRef = useRef<HTMLDivElement>(null);
  const coordsRef = useRef<HTMLDivElement>(null);
  const cornerTLRef = useRef<HTMLDivElement>(null);
  const cornerTRRef = useRef<HTMLDivElement>(null);
  const cornerBLRef = useRef<HTMLDivElement>(null);
  const cornerBRRef = useRef<HTMLDivElement>(null);
  const orbiterRef = useRef<HTMLDivElement>(null);
  const pulseRingRef = useRef<HTMLDivElement>(null);
  const lineHRef = useRef<HTMLDivElement>(null);
  const lineVRef = useRef<HTMLDivElement>(null);
  const statusDotsRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);

  // Ticker counter
  const [counter, setCounter] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
        delay: 3.6,
      });

      // Phase 1: Architectural grid lines draw in
      tl.fromTo(
        lineHRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1.8, ease: "power3.inOut" },
        0
      );
      tl.fromTo(
        lineVRef.current,
        { scaleY: 0 },
        { scaleY: 1, duration: 1.8, ease: "power3.inOut" },
        0.1
      );

      // Phase 1b: Corner brackets draw in
      const corners = [cornerTLRef.current, cornerTRRef.current, cornerBLRef.current, cornerBRRef.current];
      tl.fromTo(
        corners,
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 0.8, stagger: 0.08, ease: "power3.out" },
        0.3
      );

      // Phase 2: Name reveals with dramatic clip-path
      tl.fromTo(
        nameRef.current,
        { clipPath: "inset(50% 40% 50% 40%)", opacity: 0 },
        { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, duration: 1.4, ease: "power4.out" },
        0.5
      );

      // Phase 2b: Pulse ring expands from center
      tl.fromTo(
        pulseRingRef.current,
        { scale: 0, opacity: 0.6 },
        { scale: 1, opacity: 0, duration: 2, ease: "power2.out" },
        0.6
      );

      // Phase 3: Tag wipes in with character stagger feel
      tl.fromTo(
        tagRef.current,
        { clipPath: "inset(0 100% 0 0)", opacity: 0 },
        { clipPath: "inset(0 0% 0 0)", opacity: 1, duration: 1, ease: "power4.inOut" },
        0.9
      );

      // Phase 4: Subtext fades up
      tl.fromTo(
        subtextRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
        1.2
      );

      // Phase 5: Peripheral UI elements
      tl.fromTo(
        coordsRef.current,
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, duration: 0.7 },
        1.4
      );
      tl.fromTo(
        statusDotsRef.current,
        { opacity: 0, x: 10 },
        { opacity: 1, x: 0, duration: 0.7 },
        1.4
      );
      tl.fromTo(
        yearRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.7 },
        1.5
      );

      // Continuous: Orbiter rotation
      gsap.to(orbiterRef.current, {
        rotation: 360,
        repeat: -1,
        duration: 20,
        ease: "none",
        delay: 4,
      });

      // Continuous: Subtle grid line pulse
      gsap.to(gridLinesRef.current, {
        opacity: 0.03,
        yoyo: true,
        repeat: -1,
        duration: 4,
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
          if (nameRef.current) gsap.set(nameRef.current, { y: p * 120 });
          if (tagRef.current) gsap.set(tagRef.current, { y: p * 60, opacity: 1 - p * 2.5 });
          if (subtextRef.current) gsap.set(subtextRef.current, { y: p * 40, opacity: 1 - p * 3 });
          if (lineHRef.current) gsap.set(lineHRef.current, { opacity: 1 - p * 2 });
          if (lineVRef.current) gsap.set(lineVRef.current, { opacity: 1 - p * 2 });
          corners.forEach((c) => {
            if (c) gsap.set(c, { opacity: 1 - p * 2.5 });
          });
          if (coordsRef.current) gsap.set(coordsRef.current, { opacity: 1 - p * 3 });
          if (statusDotsRef.current) gsap.set(statusDotsRef.current, { opacity: 1 - p * 3 });
          if (yearRef.current) gsap.set(yearRef.current, { opacity: 1 - p * 3, y: p * 20 });
        },
      });
    }, sectionRef);

    // Coordinate ticker animation
    const tickerInterval = setInterval(() => {
      setCounter({
        lat: parseFloat((11.0168 + Math.random() * 0.002 - 0.001).toFixed(4)),
        lng: parseFloat((76.9558 + Math.random() * 0.002 - 0.001).toFixed(4)),
      });
    }, 150);

    // Stop ticker after entrance
    const tickerTimeout = setTimeout(() => clearInterval(tickerInterval), 7000);

    return () => {
      ctx.revert();
      clearInterval(tickerInterval);
      clearTimeout(tickerTimeout);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="h-screen w-full relative flex flex-col justify-center items-center overflow-hidden"
      style={{ background: "hsl(var(--section-dark))" }}
    >
      {/* Architectural grid overlay */}
      <div
        ref={gridLinesRef}
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.06 }}
      >
        {/* Vertical grid lines */}
        {[20, 40, 60, 80].map((pct) => (
          <div
            key={`v-${pct}`}
            className="absolute top-0 bottom-0 w-px"
            style={{ left: `${pct}%`, background: "hsl(var(--foreground))" }}
          />
        ))}
        {/* Horizontal grid lines */}
        {[25, 50, 75].map((pct) => (
          <div
            key={`h-${pct}`}
            className="absolute left-0 right-0 h-px"
            style={{ top: `${pct}%`, background: "hsl(var(--foreground))" }}
          />
        ))}
      </div>

      {/* Center crosshair lines */}
      <div
        ref={lineHRef}
        className="absolute left-0 right-0 h-px top-1/2 -translate-y-1/2 origin-center pointer-events-none"
        style={{ background: "hsl(0 0% 25%)", transform: "scaleX(0)" }}
      />
      <div
        ref={lineVRef}
        className="absolute top-0 bottom-0 w-px left-1/2 -translate-x-1/2 origin-center pointer-events-none"
        style={{ background: "hsl(0 0% 25%)", transform: "scaleY(0)" }}
      />

      {/* Pulse ring from center */}
      <div
        ref={pulseRingRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full"
        style={{
          width: "clamp(300px, 50vw, 600px)",
          height: "clamp(300px, 50vw, 600px)",
          border: "1px solid hsl(0 0% 30%)",
          opacity: 0,
        }}
      />

      {/* Corner brackets — architectural framing */}
      <div ref={cornerTLRef} className="absolute top-8 left-8 pointer-events-none" style={{ opacity: 0 }}>
        <div className="w-6 h-6 border-l border-t" style={{ borderColor: "hsl(0 0% 30%)" }} />
      </div>
      <div ref={cornerTRRef} className="absolute top-8 right-8 pointer-events-none" style={{ opacity: 0 }}>
        <div className="w-6 h-6 border-r border-t" style={{ borderColor: "hsl(0 0% 30%)" }} />
      </div>
      <div ref={cornerBLRef} className="absolute bottom-8 left-8 pointer-events-none" style={{ opacity: 0 }}>
        <div className="w-6 h-6 border-l border-b" style={{ borderColor: "hsl(0 0% 30%)" }} />
      </div>
      <div ref={cornerBRRef} className="absolute bottom-8 right-8 pointer-events-none" style={{ opacity: 0 }}>
        <div className="w-6 h-6 border-r border-b" style={{ borderColor: "hsl(0 0% 30%)" }} />
      </div>

      {/* Orbiting element */}
      <div
        ref={orbiterRef}
        className="absolute left-1/2 top-1/2 pointer-events-none"
        style={{
          width: "clamp(260px, 40vw, 500px)",
          height: "clamp(260px, 40vw, 500px)",
          marginLeft: "clamp(-130px, -20vw, -250px)",
          marginTop: "clamp(-130px, -20vw, -250px)",
        }}
      >
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
          style={{ background: "hsl(0 0% 40%)" }}
        />
      </div>

      {/* Main content */}
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

      {/* Peripheral UI: Coordinates */}
      <div
        ref={coordsRef}
        className="absolute bottom-10 left-8 flex flex-col gap-1 pointer-events-none"
        style={{ opacity: 0 }}
      >
        <span
          className="text-[10px] tracking-[0.3em] uppercase"
          style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(0 0% 30%)" }}
        >
          {counter.lat}°N
        </span>
        <span
          className="text-[10px] tracking-[0.3em] uppercase"
          style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(0 0% 30%)" }}
        >
          {counter.lng}°E
        </span>
      </div>

      {/* Peripheral UI: Status dots */}
      <div
        ref={statusDotsRef}
        className="absolute bottom-10 right-8 flex items-center gap-2 pointer-events-none"
        style={{ opacity: 0 }}
      >
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: "hsl(0 0% 40%)" }} />
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: "hsl(0 0% 25%)" }} />
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: "hsl(0 0% 25%)" }} />
        <span
          className="text-[10px] tracking-[0.2em] uppercase ml-2"
          style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(0 0% 30%)" }}
        >
          SYS.ACTIVE
        </span>
      </div>

      {/* Year marker */}
      <div
        ref={yearRef}
        className="absolute top-10 right-8 pointer-events-none"
        style={{ opacity: 0 }}
      >
        <span
          className="text-[10px] tracking-[0.4em]"
          style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(0 0% 25%)" }}
        >
          ©2025
        </span>
      </div>
    </section>
  );
};

export default HeroSection;
