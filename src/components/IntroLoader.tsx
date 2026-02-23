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

// Each reel has digits repeated several times for the "spinning" illusion
const REEL_DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const IntroLoader = ({ onComplete }: { onComplete: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leverArmRef = useRef<HTMLDivElement>(null);
  const leverKnobRef = useRef<HTMLDivElement>(null);
  const reelRefs = useRef<HTMLDivElement[]>([]);
  const frameRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const curtainLeftRef = useRef<HTMLDivElement>(null);
  const curtainRightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let tl: gsap.core.Timeline;

    const run = async () => {
      const preloadPromise = preloadImages();

      const digitH = window.innerWidth < 768 ? 80 : 130;
      // Target positions: reel 0 → digit "1" (index 21), reel 1 → "0" (index 20), reel 2 → "0" (index 20)
      const targets = [21, 20, 20];

      tl = gsap.timeline({
        onComplete: () => {
          if (containerRef.current) containerRef.current.style.display = "none";
          onComplete();
        },
      });

      // Phase 0: Entrance — frame and reels fade in
      tl.fromTo(
        frameRef.current,
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" },
        0.2
      );

      tl.fromTo(
        labelRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
        0.6
      );

      // Lever entrance
      tl.fromTo(
        leverArmRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" },
        0.5
      );

      // Phase 1: Pull the lever down (1s pause then pull)
      tl.to(
        leverKnobRef.current,
        { y: 80, duration: 0.4, ease: "power2.in" },
        1.3
      );

      // Lever springs back
      tl.to(
        leverKnobRef.current,
        { y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" },
        1.7
      );

      // Phase 2: Reels spin — each reel spins fast then lands on target
      await preloadPromise;

      reelRefs.current.forEach((reel, i) => {
        if (!reel) return;
        const inner = reel.querySelector(".reel-inner") as HTMLElement;
        if (!inner) return;

        const targetY = -(targets[i] * digitH);
        const spinDuration = 1.6 + i * 0.5; // Each reel takes longer to stop
        const startTime = 1.7; // Start when lever is pulled

        // Fast random spin
        tl.fromTo(
          inner,
          { y: 0 },
          {
            y: targetY,
            duration: spinDuration,
            ease: "power3.out",
            // Overshoot slightly for a mechanical feel
            modifiers: {
              y: (y: string) => {
                const progress = tl.progress();
                const reelProgress = Math.min(1, (tl.time() - startTime) / spinDuration);
                if (reelProgress < 0) return "0px";
                if (reelProgress < 0.6) {
                  // Fast spin phase — cycle through random positions
                  const spinY = -(Math.floor(Math.random() * 20) * digitH);
                  return spinY + "px";
                }
                // Deceleration phase — ease to target
                return y;
              },
            },
          },
          startTime
        );
      });

      // Phase 3: Landing flash when all reels stop
      const allReelsStop = 1.7 + 1.6 + 2 * 0.5; // ~3.7s

      tl.to(
        frameRef.current,
        {
          scale: 1.02,
          duration: 0.15,
          ease: "power2.out",
          yoyo: true,
          repeat: 1,
        },
        allReelsStop + 0.1
      );

      // Flash
      tl.fromTo(
        flashRef.current,
        { opacity: 0 },
        { opacity: 0.6, duration: 0.1, yoyo: true, repeat: 1 },
        allReelsStop + 0.1
      );

      // Phase 4: Everything scales up and fades, curtains split
      tl.to(
        [frameRef.current, leverArmRef.current, labelRef.current],
        {
          scale: 0.9,
          opacity: 0,
          duration: 0.6,
          ease: "power3.in",
        },
        allReelsStop + 0.6
      );

      tl.to(
        curtainLeftRef.current,
        { xPercent: -100, duration: 0.8, ease: "power4.inOut" },
        allReelsStop + 0.9
      );
      tl.to(
        curtainRightRef.current,
        { xPercent: 100, duration: 0.8, ease: "power4.inOut" },
        allReelsStop + 0.9
      );
    };

    run();
    return () => { if (tl) tl.kill(); };
  }, []);

  const digitH = typeof window !== "undefined" && window.innerWidth < 768 ? 80 : 130;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100]"
      style={{ pointerEvents: "none" }}
    >
      {/* Split curtains */}
      <div
        ref={curtainLeftRef}
        className="absolute top-0 left-0 w-1/2 h-full z-[1]"
        style={{ background: "hsl(0 0% 96%)" }}
      />
      <div
        ref={curtainRightRef}
        className="absolute top-0 right-0 w-1/2 h-full z-[1]"
        style={{ background: "hsl(0 0% 96%)" }}
      />

      {/* Flash overlay */}
      <div
        ref={flashRef}
        className="absolute inset-0 z-[4]"
        style={{ background: "hsl(0 0% 100%)", opacity: 0, pointerEvents: "none" }}
      />

      {/* Center content */}
      <div className="absolute inset-0 z-[3] flex items-center justify-center">
        <div className="flex items-center gap-6 md:gap-10">
          {/* Slot machine frame */}
          <div ref={frameRef} style={{ opacity: 0 }}>
            {/* Label above */}
            <div ref={labelRef} className="text-center mb-4 md:mb-6" style={{ opacity: 0 }}>
              <span
                className="text-[9px] md:text-[11px] tracking-[0.6em] uppercase"
                style={{
                  color: "hsl(0 0% 50%)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Initializing
              </span>
            </div>

            {/* Reels container */}
            <div
              className="flex items-center gap-2 md:gap-3 px-6 md:px-10 py-4 md:py-6 rounded-2xl"
              style={{
                background: "hsl(0 0% 100%)",
                boxShadow: "0 1px 0 hsl(0 0% 88%), 0 4px 20px hsl(0 0% 0% / 0.06), 0 20px 60px hsl(0 0% 0% / 0.04)",
                border: "1px solid hsl(0 0% 90%)",
              }}
            >
              {[0, 1, 2].map((reelIdx) => (
                <div
                  key={reelIdx}
                  ref={(el) => { if (el) reelRefs.current[reelIdx] = el; }}
                  className="overflow-hidden rounded-lg"
                  style={{
                    height: digitH,
                    width: digitH * 0.65,
                    background: "hsl(0 0% 97%)",
                    border: "1px solid hsl(0 0% 91%)",
                  }}
                >
                  <div className="reel-inner" style={{ willChange: "transform" }}>
                    {REEL_DIGITS.map((d, dIdx) => (
                      <div
                        key={dIdx}
                        className="flex items-center justify-center font-bold select-none"
                        style={{
                          height: digitH,
                          fontSize: digitH * 0.6,
                          fontFamily: "'Space Grotesk', sans-serif",
                          color: "hsl(0 0% 10%)",
                          lineHeight: 1,
                        }}
                      >
                        {d}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* % symbol */}
              <span
                className="self-start mt-2 md:mt-3 ml-1"
                style={{
                  fontSize: digitH * 0.2,
                  fontFamily: "'Space Grotesk', sans-serif",
                  color: "hsl(0 0% 50%)",
                  fontWeight: 600,
                }}
              >
                %
              </span>
            </div>
          </div>

          {/* Lever */}
          <div
            ref={leverArmRef}
            className="relative flex flex-col items-center"
            style={{ opacity: 0 }}
          >
            {/* Lever track */}
            <div
              className="w-[3px] md:w-[4px] rounded-full"
              style={{
                height: digitH * 1.2,
                background: "linear-gradient(to bottom, hsl(0 0% 75%), hsl(0 0% 55%))",
              }}
            />
            {/* Lever knob */}
            <div
              ref={leverKnobRef}
              className="absolute top-0 left-1/2 -translate-x-1/2"
              style={{ willChange: "transform" }}
            >
              <div
                className="rounded-full"
                style={{
                  width: digitH * 0.28,
                  height: digitH * 0.28,
                  background: "radial-gradient(circle at 35% 35%, hsl(0 0% 30%), hsl(0 0% 8%))",
                  boxShadow: "0 2px 8px hsl(0 0% 0% / 0.2)",
                }}
              />
            </div>
            {/* Base */}
            <div
              className="rounded-full mt-1"
              style={{
                width: digitH * 0.18,
                height: digitH * 0.18,
                background: "hsl(0 0% 75%)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroLoader;
