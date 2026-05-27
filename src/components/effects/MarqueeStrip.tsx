import React from 'react';

interface MarqueeStripProps {
  items?: string[];
  speed?: number;
  reverse?: boolean;
  dim?: boolean;
}

const DEFAULT_ITEMS = [
  'DISEÑO WEB', 'DESARROLLO', 'SEO', 'E-COMMERCE',
  'UI/UX', 'PERFORMANCE', 'LANZAMIENTO', 'OPTIMIZACION',
];

/**
 * Infinite horizontal marquee strip — premium agency separator between sections.
 * Two identical tracks side by side; animates translateX 0 → -50% for seamless loop.
 */
export default function MarqueeStrip({
  items = DEFAULT_ITEMS,
  speed = 28,
  reverse = false,
  dim = false,
}: MarqueeStripProps) {
  // Repeat items enough to fill any screen width
  const track = Array(6).fill(items).flat() as string[];

  return (
    <>
      <style>{`
        @keyframes marq     { from { transform: translateX(0);    } to { transform: translateX(-50%); } }
        @keyframes marq-rev { from { transform: translateX(-50%); } to { transform: translateX(0);    } }
      `}</style>

      <div
        aria-hidden="true"
        className="relative overflow-hidden select-none"
        style={{
          borderTop:    '1px solid rgba(108,99,255,0.13)',
          borderBottom: '1px solid rgba(108,99,255,0.13)',
          padding: '13px 0',
          background: 'rgba(108,99,255,0.025)',
        }}
      >
        <div
          style={{
            display: 'flex',
            width: 'max-content',
            animation: `${reverse ? 'marq-rev' : 'marq'} ${speed}s linear infinite`,
          }}
        >
          {/* Two identical copies — when first copy slides out, second copy is perfectly aligned */}
          {[0, 1].map(copy => (
            <span key={copy} className="inline-flex items-center">
              {track.map((item, i) => (
                <React.Fragment key={`${copy}-${i}`}>
                  <span
                    className="font-display font-semibold uppercase"
                    style={{
                      fontSize: '10px',
                      letterSpacing: '0.3em',
                      padding: '0 20px',
                      color: dim
                        ? 'rgba(160,168,255,0.22)'
                        : 'rgba(160,168,255,0.48)',
                    }}
                  >
                    {item}
                  </span>
                  <span
                    style={{
                      color: dim ? 'rgba(108,99,255,0.25)' : 'rgba(108,99,255,0.55)',
                      fontSize: '7px',
                      lineHeight: 1,
                    }}
                  >
                    ◆
                  </span>
                </React.Fragment>
              ))}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
