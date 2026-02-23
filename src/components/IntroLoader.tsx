import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

const REEL_DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const IntroLoader = ({ onComplete }: { onComplete: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leverWrapRef = useRef<HTMLDivElement>(null);
  const leverArmRef = useRef<HTMLDivElement>(null);
  const leverKnobRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const reelRefs = useRef<HTMLDivElement[]>([]);
  const frameRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let tl: gsap.core.Timeline;

    const run = async () => {
      const preloadPromise = preloadImages();
      const digitH = window.innerWidth < 768 ? 80 : 130;
      const cellH = digitH * 1.15;
      const targets = [21, 20, 20];

      tl = gsap.timeline({
        onComplete: () => {
          onComplete();
          // Refresh ScrollTrigger so sections recalculate after intro is removed
          setTimeout(() => ScrollTrigger.refresh(), 100);
        },
      });

      // % hidden initially, lever visible
      if (percentRef.current) tl.set(percentRef.current, { opacity: 0, scale: 0, rotation: -90 }, 0);

      // Phase 0: Entrance
      tl.fromTo(frameRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.7, ease: "power3.out" },
        0.3
      );
      tl.fromTo(leverWrapRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" },
        0.5
      );

      // Phase 1: Pull lever
      tl.to(leverKnobRef.current, {
        y: 80, duration: 0.35, ease: "power2.in",
      }, 1.2);
      tl.to(leverKnobRef.current, {
        y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)",
      }, 1.55);

      // Phase 2: Reels spin
      await preloadPromise;

      reelRefs.current.forEach((reel, i) => {
        if (!reel) return;
        const inner = reel.querySelector(".reel-inner") as HTMLElement;
        if (!inner) return;

        const targetY = -(targets[i] * cellH);
        const fullCycleY = 10 * cellH;
        const spinDelay = i * 0.35;

        tl.to(inner, {
          y: -(fullCycleY * 2),
          duration: 1.0 + i * 0.25,
          ease: "none",
        }, 1.55 + spinDelay);

        tl.to(inner, {
          y: targetY,
          duration: 0.7,
          ease: "back.out(1.4)",
        }, 1.55 + spinDelay + 1.0 + i * 0.25);
      });

      const lastReelStop = 1.55 + 2 * 0.35 + 1.0 + 2 * 0.25 + 0.7;

      // Bounce on land
      tl.to(frameRef.current, {
        scale: 1.03, duration: 0.12, ease: "power2.out", yoyo: true, repeat: 1,
      }, lastReelStop + 0.05);

      // Phase 3: Lever morphs into % — lever fades out, % fades in at the same spot
      if (leverArmRef.current) {
        tl.to(leverArmRef.current, {
          opacity: 0,
          scale: 0.3,
          duration: 0.4,
          ease: "power3.in",
        }, lastReelStop + 0.4);
      }

      if (percentRef.current) {
        tl.to(percentRef.current, {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.6,
          ease: "back.out(1.8)",
        }, lastReelStop + 0.65);
      }

      // Phase 4: Hold "100 %" then turn everything black
      const blackStart = lastReelStop + 1.6;

      // Hide digits, %, and dividers first
      const fadeTargets = [".reel-digit", ".reel-divider", percentRef.current].filter(Boolean);
      tl.to(fadeTargets, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      }, blackStart);

      // Frame fills black
      tl.to(frameRef.current, {
        backgroundColor: "hsl(0 0% 0%)",
        borderColor: "hsl(0 0% 0%)",
        duration: 0.5,
        ease: "power2.inOut",
      }, blackStart + 0.1);

      // Phase 5: Clean black box scales up to fill screen
      const morphStart = blackStart + 0.8;

      tl.to(frameRef.current, {
        scale: 25,
        borderRadius: "0px",
        duration: 1.4,
        ease: "power3.inOut",
      }, morphStart);

      // Background matches black
      tl.to(bgRef.current, {
        background: "hsl(0 0% 0%)",
        duration: 0.4,
        ease: "power2.inOut",
      }, morphStart + 0.6);

      // Fade out frame
      tl.to(frameRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
      }, morphStart + 1.0);
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
      <div
        ref={bgRef}
        className="absolute inset-0 z-[1]"
        style={{ background: "hsl(0 0% 100%)" }}
      />

      <div className="absolute inset-0 z-[3] flex items-center justify-center">
        <div className="flex items-center gap-6 md:gap-10">
          {/* Slot frame — only digits, no % inside */}
          <div
            ref={frameRef}
            className="flex items-center gap-3 md:gap-4 px-8 md:px-14 py-6 md:py-8 overflow-hidden"
            style={{
              opacity: 0,
              border: "2px solid hsl(0 0% 0%)",
              borderRadius: "20px",
              background: "hsl(0 0% 100%)",
            }}
          >
            {[0, 1, 2].map((reelIdx) => (
              <div
                key={reelIdx}
                ref={(el) => { if (el) reelRefs.current[reelIdx] = el; }}
                className={`overflow-hidden ${reelIdx < 2 ? "reel-divider" : ""}`}
                style={{
                  height: digitH * 1.15,
                  width: digitH * 0.75,
                  borderRight: reelIdx < 2 ? "1px solid hsl(0 0% 85%)" : "none",
                }}
              >
                <div className="reel-inner" style={{ willChange: "transform" }}>
                  {REEL_DIGITS.map((d, dIdx) => (
                    <div
                      key={dIdx}
                      className="reel-digit flex items-center justify-center font-bold select-none"
                      style={{
                        height: digitH * 1.15,
                        fontSize: digitH * 0.75,
                        fontFamily: "'Space Grotesk', sans-serif",
                        color: "hsl(0 0% 0%)",
                        lineHeight: 1,
                      }}
                    >
                      {d}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Lever wrapper — lever and % occupy the same space */}
          <div
            ref={leverWrapRef}
            className="relative flex items-center justify-center"
            style={{ opacity: 0, width: digitH * 0.5, height: digitH * 1.15 }}
          >
            {/* Lever */}
            <div
              ref={leverArmRef}
              className="absolute inset-0 flex flex-col items-center"
            >
              <div
                className="w-[3px] md:w-[4px]"
                style={{
                  height: digitH * 1.1,
                  background: "hsl(0 0% 0%)",
                }}
              />
              <div
                ref={leverKnobRef}
                className="absolute top-0 left-1/2 -translate-x-1/2"
                style={{ willChange: "transform" }}
              >
                <div
                  className="rounded-full"
                  style={{
                    width: digitH * 0.26,
                    height: digitH * 0.26,
                    background: "hsl(0 0% 0%)",
                  }}
                />
              </div>
              <div
                className="rounded-full mt-1"
                style={{
                  width: digitH * 0.14,
                  height: digitH * 0.14,
                  background: "hsl(0 0% 0%)",
                }}
              />
            </div>

            {/* % symbol — replaces lever */}
            <span
              ref={percentRef}
              className="absolute font-bold select-none"
              style={{
                fontSize: digitH * 0.6,
                fontFamily: "'Space Grotesk', sans-serif",
                color: "hsl(0 0% 0%)",
                opacity: 0,
              }}
            >
              %
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroLoader;
