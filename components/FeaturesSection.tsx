'use client';

/**
 * 🌟 FEATURES SECTION - Bento Grid cu imagini și efecte vizuale
 *
 * Layout: 1 card mare stânga + 2 carduri mici stivuite dreapta
 * Imagini Unsplash, hover scale, fade-in staggered la scroll
 */

import { useEffect, useRef } from 'react';

const cards = [
  {
    title: 'Cafea de Specialitate',
    description:
      'Boabe selectate din cele mai renumite regiuni ale lumii, prăjite artizanal în București. Fiecare ceașcă e rezultatul unei obsesii pentru calitate — de la fermă, până la tine.',
    badge: 'Specialty Grade',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop',
    emoji: '☕',
  },
  {
    title: 'Patiserie Artizanală',
    description:
      'Croissante și tarte preparate zilnic de patiseri locali. Ingrediente naturale, rețete tradiționale cu un twist modern.',
    badge: null,
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop',
    emoji: '🥐',
  },
  {
    title: 'Ambient Relaxant',
    description:
      'Lumină caldă, muzică selectată, WiFi rapid. Locul perfect pentru muncă sau o pauză bine meritată.',
    badge: null,
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop',
    emoji: '🌿',
  },
];

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardEls = sectionRef.current?.querySelectorAll('.feature-card');
            cardEls?.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add('feature-card--visible');
              }, index * 200);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" className="py-20 px-6 bg-gray-50" ref={sectionRef}>
      <div className="max-w-6xl mx-auto">

        {/* TITLU SECȚIUNE */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            De ce Vibe Coffee?
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Experiență unică, ingrediente premium, atmosferă perfectă
          </p>
        </div>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* CARD MARE — STÂNGA */}
          <div className="feature-card group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl flex flex-col h-full">
            <div className="h-[55%] overflow-hidden">
              <img
                src={cards[0].image}
                alt={cards[0].title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
            <div className="h-[45%] p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{cards[0].title}</h3>
                <p className="text-gray-500 leading-relaxed">{cards[0].description}</p>
              </div>
              <span className="inline-block px-4 py-2 bg-amber-50 text-amber-700 text-sm font-medium rounded-full w-fit">
                {cards[0].badge}
              </span>
            </div>
          </div>

          {/* COLOANA DREAPTA — 2 carduri mici */}
          <div className="flex flex-col gap-6">

            {/* CARD MIC SUS */}
            <div className="feature-card group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl flex flex-col flex-1">
              <div className="h-[45%] overflow-hidden">
                <img
                  src={cards[1].image}
                  alt={cards[1].title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
              <div className="p-6 flex flex-col justify-center flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{cards[1].title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{cards[1].description}</p>
              </div>
            </div>

            {/* CARD MIC JOS */}
            <div className="feature-card group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl flex flex-col flex-1">
              <div className="h-[45%] overflow-hidden">
                <img
                  src={cards[2].image}
                  alt={cards[2].title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
              <div className="p-6 flex flex-col justify-center flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{cards[2].title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{cards[2].description}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
