import { useState } from 'react';
import FadeIn from './FadeIn';
import ContactForm from './contact/ContactForm';
import { RESUME_FILENAME, RESUME_URL, smoothScrollTo } from '@/lib/utils';

type Contact = {
  label: string;
  value: string;
  href: string;
  external?: boolean;
  /** Text to copy, for details people usually paste somewhere */
  copy?: string;
  /** Filename to save as: adds a Download button next to the row */
  download?: string;
};

const CONTACTS: Contact[] = [
  { label: 'Email', value: 'arpitmishra1805@gmail.com', href: 'mailto:arpitmishra1805@gmail.com', copy: 'arpitmishra1805@gmail.com' },
  { label: 'Phone', value: '+91 99332 78740', href: 'tel:+919933278740', copy: '+919933278740' },
  { label: 'WhatsApp', value: 'Same number, faster replies', href: 'https://wa.me/919933278740', external: true },
  { label: 'LinkedIn', value: 'in/arpit-mishra', href: 'https://www.linkedin.com/in/arpit-mishra-9b2b5b279/', external: true },
  { label: 'GitHub', value: '@arpit081', href: 'https://github.com/arpit081', external: true },
  { label: 'Resume', value: 'One page, PDF', href: RESUME_URL, external: true, download: RESUME_FILENAME },
];

const HEADING = 'SAY HELLO';
const BADGE_TEXT = 'OPEN TO WORK ✦ OPEN TO IDEAS ✦ OPEN TO CHAI ✦ ';

function ContactRow({ contact, index }: { contact: Contact; index: number }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!contact.copy) return;
    try {
      await navigator.clipboard.writeText(contact.copy);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard blocked: the link itself still works
    }
  };

  return (
    <li className="hello-row">
      <a
        className="hello-row-link"
        href={contact.href}
        {...(contact.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        <span className="hello-row-num">{String(index + 1).padStart(2, '0')}</span>
        <span className="hello-row-text">
          <span className="hello-row-label">{contact.label}</span>
          <span className="hello-row-value">{contact.value}</span>
        </span>
        <span className="hello-row-arrow" aria-hidden="true">↗</span>
      </a>
      {contact.copy && (
        <button
          type="button"
          className={`hello-copy ${copied ? 'is-copied' : ''}`}
          onClick={copy}
          aria-label={`Copy ${contact.label.toLowerCase()}`}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      )}
      {contact.download && (
        <a className="hello-copy" href={contact.href} download={contact.download} aria-label={`Download ${contact.label.toLowerCase()} (PDF)`}>
          Download
        </a>
      )}
    </li>
  );
}

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="hello-section relative z-10 -mt-10 rounded-t-[40px] bg-[#0C0C0C] px-5 pt-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:pt-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pt-32"
    >
      <div className="relative mx-auto max-w-6xl">
        <FadeIn y={40} as="div" className="mb-8 text-center sm:mb-10 md:mb-12">
          {/* Letters wave on hover; each carries its own gradient so transforms keep it */}
          <h2 className="hello-heading" aria-label="Say hello" style={{ fontSize: 'clamp(3rem, 13vw, 170px)' }}>
            {HEADING.split('').map((ch, i) => (
              <span key={i} className="hello-letter hero-heading" style={{ '--i': i } as React.CSSProperties} aria-hidden="true">
                {ch === ' ' ? ' ' : ch}
              </span>
            ))}
          </h2>
        </FadeIn>

        <FadeIn y={30} delay={0.2} className="mx-auto mb-16 max-w-2xl text-center sm:mb-20 md:mb-24">
          <p className="text-sm font-light leading-relaxed text-[#D7E2EA]/70 sm:text-base md:text-lg">
            Got an idea, a role, a bug that won’t die, or a song I should add to the player?
            My inbox is open, and I reply faster than my code compiles.
          </p>
        </FadeIn>

        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <FadeIn y={30} delay={0.1}>
            <ul className="hello-rows">
              {CONTACTS.map((c, i) => <ContactRow key={c.label} contact={c} index={i} />)}
            </ul>
          </FadeIn>

          <FadeIn y={30} delay={0.2} className="relative">
            {/* Sticker slapped on the card's corner: the one moving thing here,
                and its rotation runs on the compositor */}
            <div className="hello-badge" aria-hidden="true">
              <svg viewBox="0 0 120 120" className="hello-badge-ring">
                <defs>
                  <path id="hello-badge-path" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
                </defs>
                <text>
                  <textPath href="#hello-badge-path" textLength="289">{BADGE_TEXT}</textPath>
                </text>
              </svg>
              <span className="hello-badge-core">HI!</span>
            </div>
            <ContactForm />
          </FadeIn>
        </div>

        <footer className="hello-footer">
          <span>© {new Date().getFullYear()} Arpit Mishra</span>
          <span className="hello-footer-made">Made with chai, curiosity and a little liquid glass</span>
          <a
            href="#home"
            className="hello-top"
            onClick={(e) => {
              e.preventDefault();
              smoothScrollTo('home', 1200);
            }}
          >
            Back to top <span className="hello-top-arrow" aria-hidden="true">↑</span>
          </a>
        </footer>
      </div>
    </section>
  );
}
