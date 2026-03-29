'use client';

/**
 * 🎯 HERO STARTER - Versiunea simplă pentru cursanți
 *
 * Aceasta este versiunea MINIMALISTĂ de la care plecăm în curs.
 * Fără animații, fără video, fără JavaScript complex.
 * Doar HTML + Tailwind CSS = fundația de bază.
 */

const scrollWithOffset = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top, behavior: 'smooth' });
};

export default function HeroStarter() {
  return (
    <section className="relative min-h-screen flex items-center justify-center">
      {/* VIDEO FUNDAL */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="https://assets.mixkit.co/videos/810/810-1080.mp4" type="video/mp4" />
      </video>

      {/* OVERLAY SEMI-TRANSPARENT */}
      <div className="absolute inset-0 bg-black/50" />

      {/* INDICATOR SCROLL */}
      <div
        className="animate-fade-in-up absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        style={{ animationDelay: '1.5s' }}
      >
      <button
        onClick={() => scrollWithOffset('features')}
        className="text-white/75 hover:text-white transition-colors duration-300 animate-bounce"
        aria-label="Scroll în jos"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      </div>

      {/* CONTINUT */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
        {/* TITLU PRINCIPAL */}
        <h1
          className="animate-fade-in-up text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:whitespace-nowrap text-[#FFD700]"
          style={{
            textShadow: '0 2px 16px rgba(0,0,0,0.9), 0 0 40px rgba(255,215,0,0.7)',
            animationDelay: '0.5s',
          }}
        >
          Pentru cei care știu diferența
        </h1>

        {/* SUBTITLU */}
        <p
          className="animate-fade-in-up text-base md:text-lg lg:text-xl mb-8 text-[#FFC840] tracking-wide"
          style={{
            textShadow: '0 1px 8px rgba(0,0,0,0.9), 0 0 20px rgba(255,200,64,0.6)',
            animationDelay: '0.8s',
          }}
        >
          Nu orice cafea. Cafeaua ta. La Vibe.
        </p>

        {/* BUTOANE CTA */}
        <div
          className="animate-fade-in-up flex flex-col sm:flex-row gap-4 justify-center items-center"
          style={{ animationDelay: '1.1s' }}
        >
          <button
            onClick={() => scrollWithOffset('meniu')}
            className="px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg"
          >
            Vezi Meniul
          </button>
          <a
            href="https://maps.google.com/?q=Gara+Piatra+Neamt"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-white/10 shadow-lg"
          >
            Vizitează-ne
          </a>
        </div>
      </div>
    </section>
  );
}

