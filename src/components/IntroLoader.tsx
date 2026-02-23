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

const COLS = 5;
const ROWS = 4;

const IntroLoader = ({ onComplete }: { onComplete: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let tl: gsap.core.Timeline;

    const run = async () => {
      const preloadPromise = preloadImages();

      const gridCells = gridRef.current?.querySelectorAll<HTMLDivElement>(".grid-cell");

      tl = gsap.timeline({
        onComplete: () => {
          if (containerRef.current) containerRef.current.style.display = "none";
          onComplete();
        },
      });

      // Phase 1: Name reveal with stagger
      tl.fromTo(
        nameRef.current,
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" },
        0.3
      );

      // Expanding line
      tl.fromTo(
        lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1.2, ease: "power2.inOut", transformOrigin: "center" },
        0.6
      );

      // Tagline
      tl.fromTo(
        taglineRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        1.0
      );

      // Counter 0 → 100
      tl.to(
        { val: 0 },
        {
          val: 100,
          duration: 2,
          ease: "power2.inOut",
          onUpdate: function () {
            if (counterRef.current) {
              counterRef.current.textContent = String(Math.floor(this.targets()[0].val)).padStart(3, "0");
            }
          },
        },
        0.4
      );

      await preloadPromise;

      // Phase 2: Fade out content
      tl.to(
        [nameRef.current, taglineRef.current, lineRef.current, counterRef.current],
        {
          opacity: 0,
          y: -30,
          duration: 0.5,
          stagger: 0.06,
          ease: "power3.in",
        },
        2.6
      );

      // Phase 3: Grid tile reveal — each cell slides away to reveal content beneath
      if (gridCells && gridCells.length > 0) {
        // Stagger from center outward
        const centerCol = (COLS - 1) / 2;
        const centerRow = (ROWS - 1) / 2;

        const sorted = Array.from(gridCells).sort((a, b) => {
          const aCol = parseInt(a.dataset.col || "0");
          const aRow = parseInt(a.dataset.row || "0");
          const bCol = parseInt(b.dataset.col || "0");
          const bRow = parseInt(b.dataset.row || "0");
          const aDist = Math.sqrt((aCol - centerCol) ** 2 + (aRow - centerRow) ** 2);
          const bDist = Math.sqrt((bCol - centerCol) ** 2 + (bRow - centerRow) ** 2);
          return aDist - bDist;
        });

        tl.to(
          sorted,
          {
            scaleY: 0,
            transformOrigin: "top",
            duration: 0.6,
            stagger: 0.04,
            ease: "power4.inOut",
          },
          3.2
        );
      }

      // Final: hide entire container
      tl.to(
        curtainRef.current,
        { opacity: 0, duration: 0.3, ease: "power2.out" },
        3.9
      );
    };

    run();
    return () => { if (tl) tl.kill(); };
  }, []);

  // Generate grid cells
  const gridCells = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      gridCells.push(
        <div
          key={`${row}-${col}`}
          className="grid-cell absolute"
          data-row={row}
          data-col={col}
          style={{
            left: `${(col / COLS) * 100}%`,
            top: `${(row / ROWS) * 100}%`,
            width: `${100 / COLS + 0.5}%`,
            height: `${100 / ROWS + 0.5}%`,
            background: "hsl(0 0% 96%)",
          }}
        />
      );
    }
  }

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100]" style={{ pointerEvents: "none" }}>
      <div ref={curtainRef} className="absolute inset-0">
        {/* Grid tiles layer */}
        <div ref={gridRef} className="absolute inset-0 z-[2]">
          {gridCells}
        </div>

        {/* Content layer */}
        <div
          className="absolute inset-0 z-[1] flex flex-col items-center justify-center"
          style={{ background: "hsl(0 0% 96%)" }}
        >
          {/* Name / Brand */}
          <div ref={nameRef} style={{ opacity: 0 }}>
            <span
              className="text-5xl md:text-8xl font-bold tracking-tight"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: "hsl(0 0% 8%)",
              }}
            >
              LUQMAN
            </span>
          </div>

          {/* Expanding line */}
          <div
            ref={lineRef}
            className="my-6 h-[2px] w-32 md:w-56"
            style={{
              background: "hsl(0 0% 8%)",
              transform: "scaleX(0)",
            }}
          />

          {/* Tagline */}
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

          {/* Counter — bottom right */}
          <span
            ref={counterRef}
            className="absolute bottom-8 right-8 text-sm md:text-base tabular-nums font-mono"
            style={{ color: "hsl(0 0% 55%)" }}
          >
            000
          </span>
        </div>
      </div>
    </div>
  );
};

export default IntroLoader;
