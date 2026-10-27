import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Cog, Hand, Menu, X } from 'lucide-react';
import { useLiquidGlass } from './LiquidGlass';
import GlassSlider from './GlassSlider';
import { supportsLiquidGlass, useGlassFocus } from '@/lib/glass';
import { smoothScrollTo } from '@/lib/utils';
import { useDismiss } from '@/lib/useDismiss';

type NavQuirk = 'who' | 'road' | 'skills' | 'made' | 'outside' | 'hello';

// hoverLabel (optional) swaps in on hover, e.g. { label: 'X', hoverLabel: 'Y' }
// quirk (optional) plays a little glyph over the label on hover (top bar only)
const navLinks: { label: string; href: string; hoverLabel?: string; quirk?: NavQuirk }[] = [
  { label: 'WHO AM I', href: '#about', quirk: 'who' },
  { label: 'ROAD SO FAR', href: '#road-so-far', quirk: 'road' },
  { label: 'SKILLS', href: '#skills', quirk: 'skills' },
  { label: 'THINGS I MADE', href: '#projects', quirk: 'made' },
  { label: 'OUTSIDE THE CODE', href: '#interests', quirk: 'outside' },
  { label: 'SAY HELLO', href: '#contact', quirk: 'hello' },
];

/**
 * The glyph each top-bar link plays on hover while its label steps aside.
 * Pure CSS keyframes (see "Navbar link quirks" in index.css); it floats over
 * the label, so the bar's layout never moves.
 */
function NavGlyph({ quirk }: { quirk: NavQuirk }) {
  return (
    <span className={`nav-glyph ng-${quirk}`} aria-hidden="true">
      {quirk === 'who' && <span className="ng-q">?</span>}
      {quirk === 'road' && (
        <span className="ng-road">
          <span className="ng-road-line" />
          <span className="ng-road-car" />
        </span>
      )}
      {quirk === 'skills' && (
        <>
          <span className="ng-brace ng-brace-l">{'{'}</span>
          <span className="ng-brace ng-brace-r">{'}'}</span>
        </>
      )}
      {quirk === 'made' && (
        <>
          <Cog className="ng-gear ng-gear-a" strokeWidth={2.2} />
          <Cog className="ng-gear ng-gear-b" strokeWidth={2.4} />
        </>
      )}
      {quirk === 'outside' && (
        <>
          <span className="ng-note ng-note-1">♪</span>
          <span className="ng-note ng-note-2">♫</span>
          <span className="ng-note ng-note-3">♪</span>
        </>
      )}
      {quirk === 'hello' && <Hand className="ng-hand" strokeWidth={2.2} />}
    </span>
  );
}

