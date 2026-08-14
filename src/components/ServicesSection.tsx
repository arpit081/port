import FadeIn from './FadeIn';

const services = [
  ['01', 'MUSIC', 'Songs, artists and sounds that somehow became part of my everyday life.'],
  ['02', 'GAMING', 'Competitive games, open worlds and the occasional obsession that takes way too many hours.'],
  ['03', 'ANIME', 'Stories, characters and worlds that I keep coming back to.'],
  ['04', 'TECHNOLOGY', "New tools, weird experiments and anything that makes me think, 'wait... can I build that?'"],
  ['05', 'BUILDING THINGS', "Side projects, experiments and random ideas that somehow become actual projects."],
];

export default function ServicesSection() {
  return (
    <section
      id="interests"
      className="rounded-t-[32px] xs:rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] bg-white px-4 py-14 xs:px-6 xs:py-20 sm:px-8 sm:py-24 md:px-10 md:py-32"
    >
      <FadeIn
        y={40}
        as="h2"
        className="mb-10 text-center font-black uppercase leading-none tracking-tight text-[#0C0C0C] xs:mb-14 sm:mb-20 md:mb-28"
        style={{ fontSize: 'clamp(2.4rem, 9.5vw, 150px)' }}
      >
        OUTSIDE THE CODE
      </FadeIn>
      <div className="mx-auto max-w-5xl">
        {services.map(([number, name, description], index) => (
          <FadeIn key={number} delay={index * 0.1} y={30}>
            <article className="flex gap-3 border-t border-[rgba(12,12,12,0.15)] py-6 xs:gap-5 xs:py-8 sm:gap-8 sm:py-10 md:gap-12 md:py-12">
              <div
                className="shrink-0 font-black leading-none text-[#0C0C0C]"
                style={{ fontSize: 'clamp(2.2rem, 7.5vw, 130px)' }}
              >
                {number}
              </div>
              <div className="pt-1 sm:pt-3">
                <h3
                  className="font-medium uppercase text-[#0C0C0C]"
                  style={{ fontSize: 'clamp(1rem, 2vw, 2rem)' }}
                >
                  {name}
                </h3>
                <p
                  className="mt-1.5 max-w-2xl font-light leading-relaxed text-[#0C0C0C]/60 xs:mt-2"
                  style={{ fontSize: 'clamp(0.82rem, 1.4vw, 1.2rem)' }}
                >
                  {description}
                </p>
              </div>
            </article>
          </FadeIn>
        ))}
        <div className="border-t border-[rgba(12,12,12,0.15)]" />
      </div>
    </section>
  );
}
