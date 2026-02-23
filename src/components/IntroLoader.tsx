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

// SVG morph paths — circle → organic blob → rectangle that fills screen
const MORPH_PATHS = [
  // Circle
  "M 50,10 C 72,10 90,28 90,50 C 90,72 72,90 50,90 C 28,90 10,72 10,50 C 10,28 28,10 50,10 Z",
  // Organic blob
  "M 50,2 C 78,2 98,18 98,50 C 98,82 78,98 50,98 C 22,98 2,82 2,50 C 2,18 22,2 50,2 Z",
  // Rounded rect expanding
  "M 50,-20 C 120,-20 120,-20 120,50 C 120,120 120,120 50,120 C -20,120 -20,120 -20,50 C -20,-20 -20,-20 50,-20 Z",
  // Full screen rect
  "M 50,-60 C 160,-60 160,-60 160,50 C 160,160 160,160 50,160 C -60,160 -60,160 -60,50 C -60,-60 -60,-60 50,-60 Z",
];

const IntroLoader = ({ onComplete }: { onComplete: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leverArmRef = useRef<HTMLDivElement>(null);
  const leverKnobRef = useRef<HTMLDivElement>(null);
  const reelRefs = useRef<HTMLDivElement[]>([]);
  const frameRef = useRef<HTMLDivElement>(null);
  const morphRef = useRef<SVGPathElement>(null);
  const morphSvgRef = useRef<SVGSVGElement>(null);
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

        const targetY = -(targets[i] * digitH);
        const fullCycleY = 10 * digitH;
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

      // Phase 4: Content fades out
      tl.to(
        [frameRef.current, leverArmRef.current],
        { opacity: 0, scale: 0.85, duration: 0.5, ease: "power3.in" },
        lastReelStop + 0.4
      );

      // Phase 5: Black morph — circle appears at center, morphs into blob, expands to fill screen
      tl.set(morphSvgRef.current, { opacity: 1 }, lastReelStop + 0.7);

      tl.fromTo(
        morphRef.current,
        { attr: { d: MORPH_PATHS[0] }, scale: 0 },
        { scale: 1, duration: 0.4, ease: "back.out(1.5)", transformOrigin: "50% 50%" },
        lastReelStop + 0.7
      );

      // Morph to blob
      tl.to(
        morphRef.current,
        { attr: { d: MORPH_PATHS[1] }, duration: 0.3, ease: "power2.inOut" },
        lastReelStop + 1.0
      );

      // Morph to rounded rect
      tl.to(
        morphRef.current,
        { attr: { d: MORPH_PATHS[2] }, duration: 0.3, ease: "power2.inOut" },
        lastReelStop + 1.25
      );

      // Morph to full screen
      tl.to(
        morphRef.current,
        { attr: { d: MORPH_PATHS[3] }, duration: 0.35, ease: "power3.in" },
        lastReelStop + 1.5
      );

      // Background behind morph fades to black to match site
      tl.to(
        bgRef.current,
        { background: "hsl(0 0% 0%)", duration: 0.01 },
        lastReelStop + 1.8
      );

      // Final: morph SVG fades out to reveal site
      tl.to(
        morphSvgRef.current,
        { opacity: 0, duration: 0.6, ease: "power2.out" },
        lastReelStop + 1.85
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
      {/* Background */}
      <div
        ref={bgRef}
        className="absolute inset-0 z-[1]"
        style={{ background: "hsl(0 0% 100%)" }}
      />

      {/* Morph SVG overlay */}
      <svg
        ref={morphSvgRef}
        className="absolute inset-0 w-full h-full z-[2]"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ opacity: 0 }}
      >
        <path
          ref={morphRef}
          d={MORPH_PATHS[0]}
          fill="hsl(0 0% 0%)"
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 z-[3] flex items-center justify-center">
        <div className="flex items-center gap-6 md:gap-10">
          {/* Slot frame */}
          <div ref={frameRef} style={{ opacity: 0 }}>
            <div
              className="flex items-center gap-2 md:gap-3 px-6 md:px-10 py-4 md:py-6"
              style={{
                border: "2px solid hsl(0 0% 0%)",
              }}
            >
              {[0, 1, 2].map((reelIdx) => (
                <div
                  key={reelIdx}
                  ref={(el) => { if (el) reelRefs.current[reelIdx] = el; }}
                  className="overflow-hidden"
                  style={{
                    height: digitH,
                    width: digitH * 0.65,
                    borderRight: reelIdx < 2 ? "1px solid hsl(0 0% 85%)" : "none",
                  }}
                >
                  <div className="reel-inner" style={{ willChange: "transform" }}>
                    {REEL_DIGITS.map((d, dIdx) => (
                      <div
                        key={dIdx}
                        className="flex items-center justify-center font-bold select-none"
                        style={{
                          height: digitH,
                          fontSize: digitH * 0.65,
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