export default function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  // Lenses stay hidden until each panel's entrance animation has settled
  const [dotSettled, setDotSettled] = useState(false);
  const [menuSettled, setMenuSettled] = useState(false);
  const dotGlass = useLiquidGlass({ bezel: 14, strength: 12, hidden: !dotSettled, liveWhileScrolling: true });
  const menuGlass = useLiquidGlass({ bezel: 26, strength: 30, hidden: !menuSettled });
  useGlassFocus(isOpen);
  // Click anywhere outside the open menu to close it, like the music card
  const rootRef = useRef<HTMLDivElement | null>(null);
  useDismiss(isScrolled && isOpen, rootRef, () => setIsOpen(false));

  // Escape closes the open menu
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  // Check scroll position to transform navbar
  useMotionValueEvent(scrollY, "change", (latest) => {
    // When user scrolls past 100px, transition to dot
    const shouldBeScrolled = latest > 100;
    if (shouldBeScrolled !== isScrolled) {
      setIsScrolled(shouldBeScrolled);
      if (!shouldBeScrolled) setIsOpen(false); // Close dropdown if we scroll back to top
    }
  });

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    // Close dropdown after clicking
    if (smoothScrollTo(href.replace('#', ''))) setIsOpen(false);
  };

  return (
    <>
      {/* 
        Fixed container for the top-left dot/dropdown.
        We keep it separate in the DOM structure but visually it acts as the transformation target.
        Actually, to make it fluid with Framer Motion, we can use layoutId.
      */}
      
      <div ref={rootRef} data-nav-root className="fixed top-0 left-0 w-full z-50 pointer-events-none">
        <AnimatePresence>
          {!isScrolled ? (
            // ORIGINAL HORIZONTAL NAVBAR
            <motion.nav
              key="horizontal-nav"
              initial={{ y: -20, opacity: 0, scale: 1 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap justify-center gap-x-4 gap-y-2 px-4 pt-6 md:justify-between md:gap-0 md:px-10 md:pt-8 pointer-events-auto"
            >
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleScroll(e, link.href)}
                  className={`group text-xs sm:text-sm font-medium uppercase tracking-wider text-[#D7E2EA] md:text-lg lg:text-[1.4rem] ${link.quirk && !link.hoverLabel ? `nav-quirk nq-${link.quirk}` : ''}`}
                >
                  <span className={`relative inline-block transition-transform duration-300 ease-out origin-center ${link.quirk && !link.hoverLabel ? '' : 'group-hover:scale-[1.07]'}`}>
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
                    ) : link.quirk ? (
                      <>
                        <span className="nav-label">{link.label}</span>
                        <NavGlyph quirk={link.quirk} />
                      </>
                    ) : (
                      <span className="transition-opacity duration-300 group-hover:opacity-70">
                        {link.label}
                      </span>
                    )}
                  </span>
                </a>
              ))}
            </motion.nav>
          ) : (
            // SCROLLED FLOATING DOT / DROPDOWN
            <motion.div
              key="floating-nav"
              className="absolute top-6 left-6 md:top-8 md:left-10 pointer-events-auto"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <AnimatePresence>
                {!isOpen && (
                  <motion.button
                    key="dot"
                    ref={dotGlass.ref}
                    onClick={() => setIsOpen(true)}
                    className="nav-shell lg-rim absolute top-0 left-0 w-12 h-12 flex items-center justify-center rounded-full text-white/70 hover:text-white transition-colors z-20"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    style={{ transformOrigin: 'top left' }}
                    onAnimationStart={() => setDotSettled(false)}
                    onAnimationComplete={() => setDotSettled(true)}
                    aria-label="Open navigation"
                  >
                    {dotGlass.lens}
                    <span className="nav-glass" aria-hidden="true" />
                    <span className="relative flex">
                      <Menu size={20} />
                    </span>
                  </motion.button>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    key="dropdown"
                    ref={menuGlass.ref}
                    className="nav-shell lg-rim absolute top-0 left-0 w-[280px] overflow-hidden rounded-[24px] z-10"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    style={{ transformOrigin: 'top left' }}
                    onAnimationStart={() => setMenuSettled(false)}
                    onAnimationComplete={() => setMenuSettled(true)}
                  >
                    {menuGlass.lens}
                    <div className="nav-glass" aria-hidden="true" />
                    <div className="relative">
                    {/* Header Row for Button */}
                    <div className="w-12 h-12 flex items-center justify-center">
                      <button
                        onClick={() => setIsOpen(false)}
                        className="w-12 h-12 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                        aria-label="Close navigation"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <nav className="pb-6 px-6 pt-2 flex flex-col gap-4">
                      {navLinks.map((link) => (
                        <a
                          key={link.label}
                          href={link.href}
                          onClick={(e) => handleScroll(e, link.href)}
                          className="group text-sm font-medium uppercase tracking-wider text-[#D7E2EA]"
                        >
                          <span className="relative inline-block transition-transform duration-300 ease-out group-hover:translate-x-2 origin-left">
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
                              <span className="transition-opacity duration-300 group-hover:opacity-100">
                                {link.label}
                              </span>
                            )}
                          </span>
                        </a>
                      ))}
                    </nav>

                    {supportsLiquidGlass && (
                      <div className="border-t border-white/10 px-6 pt-4 pb-6">
                        <GlassSlider />
                      </div>
                    )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
