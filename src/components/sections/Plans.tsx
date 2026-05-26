import { useEffect, useRef } from 'react';
import { Check, Star } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useInView } from '@/hooks/useInView';
import TypewriterText from '@/components/effects/TypewriterText';
import HolographicCard from '@/components/effects/HolographicCard';

gsap.registerPlugin(ScrollTrigger);

const plans = [
  {
    name: 'Orbita Baja',
    subtitle: 'Landing Page',
    price: 'Desde $350.000 ARS',
    features: [
      'Diseño de una página',
      'Hasta 5 secciones',
      'Responsive design',
      'Formulario de contacto',
      'Optimización básica SEO',
    ],
    highlighted: false,
    cta: 'CONSULTAR',
  },
  {
    name: 'Orbita Media',
    subtitle: 'Sitio Web',
    price: 'Desde $550.000 ARS',
    features: [
      'Hasta 5 páginas',
      'CMS integrado',
      'Blog / Noticias',
      'Galerías y multimedia',
      'SEO avanzado',
      'Analytics integrado',
    ],
    highlighted: true,
    cta: 'CONSULTAR',
    badge: 'RECOMENDADO',
  },
  {
    name: 'Orbita Alta',
    subtitle: 'E-commerce',
    price: 'Desde $900.000 ARS',
    features: [
      'Todo lo del plan Sitio Web',
      'Catálogo de productos',
      'Carrito de compras',
      'Pasarela de pagos',
      'Gestión de inventario',
      'Panel de administración',
    ],
    highlighted: false,
    cta: 'CONSULTAR',
  },
];

export default function Plans() {
  const { ref: sectionRef, isInView } = useInView({ threshold: 0.1 });
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isInView || !cardsRef.current) return;

    const cards = cardsRef.current.querySelectorAll('.plan-card');

    gsap.fromTo(
      cards,
      { y: 60, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: {
          each: 0.2,
          from: 'center',
        },
        ease: 'back.out(1.4)',
      }
    );
  }, [isInView]);

  const scrollToContact = () => {
    document.querySelector('#contacto')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="planes"
      ref={sectionRef}
      className="relative min-h-screen py-32 px-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold font-display tracking-wider text-space-text mb-6">
            <TypewriterText text="PLANES" isInView={isInView} speed={60} />
          </h2>
          <p
            className={`text-lg text-space-text-secondary max-w-2xl mx-auto transition-all duration-1000 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Elige tu nivel de presencia en el universo digital
          </p>
        </div>

        {/* Plans Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center"
        >
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`plan-card opacity-0 ${
                plan.highlighted ? 'md:scale-105 md:z-10' : ''
              }`}
            >
              <HolographicCard className="h-full">
                <div
                  className={`relative rounded-2xl p-8 md:p-10 h-full flex flex-col ${
                    plan.highlighted
                      ? 'bg-gradient-to-b from-space-accent/10 to-space-bg-tertiary/80 border-2 border-space-accent shadow-glow-lg'
                      : 'glass border border-white/5'
                  }`}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div className="absolute -top-3 right-6">
                      <span className="flex items-center gap-1 px-3 py-1 bg-space-accent text-white text-xs font-medium rounded-full">
                        <Star className="w-3 h-3" />
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  {/* Plan name */}
                  <div className="mb-6">
                    <h3 className="text-sm text-space-accent tracking-wider uppercase mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-xl font-bold text-space-text">
                      {plan.subtitle}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="mb-8">
                    <span className="text-2xl md:text-3xl font-bold text-space-text">
                      {plan.price}
                    </span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8 flex-grow">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm text-space-text-secondary"
                      >
                        <Check className="w-4 h-4 text-space-accent mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    onClick={scrollToContact}
                    className={`w-full py-3 px-6 rounded-full text-sm font-medium tracking-wider transition-all duration-300 ${
                      plan.highlighted
                        ? 'bg-space-accent text-white hover:bg-space-accent/90 hover:shadow-glow'
                        : 'border border-space-accent text-space-text hover:bg-space-accent/10'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </HolographicCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
