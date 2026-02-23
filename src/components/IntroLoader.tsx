import { useRef, useEffect, useState } from "react";
import gsap from "gsap";

const IntroLoader = ({ onComplete }: { onComplete: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          if (containerRef.current) {
            containerRef.current.style.display = "none";
          }
          onComplete();
        },
      });

      // Phase 1: Word reveal with clip-path
      tl.fromTo(
        wordRef.current,
        { clipPath: "inset(0 100% 0 0)", opacity: 1 },
        { clipPath: "inset(0 0% 0 0)", duration: 1, ease: "power4.inOut" },
        0
      );

      // Phase 1: Counter 0 → 100
      tl.to(
        { val: 0 },
        {
          val: 100,
          duration: 2,
          ease: "power2.inOut",
          onUpdate: function () {
            setCount(Math.floor(this.targets()[0].val));
          },
        },
        0
      );

      // Phase 1: Progress bar
      tl.fromTo(
        progressRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 2, ease: "power2.inOut", transformOrigin: "left" },
        0
      );

      // Phase 2: Scale down entire content block and fade
      tl.to(
        revealRef.current,
        {
          scale: 0.85,
          opacity: 0,
          duration: 0.7,
          ease: "power3.inOut",
        },
        2.1
      );

      // Phase 3: Circular reveal wipe — expand a clip-path circle from center
      tl.fromTo(
        containerRef.current,
        { clipPath: "circle(100% at 50% 50%)" },
        {
          clipPath: "circle(0% at 50% 50%)",
          duration: 1.2,
          ease: "power4.inOut",
        },
        2.6
      );
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100]" style={{ background: "hsl(0 0% 2%)" }}>
      {/* Content block */}
      <div
        ref={revealRef}
        className="absolute inset-0 flex flex-col items-center justify-center"
      >
        {/* Word */}
        <div ref={wordRef} className="mb-8" style={{ opacity: 0 }}>
          <span
            className="text-[11px] tracking-[0.6em] uppercase"
            style={{
              color: "hsl(0 0% 50%)",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Sakthivel — Portfolio
          </span>
        </div>

        {/* Counter */}
        <div>
          <span
            ref={counterRef}
            className="text-8xl md:text-[10rem] font-bold tabular-nums leading-none"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: "hsl(0 0% 6%)",
              WebkitTextStroke: "1px hsl(0 0% 15%)",
            }}
          >
            {String(count).padStart(3, "0")}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-10 w-48 h-px relative" style={{ background: "hsl(0 0% 10%)" }}>
          <div
            ref={progressRef}
            className="absolute inset-0"
            style={{
              background: "hsl(0 0% 60%)",
              transform: "scaleX(0)",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default IntroLoader;
