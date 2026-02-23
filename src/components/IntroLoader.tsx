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

// 5 distinct curved paths that morph sequentially
const morphStages = [
  // Stage 0: Full screen coverage — organic wave
  [
    "M0,0 L1440,0 L1440,540 C1200,320 960,720 720,480 C480,240 240,640 0,540 Z",
    "M0,540 C240,440 480,840 720,600 C960,360 1200,760 1440,540 L1440,1080 L0,1080 Z",
  ],
  // Stage 1: Pinch center — diamond-like
  [
    "M0,0 L1440,0 L1440,380 C1080,540 720,200 360,420 C180,540 0,300 0,380 Z",
    "M0,700 C180,540 360,660 720,580 C1080,500 1200,700 1440,700 L1440,1080 L0,1080 Z",
  ],
  // Stage 2: Circular reveal — blob opening
  [
    "M0,0 L1440,0 L1440,280 C1200,440 960,160 720,320 C480,480 240,200 0,280 Z",
    "M0,800 C240,640 480,880 720,760 C960,640 1200,800 1440,800 L1440,1080 L0,1080 Z",
  ],
  // Stage 3: Almost flat — subtle wave
  [
    "M0,0 L1440,0 L1440,80 C1080,160 720,40 360,120 C180,160 0,60 0,80 Z",
    "M0,1000 C360,960 720,1020 1080,980 C1260,960 1380,1000 1440,1000 L1440,1080 L0,1080 Z",
  ],
  // Stage 4: Flat — gone
  [
    "M0,0 L1440,0 L1440,0 C1080,0 720,0 360,0 C180,0 0,0 0,0 Z",
    "M0,1080 C360,1080 720,1080 1080,1080 C1260,1080 1380,1080 1440,1080 L1440,1080 L0,1080 Z",
  ],
];

const IntroLoader = ({ onComplete }: { onComplete: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const topPath = useRef<SVGPathElement>(null);
  const botPath = useRef<SVGPathElement>(null);
  const svgOverlayRef = useRef<HTMLDivElement>(null);

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

      // Word reveal
      tl.fromTo(
        wordRef.current,
        { clipPath: "inset(0 100% 0 0)", opacity: 1 },
        { clipPath: "inset(0 0% 0 0)", duration: 1.2, ease: "power4.inOut" },
        0
      );

      // Counter 0 → 100
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

      await preloadPromise;

      // Fade out content
      tl.to(
        [wordRef.current, counterRef.current?.parentElement, progressRef.current?.parentElement].filter(Boolean),
        { opacity: 0, scale: 0.92, duration: 0.4, stagger: 0.03, ease: "power3.in" },
        2.15
      );

      // Sequential SVG morphing through all stages — advanced curved transitions
      const morphDuration = 0.45;
      const morphEase = "power4.inOut";
      let morphStart = 2.5;

      for (let s = 1; s < morphStages.length; s++) {
        tl.to(topPath.current, {
          attr: { d: morphStages[s][0] },
          duration: morphDuration,
          ease: morphEase,
        }, morphStart);
        tl.to(botPath.current, {
          attr: { d: morphStages[s][1] },
          duration: morphDuration,
          ease: morphEase,
        }, morphStart);
        morphStart += morphDuration * 0.7; // overlap for fluidity
      }

      // Final fade
      tl.to(svgOverlayRef.current, { opacity: 0, duration: 0.3, ease: "power2.out" }, morphStart);
    };

    run();
    return () => { if (tl) tl.kill(); };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100]" style={{ background: "hsl(0 0% 96%)" }}>
      {/* Content */}
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

      {/* SVG Morphing overlay — black & white curved morph */}
      <div ref={svgOverlayRef} className="absolute inset-0 z-[2]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 1080" preserveAspectRatio="none">
          <path
            ref={topPath}
            d={morphStages[0][0]}
            fill="hsl(0 0% 2%)"
          />
          <path
            ref={botPath}
            d={morphStages[0][1]}
            fill="hsl(0 0% 2%)"
          />
        </svg>
      </div>
    </div>
  );
};

export default IntroLoader;
