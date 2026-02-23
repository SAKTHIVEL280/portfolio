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
  const nameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "smoothOut" } });

      tl.fromTo(introRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, 0.2);
      tl.fromTo(nameRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, 0.5);
      tl.fromTo(swapRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, 0.9);

      // SVG entrance
      if (svgRef.current) {
        tl.fromTo(svgRef.current, { opacity: 0, scale: 0.9 }, { opacity: 0.5, scale: 1, duration: 1.2, ease: "power3.out" }, 0.4);

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
        <div ref={nameRef} className="opacity-0" style={{ position: 'relative', height: '180px' }}>
          <TextPressure
            text="SAKTHIVEL"
            flex
            alpha={false}
            stroke={false}
            width
            weight
            italic
            textColor="#ededed"
            strokeColor="#555555"
            minFontSize={36}
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

      {/* Right Column - Hand SVG */}
      <div className="flex-1 flex items-center justify-center max-w-md md:max-w-lg">
        <svg
          ref={svgRef}
          viewBox="0 0 32 32"
          className="w-full h-auto opacity-0"
          fill="hsl(var(--hero-fg))"
          xmlns="http://www.w3.org/2000/svg"
          onMouseEnter={() => {
            if (svgRef.current) {
              gsap.fromTo(svgRef.current, { rotation: -2 }, { rotation: 3, duration: 0.6, ease: "elastic.out(1,0.4)" });
            }
          }}
        >
          <path d="M31 8.5c0 0-2.53 5.333-3.215 8.062-0.896 3.57 0.13 6.268-1.172 9.73-2.25 4.060-2.402 4.717-10.613 4.708-3.009-0.003-11.626-2.297-11.626-2.297-1.188-0.305-3.373-0.125-3.373-1.453s1.554-2.296 2.936-2.3l5.439 0.478c1.322-0.083 2.705-0.856 2.747-2.585-0.022-2.558-0.275-4.522-1.573-6.6l-5.042-7.867c-0.301-0.626-0.373-1.694 0.499-2.171s1.862 0.232 2.2 0.849l5.631 7.66c0.602 0.559 1.671 0.667 1.58-0.524l-2.487-11.401c-0.155-0.81 0.256-1.791 1.194-1.791 1.231 0 1.987 0.47 1.963 1.213l2.734 11.249c0.214 0.547 0.972 0.475 1.176-0.031l0.779-10.939c0.040-0.349 0.495-0.957 1.369-0.831s1.377 1.063 1.285 1.424l-0.253 10.809c0.177 0.958 0.93 1.098 1.517 0.563l3.827-6.843c0.232-0.574 1.143-0.693 1.67-0.466 0.491 0.32 0.81 0.748 0.81 1.351v0z" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
