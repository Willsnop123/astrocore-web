import { useState, useEffect, useRef } from 'react';
import { Mail, Globe, Clock, Send, CheckCircle, Loader2, MessageCircle, ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useInView } from '@/hooks/useInView';
import RevealText from '@/components/effects/RevealText';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const { ref: sectionRef, isInView } = useInView({ threshold: 0.15 });
  const formRef = useRef<HTMLFormElement>(null);
  const [formState, setFormState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [selectedProject, setSelectedProject] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const projectOptions = [
    { value: 'landing', label: 'Landing Page' },
    { value: 'sitio', label: 'Sitio Web' },
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'otro', label: 'Otro' },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isInView || !formRef.current) return;

    const fields = formRef.current.querySelectorAll('.form-field');

    gsap.fromTo(
      fields,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.15,
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
            <RevealText text="HABLEMOS" />
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

            <div className="form-field opacity-0" ref={dropdownRef} style={{ position: 'relative', zIndex: 30 }}>
              <input type="hidden" name="proyecto" value={selectedProject} required />
              <button
                type="button"
                onClick={() => setDropdownOpen(o => !o)}
                className={`w-full flex items-center justify-between border-b py-3 outline-none transition-colors duration-200 ${
                  dropdownOpen ? 'border-space-accent' : 'border-space-text-muted'
                }`}
              >
                <span className={selectedProject ? 'text-space-text' : 'text-space-text-muted'}>
                  {selectedProject
                    ? projectOptions.find(o => o.value === selectedProject)?.label
                    : 'Tipo de proyecto'}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-space-text-muted transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {dropdownOpen && (
                <div className="relative z-50">
                  <div
                    className="absolute top-1 left-0 right-0 rounded-xl overflow-hidden"
                    style={{
                      background: 'rgba(10,10,18,0.95)',
                      border: '1px solid rgba(108,99,255,0.25)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(108,99,255,0.08)',
                      backdropFilter: 'blur(12px)',
                    }}
                  >
                    {projectOptions.map((option, i) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => { setSelectedProject(option.value); setDropdownOpen(false); }}
                        className="w-full text-left px-5 py-3 text-sm transition-all duration-150 group flex items-center gap-3"
                        style={{
                          borderBottom: i < projectOptions.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                          color: selectedProject === option.value ? '#6C63FF' : 'rgba(240,240,245,0.7)',
                          background: selectedProject === option.value ? 'rgba(108,99,255,0.08)' : 'transparent',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(108,99,255,0.12)')}
                        onMouseLeave={e => (e.currentTarget.style.background = selectedProject === option.value ? 'rgba(108,99,255,0.08)' : 'transparent')}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: selectedProject === option.value ? '#6C63FF' : 'rgba(255,255,255,0.2)' }}
                        />
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
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

