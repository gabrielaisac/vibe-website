'use client';

/**
 * 📖 ABOUT SECTION - Povestea cafenelei
 *
 * Layout: imagine stânga + text dreapta (desktop), stivuit pe mobile
 * Fade-in la scroll via IntersectionObserver
 */

import { useEffect, useRef } from 'react';

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            sectionRef.current?.classList.add('about-visible');
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 px-6 bg-white">
      <div
        ref={sectionRef}
        className="about-section max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
      >
        {/* IMAGINE */}
        <div className="about-image rounded-3xl overflow-hidden shadow-lg aspect-[4/3]">
          <img
            src="/about-cafe.webp"
            alt="Vibe Coffee — terasa noastră"
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>

        {/* TEXT */}
        <div className="about-text">
          <span className="inline-block px-4 py-1.5 bg-amber-50 text-amber-700 text-sm font-medium rounded-full mb-6">
            Povestea noastră
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            O cafea bună<br />schimbă ziua
          </h2>
          <p className="text-gray-600 leading-relaxed mb-5">
            Vibe Coffee s-a născut din dorința de a aduce specialty coffee în inima Moldovei.
            Ne-am așezat în Gara Piatra Neamț — un loc cu istorie, unde oamenii trec, se opresc
            și își iau un moment doar al lor. Cu o singură mașină de espresso și multă pasiune,
            am transformat peronul într-un loc unde cafeaua chiar contează.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Fiecare preparat e făcut la comandă, cu boabe selectate din origini unice și
            tehnici moderne de extracție. Fie că ești în trecere sau îți faci din noi un obicei,
            la Vibe găsești mereu o cafea bună și un zâmbet sincer.
            Gara e punctul de plecare — cafeaua e motivul să rămâi.
          </p>

          <div className="mt-8 flex gap-8">
            <div>
              <p className="text-3xl font-bold text-amber-600">2020</p>
              <p className="text-sm text-gray-500 mt-1">Anul fondării</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-amber-600">12+</p>
              <p className="text-sm text-gray-500 mt-1">Origini de cafea</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-amber-600">4.9★</p>
              <p className="text-sm text-gray-500 mt-1">Rating Google</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
