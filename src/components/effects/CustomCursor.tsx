import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Premium custom cursor inspired by high-end agency sites (fiddle.digital / string-tune).
 *
 * - Dot  (7 px)  : tracks the mouse exactly, white solid
 * - Ring (38 px) : lags behind with lerp physics, WHITE FILLED + mix-blend-mode:difference
 *                  → inverts colors beneath it — the "hole in text" effect
 *
 * On hover over interactive elements:
 *   - Ring expands to 60 px and stays filled
 *   - Dot scales to 0 (hidden)
 */
export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouse   = useRef({ x: -200, y: -200 });
  const ring    = useRef({ x: -200, y: -200 });

  useEffect(() => {
    // Touch devices: keep default cursor
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.documentElement.style.cursor = 'none';

    // --- Mouse tracking ---
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      gsap.set(dotRef.current, { x: e.clientX, y: e.clientY });
    };

    // --- Lerp ring loop ---
    let raf: number;
    const LERP = 0.10;
    const tick = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * LERP;
      ring.current.y += (mouse.current.y - ring.current.y) * LERP;
      gsap.set(ringRef.current, { x: ring.current.x, y: ring.current.y });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener('mousemove', onMove, { passive: true });

    // --- Hover states ---
    const onEnter = () => {
      gsap.to(ringRef.current,  { scale: 1.7, duration: 0.35, ease: 'power2.out' });
      gsap.to(dotRef.current,   { scale: 0,   duration: 0.2,  ease: 'power2.out' });
    };
    const onLeave = () => {
      gsap.to(ringRef.current,  { scale: 1,   duration: 0.4,  ease: 'elastic.out(1, 0.5)' });
      gsap.to(dotRef.current,   { scale: 1,   duration: 0.25, ease: 'power2.out' });
    };

    // Observe DOM mutations so new interactive elements are also registered
    const register = () => {
      document.querySelectorAll('a, button, [role="button"], input, select, textarea, label').forEach(el => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };
    register();

    const observer = new MutationObserver(register);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.documentElement.style.cursor = '';
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      observer.disconnect();
      document.querySelectorAll('a, button, [role="button"], input, select, textarea, label').forEach(el => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);

  return (
    <>
      {/* Inner dot — exact mouse position */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{
          width: 7, height: 7,
          background: 'white',
          transform: 'translate(-50%, -50%)',
          mixBlendMode: 'difference',
        }}
      />

      {/* Outer ring — lerp follow, FILLED white + mix-blend-mode:difference */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full"
        style={{
          width: 38, height: 38,
          background: 'white',
          transform: 'translate(-50%, -50%)',
          mixBlendMode: 'difference',
          opacity: 0.9,
        }}
      />
    </>
  );
}
