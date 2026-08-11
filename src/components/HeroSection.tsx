import FadeIn from './FadeIn';
import Magnet from './Magnet';
import ContactButton from './ContactButton';

import mascotImg from '../assets/mascot.png';

const navLinks = ['About', 'Interests', 'Projects', 'Contact'];

export default function HeroSection() {
  return (
    <section
      className="flex h-screen flex-col"
      style={{ overflowX: 'clip' }}
    >
      <FadeIn delay={0} y={-20} as="nav" className="flex justify-between px-6 pt-6 md:px-10 md:pt-8">
        {navLinks.map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase()}`}
            className="text-sm font-medium uppercase tracking-wider text-[#D7E2EA] transition-opacity duration-200 hover:opacity-70 md:text-lg lg:text-[1.4rem]"
          >
            {link}
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

        <div className="flex items-end justify-between px-6 pb-7 sm:pb-8 md:px-10 md:pb-10">
          <FadeIn
            delay={0.35}
            y={20}
            as="div"
            className="max-w-[160px] sm:max-w-[220px] md:max-w-[260px]"
          >
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#D7E2EA] sm:text-sm">
              AI ENGINEER / BACKEND DEVELOPER
            </p>
            <p
              className="font-light uppercase leading-snug tracking-wide text-[#D7E2EA]"
              style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
            >
              AI ENGINEER DRIVEN BY BUILDING SYSTEMS THAT TURN DATA INTO INTELLIGENCE.
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
