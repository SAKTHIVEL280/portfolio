import { useState, useCallback, useRef, useEffect } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import IntroLoader from "@/components/IntroLoader";
import HeroSection from "@/components/sections/HeroSection";
import ManifestoSection from "@/components/sections/ManifestoSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import PhilosophySection from "@/components/sections/PhilosophySection";
import SkillsSection from "@/components/sections/SkillsSection";
import FooterSection from "@/components/sections/FooterSection";
import ThemeToggle from "@/components/ThemeToggle";
import gsap from "gsap";
import { Helmet } from "react-helmet-async";

const Index = () => {
  const [introComplete, setIntroComplete] = useState(() => {
    // Check if seen in this session
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("intro_seen") === "true";
    }
    return false;
  });
  const mainRef = useRef<HTMLDivElement>(null);

  // Global mount logic
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
    }
    return () => {
    };
  }, []);
  // Handle scroll lock during intro
  useEffect(() => {
    if (!introComplete) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [introComplete]);

  // Handle hash scroll if intro was already complete
  useEffect(() => {
    if (introComplete && window.location.hash) {
      const id = window.location.hash.slice(1);
      const element = document.getElementById(id);
      if (element) {
        // Small timeout to ensure everything (SmoothScroll/Lenis) is initialized
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
          // Clean URL after scroll
          window.history.replaceState(null, "", window.location.pathname);
        }, 100);
      }
    }
  }, [introComplete]);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
    sessionStorage.setItem("intro_seen", "true");
    // Animate site content in
    if (mainRef.current) {
      gsap.fromTo(
        mainRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out", onComplete: () => {
          // Handle hash navigation after content is in
          if (window.location.hash) {
            const id = window.location.hash.slice(1);
            const element = document.getElementById(id);
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
              // Clean URL after scroll
              window.history.replaceState(null, "", window.location.pathname);
            }
          }
        } }
      );
    }
  }, []);

  return (
    <SmoothScroll>
      <Helmet>
        <title>Sakthivel | AI-Native Engineer</title>
        <meta
          name="description"
          content="Sakthivel's portfolio - AI-native engineering, product delivery, and software systems built for real-world use."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://sakthivel.daeq.in/" />
        <meta property="og:title" content="Sakthivel | AI-Native Engineer" />
        <meta
          property="og:description"
          content="I design and ship complex software by collapsing ideas directly into production."
        />
        <meta property="og:url" content="https://sakthivel.daeq.in/" />
      </Helmet>
      {!introComplete && <IntroLoader onComplete={handleIntroComplete} />}
      <ThemeToggle />
      <main ref={mainRef} style={{ opacity: introComplete ? undefined : 0 }}>
        <HeroSection />
        <ManifestoSection />
        <ProjectsSection />
        <PhilosophySection />
        <SkillsSection />
        <FooterSection />
      </main>
    </SmoothScroll>
  );
};

export default Index;

