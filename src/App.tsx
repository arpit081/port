import { useEffect } from 'react';
import Lenis from 'lenis';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import RoadSoFarSection from '@/components/RoadSoFarSection';
import SkillsSection from '@/components/SkillsSection';
import ProjectsSection from '@/components/ProjectsSection';
import ServicesSection from '@/components/ServicesSection';
import ContactSection from '@/components/ContactSection';
import RevealFooter from '@/components/RevealFooter';
import Cursor from '@/components/Cursor';
import { MusicPlayerProvider } from '@/context/MusicPlayerContext';

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);
  return (
    <MusicPlayerProvider>
      <main className="grain min-h-screen overflow-x-clip bg-[#0C0C0C]">
        <Navbar />
        <HeroSection />
        <AboutSection />
        <RoadSoFarSection />
        <SkillsSection />
        <ProjectsSection />
        <ServicesSection />
        <ContactSection />
        <RevealFooter />
        <Cursor />
      </main>
    </MusicPlayerProvider>
  );
}

export default App;
