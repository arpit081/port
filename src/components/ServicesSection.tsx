import FadeIn from './FadeIn';

const services = [
  ['01', 'MUSIC', 'Songs, artists and sounds that have somehow become part of my everyday life.'],
  ['02', 'GAMING', 'Competitive games, open worlds and the occasional obsession that takes way too many hours.'],
  ['03', 'ANIME', 'Stories, characters and worlds that I keep coming back to.'],
  ['04', 'TECHNOLOGY', "AI, weird experiments, new tools and anything that makes me think, 'wait... can I build that?'"],
  ['05', 'BUILDING THINGS', "Side projects, experiments and random ideas that start as 'this would be cool' and somehow become actual projects."],
];

export default function ServicesSection() {
  return (
    <section id="interests" className="rounded-t-[40px] bg-white px-5 py-20 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32">
      <FadeIn
        y={40}
        as="h2"
        className="mb-16 text-center font-black uppercase leading-none tracking-tight text-[#0C0C0C] sm:mb-20 md:mb-28"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        Interests
      </FadeIn>
      <div className="mx-auto max-w-5xl">
        {services.map(([number, name, description], index) => (
          <FadeIn key={number} delay={index * 0.1} y={30}>
            <article className="flex gap-5 border-t border-[rgba(12,12,12,0.15)] py-8 sm:gap-8 sm:py-10 md:gap-12 md:py-12">
              <div className="shrink-0 font-black leading-none text-[#0C0C0C]" style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}>{number}</div>
              <div className="pt-1 sm:pt-3">
                <h3 className="font-medium uppercase text-[#0C0C0C]" style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}>{name}</h3>
                <p className="mt-2 max-w-2xl font-light leading-relaxed text-[#0C0C0C]/60" style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}>{description}</p>
              </div>
            </article>
          </FadeIn>
        ))}
        <div className="border-t border-[rgba(12,12,12,0.15)]" />
      </div>
    </section>
  );
}
