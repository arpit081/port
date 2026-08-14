import { useRef, useState, type ReactNode } from 'react';

type MagnetProps = {
  children: ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
};

export default function Magnet({
  children,
  padding = 100,
  strength = 2,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.6s ease-in-out',
  className,
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('translate3d(0, 0, 0)');
  const [transition, setTransition] = useState(inactiveTransition);

  const handleMouseMove = (e: React.MouseEvent) => {
    // Disable magnet on touch screens to avoid janky gesture interactions
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;

    const isInside =
      e.clientX > rect.left - padding &&
      e.clientX < rect.right + padding &&
      e.clientY > rect.top - padding &&
      e.clientY < rect.bottom + padding;

    if (isInside) {
      setTransition(activeTransition);
      setTransform(`translate3d(${distX / strength}px, ${distY / strength}px, 0)`);
    } else {
      setTransition(inactiveTransition);
      setTransform('translate3d(0, 0, 0)');
    }
  };

  const handleMouseLeave = () => {
    setTransition(inactiveTransition);
    setTransform('translate3d(0, 0, 0)');
  };

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition,
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
}
