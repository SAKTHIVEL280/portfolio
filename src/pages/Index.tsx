import { useState, useCallback } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import Navigation from "@/components/Navigation";
import IntroLoader from "@/components/IntroLoader";
import HeroSection from "@/components/sections/HeroSection";
import ManifestoSection from "@/components/sections/ManifestoSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import PhilosophySection from "@/components/sections/PhilosophySection";
import SkillsSection from "@/components/sections/SkillsSection";
import FooterSection from "@/components/sections/FooterSection";

const Index = () => {
  const [introComplete, setIntroComplete] = useState(false);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  return (
    <SmoothScroll>
      <IntroLoader onComplete={handleIntroComplete} />
      <Navigation />
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
