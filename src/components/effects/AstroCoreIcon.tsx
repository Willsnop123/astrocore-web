import { useId } from 'react';

/**
 * AstroCore logo icon — AC initials warped into an edge-on galactic disk.
 *
 * The A forms the upper arch of the disk with its apex as the galactic
 * nucleus/bulge. The C forms the lower arc, closing the disk shape.
 * Together they create a lens-shaped galaxy viewed from the side.
 *
 * Pure SVG — fully transparent, no background issues.
 */
interface Props {
  size?: number;
  className?: string;
}

export default function AstroCoreIcon({ size = 48, className = '' }: Props) {
  const raw = useId();
  const uid = raw.replace(/:/g, '');

  // Keep a natural 6:5 ratio (disk is wider than tall)
  const w = Math.round(size * 1.22);
  const h = size;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 61 50"
      width={w}
      height={h}
      fill="none"
      className={className}
      aria-label="AstroCore"
    >
      <defs>
        {/* Soft glow behind the nucleus */}
        <radialGradient id={`ng-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#a8a3ff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#6C63FF" stopOpacity="0"    />
        </radialGradient>

        {/* Ambient disk glow */}
        <radialGradient id={`dg-${uid}`} cx="50%" cy="52%" r="55%">
          <stop offset="0%"   stopColor="#6C63FF" stopOpacity="0.20" />
          <stop offset="100%" stopColor="#4A90FF" stopOpacity="0"    />
        </radialGradient>

        {/* Glow filter for the nucleus dot */}
        <filter id={`gf-${uid}`} x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Disk ambient glow ── */}
      <ellipse cx="30.5" cy="29" rx="30" ry="20" fill={`url(#dg-${uid})`} />

      {/* ══ THE A ══
          Apex = galactic nucleus/bulge (top-center).
          Left leg  → sweeps down-left  to the left  tip of the disk.
          Right leg → sweeps down-right to the right tip of the disk.
          Crossbar  → subtle dust-lane line across the equatorial plane.
      */}

      {/* A — left leg */}
      <path
        d="M 30.5 9 C 24 13, 12 21, 2 29"
        stroke="white"
        strokeWidth="2.1"
        strokeLinecap="round"
        opacity="0.92"
      />

      {/* A — right leg */}
      <path
        d="M 30.5 9 C 37 13, 49 21, 59 29"
        stroke="white"
        strokeWidth="2.1"
        strokeLinecap="round"
        opacity="0.92"
      />

      {/* A — crossbar (galactic dust lane, slightly faded) */}
      <path
        d="M 15 22.5 C 22 20.5, 39 20.5, 46 22.5"
        stroke="white"
        strokeWidth="1.15"
        strokeLinecap="round"
        opacity="0.38"
      />

      {/* ══ THE C ══
          The C wraps as the lower arc of the disk,
          from the left tip of the disk, curving down
          through the lowest point, back to the right tip.
          Its "opening" faces upward toward the A.
      */}
      <path
        d="M 2 29 C 10 43, 20 48, 30.5 48 C 41 48, 51 43, 59 29"
        stroke="white"
        strokeWidth="2.1"
        strokeLinecap="round"
        opacity="0.82"
      />

      {/* ── Nucleus soft halo ── */}
      <ellipse
        cx="30.5"
        cy="9"
        rx="9"
        ry="9"
        fill={`url(#ng-${uid})`}
      />

      {/* ── Galactic nucleus dot ── */}
      <circle
        cx="30.5"
        cy="9"
        r="2.4"
        fill="white"
        filter={`url(#gf-${uid})`}
      />
    </svg>
  );
}
