import { useMagnetic } from '@/lib/useMagnetic';
import RollText from './RollText';

type LiveProjectButtonProps = {
  href: string;
  /** Project name, so screen readers hear where the link goes */
  label: string;
  className?: string;
};

/** Opens the project's repo in a new tab; styled exactly like the old button */
export default function LiveProjectButton({
  href,
  label,
  className = '',
}: LiveProjectButtonProps) {
  const magnet = useMagnetic<HTMLAnchorElement>();
  return (
    <a
      ref={magnet}
      data-cursor-snap
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View ${label} on GitHub (opens in a new tab)`}
      className={`magnetic inline-block text-center rounded-full border-2 border-[#D7E2EA] px-8 py-3 text-sm font-medium uppercase tracking-widest text-[#D7E2EA] transition-colors hover:bg-[#D7E2EA]/10 sm:px-10 sm:py-3.5 sm:text-base ${className}`}
    >
      <RollText>View Project</RollText>
    </a>
  );
}
