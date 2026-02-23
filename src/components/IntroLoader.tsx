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

const STRIP_COUNT = 6;

const IntroLoader = ({ onComplete }: { onComplete: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const stripsRef = useRef<HTMLDivElement>(null);

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

      // Phase 1: Content entrance
      tl.fromTo(
        nameRef.current,
        { opacity: 0, y: 40, letterSpacing: "0.3em" },
        { opacity: 1, y: 0, letterSpacing: "0.05em", duration: 1, ease: "power3.out" },
        0.4
      );

      tl.fromTo(
        lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1, ease: "power2.inOut", transformOrigin: "center" },
        0.8
      );

      tl.fromTo(
        taglineRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
        1.2
      );

      // Counter 000 → 100
      tl.to(
        { val: 0 },
        {
          val: 100,
          duration: 2,
          ease: "power2.inOut",
          onUpdate: function () {
            if (counterRef.current) {
              counterRef.current.textContent = String(
                Math.floor(this.targets()[0].val)
              ).padStart(3, "0");
            }
          },
        },
        0.5
      );

      await preloadPromise;

      // Phase 2: Content fades out
      tl.to(
        [nameRef.current, lineRef.current, taglineRef.current, counterRef.current],
        {
          opacity: 0,
          y: -30,
          duration: 0.5,
          stagger: 0.05,
          ease: "power3.in",
        },
        2.7
      );

      // Phase 3: Horizontal strips peel away from center outward
      const strips = stripsRef.current?.querySelectorAll<HTMLDivElement>(".strip");
      if (strips && strips.length > 0) {
        const half = Math.floor(strips.length / 2);
        strips.forEach((strip, i) => {
          const distFromCenter = Math.abs(i - half + 0.5);
          const delay = distFromCenter * 0.08;
          const direction = i < half ? -1 : 1;

          tl.to(
            strip,
            {
              yPercent: direction * 110,
              duration: 0.7,
              ease: "power4.inOut",
            },
            3.3 + delay
          );
        });
      }
    };

    run();
    return () => { if (tl) tl.kill(); };
  }, []);

  // Generate horizontal strips
  const strips = [];
  for (let i = 0; i < STRIP_COUNT; i++) {
    strips.push(
      <div
        key={i}
        className="strip absolute left-0 w-full"
        style={{
          top: `${(i / STRIP_COUNT) * 100}%`,
          height: `${100 / STRIP_COUNT + 1}%`,
          background: "hsl(0 0% 96%)",
        }}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100]"
      style={{ pointerEvents: "none" }}
    >
      {/* Strips layer — behind content, peels away last */}
      <div ref={stripsRef} className="absolute inset-0 z-[1]">
        {strips}
      </div>

      {/* Content layer — on top */}
      <div
        ref={contentRef}
        className="absolute inset-0 z-[2] flex flex-col items-center justify-center"
      >
        <span
          ref={nameRef}
          className="text-5xl md:text-8xl font-bold tracking-tight"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            color: "hsl(0 0% 8%)",
            opacity: 0,
          }}
        >
          LUQMAN
        </span>

        <div
          ref={lineRef}
          className="my-6 h-[2px] w-32 md:w-56"
          style={{
            background: "hsl(0 0% 8%)",
            transform: "scaleX(0)",
          }}
        />

        <div ref={taglineRef} style={{ opacity: 0 }}>
          <span
            className="text-[10px] md:text-xs tracking-[0.5em] uppercase"
            style={{
              color: "hsl(0 0% 40%)",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Systems · Design · Engineering
          </span>
        </div>

        <span
          ref={counterRef}
          className="absolute bottom-8 right-8 text-sm md:text-base tabular-nums font-mono"
          style={{ color: "hsl(0 0% 55%)", opacity: 1 }}
        >
          000
        </span>
      </div>
    </div>
  );
};

export default IntroLoader;
