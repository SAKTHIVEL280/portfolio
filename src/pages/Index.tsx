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

const Index = () => {
  const [introComplete, setIntroComplete] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
    // Animate site content in
    if (mainRef.current) {
      gsap.fromTo(
        mainRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
    }
  }, []);

  return (
    <SmoothScroll>
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
