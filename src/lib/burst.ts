// Chai, milk and the site's own blue-grey
const COLORS = ['#d7e2ea', '#c8a27a', '#e9d8c4', '#8b5e3c', '#ffffff'];

/**
 * A one-off confetti burst from a screen point (the "message sent" moment).
 * Each bit is a transform/opacity animation (Web Animations, compositor),
 * and the whole layer removes itself when done. Skipped under reduced motion.
 */
export function burst(x: number, y: number, count = 30) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const layer = document.createElement('div');
  layer.className = 'burst-layer';
  layer.setAttribute('aria-hidden', 'true');
  document.body.append(layer);

  for (let i = 0; i < count; i++) {
    const bit = document.createElement('span');
    const size = 5 + Math.random() * 6;
    bit.className = 'burst-bit';
    bit.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size * (Math.random() < 0.5 ? 1 : 0.45)}px;background:${COLORS[i % COLORS.length]};border-radius:${Math.random() < 0.5 ? '50%' : '2px'}`;
    layer.append(bit);

    // Fly out on a random heading (biased upward), then fall a little
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.6;
    const dist = 80 + Math.random() * 150;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;
    const spin = (Math.random() - 0.5) * 540;
    bit.animate(
      [
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${spin / 2}deg) scale(1)`, opacity: 1, offset: 0.55 },
        { transform: `translate(calc(-50% + ${dx * 1.15}px), calc(-50% + ${dy + 70}px)) rotate(${spin}deg) scale(0.6)`, opacity: 0 },
      ],
      { duration: 1000 + Math.random() * 500, easing: 'cubic-bezier(0.15, 0.8, 0.3, 1)', fill: 'forwards' },
    );
  }

  window.setTimeout(() => layer.remove(), 1600);
}
