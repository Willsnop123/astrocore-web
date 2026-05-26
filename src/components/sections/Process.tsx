import { useEffect, useRef } from 'react';
import { Telescope, Sparkles, Code2, Rocket } from 'lucide-react';
import gsap from 'gsap';
import { useInView } from '@/hooks/useInView';
import TypewriterText from '@/components/effects/TypewriterText';

const steps = [
  { number: '01', title: 'Descubrimiento',  description: 'Analizamos tu negocio, objetivos y audiencia para entender tu universo digital.', icon: Telescope, color: '#6C63FF', moonDur: '6s' },
  { number: '02', title: 'Diseño',           description: 'Creamos prototipos visuales y experiencias de usuario que conectan con tu marca.',   icon: Sparkles,  color: '#FF6B9D', moonDur: '8s' },
  { number: '03', title: 'Desarrollo',       description: 'Transformamos el diseño en código. Cada línea es una estrella en tu galaxia digital.', icon: Code2,     color: '#4A90FF', moonDur: '5s' },
  { number: '04', title: 'Lanzamiento',      description: 'Despegamos tu sitio al universo digital con optimización y monitoreo continuo.',      icon: Rocket,    color: '#38E8B0', moonDur: '7s' },
];

function Planet({ color, size = 52, moonDur = '7s', icon: Icon }: {
  color: string; size?: number; moonDur?: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}) {
  return (
    <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: size * 2.4, height: size * 2.4 }}>
      {/* Orbit ring visual */}
      <div
        className="absolute rounded-full"
        style={{
          width: size * 2.2, height: size * 2.2,
          border: `1px dashed ${color}30`,
        }}
      />
      {/* Planet body */}
      <div
        className="relative z-10 rounded-full flex items-center justify-center"
        style={{
          width: size, height: size,
          background: `radial-gradient(circle at 35% 30%, ${color}55, ${color}18)`,
          border: `1.5px solid ${color}60`,
          boxShadow: `0 0 18px ${color}35, 0 0 40px ${color}15, inset 0 0 12px ${color}15`,
        }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      {/* Moon orbiting */}
      <div
        className="absolute"
        style={{
          width: size * 2.2, height: size * 2.2,
          animation: `orbit-cw ${moonDur} linear infinite`,
        }}
      >
        <div
          className="absolute rounded-full"
          style={{
            width: 8, height: 8,
            top: 0, left: '50%',
            transform: 'translate(-50%, -50%)',
            background: color,
            boxShadow: `0 0 8px ${color}, 0 0 16px ${color}80`,
          }}
        />
      </div>
    </div>
  );
}

export default function Process() {
  const { ref: sectionRef, isInView } = useInView({ threshold: 0.12 });
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isInView || !timelineRef.current) return;
    if (lineRef.current) {
      gsap.fromTo(lineRef.current, { scaleY: 0 }, { scaleY: 1, duration: 1.8, ease: 'power2.out', transformOrigin: 'top' });
    }
    const items = timelineRef.current.querySelectorAll('.process-step');
    items.forEach((item, i) => {
      gsap.fromTo(item.querySelector('.planet-wrap'),
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.7, delay: i * 0.35, ease: 'back.out(1.5)' }
      );
      gsap.fromTo(item.querySelector('.step-content'),
        { x: i % 2 === 0 ? 50 : -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, delay: i * 0.35 + 0.2, ease: 'power3.out' }
      );
    });
  }, [isInView]);

  return (
    <>
      <style>{`
        @keyframes orbit-cw  { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <section id="proceso" ref={sectionRef} className="relative min-h-[80vh] py-32 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-space-bg via-space-bg-secondary to-space-bg pointer-events-none" />

        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold font-display tracking-wider text-space-text mb-4">
              <TypewriterText text="PROCESO DE TRABAJO" isInView={isInView} speed={50} />
            </h2>
            <p className={`text-space-text-secondary transition-all duration-700 ${isInView ? 'opacity-100' : 'opacity-0'}`}>
              Cada misión sigue una trayectoria probada
            </p>
          </div>

          <div ref={timelineRef} className="relative">
            {/* Vertical orbit path */}
            <div
              ref={lineRef}
              className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
              style={{
                background: 'linear-gradient(to bottom, rgba(108,99,255,0.6) 0%, rgba(74,144,255,0.4) 50%, transparent 100%)',
                transformOrigin: 'top',
              }}
            />

            <div className="space-y-20">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className={`process-step relative flex items-center gap-0 ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  {/* Planet centered on the line */}
                  <div className="planet-wrap absolute left-1/2 -translate-x-1/2 z-10 opacity-0">
                    <Planet color={step.color} moonDur={step.moonDur} icon={step.icon} />
                  </div>

                  {/* Content card — alternating sides */}
                  <div
                    className={`step-content opacity-0 w-5/12 ${
                      index % 2 === 0 ? 'pr-24 text-right' : 'pl-24 ml-auto text-left'
                    }`}
                  >
                    <div className="glass rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-colors duration-300">
                      <div className={`flex items-center gap-2 mb-3 ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-xs tracking-[0.2em] font-mono" style={{ color: step.color }}>
                          {step.number}
                        </span>
                        <span className="text-xs text-space-text-muted">—</span>
                        <span className="text-xs tracking-widest text-space-text-muted uppercase">FASE</span>
                      </div>
                      <h3 className="text-xl font-bold text-space-text mb-2">{step.title}</h3>
                      <p className="text-sm text-space-text-secondary leading-relaxed">{step.description}</p>
                    </div>
                  </div>

                  {/* Spacer for the other side */}
                  <div className="w-5/12" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
