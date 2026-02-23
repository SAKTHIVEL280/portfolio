import { useRef, useEffect } from "react";
import gsap from "gsap";

const IntroLoader = ({ onComplete }: { onComplete: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const curtainTopRef = useRef<HTMLDivElement>(null);
  const curtainBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

    // Counter animation 0 → 100 — direct DOM update, no React state
    tl.to(
      { val: 0 },
      {
        val: 100,
        duration: 2,
        ease: "power3.inOut",
        onUpdate: function () {
          if (counterRef.current) {
            counterRef.current.textContent = String(Math.floor(this.targets()[0].val)).padStart(3, "0");
          }
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

    // Fade out counter + word + progress
    tl.to(
      [wordRef.current, counterRef.current?.parentElement, progressRef.current?.parentElement].filter(Boolean),
      {
        opacity: 0,
        scale: 0.92,
        duration: 0.5,
        stagger: 0.04,
        ease: "power3.in",
      },
      2.15
    );

    // Curtain split
    tl.to(curtainTopRef.current, { yPercent: -100, duration: 1, ease: "power4.inOut" }, 2.6);
    tl.to(curtainBottomRef.current, { yPercent: 100, duration: 1, ease: "power4.inOut" }, 2.6);

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100]">
      {/* Content layer */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-[3]" style={{ pointerEvents: "none" }}>
        <div ref={wordRef} className="mb-8" style={{ opacity: 0 }}>
          <span className="text-[11px] tracking-[0.6em] uppercase" style={{ color: "hsl(0 0% 50%)", fontFamily: "'Inter', sans-serif" }}>
            Sakthivel — Portfolio
          </span>
        </div>
        <div>
          <span
            ref={counterRef}
            className="text-8xl md:text-[10rem] font-bold tabular-nums leading-none"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(0 0% 6%)", WebkitTextStroke: "1px hsl(0 0% 15%)" }}
          >
            000
          </span>
        </div>
        <div className="mt-10 w-48 h-px relative" style={{ background: "hsl(0 0% 10%)" }}>
          <div ref={progressRef} className="absolute inset-0" style={{ background: "hsl(0 0% 60%)", transform: "scaleX(0)" }} />
        </div>
      </div>
      <div ref={curtainTopRef} className="absolute top-0 left-0 w-full h-1/2" style={{ background: "hsl(0 0% 2%)", zIndex: 2 }} />
      <div ref={curtainBottomRef} className="absolute bottom-0 left-0 w-full h-1/2" style={{ background: "hsl(0 0% 2%)", zIndex: 2 }} />
    </div>
  );
};

export default IntroLoader;
