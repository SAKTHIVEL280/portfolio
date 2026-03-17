import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import heroImg from "@/assets/hero.webp";

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const sectionRef   = useRef<HTMLElement>(null);
  const wrapperRef   = useRef<HTMLDivElement>(null);
  const nameRef      = useRef<HTMLHeadingElement>(null);
  const col1Ref      = useRef<HTMLDivElement>(null);
  const col2Ref      = useRef<HTMLDivElement>(null);
  const imgSlotRef   = useRef<HTMLDivElement>(null);
  const metaRef      = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem("intro_seen") === "true";
    const delay = alreadySeen ? 0.05 : 3.7;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay, defaults: { ease: "power4.out" } });

      // 1 — Name clips up from below (the classic editorial reveal)
      tl.fromTo(
        nameRef.current,
        { y: 90, opacity: 0, clipPath: "inset(100% 0 0 0)" },
        { y: 0, opacity: 1, clipPath: "inset(0% 0 0 0)", duration: 1.0 },
        0
      );

      // 2 — Left column wipes in
      tl.fromTo(
        col1Ref.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        0.55
      );

      // 3 — Right column fades in with delay
      tl.fromTo(
        col2Ref.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        0.70
      );

      // 4 — Image slot rises up
      tl.fromTo(
        imgSlotRef.current,
        { y: 50, opacity: 0, clipPath: "inset(100% 0 0 0)" },
        { y: 0, opacity: 1, clipPath: "inset(0% 0 0 0)", duration: 1.1, ease: "power3.out" },
        0.5
      );

      // 5 — Meta bar fades in last
      tl.fromTo(
        metaRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        1.0
      );

      // ── Scroll exit: scale + opacity ──────────────────────────
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "60% top",
        scrub: 0.4,
        onUpdate: (self) => {
          const p = self.progress;
          if (wrapperRef.current) {
            wrapperRef.current.style.opacity   = `${Math.max(0, 1 - p * 2.4)}`;
            wrapperRef.current.style.transform = `translateY(${p * -24}px)`;
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full min-h-screen overflow-hidden"
      style={{ background: "#0a0a0a" }}
    >
      {/* Hero background image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${heroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.18,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      {/* ── All content ── */}
      <div
        ref={wrapperRef}
        className="w-full h-full flex flex-col"
        style={{
          position: "relative",
          zIndex: 1,
          padding: "clamp(32px, 5vw, 72px) clamp(24px, 6vw, 96px)",
          willChange: "transform, opacity",
        }}
      >
        {/* ── Giant name ──────────────────────────────────────── */}
        <h1
          ref={nameRef}
          className="w-full font-bold leading-none tracking-tight"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(76px, 17.5vw, 260px)",
            color: "#f2f2f2",
            letterSpacing: "-0.04em",
            lineHeight: 0.92,
            clipPath: "inset(100% 0 0 0)",
            marginLeft: -57,
            marginBottom: "clamp(20px, 3vw, 48px)",
          }}
        >
          Sakthivel
        </h1>

        {/* ── Two-column text row ─────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-0" style={{ marginBottom: "clamp(24px, 3.5vw, 56px)" }}>
          {/* Left: bold statement */}
          <div ref={col1Ref} className="md:w-1/2" style={{ opacity: 0 }}>
            <div
              style={{
                display: "inline-flex",
                flexDirection: "column",
                alignItems: "flex-start",
                marginLeft: 30,
                gap: 6,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(16px, 2.2vw, 30px)",
                  color: "#f2f2f2",
                  fontWeight: 700,
                }}
              >
                Built for production.
              </span>
              <span
                style={{
                  display: "inline-block",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(16px, 2.2vw, 30px)",
                  color: "#f2f2f2",
                  fontWeight: 700,
                }}
              >
                Powered by AI.
              </span>
            </div>
          </div>

          {/* Right: description */}
          <div ref={col2Ref} className="md:w-1/2 md:flex md:justify-end" style={{ opacity: 0 }}>
            <p
              className="leading-relaxed"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "clamp(13px, 1.1vw, 16px)",
                color: "rgba(242,242,242,0.5)",
                maxWidth: 360,
              }}
            >
              I design and ship complex software by collapsing ideas
              directly into production, faster than traditional
              development allows. Every project starts as a question.
              The answer becomes the product.
            </p>
          </div>
        </div>

        {/* ── Image slot — rounded, full-width ────────────────── */}
        <div
          ref={imgSlotRef}
          className="w-full relative overflow-hidden"
          style={{
            borderRadius: "clamp(12px, 2vw, 24px)",
            aspectRatio: "16 / 7",
            background: "hsl(var(--foreground) / 0.06)",
            border: "1px solid hsl(var(--foreground) / 0.1)",
            clipPath: "inset(100% 0 0 0)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Placeholder content — user will replace with an image */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              opacity: 0.25,
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            {/* Camera icon */}
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "hsl(var(--foreground))" }}>
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "hsl(var(--foreground))",
              }}
            >
              Image coming soon
            </span>
          </div>
        </div>

        {/* ── Bottom meta bar ─────────────────────────────────── */}
        <div
          ref={metaRef}
          className="flex items-center justify-between mt-4 md:mt-6"
          style={{ opacity: 0 }}
        >
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 11,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "rgba(242,242,242,0.4)",
            }}
          >
            AI-Native Engineer ~ Builder · 2026
          </span>

          {/* Animated scroll indicator */}
          <div className="flex items-center gap-2.5">
            <div
              style={{
                width: 28,
                height: 1,
              background: "rgba(242,242,242,0.2)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: "hsl(var(--foreground) / 0.7)",
                  animation: "scanLine 2s ease-in-out infinite",
                }}
              />
            </div>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "rgba(242,242,242,0.4)",
              }}
            >
              Scroll
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scanLine {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%);  }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
