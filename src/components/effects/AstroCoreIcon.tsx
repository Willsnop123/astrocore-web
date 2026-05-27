import { useId } from 'react';

/**
 * AstroCore logo icon — bold "A" with an orbital ring.
 *
 * The ring passes BEHIND the A on the left side and
 * IN FRONT on the right side, giving a clean 3-D orbit effect.
 * Pure inline SVG — fully transparent background.
 */
interface Props {
  size?: number;
  className?: string;
}

export default function AstroCoreIcon({ size = 48, className = '' }: Props) {
  const raw = useId();
  const uid = raw.replace(/:/g, '');

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      className={className}
      aria-label="AstroCore"
    >
      <defs>
        {/* Clip left half  → ring drawn behind the A */}
        <clipPath id={`lh-${uid}`}>
          <rect x="0" y="0" width="51" height="100" />
        </clipPath>

        {/* Clip right half → ring drawn in front of the A */}
        <clipPath id={`rh-${uid}`}>
          <rect x="49" y="0" width="51" height="100" />
        </clipPath>

        {/* Subtle glow for the front arc */}
        <filter id={`gw-${uid}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.8" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Orbit ring — left arc (behind the A) ── */}
      <ellipse
        cx="50" cy="57"
        rx="45" ry="10"
        transform="rotate(-15, 50, 57)"
        stroke="white" strokeWidth="3.8" fill="none"
        clipPath={`url(#lh-${uid})`}
        opacity="0.55"
      />

      {/* ══ The A ══ — three filled white shapes */}

      {/* Left leg  */}
      <polygon points="50,10  15,88  30,88" fill="white" />

      {/* Right leg */}
      <polygon points="50,10  70,88  85,88" fill="white" />

      {/* Crossbar — spans both inner edges */}
      <rect x="28" y="51" width="44" height="13" fill="white" />

      {/* ── Orbit ring — right arc (in front of the A) ── */}
      <ellipse
        cx="50" cy="57"
        rx="45" ry="10"
        transform="rotate(-15, 50, 57)"
        stroke="white" strokeWidth="3.8" fill="none"
        clipPath={`url(#rh-${uid})`}
        filter={`url(#gw-${uid})`}
      />
    </svg>
  );
}
