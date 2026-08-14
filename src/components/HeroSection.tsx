import FadeIn from './FadeIn';
import Magnet from './Magnet';
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
      className="relative flex h-[100dvh] min-h-[560px] max-h-[1400px] flex-col overflow-hidden"
    >
      <FadeIn
        delay={0}
        y={-20}
        as="nav"
        className="flex items-center justify-between gap-1.5 px-4 pt-4 xs:gap-2 xs:px-6 xs:pt-6 sm:px-8 md:px-10 md:pt-8"
      >
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={(e) => handleScroll(e, link.href)}
            className="group shrink-0 text-[9px] font-medium uppercase tracking-wider text-[#D7E2EA] xs:text-[11px] sm:text-xs md:text-sm lg:text-base xl:text-[1.25rem] 2xl:text-[1.35rem]"
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

      <div className="relative flex flex-1 flex-col justify-between overflow-hidden">
        <div className="flex flex-1 items-center justify-center overflow-hidden px-2 pt-2 sm:pt-0">
          <FadeIn
            delay={0.15}
            y={40}
            as="h1"
            className="hero-heading w-full select-none whitespace-nowrap text-center text-[13vw] font-black uppercase leading-none tracking-tight xs:text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw]"
          >
            Hi, i&apos;m arpit
          </FadeIn>
        </div>

        {/* Mascot: centered in upper-middle on mobile, pinned to bottom on desktop */}
        <div className="absolute left-1/2 top-[46%] z-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none sm:top-auto sm:bottom-0 sm:translate-y-0 sm:pointer-events-auto">
          <FadeIn delay={0.6} y={30}>
            <Magnet
              padding={120}
              strength={3}
              activeTransition="transform 0.3s ease-out"
              inactiveTransition="transform 0.6s ease-in-out"
            >
              <img
                src={mascotImg}
                alt="Arpit portrait"
                className="w-[180px] xs:w-[220px] sm:w-[350px] md:w-[420px] lg:w-[490px] xl:w-[540px] 2xl:w-[580px] max-h-[38dvh] xs:max-h-[44dvh] sm:max-h-[60dvh] select-none object-contain pointer-events-auto"
                draggable={false}
              />
            </Magnet>
          </FadeIn>
        </div>

        {/* Floating music button — sits in bottom-right on mobile, left pocket on desktop */}
        <div className="music-btn-anchor">
          <MusicPlayer />
        </div>

        <div className="relative z-20 flex w-full items-end justify-between px-4 pb-5 xs:px-6 xs:pb-6 sm:px-8 sm:pb-8 md:px-10 md:pb-10 pointer-events-none">
          <FadeIn
            delay={0.35}
            y={20}
            as="div"
            className="w-full text-center sm:text-left sm:w-auto sm:max-w-[320px] md:max-w-[380px] lg:max-w-[420px] pointer-events-auto"
          >
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#D7E2EA] xs:mb-1.5 xs:text-xs sm:text-sm">
              AI ENGINEER / BACKEND DEVELOPER
            </p>
            <p
              className="mx-auto max-w-[320px] font-light uppercase leading-snug tracking-wide text-[#D7E2EA] sm:mx-0 sm:max-w-none"
              style={{ fontSize: 'clamp(0.72rem, 1.25vw, 1.35rem)' }}
            >
              I BUILD AI SYSTEMS, BREAK THINGS, FIX THEM, AND THEN BUILD SOMETHING ELSE.
            </p>
            <p className="mx-auto mt-1.5 max-w-[300px] text-[10px] font-light text-[#D7E2EA]/70 xs:mt-2 xs:text-xs sm:mx-0 sm:max-w-none sm:text-sm">
              Mostly interested in the space where AI, software and good ideas collide.
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
