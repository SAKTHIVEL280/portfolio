import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Magnetic from "../Magnetic";

gsap.registerPlugin(ScrollTrigger);

const FooterSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const emailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      if (emailRef.current) {
        gsap.fromTo(
          emailRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            delay: 0.2,
            ease: "power3.out",
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
      style={{ background: "hsl(0 0% 0%)" }}
    >
      {/* Curved white container */}
      <div
        ref={contentRef}
        className="relative rounded-t-[4rem] md:rounded-t-[5rem] min-h-screen flex flex-col justify-end px-8 md:px-16 pb-8 md:pb-16"
        style={{ background: "hsl(var(--section-light))", color: "hsl(0 0% 4%)" }}
      >
        <div className="flex-1 flex items-center">
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
                  className="text-xl md:text-3xl lg:text-4xl font-medium border-b-2 border-current pb-2 hover:opacity-60 transition-opacity duration-300"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  sakthivel.hsr06@gmail.com
                </a>
              </Magnetic>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex justify-between items-center pt-8 border-t" style={{ borderColor: "hsl(0 0% 80%)" }}>
          <span className="text-sm" style={{ fontFamily: "'Inter', sans-serif", color: "hsl(0 0% 40%)" }}>
            Sakthivel © 2026
          </span>
          <span className="text-sm" style={{ fontFamily: "'Inter', sans-serif", color: "hsl(0 0% 40%)" }}>
            Built with only AI — and intention.
          </span>
        </div>
      </div>
    </section>
  );
};

export default FooterSection;
