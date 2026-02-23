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

const REEL_DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const IntroLoader = ({ onComplete }: { onComplete: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leverArmRef = useRef<HTMLDivElement>(null);
  const leverKnobRef = useRef<HTMLDivElement>(null);
  const reelRefs = useRef<HTMLDivElement[]>([]);
  const frameRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let tl: gsap.core.Timeline;

    const run = async () => {
      const preloadPromise = preloadImages();
      const digitH = window.innerWidth < 768 ? 80 : 130;
      const targets = [21, 20, 20];

      tl = gsap.timeline({
        onComplete: () => {
          if (containerRef.current) containerRef.current.style.display = "none";
          onComplete();
        },
      });

      // Phase 0: Entrance
      tl.fromTo(
        frameRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.7, ease: "power3.out" },
        0.3
      );

      tl.fromTo(
        leverArmRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" },
        0.5
      );

      // Phase 1: Pull lever
      tl.to(
        leverKnobRef.current,
        { y: 80, duration: 0.35, ease: "power2.in" },
        1.2
      );
      tl.to(
        leverKnobRef.current,
        { y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" },
        1.55
      );

      // Phase 2: Reels spin
      await preloadPromise;

      reelRefs.current.forEach((reel, i) => {
        if (!reel) return;
        const inner = reel.querySelector(".reel-inner") as HTMLElement;
        if (!inner) return;

        const cellH = digitH * 1.15;
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

      // Phase 3: All reels landed — brief hold
      const lastReelStop = 1.55 + 2 * 0.35 + 1.0 + 2 * 0.25 + 0.7; // ~4.15

      // Bounce on land
      tl.to(frameRef.current, {
        scale: 1.03,
        duration: 0.12,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
      }, lastReelStop + 0.05);

      // Phase 4: Lever fades, frame stays
      tl.to(
        leverArmRef.current,
        { opacity: 0, x: 20, duration: 0.4, ease: "power3.in" },
        lastReelStop + 0.4
      );

      // Phase 5: Frame morphs — it scales up to fill the entire screen and goes black
      // First: change frame background to black, text to white
      tl.to(frameRef.current, {
        backgroundColor: "hsl(0 0% 0%)",
        borderColor: "hsl(0 0% 0%)",
        color: "hsl(0 0% 100%)",
        duration: 0.4,
        ease: "power2.inOut",
      }, lastReelStop + 0.6);

      // Scale the frame to fill the viewport
      tl.to(frameRef.current, {
        scale: 12,
        borderRadius: "0px",
        duration: 1,
        ease: "power3.inOut",
      }, lastReelStop + 0.8);

      // Fade out frame contents (digits become invisible during scale)
      tl.to(frameRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
      }, lastReelStop + 1.5);

      // Background transitions to black
      tl.to(bgRef.current, {
        background: "hsl(0 0% 0%)",
        duration: 0.3,
        ease: "power2.inOut",
      }, lastReelStop + 1.4);
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
      {/* Background */}
      <div
        ref={bgRef}
        className="absolute inset-0 z-[1]"
        style={{ background: "hsl(0 0% 100%)" }}
      />

      {/* Center content */}
      <div className="absolute inset-0 z-[3] flex items-center justify-center">
        <div className="flex items-center gap-6 md:gap-10">
          {/* Slot frame */}
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
                  className="overflow-hidden"
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
                        className="flex items-center justify-center font-bold select-none"
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

              {/* % symbol */}
              <span
                className="self-end mb-1 ml-1 font-bold select-none"
                style={{
                  fontSize: digitH * 0.35,
                  fontFamily: "'Space Grotesk', sans-serif",
                  color: "hsl(0 0% 0%)",
                }}
              >
                %
              </span>
          </div>

          {/* Lever */}
          <div
            ref={leverArmRef}
            className="relative flex flex-col items-center"
            style={{ opacity: 0 }}
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
        </div>
      </div>
    </div>
  );
};

export default IntroLoader;
