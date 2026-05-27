/**
 * AstroCore logo icon — Double-outlined A with a 4-pointed sparkle.
 * Recreated from the user's Inkscape sketch.
 */
interface Props {
  size?: number;
  className?: string;
}

export default function AstroCoreIcon({ size = 48, className = '' }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width={size}
      height={size}
      fill="none"
      className={className}
      aria-label="AstroCore"
    >
      {/* Outer A contour */}
      <path
        d="M 100 18 L 196 182 L 156 182 L 120 122 L 80 122 L 44 182 L 4 182 Z"
        stroke="white"
        strokeWidth="5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Inner A contour */}
      <path
        d="M 100 38 L 170 162 L 142 162 L 116 118 L 84 118 L 58 162 L 30 162 Z"
        stroke="white"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity={0.72}
      />
      {/* 4-pointed sparkle star — centered at (100, 87) inside the A */}
      <path
        d="M 100 50
           C 100 78, 109 86, 118 87
           C 109 88, 100 96, 100 124
           C 100 96, 91 88, 82 87
           C 91 86, 100 78, 100 50
           Z"
        fill="white"
      />
    </svg>
  );
}
