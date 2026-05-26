import { useEffect, useRef, useState, Suspense, lazy } from 'react';
import { ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import Magnetic from '@/components/effects/Magnetic';

const GalaxyCenter = lazy(() => import('@/components/effects/GalaxyCenter'));

export default function Hero() {
  const titleRef          = useRef<HTMLHeadingElement>(null);
  const taglineRef        = useRef<HTMLDivElement>(null);
  const subtitleRef       = useRef<HTMLDivElement>(null);
  const ctaRef            = useRef<HTMLButtonElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const [subtitleText, setSubtitleText] = useState('');
  const subtitleFull = 'Tu negocio orbitando en el universo digital';

  // Title letters burst in
  useEffect(() => {
    const letters = titleRef.current?.querySelectorAll('.letter');
    if (!letters) return;
    gsap.set(letters, { opacity: 0, scale: 0, filter: 'blur(10px) brightness(3)' });
    gsap.to(letters, {
      opacity: 1, scale: 1, filter: 'blur(0px) brightness(1)',
      duration: 1.5, stagger: 0.08, ease: 'expo.out', delay: 0.8,
    });
  }, []);

  // Tagline fade
  useEffect(() => {
    if (!taglineRef.current) return;
    gsap.to(taglineRef.current, { opacity: 1, duration: 1, delay: 0.5, ease: 'power2.out' });
  }, []);

  // Subtitle typing
  useEffect(() => {
    const t = setTimeout(() => {
      let i = 0;
      const iv = setInterval(() => {
        if (i <= subtitleFull.length) { setSubtitleText(subtitleFull.slice(0, i)); i++; }
        else clearInterval(iv);
      }, 50);
      return () => clearInterval(iv);
    }, 2500);
    return () => clearTimeout(t);
  }, []);

  // Subtitle block fade
  useEffect(() => {
    if (!subtitleRef.current) return;
    gsap.to(subtitleRef.current, { opacity: 1, duration: 1, delay: 2.6, ease: 'power2.out' });
  }, []);

  // CTA button fade in from bottom
  useEffect(() => {
    if (!ctaRef.current) return;
    gsap.to(ctaRef.current, { opacity: 1, y: 0, duration: 0.8, delay: 4, ease: 'power3.out' });
  }, []);

  // Scroll indicator fade
  useEffect(() => {
    if (!scrollIndicatorRef.current) return;
    gsap.to(scrollIndicatorRef.current, { opacity: 1, duration: 1, delay: 5, ease: 'power2.out' });
  }, []);

  const scrollToServices = () =>
    document.querySelector('#servicios')?.scrollIntoView({ behavior: 'smooth' });

  const titleLetters = 'ASTROCORE'.split('');

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-between px-6 overflow-hidden py-0">

      {/* Galaxy 3D — full section background */}
      <Suspense fallback={null}>
        <GalaxyCenter />
      </Suspense>

      {/* Subtle top gradient so header text is readable */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: [
            'linear-gradient(to bottom, rgba(5,5,8,0.55) 0%, transparent 22%)',
            'radial-gradient(ellipse 70% 40% at 50% 58%, transparent 0%, rgba(5,5,8,0.25) 60%, rgba(5,5,8,0.60) 100%)',
          ].join(', '),
        }}
      />

      {/* ── TOP: tagline + title + subtitle ───────────────────────────────── */}
      <div className="relative z-10 text-center max-w-5xl mx-auto w-full pt-32">
        {/* Tagline */}
        <div ref={taglineRef} className="opacity-0 mb-6">
          <span className="text-xs md:text-sm tracking-[0.3em] text-space-text-secondary uppercase">
            Agencia de Diseño y Desarrollo Web
          </span>
        </div>

        {/* Main title */}
        <h1
          ref={titleRef}
          className="font-display font-bold text-space-text mb-4 whitespace-nowrap"
          style={{ perspective: '1000px', fontSize: 'clamp(2rem, 8.5vw, 7rem)', letterSpacing: 'clamp(0.04em, 0.5vw, 0.1em)' }}
        >
          {titleLetters.map((letter, i) => (
            <span key={i} className="letter inline-block" style={{ transformStyle: 'preserve-3d' }}>
              {letter}
            </span>
          ))}
        </h1>

        {/* Subtitle — typewriter, under the title */}
        <div ref={subtitleRef} className="opacity-0">
          <p
            className="text-lg md:text-2xl text-space-text font-light min-h-[1.8rem] tracking-wide"
            style={{ textShadow: '0 0 24px rgba(108,99,255,0.7), 0 2px 8px rgba(0,0,0,0.8)' }}
          >
            {subtitleText}
            <span className="animate-blink text-space-accent">_</span>
          </p>
        </div>
      </div>

      {/* ── GALAXY occupies the visual center — no content here ───────────── */}
      <div className="flex-1" />

      {/* ── BOTTOM: CTA button above scroll indicator ─────────────────────── */}
      <div className="relative z-10 flex flex-col items-center gap-10 pb-10">
        <Magnetic strength={0.32} radius={90}>
          <button
            ref={ctaRef}
            onClick={scrollToServices}
            className="opacity-0 translate-y-4 group flex items-center gap-3 px-8 py-4 border border-space-accent text-space-text hover:bg-space-accent/10 hover:shadow-glow transition-all duration-300 rounded-full"
          >
            <span className="text-sm tracking-wider">EXPLORAR SERVICIOS</span>
            <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
          </button>
        </Magnetic>

        {/* Scroll indicator */}
        <div ref={scrollIndicatorRef} className="opacity-0 flex flex-col items-center gap-3">
          <span className="text-[10px] tracking-[0.2em] text-space-text-muted uppercase">
            Scroll para explorar
          </span>
          <div className="w-px h-10 bg-space-text-muted animate-pulse-line" />
        </div>
      </div>

    </section>
  );
}
