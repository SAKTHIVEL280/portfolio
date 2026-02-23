import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import Magnetic from "../Magnetic";

gsap.registerPlugin(ScrollTrigger);

const FooterSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const emailRef = useRef<HTMLDivElement>(null);
  const morphPath1 = useRef<SVGPathElement>(null);
  const morphPath2 = useRef<SVGPathElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // SVG morphs — only trigger when actually scrolled into view
      if (morphPath1.current) {
        gsap.fromTo(
          morphPath1.current,
          { attr: { d: "M0,0 C480,200 960,-100 1440,80 L1440,300 L0,300 Z" } },
          {
            attr: { d: "M0,280 C480,290 960,285 1440,288 L1440,300 L0,300 Z" },
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "top 40%",
              scrub: 0.6,
            },
          }
        );
      }
      if (morphPath2.current) {
        gsap.fromTo(
          morphPath2.current,
          { attr: { d: "M0,60 C360,180 720,-60 1080,120 C1260,200 1380,40 1440,100 L1440,300 L0,300 Z" } },
          {
            attr: { d: "M0,285 C360,290 720,282 1080,288 C1260,286 1380,290 1440,286 L1440,300 L0,300 Z" },
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "top 35%",
              scrub: 1,
            },
          }
        );
      }

      // Heading
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { y: 60, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1.2, ease: "power3.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Email
      if (emailRef.current) {
        gsap.fromTo(
          emailRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1, delay: 0.2, ease: "power3.out",
            scrollTrigger: {
              trigger: emailRef.current,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="footer"
      className="relative"
      style={{ background: "hsl(0 0% 100%)" }}
    >
      {/* SVG Morph transition */}
      <div className="relative w-full" style={{ marginTop: "-1px" }}>
        <svg
          viewBox="0 0 1440 300"
          className="w-full block"
          preserveAspectRatio="none"
          style={{ height: "clamp(120px, 20vw, 300px)" }}
        >
          <path
            ref={morphPath1}
            d="M0,0 C480,200 960,-100 1440,80 L1440,300 L0,300 Z"
            fill="hsl(0 0% 4%)"
          />
          <path
            ref={morphPath2}
            d="M0,60 C360,180 720,-60 1080,120 C1260,200 1380,40 1440,100 L1440,300 L0,300 Z"
            fill="hsl(0 0% 6%)"
          />
        </svg>
      </div>

      {/* Contact container with rounded top */}
      <div
        ref={contentRef}
        className="relative min-h-[80vh] flex flex-col justify-end px-8 md:px-16 pb-8 md:pb-16"
        style={{
          background: "hsl(0 0% 4%)",
          color: "hsl(0 0% 96%)",
          borderRadius: "48px 48px 0 0",
          marginTop: "-48px",
        }}
      >
        <div className="flex-1 flex items-center pt-16">
          <div>
            <h2
              ref={headingRef}
              className="text-4xl md:text-6xl lg:text-8xl font-bold leading-tight mb-12"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Ready to build
              <br />
              the future?
            </h2>
            <div ref={emailRef}>
              <Magnetic strength={30} className="inline-block">
                <a
                  href="mailto:sakthivel.hsr06@gmail.com"
                  className="group text-xl md:text-3xl lg:text-4xl font-medium border-b-2 border-current pb-2 hover:opacity-60 transition-opacity duration-300 inline-flex items-center gap-3"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  sakthivel.hsr06@gmail.com
                  <ArrowUpRight className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 transition-transform duration-300 group-hover:rotate-45" />
                </a>
              </Magnetic>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex justify-center items-center pt-8 border-t" style={{ borderColor: "hsl(0 0% 30%)" }}>
          <span
            className="text-lg md:text-xl tracking-wide"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(0 0% 95%)" }}
          >
            Built with only AI — and intention.
          </span>
        </div>
      </div>
    </section>
  );
};

export default FooterSection;
