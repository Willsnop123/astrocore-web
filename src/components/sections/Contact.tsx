import { useState, useEffect, useRef } from 'react';
import { Mail, Globe, Clock, Send, CheckCircle, Loader2, MessageCircle } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useInView } from '@/hooks/useInView';
import TypewriterText from '@/components/effects/TypewriterText';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const { ref: sectionRef, isInView } = useInView({ threshold: 0.15 });
  const formRef = useRef<HTMLFormElement>(null);
  const [formState, setFormState] = useState<'idle' | 'sending' | 'sent'>('idle');

  useEffect(() => {
    if (!isInView || !formRef.current) return;

    const fields = formRef.current.querySelectorAll('.form-field');

    gsap.fromTo(
      fields,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
      }
    );
  }, [isInView]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('sending');
    // Simulate sending
    setTimeout(() => {
      setFormState('sent');
      setTimeout(() => setFormState('idle'), 3000);
    }, 2000);
  };

  return (
    <section
      id="contacto"
      ref={sectionRef}
      className="relative min-h-[80vh] py-32 px-6"
    >
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold font-display tracking-wider text-space-text mb-6">
            <TypewriterText text="HABLEMOS" isInView={isInView} speed={60} />
          </h2>
          <p
            className={`text-lg text-space-text-secondary max-w-2xl mx-auto transition-all duration-1000 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Inicia tu viaje espacial. Cuentanos sobre tu proyecto y te responderemos en orbita.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column - Info */}
          <div
            className={`space-y-8 transition-all duration-1000 delay-200 ${
              isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-space-accent/10 border border-space-accent/20 flex items-center justify-center group-hover:bg-space-accent/20 transition-colors">
                <Mail className="w-5 h-5 text-space-accent" />
              </div>
              <div>
                <p className="text-sm text-space-text-muted">Email</p>
                <a
                  href="mailto:info@AstroCore.com.ar"
                  className="text-space-text hover:text-space-accent transition-colors"
                >
                  info@AstroCore.com.ar
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-space-accent/10 border border-space-accent/20 flex items-center justify-center group-hover:bg-space-accent/20 transition-colors">
                <MessageCircle className="w-5 h-5 text-space-accent" />
              </div>
              <div>
                <p className="text-sm text-space-text-muted">WhatsApp</p>
                <a
                  href="https://wa.me/5493444569948"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-space-text hover:text-space-accent transition-colors"
                >
                  +54 9 3444 569948
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-space-accent/10 border border-space-accent/20 flex items-center justify-center group-hover:bg-space-accent/20 transition-colors">
                <Globe className="w-5 h-5 text-space-accent" />
              </div>
              <div>
                <p className="text-sm text-space-text-muted">Ubicación</p>
                <p className="text-space-text">Gualeguay, Entre Ríos, Argentina</p>
              </div>
            </div>

            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-space-accent/10 border border-space-accent/20 flex items-center justify-center group-hover:bg-space-accent/20 transition-colors">
                <Clock className="w-5 h-5 text-space-accent" />
              </div>
              <div>
                <p className="text-sm text-space-text-muted">Horario</p>
                <p className="text-space-text">Lun-Vie, 8:00-12:00 / 16:00-20:00 ART</p>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5">
              <p className="text-space-text-muted italic text-sm">
                "Cada gran viaje comienza con una transmision."
              </p>
            </div>
          </div>

          {/* Right Column - Form */}
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div className="form-field opacity-0">
              <input
                type="text"
                placeholder="Nombre"
                required
                className="w-full bg-transparent border-b border-space-text-muted focus:border-space-accent py-3 text-space-text placeholder:text-space-text-muted outline-none transition-colors"
              />
            </div>

            <div className="form-field opacity-0">
              <input
                type="email"
                placeholder="Email"
                required
                className="w-full bg-transparent border-b border-space-text-muted focus:border-space-accent py-3 text-space-text placeholder:text-space-text-muted outline-none transition-colors"
              />
            </div>

            <div className="form-field opacity-0">
              <select
                required
                defaultValue=""
                className="w-full bg-transparent border-b border-space-text-muted focus:border-space-accent py-3 text-space-text outline-none transition-colors appearance-none cursor-pointer"
              >
                <option value="" disabled className="bg-space-bg-tertiary">
                  Tipo de proyecto
                </option>
                <option value="landing" className="bg-space-bg-tertiary">
                  Landing Page
                </option>
                <option value="sitio" className="bg-space-bg-tertiary">
                  Sitio Web
                </option>
                <option value="ecommerce" className="bg-space-bg-tertiary">
                  E-commerce
                </option>
                <option value="otro" className="bg-space-bg-tertiary">
                  Otro
                </option>
              </select>
            </div>

            <div className="form-field opacity-0">
              <textarea
                placeholder="Mensaje"
                rows={4}
                required
                className="w-full bg-transparent border-b border-space-text-muted focus:border-space-accent py-3 text-space-text placeholder:text-space-text-muted outline-none transition-colors resize-none"
              />
            </div>

            <div className="form-field opacity-0 pt-4">
              <button
                type="submit"
                disabled={formState !== 'idle'}
                className={`w-full py-4 px-6 rounded-full font-medium tracking-wider transition-all duration-500 flex items-center justify-center gap-2 ${
                  formState === 'sent'
                    ? 'bg-space-success text-space-bg'
                    : 'bg-space-accent text-white hover:bg-space-accent/90 hover:shadow-glow'
                } ${formState === 'sending' ? 'opacity-70' : ''}`}
              >
                {formState === 'idle' && (
                  <>
                    <Send className="w-4 h-4" />
                    ENVIAR MENSAJE
                  </>
                )}
                {formState === 'sending' && (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    TRANSMITIENDO...
                  </>
                )}
                {formState === 'sent' && (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    MENSAJE ENVIADO
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
