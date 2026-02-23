import { useRef, useEffect } from "react";
import gsap from "gsap";

// Preload all project images
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
    // Timeout fallback
    setTimeout(resolve, 5000);
  });
};

const IntroLoader = ({ onComplete }: { onComplete: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const morphPath1 = useRef<SVGPathElement>(null);
  const morphPath2 = useRef<SVGPathElement>(null);
  const morphPath3 = useRef<SVGPathElement>(null);
  const svgOverlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let tl: gsap.core.Timeline;

    const run = async () => {
      // Start preloading images
      const preloadPromise = preloadImages();

      tl = gsap.timeline({
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

      // Wait for images before proceeding
      await preloadPromise;

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

      // SVG Morphing transition — 3 layers morphing from organic blobs to flat
      // Layer 1 — top curtain morphs
      tl.fromTo(
        morphPath1.current,
        { attr: { d: "M0,0 L1440,0 L1440,900 C1080,700 720,1000 360,800 C180,700 0,900 0,900 Z" } },
        {
          attr: { d: "M0,0 L1440,0 L1440,0 C1080,0 720,0 360,0 C180,0 0,0 0,0 Z" },
          duration: 1.2,
          ease: "power4.inOut",
        },
        2.6
      );

      // Layer 2 — mid morph
      tl.fromTo(
        morphPath2.current,
        { attr: { d: "M0,1080 L1440,1080 L1440,200 C1200,400 960,100 720,300 C480,500 240,200 0,200 Z" } },
        {
          attr: { d: "M0,1080 L1440,1080 L1440,1080 C1200,1080 960,1080 720,1080 C480,1080 240,1080 0,1080 Z" },
          duration: 1.2,
          ease: "power4.inOut",
        },
        2.6
      );

      // Layer 3 — center dissolve morph
      tl.fromTo(
        morphPath3.current,
        { attr: { d: "M0,400 C240,200 480,600 720,350 C960,100 1200,500 1440,400 L1440,680 C1200,880 960,480 720,730 C480,980 240,580 0,680 Z" } },
        {
          attr: { d: "M0,540 C240,540 480,540 720,540 C960,540 1200,540 1440,540 L1440,540 C1200,540 960,540 720,540 C480,540 240,540 0,540 Z" },
          duration: 1,
          ease: "power4.inOut",
        },
        2.7
      );

      // Fade out the SVG overlay
      tl.to(svgOverlayRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
      }, 3.6);
    };

    run();

    return () => {
      if (tl) tl.kill();
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

      {/* SVG Morphing overlay — replaces plain curtains */}
      <div ref={svgOverlayRef} className="absolute inset-0 z-[2]">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1440 1080"
          preserveAspectRatio="none"
        >
          {/* Top curtain morph */}
          <path
            ref={morphPath1}
            d="M0,0 L1440,0 L1440,900 C1080,700 720,1000 360,800 C180,700 0,900 0,900 Z"
            fill="hsl(0 0% 2%)"
          />
          {/* Bottom curtain morph */}
          <path
            ref={morphPath2}
            d="M0,1080 L1440,1080 L1440,200 C1200,400 960,100 720,300 C480,500 240,200 0,200 Z"
            fill="hsl(0 0% 2%)"
          />
          {/* Center blob morph */}
          <path
            ref={morphPath3}
            d="M0,400 C240,200 480,600 720,350 C960,100 1200,500 1440,400 L1440,680 C1200,880 960,480 720,730 C480,980 240,580 0,680 Z"
            fill="hsl(0 0% 3%)"
          />
        </svg>
      </div>
    </div>
  );
};

export default IntroLoader;
