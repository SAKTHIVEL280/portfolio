import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import heroImg from "@/assets/hero.webp";

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const sectionRef      = useRef<HTMLElement>(null);
  const bgRef           = useRef<HTMLDivElement>(null);
  const contentRef      = useRef<HTMLDivElement>(null);
  const nameRef         = useRef<HTMLHeadingElement>(null);
  const taglineRef      = useRef<HTMLDivElement>(null);
  const descriptionRef  = useRef<HTMLParagraphElement>(null);
  const [viewportWidth, setViewportWidth] = useState(1440);

  const isMobile = viewportWidth <= 768;
  const isTablet = viewportWidth > 768 && viewportWidth <= 1200;
  const isWide = viewportWidth >= 1700;

  const leftTransform = isMobile
    ? "translate(-18px, -48px)"
    : isTablet
      ? "translate(-82px, -96px)"
      : isWide
        ? "translate(-165px, -162px)"
        : "translate(-140px, -140px)";

  const taglineLeftOffset = isMobile
    ? "0px"
    : isTablet
      ? "130px"
      : isWide
        ? "300px"
        : "250px";

  useEffect(() => {
    const updateViewport = () => setViewportWidth(window.innerWidth);
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem("intro_seen") === "true";
    const delay = alreadySeen ? 0.05 : 3.7;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay, defaults: { ease: "power4.out" } });

      // 1 — Background fade in
      tl.fromTo(
        bgRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.2 },
        0
      );

      // 2 — Name slides up with clip
      tl.fromTo(
        nameRef.current,
        { y: 80, opacity: 0, clipPath: "inset(100% 0 0 0)" },
        { y: 0, opacity: 1, clipPath: "inset(0% 0 0 0)", duration: 1.2 },
        0.2
      );

      // 3 — Tagline fades in
      tl.fromTo(
        taglineRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        0.6
      );

      // 4 — Description fades in
      tl.fromTo(
        descriptionRef.current,
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        0.85
      );

      // ── Scroll effect: Background fades out and parallax ────
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "60% top",
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress;
          if (bgRef.current) {
            bgRef.current.style.opacity = `${Math.max(0, 1 - p * 3.1)}`;
            bgRef.current.style.transform = `translateY(${p * 92}px)`;
          }
          if (contentRef.current) {
            contentRef.current.style.opacity = `${Math.max(0, 1 - p)}`;
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
      className="relative w-full min-h-screen overflow-hidden flex items-center justify-center"
      style={{ background: "#0a0a0a" }}
    >
      {/* Background image with fade animation */}
      <div
        ref={bgRef}
        data-testid="hero-bg"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${heroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: isMobile ? "scroll" : "fixed",
          opacity: 0,
          zIndex: 0,
          pointerEvents: "none",
          willChange: "opacity, transform",
        }}
      />

      {/* Overlay for text readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, rgba(10,10,10,0) 0%, rgba(10,10,10,0.4) 100%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "clamp(80px, 16vh, 180px)",
          background: "linear-gradient(to bottom, rgba(10,10,10,0) 0%, rgba(10,10,10,0.78) 72%, rgba(10,10,10,0.96) 100%)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "clamp(64px, 9vw, 92px)",
          right: "clamp(16px, 3vw, 34px)",
          zIndex: 13,
          fontFamily: "'Inter', sans-serif",
          fontSize: "clamp(11px, 0.95vw, 13px)",
          letterSpacing: "0.01em",
          color: "rgba(242, 242, 242, 0.68)",
          textAlign: "right",
          maxWidth: "min(72vw, 320px)",
          lineHeight: 1.35,
          pointerEvents: "none",
        }}
      >
        It’s not low image quality — I blurred it on purpose :)
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 w-full h-full flex items-center justify-center px-6"
        style={{
          willChange: "opacity",
          padding: "clamp(32px, 5vw, 72px) clamp(24px, 6vw, 96px)",
        }}
      >
        <div
          className="grid w-full max-w-[1400px] grid-cols-1 items-end gap-12 md:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] md:gap-16"
          style={{
            minHeight: isMobile ? "clamp(460px, 76vh, 760px)" : "clamp(420px, 72vh, 760px)",
          }}
        >
          <div
            data-testid="hero-left-block"
            className="flex flex-col items-start justify-center text-left"
            style={{
              transform: leftTransform,
            }}
          >
            <h1
              ref={nameRef}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: isMobile ? "clamp(72px, 20vw, 124px)" : "clamp(112px, 19vw, 300px)",
                color: "#d9d9d9",
                letterSpacing: "-0.07em",
                lineHeight: 0.86,
                fontWeight: 800,
                margin: 0,
                clipPath: "inset(100% 0 0 0)",
                marginBottom: isMobile ? "16px" : "clamp(20px, 2.4vw, 34px)",
              }}
            >
              Sakthivel
            </h1>

            <div
              ref={taglineRef}
              data-testid="hero-tagline"
              style={{
                display: "inline-flex",
                alignItems: "flex-start",
                marginLeft: taglineLeftOffset,
                opacity: 0,
                padding: isMobile ? "8px 12px" : "10px 16px",
                background: "#000000",
                borderRadius: "14px",
                border: "1px solid rgba(255, 255, 255, 0.14)",
              }}
            >
              <span
                style={{
                  display: "block",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: isMobile ? "clamp(16px, 4.3vw, 22px)" : "clamp(20px, 1.9vw, 30px)",
                  color: "#ffffff",
                  letterSpacing: "0.01em",
                  lineHeight: 1.2,
                  fontWeight: 500,
                  margin: 0,
                  padding: "0px",
                }}
              >
                I build products which
                <br />
                people can actually use
              </span>
            </div>
          </div>

          <div className="flex items-end justify-start md:justify-end">
            <p
              ref={descriptionRef}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: isMobile ? "clamp(13px, 3.3vw, 16px)" : "clamp(14px, 1.2vw, 17px)",
                color: "rgba(242, 242, 242, 0.76)",
                letterSpacing: "0.01em",
                lineHeight: isMobile ? 1.55 : 1.7,
                maxWidth: isMobile ? 340 : 420,
                margin: 0,
                opacity: 0,
                textAlign: "left",
              }}
            >
              I leverage AI to collapse ideas directly into production, bridging the gap between concept and reality with professional precision and speed.
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: "clamp(24px, 6vw, 96px)",
          right: "clamp(24px, 6vw, 96px)",
          bottom: isMobile ? "clamp(16px, 3vh, 28px)" : "clamp(28px, 5vh, 52px)",
          zIndex: 12,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "1px",
            background: "rgba(242, 242, 242, 0.22)",
            marginBottom: "14px",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: isMobile ? "column" : "row",
            alignContent: "stretch",
            gap: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "18px",
              flexWrap: "wrap",
            }}
          >
            <a
              href="https://x.com/SAKTHIVEL_E_"
              aria-label="Visit X profile"
              target="_blank"
              rel="noreferrer"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: isMobile ? "11px" : "12px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(242, 242, 242, 0.62)",
                textDecoration: "none",
              }}
            >
              X
            </a>
            <a
              href="https://www.linkedin.com/in/sakthivel-e-1924a0292/"
              aria-label="Visit LinkedIn profile"
              target="_blank"
              rel="noreferrer"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: isMobile ? "11px" : "12px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(242, 242, 242, 0.62)",
                textDecoration: "none",
              }}
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/SAKTHIVEL280"
              aria-label="Visit GitHub profile"
              target="_blank"
              rel="noreferrer"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: isMobile ? "11px" : "12px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(242, 242, 242, 0.62)",
                textDecoration: "none",
              }}
            >
              GitHub
            </a>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              alignSelf: isMobile ? "flex-end" : "auto",
            }}
          >
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "11px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(242, 242, 242, 0.5)",
              }}
            >
              Scroll
            </span>
            <div
              style={{
                width: "24px",
                height: "1px",
                background: "rgba(242, 242, 242, 0.5)",
              }}
            />
          </div>
        </div>
      </div>

    </section>
  );
};

export default HeroSection;
