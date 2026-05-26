import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import gsap from 'gsap';
import { useInView } from '@/hooks/useInView';
import TypewriterText from '@/components/effects/TypewriterText';

const projects = [
  { title: 'Nebula Store',   tag: 'E-commerce',   description: 'Plataforma de venta online con catálogo de 500+ productos', image: '/portfolio/portfolio-1.jpg' },
  { title: 'Cosmo Tech',     tag: 'Sitio Web',     description: 'Presencia digital para empresa de soluciones cloud',        image: '/portfolio/portfolio-2.jpg' },
  { title: 'Lunar Clinic',   tag: 'Landing Page',  description: 'Página de conversión para clínica estética',               image: '/portfolio/portfolio-3.jpg' },
  { title: 'Galaxy Fitness', tag: 'Landing Page',  description: 'Diseño de alta conversión para cadena de gimnasios',       image: '/portfolio/portfolio-4.jpg' },
  { title: 'Starlight Cafe', tag: 'Sitio Web',     description: 'Experiencia digital inmersiva para restaurante temático',  image: '/portfolio/portfolio-5.jpg' },
  { title: 'Orbita Shop',    tag: 'E-commerce',    description: 'Tienda online con integración de pagos internacional',     image: '/portfolio/portfolio-6.jpg' },
];

const TAG_COLORS: Record<string, string> = {
  'E-commerce':  '#38E8B0',
  'Sitio Web':   '#6C63FF',
  'Landing Page':'#4A90FF',
};

function getRelIdx(i: number, active: number, total: number) {
  let d = i - active;
  if (d >  total / 2) d -= total;
  if (d < -total / 2) d += total;
  return d;
}

interface CardStyle { transform: string; opacity: number; zIndex: number; filter: string }
function cardStyle(rel: number): CardStyle {
  const map: Record<number, CardStyle> = {
     0: { transform: 'translateX(0%)    scale(1)    rotateY(0deg)',   opacity: 1,    zIndex: 10, filter: 'brightness(1)' },
     1: { transform: 'translateX(62%)   scale(0.80) rotateY(-22deg)', opacity: 0.65, zIndex: 6,  filter: 'brightness(0.7)' },
    '-1': { transform: 'translateX(-62%)  scale(0.80) rotateY(22deg)',  opacity: 0.65, zIndex: 6,  filter: 'brightness(0.7)' },
     2: { transform: 'translateX(105%)  scale(0.62) rotateY(-38deg)', opacity: 0.30, zIndex: 3,  filter: 'brightness(0.5)' },
    '-2': { transform: 'translateX(-105%) scale(0.62) rotateY(38deg)',  opacity: 0.30, zIndex: 3,  filter: 'brightness(0.5)' },
  };
  return map[rel] ?? { transform: 'translateX(0%)', opacity: 0, zIndex: 0, filter: 'brightness(0)' };
}

export default function Portfolio() {
  const { ref: sectionRef, isInView } = useInView({ threshold: 0.1 });
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const n = projects.length;

  const go = (dir: 1 | -1) => {
    setActive(a => (a + dir + n) % n);
    // Reset auto-advance
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => setActive(a => (a + 1) % n), 5000);
  };

  useEffect(() => {
    if (!isInView) return;
    autoRef.current = setInterval(() => setActive(a => (a + 1) % n), 5000);
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [isInView, n]);

  // Entry animation
  const wrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isInView || !wrapRef.current) return;
    gsap.fromTo(wrapRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' });
  }, [isInView]);

  return (
    <section id="portfolio" ref={sectionRef} className="relative min-h-[80vh] py-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold font-display tracking-wider text-space-text mb-6">
            <TypewriterText text="TRABAJOS RECIENTES" isInView={isInView} speed={45} />
          </h2>
          <p className={`text-space-text-secondary transition-all duration-700 delay-300 ${isInView ? 'opacity-100' : 'opacity-0'}`}>
            Misiones completadas con éxito
          </p>
        </div>

        {/* 3D Carousel */}
        <div ref={wrapRef} className="opacity-0">
          <div className="relative h-[420px] flex items-center justify-center" style={{ perspective: '1200px' }}>
            {projects.map((proj, i) => {
              const rel = getRelIdx(i, active, n);
              if (Math.abs(rel) > 2) return null;
              const s = cardStyle(rel);
              const isActive = rel === 0;
              const isHov = hovered === i && isActive;

              return (
                <div
                  key={proj.title}
                  onClick={() => !isActive && go(rel > 0 ? 1 : -1)}
                  onMouseEnter={() => isActive && setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className="absolute w-80 cursor-pointer"
                  style={{
                    transform: s.transform,
                    opacity: s.opacity,
                    zIndex: s.zIndex,
                    filter: s.filter,
                    transition: 'all 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  }}
                >
                  <div
                    className="relative rounded-2xl overflow-hidden border border-white/10 transition-all duration-300"
                    style={{
                      boxShadow: isActive
                        ? '0 0 40px rgba(108,99,255,0.25), 0 20px 60px rgba(0,0,0,0.5)'
                        : '0 10px 30px rgba(0,0,0,0.4)',
                      borderColor: isActive ? 'rgba(108,99,255,0.4)' : 'rgba(255,255,255,0.05)',
                    }}
                  >
                    {/* Image */}
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={proj.image} alt={proj.title} loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700"
                        style={{ transform: isHov ? 'scale(1.08)' : 'scale(1)' }}
                      />
                    </div>

                    {/* Overlay */}
                    <div
                      className="absolute inset-0 transition-all duration-400"
                      style={{ background: isHov ? 'rgba(5,5,8,0.2)' : 'rgba(5,5,8,0.55)' }}
                    />

                    {/* Content */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      <span
                        className="self-start px-3 py-1 mb-3 text-xs font-semibold rounded-full"
                        style={{
                          background: `${TAG_COLORS[proj.tag]}20`,
                          border: `1px solid ${TAG_COLORS[proj.tag]}50`,
                          color: TAG_COLORS[proj.tag],
                        }}
                      >
                        {proj.tag}
                      </span>
                      <h3 className="text-xl font-bold text-space-text mb-1">{proj.title}</h3>
                      <p
                        className="text-sm text-space-text-secondary transition-all duration-300"
                        style={{ opacity: isHov ? 1 : 0.6, transform: isHov ? 'translateY(0)' : 'translateY(4px)' }}
                      >
                        {proj.description}
                      </p>
                      {isActive && (
                        <button className="mt-4 self-start flex items-center gap-2 text-xs text-space-accent hover:gap-3 transition-all duration-200">
                          <ExternalLink className="w-3.5 h-3.5" />
                          Ver proyecto
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-8 mt-10">
            <button
              onClick={() => go(-1)}
              className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-space-text-secondary hover:border-space-accent hover:text-space-accent transition-all duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2.5">
              {projects.map((_, i) => (
                <button
                  key={i} onClick={() => setActive(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === active ? 24 : 8,
                    height: 8,
                    background: i === active ? '#6C63FF' : 'rgba(255,255,255,0.2)',
                    boxShadow: i === active ? '0 0 10px rgba(108,99,255,0.6)' : 'none',
                  }}
                />
              ))}
            </div>

            <button
              onClick={() => go(1)}
              className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-space-text-secondary hover:border-space-accent hover:text-space-accent transition-all duration-200"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
