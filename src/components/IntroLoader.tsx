import { useRef, useEffect } from "react";
import gsap from "gsap";

import redactifyImg from "@/assets/redactify.png";
import voicesopImg from "@/assets/voicesop.png";
import myluqImg from "@/assets/myluq.png";
import daeqImg from "@/assets/daeq.png";

const imageSources = [redactifyImg, voicesopImg, myluqImg, daeqImg];

const preloadImages = (): Promise<void> => {
  return new Promise((resolve) => {
    let loaded = 0;
    const total = imageSources.length;
    if (total === 0) { resolve(); return; }
    imageSources.forEach((src) => {
      const img = new Image();
      img.onload = img.onerror = () => {
        loaded++;
        if (loaded >= total) resolve();
      };
      img.src = src;
    });
    setTimeout(resolve, 5000);
  });
};

const IntroLoader = ({ onComplete }: { onComplete: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let tl: gsap.core.Timeline;

    const run = async () => {
      const preloadPromise = preloadImages();

      tl = gsap.timeline({
        onComplete: () => {
          if (containerRef.current) containerRef.current.style.display = "none";
          onComplete();
        },
      });

      // Label fade in
      tl.fromTo(
        labelRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        0
      );

      // Counter 0 → 100
      tl.to(
        { val: 0 },
        {
          val: 100,
          duration: 2.2,
          ease: "power2.inOut",
          onUpdate: function () {
            if (counterRef.current) {
              counterRef.current.textContent = String(Math.floor(this.targets()[0].val));
            }
          },
        },
        0.2
      );

      // Progress bar
      tl.fromTo(
        progressRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 2.2, ease: "power2.inOut", transformOrigin: "left" },
        0.2
      );

      await preloadPromise;

      // Fade out loader content
      tl.to(
        [labelRef.current, counterRef.current, progressRef.current?.parentElement].filter(Boolean),
        { opacity: 0, y: -20, duration: 0.4, stagger: 0.05, ease: "power3.in" },
        2.5
      );

      // Curtain wipe — the entire loader slides up to reveal content
      tl.to(
        curtainRef.current,
        {
          yPercent: -100,
          duration: 1,
          ease: "power4.inOut",
        },
        2.8
      );
    };

    run();
    return () => { if (tl) tl.kill(); };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100]" style={{ pointerEvents: "none" }}>
      <div
        ref={curtainRef}
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ background: "hsl(0 0% 4%)" }}
      >
        {/* Label */}
        <div ref={labelRef} className="mb-10" style={{ opacity: 0 }}>
          <span
            className="text-[10px] tracking-[0.5em] uppercase"
            style={{ color: "hsl(0 0% 45%)", fontFamily: "'Inter', sans-serif" }}
          >
            Loading
          </span>
        </div>

        {/* Counter */}
        <span
          ref={counterRef}
          className="text-7xl md:text-9xl font-bold tabular-nums leading-none"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            color: "hsl(0 0% 90%)",
          }}
        >
          0
        </span>

        {/* Progress bar */}
        <div className="mt-10 w-40 md:w-56 h-[1px] relative" style={{ background: "hsl(0 0% 18%)" }}>
          <div
            ref={progressRef}
            className="absolute inset-0"
            style={{ background: "hsl(0 0% 55%)", transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </div>
  );
};

export default IntroLoader;
