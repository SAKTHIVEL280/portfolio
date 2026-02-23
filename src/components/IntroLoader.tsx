import { useRef, useEffect, useState } from "react";
import gsap from "gsap";

const IntroLoader = ({ onComplete }: { onComplete: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const columnsRef = useRef<HTMLDivElement[]>([]);
  const wordRef = useRef<HTMLDivElement>(null);
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

      // Word reveal
      tl.fromTo(
        wordRef.current,
        { clipPath: "inset(0 100% 0 0)", opacity: 1 },
        { clipPath: "inset(0 0% 0 0)", duration: 1.2, ease: "power4.inOut" },
        0
      );

      // Counter animation 0 → 100
      tl.to(
        { val: 0 },
        {
          val: 100,
          duration: 2,
          ease: "power3.inOut",
          onUpdate: function () {
            setCount(Math.floor(this.targets()[0].val));
          },
        },
        0
      );

      // Progress bar
      tl.fromTo(
        progressRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 2, ease: "power3.inOut", transformOrigin: "left" },
        0
      );

      // Fade out counter + word
      tl.to(
        [wordRef.current, counterRef.current?.parentElement, progressRef.current?.parentElement],
        {
          opacity: 0,
          scale: 0.9,
          duration: 0.6,
          stagger: 0.05,
          ease: "power3.in",
        },
        2.2
      );

      // Column wipe reveal — 5 columns slide up staggered
      const numCols = 5;
      for (let i = 0; i < numCols; i++) {
        tl.to(
          columnsRef.current[i],
          {
            yPercent: -100,
            duration: 0.9,
            ease: "power4.inOut",
          },
          2.7 + i * 0.08
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100]">
      {/* Full overlay with content */}
      <div
        ref={overlayRef}
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ background: "hsl(0 0% 2%)" }}
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

      {/* Column wipe overlays */}
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          ref={(el) => { if (el) columnsRef.current[i] = el; }}
          className="absolute top-0 bottom-0"
          style={{
            left: `${i * 20}%`,
            width: "20%",
            background: "hsl(0 0% 2%)",
            zIndex: 2,
          }}
        />
      ))}
    </div>
  );
};

export default IntroLoader;
