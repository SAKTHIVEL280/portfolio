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
  const digitRefs = useRef<HTMLDivElement[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const curtainTopRef = useRef<HTMLDivElement>(null);
  const curtainBottomRef = useRef<HTMLDivElement>(null);
  const currentValue = useRef(0);

  useEffect(() => {
    let tl: gsap.core.Timeline;

    const run = async () => {
      const preloadPromise = preloadImages();

      // Each digit column has numbers 0-9 stacked vertically
      // We'll animate translateY to "scroll" to the right digit
      const digitHeight = 100; // vh units conceptually, but we use pixel calc

      tl = gsap.timeline({
        onComplete: () => {
          if (containerRef.current) containerRef.current.style.display = "none";
          onComplete();
        },
      });

      // Fade in the dot and digits
      tl.fromTo(
        dotRef.current,
        { scale: 0 },
        { scale: 1, duration: 0.6, ease: "back.out(2)" },
        0.2
      );

      tl.fromTo(
        digitRefs.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power3.out" },
        0.3
      );

      tl.fromTo(
        percentRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: "power2.out" },
        0.6
      );

      // Animate counter 0 → 100 by rolling digit columns
      tl.to(
        { val: 0 },
        {
          val: 100,
          duration: 2.4,
          ease: "power2.inOut",
          onUpdate: function () {
            const v = Math.floor(this.targets()[0].val);
            if (v === currentValue.current) return;
            currentValue.current = v;

            const str = String(v).padStart(3, "0");
            digitRefs.current.forEach((col, i) => {
              if (!col) return;
              const digit = parseInt(str[i]);
              const inner = col.querySelector(".digit-inner") as HTMLElement;
              if (inner) {
                gsap.to(inner, {
                  yPercent: -digit * 10,
                  duration: 0.35,
                  ease: "power2.out",
                  overwrite: true,
                });
              }
            });
          },
        },
        0.8
      );

      // Progress ring around the dot
      tl.fromTo(
        progressRef.current,
        { strokeDashoffset: 126 },
        { strokeDashoffset: 0, duration: 2.4, ease: "power2.inOut" },
        0.8
      );

      await preloadPromise;

      // Exit: scale up digits and fade
      tl.to(
        [dotRef.current, ...digitRefs.current, percentRef.current],
        {
          scale: 1.5,
          opacity: 0,
          duration: 0.5,
          stagger: 0.03,
          ease: "power3.in",
        },
        3.4
      );

      // Split curtain — top half slides up, bottom slides down
      tl.to(
        curtainTopRef.current,
        { yPercent: -100, duration: 0.9, ease: "power4.inOut" },
        3.7
      );
      tl.to(
        curtainBottomRef.current,
        { yPercent: 100, duration: 0.9, ease: "power4.inOut" },
        3.7
      );
    };

    run();
    return () => { if (tl) tl.kill(); };
  }, []);

  const digits = Array.from({ length: 10 }, (_, i) => i);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100]"
      style={{ pointerEvents: "none" }}
    >
      {/* Split curtains */}
      <div
        ref={curtainTopRef}
        className="absolute top-0 left-0 w-full h-1/2 z-[1]"
        style={{ background: "hsl(0 0% 96%)" }}
      />
      <div
        ref={curtainBottomRef}
        className="absolute bottom-0 left-0 w-full h-1/2 z-[1]"
        style={{ background: "hsl(0 0% 96%)" }}
      />

      {/* Center content */}
      <div className="absolute inset-0 z-[2] flex items-center justify-center">
        {/* Pulsing dot with progress ring */}
        <div
          ref={dotRef}
          className="absolute"
          style={{ transform: "scale(0)" }}
        >
          <svg width="48" height="48" viewBox="0 0 48 48" className="absolute -top-24 left-1/2 -translate-x-1/2">
            <circle
              cx="24" cy="24" r="20"
              fill="none"
              stroke="hsl(0 0% 80%)"
              strokeWidth="1"
            />
            <circle
              ref={progressRef as any}
              cx="24" cy="24" r="20"
              fill="none"
              stroke="hsl(0 0% 15%)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="126"
              strokeDashoffset="126"
              style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
            />
            <circle cx="24" cy="24" r="3" fill="hsl(0 0% 15%)" />
          </svg>
        </div>

        {/* Rolling digit counter */}
        <div className="flex items-center gap-[2px]">
          {[0, 1, 2].map((colIdx) => (
            <div
              key={colIdx}
              ref={(el) => { if (el) digitRefs.current[colIdx] = el; }}
              className="overflow-hidden"
              style={{
                height: "clamp(60px, 12vw, 120px)",
                width: "clamp(36px, 7vw, 72px)",
                opacity: 0,
              }}
            >
              <div
                className="digit-inner"
                style={{ willChange: "transform" }}
              >
                {digits.map((d) => (
                  <div
                    key={d}
                    className="flex items-center justify-center font-bold"
                    style={{
                      height: "clamp(60px, 12vw, 120px)",
                      fontSize: "clamp(48px, 10vw, 100px)",
                      fontFamily: "'Space Grotesk', sans-serif",
                      color: "hsl(0 0% 8%)",
                      lineHeight: 1,
                    }}
                  >
                    {d}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Percent sign */}
          <span
            ref={percentRef}
            className="self-start mt-2 md:mt-3"
            style={{
              fontSize: "clamp(14px, 3vw, 24px)",
              fontFamily: "'Space Grotesk', sans-serif",
              color: "hsl(0 0% 40%)",
              opacity: 0,
            }}
          >
            %
          </span>
        </div>
      </div>
    </div>
  );
};

export default IntroLoader;
