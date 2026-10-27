import FadeIn from './FadeIn';
import QuirkyText from './QuirkyText';
import AnimatedText from './AnimatedText';


const aboutText =
  "I'm Arpit — I like taking random ideas and seeing how far I can take them.\n\nMost of what I build sits somewhere around AI, software and backend systems. I like figuring out how things work, trying things that probably shouldn't work, and occasionally ending up with something surprisingly useful.\n\nI tend to go down very specific rabbit holes. Sometimes they turn into projects. Sometimes they just leave me with a new thing to obsess over.";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative flex min-h-screen flex-col items-center justify-center px-5 py-20 sm:px-8 md:px-10"
    >
      <FadeIn delay={0.1} x={-80} y={0} duration={0.9} className="absolute left-[2%] top-[4%] lg:left-[4%] hidden md:block z-0 pointer-events-none">
        <img
          src="/about/moon.webp"
          alt=""
          className="w-[12vw] max-w-[210px] select-none"
          draggable={false}
        />
      </FadeIn>

      <FadeIn delay={0.25} x={-80} y={0} duration={0.9} className="absolute bottom-[8%] left-[2%] lg:left-[8%] hidden md:block z-0 pointer-events-none">
        <img
          src="/about/sticker.webp"
          alt=""
          className="w-[10vw] max-w-[180px] select-none"
          draggable={false}
        />
      </FadeIn>

      <FadeIn delay={0.15} x={80} y={0} duration={0.9} className="absolute right-[2%] top-[4%] lg:right-[4%] hidden md:block z-0 pointer-events-none">
        <img
          src="/about/lego.webp"
          alt=""
          className="w-[12vw] max-w-[210px] select-none"
          draggable={false}
        />
      </FadeIn>

      <FadeIn delay={0.3} x={80} y={0} duration={0.9} className="absolute bottom-[8%] right-[2%] lg:right-[8%] hidden md:block z-0 pointer-events-none">
        <img
          src="/about/group.webp"
          alt=""
          className="w-[13vw] max-w-[220px] select-none"
          draggable={false}
        />
      </FadeIn>

      <div className="relative z-10 flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
        <FadeIn
          delay={0}
          y={40}
          as="h2"
          className="text-center font-black uppercase leading-none tracking-tight"
          style={{ fontSize: 'clamp(3rem, 9.5vw, 150px)' }}
        >
          <QuirkyText text="SO, WHO AM I?" variant="quirk-shrug" letterClassName="hero-heading" special="?" />
        </FadeIn>

        <AnimatedText
          className="max-w-[560px] text-center font-medium leading-relaxed text-[#D7E2EA]"
          style={{ fontSize: 'clamp(1rem, 1.8vw, 1.35rem)' }}
        >
          {aboutText}
        </AnimatedText>
      </div>

      <div className="mt-16 sm:mt-20 md:mt-24">
      </div>
    </section>
  );
}
