import { useRef, useEffect, useState } from "react";
import gsap from "gsap";

const IntroLoader = ({ onComplete }: { onComplete: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const nameRevealRef = useRef<HTMLDivElement>(null);
  const curtainTopRef = useRef<HTMLDivElement>(null);
  const curtainBottomRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          onComplete();
        },
      });

      // Counter animation 0 → 100
      tl.to(
        { val: 0 },
        {
          val: 100,
          duration: 2.4,
          ease: "power2.inOut",
          onUpdate: function () {
            setCount(Math.floor(this.targets()[0].val));
          },
        },
        0
      );

      // Progress bar grows
      tl.fromTo(
        progressRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 2.4, ease: "power2.inOut", transformOrigin: "left" },
        0
      );

      // Line 1 slides in
      tl.fromTo(
        line1Ref.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        0.2
      );

      // Line 2 slides in
      tl.fromTo(
        line2Ref.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
        0.5
      );

      // Name reveal after counter
      tl.fromTo(
        nameRevealRef.current,
        { clipPath: "inset(0 0 100% 0)" },
        {
          clipPath: "inset(0 0 0% 0)",
          duration: 0.8,
          ease: "power4.out",
        },
        2.0
      );

      // Fade out text elements
      tl.to(
        [line1Ref.current, line2Ref.current, progressRef.current?.parentElement, nameRevealRef.current],
        {
          opacity: 0,
          y: -30,
          duration: 0.5,
          stagger: 0.05,
          ease: "power3.in",
        },
        2.8
      );

      // Split curtain open
      tl.to(
        curtainTopRef.current,
        {
          yPercent: -100,
          duration: 1,
          ease: "power4.inOut",
        },
        3.2
      );

      tl.to(
        curtainBottomRef.current,
        {
          yPercent: 100,
          duration: 1,
          ease: "power4.inOut",
        },
        3.2
      );
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] pointer-events-none"
    >
      {/* Top curtain */}
      <div
        ref={curtainTopRef}
        className="absolute top-0 left-0 right-0 h-1/2 flex flex-col items-center justify-end pb-0"
        style={{ background: "hsl(0 0% 2%)" }}
      >
        <div className="flex flex-col items-center w-full max-w-md px-8 pb-12">
          {/* Small intro text */}
          <div ref={line1Ref} className="opacity-0">
            <span
              className="text-[10px] tracking-[0.5em] uppercase"
              style={{
                color: "hsl(0 0% 40%)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Portfolio / 2026
            </span>
          </div>

          <div ref={line2Ref} className="mt-3 opacity-0">
            <span
              className="text-[10px] tracking-[0.3em] uppercase"
              style={{
                color: "hsl(0 0% 30%)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Loading Experience
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-6 w-full max-w-[200px] h-[1px] relative" style={{ background: "hsl(0 0% 12%)" }}>
            <div
              ref={progressRef}
              className="absolute inset-0"
              style={{
                background: "hsl(0 0% 70%)",
                transform: "scaleX(0)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom curtain */}
      <div
        ref={curtainBottomRef}
        className="absolute bottom-0 left-0 right-0 h-1/2 flex flex-col items-center justify-start pt-0"
        style={{ background: "hsl(0 0% 2%)" }}
      >
        <div className="flex flex-col items-center pt-8">
          {/* Name reveal */}
          <div ref={nameRevealRef} style={{ clipPath: "inset(0 0 100% 0)" }}>
            <h2
              className="text-3xl md:text-5xl font-bold tracking-tight"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: "hsl(0 0% 90%)",
              }}
            >
              SAKTHIVEL
            </h2>
          </div>

          {/* Counter */}
          <div className="mt-6">
            <span
              ref={counterRef}
              className="text-7xl md:text-9xl font-bold tabular-nums"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: "hsl(0 0% 8%)",
                WebkitTextStroke: "1px hsl(0 0% 18%)",
              }}
            >
              {String(count).padStart(3, "0")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroLoader;
