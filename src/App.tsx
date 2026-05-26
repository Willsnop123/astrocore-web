import { Suspense, lazy } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import Services from '@/components/sections/Services';
import Process from '@/components/sections/Process';
import Plans from '@/components/sections/Plans';
import Portfolio from '@/components/sections/Portfolio';
import Technologies from '@/components/sections/Technologies';
import Contact from '@/components/sections/Contact';
import CustomCursor from '@/components/effects/CustomCursor';
import SupernovaEffect from '@/components/effects/SupernovaEffect';
import WhatsAppButton from '@/components/ui/WhatsAppButton';

const NebulaBackground = lazy(() => import('@/components/effects/NebulaBackground'));

function LoadingFallback() {
  return (
    <div className="fixed inset-0 z-0 bg-space-bg">
      <div className="absolute inset-0 bg-gradient-to-br from-space-bg via-space-bg-secondary to-space-bg" />
    </div>
  );
}

export default function App() {
  return (
    <div className="relative min-h-screen bg-space-bg text-space-text font-body overflow-x-hidden">
      {/* Custom cursor */}
      <CustomCursor />

      {/* Random supernova flashes in the background */}
      <SupernovaEffect />

      {/* WebGL Nebula Background */}
      <Suspense fallback={<LoadingFallback />}>
        <NebulaBackground />
      </Suspense>

      {/* Content */}
      <div className="relative z-10">
        <Header />

        <main>
          <Hero />
          <Services />
          <Process />
          <Plans />
          <Portfolio />
          <Technologies />
          <Contact />
        </main>

        <Footer />
      </div>

      {/* Floating WhatsApp button */}
      <WhatsAppButton />
    </div>
  );
}
