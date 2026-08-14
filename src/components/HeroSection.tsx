import FadeIn from './FadeIn';
import Magnet from './Magnet';
import ContactButton from './ContactButton';
import MusicPlayer from './MusicPlayer';

import mascotImg from '../assets/mascot.png';

const navLinks = [
  { label: 'WHO AM I', href: '#about' },
  { label: 'ROAD SO FAR', hoverLabel: 'SKILLS', href: '#road-so-far' },
  { label: 'THINGS I MADE', href: '#projects' },
  { label: 'OUTSIDE THE CODE', href: '#interests' },
  { label: 'SAY HELLO', href: '#contact' },
];

export default function HeroSection() {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
      const startPosition = window.scrollY;
      const distance = targetPosition - startPosition;
      const duration = 800; // 800ms duration
      let start: number | null = null;

      // easeInOutCubic for a premium feel
      const easeInOutCubic = (t: number) => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };

      const step = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const percent = Math.min(progress / duration, 1);
        
        window.scrollTo(0, startPosition + distance * easeInOutCubic(percent));
        
        if (progress < duration) {
          window.requestAnimationFrame(step);
        }
      };

      window.requestAnimationFrame(step);
    }
  };

  return (
    <section
      className="flex h-screen flex-col"
      style={{ overflowX: 'clip' }}
    >
      <FadeIn delay={0} y={-20} as="nav" className="flex justify-between px-6 pt-6 md:px-10 md:pt-8">
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={(e) => handleScroll(e, link.href)}
            className="group text-xs sm:text-sm font-medium uppercase tracking-wider text-[#D7E2EA] md:text-lg lg:text-[1.4rem]"
          >
            <span className="relative inline-block transition-transform duration-300 ease-out group-hover:scale-[1.07] origin-center">
              {link.hoverLabel ? (
                <>
                  <span className="invisible whitespace-nowrap">
                    {link.label.length > link.hoverLabel.length ? link.label : link.hoverLabel}
                  </span>
                  <span className="absolute inset-0 flex items-center justify-start opacity-100 transition-all duration-300 ease-out group-hover:-translate-y-2 group-hover:opacity-0">
                    {link.label}
                  </span>
                  <span className="absolute inset-0 flex items-center justify-start translate-y-2 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 text-white">
                    {link.hoverLabel}
                  </span>
                </>
              ) : (
                <span className="transition-opacity duration-300 group-hover:opacity-70">
                  {link.label}
                </span>
              )}
            </span>
          </a>
        ))}
      </FadeIn>

      <div className="relative flex flex-1 flex-col">
        <div className="flex flex-1 items-center justify-center overflow-hidden">
          <FadeIn
            delay={0.15}
            y={40}
            as="h1"
            className="hero-heading w-full whitespace-nowrap text-center text-[14vw] font-black uppercase leading-none tracking-tight sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw]"
          >
            Hi, i&apos;m arpit
          </FadeIn>
        </div>

        <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 sm:bottom-0 sm:top-auto sm:translate-y-0">
          <FadeIn delay={0.6} y={30}>
            <Magnet
              padding={150}
              strength={3}
              activeTransition="transform 0.3s ease-out"
              inactiveTransition="transform 0.6s ease-in-out"
            >
              <img
                src={mascotImg}
                alt="Arpit portrait"
                className="w-[280px] select-none object-contain sm:w-[360px] md:w-[440px] lg:w-[520px]"
                draggable={false}
              />
            </Magnet>
          </FadeIn>
        </div>

        {/* Floating music button — sits in the empty pocket left of mascot */}
        <div className="music-btn-anchor">
          <MusicPlayer />
        </div>

        <div className="flex items-end justify-between px-6 pb-7 sm:pb-8 md:px-10 md:pb-10">
          <FadeIn
            delay={0.35}
            y={20}
            as="div"
            className="max-w-[240px] sm:max-w-[320px] md:max-w-[400px]"
          >
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#D7E2EA] sm:text-sm">
              AI ENGINEER / BACKEND DEVELOPER
            </p>
            <p
              className="font-light uppercase leading-snug tracking-wide text-[#D7E2EA]"
              style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
            >
              I BUILD AI SYSTEMS, BREAK THINGS, FIX THEM, AND THEN BUILD SOMETHING ELSE.
            </p>
            <p className="mt-3 text-xs font-light text-[#D7E2EA]/70 sm:text-sm">
              Mostly interested in the space where AI, software and good ideas collide.
            </p>
          </FadeIn>

          <FadeIn delay={0.5} y={20}>
            <ContactButton />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
