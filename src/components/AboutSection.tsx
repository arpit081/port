import FadeIn from './FadeIn';
import AnimatedText from './AnimatedText';


const aboutText =
  "I'm Arpit — I like taking random ideas and seeing how far I can take them.\n\nMost of what I build sits somewhere around AI, software and backend systems. I like figuring out how things work, trying things that probably shouldn't work, and occasionally ending up with something surprisingly useful.\n\nI tend to go down very specific rabbit holes. Sometimes they turn into projects. Sometimes they just leave me with a new thing to obsess over.";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative flex min-h-[90dvh] flex-col items-center justify-center overflow-hidden px-4 py-16 xs:px-6 xs:py-20 sm:px-8 sm:py-28 md:px-10"
    >
      {/* Top Left Moon Sticker */}
      <FadeIn
        delay={0.1}
        x={-60}
        y={0}
        duration={0.9}
        className="pointer-events-none absolute left-[1%] top-[3%] opacity-40 xs:opacity-60 sm:left-[2%] sm:opacity-90 md:left-[4%] lg:opacity-100"
      >
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png"
          alt=""
          className="w-[48px] select-none xs:w-[70px] sm:w-[110px] md:w-[150px] lg:w-[190px] xl:w-[220px]"
          draggable={false}
        />
      </FadeIn>

      {/* Bottom Left Sticker */}
      <FadeIn
        delay={0.25}
        x={-60}
        y={0}
        duration={0.9}
        className="pointer-events-none absolute bottom-[4%] left-[2%] opacity-40 xs:opacity-60 sm:bottom-[8%] sm:left-[5%] sm:opacity-90 md:left-[8%] lg:opacity-100"
      >
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png"
          alt=""
          className="w-[42px] select-none xs:w-[60px] sm:w-[95px] md:w-[130px] lg:w-[160px] xl:w-[190px]"
          draggable={false}
        />
      </FadeIn>

      {/* Top Right Lego Sticker */}
      <FadeIn
        delay={0.15}
        x={60}
        y={0}
        duration={0.9}
        className="pointer-events-none absolute right-[1%] top-[3%] opacity-40 xs:opacity-60 sm:right-[2%] sm:opacity-90 md:right-[4%] lg:opacity-100"
      >
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png"
          alt=""
          className="w-[48px] select-none xs:w-[70px] sm:w-[110px] md:w-[150px] lg:w-[190px] xl:w-[220px]"
          draggable={false}
        />
      </FadeIn>

      {/* Bottom Right Sticker */}
      <FadeIn
        delay={0.3}
        x={60}
        y={0}
        duration={0.9}
        className="pointer-events-none absolute bottom-[4%] right-[2%] opacity-40 xs:opacity-60 sm:bottom-[8%] sm:right-[5%] sm:opacity-90 md:right-[8%] lg:opacity-100"
      >
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png"
          alt=""
          className="w-[52px] select-none xs:w-[75px] sm:w-[120px] md:w-[160px] lg:w-[200px] xl:w-[230px]"
          draggable={false}
        />
      </FadeIn>

      <div className="relative z-10 flex flex-col items-center gap-8 xs:gap-10 sm:gap-14 md:gap-16">
        <FadeIn
          delay={0}
          y={40}
          as="h2"
          className="hero-heading text-center font-black uppercase leading-none tracking-tight"
          style={{ fontSize: 'clamp(2.4rem, 9.5vw, 150px)' }}
        >
          SO, WHO AM I?
        </FadeIn>

        <AnimatedText
          className="max-w-[600px] px-2 text-center font-medium leading-relaxed text-[#D7E2EA]"
          style={{ fontSize: 'clamp(0.92rem, 1.7vw, 1.35rem)' }}
        >
          {aboutText}
        </AnimatedText>
      </div>
    </section>
  );
}
