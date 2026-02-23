import { useState, useCallback, useRef, useEffect } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import IntroLoader from "@/components/IntroLoader";
import HeroSection from "@/components/sections/HeroSection";
import ManifestoSection from "@/components/sections/ManifestoSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import PhilosophySection from "@/components/sections/PhilosophySection";
import SkillsSection from "@/components/sections/SkillsSection";
import FooterSection from "@/components/sections/FooterSection";
import gsap from "gsap";

const ScrollProgress = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (!barRef.current) return;
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = Math.min(scrollTop / docHeight, 1);
      barRef.current.style.transform = `scaleX(${pct})`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[50] h-[2px]" style={{ background: "hsl(0 0% 12%)" }}>
      <div
        ref={barRef}
        className="h-full origin-left"
        style={{ background: "hsl(0 0% 80%)", transform: "scaleX(0)", transition: "none" }}
      />
    </div>
  );
};

const Index = () => {
  const [introComplete, setIntroComplete] = useState(false);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  return (
    <SmoothScroll>
      <IntroLoader onComplete={handleIntroComplete} />
      <ScrollProgress />
      <main>
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
