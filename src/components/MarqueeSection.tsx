import { useEffect, useRef, useState } from 'react';
import MusicCard from './MusicCard';

const marqueeImages = [
  'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
  'https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif',
  'https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif',
  'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
  'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif',
  'https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif',
  'https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif',
  'https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif',
  'https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif',
  'https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif',
  'https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif',
  'https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif',
  'https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif',
  'https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif',
  'https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif',
  'https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif',
  'https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif',
  'https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif',
  'https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif',
];

const row1Images = marqueeImages.slice(0, 11);
const row2Images = marqueeImages.slice(11);

const tileClass =
  'h-[270px] w-[420px] flex-shrink-0 rounded-2xl object-cover';

const musicTileClass = 'h-[270px] w-[420px] flex-shrink-0 rounded-2xl';
const MUSIC_TILE_INDEX = 0;

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);
  const [musicExpanded, setMusicExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const sectionTop = el.offsetTop;
      const scrollOffset =
        (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      setOffset(scrollOffset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const row1Transform = `translateX(${offset - 200}px)`;
  const row2Transform = `translateX(${-(offset - 200)}px)`;

  return (
    <section
      ref={sectionRef}
      className="bg-[#0C0C0C] pt-24 pb-10 sm:pt-32 md:pt-40"
    >
      <div className={`flex flex-col gap-3 mc-section-content${musicExpanded ? ' mc-blurred' : ''}`}>
        <div
          className="flex gap-3"
          style={{
            transform: row1Transform,
            willChange: 'transform',
          }}
        >
          {[...row1Images, ...row1Images, ...row1Images].map((src, i) => {
            if (i % row1Images.length === MUSIC_TILE_INDEX) {
              return (
                <MusicCard
                  key={`music-${i}`}
                  className={musicTileClass}
                  onExpandChange={setMusicExpanded}
                />
              );
            }
            return (
              <img key={i} src={src} alt="" loading="lazy" className={tileClass} />
            );
          })}
        </div>
        <div
          className="flex gap-3"
          style={{
            transform: row2Transform,
            willChange: 'transform',
          }}
        >
          {[...row2Images, ...row2Images, ...row2Images].map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              loading="lazy"
              className={tileClass}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
