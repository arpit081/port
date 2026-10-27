/*
 * SF Symbols-style transport icons. Each shape is filled *and* stroked in the
 * same colour with round joins, which rounds off every corner the way Apple's
 * glyphs are — lucide's filled polygons come out razor-sharp.
 */

type IconProps = {
  size?: number;
  color?: string;
  className?: string;
};

function Glyph({ size = 24, color = 'currentColor', className, strokeWidth, children }: IconProps & { strokeWidth: number; children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

// Triangle's bounding box sits 1px right of centre so it reads optically centred
export function PlayIcon(props: IconProps) {
  return (
    <Glyph {...props} strokeWidth={2.6}>
      <polygon points="8,5 19,12 8,19" />
    </Glyph>
  );
}

export function PauseIcon(props: IconProps) {
  return (
    <Glyph {...props} strokeWidth={0}>
      <rect x="6" y="4.5" width="4.2" height="15" rx="1.6" />
      <rect x="13.8" y="4.5" width="4.2" height="15" rx="1.6" />
    </Glyph>
  );
}

export function ForwardIcon(props: IconProps) {
  return (
    <Glyph {...props} strokeWidth={2.2}>
      <polygon points="3.5,6.5 11,12 3.5,17.5" />
      <polygon points="13,6.5 20.5,12 13,17.5" />
    </Glyph>
  );
}

export function BackwardIcon(props: IconProps) {
  return (
    <Glyph {...props} strokeWidth={2.2}>
      <polygon points="20.5,6.5 13,12 20.5,17.5" />
      <polygon points="11,6.5 3.5,12 11,17.5" />
    </Glyph>
  );
}
