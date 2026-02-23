import { useRef, useEffect } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import TextPressure from "../TextPressure";

gsap.registerPlugin(CustomEase);
CustomEase.create("smoothOut", "M0,0 C0.25,1 0.5,1 1,1");

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const swapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "smoothOut" } });

      // Staggered entrance
      tl.fromTo(introRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, 0.2);
      tl.fromTo(nameRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, 0.5);
      tl.fromTo(swapRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, 0.9);

      // SVG stroke draw
      const path = pathRef.current;
      if (path) {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        tl.to(path, { strokeDashoffset: 0, duration: 2, ease: "power3.inOut" }, 0.3);

        // Subtle wave rotation
        gsap.to(svgRef.current, {
          rotation: 3,
          yoyo: true,
          repeat: -1,
          duration: 4,
          ease: "sine.inOut",
          transformOrigin: "bottom center",
        });
      }

      // Text swap loop
      const swapContainer = swapRef.current;
      if (swapContainer) {
        const lines = swapContainer.querySelectorAll(".swap-line");
        const swapTl = gsap.timeline({ repeat: -1, delay: 1.5 });
        swapTl.to(lines[0], { y: "-100%", opacity: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" }, "+=3");
        swapTl.to(lines[1], { y: "-100%", opacity: 1, duration: 0.6, ease: "elastic.out(1, 0.5)" }, "<");
        swapTl.to(lines[1], { y: "-200%", opacity: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" }, "+=3");
        swapTl.to(lines[0], { y: "0%", opacity: 1, duration: 0.6, ease: "elastic.out(1, 0.5)" }, "<");
        swapTl.set(lines[1], { y: "0%" });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="h-screen w-full flex flex-col md:flex-row items-center justify-between px-8 md:px-16 overflow-hidden"
      style={{ background: "hsl(var(--hero-bg))", color: "hsl(var(--hero-fg))" }}
    >
      {/* Left Column */}
      <div className="flex flex-col justify-center flex-1 gap-4 z-10">
        <p ref={introRef} className="text-lg md:text-xl tracking-wide opacity-0" style={{ fontFamily: "'Inter', sans-serif" }}>
          hello.! I'm
        </p>
        <div ref={nameRef} className="opacity-0">
          <TextPressure
            text="SAKTHIVEL"
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight leading-none cursor-default"
            minWeight={300}
            maxWeight={700}
          />
        </div>
        <div ref={swapRef} className="h-8 md:h-10 overflow-hidden relative opacity-0 mt-2">
          <div className="swap-line absolute inset-0 flex items-center">
            <span className="text-base md:text-lg tracking-widest uppercase text-muted-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              AI — Native Engineer
            </span>
          </div>
          <div className="swap-line absolute inset-0 flex items-center translate-y-full opacity-0">
            <span className="text-base md:text-lg tracking-wide text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
              I build professional products using AI
            </span>
          </div>
        </div>
      </div>

      {/* Right Column - SVG Hand */}
      <div className="flex-1 flex items-center justify-center max-w-md md:max-w-lg">
        <svg
          ref={svgRef}
          viewBox="0 0 400 500"
          className="w-full h-auto opacity-60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          onMouseEnter={() => {
            if (svgRef.current) {
              gsap.fromTo(svgRef.current, { rotation: -2 }, { rotation: 3, duration: 0.6, ease: "elastic.out(1,0.4)" });
            }
          }}
        >
          <path
            ref={pathRef}
            d="M200 480 C200 480 160 400 160 320 C160 280 140 260 140 220 C140 190 155 180 170 180 C185 180 195 195 195 210 L195 280 M195 210 C195 195 195 160 195 130 C195 105 210 95 225 95 C240 95 250 105 250 130 L250 270 M250 130 C250 110 250 80 260 60 C270 40 285 35 300 40 C315 45 315 65 310 90 L290 270 M310 90 C315 70 325 55 340 55 C355 55 365 70 360 95 C355 120 340 180 330 270 M160 320 C130 320 80 310 60 300 C40 290 30 270 50 260 C70 250 100 260 140 280"
            stroke="hsl(var(--hero-fg))"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Blueprint grid lines */}
          <line x1="0" y1="100" x2="400" y2="100" stroke="hsl(var(--muted-foreground))" strokeWidth="0.3" opacity="0.2" />
          <line x1="0" y1="200" x2="400" y2="200" stroke="hsl(var(--muted-foreground))" strokeWidth="0.3" opacity="0.2" />
          <line x1="0" y1="300" x2="400" y2="300" stroke="hsl(var(--muted-foreground))" strokeWidth="0.3" opacity="0.2" />
          <line x1="0" y1="400" x2="400" y2="400" stroke="hsl(var(--muted-foreground))" strokeWidth="0.3" opacity="0.2" />
          <line x1="100" y1="0" x2="100" y2="500" stroke="hsl(var(--muted-foreground))" strokeWidth="0.3" opacity="0.2" />
          <line x1="200" y1="0" x2="200" y2="500" stroke="hsl(var(--muted-foreground))" strokeWidth="0.3" opacity="0.2" />
          <line x1="300" y1="0" x2="300" y2="500" stroke="hsl(var(--muted-foreground))" strokeWidth="0.3" opacity="0.2" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
