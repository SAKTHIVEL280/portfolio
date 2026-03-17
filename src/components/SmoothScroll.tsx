import { useEffect, type ReactNode } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SmoothScroll = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.07,
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const lenisTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(lenisTick);
    gsap.ticker.lagSmoothing(0);

    // Allow Navigation component to trigger smooth scroll via custom event
    const handleScrollTo = (e: Event) => {
      const id = (e as CustomEvent<{ id: string }>).detail?.id;
      if (!id) return;
      const el = document.getElementById(id);
      if (el) lenis.scrollTo(el, { offset: 0, duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    };
    // Allow any page to force instant scroll to top
    const handleScrollTop = () => {
      lenis.scrollTo(0, { immediate: true });
    };
    window.addEventListener("lenis-scroll-to", handleScrollTo);
    window.addEventListener("lenis-scroll-top", handleScrollTop);

    return () => {
      window.removeEventListener("lenis-scroll-to", handleScrollTo);
      window.removeEventListener("lenis-scroll-top", handleScrollTop);
      lenis.destroy();
      gsap.ticker.remove(lenisTick);
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScroll;
